"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, LayoutDashboard, Radar, Route, Phone,
  MessageSquare, CreditCard, CalendarClock, UserRound, RefreshCw,
  CheckCircle2, X, ChevronRight, Sparkles, TrendingUp, AlertTriangle,
  DollarSign, PhoneCall, Bot,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#07120E", bg2: "#0C1D16", card: "#0F241B", cardHi: "#123024",
  border: "#1E3B2E", ink: "#EAFBF2", sub: "#9ED0B7", muted: "#5F8873",
  green: "#34D399", emerald: "#10B981", gold: "#FBBF24", cyan: "#22D3EE",
  violet: "#A78BFA", coral: "#FB7185", blue: "#60A5FA", teal: "#2DD4BF", red: "#F87171",
};

// ── Action metadata ───────────────────────────────────────────
const actionMeta: Record<string, { Icon: typeof Phone; color: string }> = {
  "AI call + rebook": { Icon: PhoneCall, color: C.violet },
  "Payment reminder + link": { Icon: CreditCard, color: C.gold },
  "Send to human closer": { Icon: UserRound, color: C.coral },
  "Nurture + AI SMS": { Icon: MessageSquare, color: C.cyan },
  "Database reactivation": { Icon: RefreshCw, color: C.blue },
  "AI payment reminder": { Icon: CreditCard, color: C.gold },
};

type Priority = "High" | "Medium";
type Opp = {
  id: string; name: string; value: string; reason: string; last: string;
  action: keyof typeof actionMeta; priority: Priority; plan: string[];
};
const opps: Opp[] = [
  { id: "o1", name: "Jordan Fleet Co", value: "$12,000", reason: "No-show 2 days ago, never rebooked", last: "2 days ago", action: "AI call + rebook", priority: "High",
    plan: ["AI voice agent calls to rebook within the hour", "If no answer, SMS with 3 booking slots", "On rebook, confirm + reminder sequence starts", "Notify the assigned rep"] },
  { id: "o2", name: "Delgado Group", value: "$28,000", reason: "Appointment did not close, cold 9 days, high value", last: "9 days ago", action: "Send to human closer", priority: "High",
    plan: ["Flagged high value, so it skips the bot", "AI drafts a context brief for the closer (history, objection, value)", "Routed to a human closer with a task + deadline", "If closer stalls 48h, escalate to manager"] },
  { id: "o3", name: "Marisol V.", value: "$4,500", reason: "Abandoned the payment link 6 hours ago", last: "6 hours ago", action: "Payment reminder + link", priority: "High",
    plan: ["AI SMS with the payment link resent immediately", "Email follow up at +2h and +24h if unpaid", "If still unpaid at 48h, AI call", "On payment, mark Closed Won + attribute recovered revenue"] },
  { id: "o4", name: "Chen Bros", value: "$6,800", reason: "Legitimate outstanding balance, 14 days", last: "14 days ago", action: "AI payment reminder", priority: "High",
    plan: ["Polite AI reminder with the balance + link", "Escalate to a human if flagged as a dispute", "Payment plan option offered if no response", "Record payment + update collectible revenue"] },
  { id: "o5", name: "Priya N.", value: "$2,200", reason: 'Said "later" 3 weeks ago, went quiet', last: "21 days ago", action: "Nurture + AI SMS", priority: "Medium",
    plan: ["Moved to a value-first nurture track, not the generic sequence", "AI SMS re-opens with a relevant reason to talk", "On any reply showing intent, requalify and offer a booking", "If still cold at 60 days, long-term nurture"] },
  { id: "o6", name: "Dormant list · 1,000 leads", value: "Mixed", reason: "No activity in 90+ days", last: "90+ days", action: "Database reactivation", priority: "Medium",
    plan: ["Segment the 1,000 by old stage, source, and last intent", "Staggered AI SMS + email in small batches to protect deliverability", "AI replies, requalifies, and books the ones who respond", "Hand warm repliers to a rep, drop hard opt-outs, nurture the rest"] },
];

// ── Journey ───────────────────────────────────────────────────
const happyPath = ["New lead", "Instant AI reply", "AI call", "Qualify", "Nurture", "Appointment", "Reminders", "Sales rep", "Payment", "Closed won"];
const branches = [
  { Icon: AlertTriangle, t: "No purchase", flow: "AI follow up → objection identified → nurture → AI call/SMS → human escalation → payment", color: C.gold },
  { Icon: Radar, t: "Ghosted", flow: "AI reactivation → call + SMS → requalification → appointment / payment", color: C.violet },
  { Icon: CalendarClock, t: "No-show", flow: "Immediate AI follow up → rebook → reminders → appointment", color: C.cyan },
  { Icon: CreditCard, t: "Payment due", flow: "AI reminder → payment link → follow up → human escalation → payment recorded", color: C.coral },
];

