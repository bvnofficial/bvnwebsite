import { NextResponse } from "next/server";
import { blogPosts } from "@/lib/blog-posts";
import { createAdminClient } from "@/utils/supabase/admin";

// ─────────────────────────────────────────────────────────────
// One-time (idempotent) migration: copy the 57 static posts from
// lib/blog-posts.ts into the public.blog_posts table.
//
// Run once after creating the table:
//   curl -X POST https://www.bvnofficial.com/api/blog/seed \
//        -H "x-seed-secret: <BLOG_ADMIN_SECRET>"
//
// Upserts on slug, so re-running is safe and just refreshes content.
// Guarded by BLOG_ADMIN_SECRET so the public can never trigger it.
// ─────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = req.headers.get("x-seed-secret");
  if (!process.env.BLOG_ADMIN_SECRET || secret !== process.env.BLOG_ADMIN_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "supabase admin not configured (check env vars)" },
      { status: 500 }
    );
  }

  const rows = blogPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    meta_title: p.metaTitle,
    meta_description: p.metaDescription,
    category: p.category,
    read_time: p.readTime,
    excerpt: p.excerpt,
    keywords: p.keywords,
    sections: p.sections,
    status: "published",
    published_at: new Date(p.dateISO).toISOString(),
  }));

  const { error, count } = await admin
    .from("blog_posts")
    .upsert(rows, { onConflict: "slug", count: "exact" });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, migrated: count ?? rows.length });
}
