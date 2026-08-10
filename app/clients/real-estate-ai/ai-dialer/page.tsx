"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, PhoneCall, Home, UserRound, AlertTriangle,
  MapPin, DollarSign, Globe, PhoneIncoming, PhoneForwarded, CalendarCheck,
  Clock, MessageSquare, Sprout, Bot, Database, Zap, GitBranch, Play,
  RotateCcw, CheckCircle2, X, ChevronRight, Radio,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#070C1A", bg2: "#0D1530", card: "#111B3C", cardHi: "#152249",
  border: "#22315A", ink: "#EAF1FF", sub: "#9FB2DB", muted: "#5E7099",
  blue: "#60A5FA", violet: "#A78BFA", green: "#34D399", amber: "#FBBF24",
  cyan: "#22D3EE", coral: "#FB7185", teal: "#2DD4BF",
};

// ── Lead types + outcomes ─────────────────────────────────────
const typeMeta: Record<string, { Icon: typeof Home; color: string }> = {
  "Expired listing": { Icon: Home, color: C.amber },
  FSBO: { Icon: UserRound, color: C.cyan },
  "Pre-foreclosure": { Icon: AlertTriangle, color: C.coral },
  "Geo lead": { Icon: MapPin, color: C.teal },
  "Seller lead": { Icon: DollarSign, color: C.green },
  "Internet lead": { Icon: Globe, color: C.blue },
  Inbound: { Icon: PhoneIncoming, color: C.violet },
};
const outcomeMeta: Record<string, { Icon: typeof CalendarCheck; color: string }> = {
  "Appointment booked": { Icon: CalendarCheck, color: C.green },
  "Live transfer to agent": { Icon: PhoneForwarded, color: C.violet },
  "Callback scheduled": { Icon: Clock, color: C.amber },
  "Nurture sequence": { Icon: Sprout, color: C.muted },
  "Voicemail + SMS": { Icon: MessageSquare, color: C.cyan },
};

