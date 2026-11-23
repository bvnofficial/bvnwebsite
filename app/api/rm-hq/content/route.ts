import { NextRequest, NextResponse } from "next/server";
import { rmHqReqOk } from "@/lib/rm-hq-gate";
import { BY_KEY, FIELDS, type ImgValue } from "@/lib/rm-site-content";

/**
 * Text and photos on the Revolution Materials website that Jim edits on
 * Revolution HQ (Website > Text and photos).
 *
 * Saved in Jim's GoHighLevel account as the custom value "Website - Content":
 * a JSON map of field key -> value, holding only what differs from the
 * original. The field list lives in lib/rm-site-content.ts.
 *
 * GET               (public, CORS open) { apply: [{ sel, type, value, credit? }] } for sourced.js
 * GET ?edit=1       (Revolution HQ cookie) { fields: [...field, value] } for the editor
 * PUT               (Revolution HQ cookie) { values: { key: value } } saves
 */

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const GHL = "https://services.leadconnectorhq.com";
const V = "2021-07-28";
const NAME = "Website - Content";
const MAX_TEXT = 2000;

type Values = Record<string, string | ImgValue>;

let CACHE: { t: number; values: Values } | null = null;
const TTL_MS = 60_000;
const CORS = { "access-control-allow-origin": "*", "access-control-allow-methods": "GET, OPTIONS" };
const NOSTORE = { "cache-control": "no-store" };

function env() {
  const token = process.env.GHL_RM_TOKEN;
  const L = process.env.GHL_RM_LOCATION;
  return token && L ? { token, L } : null;
}

async function ghl(token: string, path: string, init: RequestInit = {}) {
  return fetch(GHL + path, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Version: V, Accept: "application/json", "Content-Type": "application/json" },
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

const okSrc = (s: string) => /^https:\/\/[^\s"'<>]+$/i.test(s) && s.length < 600;

/** formatted text: one paragraph per line, and only <b>, </b>, <i>, </i> tags (no attributes) */
function cleanRich(v: string): string {
  return v
    .replace(/<(?!\/?[bi]>)\/?[a-z!][^>]*>/gi, "")
    .replace(/<(\/?)([BI])>/g, (_m, s, t) => `<${s}${t.toLowerCase()}>`)
    .split("\n")
    .map((l) => l.replace(/[ \t\u00a0]+/g, " ").replace(/<b>\s*<\/b>|<i>\s*<\/i>/g, "").trim())
    .filter((l) => l.replace(/<\/?[bi]>/g, "").trim())
    .join("\n");
}

/** keep only known keys with sensible values that differ from the original */
function clean(input: unknown): Values | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const out: Values = {};
  for (const [k, raw] of Object.entries(input as Record<string, unknown>)) {
    const f = BY_KEY[k];
    if (!f) continue;
    if (f.type === "img") {
      const r = (raw || {}) as Record<string, unknown>;
      const src = String(r.src || "").trim();
      const alt = String(r.alt || "").replace(/\s+/g, " ").trim().slice(0, 200);
      if (!okSrc(src)) continue;
      const d = f.def as ImgValue;
      if (src === d.src && alt === d.alt) continue;
      out[k] = { src, alt };
    } else {
      let v = String(raw ?? "").replace(/\r\n?/g, "\n");
      const multi = f.type === "lines" || f.type === "list" || f.type === "tags";
      if (f.type === "rich") v = cleanRich(v);
      else v = multi ? v.split("\n").map((l) => l.trim()).filter(Boolean).join("\n") : v.replace(/\s+/g, " ").trim();
      v = v.slice(0, MAX_TEXT);
      if (f.type === "show" && v !== "show" && v !== "hide") continue;
      if (f.type === "num" && !/^[0-9][0-9,.]{0,8} ?[+%]?$/.test(v)) continue;
      if (f.type === "email" && !/^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(v)) continue;
      if (f.type === "phone" && !/^[0-9+() ]{6,20}$/.test(v)) continue;
      if (!v || v === f.def) continue; // empty means "use the original"
      out[k] = v;
    }
  }
  return out;
}

function parse(value: string): Values {
  try {
    return clean(JSON.parse(value)) || {};
  } catch {
    return {};
  }
}

async function load(fresh = false): Promise<Values> {
  if (!fresh && CACHE && Date.now() - CACHE.t < TTL_MS) return CACHE.values;
  const e = env();
  if (!e) throw new Error("not configured");
  const hit = await findValue(e.token, e.L);
  const values = hit ? parse(hit.value) : {};
  CACHE = { t: Date.now(), values };
  return values;
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("edit") === "1") {
    if (!(await rmHqReqOk(req))) {
      return NextResponse.json({ ok: false }, { status: 401, headers: NOSTORE });
    }
    try {
      const values = await load(true);
      return NextResponse.json({ fields: FIELDS.map((f) => ({ ...f, value: values[f.key] ?? null })) }, { headers: NOSTORE });
    } catch {
      return NextResponse.json({ ok: false, error: "Could not reach GoHighLevel" }, { status: 502, headers: NOSTORE });
    }
  }
  const headers = { ...CORS, "cache-control": "public, max-age=60, s-maxage=60" };
  try {
    const values = await load();
    const apply = Object.entries(values).map(([k, value]) => {
      const f = BY_KEY[k];
      return { sel: f.sel, type: f.type, value, ...(f.credit != null ? { credit: f.credit } : {}), ...(f.type === "email" || f.type === "phone" ? { def: f.def } : {}) };
    });
    return NextResponse.json({ apply }, { headers });
  } catch {
    if (CACHE) return NextResponse.json({ apply: [], stale: true }, { headers });
    return NextResponse.json({ apply: null }, { status: 503, headers: CORS });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await rmHqReqOk(req))) {
    return NextResponse.json({ ok: false }, { status: 401, headers: NOSTORE });
  }
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ ok: false }, { status: 403, headers: NOSTORE });
  const e = env();
  if (!e) return NextResponse.json({ ok: false, error: "GoHighLevel is not connected" }, { status: 503, headers: NOSTORE });

  const body = await req.json().catch(() => null);
  const values = clean(body && body.values);
  if (!values) return NextResponse.json({ ok: false, error: "Those changes could not be read" }, { status: 400, headers: NOSTORE });

  try {
    const value = JSON.stringify(values);
    const hit = await findValue(e.token, e.L);
    const r = hit
      ? await ghl(e.token, `/locations/${e.L}/customValues/${hit.id}`, { method: "PUT", body: JSON.stringify({ name: NAME, value }) })
      : await ghl(e.token, `/locations/${e.L}/customValues`, { method: "POST", body: JSON.stringify({ name: NAME, value }) });
    if (!r.ok) return NextResponse.json({ ok: false, error: "GoHighLevel did not save it" }, { status: 502, headers: NOSTORE });
    CACHE = { t: Date.now(), values };
    return NextResponse.json({ ok: true, fields: FIELDS.map((f) => ({ ...f, value: values[f.key] ?? null })) }, { headers: NOSTORE });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not reach GoHighLevel" }, { status: 502, headers: NOSTORE });
  }
}
