"use client";

import { notFound } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronDown, CircleCheck, Circle, CircleDashed,
  Clock, Search, Rocket, Mic, Workflow, Sparkles, MessageSquare,
  TrendingUp, Package, Brain, Boxes, ShieldCheck, FileText,
  TriangleAlert, PoundSterling, ListChecks, Phone, Mail, Megaphone,
} from "lucide-react";

// ── Brand tokens (BVN build-console palette) ─────────────────
const C = {
  bg: "#0A1120",
  bg2: "#0E1830",
  card: "#121E3A",
  cardHi: "#16264A",
  border: "#22324F",
  ink: "#EAF1FC",
  sub: "#9FB1D0",
  muted: "#647697",
  blue: "#3B82F6",
  cyan: "#22D3EE",
  green: "#34D399",
  amber: "#FBBF24",
  red: "#F87171",
  purple: "#A78BFA",
};

// ── Editable commercial inputs (CONFIRM BEFORE SHARING) ──────
const SCOPE_FEE = "£500"; // Phase 0 paid scoping sprint — placeholder, set real figure
const RETAINER_FROM = "£1,000/mo"; // ongoing managed-care
const LAST_UPDATED = "29 June 2026";

type Status = "done" | "active" | "todo";

type Item = { label: string; status: Status; ref?: string };
type Phase = {
  code: string;
  name: string;
  billing: string;
  objective: string;
  Icon: typeof Search;
  accent: string;
  items: Item[];
};

