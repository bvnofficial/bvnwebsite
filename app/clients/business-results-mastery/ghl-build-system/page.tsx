"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Rocket, Layers, Copy, CheckCircle2, Clock,
  PhoneCall, Sparkles, Gauge, AlertTriangle, ImageOff, Wand2,
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
// 1. Build pipeline: empty account to live system (interactive)
type Stage = { n: string; title: string; detail: string; color: string };

const STAGES: Stage[] = [
  { n: "01", title: "Deploy snapshot", color: C.coral,
    detail: "Start from a proven snapshot, not a blank account, so a new client is most of the way built on day one. Your winning system becomes the baseline every time, then I tailor it." },
  { n: "02", title: "Foundation and structure", color: C.cyan,
    detail: "Sub account set up with roles, a strict naming convention, tag taxonomy, custom fields, and custom values. Get this right and the whole account stays readable and scalable." },
  { n: "03", title: "Numbers and A2P", color: C.purple,
    detail: "Twilio for SMS and calls, Mailgun and SMTP for volume email, then A2P 10DLC brand and campaign registration. I have registered brands and cleared rejections, so this does not stall a launch." },
  { n: "04", title: "Deliverability", color: C.green,
    detail: "A dedicated sending domain with SPF, DKIM, and DMARC aligned, domain warmup, and bounce and reputation monitoring. Compliance and inbox placement punish sloppiness, so this is done properly, not rushed." },
  { n: "05", title: "List hygiene", color: C.amber,
    detail: "Validate, scrub, dedupe, segment, and tag a 15,000 to 20,000 plus contact list before a single import. Bad data poisons deliverability, so the list is clean before it ever touches the account." },
  { n: "06", title: "AI booking", color: C.blue,
    detail: "GHL Conversation AI and the AI booking bot set up to qualify leads and book appointments automatically, with clean handoff to a human when the conversation needs it." },
  { n: "07", title: "Follow up and speed to lead", color: C.rose,
    detail: "Multi step email and SMS sequences, ringless voicemail, and instant speed to lead on every new lead, plus booking calendars, reminders, and no show and reschedule workflows." },
  { n: "08", title: "Conversion tracking", color: C.cyan,
    detail: "Google Tag Manager with Meta Pixel and CAPI, GA4, UTMs, and form and booking tracking, so every lead and appointment is attributed to the source that produced it." },
  { n: "09", title: "Meta sync and reporting", color: C.purple,
    detail: "Meta Lead Ads synced into GHL and ad reporting pulled into client facing dashboards, so the numbers your clients care about live in one place." },
  { n: "10", title: "Document and hand over", color: C.coral,
    detail: "Every build documented with clear SOPs and Loom walkthroughs, so the process stays repeatable across your team and nothing lives only in one person's head." },
];

