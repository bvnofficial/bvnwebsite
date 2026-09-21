import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Returns one visitor's own thread (filtered by their conversation id) so the
// widget can show replies. No cross-thread leakage.
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const conversationId = String(url.searchParams.get("conversationId") || "").trim();
  const since = url.searchParams.get("since");
  if (!UUID_RE.test(conversationId)) return NextResponse.json({ error: "Invalid conversation" }, { status: 400 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ messages: [] });
  let q = admin
    .from("chat_messages")
    .select("id,sender,body,created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(200);
  if (since) q = q.gt("created_at", since);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data || [] });
}
