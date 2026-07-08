"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Leaf, Gauge, Smartphone, LayoutTemplate, Palette,
  CreditCard, CalendarDays, ClipboardList, Users, Mail, Webhook, Zap,
  RefreshCw, Bell, Sparkles, CalendarCheck, Code2, Plug, Wrench, Lightbulb,
  Terminal, CheckCircle2, Clock, PhoneCall,
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
// 1. The rebuild
const REBUILD = [
  { Icon: Palette, title: "Modern and high converting", body: "A clean, professional redesign built to turn visitors into booked clients, not just look good in a portfolio.", color: C.rose },
  { Icon: Gauge, title: "Fast", body: "Speed and performance tuned from the ground up, because a slow wellness site quietly loses bookings every day.", color: C.amber },
  { Icon: Smartphone, title: "Mobile first", body: "Most wellness traffic is on a phone. The rebuild is responsive and thumb friendly before it is anything else.", color: C.cyan },
  { Icon: LayoutTemplate, title: "Clear structure and UX", body: "Structure and navigation designed so a first time visitor knows what to do in seconds. Polished, not just functional.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// 2. Integration hub (interactive)
type Node = { Icon: typeof Leaf; name: string; connects: string; detail: string; color: string };
const NODES: Node[] = [
  { Icon: CreditCard, name: "Payments", connects: "Stripe · PayPal", color: C.green,
    detail: "Checkout, subscriptions, and one off purchases wired to your site, with receipts and failed payment handling so revenue is never quietly dropped." },
  { Icon: CalendarDays, name: "Scheduling", connects: "Calendly · Acuity", color: C.blue,
    detail: "Booking that syncs both ways with your calendar, sends reminders, and pushes every new appointment into your CRM automatically." },
  { Icon: ClipboardList, name: "Forms", connects: "Intake · quizzes", color: C.amber,
    detail: "Intake forms and quizzes that capture the client, tag them by goal or program, and trigger the right follow up instead of sitting in an inbox." },
  { Icon: Users, name: "CRM", connects: "GHL · Airtable · HubSpot", color: C.coral,
    detail: "One source of truth for every client. Contacts, tags, and pipeline stages kept clean so you always know where each person is in their journey." },
  { Icon: Mail, name: "Email", connects: "Sequences · broadcasts", color: C.purple,
    detail: "Welcome sequences, nurture, and broadcasts connected to the same data, so the right message goes to the right segment without manual list wrangling." },
  { Icon: Webhook, name: "Third party APIs", connects: "Webhooks · custom", color: C.cyan,
    detail: "Whatever tool you add next, I connect it. Custom webhook and API work is what ties these platforms into one system instead of six disconnected apps." },
];

function IntegrationHub() {
  const [i, setI] = useState(0);
  const n = NODES[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {NODES.map((nd, idx) => {
          const on = idx === i;
          return (
            <button
              key={nd.name}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 138, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? nd.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <nd.Icon size={16} color={nd.color} />
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 7, lineHeight: 1.25 }}>{nd.name}</div>
              <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>{nd.connects}</div>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={n.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${n.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${n.color}` }}>
              <n.Icon size={20} color={n.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{n.name}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: n.color, marginTop: 2 }}>
                <Plug size={12} /> {n.connects}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{n.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Automations
const AUTOMATIONS = [
  { Icon: Zap, title: "New client, handled end to end", body: "A booking or purchase creates the client in your CRM, sends the welcome email, and books them in, with no manual step in between.", color: C.amber },
  { Icon: RefreshCw, title: "Website talking to your backend", body: "Every form, payment, and booking syncs into the tools you already run, so your site and your backend are never out of step.", color: C.green },
  { Icon: Bell, title: "Nothing slips", body: "Reminders, failed payment alerts, and follow up nudges fire automatically, so a missed message never costs you a client.", color: C.rose },
];

// ─────────────────────────────────────────────────────────────
// 4. Member portal (interactive tabs)
type Tab = { Icon: typeof Leaf; label: string; color: string; panel: React.ReactNode };

function ProgramsPanel() {
  const rows = [
    { t: "8 week reset program", meta: "Active · week 3 of 8", color: C.green },
    { t: "1:1 coaching calls", meta: "Next: Thursday 10:00", color: C.blue },
    { t: "Nutrition guide library", meta: "12 resources unlocked", color: C.purple },
  ];
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {rows.map((r) => (
        <div key={r.t} style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${r.color}`, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{r.t}</div>
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>{r.meta}</div>
        </div>
      ))}
    </div>
  );
}

function BookingsPanel() {
  const rows = [
    { t: "Coaching call", meta: "Thu, 10:00 · confirmed", color: C.green },
    { t: "Group session", meta: "Sat, 09:00 · reminder sent", color: C.amber },
    { t: "Check in call", meta: "Reschedule available", color: C.blue },
  ];
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {rows.map((r) => (
        <div key={r.t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 600, color: C.ink }}>
            <CalendarCheck size={15} color={r.color} /> {r.t}
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: r.color }}>{r.meta}</span>
        </div>
      ))}
    </div>
  );
}

