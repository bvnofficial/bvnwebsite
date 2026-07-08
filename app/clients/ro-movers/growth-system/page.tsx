"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Truck, FileText, Webhook, Zap, CalendarCheck,
  MessageSquare, CalendarClock, Upload, Bell, Workflow, Globe,
  LayoutTemplate, Search, PenLine, Terminal, CheckCircle2, Clock, PhoneCall,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.blue }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. Quote to booked move funnel (interactive)
type Step = { Icon: typeof Truck; title: string; trigger: string; detail: string; color: string };
const STEPS: Step[] = [
  { Icon: FileText, title: "Quote request in", trigger: "WordPress or funnel", color: C.blue,
    detail: "A move request comes in from your WordPress site or a GoHighLevel landing page. Move date, size, and route are captured in one clean form, no back and forth to get the basics." },
  { Icon: Webhook, title: "Into GHL", trigger: "On submit", color: C.cyan,
    detail: "The request lands straight in GoHighLevel as a new opportunity, tagged by move type and stamped with the source, so every lead is in one pipeline the moment it arrives." },
  { Icon: Zap, title: "Speed to lead", trigger: "Within seconds", color: C.amber,
    detail: "An instant SMS and email confirms you got the request and offers a time to lock the quote. For a move, the company that answers first usually wins the booking." },
  { Icon: MessageSquare, title: "Follow up until they book", trigger: "Timed sequence", color: C.coral,
    detail: "A paced SMS and email sequence keeps the quote warm, answers the common questions, and nudges toward a booking, so no estimate goes cold in the inbox." },
  { Icon: CalendarCheck, title: "Booked and dispatched", trigger: "On won", color: C.green,
    detail: "Once the move is booked it moves to won, the customer gets confirmation and reminders, and the job is ready to route to an available owner-operator through the portal." },
];

