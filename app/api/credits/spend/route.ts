import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { getCreditItem } from "@/lib/credit-catalog";

// Spends credits to unlock a catalog item. Price comes from the server-side
// catalog (never trusted from the client). Atomic via the spend_credits RPC.
export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }

    const { itemId } = await req.json();
    const item = getCreditItem(itemId);
    if (!item) {
      return NextResponse.json({ error: "Unknown item." }, { status: 400 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Credits are not set up yet." }, { status: 503 });
    }

    const { data, error } = await admin.rpc("spend_credits", {
      p_user: user.id,
      p_item: item.id,
      p_amount: item.credits,
      p_desc: `Unlocked: ${item.name}`,
    });

    if (error) {
      console.error("spend_credits rpc error:", error);
      return NextResponse.json({ error: "Could not complete purchase." }, { status: 500 });
    }

    if (!data?.ok) {
      const msg =
        data?.error === "insufficient"
          ? "Not enough credits — top up and try again."
          : data?.error === "already_owned"
          ? "You already own this."
          : "Could not complete purchase.";
      return NextResponse.json({ error: msg, balance: data?.balance }, { status: 400 });
    }

    return NextResponse.json({ ok: true, balance: data.balance, itemId: item.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("credits spend route error:", msg);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
