"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Search, Gauge, MapPin, Bot, CheckCircle2,
  AlertTriangle, Wrench, TrendingUp, TrendingDown, Star, Layers, Zap,
  MessageSquare, BarChart3, Sparkles, Clock, PhoneCall, Globe,
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
// 1. SEO audit (interactive tabs, answers their SEO scope)
type Status = "good" | "warn" | "fix";
type Cat = { id: string; label: string; Icon: typeof Search; score: number; items: { txt: string; s: Status }[] };

const CATS: Cat[] = [
  {
    id: "onpage", label: "On page", Icon: Search, score: 88,
    items: [
      { txt: "Title tags and meta descriptions unique and keyword targeted", s: "good" },
      { txt: "Heading hierarchy clean, one H1 per page", s: "good" },
      { txt: "Image alt text present and descriptive", s: "warn" },
      { txt: "Internal linking to priority pages", s: "warn" },
      { txt: "Content matches search intent", s: "good" },
    ],
  },
  {
    id: "technical", label: "Technical", Icon: Gauge, score: 82,
    items: [
      { txt: "Core Web Vitals passing on mobile and desktop", s: "warn" },
      { txt: "Schema markup on key page types", s: "fix" },
      { txt: "XML sitemap submitted and indexing clean", s: "good" },
      { txt: "HTTPS, canonicals, and no crawl errors", s: "good" },
      { txt: "Mobile first and responsive", s: "good" },
    ],
  },
  {
    id: "local", label: "Local", Icon: MapPin, score: 79,
    items: [
      { txt: "Google Business Profile complete and verified", s: "good" },
      { txt: "NAP consistent across citations", s: "warn" },
      { txt: "Location and service pages with local content", s: "warn" },
      { txt: "Review volume and response cadence", s: "fix" },
      { txt: "Local schema and map embed", s: "good" },
    ],
  },
  {
    id: "aisearch", label: "AI search", Icon: Bot, score: 91,
    items: [
      { txt: "llms.txt published so AI crawlers find the right pages", s: "good" },
      { txt: "FAQ and structured data feeding answer engines", s: "good" },
      { txt: "robots welcomes ChatGPT, Gemini, and Perplexity bots", s: "good" },
      { txt: "Entity and answer focused content, not just keywords", s: "warn" },
      { txt: "Cited as a source in AI answers, tracked monthly", s: "warn" },
    ],
  },
];

const STAT: Record<Status, { label: string; color: string; Icon: typeof CheckCircle2 }> = {
  good: { label: "Good", color: C.green, Icon: CheckCircle2 },
  warn: { label: "Improve", color: C.amber, Icon: AlertTriangle },
  fix: { label: "Fix now", color: C.rose, Icon: Wrench },
};

