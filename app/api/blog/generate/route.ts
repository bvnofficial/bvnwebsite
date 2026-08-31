import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { contentPlan } from "@/lib/content-plan";
import { isCronAuthorized, writeDraftFromPlan } from "@/lib/blog-pipeline";

// ─────────────────────────────────────────────────────────────
// Draft generator. Picks the next planned post that is not yet in
// the blog_posts table, asks Claude to write it, and saves it as a
// DRAFT for human review. Runs on a cron (see vercel.json) and can
// also be triggered manually with the admin secret.
//
//   curl -X POST https://www.bvnofficial.com/api/blog/generate \
//        -H "x-admin-secret: <BLOG_ADMIN_SECRET>"
// ─────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "supabase admin not configured" }, { status: 500 });
  }

  // First, publish any scheduled posts that are due. On Hobby we run a single
  // daily cron, so the drafter also handles publishing to stay within cron limits.
  try {
    const { data: due } = await admin.rpc("publish_due_blog_posts");
    const dueSlugs = (due ?? []).map((r: any) => r.slug as string);
    if (dueSlugs.length > 0) {
      revalidatePath("/blog");
      for (const slug of dueSlugs) revalidatePath(`/blog/${slug}`);
    }
  } catch (e) {
    console.error("[generate] publish-due step failed:", e);
  }

  // Which planned posts already exist (in any status)?
  const { data: existing, error: exErr } = await admin.from("blog_posts").select("slug");
  if (exErr) {
    return NextResponse.json({ ok: false, error: exErr.message }, { status: 500 });
  }
  const have = new Set((existing ?? []).map((r: any) => r.slug));

  const next = contentPlan.find((p) => !have.has(p.slug));
  if (!next) {
    return NextResponse.json({ ok: true, done: true, message: "Content plan is fully drafted." });
  }

  let draft;
  try {
    draft = await writeDraftFromPlan(next);
  } catch (err: any) {
    return NextResponse.json({ ok: false, slug: next.slug, error: err?.message ?? "draft failed" }, { status: 502 });
  }

  const { error: insErr } = await admin.from("blog_posts").insert({
    slug: next.slug,
    title: next.title,
    meta_title: next.metaTitle,
    meta_description: next.metaDescription,
    category: next.category,
    read_time: draft.readTime,
    excerpt: draft.excerpt,
    keywords: next.keywords,
    sections: draft.sections,
    status: "draft",
  });

  if (insErr) {
    return NextResponse.json({ ok: false, slug: next.slug, error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, created: next.slug, title: next.title, status: "draft" });
}
