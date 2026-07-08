"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Compass, Boxes, GraduationCap, Users,
  Folder, FileText, ClipboardCheck, Sparkles, Terminal,
  CheckCircle2, Clock, PhoneCall, Building2,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.purple }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. The three phases (interactive)
type Phase = { Icon: typeof Compass; title: string; days: string; goal: string; items: string[]; color: string };
const PHASES: Phase[] = [
  {
    Icon: Compass, title: "Discovery and planning", days: "Days 1 to 15", color: C.cyan,
    goal: "Work directly with you to understand the business, then design the skeleton before a single folder is built.",
    items: [
      "Learn how each company operates, end to end",
      "Map departments and who owns what",
      "Define positions and the workflows between them",
      "Select and organize the tools: Google Workspace, Drive, Gmail, Calendar",
      "Draft the organizational structure, the skeleton everything hangs on",
    ],
  },
  {
    Icon: Boxes, title: "Implementation", days: "Days 16 to 45", color: C.coral,
    goal: "Turn the plan into a working system: everything organized, named, and templated so the team can find and use it.",
    items: [
      "Build a clean, logical Google Drive structure",
      "Organize emails and shared calendars",
      "Create folders, templates, and repeatable procedures",
      "Bring contracts, photos, documents, and records into order",
      "Write the Standard Operating Procedures, department by department",
      "Prepare each department to actually run on the system",
    ],
  },
  {
    Icon: GraduationCap, title: "Training and handover", days: "Final 15 days", color: C.green,
    goal: "Hand the team a system they can run without me, then step back with everything documented.",
    items: [
      "Train employees on the new systems, hands on",
      "Assign responsibilities so nothing is orphaned",
      "Test the workflows against real tasks",
      "Make final adjustments from what the testing shows",
      "Deliver a fully organized, documented operation",
    ],
  },
];

function Phases() {
  const [i, setI] = useState(0);
  const p = PHASES[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {PHASES.map((ph, idx) => {
          const on = idx === i;
          return (
            <button
              key={ph.title}
              onClick={() => setI(idx)}
              style={{
                flex: "1 1 180px", textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? ph.color : C.border}`,
                borderRadius: 12, padding: "14px 14px", transition: "all 0.16s",
              }}
            >
              <ph.Icon size={17} color={ph.color} />
              <div style={{ fontSize: 11, fontWeight: 800, color: ph.color, marginTop: 7 }}>{ph.days}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 2, lineHeight: 1.25 }}>{ph.title}</div>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={p.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${p.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${p.color}` }}>
              <p.Icon size={20} color={p.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{p.title}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginTop: 2 }}>{p.days}</div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: "0 0 16px" }}>{p.goal}</p>
          <div style={{ display: "grid", gap: 8 }}>
            {p.items.map((it) => (
              <div key={it} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, color: C.ink }}>
                <CheckCircle2 size={15} color={p.color} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{it}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. The org skeleton (sample)
const ORG = [
  { dept: "Operations", color: C.coral, roles: ["Operations lead", "Project coordinator", "Admin support"] },
  { dept: "Sales and clients", color: C.cyan, roles: ["Sales lead", "Account manager", "Intake and scheduling"] },
  { dept: "Finance", color: C.green, roles: ["Bookkeeping", "Invoicing and AR", "Contracts and records"] },
  { dept: "Delivery", color: C.amber, roles: ["Team lead", "Field or service staff", "Quality and handover"] },
];

// ─────────────────────────────────────────────────────────────
// 3. Google Drive blueprint
const DRIVE = [
  { name: "00 Company", children: ["Org chart", "Brand and assets", "Policies"] },
  { name: "01 Operations", children: ["SOPs", "Templates", "Checklists"] },
  { name: "02 Clients", children: ["Active", "Archive", "Contracts"] },
  { name: "03 Finance", children: ["Invoices", "Receipts", "Reports"] },
  { name: "04 Team", children: ["Onboarding", "Roles and responsibilities", "Training"] },
];

// ─────────────────────────────────────────────────────────────
// 4. SOP library
const SOPS = [
  { t: "New client onboarding", meta: "Sales to delivery handoff" },
  { t: "Weekly file and Drive hygiene", meta: "Operations" },
  { t: "Invoicing and payment follow up", meta: "Finance" },
  { t: "Document and contract filing", meta: "Records" },
  { t: "New hire onboarding", meta: "Team" },
  { t: "Project close and handover", meta: "Delivery" },
];

// ─────────────────────────────────────────────────────────────
export default function FbLegacyRoadmap() {
  const heroStats = useMemo(
    () => [
      { k: "Timeline", v: "30 to 60 days" },
      { k: "Phases", v: "3, discovery to handover" },
      { k: "Leaves behind", v: "A system, not an assistant" },
      { k: "Built with", v: "Claude Code" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.purple, background: "rgba(167,139,250,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.purple }}>
            <Building2 size={15} /> A 30 to 60 day operational foundation project
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            A build that leaves behind a company
            <span style={{ color: C.purple }}> that runs without me.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            You are not looking for an assistant. You want someone who can design the skeleton, build the system on
            top of it, and hand it over so your team keeps running it. So rather than describe how I would do that,
            I turned your three phases into the actual plan. Click through it.
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

        <Section eyebrow="The plan" title="Three phases, one organized operation" sub="Your Discovery, Implementation, and Handover phases, laid out with the deliverables I would own in each. Tap a phase.">
          <Phases />
        </Section>

        <Section eyebrow="The skeleton" title="A sample org structure" sub="The first thing I build in discovery: departments, roles, and who owns what, so every folder and SOP later has a clear home. A starting shape, tuned to your actual business.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {ORG.map((o, i) => (
              <motion.div
                key={o.dept}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${o.color}`, borderRadius: 14, padding: "16px 16px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                  <Users size={16} color={o.color} />
                  <span style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{o.dept}</span>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {o.roles.map((r) => (
                    <div key={r} style={{ fontSize: 12.5, color: C.sub, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px" }}>{r}</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="The build" title="A Google Drive that makes sense" sub="A clean, numbered folder structure so anyone on the team can find anything in seconds. This is what organized looks like when it is designed, not grown by accident.">
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px 20px", display: "grid", gap: 10 }}>
            {DRIVE.map((f) => (
              <div key={f.name} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: C.ink, minWidth: 170 }}>
                  <Folder size={16} color={C.purple} /> {f.name}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {f.children.map((ch) => (
                    <span key={ch} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: C.sub, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 9px" }}>
                      <FileText size={12} color={C.muted} /> {ch}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="The documentation" title="An SOP library, not a pile of notes" sub="Every recurring task written up as a clear procedure the team can follow without me in the room. A sample of what the handover includes.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            {SOPS.map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                style={{ display: "flex", alignItems: "center", gap: 11, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 15px" }}
              >
                <ClipboardCheck size={17} color={C.green} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{s.t}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{s.meta}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* AI + one man line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Terminal size={18} color={C.purple} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>AI tools are how I move this fast.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            You listed AI tools as a plus. I build with Claude Code and use AI daily, including to draft this page,
            structure SOPs, and turn messy notes into clean documentation in a fraction of the time. For a fixed
            30 to 60 day project, that speed is the difference between a rushed handover and a finished one. One
            person, organized, thinking a step ahead, and closing the loop.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.purple, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps US hours, in Slack daily</span>
        </div>
      </div>
    </div>
  );
}
