"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, RotateCcw, Megaphone, FileDown, MessageSquare,
  Mail, CalendarCheck, Braces, Receipt, PiggyBank, Building2,
  FileText, Zap, Target, ShieldCheck, Clock, Sparkles, PhoneCall, CheckCircle2,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.green }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 680, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// Interactive funnel: ad to booked consult
type Node = "ad" | "landing" | "captured" | "nurture" | "booked";
type Screen = {
  Icon: typeof Megaphone; tag: string; color: string;
  headline: string; body: string; ghl: string;
};
const SCREENS: Record<Node, Screen> = {
  ad: {
    Icon: Megaphone, tag: "Step 1 · The ad", color: C.blue,
    headline: "Save more on your taxes this year",
    body: "A Google or Facebook ad targeting local people who need tax help, pointing at a free lead magnet, not a cold sales pitch. The offer is the checklist, not the call, which is what gets the click.",
    ghl: "Campaign and ad set tracked as the lead source from the first click",
  },
  landing: {
    Icon: FileDown, tag: "Step 2 · Lead magnet landing page", color: C.coral,
    headline: "Free: the 2026 Tax Deduction Checklist",
    body: "A clean GoHighLevel landing page with one job, trade an email and phone for the checklist. Mobile first, fast, one form, no distractions. This is where a cold click becomes a lead.",
    ghl: "Contact created in GHL, tagged tax-lead, source and campaign written to fields",
  },
  captured: {
    Icon: MessageSquare, tag: "Step 3 · Instant text back and email", color: C.amber,
    headline: "Your checklist is on the way",
    body: "The second they opt in, an automated SMS and email deliver the checklist. Speed to lead is everything, so the first touch happens in seconds, while they are still thinking about their taxes.",
    ghl: "Workflow fires: SMS with the download, email with the PDF, contact enrolled in nurture",
  },
  nurture: {
    Icon: Mail, tag: "Step 4 · Nurture sequence", color: C.purple,
    headline: "A few helpful emails, then the offer",
    body: "A short sequence that gives real tax value, common missed deductions, deadlines, what to bring, then invites them to book a consultation. Educate first, sell second, so the booking feels natural.",
    ghl: "Multi step email and SMS nurture, with a booking link and no double sends",
  },
  booked: {
    Icon: CalendarCheck, tag: "Outcome · consultation booked", color: C.green,
    headline: "Consultation booked, reminders running",
    body: "The lead books a tax consultation on the calendar, gets confirmation and reminders, and the pipeline moves to booked. From ad click to a booked consult, hands off. No shows get an automatic rebooking nudge.",
    ghl: "Calendar event created, pipeline moved, reminder and no show workflows armed",
  },
};

