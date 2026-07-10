"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Code2, Workflow, Bot, Database, Cloud,
  Terminal, CheckCircle2, Clock, Search, PenTool, Wrench, ShieldCheck,
  Rocket, Radar, Wallet, RefreshCw, Braces, Server, Lock, Cpu, Gauge, PhoneCall,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.blue }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. Systems shipped (interactive)
type Sys = {
  Icon: typeof Code2;
  title: string;
  tag: string;
  color: string;
  problem: string;
  build: string;
  result: string;
  stack: string[];
};
const SYSTEMS: Sys[] = [
  {
    Icon: Radar, title: "AI job pipeline", tag: "Scraping · LLM · Slack", color: C.blue,
    problem: "Hundreds of new listings a day, scanned by hand to find the few worth acting on. Slow, repetitive, and easy to miss the good ones.",
    build: "A Python scraper pulls new listings on a schedule, an LLM classifier scores each one for fit against a rubric, and only the strong matches are routed into Slack with the reasoning attached. It runs hourly in the cloud, so the machine can be off and the work still happens.",
    result: "Zero manual scanning. Only qualified, ranked opportunities surface, each with a one line why. This exact system is running in production right now.",
    stack: ["Python", "Scrapy / Selenium", "LLM API", "Slack API", "Cloud cron"],
  },
  {
    Icon: RefreshCw, title: "Two way API relay", tag: "Webhooks · Integration", color: C.cyan,
    problem: "Two systems that do not natively talk to each other, with a team copying records between them by hand and things falling out of sync.",
    build: "A webhook relay that listens on both sides, maps the fields, and pushes changes each way in near real time. Built with idempotency and retries so a duplicate event or a dropped request never corrupts the data or double writes.",
    result: "The two systems stay in sync on their own. The manual copying is gone, and so are the sync errors that came with it.",
    stack: ["Python", "REST + webhooks", "Idempotency + retries", "Queue"],
  },
  {
    Icon: Database, title: "Property data ETL", tag: "Ingestion · ETL · DB", color: C.green,
    problem: "Property data scattered across sources in different shapes, with no single clean place to query it from.",
    build: "A Scrapy, Selenium, and Playwright ingestion layer that handles static, dynamic, and JS heavy sources, an ETL step that normalizes everything into one unified data model, and an automated sync that keeps it current, all landing in Postgres via Supabase.",
    result: "One clean, queryable source of truth instead of a pile of mismatched exports, refreshed automatically with no hand cleaning.",
    stack: ["Python", "Scrapy / Selenium / Playwright", "ETL", "Postgres / Supabase"],
  },
  {
    Icon: Wallet, title: "Payments + wallet system", tag: "Full stack · Ledger", color: C.amber,
    problem: "Taking payment and tracking a per user balance by hand does not scale and is easy to get wrong.",
    build: "A credits wallet wired to PayPal and GCash: a payment fires a webhook, the ledger records it, and the user balance updates in one atomic flow. Backed by a Supabase Postgres schema with the money logic enforced in the data layer, not just the UI.",
    result: "Buying credits, crediting the wallet, and spending them all run automatically end to end. Live in production.",
    stack: ["Next.js / TypeScript", "Supabase / Postgres", "PayPal + GCash APIs", "Webhooks"],
  },
];

