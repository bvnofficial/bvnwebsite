"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Copy, GitBranch, MessageSquareWarning, Route,
  Tags, ZapOff, Radar, Trash2, Wrench, Merge, Search, ShieldCheck,
  Video, GraduationCap, ClipboardCheck, Clock, Sparkles, PhoneCall,
  AlertTriangle, CheckCircle2,
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
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 680, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// Audit findings explorer
type Action = "Repair" | "Consolidate" | "Remove";
const ACTION_COLOR: Record<Action, string> = {
  Repair: C.amber,
  Consolidate: C.blue,
  Remove: C.red,
};

type Finding = {
  id: string;
  Icon: typeof Copy;
  title: string;
  symptom: string;
  diagnosis: string;
  fix: string;
  action: Action;
};

const FINDINGS: Finding[] = [
  {
    id: "dupe-wf", Icon: Copy, title: "Duplicate lead workflows",
    symptom: "New leads sometimes get two welcome texts a minute apart.",
    diagnosis: "Two different workflows both trigger on a new contact, a newer one and an older one nobody turned off. Both enroll the same lead.",
    fix: "Keep the current workflow, disable the legacy one, and add a wait and dedupe check so the same lead can never be enrolled twice.",
    action: "Consolidate",
  },
  {
    id: "conflict", Icon: GitBranch, title: "Conflicting pipeline triggers",
    symptom: "Opportunities jump to the wrong stage, or bounce back after moving forward.",
    diagnosis: "Two workflows act on the same opportunity and set different stages, so the last one to fire wins and the order is not controlled.",
    fix: "Map every workflow that touches the pipeline, give each a single clear responsibility, and set explicit entry and exit criteria so stages move one direction on purpose.",
    action: "Repair",
  },
  {
    id: "dupe-comms", Icon: MessageSquareWarning, title: "Duplicate communications",
    symptom: "Some leads report getting the same email or SMS more than once.",
    diagnosis: "Overlapping triggers and a nurture campaign that re enrolls contacts already in another sequence, with no dedupe or suppression.",
    fix: "Add suppression logic and a single source of truth for who is in which sequence, so a contact is never messaged twice for the same reason.",
    action: "Repair",
  },
  {
    id: "wrong-pipe", Icon: Route, title: "Leads landing in the wrong place",
    symptom: "Leads from a specific form end up in the default pipeline, not the right one.",
    diagnosis: "The form is not mapped to a workflow that creates the opportunity in the correct pipeline, so GHL drops it into the default.",
    fix: "Route each form through a workflow that creates the opportunity in the right pipeline and stage, tagged with its true source.",
    action: "Repair",
  },
  {
    id: "tags", Icon: Tags, title: "Fragmented tags",
    symptom: "Smart Lists miss leads that should obviously be in them.",
    diagnosis: "Near duplicate tags, hot-lead, Hot Lead, hotlead, applied by different workflows, so no single tag captures the group.",
    fix: "Standardize to one naming convention, merge the variants, and update the workflows that set them so Smart Lists become reliable.",
    action: "Consolidate",
  },
  {
    id: "broken-trigger", Icon: ZapOff, title: "A trigger that never fires",
    symptom: "A follow up workflow looks active but nobody ever receives it.",
    diagnosis: "A filter on the trigger references a field or value that no longer exists, so the condition never matches and the workflow silently does nothing.",
    fix: "Correct the filter to the real field and value, test it on a sample contact, and confirm enrollment before trusting it again.",
    action: "Repair",
  },
  {
    id: "attribution", Icon: Radar, title: "Lost lead source attribution",
    symptom: "You cannot tell which ads or channels actually produce booked appointments.",
    diagnosis: "Meta and other leads come in without a source written to a field, so everything looks like it came from nowhere.",
    fix: "Capture the true source at intake into a dedicated field and tag, so reporting can trace ad to lead to appointment.",
    action: "Repair",
  },
  {
    id: "orphan", Icon: Trash2, title: "Orphaned old automations",
    symptom: "Contacts get messages about an offer that ended months ago.",
    diagnosis: "A retired campaign is still live and still enrolling current contacts, creating noise and the odd embarrassing send.",
    fix: "Confirm it is truly unused, archive or remove it, and document why, so it does not get switched back on by accident.",
    action: "Remove",
  },
];

