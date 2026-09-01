"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Filter, FormInput, Calendar, GitBranch,
  PhoneMissed, MessageSquare, Mail, Repeat, Users, BarChart3, Target,
  Megaphone, Share2, Sparkles, CheckCircle2, Clock, PhoneCall, Tag,
  ShieldCheck, Zap, Workflow, LayoutDashboard, Star,
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

const ACCENT = C.cyan;

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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: ACCENT }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. What lives in the GHL account
const STACK = [
  { Icon: Filter, name: "Funnels and landing pages", role: "Built to convert, not just to look nice", color: C.coral },
  { Icon: FormInput, name: "Forms and surveys", role: "Lead capture wired to tags and pipelines", color: C.cyan },
  { Icon: Calendar, name: "Calendars and booking", role: "Round robin, reminders, no double books", color: C.blue },
  { Icon: GitBranch, name: "Pipelines and CRM", role: "Staged journeys, clean data, clear owners", color: C.green },
  { Icon: Workflow, name: "Workflows and automations", role: "SMS and email follow ups that fire on time", color: C.purple },
  { Icon: Megaphone, name: "Social Planner and campaigns", role: "Scheduled content and email and SMS blasts", color: C.amber },
  { Icon: LayoutDashboard, name: "Reporting and dashboards", role: "Lead flow, conversion, pipeline value", color: C.rose },
];