function SystemsShowcase() {
  const [i, setI] = useState(0);
  const s = SYSTEMS[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {SYSTEMS.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.title}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 168, textAlign: "left", cursor: "pointer",
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}` }}>
              <s.Icon size={20} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{s.title}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.tag}</div>
            </div>
          </div>

          <Row label="The manual work" body={s.problem} color={C.muted} />
          <Row label="What I built" body={s.build} color={s.color} />
          <Row label="The result" body={s.result} color={C.green} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            {s.stack.map((t) => (
              <span key={t} style={{ fontSize: 11.5, fontWeight: 700, color: C.sub, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 11px" }}>
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Row({ label, body, color }: { label: string; body: string; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color, marginBottom: 4 }}>{label}</div>
      <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0 }}>{body}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Engineering stack
const STACK = [
  { Icon: Braces, title: "Languages", body: "Python for automation, scraping, and data work. JavaScript and TypeScript for full stack and integrations.", color: C.blue },
  { Icon: Search, title: "Scraping + capture", body: "Scrapy, Selenium, and Playwright for static, dynamic, and JS heavy sources, with anti block handling.", color: C.cyan },
  { Icon: Server, title: "APIs + integration", body: "REST and GraphQL, webhooks, and third party APIs wired together, with auth, retries, and idempotency.", color: C.green },
  { Icon: Database, title: "Databases", body: "Postgres and Supabase for relational and app data, MongoDB for flexible documents. Schema and ETL design.", color: C.amber },
  { Icon: Cloud, title: "Cloud + deploy", body: "AWS and Azure, scheduled jobs, and serverless so automations run on their own without a machine left on.", color: C.coral },
  { Icon: Bot, title: "AI + LLM APIs", body: "LLM APIs for classification, extraction, and generation built into pipelines where they replace real judgment work.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// 3. Process
const PROCESS = [
  { Icon: Search, title: "Understand the manual process", body: "I map exactly what a person does today, step by step, and find where the time and the errors actually are.", color: C.blue },
  { Icon: PenTool, title: "Design the system", body: "I design the flow, the data model, and the integrations before writing code, so the build has a shape and can scale.", color: C.cyan },
  { Icon: Wrench, title: "Build and integrate", body: "I write the scripts and connect the APIs, databases, and platforms into one system that does the work end to end.", color: C.green },
  { Icon: ShieldCheck, title: "Test and harden", body: "Retries, idempotency, edge cases, and monitoring, so it holds up in production and does not fail silently.", color: C.amber },
  { Icon: Rocket, title: "Ship, document, monitor", body: "I ship it, document it in plain language, and set it up to run and be watched, so it keeps working without me.", color: C.coral },
];

// ─────────────────────────────────────────────────────────────
// 4. Secure work readiness
const SECURE = [
  { Icon: Lock, title: "NDA and confidentiality ready", body: "Comfortable signing an NDA and following your confidentiality and security policies from day one." },
  { Icon: Cpu, title: "Dedicated, spec compliant machine", body: "A dedicated work computer that meets and exceeds the stated hardware requirements. Specs screenshot attached." },
  { Icon: Gauge, title: "Stable, fast connection", body: "A stable connection above the 50 Mbps minimum, with backup. Speed test attached with the application." },
  { Icon: ShieldCheck, title: "Secure workspace + monitoring", body: "A private, secure workspace with no unauthorized access, and fine working under your monitoring tools." },
];

// ─────────────────────────────────────────────────────────────
export default function AutomationEngineerSystems() {
  const heroStats = useMemo(
    () => [
      { k: "Experience", v: "Senior, systems level" },
      { k: "Core", v: "Python · APIs · AI" },
      { k: "Systems", v: "Shipped in production" },
      { k: "Built", v: "With Claude Code" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.blue, background: "rgba(59,130,246,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.blue }}>
            <Workflow size={15} /> AI automation engineer · senior programmer
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            I take an idea and turn it into a system
            <span style={{ color: C.blue }}> that replaces the manual work.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            This is not a junior programming role, and I am not applying as one. I connect APIs, build automation
            workflows, and use AI to replace repetitive work with systems that run on their own. Below are real systems
            I have shipped, the stack I build them with, and how I go from a rough idea to something in production.
            Click through the systems.
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

        <Section eyebrow="Systems I've shipped" title="Real automation, built end to end" sub="Four systems I designed and built, each replacing work that used to be done by hand. Tap each one for the problem, the build, the result, and the stack.">
          <SystemsShowcase />
        </Section>

        <Section eyebrow="The stack" title="What I build with" sub="The tools I reach for. I match the tool to the problem rather than forcing one, and I build so the system keeps running without me watching it.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {STACK.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${v.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <v.Icon size={18} color={v.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{v.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{v.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="How I work" title="From an idea to a working system" sub="You want someone who can take an idea and make it real. This is the path I run every time, and it is why the systems hold up once they ship.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {PROCESS.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${f.color}`, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: f.color }}>{i + 1}</span>
                  </div>
                  <f.Icon size={17} color={f.color} />
                  <span style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{f.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{f.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Security readiness callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 28, background: "rgba(59,130,246,0.07)", border: `1px solid ${C.blue}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
            <ShieldCheck size={17} color={C.blue} />
            <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>Set up for secure, confidential work</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: "0 0 16px", maxWidth: 760 }}>
            You noted this is a sensitive role with real security requirements. I am already set up to meet them.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
            {SECURE.map((f) => (
              <div key={f.title} style={{ display: "flex", gap: 10 }}>
                <f.Icon size={16} color={C.blue} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: C.ink, marginBottom: 2 }}>{f.title}</div>
                  <p style={{ fontSize: 12.5, color: C.sub, margin: 0, lineHeight: 1.5 }}>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="Proof" title="Automation running in production" sub="Screenshots from a live account where I built and run the operational automation, the pipelines and workflows that move work through without a person pushing it.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="A documented library of automation workflows, each replacing a manual step." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Workflows firing automatically as a record moves through its stages." />
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Multi stage pipelines, the structured backbone the automation runs on." />
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="Work moving through stages on its own, from first touch to done." />
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
            <Terminal size={18} color={C.blue} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>I build systems that actually run.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 740 }}>
            You are looking for someone who can solve problems, design systems, and replace manual work, not a junior
            writing scripts to spec. That is how I work. I built this page itself with Claude Code. I think in systems,
            I explain them in plain language, and I ship things that keep working after I hand them over.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.blue, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Full time · long term · remote</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Proof (real operational automation screenshots)
function ProofShot({ src, caption }: { src: string; caption: string }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      {err ? (
        <div style={{ height: 200, display: "grid", placeItems: "center", background: C.bg2, color: C.muted, fontSize: 12.5, textAlign: "center", padding: "0 20px" }}>
          Screenshot from a live production account
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