// ── The phased roadmap ───────────────────────────────────────
const phases: Phase[] = [
  {
    code: "Phase 0",
    name: "Scope & Feasibility Sprint",
    billing: `${SCOPE_FEE} fixed`,
    objective:
      "De-risk the whole engagement before any large build. Confirm the unknowns, audit the tools you already pay for, and walk out with a costed, green-lit plan — plus the first quick win already live.",
    Icon: Search,
    accent: C.cyan,
    items: [
      { label: "Confirm warehouse software & whether 'goods booked-in' is recorded in it (decides the PO auto-chase)", status: "todo", ref: "#30" },
      { label: "Check TikTok Shop store-rating eligibility for API flash-sale scheduling", status: "todo", ref: "#12" },
      { label: "GoHighLevel audit — what you pay for and aren't using (onboarding, nurture, abandoned cart, calendar)", status: "todo", ref: "#31" },
      { label: "Notion audit — current build vs. what it should be doing", status: "todo", ref: "#32" },
      { label: "Confirm WhatsApp Business API setup for draft-then-approve (routing for now, inbound + outbound)", status: "todo", ref: "#9 #10" },
      { label: "Reimbursement investigation — manual recovery vs. tool, in £ (found-money check before optimising)", status: "todo", ref: "#23" },
      { label: "Quick win live: invoice filing / auto-sort (easiest build on the list, unblocks reimbursements)", status: "todo", ref: "#21" },
      { label: "Deliver costed, dependency-ordered build plan + fixed quotes for Phases 1–4", status: "todo" },
    ],
  },
  {
    code: "Phase 1",
    name: "Foundation & First Engines",
    billing: "Fixed quote — confirmed end of Phase 0",
    objective:
      "Build the foundation everything else draws from, plus the two highest standalone-ROI engines, plus the cheap mechanical wins that prove value fast. This follows your own build order exactly.",
    Icon: Rocket,
    accent: C.blue,
    items: [
      { label: "Keystone Voice & Ideal-Customer doc — auto-built from call transcripts (BUILD FIRST)", status: "todo", ref: "#2" },
      { label: "Daily trend-to-angle engine — overnight scrape → morning brief with the FBA angle", status: "todo", ref: "#1" },
      { label: "Affiliate warm-onboarding sequence — scoped for BOTH Riverside + My Candy Shop (build once, run twice)", status: "todo", ref: "#10" },
      { label: "Amazon customer messages — AI-drafted, Cathrine approves rather than writes", status: "todo", ref: "#19" },
      { label: "Refund handling — rules-based, AI executes within the parameters we set with Adam", status: "todo", ref: "#20" },
    ],
  },
  {
    code: "Phase 2",
    name: "Voice-Powered Content Layer",
    billing: "Fixed quote — confirmed end of Phase 0",
    objective:
      "Everything that draws on the voice doc once it's live. Cheap to build now that the foundation exists, and the highest-ROI content automation there is.",
    Icon: Mic,
    accent: C.purple,
    items: [
      { label: "Transcribe → repurpose — one filmed video into shorts, posts, captions, email, lead magnet", status: "todo", ref: "#3" },
      { label: "Sales-call scorecard — consistent scoring of the 3 known leaks + trend tracking", status: "todo", ref: "#7" },
      { label: "Auto-draft client replies (Telegram + WhatsApp 1:1) in Adam's voice, draft-then-approve", status: "todo", ref: "#9" },
      { label: "Ad scripting (Shopify DTC) — winning format + avatar research → grounded ad concepts", status: "todo", ref: "#15" },
      { label: "Shopify research agent — ongoing pulls on joints, supplements, pain points, customer language", status: "todo", ref: "#14" },
      { label: "Amazon listing drafting — titles, bullets, A+ copy from the brand corpus", status: "todo", ref: "#26" },
      { label: "Evergreen content ideation engine — same scrape spine, pointed at FBA mentors", status: "todo", ref: "#4" },
    ],
  },
  {
    code: "Phase 3",
    name: "Assist & Operations Layer",
    billing: "Fixed quote — confirmed end of Phase 0",
    objective:
      "Judgement-heavy work where AI surfaces the numbers and recommendation and Adam decides. Plus the operational plumbing that frees the team.",
    Icon: Workflow,
    accent: C.green,
    items: [
      { label: "PO lifecycle tracking + auto follow-up (subject to warehouse-status answer from Phase 0)", status: "todo", ref: "#30" },
      { label: "Sourcing / PO generation assist — supplier comms, POs, landed-cost calc", status: "todo", ref: "#24" },
      { label: "Forecasting / restock support — surface the numbers, Adam decides", status: "todo", ref: "#25" },
      { label: "Review requests + negative-review triage (rides the comms engine)", status: "todo", ref: "#22" },
      { label: "Landing-page templatisation — split copy from design via Shogun/PageFly (kills the £2k/page cost)", status: "todo", ref: "#17" },
      { label: "Ad ideation pull (Meta library / Foreplay) + Kalodata candidate surfacing", status: "todo", ref: "#16 #13" },
    ],
  },
  {
    code: "Phase 4",
    name: "Greenfield & Scale",
    billing: "Fixed quote — confirmed end of Phase 0",
    objective:
      "Net-new revenue and scale items — where Cathrine's freed hours go — plus the less-mature tech we deliberately scope last so nothing is overpromised.",
    Icon: Sparkles,
    accent: C.amber,
    items: [
      { label: "International listing variations (.de etc.) — net-new revenue, not time saved", status: "todo", ref: "#27" },
      { label: "Reporting / profit dashboards — margin, inventory, PPC in one view", status: "todo", ref: "#28" },
      { label: "Compliance / account-health monitoring + alerting layer", status: "todo", ref: "#29" },
      { label: "AI ad-production pipeline — grounded scripts + shot lists make the editor ~2x faster", status: "todo", ref: "#18" },
      { label: "Cold affiliate outreach assist — AI drafts, human sends in controlled batches", status: "todo", ref: "#11" },
      { label: "Flash-sale scheduling (if TikTok rating clears the API bar)", status: "todo", ref: "#12" },
    ],
  },
];

