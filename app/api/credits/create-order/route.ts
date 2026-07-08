import { NextResponse } from "next/server";
import { PAYPAL_BASE, getAccessToken } from "@/lib/paypal";
import { createClient } from "@/utils/supabase/server";

// Creates a PayPal order to BUY credits. 1 credit = $1 USD. The order is tagged
// with custom_id = the logged-in user's id so capture can verify ownership.
export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }

    const { amount } = await req.json();
    const usd = Math.floor(Number(amount));
    if (!usd || usd < 1) {
      return NextResponse.json({ error: "Minimum top-up is $1." }, { status: 400 });
    }
    if (usd > 5000) {
      return NextResponse.json({ error: "Maximum top-up is $5,000." }, { status: 400 });
    }

    const token = await getAccessToken();
    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: usd.toFixed(2) },
            description: `BVN Credits — ${usd} credits`,
            custom_id: user.id,
          },
        ],
        application_context: {
          brand_name: "BVN Digital Agency",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
        },
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.id) {
      console.error("credits create-order error:", JSON.stringify(data));
      return NextResponse.json(
        { error: data?.message || "Could not start checkout." },
        { status: 500 }
      );
    }
    return NextResponse.json({ id: data.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("credits create-order route error:", msg);
    const friendly = msg.includes("not configured")
      ? "Card payments are not configured yet."
      : "Internal server error.";
    return NextResponse.json({ error: friendly }, { status: 500 });
  }
}
