"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  RefreshCw, Users, CalendarClock, CheckCircle2, FileText,
  Wrench, Star, Car, Building2, Home, Phone, Mail, MapPin, Clock,
  MessageSquare, ArrowDownLeft, ArrowUpRight, Bell, Target, DollarSign,
  Map as MapIcon, Wallet, HandCoins,
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

type Lead = { name: string; phone: string; email: string; type: string; suburb: string; tags: string[]; createdAt: string };
type Job = { jobId: string; status: string; description: string; address: string; date: string; contactName: string; contactPhone: string };
type Pipe = { key: string; name: string; openCount: number; openValue: number; wonValue: number; total: number; stages: { name: string; count: number; value: number }[] };
type Conv = { name: string; phone: string; channel: string; direction: string; snippet: string; unread: number; when: string };
type Sched = { start: string; end: string; client: string; address: string; status: string; staff: string; staffColor: string; lat: number; lng: number };
type MapJobT = { client: string; staff: string; staffColor: string; status: string; start: string; lat: number; lng: number; address: string };
type StaffWk = { name: string; count: number; color: string };
type Payment = { amount: number; method: string; client: string; date: string; isDeposit: boolean };
type Pay = { collectedThisWeek: number; collectedCount: number; byMethod: Record<string, number>; recent: Payment[]; awaitingTotal: number; awaitingCount: number };
type Data = {
  configured?: boolean; generatedAt?: string; weekStart?: string;
  ghl?: { totalContacts: number; customers: number | null; newLeadsThisWeek: number; openOpps: number; openValue: number; wonValue: number; pipelines: Pipe[]; recentLeads: Lead[]; reviewRequested: number | null; conversations: Conv[]; unreadCount: number };
  servicem8?: { total: number; byStatus: Record<string, number>; recentJobs: Job[]; scheduledThisWeek: number; completedThisWeek: number; quotesThisWeek: number; schedule: Sched[]; mapJobs: MapJobT[]; staffWeek: StaffWk[]; payments: Pay };
  errors?: string[];
};

const PIPE_ICON: Record<string, typeof Car> = { automotive: Car, commercial: Building2, residential: Home };
const STATUS_COLOR: Record<string, string> = { Quote: C.amber, "Work Order": C.blue, Completed: C.green, Unsuccessful: C.muted, Invoiced: C.green };
const CH_COLOR: Record<string, string> = { SMS: C.blue, Email: C.amber, Call: C.teal, "Web chat": C.purple, WhatsApp: C.green, Facebook: C.blue, Instagram: C.red, "No show": C.muted, Review: C.purple, Google: C.teal, Update: C.muted, Message: C.muted };

