"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CreditCard, CalendarCheck, CheckCircle2, Plus,
  RefreshCw, User, Users, Shield, Nfc, Sparkles, Gift, MapPin, BarChart3,
  Bell, Rocket, Clock, PhoneCall, Database, Bot, Smartphone, Wallet,
  Navigation, Activity, Layers,
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
// 1. Live credit membership dashboard (interactive, answers Q3)
type Appt = { id: number; who: string; when: string };
const PLAN = { name: "Monthly Flex", perCycle: 8 };
const SEED_CREDITS = 5;
const SEED_APPTS: Appt[] = [
  { id: 1, who: "Maya R.", when: "Thu 6:00 pm, home" },
  { id: 2, who: "Devon K.", when: "Sun 10:30 am, gym" },
];
const SLOT_POOL = [
  { who: "Priya S.", when: "Tue 7:30 am, office" },
  { who: "Maya R.", when: "Fri 5:15 pm, hotel" },
  { who: "Devon K.", when: "Mon 9:00 am, home" },
];

function MembershipDashboard() {
  const [credits, setCredits] = useState(SEED_CREDITS);
  const [appts, setAppts] = useState<Appt[]>(SEED_APPTS);
  const [log, setLog] = useState<string[]>(["Membership active. Renews monthly."]);
  const [nid, setNid] = useState(3);
  const [slotIdx, setSlotIdx] = useState(0);

  const note = (m: string) => setLog((p) => [m, ...p].slice(0, 5));

  const book = () => {
    const s = SLOT_POOL[slotIdx % SLOT_POOL.length];
    setAppts((p) => [...p, { id: nid, who: s.who, when: s.when }]);
    setNid((n) => n + 1);
    setSlotIdx((i) => i + 1);
    note(`Booked ${s.who}, ${s.when}.`);
  };

  const complete = () => {
    if (appts.length === 0) { note("No upcoming session. Book one first."); return; }
    if (credits <= 0) { note("Out of credits. Time to renew or buy more."); return; }
    const done = appts[0];
    setAppts((p) => p.slice(1));
    setCredits((c) => c - 1);
    note(`Session with ${done.who} completed. 1 credit used.`);
  };

  const buy = () => { setCredits((c) => c + 5); note("Bought 5 extra credits."); };
  const renew = () => { setCredits((c) => c + PLAN.perCycle); note(`Auto renewal. ${PLAN.perCycle} credits added.`); };
  const reset = () => { setCredits(SEED_CREDITS); setAppts(SEED_APPTS); setLog(["Membership active. Renews monthly."]); setNid(3); setSlotIdx(0); };

  const actions = [
    { label: "Complete a session", Icon: CheckCircle2, onClick: complete, color: C.green },
    { label: "Book a session", Icon: CalendarCheck, onClick: book, color: C.blue },
    { label: "Buy 5 credits", Icon: Plus, onClick: buy, color: C.amber },
    { label: "Renew now", Icon: RefreshCw, onClick: renew, color: C.purple },
  ];

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px 22px", display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.coral }}>
            <CreditCard size={14} /> Credits left
          </div>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={credits}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{ fontSize: 40, fontWeight: 800, color: C.ink, lineHeight: 1.1, marginTop: 4 }}
            >
              {credits}
            </motion.div>
          </AnimatePresence>
          <div style={{ fontSize: 12, color: C.muted }}>{PLAN.name}, {PLAN.perCycle} a month</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", gridColumn: "span 2" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.blue, marginBottom: 8 }}>
            <CalendarCheck size={14} /> Upcoming appointments
          </div>
          {appts.length === 0 ? (
            <div style={{ fontSize: 13, color: C.muted, paddingTop: 4 }}>Nothing booked. Tap Book a session.</div>
          ) : (
            <div style={{ display: "grid", gap: 6 }}>
              <AnimatePresence mode="popLayout">
                {appts.map((a) => (
                  <motion.div
                    key={a.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.sub, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 9, padding: "7px 10px" }}
                  >
                    <User size={13} color={C.cyan} />
                    <span style={{ fontWeight: 700, color: C.ink }}>{a.who}</span>
                    <span style={{ color: C.muted }}>{a.when}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontSize: 12.5, fontWeight: 700, cursor: "pointer", color: C.ink,
              background: C.card, border: `1px solid ${a.color}`, borderRadius: 999, padding: "9px 14px",
            }}
          >
            <a.Icon size={14} color={a.color} /> {a.label}
          </button>
        ))}
        <button
          onClick={reset}
          style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: C.muted, cursor: "pointer", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 999, padding: "9px 13px" }}
        >
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      <div>
        <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, color: C.muted, marginBottom: 8 }}>Activity</div>
        <div style={{ display: "grid", gap: 6 }}>
          <AnimatePresence mode="popLayout">
            {log.map((l, i) => (
              <motion.div
                key={l + i}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: i === 0 ? C.ink : C.muted }}
              >
                <Activity size={12} color={i === 0 ? C.green : C.muted} /> {l}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Tap to pay flow (interactive, answers Q4)
type Pay = { n: string; title: string; detail: string; color: string };
const PAYFLOW: Pay[] = [
  { n: "01", title: "Session ends", detail: "The therapist opens the StretchTo.You therapist app at the client's home, office, or hotel and marks the session complete.", color: C.coral },
  { n: "02", title: "Tap to pay", detail: "The client taps a card or phone on the therapist's device. No card reader to carry, tap to pay runs on the phone itself through Stripe.", color: C.blue },
  { n: "03", title: "Membership aware", detail: "The system checks the account. A member with credits simply has one credit deducted and pays nothing more. A non member is charged the drop in rate and offered a membership on the spot.", color: C.green },
  { n: "04", title: "Everything syncs", detail: "Payment, credit balance, therapist earnings, and the customer dashboard all update in real time, so the books are always right without anyone reconciling by hand.", color: C.purple },
];

function TapToPay() {
  const [i, setI] = useState(0);
  const s = PAYFLOW[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {PAYFLOW.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.n}
              onClick={() => setI(idx)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
                background: on ? C.cardHi : C.card, border: `1px solid ${on ? st.color : C.border}`,
                borderRadius: 12, padding: "10px 13px", transition: "all 0.16s",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 800, color: st.color }}>{st.n}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: on ? C.ink : C.sub }}>{st.title}</span>
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
          style={{ display: "flex", gap: 14, alignItems: "flex-start", background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${s.color}`, borderRadius: 16, padding: "20px 20px" }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}`, flexShrink: 0 }}>
            <Nfc size={20} color={s.color} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, marginBottom: 5 }}>{s.title}</div>
            <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.6, margin: 0 }}>{s.detail}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Recommended stack (Q2)
