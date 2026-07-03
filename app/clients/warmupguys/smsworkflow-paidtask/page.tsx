"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MessageCircle, MapPin, Zap, Users, ChevronRight,
  CircleCheck, Bot, ShieldCheck, Mail, Megaphone,
  Tag, Send, BarChart3, Sparkles, PhoneIncoming, Workflow,
  GitBranch, Clock,
} from "lucide-react";

// ── Brand tokens (BVN client-proposal palette) ───────────────
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
  red: "#F87171",
};

// ── Workflow stages ───────────────────────────────────────────
type Step = { text: string; auto: boolean };
type Stage = {
  id: string;
  num: number;
  name: string;
  description: string;
  accent: string;
  emoji: string;
  steps: Step[];
  result: string;
};

const stages: Stage[] = [
  {
    id: "inbound",
    num: 1,
    name: "Text comes in",
    description:
      "Every inbound text to the CTA number is the trigger. Nothing about the customer's experience changes here, this just becomes the entry point for everything below.",
    accent: C.cyan,
    emoji: "📩",
    steps: [
      { text: "\"Customer Replied\" trigger fires on the CTA number's conversation", auto: true },
      { text: "Contact is created, or matched if they already exist", auto: true },
      { text: "Message is logged to the conversation and checked against the DND / STOP list", auto: true },
    ],
    result: "Every text lands in a trackable conversation. Nothing changes for the customer.",
  },
  {
    id: "check",
    num: 2,
    name: "Already know where they live?",
    description:
      "Before anything else happens, the workflow checks whether this contact already has a Zip Code on file, so nobody is ever asked twice.",
    accent: C.purple,
    emoji: "🔎",
    steps: [
      { text: "If / else check on the Zip Code custom field", auto: true },
      { text: "Known: skip straight to Stage 7, tag Location: Known already set", auto: true },
      { text: "Unknown: continue to the read the message step", auto: true },
    ],
    result: "This branch only ever runs once per contact, ever.",
  },
  {
    id: "extract",
    num: 3,
    name: "Read the message for a place",
    description:
      "Most people who care where the comedian is playing already say so without being asked: \"coming to Austin?\", \"any Texas dates?\", \"I'm in 30301\". An AI step reads the raw text for a place before anyone is bothered with a question.",
    accent: C.blue,
    emoji: "🤖",
    steps: [
      { text: "AI step (GHL AI Employee, or a webhook to Claude / GPT) scans the inbound text for a city, state, venue, or zip", auto: true },
      { text: "Returns a place value and a confidence level: High, Low, or None", auto: true },
      { text: "Runs in the background, adds roughly a second to the reply time", auto: true },
    ],
    result: "The read happens on every single message, whether or not it finds anything usable.",
  },
  {
    id: "silent",
    num: 4,
    name: "High confidence: fill it in quietly",
    description:
      "If the text names a real place with good confidence, nothing is ever asked. The record fills itself in behind the scenes.",
    accent: C.green,
    emoji: "✅",
    steps: [
      { text: "Geocode the place name to City, State, and Zip (zip only when a literal 5 digit zip was typed)", auto: true },
      { text: "Save the City / State / Zip custom fields", auto: true },
      { text: "Set Location Source = AI Extracted, Location Confidence = High", auto: true },
      { text: "Tag Location: Known", auto: true },
    ],
    result: "The contact record is enriched with zero friction. Nobody was ever asked anything.",
  },
  {
    id: "ask",
    num: 5,
    name: "Low or no confidence: one soft ask",
    description:
      "If nothing usable was said, the workflow asks once, folded naturally into the reply the customer is already getting. Not a separate text, not a form, not a robotic question.",
    accent: C.amber,
    emoji: "💬",
    steps: [
      { text: "Check the Zip Asked tag, if it was set in the last 30 days, skip the ask entirely", auto: true },
      { text: "If not asked recently, add one line to the outgoing reply: \"Btw, what's your zip so we know if he's ever near you?\"", auto: true },
      { text: "Tag Zip Asked, start a 48 hour wait for a reply", auto: true },
    ],
    result: "One low pressure ask, tied to a real reason, capped so nobody gets nagged.",
  },
  {
    id: "validate",
    num: 6,
    name: "The reply comes back (or doesn't)",
    description:
      "Whatever they text back is checked against a simple pattern, not pushed through a rigid form validator.",
    accent: C.coral,
    emoji: "🧮",
    steps: [
      { text: "If the reply matches a 5 digit zip pattern, validate it and geocode to City / State", auto: true },
      { text: "Save the fields, set Location Source = Self Reported, tag Location: Known", auto: true },
      { text: "If the reply isn't a zip (a question, an objection, or silence after 48 hours), tag Location: Unknown and move on, no retry", auto: true },
    ],
    result: "Clean capture when it works, and the system stops asking the moment it doesn't.",
  },
  {
    id: "reply",
    num: 7,
    name: "Their actual question still gets answered",
    description:
      "Location capture rides alongside the real conversation. It never blocks or delays the answer to whatever they actually texted about.",
    accent: C.blue,
    emoji: "🎤",
    steps: [
      { text: "Show info, tour dates, and ticket questions are answered by the setter or an AI Employee for FAQs, same as today", auto: false },
      { text: "The zip question, when it applies, is appended to that same reply, never sent as a separate text", auto: true },
    ],
    result: "The customer experience doesn't change. They get their answer either way.",
  },
  {
    id: "pool",
    num: 8,
    name: "Contact joins the notify pool",
    description:
      "The moment City, State, or Zip lands on the record, from either path above, the contact becomes targetable for future tour stops.",
    accent: C.purple,
    emoji: "🗂️",
    steps: [
      { text: "Tag Tour Radius Eligible", auto: true },
      { text: "Custom fields are now available to every future broadcast and workflow, not just this one", auto: true },
    ],
    result: "The database becomes usable the moment a location lands, not after a separate cleanup pass.",
  },
  {
    id: "notify",
    num: 9,
    name: "A show gets booked near them",
    description:
      "This is the actual point of the whole exercise, reaching the right people at the right moment instead of a generic blast to everyone on the list.",
    accent: C.green,
    emoji: "📣",
    steps: [
      { text: "New tour stop is added (opportunity or custom field) with its own city / state / zip", auto: false },
      { text: "Workflow matches Tour Radius Eligible contacts in that state or zip radius", auto: true },
      { text: "Matched contacts are enrolled into a \"we're coming to your town\" SMS and email", auto: true },
    ],
    result: "A relevant, timely nudge instead of noise, which is the whole reason the zip mattered.",
  },
];