type Lead = {
  id: string; name: string; type: keyof typeof typeMeta; outcome: keyof typeof outcomeMeta;
  stage: string; transcript: { who: "AI" | "Lead"; text: string }[]; summary: string; next: string;
};
const leads: Lead[] = [
  { id: "l1", name: "Karen M.", type: "Expired listing", outcome: "Appointment booked", stage: "Appointment set",
    transcript: [
      { who: "AI", text: "Hi Karen, I noticed your listing on Maple came off the market. Are you still hoping to sell, or have you put that on hold?" },
      { who: "Lead", text: "Still want to sell, it just did not move." },
      { who: "AI", text: "That happens a lot in this market. If a strategy could get it sold in 30 days, would it be worth 15 minutes? I have Thursday at 2." },
      { who: "Lead", text: "Thursday works." },
    ],
    summary: "Expired seller, still motivated, blamed lack of activity. Booked a listing consult for Thursday 2pm.", next: "Listing appointment Thu 2:00pm, reminder sequence started" },
  { id: "l2", name: "The Alvarez Family", type: "FSBO", outcome: "Live transfer to agent", stage: "Transferred",
    transcript: [
      { who: "AI", text: "Hi, I see you are selling the place on 5th yourself. Quick question, are you open to working with an agent if they brought a ready buyer?" },
      { who: "Lead", text: "Honestly yeah, if they had a real buyer we would talk today." },
      { who: "AI", text: "You are exactly who my agent wants to speak with right now. Let me connect you live, one moment." },
    ],
    summary: "FSBO, warm and ready to talk today with the right buyer. High intent, transferred live to the agent immediately.", next: "Live transferred to agent, opportunity created as hot" },
  { id: "l3", name: "Robert D.", type: "Pre-foreclosure", outcome: "Callback scheduled", stage: "Contacted",
    transcript: [
      { who: "AI", text: "Hi Robert, I work with homeowners looking at their options right now. Is this a good moment, or should I call back?" },
      { who: "Lead", text: "Not right now, I am at work. Later today maybe." },
      { who: "AI", text: "Of course. I will try you at 5:30 and send a quick text so you have my info. No pressure at all." },
    ],
    summary: "Sensitive pre-foreclosure lead, at work. Handled gently, no pressure. Callback set for 5:30, info text sent.", next: "AI callback 5:30pm, softer nurture track flagged" },
  { id: "l4", name: "Nia P.", type: "Geo lead", outcome: "Nurture sequence", stage: "Nurture",
    transcript: [
      { who: "AI", text: "Hi Nia, homes in your neighborhood have been selling fast lately. Have you thought about what yours might be worth?" },
      { who: "Lead", text: "Not selling anytime soon, just curious." },
      { who: "AI", text: "Totally fair. I will send you a monthly value update so you always know where you stand, no calls unless you want one." },
    ],
    summary: "Geo lead, curious but not ready. Opted into a monthly home-value nurture. Long-term play.", next: "Monthly value nurture, re-engage on any reply" },
  { id: "l5", name: "Tom & Lía", type: "Seller lead", outcome: "Appointment booked", stage: "Appointment set",
    transcript: [
      { who: "AI", text: "Hi, you asked about selling your home. Are you looking to move soon, or still weighing it up?" },
      { who: "Lead", text: "Within a couple of months, we found a bigger place." },
      { who: "AI", text: "Congratulations. Let us get you a pricing and timeline plan. I have Saturday at 11, does that work?" },
      { who: "Lead", text: "Saturday is great." },
    ],
    summary: "Motivated seller, moving within 2 months, upgrading. Booked a pricing consult Saturday 11am.", next: "Consult Sat 11:00am, pre-appointment info sent" },
  { id: "l6", name: "Dev S.", type: "Internet lead", outcome: "Voicemail + SMS", stage: "Contacted",
    transcript: [
      { who: "AI", text: "Hi Dev, returning your enquiry on the downtown condos. Missed you, so I am sending a text with a few options and a link to grab a time." },
      { who: "Lead", text: "(no answer, voicemail left, SMS delivered)" },
    ],
    summary: "Internet lead, no answer on first dial. Voicemail left and SMS with booking link sent. Auto-retry queued.", next: "SMS booking link sent, AI retry at 6:15pm" },
  { id: "l7", name: "Grace L.", type: "Inbound", outcome: "Appointment booked", stage: "Appointment set",
    transcript: [
      { who: "Lead", text: "Hi, I saw your sign on Oak Street, is that still available?" },
      { who: "AI", text: "It is. Are you looking to buy in that area, and are you working with an agent yet?" },
      { who: "Lead", text: "Looking to buy, no agent yet." },
      { who: "AI", text: "Perfect, let me get you a showing. I have tomorrow at 4, shall I book it?" },
      { who: "Lead", text: "Yes please." },
    ],
    summary: "Inbound buyer from a yard sign, unrepresented. Qualified and booked a showing tomorrow 4pm.", next: "Showing Tue 4:00pm, buyer intake sent" },
];

