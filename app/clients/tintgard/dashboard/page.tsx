"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  RefreshCw, Users, CalendarClock, CheckCircle2, FileText,
  Wrench, Star, Car, Building2, Home, Phone, Mail, MapPin, Clock,
  MessageSquare, ArrowDownLeft, ArrowUpRight, Bell, Target, DollarSign,
  Map as MapIcon, Wallet, HandCoins, LayoutDashboard, Megaphone, Radio,
  CalendarX2, AlarmClock, TrendingUp, Inbox, Send,
  Lock, ShieldCheck, X, CornerUpLeft, ChevronRight,
} from "lucide-react";

const JobMap = dynamic(() => import("./JobMap"), { ssr: false, loading: () => <div style={{ height: 340, borderRadius: 12, background: "#EAECEF" }} /> });

// TintGard brand: red on white with light gray. Their own product, not BVN's.
const C = {
  bg: "#F6F7F9", surface: "#FFFFFF", soft: "#F1F3F5", softer: "#FAFBFC",
  border: "#E6E8EC", borderStrong: "#DADDE3",
  ink: "#191B1F", sub: "#5B6270", muted: "#98A0AC",
  red: "#E11D2A", redDark: "#B3121D", redSoft: "#FDEBED",
  green: "#1F9D57", amber: "#B7791F", blue: "#2563EB", purple: "#7C3AED", teal: "#0E8C9A",
};
const shadow = "0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)";

const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
const money = (n: number) => aud.format(n || 0);

