// Skinlux: real free times from Timely's public online booking page (the same
// page clients book on: book.gettimely.com, booking group 18199). Read only: it
// walks location -> treatment -> open dates -> time slots and stops there, so
// nothing is ever booked or held. No login, no client data.
//
// This reads Timely's booking page the way a browser does, not an official API.
// If Timely changes that page, lookups return ok:false and the AI falls back to
// a booking request for the team. Once Timely admin access is shared, this can
// move to Timely's own API.

const BASE = "https://book.gettimely.com";
const GROUP = "18199";
export const TIMELY_LOCATION: Record<string, string> = { booragoon: "24867", leederville: "418585" };

// Injectables: never show names or prices from the booking page (AHPRA, TGA).
export const INJECTABLE_RE = /rejuran|polynucleotide|cosmetic (injection|treatment)|filler|wrinkle|anti.?wrinkle|botox|dysport|xeomin|relaxer|lip|skin booster|profhilo|bio.?stimulat/i;

type Svc = { id: string; name: string; mins: number; price: string; injectable: boolean };

class Jar {
  m = new Map<string, string>();
  header() { return Array.from(this.m).map(([k, v]) => `${k}=${v}`).join("; "); }
  keep(res: Response) {
    const h = res.headers as Headers & { getSetCookie?: () => string[] };
    for (const c of h.getSetCookie ? h.getSetCookie() : []) {
      const kv = c.split(";")[0], i = kv.indexOf("=");
      if (i > 0) this.m.set(kv.slice(0, i).trim(), kv.slice(i + 1));
    }
  }
}

async function go(jar: Jar, url: string, init: { method?: string; body?: URLSearchParams } = {}, ms = 12000): Promise<{ url: string; text: string }> {
  let u = url.startsWith("http") ? url : BASE + url;
  let opts = init;
  const ac = new AbortController(), timer = setTimeout(() => ac.abort(), ms);
  try {
    for (let hop = 0; hop < 8; hop++) {
      const res = await fetch(u, {
        method: opts.method || "GET", body: opts.body, redirect: "manual", cache: "no-store", signal: ac.signal,
        headers: { cookie: jar.header(), "user-agent": "Mozilla/5.0 (SkinluxHQ availability)", ...(opts.body ? { "content-type": "application/x-www-form-urlencoded" } : {}) },
      });
      jar.keep(res);
      if (res.status === 429 && hop < 2) { await new Promise((r) => setTimeout(r, 2500)); continue; }
      if (res.status >= 300 && res.status < 400 && res.headers.get("location")) { u = new URL(res.headers.get("location") as string, u).href; opts = {}; continue; }
      if (!res.ok) throw new Error(`Timely ${res.status}`);
      return { url: u, text: await res.text() };
    }
    throw new Error("Too many redirects");
  } finally { clearTimeout(timer); }
}

