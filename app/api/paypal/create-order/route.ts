import { NextResponse } from "next/server";
import { PAYPAL_BASE, PAYPAL_CURRENCIES, getAccessToken } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const { amount, currency, description } = await req.json();

    if (!amount || Number(amount) < 1) {
      return NextResponse.json({ error: "Please enter a valid amount." }, { status: 400 });
    }

    const cur = PAYPAL_CURRENCIES.includes(currency) ? currency : "USD";
    const value = Number(amount).toFixed(2);

    const token = await getAccessToken();

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: cur, value },
            description: String(description || "BVN Digital Agency Services").slice(0, 127),
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
      console.error("PayPal create-order error:", JSON.stringify(data));
      return NextResponse.json(
        { error: data?.message || "Could not start PayPal checkout." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("PayPal create-order route error:", msg);
    const friendly = msg.includes("not configured")
      ? "Card payments are not configured yet."
      : "Internal server error.";
    return NextResponse.json({ error: friendly }, { status: 500 });
  }
}
