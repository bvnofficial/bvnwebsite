"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Database, Search, Plug, Globe, Filter, Boxes,
  RefreshCw, Code2, MousePointer, ShieldCheck, Gauge, Radar, Webhook,
  Table, Zap, Terminal, CheckCircle2, Clock, PhoneCall,
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
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 660, lineHeight: 1.6, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 22 }}>{children}</div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. The pipeline (interactive)
type Stage = { Icon: typeof Database; title: string; tag: string; detail: string; color: string };
const STAGES: Stage[] = [
  { Icon: Search, title: "Research and integrate APIs", tag: "Source discovery", color: C.blue,
    detail: "Map every target listing platform, find where an official or partner API exists, and integrate it first. APIs are always preferred over scraping when they are available, they are cleaner and more stable." },
  { Icon: Plug, title: "Ingest at scale", tag: "Pipelines", color: C.cyan,
    detail: "Build ingestion pipelines that handle authentication, pagination, and rate limits, pulling listings reliably and backing off politely so a source never cuts us off." },
  { Icon: Globe, title: "Scrape where no API exists", tag: "Scraping framework", color: C.amber,
    detail: "For sources with no API, or a limited one, a scraping framework using Scrapy, Selenium, and Playwright handles static and JavaScript heavy sites, with retries and change detection built in." },
  { Icon: Filter, title: "Normalize and transform", tag: "ETL", color: C.coral,
    detail: "Every source names things differently. The transform layer maps them all to one schema, cleans and deduplicates, and validates the data so what lands is accurate and consistent." },
  { Icon: Boxes, title: "Unified property model", tag: "One schema", color: C.purple,
    detail: "All sources resolve into a single property data model the product and AI teams query, so a listing looks the same whether it came from an API or a scraper." },
  { Icon: RefreshCw, title: "Sync and maintain", tag: "Automated", color: C.green,
    detail: "Scheduled syncs keep listings and updates fresh, with monitoring and alerts so a broken integration is caught and fixed before it quietly corrupts the data." },
];

