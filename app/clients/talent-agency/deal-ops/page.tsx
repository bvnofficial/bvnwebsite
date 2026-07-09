"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Handshake, UserPlus, Send, BadgeCheck, FolderCheck,
  Eye, Receipt, ListChecks, Bell, Users, AlertTriangle, ShieldCheck,
  Database, Workflow, Mail, Lightbulb, Terminal, CheckCircle2, Clock, PhoneCall,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.amber }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. The six stage deal lifecycle (interactive)
type Stage = { Icon: typeof Handshake; n: string; title: string; chase: string; detail: string; color: string };
const STAGES: Stage[] = [
  { Icon: UserPlus, n: "01", title: "Brand shows interest", chase: "Auto trigger on new row", color: C.blue,
    detail: "A new contact hits the Deals Tracker and the lifecycle starts itself. No one has to notice the row and decide to act, the system does." },
  { Icon: Send, n: "02", title: "First response", chase: "Founder approves, then sends", color: C.cyan,
    detail: "The templated email with rates, pitch deck, and talent suggestions is drafted instantly and CCs the founder. One change from your brief: it waits on a single approval tap before going out, so the rate card never auto-fires to a competitor or a mistyped row." },
  { Icon: BadgeCheck, n: "03", title: "Deal confirmed", chase: "On status change", color: C.green,
    detail: "The moment the founder marks it confirmed, the system generates the checklist, campaign brief, contract, deliverables, deadlines, and requests them from the brand automatically." },
  { Icon: FolderCheck, n: "04", title: "Admin and coordination", chase: "Chase if not in by window", color: C.amber,
    detail: "Incoming documents are logged, outstanding ones are tracked, and if a brief or contract has not arrived inside the set window a chase goes out on its own. Nothing depends on someone remembering." },
  { Icon: Eye, n: "05", title: "Content coordination", chase: "Chase at 48 hours", color: C.coral,
    detail: "Drafts go to the brand for approval. No reply in 48 hours triggers a chase. Once approved the posting date is set, and once posted the invoicing step fires automatically." },
  { Icon: Receipt, n: "06", title: "Invoicing and payment", chase: "7 before, due, 3 and 7 overdue", color: C.purple,
    detail: "The invoice sends when content goes live, payment is tracked against terms, and reminders fire at every interval. You only hear about it when it reaches escalation." },
];

