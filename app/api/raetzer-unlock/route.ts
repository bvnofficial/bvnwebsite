import { NextRequest, NextResponse } from "next/server";
import {
  RAETZER_PW,
  RAETZER_TOKEN,
  RAETZER_COOKIE,
  isRaetzerGated,
} from "@/lib/raetzer-gate";

// Validates the Raetzer preview password and, on success, sets the access
// cookie that the middleware checks. Never reveals the password to the client.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  const nextRaw = String(form.get("next") || "/clients/raetzer");
  const next = isRaetzerGated(nextRaw) ? nextRaw : "/clients/raetzer";

  if (password === RAETZER_PW) {
    const res = NextResponse.redirect(new URL(next, req.url), 303);
    res.cookies.set(RAETZER_COOKIE, RAETZER_TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  }

  const back = new URL(next, req.url);
  back.searchParams.set("rz", "bad");
  return NextResponse.redirect(back, 303);
}
