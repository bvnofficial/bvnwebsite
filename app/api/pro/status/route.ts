import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Auth-dependent (reads cookies) — never prerender.
export const dynamic = "force-dynamic";

// Has the logged-in user already unlocked premium (paid with credits before)?
// Lets the /apps/pro page restore the unlock on any browser they sign into.
export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ owned: false, loggedIn: false });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ owned: false, loggedIn: true });
    }

    const { data } = await admin
      .from("entitlements")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_id", "bvn-pro")
      .maybeSingle();

    return NextResponse.json({ owned: Boolean(data), loggedIn: true });
  } catch (err) {
    console.error("Pro status route error:", err);
    return NextResponse.json({ owned: false, loggedIn: false });
  }
}
