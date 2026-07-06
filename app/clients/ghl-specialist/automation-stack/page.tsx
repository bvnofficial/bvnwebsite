"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Facebook, Webhook, Network, Send, CreditCard,
  Calendar, Braces, Share2, Boxes, ShieldCheck, CheckCircle2, Clock,
  PhoneCall, Sparkles, Tag, Repeat, ListChecks, FileText, GitBranch,
  Zap,
} from "lucide-react";

// Brand tokens (BVN client-proposal palette)
const C = {
  bg: "#0A1120",
  bg2: "#0E1830",
  card: "#121E3A",
  cardHi: "#16264A",
  border: "#22324F",
  ink: "#EAF1FC",
  sub: "#9FB1D0",
  muted: "#647697",
  cyan: "#22D3EE",
  green: "#34D399",
  amber: "#FBBF24",
  coral: "#FB923C",
  purple: "#A78BFA",
  blue: "#3B82F6",
  rose: "#FB7185",
  red: "#F87171",
};

// ─────────────────────────────────────────────────────────────
function Section({
  eyebrow, title, sub, children,
}: {
  eyebrow: string; title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: 64 }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.coral }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. The stack (platforms at a glance)
const STACK = [
  { Icon: Boxes, name: "GoHighLevel", role: "CRM, funnels, workflows, the hub", color: C.coral },
  { Icon: Network, name: "n8n", role: "Routing, enrichment, cross platform logic", color: C.purple },
  { Icon: Send, name: "Instantly", role: "Cold email outreach at scale", color: C.cyan },
  { Icon: CreditCard, name: "Stripe", role: "Payments and billing as triggers", color: C.green },
  { Icon: Calendar, name: "Google Workspace", role: "Calendars, Sheets, email", color: C.blue },
  { Icon: Facebook, name: "Facebook Lead Ads", role: "Paid lead capture into GHL", color: C.blue },
  { Icon: Zap, name: "Zapier and Make", role: "No code glue where native is faster", color: C.amber },
];

