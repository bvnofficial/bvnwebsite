"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ArrowDown, Cpu, Database, ShieldCheck, Users,
  Settings, UserPlus, MessageSquare, Home, Target, BarChart3, FileText,
  ListChecks, Sparkles, CheckCircle2, Clock, PhoneCall, Lock,
  GitBranch, Server, Route, Layers, Boxes,
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
// 1. Layered architecture (the stack, top to bottom)
const LAYERS = [
  {
    Icon: Users, name: "Your team and internal hub", color: C.cyan,
    body: "The people and the hub you already have. Owners, admins, and staff keep working where they work today. The AI sits inside it, it does not replace it.",
  },
  {
    Icon: Cpu, name: "Internal AI assistant", color: C.coral,
    body: "One front door for the team. Ask a question, search company knowledge, summarise a document, or trigger a workflow. It routes each request to the right department agent.",
  },
  {
    Icon: Boxes, name: "Department agents", color: C.purple,
    body: "Focused agents for operations, onboarding, guest support, owner communication, leads, reporting, documents, and tasks. Each one has a narrow job and only the tools and data it needs.",
  },
  {
    Icon: Database, name: "Knowledge layer over Supabase", color: C.green,
    body: "Your property info, documents, and processes embedded with vector search, so every agent answers from one source of truth, with a citation back to the record it used.",
  },
  {
    Icon: Server, name: "Supabase backend and hosting", color: C.blue,
    body: "Postgres, auth, row level security, and edge functions in Supabase, versioned in GitHub, deployed on Vercel with a long running service on Railway or Render when needed.",
  },
];

