// Apex Gates <-> GoHighLevel (the Apex Gates sub account only).
// The Apex app (quotes, bookings, the tablet) moves Simon's GHL deals along the
// Marketing Pipeline as the work happens:
//   website lead (New Lead / Hot Lead) -> booked in the app (New Booking)
//   -> technician finishes the visit (Visit Attended) -> customer signs (Sale, Won)
// and can send the "on my way" text from Apex's own GHL number.
// Server side only: the token never reaches a browser. Every call is best effort,
// so a GHL hiccup never stops a booking, a signature or a tap on the tablet.
// Env: GHL_APEX_TOKEN (Private Integration token, Apex Gates sub account).

const API = "https://services.leadconnectorhq.com";
export const GHL_LOCATION = process.env.GHL_APEX_LOCATION || "Q4zLA1JrTSM1POUrQlHl";
const PIPELINE = "w68KuY5YYiqrQZnnRChD";   // Marketing Pipeline
export const STAGES = {
  newLead: "0dc7776a-0e9d-49f6-bec2-a5b17b3bd386",
  hot: "7cf4a4df-328a-49bc-831f-4dcc962611a6",
  booking: "19af322b-dedf-4deb-af58-16d7a6e02c66",
  attended: "722597a2-2388-4330-8420-63731e985c7b",
  sale: "f35540bb-f429-4d2f-b6bc-ab8ab1d48d25",
  review: "480dd919-e1af-4d7b-9e9f-42ad784026b8",
} as const;
const STAGE_NAME: Record<string, string> = {
  [STAGES.newLead]: "New Lead", [STAGES.hot]: "Hot Lead", [STAGES.booking]: "New Booking",
  [STAGES.attended]: "Visit Attended", [STAGES.sale]: "Sale", [STAGES.review]: "Left a Review",
};
const ORDER = [STAGES.newLead, STAGES.hot, STAGES.booking, STAGES.attended, STAGES.sale, STAGES.review] as string[];
export const OPP_ID = /^[A-Za-z0-9]{10,40}$/;

const token = () => process.env.GHL_APEX_TOKEN || "";
export const ghlOn = () => !!token();

