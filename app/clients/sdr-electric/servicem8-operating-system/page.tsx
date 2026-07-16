"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ClipboardList, Workflow, BookOpen, Boxes,
  ShoppingCart, Plug, BarChart3, FileText, Zap, Terminal, Clock,
  PhoneCall, CheckCircle2, Wrench, Gauge, Database, Code2, Users,
  TrendingUp, AlertTriangle,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.amber }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// The operating system, layer by layer
type Layer = { Icon: typeof ClipboardList; title: string; trigger: string; detail: string; color: string };
const LAYERS: Layer[] = [
  { Icon: ClipboardList, title: "Audit first", trigger: "Before I change anything", color: C.amber,
    detail: "I do not touch a working account on day one. I look at how jobs actually flow versus how they are supposed to, where jobs stall by status, whether templates and categories are being used or bypassed, how much of the pricebook is live versus dead, what techs fill in by hand because a field does not exist, which automation rules fire, and whether the QuickBooks Online sync is clean. The fastest wins are almost always in what is already there and unused, not in new software." },
  { Icon: Workflow, title: "Job workflows and templates", trigger: "Make the right way the easy way", color: C.coral,
    detail: "Job statuses should mirror how work really moves, not an ideal nobody follows. Categories organized by trade and job type so reporting is meaningful. Templates that preload the tasks, forms, checklists, and materials for the work, so a tech opens a job and the job already knows what it is. Badges and custom fields to surface what matters at a glance. If the correct process is the fastest process, adoption stops being an argument." },
  { Icon: BookOpen, title: "Pricebook", trigger: "Flat rate, structured", color: C.green,
    detail: "A flat-rate book built around how a tech thinks on site: trade, then system, then task. Consistent naming so duplicates cannot hide, one canonical service per job rather than five near copies, and labour and material components separated so a price change is a controlled update rather than a rebuild. Good, Better, and Best framed as repair, quality replacement, and premium replacement with the value visible, so the customer chooses a level rather than deciding whether to say no." },
  { Icon: Boxes, title: "Inventory", trigger: "Warehouse and truck", color: C.cyan,
    detail: "Warehouse organized by category and location so a bin has one meaning. Truck stock treated as its own location per vehicle, sized to the work that truck actually does, so the van is a small warehouse rather than a mystery. Usage recorded against the job it was consumed on, because inventory that is not tied to a job is a guess. Counts and discrepancy review on a rhythm, and barcode standards so scanning replaces typing." },
  { Icon: ShoppingCart, title: "Purchasing", trigger: "Quote to receiving", color: C.blue,
    detail: "One path from need to received: request, purchase order to the right vendor, confirmation, receiving checked against the order, and the cost landed on the job or into stock. Special orders tied to their job so nothing arrives orphaned. A supplier database with real reorder points, and vendor price increases handled as a scheduled pricebook review rather than a surprise found in a margin report." },
  { Icon: Plug, title: "Integrations and automation", trigger: "Where I am strongest", color: C.purple,
    detail: "ServiceM8, QuickBooks Online, and HighLevel connected so a customer, a job, an invoice, and a conversation are the same story. Automation in n8n, Zapier, or Make for the repetitive office work, and the ServiceM8 API directly when the built in tools run out of room. This is the layer most ServiceM8 administrators cannot reach, and it is where the compounding time savings live." },
  { Icon: BarChart3, title: "Reporting and KPIs", trigger: "Outcomes, not activity", color: C.rose,
    detail: "A weekly report an owner reads in two minutes: revenue and gross margin by trade, average invoice, quote conversion, jobs completed versus scheduled, callbacks, unbilled and aging work, technician productivity, and inventory accuracy. Built on live data pulled from the systems rather than typed into a spreadsheet, so nobody can quietly stop producing it." },
  { Icon: FileText, title: "SOPs and adoption", trigger: "So it survives me", color: C.green,
    detail: "Every workflow documented in plain language with the why, not just the clicks. Short, role specific procedures a tech can read on a phone between jobs. Training that shows people how the system makes their day easier, because technician adoption is not a software problem, it is a design and communication problem. The goal is a system SDR owns, not one that depends on the person who built it." },
];

