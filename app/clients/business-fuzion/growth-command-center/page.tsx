"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Rocket, Megaphone, LayoutTemplate, Repeat,
  GitBranch, Star, BarChart3, Share2, Target, Workflow, Search,
  DollarSign, Percent, Users, FlaskConical, CheckCircle2, Clock, PhoneCall, Terminal,
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
// 1. The growth loop (interactive)
type Step = { Icon: typeof Rocket; title: string; tag: string; detail: string; color: string };
const STEPS: Step[] = [
  { Icon: Megaphone, title: "Attract", tag: "Paid ads + SEO", color: C.rose,
    detail: "Paid campaigns on Facebook, Instagram, Google, and YouTube bring cold traffic, while SEO and Google Business Profile pull in the people already searching. Two doors into the same funnel." },
  { Icon: LayoutTemplate, title: "Capture", tag: "Funnels + landing pages", color: C.amber,
    detail: "That traffic hits a GoHighLevel funnel or landing page built to convert, with forms and surveys that qualify the lead before it ever reaches a human." },
  { Icon: Repeat, title: "Nurture", tag: "Workflows, email, SMS", color: C.coral,
    detail: "GHL workflows fire the follow up: email and SMS sequences, speed to lead, and conversation management that keeps every prospect warm until they are ready." },
  { Icon: GitBranch, title: "Convert", tag: "Pipelines + opportunities", color: C.green,
    detail: "Leads move through a pipeline stage by stage, opportunities are managed and tagged, and nothing stalls because the automation chases what the team would otherwise forget." },
  { Icon: Star, title: "Retain", tag: "Reputation + membership", color: C.purple,
    detail: "Reputation management asks happy clients for reviews automatically, and membership areas keep customers engaged, so growth compounds instead of leaking." },
  { Icon: BarChart3, title: "Report", tag: "Analytics + optimize", color: C.cyan,
    detail: "Reporting ties it together: ad performance, funnel conversion, and SEO rankings in one view, so every next decision is backed by data, not a guess." },
];

function GrowthLoop() {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {STEPS.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.title}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 142, textAlign: "left", cursor: "pointer",
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
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{s.title}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: s.color, marginTop: 2 }}>
                <Rocket size={12} /> {s.tag}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{s.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Four disciplines
const PILLARS = [
  { Icon: Share2, title: "Social media", body: "Monthly content strategy, engaging posts, scheduling, and community management, tuned by what the analytics actually show.", color: C.blue },
  { Icon: Target, title: "Paid advertising", body: "Facebook, Instagram, Google, and YouTube campaigns planned, launched, and optimized against ROAS and cost per lead, not vanity metrics.", color: C.rose },
  { Icon: Workflow, title: "GoHighLevel", body: "Advanced GHL across funnels, sites, pipelines, workflows, reputation, memberships, snapshots, and integrations. No training required.", color: C.coral },
  { Icon: Search, title: "SEO", body: "On page, technical, and local SEO, Google Business Profile, site audits, Search Console, and rank tracking to grow organic visibility.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// 3. GHL capability grid
const GHL_FEATURES = [
  "Funnels", "Websites", "Landing Pages", "Forms & Surveys", "Calendars",
  "Pipelines", "Opportunities", "Workflow Automations", "Email Marketing",
  "SMS Marketing", "Conversations", "Reputation", "Membership Areas",
  "Snapshots", "CRM Management", "Lead Nurturing", "Reporting", "AI Tools",
  "Integrations", "Troubleshooting",
];

// ─────────────────────────────────────────────────────────────
// 4. Paid ads framework
const AD_METRICS = [
  { Icon: DollarSign, title: "ROAS and CPL", body: "Every campaign is judged on return on ad spend and cost per lead, the numbers that decide whether to scale or cut.", color: C.green },
  { Icon: Target, title: "Structure and targeting", body: "Clean campaign structure, sharp audiences, and pixel and conversion tracking set up before a dollar is spent.", color: C.rose },
  { Icon: Repeat, title: "Retargeting", body: "Warm traffic is followed, not forgotten. Retargeting sequences bring back the people who did not convert first time.", color: C.coral },
  { Icon: FlaskConical, title: "A/B testing", body: "Creatives, audiences, and offers tested against each other, so budget flows to what wins and away from what does not.", color: C.amber },
  { Icon: Percent, title: "Budget optimization", body: "Spend rebalanced as the data comes in, so the best performing campaigns get fed and the weak ones get pruned.", color: C.purple },
  { Icon: Users, title: "Lead gen and reporting", body: "The point of it all is qualified leads, tracked end to end and reported in plain numbers you can act on.", color: C.blue },
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
export default function BusinessFuzionGrowthCenter() {
  const heroStats = useMemo(
    () => [
      { k: "GHL since", v: "2019" },
      { k: "Disciplines", v: "GHL · Ads · SEO · Social" },
      { k: "Level", v: "Advanced, no training" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.coral, background: "rgba(251,146,60,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.coral }}>
            <Rocket size={15} /> Growth marketing command center
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            GHL, paid ads, SEO, and social,
            <span style={{ color: C.coral }}> owned by one specialist.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            You asked for an advanced GoHighLevel specialist who also runs paid ads, SEO, and social, for Business
            Fuzion and your clients. Rather than list it back, I built the growth engine those four disciplines
            add up to, with the GHL work I do every day at the center of it. Click through it.
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

        <Section eyebrow="The growth loop" title="How the four disciplines become one engine" sub="Attract, capture, nurture, convert, retain, report. Each stage is a discipline you listed, wired into the next. Tap through it.">
          <GrowthLoop />
        </Section>

        <Section eyebrow="The disciplines" title="Four skill sets, one owner" sub="You wanted one specialist across all of it, not four freelancers to coordinate. Here is each, and how I run it.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
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

        <Section eyebrow="Advanced GHL" title="The full GoHighLevel stack, no training needed" sub="You said this is not entry level and I should not need training. Here is the GHL surface I work across every day.">
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px 20px", display: "flex", flexWrap: "wrap", gap: 9 }}>
            {GHL_FEATURES.map((f) => (
              <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: C.ink, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "7px 13px" }}>
                <CheckCircle2 size={13} color={C.coral} /> {f}
              </span>
            ))}
          </div>
        </Section>

        <Section eyebrow="Paid advertising" title="How I run and report on ad spend" sub="The framework every campaign runs through. Real campaign results, ROAS, CPL, and leads, are in my application to you.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {AD_METRICS.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <a.Icon size={18} color={a.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{a.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{a.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Proof" title="Advanced GHL, already built" sub="Screenshots from a live GoHighLevel account I built and run, the same advanced GHL work this role is centered on.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Three live pipelines including a nine stage inquiry pipeline, the backbone of opportunities management." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Seven published workflows firing stage by stage, the lead nurturing engine in action." />
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="The workflow library organized into folders, with an intake router and a booking to pipeline automation." />
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="The opportunities board, contacts moving from first contact to approved across the pipeline." />
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
            <Terminal size={18} color={C.coral} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Built with Claude Code, and BVN is just me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            This whole page, the growth loop and all, I built with Claude Code. That is how I work across GHL, ads,
            SEO, and social: one person who owns the whole engine, moves fast, builds with minimal supervision, and
            reports in numbers. Exactly the specialist your first 90 days describe.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Full time, in Slack daily</span>
        </div>
      </div>
    </div>
  );
}
