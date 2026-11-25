// Skinlux live apps that keep their own data: stock tracker, waitlist slot
// filler, intake form log, training hub. Stored with lib/skinlux-store.ts.
// Health answers from intake forms are NOT kept here: they go to the client's
// GoHighLevel record as a note. This log only keeps who, when and the flags.
import { readDoc, writeDoc } from "@/lib/skinlux-store";
import { currentSettings, loadSettings } from "@/lib/skinlux-settings";
import { TREATMENTS } from "@/lib/skinlux-data";

// eslint-disable-next-line
type J = Record<string, any>;
export type ClinicKey = "booragoon" | "leederville";
const CLINIC_KEYS: ClinicKey[] = ["booragoon", "leederville"];
const str = (v: unknown, n = 200) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);
const txt = (v: unknown, n = 4000) => String(v ?? "").replace(/\r/g, "").trim().slice(0, n);
const int = (v: unknown, min = 0, max = 1e6) => { const x = Math.round(Number(v)); return Number.isFinite(x) ? Math.min(max, Math.max(min, x)) : min; };
const clinicOf = (v: unknown): ClinicKey => (String(v).toLowerCase() === "leederville" ? "leederville" : "booragoon");
export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ---------------- stock ---------------- */
export type StockItem = { id: string; name: string; clinic: ClinicKey; kind: "retail" | "consumable"; left: number | null; min: number; order: number; supplier: string };
export type Stock = { items: StockItem[]; updated?: string };

const CONSUMABLES = ["HIFU cartridges", "Skin needling tips", "Carbon lotion", "Ultrasound gel", "IPL cooling gel", "Numbing cream", "Clinical peel solution", "Advanced peel solution", "LED eye shields", "Exosome serum", "Gloves", "Face masks (single use)"];

export function stockDefaults(): Stock {
  const st = currentSettings();
  const items: StockItem[] = [];
  for (const c of CLINIC_KEYS) {
    for (const p of st.products) items.push({ id: `r-${c}-${slug(p.name)}`, name: p.name, clinic: c, kind: "retail", left: null, min: 3, order: 0, supplier: "Skincare Doctor" });
    for (const n of CONSUMABLES) items.push({ id: `c-${c}-${slug(n)}`, name: n, clinic: c, kind: "consumable", left: null, min: 2, order: 0, supplier: "" });
  }
  return { items };
}
function slug(x: string) { return x.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40); }

export async function loadStock(): Promise<Stock> {
  await loadSettings().catch(() => null);
  const saved = await readDoc<Stock>("stock").catch(() => null);
  if (!saved || !Array.isArray(saved.items)) return stockDefaults();
  // products added in Settings later show up here too
  const have = new Set(saved.items.map((i) => i.clinic + "|" + i.name));
  for (const d of stockDefaults().items) if (d.kind === "retail" && !have.has(d.clinic + "|" + d.name)) saved.items.push(d);
  return saved;
}

export function cleanStock(raw: J): Stock | null {
  if (!raw || !Array.isArray(raw.items) || raw.items.length > 600) return null;
  const items: StockItem[] = raw.items.map((i: J): StockItem => ({
    id: str(i.id, 60) || newId(), name: str(i.name, 90), clinic: clinicOf(i.clinic), kind: i.kind === "consumable" ? "consumable" : "retail",
    left: i.left === null || i.left === "" || i.left === undefined ? null : int(i.left, 0, 100000), min: int(i.min, 0, 10000),
    order: int(i.order, 0, 10000), supplier: str(i.supplier, 80),
  })).filter((i: StockItem) => i.name);
  return { items, updated: new Date().toISOString() };
}

/** A product sold (staff app or Shopify) takes one off that clinic's count. */
export async function takeFromStock(clinic: string, product: string, qty = 1): Promise<void> {
  try {
    const s = await loadStock();
    const it = s.items.find((i) => i.kind === "retail" && i.clinic === clinic && i.name === product);
    if (!it || it.left === null) return;
    it.left = Math.max(0, it.left - qty);
    s.updated = new Date().toISOString();
    await writeDoc("stock", s);
  } catch { /* stock is a helper; a miss must not stop the sale */ }
}

