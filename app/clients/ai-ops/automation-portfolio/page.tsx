"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Bot, GitBranch, Webhook, Send, Radar,
  HelpCircle, ListChecks, CheckCircle2, Sparkles, Workflow, Database,
  FileSpreadsheet, KanbanSquare, Video, Receipt, FileText, Terminal, Clock, PhoneCall,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.cyan }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. Real automations built (interactive)
type Auto = { Icon: typeof Bot; title: string; problem: string; build: string; result: string; color: string };
const AUTOMATIONS: Auto[] = [
  { Icon: GitBranch, title: "Conditional onboarding workflow", color: C.coral,
    problem: "A senior living client was chasing move in paperwork by hand, and forms slipped through the cracks.",
    build: "A GoHighLevel workflow that sends the onboarding emails on a timed sequence, then branches on the contact's Physician Forms status: incomplete forms trigger an automatic chase and hold, complete forms skip ahead to the next stage.",
    result: "Every contact gets chased until the paperwork is in, with no one manually tracking who is missing what." },
  { Icon: Webhook, title: "Two way webhook relay", color: C.cyan,
    problem: "Two platforms that had to stay in sync had no native integration, so someone was copying data between them by hand.",
    build: "A custom relay in Node and Python that listens for changes on each side and writes them to the other through webhooks and APIs, in both directions.",
    result: "The two systems stay in sync automatically, and the manual double entry is gone entirely." },
  { Icon: Send, title: "Cold email to CRM pipeline", color: C.blue,
    problem: "Positive replies from a cold email tool were being lost between the outreach platform and the CRM.",
    build: "An automation that webhooks a positive reply straight into GoHighLevel, creates the contact, tags it by intent, and fires an instant speed to lead follow up.",
    result: "Every interested reply lands in the pipeline within seconds, nurtured automatically instead of forgotten in an inbox." },
  { Icon: Radar, title: "AI job scraper to Slack", color: C.green,
    problem: "Manually checking job boards every day was slow and easy to skip, and good listings were missed.",
    build: "A scraper that pulls new listings on a schedule, classifies each one with AI for fit, and posts only the strong matches into Slack, running in the cloud on its own.",
    result: "The good opportunities surface automatically in one channel, with no manual board checking at all." },
];

