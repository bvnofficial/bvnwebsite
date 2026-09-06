import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendCertificateEmail } from "@/lib/certificate-email";
import type { CompletionRow } from "@/lib/certificate";

// Admin API for the QR certificate approvals queue (used by the BVN OS Approvals
// tab). Gated by CERT_ADMIN_SECRET, passed as the x-admin-secret header or a
// ?secret= query param (server-to-server from BVN OS).
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

  const { data: pending } = await admin
    .from("course_completions")
    .select("id,course_slug,course_title,student_name,student_email,provider_ref,amount,currency,created_at")
    .eq("provider", "qrph")
    .eq("paid", false)
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: approved } = await admin
    .from("course_completions")
    .select("id,course_title,student_name,student_email,paid_at")
    .eq("provider", "qrph")
    .eq("paid", true)
    .order("paid_at", { ascending: false })
    .limit(25);

  return NextResponse.json({ pending: pending || [], approved: approved || [] });
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!authed(req, url)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "not configured" }, { status: 503 });

  let body: { id?: string; action?: string } = {};
  try { body = await req.json(); } catch {}
  const id = String(body.id || "");
  const action = body.action === "reject" ? "reject" : "approve";
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  if (action === "reject") {
    await admin.from("course_completions").delete().eq("id", id).eq("paid", false);
    return NextResponse.json({ ok: true, rejected: true });
  }

  // Approve → flip to paid, then issue the certificate by email.
  const { data: row } = await admin.from("course_completions").select("*").eq("id", id).maybeSingle();
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (row.paid) return NextResponse.json({ ok: true, already: true, certId: id });

  const paidAt = new Date().toISOString();
  const { error } = await admin.from("course_completions").update({ paid: true, paid_at: paidAt }).eq("id", id);
  if (error) {
    console.error("cert approve update error:", error.message);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  let emailed = false;
  try {
    emailed = await sendCertificateEmail({ ...(row as CompletionRow), paid: true, paid_at: paidAt });
  } catch (e) {
    console.error("cert approve email error:", e);
  }
  return NextResponse.json({ ok: true, certId: id, emailed });
}
