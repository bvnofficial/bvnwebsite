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
      source: "Website Demo Form",
      tags: ["lead-new", TAGS[service], "website-demo"],
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
        source: "Website Demo Form",
      });
      if (oppRes.ok) {
        opportunityId = oppRes.data?.opportunity?.id || oppRes.data?.id;
      } else {
        // Contact still captured — log but don't fail the submission.
        console.error("tintgard-lead opportunity failed:", oppRes.status, oppRes.data);
      }
    }

    // Note the free-text message where the team will see it.
    if (contactId && message) {
      await ghl(`/contacts/${contactId}/notes`, token, {
        body: `Website enquiry (${service}): ${message}`,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, service, contactId, opportunityId });
  } catch (err) {
    console.error("tintgard-lead error:", err);
    return NextResponse.json({ error: "unexpected" }, { status: 500 });
  }
}
