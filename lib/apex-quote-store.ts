import { createAdminClient } from "@/utils/supabase/admin";

// Shared data for Apex Quote: the price book (materials, equipment, labour,
// finishes, markups) and any gate types the office adds. One JSON file in a
// private Supabase Storage bucket, so every tablet loads the same prices.
// Each save also keeps a dated copy under history/ so a bad change can be undone.
// Server-side only.

export const APEX_ADMIN_PW = process.env.APEX_QUOTE_ADMIN_PASSWORD || "OfficeRidge482!";
export const APEX_ADMIN_TOKEN = "apqa_5e2d91c4b7a8f06d3e1c";
export const APEX_ADMIN_COOKIE = "apex_quote_admin";

const BUCKET = "apex-quote";
const FILE = "data.json";

async function bucket() {
  const sb = createAdminClient();
  if (!sb) throw new Error("Storage is not set up (missing Supabase keys)");
  const { data } = await sb.storage.getBucket(BUCKET);
  if (!data) {
    const { error } = await sb.storage.createBucket(BUCKET, { public: false });
    if (error && !/already exists/i.test(error.message)) throw new Error(error.message);
  }
  return sb.storage.from(BUCKET);
}

// What a technician's tablet gets: every price with the markup already added
// and the markups set to zero, so what Apex pays and adds on never leaves the
// server. Same as teamView() in the app's shared.js.
export function teamView(data: any) {
  if (!data || !data.pb) return data;
  const d = JSON.parse(JSON.stringify(data));
  const pb = d.pb, mk = pb.markup || {};
  const up = (cat: string, v: any) => (Number(v) || 0) * (1 + (Number(mk[cat]) || 0) / 100);
  for (const m of pb.materials || []) m.cost = up("materials", m.cost);
  for (const h of pb.hardware || []) { h.cost = Number(h.sell) > 0 ? Number(h.sell) : up(h.cat === "motor" || h.cat === "access" ? "motors" : "hardware", h.cost); delete h.sell; }
  for (const l of pb.labour || []) { l.rate = Number(l.sell) > 0 ? Number(l.sell) : up("labour", l.rate); delete l.sell; }
  for (const f of pb.finishes || []) { f.perM2 = up("finish", f.perM2); f.perKg = up("finish", f.perKg); f.min = up("finish", f.min); }
  for (const k of Object.keys(mk)) mk[k] = 0;
  if (pb.settings) pb.settings.minMargin = null;
  return d;
}

export async function readData(): Promise<any | null> {
  const b = await bucket();
  // every save also writes a dated copy; the newest one is read, because a file
  // name that is new each time can never be served stale from the storage cache
  const { data: list } = await b.list("history", { limit: 1, sortBy: { column: "name", order: "desc" } });
  const latest = list && list[0] && list[0].name.endsWith(".json") ? `history/${list[0].name}` : FILE;
  const { data, error } = await b.download(latest);
  if (error || !data) {
    const old = await b.download(FILE);
    return old.data ? JSON.parse(await old.data.text()) : null;
  }
  return JSON.parse(await data.text());
}

export async function writeData(body: any) {
  const b = await bucket();
  const json = JSON.stringify(body);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const put = (name: string) => b.upload(name, new Blob([json], { type: "application/json" }), { upsert: true, contentType: "application/json", cacheControl: "0" });
  const main = await put(FILE);
  if (main.error) throw new Error(main.error.message);
  await put(`history/${stamp}.json`);
}

/* quotes the technicians make, one file each, so the CEO dashboard sees them all */
const QID = /^[a-z0-9]{4,16}$/;
export async function saveQuote(q: any) {
  if (!q || !QID.test(String(q.id || ""))) throw new Error("Bad quote");
  const b = await bucket();
  const { error } = await b.upload(`quotes/${q.id}.json`, new Blob([JSON.stringify(q)], { type: "application/json" }), { upsert: true, contentType: "application/json", cacheControl: "0" });
  if (error) throw new Error(error.message);
}
export async function deleteQuote(id: string) {
  if (!QID.test(id)) throw new Error("Bad quote");
  const b = await bucket();
  await b.remove([`quotes/${id}.json`]);
}
export async function listQuotes() {
  const b = await bucket();
  const { data } = await b.list("quotes", { limit: 300, sortBy: { column: "updated_at", order: "desc" } });
  const files = (data || []).filter((f) => f.name.endsWith(".json"));
  const out = await Promise.all(files.map(async (f) => {
    const { data: blob } = await b.download(`quotes/${f.name}`);
    try { return blob ? JSON.parse(await blob.text()) : null; } catch { return null; }
  }));
  return out.filter(Boolean);
}

