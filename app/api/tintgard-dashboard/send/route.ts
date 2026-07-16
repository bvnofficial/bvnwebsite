import { NextResponse } from "next/server";
import { checkTintgardAuth } from "@/lib/tintgard-auth";

/**
 * Sends a reply to a customer through GoHighLevel. GATED by the dashboard
 * password. This is the only write path in the dashboard — every other route
 * is read-only. A successful call delivers a real SMS or email to the customer.
 */
export const dynamic = "force-dynamic";

const GHL = "https://services.leadconnectorhq.com";
const GHLV_CONV = "2021-04-15";

export async function POST(req: Request) {
  if (!checkTintgardAuth(req)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const token = process.env.GHL_TINTGARD_TOKEN;
  if (!token) return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, reason: "bad_body" }, { status: 400 }); }

  const contactId = String(body.contactId || "").trim();
  const conversationId = String(body.conversationId || "").trim();
  const message = String(body.message || "").trim();
  const rawType = String(body.type || "SMS").trim();
  const type = /email/i.test(rawType) ? "Email" : "SMS";

  if (!contactId) return NextResponse.json({ ok: false, reason: "missing_contact" }, { status: 400 });
  if (!message) return NextResponse.json({ ok: false, reason: "empty_message" }, { status: 400 });
  if (message.length > 1500) return NextResponse.json({ ok: false, reason: "too_long" }, { status: 400 });

  const payload: Record<string, unknown> = { type, contactId, message };
  if (conversationId) payload.conversationId = conversationId;
  if (type === "Email") {
    payload.subject = String(body.subject || "Re: your enquiry with TintGard");
    payload.html = message.replace(/\n/g, "<br>");
  }

  try {
    const res = await fetch(`${GHL}/conversations/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, Version: GHLV_CONV,
        Accept: "application/json", "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const detail = data?.message || data?.error || `ghl_${res.status}`;
      return NextResponse.json({ ok: false, reason: String(detail) }, { status: 502 });
    }
    return NextResponse.json({
      ok: true,
      messageId: String(data?.messageId || data?.messageIds?.[0] || ""),
      conversationId: String(data?.conversationId || conversationId || ""),
    });
  } catch (e) {
    return NextResponse.json({ ok: false, reason: String(e) }, { status: 500 });
  }
}
