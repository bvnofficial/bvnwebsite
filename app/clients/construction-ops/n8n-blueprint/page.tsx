"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, HardHat, MessageSquare, FileText, CalendarCheck,
  Hammer, CheckCircle2, Receipt, Bell, Clock, Truck, ThumbsUp, Star,
  Workflow, Database, Send, Zap, Terminal, PhoneCall,
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
// 1. Job pipeline (interactive)
type Stage = { Icon: typeof HardHat; title: string; trigger: string; detail: string; color: string };
const STAGES: Stage[] = [
  { Icon: MessageSquare, title: "Enquiry", trigger: "New job in", color: C.blue,
    detail: "A new enquiry hits your job management software or a form, and n8n creates the record, tags it, and sends the customer an instant we got your request reply, so no lead sits unanswered." },
  { Icon: FileText, title: "Quote", trigger: "Quote sent", color: C.cyan,
    detail: "When a quote goes out, n8n logs it and starts a follow up timer. If the customer has not responded in a set window, a polite chase goes out on its own." },
  { Icon: CalendarCheck, title: "Scheduled", trigger: "Job booked", color: C.purple,
    detail: "Once the job is booked, n8n confirms the date to the customer, adds it to the team calendar, and sends a reminder the day before, so no one is caught out." },
  { Icon: Hammer, title: "In progress", trigger: "Work started", color: C.coral,
    detail: "As the job moves to in progress, the customer gets an on the way or work has started update, and internal tasks are created for the crew, all from the status change." },
  { Icon: CheckCircle2, title: "Complete", trigger: "Job done", color: C.green,
    detail: "When the job is marked complete, n8n sends a thank you and a review request while the work is fresh, and flags the job as ready to invoice." },
  { Icon: Receipt, title: "Invoice", trigger: "On completion", color: C.amber,
    detail: "The invoice is triggered on completion, payment is tracked, and reminders go out automatically until it is paid, so cash does not slip because someone forgot to chase." },
];

function Pipeline() {
  const [i, setI] = useState(0);
  const s = STAGES[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {STAGES.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.title}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 140, textAlign: "left", cursor: "pointer",
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
// 2. Customer service automations
const SERVICE = [
  { Icon: Bell, title: "Instant confirmations", body: "Every enquiry and booking gets an immediate reply, so customers never wonder whether you received it.", color: C.blue },
  { Icon: Clock, title: "Timely reminders", body: "Appointment and job reminders go out the day before automatically, cutting no shows and last minute confusion.", color: C.amber },
  { Icon: Truck, title: "On the way updates", body: "A quick heads up when the crew is on the way or work has started, the kind of touch that earns repeat customers.", color: C.coral },
  { Icon: ThumbsUp, title: "Job complete follow up", body: "A thank you and a check that everything met expectations, sent the moment the job is marked done.", color: C.green },
  { Icon: Star, title: "Review requests", body: "A review ask fires while the work is fresh, so your reputation grows without anyone remembering to send it.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// 3. n8n integration map
const INTEGRATIONS = [
  { Icon: Workflow, title: "n8n at the center", body: "The engine that watches for changes and fires the right action, with conditional logic and error alerts when something breaks.", color: C.amber },
  { Icon: Database, title: "Your job management software", body: "n8n connects to your existing pipeline through its API or webhooks, so you keep the tool you already run, just automated.", color: C.cyan },
  { Icon: Send, title: "Email, SMS, and calendar", body: "The customer facing side: confirmations, reminders, and updates sent through the channels your customers already use.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// 4. Proof (real GHL screenshots)
function ProofShot({ src, caption }: { src: string; caption: string }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      {err ? (
        <div style={{ height: 200, display: "grid", placeItems: "center", background: C.bg2, color: C.muted, fontSize: 12.5, textAlign: "center", padding: "0 20px" }}>
          Screenshot from a live automation account
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

// ─────────────────────────────────────────────────────────────
export default function ConstructionN8nBlueprint() {
  const heroStats = useMemo(
    () => [
      { k: "Engine", v: "n8n" },
      { k: "Covers", v: "Enquiry to invoice" },
      { k: "Keeps", v: "Your current software" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.amber, background: "rgba(251,191,36,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.amber }}>
            <HardHat size={15} /> n8n automation blueprint for a construction business
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Your job pipeline and customer updates,
            <span style={{ color: C.amber }}> running on n8n instead of memory.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            You want an n8n expert to build the workflows inside your pipeline and streamline customer service.
            Rather than just say I can, I mapped it: your job pipeline from enquiry to invoice, automated stage by
            stage, with the customer kept in the loop the whole way. Click through it.
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

        <Section eyebrow="The job pipeline" title="Enquiry to invoice, automated" sub="Every stage of a job, with the n8n trigger and what fires. Your existing software stays, n8n just makes it move on its own. Tap each stage.">
          <Pipeline />
        </Section>

        <Section eyebrow="Customer service" title="Customers kept in the loop, automatically" sub="The touches that make a small construction business feel organized and professional, none of them needing anyone to remember.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {SERVICE.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${s.color}`, borderRadius: 14, padding: "18px 18px" }}
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

        <Section eyebrow="How it connects" title="n8n around the software you already use" sub="You keep your job management tool. n8n wraps around it, so nothing gets ripped out and replaced.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {INTEGRATIONS.map((n, i) => (
              <motion.div
                key={n.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <n.Icon size={18} color={n.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{n.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{n.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Proof" title="Automation I have already built" sub="I build this kind of multi stage, automated pipeline for real. Screenshots from a live account I built and run.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published workflows firing stage by stage as a job or contact moves through the pipeline." />
            <ProofShot src="/proof/regal-04-pipelines-list.png" caption="A multi stage pipeline, the same structure your enquiry to invoice flow needs." />
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
            <Terminal size={18} color={C.amber} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Built with Claude Code, and BVN is just me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            This page I built with Claude Code. I am an automation builder who lives in n8n and tools like it, I
            work punctually and to time as you asked, and I learn a new job management platform fast. Construction
            software is new to me, but connecting n8n to whatever you run is exactly the kind of job I do.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.amber, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Part time, punctual, in Slack daily</span>
        </div>
      </div>
    </div>
  );
}
