"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, CheckCircle2, Circle, RotateCcw, ChevronRight,
  Wrench, Zap, Car, Home, Rocket, GitBranch, Layout, ClipboardList, Workflow,
  Phone, Share2, Calendar, GraduationCap, Users, BookOpen, Copy, PlayCircle,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#08120E", bg2: "#0E1C16", card: "#122419", cardHi: "#173021",
  border: "#204234", ink: "#EAFBF1", sub: "#A7CBB8", muted: "#6C907C",
  green: "#34D399", teal: "#2DD4BF", lime: "#A3E635", sky: "#38BDF8",
  amber: "#FBBF24", violet: "#A78BFA", coral: "#FB7185", blue: "#60A5FA",
};

// ── Business types (the launch adapts per vertical) ───────────
type Biz = { id: string; label: string; Icon: typeof Wrench; color: string; };
const BIZ: Biz[] = [
  { id: "plumbing", label: "Plumbing", Icon: Wrench, color: C.sky },
  { id: "electrical", label: "Electrical", Icon: Zap, color: C.amber },
  { id: "autoglass", label: "Auto Glass", Icon: Car, color: C.violet },
  { id: "realestate", label: "Real Estate", Icon: Home, color: C.teal },
];

// ── The launch checklist, with a per-vertical accent line ─────
type Step = {
  id: string; label: string; Icon: typeof Layout; color: string; detail: string;
  perBiz: Record<string, string>;
};
const STEPS: Step[] = [
  { id: "snapshot", label: "Account & snapshot setup", Icon: Copy, color: C.green,
    detail: "Spin the new company up from a master snapshot so every launch starts consistent, then configure business info, users, and permissions.",
    perBiz: { plumbing: "Plumbing snapshot: emergency call handling baked in.", electrical: "Electrical snapshot: quote and permit stages ready.", autoglass: "Auto glass snapshot: insurance and mobile-vs-shop fields.", realestate: "Real estate snapshot: buyer and seller sides preset." } },
  { id: "pipelines", label: "Pipelines & stages", Icon: GitBranch, color: C.teal,
    detail: "Build the pipelines that match how this business actually sells, so the CRM reflects reality and nothing stalls in a vague stage.",
    perBiz: { plumbing: "New Call → Quoted → Scheduled → Job Done → Review.", electrical: "Lead → Estimate → Permit → Scheduled → Invoiced.", autoglass: "Claim Intake → Approved → Booked → Calibrated → Paid.", realestate: "New Lead → Nurture → Showing → Offer → Closed." } },
  { id: "funnels", label: "Funnels & landing pages", Icon: Layout, color: C.lime,
    detail: "Build the funnels and pages that turn traffic into booked jobs, matched to the offer so clicks actually convert.",
    perBiz: { plumbing: "Emergency booking funnel, click to call above the fold.", electrical: "Free estimate funnel with photo upload.", autoglass: "Instant quote funnel, insurance or cash path.", realestate: "Home valuation and buyer guide lead magnets." } },
  { id: "capture", label: "Forms & lead capture", Icon: ClipboardList, color: C.green,
    detail: "Forms and inbound routing that capture every lead cleanly, tag the source, and fire the follow-up instantly.",
    perBiz: { plumbing: "Service-area and job-type qualifying questions.", electrical: "Residential vs commercial routing.", autoglass: "VIN and glass-type capture for accurate quotes.", realestate: "Buyer, seller, or investor tagging on submit." } },
  { id: "automations", label: "Automations & follow-up", Icon: Workflow, color: C.teal,
    detail: "The workflows that do the chasing: missed-call text back, speed-to-lead sequences, review requests, and re-engagement.",
    perBiz: { plumbing: "Missed-call text back, on-call tech alerts.", electrical: "Quote follow-up until a yes or a no.", autoglass: "Appointment reminders, calibration confirmation.", realestate: "Long nurture, drips, ISA handoff." } },
  { id: "phone", label: "Phone system + A2P", Icon: Phone, color: C.sky,
    detail: "Provision numbers, set call routing and recording, and complete A2P 10DLC brand and campaign registration so SMS actually delivers.",
    perBiz: { plumbing: "After-hours routing to the on-call line.", electrical: "Office and field routing with voicemail drop.", autoglass: "Mobile tech dispatch numbers.", realestate: "Agent round-robin and tracking numbers." } },
  { id: "social", label: "Social + calendars", Icon: Share2, color: C.violet,
    detail: "Connect the social accounts for posting and inbound, and set the calendars so booking is self-service and double-booking is impossible.",
    perBiz: { plumbing: "Job-slot calendars per crew.", electrical: "Estimate vs install calendars.", autoglass: "Shop bays and mobile route calendars.", realestate: "Showing and open-house scheduling." } },
  { id: "train", label: "Train the team + SOPs", Icon: GraduationCap, color: C.amber,
    detail: "The part most implementers skip. I write the SOPs, record short walkthroughs, and train staff daily so the system gets used, not abandoned.",
    perBiz: { plumbing: "Dispatcher SOP for the call pipeline.", electrical: "Estimator SOP for quote follow-up.", autoglass: "Front-desk SOP for claim intake.", realestate: "Agent SOP for lead response time." } },
];

