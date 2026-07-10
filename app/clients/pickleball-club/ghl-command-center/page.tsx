"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, UserPlus, MailCheck, CalendarCheck, CreditCard,
  Trophy, Repeat, MessageSquare, ShieldCheck, Camera, Plug, HeartPulse,
  Users, FileText, Zap, Terminal, Clock, PhoneCall, CheckCircle2,
  Smartphone, BadgeCheck,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.green }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. Member lifecycle (interactive)
type Step = { Icon: typeof UserPlus; title: string; trigger: string; detail: string; color: string };
const STEPS: Step[] = [
  { Icon: UserPlus, title: "New lead comes in", trigger: "Form or ad", color: C.green,
    detail: "Someone finds the club through a landing page, a free trial offer, a social ad, or a walk in. A GoHighLevel form or funnel captures them as a contact, tagged by source, so no interested player is ever lost on a sticky note." },
  { Icon: MailCheck, title: "Welcome sequence fires", trigger: "Instant", color: C.cyan,
    detail: "An automated email and SMS welcome goes out within seconds, introducing the club, the courts, and the first step. It runs day or night, so a lead who signs up at 10pm still gets a reply before they cool off." },
  { Icon: CalendarCheck, title: "Books a first session", trigger: "Calendar", color: C.blue,
    detail: "The lead books a trial class, open play, or intro session straight into the GoHighLevel calendar, with confirmations and reminders by SMS and email so no shows drop and the courts stay full." },
  { Icon: CreditCard, title: "Converts to a member", trigger: "Recurring billing", color: C.amber,
    detail: "When they are ready to join, the membership is set up with recurring billing, and the pipeline moves them from lead to active member automatically, so your revenue and your CRM always agree." },
  { Icon: Trophy, title: "Registers for classes and events", trigger: "Ongoing", color: C.coral,
    detail: "Members register for leagues, clinics, tournaments, and events through GoHighLevel, with automated reminders and updates, so the club stays busy and communication is never manual." },
  { Icon: Repeat, title: "Retention and win-back", trigger: "By activity", color: C.rose,
    detail: "If a member goes quiet or a payment fails, automations step in with the right nudge, a check in, a re-engagement offer, or a dunning sequence, so you keep the members you worked to win." },
];

function LifecycleFlow() {
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
// 2. Messaging and compliance
const MESSAGING = [
  { Icon: ShieldCheck, title: "A2P 10DLC registration", body: "I complete the A2P 10DLC brand and campaign registration and verification, so your SMS is compliant and actually delivers instead of getting filtered.", color: C.green },
  { Icon: MessageSquare, title: "SMS automation", body: "Two way SMS wired into your workflows for reminders, confirmations, and nudges, configured and tested end to end.", color: C.cyan },
  { Icon: Smartphone, title: "WhatsApp messaging", body: "WhatsApp connected and configured inside GoHighLevel, so you can reach members on the channel they actually check.", color: C.blue },
];

// ─────────────────────────────────────────────────────────────
// 3. Build and integrate
const BUILD = [
  { Icon: Camera, title: "Snapshots", body: "Reusable GoHighLevel snapshots built and managed, so the whole system can be cloned, backed up, and rolled out cleanly.", color: C.amber },
  { Icon: Plug, title: "Integrations and APIs", body: "Facebook, Instagram, Google Business Profile, and third party apps and APIs connected to GoHighLevel and tested.", color: C.purple },
  { Icon: HeartPulse, title: "Membership and retention", body: "Recurring billing, class and event registration, member communications, and win-back flows built for a membership business.", color: C.rose },
];

// ─────────────────────────────────────────────────────────────
export default function PickleballClubGhlCommandCenter() {
  const heroStats = useMemo(
    () => [
      { k: "Built for", v: "Membership clubs" },
      { k: "Messaging", v: "A2P · SMS · WhatsApp" },
      { k: "Handover", v: "Documented SOPs" },
      { k: "Proof", v: "Live GHL account" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.green, background: "rgba(52,211,153,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.green }}>
            <Trophy size={15} /> GoHighLevel command center for a pickleball club
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            From first trial to renewed member,
            <span style={{ color: C.green }}> your club runs itself in GoHighLevel.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You need a GoHighLevel specialist to build and run the CRM, the automations, and the messaging behind a
            growing membership club. That is exactly what I do. Instead of only listing it, I mapped your member journey
            into GoHighLevel below. Click through how it flows.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((s) => (
              <div key={s.k}>
                <div style={{ fontSize: 19, fontWeight: 800, color: C.ink }}>{s.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="The member journey" title="Every stage, automated in GoHighLevel" sub="From the first enquiry to a renewed membership, built so the club communicates, books, bills, and retains without manual work. Tap each step.">
          <LifecycleFlow />
        </Section>

        <Section eyebrow="Messaging and compliance" title="SMS that is compliant and actually delivers" sub="Messaging is where most GoHighLevel setups quietly fail. I handle the compliance and the channels properly, so your texts land instead of getting filtered.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {MESSAGING.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${m.color}`, borderRadius: 14, padding: "18px 18px" }}
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

        <Section eyebrow="Build and integrate" title="The full GoHighLevel build, not just workflows" sub="Snapshots, integrations, and the membership specific systems a sports club lives on, all built, connected, and tested.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {BUILD.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <b.Icon size={18} color={b.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{b.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{b.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Documentation callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 28, background: "rgba(52,211,153,0.07)", border: `1px solid ${C.green}`, borderRadius: 16, padding: "20px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <FileText size={17} color={C.green} />
            <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>You will not be dependent on me forever</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 760 }}>
            Your post asks for clear SOPs and knowledge transfer, and I take that seriously. Every workflow, automation,
            and integration is documented in plain language, and I walk your team through it, so OneMore Pickleball Club
            can run and maintain the system going forward without being locked to any one person.
          </p>
        </motion.div>

        <Section eyebrow="Proof" title="Real GoHighLevel work, not screenshots off the internet" sub="From a live GoHighLevel account I built and run for a real membership-style business, the exact CRM, pipelines, and workflow automation your club would use.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="A documented workflow library inside a live GoHighLevel account." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published follow up automations firing as a contact progresses." />
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Pipelines built to move people from lead to active member." />
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="The opportunities board, contacts moving stage by stage." />
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
            <Terminal size={18} color={C.green} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>One specialist, independent, detail obsessed.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 740 }}>
            BVN is a one person operation, so you work directly with the specialist building and maintaining your CRM,
            not a rotating team. I know GoHighLevel hands on, I handle the A2P 10DLC and messaging that trips most
            people up, and I document everything so your team is never stuck. I built this page with Claude Code to show
            you how I think a system through before I build it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.green, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Remote contract</span>
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