/* ---------------- waitlist ---------------- */
export type WaitPerson = { id: string; at: number; clinic: ClinicKey; first: string; last: string; phone: string; email: string; treatment: string; times: string; note: string; status: "waiting" | "offered" | "booked" | "removed"; contactId?: string };
export type WaitSlot = { id: string; at: number; clinic: ClinicKey; treatment: string; when: string; status: "open" | "filled" | "closed"; filledBy?: string };
export type Waitlist = { people: WaitPerson[]; slots: WaitSlot[]; updated?: string };

export async function loadWaitlist(): Promise<Waitlist> {
  const w = await readDoc<Waitlist>("waitlist").catch(() => null);
  return w && Array.isArray(w.people) ? { people: w.people, slots: w.slots || [] } : { people: [], slots: [] };
}
export function cleanWaitPerson(raw: J): WaitPerson | { error: string } {
  const first = str(raw.first_name || raw.first, 40), phone = str(raw.phone, 30), email = str(raw.email, 120).toLowerCase();
  if (!first) return { error: "Please add your first name." };
  if (phone.replace(/\D/g, "").length < 9) return { error: "Please add your mobile number." };
  const treatment = str(raw.treatment, 60);
  if (!TREATMENTS.some((t) => t.name === treatment) && treatment !== "Any treatment") return { error: "Pick a treatment." };
  return { id: newId(), at: Date.now(), clinic: clinicOf(raw.clinic), first, last: str(raw.last_name || raw.last, 40), phone, email,
    treatment, times: str(raw.times, 80) || "Any time", note: str(raw.note, 300), status: "waiting" };
}
export function cleanWaitlist(raw: J, prev: Waitlist): Waitlist | null {
  if (!raw || !Array.isArray(raw.people) || !Array.isArray(raw.slots)) return null;
  const byId: Record<string, WaitPerson> = {};
  prev.people.forEach((p) => (byId[p.id] = p));
  // HQ can change status and note only; people join through the public page
  const people = prev.people.map((p) => {
    const e = (raw.people as J[]).find((x) => x && x.id === p.id);
    if (!e) return p;
    const status = ["waiting", "offered", "booked", "removed"].includes(e.status) ? e.status : p.status;
    return { ...p, status, note: str(e.note, 300) };
  });
  const slots: WaitSlot[] = (raw.slots as J[]).slice(0, 300).map((s): WaitSlot => ({
    id: str(s.id, 40) || newId(), at: Number(s.at) || Date.now(), clinic: clinicOf(s.clinic), treatment: str(s.treatment, 60) || "Any treatment",
    when: str(s.when, 80), status: s.status === "filled" ? "filled" : s.status === "closed" ? "closed" : "open", filledBy: str(s.filledBy, 40) || undefined,
  })).filter((s) => s.when);
  return { people, slots, updated: new Date().toISOString() };
}

/* ---------------- intake forms ---------------- */
export type IntakeRow = { id: string; at: number; clinic: ClinicKey; name: string; contactId?: string; treatment: string; visit: string; flags: string[]; cleared: boolean; clearedBy?: string };
export type IntakeLog = { forms: IntakeRow[]; updated?: string };
export async function loadIntake(): Promise<IntakeLog> {
  const d = await readDoc<IntakeLog>("intake").catch(() => null);
  return d && Array.isArray(d.forms) ? d : { forms: [] };
}

/* ---------------- training hub ---------------- */
export type Protocol = { id: string; treatment: string; steps: string[]; contra: string[]; rebook: string; status: "draft" | "signed"; signedBy: string; updated: string };
export type Guide = { id: string; title: string; body: string };
export type Training = { protocols: Protocol[]; guides: Guide[]; reads: Record<string, Record<string, string>>; updated?: string };

