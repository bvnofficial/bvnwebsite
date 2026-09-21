"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ShoppingCart, PackageX, UserPlus, RotateCcw,
  Repeat, Webhook, Braces, GitBranch, Tags, ShieldCheck, Bell,
  Sparkles, PhoneCall, CheckCircle2, Boxes, Zap, Copy, Wrench,
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
// Shopify events → GHL actions
type Ev = {
  id: string; Icon: typeof ShoppingCart; name: string; color: string;
  trigger: string; actions: string[]; result: string;
};
const EVENTS: Ev[] = [
  {
    id: "order", Icon: ShoppingCart, name: "New order", color: C.green,
    trigger: "Shopify fires order/created with the customer, items, and total.",
    actions: [
      "Upsert the contact in GHL, matched by email so no duplicate is created",
      "Tag customer and the product bought, write order value to a field",
      "Move the opportunity to Customer and record the revenue",
      "Start the post purchase flow: receipt, fulfillment update, review request",
    ],
    result: "A buyer becomes a tagged, tracked GHL customer with follow up already running.",
  },
  {
    id: "abandoned", Icon: PackageX, name: "Abandoned checkout", color: C.amber,
    trigger: "Shopify fires checkout/abandoned with the cart and contact.",
    actions: [
      "Create or match the contact, tag abandoned-cart with the product",
      "Drop them into an Abandoned pipeline stage",
      "Fire a recovery sequence: SMS then email with the cart link",
      "Exit the sequence automatically the moment they purchase",
    ],
    result: "Lost carts get chased automatically, and stop the instant the sale lands.",
  },
  {
    id: "customer", Icon: UserPlus, name: "New customer", color: C.blue,
    trigger: "Shopify fires customer/created before any order.",
    actions: [
      "Create the contact in GHL, deduped by email",
      "Tag the source and add to the right audience",
      "Start a welcome and education nurture toward a first purchase",
    ],
    result: "A new signup is captured and nurtured, not left sitting in Shopify alone.",
  },
  {
    id: "refund", Icon: RotateCcw, name: "Refund or cancel", color: C.rose,
    trigger: "Shopify fires refund/created or order/cancelled.",
    actions: [
      "Tag the contact refunded or cancelled and update the order field",
      "Pause any post purchase or review sequence so nothing tone deaf goes out",
      "Notify the team internally to follow up if it matters",
    ],
    result: "The CRM reflects reality, and no automation embarrasses you after a refund.",
  },
  {
    id: "repeat", Icon: Repeat, name: "Repeat buyer", color: C.purple,
    trigger: "A second or third order/created for an existing contact.",
    actions: [
      "Increment lifetime value on the contact record",
      "Tag VIP once they cross a threshold you set",
      "Trigger a cross sell or loyalty campaign for high value buyers",
    ],
    result: "Your best customers are spotted automatically and treated like it.",
  },
];

function EventExplorer() {
  const [id, setId] = useState(EVENTS[0].id);
  const e = EVENTS.find((x) => x.id === id) ?? EVENTS[0];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {EVENTS.map((x) => {
          const on = x.id === id;
          return (
            <button
              key={x.id}
              onClick={() => setId(x.id)}
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

      <motion.div
        key={e.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ background: C.bg2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${e.color}`, borderRadius: 16, padding: "22px 22px" }}
      >
        {/* trigger row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 800, color: e.color, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 11px" }}>
            <Boxes size={13} /> Shopify
          </span>
          <ArrowRight size={15} color={C.muted} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 800, color: C.ink, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 11px" }}>
            <Webhook size={13} /> Webhook or Make
          </span>
          <ArrowRight size={15} color={C.muted} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 800, color: C.green, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 11px" }}>
            <Braces size={13} /> GoHighLevel
          </span>
        </div>

        <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: "0 0 16px" }}>
          <span style={{ color: C.ink, fontWeight: 700 }}>Trigger.</span> {e.trigger}
        </p>

        <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>
          What GHL does
        </div>
        <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
          {e.actions.map((a) => (
            <div key={a} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <CheckCircle2 size={15} color={e.color} style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.5 }}>{a}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, fontWeight: 600, color: C.green, background: "rgba(52,211,153,0.07)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px" }}>
          <Zap size={15} style={{ marginTop: 1, flexShrink: 0 }} /> {e.result}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Wiring options
const WIRING = [
  { Icon: Webhook, title: "Direct webhooks", body: "Shopify webhooks post straight to a GHL inbound workflow or a small endpoint, the fastest and cleanest path when the mapping is simple.", color: C.cyan },
  { Icon: Zap, title: "Make or Zapier", body: "For branching, enrichment, or talking to a third tool, I route through Make so the logic is visible and easy to change.", color: C.amber },
  { Icon: Braces, title: "Direct API when needed", body: "Where a scenario gets heavy or rate limits bite, I write a small custom relay against the Shopify and GHL APIs for full control.", color: C.purple },
];

// ─────────────────────────────────────────────────────────────
// Data integrity + reliability (their must-haves)
const INTEGRITY = [
  { Icon: Copy, title: "No duplicate contacts", body: "Every event matches on email before it creates anything, so one customer is one contact, not three." },
  { Icon: Tags, title: "Clean tags and naming", body: "One tagging and naming convention across events, so segments and Smart Lists stay reliable as volume grows." },
  { Icon: GitBranch, title: "No double fires or loops", body: "Dedupe checks and clear entry and exit criteria, so an overlap never sends the same message twice or chases its own tail." },
  { Icon: Wrench, title: "Fast to diagnose", body: "When an integration breaks, I read the webhook logs and the workflow history to find the real cause, then fix it, not guess." },
];

// ─────────────────────────────────────────────────────────────
export default function ShopifyGhl() {
  const heroStats = [
    { k: "On GoHighLevel", v: "since 2019" },
    { k: "Five store events", v: "clickable here" },
    { k: "Contacts", v: "deduped and clean" },
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
            <Boxes size={15} /> Shopify · GoHighLevel · event driven automation
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Real store events, wired into GHL.
            <span style={{ color: C.green }}> Click any one.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 700, lineHeight: 1.6 }}>
            You want GoHighLevel triggered by real business events and kept clean at volume. So here is a Shopify to GHL
            integration you can click through: pick a store event and watch exactly what GHL does, how it is wired, and
            how it stays deduped, tagged, and reliable when the money is on the line.
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

        <Section eyebrow="Click it" title="Pick a Shopify event, see the GHL response" sub="Each of these is a real Shopify webhook. Tap one to see the trigger, everything GHL does in response, and the outcome. This is the integration logic, not a picture of it.">
          <EventExplorer />
        </Section>

        <Section eyebrow="How it connects" title="Three ways I wire Shopify to GHL" sub="I pick the simplest path that holds up. Native webhooks first, Make when there is real logic, custom code only when the job demands it.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {WIRING.map((g, i) => (
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

        <Section eyebrow="Data integrity" title="The part that keeps it trustworthy at volume" sub="Real lead volume and real money means the integration cannot be flaky. This is how I keep the data clean and the automations honest.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {INTEGRITY.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px" }}
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
            I built this page and the integration logic it shows, and I build the client systems behind it with my own
            hands. No team, no handoffs. You get one person who architects the system, wires the integrations, and can
            get on a call and explain it clearly to a client, which is exactly what this role is asking for.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Bell size={13} /> Works EST hours</span>
        </div>
      </div>
    </div>
  );
}
