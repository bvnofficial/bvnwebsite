import { NextResponse } from "next/server";
import { loadSettings, publicSettings } from "@/lib/skinlux-settings";

/** Public: what the quiz, skin check and offer pages need from Jellie's HQ Settings. */
export const dynamic = "force-dynamic";

export async function GET() {
  const st = await loadSettings();
  return NextResponse.json({ ok: true, ...publicSettings(st) }, { headers: { "cache-control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" } });
}
