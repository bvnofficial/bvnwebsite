import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { isAdminAuthorized } from "@/lib/blog-pipeline";

// ─────────────────────────────────────────────────────────────
// Review + approval API for the blog pipeline (admin secret only).
//
//   GET  → list drafts and scheduled posts awaiting review
//   POST → { slug, action, scheduledFor? }
//          action = "schedule" | "publish" | "reject"
// ─────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "supabase admin not configured" }, { status: 500 });
  }

  const { data, error } = await admin
    .from("blog_posts")
    .select("slug, title, category, excerpt, status, scheduled_for, read_time, sections, updated_at")
    .in("status", ["draft", "scheduled"])
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, posts: data ?? [] });
}

export async function POST(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "supabase admin not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const slug: string | undefined = body?.slug;
  const action: string | undefined = body?.action;
  if (!slug || !action) {
    return NextResponse.json({ ok: false, error: "slug and action are required" }, { status: 400 });
  }

  if (action === "reject") {
    const { error } = await admin.from("blog_posts").delete().eq("slug", slug);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, slug, action });
  }

  if (action === "schedule") {
    const scheduledFor = body?.scheduledFor;
    if (!scheduledFor) {
      return NextResponse.json({ ok: false, error: "scheduledFor is required to schedule" }, { status: 400 });
    }
    const { error } = await admin
      .from("blog_posts")
      .update({ status: "scheduled", scheduled_for: new Date(scheduledFor).toISOString() })
      .eq("slug", slug);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, slug, action, scheduledFor });
  }

  if (action === "publish") {
    const { error } = await admin
      .from("blog_posts")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("slug", slug);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    return NextResponse.json({ ok: true, slug, action });
  }

  return NextResponse.json({ ok: false, error: `unknown action: ${action}` }, { status: 400 });
}
