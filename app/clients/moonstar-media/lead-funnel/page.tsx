"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Facebook, Zap, GitBranch, CalendarCheck, Repeat, Trophy,
  MessageSquare, Mail, Phone, ArrowRight, RotateCcw,
  Users, PhoneCall, UserCheck, Percent, TrendingUp, MapPin, Building2,
  CheckCircle2, Sparkles, Clock, BarChart3, Send,
} from "lucide-react";

// Brand tokens (BVN client-proposal palette)
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
  rose: "#FB7185",
  red: "#F87171",
};

// ─────────────────────────────────────────────────────────────
// Section wrapper
function Section({
  eyebrow, title, sub, children,
}: {
  eyebrow: string; title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: 64 }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.coral }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 640, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. The funnel flow
const FLOW = [
  { Icon: Facebook, label: "Meta Lead Form", desc: "Prospect submits on a Meta lead ad or landing page", color: C.blue },
  { Icon: Zap, label: "Instant Auto-reply", desc: "SMS + email fire in seconds with the booking link", color: C.amber },
  { Icon: GitBranch, label: "GHL Pipeline", desc: "Contact created, tagged by source, dropped into New Enquiry", color: C.cyan },
  { Icon: CalendarCheck, label: "Booked Call", desc: "Calendar sync, reminders, and a no-show safety net", color: C.green },
  { Icon: Repeat, label: "Follow-up", desc: "3 to 5 step nurture until they book or opt out", color: C.purple },
  { Icon: Trophy, label: "Won", desc: "Monthly content package closed, revenue logged", color: C.coral },
];