export default function GhlLaunch() {
  const [view, setView] = useState<"launch" | "scale" | "train">("launch");
  const [biz, setBiz] = useState<string>("plumbing");
  const [done, setDone] = useState<Set<string>>(new Set());
  const activeBiz = BIZ.find((b) => b.id === biz)!;

  const toggle = (id: string) => setDone((prev) => {
    const n = new Set(prev);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });
  const launchAll = () => setDone(new Set(STEPS.map((s) => s.id)));
  const reset = () => setDone(new Set());
  const pct = Math.round((done.size / STEPS.length) * 100);

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes grow{from{width:0}}`}</style>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.green, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.green, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · GoHighLevel Implementation
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            Launch a whole service business in GoHighLevel, start to finish
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 830, margin: 0, lineHeight: 1.65 }}>
            You spin up new service companies and need someone who can stand each one up in GoHighLevel and train the team
            to run it. That is a repeatable system, not a one off, so here is mine. Pick a business type and run the launch,
            see how the same system scales across many companies, and how I train your staff daily. I built this page with
            Claude Code, the way I work.
          </p>
        </div>

        {/* View switcher */}
        <div style={{ marginTop: 22, display: "flex", gap: 6, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {([
            { id: "launch", label: "Launch Playbook", Icon: Rocket },
            { id: "scale", label: "Across Many Companies", Icon: Copy },
            { id: "train", label: "Train the Team", Icon: GraduationCap },
          ] as const).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 9, border: "none", cursor: "pointer",
                background: view === v.id ? C.green : "transparent", color: view === v.id ? "#062012" : C.sub, fontSize: 12.5, fontWeight: 700 }}>
              <v.Icon size={14} /> {v.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ marginTop: 18 }}>

            {/* ── LAUNCH ─────────────────────────────────────────── */}
            {view === "launch" && (
              <div>
                {/* business selector */}
                <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Pick the business you are launching</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {BIZ.map((b) => {
                    const on = b.id === biz;
                    return (
                      <button key={b.id} onClick={() => setBiz(b.id)}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 10, cursor: "pointer",
                          background: on ? b.color + "22" : C.card, border: `1px solid ${on ? b.color : C.border}`, color: on ? C.ink : C.sub, fontSize: 13, fontWeight: 700 }}>
                        <b.Icon size={15} style={{ color: b.color }} /> {b.label}
                      </button>
                    );
                  })}
                </div>

                {/* progress + actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "13px 16px", marginBottom: 16 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                      <span style={{ color: C.sub }}>{activeBiz.label} launch progress</span>
                      <span style={{ color: C.green, fontWeight: 700, fontFamily: "ui-monospace, monospace" }}>{done.size}/{STEPS.length} · {pct}%</span>
                    </div>
                    <div style={{ height: 8, background: C.bg2, borderRadius: 6, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, ${C.teal})`, borderRadius: 6, transition: "width .3s" }} />
                    </div>
                  </div>
                  <button onClick={pct === 100 ? reset : launchAll}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: pct === 100 ? C.cardHi : C.green, color: pct === 100 ? C.ink : "#062012", fontSize: 12.5, fontWeight: 700 }}>
                    {pct === 100 ? <><RotateCcw size={14} /> Reset</> : <><Rocket size={14} /> Launch all</>}
                  </button>
                </div>

                {/* checklist */}
                <div style={{ display: "grid", gap: 8 }}>
                  {STEPS.map((s, i) => {
                    const isDone = done.has(s.id);
                    return (
                      <button key={s.id} onClick={() => toggle(s.id)}
                        style={{ textAlign: "left", display: "flex", gap: 13, alignItems: "flex-start", cursor: "pointer",
                          background: isDone ? C.cardHi : C.card, border: `1px solid ${isDone ? s.color + "66" : C.border}`, borderRadius: 13, padding: "13px 15px", transition: "all .2s" }}>
                        <span style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: isDone ? s.color + "22" : C.bg2, display: "grid", placeItems: "center" }}>
                          {isDone ? <CheckCircle2 size={19} style={{ color: s.color }} /> : <s.Icon size={17} style={{ color: C.muted }} />}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, color: C.muted, fontFamily: "ui-monospace, monospace" }}>{String(i + 1).padStart(2, "0")}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: isDone ? C.ink : C.sub }}>{s.label}</span>
                            {isDone && <CheckCircle2 size={13} style={{ color: s.color }} />}
                          </div>
                          <p style={{ fontSize: 12.5, color: C.sub, margin: "6px 0 0", lineHeight: 1.5 }}>{s.detail}</p>
                          <div style={{ fontSize: 11.5, color: activeBiz.color, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
                            <activeBiz.Icon size={12} /> {s.perBiz[biz]}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {pct === 100 && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", background: C.green + "12", border: `1px solid ${C.green}44`, borderRadius: 12, padding: "13px 16px", marginTop: 14 }}>
                    <CheckCircle2 size={18} style={{ color: C.green }} />
                    <span style={{ fontSize: 13.5, color: C.ink }}><b>{activeBiz.label} is live.</b> Snapshot to trained team, start to finish. The next company runs the same playbook, faster.</span>
                  </div>
                )}
              </div>
            )}

            {/* ── SCALE ──────────────────────────────────────────── */}
            {view === "scale" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  Launching one business is a project. Launching many without it turning into chaos is a system. I have run
                  a GoHighLevel agency account with 34 sub-accounts for trade services, so here is how the same setup scales
                  cleanly across every company you start.
                </p>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { Icon: Copy, t: "One master snapshot, many companies", d: "Each new business launches from a proven snapshot, so you get the same quality every time and a plumbing company stands up in hours, not weeks.", color: C.green },
                    { Icon: GitBranch, t: "Configure, do not rebuild", d: "Per-business differences (pipeline names, service areas, offers) are configuration on top of the snapshot, not a rebuild from scratch. That is how you get to company number ten.", color: C.teal },
                    { Icon: BookOpen, t: "Naming and version conventions", d: "Consistent naming for workflows, funnels, and tags across every sub-account, so anyone on the team can open any account and know where things are.", color: C.lime },
                    { Icon: Workflow, t: "Improve once, roll out everywhere", d: "When I improve a workflow or funnel, it goes back into the snapshot and forward into the next launches. Best practices compound instead of getting lost.", color: C.sky },
                    { Icon: Phone, t: "Phone and A2P per business", d: "Each company gets its own numbers, routing, and A2P 10DLC registration, managed centrally so compliance never blocks a launch.", color: C.violet },
                  ].map((x, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                      <span style={{ width: 32, height: 32, borderRadius: 9, background: x.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <x.Icon size={16} style={{ color: x.color }} />
                      </span>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{x.t}</div>
                        <p style={{ fontSize: 12.5, color: C.sub, margin: "3px 0 0", lineHeight: 1.5 }}>{x.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 16, background: C.bg2, border: `1px dashed ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                  <Users size={16} style={{ color: C.green }} />
                  <span style={{ fontSize: 12.5, color: C.sub, flex: "1 1 300px" }}>
                    Real proof: I built and run a GoHighLevel agency account with 34 sub-accounts for trade services, the exact multi-company pattern this role needs.
                  </span>
                  <Link href="/case-studies" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.green, fontSize: 12.5, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                    Case studies <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {/* ── TRAIN ──────────────────────────────────────────── */}
            {view === "train" && (
              <div>
                <p style={{ color: C.sub, fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
                  You asked for someone who trains your team daily, not just a builder who disappears. A system nobody knows
                  how to use gets abandoned. Here is how I make sure yours actually gets used.
                </p>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    { Icon: BookOpen, t: "SOP library", q: "Written once, used forever", d: "Every core process gets a short written SOP with screenshots, so a new hire can follow it without asking. Living docs, updated as the system changes.", color: C.green },
                    { Icon: PlayCircle, t: "Short screen recordings", q: "Show, do not just tell", d: "Two to five minute walkthroughs for each task, so the team can watch exactly how it is done on your real account, on their own time.", color: C.teal },
                    { Icon: GraduationCap, t: "Daily support and office hours", q: "There when they are stuck", d: "Daily availability to answer questions, unblock people, and correct habits early, so small confusions do not become expensive mistakes.", color: C.sky },
                    { Icon: Users, t: "Role-based onboarding", q: "The right training per seat", d: "A dispatcher, an estimator, and an owner need different things. Training is tailored to the role, not a one-size firehose.", color: C.violet },
                    { Icon: Rocket, t: "Onboard new staff fast", q: "Scales with your hiring", d: "As you add people and companies, the SOP library and recordings mean each new hire ramps quickly without pulling senior people off the work.", color: C.amber },
                  ].map((x, i) => (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                        <span style={{ width: 32, height: 32, borderRadius: 9, background: x.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <x.Icon size={16} style={{ color: x.color }} />
                        </span>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 800 }}>{x.t}</div>
                          <div style={{ fontSize: 11.5, color: x.color, fontWeight: 600, fontStyle: "italic" }}>{x.q}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 12.5, color: C.sub, margin: "10px 0 0", lineHeight: 1.55 }}>{x.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 42, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>GoHighLevel · multi-account launches · funnels · automations · phone + A2P · team training · BVN</div>
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
    </main>
  );
}
