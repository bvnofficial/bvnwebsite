import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { isCronAuthorized } from "@/lib/blog-pipeline";

// ─────────────────────────────────────────────────────────────
// Publisher. Flips any scheduled posts whose time has arrived to
// "published", then revalidates exactly those pages plus the blog
// index so they appear immediately. Runs daily on a cron.
// ─────────────────────────────────────────────────────────────

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "supabase admin not configured" }, { status: 500 });
  }

  const { data, error } = await admin.rpc("publish_due_blog_posts");
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const slugs = (data ?? []).map((r: any) => r.slug as string);

  if (slugs.length > 0) {
    revalidatePath("/blog");
    for (const slug of slugs) revalidatePath(`/blog/${slug}`);
  }

  return NextResponse.json({ ok: true, published: slugs, count: slugs.length });
}