// ── Day-one kickoff ──────────────────────────────────────────
const dayOne: string[] = [
  "Shared access handover: Notion, GoHighLevel, Amazon Seller Central, TikTok Shop, Shopify, Fathom.",
  "30-minute kickoff call to lock priorities and the three open unknowns (warehouse software, TikTok store rating, comms routing).",
  "Invoice-filing quick win scoped and started — a visible result on day one.",
  "Voice-doc pipeline architecture begun (Fathom → Claude → living Notion doc).",
  "GoHighLevel audit kicked off — first read on what you're paying for and not using.",
  "This workspace goes live as our single shared source of truth, updated as each item moves.",
];

// ── Feasibility verdicts (researched) ────────────────────────
type Verdict = { q: string; status: "green" | "amber" | "red"; verdict: string };
const feasibility: Verdict[] = [
  {
    q: "WhatsApp — client replies & affiliate onboarding",
    status: "green",
    verdict:
      "Buildable as draft-then-approve via the Business API. The locked part is group automation (official Groups API caps a managed group at 8). Onboarding is 1:1, so it's fine — the community group stays manual by design.",
  },
  {
    q: "TikTok Shop — affiliate, flash sales, cold outreach",
    status: "amber",
    verdict:
      "Affiliate APIs are now general release (warm onboarding + sales tracking is real). Flash-sale scheduling is exposed via the Promotion API, conditional on store-rating eligibility (confirm in Phase 0). Cold creator DM stays human-assisted — no clean API.",
  },
  {
    q: "Shopify — landing pages without the £2k freelancer",
    status: "green",
    verdict:
      "Can't build pages via the main API, but Shogun/PageFly split proven copy from a reusable template and publish straight to theme. New page becomes drop-the-copy-in, publish. Clean win.",
  },
  {
    q: "PO lifecycle — the auto-chase",
    status: "amber",
    verdict:
      "Hinges on one answer: does the warehouse software record 'booked in'? If yes, the auto-chase is a clean rules-based build. If status only lives in calls/WhatsApp, capturing it is the real project. Resolved in Phase 0.",
  },
];

// ── The four reusable engines ────────────────────────────────
type Engine = { Icon: typeof Brain; name: string; powers: string; desc: string };
const engines: Engine[] = [
  {
    Icon: Brain,
    name: "Voice & Knowledge Core",
    powers: "Powers #2, #3, #7, #9, #26",
    desc: "Fathom transcript → Claude → living Notion doc. One foundation, six payoffs. Build first.",
  },
  {
    Icon: TrendingUp,
    name: "Scrape & Synthesise Spine",
    powers: "Powers #1, #4, #13, #14, #16",
    desc: "Scheduled scrape → synthesise → brief. Same architecture re-pointed at different sources.",
  },
  {
    Icon: MessageSquare,
    name: "Draft / Approve / Send",
    powers: "Powers #9, #19, #20, #22",
    desc: "Human-in-loop drafting across channels. The engine that frees Cathrine's 40 contracted hours.",
  },
  {
    Icon: Boxes,
    name: "Pipeline & PO Plumbing",
    powers: "Powers #10, #11, #21, #30",
    desc: "Event-triggered workflows — affiliate onboarding, invoice filing, PO chasing.",
  },
];

// ── Status helpers ───────────────────────────────────────────
function statusIcon(s: Status, accent: string) {
  if (s === "done") return <CircleCheck size={18} style={{ color: C.green }} />;
  if (s === "active")
    return <CircleDashed size={18} style={{ color: accent }} className="bvn-spin-slow" />;
  return <Circle size={18} style={{ color: C.muted }} />;
}