// ── Sample conversations ──────────────────────────────────────
type Bubble = { from: "customer" | "business" | "system"; text: string };
type Scenario = { id: string; label: string; accent: string; verdict: string; bubbles: Bubble[] };

const scenarios: Scenario[] = [
  {
    id: "mentioned",
    label: "Location mentioned naturally",
    accent: C.green,
    verdict: "Zero questions asked. City, State, and Zip saved silently in the background.",
    bubbles: [
      { from: "customer", text: "Hey do you know if he's coming to Austin anytime soon?" },
      { from: "system", text: "AI extraction: Austin, TX — confidence High" },
      { from: "business", text: "Not yet, but you're on the list! We'll text you the second an Austin date is booked." },
      { from: "system", text: "Saved: City = Austin, State = TX. Location Source = AI Extracted. No question asked." },
    ],
  },
  {
    id: "asked-answered",
    label: "Soft ask, answered",
    accent: C.amber,
    verdict: "One line appended to a normal reply. Zip validated and geocoded the moment it comes back.",
    bubbles: [
      { from: "customer", text: "What time does Friday's show start?" },
      { from: "business", text: "Doors at 7, show's at 8! Btw, what's your zip so we know if he's ever near you?" },
      { from: "customer", text: "30301" },
      { from: "system", text: "Valid zip. Geocoded to Atlanta, GA. Location Source = Self Reported. Tagged Location: Known." },
    ],
  },
  {
    id: "asked-ignored",
    label: "Soft ask, ignored",
    accent: C.muted,
    verdict: "No zip, no nagging. Tagged and left alone, the conversation carries on normally.",
    bubbles: [
      { from: "customer", text: "Can I bring my own drinks?" },
      { from: "business", text: "Nope, but the venue bar's got you covered! Btw, what's your zip so we know if he's ever near you?" },
      { from: "customer", text: "lol why do you need that" },
      { from: "system", text: "48 hour wait expired with no valid zip. Tagged Location: Unknown. No further ask, ever, unless they bring it up again." },
    ],
  },
];

