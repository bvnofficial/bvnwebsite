"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronDown, CircleCheck, Circle, CircleDashed,
  Clock, Search, ListChecks, Mail, Megaphone, FolderTree,
  FileText, GraduationCap, Users, ShieldCheck, Repeat, Building2,
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

const DELIVERED = "Completed & handed over";

type Status = "done" | "active" | "todo";

type Item = { label: string; status: Status };
type Phase = {
  code: string;
  name: string;
  objective: string;
  Icon: typeof Search;
  accent: string;
  items: Item[];
};

// ── The milestone build (all delivered) ──────────────────────
const phases: Phase[] = [
  {
    code: "Milestone 1",
    name: "Discovery & Operational Map",
    objective:
      "Understand how the operation actually runs before building anything. Every plan that followed was based on reality, not an assumption.",
    Icon: Search,
    accent: C.cyan,
    items: [
      { label: "Interviewed every role owner and shadowed the daily workflow, so the plan reflected how the home really operated", status: "done" },
      { label: "Mapped the full operation: resident intake, care coordination, staffing, family communication, and compliance records", status: "done" },
      { label: "Documented where information was living only in people's heads and where things were slipping", status: "done" },
      { label: "Agreed the milestone plan and what a successful result looked like, together with the owner, before any build began", status: "done" },
      { label: "Reviewed the map together, adjusted it, and got a clear go before starting Milestone 2", status: "done" },
    ],
  },
  {
    code: "Milestone 2",
    name: "Google Workspace Foundation & SOP Library",
    objective:
      "Give the operation one organized home and a documented way of working, so the team runs the same way every time without relying on memory.",
    Icon: FolderTree,
    accent: C.blue,
    items: [
      { label: "Built the master Google Drive architecture: clear folder hierarchy, consistent naming, and permissions set by role", status: "done" },
      { label: "Migrated scattered files into the new structure and archived the old clutter so nothing important was one click from lost", status: "done" },
      { label: "Wrote the core SOP library in plain language: intake, daily care handover, family updates, incident reporting, compliance filing", status: "done" },
      { label: "Set one SOP template (purpose, owner, steps, common issues) so every process, now and in future, looks the same", status: "done" },
      { label: "Built a simple shared tracker so the team and owner could see status at a glance", status: "done" },
      { label: "Reviewed the foundation together, refined what did not fit, and signed off before Milestone 3", status: "done" },
    ],
  },
  {
    code: "Milestone 3",
    name: "Training & Handover",
    objective:
      "Make sure the people using the system every day are comfortable, and that nothing depends on me to keep working.",
    Icon: GraduationCap,
    accent: C.green,
    items: [
      { label: "Trained each role owner on their SOPs and on the new Drive structure", status: "done" },
      { label: "Ran a live walkthrough so the team used the system while I watched, rather than only reading about it", status: "done" },
      { label: "Recorded short screen walkthroughs so future staff can onboard themselves", status: "done" },
      { label: "Handed over full ownership: every process has a named owner and the operation runs without me", status: "done" },
      { label: "Final review and sign off with the owner, with the whole foundation in place", status: "done" },
    ],
  },
];

// ── How each milestone worked (the review loop) ──────────────
const loop: string[] = [
  "Build the milestone in full, end to end.",
  "Walk through it together, in detail, so the owner saw exactly what was built.",
  "Adjust anything that did not fit the reality of the operation.",
  "Only after a clear sign off did the next milestone begin.",
];

// ── What Regal walked away with ──────────────────────────────
type Deliverable = { Icon: typeof FileText; name: string; desc: string };
const deliverables: Deliverable[] = [
  {
    Icon: FolderTree,
    name: "One organized Google Drive",
    desc: "A single source of truth. Clear folders, consistent naming, and role based permissions the team can actually navigate.",
  },
  {
    Icon: FileText,
    name: "A living SOP library",
    desc: "Every core process documented in plain language, on one template, with a named owner and room to grow.",
  },
  {
    Icon: Building2,
    name: "Clear role structure",
    desc: "Who owns what, written down. No more guessing where a task sits or who to ask.",
  },
  {
    Icon: Users,
    name: "A team that runs it",
    desc: "Trained, comfortable, and independent. The foundation keeps working whether or not I am in the room.",
  },
];

