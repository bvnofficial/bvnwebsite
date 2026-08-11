"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, PhoneOutgoing, UserCheck, CalendarClock,
  CalendarDays, Braces, Database, CalendarPlus, Ban, ShieldBan, RefreshCw,
  ShieldAlert, Bot, CheckCircle2, Play, RotateCcw, X, ChevronRight,
  GitBranch, Workflow, PhoneCall,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#08130F", bg2: "#0C1E17", card: "#0F261C", cardHi: "#123024",
  border: "#1F3E30", ink: "#EAFBF3", sub: "#9ED4BB", muted: "#5F8C74",
  teal: "#2DD4BF", green: "#34D399", violet: "#A78BFA", cyan: "#22D3EE",
  amber: "#FBBF24", red: "#F87171", blue: "#60A5FA",
};

type Step = { id: string; label: string; tech: string; Icon: typeof PhoneCall; color: string; detail: string; meta: string; fail?: boolean };

const base: Step[] = [
  { id: "dial", label: "Outbound call placed", tech: "Retell + Twilio", Icon: PhoneOutgoing, color: C.violet,
    detail: "Retell dials the business over Twilio, inside the contact's local calling hours, with the recording disclosure at the top.", meta: "calling Summit Manufacturing, HR line" },
  { id: "identify", label: "Identify the benefits owner", tech: "voice agent", Icon: UserCheck, color: C.teal,
    detail: "The agent gets past the gatekeeper and reaches the person who actually handles employee benefits, capturing their name and title.", meta: "reached: Dana Cole, HR Manager" },
];
const askSteps: Step[] = [
  { id: "review", label: "Ask: benefits review timing", tech: "question 1", Icon: CalendarClock, color: C.cyan,
    detail: "When do you review your employee benefits each year? The agent listens and confirms.", meta: "answer: every Q1 (January)" },
  { id: "oe", label: "Ask: open enrollment timing", tech: "question 2", Icon: CalendarDays, color: C.blue,
    detail: "And when do you run open enrollment? Adaptive follow up if the answer is vague.", meta: "answer: Nov 1 to 15" },
  { id: "extract", label: "Extract to structured JSON", tech: "LLM schema", Icon: Braces, color: C.amber,
    detail: "The transcript and live tool calls become a validated JSON payload mapped to GoHighLevel fields. Nothing is guessed.", meta: '{ review:"Q1", open_enrollment:"Nov 1-15", owner:"Dana Cole" }' },
];

const scenarios: Record<string, { label: string; accent: string; steps: Step[]; banner: React.ReactNode }> = {
  captured: {
    label: "Answers captured", accent: C.green,
    steps: [...base, ...askSteps,
      { id: "update", label: "Update GoHighLevel", tech: "API v2", Icon: Database, color: C.teal,
        detail: "Custom fields written, the opportunity moves to Answers Captured, and the contact is tagged. Idempotent, keyed on the call attempt id.", meta: "fields updated · stage: Answers Captured" },
      { id: "followup", label: "Schedule follow up", tech: "GHL calendar", Icon: CalendarPlus, color: C.green,
        detail: "Books a callback near the review window so the business is re engaged at exactly the right time, which is the real payoff.", meta: "follow up set · pre-enrollment, Oct 2027" },
    ],
    banner: <><b>Dana Cole reached.</b> Benefits review (Q1) and open enrollment (Nov 1 to 15) captured, written to GoHighLevel, and a pre-enrollment follow up booked. No human touched it.</>,
  },
  suppress: {
    label: "Do not call", accent: C.red,
    steps: [...base,
      { id: "optout", label: "Opt out detected", tech: "intent", Icon: Ban, color: C.amber,
        detail: "Dana says please remove us from your list. The agent stops immediately, no pushback, no last pitch.", meta: "intent: do_not_call", fail: true },
      { id: "suppress", label: "Permanent suppression", tech: "DND + tag", Icon: ShieldBan, color: C.red,
        detail: "Do Not Disturb is set and a do-not-call tag applied in the same step. The pre dial check reads suppression first on every future run.", meta: "DND ON · tag: do-not-call · permanent", fail: true },
    ],
    banner: <><b>Opt out honored instantly.</b> Do Not Disturb set and tagged. This contact is structurally impossible to call again on this or any future campaign.</>,
  },
  outage: {
    label: "GHL outage", accent: C.amber,
    steps: [...base, ...askSteps,
      { id: "updatefail", label: "Update GoHighLevel", tech: "API v2", Icon: Database, color: C.amber,
        detail: "The GoHighLevel API is rate limited and returns errors. The write does not just fail and drop the answer.", meta: "GHL API 503 · retry 1/3 · 2/3 · 3/3", fail: true },
      { id: "reconcile", label: "Fallback: queue + reconcile", tech: "n8n + store", Icon: RefreshCw, color: C.amber,
        detail: "The captured answer is written to the operational store, and a reconciler syncs it into GoHighLevel the moment it recovers. Nothing is lost.", meta: "answer queued · reconciled on recovery · zero data lost", fail: true },
    ],
    banner: <><b>GoHighLevel was unreachable, and the answer was not lost.</b> Queued, retried, and reconciled into GHL on recovery. That is reliability, not a fragile zap.</>,
  },
};

