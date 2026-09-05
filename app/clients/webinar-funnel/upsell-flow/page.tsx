"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, RotateCcw, CheckCircle2, XCircle, CreditCard,
  MonitorPlay, Gift, TrendingDown, PartyPopper, Zap, ShieldCheck,
  Webhook, Clock, PhoneCall, Sparkles, Mail, GitBranch, ListChecks,
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
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.purple }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 27, fontWeight: 800, margin: "8px 0 6px", letterSpacing: -0.4 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 680, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// Interactive funnel simulator — the exact brief, click through every branch
type Node =
  | "register"
  | "upsell"
  | "downsell"
  | "confirm_premium"
  | "confirm_basic"
  | "confirm_free";

type Screen = {
  Icon: typeof Gift;
  tag: string;
  tagColor: string;
  headline: string;
  body: string;
  price?: string;
};

const SCREENS: Record<Node, Screen> = {
  register: {
    Icon: MonitorPlay, tag: "Step 1 · Landing page", tagColor: C.blue,
    headline: "Save your seat for the live webinar",
    body: "The opt in page. Name and email in, contact created in GoHighLevel, tagged to the webinar, and dropped into the reminder sequence. Registering sends them straight to the first offer.",
  },
  upsell: {
    Icon: Gift, tag: "Step 2 · Upsell", tagColor: C.coral, price: "$27",
    headline: "Add the full digital product bundle for $27",
    body: "A one time offer on the way to the confirmation. Their card is already on file from the webinar registration, so buying is a single click, no re entering details.",
  },
  downsell: {
    Icon: TrendingDown, tag: "Step 3 · Downsell", tagColor: C.amber, price: "$17",
    headline: "Not for you at $27? Take the same bundle for $17",
    body: "Only shown to people who said no to the upsell. Same bundle, lower price, one more one click chance before they reach the confirmation. Say no again and they still land safely on the thank you page.",
  },
  confirm_premium: {
    Icon: PartyPopper, tag: "Confirmation · Bundle bought at $27", tagColor: C.green,
    headline: "You are registered, and your bundle is on the way",
    body: "The webinar confirmation and thank you page. Because they took the $27 offer, the purchase is logged in GHL, the receipt fires, and the bundle is delivered automatically. Highest value path.",
  },
  confirm_basic: {
    Icon: PartyPopper, tag: "Confirmation · Bundle bought at $17", tagColor: C.green,
    headline: "You are registered, and your bundle is on the way",
    body: "Same confirmation page, reached through the downsell. They still bought, just at $17. GHL tags them as a customer at the downsell price and delivers the bundle. Revenue you would have lost without the second offer.",
  },
  confirm_free: {
    Icon: PartyPopper, tag: "Confirmation · Registered, no purchase", tagColor: C.cyan,
    headline: "You are registered for the webinar",
    body: "The clean fallback. They said no to both offers and still get a proper confirmation and reminders. Nobody is punished for not buying, and they are still nurtured toward the live event.",
  },
};

type PathStep = { label: string; kind: "step" | "yes" | "no" };

