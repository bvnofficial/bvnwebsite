"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Phone, PhoneIncoming, Bot, Target, CalendarCheck,
  Database, Repeat, Mic, AudioLines, ShieldCheck, BadgeCheck, FileText,
  GitBranch, Send, Package, Zap, Terminal, CheckCircle2, Clock, PhoneCall,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.purple }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. Voice AI call flow (interactive)
type Step = { Icon: typeof Phone; title: string; trigger: string; detail: string; color: string };
const STEPS: Step[] = [
  { Icon: PhoneIncoming, title: "Call comes in or out", trigger: "24/7", color: C.blue,
    detail: "Inbound or outbound, the voice AI answers or dials at any hour. A lead is never met with voicemail or a missed call, which for a financial practice is the difference between a booked client and a lost one." },
  { Icon: Bot, title: "AI greets, on brand", trigger: "Instant", color: C.purple,
    detail: "The agent opens in your brand voice, professional and compliant for financial services, and holds a natural conversation rather than sounding like a phone tree." },
  { Icon: Target, title: "Qualifies the lead", trigger: "In conversation", color: C.cyan,
    detail: "It asks the right qualifying questions, captures the answers, and reads intent, so only genuine prospects reach your calendar and your time is protected." },
  { Icon: CalendarCheck, title: "Books the appointment", trigger: "Qualified", color: C.amber,
    detail: "A qualified lead is booked straight onto your calendar inside the call, with confirmation and reminders set automatically, no back and forth." },
  { Icon: Database, title: "Logged to the CRM", trigger: "On call end", color: C.green,
    detail: "The contact, a summary of the conversation, and the outcome are written to GoHighLevel, tagged and placed in the pipeline, with zero manual entry." },
  { Icon: Repeat, title: "Follow up fires", trigger: "By activity", color: C.coral,
    detail: "Email, SMS, and voice follow up trigger based on what happened on the call, so the leads who did not book are nurtured automatically until they do." },
];

function CallFlow() {
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
// 2. Voice AI platforms
const VOICE = [
  { Icon: Mic, title: "VAPI.ai", body: "For custom, low latency voice agents with fine control over the conversation flow and the integrations behind it.", color: C.purple },
  { Icon: AudioLines, title: "Bland.ai", body: "For fast, reliable inbound and outbound calling at scale when the use case calls for volume and speed.", color: C.cyan },
  { Icon: Bot, title: "GHL native Voice AI", body: "When keeping everything inside GoHighLevel is cleaner, wired straight to the CRM, calendar, and workflows.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// 3. Compliant, on brand
const COMPLIANT = [
  { Icon: ShieldCheck, title: "Compliant for finance", body: "Scripts and flows written to the communication standards financial services demands, with the disclaimers and guardrails built in.", color: C.green },
  { Icon: BadgeCheck, title: "On brand and premium", body: "The agent sounds like your practice and your luxury brand, not a generic bot, so the first impression matches the positioning.", color: C.amber },
  { Icon: FileText, title: "Scripts and agent flows", body: "Every flow scripted, tested, and refined, so the AI says the right thing and hands off cleanly to a human when it should.", color: C.cyan },
];

// ─────────────────────────────────────────────────────────────
// 4. Built from scratch
const FOUNDATION = [
  { Icon: Database, title: "GHL from the ground up", body: "No account yet, no problem. I recommend the stack and build GoHighLevel from scratch: pipelines, stages, custom fields, and contact management.", color: C.coral },
  { Icon: Send, title: "Multi touch follow up", body: "Email, SMS, and voice touchpoints triggered by lead activity, so every lead is worked automatically around the clock.", color: C.blue },
  { Icon: FileText, title: "Documented to replicate", body: "SOPs and clear documentation with every build, in plain language, so the system can be handed over and run without me.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
export default function FinancialVoiceAiClientComms() {
  const heroStats = useMemo(
    () => [
      { k: "Runs", v: "24/7, never misses" },
      { k: "Voice AI", v: "VAPI · Bland · GHL" },
      { k: "Built", v: "From scratch" },
      { k: "With", v: "Claude Code" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.purple, background: "rgba(167,139,250,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.purple }}>
            <Phone size={15} /> 24/7 voice AI client communication system
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            A system that answers, qualifies, and books,
            <span style={{ color: C.purple }}> before you ever pick up the phone.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            You want a smart 24/7 client communication system built from the ground up, voice AI that captures leads,
            follows up, and books appointments with no manual effort. I build exactly this. Here is the system, from
            the call to the booked appointment to the follow up. Click through it.
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

        <Section eyebrow="The call flow" title="From ringing phone to booked client" sub="What happens on every call, inbound or outbound, built end to end so it runs without you. Tap each step.">
          <CallFlow />
        </Section>

        <Section eyebrow="Voice AI stack" title="The platforms I build with" sub="I match the platform to the job rather than forcing one tool. You are starting from scratch, so I recommend and build the right stack.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {VOICE.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${v.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <v.Icon size={18} color={v.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{v.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{v.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Compliant by design" title="Right for financial services, and your brand" sub="A voice agent for a financial practice has to be compliant and premium, not just functional. That is built in from the script up.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {COMPLIANT.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <c.Icon size={18} color={c.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{c.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{c.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="The foundation" title="Built from scratch, documented to last" sub="No GHL account yet is exactly how I like to start. I build the whole foundation and document it so it can be handed over.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {FOUNDATION.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <f.Icon size={18} color={f.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{f.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{f.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Phase 2 callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 28, background: "rgba(167,139,250,0.07)", border: `1px solid ${C.purple}`, borderRadius: 16, padding: "20px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <Package size={17} color={C.purple} />
            <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>Phase 2, built in from day one</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 760 }}>
            You want to package and monetize this for other financial professionals later. That only works if the
            build is clean and documented from the start. I structure every system so it can be saved as a snapshot,
            cloned, and resold rather than rebuilt each time, so the productization in Phase 2 is designed in now, not
            bolted on afterwards.
          </p>
        </motion.div>

        <Section eyebrow="Proof" title="Real GoHighLevel work" sub="Screenshots from a live GoHighLevel account I built and run, the CRM, pipelines, and workflow automation this system sits on.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Multi stage pipelines, the CRM backbone the voice AI books into." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published follow up workflows firing automatically as a lead progresses." />
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="A documented workflow library with an intake router and booking automation." />
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
            <Terminal size={18} color={C.purple} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>I build things that actually work.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            That is the line from your post, and it is how I work. I built this page with Claude Code. I think in
            systems, I explain them in plain language, I ask the smart questions before starting, and I document
            every build. One person who recommends the stack, builds it from scratch, and hands over something that runs.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.purple, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Flexible, milestone driven</span>
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
