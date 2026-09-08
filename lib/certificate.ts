// Shared certificate helpers — pricing, PayMongo auth, and types used by the
// certificate checkout / issue / PDF routes. Server-only utilities live here so
// the API routes stay thin and consistent with the existing payment routes.

export const CERT_PRICE_PHP = 99; // PayMongo QR Ph
export const CERT_PRICE_USD = 1; // PayPal (international + card)

export const PAYMONGO_BASE = "https://api.paymongo.com/v1";

export function pmAuth() {
  const key = process.env.PAYMONGO_SECRET_KEY ?? "";
  return "Basic " + Buffer.from(key + ":").toString("base64");
}

export const PAYPAL_ENV = process.env.PAYPAL_ENV === "sandbox" ? "sandbox" : "live";
export const PAYPAL_BASE =
  PAYPAL_ENV === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

export function certDescription(courseTitle: string) {
  return `BVN Certificate of Completion — ${courseTitle}`;
}

export type CompletionRow = {
  id: string;
  course_slug: string;
  course_title: string;
  student_name: string;
  student_email: string;
  amount: number;
  currency: string;
  provider: "paymongo" | "paypal" | "credits";
  provider_ref: string | null;
  paid: boolean;
  created_at: string;
  paid_at: string | null;
};
