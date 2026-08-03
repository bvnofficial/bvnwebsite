"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, LayoutGrid, ListTree, AlertTriangle, FileText,
  CheckCircle2, ChevronRight, Flag, TrendingUp, ClipboardList, Bot, GitBranch,
  Target, X,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  cyan: "#22D3EE", green: "#34D399", amber: "#FBBF24", coral: "#FB923C",
  purple: "#A78BFA", blue: "#3B82F6", red: "#F87171",
};

// ── Epics ─────────────────────────────────────────────────────
type EpicId = "report" | "docs" | "workflow" | "core";
const EPICS: Record<EpicId, { name: string; short: string; color: string }> = {
  report: { name: "AI-Assisted Report Production", short: "AI Reports", color: C.blue },
  docs: { name: "Intelligent Document Processing", short: "Doc Processing", color: C.green },
  workflow: { name: "Workflow Automation", short: "Workflow", color: C.amber },
  core: { name: "Booking & Case Management Core", short: "Core Platform", color: C.purple },
};

// ── Stories ───────────────────────────────────────────────────
type Status = "todo" | "inprogress" | "review" | "done" | "backlog";
type Story = { id: string; title: string; epic: EpicId; points: number; priority: "High" | "Medium" | "Low"; assignee: string; status: Status; ac: string[] };

const STORIES: Story[] = [
  { id: "MED-101", title: "Generate first-draft medicolegal report from case data via AI", epic: "report", points: 8, priority: "High", assignee: "AI", status: "inprogress",
    ac: ["Given a completed case, the system produces a structured draft report", "Draft maps every section to its source data with citations", "No draft is ever sent without human review"] },
  { id: "MED-102", title: "Report template library by report type", epic: "report", points: 5, priority: "Medium", assignee: "BE", status: "review",
    ac: ["Admins can create and version templates", "Each template defines required sections and fields", "AI drafts populate the selected template"] },
  { id: "MED-103", title: "Reviewer approval workflow for AI drafts", epic: "report", points: 5, priority: "High", assignee: "BE", status: "todo",
    ac: ["Draft routes to the assigned specialist for review", "Reviewer can edit, approve, or reject with notes", "Approved reports lock and are audit logged"] },
  { id: "MED-104", title: "Confidence scoring and human-in-loop flagging", epic: "report", points: 8, priority: "High", assignee: "AI", status: "backlog",
    ac: ["Each AI section returns a confidence score", "Low-confidence sections are flagged for mandatory review", "Thresholds are configurable by report type"] },
  { id: "MED-201", title: "OCR and field extraction from uploaded documents", epic: "docs", points: 8, priority: "High", assignee: "AI", status: "inprogress",
    ac: ["Uploaded PDFs and images are OCR processed", "Key fields (name, DOB, date of injury) are extracted", "Extraction confidence is shown to the operator"] },
  { id: "MED-202", title: "Auto-classify document type on upload", epic: "docs", points: 5, priority: "Medium", assignee: "AI", status: "done",
    ac: ["Documents are classified (referral, imaging, report, invoice)", "Misclassifications can be corrected in one click", "Classification feeds the case checklist"] },
  { id: "MED-203", title: "Flag missing documents per case", epic: "docs", points: 3, priority: "Medium", assignee: "BE", status: "todo",
    ac: ["Each case type defines a required-document checklist", "Missing items are surfaced on the case dashboard", "Operators are prompted before booking is confirmed"] },
  { id: "MED-301", title: "Automated booking confirmations and reminders", epic: "workflow", points: 5, priority: "High", assignee: "BE", status: "done",
    ac: ["Confirmation sends on booking via email and SMS", "Reminders send at 3 days and 1 day prior", "All comms are logged against the case"] },
  { id: "MED-302", title: "Case status-change triggers", epic: "workflow", points: 5, priority: "Medium", assignee: "BE", status: "inprogress",
    ac: ["Status changes fire the correct downstream actions", "Stakeholders are notified per a configurable matrix", "Every trigger is recorded in the audit trail"] },
  { id: "MED-303", title: "SLA breach escalations", epic: "workflow", points: 5, priority: "High", assignee: "BE", status: "backlog",
    ac: ["SLA timers run per case milestone", "Approaching breaches escalate to the case owner", "Breaches escalate to the delivery manager"] },
  { id: "MED-401", title: "Case dashboard redesign", epic: "core", points: 8, priority: "Medium", assignee: "UX", status: "review",
    ac: ["Operators see case status, docs and actions at a glance", "Dashboard passes accessibility review", "Layout validated with 5 operator usability tests"] },
  { id: "MED-402", title: "Role-based access for specialists and operators", epic: "core", points: 5, priority: "High", assignee: "BE", status: "todo",
    ac: ["Roles gate data and actions server side", "Specialists only see cases assigned to them", "Access changes are audit logged"] },
];