function AuditExplorer() {
  const [id, setId] = useState(FINDINGS[0].id);
  const f = FINDINGS.find((x) => x.id === id) ?? FINDINGS[0];
  const ac = ACTION_COLOR[f.action];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 260px) 1fr", gap: 16, alignItems: "start" }}>
      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FINDINGS.map((x) => {
          const on = x.id === id;
          const xac = ACTION_COLOR[x.action];
          return (
            <button
              key={x.id}
              onClick={() => setId(x.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? xac : C.border}`,
                borderRadius: 11, padding: "10px 12px", transition: "all 0.16s",
              }}
            >
              <x.Icon size={16} color={on ? xac : C.muted} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, lineHeight: 1.3 }}>{x.title}</span>
            </button>
          );
        })}
      </div>

      {/* Detail */}
      <motion.div
        key={f.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ background: C.bg2, border: `1px solid ${C.border}`, borderTop: `3px solid ${ac}`, borderRadius: 16, padding: "22px 22px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${ac}` }}>
            <f.Icon size={20} color={ac} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{f.title}</div>
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 800, color: C.bg, background: ac, borderRadius: 999, padding: "5px 11px" }}>
            {f.action === "Remove" ? <Trash2 size={12} /> : f.action === "Consolidate" ? <Merge size={12} /> : <Wrench size={12} />}
            {f.action}
          </span>
        </div>

        <Row Icon={AlertTriangle} label="Symptom" color={C.amber} text={f.symptom} />
        <Row Icon={Search} label="Diagnosis" color={C.cyan} text={f.diagnosis} />
        <Row Icon={CheckCircle2} label="Fix" color={C.green} text={f.fix} />

        <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: C.muted, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "6px 12px" }}>
          <Video size={13} color={C.rose} /> Logged in the audit report and captured in a short SOP video
        </div>
      </motion.div>
    </div>
  );
}

function Row({ Icon, label, color, text }: { Icon: typeof Search; label: string; color: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 11, marginBottom: 12 }}>
      <div style={{ width: 26, height: 26, borderRadius: 8, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, flexShrink: 0 }}>
        <Icon size={14} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color, marginBottom: 3 }}>{label}</div>
        <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.55, margin: 0 }}>{text}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// The method
const METHOD = [
  { Icon: Search, title: "Understand before touching", body: "I read the account first, every workflow, pipeline, and trigger, and map how a lead actually moves through it before I change a single thing.", color: C.cyan },
  { Icon: ClipboardCheck, title: "Audit report you can read", body: "A plain language list of what is working, broken, duplicated, conflicting, or unnecessary, with a recommended action for each: repair, consolidate, or remove.", color: C.blue },
  { Icon: ShieldCheck, title: "Fix on a safe copy, test, then apply", body: "Changes are tested on sample contacts before real leads touch them, so cleaning up the account never breaks what is already working.", color: C.green },
  { Icon: GraduationCap, title: "Teach you as I go", body: "You are learning GHL, so I explain why each change was made in language that builds your understanding, not just a list of what I did.", color: C.amber },
];

// ─────────────────────────────────────────────────────────────
// Proof
const PROOF = [
  { name: "Real multi pipeline GHL account", color: C.rose,
    body: "In a live client account I built and maintained four pipelines with staged journeys, custom fields in folders, tags, and calendars, all to a naming convention, so I know what a clean account looks like and what a messy one is missing.",
    tags: ["Pipelines", "Naming", "Live account"] },
  { name: "Diagnosing real production breakage", color: C.amber,
    body: "I have traced and fixed real races and misfires, including a payment flow that emailed a customer more than once because an update was not atomic. I find the root cause in the logs, not guess.",
    tags: ["Troubleshooting", "Logs", "Root cause"] },
  { name: "Documented for handover", color: C.green,
    body: "Every build I ship comes with a written SOP and a walkthrough, because a system nobody else understands is a liability. Teaching the owner is part of the job, not an afterthought.",
    tags: ["SOP", "Loom", "Handover"] },
];

// ─────────────────────────────────────────────────────────────
export default function GhlAudit() {
  const heroStats = [
    { k: "On GoHighLevel", v: "since 2019" },
    { k: "First move", v: "audit, not build" },
    { k: "Findings", v: "clickable here" },
    { k: "Every fix", v: "documented" },
  ];

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 22px 100px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 34 }}>
          <a href="https://www.bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            <ArrowLeft size={15} /> BVN Official
          </a>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.rose, background: "rgba(251,113,133,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.rose }}>
            <Search size={15} /> GHL audit · CRM cleanup · before we build
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            First I find what is broken.
            <span style={{ color: C.rose }}> Then we build on solid ground.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You already have a Lead to Client build installed, and you do not want someone bolting on new workflows
            before understanding what is there. Neither do I. Here is how I audit an existing account: click through
            the real problems I look for, how I diagnose each one, the fix, and how it gets documented.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((st) => (
              <div key={st.k}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>{st.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{st.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="The audit" title="Click through what I look for" sub="These are the exact problems that quietly break a life insurance CRM: duplicate and conflicting workflows, duplicate communications, leads in the wrong place, fragmented tags, dead triggers, and lost attribution. Pick any one to see the symptom, how I diagnose it, and the fix.">
          <AuditExplorer />
        </Section>

        <Section eyebrow="The method" title="How I clean an account without breaking it" sub="The difference between a specialist and someone following a tutorial is what happens before the building starts. This is the discipline.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {METHOD.map((g, i) => (
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

        <Section eyebrow="Not a mockup" title="Real GHL work behind this" sub="Client names stay confidential, but each of these is real and mine end to end. The audit approach above comes from having actually built and fixed accounts, not from a course.">
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
            <Sparkles size={18} color={C.rose} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I built this page and I do the audits, the fixes, and the SOP videos myself. No team, no handoffs. You get
            one person who understands your whole account and teaches you as they go, so over time you depend on the
            system, not on me.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.rose, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
            <Link href="/intro" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
              Intro video <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <ClipboardCheck size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps United States hours daily</span>
        </div>
      </div>
    </div>
  );
}
