"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Mail, Webhook, Tag, Zap, Repeat, GitBranch,
  Trophy, UserX, RefreshCw, ShieldCheck, Landmark, Terminal,
  CheckCircle2, Clock, PhoneCall, Users, Send,
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
// 1. Lead lifecycle (interactive)
type Step = { Icon: typeof Mail; title: string; trigger: string; detail: string; color: string };
const STEPS: Step[] = [
  { Icon: Mail, title: "Cold email out", trigger: "Instantly", color: C.blue,
    detail: "Outreach fires from Instantly at volume. A reply or a click is the signal that a rural land buyer or their agent is worth pulling into the engine." },
  { Icon: Webhook, title: "Into GHL", trigger: "Inbound webhook", color: C.cyan,
    detail: "A positive reply webhooks straight into GoHighLevel, the contact is created, and the source is stamped on. Speed to lead starts the second they raise a hand." },
  { Icon: Tag, title: "Tag and segment", trigger: "On create", color: C.purple,
    detail: "Tagged by source, intent, and finance fit, buyer or agent, so the right sequence fires rather than a generic blast. Segmentation is what keeps a high volume list warm." },
  { Icon: Zap, title: "Speed to lead", trigger: "Within seconds", color: C.amber,
    detail: "An instant SMS and email with a booking link, while intent is hot. On a considered purchase like land, being first to respond is most of the battle." },
  { Icon: Repeat, title: "Multi step nurture", trigger: "Timed sequence", color: C.coral,
    detail: "A timed email and SMS sequence that keeps going until the lead acts, paced for a slower, higher value decision, with the financing angle carried through every touch." },
  { Icon: GitBranch, title: "Three clean exits", trigger: "Decision point", color: C.green,
    detail: "Every lead ends in exactly one of three states: converted, disqualified with a reason, or moved to long term nurture. Nothing sits in limbo. That is how a lead never hits a dead end." },
];

function Lifecycle() {
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
// 2. The three exits (no dead ends)
const EXITS = [
  { Icon: Trophy, title: "Converted", body: "Booked a call and moved to won. The whole engine exists to produce more of these, faster.", color: C.green },
  { Icon: UserX, title: "Disqualified", body: "Tagged out with a clear reason, so the list stays clean and reporting stays honest. A no is still an outcome.", color: C.rose },
  { Icon: RefreshCw, title: "Long term nurture", body: "Not ready yet, so recycled into a slow drip and revisited later. Never dropped, never forgotten.", color: C.amber },
];

// ─────────────────────────────────────────────────────────────
// 3. Lead flow monitor
const KPIS = [
  { label: "New leads, 7 days", value: "214", color: C.blue, Icon: Users },
  { label: "In nurture", value: "96", color: C.coral, Icon: Repeat },
  { label: "Booked", value: "31", color: C.cyan, Icon: PhoneCall },
  { label: "Converted", value: "12", color: C.green, Icon: Trophy },
  { label: "Disqualified", value: "41", color: C.rose, Icon: UserX },
];

// ─────────────────────────────────────────────────────────────
// 4. What I own
const OWN = [
  { Icon: GitBranch, title: "Workflows and pipelines", body: "Funnels, pipelines, and automations built end to end, so the direction you own in house becomes a clean, reliable build.", color: C.coral },
  { Icon: Tag, title: "Tagging and segmentation", body: "The lead lifecycle logic: every contact tagged, segmented, and nurtured until it converts or is disqualified.", color: C.cyan },
  { Icon: Send, title: "SMS and email sequences", body: "Multi step follow up that is built to convert and tuned as the data comes in, not set and forgotten.", color: C.purple },
  { Icon: Webhook, title: "Integrations and webhooks", body: "Instantly, third party tools, and data flowing in and out of GHL, with the webhook and API work native GHL cannot do alone.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
export default function LandFinanceLeadEngine() {
  const heroStats = useMemo(
    () => [
      { k: "GHL since", v: "2019" },
      { k: "Lead exits", v: "3, no dead ends" },
      { k: "Built with", v: "Claude Code" },
      { k: "Owned by", v: "one person" },
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.green }}>
            <Landmark size={15} /> Lead lifecycle engine for real estate land financing
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            High inbound volume is only an asset
            <span style={{ color: C.coral }}> if no lead hits a dead end.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 680, lineHeight: 1.6 }}>
            You own the offer, the messaging, and the lead psychology. My job is to turn that into clean, reliable
            GoHighLevel builds. Here is the lead lifecycle I would own for you, from an Instantly reply to one of
            three clean exits, with nothing left stuck in the middle. Click through it.
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

        <Section eyebrow="The lifecycle" title="From cold reply to a clean exit" sub="Every stage of the lead lifecycle, the way I would build it in GoHighLevel. Tap each step to see its trigger and what fires.">
          <Lifecycle />
        </Section>

        <Section eyebrow="No dead ends" title="Three exits, and only three" sub="This is the promise in your post made literal. Every lead ends in exactly one of these, and every one is tracked, so nothing goes quiet in a corner of the CRM.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {EXITS.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${e.color}`, borderRadius: 14, padding: "18px 18px" }}
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

        <Section eyebrow="The monitor" title="Lead flow at a glance" sub="I watch the flow, not just build it. A sample week below, with the one number that matters most on the right.">
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
              {KPIS.map((k) => (
                <div key={k.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 15px" }}>
                  <k.Icon size={15} color={k.color} />
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginTop: 7 }}>{k.value}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{k.label}</div>
                </div>
              ))}
              <div style={{ background: "rgba(52,211,153,0.08)", border: `1px solid ${C.green}`, borderRadius: 12, padding: "14px 15px" }}>
                <ShieldCheck size={15} color={C.green} />
                <div style={{ fontSize: 22, fontWeight: 800, color: C.green, marginTop: 7 }}>0</div>
                <div style={{ fontSize: 11.5, color: C.sub, marginTop: 2 }}>Stuck or dead ended</div>
              </div>
            </div>
          </div>
        </Section>

        <Section eyebrow="The role" title="What I would own" sub="A build and own role, exactly as you described it. The direction stays yours, the reliable technical build is mine.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {OWN.map((o, i) => (
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

        {/* Claude Code + one man line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Terminal size={18} color={C.coral} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Built with Claude Code, and BVN is just me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            You listed Claude Code as a nice to have. It is how I work every day, including this page. That means
            I move a step ahead, build fast, and document as I go. One person owns it end to end, thinks ahead,
            and closes the loop, which is exactly the high autonomy build and own role you described.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps US hours, in Slack daily</span>
        </div>
      </div>
    </div>
  );
}
