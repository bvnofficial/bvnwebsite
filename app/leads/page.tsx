import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { LEADS_COOKIE, tokenMatches, expectedToken } from "./auth";
import LeadsUnlock from "./LeadsUnlock";
import LeadsClient, { type LeadsData } from "./LeadsClient";
import { createAdminClient } from "@/utils/supabase/admin";

export const metadata = {
  title: "Leads — Sent & Follow-ups | BVN",
  robots: { index: false, follow: false }, // internal tool — never indexed
};

export const dynamic = "force-dynamic";

const EMPTY: LeadsData = { generatedAt: "", followUpDays: 5, stats: { sent: 0, pending: 0 }, sent: [], pending: [] };

async function loadLeads(): Promise<LeadsData> {
  // Live source: Supabase (kept fresh by the engine's autosync).
  const admin = createAdminClient();
  if (admin) {
    try {
      const { data } = await admin.from("lead_dashboard").select("data").eq("id", 1).maybeSingle();
      if (data?.data) return data.data as LeadsData;
    } catch {
      // table missing or unreachable — fall through to local file
    }
  }
  // Dev fallback: the local synced file.
  try {
    const file = path.join(process.cwd(), "data", "leads-data.json");
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return EMPTY;
  }
}

export default async function LeadsPage() {
  // Password gate (independent of Supabase user auth).
  if (!expectedToken()) return <LeadsUnlock notConfigured />;
  if (!tokenMatches(cookies().get(LEADS_COOKIE)?.value)) return <LeadsUnlock />;

  return <LeadsClient data={await loadLeads()} />;
}
