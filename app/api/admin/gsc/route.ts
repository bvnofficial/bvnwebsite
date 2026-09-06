import { NextResponse } from "next/server";
import crypto from "crypto";

// Live Google Search Console data for the BVN OS SEO tab.
// Reads a service-account key from GSC_SERVICE_ACCOUNT_JSON (set in Vercel),
// signs a JWT with Node crypto (no extra deps), exchanges it for an access
// token, auto-detects the bvnofficial property, and returns last-28-day totals
// plus top queries and pages. Gated by CERT_ADMIN_SECRET.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authed(req: Request, url: URL) {
  const want = process.env.CERT_ADMIN_SECRET;
  if (!want) return false;
  const got = req.headers.get("x-admin-secret") || url.searchParams.get("secret") || "";
  return got === want;
}
const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function getAccessToken(key: { client_email: string; private_key: string; token_uri: string }) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: key.token_uri,
    iat: now,
    exp: now + 3600,
  }));
  const signature = b64url(crypto.createSign("RSA-SHA256").update(`${header}.${claim}`).sign(key.private_key));
  const assertion = `${header}.${claim}.${signature}`;
  const res = await fetch(key.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error(j.error_description || j.error || "token exchange failed");
  return j.access_token as string;
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!authed(req, url)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!raw) return NextResponse.json({ ok: false, error: "GSC_SERVICE_ACCOUNT_JSON not set in Vercel." }, { status: 503 });

  let key;
  try { key = JSON.parse(raw); } catch { return NextResponse.json({ ok: false, error: "GSC key is not valid JSON." }, { status: 500 }); }

  try {
    const token = await getAccessToken(key);
    const authHeader = { Authorization: `Bearer ${token}` };

    // Auto-detect the property (prefer a Domain property).
    let property = process.env.GSC_PROPERTY || "";
    if (!property) {
      const sites = await fetch("https://www.googleapis.com/webmasters/v3/sites", { headers: authHeader }).then((r) => r.json());
      const entries: Array<{ siteUrl: string }> = sites.siteEntry || [];
      const match = entries.filter((e) => /bvnofficial/i.test(e.siteUrl));
      property = (match.find((e) => e.siteUrl.startsWith("sc-domain:")) || match[0] || {}).siteUrl || "";
      if (!property) return NextResponse.json({ ok: false, error: "No bvnofficial property visible to this service account. Add the service-account email as a user in Search Console.", sites: entries.map((e) => e.siteUrl) }, { status: 404 });
    }

    const end = new Date();
    const start = new Date(); start.setDate(start.getDate() - 28);
    const api = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
    const q = (dimensions: string[]) => fetch(api, {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: ymd(start), endDate: ymd(end), dimensions, rowLimit: dimensions.length ? 1000 : 1 }),
    }).then((r) => r.json());

    const [totalsR, byQuery, byPage] = await Promise.all([q([]), q(["query"]), q(["page"])]);
    const t = (totalsR.rows && totalsR.rows[0]) || {};
    // Sort by clicks (then impressions) and keep the top 25 — the API's default
    // row order isn't reliably by clicks for domain properties.
    const rowMap = (rows: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> = []) =>
      rows.slice()
        .sort((a, b) => (b.clicks - a.clicks) || (b.impressions - a.impressions))
        .slice(0, 25)
        .map((r) => ({ key: r.keys?.[0] || "", clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));

    return NextResponse.json({
      ok: true,
      property,
      range: { start: ymd(start), end: ymd(end) },
      totals: { clicks: t.clicks || 0, impressions: t.impressions || 0, ctr: t.ctr || 0, position: t.position || 0 },
      topQueries: rowMap(byQuery.rows),
      topPages: rowMap(byPage.rows),
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error)?.message || "GSC request failed" }, { status: 500 });
  }
}
