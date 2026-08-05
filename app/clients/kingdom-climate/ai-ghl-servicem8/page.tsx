"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Wind, Zap, Bot, PhoneMissed, CalendarCheck,
  FileText, Repeat, Star, Database, Workflow, PhoneCall, Clock,
  CheckCircle2, Terminal, Megaphone, Wrench, GitBranch, BarChart3,
  MessageSquare, Snowflake,
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
// 1. Lead to job flow (interactive)
type Step = { Icon: typeof Wind; title: string; trigger: string; detail: string; color: string };
const STEPS: Step[] = [
  { Icon: Megaphone, title: "Lead captured", trigger: "Every source", color: C.cyan,
    detail: "Google Ads, Meta, website forms, landing pages, Google Business Profile, phone calls and referrals all land in one place as a tagged contact, with the lead source recorded. Nothing lives in a separate inbox or a notepad. If it came in, it is in the CRM, attributed." },
  { Icon: Zap, title: "Instant response", trigger: "Speed to lead", color: C.blue,
    detail: "The moment a lead arrives, an automated reply goes out by SMS and email within seconds. In HVAC the first business to reply usually wins the quote, so speed to lead is not a nice to have, it is the single biggest lever on booking rate, and it runs day and night." },
  { Icon: Bot, title: "AI responds and qualifies", trigger: "Conversation", color: C.purple,
    detail: "An AI conversation agent replies in your brand voice, answers the common questions, and qualifies the job: ducted, split, multi-split or heat pump hot water, the property, and the urgency. Only genuine jobs reach your calendar, so your time is spent on real quotes." },
  { Icon: CalendarCheck, title: "Books the site visit", trigger: "Qualified", color: C.green,
    detail: "A qualified lead is booked straight into the calendar for a quote or site visit, with confirmations and reminders by SMS and email so no-shows drop. The booking is what triggers the job on the operations side." },
  { Icon: PhoneMissed, title: "No answer and missed call", trigger: "Never dropped", color: C.amber,
    detail: "A missed call is texted back automatically so the lead is not lost to a competitor who picked up. No-answer follow-up sequences keep working a lead who did not respond the first time, across SMS and email, until they book or opt out." },
  { Icon: FileText, title: "Quote follow-up", trigger: "Until decided", color: C.coral,
    detail: "Quotes that are sent but not yet accepted are chased on a timed sequence, because most quotes are lost to silence, not to a no. The follow-up runs itself so a quote is never forgotten on a busy install week." },
  { Icon: Wrench, title: "Job in ServiceM8", trigger: "On booking", color: C.rose,
    detail: "When the job is won, it flows to ServiceM8 for scheduling, dispatch, the install workflow and invoicing. ServiceM8 stays the operations hub, and the handoff from CRM to job management is clean and automatic rather than retyped." },
  { Icon: Star, title: "Review request", trigger: "On completion", color: C.amber,
    detail: "When ServiceM8 marks the job complete, a review request fires automatically to the customer at the moment they are happiest, the day the aircon is running. Reviews are the cheapest lead source in home service, so this loop is built in." },
  { Icon: Repeat, title: "Reactivation", trigger: "Ongoing", color: C.green,
    detail: "Lost leads and past customers are worked automatically: old quotes revisited, and past installs reminded about servicing, filters, and the hot water or heating season. The database you already have becomes a recurring lead source instead of a dead list." },
];