export default function TintGardDashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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
    { label: "New leads", value: g ? g.newLeadsThisWeek : 0, Icon: Users },
    { label: "Jobs booked in", value: m ? m.scheduledThisWeek : 0, Icon: CalendarClock },
    { label: "Jobs completed", value: m ? m.completedThisWeek : 0, Icon: CheckCircle2 },
    { label: "Quotes out", value: m ? m.quotesThisWeek : 0, Icon: FileText },
  ];
  const overall = [
    { label: "Total contacts", value: g ? String(g.totalContacts) : "—", Icon: Users },
    { label: "Past customers", value: g && g.customers != null ? String(g.customers) : "—", Icon: Star },
    { label: "Open opportunities", value: g ? String(g.openOpps) : "—", Icon: Target },
    { label: "Open pipeline value", value: g ? money(g.openValue) : "—", Icon: DollarSign },
    { label: "Won value", value: g ? money(g.wonValue) : "—", Icon: CheckCircle2 },
    { label: "ServiceM8 jobs", value: m ? String(m.total) : "—", Icon: Wrench },
    { label: "Reviews requested", value: g && g.reviewRequested != null ? String(g.reviewRequested) : "—", Icon: Star },
  ];

  const summary = g && m
    ? `This week: ${g.newLeadsThisWeek} new ${g.newLeadsThisWeek === 1 ? "lead" : "leads"}, ${m.scheduledThisWeek} ${m.scheduledThisWeek === 1 ? "job" : "jobs"} booked in, ${m.completedThisWeek} completed and ${m.quotesThisWeek} ${m.quotesThisWeek === 1 ? "quote" : "quotes"} out the door.`
    : "";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* brand stripe */}
      <div style={{ height: 4, background: C.red }} />

      {/* header — CEO Dashboard only */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.92)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 22px", display: "flex", alignItems: "center", gap: 14 }}>
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
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 22px 80px" }}>
        {loading && <div style={{ color: C.muted, padding: "40px 0" }}>Loading your live figures…</div>}
        {notConfigured && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, color: C.sub, boxShadow: shadow }}>
            The live connection is not switched on for this environment yet. Once the account tokens are in place, this fills with real data automatically.
          </div>
        )}

        {!loading && !notConfigured && data && (
          <>
            {/* THIS WEEK */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
              <SectionTitle>This week</SectionTitle>
              <span style={{ fontSize: 12.5, color: C.muted }}>{weekLabel(data.weekStart)}</span>
            </div>
            {summary && <p style={{ color: C.sub, fontSize: 15, margin: "0 0 16px", maxWidth: 760 }}>{summary}</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 30 }}>
              {week.map((k, i) => (
                <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, boxShadow: shadow, position: "relative", overflow: "hidden" }}>
                  <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: C.red }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 9, color: C.sub, fontSize: 12.5, fontWeight: 600 }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: C.redSoft, display: "grid", placeItems: "center" }}><k.Icon size={16} color={C.red} /></span>
                    {k.label}
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10, letterSpacing: "-.02em", color: C.ink }}>{k.value}</div>
                </motion.div>
              ))}
            </div>

            {/* JOB MAP */}
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

            {/* CONVERSATIONS + SCHEDULE */}
            <div className="ceo-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 16, marginBottom: 30 }}>
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
                    <Row key={i} last={i === (g!.conversations.length - 1)}>
                      <div style={{ marginTop: 2 }}>{inbound ? <ArrowDownLeft size={16} color={C.green} /> : <ArrowUpRight size={16} color={C.muted} />}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                          <span style={{ fontSize: 10.5, color: chColor, background: `${chColor}14`, border: `1px solid ${chColor}33`, borderRadius: 6, padding: "1px 7px" }}>{c.channel}</span>
                          {c.unread > 0 && <span style={{ width: 7, height: 7, borderRadius: 99, background: C.red }} />}
                          <span style={{ marginLeft: "auto", fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{ago(c.when)}</span>
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
            </div>

            {/* PAYMENTS */}
            <SectionTitle>Job payments</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, margin: "14px 0 14px" }}>
              <PayTile Icon={HandCoins} label="Collected this week" value={m ? money(m.payments.collectedThisWeek) : "—"} sub={m ? `${m.payments.collectedCount} ${m.payments.collectedCount === 1 ? "payment" : "payments"}` : ""} accent={C.green} />
              <PayTile Icon={Wallet} label="Awaiting payment" value={m ? money(m.payments.awaitingTotal) : "—"} sub={m ? `${m.payments.awaitingCount} completed ${m.payments.awaitingCount === 1 ? "job" : "jobs"}` : ""} accent={C.red} />
            </div>
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

            {/* NEEDS ATTENTION */}
            {g && g.unreadCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.redSoft, border: `1px solid ${C.red}33`, borderRadius: 14, padding: "14px 18px", marginBottom: 30, color: C.sub, fontSize: 14 }}>
                <Bell size={17} color={C.red} />
                <span><b style={{ color: C.redDark }}>{g.unreadCount} {g.unreadCount === 1 ? "conversation needs" : "conversations need"} a reply.</b> A customer has messaged and is waiting to hear back.</span>
              </div>
            )}

            {/* FULL PICTURE */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginBottom: 16 }}><SectionTitle>The full picture</SectionTitle></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))", gap: 14, marginBottom: 30 }}>
              {overall.map((k) => (
                <div key={k.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, boxShadow: shadow }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.muted, fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600 }}>
                    <k.Icon size={15} color={C.red} /> {k.label}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 7, color: C.ink }}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* PIPELINES */}
            <SectionTitle>Sales pipelines</SectionTitle>
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

            {/* JOBS BOARD */}
            <SectionTitle>ServiceM8 jobs</SectionTitle>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 30, boxShadow: shadow }}>
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

            {/* RECENT LEADS */}
            <SectionTitle>Recent leads</SectionTitle>
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

            <div style={{ height: 24 }} />
            <SectionTitle>Recent ServiceM8 jobs</SectionTitle>
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

            <div style={{ marginTop: 34, paddingTop: 18, borderTop: `1px solid ${C.border}`, fontSize: 12.5, color: C.muted, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <span>TintGard · live business dashboard</span>
              <span>Refreshes every 60 seconds</span>
            </div>
          </>
        )}
      </div>

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
function Row({ children, last, col }: { children: React.ReactNode; last?: boolean; col?: boolean }) {
  return <div style={{ display: "flex", flexDirection: col ? "column" : "row", gap: col ? 0 : 11, padding: "11px 2px", borderBottom: last ? "none" : `1px solid ${C.border}` }}>{children}</div>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div style={{ color: C.muted, fontSize: 13.5, padding: "14px 4px" }}>{children}</div>;
}
function PayTile({ Icon, label, value, sub, accent }: { Icon: typeof Car; label: string; value: string; sub?: string; accent: string }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, boxShadow: shadow, position: "relative", overflow: "hidden" }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
      <div style={{ display: "flex", alignItems: "center", gap: 9, color: C.sub, fontSize: 12.5, fontWeight: 600 }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: `${accent}18`, display: "grid", placeItems: "center" }}><Icon size={16} color={accent} /></span>{label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10, color: C.ink }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
