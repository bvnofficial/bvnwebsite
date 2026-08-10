"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, PhoneCall, UserPlus, Braces, Wrench, Server,
  MessageSquare, ShieldAlert, RefreshCw, Bot, CheckCircle2, Play, RotateCcw,
  X, ChevronRight, GitBranch, Zap, Snowflake, Workflow, PhoneMissed, Radio,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#070D1A", bg2: "#0D1730", card: "#111D3B", cardHi: "#152548",
  border: "#22345C", ink: "#EAF2FF", sub: "#9FB4DB", muted: "#5E7099",
  blue: "#3B82F6", sky: "#38BDF8", cyan: "#22D3EE", green: "#34D399",
  amber: "#FBBF24", orange: "#FB923C", violet: "#A78BFA", red: "#F87171",
};

// ── Integration steps ─────────────────────────────────────────
type Step = {
  id: string; label: string; tech: string; Icon: typeof PhoneCall; color: string;
  detail: string; meta: string; failDetail?: string; failMeta?: string;
};
const steps: Step[] = [
  { id: "call", label: "AI call comes in", tech: "Retell AI", Icon: PhoneCall, color: C.violet,
    detail: "A homeowner calls and the Retell voice agent handles it naturally: my AC stopped cooling, can someone come today?", meta: "inbound call handled by Retell" },
  { id: "capture", label: "Customer info captured", tech: "voice agent", Icon: UserPlus, color: C.sky,
    detail: "The agent collects and confirms the caller's name, phone, and service address, right on the call.", meta: "Maria Lopez · (512) 555-0148 · 210 Cedar St" },
  { id: "extract", label: "Structured data extracted", tech: "parse to JSON", Icon: Braces, color: C.cyan,
    detail: "The call is turned into a clean JSON payload, so nothing downstream is guessing from free text.", meta: '{ issue: "AC not cooling", urgency: "high", window: "today PM" }' },
  { id: "customer", label: "Customer created in ServiceTitan", tech: "POST /customers", Icon: Server, color: C.blue,
    detail: "A customer record is created, or matched if they already exist, through the ServiceTitan API.", meta: "customer_id 90412 created",
    failDetail: "ServiceTitan timed out. The system retries three times with backoff, and if it is still down, it does not drop the lead.", failMeta: "ST unreachable · retry 1/3 · 2/3 · 3/3" },
  { id: "job", label: "Job + appointment created", tech: "POST /jobs", Icon: Wrench, color: C.orange,
    detail: "A job and appointment are booked straight into ServiceTitan dispatch, on the right window and tagged by issue and urgency.", meta: "job_id J-4821 · today 2 to 4pm",
    failDetail: "Because ServiceTitan is down, the full payload is queued and the dispatcher is alerted, so it is created automatically the moment ServiceTitan recovers.", failMeta: "queued + dispatcher alerted · zero data lost" },
  { id: "confirm", label: "Confirm + safety net", tech: "SMS + fallback", Icon: MessageSquare, color: C.green,
    detail: "The customer gets an SMS confirmation. The fallback layer sits under every step so a bad API response never loses a booking.", meta: "SMS sent · integration healthy",
    failDetail: "The customer still gets a text that a tech will confirm shortly, so the caller experience holds even during an outage.", failMeta: "holding SMS sent · nothing lost" },
];
const stFallbackSteps = new Set(["customer", "job", "confirm"]);

