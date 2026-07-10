"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Home, MessageSquare, Send, Bot, CalendarCheck,
  Handshake, FileCheck, Mail, Voicemail, Phone, Users, Sparkles,
  MessageSquareText, Target, GitBranch, ShieldCheck, Gauge, Filter, Zap,
  Terminal, CheckCircle2, Clock, PhoneCall,
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
// 1. Seller journey (interactive)
type Step = { Icon: typeof Home; title: string; trigger: string; detail: string; color: string };
const STEPS: Step[] = [
  { Icon: MessageSquare, title: "Motivated seller in", trigger: "Any source", color: C.blue,
    detail: "A motivated seller comes in from a funnel, PPC, or cold outreach, lands in the Seller pipeline, and is tagged by source and motivation so the right sequence fires, not a generic blast." },
  { Icon: Send, title: "Multi channel speed to lead", trigger: "Within seconds", color: C.cyan,
    detail: "Instant follow up across SMS, email, and ringless voicemail, so the seller hears from you first. On a motivated seller list, being first to respond is most of the deal." },
  { Icon: Bot, title: "AI qualifies and reads intent", trigger: "On reply", color: C.purple,
    detail: "A GPT assisted step personalizes the reply, summarizes the conversation, and detects intent, hot, warm, or not selling, then routes the next step so hot sellers never wait." },
  { Icon: CalendarCheck, title: "Appointment set", trigger: "Qualified", color: C.amber,
    detail: "Qualified sellers are booked onto the calendar with reminders, and the pipeline stage advances automatically, so the acquisitions team walks into a full calendar." },
  { Icon: Handshake, title: "Offer and negotiation", trigger: "Post appointment", color: C.coral,
    detail: "Follow up keeps the deal moving through offer and negotiation, with tasks and every touchpoint logged, so a deal never goes cold because someone forgot to circle back." },
  { Icon: FileCheck, title: "Contract", trigger: "Won", color: C.green,
    detail: "A signed contract moves the deal to won and hands the property straight to the Buyer and Investor side for disposition, with no manual re entry." },
];

function SellerJourney() {
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
// 2. Channels
const CHANNELS = [
  { Icon: Mail, label: "Email", color: C.blue },
  { Icon: MessageSquare, label: "SMS", color: C.cyan },
  { Icon: Voicemail, label: "Ringless voicemail", color: C.amber },
  { Icon: Phone, label: "AI voice", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// 3. Two pipelines
const PIPELINES = [
  { Icon: Home, title: "Seller pipeline", body: "Motivated sellers from lead to contract: tagged by motivation, nurtured across channels, qualified by AI, booked, and moved stage by stage to a signed deal.", color: C.green },
  { Icon: Users, title: "Buyer and investor pipeline", body: "Buyers and investors segmented by area, price, and cash position, notified automatically the moment a matching contract is ready, and tracked through to disposition.", color: C.coral },
];

// ─────────────────────────────────────────────────────────────
// 4. AI assisted workflows
const AI = [
  { Icon: Sparkles, title: "GPT personalization", body: "Messages written to the seller's actual situation and property, so outreach reads personal instead of like a mass blast.", color: C.purple },
  { Icon: MessageSquareText, title: "Conversation summary", body: "Long back and forth threads summarized automatically, so anyone can pick up a lead and know where it stands in seconds.", color: C.cyan },
  { Icon: Target, title: "Intent detection", body: "Replies scored for intent, so hot sellers are surfaced instantly and the not selling ones are parked, without manual reading.", color: C.rose },
  { Icon: GitBranch, title: "Next step routing", body: "The detected intent routes the lead down the right branch, book, nurture, or disqualify, so the system decides the next move, not a person's memory.", color: C.amber },
];

// ─────────────────────────────────────────────────────────────
// 5. Deliverability
const DELIVER = [
  { Icon: Mail, title: "Domain and inbox placement", body: "A dedicated sending domain and gradual warm up, so mail lands in the inbox rather than the spam folder.", color: C.blue },
  { Icon: ShieldCheck, title: "SPF, DKIM, DMARC", body: "Authentication set correctly, so mailbox providers trust the sender and stop filtering the sends.", color: C.green },
  { Icon: Gauge, title: "Throttling and warm up", body: "Send volume paced as a domain builds reputation, so a new sender is never flagged for spiking too fast.", color: C.amber },
  { Icon: Filter, title: "List hygiene", body: "Bounces and dead addresses cleaned continuously, protecting sender reputation and keeping deliverability high.", color: C.coral },
];

// ─────────────────────────────────────────────────────────────
// 6. Proof (real GHL screenshots)
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
export default function ReWholesaleCommandCenter() {
  const heroStats = useMemo(
    () => [
      { k: "GHL since", v: "2019" },
      { k: "Pipelines", v: "Sellers + buyers" },
      { k: "Follow up", v: "Email · SMS · RVM · AI voice" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.green, background: "rgba(52,211,153,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.green }}>
            <Home size={15} /> GoHighLevel command center for real estate wholesale
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Two pipelines, sellers and buyers,
            <span style={{ color: C.green }}> and every message between them on autopilot.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            You need a GoHighLevel expert to build the funnels and run every communication with sellers and buyers.
            So instead of listing it, I mapped it: the motivated seller journey across every channel, the AI that
            qualifies and routes, the two pipelines, and the deliverability underneath. Click through it.
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

        <Section eyebrow="The seller journey" title="Motivated seller to signed contract" sub="Every stage of the seller side, built in GoHighLevel with the trigger and the follow up on each. Tap through it.">
          <SellerJourney />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
            {CHANNELS.map((c) => (
              <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: C.ink, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "8px 14px" }}>
                <c.Icon size={14} color={c.color} /> {c.label}
              </span>
            ))}
            <span style={{ fontSize: 12, color: C.muted, alignSelf: "center" }}>sequenced together, so a lead is reached the way they respond to</span>
          </div>
        </Section>

        <Section eyebrow="Two pipelines" title="Sellers and buyers, one connected system" sub="Wholesale lives or dies on both sides moving together. When a contract is signed on the seller side, the buyer side is already primed.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {PIPELINES.map((p, i) => (
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

        <Section eyebrow="AI assisted workflows" title="GPT doing the reading and routing" sub="The AI layer you asked for, built into the workflows so it personalizes, summarizes, detects intent, and decides the next step.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {AI.map((a, i) => (
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

        <Section eyebrow="Deliverability" title="Mail that actually lands" sub="All the automation in the world is wasted if the emails hit spam. Owning sending health is part of the job, and part of how I build.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {DELIVER.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <d.Icon size={18} color={d.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{d.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{d.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Proof" title="Real GoHighLevel work" sub="Screenshots from a live GoHighLevel account I built and run, the same funnels, pipelines, and workflow automation this role is about.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Multi stage pipelines, the same backbone as your seller and buyer flows." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published workflows firing stage by stage as a lead moves through the process." />
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="A workflow library with an intake router and booking automation feeding the system." />
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="The opportunities board, leads moving from first contact through to won." />
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
            <Terminal size={18} color={C.green} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Fast, reliable, and honest with the time.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            You asked for fast, reliable, performance driven, and honest. That is how I work. I built this page with
            Claude Code, I own the build end to end, I track what the numbers do and improve them, and I tell you
            straight what is working and what is not. One person, no hand offs, no black boxes.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps US hours, in Slack daily</span>
        </div>
      </div>
    </div>
  );
}