function FlowRail() {
  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
      {FLOW.map((s, i) => (
        <div key={s.label} style={{ display: "flex", alignItems: "stretch", flexShrink: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            style={{
              width: 176, background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 14, padding: "16px 14px",
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center",
              background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}`, marginBottom: 10,
            }}>
              <s.Icon size={18} color={s.color} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{s.label}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.45 }}>{s.desc}</div>
          </motion.div>
          {i < FLOW.length - 1 && (
            <div style={{ display: "grid", placeItems: "center", padding: "0 2px" }}>
              <ArrowRight size={16} color={C.muted} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Interactive pipeline
const STAGES = [
  { key: "enquiry", label: "New Enquiry", color: C.blue },
  { key: "contacted", label: "Contacted", color: C.cyan },
  { key: "booked", label: "Call Booked", color: C.amber },
  { key: "showed", label: "Showed Up", color: C.purple },
  { key: "proposal", label: "Proposal Sent", color: C.coral },
  { key: "won", label: "Won", color: C.green },
];

type Lead = { id: string; name: string; kind: string; source: string; stage: number };
const SEED_LEADS: Lead[] = [
  { id: "l1", name: "Prime London Lettings", kind: "Letting agent", source: "Meta", stage: 0 },
  { id: "l2", name: "Northside Estate Agents", kind: "Sales & lettings", source: "Meta", stage: 1 },
  { id: "l3", name: "Harbourview Property Group", kind: "New builds", source: "Landing page", stage: 2 },
  { id: "l4", name: "Bricklane Sales", kind: "Independent agent", source: "Meta", stage: 3 },
  { id: "l5", name: "Meridian Homes", kind: "Property developer", source: "Referral", stage: 4 },
  { id: "l6", name: "Kestrel Property Mgmt", kind: "Block management", source: "Meta", stage: 5 },
  { id: "l7", name: "Oakfield Residential", kind: "Estate agent", source: "Landing page", stage: 1 },
];

function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);

  const advance = (id: string) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage: Math.min(l.stage + 1, STAGES.length - 1) } : l)));
  const reset = () => setLeads(SEED_LEADS);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: C.sub }}>
          Click any lead to move it to the next stage. This is the live logic, not a picture.
        </span>
        <button
          onClick={reset}
          style={{
            marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12.5, fontWeight: 700, color: C.sub, cursor: "pointer",
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "7px 13px",
          }}
        >
          <RotateCcw size={13} /> Reset board
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${STAGES.length}, minmax(150px, 1fr))`, gap: 10, overflowX: "auto" }}>
        {STAGES.map((st, si) => {
          const col = leads.filter((l) => l.stage === si);
          return (
            <div key={st.key} style={{ minWidth: 150 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: st.color, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  {st.label}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, background: C.card, borderRadius: 6, padding: "1px 7px" }}>
                  {col.length}
                </span>
              </div>
              <div style={{
                background: C.bg2, border: `1px dashed ${C.border}`, borderRadius: 12,
                padding: 8, minHeight: 96, display: "flex", flexDirection: "column", gap: 8,
              }}>
                <AnimatePresence mode="popLayout">
                  {col.map((l) => (
                    <motion.button
                      key={l.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => advance(l.id)}
                      style={{
                        textAlign: "left", cursor: si === STAGES.length - 1 ? "default" : "pointer",
                        background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${st.color}`,
                        borderRadius: 9, padding: "9px 10px",
                      }}
                    >
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{l.name}</div>
                      <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3 }}>{l.kind}</div>
                      <div style={{
                        display: "inline-block", marginTop: 6, fontSize: 9.5, fontWeight: 700,
                        color: l.source === "Meta" ? C.blue : l.source === "Referral" ? C.green : C.amber,
                        background: "rgba(255,255,255,0.03)", borderRadius: 5, padding: "1px 6px",
                      }}>
                        {l.source}
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Follow-up sequence
const SEQUENCE = [
  { when: "0 min", ch: "SMS + Email", Icon: Zap, title: "Instant auto-reply", body: "Thanks for your enquiry. Here is my calendar, grab a time that suits and I will walk you through the content package.", color: C.amber },
  { when: "Day 1", ch: "SMS", Icon: MessageSquare, title: "Soft nudge", body: "Hi {{first_name}}, did you get a chance to pick a time? Happy to hold one for you this week.", color: C.cyan },
  { when: "Day 2", ch: "Email", Icon: Mail, title: "Value + proof", body: "A quick look at the content we run for UK property brands, plus a sample month of posts and reels.", color: C.blue },
  { when: "Day 4", ch: "SMS", Icon: Phone, title: "Call nudge", body: "Still keen to show you what a done for you content month looks like. 15 minutes is all it takes.", color: C.purple },
  { when: "Day 7", ch: "Email", Icon: Send, title: "Last touch + nurture", body: "No rush at all. I will keep sending useful property marketing tips. Book any time you are ready.", color: C.coral },
];

function Sequence() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {SEQUENCE.map((s, i) => (
        <motion.div
          key={s.when}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          style={{
            display: "grid", gridTemplateColumns: "72px 1fr", gap: 14, alignItems: "start",
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, margin: "0 auto 6px", display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}` }}>
              <s.Icon size={18} color={s.color} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: s.color }}>{s.when}</div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{s.title}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: C.sub, background: C.cardHi, border: `1px solid ${C.border}`, borderRadius: 6, padding: "2px 7px" }}>{s.ch}</span>
            </div>
            <p style={{ fontSize: 13, color: C.sub, margin: "6px 0 0", lineHeight: 1.5 }}>{s.body}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Reporting dashboard
type Range = "7d" | "30d";
const REPORT: Record<Range, { leads: number; booked: number; showRate: number; won: number; conv: number; sources: { label: string; pct: number; color: string }[] }> = {
  "7d": {
    leads: 34, booked: 19, showRate: 74, won: 6, conv: 18,
    sources: [
      { label: "Meta Lead Form", pct: 62, color: C.blue },
      { label: "Landing page", pct: 24, color: C.amber },
      { label: "Referral", pct: 14, color: C.green },
    ],
  },
  "30d": {
    leads: 142, booked: 83, showRate: 71, won: 27, conv: 19,
    sources: [
      { label: "Meta Lead Form", pct: 58, color: C.blue },
      { label: "Landing page", pct: 27, color: C.amber },
      { label: "Referral", pct: 15, color: C.green },
    ],
  },
};

function Dashboard() {
  const [range, setRange] = useState<Range>("7d");
  const d = REPORT[range];
  const kpis = [
    { label: "Leads", value: d.leads, suffix: "", Icon: Users, color: C.cyan },
    { label: "Booked calls", value: d.booked, suffix: "", Icon: PhoneCall, color: C.blue },
    { label: "Show-up rate", value: d.showRate, suffix: "%", Icon: UserCheck, color: C.purple },
    { label: "Won", value: d.won, suffix: "", Icon: Trophy, color: C.green },
    { label: "Conversion", value: d.conv, suffix: "%", Icon: Percent, color: C.coral },
  ];

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px 20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <BarChart3 size={18} color={C.coral} />
        <span style={{ fontSize: 14, fontWeight: 800 }}>Moonstar Media — Lead Reporting</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: 4 }}>
          {(["7d", "30d"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                fontSize: 12, fontWeight: 700, cursor: "pointer", borderRadius: 999, padding: "5px 12px",
                border: "none", color: range === r ? C.bg : C.sub, background: range === r ? C.coral : "transparent",
              }}
            >
              {r === "7d" ? "Last 7 days" : "Last 30 days"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 18 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 16px" }}>
            <k.Icon size={16} color={k.color} />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${range}-${k.label}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                style={{ fontSize: 27, fontWeight: 800, color: C.ink, marginTop: 8 }}
              >
                {k.value}{k.suffix}
              </motion.div>
            </AnimatePresence>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.sub, marginBottom: 10 }}>Leads by source</div>
      <div style={{ display: "grid", gap: 10 }}>
        {d.sources.map((s) => (
          <div key={s.label} style={{ display: "grid", gridTemplateColumns: "130px 1fr 44px", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12.5, color: C.sub }}>{s.label}</span>
            <div style={{ height: 10, background: C.card, borderRadius: 999, overflow: "hidden" }}>
              <motion.div
                key={`${range}-${s.label}`}
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ height: "100%", background: s.color, borderRadius: 999 }}
              />
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, textAlign: "right" }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. How I'd build it (answers Q8)
const BUILD_PLAN = [
  { n: "01", title: "One offer, one landing page", body: "A single clear page for the monthly content package, built for UK property agents. Meta lead form mirrors it so the ad and the page ask the same three questions: business name, service focus, and how many listings a month." },
  { n: "02", title: "Meta lead form into GHL", body: "Native Meta connection so a lead hits the CRM in seconds, tagged with source, campaign, and ad set. No CSV exports, no lag. Speed to lead is the whole game with paid traffic." },
  { n: "03", title: "Instant auto-reply, then book", body: "SMS and email fire on submit with the calendar link, so the prospect books while intent is hot. Two way calendar sync, reminders at 24 hours and 1 hour, and a no-show branch that re-offers a time." },
  { n: "04", title: "A pipeline that mirrors reality", body: "New Enquiry, Contacted, Call Booked, Showed Up, Proposal Sent, Won. The stage is the single source of truth, so reporting is accurate without anyone updating a spreadsheet." },
  { n: "05", title: "A 5 step follow-up that does the chasing", body: "For anyone who does not book straight away, a mix of SMS and email over 7 days with real value for property brands, then a soft move into long term nurture. Nobody falls through the cracks." },
  { n: "06", title: "Reporting the owner actually reads", body: "One dashboard: leads, booked calls, show-up rate, conversion, and cost per booked call by campaign. Plus a one page SOP and a Loom so the team can run it without me." },
];

// ─────────────────────────────────────────────────────────────
export default function MoonstarLeadFunnel() {
  const heroStats = useMemo(
    () => [
      { k: "Meta to CRM", v: "seconds" },
      { k: "Follow-up", v: "5 steps" },
      { k: "Pipeline", v: "6 stages" },
      { k: "Reporting", v: "1 dashboard" },
    ],
    [],
  );

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 22px 100px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 34 }}>
          <a href="https://www.bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            <ArrowLeft size={15} /> BVN Official
          </a>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.coral, background: "rgba(251,146,60,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.blue }}>
            <Building2 size={15} /> Content agency for UK property businesses
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Moonstar Media
            <span style={{ color: C.coral }}> Lead Funnel</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 660, lineHeight: 1.6 }}>
            You asked how I would build the first project. Rather than describe it, here it is: a working
            GoHighLevel funnel from Meta lead form to booked call to closed content package, with the
            follow-up and reporting already wired. Click through it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 22, marginTop: 24 }}>
            {heroStats.map((s) => (
              <div key={s.k}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>{s.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="The funnel" title="Enquiry to won, end to end" sub="Every stage below is a real GoHighLevel object: a form, a workflow, a pipeline stage, a calendar, a report. Nothing here is a mockup.">
          <FlowRail />
        </Section>

        <Section eyebrow="Live pipeline" title="A pipeline that tracks itself" sub="Sample UK property leads flowing through the exact stages Moonstar needs. Click a card to advance it and watch the counts and reporting logic move.">
          <Pipeline />
        </Section>

        <Section eyebrow="Follow-up" title="The 5 step sequence that chases for you" sub="Fires the moment an enquiry lands and keeps going until they book or opt out. SMS and email, timed for UK business hours, personalised with merge fields.">
          <Sequence />
        </Section>

        <Section eyebrow="Reporting" title="The numbers Moonstar will actually check" sub="Leads, booked calls, show-up rate, conversion, and where the leads came from. Toggle the range. This is the weekly dashboard, live.">
          <Dashboard />
        </Section>

        <Section eyebrow="The plan" title="How I would build this in GoHighLevel" sub="My direct answer to question 8, as a six step build a property media agency can grow into.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {BUILD_PLAN.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.coral }}>{p.n}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{p.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* One man line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Sparkles size={18} color={C.coral} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 720 }}>
            I built this page, every workflow it represents, and the CRM behind my real client builds with my
            own hands. No team, no contractors, no handoffs. One person accountable from the lead form to the
            booked call to the report. That is why the first project moves fast and nothing gets lost in translation.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.coral, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <CheckCircle2 size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Phone size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps UK hours daily</span>
        </div>
      </div>
    </div>
  );
}
