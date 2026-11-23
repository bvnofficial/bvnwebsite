// Turns a Skinlux event (from the staff app, the Timely link or the quiz) into
// the payload each GoHighLevel workflow expects, and posts it to that clinic's
// webhook. Contract: clients/skinlux-jellie/build/09-webhook-events.md.
//
// Env (Vercel): GHL_HOOK_{BOORAGOON|LEEDERVILLE}_{ABANDONED|TREATMENT|PRODUCT|BOOKED|LEAD}
import { Clinic, DEFAULT_PRODUCT_LIFE, PRODUCTS, aftercareSms, findTreatment, ghlDate } from "@/lib/skinlux-data";

export const EVENT_KIND: Record<string, string> = {
  incomplete_booking: "ABANDONED",
  treatment_done: "TREATMENT",
  product_sold: "PRODUCT",
  booking_made: "BOOKED",
  new_lead: "LEAD",
};

type Obj = Record<string, unknown>;
const s = (v: unknown) => (v == null ? "" : String(v)).trim().slice(0, 500);

export function normPhone(p: string): string {
  const d = p.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  if (d.startsWith("04") && d.length === 10) return "+61" + d.slice(1);
  if (d.startsWith("61")) return "+" + d;
  return d;
}

export type Built = { ok: true; clinic: Clinic; kind: string; payload: Obj } | { ok: false; error: string };

export function buildEvent(body: Obj): Built {
  const event = s(body.event);
  const kind = EVENT_KIND[event];
  if (!kind) return { ok: false, error: "Unknown event" };
  const clinic = s(body.clinic).toLowerCase() as Clinic;
  if (clinic !== "booragoon" && clinic !== "leederville") return { ok: false, error: "Clinic must be Booragoon or Leederville" };
  const first = s(body.first_name), last = s(body.last_name), email = s(body.email).toLowerCase(), phone = normPhone(s(body.phone));
  if (!first || (!email && !phone)) return { ok: false, error: "Need a first name and a mobile or email" };

  const base: Obj = { event, first_name: first, last_name: last, email, phone, clinic: clinic === "booragoon" ? "Booragoon" : "Leederville" };

  if (event === "treatment_done") {
    const t = findTreatment(s(body.treatment));
    if (!t) return { ok: false, error: "Pick a treatment from the list" };
    return { ok: true, clinic, kind, payload: { ...base,
      treatment: t.name, therapist: s(body.therapist), injectable: t.injectable ? "yes" : "no",
      aftercare_sms: aftercareSms(t, first, clinic), checkin_day: t.checkinDay,
      next_due_date: t.rebookDays ? ghlDate(t.rebookDays) : "", hifu: t.name === "HIFU" ? "yes" : "no",
      package_name: s(body.package_name), package_sessions_left: Number(body.package_sessions_left) || 0,
    } };
  }
  if (event === "product_sold") {
    const product = s(body.product);
    if (!product) return { ok: false, error: "Pick a product" };
    const life = PRODUCTS.find((p) => p.name === product)?.lifeDays || DEFAULT_PRODUCT_LIFE;
    return { ok: true, clinic, kind, payload: { ...base, product, product_reorder_date: ghlDate(Math.max(1, life - 10)) } };
  }
  if (event === "new_lead") {
    return { ok: true, clinic, kind, payload: { ...base, source: s(body.source) || "website", interest: s(body.interest), message: s(body.message) } };
  }
  if (event === "incomplete_booking") {
    return { ok: true, clinic, kind, payload: { ...base, abandoned_service: s(body.abandoned_service), therapist: s(body.therapist),
      value: Number(body.value) || 0, injectable: s(body.injectable) === "yes" ? "yes" : "no", client_type: s(body.client_type) === "existing" ? "existing" : "new" } };
  }
  return { ok: true, clinic, kind, payload: { ...base, service: s(body.service), date: s(body.date), value: Number(body.value) || 0 } };
}

export async function sendEvent(b: Extract<Built, { ok: true }>): Promise<{ ok: boolean; status: number; error?: string }> {
  const url = process.env[`GHL_HOOK_${b.clinic.toUpperCase()}_${b.kind}`];
  if (!url) return { ok: false, status: 503, error: `The ${b.kind.toLowerCase()} workflow isn't connected yet` };
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b.payload) }).catch(() => null);
  if (!r || !r.ok) return { ok: false, status: 502, error: "GoHighLevel didn't accept it" };
  return { ok: true, status: 200 };
}