function LeadFlow() {
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
                flexShrink: 0, width: 150, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <st.Icon size={16} color={st.color} />
              <div style={{ fontSize: 11, fontWeight: 800, color: st.color, marginTop: 6 }}>
                {String(idx + 1).padStart(2, "0")}
              </div>
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
                <Zap size={12} /> {s.trigger}
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
// 2. What lives where (their explicit question)
const GHL_SIDE = [
  "Lead capture from every source, with lead source tracking",
  "Speed to lead, AI response and AI qualification",
  "SMS and email follow-up, nurture and reactivation",
  "Quote follow-up and no-answer sequences",
  "Missed call text-back and sales notifications",
  "Landing pages, funnels and forms",
  "Review request automation",
  "Marketing reporting, attribution and dashboards",
];
const SM8_SIDE = [
  "Job management and the install workflow",
  "Scheduling and technician dispatch",
  "On-site job cards, forms and photos",
  "Quoting the actual job and invoicing",
  "Field operations and completion",
  "The operational source of truth for jobs",
];

// ─────────────────────────────────────────────────────────────
// 3. Integration methods
const METHODS = [
  { Icon: GitBranch, title: "The right method, not a messy one", body: "ServiceM8 CRM Connector, Zapier, Make, webhooks or the API directly. I pick the cleanest reliable path for each link rather than forcing one tool on everything.", color: C.cyan },
  { Icon: Workflow, title: "A clean handoff both ways", body: "A won lead in GHL creates the job in ServiceM8. A completed job in ServiceM8 flows back to trigger reviews and follow-up in GHL. No double entry, no drift.", color: C.green },
  { Icon: Database, title: "One source of truth per thing", body: "Marketing and the customer conversation live in GHL. Jobs and operations live in ServiceM8. Each system owns what it is best at, so the setup stays clean as you grow.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
export default function KingdomClimateAiGhlServiceM8() {
  const heroStats = useMemo(
    () => [
      { k: "Built this before", v: "GHL + ServiceM8" },
      { k: "For", v: "An Australian service co" },
      { k: "Focus", v: "Speed to lead" },
      { k: "Both systems", v: "Clean, not messy" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.cyan, background: "rgba(34,211,238,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.cyan }}>
            <Snowflake size={15} /> AI-powered GoHighLevel and ServiceM8 for HVAC
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Every lead answered in seconds,
            <span style={{ color: C.cyan }}> every job handed cleanly to ServiceM8.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You asked how I would build the best AI-powered GoHighLevel system for a service business, and how I would
            connect it to ServiceM8 without a mess. I do not have to guess, because I have already built this exact
            pairing for an Australian service company. Here is the system, and how the two platforms work together.
            Click through it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((s) => (
              <div key={s.k}>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.ink }}>{s.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="The system" title="From first click to review request" sub="The full lead lifecycle for an HVAC business, built so speed to lead, follow-up, booking and conversion all run without anyone remembering to. Tap each step.">
          <LeadFlow />
        </Section>

        <Section eyebrow="What lives where" title="GoHighLevel and ServiceM8, each doing its job" sub="Your post asks exactly this, and it is the question that decides whether the setup is clean or a mess. Here is my answer.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.cyan}`, borderRadius: 14, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <MessageSquare size={18} color={C.cyan} />
                <span style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>GoHighLevel</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.cyan }}>Marketing and CRM</span>
              </div>
              {GHL_SIDE.map((x) => (
                <div key={x} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <CheckCircle2 size={15} color={C.cyan} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{x}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.rose}`, borderRadius: 14, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Wrench size={18} color={C.rose} />
                <span style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>ServiceM8</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.rose }}>Jobs and operations</span>
              </div>
              {SM8_SIDE.map((x) => (
                <div key={x} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <CheckCircle2 size={15} color={C.rose} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{x}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section eyebrow="The connection" title="How the two systems work together" sub="ServiceM8 integration is the part most people get wrong. This is how I keep it clean.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {METHODS.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <m.Icon size={18} color={m.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{m.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{m.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* I have done this exact build */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 28, background: "rgba(34,211,238,0.07)", border: `1px solid ${C.cyan}`, borderRadius: 16, padding: "20px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <GitBranch size={17} color={C.cyan} />
            <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>This is not theory. I built this exact pairing.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: "0 0 14px", maxWidth: 780 }}>
            For an Australian service business I built the full GoHighLevel system, then wrote a custom webhook relay to
            sync GoHighLevel and ServiceM8 in both directions, because the off-the-shelf options did not do what the
            business actually needed. Four pipelines, A2P SMS, an AI voice agent for inbound calls, missed call
            text-back, and review and affiliate engines, plus a live operations dashboard pulling from both the GHL and
            ServiceM8 APIs. Because I write code, when the standard connector cannot do something, I am not stuck.
          </p>
          <Link href="/clients/tintgard/workflow" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.cyan, borderRadius: 999, padding: "10px 16px" }}>
            See that live GHL + ServiceM8 build <ArrowRight size={14} />
          </Link>
        </motion.div>

        <Section eyebrow="Proof" title="Real GoHighLevel work" sub="Screenshots from a live GoHighLevel account I built and run for a service business, the same kind of CRM and automation your system would use.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="A documented workflow library inside a live GoHighLevel account." />
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Pipelines moving a lead from first contact to booked job." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published follow-up automations firing on their own." />
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
            <Terminal size={18} color={C.cyan} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>One person, and I have already built exactly this.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 750 }}>
            I am not an agency. I am one person who designs the system, builds the automations, wires the ServiceM8
            integration, sets up the AI, and trains you on it. The difference between me and most GoHighLevel people is
            that I write code, so when the platform runs out of room, I keep going. I built this page with Claude Code
            to show you how I think a system through before I touch your account.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/case-studies" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.cyan, borderRadius: 999, padding: "10px 16px" }}>
              More of my work <ArrowRight size={14} />
            </Link>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Project based</span>
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