function Automations() {
  const [i, setI] = useState(0);
  const a = AUTOMATIONS[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {AUTOMATIONS.map((au, idx) => {
          const on = idx === i;
          return (
            <button
              key={au.title}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 150, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? au.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <au.Icon size={16} color={au.color} />
              <div style={{ fontSize: 11, fontWeight: 800, color: au.color, marginTop: 6 }}>0{idx + 1}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 2, lineHeight: 1.25 }}>{au.title}</div>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={a.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${a.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${a.color}` }}>
              <a.Icon size={20} color={a.color} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{a.title}</div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: C.rose, marginBottom: 3 }}>The problem</div>
              <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0 }}>{a.problem}</p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: C.amber, marginBottom: 3 }}>What I built</div>
              <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0 }}>{a.build}</p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: C.green, marginBottom: 3 }}>The result</div>
              <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.6, margin: 0 }}>{a.result}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Vague request to solution
const PROCESS = [
  { Icon: HelpCircle, title: "A vague request comes in", body: "Something like make onboarding less painful or we keep dropping leads. No spec, just a problem and a feeling.", color: C.rose },
  { Icon: ListChecks, title: "I turn it into a plan", body: "I ask the few questions that matter, map the current process, and come back with a concrete plan and the tools it needs, not more questions.", color: C.amber },
  { Icon: CheckCircle2, title: "I ship and document it", body: "I build it, test it, document it so the team can run it, and record a short Loom walkthrough. The vague ask becomes a working system.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// 3. Tools used every week
const TOOLS = [
  { Icon: Sparkles, title: "Claude, Claude Code, ChatGPT", body: "Daily, to build, to draft and structure SOPs, to turn messy notes into clean docs, and as a coding partner.", color: C.purple },
  { Icon: Workflow, title: "n8n, Make, Zapier", body: "To connect apps and move data between them, with the conditional logic and error handling that keeps it reliable.", color: C.cyan },
  { Icon: Database, title: "GoHighLevel and Airtable", body: "As the system of record and the automation hub, where pipelines, workflows, and clean data live.", color: C.coral },
  { Icon: FileSpreadsheet, title: "Google Workspace and Sheets", body: "Trackers, shared docs, Gmail, and Calendar, the daily surface the rest of the operation runs on.", color: C.green },
  { Icon: KanbanSquare, title: "Asana and Wrike", body: "To run projects and keep tasks and ownership visible, so work does not live only in someone's head.", color: C.blue },
  { Icon: Video, title: "Loom", body: "To record walkthroughs and hand work over clearly, so a system I build is easy for the team to run.", color: C.amber },
  { Icon: Receipt, title: "QuickBooks and Ramp", body: "For bookkeeping and expense visibility when the operations work touches finance.", color: C.rose },
];

// ─────────────────────────────────────────────────────────────
// 4. SOP samples
const SOPS = [
  { t: "New client onboarding", meta: "Intake to kickoff" },
  { t: "Lead capture and follow up", meta: "Automation runbook" },
  { t: "Weekly ops and file hygiene", meta: "Recurring checklist" },
  { t: "Automation error handling", meta: "When something breaks" },
];

// ─────────────────────────────────────────────────────────────
// 5. Proof (real GHL screenshots)
function ProofShot({ src, caption }: { src: string; caption: string }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      {err ? (
        <div style={{ height: 200, display: "grid", placeItems: "center", background: C.bg2, color: C.muted, fontSize: 12.5, textAlign: "center", padding: "0 20px" }}>
          Screenshot from a live GoHighLevel account
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={caption}
          onError={() => setErr(true)}
          style={{ width: "100%", display: "block", borderBottom: `1px solid ${C.border}` }}
        />
      )}
      <div style={{ padding: "12px 14px", fontSize: 12.5, color: C.sub }}>{caption}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
export default function AiOpsAutomationPortfolio() {
  const heroStats = useMemo(
    () => [
      { k: "Automations", v: "Built, not theory" },
      { k: "AI tools", v: "Claude · ChatGPT, daily" },
      { k: "Works", v: "US EST overlap" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.cyan, background: "rgba(34,211,238,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.cyan }}>
            <Bot size={15} /> AI operations and automation specialist
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            I turn vague requests into automations
            <span style={{ color: C.cyan }}> that run themselves.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            You want someone who already lives in AI and automation tools and has personally built systems that
            save time. So instead of claiming it, here are real automations I have built, how I turn a vague ask
            into a shipped solution, and the tools I use every week. Click through it.
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

        <Section eyebrow="Real automations" title="Systems I have actually built" sub="Four automations I built and run, each with the problem it solved. Tap through them.">
          <Automations />
        </Section>

        <Section eyebrow="How I work" title="Vague request to shipped solution" sub="Turning a fuzzy ask into a finished system is the core of this role. Here is how I do it every time.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${p.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <p.Icon size={18} color={p.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{p.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="My weekly stack" title="The tools I actually use every week" sub="Not a list of everything I have heard of, just what I genuinely work in, and how.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
            {TOOLS.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 16px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                  <t.Icon size={17} color={t.color} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{t.title}</span>
                </div>
                <p style={{ fontSize: 12.5, color: C.sub, margin: 0, lineHeight: 1.55 }}>{t.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Documentation" title="SOPs and workflow docs" sub="Every automation I build ships with the documentation to run it, so it is never a black box. A sample of what that looks like.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {SOPS.map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                style={{ display: "flex", alignItems: "center", gap: 11, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 15px" }}
              >
                <FileText size={17} color={C.cyan} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{s.t}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{s.meta}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Proof" title="A live automation build" sub="Screenshots from a GoHighLevel account I built and run, the same kind of process automation this role is about.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="The workflow library, organized into folders, with an intake router and a booking to pipeline automation." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Seven published workflows firing stage by stage as a contact moves through the process." />
          </div>
        </Section>

        {/* Claude Code + one man line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Terminal size={18} color={C.cyan} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Built with Claude Code, and BVN is just me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            This page, and every automation above, comes from one person who lives in these tools daily. I am
            proactive and self managed, I turn vague into done, I document as I go, and I overlap US EST. That is
            the AI operations partner this role is describing.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.cyan, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps US EST, in Slack daily</span>
        </div>
      </div>
    </div>
  );
}
