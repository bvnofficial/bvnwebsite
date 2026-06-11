import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { LEADS_COOKIE, expectedToken } from "@/app/leads/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({}));
  const pw = process.env.LEADS_PASSWORD;

  if (!pw) {
    return NextResponse.json({ error: "Lead tracker password is not configured." }, { status: 500 });
  }

  // Constant-time compare (guard length first — timingSafeEqual throws on mismatch).
  const ok =
    typeof password === "string" &&
    Buffer.byteLength(password) === Buffer.byteLength(pw) &&
    crypto.timingSafeEqual(Buffer.from(password), Buffer.from(pw));

  if (!ok) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(LEADS_COOKIE, expectedToken()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Must be site-wide so the cookie is also sent to /api/leads-followup
    // (a /leads-scoped cookie is withheld from /api/* → 401 "Not authorized").
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
