"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, RotateCcw, PhoneCall, Languages,
  Voicemail, MessageSquare, UserRound, CalendarCheck, Smile,
  FileText, Webhook, Braces, Bot, ShieldCheck, Clock, Sparkles,
  Zap, GitBranch, Mic, ListChecks,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.blue }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 680, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// Interactive call flow simulator
type Node =
  | "ring"
  | "greet"
  | "qualify"
  | "booked"
  | "voicemail"
  | "sms_fallback"
  | "human";

type Screen = {
  Icon: typeof PhoneCall;
  tag: string;
  color: string;
  headline: string;
  body: string;
  ghl: string; // what GHL records at this step
};

const SCREENS: Record<Node, Screen> = {
  ring: {
    Icon: PhoneCall, tag: "Call starts", color: C.blue,
    headline: "Inbound or outbound call connects",
    body: "A lead calls in, or an outbound campaign dials out through the voice platform. GHL owns the contact record and fires the workflow that launches the AI agent.",
    ghl: "Workflow trigger fires, call logged to the contact timeline",
  },
  greet: {
    Icon: Languages, tag: "Greeting and language", color: C.purple,
    headline: "AI greets and detects language",
    body: "The agent opens, listens, and switches language on the fly if the caller answers in another one. Multi language switchover mid call, no dead air, no wrong script.",
    ghl: "Detected language written to a custom field for the whole journey",
  },
  qualify: {
    Icon: Bot, tag: "Qualify · choose the branch", color: C.cyan,
    headline: "AI qualifies, then routes",
    body: "The agent runs the qualification script and decides what happens next. Pick a branch below to see how each path is handled and what GHL does about it.",
    ghl: "Answers captured as custom fields, contact scored and tagged",
  },
  booked: {
    Icon: CalendarCheck, tag: "Outcome · appointment booked", color: C.green,
    headline: "Qualified, so it books the appointment",
    body: "A hot lead is booked straight into the GHL calendar during the call, confirmation sent by SMS and email, and the pipeline moves to booked. Positive sentiment tagged.",
    ghl: "Calendar event created, pipeline moved, positive sentiment tag applied",
  },
  voicemail: {
    Icon: Voicemail, tag: "Outcome · voicemail detected", color: C.amber,
    headline: "Voicemail detected, so it adapts",
    body: "On an outbound call the agent detects a voicemail rather than a person, drops a clean pre recorded message, and does not waste the script on an answering machine.",
    ghl: "Marked no answer, dropped voicemail logged, retry scheduled by workflow",
  },
  sms_fallback: {
    Icon: MessageSquare, tag: "Outcome · SMS to voice fallback", color: C.coral,
    headline: "No pickup, so it falls back to SMS",
    body: "If the call is missed or declined, the workflow falls back to an SMS with a booking link, then can try voice again later. The lead is never dropped just because they did not pick up.",
    ghl: "Fallback SMS sent, contact tagged for a follow up call attempt",
  },
  human: {
    Icon: UserRound, tag: "Outcome · handoff to human", color: C.rose,
    headline: "Complex or upset, so it hands off",
    body: "When the caller asks for a person, or sentiment turns negative, the agent hands off to a live human with the transcript and context so far, no starting over.",
    ghl: "Human notified, transcript attached, negative sentiment flagged for review",
  },
};