const STACK = [
  { Icon: Layers, name: "Website and apps", pick: "Next.js and React on Vercel", why: "Fast, high converting, and the same team and codebase carries into React Native apps later.", color: C.coral },
  { Icon: Database, name: "Backend, data, auth", pick: "Supabase", why: "Postgres, secure auth, row level security, edge functions, and realtime. The scalable core the whole platform sits on.", color: C.green },
  { Icon: CreditCard, name: "Payments and billing", pick: "Stripe Billing and Tap to Pay", why: "Subscriptions, recurring credits, gift cards, and in person tap to pay on the therapist's phone, all in one payments layer.", color: C.blue },
  { Icon: Users, name: "CRM and marketing", pick: "GoHighLevel", why: "CRM, reminders, promos, referral, and review requests live in weeks while the coded core matures. Fast to launch, easy to run.", color: C.purple },
  { Icon: Bell, name: "Notifications", pick: "Twilio and email", why: "Text and email reminders now, push notifications once the apps ship. Reliable and compliant.", color: C.amber },
  { Icon: Bot, name: "AI layer", pick: "Claude and OpenAI", why: "A booking assistant, personalised stretch plans, and back office automation that trims manual work as you scale.", color: C.cyan },
];

// ─────────────────────────────────────────────────────────────
// 4. Three portals (interactive tabs)
type Portal = "customer" | "therapist" | "admin";
const PORTALS: Record<Portal, { label: string; Icon: typeof User; color: string; items: string[] }> = {
  customer: { label: "Customer", Icon: User, color: C.coral, items: [
    "Remaining credits, upcoming appointments, and membership details at a glance",
    "Book, reschedule, or cancel in a few taps",
    "Buy extra credits, gift cards, and share a referral link",
    "Manage the subscription and payment method",
  ] },
  therapist: { label: "Therapist", Icon: Navigation, color: C.cyan, items: [
    "Today's schedule and each client's notes and history",
    "Set availability and accept or decline jobs",
    "Navigate to the appointment and mark it complete",
    "Take tap to pay and watch earnings update",
  ] },
  admin: { label: "Admin", Icon: Shield, color: C.purple, items: [
    "Manage customers, memberships, therapists, and payments",
    "Promo codes, referral program, and gift card ledger",
    "Automated workflows, notifications, and CRM sync",
    "Analytics and reporting across the whole business",
  ] },
};

