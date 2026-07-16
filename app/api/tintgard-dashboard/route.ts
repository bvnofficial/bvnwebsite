import { NextResponse } from "next/server";

/**
 * TintGard live CEO dashboard feed (read-only).
 *
 * Aggregates live data from GoHighLevel (pipelines, opportunities, contacts,
 * conversations/messages) and ServiceM8 (jobs, job activity, job contacts) into
 * a single, high-level summary for /clients/tintgard/dashboard. Both credentials
 * stay server-side and never reach the browser. Read calls only — nothing writes.
 *
 * Env: GHL_TINTGARD_TOKEN, SERVICEM8_API_KEY, optional GHL_TINTGARD_LOCATION.
 */

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const maxDuration = 60;

const GHL = "https://services.leadconnectorhq.com";
const GHLV = "2021-07-28";
const GHLV_CONV = "2021-04-15";
const SM8 = "https://api.servicem8.com/api_1.0";
const LOCATION_ID = process.env.GHL_TINTGARD_LOCATION || "21QeKX429DL5Q6j4yeG6";

const F_CUSTOMER_TYPE = "VQCB6DLwIirwXFM9EWN9";
const F_SUBURB = "darWwxU0RqYkhZ9TZcOl";

const PIPELINE_KEY: Record<string, string> = { automotive: "Automotive", commercial: "Commercial", residential: "Residential" };

const CHANNEL: Record<string, string> = {
  TYPE_SMS: "SMS", TYPE_EMAIL: "Email", TYPE_CALL: "Call", TYPE_PHONE: "Call",
  TYPE_WEBCHAT: "Web chat", TYPE_LIVE_CHAT: "Web chat", TYPE_GMB: "Google",
  TYPE_FACEBOOK: "Facebook", TYPE_INSTAGRAM: "Instagram", TYPE_WHATSAPP: "WhatsApp",
  TYPE_NO_SHOW: "No show", TYPE_REVIEW: "Review",
};
const isRealComms = (t: string) => /SMS|EMAIL|CALL|PHONE|CHAT|WHATSAPP|FACEBOOK|INSTAGRAM|GMB/i.test(t);
function chLabel(t: string) {
  if (CHANNEL[t]) return CHANNEL[t];
  if (/ACTIVITY/i.test(t)) return "Update";
  if (/NO_SHOW/i.test(t)) return "No show";
  return "Message";
}
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

type SearchFilter = { field: string; operator: string; value: string };
type SearchSort = { field: string; direction: string };
async function ghlSearch(token: string, filters: SearchFilter[], pageLimit = 1, sort?: SearchSort[]) {
  const res = await fetch(`${GHL}/contacts/search`, {
    method: "POST",
    headers: { ...ghlHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ locationId: LOCATION_ID, pageLimit, filters, ...(sort ? { sort } : {}) }),
  });
  if (!res.ok) return null;
  return (await res.json().catch(() => null)) as { contacts?: unknown[]; total?: number } | null;
}

function ghlHeaders(token: string, version = GHLV) {
  return { Authorization: `Bearer ${token}`, Version: version, Accept: "application/json" };
}
const sm8Headers = (key: string) => ({ "X-Api-Key": key, Accept: "application/json" });
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);

type CF = { id: string; value?: string };
function cfMap(contact: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  const arr = (contact.customFields || contact.customField || []) as CF[];
  for (const f of arr) if (f && f.id) out[f.id] = String(f.value ?? "");
  return out;
}

