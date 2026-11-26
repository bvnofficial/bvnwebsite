import { NextRequest, NextResponse } from "next/server";
import { readToken } from "@/lib/skinlux-me";
import { addNote, addTask, ghl } from "@/lib/skinlux-ghl";
import { editedAftercare } from "@/lib/skinlux-events";
import { aftercareGuide } from "@/lib/skinlux-aftercare";
import { CLINICS, TREATMENTS } from "@/lib/skinlux-data";
import { loadSettings } from "@/lib/skinlux-settings";
import { logEvent, readEvents } from "@/lib/skinlux-store";
import { addClientMsg, saveDataUrl } from "@/lib/skinlux-team";

/**
 * My Skinlux client app data. The private link's ?k= is the only key.
 *   GET  ?k=...                                     the client's own details
 *   POST { k, action: "message"|"reorder"|"callback", text?, product? }
 * Messages land on the GoHighLevel contact as a note plus a task for the team.
 */
export const dynamic = "force-dynamic";
const out = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
// eslint-disable-next-line
type J = Record<string, any>;

async function contact(clinic: string, id: string): Promise<{ c: J; f: (n: string) => string } | null> {
  const [d, cf] = await Promise.all([ghl(clinic, `/contacts/${id}`), ghl(clinic, `/locations/{loc}/customFields?model=contact`)]);
  const c = d && d.contact;
  if (!c) return null;
  const names: Record<string, string> = {};
  ((cf && cf.customFields) || []).forEach((x: J) => (names[x.id] = String(x.name)));
  const f = (n: string) => {
    const hit = (c.customFields || []).find((x: J) => names[x.id] === n);
    const v = hit ? hit.value ?? hit.fieldValue : "";
    return Array.isArray(v) ? v.join(", ") : String(v ?? "").trim();
  };
  return { c, f };
}
const niceDate = (v: string) => {
  const t = Date.parse(v);
  return t ? new Date(t).toLocaleDateString("en-AU", { timeZone: "Australia/Perth", weekday: "long", day: "numeric", month: "long" }) : "";
};

export async function GET(req: NextRequest) {
  const who = readToken(req.nextUrl.searchParams.get("k") || "");
  if (!who) return out(401, { ok: false, error: "This link isn't valid. Ask the clinic for a new one." });
  const r = await contact(who.clinic, who.contactId);
  if (!r) return out(404, { ok: false, error: "We couldn't find your details. Ask the clinic for a new link." });
  const { c, f } = r;
  const st = await loadSettings();
  const lastT = f("Last treatment");
  const t = TREATMENTS.find((x) => x.name === lastT);
  let aftercare = "";
  if (t) {
    const edited = await editedAftercare(who.clinic, t.name, t.injectable).catch(() => null);
    aftercare = edited || (t.injectable ? "Follow the aftercare your nurse gave you. Any questions or worries, message us here and a nurse will call you."
      : t.aftercare || "Your therapist went through your aftercare with you. Any questions, message us here.");
    aftercare = aftercare.replace(/reply here/gi, "message us here");
  }
  const prodName = f("Last product bought");
  const prod = st.products.find((p) => p.name === prodName);
  const routine = st.products.filter((p) => p.routine === "everyone").map((p) => ({ name: p.name, use: p.use, price: p.price }));
  // their visits and purchases, from the staff app taps
  const mine = (await readEvents(400).catch(() => [])).filter((e) => e.cid === who.contactId && (e.k === "treatment_done" || e.k === "product_sold"));
  const history = mine.slice(0, 20).map((e) => ({
    date: new Date((e.at || 0) + 8 * 3600_000).toLocaleDateString("en-AU", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }),
    what: e.k === "treatment_done" ? String(e.i || "Treatment") : `Bought ${String(e.i || "a product").replace(/^Skin[Cc]are Doctor /, "")}`,
    who: e.k === "treatment_done" ? String(e.t || "") : "",
  }));
  const shop = (await ghl(who.clinic, `/locations/{loc}/customValues`).catch(() => null)) as { customValues?: { name: string; value: string }[] } | null;
  const shopLink = ((shop && shop.customValues) || []).find((v) => v.name === "shop_link")?.value || "https://skinluxfaceandbody.myshopify.com/";
  return out(200, {
    ok: true,
    first: String(c.firstName || "").trim(),
    clinic: who.clinic, clinicName: CLINICS[who.clinic].name, phone: st.phones[who.clinic] || CLINICS[who.clinic].phone,
    booking: st.booking,
    last: lastT ? { treatment: lastT, date: niceDate(f("Last treatment date")), aftercare, guide: aftercareGuide(lastT), injectable: !!(t && t.injectable) } : null,
    next: f("Next due date") ? { date: niceDate(f("Next due date")), treatment: lastT } : null,
    birthday: c.dateOfBirth ? String(c.dateOfBirth).slice(0, 10) : "",
    pack: f("Package name") ? { name: f("Package name"), left: Number(f("Package sessions left")) || 0 } : null,
    product: prodName ? { name: prodName, use: prod ? prod.use : "", price: prod ? prod.price : "", reorder: niceDate(f("Product reorder date")) } : null,
    routine, history, shop: /^https:\/\//.test(shopLink) ? shopLink : "https://skinluxfaceandbody.myshopify.com/",
  });
}