function Funnel() {
  const order: Node[] = ["ad", "landing", "captured", "nurture", "booked"];
  const [idx, setIdx] = useState(0);
  const node = order[idx];
  const s = SCREENS[node];
  const atEnd = idx === order.length - 1;

  const stepLabels = ["Ad", "Landing", "Opt in", "Nurture", "Booked"];

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18 }}>
      {/* Progress */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 7, marginBottom: 16 }}>
        {stepLabels.map((l, i) => (
          <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            {i > 0 && <ArrowRight size={12} color={C.muted} />}
            <span style={{
              fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: "4px 10px",
              color: i <= idx ? C.bg : C.sub,
              background: i <= idx ? C.green : C.card,
              border: `1px solid ${i <= idx ? C.green : C.border}`,
            }}>{l}</span>
          </span>
        ))}
      </div>

      <motion.div
        key={node}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${s.color}`, borderRadius: 16, padding: "24px 22px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}` }}>
            <s.Icon size={19} color={s.color} />
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: s.color, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 11px" }}>
            {s.tag}
          </span>
        </div>

        <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, lineHeight: 1.2, marginBottom: 8 }}>{s.headline}</div>
        <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: "0 0 14px" }}>{s.body}</p>

        <div style={{ display: "inline-flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, fontWeight: 600, color: C.cyan, background: "rgba(34,211,238,0.07)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px" }}>
          <Braces size={14} style={{ marginTop: 1, flexShrink: 0 }} /> In GHL: {s.ghl}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
          {!atEnd ? (
            <button
              onClick={() => setIdx((i) => i + 1)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 800, borderRadius: 12, padding: "12px 18px", color: C.bg, background: C.green, border: `1px solid ${C.green}` }}
            >
              Next step <ArrowRight size={15} />
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", width: "100%" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.sub }}>
                <CheckCircle2 size={14} color={C.green} /> Ad to landing page to GHL to appointment, one path
              </span>
              <button
                onClick={() => setIdx(0)}
                style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: C.green, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "8px 14px" }}
              >
                <RotateCcw size={13} /> Start over
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Lead magnet ideas for tax
const MAGNETS = [
  { Icon: FileText, title: "Tax Deduction Checklist", body: "The everyday winner. A simple list of commonly missed deductions people can check against their own situation.", color: C.coral },
  { Icon: PiggyBank, title: "Small Business Tax Savings Guide", body: "For self employed and small business owners, the write offs and moves that keep more money in the business.", color: C.green },
  { Icon: Receipt, title: "What To Bring To Your Tax Prep", body: "A document checklist that doubles as a soft booking prompt. Useful, and it pulls them toward an appointment.", color: C.amber },
  { Icon: Building2, title: "Free Tax Savings Assessment", body: "A short quiz or form that gives a tailored result, then routes the lead into the right nurture based on their answers.", color: C.blue },
];

// ─────────────────────────────────────────────────────────────
// How I would approach the ads (honest, forward looking)
const ADS = [
  { Icon: Target, title: "Offer led ads, not cold pitches", body: "Ads point at a free lead magnet, so the click is low friction. The sale happens later in the nurture, which lifts lead volume and lowers cost per lead." },
  { Icon: Zap, title: "Google and Facebook into GHL", body: "Facebook Lead Ads map straight into GHL with the right fields, tags, and source, and Google Ads drive to the landing page with conversion tracking. I am Google Ads certified and build these flows regularly." },
  { Icon: Braces, title: "Tracking that proves ROI", body: "Pixel, conversion tracking, and source attribution wired in from day one, so we can see cost per lead, cost per booked consult, and which ads actually produce clients." },
];

// ─────────────────────────────────────────────────────────────
export default function TaxFunnel() {
  const heroStats = [
    { k: "On GoHighLevel", v: "since 2019" },
    { k: "Google Ads", v: "certified" },
    { k: "The path", v: "ad to consult" },
    { k: "Runs on", v: "one person" },
  ];

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 22px 100px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 34 }}>
          <a href="https://www.bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            <ArrowLeft size={15} /> BVN Official
          </a>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.green, background: "rgba(52,211,153,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.green }}>
            <Megaphone size={15} /> Tax service lead funnel · ad to booked consult
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            A tax lead funnel you can click.
            <span style={{ color: C.green }}> From the ad to a booked consult.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You need leads for a tax service and a GoHighLevel funnel that turns them into booked consultations. So I
            built the funnel I would build for you and made it clickable, ad to landing page to GHL to appointment,
            with the lead magnet and the follow up automation behind it.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 24 }}>
            {heroStats.map((st) => (
              <div key={st.k}>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>{st.v}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{st.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <Section eyebrow="Click it" title="Walk the funnel from ad to booking" sub="Step through the exact path a tax lead takes, and see what GoHighLevel records and triggers at each step. This is the funnel and automation, not a picture of it.">
          <Funnel />
        </Section>

        <Section eyebrow="Lead magnets" title="What actually pulls tax leads in" sub="The ad is only as good as the offer behind it. These are lead magnets that fit a tax service, built as GHL landing pages with the form wired into the funnel above.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {MAGNETS.map((g, i) => (
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

        <Section eyebrow="The ads" title="How I would run and connect the ads" sub="Straight with you: I have not run ads for a tax company specifically. What I bring is the funnel, the GHL side, and the ad to lead flow done right, plus Google Ads certification and hands on Facebook Lead Ads into GHL. Here is how I would approach the paid side for a tax service.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {ADS.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.green}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <g.Icon size={18} color={C.green} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{g.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{g.body}</p>
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
            <Sparkles size={18} color={C.green} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I built this page and the funnel logic it runs on myself, and I would build your tax funnel the same way.
            No team, no handoffs. You work directly with the person doing the work, and I tell you plainly what I have
            done before and what I would be doing for the first time.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.green, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
            <Link href="/intro" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
              Intro video <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Contact */}
        <div style={{ marginTop: 34, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <ShieldCheck size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PhoneCall size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps United States hours daily</span>
        </div>
      </div>
    </div>
  );
}