function StackRow() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
      {STACK.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          style={{ display: "flex", alignItems: "center", gap: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 14px" }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}`, flexShrink: 0 }}>
            <s.Icon size={17} color={s.color} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{s.name}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, lineHeight: 1.35 }}>{s.role}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. A lead's journey (interactive)
type Step = {
  n: string; title: string; from: string; to: string; mech: string;
  detail: string; color: string;
};

const JOURNEY: Step[] = [
  {
    n: "01", title: "Ad click lands", from: "Meta or Google Ad", to: "GHL funnel", mech: "Funnel plus tracking",
    detail: "A paid ad sends traffic to a GoHighLevel funnel or landing page built to convert. The pixel and conversion tracking are wired so spend maps to real leads, not just clicks, and you can tell which ad set actually earns.",
    color: C.blue,
  },
  {
    n: "02", title: "Form capture", from: "GHL form", to: "Contact plus tags", mech: "Tag and route",
    detail: "The submit creates the contact, tags it by source and campaign, and drops it into the right pipeline stage. Segmentation starts at capture, so the list stays clean instead of turning into a pile you clean up later.",
    color: C.cyan,
  },
  {
    n: "03", title: "Missed call text back", from: "Inbound call", to: "Instant SMS", mech: "Automation",
    detail: "If they call and no one picks up, an automation texts them back within seconds. The lead never sits cold while someone gets to it. Speed to lead is the whole game, and this is the cheapest win in the account.",
    color: C.amber,
  },
  {
    n: "04", title: "Booking and reminders", from: "GHL calendar", to: "SMS plus email", mech: "Reminder sequence",
    detail: "They book on a GHL calendar and a reminder sequence over SMS and email cuts no shows. Confirmation, reminders before the slot, and a recovery follow up if they miss, so the calendar stays full of real appointments.",
    color: C.green,
  },
  {
    n: "05", title: "Nurture keeps them warm", from: "Not ready yet", to: "Paced sequence", mech: "Workflow by tag",
    detail: "Leads that are not ready get a nurture sequence over SMS and email, paced and personalized by tag, until they book or opt out. Nobody falls through the cracks and nobody gets spammed into unsubscribing.",
    color: C.purple,
  },
  {
    n: "06", title: "Pipeline and reporting", from: "Every move", to: "Dashboard", mech: "KPI rollup",
    detail: "Each action updates the pipeline, and the dashboard shows lead flow, conversion, speed to lead, and pipeline value. You see which campaigns and funnels actually earn, and where the drop off is, without guessing.",
    color: C.rose,
  },
];

function Journey() {
  const [i, setI] = useState(0);
  const s = JOURNEY[i];

  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
        {JOURNEY.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.n}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, textAlign: "left", cursor: "pointer", width: 150,
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "12px 12px", transition: "all 0.16s",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: st.color }}>{st.n}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub, marginTop: 4, lineHeight: 1.3 }}>{st.title}</div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={s.n}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${s.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: s.color, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px" }}>{s.from}</span>
            <ArrowRight size={15} color={C.muted} />
            <span style={{ fontSize: 13, fontWeight: 800, color: C.ink, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px" }}>{s.to}</span>
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: C.sub, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 11px" }}>
              <Zap size={12} /> {s.mech}
            </span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 6 }}>{s.title}</div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{s.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Core automations explorer (interactive)
type Auto = { id: string; Icon: typeof Workflow; name: string; tag: string; detail: string; color: string };

const AUTOMATIONS: Auto[] = [
  { id: "mctb", Icon: PhoneMissed, name: "Missed call text back", tag: "Speed to lead", color: C.amber,
    detail: "The moment a call goes unanswered, the contact gets a text asking how you can help. It is the single fastest way to stop losing leads to voicemail, and it runs on every inbound number in the account." },
  { id: "reminders", Icon: Calendar, name: "Appointment reminders", tag: "No show recovery", color: C.green,
    detail: "Confirmation on booking, a reminder the day before and an hour before, and a recovery message if they miss, with a one tap rebook. No show rates drop and staff stop chasing people by hand." },
  { id: "nurture", Icon: MessageSquare, name: "Lead nurture", tag: "SMS and email", color: C.purple,
    detail: "Multi step sequences that mix SMS and email, paced by behavior and tag. New leads, quote sent but no reply, and long term follow up each get their own track, all with clean entry and exit rules." },
  { id: "pipeline", Icon: GitBranch, name: "Pipeline automations", tag: "Stage triggers", color: C.cyan,
    detail: "Moving a card fires the right action: a task for sales, an internal alert, a status text to the lead. The pipeline stays a live picture of the business instead of a board someone forgets to drag cards across." },
  { id: "reactivation", Icon: Repeat, name: "Database reactivation", tag: "Win back", color: C.blue,
    detail: "A controlled campaign to old leads and past customers that wakes up the list you already paid to build. Sent in batches with reply handling, so warm replies route to a human and the rest stay nurtured." },
  { id: "reviews", Icon: Star, name: "Review requests", tag: "Reputation", color: C.rose,
    detail: "After a job is marked done, an automation asks for a review at the right moment and routes happy replies to Google. Reputation grows on autopilot without anyone remembering to send the link." },
];

function AutomationExplorer() {
  const [activeId, setActiveId] = useState(AUTOMATIONS[0].id);
  const active = AUTOMATIONS.find((x) => x.id === activeId) ?? AUTOMATIONS[0];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {AUTOMATIONS.map((x) => {
          const on = x.id === activeId;
          return (
            <button
              key={x.id}
              onClick={() => setActiveId(x.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                color: on ? C.bg : C.sub, background: on ? x.color : C.card,
                border: `1px solid ${on ? x.color : C.border}`, borderRadius: 999, padding: "8px 13px", transition: "all 0.16s",
              }}
            >
              <x.Icon size={14} /> {x.name}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${active.color}`, borderRadius: 16, padding: "22px 22px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${active.color}` }}>
              <active.Icon size={20} color={active.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{active.name}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: active.color, marginTop: 3 }}>
                <Tag size={12} /> {active.tag}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{active.detail}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. KPIs monitored
const KPIS = [
  { Icon: Users, title: "Lead flow", body: "New leads by source and campaign, day over day, so a dip gets caught the same week instead of at month end.", color: C.cyan },
  { Icon: Filter, title: "Funnel conversion", body: "Visit to lead and lead to booked, per funnel, so you know which page earns and which one leaks.", color: C.coral },
  { Icon: Zap, title: "Speed to lead", body: "How fast a new lead gets first contact. The number that quietly decides how many deals you win.", color: C.amber },
  { Icon: BarChart3, title: "Pipeline value", body: "Open opportunities by stage and value, so the forecast is real and stale cards get flushed.", color: C.green },
  { Icon: Calendar, title: "No show rate", body: "Booked versus attended, tracked so the reminder sequence can be tuned against a real number.", color: C.purple },
  { Icon: Target, title: "Cost per booked", body: "Where ads matter: ad spend against booked appointments, so budget follows what actually converts.", color: C.rose },
];

// ─────────────────────────────────────────────────────────────
// 5. CRM hygiene
const HYGIENE = [
  { Icon: Users, title: "Clean imports", body: "Contact imports mapped to the right fields, deduped on the way in, so a bulk upload does not corrupt the database." },
  { Icon: Tag, title: "Tagging and segmentation", body: "One tagging convention the whole account follows, so segments are reliable and a blast never hits the wrong list." },
  { Icon: ShieldCheck, title: "Custom fields versus values", body: "Fields for data that belongs to a contact, values for account wide constants. Used correctly so automations stay simple." },
  { Icon: Repeat, title: "Ongoing maintenance", body: "Duplicate merges, dead lead archiving, and opt out hygiene, so the CRM stays accurate instead of slowly rotting." },
];

// ─────────────────────────────────────────────────────────────
// 6. Real builds behind this (described, not cross linked)
const PROOF = [
  { name: "Multi pipeline GHL architecture", color: C.cyan,
    body: "Multiple pipelines with staged journeys, custom fields in folders, custom values, tags, and calendars, built to a naming convention in real client accounts. Clean and scalable by design, not bolted together.",
    tags: ["Pipelines", "Naming conventions", "CRM"] },
  { name: "Speed to lead and reminder automations", color: C.amber,
    body: "Missed call text back, appointment reminder and no show recovery sequences, and nurture tracks built and tested on sample contacts before a single real lead touched them. The unglamorous stuff that moves revenue.",
    tags: ["Missed call text back", "Reminders", "Nurture"] },
  { name: "Two way sync to a field service platform", color: C.green,
    body: "A live sync between GHL and an outside operations platform, built as a custom relay because no native app existed. Bookings, statuses, and outcomes flowing both directions, kept reliable with retries and verification.",
    tags: ["Webhooks", "Integration", "Reliability"] },
];

// ─────────────────────────────────────────────────────────────
export default function GhlMarketingOps() {
  const heroStats = useMemo(
    () => [
      { k: "On GoHighLevel", v: "since 2018" },
      { k: "Focus", v: "GHL, CRM, automation" },
      { k: "Shift", v: "Australian day hours" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: ACCENT, background: "rgba(34,211,238,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: ACCENT }}>
            <Share2 size={15} /> GHL Specialist · Marketing and CRM operations
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            You run marketing and CRM on GoHighLevel.
            <span style={{ color: ACCENT }}> So do I, since 2018.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            Your post lists funnels, pipelines, forms, booking, missed call text back, reminders, nurture, reporting,
            and CRM hygiene, with some Meta and Google Ads support on top. That is my daily work, not a wish list.
            Rather than tell you, here it is: click through one real lead from an ad to booked, nurtured, and reported.
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

        <Section eyebrow="The account" title="What I run inside GoHighLevel" sub="Everything in your responsibilities list lives in one account. I build it, keep it clean, and make sure each piece feeds the next instead of sitting in its own silo.">
          <StackRow />
        </Section>

        <Section eyebrow="The journey" title="Follow one lead from ad to booked and nurtured" sub="Click each step. This is the exact path your post describes, from a paid ad through capture, missed call text back, booking, reminders, nurture, and into the reporting that tells you what worked.">
          <Journey />
        </Section>

        <Section eyebrow="Automations" title="The follow ups that do the work, click any of them" sub="These are the workflows that quietly move the numbers. Tap one to see how it is built and why it matters. Every one has clean entry and exit rules, so nobody gets double messaged or stuck.">
          <AutomationExplorer />
        </Section>

        <Section eyebrow="Reporting" title="The KPIs I watch, so you are not guessing" sub="Dashboards are only useful if they change a decision. These are the numbers I keep in front of you, and the ones I use to find where a funnel leaks or a campaign quietly stops earning.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {KPIS.map((g, i) => (
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

        <Section eyebrow="CRM hygiene" title="A database you can actually trust" sub="Automations are only as good as the data under them. Imports, tags, fields, and segments kept clean and consistent, so a campaign never hits the wrong list and the numbers mean what they say.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {HYGIENE.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <g.Icon size={18} color={ACCENT} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{g.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{g.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Ads honesty block + integrations */}
        <Section eyebrow="Straight talk on ads" title="Where I sit on Meta and Google Ads" sub="Your post asks for support, not a full media buyer, and I want to be honest about the line.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.green}`, borderRadius: 14, padding: "18px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <CheckCircle2 size={18} color={C.green} />
                <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>What I do well</span>
              </div>
              <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>
                Campaign setup and structure, the tracking side (pixel, conversion events, lead sync into GHL),
                monitoring performance, and basic optimization like pausing losers and shifting budget to what books
                appointments. I make sure ad spend and the CRM tell the same story.
              </p>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.amber}`, borderRadius: 14, padding: "18px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Target size={18} color={C.amber} />
                <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>Where I am honest</span>
              </div>
              <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>
                I am a GoHighLevel, CRM, and automation specialist first. For heavy creative testing and aggressive
                scaling I am a solid support hand, not a lead performance marketer. I will tell you when something is
                past my depth rather than burn budget pretending otherwise.
              </p>
            </div>
          </div>
        </Section>

        <Section eyebrow="Integrations" title="GHL connected to the rest of your stack" sub="Zapier, Make, and where they get fragile, real code. I pick the simplest tool that holds up under load and move logic to something sturdier before a Zap starts silently failing.">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Zapier", "Make", "Webhooks both ways", "REST APIs", "Google Sheets reporting", "Stripe and PayMongo", "Twilio SMS and voice"].map((t) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: C.sub, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "8px 13px" }}>
                <Zap size={13} color={ACCENT} /> {t}
              </span>
            ))}
          </div>
        </Section>

        <Section eyebrow="Not a mockup" title="Real builds behind this" sub="Client names stay confidential here, and I have worked with a number of Australian businesses across trades and field service, automotive, and professional services. Each of these is real, live, and mine end to end.">
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
            <Sparkles size={18} color={ACCENT} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I built this page, every workflow it shows, and the client systems behind it with my own hands.
            No team, no contractors, no handoffs. The person you interview is the person who builds and runs your
            account, which is exactly why the builds stay clean and the answers stay straight.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: ACCENT, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
            <a href="/intro" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
              Watch my intro <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <CheckCircle2 size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> WhatsApp +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps Australian business hours daily</span>
        </div>
      </div>
    </div>
  );
}
