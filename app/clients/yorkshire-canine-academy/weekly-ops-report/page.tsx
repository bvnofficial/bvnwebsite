"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Dog, Users, PhoneCall, Trophy, DollarSign,
  Percent, Mail, MousePointerClick, AlertTriangle, CheckCircle2, Zap,
  Database, Table, RefreshCw, Sparkles, Clock, Layers, BarChart3,
  FileSpreadsheet,
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
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// Weekly report data
type Week = "this" | "last";
type Report = {
  kpis: { leads: number; calls: number; sales: number; revenue: number; showRate: number };
  campaigns: { name: string; leads: number; conv: number; color: string }[];
  sequences: { name: string; open: number; click: number; conv: number }[];
  closers: { name: string; calls: number; closes: number; rate: number; revenue: number }[];
  flags: { txt: string; level: string }[];
};

const REPORT: Record<Week, Report> = {
  this: {
    kpis: { leads: 148, calls: 42, sales: 14, revenue: 38600, showRate: 71 },
    campaigns: [
      { name: "UK Dog Training Program", leads: 71, conv: 12, color: C.blue },
      { name: "Trainer Mentorship Arm", leads: 44, conv: 16, color: C.purple },
      { name: "US Puppy Foundations", leads: 33, conv: 9, color: C.cyan },
    ],
    sequences: [
      { name: "New Lead Nurture", open: 58, click: 22, conv: 9 },
      { name: "Booked Call Reminder", open: 74, click: 39, conv: 71 },
      { name: "Mentorship Waitlist", open: 49, click: 15, conv: 6 },
    ],
    closers: [
      { name: "James W.", calls: 16, closes: 6, rate: 38, revenue: 17400 },
      { name: "Aisha K.", calls: 14, closes: 5, rate: 36, revenue: 13200 },
      { name: "Diego M.", calls: 12, closes: 3, rate: 25, revenue: 8000 },
    ],
    flags: [
      { txt: "3 soft bounces on the mentorship sending domain, watching the trend", level: C.amber },
      { txt: "1 broken link in the US Puppy funnel, found and fixed today", level: C.green },
      { txt: "Spam complaint rate normal at 0.02 percent", level: C.green },
    ],
  },
  last: {
    kpis: { leads: 121, calls: 35, sales: 10, revenue: 27900, showRate: 66 },
    campaigns: [
      { name: "UK Dog Training Program", leads: 58, conv: 10, color: C.blue },
      { name: "Trainer Mentorship Arm", leads: 39, conv: 13, color: C.purple },
      { name: "US Puppy Foundations", leads: 24, conv: 8, color: C.cyan },
    ],
    sequences: [
      { name: "New Lead Nurture", open: 55, click: 19, conv: 7 },
      { name: "Booked Call Reminder", open: 70, click: 34, conv: 66 },
      { name: "Mentorship Waitlist", open: 47, click: 13, conv: 5 },
    ],
    closers: [
      { name: "Aisha K.", calls: 13, closes: 4, rate: 31, revenue: 10800 },
      { name: "James W.", calls: 15, closes: 4, rate: 27, revenue: 10400 },
      { name: "Diego M.", calls: 11, closes: 2, rate: 18, revenue: 6700 },
    ],
    flags: [
      { txt: "Deliverability clean across all domains", level: C.green },
      { txt: "Zapier scenario for booked calls stalled twice, re authenticated", level: C.amber },
      { txt: "Two duplicate contacts merged in Airtable", level: C.green },
    ],
  },
};

