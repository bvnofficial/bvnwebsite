"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, Play, RotateCcw, CheckCircle2, ChevronRight,
  MousePointerClick, Layout, ClipboardList, Users, MessageSquare, CalendarCheck,
  TrendingDown, BarChart3, Target, Filter, Zap, Repeat, Facebook,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0A0F1C", bg2: "#111A2E", card: "#15203A", cardHi: "#1B2A4A",
  border: "#243354", ink: "#EAF1FC", sub: "#A8BADB", muted: "#6E7FA3",
  blue: "#3B82F6", sky: "#38BDF8", green: "#34D399", amber: "#FBBF24",
  violet: "#A78BFA", coral: "#FB7185", teal: "#2DD4BF",
};

// ── The lead journey (ad → funnel → CRM → follow-up → conversion) ──
type Step = {
  id: string; label: string; stage: string; Icon: typeof Layout; color: string;
  detail: string; meta: string;
};
const steps: Step[] = [
  { id: "ad", label: "Meta Ad", stage: "Facebook / Instagram", Icon: Facebook, color: C.blue,
    detail: "A tested ad runs to a defined audience. I split test creative, copy, and audiences, then push budget to the winners and cut the losers.", meta: "3 creatives live, CPC $0.62, CTR 2.1%" },
  { id: "click", label: "Click", stage: "tracked", Icon: MousePointerClick, color: C.sky,
    detail: "The click carries UTM and ad data through, so every lead is traceable back to the exact ad and audience that produced it. No guessing which ad works.", meta: "utm_source=meta, ad_id captured" },
  { id: "funnel", label: "Landing Funnel", stage: "GoHighLevel", Icon: Layout, color: C.teal,
    detail: "A GHL funnel page matched to the ad promise. One offer, one clear action, fast load. The message on the page mirrors the ad so the visitor does not bounce.", meta: "GHL funnel, 41% opt-in rate" },
  { id: "form", label: "Lead Form", stage: "capture", Icon: ClipboardList, color: C.green,
    detail: "The form captures the lead and fires instantly. Fewer fields, higher conversion. The submission triggers everything downstream in real time.", meta: "form submit → workflow trigger" },
  { id: "crm", label: "CRM Contact", stage: "GHL pipeline", Icon: Users, color: C.violet,
    detail: "A contact is created or de-duplicated, tagged with the source ad and campaign, and dropped into the right pipeline stage. Now the lead is an asset, not a lost click.", meta: "contact tagged meta/campaign-A, stage=New Lead" },
  { id: "followup", label: "Follow-up", stage: "automation", Icon: MessageSquare, color: C.amber,
    detail: "An SMS and email sequence fires in the first five minutes, when intent is highest, then nurtures on a schedule. Speed to lead is where most ad money is won or lost.", meta: "SMS + email sent, 4m 12s to first touch" },
  { id: "won", label: "Booked & Won", stage: "conversion", Icon: CalendarCheck, color: C.green,
    detail: "The lead books or replies, moves down the pipeline, and closes. Every stage is reported, so you see cost per lead and cost per booking, not just clicks.", meta: "pipeline → Booked → Won, reported" },
];

// ── Reporting: before vs after optimization (deterministic) ──
type Metrics = { spend: number; leads: number; cpl: number; booked: number; cpb: number; conv: number; funnel: number[] };
const REPORT: Record<"before" | "after", Metrics> = {
  before: { spend: 3000, leads: 120, cpl: 25.0, booked: 18, cpb: 166.7, conv: 15, funnel: [100, 34, 12, 4] },
  after:  { spend: 3000, leads: 214, cpl: 14.0, booked: 41, cpb: 73.2, conv: 19, funnel: [100, 46, 24, 10] },
};
const FUNNEL_LABELS = ["Impressions", "Clicks", "Leads", "Booked"];