function CallSimulator() {
  const [node, setNode] = useState<Node>("ring");
  const [trail, setTrail] = useState<string[]>(["Call starts"]);

  const go = (n: Node, label: string) => {
    setTrail((t) => [...t, label]);
    setNode(n);
  };
  const reset = () => { setNode("ring"); setTrail(["Call starts"]); };

  const s = SCREENS[node];
  const isOutcome = ["booked", "voicemail", "sms_fallback", "human"].includes(node);

  const controls = (() => {
    if (node === "ring") return [{ label: "Answer and greet", onClick: () => go("greet", "Greeted") }];
    if (node === "greet") return [{ label: "Continue to qualify", onClick: () => go("qualify", "Language set") }];
    if (node === "qualify") {
      return [
        { label: "Hot lead", onClick: () => go("booked", "Booked"), color: C.green, Icon: CalendarCheck },
        { label: "Reached voicemail", onClick: () => go("voicemail", "Voicemail"), color: C.amber, Icon: Voicemail },
        { label: "No pickup", onClick: () => go("sms_fallback", "SMS fallback"), color: C.coral, Icon: MessageSquare },
        { label: "Wants a human", onClick: () => go("human", "Human handoff"), color: C.rose, Icon: UserRound },
      ];
    }
    return [];
  })();

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18 }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 7, marginBottom: 16 }}>
        {trail.map((t, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            {i > 0 && <ArrowRight size={12} color={C.muted} />}
            <span style={{ fontSize: 11.5, fontWeight: 700, color: C.sub, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "4px 10px" }}>
              {t}
            </span>
          </span>
        ))}
      </div>

      {/* Screen */}
      <motion.div
        key={node}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${s.color}`, borderRadius: 16, padding: "24px 22px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}` }}>
            <s.Icon size={19} color={s.color} />
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: s.color, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 11px" }}>
            {s.tag}
          </span>
        </div>

        <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, lineHeight: 1.2, marginBottom: 8 }}>{s.headline}</div>
        <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: "0 0 14px" }}>{s.body}</p>

        {/* GHL record line */}
        <div style={{ display: "inline-flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, fontWeight: 600, color: C.cyan, background: "rgba(34,211,238,0.07)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px" }}>
          <Braces size={14} style={{ marginTop: 1, flexShrink: 0 }} /> In GHL: {s.ghl}
        </div>

        {/* Controls */}
        {controls.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
            {controls.map((c) => {
              const CIcon = "Icon" in c ? c.Icon : ArrowRight;
              const col = "color" in c && c.color ? c.color : C.blue;
              const solid = node !== "qualify";
              return (
                <button
                  key={c.label}
                  onClick={c.onClick}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
                    fontSize: 13, fontWeight: 800, borderRadius: 12, padding: "11px 16px",
                    color: solid ? C.bg : col,
                    background: solid ? C.blue : C.card,
                    border: `1px solid ${solid ? C.blue : col}`,
                  }}
                >
                  <CIcon size={15} /> {c.label}
                </button>
              );
            })}
          </div>
        )}

        {isOutcome && (
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.sub }}>
              <FileText size={14} color={C.cyan} /> Full transcript analysed and saved to the contact
            </span>
            <button
              onClick={reset}
              style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: C.blue, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "8px 14px" }}
            >
              <RotateCcw size={13} /> Run another call
            </button>
          </div>
        )}
      </motion.div>

      <div style={{ marginTop: 14, fontSize: 12, color: C.muted, textAlign: "center" }}>
        Every branch you asked for in one place: language switchover, voicemail detection, SMS to voice fallback, and chat to human handoff, each logged back to GHL.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Integrations wired into GHL
type Integ = { id: string; Icon: typeof Mic; name: string; mech: string; detail: string; color: string };
const INTEGRATIONS: Integ[] = [
  { id: "retell", Icon: Mic, name: "Retell", mech: "Webhooks + API", color: C.blue,
    detail: "Real hands on experience here. I have built a complex voice solution on Retell, wiring the agent to GHL through webhooks so the call outcome, tags, and transcript flow straight into the contact record." },
  { id: "vapi", Icon: PhoneCall, name: "Vapi", mech: "Webhooks + API", color: C.purple,
    detail: "Vapi integrated the same way, agent events posting into GHL workflows and GHL data feeding the agent, so the conversation is grounded in real CRM context, not a blank script." },
  { id: "eleven", Icon: Voicemail, name: "ElevenLabs and PlayHT", mech: "API", color: C.coral,
    detail: "Natural voices through the API where the use case needs a specific tone or language, feeding the audio layer of the agent while GHL stays the system of record." },
  { id: "openai", Icon: Bot, name: "OpenAI and Claude", mech: "API", color: C.green,
    detail: "The reasoning layer for qualification, FAQ handling, and sentiment analysis. I write and tune the prompts and the fallback logic so the agent stays on script and knows when to escalate." },
  { id: "twilio", Icon: MessageSquare, name: "Twilio", mech: "Native + API", color: C.rose,
    detail: "Numbers, call tracking, recording, and the SMS layer for fallback and confirmations, tied to GHL so every call and text lands on the timeline." },
  { id: "make", Icon: Zap, name: "Make and Zapier", mech: "No code glue", color: C.amber,
    detail: "The lightweight glue for syncing data between the voice platform, GHL, and anything else, used where a full custom webhook would be overkill." },
];

function IntegrationExplorer() {
  const [activeId, setActiveId] = useState(INTEGRATIONS[0].id);
  const active = INTEGRATIONS.find((x) => x.id === activeId) ?? INTEGRATIONS[0];
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {INTEGRATIONS.map((x) => {
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
      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${active.color}`, borderRadius: 16, padding: "22px 22px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${active.color}` }}>
            <active.Icon size={20} color={active.color} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{active.name}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: active.color, marginTop: 3 }}>
              <Webhook size={12} /> {active.mech}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{active.detail}</p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Conversation design guardrails
