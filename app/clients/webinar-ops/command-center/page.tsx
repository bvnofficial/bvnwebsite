"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Presentation, ClipboardList, MailCheck, BellRing,
  Radio, UserCheck, UserX, PlayCircle, Trophy, GitBranch, Terminal,
  FileText, LayoutDashboard, Users, Percent, CheckCircle2, Clock,
  PhoneCall, Sparkles, BarChart3,
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
// 1. Webinar sequence (interactive, answers Q2)
type Step = { Icon: typeof Presentation; title: string; trigger: string; detail: string; color: string; branch?: string };
const STEPS: Step[] = [
  { Icon: Presentation, title: "Registration page", trigger: "Visitor lands", color: C.coral,
    detail: "A GHL funnel page with one clear offer and a single form, built for conversion and mobile first. This is the top of the show rate, so it earns attention fast." },
  { Icon: ClipboardList, title: "Register and tag", trigger: "Form submitted", color: C.blue,
    detail: "Contact created instantly, tagged by source and by which webinar, and enrolled in the webinar workflow. Speed to enrol is what keeps the reminder timing accurate." },
  { Icon: MailCheck, title: "Confirmation", trigger: "Fires on registration", color: C.cyan,
    detail: "Email and SMS with the one click join link and a calendar invite, so the webinar lands in their calendar, not just their inbox where it is forgotten." },
  { Icon: BellRing, title: "Reminder sequence", trigger: "24h, 1h, 15m before", color: C.amber,
    detail: "Email and SMS at each mark, each carrying the join link. This sequence is where show rate is actually won or lost, so it is tuned per audience." },
  { Icon: Radio, title: "Live", trigger: "Event time", color: C.rose,
    detail: "Attendance and engagement synced from Zoom Webinar or WebinarJam back into GHL, so the very next step knows exactly who showed and who did not." },
  { Icon: UserCheck, title: "Attended follow up", trigger: "Branch: attended", color: C.green, branch: "Attended",
    detail: "Replay link, the offer, and a booking link, then a short nurture. Hot attendees who clicked the offer trigger a sales notification so nobody cools off." },
  { Icon: UserX, title: "No show re engagement", trigger: "Branch: no show", color: C.purple, branch: "No show",
    detail: "A sorry we missed you message with the replay and a one tap way to grab the next session. No registrant is wasted just because the timing did not work." },
  { Icon: Trophy, title: "Booked or converted", trigger: "Books or buys", color: C.coral,
    detail: "Pipeline moves, tags update, and reporting counts it. The loop closes automatically, with nobody re keying a thing between the webinar and the CRM." },
];