// ── Call log ──────────────────────────────────────────────────
type Log = {
  id: string; name: string; kind: string; outcome: string; outColor: string;
  transcript: { who: "AI" | "Caller"; text: string }[]; json: string; st: string;
};
const logs: Log[] = [
  { id: "g1", name: "Maria Lopez", kind: "AC not cooling", outcome: "Job created", outColor: C.green,
    transcript: [{ who: "Caller", text: "My AC stopped cooling, can someone come today?" }, { who: "AI", text: "Sorry to hear that Maria. I have a tech window today 2 to 4pm, shall I book it?" }, { who: "Caller", text: "Yes please." }],
    json: '{ issue: "AC not cooling", urgency: "high", window: "today 2-4pm" }', st: "New job J-4821 created in ServiceTitan, scheduled today 2-4pm, tagged AC / high." },
  { id: "g2", name: "Frank D.", kind: "No heat, urgent", outcome: "Priority dispatch", outColor: C.orange,
    transcript: [{ who: "Caller", text: "No heat at all and it is freezing, I have a newborn." }, { who: "AI", text: "That is a priority, Frank. I am booking the next available tech and flagging it urgent." }],
    json: '{ issue: "no heat", urgency: "critical", flags: ["priority"] }', st: "Priority job created, next available tech dispatched, urgent tag applied." },
  { id: "g3", name: "Tanya R.", kind: "Missed call", outcome: "Follow-up automation", outColor: C.cyan,
    transcript: [{ who: "AI", text: "Missed Tanya's call. Sending an SMS with a booking link and queuing a callback." }],
    json: '{ event: "missed_call", action: "sms + callback" }', st: "No job yet. SMS booking link sent, AI callback scheduled, lead kept warm." },
  { id: "g4", name: "Owens Cafe", kind: "Tech support / logging", outcome: "Logged + tagged", outColor: C.violet,
    transcript: [{ who: "Caller", text: "The thermostat wiring looks off after the last visit." }, { who: "AI", text: "Thanks, I am logging this against your last job and flagging it for the office." }],
    json: '{ type: "support", link_job: "J-4790", tag: "callback-review" }', st: "Issue logged against the existing job, tagged for review, routed to the office." },
  { id: "g5", name: "Del Rio", kind: "During ST outage", outcome: "Fallback queued", outColor: C.amber,
    transcript: [{ who: "Caller", text: "I want a quote to install a new AC unit." }, { who: "AI", text: "Absolutely, I have your details and someone will confirm shortly." }],
    json: '{ issue: "AC install quote", status: "queued" }', st: "ServiceTitan was down, so the job was queued and the dispatcher alerted. Auto-created on recovery. No lead lost." },
];

