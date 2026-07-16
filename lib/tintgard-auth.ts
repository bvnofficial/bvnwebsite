/**
 * Shared-secret gate for the TintGard dashboard's write/read-detail actions.
 *
 * The dashboard's summary view is intentionally public, but replying to a
 * customer (and reading a full message thread) must be gated so a random
 * visitor to the public URL can never send messages as TintGard.
 *
 * A single shared password is held server-side in TINTGARD_DASH_PASSWORD.
 * The browser sends it as `Authorization: Bearer <password>` — a header, not a
 * cookie, so it keeps working when the dashboard is embedded in an iframe on
 * tintgard.com.au (third-party cookies would be blocked there).
 *
 * Fails closed: if no password is configured, nothing is authorised.
 */
export function checkTintgardAuth(req: Request): boolean {
  const pw = process.env.TINTGARD_DASH_PASSWORD;
  if (!pw) return false;
  const header = req.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;
  // Constant-time-ish compare to avoid trivial length/short-circuit leaks.
  if (token.length !== pw.length) return false;
  let diff = 0;
  for (let i = 0; i < pw.length; i++) diff |= token.charCodeAt(i) ^ pw.charCodeAt(i);
  return diff === 0;
}
