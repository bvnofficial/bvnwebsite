"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, Webhook, ShieldCheck, Globe, Code2, Bot,
  GitBranch, Send, Play, RotateCcw, CheckCircle2, RefreshCw, Terminal,
  Braces, Workflow, Database, Zap, ChevronRight,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0B0A12", bg2: "#151320", card: "#1A1726", cardHi: "#221E33",
  border: "#2E2942", ink: "#F3EFFA", sub: "#B9AED1", muted: "#7B6F97",
  pink: "#EA4B71", violet: "#A78BFA", cyan: "#22D3EE", green: "#34D399",
  amber: "#FBBF24", blue: "#60A5FA", coral: "#FB7185",
};

// ── The workflow nodes ────────────────────────────────────────
type Node = {
  id: string; label: string; tech: string; Icon: typeof Webhook; color: string;
  detail: string; meta: string; retry?: boolean;
};
const nodes: Node[] = [
  { id: "trigger", label: "Webhook Trigger", tech: "POST /webhook/new-order", Icon: Webhook, color: C.pink,
    detail: "The workflow fires the moment an order webhook lands. No polling, no delay.", meta: "order_id=SO-4821 received" },
  { id: "validate", label: "Validate & Parse", tech: "JSON schema check", Icon: ShieldCheck, color: C.blue,
    detail: "The payload is validated against a schema and parsed. Malformed data is rejected before it can break anything downstream.", meta: "14 fields, schema OK" },
  { id: "enrich", label: "Enrich via REST API", tech: "GET customer + product", Icon: Globe, color: C.amber,
    detail: "A third party API is called for customer and product data. The first call hit a 429 rate limit, so the node backed off and retried automatically. This is the error handling they asked for.", meta: "200 OK, auto retried once (429)", retry: true },
  { id: "transform", label: "Python Transform", tech: "custom script", Icon: Code2, color: C.cyan,
    detail: "A custom Python script does what n8n cannot do cleanly on its own: normalize, deduplicate, and compute totals. This is where the developer part matters.", meta: "normalized, deduped 2 rows, total £1,248.00" },
  { id: "claude", label: "Claude Step", tech: "AI classify + draft", Icon: Bot, color: C.violet,
    detail: "Claude classifies intent and drafts the response. I build, debug, and optimize these AI steps with Claude Code itself.", meta: "intent=urgent_support, confidence 0.94" },
  { id: "branch", label: "Conditional Branch", tech: "route on value + intent", Icon: GitBranch, color: C.green,
    detail: "The order is routed. High value or urgent goes to the priority path, everything else to the standard nurture path.", meta: "routed → priority path" },
  { id: "deliver", label: "Deliver & Log", tech: "CRM upsert, Slack, log", Icon: Send, color: C.pink,
    detail: "The result is pushed to the CRM, the team is notified in Slack, and a structured log line is written so every run is traceable.", meta: "CRM upsert ok, Slack notified, logged" },
];

// ── Execution log lines ───────────────────────────────────────
type Lvl = "INFO" | "WARN";
const logLines: { t: string; lvl: Lvl; src: string; msg: string }[] = [
  { t: "12:04:01.220", lvl: "INFO", src: "trigger", msg: "webhook received  order_id=SO-4821" },
  { t: "12:04:01.245", lvl: "INFO", src: "validate", msg: "payload valid  fields=14" },
  { t: "12:04:01.402", lvl: "WARN", src: "enrich.api", msg: "429 rate limited, backing off, retry 1/3 in 500ms" },
  { t: "12:04:01.910", lvl: "INFO", src: "enrich.api", msg: "200 OK  latency=180ms" },
  { t: "12:04:02.050", lvl: "INFO", src: "transform.py", msg: "normalized, deduped 2 rows, total=1248.00" },
  { t: "12:04:02.320", lvl: "INFO", src: "claude", msg: "intent=urgent_support  confidence=0.94" },
  { t: "12:04:02.331", lvl: "INFO", src: "route", msg: "branch=priority" },
  { t: "12:04:02.510", lvl: "INFO", src: "deliver", msg: "crm.upsert ok  slack.notify ok" },
  { t: "12:04:02.512", lvl: "INFO", src: "run", msg: "completed in 1.29s  status=success  retries=1  errors=0" },
];

