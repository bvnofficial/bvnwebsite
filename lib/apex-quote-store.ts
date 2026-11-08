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
