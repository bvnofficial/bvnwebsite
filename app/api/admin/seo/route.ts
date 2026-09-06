import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { contentPlan } from "@/lib/content-plan";
import { writeDraftFromPlan } from "@/lib/blog-pipeline";

// SEO Boost admin API for the BVN OS SEO tab. Gated by CERT_ADMIN_SECRET (the
// same secret the BVN OS admin console already uses).
//   POST { action: "deploy" }             → write the next planned post + PUBLISH it live
//   POST { action: "publish", slug }      → publish an existing draft
//   POST { action: "unpublish", slug }    → pull a post back to draft
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;

function authed(req: Request, url: URL) {
  const want = process.env.CERT_ADMIN_SECRET;
  if (!want) return false;
  const got = req.headers.get("x-admin-secret") || url.searchParams.get("secret") || "";
  return got === want;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!authed(req, url)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });

  let body: { action?: string; slug?: string } = {};
  try { body = await req.json(); } catch {}
  const action = body.action || "deploy";
  const slug = String(body.slug || "");

  if (action === "publish" || action === "unpublish") {
    if (!slug) return NextResponse.json({ ok: false, error: "missing slug" }, { status: 400 });
    const patch = action === "publish"
      ? { status: "published", published_at: new Date().toISOString() }
      : { status: "draft" };
    const { error } = await admin.from("blog_posts").update(patch).eq("slug", slug);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    revalidatePath("/blog"); revalidatePath(`/blog/${slug}`);
    return NextResponse.json({ ok: true, slug, status: patch.status });
  }

  // action: "deploy" — write the next planned post and publish it live.
  const { data: existing, error: exErr } = await admin.from("blog_posts").select("slug");
  if (exErr) return NextResponse.json({ ok: false, error: exErr.message }, { status: 500 });
  const have = new Set((existing ?? []).map((r: { slug: string }) => r.slug));
  const next = contentPlan.find((p) => !have.has(p.slug));
  if (!next) return NextResponse.json({ ok: false, done: true, error: "Content plan is fully published — add more topics to the plan." });

  let draft;
  try { draft = await writeDraftFromPlan(next); }
  catch (err) { return NextResponse.json({ ok: false, slug: next.slug, error: (err as Error)?.message || "draft failed" }, { status: 502 }); }

  const now = new Date().toISOString();
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
    status: "published",
    published_at: now,
  });
  if (insErr) return NextResponse.json({ ok: false, slug: next.slug, error: insErr.message }, { status: 500 });

  revalidatePath("/blog");
  revalidatePath(`/blog/${next.slug}`);
  return NextResponse.json({ ok: true, slug: next.slug, title: next.title, published: true });
}