function BuildPipeline() {
  const [i, setI] = useState(0);
  const s = STAGES[i];

  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
        {STAGES.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.n}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, textAlign: "left", cursor: "pointer", width: 138,
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: s.color, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 10px" }}>Step {s.n}</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: C.ink }}>{s.title}</span>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{s.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Snapshot engine (their signature ask)
const SNAP = [
  { Icon: Wand2, title: "Build once, properly", body: "Perfect the system for one client: workflows, pipelines, calendars, funnels, and the automations that convert.", color: C.coral },
  { Icon: Layers, title: "Capture the snapshot", body: "Snapshot the whole account so the proven build becomes a reusable asset, not a one off you rebuild by hand.", color: C.cyan },
  { Icon: Copy, title: "Deploy and tailor", body: "Drop the snapshot into the next client in minutes, then customise the details. Replication is fast, quality stays high.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// 3. Deliverability and A2P playbook (answers their required question)
type Tab = "warmup" | "a2p";
const PLAYBOOK: Record<Tab, { label: string; Icon: typeof Gauge; steps: string[] }> = {
  warmup: {
    label: "Warm up a new sending domain", Icon: Gauge,
    steps: [
      "Send from a dedicated domain or subdomain, never the root you cannot afford to burn.",
      "Set SPF, DKIM, and DMARC and confirm they align before a single email goes out.",
      "Start low, a small daily volume to your most engaged, most likely to open contacts.",
      "Ramp gradually over two to four weeks, increasing only while opens hold and complaints stay flat.",
      "Watch bounces and spam complaints closely, and pull volume back the moment they slip.",
      "Monitor with Google Postmaster Tools, mail tester, and MXToolbox, keeping complaints well under a fraction of a percent.",
    ],
  },
  a2p: {
    label: "A2P registration got rejected", Icon: AlertTriangle,
    steps: [
      "Read the rejection reason first, almost all of them come down to a handful of fixable causes.",
      "Match the brand exactly to the legal business name, EIN, and address. Mismatches are the number one cause.",
      "Make sure the website shows a privacy policy and clear SMS opt in language, and that consent is actually visible.",
      "Fix the sample messages: include the business name and a STOP to opt out, and match your stated use case.",
      "Correct the campaign use case and volumes so they reflect what you genuinely send.",
      "Resubmit with the corrected evidence, and if it bounces again, escalate through the carrier rather than guessing.",
    ],
  },
};

function Playbook() {
  const [tab, setTab] = useState<Tab>("warmup");
  const p = PLAYBOOK[tab];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(Object.keys(PLAYBOOK) as Tab[]).map((k) => {
          const on = k === tab;
          const item = PLAYBOOK[k];
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                color: on ? C.bg : C.sub, background: on ? C.coral : C.card,
                border: `1px solid ${on ? C.coral : C.border}`, borderRadius: 999, padding: "9px 15px", transition: "all 0.16s",
              }}
            >
              <item.Icon size={14} /> {item.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 20px", display: "grid", gap: 10 }}
        >
          {p.steps.map((step, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 12, alignItems: "start" }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, display: "grid", placeItems: "center", background: C.card, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 800, color: C.coral }}>
                {idx + 1}
              </div>
              <p style={{ fontSize: 13.5, color: C.sub, margin: 0, lineHeight: 1.5, paddingTop: 2 }}>{step}</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Proof gallery (real GHL screenshots, graceful fallback)
const PROOF = [
  { src: "/proof/regal-03-workflow-builder-branching.png", cap: "Live workflow builder with a conditional branch and timed steps" },
  { src: "/proof/regal-04-pipelines-list.png", cap: "Pipelines built to spec inside a real sub account" },
  { src: "/proof/regal-05-opportunities-kanban.png", cap: "Opportunity board tracking leads from enquiry to approved" },
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
// 5. Real builds behind this (described, not cross linked)
const BUILDS = [
  { name: "Full sub account with A2P and deliverability", color: C.coral,
    body: "A window tinting company built from scratch: four pipelines with staged journeys, custom fields, tags, and calendars, A2P SMS, email deliverability on a custom domain, an AI voice agent and missed call text back, plus a custom Node and Python webhook relay syncing their field service platform to GHL because no native app existed.",
    tags: ["A2P", "Deliverability", "AI booking", "Webhooks"] },
  { name: "13 workflow build from an empty account", color: C.cyan,
    body: "A residential care operator won on an interactive pitch, then built from zero: a 9 stage and a 5 stage pipeline, 13 workflows, 7 written email sequences, a partner and referral system, and an AI assistant, all to a naming convention that kept it maintainable.",
    tags: ["Snapshots", "Pipelines", "From scratch"] },
  { name: "Inbound SMS and list logic at scale", color: C.green,
    body: "A three workflow inbound SMS system where AI extracts a location from a text before asking, with dedupe, a capped one time ask, and a location based broadcast when a new event is created. The kind of clean logic that never double fires.",
    tags: ["SMS", "Dedupe", "Automation"] },
];

// ─────────────────────────────────────────────────────────────
export default function BrmBuildSystem() {
  const heroStats = useMemo(
    () => [
      { k: "On GoHighLevel", v: "since 2019" },
      { k: "Empty to live", v: "one system" },
      { k: "A2P and DNS", v: "done, not read" },
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
            Built for Business Results Mastery
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.coral }}>
            <Rocket size={15} /> GHL Build System · Empty account to live
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            You run the conversion engine.
            <span style={{ color: C.coral }}> I make the backend actually work.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 680, lineHeight: 1.6 }}>
            You need someone to take a client from an empty GoHighLevel account to a fully running system, then
            keep it running clean across many accounts. That is exactly the backend I own. Here is the full
            build, from snapshot to reporting, and the deliverability and A2P playbook you asked about.
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

        <Section eyebrow="The build" title="Empty account to live system, click each step" sub="This is the exact backend sequence I would run for every client you send me. Tap a step to see what happens and why it matters.">
          <BuildPipeline />
        </Section>

        <Section eyebrow="The snapshot engine" title="Build once, replicate everywhere" sub="Snapshots are how an agency scales without rebuilding by hand. Perfect the system, capture it, then deploy it to the next client in minutes.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {SNAP.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${s.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <s.Icon size={20} color={s.color} />
                <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink, margin: "10px 0 6px" }}>{s.title}</div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{s.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Your required question" title="Deliverability and A2P, answered on the page" sub="You asked how I warm up a new sending domain and what I do when A2P gets rejected. Here is exactly how I handle both. Switch between them.">
          <Playbook />
        </Section>

        <Section eyebrow="Proof" title="Real GHL work, not a mockup" sub="Screenshots from a live GoHighLevel account I built and run: the workflow builder, the pipelines, and the opportunity board. The standard your client builds would be held to.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {PROOF.map((p) => (
              <ProofTile key={p.src} src={p.src} cap={p.cap} />
            ))}
          </div>
        </Section>

        <Section eyebrow="Behind the demo" title="Builds this is drawn from" sub="Client names stay confidential here, but each of these is real, live, and mine end to end.">
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
            <Sparkles size={18} color={C.coral} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I built this page, every workflow it describes, and the client systems behind it with my own hands.
            No team, no contractors, no handoffs. I am exactly the behind the scenes person who makes the systems
            actually work, and diagnoses and fixes them without hand holding.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps North America hours daily</span>
        </div>
      </div>
    </div>
  );
}
