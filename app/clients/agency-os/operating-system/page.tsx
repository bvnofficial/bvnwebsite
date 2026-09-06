"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, UserPlus, GitBranch, ListTodo, BarChart3,
  BookOpen, Webhook, Braces, Bot, Video, FileText, ShieldCheck,
  Clock, Sparkles, Boxes, Network, Zap, CheckCircle2, Code2, PhoneCall,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.green }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 680, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// The 5 OS modules (interactive explorer)
type Module = {
  id: string;
  Icon: typeof UserPlus;
  name: string;
  tagline: string;
  color: string;
  does: string;
  built: string[];
  outcome: string;
};

const MODULES: Module[] = [
  {
    id: "onboarding", Icon: UserPlus, name: "Client Onboarding", tagline: "From signed to started, hands off", color: C.blue,
    does: "The moment a client signs, the OS spins up their space: intake form, welcome sequence, kickoff booking, folder structure, and a subaccount or snapshot applied so their systems start from a known good baseline.",
    built: ["GHL forms and workflows", "Snapshot per client type", "Calendar booking", "Webhook to create folders"],
    outcome: "A new client is fully set up in minutes, the same way every time, with nothing forgotten.",
  },
  {
    id: "delivery", Icon: GitBranch, name: "Delivery Pipelines", tagline: "Every engagement, one visible path", color: C.coral,
    does: "Each service runs on its own pipeline with clear stages, entry and exit criteria, and automations that move work forward and notify the right person. You can see exactly where every client build is at a glance.",
    built: ["GHL pipelines with staged journeys", "Stage based automations", "Internal notifications", "Clean naming conventions"],
    outcome: "Nothing stalls silently. Work moves on defined triggers, not on someone remembering.",
  },
  {
    id: "tasks", Icon: ListTodo, name: "Task and Project Flow", tagline: "The work, assigned and tracked", color: C.amber,
    does: "Tasks are generated from pipeline stages and workflows, assigned to the right owner with due dates, and surfaced so nothing slips. Recurring work is templated, one off work is captured, and the team knows what is due today.",
    built: ["Workflow generated tasks", "Owner and due date logic", "Recurring templates", "Make or n8n sync where needed"],
    outcome: "The team operates from one clear list, not scattered messages and mental notes.",
  },
  {
    id: "reporting", Icon: BarChart3, name: "Reporting Dashboards", tagline: "The numbers, without the manual pull", color: C.purple,
    does: "Pipeline value, delivery status, lead flow, and client health rolled into dashboards that update themselves. Where GHL reporting stops, custom code and API pulls take over to build the view the agency actually needs.",
    built: ["GHL dashboards", "API pulls for custom metrics", "Custom coded views", "Scheduled data syncs"],
    outcome: "Leadership sees the real state of the agency without anyone building a report by hand.",
  },
  {
    id: "sops", Icon: BookOpen, name: "SOP Library", tagline: "Every system, documented to run without me", color: C.green,
    does: "Every build ships with a written SOP and a short Loom, kept in one library and linked from the system it documents. The OS is not just automations, it is the knowledge to run and maintain them.",
    built: ["Written SOP per system", "Loom walkthrough per build", "One page system maps", "Linked from the workflow itself"],
    outcome: "The agency keeps running and the systems stay maintainable, with or without the person who built them.",
  },
];