// Human-readable lead source from whatever attribution GHL kept on the contact.
function leadSourceOf(c: Record<string, unknown>): string {
  const attr = (c.attributionSource || {}) as Record<string, unknown>;
  const raw = String(
    c.source || attr.utmSource || attr.sessionSource || attr.referrer || attr.medium || ""
  ).trim();
  if (!raw) return "Direct / unknown";
  const s = raw.toLowerCase();
  if (/facebook|fb|instagram|ig|meta/.test(s)) return "Social";
  if (/google|gmb|organic|search/.test(s)) return "Google";
  if (/website|web ?form|form|landing|site/.test(s)) return "Website form";
  if (/call|phone/.test(s)) return "Phone call";
  if (/chat|widget/.test(s)) return "Website chat";
  if (/referr?al/.test(s)) return "Referral";
  return raw.length > 22 ? raw.slice(0, 22) : raw.charAt(0).toUpperCase() + raw.slice(1);
}

// Brisbane wall-clock date (UTC+10, no DST) as a ServiceM8 "YYYY-MM-DD HH:MM:SS" string.
function sm8DateStr(ms: number): string {
  const d = new Date(ms + 10 * 3600 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
}

// ---- week boundary in Brisbane time (UTC+10, no DST) ----
function weekBounds() {
  const b = new Date(Date.now() + 10 * 3600 * 1000); // shift so getUTC* reads Brisbane wall clock
  const sinceMon = (b.getUTCDay() + 6) % 7;
  const y = b.getUTCFullYear(), mo = b.getUTCMonth(), d = b.getUTCDate() - sinceMon;
  const monBneAsUtc = Date.UTC(y, mo, d, 0, 0, 0);
  const p = (n: number) => String(n).padStart(2, "0");
  const dt = new Date(monBneAsUtc);
  const sm8Str = `${dt.getUTCFullYear()}-${p(dt.getUTCMonth() + 1)}-${p(dt.getUTCDate())} 00:00:00`;
  return { utcMs: monBneAsUtc - 10 * 3600 * 1000, sm8Str };
}

type Payload = Record<string, unknown>;
let CACHE: { t: number; data: Payload } | null = null;
const TTL_MS = 60_000;

/**
 * Only cache a build that actually came back with data. A build where every
 * upstream call failed must never replace a good cache, or the dashboard shows
 * zeros until the next success.
 */
function looksHealthy(d: Payload): boolean {
  if (d.configured === false) return false;
  const g = (d.ghl || {}) as Record<string, unknown>;
  const m = (d.servicem8 || {}) as Record<string, unknown>;
  return Number(m.total) > 0 || Number(g.totalContacts) > 0;
}

async function build(): Promise<Payload> {
  const token = process.env.GHL_TINTGARD_TOKEN;
  const key = process.env.SERVICEM8_API_KEY;
  const errors: string[] = [];
  if (!token || !key) return { configured: false };

  const week = weekBounds();

  const ghl: Payload = {
    totalContacts: 0, customers: null as number | null, newLeadsThisWeek: 0,
    openOpps: 0, openValue: 0, wonValue: 0, oppsTotal: 0, wonOpps: 0,
    pipelines: [] as Payload[], recentLeads: [] as Payload[], reviewRequested: null as number | null,
    leadSources: [] as Payload[],
    conversations: [] as Payload[], unreadCount: 0,
    channelMix: [] as Payload[], inboundThisWeek: 0, outboundThisWeek: 0, missedCallTextbacks: null as number | null,
  };
  const servicem8: Payload = {
    total: 0, byStatus: {} as Record<string, number>, recentJobs: [] as Payload[],
    scheduledThisWeek: 0, completedThisWeek: 0, quotesThisWeek: 0, schedule: [] as Payload[],
    mapJobs: [] as Payload[], staffWeek: [] as Payload[],
    unscheduledWorkOrders: { count: 0, list: [] as Payload[] },
    agingWorkOrders: { count: 0, list: [] as Payload[] },
    completedList: [] as Payload[], quotesList: [] as Payload[],
    payments: { collectedThisWeek: 0, collectedCount: 0, byMethod: {} as Record<string, number>, recent: [] as Payload[], awaitingTotal: 0, awaitingCount: 0, awaitingList: [] as Payload[] },
  };

  // ================= GoHighLevel: pipelines + opportunities =================
  try {
    const pRes = await fetch(`${GHL}/opportunities/pipelines?locationId=${LOCATION_ID}`, { headers: ghlHeaders(token), cache: "no-store" });
    const pData = await pRes.json().catch(() => null);
    const pipelines = (pData?.pipelines || []) as { id: string; name: string; stages: { id: string; name: string }[] }[];

    for (const pipe of pipelines) {
      const keyName = Object.keys(PIPELINE_KEY).find((k) => new RegExp(PIPELINE_KEY[k], "i").test(pipe.name));
      if (!keyName) continue;
      const oRes = await fetch(`${GHL}/opportunities/search?location_id=${LOCATION_ID}&pipeline_id=${pipe.id}&limit=100`, { headers: ghlHeaders(token), cache: "no-store" });
      const oData = await oRes.json().catch(() => null);
      const opps = (oData?.opportunities || []) as Record<string, unknown>[];

      const stageAgg: Record<string, { name: string; count: number; value: number }> = {};
      for (const s of pipe.stages) stageAgg[s.id] = { name: s.name, count: 0, value: 0 };
      let openCount = 0, openValue = 0, wonValue = 0, wonCount = 0;
      for (const opp of opps) {
        const stageId = String(opp.pipelineStageId || "");
        const value = num(opp.monetaryValue);
        const status = String(opp.status || "open").toLowerCase();
        if (stageAgg[stageId]) { stageAgg[stageId].count++; stageAgg[stageId].value += value; }
        if (status === "won") { wonValue += value; wonCount++; }
        else if (status === "open") { openCount++; openValue += value; }
      }
      (ghl.openOpps as number) += openCount;
      (ghl.openValue as number) += openValue;
      (ghl.wonValue as number) += wonValue;
      (ghl.wonOpps as number) += wonCount;
      (ghl.oppsTotal as number) += opps.length;
      (ghl.pipelines as Payload[]).push({
        key: keyName, name: pipe.name, openCount, openValue, wonValue, wonCount, total: opps.length,
        stages: pipe.stages.map((s) => ({ name: stageAgg[s.id].name, count: stageAgg[s.id].count, value: stageAgg[s.id].value })),
      });
    }
  } catch (e) { errors.push("ghl pipelines: " + String(e)); }

  // ================= GoHighLevel: contact totals =================
  try {
    const cRes = await fetch(`${GHL}/contacts/?locationId=${LOCATION_ID}&limit=1`, { headers: ghlHeaders(token), cache: "no-store" });
    const cData = await cRes.json().catch(() => null);
    ghl.totalContacts = num(cData?.meta?.total);
  } catch (e) { errors.push("ghl contact total: " + String(e)); }

  // Past customers (imported ServiceM8 history is tagged customer-active).
  try {
    const r = await ghlSearch(token, [{ field: "tags", operator: "contains", value: "customer-active" }], 1);
    if (typeof r?.total === "number") ghl.customers = r.total;
  } catch { /* optional */ }

  /**
   * Genuine new leads only. The ServiceM8 history import lands ~990 contacts
   * all stamped with today's date, so they must be excluded or every imported
   * customer would be counted as a brand new lead this week.
   */
  try {
    const s = await ghlSearch(token, [{ field: "tags", operator: "not_contains", value: "servicem8-synced" }], 100, [{ field: "dateAdded", direction: "desc" }]);
    const contacts = (s?.contacts || []) as Record<string, unknown>[];
    const mapped = contacts.map((c) => {
      const cf = cfMap(c);
      return {
        name: String(c.contactName || `${c.firstName || ""} ${c.lastName || ""}`).trim() || "Unnamed lead",
        phone: String(c.phone || ""), email: String(c.email || ""),
        type: cf[F_CUSTOMER_TYPE] || "", suburb: cf[F_SUBURB] || "",
        source: leadSourceOf(c),
        tags: (c.tags || []) as string[], createdAt: String(c.dateAdded || c.dateUpdated || ""),
      };
    });
    ghl.newLeadsThisWeek = mapped.filter((l) => l.createdAt && Date.parse(l.createdAt) >= week.utcMs).length;
    ghl.recentLeads = mapped.slice(0, 12);

    // Lead source mix across the most recent genuine (non-imported) leads.
    const srcAgg: Record<string, number> = {};
    for (const l of mapped) srcAgg[l.source] = (srcAgg[l.source] || 0) + 1;
    ghl.leadSources = Object.entries(srcAgg)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  } catch (e) { errors.push("ghl leads: " + String(e)); }

  // review-requested count (best effort)
  try {
    const r = await ghlSearch(token, [{ field: "tags", operator: "contains", value: "review-requested" }], 1);
    if (typeof r?.total === "number") ghl.reviewRequested = r.total;
  } catch { /* leave null */ }

  // missed-call text-backs sent (best effort — only shows if the workflow tags them)
  try {
    const r = await ghlSearch(token, [{ field: "tags", operator: "contains", value: "missed-call" }], 1);
    if (typeof r?.total === "number" && r.total > 0) ghl.missedCallTextbacks = r.total;
  } catch { /* leave null */ }

  // ================= GoHighLevel: conversations feed =================
  try {
    const sRes = await fetch(`${GHL}/conversations/search?locationId=${LOCATION_ID}&limit=100`, { headers: ghlHeaders(token, GHLV_CONV), cache: "no-store" });
    const sData = await sRes.json().catch(() => null);
    const convs = (sData?.conversations || []) as Record<string, unknown>[];
    ghl.unreadCount = convs.reduce((a, c) => a + num(c.unreadCount), 0);

    // Channel mix + inbound/outbound split across all recent conversations.
    const REAL_CHANNELS = new Set(["SMS", "Email", "Call", "Web chat", "WhatsApp", "Facebook", "Instagram", "Google"]);
    const chAgg: Record<string, number> = {};
    let inbound = 0, outbound = 0;
    for (const c of convs) {
      const label = chLabel(String(c.lastMessageType || ""));
      if (REAL_CHANNELS.has(label)) chAgg[label] = (chAgg[label] || 0) + 1;
      const dir = String(c.lastMessageDirection || "").toLowerCase();
      const when = num(c.lastMessageDate);
      if (when >= week.utcMs) {
        if (/in/.test(dir)) inbound++;
        else if (/out/.test(dir)) outbound++;
      }
    }
    ghl.channelMix = Object.entries(chAgg).map(([channel, count]) => ({ channel, count })).sort((a, b) => b.count - a.count);
    ghl.inboundThisWeek = inbound;
    ghl.outboundThisWeek = outbound;

    const feed = await Promise.all(convs.slice(0, 12).map(async (c) => {
      let snippet = "", channel = chLabel(String(c.lastMessageType || "")), direction = "", when = num(c.lastMessageDate);
      try {
        const mRes = await fetch(`${GHL}/conversations/${c.id}/messages?limit=6`, { headers: ghlHeaders(token, GHLV_CONV), cache: "no-store" });
        const mData = await mRes.json().catch(() => null);
        const msgs = (mData?.messages?.messages || mData?.messages || []) as Record<string, unknown>[];
        const real = msgs.find((mm) => mm.body && isRealComms(String(mm.messageType || mm.type || ""))) || msgs.find((mm) => mm.body);
        if (real) {
          snippet = oneLine(String(real.body || "")).slice(0, 120);
          channel = chLabel(String(real.messageType || real.type || ""));
          direction = String(real.direction || "");
          when = Date.parse(String(real.dateAdded || "")) || when;
        }
      } catch { /* keep header-level info */ }
      return {
        name: String(c.fullName || c.contactName || "Contact"),
        phone: String(c.phone || ""), channel, direction, snippet,
        unread: num(c.unreadCount), when: when ? new Date(when).toISOString() : "",
        convId: String(c.id || ""), contactId: String(c.contactId || ""),
      };
    }));
    ghl.conversations = feed.sort((a, b) => (b.when > a.when ? 1 : -1));
  } catch (e) { errors.push("ghl conversations: " + String(e)); }

  // ================= ServiceM8: jobs, contacts, activity =================
  let jobs: Record<string, unknown>[] = [];
  const jobById: Record<string, Record<string, unknown>> = {};
  const contactByJob: Record<string, { name: string; phone: string; email: string }> = {};
  const staffById: Record<string, { name: string; color: string }> = {};
  try {
    const jRes = await fetch(`${SM8}/job.json?%24filter=${encodeURIComponent("active eq 1")}`, { headers: sm8Headers(key), cache: "no-store" });
    jobs = ((await jRes.json().catch(() => [])) as Record<string, unknown>[]) || [];
    for (const j of jobs) jobById[String(j.uuid || "")] = j;

    // Staff (names + a stable colour per person for the map + assignments).
    try {
      const sRes = await fetch(`${SM8}/staff.json`, { headers: sm8Headers(key), cache: "no-store" });
      const st = ((await sRes.json().catch(() => [])) as Record<string, unknown>[]) || [];
      const PAL = ["#E11D2A", "#2563EB", "#1F9D57", "#B7791F", "#7C3AED", "#0E8C9A", "#DB2777", "#EA580C"];
      let idx = 0;
      for (const s of st) {
        const col = String(s.color || "").trim().replace(/^#/, "");
        staffById[String(s.uuid || "")] = {
          name: `${s.first || ""} ${s.last || ""}`.trim() || "Staff",
          color: /^[0-9a-f]{6}$/i.test(col) ? `#${col}` : PAL[idx++ % PAL.length],
        };
      }
    } catch { /* staff optional */ }

    try {
      const jcRes = await fetch(`${SM8}/jobcontact.json`, { headers: sm8Headers(key), cache: "no-store" });
      const jc = ((await jcRes.json().catch(() => [])) as Record<string, unknown>[]) || [];
      for (const c of jc) {
        const jid = String(c.job_uuid || "");
        if (!jid || contactByJob[jid]) continue;
        contactByJob[jid] = { name: `${c.first || ""} ${c.last || ""}`.trim(), phone: String(c.phone || c.mobile || ""), email: String(c.email || "") };
      }
    } catch { /* names optional */ }

    const byStatus: Record<string, number> = {};
    let completedThisWeek = 0, quotesThisWeek = 0;
    const completedList: Payload[] = [], quotesList: Payload[] = [];
    for (const j of jobs) {
      const status = String(j.status || "Unknown");
      byStatus[status] = (byStatus[status] || 0) + 1;
      const edited = String(j.edit_date || "");
      if (edited >= week.sm8Str) {
        const c = contactByJob[String(j.uuid || "")] || { name: "" };
        const lite = {
          jobId: String(j.generated_job_id || String(j.uuid || "").slice(0, 8)),
          client: c.name || oneLine(String(j.job_description || "")).slice(0, 40) || "Job",
          address: oneLine(String(j.job_address || j.geo_city || "")),
          date: edited, amount: num(j.total_invoice_amount),
        };
        if (/completed/i.test(status)) { completedThisWeek++; completedList.push(lite); }
        if (/quote/i.test(status)) { quotesThisWeek++; quotesList.push(lite); }
      }
    }
    servicem8.total = jobs.length;
    servicem8.byStatus = byStatus;
    servicem8.completedThisWeek = completedThisWeek;
    servicem8.quotesThisWeek = quotesThisWeek;
    servicem8.completedList = completedList.slice(0, 60);
    servicem8.quotesList = quotesList.slice(0, 60);
    servicem8.recentJobs = jobs.slice().sort((a, b) => String(b.edit_date || b.date || "").localeCompare(String(a.edit_date || a.date || "")))
      .slice(0, 12).map((j) => {
        const c = contactByJob[String(j.uuid || "")] || { name: "", phone: "" };
        return {
          jobId: String(j.generated_job_id || String(j.uuid || "").slice(0, 8)), status: String(j.status || ""),
          description: String(j.job_description || "").replace(/\s+/g, " ").slice(0, 140),
          address: oneLine(String(j.job_address || j.geo_city || "")), date: String(j.date || j.edit_date || ""),
          contactName: c.name, contactPhone: c.phone,
        };
      });
  } catch (e) { errors.push("servicem8 jobs: " + String(e)); }

  // ServiceM8 job activity → this week's schedule
  try {
    const aRes = await fetch(`${SM8}/jobactivity.json`, { headers: sm8Headers(key), cache: "no-store" });
    const acts = ((await aRes.json().catch(() => [])) as Record<string, unknown>[]) || [];
    const scheduled = acts.filter((a) => String(a.start_date || "") >= week.sm8Str && num(a.activity_was_scheduled) === 1);
    servicem8.scheduledThisWeek = scheduled.length;

    const seen = new Set<string>();
    const staffWeek: Record<string, { count: number; color: string }> = {};
    const all = scheduled
      .sort((a, b) => String(a.start_date).localeCompare(String(b.start_date)))
      .filter((a) => { const j = String(a.job_uuid || ""); if (!j || seen.has(j)) return false; seen.add(j); return true; })
      .map((a) => {
        const j = jobById[String(a.job_uuid || "")] || {};
        const c = contactByJob[String(a.job_uuid || "")] || { name: "", phone: "" };
        const st = staffById[String(a.staff_uuid || "")] || { name: "", color: "#98A0AC" };
        if (st.name) { if (!staffWeek[st.name]) staffWeek[st.name] = { count: 0, color: st.color }; staffWeek[st.name].count++; }
        return {
          start: String(a.start_date || ""), end: String(a.end_date || ""),
          client: c.name || oneLine(String(j.job_description || "")).slice(0, 40) || "Job",
          address: oneLine(String(j.job_address || j.geo_city || "")), status: String(j.status || ""),
          staff: st.name, staffColor: st.color,
          lat: Number(j.lat) || 0, lng: Number(j.lng) || 0,
          jobId: String(j.generated_job_id || ""),
        };
      });
    servicem8.schedule = all.slice(0, 10);
    servicem8.mapJobs = all.filter((e) => e.lat && e.lng).slice(0, 50);
    servicem8.staffWeek = Object.entries(staffWeek)
      .map(([name, v]) => ({ name, count: v.count, color: v.color }))
      .sort((a, b) => b.count - a.count);

    // Work orders (accepted jobs) with nothing on the calendar from today on.
    const todayStr = sm8DateStr(Date.now()).slice(0, 10) + " 00:00:00";
    const scheduledUuids = new Set<string>();
    for (const a of acts) {
      if (num(a.activity_was_scheduled) === 1 && String(a.start_date || "") >= todayStr) {
        scheduledUuids.add(String(a.job_uuid || ""));
      }
    }
    const isWorkOrder = (j: Record<string, unknown>) => /work\s*order/i.test(String(j.status || ""));
    const jobLite = (j: Record<string, unknown>) => {
      const c = contactByJob[String(j.uuid || "")] || { name: "" };
      return {
        jobId: String(j.generated_job_id || String(j.uuid || "").slice(0, 8)),
        client: c.name || oneLine(String(j.job_description || "")).slice(0, 40) || "Job",
        address: oneLine(String(j.job_address || j.geo_city || "")),
        date: String(j.date || j.edit_date || ""),
      };
    };
    const unsched = jobs.filter((j) => isWorkOrder(j) && !scheduledUuids.has(String(j.uuid || "")));
    servicem8.unscheduledWorkOrders = {
      count: unsched.length,
      list: unsched
        .sort((a, b) => String(a.date || a.edit_date || "").localeCompare(String(b.date || b.edit_date || "")))
        .slice(0, 6).map(jobLite),
    };

    // Work orders still open 14+ days after they were created.
    const agingCut = sm8DateStr(Date.now() - 14 * 86400 * 1000);
    const aging = jobs.filter((j) => isWorkOrder(j) && String(j.date || j.edit_date || "") !== "" && String(j.date || j.edit_date || "") < agingCut);
    servicem8.agingWorkOrders = {
      count: aging.length,
      list: aging
        .sort((a, b) => String(a.date || a.edit_date || "").localeCompare(String(b.date || b.edit_date || "")))
        .slice(0, 6).map(jobLite),
    };
  } catch (e) { errors.push("servicem8 activity: " + String(e)); }

  // ================= ServiceM8: payments =================
  try {
    const pRes = await fetch(`${SM8}/jobpayment.json`, { headers: sm8Headers(key), cache: "no-store" });
    const pays = ((await pRes.json().catch(() => [])) as Record<string, unknown>[]) || [];
    const active = pays.filter((p) => String(p.active ?? "1") !== "0");

    let collectedThisWeek = 0, collectedCount = 0;
    const byMethod: Record<string, number> = {};
    for (const p of active) {
      const ts = String(p.timestamp || p.edit_date || "");
      if (ts >= week.sm8Str) {
        const amt = num(p.amount);
        collectedThisWeek += amt; collectedCount++;
        const method = String(p.method || "Other");
        byMethod[method] = (byMethod[method] || 0) + amt;
      }
    }
    const recent = active
      .slice().sort((a, b) => String(b.timestamp || b.edit_date || "").localeCompare(String(a.timestamp || a.edit_date || "")))
      .slice(0, 8)
      .map((p) => {
        const c = contactByJob[String(p.job_uuid || "")] || { name: "" };
        return { amount: num(p.amount), method: String(p.method || "Other"), client: c.name, date: String(p.timestamp || p.edit_date || ""), isDeposit: !!num(p.is_deposit) };
      });

    let awaitingTotal = 0, awaitingCount = 0;
    const awaitingList: Payload[] = [];
    for (const j of jobs) {
      const total = num(j.total_invoice_amount);
      if (total > 0 && !num(j.payment_received) && /completed/i.test(String(j.status || ""))) {
        awaitingTotal += total; awaitingCount++;
        const c = contactByJob[String(j.uuid || "")] || { name: "" };
        awaitingList.push({
          jobId: String(j.generated_job_id || String(j.uuid || "").slice(0, 8)),
          client: c.name || oneLine(String(j.job_description || "")).slice(0, 40) || "Job",
          address: oneLine(String(j.job_address || j.geo_city || "")),
          amount: total, date: String(j.edit_date || j.date || ""),
        });
      }
    }
    awaitingList.sort((a, b) => (b.amount as number) - (a.amount as number));
    servicem8.payments = { collectedThisWeek, collectedCount, byMethod, recent, awaitingTotal, awaitingCount, awaitingList: awaitingList.slice(0, 60) };
  } catch (e) { errors.push("servicem8 payments: " + String(e)); }

  return { configured: true, generatedAt: new Date().toISOString(), weekStart: new Date(week.utcMs).toISOString(), ghl, servicem8, errors };
}

export async function GET() {
  // Serve a fresh cache immediately.
  if (CACHE && Date.now() - CACHE.t < TTL_MS) {
    return NextResponse.json({ ...CACHE.data, cached: true });
  }

  // Rebuild inline. We deliberately do NOT refresh in the background: a
  // serverless instance freezes once the response is sent, which kills any
  // in-flight fetches and yields an all-errors payload.
  const data = await build();

  if (looksHealthy(data)) {
    CACHE = { t: Date.now(), data };
    return NextResponse.json(data);
  }
  // Bad build: keep the last known good data rather than showing zeros.
  if (CACHE) return NextResponse.json({ ...CACHE.data, cached: true, stale: true });
  return NextResponse.json(data);
}