async function call(method: string, path: string, body?: unknown) {
  const res = await fetch(API + path, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`, Version: "2021-07-28", Accept: "application/json",
      "Content-Type": "application/json",
      // GHL sits behind Cloudflare, which refuses requests without a user agent
      "User-Agent": "bvn-apex-gates-app/1.0",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  const data: any = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`GHL ${res.status}: ${String(data?.message || data?.error || "").slice(0, 160)}`);
  return data;
}

export function auPhone(raw: string): string {
  const s = String(raw || "").replace(/[^\d+]/g, "");
  if (!s) return "";
  if (s.startsWith("+")) return s;
  if (s.startsWith("0")) return "+61" + s.slice(1);
  if (s.startsWith("61")) return "+" + s;
  return s;
}

/* ---------- status, with the text number looked up at most every 10 minutes ---------- */
let numCache: { at: number; n: number } | null = null;
export async function ghlStatus() {
  if (!ghlOn()) return { on: false, sms: false };
  let n = numCache && Date.now() - numCache.at < 600_000 ? numCache.n : -1;
  if (n < 0) {
    try { const j = await call("GET", `/phone-system/numbers/location/${GHL_LOCATION}`); n = (j.numbers || []).length; }
    catch { n = 0; }
    numCache = { at: Date.now(), n };
  }
  return { on: true, sms: n > 0 };
}
/* the office's GHL card: is it connected, and how many deals sit at each stage */
export async function ghlSummary() {
  if (!ghlOn()) return { on: false };
  const out: any = { on: true, stages: [], sms: false, location: "" };
  try { const l = await call("GET", `/locations/${GHL_LOCATION}`); out.location = l.location?.name || ""; } catch (e: any) { out.error = e.message; return out; }
  const counts: Record<string, { open: number; value: number }> = {};
  try {
    const list = await opps({ status: "all" });
    for (const o of list) { const k = o.pipelineStageId; counts[k] = counts[k] || { open: 0, value: 0 }; if (o.status === "open" || o.status === "won") { counts[k].open++; counts[k].value += +o.monetaryValue || 0; } }
  } catch (e: any) { out.error = e.message; }
  out.stages = ORDER.map((id) => ({ id, name: STAGE_NAME[id], count: counts[id]?.open || 0, value: Math.round(counts[id]?.value || 0) }));
  out.sms = (await ghlStatus()).sms;
  return out;
}

async function opps(q: { status?: string; contact?: string } = {}) {
  const out: any[] = [];
  for (let page = 1; page <= 5; page++) {
    const p = new URLSearchParams({ location_id: GHL_LOCATION, pipeline_id: PIPELINE, limit: "100", page: String(page) });
    if (q.status && q.status !== "all") p.set("status", q.status);
    if (q.contact) p.set("contact_id", q.contact);
    const j = await call("GET", `/opportunities/search?${p}`);
    out.push(...(j.opportunities || []));
    if (!j.opportunities || j.opportunities.length < 100) break;
  }
  return out;
}

/* ---------- leads waiting to be booked ---------- */
export async function ghlLeads() {
  if (!ghlOn()) return [];
  const list = (await opps({ status: "open" })).filter((o) => o.pipelineStageId === STAGES.newLead || o.pipelineStageId === STAGES.hot);
  list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const out = [];
  for (const o of list.slice(0, 40)) {
    let c: any = o.contact || {};
    try { if (o.contactId) c = { ...c, ...((await call("GET", `/contacts/${o.contactId}`)).contact || {}) }; } catch { /* keep what the search gave */ }
    const address = [c.address1, c.city, c.state, c.postalCode].filter(Boolean).join(", ");
    out.push({
      id: o.id, contactId: o.contactId, name: o.name || c.name || "", stage: STAGE_NAME[o.pipelineStageId] || "", created: Date.parse(o.createdAt) || 0,
      client: c.name || [c.firstName, c.lastName].filter(Boolean).join(" ") || o.name || "", phone: c.phone || "", email: c.email || "", address,
      source: o.source || c.source || "", tags: (c.tags || []).slice(0, 6), value: +o.monetaryValue || 0,
    });
  }
  return out;
}

async function note(contactId: string, body: string) {
  if (!contactId) return;
  try { await call("POST", `/contacts/${contactId}/notes`, { body: body.slice(0, 4000) }); } catch (e: any) { console.error("ghl note:", e.message); }
}
async function moveOpp(id: string, stage: string, extra: Record<string, unknown> = {}) {
  return call("PUT", `/opportunities/${id}`, { pipelineId: PIPELINE, pipelineStageId: stage, ...extra });
}
/* a deal only ever moves forwards from here, so a late tap never undoes a sale */
async function forward(id: string, stage: string, extra: Record<string, unknown> = {}) {
  const cur = (await call("GET", `/opportunities/${id}`)).opportunity || {};
  if (cur.pipelineId === PIPELINE && ORDER.indexOf(cur.pipelineStageId) >= ORDER.indexOf(stage)) return { moved: false, cur };
  await moveOpp(id, stage, extra);
  return { moved: true, cur };
}

/* the office booked a lead in the app */
export async function ghlBooked(v: any) {
  if (!ghlOn() || !OPP_ID.test(v?.ghl || "")) return;
  try {
    const { cur } = await forward(v.ghl, STAGES.booking);
    await note(cur.contactId, `Booked in the Apex app: ${v.kind || "visit"}${v.date ? ` on ${v.date} at ${v.start}` : " (no day yet)"}${v.tech ? ` with ${v.tech}` : ""}.${v.desc ? `\n${v.desc}` : ""}`);
  } catch (e: any) { console.error("ghl booked:", e.message); }
}
/* the technician tapped Job finished */
export async function ghlVisitDone(v: any) {
  if (!ghlOn() || !OPP_ID.test(v?.ghl || "")) return;
  try {
    const { moved, cur } = await forward(v.ghl, STAGES.attended);
    if (moved) await note(cur.contactId, `Visit done by ${v.tech || "the team"} on ${v.date || "the day"}.${v.notes ? `\n${v.notes}` : ""}`);
  } catch (e: any) { console.error("ghl visit done:", e.message); }
}

async function contactFor(c: { name?: string; phone?: string; email?: string; address?: string }, source: string) {
  const name = String(c.name || "").trim(), phone = auPhone(c.phone || ""), email = String(c.email || "").trim();
  if (!name || (!phone && !email)) return "";
  const [firstName, ...rest] = name.split(/\s+/);
  const j = await call("POST", "/contacts/upsert", { locationId: GHL_LOCATION, name, firstName, lastName: rest.join(" "), phone: phone || undefined, email: email || undefined, address1: c.address || undefined, source });
  return j.contact?.id || j.id || "";
}

/* a quote went ahead: the customer's deal goes to Sale and is marked Won, with the amount */
export async function ghlQuoteWon(q: any, how: { inc?: number; signedBy?: string; no?: string } = {}) {
  if (!ghlOn() || !q) return null;
  try {
    const c = q.client || {};
    const contactId = await contactFor(c, "Apex app quote");
    if (!contactId) return null;
    const value = Math.round(Number(how.inc) || Number(q.inc) || 0);
    const no = how.no || q.no || "";
    const mine = (await opps({ contact: contactId })).filter((o) => o.status !== "lost" && o.status !== "abandoned");
    let id = OPP_ID.test(q.ghl || "") ? q.ghl : "";
    if (!id) { const open = mine.find((o) => o.status === "open") || mine[0]; id = open ? open.id : ""; }
    if (id) {
      const cur = mine.find((o) => o.id === id);
      if (cur && cur.status === "won" && cur.pipelineStageId === STAGES.sale) return id;
      await moveOpp(id, STAGES.sale, { status: "won", ...(value ? { monetaryValue: value } : {}) });
    } else {
      const j = await call("POST", "/opportunities/", { locationId: GHL_LOCATION, pipelineId: PIPELINE, pipelineStageId: STAGES.sale, contactId, name: `${c.name || "Customer"}, quote ${no}`.trim(), status: "won", monetaryValue: value || undefined, source: "Apex app quote" });
      id = j.opportunity?.id || j.id || "";
    }
    await note(contactId, `Quote ${no} went ahead${how.signedBy ? `, signed online by ${how.signedBy}` : ""}${value ? `. Total ${value.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 })} inc GST` : ""}.`);
    return id;
  } catch (e: any) { console.error("ghl quote won:", e.message); return null; }
}

/* the "on my way" text, from Apex's own GHL number */
export async function ghlText(to: { name?: string; phone?: string }, message: string) {
  if (!ghlOn()) throw new Error("GHL is not connected");
  if (!(await ghlStatus()).sms) throw new Error("Apex has no texting number in GHL yet");
  const contactId = await contactFor({ name: to.name || "Customer", phone: to.phone }, "Apex app job");
  if (!contactId) throw new Error("No phone number on this job");
  await call("POST", "/conversations/messages", { type: "SMS", contactId, message: message.slice(0, 600) });
  return true;
}
