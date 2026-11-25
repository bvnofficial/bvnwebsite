import { NextRequest, NextResponse } from "next/server";
import { buildEvent, sendEvent } from "@/lib/skinlux-events";
import { parseTimelyExpired } from "@/lib/skinlux-timely-email";

/**
 * Timely link, email route. The Apps Script in the clientcare@ mailbox
 * (clients/skinlux-jellie/build/scripts/timely-mail-forwarder.gs) posts each
 * new Timely "Online booking expired due to non-payment" email here.
 *
 * POST JSON { subject, text }, header "x-skinlux-key: <SKINLUX_EVENTS_KEY>".
 * Add "dry": true to only parse and see the event (nothing goes to GoHighLevel).
 */
export const dynamic = "force-dynamic";

function keyOk(req: NextRequest): boolean {
  const k = process.env.SKINLUX_EVENTS_KEY, got = req.headers.get("x-skinlux-key") || "";
  if (!k || got.length !== k.length) return false;
  let d = 0;
  for (let i = 0; i < k.length; i++) d |= k.charCodeAt(i) ^ got.charCodeAt(i);
  return d === 0;
}

export async function POST(req: NextRequest) {
  const out = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
  if (!keyOk(req)) return out(401, { ok: false, error: "Not signed in" });
  const body = (await req.json().catch(() => null)) as { subject?: string; text?: string; dry?: boolean } | null;
  if (!body || typeof body.text !== "string") return out(400, { ok: false, error: "Send { subject, text }" });

  const parsed = parseTimelyExpired(body.text.slice(0, 20000), String(body.subject || "").slice(0, 300));
  if (!parsed.ok) return out(422, parsed);
  const built = buildEvent(parsed.event);
  if (!built.ok) return out(422, built);
  if (body.dry) return out(200, { ok: true, dry: true, kind: built.kind, clinic: built.clinic, payload: built.payload });

  const sent = await sendEvent(built);
  if (!sent.ok) console.error("skinlux-timely-email: send failed", sent.error);
  return out(sent.status, { ...sent, kind: built.kind, clinic: built.clinic });
}
