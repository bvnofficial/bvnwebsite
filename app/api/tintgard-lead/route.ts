import { NextRequest, NextResponse } from "next/server";

/**
 * TintGard demo lead capture → GoHighLevel.
 *
 * The demo booking form (public/clients/tintgard/website) posts here. This
 * route runs server-side so the GHL token never touches the browser. It
 * upserts the contact (deduped by phone/email), tags it, sets Customer Type
 * + the type-specific detail field, then opens an opportunity in the pipeline
 * that matches the chosen service — Automotive / Commercial / Residential.
 *
 * Requires env var GHL_TINTGARD_TOKEN (a GHL Private Integration token with
 * contacts.write + opportunities.write). Location is not secret so it defaults
 * to the known id but can be overridden with GHL_TINTGARD_LOCATION.
 */

const GHL = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";
const LOCATION_ID = process.env.GHL_TINTGARD_LOCATION || "21QeKX429DL5Q6j4yeG6";

// SINGLE_OPTIONS field — value must be one of these exactly.
type Service = "Automotive" | "Commercial" | "Residential";

// Pipeline + first-stage ("New Lead") ids, and the detail custom field that
// fits each service. Discovered from the live account.
const ROUTES: Record<Service, { pipelineId: string; stageId: string; detailFieldId: string }> = {
  Automotive:  { pipelineId: "KkRsXLBUSEggn9ihNNH7", stageId: "3586d029-cff2-4268-b1c3-207c63c72c98", detailFieldId: "r6N2UnjrFNt6pFSyDJru" }, // Vehicle Make/Model
  Commercial:  { pipelineId: "puyFZs9RRoa088JfWEza", stageId: "299df459-4ddd-4d82-a8ff-a4dbaa23fb97", detailFieldId: "D3c3x3FzpQXN986mBeKU" }, // Business Type
  Residential: { pipelineId: "pSbFpYZDPLM2qFPTMptQ", stageId: "6e4df9d9-ddf9-42bb-b5ce-e689e2000f28", detailFieldId: "fczVbjOUB5JNW5CHt4rc" }, // Property Type
};

const CUSTOMER_TYPE_FIELD = "VQCB6DLwIirwXFM9EWN9"; // Customer Type (SINGLE_OPTIONS)
const SUBURB_FIELD = "darWwxU0RqYkhZ9TZcOl";

const TAGS: Record<Service, string> = {
  Automotive: "lead-automotive",
  Commercial: "lead-commercial",
  Residential: "lead-residential",
};