function Dashboard() {
  const [week, setWeek] = useState<Week>("this");
  const d = REPORT[week];
  const maxLeads = Math.max(...d.campaigns.map((c) => c.leads));

  const kpis = [
    { label: "New leads", value: d.kpis.leads, prefix: "", Icon: Users, color: C.cyan },
    { label: "Booked calls", value: d.kpis.calls, prefix: "", Icon: PhoneCall, color: C.blue },
    { label: "Sales closed", value: d.kpis.sales, prefix: "", Icon: Trophy, color: C.green },
    { label: "Revenue", value: d.kpis.revenue, prefix: "£", Icon: DollarSign, color: C.coral },
    { label: "Show rate", value: d.kpis.showRate, prefix: "", suffix: "%", Icon: Percent, color: C.purple },
  ];

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px 20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <BarChart3 size={18} color={C.coral} />
        <span style={{ fontSize: 14, fontWeight: 800 }}>Yorkshire Canine Academy, weekly report</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: 4 }}>
          {(["this", "last"] as Week[]).map((w) => (
            <button
              key={w}
              onClick={() => setWeek(w)}
              style={{ fontSize: 12, fontWeight: 700, cursor: "pointer", borderRadius: 999, padding: "5px 12px", border: "none", color: week === w ? C.bg : C.sub, background: week === w ? C.coral : "transparent" }}
            >
              {w === "this" ? "This week" : "Last week"}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 20 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}>
            <k.Icon size={15} color={k.color} />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${week}-${k.label}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                style={{ fontSize: 23, fontWeight: 800, color: C.ink, marginTop: 7 }}
              >
                {k.prefix}{k.value.toLocaleString()}{k.suffix ?? ""}
              </motion.div>
            </AnimatePresence>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
        {/* Campaigns */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: C.sub, marginBottom: 10 }}>Marketing campaigns</div>
          <div style={{ display: "grid", gap: 10 }}>
            {d.campaigns.map((c) => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: C.ink, fontWeight: 600 }}>{c.name}</span>
                  <span style={{ color: C.muted }}>{c.leads} leads · {c.conv}% conv</span>
                </div>
                <div style={{ height: 9, background: C.card, borderRadius: 999, overflow: "hidden" }}>
                  <motion.div
                    key={`${week}-${c.name}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.leads / maxLeads) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ height: "100%", background: c.color, borderRadius: 999 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Sequences */}
          <div style={{ fontSize: 12.5, fontWeight: 800, color: C.sub, margin: "18px 0 10px" }}>Email sequences</div>
          <div style={{ display: "grid", gap: 8 }}>
            {d.sequences.map((s) => (
              <div key={s.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 6 }}>{s.name}</div>
                <div style={{ display: "flex", gap: 14, fontSize: 11.5 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.sub }}><Mail size={12} color={C.blue} /> {s.open}% open</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.sub }}><MousePointerClick size={12} color={C.cyan} /> {s.click}% click</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.sub }}><CheckCircle2 size={12} color={C.green} /> {s.conv}% conv</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closers + flags */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: C.sub, marginBottom: 10 }}>Closer leaderboard</div>
          <div style={{ display: "grid", gap: 8 }}>
            <AnimatePresence mode="popLayout">
              {d.closers.map((cl, i) => (
                <motion.div
                  key={cl.name}
                  layout
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: "grid", gridTemplateColumns: "22px 1fr auto", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}
                >
                  <span style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? C.amber : C.muted }}>{i + 1}</span>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>{cl.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{cl.closes}/{cl.calls} closed · {cl.rate}% rate</div>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: C.green }}>£{cl.revenue.toLocaleString()}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div style={{ fontSize: 12.5, fontWeight: 800, color: C.sub, margin: "18px 0 10px" }}>Flags and things I caught</div>
          <div style={{ display: "grid", gap: 8 }}>
            {d.flags.map((f) => (
              <div key={f.txt} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 12.5, color: C.sub, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", lineHeight: 1.45 }}>
                {f.level === C.green ? <CheckCircle2 size={14} color={C.green} style={{ marginTop: 1, flexShrink: 0 }} /> : <AlertTriangle size={14} color={f.level} style={{ marginTop: 1, flexShrink: 0 }} />}
                {f.txt}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Automation health (their section 3)
const FLOWS = [
  { from: "GHL new lead", to: "Airtable Contacts", via: "Make", status: "Firing", ok: true },
  { from: "Payment received", to: "Airtable Sales", via: "Make", status: "Reconciled", ok: true },
  { from: "GHL booked call", to: "Airtable + closer", via: "Zapier", status: "Re authenticated", ok: false },
  { from: "Sequence engagement", to: "Airtable activity", via: "Make", status: "Firing", ok: true },
];

// ─────────────────────────────────────────────────────────────
// Airtable CRM base (their section 2)
const TABLES = [
  { name: "Contacts", note: "Linked to sales, campaigns, and activity", color: C.cyan },
  { name: "Sales", note: "Every deal, closer, and value", color: C.green },
  { name: "Payments", note: "Synced and reconciled automatically", color: C.coral },
  { name: "Campaigns", note: "Source and performance per lead", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// What I own each week
const OWN = [
  { Icon: Layers, title: "GoHighLevel", body: "Sequences and campaigns checked and scheduled, copy swaps, landing page code pasted in cleanly, deliverability watched.", color: C.coral },
  { Icon: Table, title: "Airtable CRM", body: "The base structured so sales, payments, and customer data land correctly, audited for accuracy, sync issues fixed.", color: C.cyan },
  { Icon: Zap, title: "Automations", body: "Make and Zapier flows built, monitored, and repaired the moment a trigger stops firing or data stops syncing.", color: C.amber },
  { Icon: FileSpreadsheet, title: "Weekly reporting", body: "This report, pulled from GHL and Airtable, organised clearly, with the red flags surfaced before you have to ask.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
export default function YcaWeeklyReport() {
  const heroStats = useMemo(
    () => [
      { k: "Stack", v: "GHL · Airtable · Make" },
      { k: "Reporting", v: "weekly, clear" },
      { k: "UK overlap", v: "daily" },
      { k: "Runs on", v: "one person" },
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
            Built for Yorkshire Canine Academy
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.amber }}>
            <Dog size={15} /> Tech and ops for a dog training business
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            You asked for a sample report.
            <span style={{ color: C.coral }}> Here is a live one, sit and stay.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 680, lineHeight: 1.6 }}>
            This is the weekly report I would send your leadership, built the way I would actually run it:
            pulled from GoHighLevel and Airtable, campaign and sequence performance, a closer leaderboard, and
            the red flags I caught this week. Toggle the week and watch it move.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((s) => (
              <div key={s.k}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>{s.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="The weekly report" title="Your leadership report, live" sub="Marketing, email sequences, closers, and deliverability in one view. This is a sample with made up numbers, but the structure is exactly what you would get every week.">
          <Dashboard />
        </Section>

        <Section eyebrow="Automation health" title="GHL to Airtable, monitored" sub="The flows that keep your data honest, and how I watch them. When a Zap or scenario stops firing, you hear it from me first, with it already fixed.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {FLOWS.map((f, i) => (
              <motion.div
                key={f.from}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 15px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>{f.from}</span>
                  <ArrowRight size={13} color={C.muted} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>{f.to}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}><Zap size={11} color={C.amber} /> via {f.via}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: f.ok ? C.green : C.amber }}>
                    {f.ok ? <CheckCircle2 size={12} /> : <RefreshCw size={12} />} {f.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="The CRM" title="Airtable, owned end to end" sub="A base built so sales, payments, and customer data populate correctly and automatically, with linked records that actually link and payments that reconcile.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
            {TABLES.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${t.color}`, borderRadius: 12, padding: "15px 15px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <Database size={15} color={t.color} />
                  <span style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{t.name}</span>
                </div>
                <p style={{ fontSize: 12.5, color: C.sub, margin: 0, lineHeight: 1.5 }}>{t.note}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="The role" title="What I would own every week" sub="The whole technical backbone of your marketing and sales operations, so your team can get on with training dogs and mentoring trainers.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {OWN.map((o, i) => (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <o.Icon size={18} color={o.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{o.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{o.body}</p>
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
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I built this report and every system it pulls from with my own hands. I am in the Philippines, I run
            an afternoon and evening shift that overlaps your UK hours, and I am the kind of person who flags the
            broken thing before you notice it. A real dog person, too, which does not hurt.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.coral, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <CheckCircle2 size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> PH, overlaps UK hours daily</span>
        </div>
      </div>
    </div>
  );
}
