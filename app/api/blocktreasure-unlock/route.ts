import { NextRequest, NextResponse } from "next/server";
import {
  BT_PW,
  BT_TOKEN,
  BT_COOKIE,
  isBlockTreasureGated,
} from "@/lib/blocktreasure-gate";

const HOME = "/clients/blocktreasure/marketing-dashboard";

// Validates the Block Treasure dashboard password and, on success, sets the
// access cookie that the middleware checks. Never reveals the password.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  const nextRaw = String(form.get("next") || HOME);
  const next = isBlockTreasureGated(nextRaw) ? nextRaw : HOME;

  if (BT_PW && BT_TOKEN && password === BT_PW) {
    const res = NextResponse.redirect(new URL(next, req.url), 303);
    res.cookies.set(BT_COOKIE, BT_TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 60, // 60 days
    });
    return res;
  }

  const back = new URL(next, req.url);
  back.searchParams.set("bt", "bad");
  return NextResponse.redirect(back, 303);
}