// ── Build specification ───────────────────────────────────────
const customFields = [
  { name: "Zip Code", type: "Text / Number", purpose: "Primary value used for matching contacts against future tour stops" },
  { name: "City", type: "Text", purpose: "Human readable, shown to the team, filled by the geocode lookup" },
  { name: "State", type: "Dropdown", purpose: "Used for broad state level broadcast targeting when a precise radius isn't needed" },
  { name: "Location Source", type: "Dropdown: AI Extracted / Self Reported / Unknown", purpose: "Lets the team see how reliable each record is at a glance" },
  { name: "Location Confidence", type: "Dropdown: High / Low / None", purpose: "Set by the AI extraction step, drives whether the soft ask fires" },
  { name: "Zip Asked (date)", type: "Date", purpose: "Timestamps the last ask, powers the 30 day cap so nobody is asked twice" },
];

const tags = [
  { name: "location-known", when: "Zip / City / State exist, from either the AI extraction or a self reported reply" },
  { name: "location-unknown", when: "The soft ask went unanswered or was declined, and no retry is scheduled" },
  { name: "zip-asked", when: "The moment the soft ask is sent, drives the 30 day cap" },
  { name: "tour-radius-eligible", when: "Applied once any location exists, this is the segment future broadcasts pull from" },
];

const workflowList = [
  { name: "SMS Location Capture", trigger: "Customer Replied (inbound SMS on the CTA number)", does: "Runs Stages 1 through 7, the core logic on this page" },
  { name: "Tour Proximity Watch", trigger: "Contact Tag Added: tour-radius-eligible", does: "Enrolls the contact into the standing notify pool, sits idle until a stop is added nearby" },
  { name: "Notify Nearby Fans", trigger: "New Tour Stop created (opportunity or custom object)", does: "Matches tour-radius-eligible contacts by state / zip radius, sends the \"coming to your town\" SMS and email" },
];

// ── Draft workflow, node by node ────────────────────────────
type NodeKind = "trigger" | "condition" | "action" | "wait";
type FlowNode = {
  id: string;
  kind: NodeKind;
  title: string;
  detail: string;
  Icon: typeof Zap;
  branches?: { label: "Yes" | "No"; text: string }[];
};

const kindStyle: Record<NodeKind, { label: string; color: string }> = {
  trigger: { label: "Trigger", color: C.coral },
  condition: { label: "If / Else", color: C.purple },
  action: { label: "Action", color: C.blue },
  wait: { label: "Wait", color: C.amber },
};

