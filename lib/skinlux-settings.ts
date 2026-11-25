// Skinlux HQ settings: everything Jellie controls from HQ that isn't a message
// or an offer. Stored as JSON in the GoHighLevel custom value "skinlux_settings"
// (Booragoon sub account). Built in defaults below are used for anything not saved.
//
// Used by: the event sender (automation switches, rebook and check in days,
// product life), the staff app (team and products), the Shopify route (which
// clinic online orders belong to), and the public quiz, skin check and offer
// pages through /api/skinlux-settings (prices, booking link, routine products).
import { PRODUCTS, THERAPISTS, TREATMENTS } from "@/lib/skinlux-data";

const GHL = "https://services.leadconnectorhq.com";
const NAME = "skinlux_settings";

export type ClinicKey = "booragoon" | "leederville";
export type AutoKey = "abandoned" | "treatment" | "product" | "booked";
export type TreatmentSetting = { id: string; name: string; injectable: boolean; online: boolean; price: string; from: number; rebookDays: number; checkinDay: 2 | 3 };
export type ProductSetting = { name: string; price: string; use: string; lifeDays: number; routine: "" | "everyone" | "tone" | "texture" | "clear" };
export type TeamMember = { name: string; clinics: ClinicKey[] };
export type Settings = {
  booking: string;
  phones: Record<ClinicKey, string>;
  automations: Record<ClinicKey, Record<AutoKey, boolean>>;
  treatments: TreatmentSetting[];
  products: ProductSetting[];
  team: TeamMember[];
  shopifyClinic: ClinicKey;
  updated?: string;
};

// Website treatment ids (assets/data.js) to the names GoHighLevel and the staff app use
const IDS: [string, string, string, number][] = [
  // id, server name, quiz price text, skin check "from" price
  ["hifu", "HIFU", "Full face and neck $1,800. Glow $450. Offer: double chin $174", 450],
  ["carbon", "Carbon Laser", "Face $460. Offer: face, LED and consult $247", 460],
  ["relaxers", "Wrinkle relaxers", "Given at your consultation", 0],
  ["rejuran", "Bio stimulating injection", "Given at your consultation", 0],
  ["fillers", "Fillers", "Given at your consultation", 0],
  ["ipl-skin", "IPL Skin Correction", "Full face $240, face and neck $295. Test patch $50", 240],
  ["needling", "Skin needling", "Full face $330, face and neck $395, with exosomes and mask $720", 330],
  ["bright", "Bright and Tight", "Face $295, face, neck and chest $395", 295],
  ["clinical-peel", "Clinical Peels", "Resurfacing Peel and LED $220. 3 peels and LED pack $350", 220],
  ["advanced-peel", "Advanced Peels", "Alpha Beta $195, Level 2 $270, Level 3 $320, Cosmelan $1,500", 195],
  ["nano-rf", "Nano fractional RF", "Full face $520, face and neck $650", 520],
  ["diamond", "Diamond Polar RF", "Full face $195. Offer: $97 with consult", 195],
  ["electro", "Electrocautery", "1 to 3 spots $199, from $99 per lesion", 0],
  ["exogrow", "Exo Grow", "Full head $650", 0],
  ["led", "LED therapy", "$100 for 30 min", 100],
  ["body", "Body Sculpting", "EMS 1 area $249 (offer $147). Venus stomach offer $197", 0],
  ["plasma", "Plasma Fibroblast", "Crow's feet $400, full neck $800", 0],
  ["ipl-hair", "IPL hair removal (SHR)", "Underarms $75, Brazilian $120, full legs $259. Men's beard $199", 0],
];
const PRODUCT_PRICES: Record<string, string> = {
  "Skincare Doctor Barrier Build Cream": "$139.50",
  "Skincare Doctor Barrier Build Cleanser 120ml": "$79.00",
  "Skincare Doctor Hydrate + Repair Serum": "$159.50",
  "Skincare Doctor Hydrate + Exfoliate Serum": "$159.00",
  "Skincare Doctor Men's Kit": "$229.50",
  "Skincare Doctor Starter Kit": "$289.50",
  "Skincare Doctor Retinal + B3 Serum": "$159.00",
  "Skincare Doctor Vitamin Sleep Balm": "$89.00",
  "Skincare Doctor Bright Eye Serum": "$149.50",
  "Skincare Doctor Hydrating Face Oil": "$149.50",
  "Skincare Doctor DNA Repair Cream": "$199.50",
  "Skincare Doctor Hydra Light Cream": "$139.50",
  "Skincare Doctor Hydra Soothe Cream": "$139.50",
  "Skincare Doctor Retinal + Peptide Cream": "$159.50",
  "Skincare Doctor Vitamin C + Peptides Serum": "$179.50",
  "Skincare Doctor Exfoliating Blemish Serum": "$149.00",
  "Skincare Doctor Hydrate": "$139.50",
  "Skincare Doctor HA + Peptide Mist": "$79.00",
  "Skincare Doctor Oil Cleanser": "$89.00",
  "SkinCare Doctor Gel Cleanser": "$79.00",
};
const ROUTINE: Record<string, [ProductSetting["routine"], string]> = {
  "SkinCare Doctor Gel Cleanser": ["everyone", "Morning and night"],
  "Skincare Doctor Hydra Light Cream": ["everyone", "Morning and night, after serum"],
  "Skincare Doctor Vitamin C + Peptides Serum": ["tone", "Morning, after cleansing"],
  "Skincare Doctor Retinal + Peptide Cream": ["texture", "Night, start 2 to 3 times a week"],
  "Skincare Doctor Exfoliating Blemish Serum": ["clear", "Night, on clean skin"],
};

