"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, Home, Building2, Users, TrendingUp, Calendar,
  BarChart3, MessageSquare, Zap, Bot, DollarSign, CheckCircle2, ChevronRight,
  LayoutDashboard, Ticket, Clock, Target, Percent, ArrowUpRight, FileSignature,
  KeyRound, UserCheck, Send,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  cyan: "#22D3EE", green: "#34D399", amber: "#F5A623", coral: "#FB923C",
  purple: "#A78BFA", blue: "#3B82F6", gold: "#FBBF24",
};

// ── Pipelines ─────────────────────────────────────────────────
type Stage = { id: string; name: string; count: number; value: number; color: string; Icon: typeof Home; autos: string[] };
const buyer: Stage[] = [
  { id: "b1", name: "New Lead", count: 64, value: 0, color: C.cyan, Icon: Users, autos: ["Instant text back and welcome email", "Owner assigned, speed to lead timer starts", "AI qualifies budget, area, and timeline"] },
  { id: "b2", name: "Nurturing", count: 38, value: 0, color: C.blue, Icon: MessageSquare, autos: ["Long term drip until they are ready", "New listing alerts matched to their criteria", "Monthly market update touch"] },
  { id: "b3", name: "Pre-Approved", count: 21, value: 0, color: C.purple, Icon: UserCheck, autos: ["Lender handoff and follow up", "Move to active showing when approval lands"] },
  { id: "b4", name: "Actively Showing", count: 14, value: 0, color: C.amber, Icon: Home, autos: ["Showing scheduling and reminders", "Post showing feedback capture"] },
  { id: "b5", name: "Offer Made", count: 6, value: 0, color: C.coral, Icon: FileSignature, autos: ["Offer status tracking", "Agent and client update automation"] },
  { id: "b6", name: "Under Contract", count: 4, value: 0, color: C.green, Icon: KeyRound, autos: ["Closing checklist and milestone reminders", "Vendor and title coordination touches"] },
  { id: "b7", name: "Closed", count: 9, value: 0, color: C.green, Icon: CheckCircle2, autos: ["Review request at the happy moment", "Referral ask and past client nurture"] },
];
const seller: Stage[] = [
  { id: "s1", name: "New Lead", count: 41, value: 0, color: C.cyan, Icon: Users, autos: ["Home value landing page follow up", "Instant text back, listing appt CTA"] },
  { id: "s2", name: "Listing Appt Set", count: 17, value: 0, color: C.blue, Icon: Calendar, autos: ["Pre appointment reminder sequence", "CMA prep task for the agent"] },
  { id: "s3", name: "Listing Signed", count: 11, value: 0, color: C.purple, Icon: FileSignature, autos: ["Onboarding and photography scheduling", "Go live checklist automation"] },
  { id: "s4", name: "Active Listing", count: 8, value: 0, color: C.amber, Icon: Home, autos: ["Weekly seller update with activity stats", "Showing feedback rollup"] },
  { id: "s5", name: "Under Contract", count: 3, value: 0, color: C.coral, Icon: KeyRound, autos: ["Closing timeline reminders", "Milestone updates to the seller"] },
  { id: "s6", name: "Closed", count: 6, value: 0, color: C.green, Icon: CheckCircle2, autos: ["Review request and testimonial ask", "Past client long term nurture"] },
];

// ── Event funnel ──────────────────────────────────────────────
const funnel = [
  { label: "Registered", count: 420, color: C.blue },
  { label: "Confirmed", count: 311, color: C.cyan },
  { label: "Attended", count: 188, color: C.amber },
  { label: "Booked a call", count: 52, color: C.green },
];
const eventAutos = [
  "Registration page captures the lead and tags the event",
  "Instant confirmation email and calendar invite",
  "Reminder sequence: 1 day, 1 hour, and go live SMS",
  "No show branch gets the replay, attendees get the call CTA",
  "Replay uploaded and dripped to everyone who registered",
];

