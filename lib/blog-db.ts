import { createClient } from "@supabase/supabase-js";
import type { BlogPost, ContentSection } from "@/lib/blog-posts";

// ─────────────────────────────────────────────────────────────
// Supabase-backed blog access layer.
// Mirrors the helpers in lib/blog-posts.ts (getBlogPost, byCategory)
// but reads from the public.blog_posts table so posts can be added
// and scheduled without a code deploy.
//
// Reads use the anon key + RLS, which only ever returns PUBLISHED
// rows — drafts and scheduled posts are never exposed to the public.
// ─────────────────────────────────────────────────────────────

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

// Raw DB row → the BlogPost shape the pages already expect.
function rowToPost(r: any): BlogPost {
  const when = r.published_at ?? r.created_at ?? new Date().toISOString();
  const d = new Date(when);
  return {
    slug: r.slug,
    title: r.title,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    category: r.category,
    readTime: r.read_time ?? "",
    date: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    dateISO: d.toISOString().slice(0, 10),
    excerpt: r.excerpt ?? "",
    keywords: (r.keywords ?? []) as string[],
    sections: (r.sections ?? []) as ContentSection[],
  };
}

// All published posts, newest first.
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await db()
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("[blog-db] getPublishedPosts:", error.message);
    return [];
  }
  return (data ?? []).map(rowToPost);
}

// One published post by slug, or null.
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await db()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    console.error("[blog-db] getBlogPostBySlug:", error.message);
    return null;
  }
  return data ? rowToPost(data) : null;
}

// Published posts in a category (newest first).
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const { data, error } = await db()
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .order("published_at", { ascending: false });
  if (error) {
    console.error("[blog-db] getBlogPostsByCategory:", error.message);
    return [];
  }
  return (data ?? []).map(rowToPost);
}

// Related posts: same category, excluding the current slug.
export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const { data, error } = await db()
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("category", post.category)
    .neq("slug", post.slug)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[blog-db] getRelatedPosts:", error.message);
    return [];
  }
  return (data ?? []).map(rowToPost);
}

// Slugs for generateStaticParams / sitemap.
export async function getPublishedSlugs(): Promise<string[]> {
  const { data, error } = await db()
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");
  if (error) {
    console.error("[blog-db] getPublishedSlugs:", error.message);
    return [];
  }
  return (data ?? []).map((r: any) => r.slug as string);
}
