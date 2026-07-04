"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, UserPlus, PhoneMissed, CalendarCheck, MessageSquare,
  CreditCard, Rocket, GraduationCap, Users, HeartHandshake, RefreshCw, Bot,
  PhoneCall, MessageCircle, CalendarClock, Zap, Sparkles, Workflow, LayoutDashboard,
  FileText, Video, CheckCircle2, ChevronRight, Tag, TrendingUp, BookOpen, PlugZap,
  Star,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  cyan: "#22D3EE", green: "#34D399", amber: "#FBBF24", coral: "#FB923C",
  purple: "#A78BFA", blue: "#3B82F6",
};

// ── Client journey stages ─────────────────────────────────────
type Stage = {
  id: string; num: number; name: string; tag: string; color: string; Icon: typeof UserPlus;
  summary: string; automations: string[]; ai?: string; sop: string;
};
const stages: Stage[] = [
  {
    id: "lead", num: 1, name: "New Lead", tag: "lead-new", color: C.cyan, Icon: UserPlus,
    summary: "Every ad, funnel, and webinar opt in lands here and gets an answer in seconds, not hours.",
    automations: [
      "Instant SMS and email acknowledgment the moment the form submits",
      "Opportunity created, owner assigned, speed to lead timer started",
      "Lead source captured for later ROI reporting by channel",
    ],
    ai: "AI Chat qualifies the lead right on the funnel and can hand a hot one straight to booking.",
    sop: "SOP: New Lead Intake, plus a Loom walking the team through where leads come from and how routing works.",
  },
  {
    id: "contact", num: 2, name: "Speed to Lead & Missed Calls", tag: "lead-attempting", color: C.blue, Icon: PhoneMissed,
    summary: "No lead ever goes cold because nobody called back. The system chases so the team does not have to.",
    automations: [
      "Missed call text back fires automatically within seconds",
      "Five minute no answer triggers a multi step SMS and email follow up",
      "Round robin assignment to the next available closer",
    ],
    ai: "AI Voice can answer or return the call, qualify, and book, day or night.",
    sop: "SOP: Speed to Lead, with the exact cadence and what each message says.",
  },
  {
    id: "booked", num: 3, name: "Appointment Booked", tag: "appt-booked", color: C.purple, Icon: CalendarCheck,
    summary: "Booking is frictionless and no one forgets to show up.",
    automations: [
      "Calendar confirmation, add to the closer's calendar",
      "Reminder sequence at 24 hours and 1 hour, SMS and email",
      "No show routes to a re-book nurture, never a dead end",
    ],
    ai: "AI Appointment Booking sets the meeting straight from a chat or text thread.",
    sop: "SOP: Booking and Reminders, Loom on calendar setup and round robin.",
  },
  {
    id: "consult", num: 4, name: "Consultation & Discovery", tag: "consult", color: C.amber, Icon: MessageSquare,
    summary: "The closer walks in fully briefed, and every outcome moves the pipeline correctly.",
    automations: [
      "Pre call intake form so the closer has context before the call",
      "Show moves the stage forward, no show drops to nurture",
      "Objections and notes captured to custom fields for follow up",
    ],
    ai: "AI drafts a call summary and the next best follow up message from the notes.",
    sop: "SOP: Discovery Call flow and disposition rules.",
  },
  {
    id: "enroll", num: 5, name: "Enrolled & Payment", tag: "customer-enrolled", color: C.green, Icon: CreditCard,
    summary: "Money moves cleanly and no payment ever slips through the cracks.",
    automations: [
      "Stripe checkout, payment confirmation, and receipt",
      "Failed payment retry and dunning for payment plans",
      "Scheduled payment reminders ahead of each due date",
    ],
    sop: "SOP: Enrollment and Payments, including plan and dunning logic.",
  },
  {
    id: "onboard", num: 6, name: "Onboarding", tag: "onboarding", color: C.cyan, Icon: Rocket,
    summary: "The first 7 days feel white glove and set the tone for the whole membership.",
    automations: [
      "Welcome sequence, Skool invite, and course access granted automatically",
      "Onboarding checklist with tasks and progress tracking",
      "Kickoff call booked and confirmed",
    ],
    ai: "AI onboarding assistant answers the common first week questions instantly.",
    sop: "SOP: Client Onboarding, Loom of the full welcome experience.",
  },
  {
    id: "member", num: 7, name: "Active Member (Skool)", tag: "member-active", color: C.blue, Icon: Users,
    summary: "GHL and Skool stay in sync so membership access and progress just work.",
    automations: [
      "Skool community onboarding and role assignment",
      "Course progress synced back to GHL for visibility",
      "Weekly value touchpoints across email and SMS",
    ],
    sop: "SOP: Membership Access and Skool sync mapping.",
  },
  {
    id: "checkin", num: 8, name: "Progress & Check-ins", tag: "member-engaged", color: C.purple, Icon: HeartHandshake,
    summary: "Wins get celebrated and at risk members get caught before they churn.",
    automations: [
      "Milestone triggers celebrate progress automatically",
      "Low engagement flags an at risk member and creates a check in task",
      "Review and testimonial requests at the right happy moments",
    ],
    ai: "AI Follow Up keeps quiet members warm with helpful, non pushy nudges.",
    sop: "SOP: Client Check-ins and at risk playbook.",
  },
  {
    id: "grad", num: 9, name: "Graduation", tag: "graduate", color: C.amber, Icon: GraduationCap,
    summary: "Finishing is a moment, and a springboard into the next program and referrals.",
    automations: [
      "Graduation workflow, certificate, and celebration sequence",
      "Upsell into the next program or tier",
      "Testimonial and referral requests while momentum is high",
    ],
    sop: "SOP: Graduation and Ascension.",
  },
  {
    id: "alumni", num: 10, name: "Long-Term & Re-engagement", tag: "alumni", color: C.green, Icon: RefreshCw,
    summary: "Past clients stay a community and dormant ones get pulled back with the right offer.",
    automations: [
      "Alumni nurture that keeps the relationship alive",
      "Re-engagement campaigns for dormant contacts",
      "Win back offers triggered by inactivity windows",
    ],
    ai: "AI Follow Up personalizes re-engagement so it never feels like a blast.",
    sop: "SOP: Re-engagement and Win Back.",
  },
];

