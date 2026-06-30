"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Megaphone, Mail, Zap, Clock, ChevronRight,
  Car, Home, Building2, Users, RefreshCw, ShieldCheck, Webhook,
} from "lucide-react";

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
};

type Division = "residential" | "commercial" | "automotive";

type Step = {
  text: string;
  auto: boolean;
};

type Stage = {
  id: string;
  num: number;
  name: string;
  description: string;
  accent: string;
  emoji: string;
  timeNote?: string;
  steps: Step[];
  result: string;
  divisions?: Record<Division, { label: string; Icon: typeof Home; questions: string[] }>;
};

const stages: Stage[] = [
  {
    id: "entry",
    num: 1,
    name: "Lead comes in",
    description: "A potential customer reaches out — through the website, an ad, a phone call, or a referral. Every channel is captured.",
    accent: C.coral,
    emoji: "📥",
    steps: [
      { text: "Customer fills out a quote form on your website", auto: false },
      { text: "Lead is instantly added to your CRM pipeline", auto: true },
      { text: "If a phone call is missed, the system texts the caller back within 60 seconds", auto: true },
      { text: "The lead source (ad, organic, referral) is tagged automatically for reporting", auto: true },
    ],
    result: "Every lead is captured and logged — nothing sits in an inbox or gets lost.",
  },
  {
    id: "response",
    num: 2,
    name: "Instant response",
    description: "Before anyone on your team lifts a finger, the lead has already been welcomed and a conversation has started.",
    accent: C.cyan,
    emoji: "⚡",
    timeNote: "Fires within 2 minutes",
    steps: [
      { text: "The lead is checked for duplicates automatically", auto: true },
      { text: "They are tagged by division: Residential, Commercial, or Automotive", auto: true },
      { text: "An SMS is sent to the lead confirming you received their enquiry", auto: true },
      { text: "A follow-up email sequence starts running in the background", auto: true },
    ],
    result: "The customer feels heard immediately. Your team does nothing at this stage.",
  },
  {
    id: "qualify",
    num: 3,
    name: "Qualification",
    description: "An AI assistant asks the right questions based on the type of job — so by the time a human steps in, all the details are already there.",
    accent: C.purple,
    emoji: "🤖",
    timeNote: "Under 5 minutes",
    steps: [
      { text: "AI chatbot or voice assistant starts the conversation", auto: true },
      { text: "Questions are tailored to the division (see below)", auto: true },
      { text: "Answers are saved directly to the customer record", auto: true },
      { text: "Hot leads are flagged and moved forward automatically", auto: true },
    ],
    result: "Your team receives a fully qualified lead with job details already filled in.",
    divisions: {
      residential: {
        label: "Residential",
        Icon: Home,
        questions: [
          "How many windows and what type of property?",
          "What film are they interested in — solar, privacy, or decorative?",
          "What is the property address and access situation?",
          "When are they looking to get it done?",
        ],
      },
      commercial: {
        label: "Commercial",
        Icon: Building2,
        questions: [
          "How large is the building and how many floors?",
          "What is the business type and main goal — heat, glare, or privacy?",
          "Are they the decision maker or do they need to get approval?",
          "What is their rough budget range?",
        ],
      },
      automotive: {
        label: "Automotive",
        Icon: Car,
        questions: [
          "What is the vehicle make, model, and year?",
          "Which film grade are they after — ceramic, standard, or paint protection?",
          "How many windows or panels need to be done?",
          "What dates work for them to bring it in?",
        ],
      },
    },
  },
  {
    id: "quote",
    num: 4,
    name: "Quote sent",
    description: "A quote goes out quickly, and if the customer doesn't respond, the system follows up for you — automatically.",
    accent: C.amber,
    emoji: "📋",
    timeNote: "Within 1 business hour",
    steps: [
      { text: "Quote is generated from the intake details and sent by SMS and email", auto: true },
      { text: "Customer can sign and approve digitally — no printing or scanning", auto: true },
      { text: "Day 1: reminder SMS sent if no response", auto: true },
      { text: "Day 3: follow-up email with a gentle question to re-engage", auto: true },
      { text: "Day 7: final check-in before the lead is archived", auto: true },
    ],
    result: "Quotes get followed up consistently, every time, with zero manual effort.",
  },
  {
    id: "booking",
    num: 5,
    name: "Job booked",
    description: "Once the quote is approved, the job is confirmed in your calendar and instantly created in your job management system.",
    accent: C.blue,
    emoji: "📅",
    timeNote: "Sync takes under 30 seconds",
    steps: [
      { text: "Appointment is set in the booking calendar", auto: false },
      { text: "Pipeline moves to Booked status", auto: true },
      { text: "Customer gets an SMS reminder 24 hours before the job", auto: true },
      { text: "A job card is automatically created in ServiceM8 — no re-entering details", auto: true },
      { text: "The right technician is assigned and the job is scheduled", auto: false },
    ],
    result: "One booking confirmation creates everything — calendar, job card, and customer reminder.",
  },
  {
    id: "onsite",
    num: 6,
    name: "Job on site",
    description: "Your tech manages the job through ServiceM8 on their phone. Everything is logged as they work.",
    accent: C.green,
    emoji: "🔧",
    steps: [
      { text: "Tech checks in on arrival — time is logged automatically", auto: false },
      { text: "Before photos are attached to the job card", auto: false },
      { text: "Materials used and time spent are recorded on the spot", auto: false },
      { text: "After photos taken and saved to the job record", auto: false },
      { text: "Tech marks the job complete on their phone before leaving site", auto: false },
    ],
    result: "A complete job record with photos, time, and materials — ready before the tech drives away.",
  },
  {
    id: "invoice",
    num: 7,
    name: "Invoice and payment",
    description: "The moment a job is marked complete, the invoice goes out. No one has to remember to send it.",
    accent: C.green,
    emoji: "💳",
    timeNote: "Invoice sent within minutes",
    steps: [
      { text: "Job is marked complete on site by the tech", auto: false },
      { text: "Invoice is generated and sent to the customer automatically", auto: true },
      { text: "The pipeline is updated to Won — revenue is logged", auto: true },
      { text: "If unpaid after 48 hours, a payment reminder is sent automatically", auto: true },
      { text: "Receipt is sent automatically when payment is received", auto: true },
    ],
    result: "Invoicing happens immediately every time — no admin delay, no forgotten invoices.",
  },
  {
    id: "followup",
    num: 8,
    name: "After the job",
    description: "The system keeps working after the job is done — collecting reviews, asking for referrals, and bringing customers back.",
    accent: C.coral,
    emoji: "⭐",
    steps: [
      { text: "24 hours after the job: SMS asking for a Google review (one tap link)", auto: true },
      { text: "48 hours: second review request if no action was taken", auto: true },
      { text: "Day 7: referral prompt asking if they know anyone who needs tinting", auto: true },
      { text: "90 days: reactivation message checking if they need anything else", auto: true },
      { text: "Seasonal campaigns fire to past customers based on their division", auto: true },
    ],
    result: "Reviews, referrals, and repeat business — all running on their own in the background.",
  },
];

