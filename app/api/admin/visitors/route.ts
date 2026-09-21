import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Visitor log for BVN OS. Secret-gated (same CERT_ADMIN_SECRET as the other
// admin routes). Returns the all-time count + recent views; BVN OS computes the
// stats (today, uniques, top pages/countries) client-side.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || req.headers.get("x-admin-secret") || "";
  if (!process.env.CERT_ADMIN_SECRET || secret !== process.env.CERT_ADMIN_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const { data: rows, error } = await admin
    .from("page_views")
    .select("path,referrer,country,city,visitor_id,created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { count } = await admin.from("page_views").select("id", { count: "exact", head: true });

  return NextResponse.json({ total: count || 0, rows: rows || [] });
}