// ── AI stack ──────────────────────────────────────────────────
const aiStack = [
  { Icon: Bot, name: "OpenAI", role: "The brain behind summaries, replies, and content, prompt engineered around each client's data.", color: C.green },
  { Icon: PhoneCall, name: "AI Voice", role: "Answers and returns calls, qualifies, and books, so no lead waits.", color: C.blue },
  { Icon: MessageCircle, name: "AI Chat", role: "Qualifies leads on the funnel and over SMS, hands hot ones to booking.", color: C.purple },
  { Icon: CalendarClock, name: "AI Appointment Booking", role: "Sets meetings straight from a conversation, no back and forth.", color: C.amber },
  { Icon: Sparkles, name: "AI Follow-Up", role: "Persistent, human sounding nurture that never forgets a lead.", color: C.coral },
];

// ── Marketing + integrations ──────────────────────────────────
const marketing = [
  "Webinar and sales funnels", "Email campaigns", "SMS campaigns",
  "Lead nurturing sequences", "Review requests", "Re-engagement campaigns",
];
const integrations = ["Zapier", "Make.com", "OpenAI", "Skool", "Stripe", "Calendly", "Slack", "Airtable", "Notion", "ClickUp"];

// ── 90 day roadmap ────────────────────────────────────────────
const roadmap = [
  {
    phase: "Weeks 1 to 2", name: "Foundation", color: C.cyan, Icon: LayoutDashboard,
    items: ["Full GHL account architecture", "Pipelines, stages, tags, custom fields", "Smart Lists, calendars, dashboards", "Lead routing and speed to lead live"],
    target: "The spine everything else hangs on.",
  },
  {
    phase: "Weeks 3 to 5", name: "Client experience automations", color: C.green, Icon: Workflow,
    items: ["New lead, missed call, booking, reminders", "Onboarding and membership access", "Payment reminders and dunning", "Graduation and check in workflows"],
    target: "Complete client onboarding system running.",
  },
  {
    phase: "Weeks 6 to 8", name: "AI and integrations", color: C.purple, Icon: PlugZap,
    items: ["Zapier and Make connective tissue", "OpenAI, AI voice, chat, booking, follow up", "Skool, Stripe, course access, progress sync", "Membership fully automated"],
    target: "AI doing the repetitive lifting.",
  },
  {
    phase: "Weeks 9 to 12", name: "Marketing, funnels and docs", color: C.amber, Icon: BookOpen,
    items: ["Webinar and sales funnels connected", "Email and SMS campaigns, re-engagement", "Every system gets an SOP and a Loom", "Full SOP library handed over"],
    target: "95% of repetitive tasks automated, SOP library created.",
  },
];

