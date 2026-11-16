import { NextRequest, NextResponse } from "next/server";
import { RM_HQ_COOKIE, rmHqAuthorised } from "@/lib/rm-hq-gate";

/**
 * Revolution HQ live feed (read only).
 *
 * Pulls contacts, pipelines, opportunities, conversations (with recent
 * messages) and invoices from Revolution Materials' GoHighLevel sub-account
 * and returns them in one payload for /clients/revolution-materials/ceo.
 * The private integration token stays on the server. Nothing here writes.
 *
 * Env: GHL_RM_TOKEN, GHL_RM_LOCATION, RM_HQ_PASSWORD (gate),
 * optional GHL_RM_PIPELINE (name of the pipeline to show first).
 */

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const maxDuration = 60;

const GHL = "https://services.leadconnectorhq.com";
const V = "2021-07-28";
const V_CONV = "2021-04-15";

// eslint-disable-next-line
type J = Record<string, any>;

let CACHE: { t: number; data: J } | null = null;
const TTL_MS = 60_000;

const CHANNEL: Record<string, string> = {
  TYPE_SMS: "SMS", TYPE_EMAIL: "Email", TYPE_CALL: "Call", TYPE_PHONE: "Call",
  TYPE_WEBCHAT: "Web chat", TYPE_LIVE_CHAT: "Web chat", TYPE_GMB: "Google",
  TYPE_FACEBOOK: "Facebook", TYPE_INSTAGRAM: "Instagram", TYPE_WHATSAPP: "WhatsApp",
  TYPE_CUSTOM_EMAIL: "Email", TYPE_FORM_SUBMISSION: "Website form",
};
const realComms = (t: string) => /SMS|EMAIL|CALL|PHONE|CHAT|WHATSAPP|FACEBOOK|INSTAGRAM|GMB|FORM/i.test(t) && !/NO_SHOW|ACTIVITY/i.test(t);
const chLabel = (t: string) => CHANNEL[t] || (/NO_SHOW/i.test(t) ? "Missed call" : /ACTIVITY/i.test(t) ? "Update" : "Message");
const ms = (v: unknown) => (typeof v === "number" ? v : Date.parse(String(v || "")) || 0);
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
const clean = (s: unknown) => String(s ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

async function get(token: string, path: string, version = V): Promise<J | null> {
  const res = await fetch(GHL + path, {
    headers: { Authorization: `Bearer ${token}`, Version: version, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json().catch(() => null)) as J | null;
}

async function build(): Promise<J> {
  const token = process.env.GHL_RM_TOKEN;
  const L = process.env.GHL_RM_LOCATION;
  if (!token || !L) return { configured: false };
  const errors: string[] = [];

  // contacts (paged, up to 1,000)
  const contactsRaw: J[] = [];
  let after = "";
  for (let page = 0; page < 10; page++) {
    const d = await get(token, `/contacts/?locationId=${L}&limit=100${after}`);
    if (!d) { errors.push("contacts"); break; }
    contactsRaw.push(...(d.contacts || []));
    const m = d.meta || {};
    if (!m.startAfterId || (d.contacts || []).length < 100) break;
    after = `&startAfterId=${m.startAfterId}&startAfter=${m.startAfter}`;
  }

  const [loc, pipes, convs, invs] = await Promise.all([
    get(token, `/locations/${L}`),
    get(token, `/opportunities/pipelines?locationId=${L}`),
    get(token, `/conversations/search?locationId=${L}&limit=40`, V_CONV),
    get(token, `/invoices/?altId=${L}&altType=location&limit=100&offset=0`),
  ]);
  if (!pipes) errors.push("pipelines");
  if (!convs) errors.push("conversations");
  if (!invs) errors.push("invoices");

  // opportunities (paged, up to 500)
  const oppsRaw: J[] = [];
  for (let page = 1; page <= 5; page++) {
    const d = await get(token, `/opportunities/search?location_id=${L}&limit=100&page=${page}`);
    if (!d) { errors.push("opportunities"); break; }
    oppsRaw.push(...(d.opportunities || []));
    if ((d.opportunities || []).length < 100) break;
  }

  const pipelines = ((pipes && pipes.pipelines) || []).map((p: J) => ({
    id: p.id, name: p.name,
    stages: (p.stages || []).slice().sort((a: J, b: J) => num(a.position) - num(b.position)).map((s: J) => ({ id: s.id, name: s.name })),
  }));
  const stageName: Record<string, string> = {};
  pipelines.forEach((p: J) => p.stages.forEach((s: J) => (stageName[s.id] = s.name)));

  const contacts = contactsRaw.map((c, i) => {
    const name = clean(c.contactName || [c.firstName, c.lastName].filter(Boolean).join(" ")) || clean(c.email) || clean(c.phone) || "Unnamed contact";
    return {
      id: c.id, name, co: clean(c.companyName) || name, role: "",
      city: [c.city, c.state].filter(Boolean).join(" "), phone: clean(c.phone), email: clean(c.email),
      at: ms(c.dateAdded), src: clean(c.source), tags: c.tags || [], i,
    };
  });
  const known = new Set(contacts.map((c) => c.id));
  const extra = (id: string, name: string, co: string, phone = "", email = "") => {
    if (!id || known.has(id)) return;
    known.add(id);
    contacts.push({ id, name: name || "Unnamed contact", co: co || name || "Unnamed contact", role: "", city: "", phone, email, at: 0, src: "", tags: [], i: contacts.length });
  };

  const opps = oppsRaw.map((o) => {
    const ct = o.contact || {};
    extra(o.contactId, clean(ct.name), clean(ct.companyName), clean(ct.phone), clean(ct.email));
    const status = String(o.status || "open");
    return {
      id: o.id, c: o.contactId, title: clean(o.name) || "Untitled deal", pipelineId: o.pipelineId,
      stage: stageName[o.pipelineStageId] || "Unknown stage", status,
      src: clean(o.source) || "Not recorded", at: ms(o.createdAt), value: num(o.monetaryValue),
      changed: ms(o.lastStatusChangeAt || o.updatedAt),
    };
  });

  const convList: J[] = (convs && convs.conversations) || [];
  const withMsgs = await Promise.all(
    convList.slice(0, 25).map(async (v) => {
      const d = await get(token, `/conversations/${v.id}/messages?limit=30`, V_CONV);
      const raw: J[] = (d && d.messages && d.messages.messages) || [];
      return raw;
    })
  );
  const convos = convList.map((v, idx) => {
    extra(v.contactId, clean(v.fullName || v.contactName), clean(v.companyName), clean(v.phone), clean(v.email));
    const raw = withMsgs[idx] || [];
    const msgs = raw
      .map((m) => {
        const t = String(m.messageType || "");
        const text = clean(m.body) || clean(m.activity && m.activity.title) || (/NO_SHOW|CALL/i.test(t) ? "Missed call" : "");
        return { me: m.direction === "outbound", text: text || "(no text)", at: ms(m.dateAdded), sys: !realComms(t), ch: chLabel(t) };
      })
      .sort((a, b) => a.at - b.at);
    if (!msgs.length) {
      msgs.push({ me: false, text: clean(v.lastMessageBody) || chLabel(String(v.lastMessageType || "")), at: ms(v.lastMessageDate || v.dateUpdated), sys: !realComms(String(v.lastMessageType || "")), ch: chLabel(String(v.lastMessageType || "")) });
    }
    const lastReal = [...msgs].reverse().find((m) => !m.sys);
    return {
      id: v.id, c: v.contactId, ch: lastReal ? lastReal.ch : chLabel(String(v.lastMessageType || v.type || "")),
      unread: num(v.unreadCount) > 0, msgs,
    };
  });

  const invoices = (((invs && invs.invoices) || []) as J[])
    .filter((v) => !/void/i.test(String(v.status)))
    .map((v) => {
      const cd = v.contactDetails || {};
      extra(cd.id, clean(cd.name), clean(cd.companyName), clean(cd.phoneNo), clean(cd.email));
      const status = String(v.status || "");
      const total = num(v.total ?? v.invoiceTotal);
      return {
        no: clean(v.invoiceNumber) || String(v._id || v.id).slice(-6), id: v._id || v.id, c: cd.id,
        title: clean(v.title || v.name) || "Invoice", status,
        issued: ms(v.issueDate || v.createdAt), due: ms(v.dueDate) || ms(v.issueDate) + 30 * 86400000,
        paidAt: /^paid$/i.test(status) ? ms(v.updatedAt) || ms(v.issueDate) : null,
        draft: /draft/i.test(status), total, amountDue: num(v.amountDue),
        lines: ((v.invoiceItems || []) as J[]).map((it) => ({ d: clean(it.name) || "Item", qty: num(it.qty) || 1, p: num(it.amount) })),
      };
    });

  const l = (loc && loc.location) || {};
  return {
    configured: true,
    syncedAt: Date.now(),
    location: { id: L, name: l.name || "Revolution Materials", timezone: l.timezone || "Australia/Melbourne" },
    ghlApp: `https://app.gohighlevel.com/v2/location/${L}`,
    preferredPipeline: process.env.GHL_RM_PIPELINE || "",
    pipelines, contacts, contactsTotal: contacts.length, opps, convos, invoices, errors,
  };
}

export async function GET(req: NextRequest) {
  if (!(await rmHqAuthorised(req.cookies.get(RM_HQ_COOKIE)?.value))) {
    return NextResponse.json({ ok: false }, { status: 401, headers: { "cache-control": "no-store" } });
  }
  const fresh = req.nextUrl.searchParams.get("fresh") === "1";
  if (!fresh && CACHE && Date.now() - CACHE.t < TTL_MS) {
    return NextResponse.json(CACHE.data, { headers: { "cache-control": "no-store" } });
  }
  try {
    const data = await build();
    if (data.configured && (data.errors as string[]).length < 4) CACHE = { t: Date.now(), data };
    return NextResponse.json(data, { headers: { "cache-control": "no-store" } });
  } catch {
    if (CACHE) return NextResponse.json({ ...CACHE.data, stale: true }, { headers: { "cache-control": "no-store" } });
    return NextResponse.json({ configured: true, failed: true }, { status: 502, headers: { "cache-control": "no-store" } });
  }
}
