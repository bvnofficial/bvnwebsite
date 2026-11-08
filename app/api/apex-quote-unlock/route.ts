import { NextRequest, NextResponse } from "next/server";
import {
  APEX_QUOTE_PW,
  APEX_QUOTE_TOKEN,
  APEX_QUOTE_COOKIE,
  APEX_QUOTE_HOME,
  isApexQuoteGated,
} from "@/lib/apex-quote-gate";

// Checks the Apex Quote password and, on success, sets the access cookie the
// middleware looks for. Never reveals the password to the client.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  const nextRaw = String(form.get("next") || APEX_QUOTE_HOME);
  // a bare folder has no index in public/, so send it to the app page
  const next = isApexQuoteGated(nextRaw) && /\.\w+$/.test(nextRaw) ? nextRaw : APEX_QUOTE_HOME;

  if (password === APEX_QUOTE_PW) {
    const res = NextResponse.redirect(new URL(next, req.url), 303);
    res.cookies.set(APEX_QUOTE_COOKIE, APEX_QUOTE_TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/clients/apex-gates/quote",
      maxAge: 60 * 60 * 24 * 90, // 90 days, so techs are not locked out on site
    });
    return res;
  }

  const back = new URL(next, req.url);
  back.searchParams.set("aq", "bad");
  return NextResponse.redirect(back, 303);
}
