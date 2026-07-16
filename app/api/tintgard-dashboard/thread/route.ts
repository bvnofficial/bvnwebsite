import { NextResponse } from "next/server";
import { checkTintgardAuth } from "@/lib/tintgard-auth";

/**
 * Full message thread for a single GoHighLevel conversation (read-only).
 * Gated: full message content is more sensitive than the public summary feed,
 * so viewing a thread requires the dashboard password.
 */
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const GHL = "https://services.leadconnectorhq.com";
const GHLV_CONV = "2021-04-15";

const CHANNEL: Record<string, string> = {
  TYPE_SMS: "SMS", TYPE_EMAIL: "Email", TYPE_CALL: "Call", TYPE_PHONE: "Call",
  TYPE_WEBCHAT: "Web chat", TYPE_LIVE_CHAT: "Web chat", TYPE_GMB: "Google",
  TYPE_FACEBOOK: "Facebook", TYPE_INSTAGRAM: "Instagram", TYPE_WHATSAPP: "WhatsApp",
};
function chLabel(t: string) {
  if (CHANNEL[t]) return CHANNEL[t];
  if (/ACTIVITY/i.test(t)) return "Update";
  return "Message";
}

export async function GET(req: Request) {
  if (!checkTintgardAuth(req)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const token = process.env.GHL_TINTGARD_TOKEN;
  if (!token) return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const conversationId = (searchParams.get("conversationId") || "").trim();
  if (!conversationId) return NextResponse.json({ ok: false, reason: "missing_conversation" }, { status: 400 });

  try {
    const res = await fetch(`${GHL}/conversations/${conversationId}/messages?limit=40`, {
      headers: { Authorization: `Bearer ${token}`, Version: GHLV_CONV, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, reason: `ghl_${res.status}` }, { status: 502 });
    }
    const data = await res.json().catch(() => null);
    const raw = (data?.messages?.messages || data?.messages || []) as Record<string, unknown>[];
    const messages = raw
      .map((m) => ({
        id: String(m.id || ""),
        direction: String(m.direction || ""),
        channel: chLabel(String(m.messageType || m.type || "")),
        body: String(m.body || "").trim(),
        when: String(m.dateAdded || ""),
      }))
      .filter((m) => m.body)
      .sort((a, b) => a.when.localeCompare(b.when));
    return NextResponse.json({ ok: true, messages });
  } catch (e) {
    return NextResponse.json({ ok: false, reason: String(e) }, { status: 500 });
  }
}
