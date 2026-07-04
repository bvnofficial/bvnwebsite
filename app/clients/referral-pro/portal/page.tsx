"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, Users, DollarSign, BellRing, ShieldCheck,
  Download, MessageSquare, Webhook, Database, Lock, CheckCircle2, XCircle,
  Zap, ArrowRight, Building2, Phone, Sparkles, TrendingUp, LayoutDashboard,
  RefreshCw, FileText,
} from "lucide-react";

// ── Brand tokens (BVN client-proposal palette) ───────────────
const C = {
  bg: "#0A1120",
  bg2: "#0E1830",
  card: "#121E3A",
  cardHi: "#16264A",
  border: "#22324F",
  ink: "#EAF1FC",
  sub: "#9FB1D0",
  muted: "#647697",
  cyan: "#22D3EE",
  green: "#34D399",
  amber: "#FBBF24",
  coral: "#FB923C",
  purple: "#A78BFA",
  blue: "#3B82F6",
  red: "#F87171",
};

// ── Status model (the client's exact status list) ─────────────
type StatusKey =
  | "consult-scheduled" | "cancelled" | "no-show" | "second-meeting"
  | "thinking" | "hired" | "did-not-hire" | "paid-full" | "agent-paid";

type Counts = "paid" | "pending" | "pipeline" | "dead";

const STATUS: Record<StatusKey, { label: string; color: string; counts: Counts }> = {
  "consult-scheduled": { label: "Consult Scheduled by Agent", color: C.blue, counts: "pipeline" },
  "cancelled": { label: "Cancelled – Agent Follow Up", color: C.amber, counts: "dead" },
  "no-show": { label: "No Show – Agent Follow Up", color: C.amber, counts: "dead" },
  "second-meeting": { label: "Second Meeting Scheduled", color: C.cyan, counts: "pipeline" },
  "thinking": { label: "Wants to Think About It – Agent Follow Up", color: C.purple, counts: "pipeline" },
  "hired": { label: "Hired", color: C.green, counts: "pending" },
  "did-not-hire": { label: "Did Not Hire", color: C.red, counts: "dead" },
  "paid-full": { label: "Hired and Paid in Full", color: C.green, counts: "paid" },
  "agent-paid": { label: "Agent Paid", color: C.green, counts: "paid" },
};
const STATUS_ORDER = Object.keys(STATUS) as StatusKey[];

// ── Sample data ───────────────────────────────────────────────
type Agent = { id: string; name: string; firm: string; phone: string };
const AGENTS: Agent[] = [
  { id: "a1", name: "Sarah Mitchell", firm: "Mitchell Wealth Advisors", phone: "(480) 555-0142" },
  { id: "a2", name: "David Chen", firm: "Chen Financial Group", phone: "(602) 555-0199" },
  { id: "a3", name: "Maria Lopez", firm: "Lopez & Associates", phone: "(520) 555-0177" },
];

type Client = { id: string; name: string; agentId: string; status: StatusKey; fee: number; year: number };
const SEED: Client[] = [
  // Sarah
  { id: "c1", name: "Alvarez Family Trust", agentId: "a1", status: "paid-full", fee: 1500, year: 2024 },
  { id: "c2", name: "Hartwell Estate Plan", agentId: "a1", status: "agent-paid", fee: 1200, year: 2024 },
  { id: "c3", name: "Nowak Living Trust", agentId: "a1", status: "hired", fee: 1500, year: 2025 },
  { id: "c4", name: "Bell Family Trust", agentId: "a1", status: "paid-full", fee: 1800, year: 2025 },
  { id: "c5", name: "Okafor Estate Plan", agentId: "a1", status: "second-meeting", fee: 1500, year: 2026 },
  { id: "c6", name: "Delgado Trust", agentId: "a1", status: "consult-scheduled", fee: 1500, year: 2026 },
  // David
  { id: "c7", name: "Whitmore Trust", agentId: "a2", status: "paid-full", fee: 1350, year: 2024 },
  { id: "c8", name: "Ramos Estate", agentId: "a2", status: "did-not-hire", fee: 0, year: 2024 },
  { id: "c9", name: "Kensington Family Trust", agentId: "a2", status: "hired", fee: 1500, year: 2025 },
  { id: "c10", name: "Pruitt Living Trust", agentId: "a2", status: "agent-paid", fee: 1500, year: 2025 },
  { id: "c11", name: "Salazar Estate Plan", agentId: "a2", status: "thinking", fee: 1500, year: 2026 },
  { id: "c12", name: "Vance Trust", agentId: "a2", status: "cancelled", fee: 0, year: 2026 },
  // Maria
  { id: "c13", name: "Bianchi Estate", agentId: "a3", status: "paid-full", fee: 1500, year: 2024 },
  { id: "c14", name: "Coleman Trust", agentId: "a3", status: "paid-full", fee: 1500, year: 2025 },
  { id: "c15", name: "Ferraro Family Trust", agentId: "a3", status: "hired", fee: 1800, year: 2025 },
  { id: "c16", name: "Nakamura Estate", agentId: "a3", status: "no-show", fee: 0, year: 2026 },
  { id: "c17", name: "Ortega Living Trust", agentId: "a3", status: "consult-scheduled", fee: 1500, year: 2026 },
];

