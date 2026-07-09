"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Home, Globe, DoorOpen, Hammer, Users, Hash,
  Bell, Zap, Workflow, Database, MessagesSquare, Palette, MapPin, Target,
  Share2, Terminal, CheckCircle2, Clock, PhoneCall,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.blue }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. Lead routing action plans (interactive)
type Lead = { Icon: typeof Home; title: string; tag: string; detail: string; color: string };
const LEADS: Lead[] = [
  { Icon: Globe, title: "New online leads", tag: "Form or portal", color: C.cyan,
    detail: "The lead lands in the CRM, is tagged by source and stage, routed to the right agent by round robin or area, and gets an instant speed to lead text and email while a Slack alert fires so the agent knows in seconds." },
  { Icon: DoorOpen, title: "Open house leads", tag: "Sign in", color: C.amber,
    detail: "Open house sign ins flow straight into the CRM tagged to that property, kick off a same day thank you and follow up sequence, and drop into a nurture plan so the visit does not go cold." },
  { Icon: Hammer, title: "New construction leads", tag: "Builder or campaign", color: C.coral,
    detail: "New construction enquiries route to the right specialist, are tagged by community or builder, and start a longer nurture matched to a slower buying cycle, with the agent prompted at each step." },
  { Icon: Users, title: "Past clients and sphere", tag: "Recurring", color: C.green,
    detail: "Your database is kept warm on autopilot: anniversary and check in touches, market updates, and referral asks, so past clients and sphere keep generating repeat and referral business without manual effort." },
];

function LeadRouting() {
  const [i, setI] = useState(0);
  const l = LEADS[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {LEADS.map((ld, idx) => {
          const on = idx === i;
          return (
            <button
              key={ld.title}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 150, textAlign: "left", cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? ld.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <ld.Icon size={16} color={ld.color} />
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 7, lineHeight: 1.25 }}>{ld.title}</div>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={l.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${l.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${l.color}` }}>
              <l.Icon size={20} color={l.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{l.title}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: l.color, marginTop: 2 }}>
                <Zap size={12} /> {l.tag}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{l.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Slack setup
const SLACK = [
  { Icon: Hash, title: "Channels", body: "A clean channel structure by team, listing, and function, so conversations have a home instead of scattering across DMs.", color: C.purple },
  { Icon: Bell, title: "Notifications", body: "The right alerts to the right people, tuned so the team sees what matters and is not drowned in noise.", color: C.amber },
  { Icon: Zap, title: "CRM and automation alerts", body: "New lead, stage change, and task alerts pushed from the CRM into Slack in real time, so speed to lead actually happens.", color: C.cyan },
];

// ─────────────────────────────────────────────────────────────
// 3. Zapier integration map
const INTEGRATIONS = [
  { Icon: Workflow, title: "Zapier at the center", body: "Multi step Zaps with filters and proper testing, the connective tissue that makes every tool talk to the next.", color: C.blue },
  { Icon: Database, title: "CRM", body: "Chime or GoHighLevel as the system of record, with lead routing, tags, stages, and custom fields set up clean.", color: C.coral },
  { Icon: MessagesSquare, title: "Slack and forms", body: "Forms feed the CRM, the CRM feeds Slack, so a new lead or submission becomes an alert and an action, not a missed email.", color: C.green },
  { Icon: Palette, title: "Canva and ChatGPT", body: "Connecting Canva, ChatGPT, and custom GPTs so content and data move between apps automatically rather than by copy and paste.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// 4. Geo-fencing handoff
const GEO = [
  { Icon: MapPin, title: "Location audiences", body: "Geo-fenced audiences built around neighborhoods, open houses, and events, so the marketing reaches people who were actually there.", color: C.cyan },
  { Icon: Target, title: "Pixels and tracking", body: "Pixel and conversion tracking set up correctly, so the audiences are clean and the results are measurable.", color: C.amber },
  { Icon: Share2, title: "Handoff to ad accounts", body: "The audiences, pixels, and setup handed off cleanly to the ad platforms and accounts that run the spend.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// 5. Proof (real CRM screenshots)
function ProofShot({ src, caption }: { src: string; caption: string }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      {err ? (
        <div style={{ height: 200, display: "grid", placeItems: "center", background: C.bg2, color: C.muted, fontSize: 12.5, textAlign: "center", padding: "0 20px" }}>
          Screenshot from a live CRM account
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
export default function RealEstateCrmAutomation() {
  const heroStats = useMemo(
    () => [
      { k: "CRM", v: "Chime · GoHighLevel" },
      { k: "Automation", v: "Zapier, multi step" },
      { k: "Alerts", v: "Real time in Slack" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.blue, background: "rgba(59,130,246,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.blue }}>
            <Home size={15} /> Real estate CRM and automation command center
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Every lead routed, alerted, and followed up,
            <span style={{ color: C.blue }}> without anyone chasing it.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            You want your CRM, Slack, and Zapier set up so your real estate systems run themselves. I have set up
            Chime and I build deep CRM automation, so instead of just listing that, I mapped your buildout: the
            lead action plans, the Slack alerts, the Zapier connections, and the geo-fencing handoff. Click through it.
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

        <Section eyebrow="Lead action plans" title="A plan for every kind of lead" sub="The four real estate scenarios from your post, each with its own routing, tags, and automation. Tap through them.">
          <LeadRouting />
        </Section>

        <Section eyebrow="Slack" title="The team alerted in real time" sub="Slack set up so the CRM speaks to the team the instant something happens, without the noise that makes people mute a channel.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {SLACK.map((s, i) => (
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

        <Section eyebrow="Zapier" title="Every tool talking to the next" sub="Multi step Zaps with filters and testing, so your apps communicate with one another instead of living in silos.">
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

        <Section eyebrow="Geo-fencing" title="Location advertising, set up and handed off" sub="I have experience with geo-fencing and location based advertising, so I can build the audiences and tracking and hand them cleanly to your ad accounts.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {GEO.map((g, i) => (
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

        <Section eyebrow="Proof" title="CRM automation I have already built" sub="Screenshots from a live account I built and run, the same lead routing and workflow automation this project needs.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <ProofShot src="/proof/regal-05-opportunities-kanban.png" caption="A lead pipeline with contacts routed stage by stage, the same shape as your real estate lead flow." />
            <ProofShot src="/proof/regal-02-family-workflows.png" caption="Published action plans firing automatically as a lead moves through the pipeline." />
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
            <Terminal size={18} color={C.blue} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Built with Claude Code, and BVN is just me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            This page I built with Claude Code. You get one person who sets up the CRM, wires the Zaps, configures
            Slack, tests that the data actually flows, and documents and trains your team so they can maintain it.
            I explain systems clearly to non technical users, which is half the job on a buildout like this.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.blue, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Project based, ongoing available</span>
        </div>
      </div>
    </div>
  );
}
