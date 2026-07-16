import { NextResponse } from "next/server";
import { checkTintgardAuth } from "@/lib/tintgard-auth";

/**
 * Validates the dashboard reply password. The browser sends the entered
 * password as a Bearer token; this just confirms it so the UI can show an
 * "unlocked" state and store it. No session is created — every protected call
 * re-sends the token.
 */
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!process.env.TINTGARD_DASH_PASSWORD) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }
  if (!checkTintgardAuth(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
