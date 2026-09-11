import { createClient } from "@supabase/supabase-js";

// Service-role client — SERVER ONLY. Bypasses RLS. Never import into a client
// component. Used to read/write the lead_dashboard row that backs /leads.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Next.js instruments global fetch and caches GETs in its Data Cache, which
    // froze admin dashboards on a stale snapshot (route-level force-dynamic does
    // not override the Supabase client's own fetch). Force no-store so every
    // service-role read is live.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}
