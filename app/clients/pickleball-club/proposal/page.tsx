"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Circle, Boxes, Plug, RefreshCw,
  MessageSquare, Megaphone, LayoutDashboard, Rocket, Trophy, PhoneCall,
  Clock, ShieldCheck, Database, Sparkles, Flag,
} from "lucide-react";

/* ── Clean light palette ─────────────────────────────────────── */
const C = {
  bg: "#FFFFFF",
  bg2: "#F6F8FB",
  card: "#FFFFFF",
  border: "#E6EAF1",
  borderHi: "#D6DCE7",
  ink: "#0F172A",
  sub: "#475569",
  muted: "#94A3B8",
  green: "#059669",
  greenSoft: "#ECFDF5",
  blue: "#2563EB",
  blueSoft: "#EFF6FF",
  amber: "#D97706",
  track: "#EDF1F7",
};

/* ── Milestone data ──────────────────────────────────────────── */
type Task = { id: string; label: string };
type Milestone = {
  id: string;
  Icon: typeof Boxes;
  title: string;
  goal: string;
  tasks: Task[];
};

const MILESTONES: Milestone[] = [
  {
    id: "m1",
    Icon: Boxes,
    title: "Foundation and setup",
    goal: "Stand up GoHighLevel cleanly and confirm exactly how it will talk to Pod Play before anything is built.",
    tasks: [
      { id: "m1-1", label: "Set up and brand the GoHighLevel account for One+" },
      { id: "m1-2", label: "Confirm Pod Play API access and what data is available" },
      { id: "m1-3", label: "Import existing members and contacts into GoHighLevel" },
      { id: "m1-4", label: "Map which fields sync between Pod Play and GoHighLevel" },
      { id: "m1-5", label: "Add custom fields for membership status, language, and source" },
      { id: "m1-6", label: "Connect a payment processor for GHL side billing and upsells" },
    ],
  },
  {
    id: "m2",
    Icon: RefreshCw,
    title: "Pod Play integration",
    goal: "Make Pod Play and GoHighLevel one connected system, so member and booking data flows automatically with no manual entry.",
    tasks: [
      { id: "m2-1", label: "Build the Pod Play to GoHighLevel connection (API or Make bridge)" },
      { id: "m2-2", label: "Sync new members from Pod Play into GoHighLevel automatically" },
      { id: "m2-3", label: "Sync bookings and cancellations onto each member record" },
      { id: "m2-4", label: "Tag members by membership type and activity level" },
      { id: "m2-5", label: "Test the full data flow end to end with real records" },
      { id: "m2-6", label: "Add a safety net so no record is missed if the sync pauses" },
    ],
  },
  {
    id: "m3",
    Icon: MessageSquare,
    title: "Communication and automation",
    goal: "Turn member data into revenue with automated, bilingual communication across the whole member lifecycle.",
    tasks: [
      { id: "m3-1", label: "Build the free intro class funnel and lead capture" },
      { id: "m3-2", label: "New member onboarding sequence over email and SMS" },
      { id: "m3-3", label: "Booking and class reminders to cut no shows" },
      { id: "m3-4", label: "Retention and at risk win back automations" },
      { id: "m3-5", label: "Automated review requests after sessions and lessons" },
      { id: "m3-6", label: "Duplicate all core flows in English and Spanish, tagged by language" },
    ],
  },
  {
    id: "m4",
    Icon: Megaphone,
    title: "Marketing and channels",
    goal: "Give One+ the full marketing engine and get every messaging channel compliant, connected, and tested.",
    tasks: [
      { id: "m4-1", label: "Landing pages and funnels for memberships and events" },
      { id: "m4-2", label: "Youth program and wellness enrollment forms and follow ups" },
      { id: "m4-3", label: "Sponsors pipeline and outreach flow" },
      { id: "m4-4", label: "Connect Facebook, Instagram, and Google Business Profile" },
      { id: "m4-5", label: "Complete A2P 10DLC registration and verification" },
      { id: "m4-6", label: "Configure and test SMS and WhatsApp messaging" },
    ],
  },
  {
    id: "m5",
    Icon: LayoutDashboard,
    title: "Central dashboard, training, and launch",
    goal: "Bring every number into one view, hand the system to the team, and go live with confidence.",
    tasks: [
      { id: "m5-1", label: "Build the central dashboard pulling Pod Play and GoHighLevel stats" },
      { id: "m5-2", label: "Set up pipelines and reporting for members, leads, and revenue" },
      { id: "m5-3", label: "Write plain language SOPs for every workflow" },
      { id: "m5-4", label: "Train the team and record walkthrough videos" },
      { id: "m5-5", label: "Full end to end testing across every channel" },
      { id: "m5-6", label: "Go live, monitor, then optimize" },
    ],
  },
];