// Draft steps from the demo, written from Skinlux's menu. Jellie and the nurses
// confirm each one in HQ before it counts as signed off.
const DRAFT_STEPS: Record<string, string[]> = {
  "HIFU": ["Consult, photos front and side, sign consent.", "Cleanse, remove all makeup, mark the treatment zones.", "Apply ultrasound gel and choose cartridge depth per zone.", "Treat in lines across each zone, checking comfort every pass.", "Wipe off gel, apply calming serum and SPF.", "Book the 3 month progress consult before they leave."],
  "Carbon Laser": ["Consult and sign consent. Check for recent sun or tan.", "Cleanse and dry the skin fully.", "Apply a thin, even layer of carbon lotion and let it dry.", "Eye protection on for client and therapist.", "Laser pass to remove the carbon, then a second pass on target areas.", "Cleanse, LED if booked, then SPF.", "Book the next session in 3 weeks."],
  "Wrinkle relaxers": ["Nurse only. Medical history and consult with the nurse.", "Photos and consent signed.", "Nurse treatment as per prescriber plan.", "Aftercare given by the nurse on the day.", "Book the 2 week review if it is a first visit."],
  "Bio stimulating injection": ["Nurse only. Check allergies and recent laser or peels.", "Photos and consent signed.", "Numbing as per nurse.", "Nurse treatment as per prescriber plan.", "Aftercare given by the nurse.", "Book the next treatment in 4 to 6 weeks."],
  "Fillers": ["Nurse only. Full consult and medical history.", "Photos and consent signed.", "Nurse treatment as per prescriber plan.", "Aftercare given by the nurse.", "Book the review."],
  "IPL Skin Correction": ["Consult, skin type check, test patch at least 7 days before.", "Cleanse and shave any fine hair in the area.", "Eye protection on. Apply cooling gel.", "Treat in a single even pass, extra pass on pigment if tolerated.", "Remove gel, apply soothing balm and SPF 50.", "Explain that spots darken first. Book the next session in 4 weeks."],
  "Skin needling": ["Check the intake form for retinol, acne flare or recent sun.", "Photos, consent, cleanse.", "Numbing cream for 20 minutes, then remove.", "Apply serum and needle in sections at the planned depth.", "Apply growth factor or exosome serum and mask if booked.", "No makeup advice, aftercare text, book 4 weeks out."],
  "Bright and Tight": ["Consult and skin check.", "Double cleanse.", "Exfoliation step.", "Brightening and tightening steps as per the Bright and Tight menu.", "Mask and LED.", "Finish with serum and SPF. Book monthly."],
  "Clinical Peels": ["Consult and check for retinol use in the last 5 days.", "Cleanse and prep with degreaser.", "Apply peel, time each layer and watch the skin.", "Neutralise or remove as per peel type.", "LED, then calming serum and SPF.", "Book the next peel in 2 weeks."],
  "Advanced Peels": ["Consult and pre peel prep plan agreed.", "Photos and consent signed.", "Cleanse and degrease.", "Apply peel to the agreed level, timing each layer.", "Remove, apply post peel balm and SPF.", "Explain the peeling days. Book a check at 7 days."],
  "Nano fractional RF": ["Consult, photos and consent.", "Numbing cream for 30 to 40 minutes.", "Remove numbing and cleanse well.", "Treat in sections at the planned energy level.", "No products after, explain nothing on the skin for 24 hours.", "Book the next session in 4 weeks."],
  "Diamond Polar RF": ["Consult and skin check.", "Cleanse.", "Apply conductive gel.", "Treat each zone until the target temperature is held.", "Remove gel, apply serum. Makeup is fine after.", "Book next week to keep the course on track."],
  "Electrocautery": ["Consult and check for blood thinners.", "Photos of each lesion and consent.", "Cleanse and numb the area.", "Treat each lesion.", "Apply healing balm. Explain scabbing for about a week.", "No rebook needed unless more spots."],
  "Exo Grow": ["Consult, scalp photos and history.", "Cleanse the scalp.", "Apply the treatment to the thinning areas.", "Scalp massage and LED if booked.", "Book the next session in 4 weeks and take progress photos each visit."],
  "LED therapy": ["Cleanse.", "Choose the light setting for the concern.", "Eye protection on.", "30 minutes under the panel.", "Serum and SPF. Suggest a weekly course for calm skin."],
  "Body Sculpting": ["Consult and check for pacemaker, metal implants or pregnancy.", "Measurements and photos.", "Set up the applicators on the area.", "Run the programme for 30 minutes per area.", "Water and light movement advice.", "Book the full weekly course."],
  "Plasma Fibroblast": ["Consult, photos and consent.", "Numbing cream for 30 minutes.", "Treat in a dot pattern across the area.", "Apply healing balm.", "Explain the carbon dots and swelling for about 7 days.", "Book a check at 2 weeks."],
  "IPL hair removal (SHR)": ["Check there was no spray tan, waxing or sun in the last 2 weeks.", "Shave the area if needed, then cleanse.", "Eye protection on. Apply cooling gel.", "Treat in the SHR sweep motion until the area is covered.", "Remove gel, apply soothing gel.", "Book the next session in 3 to 4 weeks before they leave."],
};
const BASE_CONTRA = ["Active skin infection, open wounds or cold sores in the area", "Pregnant or breastfeeding, unless the treatment is cleared for it", "Retinol, acids or exfoliants in the last 5 to 7 days", "Recent sun, tan or spray tan"];