const ent = (s: string) => s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function inputs(html: string): { name: string; value: string; type: string }[] {
  return Array.from(html.matchAll(/<input\b[^>]*>/gi)).map((m) => {
    const t = m[0];
    return { name: ent((t.match(/\bname="([^"]*)"/) || [])[1] || ""), value: ent((t.match(/\bvalue="([^"]*)"/) || [])[1] || ""), type: ((t.match(/\btype="([^"]*)"/) || [])[1] || "").toLowerCase() };
  }).filter((x) => x.name);
}

function mins(attr: string): number {
  const h = /(\d+)\s*hour/.exec(attr), m = /(\d+)\s*min/.exec(attr);
  return (h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0);
}

async function openServicePage(jar: Jar, clinic: string): Promise<{ url: string; text: string }> {
  const loc = TIMELY_LOCATION[clinic];
  if (!loc) throw new Error("Unknown clinic");
  const first = await go(jar, `/Booking/Location/${GROUP}`);
  const form = (first.text.match(/<form[^>]*action="([^"]*)"[^>]*>([\s\S]*?)<\/form>/i) || []);
  if (!form[1]) throw new Error("No location form");
  const body = new URLSearchParams();
  for (const f of inputs(form[2])) if (f.name !== "LocationId" && f.name !== "commit" && f.type !== "radio") body.append(f.name, f.value);
  body.append("LocationId", loc);
  body.append("commit", "submit");
  return go(jar, ent(form[1]), { method: "POST", body });
}

const svcCache: Record<string, { at: number; list: Svc[] }> = {};

export async function timelyServices(clinic: string): Promise<Svc[]> {
  const c = svcCache[clinic];
  if (c && Date.now() - c.at < 30 * 60_000) return c.list;
  const page = await openServicePage(new Jar(), clinic);
  const list: Svc[] = Array.from(page.text.matchAll(/<input id="service\d+"[^>]*data-name="([^"]*)"[^>]*value="([^"]+)"[\s\S]*?select-list__item-attr">([\s\S]*?)<\/div>/g)).map((m) => {
    const name = ent(m[1]).replace(/\s+/g, " ").trim(), attr = ent(m[3]).replace(/\s+/g, " ").trim();
    const price = (attr.split("·")[1] || "").trim();
    return { id: m[2], name, mins: mins(attr), price, injectable: INJECTABLE_RE.test(name) };
  });
  if (!list.length) throw new Error("No services found");
  svcCache[clinic] = { at: Date.now(), list };
  return list;
}

// words people use, mapped to words on the Timely menu
const SYN: [RegExp, string][] = [
  [/hollywood|carbon/i, "carbon laser peel"], [/needl|microneedl|collagen induction/i, "skin needling"], [/ipl hair|laser hair|hair remov|shr/i, "hair removal"],
  [/pigment|sun ?spot|sun damage|photo ?rejuv|ipl skin|redness|rosacea|capillar/i, "photorejuvenation"], [/fractional|rf micro|nano/i, "fractional rf"],
  [/diamond|polar/i, "diamond polar"], [/skin tag|lesion|electro/i, "pigmented lesion skin tags"], [/hair loss|thinning|exo.?grow/i, "exo-grow"],
  [/led|light therapy/i, "led treatment"], [/ems|body sculpt|tone|venus|cellulite/i, "body sculpting"], [/tattoo/i, "laser tattoo removal"],
  [/^\s*(a\s+)?(chemical\s+|skin\s+)?peels?\s*$/i, "resurfacing peel led"], [/peel/i, "peel"], [/hifu|ultherapy|double chin/i, "hifu"], [/^\s*(a\s+|free\s+|skin\s+)*consult(ation)?\s*$/i, "advanced skin consultation treatment"], [/consult/i, "consultation"], [/bright/i, "bright tight"], [/dermaplan/i, "dermaplaning"],
];

export function matchService(list: Svc[], text: string): { best: Svc | null; others: Svc[] } {
  const q = text.toLowerCase();
  if (INJECTABLE_RE.test(q) || /inject|nurse consult/i.test(q)) {
    const consult = list.find((s) => /cosmetic treatment consultation/i.test(s.name)) || null;
    return { best: consult, others: [] };
  }
  // hair removal is listed by body area on the Timely menu (Brazilian, Underarms...)
  if (/hair remov|laser hair|ipl hair|\bshr\b/i.test(q)) {
    const area = q.replace(/ipl|shr|laser|hair|removal|remove|for|my|the|and|\s+/gi, " ").trim();
    if (area.length > 2) {
      const r = matchService(list.filter((x) => !/consult|pack|upfront/i.test(x.name)), area);
      if (r.best) return r;
    }
    return { best: list.find((x) => /hair removal consult/i.test(x.name)) || null, others: [] };
  }
  const extra = SYN.filter(([re]) => re.test(q)).map(([, w]) => w).join(" ");
  const words = (q + " " + extra).replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !/^(the|and|for|with|book|booking|appointment|available|availability|time|times|session|treatment)$/.test(w));
  const scored = list.filter((s) => !s.injectable).map((s) => {
    const n = s.name.toLowerCase();
    let sc = 0, hit = 0;
    for (const w of words) if (n.includes(w)) { sc += w.length > 4 ? 2 : 1; hit++; }
    // prefer the plain version: every extra word on the menu item costs a little
    const nameWords = n.replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2).length;
    if (hit) sc -= 0.2 * Math.max(0, nameWords - hit);
    if (/pack of|x \d|course of|\d sessions/i.test(n) && !/pack|course|sessions/.test(q)) sc -= 1.5;
    if (/add on|add /i.test(n) && !/add/.test(q)) sc -= 1;
    if (/offer/i.test(n) && /offer|special|deal|promo/.test(q)) sc += 2;
    if (/consult/i.test(n) && !/consult/.test(q)) sc -= 2;
    // no body area named: the face version is the usual one
    if (!/neck|dec|chest|chin|jaw|eye|hand|arm|leg|back|abdomen|body|patch|spot|underarm|bikini|brazilian|lip|cheek|mouth|brow/.test(q) && /full face\b(?!\s*(&|and|,))/i.test(n)) sc += 1;
    return { s, sc };
  }).filter((x) => x.sc > 0).sort((a, b) => b.sc - a.sc);
  return { best: scored[0] ? scored[0].s : null, others: scored.slice(1, 5).map((x) => x.s) };
}

