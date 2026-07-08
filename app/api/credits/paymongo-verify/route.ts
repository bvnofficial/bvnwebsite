import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Verifies a returning PayMongo credit top-up and credits the wallet.
// Idempotent: topup_credits keys off the PayMongo session id (p_ref), so a
// refresh or double-submit never double-credits.
const PAYMONGO_BASE = "https://api.paymongo.com/v1";

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

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session id." }, { status: 400 });
    }

    const res = await fetch(`${PAYMONGO_BASE}/checkout_sessions/${sessionId}`, {
      headers: { Authorization: pmAuth() },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Could not retrieve payment session." }, { status: 502 });
    }

    const data = await res.json();
    const attrs = data?.data?.attributes;
    if (!attrs) {
      return NextResponse.json({ error: "Invalid session data." }, { status: 502 });
    }

    const meta = attrs.metadata ?? {};
    // Security: the session must belong to this user and be a credit top-up.
    if (meta.user_id !== user.id) {
      return NextResponse.json({ error: "Payment/user mismatch." }, { status: 403 });
    }
    if (meta.kind !== "credit_topup") {
      return NextResponse.json({ error: "Not a credit top-up." }, { status: 400 });
    }

    const status: string = attrs.payment_intent?.attributes?.status ?? attrs.status ?? "";
    if (status !== "paid" && status !== "succeeded") {
      // Not confirmed yet — let the client retry shortly.
      return NextResponse.json({ ok: false, pending: true });
    }

    const credits = Math.floor(Number(meta.credits || 0));
    if (credits < 1) {
      return NextResponse.json({ error: "Invalid credit amount." }, { status: 400 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Credits are not set up yet." }, { status: 503 });
    }

    const { data: balance, error } = await admin.rpc("topup_credits", {
      p_user: user.id,
      p_amount: credits,
      p_desc: `Top-up — ${credits} credits (GCash/Card)`,
      p_ref: sessionId,
    });

    if (error) {
      console.error("topup_credits (paymongo) rpc error:", error);
      return NextResponse.json(
        { error: "Payment received but crediting failed — contact bvn@bvnofficial.com." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, credited: credits, balance });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("credits paymongo-verify route error:", msg);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
