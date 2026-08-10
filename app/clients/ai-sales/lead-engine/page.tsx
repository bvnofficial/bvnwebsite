"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, Phone, PhoneCall, CalendarCheck, MessageSquare,
  Filter, Zap, Bot, Database, CheckCircle2, Circle, ChevronRight, X, Play,
  RotateCcw, Target, Clock, UserPlus, GitBranch, Sparkles, ListChecks,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#07120E", bg2: "#0C1D16", card: "#0F241B", cardHi: "#123024",
  border: "#1E3B2E", ink: "#EAFBF2", sub: "#9ED0B7", muted: "#5F8873",
  green: "#34D399", emerald: "#10B981", cyan: "#22D3EE", amber: "#FBBF24",
  coral: "#FB7185", blue: "#60A5FA", violet: "#A78BFA",
};

// ── The pipeline the system runs ──────────────────────────────
type Step = { id: string; label: string; Icon: typeof Phone; color: string; action: string; detail: string };
const steps: Step[] = [
  { id: "capture", label: "Lead captured", Icon: UserPlus, color: C.blue,
    action: "New lead hits the funnel", detail: "Jordan fills out the landing page from a Facebook ad. The lead lands in the CRM, gets tagged, and starts a timer, all in the same second." },
  { id: "call", label: "AI voice agent calls", Icon: PhoneCall, color: C.violet,
    action: "AI dials in under 60 seconds", detail: "An AI voice agent calls Jordan while he is still on the page. It speaks naturally, answers his questions, and never leaves a lead sitting cold." },
  { id: "qualify", label: "Qualified", Icon: Target, color: C.amber,
    action: "Budget, timeline, and intent scored", detail: "The agent asks the qualifying questions, scores the answers, and decides Jordan is a real, ready buyer worth a booked call." },
  { id: "followup", label: "Follow up fires", Icon: MessageSquare, color: C.cyan,
    action: "SMS and email sequence on standby", detail: "If a lead does not answer, the system texts and emails on a timed sequence and retries the call, so nothing slips through." },
  { id: "booked", label: "Appointment booked", Icon: CalendarCheck, color: C.green,
    action: "Straight onto the calendar", detail: "Jordan is booked for Tuesday at 2:00 PM. A confirmation and reminders go out automatically. You wake up to a full calendar." },
];