function perthNow(): Date { return new Date(Date.now() + 8 * 3600_000); }
function ymd(d: Date): string { return d.toISOString().slice(0, 10); }
function nice(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-AU", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" });
}
function hm(t: string): string {
  const m = /T(\d{2}):(\d{2})/.exec(t);
  if (!m) return t;
  const h = Number(m[1]);
  return `${h % 12 || 12}:${m[2]}${h < 12 ? "am" : "pm"}`;
}

/** Turns "tomorrow", "saturday", "next week", "2026-12-03" or "3 Dec" into a YYYY-MM-DD to start from. */
export function startDay(text: string): string {
  const t = String(text || "").toLowerCase().trim();
  const now = perthNow();
  const iso = /(\d{4})-(\d{2})-(\d{2})/.exec(t);
  if (iso) return iso[0];
  if (!t || /today|soon|asap|earliest|next available|any/.test(t)) return ymd(now);
  if (/tomorrow/.test(t)) return ymd(new Date(now.getTime() + 86400_000));
  if (/next week/.test(t)) { const d = new Date(now); d.setUTCDate(d.getUTCDate() + ((8 - d.getUTCDay()) % 7 || 7)); return ymd(d); }
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const wd = days.findIndex((d) => t.includes(d) || t.includes(d.slice(0, 3)));
  if (wd >= 0) { const d = new Date(now); d.setUTCDate(d.getUTCDate() + ((wd - d.getUTCDay() + 7) % 7 || (t.includes("next") ? 7 : 0))); return ymd(d); }
  const mons = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const dm = /(\d{1,2})(?:st|nd|rd|th)?\s*(?:of\s*)?([a-z]{3})/.exec(t) || /([a-z]{3})[a-z]*\s*(\d{1,2})/.exec(t);
  if (dm) {
    const day = Number(/\d/.test(dm[1]) ? dm[1] : dm[2]), mon = mons.indexOf((/\d/.test(dm[1]) ? dm[2] : dm[1]).slice(0, 3));
    if (mon >= 0 && day >= 1 && day <= 31) {
      let y = now.getUTCFullYear();
      if (new Date(Date.UTC(y, mon, day)) < new Date(Date.UTC(y, now.getUTCMonth(), now.getUTCDate()))) y++;
      return `${y}-${String(mon + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }
  return ymd(now);
}

export type Availability = {
  ok: boolean; clinic: string; treatment?: string; duration_minutes?: number; price?: string;
  days?: { date: string; label: string; times: string[] }[]; other_matches?: string[]; error?: string;
};

/** Free times for a treatment at a clinic, from `from` (YYYY-MM-DD) for up to `want` open days. */
const availCache: Record<string, { at: number; v: Availability }> = {};
export async function availability(clinic: string, treatmentText: string, from: string, want = 3, partOfDay = ""): Promise<Availability> {
  const key = [clinic, treatmentText.toLowerCase().trim(), from, want, partOfDay.toLowerCase()].join("|");
  const hit = availCache[key];
  if (hit && Date.now() - hit.at < 5 * 60_000) return hit.v;
  const v = await availabilityFresh(clinic, treatmentText, from, want, partOfDay);
  if (v.ok) availCache[key] = { at: Date.now(), v };
  return v;
}
async function availabilityFresh(clinic: string, treatmentText: string, from: string, want: number, partOfDay: string): Promise<Availability> {
  const list = await timelyServices(clinic);
  const { best, others } = matchService(list, treatmentText);
  if (!best) return { ok: false, clinic, error: "no_match" };
  const jar = new Jar();
  const page = await openServicePage(jar, clinic);
  const form = page.text.match(/<form[^>]*action="([^"]*Booking\/Service[^"]*)"[^>]*>([\s\S]*?)<\/form>/i);
  if (!form) throw new Error("No service form");
  const body = new URLSearchParams();
  for (const f of inputs(form[2])) if (f.type !== "checkbox" && f.type !== "radio" && f.name !== "commit" && f.name !== "BookableTimeSlotItemIds") body.append(f.name, f.value);
  body.append("BookableTimeSlotItemIds", best.id);
  body.append("commit", "submit");
  const after = await go(jar, ent(form[1]), { method: "POST", body });
  const obg = new URL(after.url).searchParams.get("obg");
  if (!obg) throw new Error("No booking session");

  const start = from || ymd(perthNow());
  const months: [number, number][] = [];
  const s = new Date(start + "T00:00:00Z");
  for (let i = 0; i < 2; i++) { const d = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth() + i, 1)); months.push([d.getUTCMonth() + 1, d.getUTCFullYear()]); }
  const open: { day: string; am: boolean; pm: boolean }[] = [];
  for (const [m, y] of months) {
    const r = await go(jar, `/Booking/GetOpenDates?obg=${obg}&month=${m}&year=${y}&staffId=0`);
    const d = JSON.parse(r.text) as { openDates?: { day: string; isAvailableMorning: boolean; isAvailableAfternoon: boolean }[] };
    for (const x of d.openDates || []) if (x.day >= start && !open.some((o) => o.day === x.day)) open.push({ day: x.day, am: x.isAvailableMorning, pm: x.isAvailableAfternoon });
    if (open.length >= want + 2) break;
  }
  open.sort((a, b) => (a.day < b.day ? -1 : 1));
  const pod = partOfDay.toLowerCase();
  const pick = open.filter((o) => (/morn/.test(pod) ? o.am : /after|evening|night/.test(pod) ? o.pm : o.am || o.pm)).slice(0, want);
  const days: { date: string; label: string; times: string[] }[] = [];
  for (const o of pick) {
    const r = await go(jar, `/booking/gettimeslots/?obg=${obg}&dateSelected=${o.day}&staffId=0`);
    const raw = ent(r.text);
    const seen = new Set<string>();
    const times: string[] = [];
    for (const m of Array.from(raw.matchAll(/"aliasOrFirstName":"([^"]*)"[\s\S]*?"clientTimeOfService":"([^"]+)"/g))) {
      const key = m[2] + m[1];
      if (seen.has(key)) continue;
      seen.add(key);
      const h = Number((/T(\d{2})/.exec(m[2]) || [])[1]);
      if (/morn/.test(pod) && h >= 12) continue;
      if (/after/.test(pod) && (h < 12 || h >= 17)) continue;
      if (/evening|night/.test(pod) && h < 17) continue;
      times.push(`${hm(m[2])}${best.injectable ? "" : ` with ${m[1]}`}`);
    }
    if (times.length) days.push({ date: o.day, label: nice(o.day), times: times.slice(0, 8) });
  }
  return {
    ok: true, clinic, treatment: best.injectable ? "Cosmetic consultation with a registered nurse" : best.name, duration_minutes: best.mins,
    price: best.injectable ? "" : best.price, days, other_matches: others.map((x) => x.name),
  };
}