function Pipeline() {
  const [i, setI] = useState(0);
  const s = STAGES[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
        {STAGES.map((st, idx) => {
          const on = idx === i;
          return (
            <button
              key={st.title}
              onClick={() => setI(idx)}
              style={{
                flexShrink: 0, width: 150, textAlign: "left", cursor: "pointer",
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
                <Zap size={12} /> {s.tag}
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
// 2. Scraping framework
const SCRAPE = [
  { Icon: Code2, title: "Scrapy for scale", body: "Structured, high volume crawling of static sources, with pipelines and throttling built into the framework.", color: C.amber },
  { Icon: MousePointer, title: "Selenium and Playwright", body: "For JavaScript heavy and gated pages that need a real browser, with waits and interaction handled properly.", color: C.cyan },
  { Icon: ShieldCheck, title: "Auth and sessions", body: "Logins, tokens, and sessions handled cleanly, and refreshed automatically so a scraper does not silently start failing.", color: C.green },
  { Icon: Gauge, title: "Rate limits and resilience", body: "Polite request pacing, retries with backoff, and change detection, so sources are respected and breakage is caught early.", color: C.rose },
];

// ─────────────────────────────────────────────────────────────
// 3. Unified property model
const FIELDS = [
  { f: "listing_id", t: "string · primary key" },
  { f: "source", t: "enum · which platform" },
  { f: "address", t: "normalized string" },
  { f: "geo", t: "lat, lng · geospatial" },
  { f: "price", t: "integer · normalized" },
  { f: "beds / baths", t: "numeric" },
  { f: "status", t: "active, pending, sold" },
  { f: "updated_at", t: "timestamp · sync stamp" },
];

// ─────────────────────────────────────────────────────────────
// 4. Real projects
const PROJECTS = [
  { Icon: Radar, title: "AI job scraper pipeline", color: C.amber,
    body: "A Python scraper that pulls new listings on a schedule, normalizes them, classifies each one with AI for fit, and posts the strong matches to Slack, running in the cloud on its own. Real scraping, ETL, and scheduled sync end to end." },
  { Icon: Webhook, title: "Two way API integration relay", color: C.cyan,
    body: "A relay in Node and Python that keeps two platforms in sync through their APIs and webhooks in both directions, handling auth and retries, where no native integration existed. Real third party API integration in production." },
];

// ─────────────────────────────────────────────────────────────
// 5. Tech stack
const STACK = [
  "Python", "Scrapy", "Selenium", "Playwright", "REST + GraphQL APIs",
  "PostgreSQL / Supabase", "MongoDB", "AWS / Azure", "ETL",
  "Data normalization", "Webhooks", "Scheduled sync",
];

// ─────────────────────────────────────────────────────────────
export default function PropertyDataPipeline() {
  const heroStats = useMemo(
    () => [
      { k: "APIs first", v: "Scrape as fallback" },
      { k: "Output", v: "One property model" },
      { k: "Stack", v: "Python · Scrapy · Postgres" },
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
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.purple, background: "rgba(167,139,250,0.12)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
            Built for your application
          </span>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.purple }}>
            <Database size={15} /> Property data pipeline for an AI real estate platform
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.08, margin: "12px 0 14px", letterSpacing: -0.6 }}>
            From scattered listing sources to one clean
            <span style={{ color: C.purple }}> property model, synced and reliable.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 690, lineHeight: 1.6 }}>
            You are aggregating property data from many platforms to feed AI search and recommendations. That job
            lives or dies on the data pipeline underneath it. Here is how I would architect it, APIs first, scraping
            where needed, all resolving into one model. Click through it.
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

        <Section eyebrow="The pipeline" title="Source to unified model, end to end" sub="The full ingestion pipeline, from researching a platform's API to a synced property model your AI team can query. Tap each stage.">
          <Pipeline />
        </Section>

        <Section eyebrow="The scraping framework" title="Where an API is not available" sub="You listed Scrapy, Selenium, and Playwright, the tools I use. Here is how the scraping layer stays reliable in production.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {SCRAPE.map((s, i) => (
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

        <Section eyebrow="The output" title="A unified property data model" sub="Every source, however messy, resolves into one clean schema, so the AI and product teams query one shape, not twelve.">
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "8px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", color: C.purple, fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
              <Table size={14} /> property
            </div>
            <div style={{ display: "grid", gap: 1 }}>
              {FIELDS.map((f) => (
                <div key={f.f} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: C.card, padding: "11px 14px" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, fontFamily: "monospace" }}>{f.f}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{f.t}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section eyebrow="Real projects" title="Scraping and API work I have shipped" sub="Not theory. Two production systems I built that are the same shape as this project.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {PROJECTS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${p.color}`, borderRadius: 14, padding: "18px 18px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <p.Icon size={18} color={p.color} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{p.title}</span>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.55 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Tech stack" title="What I build this with" sub="The tools I actually work in for pipelines like this.">
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px 20px", display: "flex", flexWrap: "wrap", gap: 9 }}>
            {STACK.map((t) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: C.ink, background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "7px 13px" }}>
                <CheckCircle2 size={13} color={C.purple} /> {t}
              </span>
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
            <Terminal size={18} color={C.purple} />
            <span style={{ fontSize: 15, fontWeight: 800 }}>Built with Claude Code, and BVN is just me.</span>
          </div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, margin: 0, maxWidth: 730 }}>
            This page I built with Claude Code. On this contract you get one engineer who researches the sources,
            writes the integrations and scrapers, designs the data model, handles auth and rate limits, and
            documents the architecture so the team can maintain it. I ship reliable pipelines and I keep them running.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.bg, textDecoration: "none", background: C.purple, borderRadius: 999, padding: "10px 16px" }}>
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Contract, remote, long term available</span>
        </div>
      </div>
    </div>
  );
}
