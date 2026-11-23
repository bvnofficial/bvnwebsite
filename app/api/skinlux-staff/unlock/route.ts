import { NextRequest, NextResponse } from "next/server";
import { SKINLUX_STAFF_COOKIE, SKINLUX_STAFF_HOME, checkStaffPassword, skinluxStaffToken } from "@/lib/skinlux-staff-gate";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  if (checkStaffPassword(String(form.get("password") || ""))) {
    const res = NextResponse.redirect(new URL(SKINLUX_STAFF_HOME, req.url), 303);
    res.cookies.set(SKINLUX_STAFF_COOKIE, (await skinluxStaffToken()) || "", {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 90,
    });
    return res;
  }
  const back = new URL(SKINLUX_STAFF_HOME, req.url);
  back.searchParams.set("st", "bad");
  return NextResponse.redirect(back, 303);
}
