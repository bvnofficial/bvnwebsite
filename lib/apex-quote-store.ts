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
  const up = (cat: string, v: any) => Math.round((Number(v) || 0) * (1 + (Number(mk[cat]) || 0) / 100) * 100) / 100;
  for (const m of pb.materials || []) m.cost = up("materials", m.cost);
  for (const h of pb.hardware || []) h.cost = up(h.cat === "motor" || h.cat === "access" ? "motors" : "hardware", h.cost);
  for (const l of pb.labour || []) l.rate = up("labour", l.rate);
  for (const f of pb.finishes || []) { f.perM2 = up("finish", f.perM2); f.perKg = up("finish", f.perKg); f.min = up("finish", f.min); }
  for (const k of Object.keys(mk)) mk[k] = 0;
  if (pb.settings) pb.settings.minMargin = null;
  return d;
}

export async function readData(): Promise<any | null> {
  const b = await bucket();
  const { data, error } = await b.download(FILE);
  if (error || !data) return null;
  return JSON.parse(await data.text());
}

export async function writeData(body: any) {
  const b = await bucket();
  const json = JSON.stringify(body);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const put = (name: string) => b.upload(name, new Blob([json], { type: "application/json" }), { upsert: true, contentType: "application/json" });
  const main = await put(FILE);
  if (main.error) throw new Error(main.error.message);
  await put(`history/${stamp}.json`);
}

/* quotes the technicians make, one file each, so the CEO dashboard sees them all */
const QID = /^[a-z0-9]{4,16}$/;
export async function saveQuote(q: any) {
  if (!q || !QID.test(String(q.id || ""))) throw new Error("Bad quote");
  const b = await bucket();
  const { error } = await b.upload(`quotes/${q.id}.json`, new Blob([JSON.stringify(q)], { type: "application/json" }), { upsert: true, contentType: "application/json" });
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