function FunnelSimulator() {
  const [node, setNode] = useState<Node>("register");
  const [path, setPath] = useState<PathStep[]>([{ label: "Registration", kind: "step" }]);

  const go = (next: Node, trail: PathStep) => {
    setPath((p) => [...p, trail]);
    setNode(next);
  };
  const reset = () => {
    setNode("register");
    setPath([{ label: "Registration", kind: "step" }]);
  };

  const s = SCREENS[node];
  const isConfirm = node.startsWith("confirm");

  // Choice buttons per node
  const choices = (() => {
    if (node === "register") {
      return [{ label: "Register and continue", yes: true, onClick: () => go("upsell", { label: "Registered", kind: "step" }) }];
    }
    if (node === "upsell") {
      return [
        { label: "Yes, add it for $27", yes: true, onClick: () => go("confirm_premium", { label: "Yes to $27", kind: "yes" }) },
        { label: "No thanks", yes: false, onClick: () => go("downsell", { label: "No to $27", kind: "no" }) },
      ];
    }
    if (node === "downsell") {
      return [
        { label: "Yes, take it for $17", yes: true, onClick: () => go("confirm_basic", { label: "Yes to $17", kind: "yes" }) },
        { label: "No thanks", yes: false, onClick: () => go("confirm_free", { label: "No to $17", kind: "no" }) },
      ];
    }
    return [];
  })();

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18 }}>
      {/* Path breadcrumbs */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 7, marginBottom: 16 }}>
        {path.map((p, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            {i > 0 && <ArrowRight size={12} color={C.muted} />}
            <span
              style={{
                fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: "4px 10px",
                color: p.kind === "yes" ? C.green : p.kind === "no" ? C.amber : C.sub,
                background: C.card,
                border: `1px solid ${p.kind === "yes" ? C.green : p.kind === "no" ? C.amber : C.border}`,
              }}
            >
              {p.label}
            </span>
          </span>
        ))}
      </div>

      {/* Phone style screen */}
      <motion.div
        key={node}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderTop: `3px solid ${s.tagColor}`, borderRadius: 16, padding: "24px 22px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.tagColor}` }}>
            <s.Icon size={19} color={s.tagColor} />
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: s.tagColor, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 11px" }}>
            {s.tag}
          </span>
          {s.price && (
            <span style={{ marginLeft: "auto", fontSize: 22, fontWeight: 800, color: C.ink }}>{s.price}</span>
          )}
        </div>

        <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, lineHeight: 1.2, marginBottom: 8 }}>{s.headline}</div>
        <p style={{ fontSize: 14.5, color: C.sub, lineHeight: 1.62, margin: 0 }}>{s.body}</p>

        {/* One click badge on paid offers */}
        {(node === "upsell" || node === "downsell") && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 16, fontSize: 12, fontWeight: 700, color: C.green, background: "rgba(52,211,153,0.08)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "6px 12px" }}>
            <CreditCard size={13} /> Card on file · one click purchase, no re entry
          </div>
        )}

        {/* Choices */}
        {choices.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
            {choices.map((c) => (
              <button
                key={c.label}
                onClick={c.onClick}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
                  fontSize: 13.5, fontWeight: 800, borderRadius: 12, padding: "12px 18px",
                  color: c.yes ? C.bg : C.sub,
                  background: c.yes ? C.green : C.card,
                  border: `1px solid ${c.yes ? C.green : C.border}`,
                }}
              >
                {c.yes ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                {c.label}
              </button>
            ))}
          </div>
        )}

        {/* Confirmation reset */}
        {isConfirm && (
          <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.sub }}>
              <Mail size={14} color={C.cyan} /> Confirmation and reminder sequence now running
            </span>
            <button
              onClick={reset}
              style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: C.purple, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "8px 14px" }}
            >
              <RotateCcw size={13} /> Try another path
            </button>
          </div>
        )}
      </motion.div>

      <div style={{ marginTop: 14, fontSize: 12, color: C.muted, textAlign: "center" }}>
        This is the live logic, not a picture of it. Click yes or no and watch the branch you described actually run.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Static funnel map (their brief, one glance)
