"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Users, UserPlus, Repeat, ListChecks,
  Zap, ShieldCheck, FileText, GraduationCap, CheckCircle2,
  PhoneCall, Sparkles, RotateCcw, HeartPulse, FolderTree, SlidersHorizontal,
  ImageOff, Lock,
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

const CYCLE = [C.blue, C.cyan, C.purple, C.amber, C.coral, C.green, C.rose];

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
// 1. Recruitment pipeline board (interactive, their exact stages)
const STAGES = [
  { label: "New Applicant", auto: "Auto acknowledgment sent, applicant tagged by source." },
  { label: "Application Review", auto: "Assigned to a recruiter, internal review task created." },
  { label: "Pre Screen", auto: "Pre screen questionnaire sent, answers logged to the record." },
  { label: "Interview Scheduled", auto: "Calendar booked, confirmation and reminders set." },
  { label: "Interview Completed", auto: "Scorecard requested from the interviewer." },
  { label: "Conditional Offer", auto: "Offer letter sent for signature." },
  { label: "Documents Pending", auto: "Document checklist requested from the applicant." },
  { label: "Documents Submitted", auto: "Documents verified, compliance items checked off." },
  { label: "Background Review", auto: "Background check initiated, status tracked to completion." },
  { label: "Training Assigned", auto: "Training modules assigned with due dates." },
  { label: "Training Completed", auto: "Completion recorded, flagged for the hire decision." },
  { label: "Ready for Hire", auto: "Manager approval task created." },
  { label: "Active Employee", auto: "Moved to Employee Management, onboarding complete." },
];

type App = { id: string; name: string; role: string; stage: number };
const SEED: App[] = [
  { id: "a1", name: "Grace A.", role: "Caregiver", stage: 0 },
  { id: "a2", name: "Marcus T.", role: "CNA", stage: 2 },
  { id: "a3", name: "Lena P.", role: "Home Health Aide", stage: 5 },
  { id: "a4", name: "Omar D.", role: "Caregiver", stage: 8 },
  { id: "a5", name: "Sofia R.", role: "CNA", stage: 11 },
];

