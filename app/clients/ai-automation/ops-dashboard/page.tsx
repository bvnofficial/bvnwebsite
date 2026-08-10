"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, LayoutDashboard, Bell, Users, CheckCircle2,
  XCircle, AlertTriangle, Clock, Circle, ChevronRight, MessageSquare, Zap,
  Bot, Database, ShoppingCart, FileSpreadsheet, X, Activity, GitBranch,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  cyan: "#22D3EE", green: "#34D399", amber: "#FBBF24", coral: "#FB923C",
  purple: "#A78BFA", blue: "#3B82F6", red: "#F87171",
};

type Ad = "Live" | "Pending" | "Issue";
const adMeta: Record<Ad, { color: string }> = {
  Live: { color: C.green }, Pending: { color: C.amber }, Issue: { color: C.red },
};

type Check = { item: string; done: boolean };
type Client = { name: string; owner: string; stage: string; pct: number; ad: Ad; blockers: string[]; checklist: Check[] };

const clients: Client[] = [
  { name: "Acme Storefront", owner: "Sarah", stage: "Ad setup", pct: 70, ad: "Pending",
    blockers: ["Missing ad account access"],
    checklist: [{ item: "Intake form", done: true }, { item: "Brand assets", done: true }, { item: "Shopify connected", done: true }, { item: "Ad account access", done: false }, { item: "Pixel installed", done: false }] },
  { name: "Ledger LLC", owner: "Mike", stage: "Assets", pct: 40, ad: "Issue",
    blockers: ["Logo not provided (3 days)", "Ad account disabled"],
    checklist: [{ item: "Intake form", done: true }, { item: "Brand assets", done: false }, { item: "Shopify connected", done: true }, { item: "Ad account access", done: false }, { item: "Pixel installed", done: false }] },
  { name: "Brightside Co", owner: "Sarah", stage: "Live", pct: 100, ad: "Live",
    blockers: [],
    checklist: [{ item: "Intake form", done: true }, { item: "Brand assets", done: true }, { item: "Shopify connected", done: true }, { item: "Ad account access", done: true }, { item: "Pixel installed", done: true }] },
  { name: "Nova Fulfillment", owner: "Priya", stage: "Intake", pct: 20, ad: "Pending",
    blockers: ["Waiting on product feed"],
    checklist: [{ item: "Intake form", done: true }, { item: "Brand assets", done: false }, { item: "Shopify connected", done: false }, { item: "Ad account access", done: false }, { item: "Pixel installed", done: false }] },
  { name: "Peak Supplements", owner: "Mike", stage: "Tracking", pct: 85, ad: "Live",
    blockers: ["Conversion tracking not verified"],
    checklist: [{ item: "Intake form", done: true }, { item: "Brand assets", done: true }, { item: "Shopify connected", done: true }, { item: "Ad account access", done: true }, { item: "Pixel installed", done: false }] },
  { name: "Harbor Goods", owner: "Priya", stage: "Live", pct: 100, ad: "Live",
    blockers: [],
    checklist: [{ item: "Intake form", done: true }, { item: "Brand assets", done: true }, { item: "Shopify connected", done: true }, { item: "Ad account access", done: true }, { item: "Pixel installed", done: true }] },
];