const MAP = [
  { Icon: MonitorPlay, label: "Landing page", detail: "Webinar registration and opt in", color: C.blue },
  { Icon: Gift, label: "Upsell $27", detail: "Digital bundle · one click", color: C.coral },
  { Icon: TrendingDown, label: "Downsell $17", detail: "Only if they said no", color: C.amber },
  { Icon: PartyPopper, label: "Confirmation", detail: "Thank you · every path ends here", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// How the one click purchase works in GHL
const MECH = [
  { Icon: CreditCard, title: "Card captured once", body: "The webinar registration collects the card through the Stripe integration inside GHL. From then on the buyer is one click away from any offer.", color: C.green },
  { Icon: Zap, title: "One click upsell and downsell", body: "The $27 and $17 offers charge the saved card with a single tap. No second checkout form, which is exactly what lifts the take rate on these offers.", color: C.coral },
  { Icon: GitBranch, title: "Conditional yes and no branching", body: "A yes routes straight to confirmation. A no on the upsell routes to the downsell, and a no there routes to confirmation anyway. Built with GHL funnel steps and workflow conditions.", color: C.purple },
  { Icon: Webhook, title: "Everything logged and triggered", body: "Each purchase tags the contact, records the amount, fires the receipt, delivers the bundle, and starts the right follow up. The funnel and the CRM stay in sync.", color: C.cyan },
];

// ─────────────────────────────────────────────────────────────
// Build plan with the hours estimate baked in
const PLAN = [
  { phase: "Account setup", hours: "3 to 4", body: "Subscription and plan check, core settings, domain and sending setup, and the Stripe payment integration wired and tested.", color: C.blue },
  { phase: "Pages built", hours: "8 to 10", body: "Registration, upsell, downsell, and confirmation pages built to match your reference funnel in structure and style, with your new content and offer.", color: C.coral },
  { phase: "One click and branching", hours: "4 to 6", body: "One click purchase on both offers, the yes and no routing, and the order bump logic, tested end to end with real test transactions.", color: C.purple },
  { phase: "Sequences and QA", hours: "3 to 5", body: "Webinar confirmation and reminder emails and SMS, purchase follow ups, then a full walk of every branch before it goes live.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
// Real proof
const PROOF = [
  { name: "Funnels and payments live in a real account", color: C.coral,
    body: "For a trades client I built the full GoHighLevel environment through the API: pipelines, funnels, forms, calendars, custom fields, and payment flows, on a live account, not a sandbox.",
    tags: ["Funnels", "Payments", "Live account"] },
  { name: "Tiered checkout for a property business", color: C.cyan,
    body: "For a UK property and events company I built membership funnels with tiered checkout, single ticket to VIP, with payment processing and the full upgrade ladder. Registration to purchase is bread and butter.",
    tags: ["Checkout", "Upsell ladder", "Registrations"] },
  { name: "Programmatic GHL builds", color: C.green,
    body: "I build GHL workflows in code with a CLI and Python builders driven by Claude, so funnels and automations come out fast, consistent, and clean, then documented for handover.",
    tags: ["GHL CLI", "Repeatable", "Documented"] },
];

// ─────────────────────────────────────────────────────────────
export default function WebinarFunnel() {
  const heroStats = [
    { k: "On GoHighLevel", v: "since 2019" },
    { k: "Every branch", v: "clickable here" },
    { k: "Rough build", v: "18 to 25 hrs" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.purple, background: "rgba(167,139,250,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.purple }}>
            <MonitorPlay size={15} /> Webinar funnel · registration, upsell, downsell, confirmation
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Your funnel, built and clickable.
            <span style={{ color: C.purple }}> Try every yes and no.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You described a webinar registration with a $27 one click upsell, a $17 downsell for anyone who says no,
            and a confirmation page that every path lands on. Rather than describe my experience, I built the exact
            logic so you can click through it. This is the same flow I would build in your GoHighLevel account.
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

        <Section eyebrow="The map" title="Your brief at a glance" sub="Four pages, one clean path. Every branch, whether they buy or not, ends on the confirmation page so nobody falls out of the funnel.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
            {MAP.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 16px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${m.color}` }}>
                    <m.Icon size={16} color={m.color} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.muted }}>Step {i + 1}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{m.label}</div>
                <div style={{ fontSize: 12.5, color: C.sub, marginTop: 3, lineHeight: 1.4 }}>{m.detail}</div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Click it" title="Walk the funnel yourself" sub="Start at registration, then choose yes or no at each offer. The breadcrumb at the top shows the exact path you took, the same way a real buyer would move through it.">
          <FunnelSimulator />
        </Section>

        <Section eyebrow="The mechanism" title="How the one click and the branching actually work" sub="The part that makes an upsell funnel convert: the card is captured once, and every offer after that is a single tap, with the yes and no logic routing people to the right next page.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {MECH.map((g, i) => (
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

        <Section eyebrow="The plan" title="How I would build it, and roughly how long" sub="You asked for an hours estimate, so here is an honest one by phase. It sizes the job to about 18 to 25 hours of focused work. I would rather quote it as a fixed project so you are paying for the finished funnel, not watching a clock.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {PLAN.map((p, i) => (
              <motion.div
                key={p.phase}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${p.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{p.phase}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: p.color, whiteSpace: "nowrap" }}>{p.hours} hrs</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", flexWrap: "wrap" }}>
            <ListChecks size={16} color={C.purple} />
            <span style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.5 }}>
              Total working estimate: <strong style={{ color: C.ink }}>about 18 to 25 hours</strong>. Final number depends on how built out your reference funnel already is and how much copy is ready. Happy to lock a fixed price on a quick call.
            </span>
          </div>
        </Section>

        <Section eyebrow="Not a mockup" title="Real GHL builds behind this" sub="Client names stay confidential, but each of these is real, live, and mine end to end. Funnels, payments, and registrations are work I ship, not theory.">
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
            <Sparkles size={18} color={C.purple} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Straight up, BVN is not an agency. It is me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            I built this page and the funnel logic it runs on, and I build the client systems behind it with my own
            hands. No team, no handoffs. You work directly with the person building your account, which is why the
            funnel comes out clean and the communication stays clear.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.purple, borderRadius: 999, padding: "10px 16px" }}>
              Portfolio and CV <ArrowRight size={14} />
            </Link>
            <Link href="/case-studies" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
              Case studies <ArrowRight size={14} />
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
