import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/lib/admin";
import { SCHEMATICS_HTML } from "../content";

// Serves the internal BVN Full Schematics document as raw HTML, gated to admins.
// The page at /admin/schematics embeds this in a full-screen iframe so the
// document's own styles stay isolated from the site. Never indexed.
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return new NextResponse("Not authorized", { status: 403 });
  }

  return new NextResponse(SCHEMATICS_HTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, no-store",
    },
  });
}
