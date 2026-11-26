import { NextRequest, NextResponse } from "next/server";
import { buildEvent, sendEvent } from "@/lib/skinlux-events";

/**
 * Public lead capture for the Skinlux quiz and Skin Check pages.
 * Only creates a "new_lead" event. A hidden "website" field catches bots.
 */
export const dynamic = "force-dynamic";
const SOURCES = new Set(["quiz", "skin-check", "offer-page", "website"]);

export async function POST(req: NextRequest) {
  const out = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return out(400, { ok: false, error: "Bad request" });
  if (b.website) return out(200, { ok: true }); // bot
  const source = String(b.source || "website");
  const built = buildEvent({
    event: "new_lead", clinic: b.clinic, first_name: b.first_name, last_name: b.last_name, email: b.email, phone: b.phone,
    source: SOURCES.has(source) ? source : "website", interest: b.interest, message: b.message, newsletter: b.newsletter === true,
  });
  if (!built.ok) return out(400, built);
  const sent = await sendEvent(built);
  return out(sent.ok ? 200 : sent.status, sent.ok ? { ok: true } : { ok: false, error: "Sorry, that didn't go through. Please call us." });
}
