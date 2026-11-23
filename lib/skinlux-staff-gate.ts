// Password gate for the Skinlux staff app (/clients/skinlux/staff).
// Separate password from Skinlux HQ so therapists don't get the owner view.
// Env (Vercel): SKINLUX_STAFF_PASSWORD. Fails closed when unset.
// A signed-in HQ user (Jellie) also gets in.
import { skinluxHqReqOk } from "@/lib/skinlux-hq-gate";

export const SKINLUX_STAFF_COOKIE = "skinlux_staff_access";
export const SKINLUX_STAFF_HOME = "/clients/skinlux/staff/index.html";

export function isSkinluxStaffGated(pathname: string): boolean {
  return pathname.startsWith("/clients/skinlux/staff");
}

export async function skinluxStaffToken(): Promise<string | null> {
  const pw = process.env.SKINLUX_STAFF_PASSWORD;
  if (!pw) return null;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("skinlux-staff-v1"));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

type Req = { headers: Headers; cookies: { get(name: string): { value: string } | undefined } };

export async function skinluxStaffReqOk(req: Req): Promise<boolean> {
  const t = await skinluxStaffToken();
  const c = req.cookies.get(SKINLUX_STAFF_COOKIE)?.value;
  if (t && c && same(t, c)) return true;
  return skinluxHqReqOk(req);
}

export function checkStaffPassword(password: string): boolean {
  const expected = process.env.SKINLUX_STAFF_PASSWORD;
  return !!expected && same(password, expected);
}

export function skinluxStaffGateHtml(showError: boolean): string {
  const err = showError ? '<p class="err">That password was not right. Please try again.</p>' : "";
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Skinlux Staff</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f7f2ec;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#2b2420}
  .card{width:100%;max-width:360px;background:#fff;border-radius:16px;padding:28px 24px;box-shadow:0 24px 60px -30px rgba(43,36,32,.35)}
  h1{font-size:24px;margin:0 0 6px}
  p.sub{font-size:14px;color:#7a6e66;margin:0 0 20px}
  input{width:100%;font:inherit;font-size:16px;padding:13px 14px;border-radius:10px;border:1.5px solid #e6ddd4;margin-bottom:14px}
  button{width:100%;font:inherit;font-size:15px;font-weight:700;padding:14px;border-radius:10px;border:none;background:#2b2420;color:#fff;cursor:pointer}
  .err{margin:0 0 14px;font-size:13px;color:#c0392b}
</style></head><body>
<div class="card">
  <h1>Skinlux Staff</h1>
  <p class="sub">Today's clients, treatment done and call backs.</p>
  ${err}
  <form method="POST" action="/api/skinlux-staff/unlock">
    <input name="password" type="password" placeholder="Staff password" autocomplete="current-password" autofocus required>
    <button type="submit">Open</button>
  </form>
</div></body></html>`;
}
