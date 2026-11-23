import { NextRequest, NextResponse } from "next/server";
import { skinluxStaffReqOk } from "@/lib/skinlux-staff-gate";
import { buildEvent, sendEvent } from "@/lib/skinlux-events";

/**
 * Skinlux event sender: staff app taps, the Timely link and HQ post here.
 * Who may post: a signed in staff or HQ user, or a server with
 * "x-skinlux-key: <SKINLUX_EVENTS_KEY>" (the Timely link).
 * The public quiz and Skin Check use /api/skinlux-lead instead.
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
  if (!keyOk(req) && !(await skinluxStaffReqOk(req))) return out(401, { ok: false, error: "Not signed in" });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return out(400, { ok: false, error: "Bad request" });
  const built = buildEvent(body as Record<string, unknown>);
  if (!built.ok) return out(400, built);
  const sent = await sendEvent(built);
  return out(sent.status, { ...sent, kind: built.kind, clinic: built.clinic });
}