function Stack() {
  return (
    <div style={{ display: "grid", gap: 0 }}>
      {LAYERS.map((l, i) => (
        <div key={l.name}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            style={{
              display: "grid", gridTemplateColumns: "48px 1fr", gap: 14, alignItems: "center",
              background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${l.color}`,
              borderRadius: 14, padding: "16px 18px",
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${l.color}` }}>
              <l.Icon size={20} color={l.color} />
            </div>
            <div>
              <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink }}>{l.name}</div>
              <p style={{ fontSize: 13, color: C.sub, margin: "4px 0 0", lineHeight: 1.5 }}>{l.body}</p>
            </div>
          </motion.div>
          {i < LAYERS.length - 1 && (
            <div style={{ display: "grid", placeItems: "center", padding: "6px 0" }}>
              <ArrowDown size={16} color={C.muted} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Department agents explorer (interactive)
type Agent = {
  id: string; Icon: typeof Settings; name: string; tag: string;
  detail: string; access: string; color: string;
};

const AGENTS: Agent[] = [
  {
    id: "ops", Icon: Settings, name: "Operations", tag: "Keeps the day running", color: C.coral,
    detail: "Watches open tasks, turnovers, and maintenance across every property, groups them by priority, and nudges the right person before something slips. Summarises the state of operations on demand.",
    access: "Read ops and task tables, write only draft tasks",
  },
  {
    id: "onboarding", Icon: UserPlus, name: "Onboarding", tag: "New property and staff", color: C.cyan,
    detail: "Runs a new property or owner through your onboarding checklist, creates the task set, requests any missing documents, and flags what is blocking go live. Same for onboarding a new team member.",
    access: "Read onboarding docs, create draft tasks, request docs",
  },
  {
    id: "guest", Icon: MessageSquare, name: "Guest support", tag: "Fast, on brand replies", color: C.green,
    detail: "Drafts check in details, answers common guest questions from the property guide, and handles routine requests, always from the real booking and property record. Anything sensitive waits for a human.",
    access: "Read bookings and guides, draft messages, human approval to send",
  },
  {
    id: "owner", Icon: Home, name: "Owner communication", tag: "Keep owners informed", color: C.purple,
    detail: "Knows which owners are due a statement or update, drafts the monthly owner report from real numbers, and keeps a clear record of what was sent. Owner facing sends always get a sign off.",
    access: "Read owner and finance records, draft statements, human sign off",
  },
  {
    id: "leads", Icon: Target, name: "Lead tracking", tag: "No lead goes cold", color: C.amber,
    detail: "Captures new owner and property leads, tags them by source and stage, drafts the follow up, and tells you who to chase this week so the pipeline never stalls.",
    access: "Read and write the lead pipeline, draft follow ups",
  },
  {
    id: "reporting", Icon: BarChart3, name: "Reporting", tag: "The numbers, live", color: C.blue,
    detail: "Builds occupancy, revenue, and operations reporting from the data already in Supabase, on demand or on a schedule. Read only, so it can never change a record while it counts.",
    access: "Read only across bookings, finance, and ops",
  },
  {
    id: "docs", Icon: FileText, name: "Document handling", tag: "Find and file", color: C.rose,
    detail: "Reads, sorts, and summarises contracts, owner agreements, and property documents, extracts the fields that matter, and files them against the right property or owner with a citation.",
    access: "Read and file documents, no deletes",
  },
  {
    id: "tasks", Icon: ListChecks, name: "Task management", tag: "Nothing falls through", color: C.cyan,
    detail: "Turns a request, an email, or a guest message into a tracked task with an owner and a due date, then follows up until it is closed. The glue that keeps the other agents honest.",
    access: "Read and write tasks, notify assignees",
  },
];

function AgentExplorer() {
  const [activeId, setActiveId] = useState<string>(AGENTS[0].id);
  const active = AGENTS.find((a) => a.id === activeId) ?? AGENTS[0];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {AGENTS.map((a) => {
          const on = a.id === activeId;
          return (
            <button
              key={a.id}
              onClick={() => setActiveId(a.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                color: on ? C.bg : C.sub,
                background: on ? a.color : C.card,
                border: `1px solid ${on ? a.color : C.border}`,
                borderRadius: 999, padding: "8px 13px", transition: "all 0.16s",
              }}
            >
              <a.Icon size={14} /> {a.name}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{
            background: C.bg2, border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${active.color}`, borderRadius: 16, padding: "22px 22px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${active.color}` }}>
              <active.Icon size={20} color={active.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{active.name} agent</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: active.color, marginTop: 2 }}>{active.tag}</div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: "0 0 14px" }}>{active.detail}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: C.green, background: "rgba(52,211,153,0.08)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px" }}>
            <Lock size={13} /> Access: {active.access}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Ask the assistant (interactive routing demo)
type Ask = {
  q: string; agent: string; source: string; action: string;
  guard: string; guardColor: string; color: string;
};

const ASKS: Ask[] = [
  {
    q: "Draft the check in message for the Smith booking at Oceanview",
    agent: "Guest support", source: "Booking record and property guide", action: "Writes the message from the real details",
    guard: "Human approves before it sends", guardColor: C.amber, color: C.green,
  },
  {
    q: "Which owners are due their monthly statement this week?",
    agent: "Owner communication", source: "Owner and finance records", action: "Returns the list and offers to draft each statement",
    guard: "Read only until you say go", guardColor: C.blue, color: C.purple,
  },
  {
    q: "Summarise every open maintenance task across properties",
    agent: "Operations", source: "Task and operations tables", action: "Live summary grouped by property and priority",
    guard: "Read only", guardColor: C.blue, color: C.coral,
  },
  {
    q: "Onboard the new property at 14 Marina Way",
    agent: "Onboarding", source: "Onboarding checklist and documents", action: "Creates the task set and requests missing docs",
    guard: "Writes drafts, needs a sign off", guardColor: C.amber, color: C.cyan,
  },
  {
    q: "What is our occupancy and revenue trend this month?",
    agent: "Reporting", source: "Bookings and finance data", action: "Builds the numbers, changes nothing",
    guard: "Read only", guardColor: C.blue, color: C.blue,
  },
  {
    q: "Find the cleaning SOP for premium turnovers",
    agent: "Knowledge search", source: "Company knowledge base with vector search", action: "Returns the document with a citation",
    guard: "Read only", guardColor: C.blue, color: C.rose,
  },
];

function AskRouter() {
  const [i, setI] = useState(0);
  const a = ASKS[i];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {ASKS.map((ask, idx) => {
          const on = idx === i;
          return (
            <button
              key={ask.q}
              onClick={() => setI(idx)}
              style={{
                textAlign: "left", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                color: on ? C.ink : C.sub, background: on ? C.cardHi : C.card,
                border: `1px solid ${on ? a.color : C.border}`, borderRadius: 10, padding: "9px 12px",
                maxWidth: 320, lineHeight: 1.35,
              }}
            >
              <span style={{ color: C.muted }}>Team asks:</span> {ask.q}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={a.q}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 20px" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
            {[
              { Icon: Route, label: "Routed to", value: `${a.agent} agent`, color: a.color },
              { Icon: Database, label: "Reads from", value: a.source, color: C.green },
              { Icon: Cpu, label: "Then it", value: a.action, color: C.coral },
              { Icon: ShieldCheck, label: "Guardrail", value: a.guard, color: a.guardColor },
            ].map((step) => (
              <div key={step.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 14px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6, color: step.color }}>
                  <step.Icon size={13} /> {step.label}
                </div>
                <div style={{ fontSize: 13.5, color: C.ink, marginTop: 7, lineHeight: 1.45, fontWeight: 600 }}>{step.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Security and guardrails
const GUARDRAILS = [
  { Icon: Lock, title: "Least privilege", body: "Every agent gets only the tables and tools its job needs. No agent has a master key to the whole business.", color: C.coral },
  { Icon: ShieldCheck, title: "Row level security", body: "Access rules live in Supabase, not in the prompt. An agent physically cannot read a record it is not allowed to see.", color: C.green },
  { Icon: Users, title: "Roles and permissions", body: "Owner, admin, and staff each see and trigger only what their role allows, carried straight through to the agents.", color: C.blue },
  { Icon: CheckCircle2, title: "Human in the loop", body: "Anything owner facing, financial, or irreversible drafts first and waits for a person to approve. AI proposes, a human commits.", color: C.amber },
  { Icon: FileText, title: "Auditable actions", body: "Every agent action is logged with what it read and what it changed, so you can always answer who did what and why.", color: C.purple },
  { Icon: GitBranch, title: "Versioned and reversible", body: "It all lives in GitHub. Changes are reviewed, deployed on push, and can be rolled back if anything looks off.", color: C.cyan },
];

// ─────────────────────────────────────────────────────────────
// 5. Phased roadmap
const ROADMAP = [
  { n: "Phase 0", title: "Architecture sprint", body: "I review your hub, workflows, and where the team spends time, then deliver this blueprint made specific to you: the agent map, the data model, the security plan, and a costed roadmap. Yours whether or not we continue.", color: C.coral },
  { n: "Phase 1", title: "Knowledge layer and first agent", body: "Stand up the Supabase knowledge layer with vector search over your real documents, then ship one high value agent, most likely operations or guest support, and prove it in live work.", color: C.cyan },
  { n: "Phase 2", title: "Department agents", body: "Roll out the rest of the agents one at a time, onboarding, owner communication, leads, reporting, documents, and tasks, each tested before the next begins.", color: C.purple },
  { n: "Phase 3", title: "Automations and reporting", body: "Wire the agents into automations that remove manual steps end to end, and give owners and admins the live dashboards and scheduled reports they will actually open.", color: C.green },
  { n: "Phase 4", title: "Scale and hand over", body: "Harden security, document everything, and set up how new agents get added, so the system keeps growing as you scale, with or without me in the chair.", color: C.amber },
];

// ─────────────────────────────────────────────────────────────
// 6. Real builds behind this (described, not cross linked)
const PROOF = [
  {
    name: "AI operating system for a wholesale operator", color: C.coral,
    body: "Four connected engines: a voice and knowledge core that turns call recordings into a living searchable knowledge base, a research and synthesis engine, a draft, approve, send messaging layer with a human in the loop, and pipeline and purchase order automation across GoHighLevel, Notion, and WhatsApp. The closest thing to what you are describing, already built.",
    tags: ["RAG knowledge base", "Human in the loop", "Multi agent"],
  },
  {
    name: "Coded Supabase app on Vercel", color: C.blue,
    body: "My own production site is a Next.js and Supabase application I coded and deployed myself, with internal workspaces, dashboards, middleware auth, and a password protected operations dashboard reading live from Supabase. Proof I turn no code ideas into secure coded apps.",
    tags: ["Next.js", "Supabase", "Auth and RLS"],
  },
  {
    name: "Programmatic build tooling", color: C.green,
    body: "A command line tool and Python builders that create live CRM systems from a plain markdown document through the API, driven with Claude Code. This is how I ship fast: I build the logic in code, not by clicking.",
    tags: ["Claude Code", "API", "Automation"],
  },
];

// ─────────────────────────────────────────────────────────────
export default function StrAiOs() {
  const heroStats = useMemo(
    () => [
      { k: "Department agents", v: "8" },
      { k: "Knowledge layer", v: "Supabase + RAG" },
      { k: "Security", v: "role based" },
      { k: "Built and run by", v: "one person" },
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.purple }}>
            <Layers size={15} /> AI Operating System Blueprint · Short term rental
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            You asked how I would build it.
            <span style={{ color: C.coral }}> So I mapped it out.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 680, lineHeight: 1.6 }}>
            This is my answer to your question six, made clickable. An internal AI operating system for a
            premium short term rental business: department agents over a Supabase knowledge layer, with the
            security and roll out plan already thought through. It is a blueprint, not your real data, and
            the real thing would be shaped around your hub.
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

        <Section eyebrow="The architecture" title="The stack, top to bottom" sub="Five layers. Your people and hub stay on top, the AI sits inside the business, and everything answers from one secure source of truth underneath.">
          <Stack />
        </Section>

        <Section eyebrow="The agents" title="One agent per role, click any of them" sub="Not one giant assistant that does everything badly. Focused agents with a narrow job and only the access they need. Tap one to see what it does and what it is allowed to touch.">
          <AgentExplorer />
        </Section>

        <Section eyebrow="In practice" title="What happens when the team asks" sub="This is the internal assistant your team would actually use. Click a real request and watch how it gets routed, what it reads, and where a human stays in control.">
          <AskRouter />
        </Section>

        <Section eyebrow="Security first" title="Private business data, handled properly" sub="This is the part most people bolt on at the end. I design it in from the first agent, because you are trusting these systems with owner and guest data.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {GUARDRAILS.map((g, i) => (
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

        <Section eyebrow="The plan" title="How we get there without boiling the ocean" sub="One high value agent live and proven beats ten half built ones. A phased roll out you can stop, start, or re scope at any milestone.">
          <div style={{ display: "grid", gap: 12 }}>
            {ROADMAP.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 14, alignItems: "start", background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${p.color}`, borderRadius: 14, padding: "14px 16px" }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 800, color: p.color }}>{p.n}</div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{p.title}</div>
                  <p style={{ fontSize: 13, color: C.sub, margin: "5px 0 0", lineHeight: 1.5 }}>{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Not a mockup" title="Real systems behind this blueprint" sub="Client names stay confidential here, but each of these is real, live, and mine end to end. The architecture above is drawn from having actually shipped this kind of work.">
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
            <Sparkles size={18} color={C.coral} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I designed this page, and I would build the real system the same way: with my own hands. No team,
            no contractors, no handoffs. One person who can take ownership of the whole buildout so you can get
            back to scaling the business. That is exactly the ownership without hand holding you asked for.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps United States hours daily</span>
        </div>
      </div>
    </div>
  );
}
