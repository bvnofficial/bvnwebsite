import { NextResponse } from "next/server";
import { PAYPAL_BASE, getAccessToken } from "@/lib/paypal";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Captures a credit-purchase PayPal order and credits the user's wallet.
// Idempotent: crediting keys off the PayPal capture id, so a retried capture
// never double-credits.
export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }

    const { orderID } = await req.json();
    if (!orderID) {
      return NextResponse.json({ error: "Missing order ID." }, { status: 400 });
    }

    const token = await getAccessToken();
    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.status !== "COMPLETED") {
      console.error("credits capture error:", JSON.stringify(data));
      return NextResponse.json(
        { error: data?.message || "Payment could not be completed." },
        { status: 500 }
      );
    }

    const pu = data?.purchase_units?.[0];
    const capture = pu?.payments?.captures?.[0];
    const value = Number(capture?.amount?.value ?? "0");
    const captureId: string = capture?.id ?? data?.id ?? orderID;

    // Security: the order was tagged with the buyer's user id — make sure it's this user.
    const customId: string | undefined = pu?.custom_id;
    if (customId && customId !== user.id) {
      return NextResponse.json({ error: "Payment/user mismatch." }, { status: 403 });
    }

    const credits = Math.floor(value); // 1 credit = $1 USD
    if (credits < 1) {
      return NextResponse.json({ error: "Amount too small to credit." }, { status: 400 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Credits are not set up yet." }, { status: 503 });
    }

    const { data: balance, error } = await admin.rpc("topup_credits", {
      p_user: user.id,
      p_amount: credits,
      p_desc: `Top-up — ${credits} credits`,
      p_ref: captureId,
    });

    if (error) {
      console.error("topup_credits rpc error:", error);
      return NextResponse.json(
        { error: "Payment captured but crediting failed — contact bvn@bvnofficial.com." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, credited: credits, balance });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("credits capture route error:", msg);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