export async function listHistory() {
  const b = await bucket();
  const { data } = await b.list("history", { limit: 40, sortBy: { column: "name", order: "desc" } });
  return (data || []).map((f) => f.name);
}

export async function readHistory(name: string) {
  if (!/^[\w-]+\.json$/.test(name)) throw new Error("Bad name");
  const b = await bucket();
  const { data, error } = await b.download(`history/${name}`);
  if (error || !data) throw new Error("Not found");
  return JSON.parse(await data.text());
}

/* Apex's client list, brought in from AroFlo on the CEO dashboard. One private
   file; the tablets only ever get the few matches for what they type. */
let clientCache: { at: number; list: any[] } | null = null;
export async function saveClients(list: any[]) {
  const b = await bucket();
  const { error } = await b.upload("clients.json", new Blob([JSON.stringify(list)], { type: "application/json" }), { upsert: true, contentType: "application/json", cacheControl: "0" });
  if (error) throw new Error(error.message);
  clientCache = { at: Date.now(), list };
}
export async function findClients(q: string) {
  if (!clientCache || Date.now() - clientCache.at > 300_000) {
    const b = await bucket();
    const { data } = await b.download("clients.json");
    clientCache = { at: Date.now(), list: data ? JSON.parse(await data.text()) : [] };
  }
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const hay = (c: any) => `${c.name} ${c.contact} ${c.address} ${c.phone} ${c.email} ${c.code}`.toLowerCase();
  return clientCache.list.filter((c) => { const h = hay(c); return words.every((w) => h.includes(w)); }).slice(0, 8);
}

/* links sent to customers: a frozen copy of a quote or invoice they can open,
   sign and pay from their phone, without the team password */
const TOKEN = /^[A-Za-z0-9]{20,40}$/;
export async function saveShare(token: string, data: any) {
  if (!TOKEN.test(token)) throw new Error("Bad link");
  const b = await bucket();
  const { error } = await b.upload(`shares/${token}.json`, new Blob([JSON.stringify(data)], { type: "application/json" }), { upsert: true, contentType: "application/json", cacheControl: "0" });
  if (error) throw new Error(error.message);
}
export async function readShare(token: string) {
  if (!TOKEN.test(token)) return null;
  const b = await bucket();
  const { data } = await b.download(`shares/${token}.json`);
  if (!data) return null;
  const d = JSON.parse(await data.text());
  // the signature is its own file, written once, so a cached copy of the link can never hide it
  const signed = await b.download(`signed/${token}.json`);
  if (signed.data) d.accepted = JSON.parse(await signed.data.text());
  return d;
}
export async function saveSigned(token: string, accepted: any) {
  if (!TOKEN.test(token)) throw new Error("Bad link");
  const b = await bucket();
  const { error } = await b.upload(`signed/${token}.json`, new Blob([JSON.stringify(accepted)], { type: "application/json" }), { upsert: false, contentType: "application/json", cacheControl: "0" });
  if (error && !/exists|duplicate/i.test(error.message)) throw new Error(error.message);
}
export async function readQuote(id: string) {
  if (!QID.test(id)) return null;
  const b = await bucket();
  const { data } = await b.download(`quotes/${id}.json`);
  return data ? JSON.parse(await data.text()) : null;
}

/* stock on the shelf and supplier bills: small JSON files, read fresh each time */
async function readJSON(name: string, fallback: any) {
  const b = await bucket();
  const { data } = await b.download(name);
  return data ? JSON.parse(await data.text()) : fallback;
}
async function writeJSON(name: string, value: any) {
  const b = await bucket();
  const { error } = await b.upload(name, new Blob([JSON.stringify(value)], { type: "application/json" }), { upsert: true, contentType: "application/json", cacheControl: "0" });
  if (error) throw new Error(error.message);
}
type Stock = { items: Record<string, { qty: number; min: number }>; log: any[] };
export const readStock = async (): Promise<Stock> => readJSON("stock/stock.json", { items: {}, log: [] });
const lowOf = (s: Stock) => Object.entries(s.items).filter(([, v]) => v.min > 0 && v.qty <= v.min).map(([id, v]) => ({ id, qty: v.qty, min: v.min }));
/* parts taken for a job (negative) or received from a supplier (positive); only items the office tracks */
export async function moveStock(lines: { id: string; qty: number }[], why: string, who = "") {
  const s = await readStock();
  for (const l of lines) {
    const it = s.items[l.id]; const q = Number(l.qty) || 0;
    if (!it || !q) continue;
    it.qty = Math.round((it.qty + q) * 100) / 100;
    s.log.unshift({ at: Date.now(), id: l.id, qty: q, why: String(why).slice(0, 120), who: String(who).slice(0, 60) });
  }
  s.log = s.log.slice(0, 300);
  await writeJSON("stock/stock.json", s);
  return { items: s.items, low: lowOf(s) };
}
export async function setStock(id: string, qty: number | null, min: number | null) {
  const s = await readStock();
  if (qty === null && min === null) delete s.items[id];
  else {
    const it = (s.items[id] ||= { qty: 0, min: 0 });
    if (qty !== null) { s.log.unshift({ at: Date.now(), id, qty: qty - it.qty, why: "Counted by the office" }); it.qty = qty; }
    if (min !== null) it.min = min;
  }
  s.log = s.log.slice(0, 300);
  await writeJSON("stock/stock.json", s);
  return { items: s.items, low: lowOf(s) };
}
export const stockLow = async () => lowOf(await readStock());
export const readBills = async (): Promise<any[]> => readJSON("stock/bills.json", []);
export async function saveBill(bill: any) {
  const list = await readBills();
  list.unshift(bill);
  await writeJSON("stock/bills.json", list.slice(0, 2000));
}

