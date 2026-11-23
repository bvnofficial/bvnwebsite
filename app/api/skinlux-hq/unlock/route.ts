import { NextRequest, NextResponse } from "next/server";
import { SKINLUX_HQ_COOKIE, SKINLUX_HQ_HOME, skinluxHqToken } from "@/lib/skinlux-hq-gate";

// Checks the Skinlux HQ password and sets the access cookie that the
// middleware and /api/skinlux-hq look for. The password never reaches the browser.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  const expected = process.env.SKINLUX_HQ_PASSWORD;

  let ok = !!expected && password.length === expected.length;
  if (ok && expected) {
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= password.charCodeAt(i) ^ expected.charCodeAt(i);
    ok = diff === 0;
  }

  const wantsJson = (req.headers.get("accept") || "").includes("application/json");
  if (ok) {
    const token = await skinluxHqToken();
    // JSON for the sign-in form's script (also used inside the framed dashboard)
    const res = wantsJson
      ? NextResponse.json({ ok: true, token }, { headers: { "cache-control": "no-store" } })
      : NextResponse.redirect(new URL(SKINLUX_HQ_HOME, req.url), 303);
    res.cookies.set(SKINLUX_HQ_COOKIE, token || "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
    return res;
  }

  if (wantsJson) return NextResponse.json({ ok: false }, { status: 401, headers: { "cache-control": "no-store" } });
  const back = new URL(SKINLUX_HQ_HOME, req.url);
  back.searchParams.set("sl", "bad");
  return NextResponse.redirect(back, 303);
}