export default function HypersonicMilestones() {
  notFound();
  const [open, setOpen] = useState<string>("Phase 0");

  const { pct, done, total } = useMemo(() => {
    const all = phases.flatMap((p) => p.items);
    const score = all.reduce((a, i) => a + (i.status === "done" ? 1 : i.status === "active" ? 0.5 : 0), 0);
    return {
      pct: Math.round((score / all.length) * 100),
      done: all.filter((i) => i.status === "done").length,
      total: all.length,
    };
  }, []);

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`
        .bvn-spin-slow { animation: bvnspin 2.2s linear infinite; }
        @keyframes bvnspin { to { transform: rotate(360deg); } }
        .bvn-pulse { animation: bvnpulse 1.8s ease-in-out infinite; }
        @keyframes bvnpulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
      `}</style>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 80px" }}>
        {/* Back */}
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}
        >
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.cyan, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase" }}>
            <span className="bvn-pulse" style={{ width: 8, height: 8, borderRadius: 99, background: C.cyan, display: "inline-block" }} />
            BVN · Client Build Workspace
          </div>
          <h1 style={{ fontSize: 32, lineHeight: 1.15, margin: "12px 0 6px", fontWeight: 800 }}>
            Hypersonic Wholesale — Automation Build
          </h1>
          <p style={{ color: C.sub, fontSize: 15, maxWidth: 680, margin: 0 }}>
            The phased roadmap for automating Riverside Pet and 90 Day Amazon Freedom — a real-time view of where the build
            stands, what we tackle on day one, and the verdicts on the parts you flagged as risky. Managed end to end, so you
            stop being the bottleneck.
          </p>
        </div>

        {/* Status + progress */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 22 }}>
          <div style={{ flex: "1 1 260px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ color: C.sub, fontSize: 13 }}>Overall build</span>
              <span style={{ fontSize: 22, fontWeight: 800 }}>{pct}%</span>
            </div>
            <div style={{ height: 9, background: C.bg2, borderRadius: 99, marginTop: 10, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`, borderRadius: 99, transition: "width .6s ease" }} />
            </div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>
              {done} of {total} items complete · status: <span style={{ color: C.amber }}>Proposal stage — awaiting kickoff</span>
            </div>
          </div>

          <div style={{ flex: "1 1 200px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ color: C.sub, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <PoundSterling size={15} /> Commercial model
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8, lineHeight: 1.5 }}>
              {SCOPE_FEE} scoping sprint, then fixed quotes per phase
            </div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>
              Phases 1–4 priced after Phase 0 · ongoing managed care from {RETAINER_FROM}
            </div>
          </div>

          <div style={{ flex: "1 1 200px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ color: C.sub, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={15} /> Last updated
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>{LAST_UPDATED}</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>Updated as each checklist item moves</div>
          </div>
        </div>

        {/* Day One */}
        <Section title="Day one — what happens the moment we start" Icon={Rocket} accent={C.blue}>
          <div style={{ display: "grid", gap: 10 }}>
            {dayOne.map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px" }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 99, background: C.cardHi, color: C.cyan, fontSize: 12, fontWeight: 800, display: "grid", placeItems: "center" }}>{i + 1}</span>
                <span style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{d}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Phases */}
        <Section title="The phased roadmap" Icon={ListChecks} accent={C.cyan}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16 }}>
            Sequenced by dependency, following Adam&apos;s own build order: foundation first, the two highest-ROI engines in
            parallel, cheap mechanical wins for fast confidence, then the voice-powered and assist layers.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {phases.map((p) => {
              const isOpen = open === p.code;
              const pDone = p.items.filter((i) => i.status === "done").length;
              return (
                <div key={p.code} style={{ background: C.card, border: `1px solid ${isOpen ? p.accent + "66" : C.border}`, borderRadius: 16, overflow: "hidden" }}>
                  <button
                    onClick={() => setOpen(isOpen ? "" : p.code)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", color: C.ink }}
                  >
                    <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: p.accent + "1F", display: "grid", placeItems: "center" }}>
                      <p.Icon size={20} style={{ color: p.accent }} />
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: p.accent }}>{p.code}</span>
                      </span>
                      <span style={{ display: "block", fontSize: 16, fontWeight: 700, marginTop: 2 }}>{p.name}</span>
                    </span>
                    <span style={{ flexShrink: 0, fontSize: 12, color: C.muted, marginRight: 4 }}>{pDone}/{p.items.length}</span>
                    <ChevronDown size={18} style={{ color: C.sub, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                        <div style={{ padding: "0 18px 18px" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", padding: "12px 14px", background: C.bg2, borderRadius: 12, marginBottom: 14, border: `1px solid ${C.border}` }}>
                            <span style={{ fontSize: 12, color: C.amber, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                              <PoundSterling size={13} /> {p.billing}
                            </span>
                            <span style={{ width: 1, height: 14, background: C.border }} />
                            <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{p.objective}</span>
                          </div>
                          <div style={{ display: "grid", gap: 8 }}>
                            {p.items.map((it, idx) => (
                              <div key={idx} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "8px 4px" }}>
                                <span style={{ flexShrink: 0, marginTop: 1 }}>{statusIcon(it.status, p.accent)}</span>
                                <span style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>
                                  {it.label}
                                  {it.ref && <span style={{ color: C.muted, fontSize: 12, marginLeft: 6 }}>{it.ref}</span>}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Communications approach — OPEN decision */}
        <Section title="Communications approach" Icon={MessageSquare} accent={C.purple}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: C.green, background: C.green + "1A", padding: "4px 10px", borderRadius: 99 }}>
              <CircleCheck size={13} /> Decided — WhatsApp for now
            </div>
            <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.6, marginTop: 14, marginBottom: 12 }}>
              <strong>WhatsApp, draft-then-approve</strong> is the routing for now, inbound and outbound: AI writes the message
              in Adam&apos;s voice, the VA or setter sends with one tap. Inbound 1:1 support stays on the channel the customer chose.
            </p>
            <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0 }}>
              GHL SMS / email stays on the table as a later optimisation. The GoHighLevel audit will flag where structured
              <em> outbound</em> sequences (affiliate nurture, reminders, flash-sale alerts) could move once we see what
              you&apos;re already paying for, but nothing changes channel until you decide it should.
            </p>
          </div>
        </Section>

        {/* Feasibility verdicts */}
        <Section title="Verdicts on the parts you flagged as risky" Icon={ShieldCheck} accent={C.green}>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {feasibility.map((f, i) => {
              const col = f.status === "green" ? C.green : f.status === "amber" ? C.amber : C.red;
              const VI = f.status === "green" ? CircleCheck : TriangleAlert;
              return (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
                  <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <VI size={18} style={{ color: col, flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>{f.q}</span>
                  </div>
                  <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, margin: "10px 0 0" }}>{f.verdict}</p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Engines */}
        <Section title="Why this scales: 32 tasks are really 4 engines" Icon={Workflow} accent={C.cyan}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16 }}>
            The list reads as 32 separate jobs. Built right, around 20 of them are powered by four reusable cores. Build the
            core once and the dependent items get cheap — that is what keeps the cost down and the build fast.
          </p>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {engines.map((e, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
                <span style={{ width: 38, height: 38, borderRadius: 11, background: C.cyan + "1A", display: "grid", placeItems: "center" }}>
                  <e.Icon size={19} style={{ color: C.cyan }} />
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 12 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: C.cyan, fontWeight: 600, marginTop: 3 }}>{e.powers}</div>
                <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, margin: "8px 0 0" }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 44, paddingTop: 24, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 13, color: C.muted }}>Automation & Operations · BVN</div>
          </div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <a href="mailto:bvnyson@gmail.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Mail size={15} /> bvnyson@gmail.com
            </a>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Megaphone size={15} /> bvnofficial.com
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Section wrapper ──────────────────────────────────────────
function Section({ title, Icon, accent, children }: { title: string; Icon: typeof Search; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 38 }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, fontWeight: 800, margin: "0 0 14px" }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: accent + "1A", display: "grid", placeItems: "center" }}>
          <Icon size={17} style={{ color: accent }} />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
