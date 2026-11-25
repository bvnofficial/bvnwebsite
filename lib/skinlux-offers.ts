// Skinlux monthly offers ("30 spots" pages). Stored as JSON in the GoHighLevel
// custom value "skinlux_offers" in the Booragoon sub account, so there is no
// extra database. Jellie edits them in HQ (hq/offers.html); the public page is
// /clients/skinlux/offers/index.html?o=<slug>.

const GHL = "https://services.leadconnectorhq.com";
const NAME = "skinlux_offers";

export type Offer = {
  slug: string;
  treatment: string; // treatment id from assets/data.js
  name: string;
  headline: string;
  sub: string;
  includes: string[];
  price: number;
  usual: number;
  spots: number;
  claimed: number;
  clinic: "both" | "booragoon" | "leederville";
  ends: string; // YYYY-MM-DD, last day the offer runs (Perth)
  live: boolean;
  updated?: string;
};

// Injectable treatments can't have offers (AHPRA cosmetic guidelines 2023)
export const INJECTABLE_IDS = new Set(["relaxers", "rejuran", "fillers"]);
const INJ_WORDS = /\b(wrinkle relax|anti[\s-]?wrinkle|filler|injectable|injection|botox|dysport|xeomin|letybo|relatox|juvederm|restylane|belotero|teosyal|radiesse|sculptra|profhilo|polynucleotide|skin booster|rejuran)/i;
const PUFFERY = /\b(best|leading|number one|no\.? ?1|guarantee[ds]?|permanent results|100% results|no risk|miracle|painless)\b/i;

function conn() {
  const token = process.env.GHL_SKINLUX_BOORAGOON_TOKEN, loc = process.env.GHL_SKINLUX_BOORAGOON_LOCATION;
  return token && loc ? { loc, h: { Authorization: `Bearer ${token}`, Version: "2021-07-28", Accept: "application/json", "Content-Type": "application/json" } } : null;
}

async function find(): Promise<{ id: string; value: string } | null> {
  const k = conn();
  if (!k) throw new Error("GoHighLevel isn't connected");
  const r = await fetch(`${GHL}/locations/${k.loc}/customValues`, { headers: k.h, cache: "no-store" });
  if (!r.ok) throw new Error("GoHighLevel didn't answer");
  const d = (await r.json()) as { customValues?: { id: string; name: string; value: string }[] };
  const v = (d.customValues || []).find((x) => x.name === NAME);
  return v ? { id: v.id, value: v.value } : null;
}

export async function readOffers(): Promise<Offer[]> {
  const v = await find();
  if (!v) return [];
  try { const a = JSON.parse(v.value || "[]"); return Array.isArray(a) ? (a as Offer[]) : []; } catch { return []; }
}

export async function writeOffers(list: Offer[]): Promise<void> {
  const k = conn();
  if (!k) throw new Error("GoHighLevel isn't connected");
  const value = JSON.stringify(list);
  if (value.length > 60000) throw new Error("Too many offers saved. Delete some old ones first.");
  const cur = await find();
  const r = cur
    ? await fetch(`${GHL}/locations/${k.loc}/customValues/${cur.id}`, { method: "PUT", headers: k.h, body: JSON.stringify({ name: NAME, value }) })
    : await fetch(`${GHL}/locations/${k.loc}/customValues`, { method: "POST", headers: k.h, body: JSON.stringify({ name: NAME, value }) });
  if (!r.ok) throw new Error("GoHighLevel didn't save it");
}

/** Today's date in Perth, YYYY-MM-DD */
export function perthToday(): string {
  return new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
}

export function isOpen(o: Offer): boolean {
  return !!o.live && o.ends >= perthToday() && o.claimed < o.spots;
}

export function publicView(o: Offer) {
  const open = isOpen(o);
  return {
    slug: o.slug, treatment: o.treatment, name: o.name, headline: o.headline, sub: o.sub, includes: o.includes,
    price: o.price, usual: o.usual, spots: o.spots, left: Math.max(0, o.spots - o.claimed), clinic: o.clinic, ends: o.ends,
    status: !o.live ? "off" : o.ends < perthToday() ? "ended" : o.claimed >= o.spots ? "full" : "open", open,
  };
}

const str = (v: unknown, max: number) => (v == null ? "" : String(v)).replace(/\s+/g, " ").trim().slice(0, max);

/** Cleans one offer from HQ and checks it against the advertising rules. */
export function checkOffer(raw: Record<string, unknown>, existing: Offer | undefined): { ok: true; offer: Offer } | { ok: false; error: string } {
  const o: Offer = {
    slug: str(raw.slug, 60).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    treatment: str(raw.treatment, 40),
    name: str(raw.name, 80),
    headline: str(raw.headline, 120),
    sub: str(raw.sub, 600),
    includes: (Array.isArray(raw.includes) ? raw.includes : []).map((x) => str(x, 100)).filter(Boolean).slice(0, 6),
    price: Math.round(Number(raw.price) * 100) / 100,
    usual: Math.round(Number(raw.usual) * 100) / 100,
    spots: Math.round(Number(raw.spots)),
    claimed: Math.max(0, Math.round(Number(raw.claimed ?? existing?.claimed ?? 0)) || 0),
    clinic: raw.clinic === "booragoon" || raw.clinic === "leederville" ? raw.clinic : "both",
    ends: str(raw.ends, 10),
    live: raw.live === true,
    updated: new Date().toISOString(),
  };
  if (!o.slug) return { ok: false, error: "Give the offer a short link name" };
  if (!o.name || !o.headline) return { ok: false, error: "The offer needs a name and a headline" };
  if (INJECTABLE_IDS.has(o.treatment) || INJ_WORDS.test([o.name, o.headline, o.sub, o.includes.join(" ")].join(" ")))
    return { ok: false, error: "Offers aren't allowed for injectables (AHPRA cosmetic guidelines). Promote a free nurse consult instead." };
  const all = [o.name, o.headline, o.sub, o.includes.join(" ")].join(" ");
  const bad = PUFFERY.exec(all);
  if (bad) return { ok: false, error: `"${bad[0]}" can't be backed up and isn't allowed in health advertising. Please reword it.` };
  if (!(o.price > 0) || !(o.usual > 0)) return { ok: false, error: "Add the offer price and the usual price" };
  if (o.price >= o.usual) return { ok: false, error: "The offer price has to be lower than the usual price" };
  if (!(o.spots >= 1 && o.spots <= 500)) return { ok: false, error: "Spots must be between 1 and 500" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(o.ends)) return { ok: false, error: "Pick an end date" };
  return { ok: true, offer: o };
}
