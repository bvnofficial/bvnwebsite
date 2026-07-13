"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Building2, Bot, Database, ShoppingCart,
  CreditCard, Globe, Zap, Terminal, Clock, PhoneCall, CheckCircle2,
  Heart, Code2, Workflow, Cpu, Server, Sparkles, User,
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
// Projects (interactive) — all real, all built by me
type Project = {
  Icon: typeof Building2; title: string; tag: string; color: string;
  what: string; role: string;
};
const PROJECTS: Project[] = [
  {
    Icon: Building2, title: "TeamTitans", tag: "UK real estate company", color: C.blue,
    what: "A UK real estate company I built everything for from scratch: the systems, the site, the automations, and a live webinar I set up and ran. Not a piece of a project handed to me, the whole thing.",
    role: "Sole builder. I took it from nothing to a working, running operation, and delivered a live client-facing webinar on top.",
  },
  {
    Icon: Bot, title: "AI job pipeline", tag: "Python · LLM · Slack · cloud", color: C.green,
    what: "A pipeline in Python that scrapes job listings on a schedule, runs each one through a large language model to classify and score the fit, and routes the strong matches into Slack. It runs in the cloud on its own, even when my computer is off.",
    role: "Designed and built it end to end: the scrapers, the LLM classification prompts, the Slack delivery, and the cloud schedule. This is the system that surfaces the roles I apply to.",
  },
  {
    Icon: Database, title: "Regal Senior Living", tag: "GoHighLevel CRM", color: C.rose,
    what: "A full GoHighLevel CRM system: pipelines, published follow up workflows, an intake and routing workflow library, and an opportunities board that moves contacts from first touch to won.",
    role: "Sole builder. I set up the CRM structure, built and published the automations, and documented it so the team can run it.",
  },
  {
    Icon: ShoppingCart, title: "X-1R storefront", tag: "E-commerce", color: C.amber,
    what: "A delivered e-commerce storefront build, product catalog, and the customer-facing shopping experience, live and in use.",
    role: "Built and delivered the storefront for the client end to end.",
  },
  {
    Icon: CreditCard, title: "Payments & credits wallet", tag: "Supabase · Stripe · PayMongo", color: C.purple,
    what: "A working payments and credits wallet on my own website: a credits balance, top ups, and multiple live payment methods including cards, GCash, and bank direct debit, with the database schema and logic behind it.",
    role: "Designed the schema, built the wallet logic, and integrated the payment providers and checkout myself.",
  },
  {
    Icon: Globe, title: "This website + demos", tag: "Next.js · Claude Code", color: C.cyan,
    what: "www.bvnofficial.com and its interactive client demo pages, built in Next.js and React. Each demo, like this page, is a tailored, animated walkthrough of a real system.",
    role: "Built the whole site and every demo myself, with Claude Code as my tool. Designed, coded, and deployed.",
  },
];

