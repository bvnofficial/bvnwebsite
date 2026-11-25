// Turns a Skinlux event (from the staff app, the Timely link or the quiz) into
// the payload each GoHighLevel workflow expects, and posts it to that clinic's
// webhook. Contract: clients/skinlux-jellie/build/09-webhook-events.md.
//
// Env (Vercel): GHL_HOOK_{BOORAGOON|LEEDERVILLE}_{ABANDONED|TREATMENT|PRODUCT|BOOKED|LEAD}
import { Clinic, DEFAULT_PRODUCT_LIFE, PRODUCTS, aftercareSms, findTreatment, ghlDate } from "@/lib/skinlux-data";
import { AUTO_OF_KIND, currentSettings, loadSettings, productLife, treatmentDays } from "@/lib/skinlux-settings";
import { logEvent } from "@/lib/skinlux-store";
import { recordInGhl } from "@/lib/skinlux-ghl";
import { takeFromStock } from "@/lib/skinlux-apps";

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

/** Same slug as ghl_messages.py, so "IPL hair removal (SHR)" -> "ipl_hair_removal_shr" */
function slug(x: string): string {
  return x.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "").split("__").join("_");
}

/** Jellie's edited aftercare from the HQ message editor (GoHighLevel custom
 *  value msg_aftercare_*), or the built in wording if it isn't set or reachable. */
export async function editedAftercare(clinic: Clinic, treatment: string, injectable: boolean): Promise<string | null> {
  const C = clinic.toUpperCase();
  const token = process.env[`GHL_SKINLUX_${C}_TOKEN`], loc = process.env[`GHL_SKINLUX_${C}_LOCATION`];
  if (!token || !loc) return null;
  const r = await fetch(`https://services.leadconnectorhq.com/locations/${loc}/customValues`, {
    headers: { Authorization: `Bearer ${token}`, Version: "2021-07-28", Accept: "application/json" }, cache: "no-store",
  }).catch(() => null);
  if (!r || !r.ok) return null;
  const d = (await r.json().catch(() => ({}))) as { customValues?: { name: string; value: string }[] };
  const name = "msg_aftercare_" + (injectable ? "injectables_all" : slug(treatment));
  const v = (d.customValues || []).find((x) => x.name === name)?.value?.trim();
  return v && v !== "(Jellie to write)" ? v : null;
}

export async function buildEventWithEdits(body: Obj): Promise<Built> {
  await loadSettings();
  const b = buildEvent(body);
  if (!b.ok || b.payload.event !== "treatment_done") return b;
  const t = findTreatment(String(b.payload.treatment));
  const edited = t ? await editedAftercare(b.clinic, t.name, t.injectable) : null;
  if (edited) {
    const first = String(b.payload.first_name), sign = `Skinlux ${String(b.payload.clinic)}`;
    b.payload.aftercare_sms = `Hi ${first}, thanks for coming in today. ${edited} ${sign}`;
  }
  return b;
}

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
    const days = treatmentDays(t.name) || { rebookDays: t.rebookDays, checkinDay: t.checkinDay }; // Jellie's HQ settings
    return { ok: true, clinic, kind, payload: { ...base,
      treatment: t.name, therapist: s(body.therapist), injectable: t.injectable ? "yes" : "no",
      aftercare_sms: aftercareSms(t, first, clinic), checkin_day: days.checkinDay,
      next_due_date: days.rebookDays ? ghlDate(days.rebookDays) : "", hifu: t.name === "HIFU" ? "yes" : "no",
      package_name: s(body.package_name), package_sessions_left: Number(body.package_sessions_left) || 0,
    } };
  }
  if (event === "product_sold") {
    const product = s(body.product);
    if (!product) return { ok: false, error: "Pick a product" };
    const life = productLife(product) || PRODUCTS.find((p) => p.name === product)?.lifeDays || DEFAULT_PRODUCT_LIFE;
    return { ok: true, clinic, kind, payload: { ...base, product, therapist: s(body.therapist), product_reorder_date: ghlDate(Math.max(1, life - 10)) } };
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

/** Price of a treatment from HQ Settings ("from" price), for the numbers in HQ. */
function valueOf(b: Extract<Built, { ok: true }>): number {
  const p = b.payload;
  if (typeof p.value === "number" && p.value) return p.value;
  const st = currentSettings();
  if (p.treatment) return st.treatments.find((t) => t.name === p.treatment)?.from || 0;
  if (p.product) {
    const pr = st.products.find((x) => x.name === p.product);
    return pr ? Number(String(pr.price).replace(/[^\d.]/g, "")) || 0 : 0;
  }
  return 0;
}

/** Every event is recorded twice before any message logic: in the Skinlux
 *  event log (HQ numbers, scorecard, today) and on the GoHighLevel contact
 *  (so HQ and the staff app see it while the workflows are still drafts). */
export async function recordEvent(b: Extract<Built, { ok: true }>, extra: { source?: string } = {}): Promise<string | null> {
  await loadSettings().catch(() => null);
  const p = b.payload;
  const name = `${String(p.first_name || "")} ${String(p.last_name || "").slice(0, 1)}`.trim();
  const item = String(p.treatment || p.product || p.interest || p.abandoned_service || p.service || "");
  const [, id] = await Promise.all([
    logEvent({ k: String(p.event), c: b.clinic, n: name, t: String(p.therapist || ""), i: item, v: valueOf(b),
      s: extra.source || String(p.source || ""), inj: p.injectable === "yes" ? 1 : undefined }),
    recordInGhl(b.clinic, p).catch(() => null),
    p.event === "product_sold" ? takeFromStock(b.clinic, String(p.product)) : Promise.resolve(),
  ]);
  return id;
}

export async function sendEvent(b: Extract<Built, { ok: true }>, opts: { skipRecord?: boolean } = {}): Promise<{ ok: boolean; status: number; error?: string; paused?: boolean }> {
  if (!opts.skipRecord) await recordEvent(b).catch(() => null);
  // Jellie can pause a follow up per clinic in HQ Settings. New leads are never paused.
  const auto = AUTO_OF_KIND[b.kind];
  if (auto) {
    const st = await loadSettings();
    if (st.automations[b.clinic] && st.automations[b.clinic][auto] === false) return { ok: true, status: 200, paused: true };
  }
  const url = process.env[`GHL_HOOK_${b.clinic.toUpperCase()}_${b.kind}`];
  if (!url) return { ok: false, status: 503, error: `The ${b.kind.toLowerCase()} workflow isn't connected yet` };
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b.payload) }).catch(() => null);
  if (!r || !r.ok) return { ok: false, status: 502, error: "GoHighLevel didn't accept it" };
  return { ok: true, status: 200 };
}
