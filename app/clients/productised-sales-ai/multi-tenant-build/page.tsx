"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Sun, MessageSquare, PhoneCall, LayoutDashboard,
  Plug, Server, ShieldCheck, KeyRound, Bell, Repeat, ListChecks, Gauge,
  Sparkles, CheckCircle2, Clock, Zap, Database, Split, Timer, Building2,
  Workflow, Boxes,
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

const ACCENT = C.purple;

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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: ACCENT }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 680, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. The four layers (interactive)
type Layer = { id: string; Icon: typeof Sun; name: string; tag: string; detail: string; tenant: string; color: string };

const LAYERS: Layer[] = [
  { id: "brief", Icon: Sun, name: "Daily briefing engine", tag: "Written, prioritised", color: C.amber,
    detail: "A morning brief and end of day close out, delivered by email, SMS, and dashboard. It reads the client's CRM and calendar and writes a prioritised brief: what is booked today, who went quiet, who is due, what moved, and what needs a human. A short written summary, not a data dump.",
    tenant: "The brief template and priority rules are per client config, so the same engine writes in each client's voice against their own pipeline." },
  { id: "sms", Icon: MessageSquare, name: "Conversational SMS agent", tag: "Two way, real replies", color: C.cyan,
    detail: "Two way AI SMS that qualifies inbound enquiries, books, chases no shows, nurtures cold leads, and escalates to a human when the conversation needs it. It handles real replies, writes back to the CRM, respects opt outs, and knows when to stop. Not a broadcast blaster.",
    tenant: "The qualification logic and sequences are shared code; the prompts, hours, and escalation rules are tenant config loaded at runtime." },
  { id: "voice", Icon: PhoneCall, name: "AI voice agent", tag: "Retell over Twilio AU", color: C.green,
    detail: "Outbound calling of new leads with Retell AI over Twilio on an Australian SIP trunk. Batch campaigns plus real time speed to lead calling. Call outcomes, transcripts, and dispositions sync back to the CRM, and the agent books straight into the client's calendar.",
    tenant: "Each tenant gets its own AU number, trunk, and Retell agent version, provisioned from config so a new client's voice line is set up, not rebuilt." },
  { id: "dash", Icon: LayoutDashboard, name: "Client dashboard", tag: "The daily open", color: C.purple,
    detail: "The screen the client opens every morning: pipeline, lead flow, agent activity, conversion by stage, and real ROI, what the system cost against what it produced. Login per client. Built to be genuinely good to read, not a wall of numbers.",
    tenant: "One dashboard app, tenant scoped data and auth, so every client sees only their own numbers behind their own login." },
];

function LayerExplorer() {
  const [activeId, setActiveId] = useState(LAYERS[0].id);
  const active = LAYERS.find((x) => x.id === activeId) ?? LAYERS[0];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {LAYERS.map((x) => {
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
                <Zap size={12} /> {active.tag}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: "0 0 12px" }}>{active.detail}</p>
          <div style={{ display: "flex", gap: 9, background: "rgba(167,139,250,0.08)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 13px" }}>
            <Boxes size={16} color={ACCENT} style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.55 }}>
              <span style={{ color: C.ink, fontWeight: 700 }}>Multi tenant: </span>{active.tenant}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Provisioning model (interactive stepper) — answers "client #40 in hours"
type Step = { n: string; title: string; old: string; now: string; detail: string; color: string };

const PROVISION: Step[] = [
  {
    n: "01", title: "Create the tenant", old: "New codebase or fork", now: "One config record", color: C.purple,
    detail: "A new client is a row, not a repo. Their tenant record holds branding, hours, sequences, and which integrations are switched on. Everything downstream reads from it, so the client is defined in one place.",
  },
  {
    n: "02", title: "Connect the CRM", old: "Rewrite the agents", now: "Pick an adapter, add keys", color: C.cyan,
    detail: "Choose HubSpot, GoHighLevel, Pipedrive, or Salesforce from the adapter list and drop in the credentials. The agents talk to the abstraction layer, never the CRM directly, so nothing about them changes.",
  },
  {
    n: "03", title: "Wire calendar and email", old: "Custom integration each time", now: "Select and authorise", color: C.blue,
    detail: "Google Calendar, cal.com, or Calendly for booking, Gmail or Microsoft 365 for mail. Pick the provider and authorise. The booking and briefing layers pick it up from config with no new code.",
  },
  {
    n: "04", title: "Load sequences and prompts", old: "Rebuild the logic", now: "Clone a template", color: C.amber,
    detail: "SMS sequences, voice scripts, qualification rules, and brief templates come from a library. Clone the closest template, adjust the wording for the client, and it is live. The logic is shared, the words are theirs.",
  },
  {
    n: "05", title: "Provision the AU voice line", old: "Manual Twilio and Retell setup", now: "Automated from config", color: C.green,
    detail: "The provisioning tooling buys the Australian number, attaches the SIP trunk in the AU region, and spins up the client's Retell agent version. Speed to lead and batch dialling are wired to their pipeline events.",
  },
  {
    n: "06", title: "Go live with the dashboard", old: "Bespoke reporting", now: "Tenant scoped, instant", color: C.rose,
    detail: "The client logs into their own dashboard, scoped to their data only, and the morning brief starts arriving. From tenant record to live system is configuration, which is why client forty takes hours, not the three weeks it takes today.",
  },
];

