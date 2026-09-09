import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Anonymous visitor sends a chat message (service-role insert; RLS-locked table).
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
function rateLimited(key: string): boolean {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let payload: { conversationId?: string; body?: string; name?: string; hp?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (payload.hp) return NextResponse.json({ ok: true }); // honeypot

  const conversationId = String(payload.conversationId || "").trim();
  const body = String(payload.body || "").trim();
  const name = payload.name ? String(payload.name).trim().slice(0, 80) : null;

  if (!UUID_RE.test(conversationId)) return NextResponse.json({ error: "Invalid conversation" }, { status: 400 });
  if (!body || body.length > 2000) return NextResponse.json({ error: "Message must be 1–2000 characters." }, { status: 400 });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip) || rateLimited(conversationId)) {
    return NextResponse.json({ error: "Slow down a moment and try again." }, { status: 429 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Chat is temporarily unavailable." }, { status: 503 });
  const { error } = await admin.from("chat_messages").insert({ conversation_id: conversationId, sender: "visitor", body, name });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