function RecruitmentBoard() {
  const [apps, setApps] = useState<App[]>(SEED);
  const [flash, setFlash] = useState<string>("Click any applicant card to advance them a stage. The automation for that stage fires.");

  const advance = (id: string) => {
    setApps((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      const next = Math.min(a.stage + 1, STAGES.length - 1);
      if (next !== a.stage) setFlash(`${a.name} moved to ${STAGES[next].label}. ${STAGES[next].auto}`);
      return { ...a, stage: next };
    }));
  };
  const reset = () => { setApps(SEED); setFlash("Board reset. Click any applicant card to advance them a stage."); };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <motion.span
          key={flash}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: C.sub, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 13px" }}
        >
          <Zap size={14} color={C.amber} /> {flash}
        </motion.span>
        <button
          onClick={reset}
          style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.sub, cursor: "pointer", background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "8px 13px" }}
        >
          <RotateCcw size={13} /> Reset board
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10 }}>
        {STAGES.map((st, si) => {
          const col = apps.filter((a) => a.stage === si);
          const color = CYCLE[si % CYCLE.length];
          return (
            <div key={st.label} style={{ flexShrink: 0, width: 150 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: 0.3, lineHeight: 1.2 }}>{st.label}</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, background: C.card, borderRadius: 6, padding: "1px 6px" }}>{col.length}</span>
              </div>
              <div style={{ background: C.bg2, border: `1px dashed ${C.border}`, borderRadius: 12, padding: 8, minHeight: 84, display: "flex", flexDirection: "column", gap: 8 }}>
                <AnimatePresence mode="popLayout">
                  {col.map((a) => (
                    <motion.button
                      key={a.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => advance(a.id)}
                      style={{ textAlign: "left", cursor: si === STAGES.length - 1 ? "default" : "pointer", background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${color}`, borderRadius: 9, padding: "8px 9px" }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, lineHeight: 1.2 }}>{a.name}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{a.role}</div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. The four pipelines
const PIPELINES = [
  { Icon: UserPlus, name: "Recruitment Pipeline", stages: "13 stages, new applicant to active employee", body: "The full hiring funnel above, with automation firing at every stage so nobody stalls and nothing is missed.", color: C.blue },
  { Icon: Users, name: "Employee Management Pipeline", stages: "Active, reviews, leave, offboarding", body: "The lifecycle after hire: active staff, review and credential renewal reminders, leave, and a clean offboarding path.", color: C.cyan },
  { Icon: Repeat, name: "Referral Pipeline", stages: "Referred to hired to rewarded", body: "Track caregiver referrals from submission through to hire, with the reward automated once the referral is active.", color: C.green },
  { Icon: ListChecks, name: "Internal Task Pipeline", stages: "Requested to in progress to done", body: "Internal operations tasks and tickets tracked to completion, so the team's own work never lives only in someone's head.", color: C.amber },
];

// ─────────────────────────────────────────────────────────────
// 3. CRM foundation (from their scope)
const FOUNDATION = [
  "Complete CRM organization", "Custom fields", "Custom values", "Smart Lists",
  "Contact segmentation", "User permissions", "Sub account structure", "Folder structure",
];

// ─────────────────────────────────────────────────────────────
// 4. Onboarding and compliance flow
const ONBOARD = [
  { Icon: FileText, title: "Documents", body: "A checklist requested from the applicant, verified on submission, with compliance items tracked so nothing is signed off early.", color: C.blue },
  { Icon: ShieldCheck, title: "Background review", body: "Background check kicked off and tracked to completion, with automation held back on sensitive terminal steps for a human to confirm.", color: C.green },
  { Icon: GraduationCap, title: "Training", body: "Modules assigned with due dates, completion recorded, and the record flagged for the hire decision automatically.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// 5. Proof gallery (real GHL screenshots, graceful fallback)
const PROOF = [
  { src: "/proof/regal-03-workflow-builder-branching.png", cap: "Live workflow builder with a conditional branch and timed steps" },
  { src: "/proof/regal-04-pipelines-list.png", cap: "Multiple pipelines built to spec inside a care operator account" },
  { src: "/proof/regal-05-opportunities-kanban.png", cap: "Pipeline board tracking records stage by stage" },
  { src: "/proof/regal-02-family-workflows.png", cap: "Published workflows across a full journey" },
];

function ProofTile({ src, cap }: { src: string; cap: string }) {
  const [err, setErr] = useState(false);
  return (
    <figure style={{ margin: 0, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      {err ? (
        <div style={{ display: "grid", placeItems: "center", height: 172, background: C.bg2, borderBottom: `1px solid ${C.border}`, gap: 8 }}>
          <ImageOff size={22} color={C.muted} />
          <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 700, letterSpacing: 0.4 }}>Screenshot from a live GHL account</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={cap} loading="lazy" onError={() => setErr(true)} style={{ width: "100%", display: "block", borderBottom: `1px solid ${C.border}` }} />
      )}
      <figcaption style={{ fontSize: 12.5, color: C.sub, padding: "10px 12px", lineHeight: 1.4 }}>{cap}</figcaption>
    </figure>
  );
}

// ─────────────────────────────────────────────────────────────
export default function OurHomeCareCrm() {
  const heroStats = useMemo(
    () => [
      { k: "Pipelines", v: "4, from scratch" },
      { k: "Recruitment", v: "13 stages" },
      { k: "Care GHL", v: "already built" },
      { k: "Built by", v: "one person" },
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
            Built for Our Home Care Solutions
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.blue }}>
            <HeartPulse size={15} /> Home care recruiting and onboarding CRM
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            From applicant to active caregiver,
            <span style={{ color: C.coral }}> one system that never drops a name.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 680, lineHeight: 1.6 }}>
            You need a recruiting and onboarding CRM built from scratch in GoHighLevel, for a growing home care
            agency. I have built GHL for a care operator before, so I know this world. Here is your recruitment
            pipeline, live: click an applicant to move them a stage and watch the automation fire.
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

        <Section eyebrow="The recruitment pipeline" title="Your exact stages, running" sub="Every stage you listed, from New Applicant to Active Employee. This is the live logic, not a picture. Click any applicant card to advance them, and the automation for the new stage appears above the board.">
          <RecruitmentBoard />
        </Section>

        <Section eyebrow="The pipelines" title="Four pipelines, one account" sub="Recruitment is the engine, but the account holds the whole operation: the people after hire, the referrals that feed it, and the team's own internal work.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {PIPELINES.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${p.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <p.Icon size={18} color={p.color} />
                  <span style={{ fontSize: 15.5, fontWeight: 800, color: C.ink }}>{p.name}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginBottom: 8 }}>{p.stages}</div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="The foundation" title="Built right from the first field" sub="A CRM is only as good as its structure. Before a single workflow, I set up the architecture your whole account stands on, exactly the scope you listed.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
            {FOUNDATION.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}
              >
                <FolderTree size={15} color={C.cyan} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{f}</span>
              </motion.div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}>
              <SlidersHorizontal size={15} color={C.coral} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>Pipelines and automation</span>
            </div>
          </div>
        </Section>

        <Section eyebrow="Onboarding and compliance" title="The part healthcare cannot get wrong" sub="Documents, background checks, and training are where a care agency carries real risk. I build these to track cleanly and to hold automation back on the steps a human must confirm.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {ONBOARD.map((o, i) => (
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

        <Section eyebrow="I have built for care" title="Real GHL work in a care setting" sub="I built a full GoHighLevel CRM for a residential care operator: dual multi stage pipelines, 13 workflows, and a HIPAA aware setup. These screenshots are from a live account I built and run.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {PROOF.map((p) => (
              <ProofTile key={p.src} src={p.src} cap={p.cap} />
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
            I built this page, every pipeline it shows, and the care operator CRM behind it with my own hands.
            No team, no contractors, no handoffs. One person who understands the workflows and the compliance,
            accountable from the first custom field to the last onboarding automation.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Lock size={13} /> HIPAA aware builds</span>
        </div>
      </div>
    </div>
  );
}