const mainFlow: FlowNode[] = [
  { id: "1", kind: "trigger", Icon: Zap, title: "Customer Replied", detail: "Fires on every inbound SMS to the CTA number." },
  {
    id: "2", kind: "condition", Icon: GitBranch, title: "Zip Code already on file?",
    detail: "Checks the contact record before doing anything else.",
    branches: [{ label: "Yes", text: "Skip straight to Send reply (Step 10)" }, { label: "No", text: "Continue to AI extraction" }],
  },
  { id: "3", kind: "action", Icon: Bot, title: "AI extraction step", detail: "Scans the inbound text for a city, state, venue, or zip. Returns a confidence level: High, Low, or None." },
  {
    id: "4", kind: "condition", Icon: GitBranch, title: "Confidence = High?",
    detail: "Only a clean, specific match counts as High.",
    branches: [{ label: "Yes", text: "Continue to Save location (Step 5)" }, { label: "No", text: "Skip ahead to Step 6" }],
  },
  { id: "5", kind: "action", Icon: MapPin, title: "Save location silently", detail: "Geocode the place, save City / State / Zip, Location Source = AI Extracted, tag location-known. Then continue to Send reply (Step 10)." },
  {
    id: "6", kind: "condition", Icon: GitBranch, title: "Zip Asked in the last 30 days?",
    detail: "The cap that stops anyone getting nagged.",
    branches: [{ label: "Yes", text: "Skip straight to Send reply (Step 10), don't ask again" }, { label: "No", text: "Continue to the soft ask" }],
  },
  { id: "7", kind: "action", Icon: MessageCircle, title: "Append the soft ask", detail: "One line added to the outgoing reply: \"Btw, what's your zip so we know if he's ever near you?\" Tag zip-asked." },
  { id: "8", kind: "wait", Icon: Clock, title: "Wait for a reply", detail: "Up to 48 hours." },
  {
    id: "9", kind: "condition", Icon: GitBranch, title: "Reply is a valid zip?",
    detail: "Checked against a simple 5 digit pattern, not a form validator.",
    branches: [{ label: "Yes", text: "Validate, geocode, save fields, Location Source = Self Reported, tag location-known" }, { label: "No", text: "Tag location-unknown, no retry" }],
  },
  { id: "10", kind: "action", Icon: Send, title: "Send the normal reply", detail: "Answers whatever they actually texted about. Fires on every path, every time, regardless of the location outcome above." },
  { id: "11", kind: "action", Icon: Tag, title: "Tag Tour Radius Eligible", detail: "Applied the moment any location exists on the record. End of this workflow." },
];

const notifyFlow: FlowNode[] = [
  { id: "a", kind: "trigger", Icon: Zap, title: "New Tour Stop created", detail: "Fires when a new city, state, and zip is added for an upcoming show." },
  { id: "b", kind: "action", Icon: MapPin, title: "Match eligible contacts", detail: "Finds every Tour Radius Eligible contact in that state or zip radius." },
  { id: "c", kind: "action", Icon: Send, title: "Enroll in the town blast", detail: "Matched contacts get the \"we're coming to your town\" SMS and email." },
];

