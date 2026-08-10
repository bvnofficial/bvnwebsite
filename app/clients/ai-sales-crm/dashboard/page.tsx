"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, Inbox, KanbanSquare, Database, Bot,
  MessageCircle, Smartphone, Globe, Instagram, CheckCircle2, X,
  ChevronRight, Sparkles, Send, Clock, Flame, Calendar, HelpCircle,
  Webhook, Radio, Table2, GitBranch,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0A0A14", bg2: "#13121F", card: "#181626", cardHi: "#201D32",
  border: "#2C2942", ink: "#F1EFFA", sub: "#B4AAD0", muted: "#7A6F98",
  violet: "#A78BFA", cyan: "#22D3EE", green: "#34D399", amber: "#FBBF24",
  pink: "#F472B6", blue: "#60A5FA", red: "#F87171",
};

// ── Channel + intent metadata ─────────────────────────────────
const channelMeta: Record<string, { Icon: typeof Globe; color: string }> = {
  WhatsApp: { Icon: MessageCircle, color: C.green },
  "Web chat": { Icon: Globe, color: C.blue },
  SMS: { Icon: Smartphone, color: C.amber },
  Instagram: { Icon: Instagram, color: C.pink },
};
const intentMeta: Record<string, { Icon: typeof Flame; color: string }> = {
  "Hot lead": { Icon: Flame, color: C.red },
  "Booking request": { Icon: Calendar, color: C.green },
  "Pricing question": { Icon: HelpCircle, color: C.amber },
  Support: { Icon: HelpCircle, color: C.blue },
};

type Urgency = "High" | "Medium" | "Low";
const urgencyColor: Record<Urgency, string> = { High: C.red, Medium: C.amber, Low: C.muted };

type Convo = {
  id: string; name: string; channel: keyof typeof channelMeta; preview: string;
  intent: keyof typeof intentMeta; urgency: Urgency; stage: string; pending?: boolean;
  thread: { who: "Lead" | "Agent"; text: string }[]; draft: string;
};

const convos: Convo[] = [
  { id: "c-new", name: "Ryan Cole", channel: "WhatsApp", preview: "Hey, is the 3 bed still available? Can I see it this week?",
    intent: "Hot lead", urgency: "High", stage: "New", pending: true,
    thread: [{ who: "Lead", text: "Hey, is the 3 bed still available? Can I see it this week?" }],
    draft: "Hi Ryan, yes it is. I have Thursday 2pm or Friday 10am open for a viewing, which suits you better?" },
  { id: "c2", name: "Aisha Khan", channel: "Web chat", preview: "What are your monthly plans and is there a setup fee?",
    intent: "Pricing question", urgency: "Medium", stage: "Qualified",
    thread: [{ who: "Lead", text: "What are your monthly plans and is there a setup fee?" }, { who: "Agent", text: "We have three plans from $99 to $299 a month, no setup fee this month." }, { who: "Lead", text: "Great, can you send the details?" }],
    draft: "Absolutely Aisha, here is the plan breakdown. Want me to book a quick call to walk you through it?" },
  { id: "c3", name: "Marcus Reid", channel: "SMS", preview: "Can I book a call for tomorrow afternoon?",
    intent: "Booking request", urgency: "High", stage: "Qualified",
    thread: [{ who: "Lead", text: "Can I book a call for tomorrow afternoon?" }],
    draft: "Sure Marcus, I have 1pm, 2:30pm, or 4pm tomorrow. Reply with one and I will lock it in." },
  { id: "c4", name: "Elena Ortiz", channel: "Instagram", preview: "My login is not working since the update.",
    intent: "Support", urgency: "Low", stage: "Customer",
    thread: [{ who: "Lead", text: "My login is not working since the update." }],
    draft: "Sorry about that Elena. I have reset your session, please try again and tell me if it works now." },
];

