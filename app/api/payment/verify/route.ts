import { NextResponse } from "next/server";

const PAYMONGO_BASE = "https://api.paymongo.com/v1";

function pmAuth() {
  const key = process.env.PAYMONGO_SECRET_KEY ?? "";
  return "Basic " + Buffer.from(key + ":").toString("base64");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const res = await fetch(`${PAYMONGO_BASE}/checkout_sessions/${sessionId}`, {
    headers: { Authorization: pmAuth() },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Could not retrieve session" }, { status: 502 });
  }

  const data = await res.json();
  const attrs = data?.data?.attributes;

  if (!attrs) {
    return NextResponse.json({ error: "Invalid session data" }, { status: 502 });
  }

  // Only return what we need — never expose the full session object to the client
  return NextResponse.json({
    status: attrs.payment_intent?.attributes?.status ?? attrs.status,
    amount: attrs.line_items?.[0]?.amount ?? 0,
    description: attrs.description ?? "",
    customerName: attrs.billing?.name ?? attrs.metadata?.customer_name ?? "",
    customerEmail: attrs.billing?.email ?? attrs.metadata?.customer_email ?? "",
    paymentMethod: attrs.payment_intent?.attributes?.payment_method_allowed?.[0] ?? "",
  });
}