export function trainingDefaults(): Training {
  const st = currentSettings();
  return {
    protocols: TREATMENTS.map((t) => {
      const days = st.treatments.find((x) => x.name === t.name)?.rebookDays ?? t.rebookDays;
      return { id: slug(t.name), treatment: t.name, steps: DRAFT_STEPS[t.name] || [], contra: BASE_CONTRA.slice(),
        rebook: days ? `Your next ${t.name} is due in about ${Math.round(days / 7)} weeks. I have a time free then, shall I book it in for you now?` : "",
        status: "draft", signedBy: "", updated: "" };
    }),
    guides: [
      { id: "rebooking-method", title: "The Skinlux rebooking method", body: "1. Plan the course in the consult: how many sessions and why.\n2. Show one change they can see today, with the before photo or the mirror.\n3. Suggest the date, don't ask an open question.\n4. Book it in Timely while they are in the chair, then tap Treatment done in the staff app.\n5. Recommend one home care product that suits today's treatment.\n6. If they won't book, they go on the call back list a week after their due date." },
      { id: "new-starter", title: "New starter checklist", body: "Uniform and name badge\nTimely login and PIN\nStaff app password and how to tap Treatment done\nClinic tour, fire exits and first aid kit\nIntake and consent form process\nShadow a senior therapist for 2 full days\nIPL safety\nRebooking method\nFirst supervised treatment\nRetail product training\nSign off by Jellie" },
    ],
    reads: {},
  };
}

export async function loadTraining(): Promise<Training> {
  await loadSettings().catch(() => null);
  const saved = await readDoc<Training>("training").catch(() => null);
  if (!saved || !Array.isArray(saved.protocols)) return trainingDefaults();
  const have = new Set(saved.protocols.map((p) => p.treatment));
  for (const d of trainingDefaults().protocols) if (!have.has(d.treatment)) saved.protocols.push(d);
  saved.guides = saved.guides || [];
  saved.reads = saved.reads || {};
  return saved;
}

export function cleanTraining(raw: J, prev: Training): Training | null {
  if (!raw || !Array.isArray(raw.protocols) || raw.protocols.length > 80) return null;
  const protocols: Protocol[] = raw.protocols.map((p: J): Protocol => {
    const old = prev.protocols.find((x) => x.id === p.id);
    const steps = (Array.isArray(p.steps) ? p.steps : []).map((s: unknown) => txt(s, 400)).filter(Boolean).slice(0, 30);
    const contra = (Array.isArray(p.contra) ? p.contra : []).map((s: unknown) => txt(s, 300)).filter(Boolean).slice(0, 30);
    const status: Protocol["status"] = p.status === "signed" ? "signed" : "draft";
    const changed = !old || JSON.stringify([old.steps, old.contra, old.rebook, old.status, old.signedBy]) !== JSON.stringify([steps, contra, txt(p.rebook, 600), status, str(p.signedBy, 60)]);
    return { id: str(p.id, 60) || newId(), treatment: str(p.treatment, 80), steps, contra, rebook: txt(p.rebook, 600), status,
      signedBy: status === "signed" ? str(p.signedBy, 60) : "", updated: changed ? new Date().toISOString() : (old ? old.updated : "") };
  }).filter((p: Protocol) => p.treatment);
  const guides: Guide[] = (Array.isArray(raw.guides) ? raw.guides : []).slice(0, 40).map((g: J) => ({ id: str(g.id, 60) || newId(), title: str(g.title, 120), body: txt(g.body, 8000) })).filter((g: Guide) => g.title);
  return { protocols, guides, reads: prev.reads || {}, updated: new Date().toISOString() };
}

export async function markRead(member: string, protocolId: string): Promise<boolean> {
  const m = str(member, 60), p = str(protocolId, 60);
  if (!m || !p) return false;
  const t = await loadTraining();
  if (!t.protocols.some((x) => x.id === p)) return false;
  t.reads[m] = t.reads[m] || {};
  t.reads[m][p] = new Date().toISOString();
  await writeDoc("training", t);
  return true;
}