export default function ServiceTitanDispatch() {
  const [view, setView] = useState<"flow" | "calls" | "build">("flow");
  const [active, setActive] = useState(0);
  const [failMode, setFailMode] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = logs.find((l) => l.id === openId) ?? null;
  const done = active >= steps.length;
  const run = () => { if (done) { setActive(0); return; } setActive((n) => Math.min(n + 1, steps.length)); };
  const showFail = (s: Step) => failMode && stFallbackSteps.has(s.id);

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes ring{0%{transform:scale(.85);opacity:.7}100%{transform:scale(1.9);opacity:0}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.sky, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.sky, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · HVAC AI + ServiceTitan
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            AI call comes in, and a job appears in ServiceTitan automatically
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 810, margin: 0, lineHeight: 1.65 }}>
            This is the exact flow you described. Run it and watch a Retell call become a structured payload and then a
            new customer and job inside ServiceTitan. Flip on the outage simulation to see the fallback that keeps a
            failed integration from ever losing a booking. That is the difference between a reliable system and a
            fragile zap. I have built on Retell and integrated ServiceTitan before, so this is my actual lane.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "flow", label: "Run the Flow", Icon: Workflow },
            { id: "calls", label: "Call Log", Icon: PhoneCall },
            { id: "build", label: "Architecture", Icon: GitBranch },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.blue : "transparent", color: view === v.id ? "#04102B" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* FLOW */}
            {view === "flow" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "13px 16px", marginBottom: 14 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flex: 1, minWidth: 200 }}>
                    <ShieldAlert size={16} style={{ color: failMode ? C.amber : C.muted }} />
                    <span style={{ fontSize: 12.5, color: C.sub }}>{failMode ? "Outage simulation ON: ServiceTitan will fail mid-run so you can see the fallback." : "Integration healthy. Flip the switch to simulate a ServiceTitan outage."}</span>
                  </span>
                  <button onClick={() => { setFailMode((f) => !f); setActive(0); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 9, border: `1px solid ${failMode ? C.amber : C.border}`, cursor: "pointer",
                      background: failMode ? C.amber + "1E" : "transparent", color: failMode ? C.amber : C.sub, fontSize: 12, fontWeight: 700 }}>
                    {failMode ? "Outage: ON" : "Simulate outage"}
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <Zap size={17} style={{ color: C.sky }} />
                  <span style={{ fontSize: 13, color: C.sub, flex: 1, minWidth: 200 }}>
                    {done ? (failMode ? "Handled during an outage with zero data lost. Run again?" : "Call to booked ServiceTitan job, no human touched it. Run again?") : active === 0 ? "Step through the integration one stage at a time." : "Passing data to the next system..."}
                  </span>
                  <button onClick={run}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: done ? C.cardHi : C.blue, color: done ? C.ink : "#04102B", fontSize: 12.5, fontWeight: 700 }}>
                    {done ? <><RotateCcw size={14} /> Run again</> : <><Play size={14} /> {active === 0 ? "Start the flow" : "Next step"}</>}
                  </button>
                </div>

                <div style={{ display: "grid", gap: 0 }}>
                  {steps.map((s, i) => {
                    const state = i < active ? "done" : i === active ? "current" : "idle";
                    const lit = state !== "idle";
                    const fail = showFail(s) && lit;
                    const accent = fail ? C.amber : s.color;
                    return (
                      <div key={s.id}>
                        <div style={{ display: "flex", gap: 13, alignItems: "flex-start",
                          background: state === "current" ? C.cardHi : C.card,
                          border: `1px solid ${lit ? accent + "66" : C.border}`, borderRadius: 13, padding: "13px 15px", transition: "all .25s" }}>
                          <span style={{ position: "relative", width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: lit ? accent + "22" : C.bg2, display: "grid", placeItems: "center" }}>
                            {state === "current" && <span style={{ position: "absolute", inset: 0, borderRadius: 11, border: `2px solid ${accent}`, animation: "ring 1.2s ease-out infinite" }} />}
                            {state === "done" ? (fail ? <ShieldAlert size={20} style={{ color: accent }} /> : <CheckCircle2 size={20} style={{ color: accent }} />) : <s.Icon size={19} style={{ color: lit ? accent : C.muted }} />}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: lit ? C.ink : C.muted }}>{s.label}</span>
                              <span style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", color: lit ? accent : C.muted, background: (lit ? accent : C.muted) + "1A", borderRadius: 6, padding: "2px 7px" }}>{s.tech}</span>
                              {fail && state === "current" && <span style={{ fontSize: 10.5, fontWeight: 700, color: C.amber, display: "inline-flex", alignItems: "center", gap: 4 }}><RefreshCw size={11} /> fallback</span>}
                            </div>
                            {lit && <p style={{ fontSize: 12.5, color: C.sub, margin: "6px 0 0", lineHeight: 1.55 }}>{fail ? s.failDetail : s.detail}</p>}
                            {state === "done" && (
                              <div style={{ fontSize: 11.5, fontFamily: "ui-monospace, monospace", color: accent, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5 }}>
                                {fail ? <ShieldAlert size={12} /> : <CheckCircle2 size={12} />} {fail ? s.failMeta : s.meta}
                              </div>
                            )}
                          </div>
                        </div>
                        {i < steps.length - 1 && <div style={{ height: 16, marginLeft: 34, borderLeft: `2px dashed ${i < active ? (showFail(steps[i]) ? C.amber : steps[i].color) + "88" : C.border}` }} />}
                      </div>
                    );
                  })}
                </div>

                {done && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", background: (failMode ? C.amber : C.green) + "12", border: `1px solid ${(failMode ? C.amber : C.green)}44`, borderRadius: 12, padding: "13px 16px", marginTop: 16 }}>
                    {failMode ? <ShieldAlert size={18} style={{ color: C.amber }} /> : <CheckCircle2 size={18} style={{ color: C.green }} />}
                    <span style={{ fontSize: 13.5, color: C.ink }}>
                      {failMode
                        ? <><b>ServiceTitan was unreachable, and not one lead was lost.</b> Retried, queued, dispatcher alerted, customer still texted. That is a system, not a fragile zap.</>
                        : <><b>AC not cooling became job J-4821 in ServiceTitan, scheduled today 2 to 4pm.</b> Call to booked job, fully automated.</>}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* CALLS */}
            {view === "calls" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 14, lineHeight: 1.6 }}>
                  Every AI call is logged with the structured data it produced and the exact ServiceTitan action taken.
                  Bookings, priority dispatch, missed call follow up, support logging, and a fallback during an outage.
                </p>
                <div style={{ display: "grid", gap: 9 }}>
                  {logs.map((l) => (
                    <button key={l.id} onClick={() => setOpenId(l.id)}
                      style={{ display: "flex", gap: 12, alignItems: "center", width: "100%", textAlign: "left", cursor: "pointer",
                        background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: "12px 15px" }}>
                      <span style={{ width: 36, height: 36, borderRadius: 10, background: l.outColor + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        {l.kind === "Missed call" ? <PhoneMissed size={16} style={{ color: l.outColor }} /> : l.outcome === "Fallback queued" ? <ShieldAlert size={16} style={{ color: l.outColor }} /> : <Snowflake size={16} style={{ color: l.outColor }} />}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700 }}>{l.name}</span>
                          <span style={{ fontSize: 11, color: C.muted }}>{l.kind}</span>
                        </div>
                        <div style={{ fontSize: 11.5, fontFamily: "ui-monospace, monospace", color: C.muted, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.json}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: l.outColor, background: l.outColor + "18", border: `1px solid ${l.outColor}3A`, borderRadius: 7, padding: "4px 9px", flexShrink: 0 }}>{l.outcome}</span>
                      <ChevronRight size={15} style={{ color: C.muted, flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>Click any call for the transcript, the structured JSON, and the ServiceTitan action.</p>
              </div>
            )}

            {/* BUILD */}
            {view === "build" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  Here is how I would build this to be scalable and reliable, and where I would use Make or n8n versus
                  custom code. This is the systems thinking you asked for, not a pile of brittle zaps.
                </p>
                <div style={{ display: "flex", alignItems: "stretch", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                  {[
                    { Icon: PhoneCall, t: "Retell AI", d: "Voice agent handles the call, captures info, and posts the transcript over a webhook", color: C.violet },
                    { Icon: Braces, t: "Parse + transform", d: "Make or n8n, with JavaScript where needed, turns the call into clean JSON", color: C.cyan },
                    { Icon: Server, t: "ServiceTitan API", d: "Create or match the customer, then create the job and appointment", color: C.blue },
                    { Icon: ShieldAlert, t: "Fallback layer", d: "Retries, a queue, and dispatcher alerts so a failure never loses a booking", color: C.amber },
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
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { Icon: RefreshCw, t: "Reliable, not fragile", d: "Idempotent writes so a retry never double books, backoff on rate limits, and a dead letter queue so nothing silently disappears." },
                    { Icon: Zap, t: "Built to scale and be reused", d: "The Retell to ServiceTitan flow is templated so a new location or client is a config change, not a rebuild. That is the reusable system your bonus rewards." },
                    { Icon: Bot, t: "Better agent, better data", d: "I tighten the Retell prompts and the extraction so the JSON is clean, which is what makes the ServiceTitan side accurate and low latency." },
                    { Icon: Server, t: "I have done this before", d: "I built a complex voice solution on Retell, and I have integrated ServiceTitan with other systems and built workflows around it. This is my actual lane, not a tutorial." },
                  ].map((x, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, background: C.sky + "1A", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <x.Icon size={15} style={{ color: C.sky }} />
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
            <div style={{ fontSize: 12, color: C.muted }}>Retell · ServiceTitan · Make / n8n · APIs · BVN</div>
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

      {/* Call detail modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenId(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(3,7,18,0.76)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
            <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 470, maxHeight: "86vh", overflowY: "auto", background: C.card, border: `1px solid ${C.blue}55`, borderRadius: 18 }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 10, position: "sticky", top: 0, background: C.card }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 800 }}>{open.name}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{open.kind}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: open.outColor, background: open.outColor + "18", border: `1px solid ${open.outColor}3A`, borderRadius: 6, padding: "3px 8px" }}>{open.outcome}</span>
                <button onClick={() => setOpenId(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X size={18} /></button>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8 }}>Call transcript</div>
                <div style={{ display: "grid", gap: 7, marginBottom: 14 }}>
                  {open.transcript.map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.who === "AI" ? "row" : "row-reverse" }}>
                      <span style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: (m.who === "AI" ? C.violet : C.blue) + "22", display: "grid", placeItems: "center" }}>
                        {m.who === "AI" ? <Bot size={13} style={{ color: C.violet }} /> : <Radio size={12} style={{ color: C.blue }} />}
                      </span>
                      <span style={{ fontSize: 12.5, lineHeight: 1.5, color: C.ink, background: m.who === "AI" ? C.bg2 : C.cardHi, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 11px", maxWidth: "82%" }}>{m.text}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 7 }}>Structured output</div>
                <div style={{ background: "#0A0F1E", border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px", fontFamily: "ui-monospace, monospace", fontSize: 12, color: C.cyan, marginBottom: 14, overflowX: "auto" }}>{open.json}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 7, display: "flex", alignItems: "center", gap: 6 }}>
                  <Server size={13} style={{ color: C.blue }} /> ServiceTitan action
                </div>
                <div style={{ background: C.blue + "10", border: `1px solid ${C.blue}33`, borderRadius: 10, padding: "11px 13px", fontSize: 12.5, color: C.ink, lineHeight: 1.55 }}>{open.st}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