function Projects() {
  const [i, setI] = useState(0);
  const p = PROJECTS[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {PROJECTS.map((pr, idx) => {
          const on = idx === i;
          return (
            <button
              key={pr.title}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 158, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? pr.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <pr.Icon size={16} color={pr.color} />
              <div style={{ fontSize: 12.5, fontWeight: 800, color: on ? C.ink : C.sub, marginTop: 6, lineHeight: 1.25 }}>{pr.title}</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: pr.color, marginTop: 3 }}>{pr.tag}</div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${p.color}` }}>
              <p.Icon size={20} color={p.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{p.title}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginTop: 2 }}>{p.tag}</div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: "0 0 12px" }}>{p.what}</p>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <User size={15} color={p.color} style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: p.color, textTransform: "uppercase", letterSpacing: 0.6 }}>My role</div>
              <p style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.55, margin: "3px 0 0" }}>{p.role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stack
const STACK = [
  { Icon: Code2, title: "Languages", body: "Python and JavaScript and TypeScript, for scripts, backends, and full applications.", color: C.blue },
  { Icon: Workflow, title: "Automation", body: "GoHighLevel, Make, Zapier, and n8n, plus custom code where a workflow tool is not enough.", color: C.green },
  { Icon: Cpu, title: "AI and LLMs", body: "OpenAI and Claude APIs for classification, assistants, and AI powered automations.", color: C.purple },
  { Icon: Server, title: "Data and cloud", body: "PostgreSQL, Supabase, and MongoDB, deployed on AWS, Azure, and Vercel.", color: C.amber },
  { Icon: Globe, title: "Web", body: "React and Next.js front ends, plus WordPress and Duda for content sites.", color: C.cyan },
  { Icon: CreditCard, title: "Integrations", body: "REST and GraphQL APIs, webhooks, and payment providers wired together and tested.", color: C.rose },
];

// ─────────────────────────────────────────────────────────────
export default function HowIBuildExperience() {
  const heroStats = useMemo(
    () => [
      { k: "Agency?", v: "No, one person" },
      { k: "Built by", v: "Me, end to end" },
      { k: "Range", v: "Automation to apps" },
      { k: "Tooling", v: "Claude Code" },
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
            Development experience
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.blue }}>
            <Sparkles size={15} /> Benjamin Yson · developer and automation engineer
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.07, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            I am not an agency.
            <span style={{ color: C.blue }}> I built all of this myself.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            Everything you are about to see, the systems, the automations, the apps, and this site itself, was built by
            one person, from the idea to the deployed result. No team to hand your project to, no account manager in the
            middle. When you work with me, you work with the person writing the code. Here are real projects and my
            exact role in each.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((s) => (
              <div key={s.k}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{s.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="Real projects" title="What I have built, and my role in each" sub="Not stock examples. These are systems I built and shipped. Tap through them.">
          <Projects />
        </Section>

        {/* Recently enjoyed — answers the interview question */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 40, background: "rgba(52,211,153,0.07)", border: `1px solid ${C.green}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Heart size={18} color={C.green} />
            <span style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>A project I recently enjoyed, and why</span>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.65, margin: "0 0 12px", maxWidth: 780 }}>
            The one I keep coming back to is my AI job pipeline. I was spending real time reading through job listings by
            hand, so I built a system to do it for me. Python scrapers pull new listings on a schedule, a large language
            model reads each one and scores how well it fits, and the strong matches get pushed into Slack. It runs in
            the cloud on its own, so it keeps working even when my computer is off.
          </p>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.65, margin: 0, maxWidth: 780 }}>
            I enjoyed it because it is the whole job in one build: scraping, an API integration, real LLM prompt
            engineering to get the classification right, a messaging integration, and a cloud deployment, all solving an
            actual problem I had. It is the clearest example of how I think. I see a manual, repetitive task, and I turn
            it into a system that runs itself.
          </p>
        </motion.div>

        <Section eyebrow="The stack" title="What I build with" sub="Matched to the job rather than forcing one tool. No-code where it is fastest, custom code where it matters.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {STACK.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <s.Icon size={18} color={s.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{s.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{s.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Proof" title="A live system, up close" sub="Screenshots from the live GoHighLevel account behind the Regal Senior Living build, so the work is real, not described.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="A documented workflow library inside a live GoHighLevel account." />
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Pipelines built to move contacts from first touch to won." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published automations firing on their own." />
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="The opportunities board in day to day use." />
          </div>
        </Section>

        {/* Close */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Terminal size={18} color={C.blue} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>One person, from the idea to the deploy.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 740 }}>
            That is the thread through all of it. I do not hand your work to a junior or a team. I understand the
            problem, design the system, write the code, and ship it, and I document it so you are never stuck. I built
            this page the same way, with Claude Code as my tool.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.blue, borderRadius: 999, padding: "10px 16px" }}>
              Full portfolio and CV <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <CheckCircle2 size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Zap size={13} /> Built end to end</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Proof (real GHL screenshots)
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
