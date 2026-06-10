import crypto from "crypto";

// Stateless password gate for /leads. The cookie stores a hash of the password
// (+ salt), so it can't be forged without knowing LEADS_PASSWORD, and we don't
// need a session store. Security rests entirely on the secrecy of LEADS_PASSWORD.

export const LEADS_COOKIE = "leads_auth";
const SALT = "bvn-leads-v1";

export function expectedToken(): string | null {
  const pw = process.env.LEADS_PASSWORD;
  if (!pw) return null;
  return crypto.createHash("sha256").update(`${pw}:${SALT}`).digest("hex");
}

export function tokenMatches(cookieVal: string | undefined): boolean {
  const exp = expectedToken();
  if (!exp || !cookieVal) return false;
  const a = Buffer.from(cookieVal);
  const b = Buffer.from(exp);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