export function defaults(): Settings {
  const on = (): Record<AutoKey, boolean> => ({ abandoned: true, treatment: true, product: true, booked: true });
  return {
    booking: "https://bookings.gettimely.com/booragoonhairfree/bb/book",
    phones: { booragoon: "0478 817 414", leederville: "0423 549 335" },
    automations: { booragoon: on(), leederville: on() },
    treatments: IDS.map(([id, name, price, from]) => {
      const t = TREATMENTS.find((x) => x.name === name)!;
      return { id, name, injectable: t.injectable, online: true, price, from, rebookDays: t.rebookDays, checkinDay: t.checkinDay };
    }),
    products: PRODUCTS.map((p) => ({ name: p.name, price: PRODUCT_PRICES[p.name] || "", use: ROUTINE[p.name]?.[1] || "",
      lifeDays: p.lifeDays || 85, routine: ROUTINE[p.name]?.[0] || "" })),
    team: THERAPISTS.map((name) => ({ name, clinics: ["booragoon", "leederville"] as ClinicKey[] })),
    shopifyClinic: (process.env.SKINLUX_SHOPIFY_CLINIC || "booragoon").toLowerCase() === "leederville" ? "leederville" : "booragoon",
  };
}

// ---------- read and write ----------
function conn() {
  const token = process.env.GHL_SKINLUX_BOORAGOON_TOKEN, loc = process.env.GHL_SKINLUX_BOORAGOON_LOCATION;
  return token && loc ? { loc, h: { Authorization: `Bearer ${token}`, Version: "2021-07-28", Accept: "application/json", "Content-Type": "application/json" } } : null;
}
async function findValue(): Promise<{ id: string; value: string } | null> {
  const k = conn();
  if (!k) return null;
  const ac = new AbortController(), timer = setTimeout(() => ac.abort(), 4000);
  try {
    const r = await fetch(`${GHL}/locations/${k.loc}/customValues`, { headers: k.h, cache: "no-store", signal: ac.signal });
    if (!r.ok) return null;
    const d = (await r.json()) as { customValues?: { id: string; name: string; value: string }[] };
    const v = (d.customValues || []).find((x) => x.name === NAME);
    return v ? { id: v.id, value: v.value || "" } : { id: "", value: "" };
  } catch { return null; } finally { clearTimeout(timer); }
}

let cache: { at: number; s: Settings } | null = null;

/** Saved settings merged over the defaults. Cached for 30 seconds per server instance. */
export async function loadSettings(fresh = false): Promise<Settings> {
  if (!fresh && cache && Date.now() - cache.at < 30_000) return cache.s;
  const v = await findValue();
  let saved: Partial<Settings> = {};
  if (v && v.value) { try { saved = JSON.parse(v.value) as Partial<Settings>; } catch { saved = {}; } }
  const s = merge(defaults(), saved);
  if (v) cache = { at: Date.now(), s }; // don't cache a failed read for long
  return s;
}
/** Last loaded settings (or defaults), for code that can't wait. Call loadSettings first. */
export function currentSettings(): Settings { return cache?.s || defaults(); }

function merge(d: Settings, s: Partial<Settings>): Settings {
  const out: Settings = { ...d };
  if (typeof s.booking === "string" && /^https:\/\//.test(s.booking)) out.booking = s.booking;
  if (s.phones) out.phones = { ...d.phones, ...s.phones };
  if (s.automations) (["booragoon", "leederville"] as ClinicKey[]).forEach((c) => { out.automations[c] = { ...d.automations[c], ...(s.automations![c] || {}) }; });
  if (Array.isArray(s.treatments)) out.treatments = d.treatments.map((t) => ({ ...t, ...(s.treatments!.find((x) => x.id === t.id) || {}), id: t.id, name: t.name, injectable: t.injectable }));
  if (Array.isArray(s.products) && s.products.length) out.products = s.products;
  if (Array.isArray(s.team) && s.team.length) out.team = s.team;
  if (s.shopifyClinic === "booragoon" || s.shopifyClinic === "leederville") out.shopifyClinic = s.shopifyClinic;
  out.updated = s.updated;
  return out;
}

const str = (v: unknown, max: number) => (v == null ? "" : String(v)).replace(/\s+/g, " ").trim().slice(0, max);
const num = (v: unknown, lo: number, hi: number, dflt: number) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : dflt; };

