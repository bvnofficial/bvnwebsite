import { NextRequest, NextResponse } from "next/server";

/**
 * Apex Gates website lead capture → GoHighLevel.
 *
 * The quote forms on the Apex Gates website (public/clients/apex-gates/website)
 * and the 3D gate designer (public/clients/apex-gates/gate-visualiser) post
 * multipart form data here. This route runs server-side so the GHL token never
 * touches the browser. It upserts the contact (deduped by phone/email), uploads
 * any photos (and the designer's picture) to the GHL media library, writes every
 * answer into a contact note, then opens an opportunity at New Lead in the
 * Marketing Pipeline.
 *
 * Requires env var GHL_APEX_TOKEN (a GHL Private Integration token for the Apex
 * Gates sub-account with contacts, opportunities and medias write). Location is
 * not secret so it defaults to the known id but can be overridden with
 * GHL_APEX_LOCATION.
 */

const GHL = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";
const LOCATION_ID = process.env.GHL_APEX_LOCATION || "Q4zLA1JrTSM1POUrQlHl";

// Marketing Pipeline → New Lead. Discovered from the live account.
const PIPELINE_ID = "w68KuY5YYiqrQZnnRChD";
const STAGE_ID = "0dc7776a-0e9d-49f6-bec2-a5b17b3bd386";

const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 3_000_000;

// The pages may later be served from a GHL funnel domain, so allow any origin.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Multiple choice answers from the quote form, in the order the office reads them.
const ANSWERS: [string, string][] = [
  ["property", "Property"],
  ["need", "Needs"],
  ["gate", "Gate"],
  ["leaves", "Single or double"],
  ["power", "Power"],
];

// 04xx xxx xxx / 08 xxxx xxxx → +61 E.164 so GHL dedupes and can text.
function normalizeAuPhone(raw: string): string {
  const s = raw.replace(/[^\d+]/g, "");
  if (s.startsWith("+")) return s;
  if (s.startsWith("0")) return "+61" + s.slice(1);
  if (s.startsWith("61")) return "+" + s;
  return s;
}

function headers(token: string, json = true): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Version: VERSION,
    Accept: "application/json",
    // GHL sits behind Cloudflare, which refuses requests without a user agent.
    "User-Agent": "bvn-apex-gates-website/1.0",
  };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

async function ghl(path: string, token: string, body: unknown) {
  const res = await fetch(GHL + path, { method: "POST", headers: headers(token), body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function uploadPhoto(token: string, file: File, name: string): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file, name);
  fd.append("name", name);
  const res = await fetch(GHL + "/medias/upload-file", { method: "POST", headers: headers(token, false), body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("apex-gates-lead photo upload failed:", res.status, data);
    return null;
  }
  return data?.url || null;
}

const text = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.GHL_APEX_TOKEN;
    if (!token) {
      console.warn("apex-gates-lead: GHL_APEX_TOKEN not set");
      return NextResponse.json({ configured: false }, { status: 503, headers: CORS });
    }

    const fd = await req.formData();

    // Hidden field only bots fill in. Pretend it worked.
    if (text(fd, "company_site")) return NextResponse.json({ success: true }, { headers: CORS });

    const name = text(fd, "name", 120);
    const phone = text(fd, "phone", 40);
    const email = text(fd, "email", 160);
    const suburb = text(fd, "suburb", 120);
    const details = text(fd, "details") || text(fd, "notes");
    const design = text(fd, "design", 4000);
    const designLink = text(fd, "design_link", 4000);
    const page = text(fd, "page", 300);
    const fromDesigner = text(fd, "form", 20) === "designer";

    if (!name || (!phone && !email)) {
      return NextResponse.json({ error: "Missing name, or a phone or email." }, { status: 400, headers: CORS });
    }

    const source = fromDesigner ? "Website 3D gate designer" : "Website quote form";
    const tags = ["website-lead", fromDesigner ? "website-3d-designer" : "website-quote"];
    const [firstName, ...rest] = name.split(/\s+/);

    // 1) Upsert the contact (dedupes on phone/email within the location).
    const contactRes = await ghl("/contacts/upsert", token, {
      locationId: LOCATION_ID,
      firstName,
      lastName: rest.join(" "),
      name,
      email: email || undefined,
      phone: phone ? normalizeAuPhone(phone) : undefined,
      city: suburb || undefined,
      source,
      tags,
    });
    if (!contactRes.ok) {
      console.error("apex-gates-lead contact upsert failed:", contactRes.status, contactRes.data);
      return NextResponse.json({ error: "contact" }, { status: 502, headers: CORS });
    }
    const contactId: string | undefined = contactRes.data?.contact?.id || contactRes.data?.id;

    // 2) Photos the customer attached, plus the designer's picture of their gate.
    const stamp = Date.now();
    const files = [...fd.getAll("snapshot"), ...fd.getAll("photos")]
      .filter((f): f is File => typeof f === "object" && f !== null && "arrayBuffer" in f && f.size > 0)
      .filter((f) => f.size <= MAX_PHOTO_BYTES && /^image\//.test(f.type))
      .slice(0, MAX_PHOTOS);
    const photoUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadPhoto(token, files[i], `apex-website-${firstName || "lead"}-${stamp}-${i + 1}.jpg`.toLowerCase().replace(/[^a-z0-9.-]+/g, "-"));
      if (url) photoUrls.push(url);
    }

    // 3) Everything they told us, in one note the office can read top to bottom.
    const lines: string[] = [`${source} enquiry`];
    for (const [k, label] of ANSWERS) {
      const v = text(fd, k, 200);
      if (v) lines.push(`${label}: ${v}`);
    }
    if (suburb) lines.push(`Site suburb: ${suburb}`);
    if (design) lines.push("", "Their design:", design);
    if (designLink) lines.push("", `Open their design in 3D: ${designLink}`);
    if (details) lines.push("", `Notes from the customer: ${details}`);
    if (photoUrls.length) lines.push("", fromDesigner ? "Picture and photos:" : "Photos:", ...photoUrls);
    if (files.length > photoUrls.length) lines.push("", `${files.length - photoUrls.length} photo(s) could not be uploaded.`);
    if (page) lines.push("", `Sent from: ${page}`);

    if (contactId) {
      const noteRes = await ghl(`/contacts/${contactId}/notes`, token, { body: lines.join("\n") });
      if (!noteRes.ok) console.error("apex-gates-lead note failed:", noteRes.status, noteRes.data);
    }

    // 4) Open an opportunity at New Lead in the Marketing Pipeline.
    let opportunityId: string | undefined;
    if (contactId) {
      const what = fromDesigner ? "3D gate design" : text(fd, "need", 80) || "Quote request";
      const oppRes = await ghl("/opportunities/", token, {
        pipelineId: PIPELINE_ID,
        pipelineStageId: STAGE_ID,
        locationId: LOCATION_ID,
        contactId,
        name: `${name}, ${what}${suburb ? `, ${suburb}` : ""}`,
        status: "open",
        source,
      });
      if (oppRes.ok) {
        opportunityId = oppRes.data?.opportunity?.id || oppRes.data?.id;
      } else {
        // Contact and note are captured; log but don't fail the submission.
        console.error("apex-gates-lead opportunity failed:", oppRes.status, oppRes.data);
      }
    }

    return NextResponse.json({ success: true, contactId, opportunityId, photos: photoUrls.length }, { headers: CORS });
  } catch (err) {
    console.error("apex-gates-lead error:", err);
    return NextResponse.json({ error: "unexpected" }, { status: 500, headers: CORS });
  }
}
