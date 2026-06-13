// PayPal REST helpers (Orders v2). No SDK dependency — raw fetch, mirroring the
// PayMongo / NOWPayments integrations. Credentials come from env:
//   PAYPAL_CLIENT_ID / PAYPAL_SECRET  (server, required to capture money)
//   NEXT_PUBLIC_PAYPAL_CLIENT_ID      (browser, for the JS SDK buttons)
//   PAYPAL_ENV = "live" | "sandbox"   (defaults to live)

const PAYPAL_ENV = process.env.PAYPAL_ENV === "sandbox" ? "sandbox" : "live";

export const PAYPAL_BASE =
  PAYPAL_ENV === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

// Currencies PayPal supports that match the checkout UI. PHP is supported.
export const PAYPAL_CURRENCIES = ["USD", "PHP", "GBP", "AUD", "EUR", "SGD"];

export function paypalCreds() {
  const clientId =
    process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const secret = process.env.PAYPAL_SECRET || "";
  return { clientId, secret };
}

export function isPaypalConfigured() {
  const { clientId, secret } = paypalCreds();
  return Boolean(clientId && secret);
}

export async function getAccessToken(): Promise<string> {
  const { clientId, secret } = paypalCreds();
  if (!clientId || !secret) throw new Error("PayPal is not configured");

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`PayPal auth failed (${res.status}): ${t}`);
  }
  const data = await res.json();
  return data.access_token as string;
}
