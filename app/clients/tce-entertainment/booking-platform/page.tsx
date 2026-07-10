"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Sparkles, Users, CalendarClock, CalendarCheck,
  FileText, FileSignature, CreditCard, Bot, LayoutDashboard, MailQuestion,
  Music, Workflow, Boxes, Database, Zap, Terminal, Clock, PhoneCall,
  CheckCircle2, Headphones, Megaphone, Wrench, Target, Rocket,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.rose }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. The booking flow (interactive) — the flagship first project
type Step = { Icon: typeof Users; title: string; trigger: string; detail: string; color: string };
const STEPS: Step[] = [
  { Icon: MailQuestion, title: "Enquiry comes in", trigger: "Any channel", color: C.rose,
    detail: "A client asks about a wedding, gala, or private event. It lands in the platform as a booking request, captured from your website, email, or CRM, so nothing sits in an inbox waiting to be typed up by hand." },
  { Icon: Users, title: "Match the talent", trigger: "Artist database", color: C.coral,
    detail: "The system checks your artist, musician, DJ, and performer database against the date and the brief, so you instantly see who fits and who is free rather than calling around to find out." },
  { Icon: CalendarClock, title: "Check availability", trigger: "Real time", color: C.amber,
    detail: "Talent availability and the event calendar are live, so double bookings are impossible and you can hold a date the moment a client is interested." },
  { Icon: FileText, title: "Generate the proposal", trigger: "One click", color: C.green,
    detail: "A branded proposal with the right talent, pricing, and packages is generated automatically from your templates, so a quote that took an afternoon now takes a minute and looks premium every time." },
  { Icon: FileSignature, title: "Send the contract", trigger: "On approval", color: C.cyan,
    detail: "When the client says yes, the contract goes out for digital signature automatically, tied to the booking, so nothing is chased manually and every event has a signed agreement on file." },
  { Icon: CreditCard, title: "Track the payment", trigger: "Deposit to final", color: C.blue,
    detail: "Deposits and final payments are tracked against each booking, with reminders firing on schedule, so you always know what is paid, what is due, and what needs a nudge." },
  { Icon: Bot, title: "AI booking assistant", trigger: "Always on", color: C.purple,
    detail: "An AI assistant answers questions using your internal documentation, drafts replies, suggests available talent, and handles the repetitive back and forth, so your team spends time on the events, not the admin." },
  { Icon: LayoutDashboard, title: "Team dashboard updates", trigger: "Live", color: C.rose,
    detail: "Every booking, contract, payment, and staffing detail rolls up into one mobile friendly dashboard your whole team can see, so operations, production, and sales are looking at the same truth." },
];