function StackRow() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
      {STACK.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          style={{ display: "flex", alignItems: "center", gap: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}`, flexShrink: 0 }}>
            <s.Icon size={17} color={s.color} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{s.name}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, lineHeight: 1.35 }}>{s.role}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. A lead's journey across the stack (interactive)
type Step = {
  n: string; title: string; from: string; to: string; mech: string;
  detail: string; color: string;
};

const JOURNEY: Step[] = [
  {
    n: "01", title: "Lead comes in", from: "Facebook Lead Ads", to: "GoHighLevel", mech: "Native sync",
    detail: "A Facebook lead form submit lands in GoHighLevel in seconds through the native Lead Ads connection, tagged by campaign and ad set. No CSV exports, no lag.",
    color: C.blue,
  },
  {
    n: "02", title: "GHL fires a webhook", from: "GoHighLevel", to: "n8n", mech: "Outbound webhook, JSON",
    detail: "A workflow posts a clean JSON payload to an n8n webhook: contact, source, and the custom fields that matter. GHL stays the system of record, n8n does the heavy logic.",
    color: C.purple,
  },
  {
    n: "03", title: "n8n routes the lead", from: "n8n", to: "Decision", mech: "Enrich and branch",
    detail: "n8n enriches and scores the lead, then branches. A hot lead goes straight back to GHL for a booking sequence. A cold lead is handed to Instantly for outreach.",
    color: C.amber,
  },
  {
    n: "04", title: "Cold outreach at scale", from: "n8n", to: "Instantly", mech: "API call",
    detail: "n8n adds the contact to the right Instantly campaign through the API and the sequence starts. The CRM and the outreach tool are working from the same data, not two disconnected lists.",
    color: C.cyan,
  },
  {
    n: "05", title: "Reply comes back", from: "Instantly", to: "GoHighLevel", mech: "Inbound webhook",
    detail: "A positive reply triggers a webhook back into GHL. The contact is tagged, the pipeline moves, and sales gets notified. The loop is closed automatically, nobody re keys anything.",
    color: C.green,
  },
  {
    n: "06", title: "Payment closes the loop", from: "Stripe", to: "GHL + Google", mech: "Webhook + calendar sync",
    detail: "A Stripe webhook turns a paid invoice into a customer tag, moves the pipeline to won, kicks off onboarding, and books the kickoff on the Google calendar. Start to finish, hands off.",
    color: C.coral,
  },
];

function Journey() {
  const [i, setI] = useState(0);
  const s = JOURNEY[i];

  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
        {JOURNEY.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.n}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, textAlign: "left", cursor: "pointer", width: 150,
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: st.color }}>{st.n}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 4, lineHeight: 1.3 }}>{st.title}</div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={s.n}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${s.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: s.color, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px" }}>{s.from}</span>
            <ArrowRight size={15} color={C.muted} />
            <span style={{ fontSize: 13, fontWeight: 800, color: C.ink, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px" }}>{s.to}</span>
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: C.sub, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 11px" }}>
              <Webhook size={12} /> {s.mech}
            </span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 6 }}>{s.title}</div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{s.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Integrations explorer (interactive)
type Integ = { id: string; Icon: typeof Network; name: string; mech: string; detail: string; color: string };

const INTEGRATIONS: Integ[] = [
  { id: "n8n", Icon: Network, name: "n8n", mech: "Webhooks both ways", color: C.purple,
    detail: "The automation brain. GHL talks to n8n through inbound and outbound webhooks, and I build the nodes that route, enrich, score, and sync data in both directions. This is where the cross platform logic lives." },
  { id: "instantly", Icon: Send, name: "Instantly", mech: "API", color: C.cyan,
    detail: "Cold email at scale. I push contacts into the right campaign through the API and pull replies and events back into GHL, so outreach and the CRM never drift apart. The GHL to n8n to Instantly chain you described is one I build regularly." },
  { id: "zapmake", Icon: Zap, name: "Zapier and Make", mech: "No code", color: C.amber,
    detail: "The lightest glue for quick connections where a full n8n flow would be overkill. I pick the simplest tool that holds up under load, and move logic into n8n or code when a Zap starts getting fragile." },
  { id: "stripe", Icon: CreditCard, name: "Stripe", mech: "Webhooks", color: C.green,
    detail: "Payments and billing as automation triggers. A paid invoice or subscription event fires a webhook that tags the customer, moves the pipeline, and starts onboarding, with no manual reconciliation." },
  { id: "google", Icon: Calendar, name: "Google Workspace", mech: "Two way sync", color: C.blue,
    detail: "Two way calendar sync for bookings, Sheets for reporting handoffs, and Gmail where it fits. Booked calls land on the right calendar with reminders, and no double bookings across the team." },
  { id: "fb", Icon: Facebook, name: "Facebook Lead Ads", mech: "Native", color: C.rose,
    detail: "Native lead sync so paid leads hit a GHL workflow in seconds, tagged by campaign and ad set. Speed to lead is the whole game with paid traffic, so this connection has to be instant and clean." },
];

function IntegrationExplorer() {
  const [activeId, setActiveId] = useState(INTEGRATIONS[0].id);
  const active = INTEGRATIONS.find((x) => x.id === activeId) ?? INTEGRATIONS[0];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {INTEGRATIONS.map((x) => {
          const on = x.id === activeId;
          return (
            <button
              key={x.id}
              onClick={() => setActiveId(x.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                color: on ? C.bg : C.sub, background: on ? x.color : C.card,
                border: `1px solid ${on ? x.color : C.border}`, borderRadius: 999, padding: "8px 13px", transition: "all 0.16s",
              }}
            >
              <x.Icon size={14} /> {x.name}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${active.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${active.color}` }}>
              <active.Icon size={20} color={active.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{active.name}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: active.color, marginTop: 3 }}>
                <Braces size={12} /> {active.mech}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{active.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Reliability guardrails (their success criteria)
const RELIABILITY = [
  { Icon: Tag, title: "Clean naming conventions", body: "Every workflow, field, and tag follows one convention, so the account reads like a well kept house and anyone can pick it up.", color: C.coral },
  { Icon: GitBranch, title: "Clear entry and exit criteria", body: "Each workflow knows exactly who enters and when they leave, so contacts are never stuck or enrolled twice.", color: C.cyan },
  { Icon: Repeat, title: "No double fires", body: "Dedupe checks and wait steps stop a contact getting the same message twice, even when two triggers overlap.", color: C.green },
  { Icon: ShieldCheck, title: "No loops", body: "I map the triggers before building, so a workflow never sets off another that sets off the first. No infinite chases.", color: C.purple },
  { Icon: ListChecks, title: "Tested before live", body: "Every build runs on sample contacts first, watching each step fire, before a single real lead touches it.", color: C.amber },
  { Icon: FileText, title: "Documented to hand over", body: "SOPs and a one page map for every build, so the environment stays stable and maintainable with or without me.", color: C.blue },
];

// ─────────────────────────────────────────────────────────────
// 5. Real builds behind this (described, not cross linked)
const PROOF = [
  { name: "Custom two way webhook relay", color: C.coral,
    body: "A live sync between a field service platform and GHL, built as a Node and Python relay because no native app existed. Webhooks, API keys, and JSON payloads flowing both directions, kept reliable with retries and verification.",
    tags: ["Webhooks", "API keys", "JSON"] },
  { name: "Multi pipeline GHL architecture", color: C.cyan,
    body: "Four pipelines with staged journeys, custom fields in folders, custom values, tags, and calendars, all built to a naming convention in a real client account through the public API. Clean and scalable by design.",
    tags: ["Pipelines", "Naming conventions", "Public API"] },
  { name: "Programmatic builds with the GHL CLI", color: C.green,
    body: "A command line tool and Python builders that create live GHL workflows from a plain markdown document through the API, driven with Claude Code. I build in code, not just by clicking, so builds are fast, consistent, and repeatable.",
    tags: ["GHL CLI", "Claude Code", "Repeatable"] },
];

// ─────────────────────────────────────────────────────────────
export default function GhlSpecialistStack() {
  const heroStats = useMemo(
    () => [
      { k: "On GoHighLevel", v: "since 2019" },
      { k: "The chain", v: "GHL n8n Instantly" },
      { k: "Builds", v: "clean and tested" },
      { k: "Runs on", v: "one person" },
    ],
    [],
  );

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 22px 100px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 34 }}>
          <a href="https://www.bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            <ArrowLeft size={15} /> BVN Official
          </a>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.coral, background: "rgba(251,146,60,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.coral }}>
            <Share2 size={15} /> GHL Specialist · Cross platform automation
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            You need GHL to talk to everything.
            <span style={{ color: C.coral }}> Here is how I wire it.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 680, lineHeight: 1.6 }}>
            Your post asks for clean builds and a GoHighLevel account that talks to n8n, Instantly, Stripe,
            Google Workspace, and Facebook Lead Ads, reliably, with no loops or double fires. Rather than
            claim it, here it is: click through one real lead as it moves across the whole stack.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((s) => (
              <div key={s.k}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>{s.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="The stack" title="Every tool in your post, in one place" sub="GoHighLevel sits at the center as the system of record. Everything else plugs into it, each doing the one job it is best at.">
          <StackRow />
        </Section>

        <Section eyebrow="The journey" title="Follow one lead across the whole stack" sub="Click each step to see where the data goes and how it gets there, from a Facebook lead form to a closed and onboarded customer. Every hop is a real mechanism: native sync, webhook, or API.">
          <Journey />
        </Section>

        <Section eyebrow="Integrations" title="How I connect each tool, click any of them" sub="Webhooks, API keys, and JSON payloads are the daily job here. Tap a tool to see exactly how I wire it into GoHighLevel and keep the data in sync.">
          <IntegrationExplorer />
        </Section>

        <Section eyebrow="Reliability" title="The part your success criteria care about" sub="A clever automation that fires twice or loops is worse than none. This is how I keep an environment stable, predictable, and easy to maintain.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {RELIABILITY.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <g.Icon size={18} color={g.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{g.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{g.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Not a mockup" title="Real builds behind this" sub="Client names stay confidential here, but each of these is real, live, and mine end to end. The stack above is drawn from having actually shipped this kind of integration work.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {PROOF.map((b, i) => (
              <motion.div
                key={b.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${b.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink, marginBottom: 8 }}>{b.name}</div>
                <p style={{ fontSize: 13, color: C.sub, margin: "0 0 12px", lineHeight: 1.55 }}>{b.body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {b.tags.map((t) => (
                    <span key={t} style={{ fontSize: 11, fontWeight: 600, color: C.sub, background: C.cardHi, border: `1px solid ${C.border}`, borderRadius: 7, padding: "3px 8px" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* One man line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Sparkles size={18} color={C.coral} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I built this page, every integration it shows, and the client systems behind it with my own hands.
            No team, no contractors, no handoffs. You work directly with the person building your account, which
            is exactly why the builds stay clean and the communication stays clear.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.coral, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <CheckCircle2 size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps United States hours daily</span>
        </div>
      </div>
    </div>
  );
}
