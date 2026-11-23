import { NextRequest, NextResponse } from "next/server";
import { rmHqReqOk } from "@/lib/rm-hq-gate";

/**
 * News page for the Revolution Materials website (revolutionmaterials.com.au/news),
 * edited by Jim on Revolution HQ (Website > News).
 *
 * Stored in Jim's GoHighLevel account as the custom value "Website - News" (JSON):
 *   { on: boolean, posts: [{ id, date: "YYYY-MM-DD", title, text, photos: [{ src, alt }] }] }
 * Posts are kept in the order Jim sets (newest first by default).
 *
 * GET          (public, CORS open) { on, posts } — posts is empty while News is switched off
 * GET ?edit=1  (Revolution HQ cookie) { on, posts } — every post, for the editor
 * PUT          (Revolution HQ cookie) { on, posts } saves both; { on } alone flips the switch
 *
 * Env: GHL_RM_TOKEN, GHL_RM_LOCATION, RM_HQ_PASSWORD (gate).
 */

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const GHL = "https://services.leadconnectorhq.com";
const V = "2021-07-28";
const NAME = "Website - News";
const MAX_POSTS = 60;
const MAX_PHOTOS = 6;
const MAX_TITLE = 140;
const MAX_TEXT = 1500;

type Photo = { src: string; alt: string };
type Post = { id: string; date: string; title: string; text: string; photos: Photo[] };
type News = { on: boolean; posts: Post[] };

let CACHE: { t: number; news: News } | null = null;
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

const line = (v: unknown) => String(v ?? "").replace(/\s+/g, " ").trim();
const block = (v: unknown) =>
  String(v ?? "").replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
const okSrc = (s: string) => /^https:\/\/[^\s"'<>]+$/i.test(s) && s.length < 600;
const today = () => new Date().toISOString().slice(0, 10);

function cleanPosts(list: unknown): Post[] | null {
  if (!Array.isArray(list) || list.length > MAX_POSTS) return null;
  const out: Post[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    const photos: Photo[] = (Array.isArray(r.photos) ? r.photos : [])
      .map((p) => {
        const o = (p || {}) as Record<string, unknown>;
        return { src: String(o.src || "").trim(), alt: line(o.alt).slice(0, 200) };
      })
      .filter((p) => okSrc(p.src))
      .slice(0, MAX_PHOTOS);
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(r.date || "")) ? String(r.date) : today();
    const id = /^[a-z0-9]{4,20}$/i.test(String(r.id || "")) ? String(r.id) : Math.random().toString(36).slice(2, 10);
    const p: Post = { id, date, title: line(r.title).slice(0, MAX_TITLE), text: block(r.text).slice(0, MAX_TEXT), photos };
    if (!p.title && !p.text && !p.photos.length) continue;
    out.push(p);
  }
  return out;
}

function parse(value: string): News {
  try {
    const d = JSON.parse(value);
    return { on: !!(d && d.on), posts: cleanPosts(d && d.posts) || [] };
  } catch {
    return { on: false, posts: [] };
  }
}

async function load(fresh = false): Promise<News> {
  if (!fresh && CACHE && Date.now() - CACHE.t < TTL_MS) return CACHE.news;
  const e = env();
  if (!e) throw new Error("not configured");
  const hit = await findValue(e.token, e.L);
  const news = hit ? parse(hit.value) : { on: false, posts: [] };
  CACHE = { t: Date.now(), news };
  return news;
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("edit") === "1") {
    if (!(await rmHqReqOk(req))) return NextResponse.json({ ok: false }, { status: 401, headers: NOSTORE });
    try {
      return NextResponse.json(await load(true), { headers: NOSTORE });
    } catch {
      return NextResponse.json({ ok: false, error: "Could not reach GoHighLevel" }, { status: 502, headers: NOSTORE });
    }
  }
  const headers = { ...CORS, "cache-control": "public, max-age=60, s-maxage=60" };
  try {
    const n = await load();
    return NextResponse.json({ on: n.on, posts: n.on ? n.posts : [] }, { headers });
  } catch {
    return NextResponse.json({ on: false, posts: [] }, { status: 503, headers: CORS });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await rmHqReqOk(req))) return NextResponse.json({ ok: false }, { status: 401, headers: NOSTORE });
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ ok: false }, { status: 403, headers: NOSTORE });
  const e = env();
  if (!e) return NextResponse.json({ ok: false, error: "GoHighLevel is not connected" }, { status: 503, headers: NOSTORE });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false, error: "That could not be read" }, { status: 400, headers: NOSTORE });

  try {
    const hit = await findValue(e.token, e.L);
    const cur = hit ? parse(hit.value) : { on: false, posts: [] };
    let posts = cur.posts;
    if ("posts" in body) {
      const p = cleanPosts(body.posts);
      if (!p) return NextResponse.json({ ok: false, error: "Those posts could not be read" }, { status: 400, headers: NOSTORE });
      posts = p;
    }
    const news: News = { on: "on" in body ? !!body.on : cur.on, posts };
    const value = JSON.stringify(news);
    const r = hit
      ? await ghl(e.token, `/locations/${e.L}/customValues/${hit.id}`, { method: "PUT", body: JSON.stringify({ name: NAME, value }) })
      : await ghl(e.token, `/locations/${e.L}/customValues`, { method: "POST", body: JSON.stringify({ name: NAME, value }) });
    if (!r.ok) return NextResponse.json({ ok: false, error: "GoHighLevel did not save it" }, { status: 502, headers: NOSTORE });
    CACHE = { t: Date.now(), news };
    return NextResponse.json({ ok: true, ...news }, { headers: NOSTORE });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not reach GoHighLevel" }, { status: 502, headers: NOSTORE });
  }
}