function OsExplorer() {
  const [id, setId] = useState(MODULES[0].id);
  const m = MODULES.find((x) => x.id === id) ?? MODULES[0];

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {MODULES.map((x) => {
          const on = x.id === id;
          return (
            <button
              key={x.id}
              onClick={() => setId(x.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                color: on ? C.bg : C.sub, background: on ? x.color : C.card,
                border: `1px solid ${on ? x.color : C.border}`, borderRadius: 999, padding: "8px 13px", transition: "all 0.16s",
              }}
            >
              <x.Icon size={14} /> {x.name}
            </button>
          );
        })}
      </div>

      {/* Panel (keyed motion.div, no AnimatePresence, mounts immediately) */}
      <motion.div
        key={m.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${m.color}`, borderRadius: 16, padding: "24px 22px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${m.color}` }}>
            <m.Icon size={21} color={m.color} />
          </div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, color: C.ink }}>{m.name}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: m.color, marginTop: 2 }}>{m.tagline}</div>
          </div>
        </div>

        <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: "0 0 16px" }}>{m.does}</p>

        <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: C.muted, marginBottom: 9 }}>
          What powers it
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
          {m.built.map((b) => (
            <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: C.sub, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px" }}>
              <Braces size={12} color={m.color} /> {b}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, fontWeight: 600, color: C.green, background: "rgba(52,211,153,0.07)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px" }}>
          <CheckCircle2 size={15} style={{ marginTop: 1, flexShrink: 0 }} /> {m.outcome}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// How it is built (the technical layer)
const STACK = [
  { Icon: Boxes, name: "GoHighLevel", role: "The hub: workflows, pipelines, snapshots, custom fields and values", color: C.coral },
  { Icon: Network, name: "Make / n8n / Zapier", role: "Cross platform logic and syncing where native falls short", color: C.purple },
  { Icon: Webhook, name: "Webhooks and REST APIs", role: "Both directions, JSON payloads, GHL talking to everything", color: C.cyan },
  { Icon: Code2, name: "Custom code with Claude Code", role: "Scripts and tools for anything no code cannot do", color: C.green },
  { Icon: Bot, name: "AI agents", role: "Chat, SMS, and voice agents wired into GHL conversations", color: C.blue },
];

// ─────────────────────────────────────────────────────────────
// Handover discipline (their explicit requirement)
const HANDOVER = [
  { Icon: Video, title: "A Loom for every system", body: "A short screen recording walking through each build, so the team can see how it runs, not just read about it.", color: C.rose },
  { Icon: FileText, title: "A written SOP for every system", body: "Step by step, in plain language, kept in the SOP library and linked from the workflow it documents.", color: C.cyan },
  { Icon: ShieldCheck, title: "Built to run without me", body: "Clean naming, clear entry and exit criteria, tested before live. The agency owns the system, not just the output.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// Real proof
const PROOF = [
  { name: "My own agency operating system", color: C.green,
    body: "I run my own operation on a linked backend of pipelines, dashboards, SOPs, and automations, and I drive GHL builds in code with a CLI and Python builders through the API. Building an internal OS is not theory for me, I live in one.",
    tags: ["Agency OS", "GHL CLI", "Claude Code"] },
  { name: "Multi division automation build", color: C.coral,
    body: "For a wholesale and Amazon client I architected a multi engine system: a knowledge core from call transcripts to a living doc, a scrape and synthesise spine, human in the loop messaging, and pipeline and PO plumbing. Real agency style backend work.",
    tags: ["Architecture", "Webhooks", "AI"] },
  { name: "Real AI agents in production", color: C.blue,
    body: "A complex Retell voice build, plus the GHL native voice agent with missed call text back in a live account. At least one working AI agent shipped, which is your bar, comfortably cleared.",
    tags: ["Voice AI", "Retell", "GHL"] },
];

// ─────────────────────────────────────────────────────────────
export default function AgencyOs() {
  const heroStats = [
    { k: "On GoHighLevel", v: "since 2019" },
    { k: "Custom code", v: "Claude Code" },
    { k: "Five modules", v: "clickable here" },
    { k: "Runs on", v: "one person" },
  ];

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 22px 100px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 34 }}>
          <a href="https://www.bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            <ArrowLeft size={15} /> BVN Official
          </a>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.green, background: "rgba(52,211,153,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.green }}>
            <Boxes size={15} /> Agency OS · GoHighLevel · custom code
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            The system that runs the agency.
            <span style={{ color: C.green }}> Click through every module.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You need an internal operating system: onboarding, delivery pipelines, task and project flow, reporting,
            and documented SOPs, built on GoHighLevel with custom code where no code falls short. Rather than describe
            it, here is one you can click through, module by module, with how each part is actually built.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((st) => (
              <div key={st.k}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>{st.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{st.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="The OS" title="Five modules, one operating system" sub="Click each one to see what it does, what powers it inside GHL and in code, and the outcome it delivers for the agency.">
          <OsExplorer />
        </Section>

        <Section eyebrow="Under the hood" title="How it is actually built" sub="GoHighLevel sits at the center as the system of record. Everything else plugs in, and where no code tools fall short, custom scripting takes over.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {STACK.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 14px" }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}`, flexShrink: 0 }}>
                  <s.Icon size={17} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.4 }}>{s.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Handover" title="Every system ships documented" sub="You asked for a short Loom and a written SOP for every system. That is already how I work, because a build nobody can run is not finished.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {HANDOVER.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <g.Icon size={18} color={g.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{g.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{g.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Not a mockup" title="Real builds behind this" sub="Client names stay confidential, but each of these is real and mine end to end. The OS above is drawn from having actually built agency backends and AI agents.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {PROOF.map((b, i) => (
              <motion.div
                key={b.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${b.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink, marginBottom: 8 }}>{b.name}</div>
                <p style={{ fontSize: 13, color: C.sub, margin: "0 0 12px", lineHeight: 1.55 }}>{b.body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {b.tags.map((t) => (
                    <span key={t} style={{ fontSize: 11, fontWeight: 600, color: C.sub, background: C.cardHi, border: `1px solid ${C.border}`, borderRadius: 7, padding: "3px 8px" }}>
                      {t}
                    </span>
                  ))}
                </div>
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
            <Sparkles size={18} color={C.green} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I built this page, the OS logic it runs on, and the client systems behind it with my own hands, custom
            code included. No team, no handoffs. You take a business goal to one person who architects the whole
            system, which is exactly what a not a follow the checklist role needs.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.green, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
            <Link href="/intro" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
              Intro video <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <Zap size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps United States hours daily</span>
        </div>
      </div>
    </div>
  );
}