// ── Component ──────────────────────────────────────────────────
export default function EfsBlueprint() {
  const [active, setActive] = useState("lead");
  const stage = stages.find((s) => s.id === active)!;
  const nextStage = stages[stages.findIndex((s) => s.id === active) + 1];

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "28px 20px 90px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvnofficial.com
        </Link>

        {/* Header */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.green, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.green, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Application Demo · Evolving Financial Solutions
          </div>
          <h1 style={{ fontSize: 29, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            The EFS client journey, architected in GoHighLevel
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 730, margin: 0, lineHeight: 1.65 }}>
            Your mission is to build the technology that runs EFS, a scalable journey from first lead to long term
            member. So instead of telling you I know GoHighLevel, I mapped your journey as an interactive blueprint.
            Click any stage below to see the exact automations, AI, tags, and documentation I would build there. This
            is how I think before I touch your account.
          </p>
        </div>

        {/* Pipeline strip */}
        <div style={{ marginTop: 26 }}>
          <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>
            The pipeline, lead to member — click any stage
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {stages.map((s) => {
              const on = active === s.id;
              return (
                <button key={s.id} onClick={() => setActive(s.id)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 10, cursor: "pointer",
                    border: `1px solid ${on ? s.color + "99" : C.border}`, background: on ? s.color + "18" : C.card,
                    color: on ? s.color : C.sub, fontSize: 12.5, fontWeight: on ? 700 : 400 }}>
                  <s.Icon size={14} />
                  <span style={{ fontSize: 10, opacity: .55 }}>{s.num}</span>
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage detail */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} style={{ marginTop: 16 }}>
            <div style={{ background: C.card, border: `1px solid ${stage.color}55`, borderRadius: 20, overflow: "hidden" }}>
              <div style={{ padding: "22px 24px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: stage.color + "1E", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <stage.Icon size={22} style={{ color: stage.color }} />
                </span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: stage.color }}>Stage {stage.num} of {stages.length}</span>
                  <h2 style={{ fontSize: 21, fontWeight: 800, margin: "4px 0 6px" }}>{stage.name}</h2>
                  <p style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: 1.6 }}>{stage.summary}</p>
                </div>
              </div>
              <div style={{ padding: "18px 24px 22px" }}>
                <Label icon={Zap} color={C.green}>Automations that fire here</Label>
                <div style={{ display: "grid", gap: 7, marginBottom: 16 }}>
                  {stage.automations.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.green + "0C", border: `1px solid ${C.green}28`, borderRadius: 10, padding: "9px 12px" }}>
                      <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: 99, background: C.green + "22", color: C.green, fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center", marginTop: 1 }}>{i + 1}</span>
                      <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>

                {stage.ai && (
                  <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.purple + "12", border: `1px solid ${C.purple}3A`, borderRadius: 12, padding: "12px 15px", marginBottom: 14 }}>
                    <Bot size={16} style={{ color: C.purple, flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.55 }}><strong style={{ color: C.purple }}>AI here: </strong>{stage.ai}</span>
                  </div>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.coral, background: C.coral + "14", border: `1px solid ${C.coral}3A`, borderRadius: 8, padding: "5px 10px", fontFamily: "monospace" }}>
                    <Tag size={12} /> {stage.tag}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.sub }}>
                    <FileText size={13} style={{ color: C.amber }} /> {stage.sop}
                  </span>
                </div>

                {nextStage && (
                  <button onClick={() => setActive(nextStage.id)} style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 7, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 14px", color: C.sub, fontSize: 13, cursor: "pointer" }}>
                    <nextStage.Icon size={14} /> Next: {nextStage.name} <ChevronRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* AI stack */}
        <Section title="The AI stack, and where each piece plugs in" Icon={Bot} accent={C.purple}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            {aiStack.map((a, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${a.color}3A`, borderRadius: 14, padding: 15 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: a.color + "1E", display: "grid", placeItems: "center" }}>
                    <a.Icon size={16} style={{ color: a.color }} />
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{a.name}</span>
                </div>
                <p style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.55, margin: 0 }}>{a.role}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Marketing + integrations */}
        <Section title="Marketing engine and the tools it connects" Icon={TrendingUp} accent={C.blue}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <div>
              <Label icon={Megaphone} color={C.blue}>Campaigns and funnels</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {marketing.map((m) => (
                  <span key={m} style={{ fontSize: 12.5, color: C.ink, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 11px" }}>{m}</span>
                ))}
              </div>
            </div>
            <div>
              <Label icon={PlugZap} color={C.green}>Integrations wired in</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {integrations.map((m) => (
                  <span key={m} style={{ fontSize: 12.5, color: C.green, background: C.green + "12", border: `1px solid ${C.green}30`, borderRadius: 8, padding: "7px 11px" }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 90 day roadmap */}
        <Section title="The first 90 days, mapped to your targets" Icon={Rocket} accent={C.green}>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {roadmap.map((r, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: r.color + "1E", display: "grid", placeItems: "center" }}>
                    <r.Icon size={16} style={{ color: r.color }} />
                  </span>
                  <div>
                    <div style={{ fontSize: 11, color: r.color, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase" }}>{r.phase}</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                  </div>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 12px" }}>
                  {r.items.map((it, j) => (
                    <li key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "3px 0", fontSize: 12.5, color: C.sub, lineHeight: 1.45 }}>
                      <CheckCircle2 size={13} style={{ color: r.color, flexShrink: 0, marginTop: 2 }} /> {it}
                    </li>
                  ))}
                </ul>
                <div style={{ fontSize: 12, color: r.color, fontWeight: 600, borderTop: `1px solid ${C.border}`, paddingTop: 9 }}>{r.target}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Documentation */}
        <Section title="Nothing lives only in my head" Icon={FileText} accent={C.amber}>
          <p style={{ color: C.sub, fontSize: 13.5, marginTop: -4, marginBottom: 16, lineHeight: 1.6 }}>
            You said every system needs an SOP, a Loom, and process docs. I agree completely, a system nobody but the
            builder understands is a liability. Here is the shape every build gets handed over in.
          </p>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: .6, textTransform: "uppercase", color: C.amber }}>Sample SOP</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>New Lead to Booked Call</span>
            </div>
            <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
              {["Trigger: form or funnel submission", "Instant SMS + email, opportunity created, owner assigned", "5 minute no answer starts the follow up sequence", "AI Chat or AI Voice qualifies and books", "Stage moves to Appointment Booked, reminders begin"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 9, fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>
                  <span style={{ color: C.amber, fontWeight: 700 }}>{i + 1}.</span> {s}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: C.coral }}><Video size={13} /> Loom walkthrough attached</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: C.green }}><CheckCircle2 size={13} /> Editable process doc in Notion or ClickUp</span>
            </div>
          </div>
        </Section>

        {/* Success */}
        <div style={{ marginTop: 30, background: C.green + "10", border: `1px solid ${C.green}3A`, borderRadius: 16, padding: "18px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Star size={18} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.6, margin: 0 }}>
            Your definition of success is that manual work disappears so the CEO can focus on growth instead of
            operations. That is exactly what this blueprint is built to do, and it is the kind of work I enjoy most.
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>GoHighLevel · AI Automation · Systems · BVN</div>
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

// ── Small pieces ─────────────────────────────────────────────
function Label({ icon: Icon, color, children }: { icon: typeof Zap; color: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color, letterSpacing: .5, textTransform: "uppercase", marginBottom: 10 }}>
      <Icon size={14} /> {children}
    </div>
  );
}
function Section({ title, Icon, accent, children }: { title: string; Icon: typeof Zap; accent: string; children: React.ReactNode }) {
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