const ALL_TASKS = MILESTONES.reduce((n, m) => n + m.tasks.length, 0);

/* ── Split: who does what ────────────────────────────────────── */
const PODPLAY = [
  "Court reservations and open play",
  "Digital scoreboards and instant replay",
  "DUPR score syncing",
  "Door access and on court hardware",
];
const GHL = [
  "Member CRM and one central record",
  "Email, SMS, and WhatsApp automation",
  "Retention, win back, and reviews",
  "Marketing funnels and reporting",
];

/* ── Page ────────────────────────────────────────────────────── */
export default function PickleballProposal() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setDone((p) => ({ ...p, [id]: !p[id] }));

  const completed = useMemo(
    () => Object.values(done).filter(Boolean).length,
    [done],
  );
  const overall = Math.round((completed / ALL_TASKS) * 100);

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "36px 22px 96px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30 }}>
          <a href="https://www.bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            <ArrowLeft size={15} /> BVN Official
          </a>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: C.green, background: C.greenSoft, border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 13px" }}>
            Client Proposal
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, color: C.green, textTransform: "uppercase", letterSpacing: 1.2 }}>
            <Trophy size={15} /> One+ Pickleball Club
          </div>
          <h1 style={{ fontSize: 39, fontWeight: 800, lineHeight: 1.1, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            One centralized system,
            <span style={{ color: C.green }}> without giving up what makes One+ special.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 720, lineHeight: 1.62, margin: 0 }}>
            You want everything centralized, built step by step. This is the plan to do exactly that by integrating
            GoHighLevel with Pod Play. Pod Play keeps running your courts, scoreboards, replay, and DUPR. GoHighLevel
            becomes the central brain for your members, communication, marketing, and reporting. The two work as one,
            rolled out in five clear milestones you can start and expand at your pace.
          </p>
        </motion.div>

        {/* Approach split */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: 34, display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 14, alignItems: "stretch" }}
        >
          <SplitCard title="Pod Play keeps" Icon={Database} accent={C.blue} soft={C.blueSoft} items={PODPLAY} />
          <div style={{ display: "grid", placeItems: "center" }}>
            <div style={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 999, background: C.greenSoft, border: `1px solid ${C.border}`, color: C.green }}>
              <Plug size={18} />
            </div>
          </div>
          <SplitCard title="GoHighLevel adds" Icon={Sparkles} accent={C.green} soft={C.greenSoft} items={GHL} />
        </motion.div>
        <p style={{ textAlign: "center", fontSize: 13, color: C.muted, marginTop: 12 }}>
          Centralized means one member record and one dashboard, while every system keeps doing what it does best.
        </p>

        {/* Progress tracker */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: 40, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
              <Flag size={17} color={C.green} />
              <span style={{ fontSize: 15, fontWeight: 800 }}>Project progress</span>
            </div>
            <div style={{ fontSize: 13, color: C.sub, fontWeight: 600 }}>
              <span style={{ color: C.green, fontWeight: 800 }}>{completed}</span> of {ALL_TASKS} tasks · {overall}%
            </div>
          </div>
          <Bar pct={overall} big />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginTop: 16 }}>
            {MILESTONES.map((m, i) => {
              const c = m.tasks.filter((t) => done[t.id]).length;
              const pct = Math.round((c / m.tasks.length) * 100);
              return (
                <div key={m.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.muted }}>Milestone {i + 1}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, margin: "3px 0 8px", lineHeight: 1.25 }}>{m.title}</div>
                  <Bar pct={pct} />
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Milestones */}
        {MILESTONES.map((m, i) => {
          const c = m.tasks.filter((t) => done[t.id]).length;
          const pct = Math.round((c / m.tasks.length) * 100);
          return (
            <motion.section
              key={m.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              style={{ marginTop: i === 0 ? 44 : 22 }}
            >
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "24px 24px", boxShadow: "0 1px 2px rgba(15,23,42,0.03)" }}>
                {/* header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 13, display: "grid", placeItems: "center", background: C.greenSoft, border: `1px solid ${C.border}`, color: C.green }}>
                    <m.Icon size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: C.green }}>
                      Milestone {i + 1}
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: "3px 0 6px", letterSpacing: -0.3 }}>{m.title}</h2>
                    <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.58, margin: 0 }}>{m.goal}</p>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right", minWidth: 66 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: pct === 100 ? C.green : C.ink }}>{pct}%</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{c}/{m.tasks.length}</div>
                  </div>
                </div>

                <div style={{ marginTop: 16, marginBottom: 6 }}><Bar pct={pct} /></div>

                {/* checklist */}
                <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                  {m.tasks.map((t) => {
                    const on = !!done[t.id];
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggle(t.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12, textAlign: "left", width: "100%",
                          cursor: "pointer", background: on ? C.greenSoft : C.bg2,
                          border: `1px solid ${on ? "#BBF7D0" : C.border}`, borderRadius: 11,
                          padding: "12px 14px", transition: "all 0.15s",
                        }}
                      >
                        {on ? <CheckCircle2 size={19} color={C.green} style={{ flexShrink: 0 }} />
                            : <Circle size={19} color={C.muted} style={{ flexShrink: 0 }} />}
                        <span style={{
                          fontSize: 14, fontWeight: 600, lineHeight: 1.4,
                          color: on ? C.muted : C.ink,
                          textDecoration: on ? "line-through" : "none",
                        }}>
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          );
        })}

        {/* What you get */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 40, background: C.greenSoft, border: `1px solid #BBF7D0`, borderRadius: 18, padding: "24px 24px" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <ShieldCheck size={18} color={C.green} />
            <span style={{ fontSize: 16, fontWeight: 800 }}>What you end up with</span>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0, maxWidth: 780 }}>
            One central place to see and run the club. Members, bookings, and revenue in a single dashboard. Every new
            lead nurtured automatically in English and Spanish. Pod Play still powering the courts your members love,
            now feeding a marketing engine that fills them. And a team that can run it all, because every workflow is
            documented and handed over.
          </p>
        </motion.div>

        {/* Next steps */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 36 }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: C.green }}>Next steps</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "8px 0 16px", letterSpacing: -0.4 }}>How we start</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              "A short call to confirm the milestone order and what you want first.",
              "Confirm Pod Play API access, which decides how clean the integration is.",
              "Lock the scope and begin Milestone 1, then expand at your pace.",
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 15px" }}>
                <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 999, display: "grid", placeItems: "center", background: C.green, color: "#fff", fontSize: 13, fontWeight: 800 }}>{i + 1}</div>
                <span style={{ fontSize: 14.5, color: C.ink, fontWeight: 600 }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22 }}>
            <a href="mailto:admin@onemorepickleballclub.com" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: "#fff", textDecoration: "none", background: C.green, borderRadius: 999, padding: "12px 20px" }}>
              <Rocket size={15} /> Start with Milestone 1
            </a>
            <Link href="/clients/pickleball-club/ghl-command-center" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: C.green, textDecoration: "none", background: C.greenSoft, border: `1px solid ${C.border}`, borderRadius: 999, padding: "12px 20px" }}>
              See the command center <ArrowRight size={15} />
            </Link>
          </div>
        </motion.section>

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 22, borderTop: `1px solid ${C.border}`, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <CheckCircle2 size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.borderHi }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.borderHi }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Remote contract</span>
        </div>
      </div>
    </div>
  );
}

/* ── Bits ────────────────────────────────────────────────────── */
function Bar({ pct, big }: { pct: number; big?: boolean }) {
  return (
    <div style={{ height: big ? 10 : 6, background: C.track, borderRadius: 999, overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ height: "100%", background: C.green, borderRadius: 999 }}
      />
    </div>
  );
}

function SplitCard({
  title, Icon, accent, soft, items,
}: {
  title: string; Icon: typeof Database; accent: string; soft: string; items: string[];
}) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", background: soft, color: accent, border: `1px solid ${C.border}` }}>
          <Icon size={17} />
        </div>
        <span style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{title}</span>
      </div>
      <div style={{ display: "grid", gap: 7 }}>
        {items.map((it) => (
          <div key={it} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: C.sub, lineHeight: 1.4 }}>
            <CheckCircle2 size={15} color={accent} style={{ flexShrink: 0, marginTop: 1 }} /> {it}
          </div>
        ))}
      </div>
    </div>
  );
}