// ── Reporting ─────────────────────────────────────────────────
const kpis = [
  { label: "Active leads", value: "168", delta: "+22 this wk", Icon: Users, color: C.blue },
  { label: "Lead to appt", value: "31%", delta: "+4 pts", Icon: Target, color: C.green },
  { label: "Appts booked (mo)", value: "47", delta: "+9", Icon: Calendar, color: C.amber },
  { label: "Avg response", value: "38s", delta: "speed to lead", Icon: Clock, color: C.purple },
];
const sources = [
  { name: "Facebook Ads", leads: 132, conv: 18 },
  { name: "Zillow", leads: 88, conv: 22 },
  { name: "Referral", leads: 61, conv: 41 },
  { name: "Webinar", leads: 54, conv: 34 },
  { name: "YouTube", leads: 39, conv: 15 },
  { name: "Website", leads: 33, conv: 27 },
];
const campaigns = [
  { name: "New listing blast", open: 48, color: C.amber },
  { name: "Buyer nurture", open: 39, color: C.blue },
  { name: "Past client check-in", open: 57, color: C.green },
  { name: "Webinar invite", open: 44, color: C.purple },
];

const usd = (n: number) => "$" + n.toLocaleString("en-US");

// ── Component ──────────────────────────────────────────────────
export default function BnsCommandCenter() {
  const [view, setView] = useState<"pipelines" | "events" | "reporting">("pipelines");
  const [side, setSide] = useState<"buyer" | "seller">("buyer");
  const stages = side === "buyer" ? buyer : seller;
  const [active, setActive] = useState(stages[0].id);
  const stage = stages.find((s) => s.id === active) ?? stages[0];
  const maxLeads = Math.max(...sources.map((s) => s.leads));

  function switchSide(s: "buyer" | "seller") {
    setSide(s);
    setActive((s === "buyer" ? buyer : seller)[0].id);
  }

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}} @keyframes grow{from{width:0}}`}</style>
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.amber, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.amber, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · The BNS Companies
          </div>
          <h1 style={{ fontSize: 29, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            A GoHighLevel command center for real estate
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 730, margin: 0, lineHeight: 1.65 }}>
            You want a resident GoHighLevel specialist who owns the CRM, automations, funnels, events, and reporting.
            So instead of listing those, I built a working command center around the exact things you listed. Switch
            between the three views below. This is the daily surface I would run for you, and the systems behind it.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 24, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "pipelines", label: "Pipelines", Icon: TrendingUp },
            { id: "events", label: "Event Funnel", Icon: Ticket },
            { id: "reporting", label: "Reporting", Icon: BarChart3 },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.amber : "transparent", color: view === v.id ? "#04102B" : C.sub, fontSize: 13, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* ── PIPELINES ── */}
            {view === "pipelines" && (
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  {(["buyer", "seller"] as const).map((s) => (
                    <button key={s} onClick={() => switchSide(s)}
                      style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 15px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700,
                        border: `1px solid ${side === s ? C.amber + "99" : C.border}`, background: side === s ? C.amber + "1A" : C.card, color: side === s ? C.amber : C.sub }}>
                      {s === "buyer" ? <Home size={14} /> : <Building2 size={14} />}
                      {s === "buyer" ? "Buyer pipeline" : "Seller pipeline"}
                    </button>
                  ))}
                </div>

                {/* Stage strip */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
                  {stages.map((s) => {
                    const on = active === s.id;
                    return (
                      <button key={s.id} onClick={() => setActive(s.id)}
                        style={{ flex: "1 0 auto", minWidth: 116, textAlign: "left", cursor: "pointer", padding: "12px 13px", borderRadius: 12,
                          border: `1px solid ${on ? s.color + "99" : C.border}`, background: on ? s.color + "16" : C.card }}>
                        <s.Icon size={15} style={{ color: s.color, marginBottom: 8 }} />
                        <div style={{ fontSize: 12, fontWeight: 600, color: on ? C.ink : C.sub, lineHeight: 1.3 }}>{s.name}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.count}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Stage detail */}
                <div style={{ marginTop: 14, background: C.card, border: `1px solid ${stage.color}55`, borderRadius: 16, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                    <span style={{ width: 38, height: 38, borderRadius: 11, background: stage.color + "1E", display: "grid", placeItems: "center" }}>
                      <stage.Icon size={19} style={{ color: stage.color }} />
                    </span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{stage.name}</div>
                      <div style={{ fontSize: 12.5, color: C.muted }}>{stage.count} contacts in this stage · automations firing below</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: 7 }}>
                    {stage.autos.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.green + "0C", border: `1px solid ${C.green}28`, borderRadius: 10, padding: "9px 12px" }}>
                        <Zap size={14} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── EVENTS ── */}
            {view === "events" && (
              <div>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 22px", marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 16 }}>
                    Webinar registration funnel · last event
                  </div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {funnel.map((f, i) => {
                      const pct = Math.round((f.count / funnel[0].count) * 100);
                      return (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                            <span style={{ color: C.ink, fontWeight: 600 }}>{f.label}</span>
                            <span style={{ color: C.muted }}>{f.count} · {pct}%</span>
                          </div>
                          <div style={{ height: 26, background: C.bg2, borderRadius: 8, overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: f.color + "cc", borderRadius: 8, animation: "grow .6s ease" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 14, fontSize: 12.5, color: C.sub }}>
                    <b style={{ color: C.green }}>52 booked calls</b> from one webinar, captured and followed up automatically.
                  </div>
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: C.amber, letterSpacing: .5, textTransform: "uppercase", marginBottom: 12 }}>
                    <Bot size={14} /> The automation behind it
                  </div>
                  <div style={{ display: "grid", gap: 7 }}>
                    {eventAutos.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px" }}>
                        <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: 99, background: C.amber + "22", color: C.amber, fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center", marginTop: 1 }}>{i + 1}</span>
                        <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── REPORTING ── */}
            {view === "reporting" && (
              <div>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginBottom: 16 }}>
                  {kpis.map((k, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px 15px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                        <k.Icon size={14} style={{ color: k.color }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .4, textTransform: "uppercase" }}>{k.label}</span>
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{k.value}</div>
                      <div style={{ fontSize: 11.5, color: C.green, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                        <ArrowUpRight size={12} /> {k.delta}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                  {/* Lead sources */}
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 14 }}>Lead source ROI</div>
                    <div style={{ display: "grid", gap: 11 }}>
                      {sources.map((s, i) => (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                            <span style={{ color: C.ink, fontWeight: 600 }}>{s.name}</span>
                            <span style={{ color: C.muted }}>{s.leads} leads · <span style={{ color: C.green }}>{s.conv}% conv</span></span>
                          </div>
                          <div style={{ height: 8, background: C.bg2, borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ width: `${Math.round((s.leads / maxLeads) * 100)}%`, height: "100%", background: C.blue, borderRadius: 99 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campaigns */}
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 14 }}>Campaign open rates</div>
                    <div style={{ display: "grid", gap: 13 }}>
                      {campaigns.map((c, i) => (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                            <span style={{ color: C.ink, fontWeight: 600 }}>{c.name}</span>
                            <span style={{ color: c.color, fontWeight: 700 }}>{c.open}%</span>
                          </div>
                          <div style={{ height: 8, background: C.bg2, borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ width: `${c.open}%`, height: "100%", background: c.color, borderRadius: 99 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 12, lineHeight: 1.6 }}>
                  Sample numbers for the demo. In your account these dashboards pull live from GoHighLevel, so you always
                  see which sources actually convert, not just which ones bring the most leads.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* What I would own */}
        <Section title="What I would own for you" Icon={LayoutDashboard} accent={C.amber}>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {[
              "CRM, pipelines, tags, triggers, and segmentation",
              "Workflow automation and troubleshooting",
              "Email and SMS campaigns, tested before launch",
              "Landing pages, funnels, forms, and surveys",
              "Calendars and appointment booking",
              "Event and webinar registration and follow up",
              "Membership and community integrations",
              "Reporting, analytics, and database hygiene",
              "SOPs and process docs for every system built",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: "11px 13px" }}>
                <CheckCircle2 size={15} style={{ color: C.amber, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.45 }}>{t}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 42, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>GoHighLevel CRM · Automation · Reporting · BVN</div>
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
    </main>
  );
}

// ── Section ──────────────────────────────────────────────────
function Section({ title, Icon, accent, children }: { title: string; Icon: typeof Zap; accent: string; children: React.ReactNode }) {
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
