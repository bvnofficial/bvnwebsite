import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Unlock premium document features with 1 wallet credit (1 credit = $1 = ₱60).
// Requires login. Spends atomically via spend_credits and records a "bvn-pro"
// entitlement — so /api/pro/status can restore the unlock on any browser the
// user logs into, without charging again.
const PRO_ITEM = "bvn-pro";

export async function POST() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to unlock with credits." }, { status: 401 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Credits are not configured yet." }, { status: 503 });
    }

    const { data: spend, error: spendErr } = await admin.rpc("spend_credits", {
      p_user: user.id,
      p_item: PRO_ITEM,
      p_amount: 1,
      p_desc: "Premium document unlock",
    });

    if (spendErr) {
      console.error("Pro credits-unlock spend error:", spendErr.message);
      return NextResponse.json({ error: "Could not process credits." }, { status: 500 });
    }

    if (spend && spend.ok === false) {
      // Already owns it → treat as success so this browser unlocks for free.
      if (spend.error === "already_owned") {
        return NextResponse.json({ ok: true, already: true });
      }
      if (spend.error === "insufficient") {
        return NextResponse.json(
          { error: "Not enough credits — you need 1 credit to unlock premium." },
          { status: 402 }
        );
      }
      return NextResponse.json({ error: "Could not process credits." }, { status: 400 });
    }

    const balance = typeof spend?.balance === "number" ? spend.balance : undefined;
    return NextResponse.json({ ok: true, balance });
  } catch (err) {
    console.error("Pro credits-unlock route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
