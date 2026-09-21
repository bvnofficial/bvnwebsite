import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Returns the logged-in user's existing PAID certificate for a course (if any),
// so the claim page can show "you already have this" instead of asking them to
// pay again. Matches by user id (credits) or their account email (any provider).
export async function POST(req: Request) {
  try {
    const { courseSlug } = await req.json();
    if (!courseSlug) return NextResponse.json({ found: false });

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ found: false });

    const admin = createAdminClient();
    if (!admin) return NextResponse.json({ found: false });

    const conds = [`provider_ref.eq.${user.id}`];
    if (user.email) conds.push(`student_email.eq.${user.email.toLowerCase()}`);

    const { data, error } = await admin
      .from("course_completions")
      .select("id,created_at")
      .eq("course_slug", String(courseSlug))
      .eq("paid", true)
      .or(conds.join(","))
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data?.id) return NextResponse.json({ found: false });
    return NextResponse.json({ found: true, id: data.id });
  } catch {
    return NextResponse.json({ found: false });
  }
}
