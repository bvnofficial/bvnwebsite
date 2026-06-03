import { NextResponse } from "next/server";

const NOWPAYMENTS_API = "https://api.nowpayments.io/v1";

export async function POST(req: Request) {
  try {
    const { name, email, amount, currency, description } = await req.json();

    if (!name || !email || !amount || Number(amount) < 1) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const baseUrl = "https://www.bvnofficial.com";
    const orderId = `bvn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const body = {
      price_amount: Number(amount),
      price_currency: currency?.toLowerCase() || "usd",
      pay_currency: "usdterc20",
      ipn_callback_url: `${baseUrl}/api/nowpayment/webhook`,
      order_id: orderId,
      order_description: description || "BVN Digital Agency Services",
      success_url: `${baseUrl}/payments/success?method=crypto&order=${orderId}`,
      cancel_url: `${baseUrl}/payments`,
      is_fixed_rate: true,
      is_fee_paid_by_user: false,
      payout_address: process.env.NOWPAYMENTS_WALLET,
      customer_email: email,
    };

    const res = await fetch(`${NOWPAYMENTS_API}/invoice`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("NOWPayments error:", JSON.stringify(err));
      return NextResponse.json(
        { error: err?.message || "NOWPayments error" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const invoiceUrl: string = data?.invoice_url;

    if (!invoiceUrl) {
      return NextResponse.json({ error: "No invoice URL returned" }, { status: 500 });
    }

    return NextResponse.json({ invoiceUrl, orderId, paymentId: data?.id });
  } catch (err) {
    console.error("NOWPayments route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