const stages = [
  { name: "New", color: C.violet, ids: ["c-new"] },
  { name: "Qualified", color: C.cyan, ids: ["c2", "c3"] },
  { name: "Booked", color: C.green, ids: [] as string[] },
  { name: "Customer", color: C.blue, ids: ["c4"] },
];

export default function AiSalesCrm() {
  const [view, setView] = useState<"inbox" | "pipeline" | "backend">("inbox");
  const [triaged, setTriaged] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<string[]>([]);
  const open = convos.find((c) => c.id === openId) ?? null;

  const shown = (c: Convo) => !c.pending || triaged; // classification visible?

  const kpis = useMemo(() => ({
    convos: convos.length,
    hot: convos.filter((c) => c.intent === "Hot lead").length,
    booking: convos.filter((c) => c.intent === "Booking request").length,
    speed: "1.4s",
  }), []);

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.violet, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.violet, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · AI Sales CRM
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            An AI powered sales CRM: classify, route, and reply, in real time
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 810, margin: 0, lineHeight: 1.65 }}>
            You asked to see something comparable in complexity, with the backend and the reasoning, not just a UI.
            So here it is, built the way I would rebuild yours. Inbound messages arrive over webhooks, an LLM classifies
            intent and urgency, a conversational agent drafts the reply, and everything lives in a Supabase schema with
            real time updates. Run the AI triage, open a conversation, then read the backend view for the architecture.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "inbox", label: "Live Inbox", Icon: Inbox },
            { id: "pipeline", label: "Pipeline", Icon: KanbanSquare },
            { id: "backend", label: "Backend & Wiring", Icon: Database },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.violet : "transparent", color: view === v.id ? "#160A2E" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* INBOX */}
            {view === "inbox" && (
              <div>
                <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", marginBottom: 14 }}>
                  {[
                    { k: "Conversations", v: kpis.convos, c: C.violet },
                    { k: "Hot leads", v: kpis.hot, c: C.red },
                    { k: "Booking intent", v: kpis.booking, c: C.green },
                    { k: "Avg triage time", v: kpis.speed, c: C.cyan },
                  ].map((m, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .4 }}>{m.k}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: m.c, marginTop: 5 }}>{m.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: "12px 15px", marginBottom: 14 }}>
                  <Sparkles size={16} style={{ color: C.violet }} />
                  <span style={{ fontSize: 12.5, color: C.sub, flex: 1, minWidth: 200 }}>
                    {triaged ? "Ryan's new WhatsApp message was classified by the LLM as a hot lead, high urgency." : "A new WhatsApp message just arrived unclassified. Run the AI to triage it."}
                  </span>
                  <button onClick={() => setTriaged(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 9, border: "none", cursor: "pointer",
                      background: triaged ? C.green : C.violet, color: triaged ? "#04150E" : "#160A2E", fontSize: 12.5, fontWeight: 700 }}>
                    {triaged ? <><CheckCircle2 size={14} /> Triaged in 240ms</> : <><Bot size={14} /> Run AI triage</>}
                  </button>
                </div>

                <div style={{ display: "grid", gap: 9 }}>
                  {convos.map((c) => {
                    const ch = channelMeta[c.channel];
                    const it = intentMeta[c.intent];
                    const classified = shown(c);
                    return (
                      <button key={c.id} onClick={() => setOpenId(c.id)}
                        style={{ display: "flex", gap: 12, alignItems: "flex-start", width: "100%", textAlign: "left", cursor: "pointer",
                          background: c.pending && !triaged ? C.cardHi : C.card, border: `1px solid ${c.pending && !triaged ? C.violet + "66" : C.border}`, borderRadius: 13, padding: "12px 15px" }}>
                        <span style={{ width: 36, height: 36, borderRadius: 10, background: ch.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <ch.Icon size={17} style={{ color: ch.color }} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13.5, fontWeight: 700 }}>{c.name}</span>
                            <span style={{ fontSize: 10.5, color: C.muted, fontFamily: "ui-monospace, monospace" }}>{c.channel}</span>
                            {sentIds.includes(c.id) && <span style={{ fontSize: 10, fontWeight: 700, color: C.green, background: C.green + "18", borderRadius: 5, padding: "1px 6px" }}>REPLIED</span>}
                          </div>
                          <div style={{ fontSize: 12.5, color: C.sub, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.preview}</div>
                          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                            {classified ? (
                              <>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: it.color, background: it.color + "18", border: `1px solid ${it.color}3A`, borderRadius: 6, padding: "2px 8px" }}>
                                  <it.Icon size={11} /> {c.intent}
                                </span>
                                <span style={{ fontSize: 10.5, fontWeight: 700, color: urgencyColor[c.urgency], background: urgencyColor[c.urgency] + "18", border: `1px solid ${urgencyColor[c.urgency]}3A`, borderRadius: 6, padding: "2px 8px" }}>{c.urgency} urgency</span>
                              </>
                            ) : (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, color: C.violet }}>
                                <span style={{ width: 7, height: 7, borderRadius: 99, background: C.violet, animation: "pulse 1.2s ease-in-out infinite" }} /> awaiting AI triage
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ color: C.muted, flexShrink: 0, marginTop: 4 }} />
                      </button>
                    );
                  })}
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>Click any conversation to see the thread and the AI drafted reply you can approve.</p>
              </div>
            )}

            {/* PIPELINE */}
            {view === "pipeline" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 14, lineHeight: 1.6 }}>
                  The same records, on a live pipeline. When the LLM reclassifies a conversation or a booking is made, a
                  Supabase real time subscription moves the card here with no refresh.
                </p>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                  {stages.map((s) => (
                    <div key={s.name} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 13, padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 800 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 99, background: s.color }} /> {s.name}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, background: C.card, borderRadius: 6, padding: "2px 8px" }}>{s.ids.length}</span>
                      </div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {s.ids.length === 0 && <div style={{ fontSize: 11.5, color: C.muted, padding: "10px 2px" }}>No cards yet</div>}
                        {s.ids.map((id) => {
                          const c = convos.find((x) => x.id === id)!;
                          const it = intentMeta[c.intent];
                          const classified = shown(c);
                          return (
                            <button key={id} onClick={() => setOpenId(id)}
                              style={{ textAlign: "left", cursor: "pointer", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
                              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.name}</div>
                              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{c.channel}</div>
                              {classified && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: it.color, background: it.color + "18", borderRadius: 5, padding: "2px 7px", marginTop: 7 }}>
                                  <it.Icon size={10} /> {c.intent}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BACKEND */}
            {view === "backend" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  This is the part you said you actually want to hear: the backend and the reasoning, not the UI. Here is
                  how I would architect it, mapped to the exact stack you listed.
                </p>

                {/* schema */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px 16px", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Table2 size={16} style={{ color: C.cyan }} />
                    <span style={{ fontSize: 13, fontWeight: 800 }}>Supabase schema (PostgreSQL)</span>
                  </div>
                  <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
                    {[
                      { t: "contacts", f: "id, name, channel, phone" },
                      { t: "conversations", f: "id, contact_id, stage, intent" },
                      { t: "messages", f: "id, convo_id, role, body, ts" },
                      { t: "classifications", f: "id, msg_id, intent, urgency, score" },
                      { t: "deals", f: "id, contact_id, value, stage" },
                      { t: "events", f: "id, source, payload, ts" },
                    ].map((x, i) => (
                      <div key={i} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 11px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.cyan, fontFamily: "ui-monospace, monospace" }}>{x.t}</div>
                        <div style={{ fontSize: 10.5, color: C.muted, fontFamily: "ui-monospace, monospace", marginTop: 3, lineHeight: 1.5 }}>{x.f}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* flow */}
                <div style={{ display: "flex", alignItems: "stretch", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                  {[
                    { Icon: Webhook, t: "Webhook ingest", d: "Chat platforms, calendars, and CRMs post in over webhooks", color: C.pink },
                    { Icon: GitBranch, t: "n8n orchestration", d: "Routes each event, calls the LLM, writes to Supabase, retries on failure", color: C.violet },
                    { Icon: Bot, t: "LLM classify + agent", d: "Intent and urgency scoring, then a drafted conversational reply", color: C.amber },
                    { Icon: Radio, t: "Realtime to the UI", d: "Supabase subscriptions push updates to the Next.js dashboard live", color: C.green },
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
                    { t: "Why this design", d: "n8n owns orchestration and retries so the flow is observable and resilient. Postgres via Supabase is the single source of truth, and its real time layer means the dashboard never has to poll." },
                    { t: "Security and speed", d: "Row level security on Supabase, secrets kept server side, signed webhooks, and indexed queries. On the UI side, server components and lean client bundles for a fast dashboard." },
                    { t: "Where I use Claude Code", d: "I build and debug the n8n functions, the SQL, the classification prompts, and the Next.js dashboard with Claude Code, which is how I ship this kind of system quickly and cleanly." },
                  ].map((x, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 15px" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.violet }}>{x.t}</div>
                      <p style={{ fontSize: 12.5, color: C.sub, margin: "4px 0 0", lineHeight: 1.55 }}>{x.d}</p>
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
            <div style={{ fontSize: 12, color: C.muted }}>Next.js · Supabase · n8n · LLM APIs · BVN</div>
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

      {/* Conversation modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenId(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(4,4,12,0.76)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
            <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 470, maxHeight: "86vh", overflowY: "auto", background: C.card, border: `1px solid ${C.violet}55`, borderRadius: 18 }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 10, position: "sticky", top: 0, background: C.card }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: channelMeta[open.channel].color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  {(() => { const Ch = channelMeta[open.channel].Icon; return <Ch size={16} style={{ color: channelMeta[open.channel].color }} />; })()}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 800 }}>{open.name}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{open.channel} &middot; {open.stage}</div>
                </div>
                {shown(open) && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: intentMeta[open.intent].color, background: intentMeta[open.intent].color + "18", border: `1px solid ${intentMeta[open.intent].color}3A`, borderRadius: 6, padding: "2px 8px" }}>
                    {(() => { const It = intentMeta[open.intent].Icon; return <It size={11} />; })()} {open.intent}
                  </span>
                )}
                <button onClick={() => setOpenId(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X size={18} /></button>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8 }}>Conversation</div>
                <div style={{ display: "grid", gap: 7, marginBottom: 16 }}>
                  {open.thread.map((m, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: m.who === "Agent" ? "row-reverse" : "row" }}>
                      <span style={{ fontSize: 12.5, lineHeight: 1.5, color: C.ink, background: m.who === "Agent" ? C.violet + "22" : C.bg2, border: `1px solid ${C.border}`, borderRadius: 11, padding: "8px 12px", maxWidth: "85%" }}>{m.text}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <Bot size={13} style={{ color: C.violet }} /> AI drafted reply
                </div>
                <div style={{ background: C.violet + "10", border: `1px solid ${C.violet}33`, borderRadius: 11, padding: "12px 14px", fontSize: 13, color: C.ink, lineHeight: 1.55 }}>
                  {open.draft}
                </div>

                {sentIds.includes(open.id) ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", background: C.green + "14", border: `1px solid ${C.green}44`, borderRadius: 10, padding: "10px 13px", marginTop: 12 }}>
                    <CheckCircle2 size={15} style={{ color: C.green }} />
                    <span style={{ fontSize: 12.5, color: C.ink }}>Reply approved and sent via {open.channel}.</span>
                  </div>
                ) : (
                  <button onClick={() => setSentIds((s) => [...s, open.id])}
                    style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 15px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: C.violet, color: "#160A2E", fontSize: 13, fontWeight: 800, marginTop: 12 }}>
                    <Send size={15} /> Approve and send
                  </button>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontSize: 10.5, color: C.muted, marginTop: 9 }}>
                  <Clock size={11} /> Human in the loop: the agent drafts, you approve before anything is sent.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
