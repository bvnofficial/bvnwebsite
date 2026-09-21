"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, HeartPulse, Phone, Stethoscope, CreditCard,
  UserCheck, Repeat, Zap, Split, Tag, Layers, Webhook, Timer,
  ClipboardCheck, Search, Globe, ShieldCheck, Sparkles, CheckCircle2,
  Clock, PhoneCall, ImageOff, Activity,
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

const ACCENT = C.cyan;

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
// 1. The patient journey (interactive) — their exact map
type Step = { n: string; title: string; stage: string; mech: string; detail: string; Icon: typeof Phone; color: string };

const JOURNEY: Step[] = [
  { n: "01", title: "Lead", stage: "Enquiry captured", mech: "Form to tag", Icon: HeartPulse, color: C.cyan,
    detail: "A prospective patient finds you through a campaign landing page or a WordPress site and submits a form or quiz. The contact is created, tagged by source and condition of interest, and enters the pipeline the instant they hit send, with tracking attribution attached." },
  { n: "02", title: "Call", stage: "Speed to lead", mech: "Trigger and SMS", Icon: Phone, color: C.blue,
    detail: "An automation fires the first contact within seconds and books a triage or intake call. Missed call text back catches anyone who rings and reaches voicemail, and reminders cut the no show rate before it costs a consultation slot." },
  { n: "03", title: "Consultation", stage: "Clinician time", mech: "Calendar and branch", Icon: Stethoscope, color: C.purple,
    detail: "The consult is booked on the right clinician calendar with the correct duration and buffers. Conditional logic routes the patient by service type, so a first consult and a follow up never follow the same path or the same paperwork." },
  { n: "04", title: "Payment", stage: "Billing as a trigger", mech: "Webhook and tag", Icon: CreditCard, color: C.green,
    detail: "A paid invoice is an event, not a manual check. A payment webhook tags the contact as paid, moves the pipeline, and releases the next step, so nobody is treated before billing is settled and nobody is chased who already paid." },
  { n: "05", title: "Patient", stage: "Onboarded", mech: "Pipeline and fields", Icon: UserCheck, color: C.amber,
    detail: "The lead becomes a patient record with the custom fields that matter for care captured cleanly. Onboarding messaging, intake forms, and the first care steps fire automatically, and the pipeline reflects a real patient, not an open opportunity." },
  { n: "06", title: "Ongoing care", stage: "Retention", mech: "Long term workflows", Icon: Activity, color: C.rose,
    detail: "Repeat scripts, check ins, refills, and review cycles run on paced workflows so care continues without someone remembering to send each message. This is where telehealth revenue actually compounds, so it gets built with the most care." },
  { n: "07", title: "Reactivation", stage: "Win back", mech: "Batch campaign", Icon: Repeat, color: C.coral,
    detail: "Lapsed patients are an asset, not a dead list. A controlled reactivation campaign reaches them in batches, routes replies to a human, and refills the schedule from people who already trusted you once, all with opt outs respected." },
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
                flexShrink: 0, textAlign: "left", cursor: "pointer", width: 132,
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: s.color, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px" }}>{s.stage}</span>
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
// 2. Anatomy of a complex workflow (interactive) — the video ask, in clickable form
type Node = { id: string; Icon: typeof Zap; name: string; detail: string; why: string; color: string };

const NODES: Node[] = [
  { id: "trigger", Icon: Zap, name: "Triggers", color: C.cyan,
    detail: "What starts the workflow: a form submit, a booking, a payment webhook, a tag added, or a pipeline stage change. In a healthcare build the triggers are chosen narrowly so a patient only ever enters when they truly should.",
    why: "Why: broad triggers are how contacts get double enrolled and messaged twice. Narrow, intentional triggers keep the account trustworthy." },
  { id: "branch", Icon: Split, name: "Conditions and branches", color: C.purple,
    detail: "If and else logic that routes by service type, whether payment cleared, first consult versus follow up, or which clinician. One workflow handles many paths instead of ten near identical workflows nobody can maintain.",
    why: "Why: branching keeps the logic in one readable place, so a change is made once and the whole journey stays consistent." },
  { id: "tag", Icon: Tag, name: "Tags and custom fields", color: C.amber,
    detail: "Tags mark state and drive segmentation. Custom fields hold the data that belongs to the patient. Used with discipline, and separated from custom values, which hold the account wide constants a workflow reads.",
    why: "Why: clean data is what makes every downstream automation and every report actually correct instead of confidently wrong." },
  { id: "pipeline", Icon: Layers, name: "Pipeline moves", color: C.green,
    detail: "Each meaningful event moves the opportunity to the right stage, and the stage change itself fires actions: a task, an alert, a patient status message. The board becomes a live picture of the business, not a chore.",
    why: "Why: when the pipeline is automated it can be trusted for reporting and forecasting, which is the whole point of having one." },
  { id: "integration", Icon: Webhook, name: "Integrations", color: C.rose,
    detail: "WordPress forms into GHL, payment and external systems over webhooks, Make or Zapier where a no code link is right, and the GHL API where it is not. Data flows both directions and stays in sync.",
    why: "Why: a CRM that does not talk to the site and the biller is just an address book. The integrations are what make it a system." },
  { id: "qa", Icon: Timer, name: "Waits and QA", color: C.blue,
    detail: "Wait steps respect business hours and pacing so nobody gets a 2am text, and every build is tested on sample contacts, watching each step fire, before a real patient touches it.",
    why: "Why: in healthcare a workflow that fires wrong is not just annoying, it erodes trust. Tested and paced is not optional." },
];

function WorkflowAnatomy() {
  const [activeId, setActiveId] = useState(NODES[0].id);
  const active = NODES.find((x) => x.id === activeId) ?? NODES[0];
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {NODES.map((x) => {
          const on = x.id === activeId;
          return (
            <button
              key={x.id}
              onClick={() => setActiveId(x.id)}
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
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${active.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${active.color}` }}>
              <active.Icon size={20} color={active.color} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{active.name}</div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: "0 0 12px" }}>{active.detail}</p>
          <div style={{ display: "flex", gap: 9, background: "rgba(34,211,238,0.07)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 13px" }}>
            <CheckCircle2 size={16} color={ACCENT} style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.55 }}>{active.why}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Diagnostic (their troubleshooting question, shown as systems thinking)
const DIAGNOSE = [
  { step: "Confirm it is real", body: "First, is the 30% real or a reporting artifact? Check the date range, attribution, and whether a dashboard or filter changed. Do not chase a ghost." },
  { step: "Isolate where in the funnel", body: "Leads are flat, so the drop is between lead and booking. Compare form fills to booking confirmations stage by stage to find the exact step that fell." },
  { step: "Suspect the plumbing first", body: "A silent technical break is the usual culprit: a calendar disconnected, an A2P number stopped delivering, a webhook failing, an SSL or domain issue on the booking page, or a workflow paused." },
  { step: "Test as a patient", body: "Run a real booking end to end myself and watch every step fire in the logs. A booking that looks fine on the front end but never creates the record is exactly the kind of silent failure I have traced before." },
  { step: "Check timing and capacity", body: "If the tech is clean, look at clinician availability, calendar buffers, and reminder timing. A booking link with no open slots converts like a broken one." },
  { step: "Fix, verify, and alarm it", body: "Fix the cause, confirm bookings recover against the same report, then add visible error alerting so the next silent break announces itself instead of hiding for a week." },
];

// ─────────────────────────────────────────────────────────────
// 4. Proof gallery (real GHL screenshots, graceful fallback)
const PROOF = [
  { src: "/proof/regal-01-workflow-library.png", cap: "A real workflow library built and named to a convention inside a live GoHighLevel account" },
  { src: "/proof/regal-04-pipelines-list.png", cap: "Pipelines built to spec inside a real sub account" },
  { src: "/proof/regal-05-opportunities-kanban.png", cap: "Opportunity board tracking a journey from enquiry to approved" },
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
// 5. Integrations and QA
const INTEG = [
  { Icon: Globe, title: "WordPress and GHL", body: "WordPress forms and pages feeding GoHighLevel cleanly, and GHL powering the automation behind a WordPress front end. I have run both directions.", color: C.blue },
  { Icon: Webhook, title: "Make, Zapier, webhooks", body: "Two way webhooks, Make and Zapier for the right jobs, and the GHL API where a no code tool would get fragile under load. Built with retries so a flaky call delays, never loses.", color: C.purple },
  { Icon: Search, title: "Meta and Google tracking", body: "Pixel and conversion tracking wired so ad spend maps to booked consults, with honest attribution. Support level on the ads themselves, I am upfront I am a systems specialist first.", color: C.amber },
  { Icon: ClipboardCheck, title: "QA and documentation", body: "Every build tested on sample contacts before it goes live, and the architecture and workflows documented so the system is maintainable by someone other than me.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// 6. Real builds behind this
const BUILDS = [
  { name: "The silent booking failure I traced", color: C.coral,
    body: "My sharpest troubleshooting story, and why the question above is easy for me. An AI booking flow created appointments but silently never created the downstream record, because no native integration existed. I worked backward from the missing outcome, built a custom webhook relay both directions, and added visible error handling so it could never hide again.",
    tags: ["Diagnosis", "Webhooks", "Error handling"] },
  { name: "Complex account built from scratch", color: C.cyan,
    body: "A full environment built from an empty account: multi stage pipelines, branching workflows, written email and SMS sequences, custom fields and tags to a naming convention, calendars, and forms. Architected first, then built, tested, and documented.",
    tags: ["Architecture", "Pipelines", "From scratch"] },
  { name: "Agency scale and integration depth", color: C.green,
    body: "Real work across a 34 sub account agency with A2P and deliverability, WordPress and GHL, and custom two way syncs. Systems thinking across many accounts, not one funnel built from a tutorial.",
    tags: ["A2P", "WordPress", "Multi account"] },
];

// ─────────────────────────────────────────────────────────────
export default function TelehealthGhlSystem() {
  const heroStats = useMemo(
    () => [
      { k: "On GoHighLevel", v: "since 2018" },
      { k: "The work", v: "architect and own" },
      { k: "Hours", v: "Australian business" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: ACCENT, background: "rgba(34,211,238,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: ACCENT }}>
            <HeartPulse size={15} /> Telehealth · GoHighLevel system architecture
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            You want someone to own the whole system.
            <span style={{ color: ACCENT }}> Not build one workflow at a time.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You asked for a video walking through a complex GHL build. Here is something you can click instead:
            the full patient journey you described, the anatomy of a complex branching workflow and why each part
            is built that way, and how I would diagnose the booking drop in your own troubleshooting question. Real
            screenshots from a live account are further down. No patient data anywhere on this page.
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

        <Section eyebrow="The journey" title="Lead to call to consult to payment to patient to care" sub="This is the exact map from your post, built as one connected system. Click each stage to see the mechanism underneath, because the value is in how the stages hand off, not in any single one.">
          <Journey />
        </Section>

        <Section eyebrow="The walkthrough" title="Anatomy of a complex workflow, and why I build it that way" sub="Your video asks me to explain a complex workflow, its triggers, branches, tags, custom fields, pipeline moves, and integrations, and why I architected it so. Click each part. This is that explanation, in a form you can actually poke at.">
          <WorkflowAnatomy />
        </Section>

        <Section eyebrow="Systems thinking" title="Bookings fall 30%, lead volume is flat. Here is how I diagnose it" sub="This is your troubleshooting question, and it is the kind of problem I like. A clear path from symptom to cause to fix, biased toward the silent technical break that usually turns out to be the culprit.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {DIAGNOSE.map((g, i) => (
              <motion.div
                key={g.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.bg, background: ACCENT, borderRadius: 999, width: 22, height: 22, display: "grid", placeItems: "center" }}>{i + 1}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{g.step}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{g.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Integrations and rigour" title="The system talks to everything, and it is tested" sub="A telehealth CRM that does not talk to the website and the biller is just an address book, and one that is not tested is a liability. Both matter more in healthcare than almost anywhere.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {INTEG.map((g, i) => (
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

        <Section eyebrow="Not a mockup" title="Real screenshots from a live GoHighLevel account" sub="From a real client build, shared with permission and with private data kept out. Workflows, pipelines, and an opportunity board, built and named by me inside a live account.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {PROOF.map((p) => (
              <ProofTile key={p.src} src={p.src} cap={p.cap} />
            ))}
          </div>
        </Section>

        <Section eyebrow="The record" title="Real builds behind all of this" sub="Client names stay private unless a client clears it. Each of these is real, live, and mine end to end, which is the difference between architecting systems and watching videos about them.">
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
            <span style={{ fontSize: 15, fontWeight: 800 }}>You want an owner, not an order taker. That is the whole model here.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 740 }}>
            BVN is not an agency. It is one person, me, and the person you interview is the person who audits the
            account, architects the system, builds it, tests it, and troubleshoots it at 2am if a booking flow
            breaks. Tell me the business outcome and I will tell you how I would build it inside GoHighLevel, then
            go do it. No junior handoff, no waiting to be told which workflow to build next.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Full time, Australian business hours</span>
        </div>
      </div>
    </div>
  );
}