const GUARD = [
  { Icon: GitBranch, title: "Fallback logic on every path", body: "No pickup, voicemail, silence, or a question the agent cannot answer all have a defined next step. A conversation never dead ends.", color: C.coral },
  { Icon: Languages, title: "Language switchover", body: "The agent detects and switches language mid call and holds it for the rest of the conversation, so a caller is never stuck in the wrong script.", color: C.purple },
  { Icon: UserRound, title: "Clean human handoff", body: "When a caller asks for a person or sentiment drops, the agent hands off with the transcript and context, so the human does not start from zero.", color: C.rose },
  { Icon: Smile, title: "Sentiment tagging", body: "Positive and negative sentiment is tagged on the contact, so happy leads get moved forward and unhappy ones get flagged for a human to review.", color: C.green },
  { Icon: FileText, title: "Transcripts and drop off analysis", body: "Every call is transcribed and logged. I read where conversations drop off and tighten the script and logic so the next batch converts better.", color: C.cyan },
  { Icon: ShieldCheck, title: "Consent and compliance aware", body: "Recording consent, opt outs, and TCPA aware call handling built into the flow, not bolted on after. Compliance is part of the design.", color: C.blue },
];

// ─────────────────────────────────────────────────────────────
// Real proof
const PROOF = [
  { name: "A real Retell voice build", color: C.blue,
    body: "I have built a complex AI voice solution on Retell, so voice agent experience here is real and hands on, not theory. That is exactly the Retell or Vapi requirement in your post.",
    tags: ["Retell", "Voice AI", "Real build"] },
  { name: "GHL native voice and missed call text back", color: C.coral,
    body: "In a live client account I built the GHL voice agent with missed call text back, the same SMS to voice fallback pattern your post describes, tied into workflows and tags.",
    tags: ["GHL voice", "Missed call text back", "Fallback"] },
  { name: "Custom webhook relay between platforms", color: C.green,
    body: "A two way sync between an external platform and GHL, built as a Node and Python webhook relay because no native app existed. REST, webhooks, and JSON both directions, kept reliable.",
    tags: ["Webhooks", "REST", "JSON"] },
];

// ─────────────────────────────────────────────────────────────
export default function VoiceAiFlow() {
  const heroStats = [
    { k: "On GoHighLevel", v: "since 2019" },
    { k: "Voice AI", v: "real Retell build" },
    { k: "Every branch", v: "clickable here" },
    { k: "Runs on", v: "one person" },
  ];

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 22px 100px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 34 }}>
          <a href="https://www.bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            <ArrowLeft size={15} /> BVN Official
          </a>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.blue, background: "rgba(59,130,246,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.blue }}>
            <PhoneCall size={15} /> Voice AI · GoHighLevel · fallback and handoff
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            An AI voice agent inside GHL.
            <span style={{ color: C.blue }}> Click through a whole call.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            Your role is bridging conversational AI and GoHighLevel: voice agents, language switchover, SMS to voice
            fallback, voicemail detection, chat to human handoff, and sentiment tagging. Rather than list those, here
            they are running. Click a call from ring to outcome and watch what GHL records at each step.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((st) => (
              <div key={st.k}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>{st.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{st.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="Click it" title="Walk one call from ring to outcome" sub="Start the call, set the language, then choose how the lead behaves at the qualify step. Each outcome shows the caller experience and exactly what GHL records, tags, and triggers.">
          <CallSimulator />
        </Section>

        <Section eyebrow="Integrations" title="The voice stack, wired into GHL" sub="GoHighLevel stays the system of record. External voice and AI platforms plug in through webhooks, APIs, and JSON. Tap any tool to see how I connect it.">
          <IntegrationExplorer />
        </Section>

        <Section eyebrow="Conversation design" title="The logic that keeps a voice agent trustworthy" sub="A voice agent that dead ends, ignores a voicemail, or will not pass to a human does more harm than good. This is the design discipline behind the flow above.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {GUARD.map((g, i) => (
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

        <Section eyebrow="Not a mockup" title="Real voice and GHL builds behind this" sub="Client names stay confidential, but each of these is real and mine end to end. The flow above is drawn from having actually shipped voice AI and GHL integration work.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {PROOF.map((b, i) => (
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
            <Sparkles size={18} color={C.blue} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I built this page, the call logic it runs on, and the voice and GHL systems behind it with my own hands.
            No team, no handoffs. You work directly with the person building your agents, which is why the builds stay
            clean and the fallback logic actually holds up.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.blue, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
            <Link href="/intro" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
              Intro video <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <ListChecks size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps United States hours daily</span>
        </div>
      </div>
    </div>
  );
}