/* the job board: jobs brought in from the old system, with their status */
export const readJobs = async (): Promise<any[]> => readJSON("jobs/jobs.json", []);
export const writeJobs = async (list: any[]) => writeJSON("jobs/jobs.json", list.slice(0, 5000));

/* sample data for showing the system: quotes with ids starting "smpl", bills from
   "Sample" suppliers and shelf counts marked "Sample count". One call removes it all. */
export async function sampleStock(id: string, qty: number, min: number) {
  const s = await readStock();
  s.items[id] = { qty, min };
  s.log.unshift({ at: Date.now(), id, qty, why: "Sample count" });
  await writeJSON("stock/stock.json", s);
}
export async function clearSamples() {
  const b = await bucket();
  const { data } = await b.list("quotes", { limit: 1000 });
  const gone = (data || []).filter((f) => f.name.startsWith("smpl")).map((f) => `quotes/${f.name}`);
  if (gone.length) await b.remove(gone);
  const bills = await readBills();
  await writeJSON("stock/bills.json", bills.filter((x) => !String(x.supplier || "").startsWith("Sample")));
  const s = await readStock();
  for (const id of Object.keys(s.items)) {
    const moves = s.log.filter((l) => l.id === id);
    if (moves.length && moves.every((l) => l.why === "Sample count" || /^Used on Q-S/.test(l.why))) delete s.items[id];
  }
  s.log = s.log.filter((l) => l.why !== "Sample count" && !/^Used on Q-S/.test(l.why));
  await writeJSON("stock/stock.json", s);
  return gone.length;
}

/* ---------- scheduling and dispatch ----------
   Every booked visit is its own small file: visits/<date>_<id>~<time saved>.json
   (date "0000-00-00" while it still needs a day). Each save writes a new file name
   and removes the old one, so a tablet can never be handed a stale copy, and the
   date in the name lets a week be found without opening every job ever booked. */