function BillingPanel() {
  const rows = [
    { t: "Monthly membership", meta: "Active · renews Aug 1", color: C.green },
    { t: "Payment method", meta: "Visa ending 4242", color: C.blue },
    { t: "Invoices", meta: "6 paid · all up to date", color: C.purple },
  ];
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {rows.map((r) => (
        <div key={r.t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 600, color: C.ink }}>
            <CreditCard size={15} color={r.color} /> {r.t}
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: r.color }}>{r.meta}</span>
        </div>
      ))}
    </div>
  );
}

const TABS: Tab[] = [
  { Icon: Sparkles, label: "Programs", color: C.purple, panel: <ProgramsPanel /> },
  { Icon: CalendarCheck, label: "Bookings", color: C.blue, panel: <BookingsPanel /> },
  { Icon: CreditCard, label: "Billing", color: C.green, panel: <BillingPanel /> },
];

function MemberPortal() {
  const [i, setI] = useState(0);
  const t = TABS[i];
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "18px 18px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {TABS.map((tab, idx) => {
          const on = idx === i;
          return (
            <button
              key={tab.label}
              onClick={() => setI(idx)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer",
                background: on ? C.cardHi : "transparent", border: `1px solid ${on ? tab.color : C.border}`,
                borderRadius: 999, padding: "8px 15px", transition: "all 0.16s",
                fontSize: 13, fontWeight: 700, color: on ? C.ink : C.sub,
              }}
            >
              <tab.Icon size={15} color={tab.color} /> {tab.label}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={t.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {t.panel}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. How I work as a partner
const PARTNER = [
  { Icon: Code2, title: "I own the whole build", body: "Frontend, backend, database, and integrations. One person accountable for the platform, not a handoff between freelancers.", color: C.cyan },
  { Icon: Plug, title: "I connect your stack", body: "Payments, scheduling, forms, CRM, and email tied together with real API and webhook work, so your tools act like one system.", color: C.coral },
  { Icon: Wrench, title: "I keep it running", body: "Bugs fixed fast, performance watched, and the platform maintained as the business scales, not just built and abandoned.", color: C.amber },
  { Icon: Lightbulb, title: "I take initiative", body: "You listed this first. I recommend cleaner tools and smarter builds and solve problems without needing every detail spelled out.", color: C.rose },
];

// ─────────────────────────────────────────────────────────────
export default function WellnessTechnicalPartner() {
  const heroStats = useMemo(
    () => [
      { k: "Role", v: "Long term partner" },
      { k: "Owns", v: "Front to back" },
      { k: "Integrations", v: "Payments to APIs" },
      { k: "Built with", v: "Claude Code" },
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
            <Leaf size={15} /> Technical partner for a health and wellness brand
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            A technical partner who owns the whole build,
            <span style={{ color: C.rose }}> not a coder waiting for instructions.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            You want someone who listens, understands what you are building, and turns it into clean, well designed
            systems that grow with the business. So rather than just claim that, I built you a piece of it: the
            rebuild, the integrations, the automations, and a member portal. Click through it.
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

        <Section eyebrow="The rebuild" title="A site built to convert, not just to look good" sub="The redesign I would start with: modern, fast, mobile first, and structured so a first time visitor knows exactly what to do.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {REBUILD.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <r.Icon size={18} color={r.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{r.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{r.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="The integrations" title="Your tools, connected into one system" sub="The integrations you listed, wired together so your website and backend act as one platform. Tap each to see how I connect it.">
          <IntegrationHub />
        </Section>

        <Section eyebrow="The automations" title="The website talking to your backend" sub="Once the tools are connected, the automations do the quiet work that otherwise eats your day.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {AUTOMATIONS.map((a, i) => (
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

        <Section eyebrow="The portal" title="A member and client portal" sub="A nice to have from your post, made real. Clients see their programs, bookings, and billing in one place. Switch between the three.">
          <MemberPortal />
        </Section>

        <Section eyebrow="The partnership" title="How I work, and why it fits what you asked for" sub="You said you want a true technical partner who takes ownership and initiative. Here is exactly that, in four parts.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {PARTNER.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <p.Icon size={18} color={p.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{p.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Claude Code + partner line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Terminal size={18} color={C.rose} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Built with Claude Code, and BVN is just me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            This whole page, the integration hub and portal included, I built with Claude Code. That is the
            partner you would get: one person who owns the platform front to back, ships fast, documents the work,
            and grows with the business rather than waiting on a ticket for every change.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Long term, in Slack daily</span>
        </div>
      </div>
    </div>
  );
}