export default function AiDialer() {
  const [view, setView] = useState<"dialer" | "crm" | "stack">("dialer");
  const [dialed, setDialed] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = leads.find((l) => l.id === openId) ?? null;
  const done = dialed >= leads.length;
  const dial = () => { if (done) { setDialed(0); return; } setDialed((n) => Math.min(n + 1, leads.length)); };

  const summary = useMemo(() => ({
    booked: leads.filter((l) => l.outcome === "Appointment booked").length,
    transfer: leads.filter((l) => l.outcome === "Live transfer to agent").length,
    callback: leads.filter((l) => l.outcome === "Callback scheduled").length,
  }), []);

  const stages = ["Contacted", "Appointment set", "Transferred", "Nurture"];

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes ring{0%{transform:scale(.85);opacity:.7}100%{transform:scale(1.9);opacity:0}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.blue, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.blue, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · Real Estate AI Dialer
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            An AI voice agent that calls your leads, qualifies, transfers hot ones, and books
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 810, margin: 0, lineHeight: 1.65 }}>
            You want an AI calling system that works expireds, FSBOs, pre-foreclosures, geo, seller, and internet leads
            at scale, adapts its script, transfers live when a lead is hot, and books straight into the CRM. So I built a
            working model of it. Dial the list and watch each call get handled, open a lead to read the transcript and AI
            summary, then see the stack I would build it on.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "dialer", label: "AI Dialer", Icon: PhoneCall },
            { id: "crm", label: "CRM Pipeline", Icon: Database },
            { id: "stack", label: "The Stack", Icon: GitBranch },
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

            {/* DIALER */}
            {view === "dialer" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <PhoneCall size={17} style={{ color: C.blue }} />
                  <span style={{ fontSize: 13, color: C.sub, flex: 1, minWidth: 220 }}>
                    {done ? `Batch done: ${summary.booked} appointments booked, ${summary.transfer} live transfer, ${summary.callback} callback. The agent never stops dialing.` : dialed === 0 ? "The AI agent is ready to dial. Start the batch." : "Calling the next lead, adapting to how they respond."}
                  </span>
                  <button onClick={dial}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: done ? C.cardHi : C.blue, color: done ? C.ink : "#04102B", fontSize: 12.5, fontWeight: 700 }}>
                    {done ? <><RotateCcw size={14} /> Dial again</> : <><Play size={14} /> {dialed === 0 ? "Start dialing" : "Dial next lead"}</>}
                  </button>
                </div>

                <div style={{ display: "grid", gap: 9 }}>
                  {leads.map((l, i) => {
                    const state = i < dialed ? "done" : i === dialed ? "calling" : "idle";
                    const ty = typeMeta[l.type];
                    const oc = outcomeMeta[l.outcome];
                    return (
                      <button key={l.id} disabled={state === "idle"} onClick={() => state === "done" && setOpenId(l.id)}
                        style={{ display: "flex", gap: 12, alignItems: "center", width: "100%", textAlign: "left", cursor: state === "done" ? "pointer" : "default",
                          background: state === "calling" ? C.cardHi : C.card, border: `1px solid ${state !== "idle" ? ty.color + "55" : C.border}`, borderRadius: 13, padding: "12px 15px", opacity: state === "idle" ? .55 : 1 }}>
                        <span style={{ position: "relative", width: 38, height: 38, borderRadius: 10, background: ty.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                          {state === "calling" && <span style={{ position: "absolute", inset: 0, borderRadius: 10, border: `2px solid ${ty.color}`, animation: "ring 1.2s ease-out infinite" }} />}
                          <ty.Icon size={17} style={{ color: ty.color }} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13.5, fontWeight: 700 }}>{l.name}</span>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: ty.color, background: ty.color + "18", borderRadius: 5, padding: "2px 7px" }}>{l.type}</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>
                            {state === "calling" ? "AI agent on the call..." : state === "done" ? "Tap to read the transcript and summary" : "Queued"}
                          </div>
                        </div>
                        {state === "done" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: oc.color, background: oc.color + "18", border: `1px solid ${oc.color}3A`, borderRadius: 7, padding: "4px 9px", flexShrink: 0 }}>
                            <oc.Icon size={12} /> {l.outcome}
                          </span>
                        )}
                        {state === "calling" && <Radio size={15} style={{ color: ty.color, flexShrink: 0, animation: "pulse 1.2s ease-in-out infinite" }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CRM */}
            {view === "crm" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 14, lineHeight: 1.6 }}>
                  Every call outcome lands in the CRM automatically, on the right pipeline stage, with the AI summary and
                  the next action already set. No manual data entry.
                </p>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
                  {stages.map((st) => {
                    const inStage = leads.filter((l) => l.stage === st);
                    return (
                      <div key={st} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 13, padding: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 800 }}>{st}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, background: C.card, borderRadius: 6, padding: "2px 8px" }}>{inStage.length}</span>
                        </div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {inStage.map((l) => {
                            const ty = typeMeta[l.type];
                            return (
                              <button key={l.id} onClick={() => setOpenId(l.id)}
                                style={{ textAlign: "left", cursor: "pointer", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
                                <div style={{ fontSize: 12.5, fontWeight: 700 }}>{l.name}</div>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: ty.color, background: ty.color + "18", borderRadius: 5, padding: "2px 7px", marginTop: 6 }}>
                                  <ty.Icon size={10} /> {l.type}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STACK */}
            {view === "stack" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  Here is how I would build this to run at scale, and the tools I recommend. I have built a complex AI
                  voice solution on Retell, plus AI voice agents and missed call text back inside GoHighLevel.
                </p>
                <div style={{ display: "flex", alignItems: "stretch", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                  {[
                    { Icon: PhoneCall, t: "Voice AI", d: "Retell, Vapi, or Bland for natural, script-adaptive calling, inbound and outbound", color: C.violet },
                    { Icon: Zap, t: "Telephony + dialer", d: "Twilio numbers, concurrency, and voicemail drop to dial at volume", color: C.amber },
                    { Icon: Database, t: "CRM core", d: "GoHighLevel holds contacts, pipelines, tags, calendars, and every call outcome", color: C.blue },
                    { Icon: Bot, t: "AI brain + logic", d: "OpenAI for intent, qualification, summaries, and the next-action decision", color: C.green },
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
                    { Icon: PhoneForwarded, t: "Live transfer on hot intent", d: "When the agent detects real buying or selling intent, it warm transfers the call to you or your ISA in real time, so a human closes the hot ones." },
                    { Icon: MessageSquare, t: "Missed calls never leak", d: "No answer triggers a voicemail drop plus an instant SMS with a booking link, and the AI retries on a schedule. Inbound calls and missed call text back are handled too." },
                    { Icon: Sprout, t: "Right message per lead type", d: "Expireds, FSBOs, pre-foreclosures, geo, seller, and internet leads each get their own script and cadence, not one generic blast. Pre-foreclosure is handled gently." },
                    { Icon: CheckCircle2, t: "Everything recorded in the CRM", d: "Call summaries, transcripts, outcomes, tags, and pipeline moves are written back automatically, so you always know the state of every lead." },
                  ].map((x, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, background: C.blue + "1A", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <x.Icon size={15} style={{ color: C.blue }} />
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
            <div style={{ fontSize: 12, color: C.muted }}>Voice AI · GoHighLevel · CRM Architecture · Real Estate · BVN</div>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenId(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(3,7,18,0.76)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
            <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 470, maxHeight: "86vh", overflowY: "auto", background: C.card, border: `1px solid ${C.blue}55`, borderRadius: 18 }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 10, position: "sticky", top: 0, background: C.card }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: typeMeta[open.type].color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  {(() => { const Ty = typeMeta[open.type].Icon; return <Ty size={16} style={{ color: typeMeta[open.type].color }} />; })()}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 800 }}>{open.name}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{open.type}</div>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, color: outcomeMeta[open.outcome].color, background: outcomeMeta[open.outcome].color + "18", border: `1px solid ${outcomeMeta[open.outcome].color}3A`, borderRadius: 6, padding: "3px 8px" }}>
                  {(() => { const Oc = outcomeMeta[open.outcome].Icon; return <Oc size={11} />; })()} {open.outcome}
                </span>
                <button onClick={() => setOpenId(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X size={18} /></button>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8 }}>Call transcript</div>
                <div style={{ display: "grid", gap: 7, marginBottom: 14 }}>
                  {open.transcript.map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.who === "AI" ? "row" : "row-reverse" }}>
                      <span style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: (m.who === "AI" ? C.violet : C.blue) + "22", display: "grid", placeItems: "center" }}>
                        {m.who === "AI" ? <Bot size={13} style={{ color: C.violet }} /> : <UserRound size={12} style={{ color: C.blue }} />}
                      </span>
                      <span style={{ fontSize: 12.5, lineHeight: 1.5, color: C.ink, background: m.who === "AI" ? C.bg2 : C.cardHi, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 11px", maxWidth: "82%" }}>{m.text}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 7, display: "flex", alignItems: "center", gap: 6 }}>
                  <Bot size={13} style={{ color: C.violet }} /> AI call summary
                </div>
                <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px", fontSize: 12.5, color: C.ink, lineHeight: 1.55, marginBottom: 12 }}>
                  {open.summary}
                </div>
                <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.green + "10", border: `1px solid ${C.green}33`, borderRadius: 10, padding: "10px 13px" }}>
                  <CalendarCheck size={15} style={{ color: C.green, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}><b>Next:</b> {open.next}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