const COLUMNS: { id: Status; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "inprogress", label: "In Progress" },
  { id: "review", label: "In Review" },
  { id: "done", label: "Done" },
];
const prColor = (p: Story["priority"]) => (p === "High" ? C.red : p === "Medium" ? C.amber : C.muted);

// ── Risks & dependencies ──────────────────────────────────────
const risks = [
  { kind: "Risk", label: "AI report accuracy needs clinical sign-off", sev: "High", owner: "Product", note: "Mitigated by confidence scoring + mandatory human review (MED-104, MED-103)." },
  { kind: "Risk", label: "Regulated health data privacy and compliance", sev: "High", owner: "Product / Legal", note: "Data handling reviewed against Australian Privacy Principles before any AI processing." },
  { kind: "Dependency", label: "Doc processing depends on secure storage provisioning", sev: "Medium", owner: "Engineering", note: "Blocks MED-201; storage sign-off needed this sprint." },
  { kind: "Dependency", label: "Approval workflow needs the template library first", sev: "Medium", owner: "Backend", note: "MED-102 must land before MED-103 can start." },
];

// ── Component ──────────────────────────────────────────────────
export default function MedirectDeliveryBoard() {
  const [view, setView] = useState<"board" | "backlog" | "risks" | "status">("board");
  const [openId, setOpenId] = useState<string | null>(null);
  const story = STORIES.find((s) => s.id === openId) ?? null;

  const points = useMemo(() => {
    const active = STORIES.filter((s) => s.status !== "backlog");
    const total = active.reduce((a, s) => a + s.points, 0);
    const done = active.filter((s) => s.status === "done").reduce((a, s) => a + s.points, 0);
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, []);

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.blue, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.blue, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · MEDirect 2.0
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            How I would run MEDirect 2.0 delivery
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 740, margin: 0, lineHeight: 1.65 }}>
            The role is delivery coordination, documentation, and Jira. So rather than describe how I work, I set up a
            sample delivery board for MEDirect 2.0, structured exactly as I would in Jira and Confluence. Move through
            the board, backlog, risks, and status views, and click any ticket to see its acceptance criteria. A sample
            BRD sits at the bottom.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "board", label: "Sprint Board", Icon: LayoutGrid },
            { id: "backlog", label: "Backlog & Epics", Icon: ListTree },
            { id: "risks", label: "Risks & Dependencies", Icon: AlertTriangle },
            { id: "status", label: "Status Report", Icon: TrendingUp },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.blue : "transparent", color: view === v.id ? "#04102B" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* BOARD */}
            {view === "board" && (
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(190px, 1fr))", overflowX: "auto" }}>
                {COLUMNS.map((col) => {
                  const items = STORIES.filter((s) => s.status === col.id);
                  return (
                    <div key={col.id} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 10, minWidth: 190 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 4px 10px" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>{col.label}</span>
                        <span style={{ fontSize: 11, color: C.muted, background: C.card, borderRadius: 99, padding: "1px 8px" }}>{items.length}</span>
                      </div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {items.map((s) => {
                          const ep = EPICS[s.epic];
                          return (
                            <button key={s.id} onClick={() => setOpenId(s.id)}
                              style={{ textAlign: "left", cursor: "pointer", background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${ep.color}`, borderRadius: 9, padding: "10px 11px" }}>
                              <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.4, marginBottom: 8 }}>{s.title}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                <span style={{ fontFamily: "monospace", fontSize: 10, color: C.muted }}>{s.id}</span>
                                <span style={{ fontSize: 9.5, fontWeight: 700, color: ep.color, background: ep.color + "18", borderRadius: 5, padding: "1px 6px" }}>{ep.short}</span>
                                <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                  <Flag size={10} style={{ color: prColor(s.priority) }} />
                                  <span style={{ width: 18, height: 18, borderRadius: 5, background: C.cardHi, color: C.sub, fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center" }}>{s.points}</span>
                                </span>
                              </div>
                            </button>
                          );
                        })}
                        {items.length === 0 && <div style={{ fontSize: 11, color: C.muted, textAlign: "center", padding: "12px 0" }}>Empty</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* BACKLOG */}
            {view === "backlog" && (
              <div style={{ display: "grid", gap: 12 }}>
                {(Object.keys(EPICS) as EpicId[]).map((eid) => {
                  const ep = EPICS[eid];
                  const items = STORIES.filter((s) => s.epic === eid);
                  const tot = items.reduce((a, s) => a + s.points, 0);
                  const dn = items.filter((s) => s.status === "done").reduce((a, s) => a + s.points, 0);
                  return (
                    <div key={eid} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", borderBottom: `1px solid ${C.border}`, background: ep.color + "0E" }}>
                        <span style={{ width: 26, height: 26, borderRadius: 7, background: ep.color + "22", display: "grid", placeItems: "center" }}><GitBranch size={14} style={{ color: ep.color }} /></span>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{ep.name}</span>
                        <span style={{ marginLeft: "auto", fontSize: 11.5, color: C.muted }}>{dn}/{tot} pts</span>
                        <div style={{ width: 70, height: 6, background: C.bg2, borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${tot ? (dn / tot) * 100 : 0}%`, height: "100%", background: ep.color, borderRadius: 99 }} />
                        </div>
                      </div>
                      {items.map((s) => (
                        <button key={s.id} onClick={() => setOpenId(s.id)}
                          style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", cursor: "pointer", padding: "10px 16px", background: "transparent", border: "none", borderBottom: `1px solid ${C.border}` }}>
                          <span style={{ fontFamily: "monospace", fontSize: 10.5, color: C.muted, width: 62, flexShrink: 0 }}>{s.id}</span>
                          <span style={{ flex: 1, fontSize: 13, color: C.ink }}>{s.title}</span>
                          <StatusPill status={s.status} />
                          <span style={{ width: 20, height: 20, borderRadius: 5, background: C.cardHi, color: C.sub, fontSize: 10.5, fontWeight: 700, display: "grid", placeItems: "center", flexShrink: 0 }}>{s.points}</span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {/* RISKS */}
            {view === "risks" && (
              <div style={{ display: "grid", gap: 10 }}>
                {risks.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: (r.sev === "High" ? C.red : C.amber) + "18", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      {r.kind === "Risk" ? <AlertTriangle size={15} style={{ color: r.sev === "High" ? C.red : C.amber }} /> : <GitBranch size={15} style={{ color: C.amber }} />}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: r.kind === "Risk" ? C.red : C.amber, background: (r.kind === "Risk" ? C.red : C.amber) + "16", borderRadius: 5, padding: "2px 7px", textTransform: "uppercase", letterSpacing: .4 }}>{r.kind}</span>
                        <span style={{ fontSize: 13.5, fontWeight: 700 }}>{r.label}</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.5, margin: "0 0 6px" }}>{r.note}</p>
                      <div style={{ display: "flex", gap: 14, fontSize: 11.5, color: C.muted }}>
                        <span>Severity · <b style={{ color: r.sev === "High" ? C.red : C.amber }}>{r.sev}</b></span>
                        <span>Owner · <b style={{ color: C.sub }}>{r.owner}</b></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STATUS */}
            {view === "status" && (
              <div>
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", marginBottom: 14 }}>
                  {[
                    { k: "Sprint", v: "Sprint 7", c: C.blue },
                    { k: "Committed", v: `${points.total} pts`, c: C.purple },
                    { k: "Completed", v: `${points.done} pts`, c: C.green },
                    { k: "Progress", v: `${points.pct}%`, c: C.amber },
                  ].map((m, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: "14px 15px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .4, textTransform: "uppercase" }}>{m.k}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: m.c, marginTop: 6 }}>{m.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: .4, textTransform: "uppercase", marginBottom: 10 }}>Delivery summary · for co-founders and Head of Product</div>
                  {[
                    { t: "On track", d: "Doc classification and booking automation shipped. Report drafting and OCR in progress and tracking to sprint goal.", c: C.green },
                    { t: "Watching", d: "Secure storage sign-off is the critical path for document processing. Chased with Engineering, needed this sprint.", c: C.amber },
                    { t: "Needs a decision", d: "Confidence-score thresholds for mandatory human review. Booked into Thursday's product session with clinical input.", c: C.coral },
                  ].map((x, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderTop: i ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ width: 9, height: 9, borderRadius: 99, background: x.c, marginTop: 5, flexShrink: 0 }} />
                      <div><span style={{ fontSize: 13, fontWeight: 700, color: x.c }}>{x.t}. </span><span style={{ fontSize: 13, color: C.sub, lineHeight: 1.55 }}>{x.d}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Sample BRD */}
        <Section title="Sample BRD · AI-Assisted Report Production" Icon={FileText} accent={C.blue}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px" }}>
            {[
              { h: "Objective", b: "Cut report turnaround time by producing an accurate first-draft medicolegal report from structured case data, with a specialist always reviewing and approving before release." },
              { h: "In scope", b: "AI draft generation, template library, reviewer approval workflow, confidence scoring, full audit trail." },
              { h: "Out of scope", b: "Auto-sending any report without human approval. Clinical decision making. Billing changes." },
              { h: "Primary users", b: "Medical specialists (review and approve), operations team (manage cases and templates)." },
              { h: "Success metrics", b: "Draft-to-approved time reduced, reviewer edit volume trending down over time, zero reports released without sign-off." },
            ].map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 12, padding: "9px 0", borderTop: i ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.blue }}>{s.h}</span>
                <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.55 }}>{s.b}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: C.green }}><ClipboardList size={13} /> Linked epic: AI-Assisted Report Production</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: C.sub }}><Target size={13} /> 4 stories · 26 points</span>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 42, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>Delivery Coordination · Jira & Confluence · BA Support · BVN</div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="mailto:bvn@bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Mail size={14} /> bvn@bvnofficial.com
            </a>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Megaphone size={14} /> bvnofficial.com
            </Link>
          </div>
        </div>
      </div>

      {/* Ticket detail modal */}
      <AnimatePresence>
        {story && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenId(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(4,10,26,0.72)", display: "grid", placeItems: "center", padding: 20, zIndex: 50 }}>
            <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 480, background: C.card, border: `1px solid ${EPICS[story.epic].color}55`, borderRadius: 18, overflow: "hidden" }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: C.muted }}>{story.id}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: EPICS[story.epic].color, background: EPICS[story.epic].color + "18", borderRadius: 5, padding: "2px 7px" }}>{EPICS[story.epic].short}</span>
                    <StatusPill status={story.status} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.35 }}>{story.title}</div>
                </div>
                <button onClick={() => setOpenId(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}><X size={18} /></button>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                  <Meta k="Priority" v={story.priority} c={prColor(story.priority)} />
                  <Meta k="Story points" v={String(story.points)} c={C.sub} />
                  <Meta k="Assignee" v={story.assignee} c={C.sub} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8 }}>Acceptance criteria</div>
                <div style={{ display: "grid", gap: 7 }}>
                  {story.ac.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 12px" }}>
                      <CheckCircle2 size={14} style={{ color: EPICS[story.epic].color, flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ── Small pieces ─────────────────────────────────────────────
function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { label: string; color: string }> = {
    backlog: { label: "Backlog", color: C.muted },
    todo: { label: "To Do", color: C.sub },
    inprogress: { label: "In Progress", color: C.blue },
    review: { label: "In Review", color: C.amber },
    done: { label: "Done", color: C.green },
  };
  const m = map[status];
  return <span style={{ fontSize: 10, fontWeight: 700, color: m.color, background: m.color + "18", border: `1px solid ${m.color}3A`, borderRadius: 5, padding: "2px 8px", whiteSpace: "nowrap" }}>{m.label}</span>;
}
function Meta({ k, v, c }: { k: string; v: string; c: string }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: C.muted, textTransform: "uppercase", letterSpacing: .4, marginBottom: 3 }}>{k}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</div>
    </div>
  );
}
function Section({ title, Icon, accent, children }: { title: string; Icon: typeof FileText; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 40 }}>
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