function Lifecycle() {
  const [i, setI] = useState(0);
  const s = STAGES[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {STAGES.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.n}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 150, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <st.Icon size={16} color={st.color} />
              <div style={{ fontSize: 11, fontWeight: 800, color: st.color, marginTop: 6 }}>{st.n}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 2, lineHeight: 1.25 }}>{st.title}</div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}` }}>
              <s.Icon size={20} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{s.title}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: s.color, marginTop: 2 }}>
                <Bell size={12} /> {s.chase}
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
// 2. Weekly rhythm (interactive)
type Day = { Icon: typeof Handshake; day: string; title: string; detail: string; color: string };
const DAYS: Day[] = [
  { Icon: ListChecks, day: "Mon", title: "Review and surface", color: C.blue,
    detail: "The system reviews the tracker and surfaces exactly what needs action this week, delivered as one digest instead of a manual scan that keeps getting skipped." },
  { Icon: Bell, day: "Tue", title: "Chase brands", color: C.amber,
    detail: "Automatic chases go out for missing briefs, contracts, and approvals, so nothing sits waiting on a person to remember to follow up." },
  { Icon: Users, day: "Wed", title: "Talent coordination", color: C.cyan,
    detail: "Prompts fire for talent coordination: insights, timelines, and drafts, routed to the right person so the creative side keeps pace with the deal." },
  { Icon: Send, day: "Thu", title: "Drafts for approval", color: C.coral,
    detail: "Content drafts are sent to brands for approval on schedule, then handed to the 48 hour chase logic so approvals do not stall in an inbox." },
  { Icon: Receipt, day: "Fri", title: "Invoice audit", color: C.purple,
    detail: "The week closes with an automatic audit of invoices and payment status, so money owed is always visible and never quietly slips." },
];

function WeeklyRhythm() {
  const [i, setI] = useState(0);
  const d = DAYS[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {DAYS.map((dy, idx) => {
          const on = idx === i;
          return (
            <button
              key={dy.day}
              onClick={() => setI(idx)}
              style={{
                flex: "1 1 100px", textAlign: "center", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? dy.color : C.border}`,
                borderRadius: 12, padding: "12px 8px", transition: "all 0.16s",
              }}
            >
              <dy.Icon size={16} color={dy.color} />
              <div style={{ fontSize: 12.5, fontWeight: 800, color: on ? C.ink : C.sub, marginTop: 6 }}>{dy.day}</div>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={d.day}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${d.color}`, borderRadius: 16, padding: "20px 22px" }}
        >
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 6 }}>{d.day} · {d.title}</div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0 }}>{d.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Escalation panel
const ESCALATION = [
  { Icon: ShieldCheck, title: "Silent when healthy", body: "If a deal is moving and every document is in on time, you hear nothing. No news genuinely is good news.", color: C.green },
  { Icon: AlertTriangle, title: "Loud when stuck", body: "A missed window, an ignored approval, or an overdue invoice is the only thing that reaches you, with the context to act on it.", color: C.amber },
  { Icon: Clock, title: "Escalation only", body: "Reminders exhaust themselves automatically first. You are the last step, not the chaser, so your attention goes where it matters.", color: C.rose },
];

// ─────────────────────────────────────────────────────────────
// 4. Recommended stack
const STACK = [
  { Icon: Database, title: "Airtable as the tracker", body: "Your Google Sheet, upgraded to a real database with stages, linked documents, and views, without needing a developer to maintain it.", color: C.amber },
  { Icon: Workflow, title: "Make or n8n for the logic", body: "The chasing, timing, and escalation live here. Visual, testable, and editable by a non developer, with error alerts when something breaks.", color: C.cyan },
  { Icon: Mail, title: "Email and WhatsApp for reach", body: "Templated sends and reminders through the channels the brand and your talent already use, so nothing changes on their end.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// 5. Proof (real GHL screenshots with graceful fallback)
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
export default function TalentAgencyDealOps() {
  const heroStats = useMemo(
    () => [
      { k: "Lifecycle", v: "6 stages, self driving" },
      { k: "Weekly rhythm", v: "Mon to Fri, automatic" },
      { k: "You hear", v: "Only escalations" },
      { k: "Timeline", v: "2 to 4 weeks" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.amber, background: "rgba(251,191,36,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.amber }}>
            <Handshake size={15} /> Deal operations for a boutique talent agency
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            The deal drives itself,
            <span style={{ color: C.amber }}> and you only hear about it when something is stuck.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            Right now too much of the process lives in memory and manual follow through. This is the same brand deal lifecycle, rebuilt
            so every transition is automatic, tracked, and chased on its own. I read your six stages and your weekly
            rhythm closely and turned them into this. Click through it.
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

        <Section eyebrow="The lifecycle" title="Six stages, chased without anyone remembering" sub="Your deal journey, end to end, with the automatic trigger and the chase logic on each stage. Tap through them.">
          <Lifecycle />
        </Section>

        {/* One thing I'd do differently */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 28, background: "rgba(251,191,36,0.07)", border: `1px solid ${C.amber}`, borderRadius: 16, padding: "20px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <Lightbulb size={17} color={C.amber} />
            <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>One thing I would do differently</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 760 }}>
            Your brief has Stage 1 auto firing the rates, pitch deck, and talent suggestions the instant a contact is
            added. I would keep everything else automatic but put a single one click approval before that first email,
            so your rate card and deck never auto send to a competitor, a tyre kicker, or a mistyped row. It is the one
            place where fully automatic is a risk, not a saving.
          </p>
        </motion.div>

        <Section eyebrow="The weekly rhythm" title="The Monday to Friday that runs itself" sub="Your manual weekly structure, the one that keeps getting missed, rebuilt so the right prompt reaches the right person on the right day. Tap a day.">
          <WeeklyRhythm />
        </Section>

        <Section eyebrow="Escalation" title="You are the last step, not the chaser" sub="The system exhausts its own reminders before it ever reaches you. This is how it protects your attention.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {ESCALATION.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${e.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <e.Icon size={18} color={e.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{e.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{e.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="My honest recommendation" title="The stack I would actually use" sub="You asked for my opinion, not whatever fits your current tools. For this scope, kept deliberately simple and non developer maintainable:">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {STACK.map((o, i) => (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <o.Icon size={18} color={o.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{o.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{o.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Proof" title="Multi stage chasing, already built" sub="You asked for an automation with conditional chasing. Here is that exact pattern running in a live GoHighLevel account I built, a branching workflow and a multi stage pipeline.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-03-workflow-builder-branching.png" caption="A live workflow builder with a branching condition, the conditional chase logic your deal flow needs." />
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="A multi stage opportunity pipeline, contacts moving stage by stage exactly like your six stage deal journey." />
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
            <Terminal size={18} color={C.amber} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Built to work, documented, and handed over.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            You said no black boxes and nothing that needs a developer to maintain. That is exactly how I build:
            visual automations you can edit, clear documentation you can brief someone else from, error handling so
            you know when something breaks, and a handover where I walk you through it and stay available for the
            week after. This page I built with Claude Code, which is how I move fast without cutting corners.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.amber, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Fixed fee, 2 to 4 weeks</span>
        </div>
      </div>
    </div>
  );
}