const divKeys: Division[] = ["residential", "commercial", "automotive"];

export default function TintGardWorkflow() {
  const [active, setActive] = useState<string>("entry");
  const [activeDiv, setActiveDiv] = useState<Division>("residential");

  const stage = stages.find((s) => s.id === active)!;
  const nextStage = stages[stages.findIndex((s) => s.id === active) + 1];
  const autoSteps = stage.steps.filter((s) => s.auto);
  const teamSteps = stage.steps.filter((s) => !s.auto);

  return (
    <main style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 80px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={15} /> bvndigital.com
        </Link>

        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.cyan, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: C.cyan, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
            BVN · Client Proposal
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 6px", fontWeight: 800 }}>
            TintGard Operating System
          </h1>
          <p style={{ color: C.sub, fontSize: 14, maxWidth: 620, margin: 0, lineHeight: 1.65 }}>
            A step-by-step walkthrough of how the system handles leads, jobs, and follow-ups across all three divisions. Green steps run automatically. Blue steps involve your team.
          </p>
        </div>

        <div style={{ marginTop: 28 }}>
          <p style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>
            8 stages — click any to explore
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {stages.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "7px 13px", borderRadius: 10,
                  border: `1px solid ${active === s.id ? s.accent + "99" : C.border}`,
                  background: active === s.id ? s.accent + "18" : C.card,
                  color: active === s.id ? s.accent : C.sub,
                  fontSize: 13, fontWeight: active === s.id ? 700 : 400,
                  cursor: "pointer", transition: "all .18s",
                }}
              >
                <span style={{ fontSize: 14 }}>{s.emoji}</span>
                <span style={{ fontSize: 11, opacity: .6 }}>{s.num}.</span>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{ marginTop: 18 }}
          >
            <div style={{ background: C.card, border: `1px solid ${stage.accent}55`, borderRadius: 20, overflow: "hidden" }}>

              <div style={{ padding: "22px 24px 18px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span style={{ fontSize: 32, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{stage.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: stage.accent }}>
                        Stage {stage.num} of 8
                      </span>
                      {stage.timeNote && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.muted, background: C.bg2, padding: "2px 9px", borderRadius: 99, border: `1px solid ${C.border}` }}>
                          <Clock size={11} /> {stage.timeNote}
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 6px" }}>{stage.name}</h2>
                    <p style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: 1.6 }}>{stage.description}</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: "20px 24px" }}>

                {stage.divisions && (
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing: .8, textTransform: "uppercase", margin: "0 0 10px" }}>
                      Questions asked per division
                    </p>
                    <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                      {divKeys.map((d) => {
                        const div = stage.divisions![d];
                        const DivIcon = div.Icon;
                        return (
                          <button
                            key={d}
                            onClick={() => setActiveDiv(d)}
                            style={{
                              display: "flex", alignItems: "center", gap: 7,
                              padding: "8px 16px", borderRadius: 10,
                              border: `1px solid ${activeDiv === d ? stage.accent + "88" : C.border}`,
                              background: activeDiv === d ? stage.accent + "20" : C.bg2,
                              color: activeDiv === d ? stage.accent : C.sub,
                              fontSize: 13, fontWeight: activeDiv === d ? 700 : 400, cursor: "pointer",
                            }}
                          >
                            <DivIcon size={14} /> {div.label}
                          </button>
                        );
                      })}
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeDiv}
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.16 }}
                        style={{ display: "grid", gap: 8, marginBottom: 20 }}
                      >
                        {stage.divisions[activeDiv].questions.map((q, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", background: stage.accent + "10", border: `1px solid ${stage.accent}30`, borderRadius: 10 }}>
                            <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 800, color: stage.accent, marginTop: 1 }}>Q{i + 1}</span>
                            <span style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{q}</span>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}

                <div style={{ display: "grid", gap: 16, gridTemplateColumns: autoSteps.length && teamSteps.length ? "1fr 1fr" : "1fr" }}>
                  {autoSteps.length > 0 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                        <Zap size={14} style={{ color: C.green }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: .5 }}>Happens automatically</span>
                      </div>
                      <div style={{ display: "grid", gap: 7 }}>
                        {autoSteps.map((s, i) => (
                          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "9px 12px", background: C.green + "0C", border: `1px solid ${C.green}28`, borderRadius: 10 }}>
                            <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: 99, background: C.green + "22", color: C.green, fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center", marginTop: 1 }}>{i + 1}</span>
                            <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.55 }}>{s.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {teamSteps.length > 0 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                        <Users size={14} style={{ color: C.blue }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.blue, letterSpacing: .5 }}>Your team does this</span>
                      </div>
                      <div style={{ display: "grid", gap: 7 }}>
                        {teamSteps.map((s, i) => (
                          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "9px 12px", background: C.blue + "0C", border: `1px solid ${C.blue}28`, borderRadius: 10 }}>
                            <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: 99, background: C.blue + "22", color: C.blue, fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center", marginTop: 1 }}>{i + 1}</span>
                            <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.55 }}>{s.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "flex-start", background: stage.accent + "12", border: `1px solid ${stage.accent}44`, borderRadius: 12, padding: "13px 16px" }}>
                  <ChevronRight size={16} style={{ color: stage.accent, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: stage.accent, letterSpacing: .5, textTransform: "uppercase" }}>Result</span>
                    <p style={{ fontSize: 14, color: C.ink, margin: "3px 0 0", lineHeight: 1.55 }}>{stage.result}</p>
                  </div>
                </div>

                {nextStage && (
                  <button
                    onClick={() => setActive(nextStage.id)}
                    style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 7, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 14px", color: C.sub, fontSize: 13, cursor: "pointer" }}
                  >
                    <span style={{ fontSize: 14 }}>{nextStage.emoji}</span>
                    Next: {nextStage.name}
                    <ChevronRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: C.amber + "1A", display: "grid", placeItems: "center" }}>
              <ShieldCheck size={15} style={{ color: C.amber }} />
            </span>
            What TintGard owns
          </h2>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {[
              { Icon: Zap, title: "Your own GHL account", desc: "Every automation lives inside TintGard's account. Not shared with anyone else.", color: C.cyan },
              { Icon: Webhook, title: "Your ServiceM8 connection", desc: "The link between CRM and job management is built to your spec, under your control.", color: C.green },
              { Icon: RefreshCw, title: "Full documentation", desc: "Everything is written up so your team can run and update it as you grow.", color: C.purple },
              { Icon: Users, title: "No platform rental", desc: "Unlike white-label SaaS tools, there is no ongoing fee to a third-party platform.", color: C.amber },
            ].map((item, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
                <span style={{ width: 32, height: 32, borderRadius: 9, background: item.color + "18", display: "grid", placeItems: "center", marginBottom: 10 }}>
                  <item.Icon size={16} style={{ color: item.color }} />
                </span>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{item.title}</div>
                <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ marginTop: 40, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>GHL & Automation Specialist · BVN</div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="mailto:bvn@bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Mail size={14} /> bvn@bvnofficial.com
            </a>
            <a href="https://www.bvnofficial.com/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, textDecoration: "none" }}>
              <Megaphone size={14} /> View CV
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