// ── Component ──────────────────────────────────────────────────
export default function OpsDashboard() {
  const [view, setView] = useState<"board" | "alerts" | "wiring">("board");
  const [openName, setOpenName] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const open = clients.find((c) => c.name === openName) ?? null;

  const alerts = useMemo(
    () => clients.flatMap((c) => c.blockers.map((b) => ({ client: c.name, owner: c.owner, text: b }))),
    []
  );
  const kpis = useMemo(() => ({
    clients: clients.length,
    inProgress: clients.filter((c) => c.pct < 100).length,
    live: clients.filter((c) => c.pct === 100).length,
    blockers: alerts.length,
    adsLive: clients.filter((c) => c.ad === "Live").length,
  }), [alerts.length]);

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.purple, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.purple, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · Internal Tools
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            An internal ops dashboard, built with Claude Code
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 750, margin: 0, lineHeight: 1.65 }}>
            One of your example projects was a dashboard showing every client, their onboarding status, ad account
            status, and current blockers, that also reminds the team when something is missing. So I built exactly
            that. Click a client to see the detail, then open the alerts view and send the automated reminders. This
            whole page was built with Claude Code, which is the skill you are hiring for.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "board", label: "Client Dashboard", Icon: LayoutDashboard },
            { id: "alerts", label: "Automated Alerts", Icon: Bell },
            { id: "wiring", label: "How It Is Wired", Icon: GitBranch },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.purple : "transparent", color: view === v.id ? "#04102B" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* BOARD */}
            {view === "board" && (
              <div>
                <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", marginBottom: 16 }}>
                  {[
                    { k: "Clients", v: kpis.clients, c: C.blue },
                    { k: "In onboarding", v: kpis.inProgress, c: C.amber },
                    { k: "Live", v: kpis.live, c: C.green },
                    { k: "Open blockers", v: kpis.blockers, c: C.red },
                    { k: "Ad accounts live", v: kpis.adsLive, c: C.green },
                  ].map((m, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .4 }}>{m.k}</div>
                      <div style={{ fontSize: 23, fontWeight: 800, color: m.c, marginTop: 5 }}>{m.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.4fr 1fr 1.4fr 24px", gap: 10, padding: "11px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>
                    <span>Client</span><span>Onboarding</span><span>Ad account</span><span>Blockers</span><span />
                  </div>
                  {clients.map((c, i) => (
                    <button key={c.name} onClick={() => setOpenName(c.name)}
                      style={{ display: "grid", gridTemplateColumns: "1.5fr 1.4fr 1fr 1.4fr 24px", gap: 10, alignItems: "center", width: "100%", textAlign: "left", cursor: "pointer",
                        background: "transparent", border: "none", padding: "12px 16px", borderTop: i ? `1px solid ${C.border}` : "none" }}>
                      <span>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, display: "block" }}>{c.name}</span>
                        <span style={{ fontSize: 11, color: C.muted }}>Owner: {c.owner}</span>
                      </span>
                      <span>
                        <span style={{ fontSize: 12, color: C.sub }}>{c.stage}</span>
                        <span style={{ display: "block", height: 6, background: C.bg2, borderRadius: 99, overflow: "hidden", marginTop: 4 }}>
                          <span style={{ display: "block", width: `${c.pct}%`, height: "100%", background: c.pct === 100 ? C.green : C.purple }} />
                        </span>
                      </span>
                      <span>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: adMeta[c.ad].color, background: adMeta[c.ad].color + "18", border: `1px solid ${adMeta[c.ad].color}3A`, borderRadius: 6, padding: "3px 9px" }}>{c.ad}</span>
                      </span>
                      <span>
                        {c.blockers.length === 0
                          ? <span style={{ fontSize: 12, color: C.green, display: "inline-flex", alignItems: "center", gap: 5 }}><CheckCircle2 size={13} /> None</span>
                          : <span style={{ fontSize: 12, color: C.red, display: "inline-flex", alignItems: "center", gap: 5 }}><AlertTriangle size={13} /> {c.blockers.length}</span>}
                      </span>
                      <ChevronRight size={15} style={{ color: C.muted }} />
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>Click any client for the full onboarding checklist and blocker detail.</p>
              </div>
            )}

            {/* ALERTS */}
            {view === "alerts" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                  <MessageSquare size={17} style={{ color: C.purple }} />
                  <span style={{ fontSize: 13, color: C.sub, flex: 1, minWidth: 220 }}>
                    When the dashboard detects a missing item, it pings the right team member automatically. Try it.
                  </span>
                  <button onClick={() => setSent(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: sent ? C.green : C.purple, color: "#04102B", fontSize: 12.5, fontWeight: 700 }}>
                    <Bell size={14} /> {sent ? "Reminders sent" : "Run checks and send reminders"}
                  </button>
                </div>

                {sent && (
                  <div style={{ display: "flex", gap: 9, alignItems: "center", background: C.green + "12", border: `1px solid ${C.green}3A`, borderRadius: 12, padding: "11px 15px", marginBottom: 12 }}>
                    <CheckCircle2 size={16} style={{ color: C.green }} />
                    <span style={{ fontSize: 13, color: C.ink }}>{alerts.length} reminders sent to {new Set(alerts.map((a) => a.owner)).size} team members via Slack.</span>
                  </div>
                )}

                <div style={{ display: "grid", gap: 8 }}>
                  {alerts.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 15px" }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, background: (sent ? C.green : C.amber) + "18", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        {sent ? <CheckCircle2 size={15} style={{ color: C.green }} /> : <Clock size={15} style={{ color: C.amber }} />}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>
                          <b style={{ color: C.purple }}>@{a.owner}</b> &mdash; {a.client}: {a.text}
                        </div>
                        <div style={{ fontSize: 11.5, color: sent ? C.green : C.muted, marginTop: 3 }}>
                          {sent ? "Reminder sent to Slack, just now" : "Detected, will notify on next run"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WIRING */}
            {view === "wiring" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  The dashboard is only useful because it pulls from where the work actually lives, and pushes reminders
                  to where the team actually is. Here is how I would wire it, and how Claude speeds up every part.
                </p>
                <div style={{ display: "flex", alignItems: "stretch", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                  {[
                    { Icon: ShoppingCart, t: "Sources", d: "Shopify, ad platforms, Google Sheets, Airtable", color: C.blue },
                    { Icon: Zap, t: "Sync layer", d: "APIs, webhooks, n8n / Make, custom scripts", color: C.amber },
                    { Icon: LayoutDashboard, t: "Dashboard + rules", d: "This view, plus the checks that flag missing items", color: C.purple },
                    { Icon: MessageSquare, t: "Alerts out", d: "Automated Slack reminders to the right owner", color: C.green },
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
                    { Icon: Bot, t: "Claude plans and builds it", d: "I use Claude and Claude Code to design the data model, write the sync scripts and API calls, and generate the dashboard itself, then test until it works." },
                    { Icon: Database, t: "Connects APIs with no native integration", d: "When a platform has no ready made connector, I build a small custom webhook relay or script to bridge it, which is exactly this kind of glue work." },
                    { Icon: FileSpreadsheet, t: "Replaces the spreadsheet", d: "One live source of truth the team trusts, instead of chasing status across tabs and DMs." },
                    { Icon: Activity, t: "Monitors and alerts on its own", d: "Rules watch for missing items and problems and notify the team automatically, no one has to remember to check." },
                  ].map((x, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, background: C.purple + "1A", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <x.Icon size={15} style={{ color: C.purple }} />
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
        </AnimatePresence>

        {/* Footer */}
        <div style={{ marginTop: 42, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>AI Automation · Claude Code · Internal Tools · BVN</div>
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

      {/* Client detail modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenName(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(4,10,26,0.72)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
            <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 460, background: C.card, border: `1px solid ${C.purple}55`, borderRadius: 18, overflow: "hidden" }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{open.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Owner: {open.owner} &middot; Stage: {open.stage} &middot; {open.pct}%</div>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: adMeta[open.ad].color, background: adMeta[open.ad].color + "18", border: `1px solid ${adMeta[open.ad].color}3A`, borderRadius: 6, padding: "3px 9px" }}>Ads: {open.ad}</span>
                <button onClick={() => setOpenName(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X size={18} /></button>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8 }}>Onboarding checklist</div>
                <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
                  {open.checklist.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "center", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 12px" }}>
                      {c.done ? <CheckCircle2 size={14} style={{ color: C.green }} /> : <Circle size={14} style={{ color: C.muted }} />}
                      <span style={{ fontSize: 12.5, color: c.done ? C.sub : C.ink, textDecoration: c.done ? "none" : "none" }}>{c.item}</span>
                      {!c.done && <span style={{ marginLeft: "auto", fontSize: 10.5, color: C.amber }}>missing</span>}
                    </div>
                  ))}
                </div>
                {open.blockers.length > 0 ? (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.red, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8 }}>Blockers and the reminder that fires</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {open.blockers.map((b, i) => (
                        <div key={i} style={{ background: C.red + "10", border: `1px solid ${C.red}30`, borderRadius: 9, padding: "9px 12px" }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12.5, color: C.ink }}><AlertTriangle size={13} style={{ color: C.red }} /> {b}</div>
                          <div style={{ fontSize: 11.5, color: C.purple, marginTop: 5, display: "flex", gap: 6, alignItems: "center" }}>
                            <MessageSquare size={12} /> Auto reminder to @{open.owner}: &ldquo;{open.name} is blocked, {b.toLowerCase()}.&rdquo;
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", gap: 9, alignItems: "center", background: C.green + "12", border: `1px solid ${C.green}3A`, borderRadius: 10, padding: "11px 14px", fontSize: 13, color: C.ink }}>
                    <CheckCircle2 size={15} style={{ color: C.green }} /> No blockers. Fully onboarded and live.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
