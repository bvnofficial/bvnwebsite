import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Logs one anonymous page view. Country/city come from Vercel geo headers (no
// raw IP stored). Bots skipped. Fire-and-forget from the client.
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BOT_RE = /bot|crawl|spider|slurp|bing|yandex|baidu|duckduck|facebookexternalhit|preview|monitor|headless|lighthouse|curl|wget|python-requests|axios|node-fetch/i;

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") || "";
  if (BOT_RE.test(ua)) return NextResponse.json({ ok: true });

  let body: { visitorId?: string; path?: string; referrer?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const visitor_id = body.visitorId && UUID_RE.test(body.visitorId) ? body.visitorId : null;
  const path = String(body.path || "").slice(0, 300);
  const referrer = String(body.referrer || "").slice(0, 300);
  const country = request.headers.get("x-vercel-ip-country") || null;
  const cityRaw = request.headers.get("x-vercel-ip-city");
  const city = cityRaw ? decodeURIComponent(cityRaw).slice(0, 120) : null;

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ ok: true });
  try {
    await admin.from("page_views").insert({ visitor_id, path, referrer, country, city, ua: ua.slice(0, 300) });
  } catch {
    // analytics must never break a page load
  }
  return NextResponse.json({ ok: true });
}