// ── Sample leads for the board ────────────────────────────────
type Outcome = "Booked" | "Qualifying" | "Follow up" | "Nurture";
const outcomeColor: Record<Outcome, string> = {
  Booked: C.green, Qualifying: C.violet, "Follow up": C.cyan, Nurture: C.muted,
};
type Lead = {
  name: string; source: string; outcome: Outcome; when: string; speed: string;
  transcript: { who: "AI" | "Lead"; text: string }[];
  quals: { q: string; a: string }[];
};
const leads: Lead[] = [
  { name: "Jordan M.", source: "Facebook ad", outcome: "Booked", when: "Tue 2:00 PM", speed: "Called in 38s",
    transcript: [
      { who: "AI", text: "Hi Jordan, this is the team at Summit Roofing, I saw you just requested a quote. Is now an okay time?" },
      { who: "Lead", text: "Yeah sure, that was fast." },
      { who: "AI", text: "We move quick. Are you looking to repair or fully replace?" },
      { who: "Lead", text: "Probably a full replace, roof is about 20 years old." },
      { who: "AI", text: "Got it. I can get you on with a specialist Tuesday at 2, does that work?" },
      { who: "Lead", text: "Tuesday works." },
    ],
    quals: [{ q: "Job type", a: "Full replacement" }, { q: "Timeline", a: "Within 30 days" }, { q: "Budget", a: "Qualified" }, { q: "In service area", a: "Yes" }] },
  { name: "Priya S.", source: "Google search", outcome: "Qualifying", when: "On call now", speed: "Called in 44s",
    transcript: [
      { who: "AI", text: "Hi Priya, thanks for reaching out about a kitchen remodel. Quick question, is this for your own home?" },
      { who: "Lead", text: "Yes, we just moved in." },
      { who: "AI", text: "Congrats. Roughly what timeline are you hoping for?" },
      { who: "Lead", text: "Sometime in the next couple of months." },
    ],
    quals: [{ q: "Job type", a: "Kitchen remodel" }, { q: "Timeline", a: "1 to 2 months" }, { q: "Budget", a: "Confirming" }, { q: "In service area", a: "Yes" }] },
  { name: "Marcus L.", source: "Landing page", outcome: "Follow up", when: "Retry 4:15 PM", speed: "No answer",
    transcript: [
      { who: "AI", text: "Missed you, Marcus. Sent a text and email with a link to grab a time, and I will try you again at 4:15." },
      { who: "Lead", text: "(no answer, SMS delivered, email delivered)" },
    ],
    quals: [{ q: "Job type", a: "Bathroom" }, { q: "Timeline", a: "Unknown" }, { q: "Budget", a: "Unknown" }, { q: "In service area", a: "Yes" }] },
  { name: "Elena R.", source: "Instagram ad", outcome: "Booked", when: "Wed 10:30 AM", speed: "Called in 51s",
    transcript: [
      { who: "AI", text: "Hi Elena, saw your request for a fence quote. Are you looking to install new or replace existing?" },
      { who: "Lead", text: "Replace, the old one is falling apart." },
      { who: "AI", text: "Understood. I have Wednesday at 10:30 for a specialist, shall I lock it in?" },
      { who: "Lead", text: "Please do." },
    ],
    quals: [{ q: "Job type", a: "Fence replacement" }, { q: "Timeline", a: "ASAP" }, { q: "Budget", a: "Qualified" }, { q: "In service area", a: "Yes" }] },
  { name: "Chris D.", source: "Facebook ad", outcome: "Nurture", when: "Long term list", speed: "Called in 40s",
    transcript: [
      { who: "AI", text: "Hi Chris, quick question before I book anything, what zip are you in?" },
      { who: "Lead", text: "It is out past the county line." },
      { who: "AI", text: "Ah, that is just outside our service area for now. I will keep you posted if that changes." },
    ],
    quals: [{ q: "Job type", a: "Deck" }, { q: "Timeline", a: "Flexible" }, { q: "Budget", a: "n/a" }, { q: "In service area", a: "No, nurtured" }] },
];