function Funnel() {
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
                flexShrink: 0, width: 148, textAlign: "left", cursor: "pointer",
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
// 2. Contractor portal (interactive tabs)
type Tab = { Icon: typeof Truck; label: string; color: string; panel: React.ReactNode };

function AvailabilityPanel() {
  const days = [
    { d: "Mon", on: true }, { d: "Tue", on: true }, { d: "Wed", on: false },
    { d: "Thu", on: true }, { d: "Fri", on: true }, { d: "Sat", on: true }, { d: "Sun", on: false },
  ];
  return (
    <div>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 14 }}>
        Owner-operators set the days they can take jobs. Availability feeds straight back into dispatch, so you only route moves to a truck that is actually free.
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {days.map((x) => (
          <div key={x.d} style={{
            flex: "1 1 70px", textAlign: "center", borderRadius: 10, padding: "12px 6px",
            background: x.on ? "rgba(52,211,153,0.10)" : C.card,
            border: `1px solid ${x.on ? C.green : C.border}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: x.on ? C.green : C.muted }}>{x.d}</div>
            <div style={{ fontSize: 11, color: x.on ? C.sub : C.muted, marginTop: 4 }}>{x.on ? "Available" : "Off"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsPanel() {
  const docs = [
    { name: "Certificate of insurance", status: "Verified", color: C.green },
    { name: "Driver license", status: "Verified", color: C.green },
    { name: "Vehicle registration", status: "Expires in 21 days", color: C.amber },
    { name: "Signed contractor agreement", status: "Awaiting upload", color: C.rose },
  ];
  return (
    <div>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 14 }}>
        Each owner-operator uploads and re-uploads compliance documents in one place. Expiries are tracked, so nothing lapses and you always know who is cleared to work.
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {docs.map((x) => (
          <div key={x.name} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 600, color: C.ink }}>
              <Upload size={15} color={x.color} /> {x.name}
            </span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: x.color }}>{x.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpdatesPanel() {
  const posts = [
    { t: "New rate card effective Aug 1", meta: "Company update · 2 days ago", color: C.blue },
    { t: "Reminder: submit weekly job sheets by Friday", meta: "Operations · 4 days ago", color: C.amber },
    { t: "Welcome to two new owner-operators this week", meta: "Announcement · 6 days ago", color: C.green },
  ];
  return (
    <div>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 14 }}>
        One feed for company updates, so every owner-operator sees the same rate changes, reminders, and announcements without a group chat that gets lost.
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {posts.map((x) => (
          <div key={x.t} style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${x.color}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{x.t}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>{x.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS: Tab[] = [
  { Icon: CalendarClock, label: "Availability", color: C.green, panel: <AvailabilityPanel /> },
  { Icon: Upload, label: "Documents", color: C.amber, panel: <DocumentsPanel /> },
  { Icon: Bell, label: "Updates", color: C.blue, panel: <UpdatesPanel /> },
];

function ContractorPortal() {
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
// 3. The full stack I would own
const STACK = [
  { Icon: Workflow, title: "GoHighLevel", body: "CRM workflows, pipelines, forms, calendars, and campaigns. The automations that turn every quote request into a tracked, followed up opportunity.", color: C.cyan },
  { Icon: Globe, title: "WordPress", body: "Building, maintaining, and updating the site, plus the customer and contractor portals, kept fast, current, and easy to convert on.", color: C.blue },
  { Icon: LayoutTemplate, title: "Funnels and landing pages", body: "High converting quote and booking funnels in GoHighLevel, built to turn moving traffic into booked jobs, not just visits.", color: C.coral },
  { Icon: Search, title: "SEO", body: "On page optimization, meta titles and descriptions, image optimization, internal linking, and site performance, so you rank for the moves you want to win.", color: C.green },
  { Icon: PenLine, title: "Blog and content", body: "SEO friendly articles that educate customers, build authority, and pull organic traffic, published on a steady cadence rather than in bursts.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// 4. SEO and content engine sample
const TOPICS = [
  { t: "How much does a local move actually cost in 2026", tag: "Cost · high intent" },
  { t: "Long distance move checklist, 8 weeks out to moving day", tag: "Guide · authority" },
  { t: "Packing fragile items, a mover's room by room guide", tag: "How to · organic" },
  { t: "Questions to ask before you book any moving company", tag: "Trust · conversion" },
];

// ─────────────────────────────────────────────────────────────
export default function RoMoversGrowthSystem() {
  const heroStats = useMemo(
    () => [
      { k: "GHL since", v: "2019" },
      { k: "WordPress", v: "2+ years" },
      { k: "Stack", v: "GHL · WP · SEO" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.blue, background: "rgba(59,130,246,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.blue }}>
            <Truck size={15} /> Growth and ops system for a moving company
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            From a quote request to a booked move,
            <span style={{ color: C.blue }}> and every owner-operator in sync.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            You listed GoHighLevel, WordPress, funnels, SEO, blog content, and a contractor portal. Rather than
            list back that I can do them, I built the two pieces that matter most: the lead funnel that books more
            moves, and the owner-operator portal from your current projects. Click through both.
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

        <Section eyebrow="The lead funnel" title="Every quote request becomes a booked move" sub="The GoHighLevel funnel I would own, from a form on your WordPress site to a booked job ready to dispatch. Tap each step.">
          <Funnel />
        </Section>

        <Section eyebrow="Your current project" title="The owner-operator portal" sub="The contractor portal you described, made real. Owner-operators manage their own availability, keep documents current, and get company updates in one place. Switch between the three.">
          <ContractorPortal />
        </Section>

        <Section eyebrow="The role" title="The full stack I would own" sub="Everything in the job post, in one place, run by one person who builds the system and keeps it running.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {STACK.map((o, i) => (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <o.Icon size={18} color={o.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{o.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{o.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Organic growth" title="An SEO and content engine, not one off posts" sub="A sample of the blog and SEO cadence I would run: topics chosen for real search intent, each one optimized on page and linked into the rest of the site.">
          <div style={{ display: "grid", gap: 10 }}>
            {TOPICS.map((x, i) => (
              <motion.div
                key={x.t}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: C.ink }}>
                  <PenLine size={15} color={C.purple} /> {x.t}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, whiteSpace: "nowrap" }}>{x.tag}</span>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Claude Code + one man line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Terminal size={18} color={C.blue} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Built with Claude Code, and BVN is just me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            This whole page, the funnel and the portal included, I built with Claude Code. That is how I work:
            one person who owns GoHighLevel, WordPress, funnels, and SEO end to end, moves fast, and documents as
            they go. You get a proactive builder who ships and keeps the systems running, not a queue of tickets.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.blue, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Flexible hours, in Slack daily</span>
        </div>
      </div>
    </div>
  );
}
