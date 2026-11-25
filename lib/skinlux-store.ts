import { createAdminClient } from "@/utils/supabase/admin";

// Skinlux storage, server side only. A private Supabase Storage bucket holds:
//  - docs: small JSON documents the HQ apps edit (stock, waitlist, training,
//    intake flags, monitor log). Every save is a new dated file and the newest
//    is read, so a CDN copy can never serve a stale version and every change
//    can be undone.
//  - the event log: one tiny file per event (treatment done, product sold,
//    lead, booking, abandoned booking...). The event itself is packed into the
//    file NAME, so a month of events is read with one list call, no downloads.
// Same pattern as lib/apex-quote-store.ts.

const BUCKET = "skinlux";

// eslint-disable-next-line
type J = Record<string, any>;

let ready: Promise<ReturnType<NonNullable<ReturnType<typeof createAdminClient>>["storage"]["from"]>> | null = null;
function bucket() {
  if (!ready) {
    ready = (async () => {
      const sb = createAdminClient();
      if (!sb) throw new Error("Storage is not set up");
      const { data } = await sb.storage.getBucket(BUCKET);
      if (!data) {
        const { error } = await sb.storage.createBucket(BUCKET, { public: false });
        if (error && !/already exists/i.test(error.message)) throw new Error(error.message);
      }
      return sb.storage.from(BUCKET);
    })().catch((e) => { ready = null; throw e; });
  }
  return ready;
}

const DOC = /^[a-z0-9-]{2,40}$/;
const stamp = () => new Date().toISOString().replace(/[:.]/g, "-");

const docCache: Record<string, { at: number; v: J | null }> = {};

export async function readDoc<T = J>(name: string, maxAgeMs = 0): Promise<T | null> {
  if (!DOC.test(name)) throw new Error("Bad doc");
  const c = docCache[name];
  if (c && maxAgeMs && Date.now() - c.at < maxAgeMs) return c.v as T | null;
  const b = await bucket();
  const { data: list } = await b.list(`docs/${name}`, { limit: 1, sortBy: { column: "name", order: "desc" } });
  const f = list && list[0] && list[0].name.endsWith(".json") ? list[0].name : "";
  let v: J | null = null;
  if (f) {
    const { data } = await b.download(`docs/${name}/${f}`);
    if (data) { try { v = JSON.parse(await data.text()); } catch { v = null; } }
  }
  docCache[name] = { at: Date.now(), v };
  return v as T | null;
}

export async function writeDoc(name: string, value: J): Promise<void> {
  if (!DOC.test(name)) throw new Error("Bad doc");
  const b = await bucket();
  const json = JSON.stringify(value);
  if (json.length > 2_000_000) throw new Error("Too big");
  const { error } = await b.upload(`docs/${name}/${stamp()}.json`, new Blob([json], { type: "application/json" }), {
    upsert: true, contentType: "application/json", cacheControl: "0",
  });
  if (error) throw new Error(error.message);
  docCache[name] = { at: Date.now(), v: value };
}

/* ---------- event log ---------- */

export type LogEvent = {
  k: string;          // treatment_done, product_sold, new_lead, booking_made, incomplete_booking, intake, waitlist, offer_claim
  c: string;          // clinic
  n?: string;         // client first name (+ last initial)
  t?: string;         // therapist
  i?: string;         // item: treatment, product, source, offer
  v?: number;         // value in dollars, when known
  s?: string;         // source or note
  inj?: 1;            // injectable
  at?: number;        // set by the log
};