// ── Status helper ────────────────────────────────────────────
function statusIcon(s: Status, accent: string) {
  if (s === "done") return <CircleCheck size={18} style={{ color: C.green }} />;
  if (s === "active")
    return <CircleDashed size={18} style={{ color: accent }} className="bvn-spin-slow" />;
  return <Circle size={18} style={{ color: C.muted }} />;
}

export default function RegalMilestoneExample() {
  const [open, setOpen] = useState<string>("Milestone 1");

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
          href="/clients/fb-legacy/implementation-roadmap"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}
        >
          <ArrowLeft size={15} /> Back to the roadmap
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.green, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase" }}>
            <span className="bvn-pulse" style={{ width: 8, height: 8, borderRadius: 99, background: C.green, display: "inline-block" }} />
            The milestone approach, in practice
          </div>
          <h1 style={{ fontSize: 32, lineHeight: 1.15, margin: "12px 0 6px", fontWeight: 800 }}>
            Regal Senior Living — Operational Foundation Build
          </h1>
          <p style={{ color: C.sub, fontSize: 15, maxWidth: 700, margin: 0 }}>
            A real example of how I run a project milestone by milestone. Regal&apos;s operation had grown faster than its
            structure, so we broke the work into three milestones. Each one was finished, reviewed together, and signed off
            before the next began. This is the same way I would build your foundation.
          </p>
        </div>

        {/* Status cards */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 22 }}>
          <div style={{ flex: "1 1 260px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ color: C.sub, fontSize: 13 }}>Overall build</span>
              <span style={{ fontSize: 22, fontWeight: 800 }}>{pct}%</span>
            </div>
            <div style={{ height: 9, background: C.bg2, borderRadius: 99, marginTop: 10, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`, borderRadius: 99, transition: "width .6s ease" }} />
            </div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>
              {done} of {total} items complete · status: <span style={{ color: C.green }}>{DELIVERED}</span>
            </div>
          </div>

          <div style={{ flex: "1 1 200px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ color: C.sub, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <Repeat size={15} /> How it ran
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8, lineHeight: 1.5 }}>
              Milestone by milestone
            </div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>
              Each phase reviewed and signed off before the next began
            </div>
          </div>

          <div style={{ flex: "1 1 200px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ color: C.sub, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={15} /> Outcome
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>Fully organized</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>Foundation running without me, owned by the team</div>
          </div>
        </div>

        {/* How each milestone worked */}
        <Section title="How each milestone worked" Icon={Repeat} accent={C.green}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16 }}>
            The same loop applied to every milestone. It is exactly the phase, review, adjust, continue approach, and it is why
            the foundation held.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {loop.map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px" }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 99, background: C.cardHi, color: C.green, fontSize: 12, fontWeight: 800, display: "grid", placeItems: "center" }}>{i + 1}</span>
                <span style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{d}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* The milestones */}
        <Section title="The three milestones" Icon={ListChecks} accent={C.cyan}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16 }}>
            Sequenced so each one set up the next: understand the operation, build the foundation, then hand it over so the team
            owns it. Open any milestone to see the full checklist.
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
                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", color: C.green, background: C.green + "1A", padding: "2px 8px", borderRadius: 99 }}>Signed off</span>
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
                            <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{p.objective}</span>
                          </div>
                          <div style={{ display: "grid", gap: 8 }}>
                            {p.items.map((it, idx) => (
                              <div key={idx} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "8px 4px" }}>
                                <span style={{ flexShrink: 0, marginTop: 1 }}>{statusIcon(it.status, p.accent)}</span>
                                <span style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{it.label}</span>
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

        {/* What Regal walked away with */}
        <Section title="What Regal walked away with" Icon={ShieldCheck} accent={C.blue}>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {deliverables.map((e, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
                <span style={{ width: 38, height: 38, borderRadius: 11, background: C.blue + "1A", display: "grid", placeItems: "center" }}>
                  <e.Icon size={19} style={{ color: C.blue }} />
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 12 }}>{e.name}</div>
                <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, margin: "8px 0 0" }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 44, paddingTop: 24, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 13, color: C.muted }}>Operations & Systems · BVN</div>
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
