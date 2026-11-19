import { NextRequest, NextResponse } from "next/server";
import { RM_HQ_COOKIE, rmHqAuthorised } from "@/lib/rm-hq-gate";

/**
 * "Some of the materials we've sourced" list for the Revolution Materials
 * website, edited by Jim on Revolution HQ (/clients/revolution-materials/ceo).
 *
 * The list is stored in Jim's GoHighLevel account as the custom value
 * "Website - Materials sourced" (JSON). The token stays on the server.
 *
 * GET  (public, CORS open): { examples: [...] } for the GHL website to draw the cards.
 * PUT  (Revolution HQ cookie only): { examples: [...] } saves a new list.
 *
 * Env: GHL_RM_TOKEN, GHL_RM_LOCATION, RM_HQ_PASSWORD (gate).
 */

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const GHL = "https://services.leadconnectorhq.com";
const V = "2021-07-28";
const NAME = "Website - Materials sourced";
const FIELDS = ["fam", "grade", "spec", "form", "detail"] as const;
const MAX_ITEMS = 60;
const MAX_LEN = 140;

type Example = Record<(typeof FIELDS)[number], string>;

let CACHE: { t: number; examples: Example[] } | null = null;
const TTL_MS = 60_000;

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
};

function env() {
  const token = process.env.GHL_RM_TOKEN;
  const L = process.env.GHL_RM_LOCATION;
  return token && L ? { token, L } : null;
}

async function ghl(token: string, path: string, init: RequestInit = {}) {
  return fetch(GHL + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: V,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
}

async function findValue(token: string, L: string): Promise<{ id: string; value: string } | null> {
  const r = await ghl(token, `/locations/${L}/customValues`);
  if (!r.ok) throw new Error("list " + r.status);
  const d = await r.json();
  const hit = (d.customValues || []).find((v: { name?: string }) => v.name === NAME);
  return hit ? { id: hit.id, value: String(hit.value || "") } : null;
}

function clean(list: unknown): Example[] | null {
  if (!Array.isArray(list) || list.length > MAX_ITEMS) return null;
  const out: Example[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") return null;
    const e = {} as Example;
    for (const k of FIELDS) {
      e[k] = String((raw as Record<string, unknown>)[k] ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_LEN);
    }
    if (!e.grade) continue; // a row needs at least a grade
    out.push(e);
  }
  return out;
}

function parse(value: string): Example[] {
  try {
    return clean(JSON.parse(value)) || [];
  } catch {
    return [];
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  const headers = { ...CORS, "cache-control": "public, max-age=60, s-maxage=60" };
  if (CACHE && Date.now() - CACHE.t < TTL_MS) return NextResponse.json({ examples: CACHE.examples }, { headers });
  const e = env();
  if (!e) return NextResponse.json({ examples: null, configured: false }, { status: 503, headers: CORS });
  try {
    const hit = await findValue(e.token, e.L);
    const examples = hit ? parse(hit.value) : [];
    CACHE = { t: Date.now(), examples };
    return NextResponse.json({ examples }, { headers });
  } catch {
    if (CACHE) return NextResponse.json({ examples: CACHE.examples, stale: true }, { headers });
    return NextResponse.json({ examples: null }, { status: 502, headers: CORS });
  }
}

export async function PUT(req: NextRequest) {
  const nostore = { "cache-control": "no-store" };
  if (!(await rmHqAuthorised(req.cookies.get(RM_HQ_COOKIE)?.value))) {
    return NextResponse.json({ ok: false }, { status: 401, headers: nostore });
  }
  // only the dashboard page itself may save
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) {
    return NextResponse.json({ ok: false }, { status: 403, headers: nostore });
  }
  const e = env();
  if (!e) return NextResponse.json({ ok: false, error: "GoHighLevel is not connected" }, { status: 503, headers: nostore });

  const body = await req.json().catch(() => null);
  const examples = clean(body && body.examples);
  if (!examples) return NextResponse.json({ ok: false, error: "That list could not be read" }, { status: 400, headers: nostore });

  try {
    const value = JSON.stringify(examples);
    const hit = await findValue(e.token, e.L);
    const r = hit
      ? await ghl(e.token, `/locations/${e.L}/customValues/${hit.id}`, { method: "PUT", body: JSON.stringify({ name: NAME, value }) })
      : await ghl(e.token, `/locations/${e.L}/customValues`, { method: "POST", body: JSON.stringify({ name: NAME, value }) });
    if (!r.ok) return NextResponse.json({ ok: false, error: "GoHighLevel did not save it" }, { status: 502, headers: nostore });
    CACHE = { t: Date.now(), examples };
    return NextResponse.json({ ok: true, examples }, { headers: nostore });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not reach GoHighLevel" }, { status: 502, headers: nostore });
  }
}