// Instant-response emails (approved copy, M2-M3 content draft). Sent via GHL so
// they land as real email AND log in the contact's conversation timeline.
const EMAILS: Record<Service, { subject: string; intro: string; bulletsIntro: string; bullets: string[]; outro: string }> = {
  Automotive: {
    subject: "Your TintGard quote is on its way",
    intro: "Thanks for getting in touch. TintGard has been tinting cars across Brisbane since 1999, and we'll have a proper quote to you shortly based on your vehicle and the film you're after.",
    bulletsIntro: "A few options to know about while you wait:",
    bullets: [
      "<b>X FACTOR</b> — budget-friendly, still blocks harmful UV",
      "<b>FUSION</b> — signal-friendly, won't interfere with your phone, GPS or toll tag",
      "<b>COOLSHADES</b> — our best UV and heat performance",
      "<b>NIGHT RIDER</b> — the darkest legal tint available, in three legal levels",
    ],
    outro: "Full vehicle tinting starts from $295. If you're not near Augustine Heights, we also run a Brisbane-wide mobile service for an extra $50.",
  },
  Commercial: {
    subject: "TintGard — free site visit for your window tinting quote",
    intro: "Thanks for reaching out. TintGard has been fitting out offices and shopfronts across Brisbane since 1999, WFAANZ certified, and known for turning quotes into installs fast, usually within 3 days of a site visit.",
    bulletsIntro: "Beyond standard solar control film, we also do:",
    bullets: [
      "Whiteboard films",
      "Protective films",
      "Decorative films",
      "Frosting films (great for meeting rooms and privacy)",
    ],
    outro: "Solar films can block up to 80% of heat and 99% of UV, which usually shows up directly in your air-con costs. We'll get exact numbers to you after a quick site visit.",
  },
  Residential: {
    subject: "Your TintGard home tinting quote",
    intro: "Thanks for getting in touch. We've been keeping Brisbane homes cooler and more private since 1999, blocking over 99% of UV while still letting natural light in.",
    bulletsIntro: "A few things homeowners usually ask about:",
    bullets: [
      "Pricing starts from $399 for an average bedroom, we'll give you an exact number after seeing your windows",
      "We install about 5 window panes an hour, a full home is usually a single day",
      "Films are safe for rental properties too, no damage, fully removable if needed",
      "All backed by warranty against bubbling, peeling, fading and cracking from manufacturing or installation defects",
    ],
    outro: "",
  },
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderEmail(service: Service, first: string) {
  const e = EMAILS[service];
  const bullets = e.bullets.map((b) => `<li style="margin:7px 0">${b}</li>`).join("");
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#0b0d11;color:#eef1f6;border-radius:12px;overflow:hidden">
  <div style="background:#e11d2a;padding:20px 28px"><span style="font-size:22px;font-weight:800;letter-spacing:2px;color:#ffffff">TINTGARD</span></div>
  <div style="padding:28px">
    <p style="margin:0 0 14px">Hi ${esc(first)},</p>
    <p style="margin:0 0 14px;line-height:1.6;color:#c7cdda">${e.intro}</p>
    <p style="margin:0 0 8px;line-height:1.6;color:#c7cdda">${e.bulletsIntro}</p>
    <ul style="margin:0 0 14px;padding-left:20px;color:#c7cdda;line-height:1.6">${bullets}</ul>
    ${e.outro ? `<p style="margin:0 0 18px;line-height:1.6;color:#c7cdda">${e.outro}</p>` : ""}
    <p style="margin:0;color:#c7cdda">Talk soon,<br><b style="color:#ffffff">The TintGard Team</b></p>
  </div>
  <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,.1);font-size:12px;color:#8b93a3">
    TintGard &middot; 8 Success Circuit, Augustine Heights QLD 4300 &middot; 07 3133 1969 &middot; info@tintgard.com.au
  </div>
</div>`;
  return { subject: e.subject, html };
}

// 04xx xxx xxx / 07 xxxx xxxx → +61 E.164 so GHL dedupes and can text.
function normalizeAuPhone(raw: string): string {
  const s = raw.replace(/[^\d+]/g, "");
  if (s.startsWith("+")) return s;
  if (s.startsWith("0")) return "+61" + s.slice(1);
  if (s.startsWith("61")) return "+" + s;
  return s;
}

async function ghl(path: string, token: string, body: unknown) {
  const res = await fetch(GHL + path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Version: VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.GHL_TINTGARD_TOKEN;
    if (!token) {
      // Not configured yet — tell the client to fall back to the demo state.
      console.warn("tintgard-lead: GHL_TINTGARD_TOKEN not set");
      return NextResponse.json({ configured: false }, { status: 503 });
    }

    const body = await req.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const suburb = String(body.suburb || "").trim();
    const detail = String(body.detail || "").trim();
    const message = String(body.message || "").trim();
    const service = body.service as Service;

    // Optional campaign overrides (e.g. the welcome-back reactivation page).
    const source = (typeof body.source === "string" && body.source.trim())
      ? body.source.trim().slice(0, 60)
      : "Website Demo Form";
    const extraTags = Array.isArray(body.tags)
      ? body.tags.filter((t: unknown) => typeof t === "string" && t).map((t: string) => t.slice(0, 40)).slice(0, 8)
      : ["website-demo"];

    if (!name || !phone || !ROUTES[service]) {
      return NextResponse.json({ error: "Missing name, phone, or valid service." }, { status: 400 });
    }

    const [firstName, ...rest] = name.split(/\s+/);
    const lastName = rest.join(" ");
    const route = ROUTES[service];

    const customFields: { id: string; value: string }[] = [
      { id: CUSTOMER_TYPE_FIELD, value: service },
    ];
    if (detail) customFields.push({ id: route.detailFieldId, value: detail });
    if (suburb) customFields.push({ id: SUBURB_FIELD, value: suburb });

    // 1) Upsert the contact (dedupes on phone/email within the location).
    const contactRes = await ghl("/contacts/upsert", token, {
      locationId: LOCATION_ID,
      firstName,
      lastName,
      name,
      email: email || undefined,
      phone: normalizeAuPhone(phone),
      source,
      tags: ["lead-new", TAGS[service], ...extraTags],
      customFields,
    });

    if (!contactRes.ok) {
      console.error("tintgard-lead contact upsert failed:", contactRes.status, contactRes.data);
      return NextResponse.json({ error: "contact", detail: contactRes.data }, { status: 502 });
    }

    const contactId: string | undefined =
      contactRes.data?.contact?.id || contactRes.data?.id;

    // 2) Open an opportunity in the matching pipeline.
    let opportunityId: string | undefined;
    if (contactId) {
      const oppRes = await ghl("/opportunities/", token, {
        pipelineId: route.pipelineId,
        pipelineStageId: route.stageId,
        locationId: LOCATION_ID,
        contactId,
        name: `${name} — ${service}`,
        status: "open",
        source,
      });
      if (oppRes.ok) {
        opportunityId = oppRes.data?.opportunity?.id || oppRes.data?.id;
      } else {
        // Contact still captured — log but don't fail the submission.
        console.error("tintgard-lead opportunity failed:", oppRes.status, oppRes.data);
      }
    }

    // 3) Fire the instant-response email (real send + logged in GHL conversation).
    let emailSent = false;
    if (contactId && email) {
      const { subject, html } = renderEmail(service, firstName || "there");
      const mailRes = await fetch(GHL + "/conversations/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Version: "2021-04-15",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          type: "Email",
          contactId,
          subject,
          html,
          emailFrom: "TintGard <info@tintgard.com.au>",
        }),
      });
      emailSent = mailRes.ok;
      if (!mailRes.ok) {
        console.error("tintgard-lead instant email failed:", mailRes.status, await mailRes.text().catch(() => ""));
      }
    }

    // Note the free-text message where the team will see it.
    if (contactId && message) {
      await ghl(`/contacts/${contactId}/notes`, token, {
        body: `Website enquiry (${service}): ${message}`,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, service, contactId, opportunityId, emailSent });
  } catch (err) {
    console.error("tintgard-lead error:", err);
    return NextResponse.json({ error: "unexpected" }, { status: 500 });
  }
}