export default function RecoveryEngine() {
  const [view, setView] = useState<"dashboard" | "recovery" | "journey">("dashboard");
  const [scanned, setScanned] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = opps.find((o) => o.id === openId) ?? null;

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.green, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.green, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · GHL Revenue Architecture
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            Turn your GoHighLevel pipeline into an active revenue system
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 810, margin: 0, lineHeight: 1.65 }}>
            You do not want a VA, you want the system that works every legitimate opportunity and tells your closers
            where to step in. So here is a working model of exactly that. See where the money is stuck, run the AI
            Revenue Recovery agent to decide who to contact today and the next action, then view the lead journey logic.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "dashboard", label: "Revenue Dashboard", Icon: LayoutDashboard },
            { id: "recovery", label: "AI Recovery Agent", Icon: Radar },
            { id: "journey", label: "Lead Journey Logic", Icon: Route },
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

            {/* DASHBOARD */}
            {view === "dashboard" && (
              <div>
                <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", marginBottom: 16 }}>
                  {[
                    { k: "Total pipeline", v: "$284.5K", c: C.ink },
                    { k: "Qualified pipeline", v: "$142K", c: C.green },
                    { k: "Appointment pipeline", v: "$68K", c: C.cyan },
                    { k: "Unclosed opportunity", v: "$54K", c: C.gold },
                    { k: "Outstanding collectible", v: "$18.9K", c: C.coral },
                    { k: "Closed won (mo)", v: "$96.3K", c: C.emerald },
                    { k: "Reactivated pipeline", v: "$31.2K", c: C.blue },
                    { k: "Revenue recovered", v: "$22.4K", c: C.green },
                    { k: "AI-influenced revenue", v: "$61.7K", c: C.violet },
                    { k: "Pipeline to cash", v: "34%", c: C.gold },
                    { k: "Payment completion", v: "82%", c: C.cyan },
                    { k: "Lost opportunity", v: "$40K", c: C.red },
                  ].map((m, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 13px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .4 }}>{m.k}</div>
                      <div style={{ fontSize: 19, fontWeight: 800, color: m.c, marginTop: 5 }}>{m.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 17px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 13 }}>
                    <DollarSign size={16} style={{ color: C.gold }} />
                    <span style={{ fontSize: 14, fontWeight: 800 }}>Where is the money stuck?</span>
                  </div>
                  <div style={{ display: "grid", gap: 11 }}>
                    {[
                      { label: "Unclosed appointments", val: 54000, c: C.gold },
                      { label: "Ghosted after qualified", val: 38000, c: C.violet },
                      { label: "Outstanding balances", val: 18900, c: C.coral },
                      { label: "No-shows", val: 16500, c: C.cyan },
                      { label: "Abandoned payment links", val: 9400, c: C.red },
                    ].map((r, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                          <span style={{ color: C.sub }}>{r.label}</span>
                          <span style={{ color: C.ink, fontWeight: 700 }}>${r.val.toLocaleString()}</span>
                        </div>
                        <div style={{ height: 8, background: C.bg2, borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${(r.val / 54000) * 100}%`, background: r.c, borderRadius: 99 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 14, fontSize: 12.5, color: C.sub }}>
                    <TrendingUp size={15} style={{ color: C.green }} />
                    $136,800 of recoverable pipeline is sitting untouched. The AI Recovery agent works it automatically.
                  </div>
                </div>
              </div>
            )}

            {/* RECOVERY */}
            {view === "recovery" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                  <Sparkles size={17} style={{ color: C.green }} />
                  <span style={{ fontSize: 13, color: C.sub, flex: 1, minWidth: 220 }}>
                    {scanned ? "6 opportunities worth $53,500 flagged. 3 need action today, 2 route to a human closer." : "Ask the agent: who should we contact today, and what should happen next?"}
                  </span>
                  <button onClick={() => setScanned(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: scanned ? C.cardHi : C.green, color: scanned ? C.ink : "#04150E", fontSize: 12.5, fontWeight: 700 }}>
                    {scanned ? <><CheckCircle2 size={14} /> Scan complete</> : <><Radar size={14} /> Run AI recovery scan</>}
                  </button>
                </div>

                {scanned ? (
                  <div style={{ display: "grid", gap: 9 }}>
                    {opps.map((o) => {
                      const a = actionMeta[o.action];
                      return (
                        <button key={o.id} onClick={() => setOpenId(o.id)}
                          style={{ display: "flex", gap: 12, alignItems: "center", width: "100%", textAlign: "left", cursor: "pointer",
                            background: C.card, border: `1px solid ${o.priority === "High" ? C.gold + "44" : C.border}`, borderRadius: 13, padding: "12px 15px" }}>
                          <span style={{ width: 38, height: 38, borderRadius: 10, background: a.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                            <a.Icon size={18} style={{ color: a.color }} />
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 13.5, fontWeight: 700 }}>{o.name}</span>
                              <span style={{ fontSize: 12.5, fontWeight: 800, color: C.green }}>{o.value}</span>
                              {o.priority === "High" && <span style={{ fontSize: 9.5, fontWeight: 800, color: C.gold, background: C.gold + "1E", borderRadius: 5, padding: "2px 7px", textTransform: "uppercase", letterSpacing: .4 }}>Today</span>}
                            </div>
                            <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>{o.reason}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: a.color }}>{o.action}</div>
                            <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>last: {o.last}</div>
                          </div>
                          <ChevronRight size={15} style={{ color: C.muted, flexShrink: 0 }} />
                        </button>
                      );
                    })}
                    <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Click any opportunity to see why it was flagged and the exact action sequence the AI runs.</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", placeItems: "center", textAlign: "center", padding: "40px 20px", background: C.card, border: `1px dashed ${C.border}`, borderRadius: 14 }}>
                    <div>
                      <Radar size={30} style={{ color: C.muted, marginBottom: 10 }} />
                      <div style={{ fontSize: 13.5, color: C.sub, maxWidth: 300, lineHeight: 1.6 }}>
                        Run the scan to have the agent surface every legitimate opportunity worth working, ranked by value and urgency.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* JOURNEY */}
            {view === "journey" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 14, lineHeight: 1.6 }}>
                  Every lead runs the same intelligent journey, and the system decides the branch based on behavior.
                  No qualified lead is forgotten, no opportunity sits untouched.
                </p>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "15px 16px", marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C.green, textTransform: "uppercase", letterSpacing: .5, marginBottom: 11 }}>The happy path</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
                    {happyPath.map((s, i) => (
                      <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.ink, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 11px" }}>{s}</span>
                        {i < happyPath.length - 1 && <ChevronRight size={13} style={{ color: C.muted }} />}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: 12, fontWeight: 800, color: C.sub, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>When they do not go straight through</div>
                <div style={{ display: "grid", gap: 9, marginBottom: 14 }}>
                  {branches.map((b, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 15px" }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, background: b.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <b.Icon size={15} style={{ color: b.color }} />
                      </span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{b.t}</div>
                        <div style={{ fontSize: 12, color: C.sub, marginTop: 2, lineHeight: 1.5 }}>{b.flow}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { Icon: Bot, t: "AI decides the next action", d: "Intent detection, objection handling, and conditional branching pick call, SMS, email, rebook, payment link, or human, based on how the prospect actually behaves." },
                    { Icon: UserRound, t: "Guardrails and human handoff", d: "High value, disputes, and anything the AI is unsure about escalate to a human closer with full context. The bot never guesses on money." },
                    { Icon: RefreshCw, t: "Reactivating 1,000 old leads", d: "Segment by old stage, source, and last intent, then send staggered AI SMS and email in small batches to protect deliverability. The AI requalifies repliers, books them, and routes the warm ones to a rep." },
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
            <div style={{ fontSize: 12, color: C.muted }}>GoHighLevel · AI Agents · Voice AI · Revenue Systems · BVN</div>
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

      {/* Opportunity modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenId(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(3,12,8,0.76)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
            <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 460, maxHeight: "86vh", overflowY: "auto", background: C.card, border: `1px solid ${C.green}55`, borderRadius: 18 }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 10, position: "sticky", top: 0, background: C.card }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{open.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{open.reason}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: C.green }}>{open.value}</span>
                <button onClick={() => setOpenId(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X size={18} /></button>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", gap: 9, alignItems: "center", background: actionMeta[open.action].color + "12", border: `1px solid ${actionMeta[open.action].color}3A`, borderRadius: 11, padding: "11px 13px", marginBottom: 14 }}>
                  {(() => { const A = actionMeta[open.action].Icon; return <A size={17} style={{ color: actionMeta[open.action].color }} />; })()}
                  <div style={{ fontSize: 13, color: C.ink }}>Next action: <b style={{ color: actionMeta[open.action].color }}>{open.action}</b></div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 9 }}>What the AI runs</div>
                <div style={{ display: "grid", gap: 7 }}>
                  {open.plan.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 12px" }}>
                      <span style={{ width: 18, height: 18, borderRadius: 99, background: C.green + "22", color: C.green, fontSize: 10.5, fontWeight: 800, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                      <span style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>{p}</span>
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
