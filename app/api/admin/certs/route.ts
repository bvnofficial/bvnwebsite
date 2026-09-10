import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Compact list of ALL course-certificate records (paid and unpaid), for the
// BVN OS "Payments" tab to reconcile against PayMongo. Gated by CERT_ADMIN_SECRET
// (x-admin-secret header or ?secret=), same as the other BVN OS admin routes.
function authed(req: Request, url: URL) {
  const want = process.env.CERT_ADMIN_SECRET;
  if (!want) return false;
  const got = req.headers.get("x-admin-secret") || url.searchParams.get("secret") || "";
  return got === want;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!authed(req, url)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const { data, error } = await admin
    .from("course_completions")
    .select(
      "id,course_slug,course_title,student_name,student_email,amount,currency,provider,provider_ref,paid,created_at,paid_at"
    )
    .order("created_at", { ascending: false })
    .limit(3000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ certs: data || [] });
}
