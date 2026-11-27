import { accountOf } from "@/lib/skinlux-ghl";
import { NextRequest, NextResponse } from "next/server";
import { skinluxHqReqOk } from "@/lib/skinlux-hq-gate";

/**
 * Skinlux HQ: send a reply from the HQ inbox through GoHighLevel.
 *
 * Off until SKINLUX_HQ_SEND=1 is set in Vercel (switch it on after testing
 * with a test contact). The same compliance rules as the front end run here
 * too, so a blocked message can't be sent by calling this route directly:
 *  - injectable clients: no prices, discounts, deals or brand names
 *  - everyone: no promised or guaranteed results
 */

export const dynamic = "force-dynamic";

const GHL = "https://services.leadconnectorhq.com";
const V_CONV = "2021-04-15";
const V = "2021-07-28";

const RISKY_INJ = /(\$\s?\d|discount|% ?off|\bdeal\b|special|cheap|half price|botox|dysport|xeomin|juvederm|restylane)/i;
const RISKY_ALL = /(guarantee|100% results|permanent results|no risk)/i;
const INJ_TAG = /^(injectable|treated-(relaxers|fillers|biostim))$/i;

const TYPE: Record<string, string> = { sms: "SMS", wa: "WhatsApp", ig: "IG", fb: "FB", email: "Email", web: "Live_Chat", review: "GMB", scan: "SMS" };

export async function POST(req: NextRequest) {
  const no = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status, headers: { "cache-control": "no-store" } });
  if (!(await skinluxHqReqOk(req))) return no(401, "Not signed in");
  if (process.env.SKINLUX_HQ_SEND !== "1") return no(403, "Sending from Skinlux HQ isn't switched on yet");

  // eslint-disable-next-line
  const body = (await req.json().catch(() => ({}))) as Record<string, any>;
  const clinic = String(body.clinic || "").toLowerCase();
  const contactId = String(body.contactId || "");
  const text = String(body.text || "").trim();
  const ch = String(body.ch || "sms");
  if (!["booragoon", "leederville"].includes(clinic) || !contactId || !text) return no(400, "Missing clinic, contact or message");

  const token = process.env[`GHL_SKINLUX_${accountOf(clinic).toUpperCase()}_TOKEN`];
  if (!token) return no(503, "That clinic isn't connected");

  // check the contact's tags on the server, not only what the page says
  const c = await fetch(`${GHL}/contacts/${contactId}`, {
    headers: { Authorization: `Bearer ${token}`, Version: V, Accept: "application/json" }, cache: "no-store",
  }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  const tags: string[] = (c && c.contact && c.contact.tags) || [];
  const inj = !!body.inj || tags.some((t) => INJ_TAG.test(String(t)));
  if (inj && RISKY_INJ.test(text)) return no(422, "Injectable chat: no prices, discounts or brand names (AHPRA and TGA)");
  if (RISKY_ALL.test(text)) return no(422, "Promising results isn't allowed in health advertising");

  const type = TYPE[ch] || "SMS";
  const payload: Record<string, string> = { type, contactId, message: text };
  if (type === "Email") {
    payload.subject = `Skinlux ${clinic === "booragoon" ? "Booragoon" : "Leederville"}`;
    payload.html = text.split("\n").map((l) => l.replace(/[&<>]/g, (x) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[x] as string)).join("<br>");
  }
  const res = await fetch(`${GHL}/conversations/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, Version: V_CONV, Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return no(502, `GoHighLevel said no (${res.status})`);
  const d = await res.json().catch(() => ({}));
  const messageId = d.messageId || d.id || null;
  // GoHighLevel accepts first and fails later (for example: no SMS number yet). Check before saying "sent".
  if (messageId) {
    await new Promise((r) => setTimeout(r, 2000));
    const m = await fetch(`${GHL}/conversations/messages/${messageId}`, {
      headers: { Authorization: `Bearer ${token}`, Version: V_CONV, Accept: "application/json" }, cache: "no-store",
    }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const msg = m && (m.message || m);
    if (msg && String(msg.status) === "failed") {
      const why = String(msg.error || "");
      return no(502, /no numbers/i.test(why) ? "Not sent: this clinic has no SMS number in GoHighLevel yet" : `Not sent: ${why.replace(/^Failed:\s*/, "").slice(0, 160) || "GoHighLevel couldn't deliver it"}`);
    }
  }
  return NextResponse.json({ ok: true, messageId }, { headers: { "cache-control": "no-store" } });
}
