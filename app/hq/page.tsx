import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { isAdmin } from "@/lib/admin";

// /hq: the remote door to BVN Headquarters, which runs on Benjamin's PC.
// Two locks: the site admin login here, then the HQ password on the PC.
// The client files never leave the PC; this page only forwards to the tunnel.

export const dynamic = "force-dynamic";
export const metadata = {
  title: "HQ | BVN",
  robots: { index: false, follow: false },
};

const FRESH_MS = 10 * 60 * 1000;

export default async function HqPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/hq");
  if (!isAdmin(user.email)) redirect("/dashboard");

  const db = createAdminClient();
  let url = "";
  let seenAt: string | null = null;
  if (db) {
    const { data } = await db.from("hq_beacon").select("url, seen_at").eq("id", 1).maybeSingle();
    if (data) {
      url = data.url;
      seenAt = data.seen_at;
    }
  }
  const fresh = !!seenAt && Date.now() - new Date(seenAt).getTime() < FRESH_MS;
  if (fresh && /^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/.test(url)) redirect(url);

  const last = seenAt
    ? new Date(seenAt).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" })
    : "never";

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0a0e15", color: "#e6eaf1", padding: 24 }}>
      <div style={{ maxWidth: 440, background: "#111723", border: "1px solid #222b3b", borderRadius: 14, padding: 28 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, display: "grid", placeItems: "center", background: "linear-gradient(135deg,#f28c28,#d2621a)", color: "#1a0e02", fontWeight: 800, marginBottom: 16 }}>
          HQ
        </div>
        <h1 style={{ fontSize: 18, margin: "0 0 6px" }}>HQ is offline</h1>
        <p style={{ color: "#8f9bb0", fontSize: 14, margin: "0 0 10px" }}>
          The PC has not checked in for over 10 minutes. HQ runs on the PC, so the PC has to be on with HQ started.
        </p>
        <p style={{ color: "#8f9bb0", fontSize: 14, margin: 0 }}>Last check in: {last} (Manila time).</p>
      </div>
    </main>
  );
}
