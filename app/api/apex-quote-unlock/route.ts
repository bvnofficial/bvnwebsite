import { NextRequest, NextResponse } from "next/server";
import {
  APEX_QUOTE_PW,
  APEX_QUOTE_TOKEN,
  APEX_QUOTE_COOKIE,
  APEX_QUOTE_HOME,
  isApexQuoteGated,
} from "@/lib/apex-quote-gate";
import { APEX_ADMIN_PW, APEX_ADMIN_TOKEN, APEX_ADMIN_COOKIE } from "@/lib/apex-quote-store";

// Checks the Apex Quote password and, on success, sets the access cookie the
// middleware looks for. Never reveals the password to the client.
// Two logins: the technician password opens quoting only; the CEO password
// (Simon) also opens the CEO dashboard with costs, markup and profit.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  const nextRaw = String(form.get("next") || APEX_QUOTE_HOME);
  // a bare folder has no index in public/, so send it to the app page
  const next = isApexQuoteGated(nextRaw) && /\.\w+$/.test(nextRaw) ? nextRaw : APEX_QUOTE_HOME;

  const ceo = password === APEX_ADMIN_PW;
  if (ceo || password === APEX_QUOTE_PW) {
    const to = ceo ? "/clients/apex-gates/quote/admin.html" : next.endsWith("/admin.html") ? APEX_QUOTE_HOME : next;
    const res = NextResponse.redirect(new URL(to, req.url), 303);
    const opts = {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/clients/apex-gates/quote",
      maxAge: 60 * 60 * 24 * 90, // 90 days, so techs are not locked out on site
    };
    res.cookies.set(APEX_QUOTE_COOKIE, APEX_QUOTE_TOKEN, opts);
    // a technician signing in on a shared tablet drops any CEO access left on it
    res.cookies.set(APEX_ADMIN_COOKIE, ceo ? APEX_ADMIN_TOKEN : "", { ...opts, maxAge: ceo ? opts.maxAge : 0 });
    return res;
  }

  const back = new URL(next, req.url);
  back.searchParams.set("aq", "bad");
  return NextResponse.redirect(back, 303);
}