const YEARS = [2024, 2025, 2026];
const usd = (n: number) => "$" + n.toLocaleString("en-US");

// ── Component ──────────────────────────────────────────────────
export default function ReferralProPortal() {
  const [view, setView] = useState<"agent" | "staff">("agent");
  const [agentId, setAgentId] = useState("a1");
  const [year, setYear] = useState<number | "all">("all");
  const [clients, setClients] = useState<Client[]>(SEED);
  const [sms, setSms] = useState<{ agent: Agent; fee: number; client: string } | null>(null);

  const agent = AGENTS.find((a) => a.id === agentId)!;

  // Which rows are visible: agent view = only that agent's; staff view = everyone.
  const visible = useMemo(() => {
    let rows = view === "agent" ? clients.filter((c) => c.agentId === agentId) : clients;
    if (year !== "all") rows = rows.filter((c) => c.year === year);
    return rows;
  }, [clients, view, agentId, year]);

  // Totals for the fee dashboard (scoped to agent in agent view, all agents in staff view).
  const scoped = useMemo(
    () => (view === "agent" ? clients.filter((c) => c.agentId === agentId) : clients),
    [clients, view, agentId]
  );
  const totals = useMemo(() => {
    const inYear = (c: Client) => year === "all" || c.year === year;
    const sum = (f: (c: Client) => boolean) =>
      scoped.filter((c) => f(c)).reduce((s, c) => s + c.fee, 0);
    return {
      ytdPaid: sum((c) => inYear(c) && STATUS[c.status].counts === "paid"),
      pending: sum((c) => inYear(c) && STATUS[c.status].counts === "pending"),
      pipeline: sum((c) => inYear(c) && STATUS[c.status].counts === "pipeline"),
      lifetimePaid: sum((c) => STATUS[c.status].counts === "paid"),
    };
  }, [scoped, year]);

  function changeStatus(id: string, next: StatusKey) {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        // Fire the "client hired" SMS the moment status flips into Hired.
        if (next === "hired" && c.status !== "hired") {
          const ag = AGENTS.find((a) => a.id === c.agentId)!;
          setSms({ agent: ag, fee: c.fee, client: c.name });
        }
        return { ...c, status: next };
      })
    );
  }

  function exportCsv() {
    const rows = [
      ["Client", "Agent", "Status", "Referral Fee", "Counts As", "Year"],
      ...visible.map((c) => [
        c.name,
        AGENTS.find((a) => a.id === c.agentId)!.name,
        STATUS[c.status].label,
        String(c.fee),
        STATUS[c.status].counts,
        String(c.year),
      ]),
    ];
    const csv = rows.map((r) => r.map((f) => `"${f}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `referral-fees-${view === "agent" ? agent.name.replace(/\s+/g, "-").toLowerCase() : "all-agents"}-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}} @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.blue, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.blue, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · Referral Pro
          </div>
          <h1 style={{ fontSize: 29, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            Agent Referral Portal — a working sample
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 720, margin: 0, lineHeight: 1.65 }}>
            You asked for three things: a per agent client status tracker synced from Clio, a secure referral fee
            dashboard with year to date 1099 totals, and an automatic text the moment a client is marked Hired.
            Rather than describe how I would build them, I built a live sample of all three. It is clickable.
            Switch between the agent view and your staff view, change a client to Hired, and watch the SMS fire.
          </p>
        </div>

        {/* What you asked for → what this shows */}
        <div style={{ marginTop: 24, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
          {[
            { Icon: LayoutDashboard, t: "1 · Client status tracking", d: "The exact nine statuses from your post, pulled from Clio, view only for agents, editable for staff.", color: C.blue },
            { Icon: DollarSign, t: "2 · Referral fee dashboard", d: "Per agent fees, payment status, YTD 1099 totals, filter by year, one click CSV export.", color: C.green },
            { Icon: BellRing, t: "3 · Hired → instant SMS", d: "Clio marks Hired, a webhook fires Twilio, the agent gets the congratulations text within seconds.", color: C.coral },
          ].map((x, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, background: x.color + "18", display: "grid", placeItems: "center", marginBottom: 10 }}>
                <x.Icon size={16} style={{ color: x.color }} />
              </span>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{x.t}</div>
              <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, margin: 0 }}>{x.d}</p>
            </div>
          ))}
        </div>

        {/* ── The live portal ─────────────────────────────────── */}
        <section style={{ marginTop: 34 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, fontWeight: 800, margin: 0 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: C.blue + "1A", display: "grid", placeItems: "center" }}>
                <LayoutDashboard size={17} style={{ color: C.blue }} />
              </span>
              The portal, live
            </h2>

            {/* View toggle */}
            <div style={{ display: "flex", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 3 }}>
              {(["agent", "staff"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: view === v ? C.blue : "transparent",
                    color: view === v ? "#04102B" : C.sub, fontSize: 12.5, fontWeight: 700,
                  }}
                >
                  {v === "agent" ? <Users size={13} /> : <ShieldCheck size={13} />}
                  {v === "agent" ? "Agent view" : "Staff view"}
                </button>
              ))}
            </div>
          </div>

          {/* Context bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
            {view === "agent" ? (
              <>
                <Lock size={14} style={{ color: C.green }} />
                <span style={{ fontSize: 13, color: C.sub }}>Logged in as</span>
                <select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  style={{ background: C.bg2, color: C.ink, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 13, fontWeight: 700 }}
                >
                  {AGENTS.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} · {a.firm}</option>
                  ))}
                </select>
                <span style={{ fontSize: 12.5, color: C.muted }}>
                  This agent sees only their own referrals. Status is read only.
                </span>
              </>
            ) : (
              <>
                <ShieldCheck size={14} style={{ color: C.amber }} />
                <span style={{ fontSize: 13, color: C.ink, fontWeight: 600 }}>Staff view</span>
                <span style={{ fontSize: 12.5, color: C.muted }}>
                  Every agent, every referral. Status is editable — set a client to Hired to fire the SMS.
                </span>
              </>
            )}
          </div>

          {/* Fee dashboard cards */}
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", marginBottom: 14 }}>
            <StatCard label={`${year === "all" ? "All-year" : year} paid (1099)`} value={usd(totals.ytdPaid)} Icon={FileText} color={C.green} hint="Reportable income" />
            <StatCard label="Pending payouts" value={usd(totals.pending)} Icon={RefreshCw} color={C.amber} hint="Hired, not yet paid" />
            <StatCard label="Open pipeline" value={usd(totals.pipeline)} Icon={TrendingUp} color={C.blue} hint="In progress" />
            <StatCard label="Lifetime paid" value={usd(totals.lifetimePaid)} Icon={DollarSign} color={C.purple} hint="All years" />
          </div>

          {/* Filters + export */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase" }}>Year</span>
            {(["all", ...YEARS] as const).map((y) => (
              <button
                key={y}
                onClick={() => setYear(y as number | "all")}
                style={{
                  padding: "6px 12px", borderRadius: 9, cursor: "pointer", fontSize: 12.5, fontWeight: year === y ? 700 : 400,
                  border: `1px solid ${year === y ? C.blue + "99" : C.border}`,
                  background: year === y ? C.blue + "1E" : C.card,
                  color: year === y ? C.blue : C.sub,
                }}
              >
                {y === "all" ? "All years" : y}
              </button>
            ))}
            <button
              onClick={exportCsv}
              style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 9, cursor: "pointer", fontSize: 12.5, fontWeight: 700, border: `1px solid ${C.green}55`, background: C.green + "16", color: C.green }}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>

          {/* Client table */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            {/* head */}
            <div style={{ display: "grid", gridTemplateColumns: view === "staff" ? "1.4fr 1fr 1.6fr .8fr .8fr" : "1.6fr 1.8fr .9fr .8fr", gap: 10, padding: "11px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 800, letterSpacing: .6, textTransform: "uppercase", color: C.muted }}>
              <span>Client</span>
              {view === "staff" && <span>Agent</span>}
              <span>Status {view === "staff" ? "(editable)" : ""}</span>
              <span style={{ textAlign: "right" }}>Fee</span>
              <span style={{ textAlign: "right" }}>Payout</span>
            </div>
            {visible.length === 0 && (
              <div style={{ padding: "22px 16px", fontSize: 13, color: C.muted, textAlign: "center" }}>No referrals for this filter.</div>
            )}
            {visible.map((c, i) => {
              const meta = STATUS[c.status];
              const ag = AGENTS.find((a) => a.id === c.agentId)!;
              return (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: view === "staff" ? "1.4fr 1fr 1.6fr .8fr .8fr" : "1.6fr 1.8fr .9fr .8fr", gap: 10, alignItems: "center", padding: "12px 16px", borderBottom: i < visible.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{c.name}<span style={{ display: "block", fontSize: 11, color: C.muted, fontWeight: 400 }}>{c.year}</span></span>
                  {view === "staff" && <span style={{ fontSize: 12.5, color: C.sub }}>{ag.name}</span>}
                  {view === "staff" ? (
                    <select
                      value={c.status}
                      onChange={(e) => changeStatus(c.id, e.target.value as StatusKey)}
                      style={{ background: C.bg2, color: meta.color, border: `1px solid ${meta.color}44`, borderRadius: 8, padding: "6px 8px", fontSize: 12, fontWeight: 700, maxWidth: "100%" }}
                    >
                      {STATUS_ORDER.map((s) => (
                        <option key={s} value={s} style={{ color: C.ink }}>{STATUS[s].label}</option>
                      ))}
                    </select>
                  ) : (
                    <span style={{ justifySelf: "start", fontSize: 12, fontWeight: 700, color: meta.color, background: meta.color + "16", border: `1px solid ${meta.color}3A`, borderRadius: 8, padding: "4px 10px" }}>
                      {meta.label}
                    </span>
                  )}
                  <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: c.fee ? C.ink : C.muted }}>{c.fee ? usd(c.fee) : "—"}</span>
                  <span style={{ textAlign: "right" }}>
                    <PayBadge counts={meta.counts} />
                  </span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 10, lineHeight: 1.6 }}>
            Sample data, fully interactive in your browser. In the real build these rows are WordPress custom post
            types, the status column reads from Clio, and every agent is walled off to their own records by role.
          </p>
        </section>

        {/* ── Hired → SMS automation ──────────────────────────── */}
        <Section title="What happens the moment a client is marked Hired" Icon={BellRing} accent={C.coral}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 18, lineHeight: 1.6 }}>
            In staff view above, set any client to <strong style={{ color: C.green }}>Hired</strong> and the text below
            fires. In production the trigger is Clio itself: when your team moves a matter to Hired, Clio sends a
            webhook, WordPress verifies it, and Twilio sends the agent their congratulations text, with email as the
            fallback if the SMS ever fails.
          </p>
          <div style={{ display: "flex", alignItems: "stretch", gap: 10, flexWrap: "wrap" }}>
            {[
              { Icon: Database, t: "Clio", d: "Matter marked Hired", color: C.blue },
              { Icon: Webhook, t: "Webhook", d: "Clio → WordPress, verified", color: C.purple },
              { Icon: Zap, t: "WordPress", d: "Looks up the referring agent", color: C.cyan },
              { Icon: MessageSquare, t: "Twilio", d: "SMS to the agent (email backup)", color: C.coral },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 190px" }}>
                <div style={{ flex: 1, background: C.card, border: `1px solid ${s.color}44`, borderRadius: 12, padding: "12px 14px" }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: s.color + "1E", display: "grid", placeItems: "center", marginBottom: 8 }}>
                    <s.Icon size={15} style={{ color: s.color }} />
                  </span>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{s.t}</div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 2, lineHeight: 1.45 }}>{s.d}</div>
                </div>
                {i < arr.length - 1 && <ArrowRight size={16} style={{ color: C.muted, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
          <button
            onClick={() => setSms({ agent: AGENTS[0], fee: 1500, client: "Nowak Living Trust" })}
            style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700, border: `1px solid ${C.coral}66`, background: C.coral + "18", color: C.coral }}
          >
            <BellRing size={15} /> Preview the text an agent receives
          </button>
        </Section>

        {/* ── Clio sync approach ──────────────────────────────── */}
        <Section title="On syncing status from Clio (your open question)" Icon={RefreshCw} accent={C.blue}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 14, lineHeight: 1.65 }}>
            You asked whether the status dropdown can pull from Clio so nobody double enters data. Short answer, yes,
            and here is exactly how, plus the honest fallback if a field you need is not exposed.
          </p>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <div style={{ background: C.card, border: `1px solid ${C.green}44`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                <CheckCircle2 size={15} style={{ color: C.green }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Preferred: Clio is the source of truth</span>
              </div>
              <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, margin: 0 }}>
                Clio Grow pipeline stage or a custom matter field maps to these nine statuses. Clio webhooks push
                every change to WordPress in real time, and a scheduled sync reconciles anything missed. Your team
                works in Clio, the portal simply reflects it. Zero duplicate entry.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                <ShieldCheck size={15} style={{ color: C.amber }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.amber }}>Fallback: staff-only internal update</span>
              </div>
              <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, margin: 0 }}>
                If a status you need does not live in Clio in a usable field, staff set it once in WordPress (the
                staff view above), agents stay view only, and we still auto derive everything we can from Clio so the
                manual surface stays tiny.
              </p>
            </div>
          </div>
        </Section>

        {/* ── How it is built ─────────────────────────────────── */}
        <Section title="How it is built, in plain terms" Icon={Building2} accent={C.purple}>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { Icon: Database, t: "Custom post types", d: "Agents, Referred Clients, and Fee records as first class WordPress data, not shoehorned into posts or pages." },
              { Icon: Lock, t: "Secure role-based access", d: "An Agent role that can only ever query its own records, a Staff role that can edit, enforced server side so nobody can URL-hack into another agent's data." },
              { Icon: LayoutDashboard, t: "Dashboard UI", d: "A clean logged-in dashboard like the one above, filterable by year, CSV export built in for 1099 season." },
              { Icon: Webhook, t: "Clio + Twilio integrations", d: "Clio webhooks in, Twilio SMS out, over custom middleware or Zapier where it makes sense, whichever is more reliable and cheaper to run for your volume." },
            ].map((x, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: C.purple + "1A", display: "grid", placeItems: "center" }}>
                  <x.Icon size={15} style={{ color: C.purple }} />
                </span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{x.t}</div>
                  <p style={{ fontSize: 13, color: C.sub, margin: "3px 0 0", lineHeight: 1.55 }}>{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 44, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>WordPress · CRM Integration · Automation · BVN</div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="mailto:bvn@bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Mail size={14} /> bvn@bvnofficial.com
            </a>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Megaphone size={14} /> bvnofficial.com
            </Link>
          </div>
        </div>
      </div>

      {/* ── SMS simulation ──────────────────────────────────── */}
      <AnimatePresence>
        {sms && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSms(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(4,10,26,0.72)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 14 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 360, background: C.card, border: `1px solid ${C.coral}55`, borderRadius: 20, overflow: "hidden" }}
            >
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: C.coral + "1E", display: "grid", placeItems: "center" }}>
                  <MessageSquare size={16} style={{ color: C.coral }} />
                </span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C.coral, letterSpacing: .5, textTransform: "uppercase" }}>Twilio SMS sent</div>
                  <div style={{ fontSize: 12, color: C.muted }}>to {sms.agent.name} · {sms.agent.phone}</div>
                </div>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ background: C.coral + "1A", border: `1px solid ${C.coral}44`, borderRadius: 16, borderBottomLeftRadius: 4, padding: "12px 15px", fontSize: 14, lineHeight: 1.55, color: C.ink }}>
                  🎉 Congratulations! Your client <strong>{sms.client}</strong> has hired the law firm. Your referral fee of {usd(sms.fee)} is on the way.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12, fontSize: 12, color: C.muted }}>
                  <Phone size={12} /> Delivered in seconds. Email backup sends automatically if SMS fails.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 8, fontSize: 12, color: C.green }}>
                  <Sparkles size={12} /> Triggered by Clio → webhook → WordPress → Twilio.
                </div>
              </div>
              <button
                onClick={() => setSms(null)}
                style={{ width: "100%", padding: "12px", background: C.bg2, border: "none", borderTop: `1px solid ${C.border}`, color: C.sub, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ── Small pieces ─────────────────────────────────────────────
function StatCard({ label, value, Icon, color, hint }: { label: string; value: string; Icon: typeof DollarSign; color: string; hint: string }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px 15px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <Icon size={14} style={{ color }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .4, textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 5 }}>{hint}</div>
    </div>
  );
}

function PayBadge({ counts }: { counts: Counts }) {
  const map: Record<Counts, { label: string; color: string; Icon: typeof CheckCircle2 }> = {
    paid: { label: "Paid", color: C.green, Icon: CheckCircle2 },
    pending: { label: "Pending", color: C.amber, Icon: RefreshCw },
    pipeline: { label: "Open", color: C.blue, Icon: TrendingUp },
    dead: { label: "—", color: C.muted, Icon: XCircle },
  };
  const m = map[counts];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: m.color }}>
      <m.Icon size={12} /> {m.label}
    </span>
  );
}

function Section({ title, Icon, accent, children }: { title: string; Icon: typeof Building2; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, fontWeight: 800, margin: "0 0 14px" }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: accent + "1A", display: "grid", placeItems: "center" }}>
          <Icon size={17} style={{ color: accent }} />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