function OperatingSystem() {
  const [i, setI] = useState(0);
  const s = LAYERS[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {LAYERS.map((l, idx) => {
          const on = idx === i;
          return (
            <button
              key={l.title}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 152, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? l.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <l.Icon size={16} color={l.color} />
              <div style={{ fontSize: 11, fontWeight: 800, color: l.color, marginTop: 6 }}>
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 2, lineHeight: 1.25 }}>{l.title}</div>
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
// The weekly report
const KPIS = [
  { Icon: TrendingUp, title: "Revenue and margin by trade", body: "Electrical, plumbing, HVAC, generators, water treatment and well pumps are different businesses. Blended numbers hide which one is carrying the others.", color: C.amber },
  { Icon: Gauge, title: "Quote conversion", body: "Quotes sent, quotes won, and conversion rate by technician and by job type. This is usually the fastest lever on revenue.", color: C.green },
  { Icon: Wrench, title: "Technician productivity", body: "Billable hours against paid hours, jobs completed, average invoice, and callbacks. Callbacks are the honest quality metric.", color: C.cyan },
  { Icon: AlertTriangle, title: "Unbilled and aging work", body: "Completed but not invoiced, and invoiced but not paid. Cash sitting in a finished job is the most common quiet leak.", color: C.rose },
  { Icon: Boxes, title: "Inventory accuracy", body: "Counted versus system, shrinkage, and stockouts that cost a return visit. A second trip is the most expensive line item in home service.", color: C.blue },
  { Icon: Users, title: "Customer experience", body: "Response time, review rate, and repeat and membership retention, because retention is cheaper than the ad that replaces the customer.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// Where I am strongest
const EDGE = [
  { Icon: Code2, title: "The ServiceM8 API", body: "I have built directly against the ServiceM8 API, not just configured the interface. When the built in reporting or automation cannot do it, I can still build it.", color: C.amber },
  { Icon: Database, title: "Live BI dashboards", body: "I have built a live CEO dashboard for a service business pulling from ServiceM8 and HighLevel, with job maps, schedules, payments, and a lead to job funnel, on an automatic sync.", color: C.green },
  { Icon: Workflow, title: "Systems that connect", body: "ServiceM8, QuickBooks Online, HighLevel, n8n, Zapier, and Make, wired together so the office stops rekeying the same job into three places.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
export default function SdrElectricServiceM8OperatingSystem() {
  const heroStats = useMemo(
    () => [
      { k: "ServiceM8", v: "2 years, hands on" },
      { k: "Beyond config", v: "The API itself" },
      { k: "Approach", v: "Audit before change" },
      { k: "Output", v: "A system you own" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.amber, background: "rgba(251,191,36,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.amber }}>
            <Wrench size={15} /> The ServiceM8 operating system for SDR
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.07, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            I build systems,
            <span style={{ color: C.amber }}> not just software.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            That is your line, and it is the reason I am applying. A home service business does not get profitable
            because it bought ServiceM8. It gets profitable when the pricebook, the inventory, the purchasing, the
            integrations, and the reporting all agree with each other. Here is how I would build that for SDR, layer by
            layer. Click through it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((s) => (
              <div key={s.k}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{s.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="The operating system" title="Eight layers, in the order I would build them" sub="Nothing here starts with rebuilding your account. It starts with understanding it. Tap each layer.">
          <OperatingSystem />
        </Section>

        <Section eyebrow="The weekly report" title="What I would put in front of the owner" sub="Your post asks what reports and KPIs matter weekly. This is my answer, and the point of all of it is decisions, not activity counts.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {KPIS.map((k, i) => (
              <motion.div
                key={k.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${k.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <k.Icon size={18} color={k.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{k.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{k.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="My edge" title="I go past the interface" sub="Plenty of people can configure ServiceM8. Far fewer can build against it when the interface runs out of room. That is the difference I bring.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {EDGE.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <e.Icon size={18} color={e.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{e.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{e.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Honest note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 28, background: "rgba(251,191,36,0.07)", border: `1px solid ${C.amber}`, borderRadius: 16, padding: "20px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <CheckCircle2 size={17} color={C.amber} />
            <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>Where I am strong, and where I would learn</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 780 }}>
            I would rather be straight with you than oversell. My depth is in ServiceM8 itself, the API, the
            integrations, the automation, and the reporting layer, and I have built these for a live service business.
            My warehouse and purchasing experience comes from building the systems that run them rather than years on a
            trade counter, so on inventory and purchasing I would spend my first weeks listening to your people before
            recommending anything. What I will not do is guess in front of you and call it expertise.
          </p>
        </motion.div>

        <Section eyebrow="Proof" title="Systems I built and run" sub="Screenshots from a live CRM account I built end to end. The ServiceM8 dashboard work is described in my application rather than linked, because it holds a client's real customer data.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-01-workflow-library.png" caption="A documented workflow library inside a live account I built." />
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="Pipelines moving work from first contact to completed." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published automations running on their own." />
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="The board in day to day use." />
          </div>
        </Section>

        {/* Close */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Terminal size={18} color={C.amber} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>One person, and I built all of it myself.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 750 }}>
            I am not an agency. I audit the system, design it, build it, document it, and train the people who use it.
            I built this page with Claude Code as my tool, the same way I would build your reporting. The goal is
            always a system SDR owns and runs without me.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/clients/how-i-build/experience" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.amber, borderRadius: 999, padding: "10px 16px" }}>
              More systems I built <ArrowRight size={14} />
            </Link>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Full time, long term</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Proof (real screenshots)
function ProofShot({ src, caption }: { src: string; caption: string }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      {err ? (
        <div style={{ height: 200, display: "grid", placeItems: "center", background: C.bg2, color: C.muted, fontSize: 12.5, textAlign: "center", padding: "0 20px" }}>
          Screenshot from a live account
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