export async function POST(req: NextRequest) {
  const b = (await req.json().catch(() => null)) as { k?: string; action?: string; text?: string; product?: string; dob?: string; photo?: string } | null;
  const who = b && readToken(String(b.k || ""));
  if (!b || !who) return out(401, { ok: false, error: "This link isn't valid. Ask the clinic for a new one." });
  const r = await contact(who.clinic, who.contactId);
  if (!r) return out(404, { ok: false, error: "We couldn't find your details." });
  const name = `${r.c.firstName || ""} ${r.c.lastName || ""}`.trim();
  const text = String(b.text || "").replace(/\s+/g, " ").trim().slice(0, 1000);
  if (b.action === "birthday") {
    const dob = String(b.dob || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return out(400, { ok: false, error: "Pick your birthday first." });
    const done = await ghl(who.clinic, `/contacts/${who.contactId}`, { method: "PUT", body: { dateOfBirth: dob } });
    return done ? out(200, { ok: true }) : out(502, { ok: false, error: "Sorry, that didn't save. Please try again." });
  }
  let note = "", title = "";
  if (b.action === "message") {
    if (text.length < 2) return out(400, { ok: false, error: "Type your message first." });
    note = `Message from the My Skinlux app: ${text}`;
    title = `Reply to ${name}: message from the client app`;
  } else if (b.action === "reorder") {
    const p = String(b.product || "").slice(0, 120);
    note = `Asked to set aside ${p || "their product"} from the My Skinlux app.${text ? ` Note: ${text}` : ""}`;
    title = `Set aside ${p || "a product"} for ${name}`;
  } else if (b.action === "callback") {
    note = `Asked for a call back from the My Skinlux app.${text ? ` Note: ${text}` : ""}`;
    title = `Call ${name} back: asked in the client app`;
  } else return out(400, { ok: false, error: "Unknown" });
  // photo of their skin for the nurse or therapist (private file, only HQ and the staff app can open it)
  let photo = "";
  if (b.action === "message" && b.photo) {
    photo = (await saveDataUrl("clientmsg", String(b.photo), 6_000_000).catch(() => ({ path: "" }))).path;
    if (photo) note += " (Sent a photo: open it in the staff app or Skinlux HQ.)";
  }
  // goes to the therapist who last treated them
  const lastVisit = (await readEvents(400).catch(() => [])).find((e) => e.cid === who.contactId && e.k === "treatment_done");
  const therapist = lastVisit && lastVisit.t ? String(lastVisit.t) : "";
  if (therapist) title += ` (for ${therapist})`;
  const ok = await addNote(who.clinic, who.contactId, note);
  await addTask(who.clinic, who.contactId, title, note, 4);
  await addClientMsg({ clinic: who.clinic, contactId: who.contactId, name, phone: String(r.c.phone || ""), kind: String(b.action), text: text || note, photo: photo || undefined, therapist }).catch(() => null);
  await logEvent({ k: "client_app", c: who.clinic, n: `${r.c.firstName || ""} ${String(r.c.lastName || "").slice(0, 1)}`.trim(), i: b.action, s: b.action });
  return ok ? out(200, { ok: true }) : out(502, { ok: false, error: "Sorry, that didn't go through. Please call the clinic." });
}
