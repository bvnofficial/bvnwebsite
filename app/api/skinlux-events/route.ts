import { NextRequest, NextResponse } from "next/server";
import { skinluxStaffReqOk } from "@/lib/skinlux-staff-gate";
import { buildEventWithEdits, recordEvent, sendEvent } from "@/lib/skinlux-events";
import { ghl } from "@/lib/skinlux-ghl";

/**
 * Skinlux event sender: staff app taps, the Timely link and HQ post here.
 * Who may post: a signed in staff or HQ user, or a server with
 * "x-skinlux-key: <SKINLUX_EVENTS_KEY>" (the Timely link).
 * The public quiz and Skin Check use /api/skinlux-lead instead.
 *
 * Staff app extra: review_now=true on Treatment done (the client is happy) texts
 * the clinic's Google review link straight away and tags review-asked.
 */
export const dynamic = "force-dynamic";

function keyOk(req: NextRequest): boolean {
  const k = process.env.SKINLUX_EVENTS_KEY, got = req.headers.get("x-skinlux-key") || "";
  if (!k || got.length !== k.length) return false;
  let d = 0;
  for (let i = 0; i < k.length; i++) d |= k.charCodeAt(i) ^ got.charCodeAt(i);
  return d === 0;
}

async function askForReview(clinic: string, contactId: string, first: string): Promise<string> {
  const cv = await ghl(clinic, `/locations/{loc}/customValues`);
  const val = (n: string) => (((cv && cv.customValues) || []) as { name: string; value: string }[]).find((v) => v.name === n)?.value || "";
  const link = val("review_link");
  await ghl(clinic, `/contacts/${contactId}/tags`, { method: "POST", body: { tags: ["review-asked"] } });
  if (!/^https:\/\//.test(link)) return "Review request saved. Add your Google review link in HQ Settings so it can be texted.";
  const name = clinic === "leederville" ? "Leederville" : "Booragoon";
  const text = `Hi ${first}, thanks for coming in to Skinlux ${name} today. If you're happy with your visit, a quick Google review helps us a lot: ${link}`;
  const r = await ghl(clinic, `/conversations/messages`, { method: "POST", body: { type: "SMS", contactId, message: text } });
  if (!r) return "Review request saved. It will text once the clinic has an SMS number.";
  // GoHighLevel accepts first and can fail a moment later (no SMS number yet)
  const id = String(r.messageId || r.id || "");
  if (id) {
    await new Promise((x) => setTimeout(x, 2000));
    const m = await ghl(clinic, `/conversations/messages/${id}`);
    const msg = m && (m.message || m);
    if (msg && String(msg.status) === "failed") return "Review request saved. It will text once the clinic has an SMS number.";
  }
  return "Review request texted.";
}

export async function POST(req: NextRequest) {
  const out = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
  if (!keyOk(req) && !(await skinluxStaffReqOk(req))) return out(401, { ok: false, error: "Not signed in" });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return out(400, { ok: false, error: "Bad request" });
  const built = await buildEventWithEdits(body as Record<string, unknown>);
  if (!built.ok) return out(400, built);
  const contactId = await recordEvent(built).catch(() => null);
  const sent = await sendEvent(built, { skipRecord: true });
  let review = "";
  if ((body as Record<string, unknown>).review_now === true && built.payload.event === "treatment_done" && contactId) {
    review = await askForReview(built.clinic, contactId, String(built.payload.first_name || "")).catch(() => "");
  }
  return out(sent.status, { ...sent, kind: built.kind, clinic: built.clinic, review });
}
