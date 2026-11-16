import { NextRequest, NextResponse } from "next/server";
import { RM_HQ_COOKIE, RM_HQ_HOME, rmHqToken } from "@/lib/rm-hq-gate";

// Checks the Revolution HQ password and sets the access cookie that the
// middleware and /api/rm-hq look for. The password never reaches the browser.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  const expected = process.env.RM_HQ_PASSWORD;

  let ok = !!expected && password.length === expected.length;
  if (ok && expected) {
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= password.charCodeAt(i) ^ expected.charCodeAt(i);
    ok = diff === 0;
  }

  if (ok) {
    const token = await rmHqToken();
    const res = NextResponse.redirect(new URL(RM_HQ_HOME, req.url), 303);
    res.cookies.set(RM_HQ_COOKIE, token || "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
    return res;
  }

  const back = new URL(RM_HQ_HOME, req.url);
  back.searchParams.set("rm", "bad");
  return NextResponse.redirect(back, 303);
}