// ── Pipeline sample ───────────────────────────────────────────
const stageColor: Record<string, string> = {
  "Right Party Reached": C.cyan, "Answers Captured": C.green, "Callback Scheduled": C.blue,
  Suppressed: C.red, "Bad Number": C.muted,
};
type Rec = { id: string; name: string; owner: string; stage: string; review: string; oe: string; dnd: boolean; transcript: { who: "AI" | "Contact"; text: string }[] };
const records: Rec[] = [
  { id: "r1", name: "Acme Logistics", owner: "Dana Cole, HR Mgr", stage: "Answers Captured", review: "Q1 (January)", oe: "Nov 1 to 15", dnd: false,
    transcript: [{ who: "AI", text: "Hi, could I reach whoever handles your employee benefits?" }, { who: "Contact", text: "That's me, Dana." }, { who: "AI", text: "Great. When do you review your benefits, and when is open enrollment?" }, { who: "Contact", text: "We review in January, enrollment is early November." }] },
  { id: "r2", name: "Summit Manufacturing", owner: "reaching...", stage: "Right Party Reached", review: "pending", oe: "pending", dnd: false,
    transcript: [{ who: "AI", text: "Hi, is the person who manages HR benefits available?" }, { who: "Contact", text: "Let me transfer you." }] },
  { id: "r3", name: "Bright Dental Group", owner: "Marco Reyes, Owner", stage: "Callback Scheduled", review: "unsure", oe: "unsure", dnd: false,
    transcript: [{ who: "Contact", text: "I'm with a patient, can you try me next week?" }, { who: "AI", text: "Of course, I'll call Tuesday at 10. Sending a text so you have us." }] },
  { id: "r4", name: "Northgate Retail", owner: "front desk", stage: "Suppressed", review: "n/a", oe: "n/a", dnd: true,
    transcript: [{ who: "Contact", text: "Please take us off your list." }, { who: "AI", text: "Absolutely, done. You will not be called again. Have a good day." }] },
  { id: "r5", name: "Harbor Freight Co", owner: "Lena Ortiz, Ops", stage: "Answers Captured", review: "Q4", oe: "December", dnd: false,
    transcript: [{ who: "AI", text: "When do you review benefits and run enrollment?" }, { who: "Contact", text: "We look at it in Q4, enrollment is December." }] },
  { id: "r6", name: "Vertex Foods", owner: "unknown", stage: "Bad Number", review: "n/a", oe: "n/a", dnd: false,
    transcript: [{ who: "AI", text: "(number disconnected, classified and flagged, not retried)" }] },
];