/** Cleans settings sent from HQ. */
export function cleanSettings(raw: Record<string, unknown>): { ok: true; s: Settings } | { ok: false; error: string } {
  const d = defaults();
  const booking = str(raw.booking, 300);
  if (!/^https:\/\/\S+$/.test(booking)) return { ok: false, error: "The booking link has to start with https://" };
  const ph = (raw.phones || {}) as Record<string, unknown>;
  const au = (raw.automations || {}) as Record<string, Record<string, unknown>>;
  const automations = {} as Settings["automations"];
  (["booragoon", "leederville"] as ClinicKey[]).forEach((c) => {
    automations[c] = { abandoned: au[c]?.abandoned !== false, treatment: au[c]?.treatment !== false, product: au[c]?.product !== false, booked: au[c]?.booked !== false };
  });
  const tIn = Array.isArray(raw.treatments) ? (raw.treatments as Record<string, unknown>[]) : [];
  const treatments = d.treatments.map((t) => {
    const x = tIn.find((y) => y.id === t.id) || {};
    const price = str(x.price ?? t.price, 160);
    return { ...t, online: x.online !== false, price: t.injectable ? "Given at your consultation" : price,
      from: t.injectable ? 0 : num(x.from ?? t.from, 0, 20000, t.from), rebookDays: num(x.rebookDays ?? t.rebookDays, 0, 730, t.rebookDays),
      checkinDay: (Number(x.checkinDay) === 3 ? 3 : 2) as 2 | 3 };
  });
  const products = (Array.isArray(raw.products) ? (raw.products as Record<string, unknown>[]) : [])
    .map((p) => ({ name: str(p.name, 120), price: str(p.price, 20), use: str(p.use, 120), lifeDays: num(p.lifeDays, 10, 730, 85),
      routine: (["everyone", "tone", "texture", "clear"].includes(String(p.routine)) ? p.routine : "") as ProductSetting["routine"] }))
    .filter((p) => p.name).slice(0, 200);
  if (!products.length) return { ok: false, error: "Keep at least one product" };
  const team = (Array.isArray(raw.team) ? (raw.team as Record<string, unknown>[]) : [])
    .map((m) => ({ name: str(m.name, 60), clinics: (Array.isArray(m.clinics) ? m.clinics : []).filter((c): c is ClinicKey => c === "booragoon" || c === "leederville") }))
    .filter((m) => m.name).slice(0, 60);
  if (!team.length) return { ok: false, error: "Keep at least one team member" };
  return { ok: true, s: {
    booking, phones: { booragoon: str(ph.booragoon, 20) || d.phones.booragoon, leederville: str(ph.leederville, 20) || d.phones.leederville },
    automations, treatments, products, team,
    shopifyClinic: raw.shopifyClinic === "leederville" ? "leederville" : "booragoon", updated: new Date().toISOString(),
  } };
}

export async function saveSettings(s: Settings): Promise<void> {
  const k = conn();
  if (!k) throw new Error("GoHighLevel isn't connected");
  const value = JSON.stringify(s);
  if (value.length > 60000) throw new Error("Settings are too big to save");
  const cur = await findValue();
  if (!cur) throw new Error("GoHighLevel didn't answer");
  const r = cur.id
    ? await fetch(`${GHL}/locations/${k.loc}/customValues/${cur.id}`, { method: "PUT", headers: k.h, body: JSON.stringify({ name: NAME, value }) })
    : await fetch(`${GHL}/locations/${k.loc}/customValues`, { method: "POST", headers: k.h, body: JSON.stringify({ name: NAME, value }) });
  if (!r.ok) throw new Error("GoHighLevel didn't save it");
  cache = { at: Date.now(), s };
}

/** What the public pages need (no team, no switches). */
export function publicSettings(s: Settings) {
  return {
    booking: s.booking, phones: s.phones,
    treatments: s.treatments.map((t) => ({ id: t.id, online: t.online, price: t.price, from: t.from, interval_days: t.rebookDays })),
    products: s.products.filter((p) => p.routine).map((p) => ({ name: p.name, price: p.price, use: p.use, routine: p.routine })),
  };
}

// ---------- helpers for the event sender ----------
export const AUTO_OF_KIND: Record<string, AutoKey | undefined> = { ABANDONED: "abandoned", TREATMENT: "treatment", PRODUCT: "product", BOOKED: "booked" };
export function treatmentDays(name: string): { rebookDays: number; checkinDay: 2 | 3 } | null {
  const t = currentSettings().treatments.find((x) => x.name.toLowerCase() === name.trim().toLowerCase());
  return t ? { rebookDays: t.rebookDays, checkinDay: t.checkinDay } : null;
}
export function productLife(name: string): number | null {
  return currentSettings().products.find((p) => p.name === name)?.lifeDays || null;
}
