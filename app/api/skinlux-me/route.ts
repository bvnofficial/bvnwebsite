import { NextRequest, NextResponse } from "next/server";
import { readToken } from "@/lib/skinlux-me";
import { addNote, addTask, ghl } from "@/lib/skinlux-ghl";
import { editedAftercare } from "@/lib/skinlux-events";
import { CLINICS, TREATMENTS } from "@/lib/skinlux-data";
import { loadSettings } from "@/lib/skinlux-settings";
import { logEvent } from "@/lib/skinlux-store";

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
      : t.aftercare ? t.aftercare.charAt(0).toUpperCase() + t.aftercare.slice(1) + "."
      : "Your therapist went through your aftercare with you. Any questions, message us here.");
  }
  const prodName = f("Last product bought");
  const prod = st.products.find((p) => p.name === prodName);
  const routine = st.products.filter((p) => p.routine === "everyone").map((p) => ({ name: p.name, use: p.use, price: p.price }));
  return out(200, {
    ok: true,
    first: String(c.firstName || "").trim(),
    clinic: who.clinic, clinicName: CLINICS[who.clinic].name, phone: st.phones[who.clinic] || CLINICS[who.clinic].phone,
    booking: st.booking,
    last: lastT ? { treatment: lastT, date: niceDate(f("Last treatment date")), aftercare, injectable: !!(t && t.injectable) } : null,
    next: f("Next due date") ? { date: niceDate(f("Next due date")), treatment: lastT } : null,
    pack: f("Package name") ? { name: f("Package name"), left: Number(f("Package sessions left")) || 0 } : null,
    product: prodName ? { name: prodName, use: prod ? prod.use : "", price: prod ? prod.price : "", reorder: niceDate(f("Product reorder date")) } : null,
    routine,
  });
}

export async function POST(req: NextRequest) {
  const b = (await req.json().catch(() => null)) as { k?: string; action?: string; text?: string; product?: string } | null;
  const who = b && readToken(String(b.k || ""));
  if (!b || !who) return out(401, { ok: false, error: "This link isn't valid. Ask the clinic for a new one." });
  const r = await contact(who.clinic, who.contactId);
  if (!r) return out(404, { ok: false, error: "We couldn't find your details." });
  const name = `${r.c.firstName || ""} ${r.c.lastName || ""}`.trim();
  const text = String(b.text || "").replace(/\s+/g, " ").trim().slice(0, 1000);
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
  const ok = await addNote(who.clinic, who.contactId, note);
  await addTask(who.clinic, who.contactId, title, note, 4);
  await logEvent({ k: "client_app", c: who.clinic, n: `${r.c.firstName || ""} ${String(r.c.lastName || "").slice(0, 1)}`.trim(), i: b.action, s: b.action });
  return ok ? out(200, { ok: true }) : out(502, { ok: false, error: "Sorry, that didn't go through. Please call the clinic." });
}