// ── Component ──────────────────────────────────────────────────
export default function LeadEngine() {
  const [view, setView] = useState<"run" | "board" | "wiring">("run");
  const [active, setActive] = useState(0); // how many pipeline steps have fired
  const [openName, setOpenName] = useState<string | null>(null);
  const open = leads.find((l) => l.name === openName) ?? null;

  const done = active >= steps.length;
  const run = () => {
    if (done) { setActive(0); return; }
    setActive((n) => Math.min(n + 1, steps.length));
  };

  const kpis = useMemo(() => ({
    booked: leads.filter((l) => l.outcome === "Booked").length,
    working: leads.filter((l) => l.outcome === "Qualifying" || l.outcome === "Follow up").length,
    speed: "< 60s",
    coverage: "24/7",
  }), []);

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes ring{0%{transform:scale(.85);opacity:.7}100%{transform:scale(1.9);opacity:0}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.green, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.green, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · AI Sales System
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            A lead comes in, an AI calls it, qualifies it, and books it
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 780, margin: 0, lineHeight: 1.65 }}>
            You do not want a website, you want a system that captures leads, calls them, qualifies them, follows up,
            and books appointments on its own. So I built a working model of exactly that. Press run and watch one lead
            travel the whole pipeline, open the lead board to see the AI call transcripts, or view how it is wired. I
            built this page with Claude Code, which is the way of working you are hiring for.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "run", label: "Run the System", Icon: Play },
            { id: "board", label: "Lead Board", Icon: ListChecks },
            { id: "wiring", label: "How It Is Wired", Icon: GitBranch },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.green : "transparent", color: view === v.id ? "#04150E" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* RUN */}
            {view === "run" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <Sparkles size={17} style={{ color: C.green }} />
                  <span style={{ fontSize: 13, color: C.sub, flex: 1, minWidth: 220 }}>
                    {done ? "That lead went from click to booked call on autopilot. Run it again?" : "Press to advance the lead one step at a time and watch what the system does."}
                  </span>
                  <button onClick={run}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: done ? C.cardHi : C.green, color: done ? C.ink : "#04150E", fontSize: 12.5, fontWeight: 700 }}>
                    {done ? <><RotateCcw size={14} /> Run again</> : <><Play size={14} /> {active === 0 ? "Send in a lead" : "Next step"}</>}
                  </button>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {steps.map((s, i) => {
                    const state = i < active ? "done" : i === active ? "current" : "idle";
                    const lit = state !== "idle";
                    return (
                      <div key={s.id} style={{ display: "flex", gap: 13, alignItems: "flex-start",
                        background: state === "current" ? C.cardHi : C.card,
                        border: `1px solid ${lit ? s.color + "66" : C.border}`, borderRadius: 13, padding: "13px 15px", transition: "all .25s" }}>
                        <span style={{ position: "relative", width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                          background: lit ? s.color + "22" : C.bg2, display: "grid", placeItems: "center" }}>
                          {state === "current" && <span style={{ position: "absolute", inset: 0, borderRadius: 10, border: `2px solid ${s.color}`, animation: "ring 1.2s ease-out infinite" }} />}
                          {state === "done"
                            ? <CheckCircle2 size={19} style={{ color: s.color }} />
                            : <s.Icon size={18} style={{ color: lit ? s.color : C.muted }} />}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: lit ? C.ink : C.muted }}>{s.label}</span>
                            {state === "current" && <span style={{ fontSize: 10.5, fontWeight: 700, color: s.color, background: s.color + "1E", borderRadius: 6, padding: "2px 8px", textTransform: "uppercase", letterSpacing: .4 }}>running</span>}
                            {state === "done" && <span style={{ fontSize: 10.5, fontWeight: 700, color: C.green, background: C.green + "18", borderRadius: 6, padding: "2px 8px", textTransform: "uppercase", letterSpacing: .4 }}>done</span>}
                          </div>
                          <div style={{ fontSize: 12, color: lit ? s.color : C.muted, marginTop: 3, fontWeight: 600 }}>{s.action}</div>
                          {lit && <p style={{ fontSize: 12.5, color: C.sub, margin: "6px 0 0", lineHeight: 1.55 }}>{s.detail}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {done && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", background: C.green + "14", border: `1px solid ${C.green}44`, borderRadius: 12, padding: "13px 16px", marginTop: 12 }}>
                    <CalendarCheck size={18} style={{ color: C.green }} />
                    <span style={{ fontSize: 13.5, color: C.ink }}><b>Booked: Jordan M., Tuesday 2:00 PM.</b> Click to booked call, no human touched it.</span>
                  </div>
                )}
              </div>
            )}

            {/* BOARD */}
            {view === "board" && (
              <div>
                <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", marginBottom: 16 }}>
                  {[
                    { k: "Booked this batch", v: kpis.booked, c: C.green },
                    { k: "Being worked", v: kpis.working, c: C.violet },
                    { k: "Speed to call", v: kpis.speed, c: C.cyan },
                    { k: "Coverage", v: kpis.coverage, c: C.amber },
                  ].map((m, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .4 }}>{m.k}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: m.c, marginTop: 5 }}>{m.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 1fr 1.2fr 24px", gap: 10, padding: "11px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>
                    <span>Lead</span><span>Source</span><span>Status</span><span>Outcome</span><span />
                  </div>
                  {leads.map((l, i) => (
                    <button key={l.name} onClick={() => setOpenName(l.name)}
                      style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 1fr 1.2fr 24px", gap: 10, alignItems: "center", width: "100%", textAlign: "left", cursor: "pointer",
                        background: "transparent", border: "none", padding: "12px 16px", borderTop: i ? `1px solid ${C.border}` : "none" }}>
                      <span>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, display: "block" }}>{l.name}</span>
                        <span style={{ fontSize: 11, color: C.muted }}>{l.speed}</span>
                      </span>
                      <span style={{ fontSize: 12, color: C.sub }}>{l.source}</span>
                      <span>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: outcomeColor[l.outcome], background: outcomeColor[l.outcome] + "18", border: `1px solid ${outcomeColor[l.outcome]}3A`, borderRadius: 6, padding: "3px 9px" }}>{l.outcome}</span>
                      </span>
                      <span style={{ fontSize: 12, color: C.sub }}>{l.when}</span>
                      <ChevronRight size={15} style={{ color: C.muted }} />
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>Click any lead to read the AI call transcript and how it was qualified.</p>
              </div>
            )}

            {/* WIRING */}
            {view === "wiring" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  This is not one tool, it is a chain of them wired to act as one machine. Here is the flow, and how I
                  use Claude to build every link of it fast.
                </p>
                <div style={{ display: "flex", alignItems: "stretch", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                  {[
                    { Icon: Filter, t: "Capture", d: "Funnels, landing pages, ads, and web forms feed leads in", color: C.blue },
                    { Icon: PhoneCall, t: "AI dialer + voice", d: "Calls in under a minute and talks like a person", color: C.violet },
                    { Icon: Target, t: "Qualify + route", d: "Scores budget, timeline, and intent, routes the good ones", color: C.amber },
                    { Icon: CalendarCheck, t: "Follow up + book", d: "SMS and email sequences, then onto the calendar", color: C.green },
                  ].map((s, i, arr) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 180px" }}>
                      <div style={{ flex: 1, background: C.card, border: `1px solid ${s.color}44`, borderRadius: 12, padding: "12px 14px" }}>
                        <span style={{ width: 28, height: 28, borderRadius: 8, background: s.color + "1E", display: "grid", placeItems: "center", marginBottom: 8 }}>
                          <s.Icon size={15} style={{ color: s.color }} />
                        </span>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{s.t}</div>
                        <div style={{ fontSize: 11.5, color: C.sub, marginTop: 2, lineHeight: 1.45 }}>{s.d}</div>
                      </div>
                      {i < arr.length - 1 && <ChevronRight size={16} style={{ color: C.muted, flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { Icon: Bot, t: "Claude plans and builds the system", d: "I use Claude and Claude Code to design the pipeline, write the automations and API calls, script the voice agent prompts, and test until it books real appointments." },
                    { Icon: Phone, t: "AI voice agent and dialer", d: "The agent calls new leads in under a minute, holds a natural conversation, qualifies, and books. Speed to lead is where most money is won or lost." },
                    { Icon: Database, t: "CRM as the spine", d: "Every lead, tag, call outcome, and appointment lives in one CRM so nothing is lost and every follow up is timed and tracked." },
                    { Icon: Zap, t: "Glue between anything", d: "APIs, webhooks, n8n and Make, plus custom scripts when a platform has no native connector, so the whole stack behaves like one system." },
                  ].map((x, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, background: C.green + "1A", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <x.Icon size={15} style={{ color: C.green }} />
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
            <div style={{ fontSize: 12, color: C.muted }}>AI Sales Systems · Voice Agents · CRM · Automation · BVN</div>
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

      {/* Lead detail modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenName(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(3,12,8,0.74)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
            <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 480, maxHeight: "86vh", overflowY: "auto", background: C.card, border: `1px solid ${C.green}55`, borderRadius: 18 }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 10, position: "sticky", top: 0, background: C.card }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{open.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{open.source} &middot; {open.speed}</div>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: outcomeColor[open.outcome], background: outcomeColor[open.outcome] + "18", border: `1px solid ${outcomeColor[open.outcome]}3A`, borderRadius: 6, padding: "3px 9px" }}>{open.outcome} · {open.when}</span>
                <button onClick={() => setOpenName(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X size={18} /></button>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8 }}>AI call transcript</div>
                <div style={{ display: "grid", gap: 7, marginBottom: 16 }}>
                  {open.transcript.map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, flexDirection: t.who === "AI" ? "row" : "row-reverse" }}>
                      <span style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: (t.who === "AI" ? C.violet : C.blue) + "22", display: "grid", placeItems: "center" }}>
                        {t.who === "AI" ? <Bot size={13} style={{ color: C.violet }} /> : <Circle size={11} style={{ color: C.blue }} />}
                      </span>
                      <span style={{ fontSize: 12.5, lineHeight: 1.5, color: C.ink, background: t.who === "AI" ? C.bg2 : C.cardHi, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 11px", maxWidth: "82%" }}>{t.text}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8 }}>How it qualified</div>
                <div style={{ display: "grid", gap: 6 }}>
                  {open.quals.map((q, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 12px" }}>
                      <span style={{ fontSize: 12, color: C.muted }}>{q.q}</span>
                      <span style={{ fontSize: 12, color: C.ink, fontWeight: 600, textAlign: "right" }}>{q.a}</span>
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
