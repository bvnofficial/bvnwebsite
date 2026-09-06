import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { courses } from "@/lib/courses";

// Full bvnofficial.com admin report for the BVN OS "bvnofficial" tab.
// Aggregates registered users, course certificates + revenue, credits wallet,
// job leads, blog, and on-site SEO. Gated by CERT_ADMIN_SECRET (header or ?secret).
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

  const report: Record<string, unknown> = { generatedAt: new Date().toISOString() };

  // ── Registered users (Supabase auth) ──
  try {
    let total = 0;
    let recent: Array<{ email: string | undefined; created_at: string | undefined; confirmed: boolean }> = [];
    for (let page = 1; page <= 30; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error || !data?.users?.length) break;
      total += data.users.length;
      if (page === 1) {
        recent = data.users.slice(0, 20).map((u) => ({ email: u.email, created_at: u.created_at, confirmed: !!u.email_confirmed_at }));
      }
      if (data.users.length < 200) break;
    }
    report.users = { total, recent };
  } catch {
    report.users = { total: 0, recent: [], error: true };
  }

  // ── Certificates + revenue ──
  try {
    const { data: paid } = await admin
      .from("course_completions")
      .select("course_title,course_slug,student_name,student_email,amount,currency,provider,paid_at")
      .eq("paid", true)
      .order("paid_at", { ascending: false })
      .limit(2000);
    const { count: pendingCount } = await admin
      .from("course_completions")
      .select("*", { count: "exact", head: true })
      .eq("provider", "qrph")
      .eq("paid", false);

    const rows = paid || [];
    let revenuePHP = 0;
    let revenueUSD = 0;
    const byCourse: Record<string, { title: string; issued: number; php: number; usd: number }> = {};
    for (const r of rows) {
      const amt = Number(r.amount) || 0;
      const usd = String(r.currency || "").toUpperCase() === "USD";
      if (usd) revenueUSD += amt; else revenuePHP += amt;
      const k = r.course_slug || r.course_title || "?";
      byCourse[k] = byCourse[k] || { title: r.course_title || k, issued: 0, php: 0, usd: 0 };
      byCourse[k].issued++;
      if (usd) byCourse[k].usd += amt; else byCourse[k].php += amt;
    }
    report.certificates = {
      issued: rows.length,
      pending: pendingCount || 0,
      revenuePHP,
      revenueUSD,
      byCourse: Object.values(byCourse).sort((a, b) => b.issued - a.issued),
      recent: rows.slice(0, 15).map((r) => ({
        name: r.student_name, email: r.student_email, course: r.course_title,
        amount: r.amount, currency: r.currency, provider: r.provider, paid_at: r.paid_at,
      })),
    };
  } catch {
    report.certificates = { issued: 0, pending: 0, revenuePHP: 0, revenueUSD: 0, byCourse: [], recent: [], error: true };
  }

  // ── Credits wallet ──
  try {
    const { data: wallets } = await admin.from("wallets").select("balance").limit(5000);
    const balance = (wallets || []).reduce((s, w) => s + (Number(w.balance) || 0), 0);
    const { data: tx } = await admin.from("credit_transactions").select("amount,kind").limit(5000);
    let topup = 0;
    let spend = 0;
    for (const t of tx || []) {
      const a = Number(t.amount) || 0;
      if (t.kind === "topup") topup += a;
      else if (t.kind === "spend") spend += Math.abs(a);
    }
    report.credits = { walletsCount: (wallets || []).length, balance, topupTotal: topup, spendTotal: spend, txCount: (tx || []).length };
  } catch {
    report.credits = { walletsCount: 0, balance: 0, topupTotal: 0, spendTotal: 0, txCount: 0, error: true };
  }

  // ── Job leads (the /leads dashboard) ──
  try {
    const { data } = await admin.from("lead_dashboard").select("data").eq("id", 1).maybeSingle();
    const d = (data?.data || {}) as { jobs?: Array<{ status?: string }> };
    const jobs = Array.isArray(d.jobs) ? d.jobs : [];
    report.leads = {
      total: jobs.length,
      applied: jobs.filter((j) => j.status === "applied" || j.status === "replied").length,
    };
  } catch {
    report.leads = { total: 0, applied: 0 };
  }

  // ── Blog ──
  try {
    const { count } = await admin.from("blog_posts").select("*", { count: "exact", head: true });
    report.blog = { total: count || 0 };
  } catch {
    report.blog = { total: 0 };
  }

  // ── On-site SEO ──
  report.seo = {
    coursesPublished: courses.length,
    blogPosts: (report.blog as { total: number }).total,
    note: "On-site counts. Live rankings, impressions and clicks need Google Search Console or Ahrefs connected.",
  };

  return NextResponse.json(report);
}