export default function GhlVoiceBenefits() {
  const [view, setView] = useState<"run" | "pipeline" | "arch">("run");
  const [scn, setScn] = useState<"captured" | "suppress" | "outage">("captured");
  const [active, setActive] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = records.find((r) => r.id === openId) ?? null;

  const steps = scenarios[scn].steps;
  const done = active >= steps.length;
  const run = () => { if (done) { setActive(0); return; } setActive((n) => Math.min(n + 1, steps.length)); };
  const pickScn = (s: typeof scn) => { setScn(s); setActive(0); };

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes ring{0%{transform:scale(.85);opacity:.7}100%{transform:scale(1.9);opacity:0}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.teal, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Architecture Demo · GHL AI Voice Agent
          </div>
          <h1 style={{ fontSize: 27, lineHeight: 1.22, margin: "10px 0 8px", fontWeight: 800 }}>
            AI voice agent for benefits discovery at scale, on GoHighLevel
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 820, margin: 0, lineHeight: 1.65 }}>
            The scenario: 10,000 businesses, call each one, find the benefits owner, capture when they review benefits and
            run open enrollment, update the CRM, schedule a follow up, and permanently suppress on request. This is a
            runnable model of my GoHighLevel architecture. Pick an outcome and run the call, including the opt out and a
            GoHighLevel outage, then see the pipeline and the data model.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "run", label: "Run the Call", Icon: Workflow },
            { id: "pipeline", label: "Pipeline", Icon: Database },
            { id: "arch", label: "Architecture & Data", Icon: GitBranch },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.teal : "transparent", color: view === v.id ? "#04231C" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* RUN */}
            {view === "run" && (
              <div>
                {/* scenario selector */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  {(["captured", "suppress", "outage"] as const).map((s) => (
                    <button key={s} onClick={() => pickScn(s)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 700,
                        background: scn === s ? scenarios[s].accent : C.card, color: scn === s ? "#04140F" : C.sub, border: `1px solid ${scn === s ? scenarios[s].accent : C.border}` }}>
                      {s === "captured" ? <CheckCircle2 size={13} /> : s === "suppress" ? <ShieldBan size={13} /> : <ShieldAlert size={13} />}
                      {scenarios[s].label}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <PhoneCall size={17} style={{ color: scenarios[scn].accent }} />
                  <span style={{ fontSize: 13, color: C.sub, flex: 1, minWidth: 200 }}>
                    {done ? "Run complete. Switch outcome above, or run it again." : active === 0 ? `Outcome: ${scenarios[scn].label}. Step through the call.` : "Passing to the next step..."}
                  </span>
                  <button onClick={run}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: done ? C.cardHi : scenarios[scn].accent, color: done ? C.ink : "#04140F", fontSize: 12.5, fontWeight: 700 }}>
                    {done ? <><RotateCcw size={14} /> Run again</> : <><Play size={14} /> {active === 0 ? "Place the call" : "Next step"}</>}
                  </button>
                </div>

                <div style={{ display: "grid", gap: 0 }}>
                  {steps.map((s, i) => {
                    const state = i < active ? "done" : i === active ? "current" : "idle";
                    const lit = state !== "idle";
                    const accent = s.fail ? scenarios[scn].accent : s.color;
                    return (
                      <div key={s.id}>
                        <div style={{ display: "flex", gap: 13, alignItems: "flex-start",
                          background: state === "current" ? C.cardHi : C.card,
                          border: `1px solid ${lit ? accent + "66" : C.border}`, borderRadius: 13, padding: "13px 15px", transition: "all .25s" }}>
                          <span style={{ position: "relative", width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: lit ? accent + "22" : C.bg2, display: "grid", placeItems: "center" }}>
                            {state === "current" && <span style={{ position: "absolute", inset: 0, borderRadius: 11, border: `2px solid ${accent}`, animation: "ring 1.2s ease-out infinite" }} />}
                            {state === "done" ? (s.fail ? <ShieldAlert size={20} style={{ color: accent }} /> : <CheckCircle2 size={20} style={{ color: accent }} />) : <s.Icon size={19} style={{ color: lit ? accent : C.muted }} />}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: lit ? C.ink : C.muted }}>{s.label}</span>
                              <span style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", color: lit ? accent : C.muted, background: (lit ? accent : C.muted) + "1A", borderRadius: 6, padding: "2px 7px" }}>{s.tech}</span>
                            </div>
                            {lit && <p style={{ fontSize: 12.5, color: C.sub, margin: "6px 0 0", lineHeight: 1.55 }}>{s.detail}</p>}
                            {state === "done" && (
                              <div style={{ fontSize: 11.5, fontFamily: "ui-monospace, monospace", color: accent, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5 }}>
                                {s.fail ? <ShieldAlert size={12} /> : <CheckCircle2 size={12} />} {s.meta}
                              </div>
                            )}
                          </div>
                        </div>
                        {i < steps.length - 1 && <div style={{ height: 16, marginLeft: 34, borderLeft: `2px dashed ${i < active ? scenarios[scn].accent + "88" : C.border}` }} />}
                      </div>
                    );
                  })}
                </div>

                {done && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", background: scenarios[scn].accent + "12", border: `1px solid ${scenarios[scn].accent}44`, borderRadius: 12, padding: "13px 16px", marginTop: 16 }}>
                    {scn === "captured" ? <CheckCircle2 size={18} style={{ color: scenarios[scn].accent }} /> : scn === "suppress" ? <ShieldBan size={18} style={{ color: scenarios[scn].accent }} /> : <ShieldAlert size={18} style={{ color: scenarios[scn].accent }} />}
                    <span style={{ fontSize: 13.5, color: C.ink }}>{scenarios[scn].banner}</span>
                  </div>
                )}
              </div>
            )}

            {/* PIPELINE */}
            {view === "pipeline" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 14, lineHeight: 1.6 }}>
                  All 10,000 live on one GoHighLevel pipeline, so management sees exactly where every business sits.
                  Suppressed contacts carry Do Not Disturb and can never be dialed again.
                </p>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                  {records.map((r, i) => (
                    <button key={r.id} onClick={() => setOpenId(r.id)}
                      style={{ display: "flex", gap: 12, alignItems: "center", width: "100%", textAlign: "left", cursor: "pointer",
                        background: "transparent", border: "none", padding: "12px 15px", borderTop: i ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ width: 34, height: 34, borderRadius: 9, background: stageColor[r.stage] + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        {r.dnd ? <ShieldBan size={16} style={{ color: C.red }} /> : <PhoneCall size={15} style={{ color: stageColor[r.stage] }} />}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{r.name}</div>
                        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{r.owner}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: stageColor[r.stage], background: stageColor[r.stage] + "18", border: `1px solid ${stageColor[r.stage]}3A`, borderRadius: 7, padding: "4px 9px", flexShrink: 0 }}>{r.stage}</span>
                      <ChevronRight size={15} style={{ color: C.muted, flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>Click any record for the transcript and the fields written back to GoHighLevel.</p>
              </div>
            )}

            {/* ARCH */}
            {view === "arch" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  GoHighLevel is the system of record and automation hub. Two supporting pieces give it the reliability
                  and conversation control that 10,000 records need.
                </p>
                <div style={{ display: "flex", alignItems: "stretch", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                  {[
                    { Icon: PhoneOutgoing, t: "Retell + Twilio", d: "The AI calls, navigates the gatekeeper, and runs the script with tool calling", color: C.violet },
                    { Icon: Workflow, t: "n8n + queue", d: "Paces the 10,000, enforces windows + suppression, retries, idempotent write back", color: C.cyan },
                    { Icon: Braces, t: "LLM extraction", d: "Transcript to schema-bound JSON, validated with a confidence gate", color: C.amber },
                    { Icon: Database, t: "GoHighLevel", d: "Contacts, custom fields, DND, pipeline, calendars, dashboards", color: C.teal },
                  ].map((s, i, arr) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 175px" }}>
                      <div style={{ flex: 1, background: C.card, border: `1px solid ${s.color}44`, borderRadius: 12, padding: "12px 14px" }}>
                        <span style={{ width: 28, height: 28, borderRadius: 8, background: s.color + "1E", display: "grid", placeItems: "center", marginBottom: 8 }}>
                          <s.Icon size={15} style={{ color: s.color }} />
                        </span>
                        <div style={{ fontSize: 12.5, fontWeight: 700 }}>{s.t}</div>
                        <div style={{ fontSize: 11.5, color: C.sub, marginTop: 2, lineHeight: 1.45 }}>{s.d}</div>
                      </div>
                      {i < arr.length - 1 && <ChevronRight size={16} style={{ color: C.muted, flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginBottom: 14 }}>
                  {[
                    { t: "Contact custom fields", items: ["benefits_contact_name / title", "benefits_review_period", "open_enrollment_window", "last_call_outcome", "next_followup_date", "ai_confidence", "call_attempt_id (idempotency)"], color: C.teal },
                    { t: "Tags, DND & pipeline", items: ["Do Not Disturb = permanent suppression", "tags: right-party, needs-review, do-not-call", "pipeline: To Call to Answers Captured", "Suppressed / Bad Number stages", "calendar task for the follow up"], color: C.green },
                  ].map((b, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px 15px" }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: b.color, marginBottom: 9 }}>{b.t}</div>
                      <div style={{ display: "grid", gap: 6 }}>
                        {b.items.map((it, j) => (
                          <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: C.sub }}>
                            <CheckCircle2 size={13} style={{ color: b.color, flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontFamily: it.includes("_") ? "ui-monospace, monospace" : "inherit" }}>{it}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { Icon: ShieldBan, t: "Suppression is structural", d: "Opt out sets DND + a do-not-call tag together, and the pre dial check reads suppression first, so a suppressed contact is impossible to call again on any future run." },
                    { Icon: RefreshCw, t: "Reliable, not fragile", d: "If GoHighLevel is rate limited or down, answers write to the store first and reconcile into GHL on recovery. Idempotent writes keyed on call_attempt_id never double post." },
                    { Icon: Bot, t: "Never guesses", d: "Low confidence extractions are tagged needs-review instead of writing a wrong date, and unclear calls schedule a callback rather than record a bad answer." },
                  ].map((x, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, background: C.teal + "1A", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <x.Icon size={15} style={{ color: C.teal }} />
                      </span>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{x.t}</div>
                        <p style={{ fontSize: 12.5, color: C.sub, margin: "3px 0 0", lineHeight: 1.5 }}>{x.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 42, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>GoHighLevel · Retell Voice AI · n8n · APIs · BVN</div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="mailto:bvn@bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Mail size={14} /> bvn@bvnofficial.com
            </a>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Megaphone size={14} /> bvnofficial.com
            </Link>
          </div>
        </div>
      </div>

      {/* Record modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenId(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(3,10,7,0.76)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
            <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 470, maxHeight: "86vh", overflowY: "auto", background: C.card, border: `1px solid ${C.teal}55`, borderRadius: 18 }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 10, position: "sticky", top: 0, background: C.card }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 800 }}>{open.name}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{open.owner}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: stageColor[open.stage], background: stageColor[open.stage] + "18", border: `1px solid ${stageColor[open.stage]}3A`, borderRadius: 6, padding: "3px 8px" }}>{open.stage}</span>
                <button onClick={() => setOpenId(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X size={18} /></button>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8 }}>Call transcript</div>
                <div style={{ display: "grid", gap: 7, marginBottom: 14 }}>
                  {open.transcript.map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.who === "AI" ? "row" : "row-reverse" }}>
                      <span style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: (m.who === "AI" ? C.violet : C.teal) + "22", display: "grid", placeItems: "center" }}>
                        {m.who === "AI" ? <Bot size={13} style={{ color: C.violet }} /> : <UserCheck size={12} style={{ color: C.teal }} />}
                      </span>
                      <span style={{ fontSize: 12.5, lineHeight: 1.5, color: C.ink, background: m.who === "AI" ? C.bg2 : C.cardHi, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 11px", maxWidth: "82%" }}>{m.text}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 7, display: "flex", alignItems: "center", gap: 6 }}>
                  <Database size={13} style={{ color: C.teal }} /> Written to GoHighLevel
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {[
                    { k: "Benefits review", v: open.review },
                    { k: "Open enrollment", v: open.oe },
                    { k: "Do Not Disturb", v: open.dnd ? "ON (do-not-call)" : "off" },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 12px" }}>
                      <span style={{ fontSize: 12, color: C.muted }}>{f.k}</span>
                      <span style={{ fontSize: 12, color: f.k === "Do Not Disturb" && open.dnd ? C.red : C.ink, fontWeight: 700, fontFamily: "ui-monospace, monospace" }}>{f.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