function Portals() {
  const [tab, setTab] = useState<Portal>("customer");
  const p = PORTALS[tab];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(Object.keys(PORTALS) as Portal[]).map((k) => {
          const on = k === tab;
          const item = PORTALS[k];
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, cursor: "pointer",
                color: on ? C.bg : C.sub, background: on ? item.color : C.card,
                border: `1px solid ${on ? item.color : C.border}`, borderRadius: 999, padding: "9px 15px", transition: "all 0.16s",
              }}
            >
              <item.Icon size={14} /> {item.label} portal
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${p.color}`, borderRadius: 16, padding: "20px 22px", display: "grid", gap: 10 }}
        >
          {p.items.map((it) => (
            <div key={it} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <CheckCircle2 size={15} color={p.color} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.5 }}>{it}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. Features I would add (Q5)
const FEATURES = [
  { Icon: Sparkles, title: "AI stretch plan after every session", body: "The therapist's notes become a personalised routine with short videos the client keeps. It adds value between visits and keeps memberships sticky.", color: C.coral },
  { Icon: Bell, title: "Smart rebooking nudge", body: "The system watches credits and gaps and nudges the client to book their next session before a credit sits unused, so retention rises on its own.", color: C.amber },
  { Icon: BarChart3, title: "Churn radar and win back", body: "Members who stop booking get flagged and dropped into an automatic win back sequence before they cancel.", color: C.cyan },
  { Icon: Users, title: "Corporate and office plans", body: "Bulk credit packages for teams and offices, a natural higher value channel for an at work stretching service.", color: C.green },
  { Icon: MapPin, title: "Nearby therapist matching", body: "As you add cities, match on location, rating, and availability, with a waitlist and surge logic when demand runs hot.", color: C.purple },
  { Icon: Gift, title: "Two sided referral credits", body: "Both the referrer and the new client get a credit, turning happy members into your cheapest growth channel.", color: C.rose },
];

// ─────────────────────────────────────────────────────────────
// 6. Future vision (two app marketplace)
const VISION = [
  { Icon: Smartphone, title: "Client app", body: "See nearby stretch therapists, book instantly, manage the membership, buy credits, track appointments, and get notifications.", color: C.coral },
  { Icon: Wallet, title: "Therapist app", body: "Accept jobs, manage a schedule, navigate to appointments, mark sessions complete, take payment, and view earnings.", color: C.cyan },
  { Icon: Rocket, title: "Multi city marketplace", body: "The same coded core scales city by city into a two sided marketplace, without rebuilding the foundation each time.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
export default function StretchToYou() {
  const heroStats = useMemo(
    () => [
      { k: "Membership", v: "credit based" },
      { k: "Payments", v: "subs + tap to pay" },
      { k: "Built to", v: "scale to cities" },
      { k: "One partner", v: "full stack" },
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
            Built for StretchTo.You
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.coral }}>
            <Sparkles size={15} /> StretchTo.You · Platform prototype
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Not a website. A company,
            <span style={{ color: C.coral }}> built to stretch into many cities.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 680, lineHeight: 1.6 }}>
            You asked how the membership, the payments, and the stack would actually work. Rather than tell you,
            here it is running. The credit dashboard below is live, complete a session and watch a credit come
            off, then see the tap to pay flow, the recommended stack, and where it grows.
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

        <Section eyebrow="The membership, live" title="Credit based memberships, actually working" sub="This is your credit system, not a picture of one. Complete a session to deduct a credit, book more, buy extra, or trigger the monthly auto renewal. Every action updates the balance and the log in real time.">
          <MembershipDashboard />
        </Section>

        <Section eyebrow="Your question four" title="Tap to pay, connected to memberships" sub="How in person payment ties back to a membership is the clever part. Click through what happens when a therapist takes payment at the end of a session.">
          <TapToPay />
        </Section>

        <Section eyebrow="Your question two" title="The stack I would recommend" sub="Launch fast and scale without a rebuild. Stand up CRM and marketing in weeks while the coded core grows underneath, then carry the same foundation into the apps.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {STACK.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <s.Icon size={18} color={s.color} />
                  <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 700 }}>{s.name}</span>
                </div>
                <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink, marginBottom: 6 }}>{s.pick}</div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{s.why}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Three portals" title="Customer, therapist, and admin" sub="One platform, three views. Tap each to see what that person gets on day one, all the way to the apps later.">
          <Portals />
        </Section>

        <Section eyebrow="Your question five" title="If it were my company, I would add" sub="You said you want ideas, not just instructions. Here is where I would push StretchTo.You beyond the brief to protect retention and fuel growth.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${f.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <f.Icon size={18} color={f.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{f.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{f.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Where it grows" title="From one platform to two apps" sub="Built with growth in mind, so the leap to a client app and a therapist app across many cities is an expansion, not a restart.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {VISION.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <v.Icon size={20} color={v.color} />
                <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink, margin: "10px 0 6px" }}>{v.title}</div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{v.body}</p>
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
            I designed and coded this prototype, the way I would build the real thing: development, design,
            automation, and marketing under one roof, mine. One accountable partner who thinks like an owner, and
            who brings in trusted hands only when scale demands it, never a handoff you did not ask for.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps North America hours daily</span>
        </div>
      </div>
    </div>
  );
}
