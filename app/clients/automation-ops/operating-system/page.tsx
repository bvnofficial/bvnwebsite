"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Calculator, Search, Gauge,
  FileText, Wrench, ShieldCheck, Users, Boxes, Phone, Sparkles,
  CheckCircle2, Clock, PhoneCall, Target,
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
// 1. ROI Sprint calculator (interactive, this is their product)
function RoiCalculator() {
  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(40);
  const [auto, setAuto] = useState(70);

  const monthlyHours = Math.round(hours * 4.33 * (auto / 100));
  const monthlySaving = Math.round(monthlyHours * rate);
  const annualSaving = monthlySaving * 12;
  const buildLow = Math.max(300, Math.round((annualSaving * 0.2) / 50) * 50);
  const buildHigh = Math.max(600, Math.round((annualSaving * 0.35) / 50) * 50);
  const payback = monthlySaving > 0 ? (buildHigh / monthlySaving).toFixed(1) : "0";

  const sliders = [
    { label: "Hours a week on the manual workflow", value: hours, set: setHours, min: 1, max: 40, suffix: " hrs" },
    { label: "Loaded cost per hour", value: rate, set: setRate, min: 20, max: 120, prefix: "A$" },
    { label: "Share of it that is automatable", value: auto, set: setAuto, min: 10, max: 100, suffix: "%" },
  ];
  const outs = [
    { label: "Hours saved a month", value: `${monthlyHours}`, color: C.cyan },
    { label: "Saved a year", value: `A$${annualSaving.toLocaleString()}`, color: C.green },
    { label: "Typical build quote", value: `A$${buildLow.toLocaleString()} to A$${buildHigh.toLocaleString()}`, color: C.coral },
    { label: "Payback", value: `${payback} months`, color: C.amber },
  ];

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px 22px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        <div style={{ display: "grid", gap: 18, alignContent: "start" }}>
          {sliders.map((s) => (
            <div key={s.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: 12.5, color: C.sub }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>{s.prefix ?? ""}{s.value}{s.suffix ?? ""}</span>
              </div>
              <input
                type="range" min={s.min} max={s.max} value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                style={{ width: "100%", accentColor: C.coral, cursor: "pointer" }}
              />
            </div>
          ))}
          <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>
            Drag the sliders. This is the core of the sprint: map one workflow, size the saving, and produce a quote a client can say yes to.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {outs.map((o) => (
            <div key={o.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${o.color}`, borderRadius: 14, padding: "16px 16px" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={o.value}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 20, fontWeight: 800, color: o.color, lineHeight: 1.15 }}
                >
                  {o.value}
                </motion.div>
              </AnimatePresence>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6 }}>{o.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. The sprint delivery pipeline (interactive)
type Stg = { Icon: typeof Search; title: string; detail: string; color: string };
const PIPE: Stg[] = [
  { Icon: Phone, title: "Discovery", color: C.blue, detail: "A tight set of discovery questions that surface where time actually leaks, so the sprint starts from the real bottleneck, not a guess." },
  { Icon: Search, title: "Workflow audit", color: C.cyan, detail: "Map one manual workflow end to end, every step, handoff, and tool, in a repeatable audit template any operator can follow." },
  { Icon: Gauge, title: "Opportunity scoring", color: C.purple, detail: "Score each automation opportunity on impact and effort, so the client sees exactly what to automate first and why." },
  { Icon: Calculator, title: "ROI estimate", color: C.green, detail: "Turn hours and cost into a hard number, monthly time saved and annual dollars, the calculator above made client ready." },
  { Icon: FileText, title: "Implementation quote", color: C.amber, detail: "A clean quote and report the client can approve, with scope, price, and payback laid out so the yes is easy." },
  { Icon: Wrench, title: "Build and handoff", color: C.coral, detail: "The build in n8n, Make, Zapier, GHL, or Airtable, then a clean handoff pack so a lower cost builder can run it." },
  { Icon: ShieldCheck, title: "QA and sign off", color: C.rose, detail: "A QA checklist that catches loops, double fires, and gaps before the client sees it. Nothing ships unchecked." },
];

function Pipeline() {
  const [i, setI] = useState(0);
  const s = PIPE[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {PIPE.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.title}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 128, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <st.Icon size={16} color={st.color} />
              <div style={{ fontSize: 11, fontWeight: 800, color: st.color, marginTop: 6 }}>0{idx + 1}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 2, lineHeight: 1.25 }}>{st.title}</div>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${s.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}` }}>
              <s.Icon size={20} color={s.color} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{s.title}</div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{s.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Opportunity scoring (ranked sample)
const OPPS = [
  { name: "Lead intake and follow up", impact: 9, effort: 3 },
  { name: "Quote and proposal generation", impact: 8, effort: 4 },
  { name: "Onboarding checklist and docs", impact: 7, effort: 3 },
  { name: "Monthly reporting pull", impact: 6, effort: 5 },
].map((o) => ({ ...o, score: +(o.impact / o.effort).toFixed(1) })).sort((a, b) => b.score - a.score);

// ─────────────────────────────────────────────────────────────
// 4. The operating system
const OS = [
  { Icon: Users, title: "Structure and roles", body: "A clear org map: owner, setter, closer, auditor, builder, and QA, each with a one page role card so contractors know their lane on day one.", color: C.coral },
  { Icon: FileText, title: "SOPs and templates", body: "Discovery questions, the audit template, the scoring framework, the quote and report template, and the QA checklist, all repeatable.", color: C.cyan },
  { Icon: Boxes, title: "The ops hub", body: "ClickUp or Airtable set up to run leads, audits, builds, and contractors in one place, with the views and automations to keep it moving.", color: C.green },
  { Icon: Phone, title: "B2B sales operations", body: "The cold call and appointment setting workflow, the setter to closer handoff, the CRM pipeline, and the reporting the owner checks weekly.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// 5. First three deliverables (answers Q5)
const FIRST3 = [
  { n: "01", title: "The operating system map", body: "The company structure, roles, and the end to end ROI sprint process on one page, so everyone can see how the business runs before a single hire." },
  { n: "02", title: "The sprint delivery kit", body: "Discovery questions, audit template, opportunity scoring framework, quote and report template, and QA checklist. The repeatable product itself." },
  { n: "03", title: "The ops hub and sales pipeline", body: "ClickUp or Airtable to manage leads, audits, builds, and contractors, plus the B2B pipeline with setter and closer handoff and a reporting view." },
];

// ─────────────────────────────────────────────────────────────
export default function AutomationOperatingSystem() {
  const heroStats = useMemo(
    () => [
      { k: "Ops experience", v: "22+ years" },
      { k: "The product", v: "ROI sprint" },
      { k: "Australia", v: "easy overlap" },
      { k: "Built by", v: "an operator" },
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.coral }}>
            <Boxes size={15} /> Operating system for a workflow automation business
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            You sell ROI sprints.
            <span style={{ color: C.coral }}> So I built you the system that runs them.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 680, lineHeight: 1.6 }}>
            I run a workflow automation operation myself, so I am not guessing at your business, I live in it. Here
            is the operating system I would design: the ROI calculator that is the heart of your sprint, the
            delivery pipeline, the scoring framework, and the structure a team of contractors can actually follow.
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

        <Section eyebrow="The product, live" title="The ROI sprint, as a working calculator" sub="Map one workflow, size the time and dollars it wastes, and produce a build quote with a payback the client can see. Drag the sliders. This is the engine of what you sell.">
          <RoiCalculator />
        </Section>

        <Section eyebrow="The delivery" title="One repeatable pipeline, discovery to sign off" sub="Every sprint runs the same way, so quality does not depend on who is delivering it. Click each stage to see what happens and why.">
          <Pipeline />
        </Section>

        <Section eyebrow="The framework" title="What to automate first" sub="Opportunity scoring on impact over effort, so the client always knows the highest value first move. A sample ranking below.">
          <div style={{ display: "grid", gap: 10 }}>
            {OPPS.map((o, i) => (
              <motion.div
                key={o.name}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ display: "grid", gridTemplateColumns: "26px 1fr auto", alignItems: "center", gap: 12, background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${i === 0 ? C.green : C.border}`, borderRadius: 12, padding: "12px 14px" }}
              >
                <span style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? C.green : C.muted }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{o.name}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>impact {o.impact} · effort {o.effort}</div>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800, color: C.coral }}>
                  <Target size={13} /> {o.score}
                </span>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="The operating system" title="The structure a team can run" sub="The point of the first sprint: build this so the business can later run on lower cost operators and builders, not on you.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {OS.map((o, i) => (
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

        <Section eyebrow="My answer to question five" title="The first three deliverables" sub="If we start with the 10 to 20 hour sprint, this is what I would hand you, in this order, so the business is set up properly from the base up.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {FIRST3.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.coral}`, borderRadius: 14, padding: "18px 18px" }}
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
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I designed and coded this page, and I run my own operations and automation business, so I am handing
            you a system I would use myself. More than twenty years turning messy processes into structure, one
            operator who thinks strategically and can also build the thing. Exactly what you asked for.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps AEST easily</span>
        </div>
      </div>
    </div>
  );
}
