import { NextRequest, NextResponse } from "next/server";
import { skinluxHqReqOk } from "@/lib/skinlux-hq-gate";
import { loadSettings } from "@/lib/skinlux-settings";
import { logEvent, readEvents, storeConfigured } from "@/lib/skinlux-store";
import { loadIntake, loadStock, loadTraining, loadWaitlist } from "@/lib/skinlux-apps";

/**
 * Skinlux HQ live feed (read only).
 *
 * Reads both Skinlux GoHighLevel sub accounts (Booragoon and Leederville) and
 * returns the data already shaped the way the HQ front end (public/clients/
 * skinlux/assets/hq.js) uses it: convos, clients, leads, flows.
 * Tokens stay on the server. Nothing here writes.
 *
 * Env (Vercel, Production), one pair per clinic, either can be missing:
 *   GHL_SKINLUX_BOORAGOON_TOKEN, GHL_SKINLUX_BOORAGOON_LOCATION
 *   GHL_SKINLUX_LEEDERVILLE_TOKEN, GHL_SKINLUX_LEEDERVILLE_LOCATION
 *   SKINLUX_HQ_PASSWORD (gate), SKINLUX_HQ_SEND=1 to switch on sending from HQ.
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

const CLINICS = ["booragoon", "leederville"] as const;
type Clinic = (typeof CLINICS)[number];

// GoHighLevel message type to the HQ channel keys (see CH in hq.js)
function chKey(t: string): string {
  if (/WHATSAPP/i.test(t)) return "wa";
  if (/INSTAGRAM/i.test(t)) return "ig";
  if (/FACEBOOK/i.test(t)) return "fb";
  if (/EMAIL/i.test(t)) return "email";
  if (/WEBCHAT|LIVE_CHAT|FORM/i.test(t)) return "web";
  if (/GMB|REVIEW/i.test(t)) return "review";
  return "sms";
}
const realComms = (t: string) => /SMS|EMAIL|CHAT|WHATSAPP|FACEBOOK|INSTAGRAM|GMB|FORM/i.test(t) && !/ACTIVITY/i.test(t);
const ms = (v: unknown) => (typeof v === "number" ? v : Date.parse(String(v || "")) || 0);
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
const clean = (s: unknown) => String(s ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const INJ_TAG = /^(injectable|treated-(relaxers|fillers|biostim))$/;
const STAGE_INDEX: [RegExp, number][] = [[/lost|not coming/i, 4], [/treatment booked|booked|won/i, 3], [/consult/i, 2], [/contacted/i, 1], [/new/i, 0]];

function when(t: number): string {
  if (!t) return "";
  const d = new Date(t);
  const perth = new Date(d.getTime() + 8 * 3600_000);
  const now = new Date(Date.now() + 8 * 3600_000);
  const sameDay = perth.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
  const hh = perth.getUTCHours(), mm = perth.getUTCMinutes();
  const time = `${hh % 12 || 12}:${String(mm).padStart(2, "0")}${hh < 12 ? "am" : "pm"}`;
  if (sameDay) return time;
  const days = Math.floor((now.getTime() - perth.getTime()) / 86400_000);
  if (days < 7) return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][perth.getUTCDay()];
  return `${perth.getUTCDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][perth.getUTCMonth()]}`;
}
function age(t: number): string {
  if (!t) return "";
  const h = (Date.now() - t) / 3600_000;
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} min`;
  if (h < 24) return `${Math.round(h)} hrs`;
  const d = Math.round(h / 24);
  return d === 1 ? "1 day" : `${d} days`;
}

async function get(token: string, path: string, version = V): Promise<J | null> {
  const res = await fetch(GHL + path, {
    headers: { Authorization: `Bearer ${token}`, Version: version, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json().catch(() => null)) as J | null;
}

function keys(c: Clinic) {
  const up = c.toUpperCase();
  return { token: process.env[`GHL_SKINLUX_${up}_TOKEN`], loc: process.env[`GHL_SKINLUX_${up}_LOCATION`] };
}

async function readClinic(clinic: Clinic, token: string, L: string, errors: string[]) {
  // custom field ids to names, so we can read Last treatment, Next due date and so on
  const cf = await get(token, `/locations/${L}/customFields?model=contact`);
  const fieldName: Record<string, string> = {};
  ((cf && cf.customFields) || []).forEach((f: J) => (fieldName[f.id] = String(f.name || "")));
  const field = (c: J, name: string) => {
    const hit = (c.customFields || []).find((x: J) => fieldName[x.id] === name);
    return hit ? (Array.isArray(hit.value) ? hit.value.join(", ") : clean(hit.value)) : "";
  };

  // contacts (paged, up to 2,000)
  const contactsRaw: J[] = [];
  let after = "";
  for (let page = 0; page < 20; page++) {
    const d = await get(token, `/contacts/?locationId=${L}&limit=100${after}`);
    if (!d) { errors.push(`${clinic}: contacts`); break; }
    contactsRaw.push(...(d.contacts || []));
    const m = d.meta || {};
    if (!m.startAfterId || (d.contacts || []).length < 100) break;
    after = `&startAfterId=${m.startAfterId}&startAfter=${m.startAfter}`;
  }

  const [pipes, convs, taskRes] = await Promise.all([
    get(token, `/opportunities/pipelines?locationId=${L}`),
    get(token, `/conversations/search?locationId=${L}&limit=40&sort=desc&sortBy=last_message_date`, V_CONV),
    fetch(`${GHL}/locations/${L}/tasks/search`, { method: "POST", cache: "no-store",
      headers: { Authorization: `Bearer ${token}`, Version: V, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ completed: false, limit: 100 }) }).then((r) => (r.ok ? r.json() : null)).catch(() => null) as Promise<J | null>,
  ]);
  if (!pipes) errors.push(`${clinic}: pipelines`);
  if (!convs) errors.push(`${clinic}: conversations`);

  const oppsRaw: J[] = [];
  for (let page = 1; page <= 5; page++) {
    const d = await get(token, `/opportunities/search?location_id=${L}&limit=100&page=${page}`);
    if (!d) { errors.push(`${clinic}: opportunities`); break; }
    oppsRaw.push(...(d.opportunities || []));
    if ((d.opportunities || []).length < 100) break;
  }

  const stageName: Record<string, string> = {};
  const pipeName: Record<string, string> = {};
  ((pipes && pipes.pipelines) || []).forEach((p: J) => {
    pipeName[p.id] = String(p.name || "");
    (p.stages || []).forEach((s: J) => (stageName[s.id] = String(s.name || "")));
  });

  // GoHighLevel ships every new account with "(example)" contacts and tasks; HQ hides them
  // (also hides the "Test Bvnsystem" contact used for system tests)
  const isExample = (n: unknown) => /^\(example\)|bvnsystem/i.test(String(n || "").trim());
  const byId: Record<string, J> = {};
  const clientRows = contactsRaw.filter((c) => !isExample(c.contactName || c.firstName)).map((c) => {
    const name = clean(c.contactName || [c.firstName, c.lastName].filter(Boolean).join(" ")) || clean(c.email) || clean(c.phone) || "Unnamed";
    const tags: string[] = (c.tags || []).map((t: string) => String(t).toLowerCase());
    const lastT = field(c, "Last treatment"), lastD = field(c, "Last treatment date");
    const pkg = field(c, "Package name"), left = num(field(c, "Package sessions left"));
    const product = field(c, "Last product bought");
    const out = {
      id: c.id, name, clinic, phone: clean(c.phone), email: clean(c.email),
      since: c.dateAdded ? new Date(ms(c.dateAdded)).toLocaleDateString("en-AU", { month: "short", year: "numeric" }) : "",
      visits: tags.filter((t) => t.startsWith("treated-")).length, spend: 0, points: 0,
      last: lastT ? `${lastD ? lastD + ", " : ""}${lastT}` : "No treatment recorded yet",
      next: field(c, "Next due date") ? `Due ${field(c, "Next due date")}` : "Not booked",
      tags, forms: field(c, "Nurse cleared") ? "Cleared by a nurse" : "",
      products: product ? [product] : [],
      course: pkg ? { label: pkg, done: 0, total: left } : undefined,
      history: [] as string[],
      inj: tags.some((t) => INJ_TAG.test(t)),
      paused: tags.includes("automation-paused"),
      src: clean(c.source),
      at: ms(c.dateAdded),
    };
    byId[c.id] = out;
    return out;
  });

  // conversations, with the last 20 messages each
  const convList: J[] = ((convs && convs.conversations) || []).filter((v: J) => !isExample(v.fullName || v.contactName));
  const withMsgs = await Promise.all(
    convList.slice(0, 30).map(async (v) => {
      const d = await get(token, `/conversations/${v.id}/messages?limit=20`, V_CONV);
      return ((d && d.messages && d.messages.messages) || []) as J[];
    })
  );
  const convos = convList.map((v, idx) => {
    const ct = byId[v.contactId] || {};
    const raw = withMsgs[idx] || [];
    let lastType = String(v.lastMessageType || v.type || "");
    const msgs = raw
      .map((m) => {
        const t = String(m.messageType || "");
        const text = clean(m.body) || clean(m.activity && m.activity.title) || "";
        if (!realComms(t)) return { f: "sys", t: text || "Update", at: when(ms(m.dateAdded)), ts: ms(m.dateAdded) };
        lastType = t;
        const auto = m.direction === "outbound" && (m.source === "workflow" || m.source === "campaign" || !m.userId);
        return { f: m.direction === "outbound" ? (auto ? "bot" : "us") : "them", t: text || "(no text)", at: when(ms(m.dateAdded)), ts: ms(m.dateAdded) };
      })
      .sort((a, b) => a.ts - b.ts)
      .map(({ ts, ...m }) => (void ts, m));
    if (!msgs.length) msgs.push({ f: "them", t: clean(v.lastMessageBody) || "New conversation", at: when(ms(v.lastMessageDate)) });
    const tags: string[] = ct.tags || [];
    return {
      id: v.id, contactId: v.contactId,
      name: clean(v.fullName || v.contactName) || ct.name || clean(v.phone) || "Unknown",
      ch: chKey(lastType), ghlType: lastType, clinic,
      at: when(ms(v.lastMessageDate || v.dateUpdated)),
      unread: num(v.unreadCount) > 0,
      nurse: tags.includes("checkin-worried") || tags.includes("automation-paused"),
      paused: tags.includes("automation-paused"),
      inj: !!ct.inj,
      assigned: "",
      phone: clean(v.phone) || ct.phone || "",
      wf: tags.includes("abandoned-booking") ? "Workflow 1: abandoned booking"
        : tags.includes("checkin-worried") ? "Workflow 2: paused for a nurse"
        : tags.includes("rebook-invited") ? "Workflow 4: no rebooking"
        : tags.includes("product-reorder-due") ? "Workflow 3: restock reminder"
        : tags.includes("source-skin-check") ? "Skin Check lead" : "Conversation",
      msgs,
      draft: "",
    };
  });

  // leads: open opportunities in the Leads pipeline (or any pipeline with "lead" in its name)
  const leads = oppsRaw
    .filter((o) => /lead/i.test(pipeName[o.pipelineId] || ""))
    .map((o) => {
      const sn = stageName[o.pipelineStageId] || "";
      const s = (STAGE_INDEX.find(([re]) => re.test(sn)) || [null, 0])[1] as number;
      const ct = byId[o.contactId] || {};
      return {
        id: o.id, n: clean((o.contact && o.contact.name) || ct.name || o.name) || "Lead",
        src: clean(o.source) || ct.src || "Not recorded", i: clean(o.name) || "", c: clinic, s,
        age: age(ms(o.createdAt)), v: num(o.monetaryValue), inj: !!ct.inj,
        cv: (convos.find((x) => x.contactId === o.contactId) || {}).id,
      };
    });

  const tasks = (((taskRes && taskRes.tasks) || []) as J[]).filter((t) => !/^\(Example\)|bvnsystem/i.test(String(t.title || ""))).map((t) => {
    const c = (t.contactDetails || {}) as J;
    const due = ms(t.dueDate);
    return { id: String(t._id || t.id), title: clean(t.title), body: clean(t.body), clinic, due, dueTxt: due ? when(due) : "",
      overdue: !!due && due < Date.now(), name: clean([c.firstName, c.lastName].filter(Boolean).join(" ")), phone: clean(c.phone),
      contactId: String(t.contactId || c.id || ""), assigned: clean(t.assignedTo || "") };
  });

  return { clients: clientRows, convos, leads, tasks };
}

function flowsFrom(list: J[]): J[] {
  // Count tags once up front. A closure over `list` here was dropped by the
  // production minifier ("list is not defined"), which broke the whole feed.
  const tagCount: Record<string, number> = {};
  for (const c of list) for (const t of (c.tags as string[]) || []) tagCount[t] = (tagCount[t] || 0) + 1;
  const n = (t: string): number => tagCount[t] || 0;
  return [
    { n: "1. Abandoned booking", on: true, now: n("abandoned-booking"), a: [n("abandoned-booking") + n("abandoned-booked") + n("abandoned-lost"), "came in"], b: [n("abandoned-booked"), "booked after all"], c: [n("abandoned-lost"), "lost"], log: [] },
    { n: "2. Completed appointment", on: true, now: n("aftercare-active"), a: [n("checkin-good") + n("checkin-red") + n("checkin-worried"), "check in replies"], b: [n("review-asked"), "reviews asked"], c: [n("review-left"), "reviews left"], log: [] },
    { n: "3. Product sales", on: true, now: n("product-buyer"), a: [n("product-buyer"), "product buyers"], b: [n("product-reorder-due"), "restock reminders due"], c: [n("reorder-requested"), "set aside requests"], log: [] },
    { n: "4. No rebooking", on: true, now: n("rebook-due"), a: [n("rebook-due"), "due now"], b: [n("rebook-invited"), "invited"], c: [n("rebooked"), "rebooked"], log: [] },
    { n: "AI Skin Check follow up", on: true, now: n("source-skin-check"), a: [n("source-skin-check"), "scans"], b: [0, "booked"], c: ["", ""], log: [] },
  ];
}

// Website monitor: is skinluxfaceandbody.com.au answering? Checked with every
// HQ refresh (cached with the rest of the feed for a minute).
const SITE_URL = "https://www.skinluxfaceandbody.com.au/";
async function siteCheck(): Promise<J> {
  const t0 = Date.now();
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 5000);
  try {
    const r = await fetch(SITE_URL, { method: "GET", redirect: "follow", cache: "no-store", signal: ctl.signal });
    return { url: SITE_URL, up: r.status < 500, status: r.status, ms: Date.now() - t0, at: Date.now() };
  } catch {
    return { url: SITE_URL, up: false, status: 0, ms: Date.now() - t0, at: Date.now() };
  } finally {
    clearTimeout(timer);
  }
}

let lastSiteLog = 0;
async function appsSummary(errors: string[]): Promise<J> {
  if (!storeConfigured()) return { store: false, events: [] };
  try {
    const [events, stock, wait, intake, training] = await Promise.all([readEvents(62), loadStock(), loadWaitlist(), loadIntake(), loadTraining()]);
    return {
      store: true,
      events: events.slice(0, 4000),
      stock: stock.items.map((i) => ({ n: i.name, c: i.clinic, kind: i.kind, left: i.left, min: i.min, order: i.order })),
      waitlist: { people: wait.people.filter((p) => p.status === "waiting").map((p) => ({ c: p.clinic, t: p.treatment, n: `${p.first} ${p.last.slice(0, 1)}`.trim(), at: p.at, times: p.times })),
        slots: wait.slots.filter((s) => s.status === "open").map((s) => ({ c: s.clinic, t: s.treatment, when: s.when })),
        filled: wait.slots.filter((s) => s.status === "filled").map((s) => ({ c: s.clinic, t: s.treatment, at: s.at })) },
      intake: intake.forms.slice(0, 300).map((f) => ({ id: f.id, at: f.at, c: f.clinic, n: f.name, t: f.treatment, visit: f.visit, flags: f.flags, cleared: f.cleared, contactId: f.contactId })),
      training: { protocols: training.protocols.map((p) => ({ id: p.id, t: p.treatment, status: p.status })), reads: training.reads },
    };
  } catch {
    errors.push("apps");
    return { store: true, events: [] };
  }
}

async function build(): Promise<J> {
  const errors: string[] = [];
  const sitePromise = siteCheck();
  const parts = await Promise.all(CLINICS.map(async (c) => {
    const { token, loc } = keys(c);
    if (!token || !loc) return null;
    return readClinic(c, token, loc, errors);
  }));
  const live = parts.filter(Boolean) as { clients: J[]; convos: J[]; leads: J[]; tasks: J[] }[];
  if (!live.length) return { configured: false };

  const allClients = live.flatMap((p) => p.clients);
  const convos = live.flatMap((p) => p.convos);
  const leads = live.flatMap((p) => p.leads);
  const tasks = live.flatMap((p) => p.tasks).sort((a, b) => (a.due || 9e15) - (b.due || 9e15));
  const apps = await appsSummary(errors);
  const srcCount: Record<string, [number, number]> = {};
  leads.forEach((l) => { const k = l.src || "Other"; srcCount[k] = srcCount[k] || [0, 0]; srcCount[k][0]++; if (l.s === 3) srcCount[k][1]++; });

  return {
    configured: true,
    syncedAt: Date.now(),
    clinics: CLINICS.filter((c, i) => !!parts[i]),
    canSend: process.env.SKINLUX_HQ_SEND === "1",
    clients: allClients, convos, leads,
    sources: Object.entries(srcCount).map(([k, v]) => [k, v[0], v[1]]).sort((a, b) => (b[1] as number) - (a[1] as number)),
    flows: flowsFrom(allClients),
    site: await (async () => {
      const site = await sitePromise;
      if (Date.now() - lastSiteLog > 10 * 60_000) { lastSiteLog = Date.now(); await logEvent({ k: "site", c: "web", s: site.up ? "up" : "down", v: site.ms }); }
      return site;
    })(),
    automations: (await loadSettings()).automations,
    team: (await loadSettings()).team,
    tasks,
    ...apps,
    errors,
  };
}

export async function GET(req: NextRequest) {
  if (!(await skinluxHqReqOk(req))) {
    return NextResponse.json({ ok: false }, { status: 401, headers: { "cache-control": "no-store" } });
  }
  const fresh = req.nextUrl.searchParams.get("fresh") === "1";
  if (!fresh && CACHE && Date.now() - CACHE.t < TTL_MS) {
    return NextResponse.json(CACHE.data, { headers: { "cache-control": "no-store" } });
  }
  try {
    const data = await build();
    if (data.configured && (data.errors as string[]).length < 3) CACHE = { t: Date.now(), data };
    return NextResponse.json(data, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error("skinlux-hq feed failed:", e instanceof Error ? e.stack || e.message : e);
    if (CACHE) return NextResponse.json({ ...CACHE.data, stale: true }, { headers: { "cache-control": "no-store" } });
    return NextResponse.json({ configured: true, failed: true }, { status: 502, headers: { "cache-control": "no-store" } });
  }
}