function BookingFlow() {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {STEPS.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.title}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 150, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <st.Icon size={16} color={st.color} />
              <div style={{ fontSize: 11, fontWeight: 800, color: st.color, marginTop: 6 }}>0{idx + 1}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 2, lineHeight: 1.25 }}>{st.title}</div>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${s.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}` }}>
              <s.Icon size={20} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{s.title}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: s.color, marginTop: 2 }}>
                <Zap size={12} /> {s.trigger}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{s.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. AI agents across the company
const AGENTS = [
  { Icon: Megaphone, title: "Sales agent", body: "Qualifies enquiries, drafts proposals, follows up on quotes, and keeps deals moving so no lead goes cold.", color: C.rose },
  { Icon: Wrench, title: "Operations agent", body: "Turns your SOPs into automated workflows, handles scheduling, and removes the repetitive admin from the day.", color: C.coral },
  { Icon: Music, title: "Production agent", body: "Coordinates talent, staffing, and event logistics, so the details behind each event are tracked without spreadsheets.", color: C.amber },
  { Icon: Headphones, title: "Customer service agent", body: "Answers client questions from your internal docs, drafts on brand replies, and escalates cleanly when a human is needed.", color: C.green },
  { Icon: Bot, title: "Internal knowledge agent", body: "An assistant your team can ask anything, answering from your documentation, contracts, and processes in seconds.", color: C.purple },
  { Icon: Rocket, title: "Marketing agent", body: "Automates content, follow up campaigns, and the repetitive marketing tasks that eat time between events.", color: C.blue },
];

// ─────────────────────────────────────────────────────────────
// 3. The stack
const STACK = [
  { Icon: Workflow, title: "Automation", body: "Make.com, Zapier, and n8n to wire your tools together and run workflows end to end.", color: C.rose },
  { Icon: Boxes, title: "App building", body: "Lovable, Base44, Bolt.new, and Replit to build internal apps fast, plus custom code where it matters.", color: C.amber },
  { Icon: Database, title: "Data and backend", body: "Supabase, Firebase, and Airtable for the databases behind the booking platform and dashboards.", color: C.green },
  { Icon: Sparkles, title: "AI and LLMs", body: "OpenAI, Claude, and Gemini for the agents, assistants, and prompt engineered automations.", color: C.purple },
  { Icon: Users, title: "Ops tools", body: "GoHighLevel, ClickUp, Notion, Slack, and Google Workspace APIs connected into one ecosystem.", color: C.cyan },
  { Icon: CreditCard, title: "Comms and payments", body: "Twilio and WhatsApp and SMS automations, Stripe payments, and Calendly and digital contract workflows.", color: C.blue },
];

// ─────────────────────────────────────────────────────────────
// 4. 90-day plan mapped to their success metrics
const PLAN = [
  { k: "Weeks 1 to 2", v: "Map the business", d: "Sit with leadership, document the current SOPs and tools, and pick the highest leverage automations to build first." },
  { k: "Weeks 3 to 6", v: "First AI agents live", d: "Ship multiple AI agents that automate daily sales, ops, and admin tasks, and convert the first SOPs into workflows." },
  { k: "Weeks 6 to 10", v: "Booking platform v1", d: "Launch the first version of the internal booking platform: artist database, availability, proposals, and the team dashboard." },
  { k: "Weeks 10 to 13", v: "One connected system", d: "Integrate CRM, calendars, email, and payments into one ecosystem and cut the manual admin measurably." },
];

// ─────────────────────────────────────────────────────────────
export default function TceEntertainmentBookingPlatform() {
  const heroStats = useMemo(
    () => [
      { k: "Flagship", v: "Booking platform" },
      { k: "AI agents", v: "Sales to production" },
      { k: "Stack", v: "No-code to custom" },
      { k: "Built", v: "With Claude Code" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.rose, background: "rgba(251,113,133,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.rose }}>
            <Sparkles size={15} /> AI automation and applications for a luxury entertainment company
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            The operating system behind
            <span style={{ color: C.rose }}> a fast-growing entertainment company.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You want to build an AI-first company: custom agents, automated SOPs, internal apps, and a flagship
            booking platform for your artists and performers. That is the work I do. Instead of just describing it, I
            built you the plan. Start with the booking platform below and click through how it runs.
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

        <Section eyebrow="The first major project" title="Your AI-powered booking platform, end to end" sub="From a client enquiry to a signed, paid, staffed event, all in one internal system your team runs from a phone or a desk. Tap each step.">
          <BookingFlow />
        </Section>

        <Section eyebrow="AI agents" title="An agent for every part of the company" sub="Not one chatbot, but a set of agents that take the repetitive work off your team across sales, operations, production, customer service, and marketing.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {AGENTS.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${a.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <a.Icon size={18} color={a.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{a.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{a.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="The stack" title="I build with the tools your post lists" sub="No-code where it is fastest, low-code where it fits, and custom code where it matters, matched to the job rather than forcing one tool on everything.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {STACK.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <s.Icon size={18} color={s.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{s.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{s.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="First 90 days" title="A plan mapped to your success metrics" sub="Your post sets the bar for the first 90 days. Here is how I would hit it, in order, so the wins are visible early rather than all at the end.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {PLAN.map((p, i) => (
              <motion.div
                key={p.k}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.rose}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 800, color: C.rose, textTransform: "uppercase", letterSpacing: 0.8 }}>{p.k}</div>
                <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink, margin: "5px 0 7px" }}>{p.v}</div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{p.d}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Proof" title="Real systems I have built and run" sub="This is not theory. Screenshots from a live GoHighLevel account I built and operate, the CRM, pipelines, and workflow automation behind a real business.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Pipelines inside a live CRM, the kind of structure your booking platform runs on." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published automations firing on their own as a client moves through the process." />
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="A documented workflow library, SOPs turned into automated systems." />
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="An opportunities board, work moving from first enquiry through to won." />
          </div>
        </Section>

        {/* One man / Claude Code line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Terminal size={18} color={C.rose} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>I do not wait for instructions. I find the inefficiency and build the fix.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 750 }}>
            That is the person your post describes, and it is how I work. I am a systems thinker who builds with modern
            AI tools every day, simplifies messy workflows, and ships. I built this page with Claude Code to show you
            how I think a project through before I start. One person, self directed, who turns your operation into
            software that runs itself.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.rose, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Part time, self directed</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Proof (real GHL screenshots)
function ProofShot({ src, caption }: { src: string; caption: string }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      {err ? (
        <div style={{ height: 200, display: "grid", placeItems: "center", background: C.bg2, color: C.muted, fontSize: 12.5, textAlign: "center", padding: "0 20px" }}>
          Screenshot from a live GoHighLevel account
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={caption}
          onError={() => setErr(true)}
          style={{ width: "100%", display: "block", borderBottom: `1px solid ${C.border}` }}
        />
      )}
      <div style={{ padding: "12px 14px", fontSize: 12.5, color: C.sub }}>{caption}</div>
    </div>
  );
}
