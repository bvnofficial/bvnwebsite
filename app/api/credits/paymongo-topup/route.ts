import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Creates a PayMongo (GCash / card, PHP) checkout session to BUY credits.
// 1 credit = $1 = PHP 60. The user id + credit count are stored in the session
// metadata so /api/credits/paymongo-verify can credit the wallet on return.
const PAYMONGO_BASE = "https://api.paymongo.com/v1";
const PHP_PER_CREDIT = 60;

function pmAuth() {
  const key = process.env.PAYMONGO_SECRET_KEY ?? "";
  return "Basic " + Buffer.from(key + ":").toString("base64");
}

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
    const credits = Math.floor(Number(amount));
    if (!credits || credits < 1) {
      return NextResponse.json({ error: "Enter an amount of at least 1 credit." }, { status: 400 });
    }
    if (credits > 5000) {
      return NextResponse.json({ error: "Amount too large." }, { status: 400 });
    }

    const php = credits * PHP_PER_CREDIT;
    const baseUrl = "https://www.bvnofficial.com";

    const body = {
      data: {
        attributes: {
          billing: { name: user.email ?? "BVN Customer", email: user.email ?? undefined },
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          description: `BVN Credits — ${credits} credits`,
          line_items: [
            {
              currency: "PHP",
              amount: php * 100,
              name: `BVN Credits — ${credits} credits`,
              quantity: 1,
            },
          ],
          // GCash, cards, QR Ph, and BPI + UnionBank direct debit. PayMongo
          // auto-hides any method below its minimum amount.
          payment_method_types: ["gcash", "card", "qrph", "dob", "dob_ubp"],
          success_url: `${baseUrl}/credits?pm=1`,
          cancel_url: `${baseUrl}/credits`,
          metadata: { user_id: user.id, credits: String(credits), kind: "credit_topup" },
        },
      },
    };

    const res = await fetch(`${PAYMONGO_BASE}/checkout_sessions`, {
      method: "POST",
      headers: { Authorization: pmAuth(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.errors?.[0]?.detail ?? "Could not start PayMongo checkout.";
      console.error("credits paymongo-topup error:", JSON.stringify(err));
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const session = await res.json();
    const checkoutUrl: string = session?.data?.attributes?.checkout_url;
    const sessionId: string = session?.data?.id;
    if (!checkoutUrl) {
      return NextResponse.json({ error: "No checkout URL returned." }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl, sessionId, php });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("credits paymongo-topup route error:", msg);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