function WebinarSequence() {
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
                flexShrink: 0, width: 132, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <st.Icon size={16} color={st.color} />
              <div style={{ fontSize: 12, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 6, lineHeight: 1.25 }}>{st.title}</div>
              {st.branch && <div style={{ fontSize: 9.5, fontWeight: 800, color: st.color, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.4 }}>{st.branch}</div>}
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
                <GitBranch size={12} /> {s.trigger}
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
// 2. Performance dashboard (interactive, answers reporting)
type Ev = "this" | "last";
const EVENTS: Record<Ev, { registered: number; showed: number; showRate: number; replays: number; booked: number; conv: number; funnel: { label: string; value: number; color: string }[] }> = {
  this: {
    registered: 312, showed: 174, showRate: 56, replays: 88, booked: 21, conv: 12,
    funnel: [
      { label: "Registered", value: 312, color: C.blue },
      { label: "Reminded and confirmed", value: 298, color: C.cyan },
      { label: "Showed up", value: 174, color: C.amber },
      { label: "Stayed past 30 min", value: 121, color: C.purple },
      { label: "Booked a call", value: 21, color: C.green },
    ],
  },
  last: {
    registered: 268, showed: 141, showRate: 53, replays: 74, booked: 16, conv: 11,
    funnel: [
      { label: "Registered", value: 268, color: C.blue },
      { label: "Reminded and confirmed", value: 254, color: C.cyan },
      { label: "Showed up", value: 141, color: C.amber },
      { label: "Stayed past 30 min", value: 96, color: C.purple },
      { label: "Booked a call", value: 16, color: C.green },
    ],
  },
};

function Dashboard() {
  const [ev, setEv] = useState<Ev>("this");
  const d = EVENTS[ev];
  const max = d.funnel[0].value;
  const kpis = [
    { label: "Registered", value: d.registered, suffix: "", Icon: Users, color: C.blue },
    { label: "Showed up", value: d.showed, suffix: "", Icon: UserCheck, color: C.amber },
    { label: "Show rate", value: d.showRate, suffix: "%", Icon: Percent, color: C.purple },
    { label: "Replays watched", value: d.replays, suffix: "", Icon: PlayCircle, color: C.cyan },
    { label: "Booked calls", value: d.booked, suffix: "", Icon: Trophy, color: C.green },
  ];

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px 20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <BarChart3 size={18} color={C.coral} />
        <span style={{ fontSize: 14, fontWeight: 800 }}>Weekly webinar performance</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: 4 }}>
          {(["this", "last"] as Ev[]).map((w) => (
            <button
              key={w}
              onClick={() => setEv(w)}
              style={{ fontSize: 12, fontWeight: 700, cursor: "pointer", borderRadius: 999, padding: "5px 12px", border: "none", color: ev === w ? C.bg : C.sub, background: ev === w ? C.coral : "transparent" }}
            >
              {w === "this" ? "This week" : "Last week"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 20 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}>
            <k.Icon size={15} color={k.color} />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${ev}-${k.label}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                style={{ fontSize: 23, fontWeight: 800, color: C.ink, marginTop: 7 }}
              >
                {k.value}{k.suffix}
              </motion.div>
            </AnimatePresence>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 800, color: C.sub, marginBottom: 10 }}>Registration to booked, the funnel</div>
      <div style={{ display: "grid", gap: 9 }}>
        {d.funnel.map((f) => (
          <div key={f.label} style={{ display: "grid", gridTemplateColumns: "170px 1fr 44px", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12.5, color: C.sub }}>{f.label}</span>
            <div style={{ height: 12, background: C.card, borderRadius: 999, overflow: "hidden" }}>
              <motion.div
                key={`${ev}-${f.label}`}
                initial={{ width: 0 }}
                animate={{ width: `${(f.value / max) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ height: "100%", background: f.color, borderRadius: 999 }}
              />
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, textAlign: "right" }}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Built with Claude Code
const AI_BUILDS = [
  { Icon: LayoutDashboard, title: "Dashboards", body: "Live reporting dashboards like the one above, built with Claude Code, no developer in the loop. Data in, decisions out.", color: C.coral },
  { Icon: FileText, title: "SOPs and trackers", body: "Internal SOPs, trackers, and one page maps generated and refined with AI, so the process is documented as it is built.", color: C.cyan },
  { Icon: Terminal, title: "Internal tools", body: "This whole page is an AI built internal tool. I run a GHL command line and Python builders through Claude Code to spin up real systems fast.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
export default function WebinarCommandCenter() {
  const heroStats = useMemo(
    () => [
      { k: "GHL since", v: "2019" },
      { k: "Webinar sequence", v: "end to end" },
      { k: "Built with", v: "Claude Code" },
      { k: "Runs on", v: "one person" },
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
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.purple }}>
            <Presentation size={15} /> Webinar operations, and this page is built with Claude Code
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            I live inside GHL.
            <span style={{ color: C.coral }}> Here is a webinar engine to prove it.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 680, lineHeight: 1.6 }}>
            You asked three things: my hardest automation, how I would run a full webinar sequence, and something
            I built with AI. This page is the last one, built with Claude Code, and it shows the second. Click
            through the whole webinar flow, including the branch where a no show is treated differently to an attendee.
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

        <Section eyebrow="The webinar sequence" title="Registration to re engagement, click each step" sub="The full sequence I would build in GHL, from the registration page to post event follow up, with attendance synced from Zoom or WebinarJam. Tap any step to see its trigger and what fires.">
          <WebinarSequence />
        </Section>

        <Section eyebrow="The branch" title="An attendee and a no show are not the same person" sub="This is the fork most drip sequences miss. After the live event, the workflow reads attendance and sends two very different journeys.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.green}`, borderRadius: 14, padding: "18px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                <UserCheck size={18} color={C.green} />
                <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>Attended</span>
              </div>
              <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>Replay, the offer, a booking link, and a short nurture. Clicked the offer but did not book? A sales alert fires while they are still warm.</p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.purple}`, borderRadius: 14, padding: "18px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                <UserX size={18} color={C.purple} />
                <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>No show</span>
              </div>
              <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>Sorry we missed you, here is the replay, and one tap to grab the next session. A missed webinar becomes a second chance, not a dead lead.</p>
            </div>
          </div>
        </Section>

        <Section eyebrow="The numbers" title="What the data says, not just what it is" sub="I do not hand over a raw report. Registration and show rates, replays, and the funnel from registered to booked, with the story it tells. Toggle the week.">
          <Dashboard />
        </Section>

        <Section eyebrow="Built with AI" title="This page answers your third question" sub="You wanted to see something I built with AI. You are looking at it. I build dashboards, trackers, SOPs, and internal tools with Claude and Claude Code, output that actually runs.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {AI_BUILDS.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${a.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <a.Icon size={18} color={a.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{a.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{a.body}</p>
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
            <Sparkles size={18} color={C.coral} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I built this page, the webinar logic it shows, and the client systems behind it with my own hands,
            using Claude Code the way you want your hire to. One person who lives inside GHL, owns the function,
            and flags the broken automation before anyone has to ask.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps your hours daily</span>
        </div>
      </div>
    </div>
  );
}
