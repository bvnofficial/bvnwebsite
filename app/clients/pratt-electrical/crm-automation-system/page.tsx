"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Sun, Zap, PhoneCall, Route, Calendar,
  FileText, Wrench, Repeat, GitBranch, Webhook, Search, ClipboardCheck,
  ShieldCheck, Activity, Sparkles, CheckCircle2, Clock, ImageOff, Plug,
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

const ACCENT = C.amber;

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
// 1. The lead lifecycle (interactive) — enquiry to post sale
type Step = { n: string; title: string; sys: string; mech: string; detail: string; Icon: typeof Sun; color: string };

const JOURNEY: Step[] = [
  { n: "01", title: "Enquiry lands", sys: "GoHighLevel", mech: "Capture and tag", Icon: Sun, color: C.amber,
    detail: "A solar or electrical enquiry comes in from a form, a call, or an ad, and lands in GoHighLevel tagged by source, service type, and location. Nothing sits in an inbox waiting to be noticed. Source tracking is set at capture so you can see which channels actually produce installs." },
  { n: "02", title: "Lead routing", sys: "GHL logic", mech: "Branch and assign", Icon: Route, color: C.coral,
    detail: "Conditional routing sends the lead to the right pipeline and the right person by service type and territory, solar versus switchboard versus service call, so a big install enquiry never sits in the same queue as a minor repair." },
  { n: "03", title: "AI call, speed to lead", sys: "Voice agent", mech: "Outbound in seconds", Icon: PhoneCall, color: C.green,
    detail: "An AI voice agent calls a new lead within seconds, qualifies the job, answers the common questions, and books a site assessment straight onto the calendar. The outcome, transcript, and disposition sync back to the CRM so a human sees exactly what happened." },
  { n: "04", title: "Appointment booked", sys: "GHL calendar", mech: "Schedule and remind", Icon: Calendar, color: C.blue,
    detail: "The site visit or consult is booked with the right buffers and a reminder sequence over SMS and email to cut no shows. The appointment is what a marketing spend actually buys, so it is protected with confirmations and follow ups." },
  { n: "05", title: "Quote in Simpro", sys: "Simpro", mech: "Job and quote", Icon: FileText, color: C.purple,
    detail: "The job moves into Simpro where the quote is built, priced, and sent. GoHighLevel keeps nurturing the lead while the quote is open, with quote follow up automations so a sent quote is chased, not forgotten. The two systems stay in step." },
  { n: "06", title: "Sale and install", sys: "Simpro", mech: "Schedule and deliver", Icon: Wrench, color: C.cyan,
    detail: "On acceptance the job is scheduled and delivered in Simpro, the operational source of truth for the install: scheduling, timesheets, materials, and invoicing. GoHighLevel reflects the stage so sales and marketing always know where the job is." },
  { n: "07", title: "Post sale and reactivation", sys: "GHL", mech: "Review and win back", Icon: Repeat, color: C.rose,
    detail: "After commissioning, automations request a review at the right moment, start the maintenance and warranty cycle, and drop the customer into a long term nurture for referrals and future work. Past customers get reactivated instead of forgotten." },
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
                flexShrink: 0, textAlign: "left", cursor: "pointer", width: 138,
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
            <span style={{ fontSize: 13, fontWeight: 800, color: s.color, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px" }}>{s.sys}</span>
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
// 2. GHL and Simpro division of labour (interactive)
type Obj = { id: string; name: string; owner: string; ownerColor: string; detail: string };

const OBJECTS: Obj[] = [
  { id: "lead", name: "Leads and marketing", owner: "GoHighLevel", ownerColor: C.amber,
    detail: "Capture, source tracking, nurture, SMS and email, and the top of the pipeline live in GoHighLevel. It is the marketing and communication brain, and it holds the lead until the job is real." },
  { id: "appt", name: "Appointments", owner: "GoHighLevel", ownerColor: C.amber,
    detail: "Booking, reminders, and no show recovery run in GHL, then the confirmed site visit is pushed to Simpro so the field team sees it on their schedule. One booking, both systems aware." },
  { id: "quote", name: "Quotes and pricing", owner: "Simpro", ownerColor: C.purple,
    detail: "Quoting, pricing, and the catalogue live in Simpro where the trades detail belongs. GHL is told when a quote is sent and when it is accepted, so quote follow up automations fire without anyone re keying." },
  { id: "job", name: "Jobs and scheduling", owner: "Simpro", ownerColor: C.purple,
    detail: "The install itself, scheduling, timesheets, materials, and job costing is Simpro's job as the operational source of truth. GHL mirrors the job stage so sales and reporting stay accurate." },
  { id: "invoice", name: "Invoicing and payment", owner: "Simpro", ownerColor: C.purple,
    detail: "Invoicing and payment status live in Simpro. A paid or overdue status flows back to GHL as a trigger, so onboarding, reviews, or a gentle chase can fire off the real financial event." },
  { id: "review", name: "Reviews and retention", owner: "GoHighLevel", ownerColor: C.amber,
    detail: "Once Simpro marks the job complete, GHL takes back over for reviews, warranty and maintenance cycles, referrals, and long term reactivation. The customer relationship goes home to the CRM." },
];

function DivisionExplorer() {
  const [activeId, setActiveId] = useState(OBJECTS[0].id);
  const active = OBJECTS.find((x) => x.id === activeId) ?? OBJECTS[0];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "rgba(251,191,36,0.08)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 13px", marginBottom: 14 }}>
        <Plug size={15} color={ACCENT} />
        <span style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>Kept in sync by webhooks and the API, both directions</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {OBJECTS.map((x) => {
          const on = x.id === activeId;
          return (
            <button
              key={x.id}
              onClick={() => setActiveId(x.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                color: on ? C.bg : C.sub, background: on ? x.ownerColor : C.card,
                border: `1px solid ${on ? x.ownerColor : C.border}`, borderRadius: 999, padding: "8px 13px", transition: "all 0.16s",
              }}
            >
              {x.name}
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
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${active.ownerColor}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{active.name}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: active.ownerColor, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "4px 10px" }}>Owned by {active.owner}</span>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{active.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Solar and electrical domain understanding
const DOMAIN = [
  { Icon: Sun, title: "The solar sales cycle", body: "Enquiry, site assessment, system design and quote, finance or rebate paperwork, acceptance, install, and commissioning. Long cycles with real follow up windows, so the nurture matters as much as the speed to lead.", color: C.amber },
  { Icon: Zap, title: "Electrical service work", body: "Faster jobs, switchboard upgrades, service calls, and compliance work that run on a tighter loop. Different pipeline, different urgency, and routing that does not mix a service call in with a full install.", color: C.coral },
  { Icon: ClipboardCheck, title: "Where jobs actually stall", body: "Quotes sent and never chased, site visits that no show, and the handoff between the sales side and the field side. These are the leaks I would look for first because they cost the most.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// 4. What an ongoing role actually looks like
const ONGOING = [
  { Icon: Search, title: "Find the problems", body: "Proactive checks on the systems, so a broken sync or a stalled automation is caught before it costs a lead, not reported by a customer who never got a call." },
  { Icon: ShieldCheck, title: "Fix and harden", body: "Repair the cause, then add visible error alerting so the next silent break announces itself. I have chased a booking that fired but never created the downstream record, so I build for the failure you cannot see." },
  { Icon: Activity, title: "Improve the flow", body: "Tune routing, follow up timing, and pipeline stages against real numbers, and remove the duplicated or conflicting automations that quietly double message or drop contacts." },
  { Icon: FileText, title: "Report clearly", body: "A plain account of what changed, what is complete, and what still needs attention, every cycle, so you are never guessing what I have been doing." },
];

// ─────────────────────────────────────────────────────────────
// 5. Proof gallery (real GHL screenshots, graceful fallback)
const PROOF = [
  { src: "/proof/regal-01-workflow-library.png", cap: "A real workflow library built and named to a convention inside a live GoHighLevel account" },
  { src: "/proof/regal-04-pipelines-list.png", cap: "Pipelines built to spec inside a real sub account" },
  { src: "/proof/regal-05-opportunities-kanban.png", cap: "Opportunity board tracking a job from enquiry to won" },
  { src: "/proof/regal-02-family-workflows.png", cap: "Published workflows across a full customer journey" },
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
  { name: "Two way sync, field service and GHL", color: C.coral,
    body: "A live sync between a trades field service platform and GoHighLevel, built as a custom relay both directions because the native options fell short. Jobs, statuses, and outcomes kept in step, with retries and verification so nothing drops between the marketing side and the field side.",
    tags: ["Two way sync", "Webhooks", "Field service"] },
  { name: "AI voice agent at real volume", color: C.green,
    body: "An AI voice agent handling real outbound calls, qualifying leads and booking jobs, with outcomes and dispositions written back to the CRM. Speed to lead that runs whether or not someone is at a desk.",
    tags: ["AI calling", "Speed to lead", "CRM write back"] },
  { name: "Agency scale GHL, trades and services", color: C.cyan,
    body: "Real work across a 34 sub account agency serving service businesses: pipelines, routing, A2P and deliverability, custom fields and tags to a naming convention, and integration troubleshooting across accounts. Systems that hold up in daily use.",
    tags: ["GoHighLevel", "Pipelines", "Troubleshooting"] },
];

// ─────────────────────────────────────────────────────────────
export default function PrattElectricalSystem() {
  const heroStats = useMemo(
    () => [
      { k: "The systems", v: "GHL and Simpro" },
      { k: "Calls", v: "AI, speed to lead" },
      { k: "The role", v: "ongoing, proactive" },
      { k: "Run by", v: "one person" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: ACCENT, background: "rgba(251,191,36,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for Pratt Electrical Group
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: ACCENT }}>
            <Sun size={15} /> Solar and electrical · GoHighLevel and Simpro
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Leads should move from enquiry to installed
            <span style={{ color: ACCENT }}> without falling between two systems.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You run GoHighLevel and Simpro, and the money leaks in the gaps between them: a quote nobody chased, a
            booking that never reached the field team, a lead that went cold while systems waited on each other.
            This is how I would keep the two in step, wire AI calling into the front of it, and keep it all working.
            Click through the lifecycle below.
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

        <Section eyebrow="The lifecycle" title="Enquiry to appointment to sale to installed to post sale" sub="This is the path a real solar or electrical lead takes, and where each stage lives. Click through it. The value is in the handoffs, because that is exactly where leads usually fall through.">
          <Journey />
        </Section>

        <Section eyebrow="GHL and Simpro" title="Who owns what, and how they stay in sync" sub="Two systems only work when the line between them is clear. GoHighLevel owns marketing, communication, and the relationship. Simpro owns the job, the quote, and the field work. Click each object to see which system holds it and how the other stays informed.">
          <DivisionExplorer />
        </Section>

        <Section eyebrow="The industry" title="I understand how solar and electrical actually sell and install" sub="A good CRM person who does not understand the trade builds automations that fight the real process. Here is how I read yours, so the system fits the work instead of the other way around.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {DOMAIN.map((g, i) => (
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

        <Section eyebrow="Ongoing, not one off" title="What I would actually do, week to week" sub="You said this is an ongoing role and you want someone proactive who explains what changed and what still needs attention. That suits me, because a system like this is never finished, it is maintained.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {ONGOING.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <g.Icon size={18} color={ACCENT} />
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

        <Section eyebrow="The record" title="Real builds behind all of this" sub="Client names stay private unless a client clears it. Each of these is real, live, and mine end to end, which is the difference between someone who maintains systems and someone who has only read about them.">
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
            <span style={{ fontSize: 15, fontWeight: 800 }}>You want someone proactive who owns it. That is the whole model here.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 740 }}>
            BVN is not an agency. It is one person, me, and the person you talk to is the person who watches the
            systems, fixes the sync when it breaks, improves the flow, and tells you plainly what changed and what
            still needs attention. No handoff, no account manager, no waiting to be told what to look at.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Ongoing, overlaps Australian hours</span>
        </div>
      </div>
    </div>
  );
}
