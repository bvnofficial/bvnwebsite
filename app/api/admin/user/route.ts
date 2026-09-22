import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

// Per-user detail for the BVN OS Users tab: wallet balance, credit history,
// certificates earned, and unlocked courses. Secret-gated (CERT_ADMIN_SECRET).
export const dynamic = "force-dynamic";

function authed(req: Request, url: URL) {
  const want = process.env.CERT_ADMIN_SECRET;
  const got = req.headers.get("x-admin-secret") || url.searchParams.get("secret") || "";
  return !!want && got === want;
}

async function findUserByEmail(admin: SupabaseClient, email: string) {
  const target = email.toLowerCase();
  for (let page = 1; page <= 25; page++) {
    const { data } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (!data || data.users.length === 0) break;
    const found = data.users.find((u) => (u.email || "").toLowerCase() === target);
    if (found) return found;
    if (data.users.length < 200) break;
  }
  return null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!authed(req, url)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const email = String(url.searchParams.get("email") || "").trim();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const user = await findUserByEmail(admin, email);
  const uid = user?.id || null;

  let balance = 0;
  let transactions: unknown[] = [];
  let entitlements: unknown[] = [];
  if (uid) {
    const { data: w } = await admin.from("wallets").select("balance").eq("user_id", uid).maybeSingle();
    balance = w?.balance ?? 0;
    const { data: tx } = await admin
      .from("credit_transactions")
      .select("amount,kind,description,created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(50);
    transactions = tx || [];
    const { data: ent } = await admin
      .from("entitlements")
      .select("item_id,credits_spent,created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(100);
    entitlements = ent || [];
  }

  // Certificates key off the email on the completion row (may exist even with no auth account).
  const { data: certs } = await admin
    .from("course_completions")
    .select("course_title,course_slug,amount,currency,provider,paid,paid_at,created_at")
    .ilike("student_email", email)
    .order("created_at", { ascending: false })
    .limit(100);

  return NextResponse.json({
    email: user?.email || email,
    userId: uid,
    created_at: user?.created_at || null,
    confirmed: !!user?.email_confirmed_at,
    last_sign_in: user?.last_sign_in_at || null,
    balance,
    transactions,
    entitlements,
    certificates: certs || [],
  });
}