const NODATE = "0000-00-00";
const vday = (d: any) => (/^\d{4}-\d{2}-\d{2}$/.test(String(d || "")) ? String(d) : NODATE);
type VFile = { name: string; date: string; id: string; ts: number };
function vparse(name: string): VFile | null {
  const m = /^(\d{4}-\d{2}-\d{2})_([a-z0-9]+)~(\d+)\.json$/.exec(name);
  return m ? { name, date: m[1], id: m[2], ts: +m[3] } : null;
}
async function vlist(prefix: string): Promise<VFile[]> {
  const b = await bucket(), out: VFile[] = [];
  for (let offset = 0; offset < 20000; offset += 1000) {
    const { data } = await b.list("visits", { limit: 1000, offset, search: prefix, sortBy: { column: "name", order: "asc" } });
    for (const f of data || []) { const v = vparse(f.name); if (v && v.name.startsWith(prefix)) out.push(v); }
    if (!data || data.length < 1000) break;
  }
  return out;
}
function newest(files: VFile[]) {
  const best = new Map<string, VFile>();
  for (const f of files) { const o = best.get(f.id); if (!o || f.ts > o.ts) best.set(f.id, f); }
  return Array.from(best.values());
}
async function vread(files: VFile[]) {
  const b = await bucket();
  const got = await Promise.all(files.map(async (f) => { const { data } = await b.download(`visits/${f.name}`); return data ? JSON.parse(await data.text()) : null; }));
  return got.filter(Boolean);
}
const months = (from: string, to: string) => {
  const out: string[] = []; let [y, m] = from.split("-").map(Number); const [ty, tm] = to.split("-").map(Number);
  while ((y < ty || (y === ty && m <= tm)) && out.length < 14) { out.push(`${y}-${String(m).padStart(2, "0")}`); m++; if (m > 12) { m = 1; y++; } }
  return out;
};
export async function listVisits(from: string, to: string, undated = false) {
  const f = vday(from), t = vday(to);
  const sets = f === NODATE || t === NODATE ? [] : await Promise.all(months(f, t).map(vlist));
  let files = newest(sets.flat()).filter((v) => v.date >= f && v.date <= t);
  if (undated) files = files.concat(newest(await vlist(NODATE)));
  const list = await vread(files);
  return list.sort((a: any, b: any) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
}
async function vfind(id: string, date: string) {
  const files = newest(await vlist(`${vday(date)}_${id}~`));
  return files[0] || null;
}
const clip = (v: any, n: number) => String(v ?? "").slice(0, n);
export const VSTEPS = ["booked", "onway", "onsite", "done", "cancelled"];
function cleanVisit(v: any) {
  return { id: /^[a-z0-9]{4,20}$/.test(v.id) ? v.id : Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    code: clip(v.code, 30), qid: clip(v.qid, 30), kind: clip(v.kind, 30), client: clip(v.client, 120), contact: clip(v.contact, 80), address: clip(v.address, 200), phone: clip(v.phone, 40),
    desc: clip(v.desc, 1200), tech: clip(v.tech, 60), helper: clip(v.helper, 60), date: vday(v.date) === NODATE ? "" : vday(v.date), start: /^\d{2}:\d{2}$/.test(v.start) ? v.start : "08:00",
    hours: Math.min(12, Math.max(0.5, Number(v.hours) || 2)), status: VSTEPS.includes(v.status) ? v.status : "booked", office: clip(v.office, 600),
    notes: clip(v.notes, 2000), log: (Array.isArray(v.log) ? v.log : []).slice(-60), created: Number(v.created) || Date.now() };
}
async function vwrite(v: any, old: VFile | null) {
  const b = await bucket(); const ts = Date.now(); v.updated = ts;
  const name = `${vday(v.date)}_${v.id}~${ts}.json`;
  const { error } = await b.upload(`visits/${name}`, new Blob([JSON.stringify(v)], { type: "application/json" }), { contentType: "application/json", cacheControl: "0" });
  if (error) throw new Error(error.message);
  if (old) await b.remove([`visits/${old.name}`]);
  return v;
}
/* the office books or changes a visit (a moved day is found from the day it was on) */
export async function saveVisit(input: any, who: string) {
  const v = cleanVisit(input || {});
  const old = input?.id ? await vfind(v.id, input.was ?? input.date) : null;
  if (old) {
    const prev = (await vread([old]))[0] || {};
    v.log = prev.log || [];
    v.created = prev.created || v.created;
    if (prev.tech !== v.tech || prev.date !== v.date || prev.start !== v.start) v.log.push({ at: Date.now(), who, what: `Booked for ${v.tech || "nobody yet"}${v.date ? ` on ${v.date} at ${v.start}` : ""}` });
    if (prev.status !== v.status) v.log.push({ at: Date.now(), who, what: `Marked ${v.status}` });
  } else v.log = [{ at: Date.now(), who, what: `Booked for ${v.tech || "nobody yet"}${v.date ? ` on ${v.date} at ${v.start}` : ""}` }];
  return vwrite(v, old);
}
export async function deleteVisit(id: string, date: string) {
  const f = await vfind(id, date);
  if (f) await (await bucket()).remove([`visits/${f.name}`]);
  return !!f;
}
/* a technician moves the job along from the tablet: on the way, on site, done */
export async function stepVisit(id: string, date: string, status: string, who: string, note: string) {
  const f = await vfind(id, date);
  if (!f) return null;
  const v = (await vread([f]))[0];
  if (!v) return null;
  const words: Record<string, string> = { booked: "Back to booked", onway: "On the way", onsite: "Arrived on site", done: "Finished the job" };
  if (status && words[status]) { v.status = status; v.log = (v.log || []).concat({ at: Date.now(), who: clip(who, 60), what: words[status] + (note ? `: ${clip(note, 400)}` : "") }); }
  else if (note) v.log = (v.log || []).concat({ at: Date.now(), who: clip(who, 60), what: `Note: ${clip(note, 400)}` });
  if (status === "done" && note) v.notes = clip([v.notes, note].filter(Boolean).join("\n"), 2000);
  v.log = v.log.slice(-60);
  return vwrite(v, f);
}