function ago(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function whenSchedule(str: string) {
  const m = str.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!m) return str;
  const [, Y, Mo, D, H, Mi] = m;
  const d = new Date(Date.UTC(+Y, +Mo - 1, +D, +H, +Mi));
  let hh = +H; const ap = hh >= 12 ? "PM" : "AM"; hh = hh % 12 || 12;
  return `${WD[d.getUTCDay()]} ${+D} ${MON[+Mo - 1]} · ${hh}:${Mi} ${ap}`;
}
function weekLabel(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `Week of ${WD[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;
}

type Lead = { name: string; phone: string; email: string; type: string; suburb: string; source?: string; tags: string[]; createdAt: string };
type Job = { jobId: string; status: string; description: string; address: string; date: string; contactName: string; contactPhone: string };
type Pipe = { key: string; name: string; openCount: number; openValue: number; wonValue: number; wonCount?: number; total: number; stages: { name: string; count: number; value: number }[] };
type Conv = { name: string; phone: string; channel: string; direction: string; snippet: string; unread: number; when: string; convId: string; contactId: string };
type ThreadMsg = { id: string; direction: string; channel: string; body: string; when: string };
type Sched = { start: string; end: string; client: string; address: string; status: string; staff: string; staffColor: string; lat: number; lng: number };
type MapJobT = { client: string; staff: string; staffColor: string; status: string; start: string; lat: number; lng: number; address: string };
type StaffWk = { name: string; count: number; color: string };
type Payment = { amount: number; method: string; client: string; date: string; isDeposit: boolean };
type JobDetail = { jobId: string; client: string; address: string; date: string; amount: number };
type Pay = { collectedThisWeek: number; collectedCount: number; byMethod: Record<string, number>; recent: Payment[]; awaitingTotal: number; awaitingCount: number; awaitingList: JobDetail[] };
type LeadSrc = { source: string; count: number };
type ChanMix = { channel: string; count: number };
type WOLite = { jobId: string; client: string; address: string; date: string };
type WOGroup = { count: number; list: WOLite[] };
type Data = {
  configured?: boolean; generatedAt?: string; weekStart?: string;
  ghl?: {
    totalContacts: number; customers: number | null; newLeadsThisWeek: number;
    openOpps: number; openValue: number; wonValue: number; oppsTotal: number; wonOpps: number;
    pipelines: Pipe[]; recentLeads: Lead[]; reviewRequested: number | null; leadSources: LeadSrc[];
    conversations: Conv[]; unreadCount: number;
    channelMix: ChanMix[]; inboundThisWeek: number; outboundThisWeek: number; missedCallTextbacks: number | null;
  };
  servicem8?: {
    total: number; byStatus: Record<string, number>; recentJobs: Job[];
    scheduledThisWeek: number; completedThisWeek: number; quotesThisWeek: number; schedule: Sched[];
    mapJobs: MapJobT[]; staffWeek: StaffWk[]; unscheduledWorkOrders: WOGroup; agingWorkOrders: WOGroup;
    completedList: JobDetail[]; quotesList: JobDetail[]; payments: Pay;
  };
  errors?: string[];
};

const PIPE_ICON: Record<string, typeof Car> = { automotive: Car, commercial: Building2, residential: Home };
const STATUS_COLOR: Record<string, string> = { Quote: C.amber, "Work Order": C.blue, Completed: C.green, Unsuccessful: C.muted, Invoiced: C.green };
const CH_COLOR: Record<string, string> = { SMS: C.blue, Email: C.amber, Call: C.teal, "Web chat": C.purple, WhatsApp: C.green, Facebook: C.blue, Instagram: C.red, "No show": C.muted, Review: C.purple, Google: C.teal, Update: C.muted, Message: C.muted };

type TabKey = "overview" | "operations" | "marketing" | "messaging";
const TABS: { key: TabKey; label: string; Icon: typeof Car }[] = [
  { key: "overview", label: "Overview", Icon: LayoutDashboard },
  { key: "operations", label: "Operations", Icon: Wrench },
  { key: "marketing", label: "Marketing", Icon: Megaphone },
  { key: "messaging", label: "Messaging", Icon: Radio },
];

export default function TintGardDashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<TabKey>("overview");

  // Reply gate: a shared password unlocks replying only. Stored as a header
  // token (not a cookie) so it survives inside the WordPress iframe embed.
  const [dashPw, setDashPw] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [activeConv, setActiveConv] = useState<Conv | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const authed = !!dashPw;

  useEffect(() => { try { const s = localStorage.getItem("tg_dash_pw"); if (s) setDashPw(s); } catch { /* ignore */ } }, []);

  const unlock = useCallback(async () => {
    const pw = pwInput.trim();
    if (!pw || authBusy) return;
    setAuthBusy(true); setAuthErr("");
    try {
      const res = await fetch("/api/tintgard-dashboard/auth", { method: "POST", headers: { Authorization: `Bearer ${pw}` } });
      if (res.ok) { setDashPw(pw); try { localStorage.setItem("tg_dash_pw", pw); } catch { /* ignore */ } setPwInput(""); }
      else setAuthErr(res.status === 503 ? "Replying is not switched on for this site yet." : "That password did not work.");
    } catch { setAuthErr("Could not reach the server."); }
    finally { setAuthBusy(false); }
  }, [pwInput, authBusy]);

  const lock = useCallback(() => { setDashPw(""); setActiveConv(null); try { localStorage.removeItem("tg_dash_pw"); } catch { /* ignore */ } }, []);

  const load = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/tintgard-dashboard", { cache: "no-store" });
      setData((await res.json()) as Data);
      setErr(null);
    } catch { setErr("Reconnecting"); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); const id = setInterval(load, 60_000); return () => clearInterval(id); }, [load]);

  const g = data?.ghl;
  const m = data?.servicem8;
  const notConfigured = data && data.configured === false;

  const week = [
    { k: "leads", label: "New leads", value: g ? g.newLeadsThisWeek : 0, Icon: Users },
    { k: "booked", label: "Jobs booked in", value: m ? m.scheduledThisWeek : 0, Icon: CalendarClock },
    { k: "completed", label: "Jobs completed", value: m ? m.completedThisWeek : 0, Icon: CheckCircle2 },
    { k: "quotes", label: "Quotes out", value: m ? m.quotesThisWeek : 0, Icon: FileText },
  ];
  const overall = [
    { k: "contacts", label: "Total contacts", value: g ? String(g.totalContacts) : "—", Icon: Users },
    { k: "customers", label: "Past customers", value: g && g.customers != null ? String(g.customers) : "—", Icon: Star },
    { k: "openOpps", label: "Open opportunities", value: g ? String(g.openOpps) : "—", Icon: Target },
    { k: "openValue", label: "Open pipeline value", value: g ? money(g.openValue) : "—", Icon: DollarSign },
    { k: "won", label: "Won value", value: g ? money(g.wonValue) : "—", Icon: CheckCircle2 },
    { k: "sm8jobs", label: "ServiceM8 jobs", value: m ? String(m.total) : "—", Icon: Wrench },
    { k: "reviews", label: "Reviews requested", value: g && g.reviewRequested != null ? String(g.reviewRequested) : "—", Icon: Star },
  ];

  const summary = g && m
    ? `This week: ${g.newLeadsThisWeek} new ${g.newLeadsThisWeek === 1 ? "lead" : "leads"}, ${m.scheduledThisWeek} ${m.scheduledThisWeek === 1 ? "job" : "jobs"} booked in, ${m.completedThisWeek} completed and ${m.quotesThisWeek} ${m.quotesThisWeek === 1 ? "quote" : "quotes"} out the door.`
    : "";

  const winRate = g && g.oppsTotal > 0 ? Math.round((g.wonOpps / g.oppsTotal) * 100) : null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* brand stripe */}
      <div style={{ height: 4, background: C.red }} />

      {/* header + tab bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.92)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 22px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: C.red }} />
              <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-.02em", color: C.ink }}>CEO Dashboard</span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, color: C.muted, marginLeft: "auto" }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: err ? C.amber : C.green }} />
              {err ? "Reconnecting" : "Live"}{data?.generatedAt ? ` · ${ago(data.generatedAt)}` : ""}
            </span>
            <button onClick={load} disabled={refreshing} aria-label="Refresh"
              style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, color: C.sub, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", cursor: "pointer", boxShadow: shadow }}>
              <RefreshCw size={13} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} /> Refresh
            </button>
          </div>
          <div className="ceo-tabs" style={{ display: "flex", gap: 4, marginTop: 12, overflowX: "auto" }}>
            {TABS.map((t) => {
              const on = tab === t.key;
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap",
                    fontSize: 13.5, fontWeight: on ? 700 : 600, cursor: "pointer",
                    color: on ? C.red : C.sub, background: "transparent", border: "none",
                    padding: "10px 14px", borderBottom: `2px solid ${on ? C.red : "transparent"}`,
                  }}>
                  <t.Icon size={15} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 22px 80px" }}>
        {loading && <div style={{ color: C.muted, padding: "40px 0" }}>Loading your live figures…</div>}
        {notConfigured && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, color: C.sub, boxShadow: shadow }}>
            The live connection is not switched on for this environment yet. Once the account tokens are in place, this fills with real data automatically.
          </div>
        )}

        {!loading && !notConfigured && data && (
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

            {/* ============================ OVERVIEW ============================ */}
            {tab === "overview" && (
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
                  <SectionTitle>This week</SectionTitle>
                  <span style={{ fontSize: 12.5, color: C.muted }}>{weekLabel(data.weekStart)}</span>
                </div>
                {summary && <p style={{ color: C.sub, fontSize: 15, margin: "0 0 16px", maxWidth: 760 }}>{summary}</p>}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 30 }}>
                  {week.map((k, i) => (
                    <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => setDetail(k.k)}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.red)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
                      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, boxShadow: shadow, position: "relative", overflow: "hidden", cursor: "pointer", transition: "border-color .12s" }}>
                      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: C.red }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 9, color: C.sub, fontSize: 12.5, fontWeight: 600 }}>
                        <span style={{ width: 30, height: 30, borderRadius: 8, background: C.redSoft, display: "grid", placeItems: "center" }}><k.Icon size={16} color={C.red} /></span>
                        {k.label}
                      </div>
                      <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10, letterSpacing: "-.02em", color: C.ink }}>{k.value}</div>
                      <span style={{ position: "absolute", right: 12, bottom: 11, fontSize: 11, color: C.muted, display: "inline-flex", alignItems: "center", gap: 2 }}>Details <ChevronRight size={12} /></span>
                    </motion.div>
                  ))}
                </div>

                {g && g.unreadCount > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.redSoft, border: `1px solid ${C.red}33`, borderRadius: 14, padding: "14px 18px", marginBottom: 30, color: C.sub, fontSize: 14 }}>
                    <Bell size={17} color={C.red} />
                    <span><b style={{ color: C.redDark }}>{g.unreadCount} {g.unreadCount === 1 ? "conversation needs" : "conversations need"} a reply.</b> A customer has messaged and is waiting to hear back.</span>
                  </div>
                )}

                <SectionTitle>Money this week</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, margin: "14px 0 30px" }}>
                  <PayTile Icon={HandCoins} label="Collected this week" value={m ? money(m.payments.collectedThisWeek) : "—"} sub={m ? `${m.payments.collectedCount} ${m.payments.collectedCount === 1 ? "payment" : "payments"}` : ""} accent={C.green} onClick={() => setDetail("collected")} />
                  <PayTile Icon={Wallet} label="Awaiting payment" value={m ? money(m.payments.awaitingTotal) : "—"} sub={m ? `${m.payments.awaitingCount} completed ${m.payments.awaitingCount === 1 ? "job" : "jobs"}` : ""} accent={C.red} onClick={() => setDetail("awaiting")} />
                </div>

                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginBottom: 16 }}><SectionTitle>The full picture</SectionTitle></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))", gap: 14 }}>
                  {overall.map((k) => (
                    <div key={k.label} onClick={() => setDetail(k.k)}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.red)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
                      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, boxShadow: shadow, cursor: "pointer", transition: "border-color .12s", position: "relative" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.muted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600 }}>
                        <k.Icon size={15} color={C.red} /> {k.label}
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 7, color: C.ink }}>{k.value}</div>
                      <ChevronRight size={13} color={C.muted} style={{ position: "absolute", right: 11, top: 14 }} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ============================ OPERATIONS ============================ */}
            {tab === "operations" && (
              <>
                <Card>
                  <CardHead Icon={MapIcon} title="Where your jobs are this week">
                    <span style={{ marginLeft: "auto", fontSize: 12, color: C.muted }}>{(m?.mapJobs || []).length} on the map</span>
                  </CardHead>
                  {(m?.mapJobs || []).length === 0 ? (
                    <Empty>No located jobs booked in this week yet.</Empty>
                  ) : (
                    <>
                      <JobMap jobs={m!.mapJobs} />
                      {(m?.staffWeek || []).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 12 }}>
                          {m!.staffWeek.map((s) => (
                            <span key={s.name} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.sub }}>
                              <span style={{ width: 11, height: 11, borderRadius: 99, background: s.color, boxShadow: `0 0 0 1px ${C.border}` }} />
                              {s.name} <span style={{ color: C.muted }}>· {s.count} {s.count === 1 ? "job" : "jobs"}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </Card>
                <div style={{ height: 30 }} />

                <div className="ceo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 30 }}>
                  <Card>
                    <CardHead Icon={CalendarClock} title="This week's schedule" />
                    {(m?.schedule || []).length === 0 && <Empty>Nothing booked in this week yet.</Empty>}
                    {(m?.schedule || []).map((s, i) => {
                      const color = STATUS_COLOR[s.status] || C.muted;
                      return (
                        <Row key={i} last={i === (m!.schedule.length - 1)} col>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                            <span style={{ width: 8, height: 8, borderRadius: 99, background: color }} />
                            <span style={{ fontWeight: 600, fontSize: 13.5 }}>{s.client}</span>
                            <span style={{ marginLeft: "auto", fontSize: 11.5, color: C.red, fontWeight: 600, whiteSpace: "nowrap" }}>{whenSchedule(s.start)}</span>
                          </div>
                          {s.address && <div style={{ color: C.muted, fontSize: 12, marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}><MapPin size={11} />{s.address}</div>}
                          {s.staff && <div style={{ color: C.sub, fontSize: 12, marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: s.staffColor }} />{s.staff}</div>}
                        </Row>
                      );
                    })}
                  </Card>

                  <Card>
                    <CardHead Icon={Users} title="Team workload this week" />
                    {(m?.staffWeek || []).length === 0 ? <Empty>No jobs assigned this week yet.</Empty> : (
                      <Bars items={(m?.staffWeek || []).map((s) => ({ label: s.name, count: s.count, color: s.color }))} />
                    )}
                  </Card>
                </div>

                <div className="ceo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 30 }}>
                  <WorkOrders Icon={CalendarX2} title="Accepted, not yet booked" accent={C.amber}
                    group={m?.unscheduledWorkOrders} empty="Every accepted job is on the calendar. Nice." />
                  <WorkOrders Icon={AlarmClock} title="Open 14+ days" accent={C.red}
                    group={m?.agingWorkOrders} empty="No work orders are running long." aged />
                </div>

                <SectionTitle>ServiceM8 jobs</SectionTitle>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, margin: "14px 0 30px", boxShadow: shadow }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {m && Object.keys(m.byStatus).length > 0 ? Object.entries(m.byStatus).map(([status, count]) => {
                      const color = STATUS_COLOR[status] || C.muted;
                      return (
                        <div key={status} style={{ flex: "1 1 150px", background: C.softer, border: `1px solid ${C.border}`, borderRadius: 11, padding: 14 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.sub }}><span style={{ width: 9, height: 9, borderRadius: 99, background: color }} /> {status}</div>
                          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6, color: C.ink }}>{count}</div>
                        </div>
                      );
                    }) : <Empty>No jobs in ServiceM8 yet.</Empty>}
                  </div>
                </div>

                <SectionTitle>Job payments</SectionTitle>
                <div style={{ height: 14 }} />
                <Card>
                  <div style={{ fontSize: 11.5, color: C.muted, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600, marginBottom: 10 }}>Collected this week by method</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 22, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                    {m && Object.keys(m.payments.byMethod).length > 0 ? Object.entries(m.payments.byMethod).map(([method, amt]) => (
                      <div key={method}><div style={{ fontSize: 12.5, color: C.sub }}>{method}</div><div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>{money(amt)}</div></div>
                    )) : <span style={{ color: C.muted, fontSize: 13 }}>No payments yet this week.</span>}
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    {(m?.payments.recent || []).length === 0 && <Empty>No payments recorded yet.</Empty>}
                    {(m?.payments.recent || []).map((p, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1.4fr 1fr auto", gap: 12, alignItems: "center", padding: "11px 2px", borderBottom: i < (m!.payments.recent.length - 1) ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontWeight: 700, color: C.green }}>{money(p.amount)}</span>
                        <span style={{ fontSize: 13 }}>{p.client || "—"}{p.isDeposit && <span style={{ marginLeft: 8, fontSize: 10.5, color: C.amber, background: `${C.amber}14`, border: `1px solid ${C.amber}33`, borderRadius: 6, padding: "1px 7px" }}>deposit</span>}</span>
                        <span style={{ fontSize: 12.5, color: C.sub }}>{p.method}</span>
                        <span style={{ fontSize: 12, color: C.muted, textAlign: "right", whiteSpace: "nowrap" }}>{whenSchedule(p.date)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <div style={{ height: 30 }} />

                <SectionTitle>Recent ServiceM8 jobs</SectionTitle>
                <div style={{ height: 14 }} />
                <Card pad>
                  {(m?.recentJobs || []).length === 0 && <Empty>No jobs synced yet.</Empty>}
                  {(m?.recentJobs || []).map((j, i) => {
                    const color = STATUS_COLOR[j.status] || C.muted;
                    return (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1.2fr 2fr 1fr auto", gap: 12, alignItems: "center", padding: "12px 4px", borderBottom: i < m!.recentJobs.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontFamily: "monospace", fontSize: 12, color: C.muted }}>#{j.jobId}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5 }}><span style={{ width: 9, height: 9, borderRadius: 99, background: color }} />{j.status}</span>
                        <span style={{ color: C.sub, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j.description || "—"}</span>
                        <span style={{ fontSize: 12.5 }}>{j.contactName || "—"}{j.contactPhone ? <span style={{ color: C.muted }}> · {j.contactPhone}</span> : null}</span>
                        <span style={{ color: C.muted, fontSize: 12, whiteSpace: "nowrap", textAlign: "right" }}>{ago(j.date)}</span>
                      </div>
                    );
                  })}
                </Card>
              </>
            )}

            {/* ============================ MARKETING ============================ */}
            {tab === "marketing" && (
              <>
                <div className="ceo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 30 }}>
                  <Card>
                    <CardHead Icon={TrendingUp} title="Lead to job conversion" />
                    {g ? (
                      <>
                        <Funnel stages={[
                          { label: "Opportunities created", value: g.oppsTotal, color: C.blue },
                          { label: "Still open", value: g.openOpps, color: C.amber },
                          { label: "Won", value: g.wonOpps, color: C.green },
                        ]} />
                        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "baseline", gap: 8 }}>
                          <span style={{ fontSize: 26, fontWeight: 800, color: C.green }}>{winRate != null ? `${winRate}%` : "—"}</span>
                          <span style={{ fontSize: 13, color: C.sub }}>win rate · {g ? money(g.wonValue) : "—"} won</span>
                        </div>
                      </>
                    ) : <Empty>No opportunity data yet.</Empty>}
                  </Card>

                  <Card>
                    <CardHead Icon={Target} title="Where your leads come from" />
                    {(g?.leadSources || []).length === 0 ? <Empty>No lead source data captured yet.</Empty> : (
                      <Bars items={(g?.leadSources || []).map((s) => ({ label: s.source, count: s.count }))} accent={C.purple} />
                    )}
                    <div style={{ marginTop: 12, fontSize: 11.5, color: C.muted }}>Based on your most recent leads.</div>
                  </Card>
                </div>

                <SectionTitle>Sales pipelines</SectionTitle>
                <div style={{ height: 14 }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14, marginBottom: 30 }}>
                  {(g?.pipelines || []).length === 0 && <Empty>No pipeline data yet.</Empty>}
                  {(g?.pipelines || []).map((p) => {
                    const Icon = PIPE_ICON[p.key] || Target;
                    const maxCount = Math.max(1, ...p.stages.map((s) => s.count));
                    return (
                      <div key={p.key} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, boxShadow: shadow }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ width: 34, height: 34, borderRadius: 9, background: C.redSoft, display: "grid", placeItems: "center" }}><Icon size={18} color={C.red} /></span>
                          <div><div style={{ fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: 12, color: C.muted }}>{p.openCount} open · {money(p.openValue)}</div></div>
                        </div>
                        <div style={{ marginTop: 12, display: "grid", gap: 7 }}>
                          {p.stages.map((s) => (
                            <div key={s.name}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.sub, marginBottom: 3 }}>
                                <span>{s.name}</span><span style={{ color: C.ink, fontWeight: 700 }}>{s.count}</span>
                              </div>
                              <div style={{ height: 6, borderRadius: 99, background: C.soft, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${(s.count / maxCount) * 100}%`, background: C.red, borderRadius: 99 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <SectionTitle>Recent leads</SectionTitle>
                <div style={{ height: 14 }} />
                <Card pad>
                  {(g?.recentLeads || []).length === 0 && <Empty>No leads captured yet.</Empty>}
                  {(g?.recentLeads || []).map((l, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1.4fr 1fr auto", gap: 12, alignItems: "center", padding: "12px 4px", borderBottom: i < g!.recentLeads.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <div style={{ fontWeight: 600 }}>{l.name}</div>
                      <div style={{ color: C.sub, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Phone size={13} color={C.muted} />{l.phone || "—"}</div>
                      <div style={{ color: C.sub, fontSize: 13, display: "flex", alignItems: "center", gap: 6, overflow: "hidden", textOverflow: "ellipsis" }}><Mail size={13} color={C.muted} />{l.email || "—"}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.sub }}>
                        {l.type ? <span style={{ padding: "3px 9px", borderRadius: 99, background: C.redSoft, color: C.redDark, border: `1px solid ${C.red}22` }}>{l.type}</span> : null}
                        {l.suburb ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: C.muted }}><MapPin size={12} />{l.suburb}</span> : null}
                      </div>
                      <div style={{ color: C.muted, fontSize: 12, whiteSpace: "nowrap", textAlign: "right" }}><Clock size={11} style={{ verticalAlign: "-1px" }} /> {ago(l.createdAt)}</div>
                    </div>
                  ))}
                </Card>
              </>
            )}

            {/* ============================ MESSAGING ============================ */}
            {tab === "messaging" && (
              <>
                <SectionTitle>Conversation activity</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14, margin: "14px 0 30px" }}>
                  <PayTile Icon={Inbox} label="Inbound this week" value={g ? String(g.inboundThisWeek) : "—"} sub="messages from customers" accent={C.green} />
                  <PayTile Icon={Send} label="Sent this week" value={g ? String(g.outboundThisWeek) : "—"} sub="messages out to customers" accent={C.blue} />
                  {g && g.missedCallTextbacks != null && (
                    <PayTile Icon={Phone} label="Missed-call text-backs" value={String(g.missedCallTextbacks)} sub="auto-texts after a missed call" accent={C.amber} />
                  )}
                </div>

                {g && g.unreadCount > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.redSoft, border: `1px solid ${C.red}33`, borderRadius: 14, padding: "14px 18px", marginBottom: 30, color: C.sub, fontSize: 14 }}>
                    <Bell size={17} color={C.red} />
                    <span><b style={{ color: C.redDark }}>{g.unreadCount} {g.unreadCount === 1 ? "conversation is" : "conversations are"} waiting on a reply.</b></span>
                  </div>
                )}

                {!authed ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 18px", marginBottom: 16, boxShadow: shadow }}>
                    <span style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 9, background: C.redSoft }}><Lock size={16} color={C.red} /></span>
                    <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Reply to customers</div>
                      <div style={{ fontSize: 12.5, color: C.muted }}>Enter your dashboard password to open a conversation and send a reply.</div>
                    </div>
                    <input type="password" value={pwInput} onChange={(e) => setPwInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") unlock(); }} placeholder="Password"
                      style={{ padding: "9px 12px", border: `1px solid ${C.borderStrong}`, borderRadius: 9, fontSize: 14, outline: "none", minWidth: 150 }} />
                    <button onClick={unlock} disabled={authBusy}
                      style={{ background: C.red, color: "#fff", border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", opacity: authBusy ? 0.6 : 1 }}>
                      {authBusy ? "Checking…" : "Unlock"}
                    </button>
                    {authErr && <span style={{ fontSize: 12.5, color: C.red, flexBasis: "100%" }}>{authErr}</span>}
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: `${C.green}0d`, border: `1px solid ${C.green}33`, borderRadius: 14, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: C.sub }}>
                    <ShieldCheck size={16} color={C.green} />
                    <span><b style={{ color: C.ink }}>Replying unlocked.</b> Click any conversation to open it and reply.</span>
                    <button onClick={lock} style={{ marginLeft: "auto", fontSize: 12, color: C.sub, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>Lock</button>
                  </div>
                )}

                <div className="ceo-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr .7fr", gap: 16 }}>
                  <Card>
                    <CardHead Icon={MessageSquare} title="Client conversations">
                      {g && g.unreadCount > 0 && (
                        <span style={{ marginLeft: "auto", fontSize: 11.5, color: C.red, background: C.redSoft, border: `1px solid ${C.red}33`, borderRadius: 99, padding: "2px 9px", fontWeight: 700 }}>{g.unreadCount} unread</span>
                      )}
                    </CardHead>
                    {(g?.conversations || []).length === 0 && <Empty>No client messages yet.</Empty>}
                    {(g?.conversations || []).map((c, i) => {
                      const inbound = /in/i.test(c.direction);
                      const chColor = CH_COLOR[c.channel] || C.muted;
                      return (
                        <Row key={i} last={i === (g!.conversations.length - 1)}
                          clickable={authed && !!c.convId}
                          onClick={authed && c.convId ? () => setActiveConv(c) : undefined}>
                          <div style={{ marginTop: 2 }}>{inbound ? <ArrowDownLeft size={16} color={C.green} /> : <ArrowUpRight size={16} color={C.muted} />}</div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                              <span style={{ fontSize: 10.5, color: chColor, background: `${chColor}14`, border: `1px solid ${chColor}33`, borderRadius: 6, padding: "1px 7px" }}>{c.channel}</span>
                              {c.unread > 0 && <span style={{ width: 7, height: 7, borderRadius: 99, background: C.red }} />}
                              <span style={{ marginLeft: "auto", fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{ago(c.when)}</span>
                              {authed && c.convId && <CornerUpLeft size={13} color={C.red} />}
                            </div>
                            <div style={{ color: C.sub, fontSize: 13, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {c.snippet || (inbound ? "Inbound message" : "Message sent")}
                            </div>
                          </div>
                        </Row>
                      );
                    })}
                  </Card>

                  <Card>
                    <CardHead Icon={Radio} title="Channel mix" />
                    {(g?.channelMix || []).length === 0 ? <Empty>No conversations to break down yet.</Empty> : (
                      <Bars items={(g?.channelMix || []).map((c) => ({ label: c.channel, count: c.count, color: CH_COLOR[c.channel] || C.muted }))} />
                    )}
                    <div style={{ marginTop: 12, fontSize: 11.5, color: C.muted }}>Recent conversations grouped by how the customer reached you.</div>
                  </Card>
                </div>
              </>
            )}

          </motion.div>
        )}

        {!loading && !notConfigured && data && (
          <div style={{ marginTop: 34, paddingTop: 18, borderTop: `1px solid ${C.border}`, fontSize: 12.5, color: C.muted, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span>TintGard · live business dashboard</span>
            <span>Refreshes every 60 seconds</span>
          </div>
        )}
      </div>

      {activeConv && authed && (
        <ConversationThread conv={activeConv} token={dashPw} onClose={() => setActiveConv(null)} />
      )}

      {detail && data && (
        <DetailModal dkey={detail} data={data} onClose={() => setDetail(null)} />
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @media(max-width:820px){.ceo-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 15, fontWeight: 800, color: C.ink, margin: 0, letterSpacing: "-.01em" }}>{children}</h2>;
}
function Card({ children, pad }: { children: React.ReactNode; pad?: boolean }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: pad ? "6px 16px" : "16px 18px", boxShadow: shadow }}>{children}</div>;
}
function CardHead({ Icon, title, children }: { Icon: typeof Car; title: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <Icon size={16} color={C.red} /><span style={{ fontWeight: 700 }}>{title}</span>{children}
    </div>
  );
}
function Row({ children, last, col, onClick, clickable }: { children: React.ReactNode; last?: boolean; col?: boolean; onClick?: () => void; clickable?: boolean }) {
  return <div onClick={onClick} style={{ display: "flex", flexDirection: col ? "column" : "row", gap: col ? 0 : 11, padding: "11px 2px", borderBottom: last ? "none" : `1px solid ${C.border}`, cursor: clickable ? "pointer" : "default", borderRadius: clickable ? 8 : 0, transition: "background .12s" }}
    onMouseEnter={clickable ? (e) => (e.currentTarget.style.background = C.softer) : undefined}
    onMouseLeave={clickable ? (e) => (e.currentTarget.style.background = "transparent") : undefined}>{children}</div>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div style={{ color: C.muted, fontSize: 13.5, padding: "14px 4px" }}>{children}</div>;
}
function PayTile({ Icon, label, value, sub, accent, onClick }: { Icon: typeof Car; label: string; value: string; sub?: string; accent: string; onClick?: () => void }) {
  return (
    <div onClick={onClick}
      onMouseEnter={onClick ? (e) => (e.currentTarget.style.borderColor = accent) : undefined}
      onMouseLeave={onClick ? (e) => (e.currentTarget.style.borderColor = C.border) : undefined}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, boxShadow: shadow, position: "relative", overflow: "hidden", cursor: onClick ? "pointer" : "default", transition: "border-color .12s" }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
      <div style={{ display: "flex", alignItems: "center", gap: 9, color: C.sub, fontSize: 12.5, fontWeight: 600 }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: `${accent}18`, display: "grid", placeItems: "center" }}><Icon size={16} color={accent} /></span>{label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: C.ink }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>}
      {onClick && <span style={{ position: "absolute", right: 12, bottom: 11, fontSize: 11, color: C.muted, display: "inline-flex", alignItems: "center", gap: 2 }}>Details <ChevronRight size={12} /></span>}
    </div>
  );
}
function Bars({ items, accent = C.red }: { items: { label: string; count: number; color?: string }[]; accent?: string }) {
  if (items.length === 0) return <Empty>Nothing to show yet.</Empty>;
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div style={{ display: "grid", gap: 11 }}>
      {items.map((it) => (
        <div key={it.label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.sub, marginBottom: 4 }}>
            <span>{it.label}</span><span style={{ color: C.ink, fontWeight: 700 }}>{it.count}</span>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: C.soft, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(it.count / max) * 100}%`, background: it.color || accent, borderRadius: 99 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
function Funnel({ stages }: { stages: { label: string; value: number; color: string }[] }) {
  const max = Math.max(1, ...stages.map((s) => s.value));
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {stages.map((s) => (
        <div key={s.label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.sub, marginBottom: 5 }}>
            <span>{s.label}</span><span style={{ color: C.ink, fontWeight: 800 }}>{s.value}</span>
          </div>
          <div style={{ height: 14, borderRadius: 8, background: C.soft, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(s.value / max) * 100}%`, background: s.color, borderRadius: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
function ConversationThread({ conv, token, onClose }: { conv: Conv; token: string; onClose: () => void }) {
  const [msgs, setMsgs] = useState<ThreadMsg[] | null>(null);
  const [loadErr, setLoadErr] = useState("");
  const [text, setText] = useState("");
  const [type, setType] = useState<"SMS" | "Email">(/email/i.test(conv.channel) ? "Email" : "SMS");
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState("");
  const canSend = !!conv.contactId;

  const loadThread = useCallback(async () => {
    if (!conv.convId) { setMsgs([]); setLoadErr("This conversation can't be opened."); return; }
    setLoadErr("");
    try {
      const res = await fetch(`/api/tintgard-dashboard/thread?conversationId=${encodeURIComponent(conv.convId)}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const d = await res.json().catch(() => null);
      if (d?.ok) setMsgs(d.messages as ThreadMsg[]);
      else { setMsgs([]); setLoadErr("Could not load this conversation."); }
    } catch { setMsgs([]); setLoadErr("Could not load this conversation."); }
  }, [conv.convId, token]);
  useEffect(() => { loadThread(); }, [loadThread]);

  const send = useCallback(async () => {
    const message = text.trim();
    if (!message || sending || !canSend) return;
    setSending(true); setSendErr("");
    try {
      const res = await fetch("/api/tintgard-dashboard/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: conv.contactId, conversationId: conv.convId, message, type }),
      });
      const d = await res.json().catch(() => null);
      if (d?.ok) {
        setText("");
        setMsgs((m) => [...(m || []), { id: d.messageId || String(Date.now()), direction: "outbound", channel: type, body: message, when: new Date().toISOString() }]);
      } else setSendErr(d?.reason ? `Not sent — ${d.reason}` : "The message was not sent.");
    } catch { setSendErr("The message was not sent."); }
    finally { setSending(false); }
  }, [text, sending, canSend, token, conv.contactId, conv.convId, type]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(16,20,26,.5)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface, width: "100%", maxWidth: 560, maxHeight: "88vh", borderRadius: "16px 16px 0 0", display: "flex", flexDirection: "column", boxShadow: "0 -8px 40px rgba(16,24,40,.25)" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 18px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15.5 }}>{conv.name}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{conv.phone || conv.channel}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: C.soft, border: "none", borderRadius: 8, width: 32, height: 32, display: "grid", placeItems: "center", cursor: "pointer" }}><X size={16} color={C.sub} /></button>
        </div>

        {/* messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, background: C.bg }}>
          {msgs === null && <div style={{ color: C.muted, fontSize: 13.5, textAlign: "center", padding: "20px 0" }}>Loading conversation…</div>}
          {msgs !== null && msgs.length === 0 && !loadErr && <div style={{ color: C.muted, fontSize: 13.5, textAlign: "center", padding: "20px 0" }}>No messages in this conversation yet.</div>}
          {loadErr && <div style={{ color: C.red, fontSize: 13, textAlign: "center", padding: "12px 0" }}>{loadErr}</div>}
          {(msgs || []).map((m) => {
            const out = /out/i.test(m.direction);
            return (
              <div key={m.id} style={{ alignSelf: out ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                <div style={{ background: out ? C.red : C.surface, color: out ? "#fff" : C.ink, border: out ? "none" : `1px solid ${C.border}`, borderRadius: 12, padding: "9px 12px", fontSize: 13.5, lineHeight: 1.45, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.body}</div>
                <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3, textAlign: out ? "right" : "left" }}>{m.channel} · {ago(m.when)}</div>
              </div>
            );
          })}
        </div>

        {/* reply box */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 14px", background: C.surface }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11.5, color: C.muted }}>Send as</span>
            {(["SMS", "Email"] as const).map((t) => (
              <button key={t} onClick={() => setType(t)}
                style={{ fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "4px 10px", borderRadius: 7, border: `1px solid ${type === t ? C.red : C.border}`, background: type === t ? C.redSoft : "transparent", color: type === t ? C.redDark : C.sub }}>{t}</button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 11, color: C.muted }}>{text.length} chars</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder={canSend ? "Write a reply…" : "This contact has no ID — reply in GoHighLevel."} disabled={!canSend}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}
              style={{ flex: 1, resize: "none", padding: "10px 12px", border: `1px solid ${C.borderStrong}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", outline: "none", lineHeight: 1.4 }} />
            <button onClick={send} disabled={sending || !text.trim() || !canSend} aria-label="Send"
              style={{ background: C.red, color: "#fff", border: "none", borderRadius: 10, width: 44, height: 44, display: "grid", placeItems: "center", cursor: "pointer", opacity: (sending || !text.trim() || !canSend) ? 0.5 : 1 }}>
              <Send size={17} />
            </button>
          </div>
          {sendErr && <div style={{ fontSize: 12, color: C.red, marginTop: 7 }}>{sendErr}</div>}
          <div style={{ fontSize: 10.5, color: C.muted, marginTop: 7 }}>This sends a real {type} to the customer. Ctrl/Cmd + Enter to send.</div>
        </div>
      </div>
    </div>
  );
}
function WorkOrders({ Icon, title, accent, group, empty, aged }: { Icon: typeof Car; title: string; accent: string; group?: WOGroup; empty: string; aged?: boolean }) {
  const list = group?.list || [];
  const count = group?.count || 0;
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Icon size={16} color={accent} /><span style={{ fontWeight: 700 }}>{title}</span>
        <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 800, color: count > 0 ? accent : C.muted }}>{count}</span>
      </div>
      {list.length === 0 ? <Empty>{empty}</Empty> : list.map((w, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 2px", borderBottom: i < list.length - 1 ? `1px solid ${C.border}` : "none" }}>
          <span style={{ fontFamily: "monospace", fontSize: 11.5, color: C.muted }}>#{w.jobId}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.client}</div>
            {w.address && <div style={{ fontSize: 11.5, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10} />{w.address}</div>}
          </div>
          {aged && <span style={{ fontSize: 11.5, color: accent, fontWeight: 600, whiteSpace: "nowrap" }}>{ago(w.date)}</span>}
        </div>
      ))}
    </Card>
  );
}

function NoteBlock({ lines }: { lines: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {lines.map((l, i) => (
        <p key={i} style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: i === 0 ? C.ink : C.sub, fontWeight: i === 0 ? 600 : 400 }}>{l}</p>
      ))}
    </div>
  );
}

function PipelineDetail({ pipelines, mode }: { pipelines: Pipe[]; mode: "open" | "won" }) {
  if (pipelines.length === 0) return <div style={{ color: C.muted, fontSize: 13.5, padding: "18px 2px" }}>No pipeline data yet.</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {pipelines.map((p) => {
        const maxCount = Math.max(1, ...p.stages.map((s) => s.count));
        return (
          <div key={p.key}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span>
              <span style={{ marginLeft: "auto", fontSize: 12.5, color: C.sub }}>
                {mode === "won" ? `${p.wonCount ?? 0} won · ${money(p.wonValue)}` : `${p.openCount} open · ${money(p.openValue)}`}
              </span>
            </div>
            {mode === "open" && (
              <div style={{ display: "grid", gap: 6 }}>
                {p.stages.map((s) => (
                  <div key={s.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.sub, marginBottom: 3 }}>
                      <span>{s.name}</span><span style={{ color: C.ink, fontWeight: 700 }}>{s.count}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: C.soft, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(s.count / maxCount) * 100}%`, background: C.red, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Drill-down behind every Overview tile: click a number, see what makes it up. */
function DetailModal({ dkey, data, onClose }: { dkey: string; data: Data; onClose: () => void }) {
  const g = data.ghl; const m = data.servicem8;
  const empty = (msg: string) => <div style={{ color: C.muted, fontSize: 13.5, padding: "18px 2px" }}>{msg}</div>;

  const jobRows = (list: JobDetail[], showAmount: boolean, emptyMsg: string) =>
    list.length === 0 ? empty(emptyMsg) : (
      <div>
        {list.map((j, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center", padding: "11px 2px", borderBottom: i < list.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11.5, color: C.muted }}>#{j.jobId}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j.client}</div>
              {j.address && <div style={{ fontSize: 11.5, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10} />{j.address}</div>}
            </div>
            <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
              {showAmount && j.amount > 0 && <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{money(j.amount)}</div>}
              <div style={{ fontSize: 11, color: C.muted }}>{ago(j.date)}</div>
            </div>
          </div>
        ))}
      </div>
    );

  let title = "Details";
  let node: React.ReactNode = empty("Nothing to show.");

  if (dkey === "leads") {
    title = "New leads this week";
    const start = data.weekStart ? Date.parse(data.weekStart) : 0;
    const list = (g?.recentLeads || []).filter((l) => l.createdAt && Date.parse(l.createdAt) >= start);
    node = list.length === 0 ? empty("No new leads captured this week.") : (
      <div>
        {list.map((l, i) => (
          <div key={i} style={{ padding: "11px 2px", borderBottom: i < list.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{l.name}</span>
              {l.type && <span style={{ fontSize: 10.5, color: C.redDark, background: C.redSoft, border: `1px solid ${C.red}22`, borderRadius: 6, padding: "1px 7px" }}>{l.type}</span>}
              <span style={{ marginLeft: "auto", fontSize: 11, color: C.muted }}>{ago(l.createdAt)}</span>
            </div>
            <div style={{ fontSize: 12.5, color: C.sub, marginTop: 3 }}>{[l.phone, l.email, l.suburb].filter(Boolean).join(" · ") || "No contact details captured"}</div>
          </div>
        ))}
      </div>
    );
  } else if (dkey === "booked") {
    title = "Jobs booked in this week";
    const list = m?.schedule || [];
    node = list.length === 0 ? empty("Nothing booked in this week yet.") : (
      <div>
        {list.map((s, i) => (
          <div key={i} style={{ padding: "11px 2px", borderBottom: i < list.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>{s.client}</span>
              <span style={{ marginLeft: "auto", fontSize: 11.5, color: C.red, fontWeight: 600 }}>{whenSchedule(s.start)}</span>
            </div>
            {s.address && <div style={{ fontSize: 12, color: C.muted, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} />{s.address}</div>}
            {s.staff && <div style={{ fontSize: 12, color: C.sub, marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: s.staffColor }} />{s.staff}</div>}
          </div>
        ))}
      </div>
    );
  } else if (dkey === "completed") {
    title = "Jobs completed this week";
    node = jobRows(m?.completedList || [], true, "No jobs completed this week yet.");
  } else if (dkey === "quotes") {
    title = "Quotes sent this week";
    node = jobRows(m?.quotesList || [], false, "No quotes went out this week yet.");
  } else if (dkey === "collected") {
    title = "Collected this week";
    const recent = m?.payments.recent || [];
    node = (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, paddingBottom: 12, marginBottom: 6, borderBottom: `1px solid ${C.border}` }}>
          {m && Object.keys(m.payments.byMethod).length > 0
            ? Object.entries(m.payments.byMethod).map(([mt, amt]) => (
              <div key={mt}><div style={{ fontSize: 12, color: C.sub }}>{mt}</div><div style={{ fontSize: 17, fontWeight: 700 }}>{money(amt)}</div></div>
            ))
            : <span style={{ color: C.muted, fontSize: 13 }}>No payments yet this week.</span>}
        </div>
        {recent.map((p, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "center", padding: "10px 2px", borderBottom: i < recent.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontWeight: 700, color: C.green }}>{money(p.amount)}</span>
            <span style={{ fontSize: 13 }}>{p.client || "—"}{p.isDeposit && <span style={{ marginLeft: 6, fontSize: 10, color: C.amber }}>deposit</span>}</span>
            <span style={{ fontSize: 11.5, color: C.muted, textAlign: "right" }}>{p.method} · {ago(p.date)}</span>
          </div>
        ))}
      </div>
    );
  } else if (dkey === "awaiting") {
    title = "Awaiting payment";
    node = jobRows(m?.payments.awaitingList || [], true, "Nothing is awaiting payment. All clear.");
  } else if (dkey === "contacts") {
    title = "Total contacts";
    node = <NoteBlock lines={[
      `${g ? g.totalContacts : "—"} contacts are in the CRM in total.`,
      `${g && g.customers != null ? g.customers : "—"} of them are past customers brought across from ServiceM8, with their jobs, suburbs and lifetime value.`,
      `${g ? g.newLeadsThisWeek : 0} new ${(g?.newLeadsThisWeek ?? 0) === 1 ? "lead" : "leads"} came in this week.`,
      "The full contact list lives in GoHighLevel, where you can search and edit any record.",
    ]} />;
  } else if (dkey === "customers") {
    title = "Past customers";
    node = <NoteBlock lines={[
      `${g && g.customers != null ? g.customers : "—"} contacts are tagged as customers.`,
      "These came across from your ServiceM8 history when the system was set up, and new customers are added automatically as jobs complete.",
    ]} />;
  } else if (dkey === "openOpps" || dkey === "openValue") {
    title = dkey === "openValue" ? "Open pipeline value" : "Open opportunities";
    node = <PipelineDetail pipelines={g?.pipelines || []} mode="open" />;
  } else if (dkey === "won") {
    title = "Won value";
    node = <PipelineDetail pipelines={g?.pipelines || []} mode="won" />;
  } else if (dkey === "sm8jobs") {
    title = "ServiceM8 jobs";
    const recent = (m?.recentJobs || []).slice(0, 10);
    node = (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          {m && Object.entries(m.byStatus).map(([st, ct]) => (
            <div key={st} style={{ background: C.softer, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", minWidth: 108 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.sub }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: STATUS_COLOR[st] || C.muted }} />{st}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{ct}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: C.muted, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600, marginBottom: 4 }}>Most recent</div>
        {recent.map((j, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 10, alignItems: "center", padding: "9px 2px", borderBottom: i < recent.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: C.muted }}>#{j.jobId}</span>
            <span style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j.contactName || j.description || "—"}</span>
            <span style={{ fontSize: 11.5, color: C.muted, whiteSpace: "nowrap" }}>{j.status} · {ago(j.date)}</span>
          </div>
        ))}
      </div>
    );
  } else if (dkey === "reviews") {
    title = "Reviews requested";
    const n = g?.reviewRequested ?? 0;
    node = <NoteBlock lines={[
      `${n} review ${n === 1 ? "request has" : "requests have"} been sent to customers.`,
      "Once your Google Business Profile is connected, the reviews actually received and your star rating can show here too.",
    ]} />;
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(16,20,26,.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface, width: "100%", maxWidth: 620, maxHeight: "82vh", borderRadius: 16, display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(16,24,40,.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>{title}</span>
          <button onClick={onClose} aria-label="Close" style={{ marginLeft: "auto", background: C.soft, border: "none", borderRadius: 8, width: 32, height: 32, display: "grid", placeItems: "center", cursor: "pointer" }}><X size={16} color={C.sub} /></button>
        </div>
        <div style={{ overflowY: "auto", padding: "14px 20px 20px" }}>{node}</div>
      </div>
    </div>
  );
}
