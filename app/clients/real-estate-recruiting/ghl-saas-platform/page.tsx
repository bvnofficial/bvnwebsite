"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Building2, FileText, MessageSquare, Mail,
  Calendar, GitBranch, PhoneMissed, Repeat, LayoutDashboard, Boxes,
  Globe, Phone, ShieldCheck, Webhook, Star, Rocket, Copy, Zap, Timer,
  Sparkles, CheckCircle2, Clock, PhoneCall, ImageOff,
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

const ACCENT = C.green;

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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: ACCENT }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 680, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. The recruiting engine (what gets built per customer)
const ENGINE = [
  { Icon: Globe, name: "Recruiting sites and pages", role: "Built inside GHL, on the customer's domain", color: C.green },
  { Icon: FileText, name: "Lead capture forms", role: "Recruit forms and surveys wired to tags", color: C.cyan },
  { Icon: MessageSquare, name: "SMS follow up", role: "Speed to lead and long term nurture", color: C.amber },
  { Icon: Mail, name: "Email automation", role: "Sequences on a real sending domain", color: C.blue },
  { Icon: GitBranch, name: "Recruiting pipelines", role: "Enquiry to interview to signed agent", color: C.purple },
  { Icon: Calendar, name: "Booking and reminders", role: "Interviews scheduled, no shows chased", color: C.rose },
  { Icon: PhoneMissed, name: "Missed call automations", role: "Text back so no recruit goes cold", color: C.coral },
  { Icon: Repeat, name: "Database reactivation", role: "Wake up old recruit lists on demand", color: C.green },
  { Icon: LayoutDashboard, name: "Dashboards and sources", role: "Lead flow and source tracking per team", color: C.cyan },
];

function EngineGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
      {ENGINE.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
          style={{ display: "flex", alignItems: "center", gap: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}`, flexShrink: 0 }}>
            <s.Icon size={17} color={s.color} />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: C.ink }}>{s.name}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, lineHeight: 1.35 }}>{s.role}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. The recruit's journey (interactive)
type Step = { n: string; title: string; from: string; to: string; mech: string; detail: string; color: string };

const JOURNEY: Step[] = [
  {
    n: "01", title: "Recruit shows interest", from: "Recruiting page", to: "GHL contact", mech: "Form to tag",
    detail: "A prospective agent lands on a recruiting site or landing page built inside GoHighLevel, on the customer's own domain, and submits a form. The contact is created, tagged by source, and dropped into the recruiting pipeline the moment they hit send.",
    color: C.green,
  },
  {
    n: "02", title: "Speed to lead", from: "New contact", to: "Instant SMS", mech: "Trigger and A2P",
    detail: "An automation fires the first text within seconds over an A2P registered number, because a recruit who hears back immediately is worth several who hear back tomorrow. Missed call text back covers anyone who rings the office and gets voicemail.",
    color: C.amber,
  },
  {
    n: "03", title: "Qualify and book", from: "Two way SMS", to: "Calendar", mech: "AI chat and booking",
    detail: "GHL AI chat handles the back and forth, answers the common questions, qualifies interest, and books an intro call straight onto the recruiter's calendar. Confirmation and reminder sequences then cut the no show rate.",
    color: C.cyan,
  },
  {
    n: "04", title: "Long term nurture", from: "Not ready yet", to: "Paced sequence", mech: "Workflow by tag",
    detail: "Most agents do not switch teams the week you meet them. A long term nurture sequence over SMS and email keeps the customer top of mind for months, paced by tag and behavior, until the recruit is ready to move.",
    color: C.purple,
  },
  {
    n: "05", title: "Pipeline to signed", from: "Interview", to: "Onboarding", mech: "Stage automations",
    detail: "The recruiting pipeline moves from enquiry through interview to offer to signed, and each stage change fires the right action: a task for the recruiter, a status text to the recruit, an internal alert. The board is a live picture, not a chore.",
    color: C.rose,
  },
  {
    n: "06", title: "Reactivate the list", from: "Old recruits", to: "New conversations", mech: "Batch campaign",
    detail: "The recruits who said not now are an asset, not a dead list. A controlled reactivation campaign wakes them up in batches, routes warm replies to a human, and quietly refills the pipeline from leads the customer already paid to generate.",
    color: C.coral,
  },
];

function Journey() {
  const [i, setI] = useState(0);
  const s = JOURNEY[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
        {JOURNEY.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.n}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, textAlign: "left", cursor: "pointer", width: 150,
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: st.color }}>{st.n}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 4, lineHeight: 1.3 }}>{st.title}</div>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={s.n}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${s.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: s.color, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px" }}>{s.from}</span>
            <ArrowRight size={15} color={C.muted} />
            <span style={{ fontSize: 13, fontWeight: 800, color: C.ink, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px" }}>{s.to}</span>
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: C.sub, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 11px" }}>
              <Zap size={12} /> {s.mech}
            </span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 6 }}>{s.title}</div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{s.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. SaaS onboarding model (interactive) — answers "100 teams without rebuilding"
type SaasStep = { n: string; title: string; old: string; now: string; detail: string; color: string; Icon: typeof Boxes };

const SAAS: SaasStep[] = [
  { n: "01", title: "Build the master once", old: "Rebuild per customer", now: "One reference account", color: C.green, Icon: Building2,
    detail: "The full recruiting system is built once, to a strict naming convention, in a master account: pipelines, workflows, forms, sites, calendars, and dashboards. This is the only account that gets built by hand." },
  { n: "02", title: "Capture the snapshot", old: "Copy paste by hand", now: "Versioned snapshot", color: C.cyan, Icon: Copy,
    detail: "The master is captured as a GoHighLevel snapshot and versioned. Every improvement lives here, so the platform has one source of truth instead of forty drifting copies." },
  { n: "03", title: "Spin the sub account", old: "A day of clicking", now: "SaaS mode load", color: C.amber, Icon: Boxes,
    detail: "A new customer gets a sub account created through SaaS configuration with the snapshot loaded. The whole recruiting system lands in the account in minutes, already wired." },
  { n: "04", title: "Auto configure the account", old: "Manual setup each time", now: "Onboarding automation", color: C.purple, Icon: Rocket,
    detail: "An onboarding automation and API calls set the customer's phone number and A2P, their sending domain and DNS, branding, and users from a short intake. Configuration, not construction." },
  { n: "05", title: "Their brand, their numbers", old: "Shared and messy", now: "Isolated per tenant", color: C.rose, Icon: ShieldCheck,
    detail: "The customer logs into their own sub account with their domain, their phone numbers, and their dashboard, fully isolated from every other team on the platform." },
  { n: "06", title: "Improve once, push to all", old: "Fix forty times", now: "Snapshot update", color: C.coral, Icon: Zap,
    detail: "When the system gets better, the improvement is made once in the master, re snapshotted, and pushed out. That is how onboarding customer one hundred stays a few hours of configuration, not a rebuild." },
];

function SaasFlow() {
  const [i, setI] = useState(0);
  const s = SAAS[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
        {SAAS.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.n}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, textAlign: "left", cursor: "pointer", width: 156,
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <st.Icon size={14} color={st.color} />
                <div style={{ fontSize: 12, fontWeight: 800, color: st.color }}>{st.n}</div>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 5, lineHeight: 1.3 }}>{st.title}</div>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={s.n}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${s.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 12 }}>{s.title}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.muted, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 11px", textDecoration: "line-through" }}>
              <Timer size={12} /> {s.old}
            </span>
            <ArrowRight size={15} color={C.muted} style={{ alignSelf: "center" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: s.color, background: "rgba(255,255,255,0.03)", border: `1px solid ${s.color}`, borderRadius: 8, padding: "6px 11px" }}>
              <Zap size={12} /> {s.now}
            </span>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{s.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Infrastructure they listed (mastery, not buzzwords)
const INFRA = [
  { Icon: Phone, title: "A2P 10DLC and LC Phone", body: "Brand and campaign registration, LC Phone and Twilio number setup, and the messaging compliance that keeps texts landing instead of getting filtered.", color: C.green },
  { Icon: Mail, title: "Email sending domains", body: "Dedicated sending domains with SPF, DKIM, and DMARC set correctly, so recruiting email reaches the inbox and the domain reputation stays clean.", color: C.cyan },
  { Icon: Globe, title: "Domains, DNS, and SSL", body: "Custom domains connected to funnels and sites, DNS records managed, SSL verified. The unglamorous plumbing that has to be right every time.", color: C.blue },
  { Icon: Boxes, title: "Snapshots and SaaS config", body: "Reusable snapshots, SaaS mode setup, rebilling, and sub account templates, so the platform deploys as a product and not a series of favors.", color: C.amber },
  { Icon: Webhook, title: "Webhooks, APIs, Zapier, Make", body: "Two way webhooks, the GoHighLevel API for programmatic setup, and Zapier or Make where a no code link is the right tool for the job.", color: C.purple },
  { Icon: Star, title: "Reputation management", body: "Review request automations that ask at the right moment and route happy replies to Google, so customers grow their standing without lifting a finger.", color: C.rose },
];

// ─────────────────────────────────────────────────────────────
// 5. Proof gallery (real GHL screenshots, graceful fallback)
const PROOF = [
  { src: "/proof/regal-01-workflow-library.png", cap: "A real workflow library built and named to a convention inside a live GoHighLevel account" },
  { src: "/proof/regal-04-pipelines-list.png", cap: "Pipelines built to spec inside a real sub account" },
  { src: "/proof/regal-05-opportunities-kanban.png", cap: "Opportunity board tracking leads from enquiry through to approved" },
  { src: "/proof/regal-02-family-workflows.png", cap: "Published workflows across a full client journey" },
];

function ProofTile({ src, cap }: { src: string; cap: string }) {
  const [err, setErr] = useState(false);
  return (
    <figure style={{ margin: 0, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      {err ? (
        <div style={{ display: "grid", placeItems: "center", height: 172, background: C.bg2, borderBottom: `1px solid ${C.border}`, gap: 8 }}>
          <ImageOff size={22} color={C.muted} />
          <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 700, letterSpacing: 0.4 }}>Screenshot from a live GHL account</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={cap} loading="lazy" onError={() => setErr(true)} style={{ width: "100%", display: "block", borderBottom: `1px solid ${C.border}` }} />
      )}
      <figcaption style={{ fontSize: 12.5, color: C.sub, padding: "10px 12px", lineHeight: 1.4 }}>{cap}</figcaption>
    </figure>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. Real builds behind this
const BUILDS = [
  { name: "Custom two way sync, the hard bug", color: C.coral,
    body: "My most complicated build. An AI booking flow created appointments but silently never created the opportunity in the customer's field service platform, because no native app existed. I traced it backward from the missing outcome, built a custom Node and Python webhook relay both directions, and added visible error handling so a silent failure could never hide again.",
    tags: ["Webhooks", "API", "Error handling"] },
  { name: "Agency scale across many sub accounts", color: C.cyan,
    body: "Real work across a 34 sub account agency: snapshots, SaaS configuration, A2P and deliverability, custom fields versus custom values, and a naming convention that keeps dozens of accounts maintainable. Deploying a system across many accounts is the daily job, not a theory.",
    tags: ["Snapshots", "SaaS mode", "Multi sub account"] },
  { name: "Recruiting site built in GHL", color: C.green,
    body: "prospectmarketingco.com is a live site I built, the kind of GoHighLevel native site and funnel work this platform needs, connected to a domain with capture forms feeding straight into the CRM.",
    tags: ["GHL sites", "Funnels", "Domains"] },
];

// ─────────────────────────────────────────────────────────────
export default function RealEstateRecruitingSaas() {
  const heroStats = useMemo(
    () => [
      { k: "On GoHighLevel", v: "since 2018" },
      { k: "New customer", v: "config, not rebuild" },
      { k: "Agency scale", v: "34 sub accounts" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: ACCENT, background: "rgba(52,211,153,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: ACCENT }}>
            <Building2 size={15} /> Real Estate Recruiting · GoHighLevel SaaS
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Build the recruiting system once.
            <span style={{ color: ACCENT }}> Deploy it to a hundred teams.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You want a subscription recruiting platform on GoHighLevel that real estate teams pay for every month,
            built once and rolled out across many sub accounts without rebuilding each one by hand. That is a
            snapshot and SaaS problem, and it is what I do. You asked for a video, so here is something better:
            click through the actual system, and see real screenshots from a live account further down.
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

        <Section eyebrow="The engine" title="What each customer account gets" sub="This is the recruiting system, the thing a real estate team logs into and pays for. Every piece is native GoHighLevel, built to a convention so it stays clean at scale.">
          <EngineGrid />
        </Section>

        <Section eyebrow="The recruit" title="Follow one recruit from click to signed" sub="Click each step. This is the lifecycle the platform runs for every customer, from a prospective agent filling in a form to a signed recruit, with the not ready ones nurtured and reactivated instead of lost.">
          <Journey />
        </Section>

        <Section eyebrow="Screening Q8" title="Onboarding customer one hundred without rebuilding" sub="You asked how I would structure this so a hundredth real estate team is not a hundredth rebuild. Step through it. The struck through line is the manual way, the lit line is how a snapshot and SaaS platform actually does it.">
          <SaasFlow />
        </Section>

        <Section eyebrow="Infrastructure" title="The plumbing you listed, done not just read about" sub="Your requirements list is long and specific for a reason. Here is where I stand on each part of it, because on a SaaS platform the boring infrastructure is what breaks at scale if it is done by someone who has only watched tutorials.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {INFRA.map((g, i) => (
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

        <Section eyebrow="Not a mockup" title="Real screenshots from a live GoHighLevel account" sub="These are from a real client build, shared with permission and with private data kept out. Workflows, pipelines, and an opportunity board, built and named by me inside a live account.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {PROOF.map((p) => (
              <ProofTile key={p.src} src={p.src} cap={p.cap} />
            ))}
          </div>
        </Section>

        <Section eyebrow="The record" title="Real builds behind all of this" sub="Client names stay private unless a client clears it. Each of these is real, live, and mine end to end, which is the difference between someone who has built platforms and someone who has watched videos about them.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {BUILDS.map((b, i) => (
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
            <Sparkles size={18} color={ACCENT} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>You wanted someone who takes ownership. That is the whole model here.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 740 }}>
            BVN is not an agency. It is one person, me, and the person you interview is the person who builds it,
            tests it, and improves it. Tell me the outcome you want and I will tell you how I would build it inside
            GoHighLevel, then go build it. No junior handoff, no waiting on a team, no spec needed for every step.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: ACCENT, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
            <a href="/intro" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
              Watch my intro <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <CheckCircle2 size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> WhatsApp +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Full time, overlaps your hours daily</span>
        </div>
      </div>
    </div>
  );
}