function b64u(s: string): string {
  return Buffer.from(s, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64u(s: string): string {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}
const cut = (x: unknown, n: number) => String(x ?? "").replace(/\s+/g, " ").trim().slice(0, n);

/** Never throws: logging must not stop an event from reaching GoHighLevel. */
/** System tests use the client name "Test Bvnsystem" and never count in HQ. */
export const isTestName = (n: unknown) => /^test b(vnsystem)?$/i.test(String(n || "").trim());

export async function logEvent(e: LogEvent): Promise<void> {
  if (isTestName(e.n)) return;
  try {
    const at = Date.now();
    const small: LogEvent = { k: cut(e.k, 24), c: cut(e.c, 12) };
    if (e.n) small.n = cut(e.n, 30);
    if (e.t) small.t = cut(e.t, 30);
    if (e.i) small.i = cut(e.i, 50);
    if (e.v) small.v = Math.round(Number(e.v) || 0);
    if (e.s) small.s = cut(e.s, 30);
    if (e.inj) small.inj = 1;
    const perth = new Date(at + 8 * 3600_000).toISOString();
    const month = perth.slice(0, 7);
    const name = `ev/${month}/${String(at)}_${Math.random().toString(36).slice(2, 7)}_${b64u(JSON.stringify(small))}.json`;
    const b = await bucket();
    await b.upload(name, new Blob(["{}"], { type: "application/json" }), { upsert: true, contentType: "application/json" });
    evCache = null;
  } catch {
    /* storage down: the event still goes to GoHighLevel */
  }
}

let evCache: { at: number; list: LogEvent[] } | null = null;

/** Events from the last `days` days (Perth months), newest first. Cached 30s. */
export async function readEvents(days = 62): Promise<LogEvent[]> {
  if (evCache && Date.now() - evCache.at < 30_000) return evCache.list;
  const b = await bucket();
  const since = Date.now() - days * 86400_000;
  const months: string[] = [];
  for (let t = Date.now(); t > since - 31 * 86400_000; t -= 28 * 86400_000) {
    const m = new Date(t + 8 * 3600_000).toISOString().slice(0, 7);
    if (!months.includes(m)) months.push(m);
  }
  const out: LogEvent[] = [];
  for (const m of months) {
    for (let offset = 0; offset < 20000; offset += 1000) {
      const { data } = await b.list(`ev/${m}`, { limit: 1000, offset, sortBy: { column: "name", order: "desc" } });
      const files = data || [];
      for (const f of files) {
        const mm = /^(\d+)_[a-z0-9]+_([A-Za-z0-9_-]+)\.json$/.exec(f.name);
        if (!mm) continue;
        const at = Number(mm[1]);
        if (at < since) continue;
        try { out.push({ ...(JSON.parse(unb64u(mm[2])) as LogEvent), at }); } catch { /* skip */ }
      }
      if (files.length < 1000) break;
    }
  }
  out.sort((a, b2) => (b2.at || 0) - (a.at || 0));
  evCache = { at: Date.now(), list: out };
  return out;
}

export function storeConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Private files (intake signatures). Returns the stored path. */
export async function putFile(path: string, bytes: Uint8Array, type: string): Promise<string> {
  if (!/^[a-z0-9/_-]+\.(png|jpg)$/i.test(path)) throw new Error("Bad path");
  const b = await bucket();
  const { error } = await b.upload(path, new Blob([bytes as unknown as ArrayBuffer], { type }), { upsert: true, contentType: type });
  if (error) throw new Error(error.message);
  return path;
}
export async function getFile(path: string): Promise<Blob | null> {
  if (!/^[a-z0-9/_-]+\.(png|jpg)$/i.test(path)) return null;
  const b = await bucket();
  const { data } = await b.download(path);
  return data || null;
}

/** Removes event files written by system tests (client name "Test B"). */
export async function purgeTestEvents(): Promise<number> {
  const b = await bucket();
  let n = 0;
  for (let t = Date.now(); t > Date.now() - 62 * 86400_000; t -= 28 * 86400_000) {
    const m = new Date(t + 8 * 3600_000).toISOString().slice(0, 7);
    const { data } = await b.list(`ev/${m}`, { limit: 1000, sortBy: { column: "name", order: "desc" } });
    const kill: string[] = [];
    for (const f of data || []) {
      const mm = /^(\d+)_[a-z0-9]+_([A-Za-z0-9_-]+)\.json$/.exec(f.name);
      if (!mm) continue;
      try {
        const e = JSON.parse(unb64u(mm[2])) as LogEvent;
        // also false "down" checks from the old 5 second limit (the site was only slow)
        const falseDown = e.k === "site" && e.s === "down" && (e.v || 0) >= 4900 && (e.v || 0) <= 5200;
        if (isTestName(e.n) || falseDown) kill.push(`ev/${m}/${f.name}`);
      } catch { /* skip */ }
    }
    if (kill.length) { await b.remove(kill); n += kill.length; }
  }
  evCache = null;
  return n;
}