export default function N8nPipeline() {
  const [view, setView] = useState<"run" | "log" | "build">("run");
  const [active, setActive] = useState(0);
  const done = active >= nodes.length;
  const run = () => { if (done) { setActive(0); return; } setActive((n) => Math.min(n + 1, nodes.length)); };

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes ring{0%{transform:scale(.85);opacity:.7}100%{transform:scale(1.9);opacity:0}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.pink, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.pink, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · Automation Engineering
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            An n8n style automation pipeline, with a Python node and a Claude step
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 810, margin: 0, lineHeight: 1.65 }}>
            You said this is not about connecting tools, it needs a real developer: n8n, clean Python, Claude Code, and
            proper error handling. So here is a runnable model of exactly that. Run the workflow node by node and watch
            the API call hit a rate limit and auto retry, read the production style execution log, then see how it is
            built. I wrote this page with Claude Code, the way I work every day.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "run", label: "Run the Workflow", Icon: Workflow },
            { id: "log", label: "Execution Log", Icon: Terminal },
            { id: "build", label: "How It Is Built", Icon: Braces },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.pink : "transparent", color: view === v.id ? "#1A0710" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
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
                  <Zap size={17} style={{ color: C.pink }} />
                  <span style={{ fontSize: 13, color: C.sub, flex: 1, minWidth: 220 }}>
                    {done ? "Order processed end to end: enriched, transformed, classified, routed, delivered, and logged. Run it again?" : "Advance the workflow one node at a time and watch the data move, including a live retry."}
                  </span>
                  <button onClick={run}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: done ? C.cardHi : C.pink, color: done ? C.ink : "#1A0710", fontSize: 12.5, fontWeight: 700 }}>
                    {done ? <><RotateCcw size={14} /> Run again</> : <><Play size={14} /> {active === 0 ? "Run workflow" : "Next node"}</>}
                  </button>
                </div>

                <div style={{ display: "grid", gap: 0 }}>
                  {nodes.map((n, i) => {
                    const state = i < active ? "done" : i === active ? "current" : "idle";
                    const lit = state !== "idle";
                    return (
                      <div key={n.id}>
                        <div style={{ display: "flex", gap: 13, alignItems: "flex-start",
                          background: state === "current" ? C.cardHi : C.card,
                          border: `1px solid ${lit ? n.color + "66" : C.border}`, borderRadius: 13, padding: "13px 15px", transition: "all .25s" }}>
                          <span style={{ position: "relative", width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                            background: lit ? n.color + "22" : C.bg2, display: "grid", placeItems: "center" }}>
                            {state === "current" && <span style={{ position: "absolute", inset: 0, borderRadius: 11, border: `2px solid ${n.color}`, animation: "ring 1.2s ease-out infinite" }} />}
                            {state === "done"
                              ? <CheckCircle2 size={20} style={{ color: n.color }} />
                              : <n.Icon size={19} style={{ color: lit ? n.color : C.muted }} />}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: lit ? C.ink : C.muted }}>{n.label}</span>
                              <span style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", color: lit ? n.color : C.muted, background: (lit ? n.color : C.muted) + "1A", borderRadius: 6, padding: "2px 7px" }}>{n.tech}</span>
                              {n.retry && state === "current" && <span style={{ fontSize: 10.5, fontWeight: 700, color: C.amber, display: "inline-flex", alignItems: "center", gap: 4 }}><RefreshCw size={11} /> retrying</span>}
                            </div>
                            {lit && <p style={{ fontSize: 12.5, color: C.sub, margin: "6px 0 0", lineHeight: 1.55 }}>{n.detail}</p>}
                            {state === "done" && (
                              <div style={{ fontSize: 11.5, fontFamily: "ui-monospace, monospace", color: n.retry ? C.amber : C.green, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5 }}>
                                {n.retry ? <RefreshCw size={12} /> : <CheckCircle2 size={12} />} {n.meta}
                              </div>
                            )}
                          </div>
                        </div>
                        {i < nodes.length - 1 && (
                          <div style={{ height: 16, marginLeft: 34, borderLeft: `2px dashed ${i < active ? nodes[i].color + "88" : C.border}` }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {done && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", background: C.green + "12", border: `1px solid ${C.green}44`, borderRadius: 12, padding: "13px 16px", marginTop: 16 }}>
                    <CheckCircle2 size={18} style={{ color: C.green }} />
                    <span style={{ fontSize: 13.5, color: C.ink }}><b>Run complete in 1.29s.</b> 7 nodes, 1 automatic retry, 0 errors, fully logged. That is the reliability layer this role is asking for.</span>
                  </div>
                )}
              </div>
            )}

            {/* LOG */}
            {view === "log" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 14, lineHeight: 1.6 }}>
                  A workflow you cannot see into is a workflow you cannot trust. Every run writes a structured log with
                  timestamps, levels, source node, retries, and final status. Here is the log from the run above.
                </p>
                <div style={{ background: "#0A0912", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 99, background: C.coral }} />
                    <span style={{ width: 10, height: 10, borderRadius: 99, background: C.amber }} />
                    <span style={{ width: 10, height: 10, borderRadius: 99, background: C.green }} />
                    <span style={{ fontSize: 11.5, color: C.muted, marginLeft: 8, fontFamily: "ui-monospace, monospace" }}>run · order SO-4821</span>
                  </div>
                  <div style={{ padding: "12px 14px", fontFamily: "ui-monospace, monospace", fontSize: 12, lineHeight: 1.85, overflowX: "auto" }}>
                    {logLines.map((l, i) => (
                      <div key={i} style={{ whiteSpace: "pre", color: C.sub }}>
                        <span style={{ color: C.muted }}>[{l.t}] </span>
                        <span style={{ color: l.lvl === "WARN" ? C.amber : C.green, fontWeight: 700 }}>{l.lvl.padEnd(5)}</span>
                        <span style={{ color: C.violet }}> {l.src.padEnd(13)}</span>
                        <span style={{ color: C.ink }}>{l.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                  {[
                    { k: "Error handling", v: "backoff + retry" },
                    { k: "Retries", v: "1 of 3 used" },
                    { k: "Errors", v: "0" },
                    { k: "Total time", v: "1.29s" },
                  ].map((m, i) => (
                    <div key={i} style={{ flex: "1 1 150px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: "11px 13px" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .4 }}>{m.k}</div>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink, marginTop: 4, fontFamily: "ui-monospace, monospace" }}>{m.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BUILD */}
            {view === "build" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  n8n handles the orchestration, Python handles the logic that n8n should not, and Claude Code helps me
                  build and debug all of it faster. Here is the split, and where each of your strict requirements lands.
                </p>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { Icon: Workflow, t: "n8n for orchestration", d: "Triggers, branching, retries, and the flow between systems live in n8n, built and maintained for production, not a one off. This is the n8n mastery requirement.", color: C.pink },
                    { Icon: Code2, t: "Python for the real logic", d: "When data manipulation, a custom API integration, or a backend process goes past what n8n does cleanly, I drop into clean, production ready Python. This is the strict Python requirement.", color: C.cyan },
                    { Icon: Bot, t: "Claude Code as the build tool", d: "I develop, debug, and optimize the scripts and workflows with Claude Code. This whole page was built with it, and so were my GHL CLI and my Hypersonic automation engines.", color: C.violet },
                    { Icon: Globe, t: "APIs, webhooks, OAuth, JSON", d: "REST calls, inbound and outbound webhooks, OAuth connections, JSON shaping, and conditional routing between SaaS tools, databases, and CRMs. The technical foundation you list.", color: C.blue },
                    { Icon: ShieldCheck, t: "Reliability by default", d: "Error handling, backoff and retries, logging, and performance are built in from the start, not bolted on after something breaks in production.", color: C.green },
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
                  <Database size={16} style={{ color: C.pink }} />
                  <span style={{ fontSize: 12.5, color: C.sub }}>
                    Real proof of this exact stack: my Hypersonic build runs Fathom to Claude to Notion pipelines and human in the loop messaging, and my GHL CLI drives a CRM from the terminal, both built with Claude Code.
                  </span>
                  <Link href="/clients/hypersonic/milestones" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.pink, fontSize: 12.5, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                    See it <ChevronRight size={14} />
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
            <div style={{ fontSize: 12, color: C.muted }}>n8n · Python · Claude Code · APIs · BVN</div>
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