// ── Component ──────────────────────────────────────────────────
export default function WarmUpGuysSmsWorkflow() {
  const [active, setActive] = useState<string>("inbound");
  const [scenario, setScenario] = useState<string>("mentioned");

  const stage = stages.find((s) => s.id === active)!;
  const nextStage = stages[stages.findIndex((s) => s.id === active) + 1];
  const autoSteps = stage.steps.filter((s) => s.auto);
  const teamSteps = stage.steps.filter((s) => !s.auto);
  const activeScenario = scenarios.find((s) => s.id === scenario)!;

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 80px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.coral, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.coral, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Paid Task Response
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 6px", fontWeight: 800 }}>
            Turning Inbound Texts Into Complete Contact Records
          </h1>
          <p style={{ color: C.sub, fontSize: 14, maxWidth: 680, margin: 0, lineHeight: 1.65 }}>
            A proposed solution and a fully specified draft workflow for the inbound SMS number, built to capture
            where a fan is located so you can reach them the moment the comedian is coming to their town, without
            ever forcing anyone through a form.
          </p>
        </div>

        {/* The brief */}
        <div style={{ marginTop: 24, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <PhoneIncoming size={15} style={{ color: C.coral }} />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: C.coral }}>The brief, from Nick</span>
          </div>
          <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.65, margin: 0 }}>
            One client's main CTA is a text number. People text in all sorts of things, mostly about upcoming shows
            or where they'd like to see the comedian perform. The goal: build a more complete contact record, in
            particular the person's location (zip ideal), so the client can email and text them when the comedian
            is coming to their town, without the experience feeling clunky or forcing anyone through a form.
          </p>
        </div>

        {/* Three principles */}
        <div style={{ marginTop: 24, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          {[
            { Icon: Bot, title: "Read first, ask second", desc: "Every inbound text is scanned for a place before anyone is ever asked anything.", color: C.blue },
            { Icon: MessageCircle, title: "One soft ask, not a form", desc: "A single natural question folded into a real reply, capped once per 30 days.", color: C.amber },
            { Icon: MapPin, title: "Enrich quietly, notify precisely", desc: "Once a zip lands, the contact becomes targetable the moment a show is booked near them.", color: C.green },
          ].map((item, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, background: item.color + "18", display: "grid", placeItems: "center", marginBottom: 10 }}>
                <item.Icon size={16} style={{ color: item.color }} />
              </span>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{item.title}</div>
              <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Draft workflow diagram */}
        <Section title="The draft workflow, step by step" Icon={GitBranch} accent={C.coral}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 18, lineHeight: 1.6 }}>
            This is the actual shape of the build, node by node, exactly as it would sit inside GoHighLevel's
            workflow builder. Green branches are the quiet, low friction paths. Every path ends the same way: the
            customer's real question still gets answered.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
            {(Object.keys(kindStyle) as NodeKind[]).map((k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.sub }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: kindStyle[k].color, display: "inline-block" }} />
                {kindStyle[k].label}
              </div>
            ))}
          </div>
          <FlowDiagram nodes={mainFlow} />

          <div style={{ marginTop: 30, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ height: 1, flex: 1, background: C.border }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .6, textTransform: "uppercase" }}>Second workflow, runs independently</span>
            <div style={{ height: 1, flex: 1, background: C.border }} />
          </div>
          <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 18, lineHeight: 1.6 }}>
            This one doesn't touch the inbound conversation at all. It sits idle until a new stop is booked, then
            it's the reason the whole exercise above was worth doing.
          </p>
          <FlowDiagram nodes={notifyFlow} />
        </Section>

        {/* Stage tabs */}
        <div style={{ marginTop: 34 }}>
          <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>
            The reasoning behind each stage — click any to explore
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {stages.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "7px 13px", borderRadius: 10,
                  border: `1px solid ${active === s.id ? s.accent + "99" : C.border}`,
                  background: active === s.id ? s.accent + "18" : C.card,
                  color: active === s.id ? s.accent : C.sub,
                  fontSize: 13, fontWeight: active === s.id ? 700 : 400,
                  cursor: "pointer", transition: "all .18s",
                }}
              >
                <span style={{ fontSize: 14 }}>{s.emoji}</span>
                <span style={{ fontSize: 11, opacity: .6 }}>{s.num}.</span>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{ marginTop: 18 }}
          >
            <div style={{ background: C.card, border: `1px solid ${stage.accent}55`, borderRadius: 20, overflow: "hidden" }}>
              <div style={{ padding: "22px 24px 18px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span style={{ fontSize: 32, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{stage.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: stage.accent }}>
                      Stage {stage.num} of {stages.length}
                    </span>
                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 6px" }}>{stage.name}</h2>
                    <p style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: 1.6 }}>{stage.description}</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "grid", gap: 16, gridTemplateColumns: autoSteps.length && teamSteps.length ? "1fr 1fr" : "1fr" }}>
                  {autoSteps.length > 0 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                        <Zap size={14} style={{ color: C.green }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: .5 }}>Happens automatically</span>
                      </div>
                      <div style={{ display: "grid", gap: 7 }}>
                        {autoSteps.map((s, i) => (
                          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "9px 12px", background: C.green + "0C", border: `1px solid ${C.green}28`, borderRadius: 10 }}>
                            <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: 99, background: C.green + "22", color: C.green, fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center", marginTop: 1 }}>{i + 1}</span>
                            <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.55 }}>{s.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {teamSteps.length > 0 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                        <Users size={14} style={{ color: C.blue }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.blue, letterSpacing: .5 }}>Your team / setter does this</span>
                      </div>
                      <div style={{ display: "grid", gap: 7 }}>
                        {teamSteps.map((s, i) => (
                          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "9px 12px", background: C.blue + "0C", border: `1px solid ${C.blue}28`, borderRadius: 10 }}>
                            <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: 99, background: C.blue + "22", color: C.blue, fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center", marginTop: 1 }}>{i + 1}</span>
                            <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.55 }}>{s.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "flex-start", background: stage.accent + "12", border: `1px solid ${stage.accent}44`, borderRadius: 12, padding: "13px 16px" }}>
                  <ChevronRight size={16} style={{ color: stage.accent, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: stage.accent, letterSpacing: .5, textTransform: "uppercase" }}>Result</span>
                    <p style={{ fontSize: 14, color: C.ink, margin: "3px 0 0", lineHeight: 1.55 }}>{stage.result}</p>
                  </div>
                </div>

                {nextStage && (
                  <button
                    onClick={() => setActive(nextStage.id)}
                    style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 7, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 14px", color: C.sub, fontSize: 13, cursor: "pointer" }}
                  >
                    <span style={{ fontSize: 14 }}>{nextStage.emoji}</span>
                    Next: {nextStage.name}
                    <ChevronRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Sample conversations */}
        <Section title="What it looks like in a real conversation" Icon={MessageCircle} accent={C.coral}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                style={{
                  padding: "8px 14px", borderRadius: 10,
                  border: `1px solid ${scenario === s.id ? s.accent + "99" : C.border}`,
                  background: scenario === s.id ? s.accent + "18" : C.card,
                  color: scenario === s.id ? s.accent : C.sub,
                  fontSize: 13, fontWeight: scenario === s.id ? 700 : 400, cursor: "pointer",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={scenario}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}
            >
              <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                {activeScenario.bubbles.map((b, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: b.from === "customer" ? "flex-start" : b.from === "business" ? "flex-end" : "center",
                      maxWidth: b.from === "system" ? "100%" : "80%",
                      marginLeft: b.from === "business" ? "auto" : 0,
                    }}
                  >
                    {b.from === "system" ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: C.muted, background: C.bg2, border: `1px dashed ${C.border}`, borderRadius: 10, padding: "8px 12px" }}>
                        <Sparkles size={12} style={{ flexShrink: 0, color: activeScenario.accent }} />
                        {b.text}
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: 13.5, lineHeight: 1.5, padding: "9px 14px", borderRadius: 14,
                          background: b.from === "business" ? C.coral + "20" : C.bg2,
                          border: `1px solid ${b.from === "business" ? C.coral + "40" : C.border}`,
                          color: C.ink,
                          borderBottomRightRadius: b.from === "business" ? 4 : 14,
                          borderBottomLeftRadius: b.from === "customer" ? 4 : 14,
                        }}
                      >
                        {b.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: activeScenario.accent + "12", border: `1px solid ${activeScenario.accent}44`, borderRadius: 12, padding: "11px 14px" }}>
                <CircleCheck size={15} style={{ color: activeScenario.accent, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>{activeScenario.verdict}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </Section>

        {/* GHL build spec */}
        <Section title="The GHL build, exactly as it would be configured" Icon={Workflow} accent={C.blue}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16, lineHeight: 1.6 }}>
            Three moving pieces: the fields that hold the data, the tags that drive the branching, and the
            workflows that tie it together. Everything below is buildable directly in your existing subaccount
            structure, on top of whatever snapshot the client is already running.
          </p>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: .6, textTransform: "uppercase", marginBottom: 8 }}>
              Custom fields
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
              {customFields.map((f, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 200px 1fr", gap: 12, padding: "11px 16px", borderBottom: i < customFields.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{f.name}</span>
                  <span style={{ fontSize: 12.5, color: C.blue }}>{f.type}</span>
                  <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{f.purpose}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: .6, textTransform: "uppercase", marginBottom: 8 }}>
              <Tag size={13} /> Tags
            </div>
            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {tags.map((t, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.coral, marginBottom: 4, fontFamily: "monospace" }}>{t.name}</div>
                  <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>{t.when}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: .6, textTransform: "uppercase", marginBottom: 8 }}>
              <Send size={13} /> Workflows
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {workflowList.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px" }}>
                  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 99, background: C.cardHi, color: C.blue, fontSize: 11, fontWeight: 800, display: "grid", placeItems: "center", marginTop: 1 }}>{i + 1}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{w.name}</div>
                    <div style={{ fontSize: 12.5, color: C.blue, marginTop: 2 }}>Trigger: {w.trigger}</div>
                    <div style={{ fontSize: 13, color: C.sub, marginTop: 4, lineHeight: 1.5 }}>{w.does}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Compliance & principles */}
        <Section title="Why this stays clean, not clunky" Icon={ShieldCheck} accent={C.green}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {[
              { text: "Every contact already opted in by texting the number first, this adds nothing new to consent", Icon: CircleCheck },
              { text: "STOP / HELP keyword handling keeps working exactly as GHL runs it today, untouched by this build", Icon: CircleCheck },
              { text: "The zip ask fires once per 30 days per contact, hard capped in the workflow, not a rule someone has to remember", Icon: CircleCheck },
              { text: "Nothing is ever required, a contact can ignore the question forever and still get every normal reply", Icon: CircleCheck },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px" }}>
                <item.Icon size={16} style={{ color: C.green, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Reporting */}
        <Section title="How you'd know it's working" Icon={BarChart3} accent={C.purple}>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.65, margin: 0 }}>
            A simple dashboard view on top of the tags above answers the only questions that matter: what percentage
            of inbound texters have a known location, how often the soft ask actually gets answered, and how many
            contacts are sitting in Location: Unknown waiting on a human to decide whether it's worth a manual
            follow up. If the ask rate ever looks low, that's a wording problem to fix, not a system problem.
          </p>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>GHL Implementation · BVN</div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="mailto:bvnyson@gmail.com" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Mail size={14} /> bvnyson@gmail.com
            </a>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Megaphone size={14} /> bvnofficial.com
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

// ── Flow diagram ──────────────────────────────────────────────
function FlowDiagram({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {nodes.map((n, i) => {
        const style = kindStyle[n.kind];
        return (
          <div key={n.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            {i > 0 && <div style={{ width: 2, height: 22, background: C.border }} />}
            <div style={{ width: "100%", maxWidth: 580, background: C.card, border: `1px solid ${style.color}44`, borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 9, background: style.color + "1E", display: "grid", placeItems: "center" }}>
                  <n.Icon size={15} style={{ color: style.color }} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: .8, textTransform: "uppercase", color: style.color }}>{style.label}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>Step {n.id.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink, margin: "3px 0 4px" }}>{n.title}</div>
                  <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, margin: 0 }}>{n.detail}</p>
                </div>
              </div>
              {n.branches && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                  {n.branches.map((b) => (
                    <div
                      key={b.label}
                      style={{
                        fontSize: 12, lineHeight: 1.5, borderRadius: 10, padding: "8px 10px",
                        background: (b.label === "Yes" ? C.green : C.muted) + "12",
                        border: `1px solid ${(b.label === "Yes" ? C.green : C.muted)}30`,
                      }}
                    >
                      <span style={{ fontWeight: 800, color: b.label === "Yes" ? C.green : C.sub }}>{b.label === "Yes" ? "✓ Yes" : "✗ No"}</span>
                      <span style={{ color: C.sub }}> — {b.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────
function Section({ title, Icon, accent, children }: { title: string; Icon: typeof Workflow; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, fontWeight: 800, margin: "0 0 14px" }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: accent + "1A", display: "grid", placeItems: "center" }}>
          <Icon size={17} style={{ color: accent }} />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