function Audit() {
  const [id, setId] = useState(CATS[0].id);
  const cat = CATS.find((c) => c.id === id) ?? CATS[0];
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {CATS.map((c) => {
          const on = c.id === id;
          return (
            <button
              key={c.id}
              onClick={() => setId(c.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                color: on ? C.bg : C.sub, background: on ? C.coral : C.card,
                border: `1px solid ${on ? C.coral : C.border}`, borderRadius: 999, padding: "8px 14px", transition: "all 0.16s",
              }}
            >
              <c.Icon size={14} /> {c.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 20px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 58, height: 58, borderRadius: 14, display: "grid", placeItems: "center", background: C.card, border: `2px solid ${cat.score >= 85 ? C.green : cat.score >= 78 ? C.amber : C.rose}` }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: C.ink }}>{cat.score}</span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{cat.label} SEO score</div>
              <div style={{ fontSize: 12.5, color: C.muted }}>Sample audit of a client site, out of 100</div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {cat.items.map((it) => {
              const st = STAT[it.s];
              return (
                <div key={it.txt} style={{ display: "flex", alignItems: "flex-start", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
                  <st.Icon size={15} color={st.color} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.45, flexGrow: 1 }}>{it.txt}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: st.color, textTransform: "uppercase", letterSpacing: 0.4, flexShrink: 0 }}>{st.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Monthly reporting dashboard
type M = "this" | "last";
const REPORT: Record<M, { kw: number; sessions: number; gbp: number; ai: number; movers: { term: string; pos: number; change: number }[] }> = {
  this: {
    kw: 34, sessions: 5120, gbp: 412, ai: 9,
    movers: [
      { term: "emergency plumber near me", pos: 3, change: 4 },
      { term: "bathroom remodel [city]", pos: 6, change: 2 },
      { term: "boiler service cost", pos: 11, change: -1 },
    ],
  },
  last: {
    kw: 28, sessions: 4360, gbp: 351, ai: 6,
    movers: [
      { term: "emergency plumber near me", pos: 7, change: 3 },
      { term: "bathroom remodel [city]", pos: 8, change: 1 },
      { term: "boiler service cost", pos: 10, change: 2 },
    ],
  },
};

function Dashboard() {
  const [m, setM] = useState<M>("this");
  const d = REPORT[m];
  const kpis = [
    { label: "Keywords in top 10", value: d.kw, Icon: TrendingUp, color: C.green },
    { label: "Organic sessions", value: d.sessions.toLocaleString(), Icon: Search, color: C.blue },
    { label: "Google Business actions", value: d.gbp, Icon: MapPin, color: C.amber },
    { label: "AI answer citations", value: d.ai, Icon: Bot, color: C.purple },
  ];
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px 20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <BarChart3 size={18} color={C.coral} />
        <span style={{ fontSize: 14, fontWeight: 800 }}>Monthly SEO progress</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: 4 }}>
          {(["this", "last"] as M[]).map((w) => (
            <button
              key={w}
              onClick={() => setM(w)}
              style={{ fontSize: 12, fontWeight: 700, cursor: "pointer", borderRadius: 999, padding: "5px 12px", border: "none", color: m === w ? C.bg : C.sub, background: m === w ? C.coral : "transparent" }}
            >
              {w === "this" ? "This month" : "Last month"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 18 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 15px" }}>
            <k.Icon size={15} color={k.color} />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${m}-${k.label}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginTop: 7 }}
              >
                {k.value}
              </motion.div>
            </AnimatePresence>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 800, color: C.sub, marginBottom: 10 }}>Keyword movement</div>
      <div style={{ display: "grid", gap: 8 }}>
        {d.movers.map((mv) => (
          <div key={mv.term} style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
            <span style={{ fontSize: 12.5, color: C.ink, flexGrow: 1 }}>{mv.term}</span>
            <span style={{ fontSize: 12, color: C.muted }}>position {mv.pos}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 800, color: mv.change >= 0 ? C.green : C.rose }}>
              {mv.change >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {Math.abs(mv.change)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. The GHL side
const GHL = [
  { Icon: Layers, title: "Sub accounts and snapshots", body: "New client sub accounts built from proven snapshots, branded, integrated, and live fast.", color: C.coral },
  { Icon: Zap, title: "Automations and pipelines", body: "Lead intake, follow up, booking, and no show workflows, plus SMS and email campaigns and calendars.", color: C.cyan },
  { Icon: Star, title: "Reputation and reviews", body: "Review request automations and reputation management wired into the client journey.", color: C.amber },
  { Icon: MessageSquare, title: "Integrations", body: "Stripe, Twilio, and Mailgun connected under GHL, with deliverability set up properly.", color: C.green },
];

// ─────────────────────────────────────────────────────────────
export default function PryntSeoAiSearch() {
  const heroStats = useMemo(
    () => [
      { k: "Duda", v: "2 years" },
      { k: "GHL since", v: "2019" },
      { k: "SEO edge", v: "AI search" },
      { k: "Built by", v: "one person" },
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
            Built for PRYNT Digital
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.green }}>
            <Search size={15} /> SEO, AI search, and the GHL side
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            Ranking on Google is table stakes.
            <span style={{ color: C.coral }}> I get you found by the AI answers too.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 680, lineHeight: 1.6 }}>
            You listed AI search optimization as a bonus. It is one of my strongest areas, and I have already
            done it on my own site. Here is how I run SEO between builds: an on page, technical, local, and AI
            search audit, a monthly report, and the GoHighLevel side, which is a full match for what you need.
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

        <Section eyebrow="The audit" title="How I look at a client site" sub="On page, technical, local, and AI search, each scored with the specific items I would fix. Click a tab. This is a sample audit, but it is exactly how I work.">
          <Audit />
        </Section>

        <Section eyebrow="The reporting" title="Progress you can actually read" sub="Not a raw export. Keywords in the top 10, organic sessions, Google Business actions, and how often the site gets cited in AI answers, month over month.">
          <Dashboard />
        </Section>

        <Section eyebrow="The CRM half" title="GoHighLevel, a full match" sub="Web is your primary need, but the GHL side of this role is squarely my home turf. Everything you listed, I do already.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {GHL.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${g.color}`, borderRadius: 14, padding: "18px 18px" }}
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

        <Section eyebrow="On the web build" title="Two years on Duda, and a coder underneath" sub="Web is your primary need, so here is exactly where I stand on it.">
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.blue}`, borderRadius: 14, padding: "20px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Globe size={18} color={C.blue} />
              <span style={{ fontSize: 15.5, fontWeight: 800, color: C.ink }}>Duda, with a coding toolkit behind it</span>
            </div>
            <p style={{ fontSize: 13.5, color: C.sub, margin: 0, lineHeight: 1.6 }}>
              I have built on Duda for two years, informational sites, ecommerce, and custom layouts, with the
              fast turnaround and clean execution you are after. It is drag and drop, close to WordPress and Wix,
              so I move quickly in it. What sets me apart is what sits underneath: I also build by hand in
              WordPress, React, Next.js, and Shopify, including this page, so when a Duda build needs custom code
              or a tricky fix, I am not stuck. A fast Duda builder who actually understands the web, paired with a
              GHL and SEO skill set that is already exactly what you described.
            </p>
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
            I designed and coded this page, run my own SEO and AI search setup, and build every client system
            myself. One reliable self starter who overlaps your US hours, does clean work, and does not need
            micromanaging. Exactly the kind of person you said you want to treat like family.
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps US hours, CST friendly</span>
        </div>
      </div>
    </div>
  );
}
