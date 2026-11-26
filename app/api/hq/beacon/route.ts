import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createAdminClient } from "@/utils/supabase/admin";

// BVN HQ heartbeat. The HQ app on Benjamin's PC posts its current tunnel URL
// here every few minutes, signed with HQ_BEACON_SECRET. /hq reads it back.
// No client data passes through here: only the tunnel address.

export const dynamic = "force-dynamic";

const TUNNEL_RE = /^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/;

function secretOk(given: string | null): boolean {
  const want = process.env.HQ_BEACON_SECRET;
  if (!want || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(want);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!secretOk(req.headers.get("x-hq-secret"))) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }
  let url = "";
  try {
    const body = await req.json();
    url = String(body?.url || "");
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  if (!TUNNEL_RE.test(url)) {
    return NextResponse.json({ error: "bad url" }, { status: 400 });
  }
  const db = createAdminClient();
  if (!db) return NextResponse.json({ error: "storage not configured" }, { status: 503 });
  const { error } = await db
    .from("hq_beacon")
    .upsert({ id: 1, url, seen_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) return NextResponse.json({ error: "storage error" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