function Provisioning() {
  const [i, setI] = useState(0);
  const s = PROVISION[i];

  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
        {PROVISION.map((st, idx) => {
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
          <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 12 }}>{s.title}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.muted, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 11px", textDecoration: "line-through" }}>
              <Timer size={12} /> {s.old}
            </span>
            <ArrowRight size={15} color={C.muted} style={{ alignSelf: "center" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: s.color, background: "rgba(255,255,255,0.03)", border: `1px solid ${s.color}`, borderRadius: 8, padding: "6px 11px" }}>
              <Zap size={12} /> {s.now}
            </span>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{s.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. CRM abstraction (interactive)
type Crm = { id: string; name: string; status: string; detail: string; color: string };

const CRMS: Crm[] = [
  { id: "hubspot", name: "HubSpot", status: "Day one", color: C.coral,
    detail: "One of the two launch CRMs. Contacts, deals, pipeline stages, and activity all mapped to the shared model, so the agents read and write HubSpot without knowing it is HubSpot." },
  { id: "ghl", name: "GoHighLevel", status: "Day one", color: C.cyan,
    detail: "The other launch CRM, and the one I know deepest. Opportunities, custom fields, custom values, tags, and the conversation and calendar APIs all sit behind the same interface the agents call." },
  { id: "pipedrive", name: "Pipedrive", status: "Fast follow", color: C.amber,
    detail: "Added as an adapter, not a rewrite. Its deals and stages map onto the shared model, and the agents keep working unchanged. This is the whole point of the abstraction layer." },
  { id: "salesforce", name: "Salesforce", status: "Fast follow", color: C.blue,
    detail: "The heaviest of the four, handled the same way: an adapter that translates Salesforce objects into the shared model. New CRM, new adapter, zero change to the agents or the dashboard." },
];

function CrmLayer() {
  const [activeId, setActiveId] = useState(CRMS[0].id);
  const active = CRMS.find((x) => x.id === activeId) ?? CRMS[0];

  return (
    <div>
      {/* shared interface bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "rgba(167,139,250,0.08)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 13px", marginBottom: 14 }}>
        <Plug size={15} color={ACCENT} />
        <span style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>One agent interface</span>
        <span style={{ fontSize: 12.5, color: C.muted }}>getContact · upsertLead · moveStage · logActivity · book</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {CRMS.map((x) => {
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
              <Database size={14} /> {x.name}
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{active.name}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: active.color, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "4px 10px" }}>{active.status}</span>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{active.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Stack recommendation (answers screening Q2)
const STACK = [
  { Icon: Server, title: "Self hosted n8n, agreed", body: "For multi tenancy and cost, n8n self hosted is the right call. Make bills per operation, which punishes exactly the high volume, many client future you are building for. Self hosted n8n runs flat cost, gives you queues, sub workflows, and proper error handling, and keeps client data on infrastructure you control. I would keep the automation logic here and drive it from the tenant config.", color: C.green },
  { Icon: PhoneCall, title: "Retell over Twilio AU1", body: "Retell for the voice orchestration, Twilio in the AU region with a SIP trunk for the numbers and termination. I have provisioned non US Twilio numbers and trunks before, so the Australian mobile path and speed to lead trigger are known ground, not a science project.", color: C.cyan },
  { Icon: Gauge, title: "LLM by cost per conversation", body: "No brand loyalty. I would run a cheaper, fast model for the bulk of qualification and reserve a stronger model only for the calls that need it, then measure real cost per conversation and tune. The number matters more than the logo, which is exactly how you framed it.", color: C.amber },
  { Icon: LayoutDashboard, title: "A dashboard you can hire for", body: "Next.js and a Postgres backend with row level tenant isolation. Mainstream, well documented, and easy to hire for later, which you asked for directly. Good to read first, correct underneath second.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// 5. Milestone 1 foundation (the standalone start)
const M1 = [
  { Icon: Boxes, title: "Multi tenant infrastructure", body: "The tenant model and the control plane that every layer reads from. One place to manage many clients." },
  { Icon: KeyRound, title: "Credential and secrets handling", body: "Per tenant API keys and secrets stored and scoped so one client can never touch another's data or accounts." },
  { Icon: Bell, title: "Logging and error alerting", body: "Structured logs and alerts that tell you a client's sync broke before the client does. Silence is not success." },
  { Icon: CheckCircle2, title: "One test client, end to end", body: "A real tenant provisioned through the pipeline, proving the foundation works before a single agent is layered on." },
];

// ─────────────────────────────────────────────────────────────
// 6. Reliability
const RELIABILITY = [
  { Icon: Repeat, title: "Retries and queues", body: "Every outside call can fail. Retries with backoff and a queue mean a flaky API delays a lead, it does not lose one.", color: C.cyan },
  { Icon: Split, title: "Sub workflows, not spaghetti", body: "Shared logic lives in sub workflows called by every tenant, so a fix ships once and reaches all clients at once.", color: C.purple },
  { Icon: ShieldCheck, title: "Opt outs respected", body: "Stop means stop, tracked per contact and honoured across SMS and voice. Compliance is built in, not bolted on.", color: C.green },
  { Icon: ListChecks, title: "I test my own work", body: "Every build runs against a sandbox and sample contacts before it touches a live client. You are not my QA team.", color: C.amber },
];

// ─────────────────────────────────────────────────────────────
export default function ProductisedSalesAi() {
  const heroStats = useMemo(
    () => [
      { k: "The build", v: "multi tenant" },
      { k: "New client", v: "config, not code" },
      { k: "Voice", v: "Retell + Twilio AU" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: ACCENT, background: "rgba(167,139,250,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: ACCENT }}>
            <Building2 size={15} /> Productised Sales AI · Multi tenant build
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            You proved the system.
            <span style={{ color: ACCENT }}> I rebuild it to deploy in a week, forty times over.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You already have the logic, the sequences, and the prompts running and earning. The job is not to invent
            it, it is to turn it into a repeatable, multi tenant system. This page is how I would architect that:
            the four layers, the abstraction that keeps the agents stable as CRMs get added, and the provisioning
            model that turns onboarding client forty into configuration. I answered two of your screening questions
            right here on the page.
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

        <Section eyebrow="The system" title="Four layers, deployed per client, run from one place" sub="Click each layer to see what it does and, more importantly, how it stays multi tenant instead of turning into forty forks you maintain by hand.">
          <LayerExplorer />
        </Section>

        <Section eyebrow="Screening Q3" title="Onboarding client forty is configuration, not development" sub="Step through a new client going live. The struck through line is how bespoke work does it today. The lit line is how this system does it, which is the whole reason a deploy drops from three weeks to under a week.">
          <Provisioning />
        </Section>

        <Section eyebrow="The abstraction" title="Add a CRM without rewriting the agents" sub="The agents never call a CRM directly. They call one shared interface, and each CRM is an adapter behind it. Click through the four: two live on day one, two as fast follows, none of them touching the agent code.">
          <CrmLayer />
        </Section>

        <Section eyebrow="Screening Q2" title="Yes to self hosted n8n, and here is the rest of the stack" sub="You asked whether I agree with the Make to n8n move and what I would actually do. Straight answer, with the reasoning, because you said you want someone who owns the technical calls.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
            {STACK.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${g.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <g.Icon size={18} color={g.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{g.title}</span>
                </div>
                <p style={{ fontSize: 13.5, color: C.sub, margin: 0, lineHeight: 1.58 }}>{g.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Milestone 1" title="The foundation, which is where we start" sub="You want to run Milestone 1 as a standalone engagement first, and that is the right way in. It is also squarely what I do best: the unglamorous infrastructure everything else stands on.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {M1.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <g.Icon size={18} color={ACCENT} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{g.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{g.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Reliability" title="Built so it holds up across many clients" sub="Multi tenant means one broken build can hit everyone, so the reliability work is not optional. This is the part that keeps a retainer worth paying.">
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

        {/* One man line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Sparkles size={18} color={ACCENT} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>You wanted the person doing the build. That is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 740 }}>
            BVN is not an agency that wins the bid and hands it to a junior. It is one person, and the person you
            interview is the person who writes the code, tests it, and answers the phone when a client line goes
            quiet. I built this page and the systems behind it myself. No handoffs, no account manager, no surprises.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: ACCENT, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
            <a href="/intro" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
              Watch my intro <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <CheckCircle2 size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Workflow size={13} /> WhatsApp +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps Australian business hours daily</span>
        </div>
      </div>
    </div>
  );
}