export default function LeadJourney() {
  const [view, setView] = useState<"journey" | "numbers" | "method">("journey");
  const [active, setActive] = useState(0);
  const done = active >= steps.length;
  const run = () => { if (done) { setActive(0); return; } setActive((n) => Math.min(n + 1, steps.length)); };

  const [mode, setMode] = useState<"before" | "after">("after");
  const m = REPORT[mode];

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes ring{0%{transform:scale(.85);opacity:.7}100%{transform:scale(1.9);opacity:0}}@keyframes grow{from{width:0}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.sky, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.sky, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · Ads Manager + GoHighLevel
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            Ad to conversion, the whole journey in one place
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 820, margin: 0, lineHeight: 1.65 }}>
            You said it plainly: you want someone who does not just run ads, but understands the full path from ad to
            funnel to CRM to follow-up to conversion. That is how I think about paid media, so here it is running. Click
            through the journey, then see the numbers move when the campaign gets optimized, and how I get there. I built
            this page with Claude Code, the way I work.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "journey", label: "The Journey", Icon: Target },
            { id: "numbers", label: "The Numbers", Icon: BarChart3 },
            { id: "method", label: "How I Optimize", Icon: Filter },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.blue : "transparent", color: view === v.id ? "#08122A" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* ── JOURNEY ────────────────────────────────────────── */}
            {view === "journey" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
                  <Zap size={17} style={{ color: C.sky }} />
                  <span style={{ fontSize: 13, color: C.sub, flex: 1, minWidth: 220 }}>
                    {done ? "One lead, tracked the whole way: ad, click, funnel, form, CRM, follow-up, and closed. Run it again?" : "Advance one step at a time and watch a single lead move from ad click to closed, with what GHL records at each stage."}
                  </span>
                  <button onClick={run}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: done ? C.cardHi : C.blue, color: done ? C.ink : "#08122A", fontSize: 12.5, fontWeight: 700 }}>
                    {done ? <><RotateCcw size={14} /> Run again</> : <><Play size={14} /> {active === 0 ? "Start the journey" : "Next step"}</>}
                  </button>
                </div>

                <div style={{ display: "grid", gap: 0 }}>
                  {steps.map((s, i) => {
                    const state = i < active ? "done" : i === active ? "current" : "idle";
                    const lit = state !== "idle";
                    return (
                      <div key={s.id}>
                        <div style={{ display: "flex", gap: 13, alignItems: "flex-start",
                          background: state === "current" ? C.cardHi : C.card,
                          border: `1px solid ${lit ? s.color + "66" : C.border}`, borderRadius: 13, padding: "13px 15px", transition: "all .25s" }}>
                          <span style={{ position: "relative", width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                            background: lit ? s.color + "22" : C.bg2, display: "grid", placeItems: "center" }}>
                            {state === "current" && <span style={{ position: "absolute", inset: 0, borderRadius: 11, border: `2px solid ${s.color}`, animation: "ring 1.2s ease-out infinite" }} />}
                            {state === "done"
                              ? <CheckCircle2 size={20} style={{ color: s.color }} />
                              : <s.Icon size={19} style={{ color: lit ? s.color : C.muted }} />}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: lit ? C.ink : C.muted }}>{s.label}</span>
                              <span style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", color: lit ? s.color : C.muted, background: (lit ? s.color : C.muted) + "1A", borderRadius: 6, padding: "2px 7px" }}>{s.stage}</span>
                            </div>
                            {lit && <p style={{ fontSize: 12.5, color: C.sub, margin: "6px 0 0", lineHeight: 1.55 }}>{s.detail}</p>}
                            {state === "done" && (
                              <div style={{ fontSize: 11.5, fontFamily: "ui-monospace, monospace", color: C.green, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5 }}>
                                <CheckCircle2 size={12} /> {s.meta}
                              </div>
                            )}
                          </div>
                        </div>
                        {i < steps.length - 1 && (
                          <div style={{ height: 16, marginLeft: 34, borderLeft: `2px dashed ${i < active ? steps[i].color + "88" : C.border}` }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {done && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", background: C.green + "12", border: `1px solid ${C.green}44`, borderRadius: 12, padding: "13px 16px", marginTop: 16 }}>
                    <CheckCircle2 size={18} style={{ color: C.green }} />
                    <span style={{ fontSize: 13.5, color: C.ink }}><b>Full loop closed.</b> Ad to booking, every step tracked in GHL. This is the difference between running ads and owning the lead-generation system around them.</span>
                  </div>
                )}
              </div>
            )}

            {/* ── NUMBERS ────────────────────────────────────────── */}
            {view === "numbers" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                  <span style={{ fontSize: 13.5, color: C.sub, flex: 1, minWidth: 200 }}>
                    Same $3,000 spend. Watch what happens to cost per lead when the campaign is actually optimized.
                  </span>
                  <div style={{ display: "flex", gap: 4, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4 }}>
                    {([
                      { id: "before", label: "Before" },
                      { id: "after", label: "After optimization" },
                    ] as const).map((t) => (
                      <button key={t.id} onClick={() => setMode(t.id)}
                        style={{ padding: "7px 13px", borderRadius: 7, border: "none", cursor: "pointer",
                          background: mode === t.id ? C.blue : "transparent", color: mode === t.id ? "#08122A" : C.sub, fontSize: 12, fontWeight: 700 }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* metric tiles */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
                  {[
                    { k: "Ad spend", v: `$${m.spend.toLocaleString()}`, c: C.sub },
                    { k: "Leads", v: m.leads, c: C.sky, up: mode === "after" },
                    { k: "Cost per lead", v: `$${m.cpl.toFixed(2)}`, c: C.green, down: mode === "after" },
                    { k: "Booked", v: m.booked, c: C.violet, up: mode === "after" },
                    { k: "Cost per booking", v: `$${m.cpb.toFixed(2)}`, c: C.green, down: mode === "after" },
                    { k: "Lead to booked", v: `${m.conv}%`, c: C.amber, up: mode === "after" },
                  ].map((t, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .4 }}>{t.k}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: t.c, fontFamily: "ui-monospace, monospace" }}>{t.v}</span>
                        {t.down && <TrendingDown size={15} style={{ color: C.green }} />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* funnel bars */}
                <div style={{ marginTop: 16, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 12 }}>The funnel, relative volume</div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {m.funnel.map((val, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ width: 92, fontSize: 11.5, color: C.sub, textAlign: "right", flexShrink: 0 }}>{FUNNEL_LABELS[i]}</span>
                        <div style={{ flex: 1, background: C.bg2, borderRadius: 7, overflow: "hidden", height: 26 }}>
                          <div style={{ width: `${val}%`, height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.sky})`, borderRadius: 7, animation: "grow .5s ease", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#08122A" }}>{val}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", background: C.blue + "12", border: `1px solid ${C.blue}44`, borderRadius: 12, padding: "13px 16px", marginTop: 14 }}>
                  <TrendingDown size={18} style={{ color: C.green }} />
                  <span style={{ fontSize: 13.5, color: C.ink }}>
                    Same budget, cost per lead from <b>$25.00</b> down to <b>$14.00</b> and bookings more than doubled. That is the job: not more spend, better spend. Sample numbers, the method is real.
                  </span>
                </div>
              </div>
            )}

            {/* ── METHOD ─────────────────────────────────────────── */}
            {view === "method" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  Lower cost per lead does not come from luck. It comes from testing hard, reading the data, and fixing the
                  part of the journey that is actually leaking. Here is how I work a campaign, and where each of your
                  requirements lands.
                </p>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { Icon: Repeat, t: "Test, then concentrate budget", d: "Multiple creatives, audiences, and copy angles run against each other. Money moves to the winners and off the losers weekly. This is the ad management and testing you list.", color: C.blue },
                    { Icon: Target, t: "Match the message to the click", d: "The funnel page mirrors the ad promise, so people who click actually convert. A great ad into a mismatched page just burns money.", color: C.teal },
                    { Icon: MousePointerClick, t: "Track every lead to its source", d: "UTMs and ad data follow the lead into GHL, so I can tell you which ad and audience produce cheap leads AND ones that close, not just cheap clicks.", color: C.sky },
                    { Icon: MessageSquare, t: "Speed to lead, automated", d: "GHL workflows fire SMS and email within minutes of a form submit, then nurture. Most ad spend is wasted on leads nobody followed up fast enough.", color: C.amber },
                    { Icon: Filter, t: "Improve lead quality, not just cost", d: "Cheap leads that never buy are expensive. I tune targeting and qualifying questions so the pipeline fills with people who actually convert.", color: C.violet },
                    { Icon: BarChart3, t: "Report what matters", d: "Spend, cost per lead, cost per booking, and conversion by campaign, in plain language with what I changed and why. Regular, readable, honest.", color: C.green },
                  ].map((x, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                      <span style={{ width: 32, height: 32, borderRadius: 9, background: x.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <x.Icon size={16} style={{ color: x.color }} />
                      </span>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{x.t}</div>
                        <p style={{ fontSize: 12.5, color: C.sub, margin: "3px 0 0", lineHeight: 1.5 }}>{x.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 16, background: C.bg2, border: `1px dashed ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                  <Megaphone size={16} style={{ color: C.sky }} />
                  <span style={{ fontSize: 12.5, color: C.sub, flex: "1 1 300px" }}>
                    Real proof: I run GoHighLevel funnels, forms, and automations on live client accounts, I am Google Ads certified and run Meta lead campaigns into GHL, and I build the reporting dashboards that sit on top.
                  </span>
                  <Link href="/case-studies" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.sky, fontSize: 12.5, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                    See case studies <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}

          </motion.div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 42, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>Meta &amp; Google Ads · GoHighLevel · funnels · CRM · reporting · BVN</div>
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
