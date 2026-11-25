import { NextRequest, NextResponse } from "next/server";
import { buildEvent, sendEvent } from "@/lib/skinlux-events";

/**
 * Shopify to workflow 3 (product sale). Skinlux's Shopify sends "Order
 * payment" webhooks here (Settings, Notifications, Webhooks, JSON). Each paid
 * line item becomes one product_sold event for GoHighLevel.
 *
 * Env (Vercel): SKINLUX_SHOPIFY_WEBHOOK_SECRET, the signing key shown under
 * the webhooks list in Shopify. SKINLUX_SHOPIFY_CLINIC (booragoon or
 * leederville) is the clinic online orders belong to; Booragoon if unset.
 * In clinic product sales come from Timely and the staff app, not from here.
 */
export const dynamic = "force-dynamic";

async function hmacOk(raw: string, header: string): Promise<boolean> {
  const secret = process.env.SKINLUX_SHOPIFY_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw)));
  let bin = "";
  for (let i = 0; i < sig.length; i++) bin += String.fromCharCode(sig[i]);
  const want = btoa(bin);
  if (want.length !== header.length) return false;
  let d = 0;
  for (let i = 0; i < want.length; i++) d |= want.charCodeAt(i) ^ header.charCodeAt(i);
  return d === 0;
}

// eslint-disable-next-line
type J = Record<string, any>;

export async function POST(req: NextRequest) {
  const out = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
  const raw = await req.text();
  if (!(await hmacOk(raw, req.headers.get("x-shopify-hmac-sha256") || ""))) return out(401, { ok: false });

  let order: J;
  try { order = JSON.parse(raw) as J; } catch { return out(400, { ok: false }); }
  if (order.test === true) return out(200, { ok: true, skipped: "test order" });

  const cust: J = order.customer || {};
  const addr: J = order.billing_address || order.shipping_address || {};
  const clinic = (process.env.SKINLUX_SHOPIFY_CLINIC || "booragoon").toLowerCase();
  const base = {
    event: "product_sold",
    clinic,
    first_name: cust.first_name || addr.first_name || "",
    last_name: cust.last_name || addr.last_name || "",
    email: order.email || cust.email || "",
    phone: order.phone || cust.phone || addr.phone || "",
  };

  const items: J[] = Array.isArray(order.line_items) ? order.line_items : [];
  const results: { product: string; ok: boolean; error?: string }[] = [];
  for (const li of items) {
    const product = String(li.title || li.name || "").trim();
    if (!product) continue;
    const built = buildEvent({ ...base, product });
    if (!built.ok) { results.push({ product, ok: false, error: built.error }); continue; }
    const sent = await sendEvent(built);
    results.push({ product, ok: sent.ok, error: sent.error });
  }
  if (results.some((r) => !r.ok)) console.error("skinlux-shopify:", JSON.stringify(results));
  // Always 200 once the signature checks out, so Shopify doesn't retry and double send.
  return out(200, { ok: true, results });
}
