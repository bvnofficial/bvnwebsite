import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Chat admin for BVN OS. Secret-gated (CERT_ADMIN_SECRET).
//   GET                      -> recent messages (BVN OS groups into conversations)
//   GET ?conversationId=xxx  -> that thread (and marks its visitor msgs read)
//   POST {conversationId, body} -> post an admin reply
export const dynamic = "force-dynamic";

function authed(req: Request): boolean {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || req.headers.get("x-admin-secret") || "";
  return !!process.env.CERT_ADMIN_SECRET && secret === process.env.CERT_ADMIN_SECRET;
}

export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const cid = new URL(req.url).searchParams.get("conversationId");

  if (cid) {
    const { data, error } = await admin
      .from("chat_messages")
      .select("id,sender,body,name,email,created_at")
      .eq("conversation_id", cid)
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await admin.from("chat_messages").update({ read_by_admin: true }).eq("conversation_id", cid).eq("sender", "visitor").eq("read_by_admin", false);
    return NextResponse.json({ messages: data || [] });
  }

  const { data, error } = await admin
    .from("chat_messages")
    .select("id,conversation_id,sender,body,name,email,created_at,read_by_admin")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data || [] });
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  let payload: { conversationId?: string; body?: string };
  try { payload = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }
  const conversationId = String(payload.conversationId || "").trim();
  const body = String(payload.body || "").trim().slice(0, 4000);
  if (!conversationId || !body) return NextResponse.json({ error: "Missing conversationId or body" }, { status: 400 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const { error } = await admin.from("chat_messages").insert({ conversation_id: conversationId, sender: "admin", body });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
