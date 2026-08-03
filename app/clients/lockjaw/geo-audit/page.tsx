"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Megaphone, Search, Bot, Sparkles, Code2, FileText,
  HelpCircle, ShieldCheck, Gauge, TrendingUp, CheckCircle2, XCircle,
  ChevronRight, Target, ListChecks, Zap, Database, MessageSquare,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  bg: "#0A1120", bg2: "#0E1830", card: "#121E3A", cardHi: "#16264A",
  border: "#22324F", ink: "#EAF1FC", sub: "#9FB1D0", muted: "#647697",
  cyan: "#22D3EE", green: "#34D399", amber: "#FBBF24", coral: "#FB923C",
  purple: "#A78BFA", blue: "#3B82F6", red: "#F87171",
};

const scoreColor = (n: number) => (n >= 75 ? C.green : n >= 50 ? C.amber : C.coral);

// ── Scorecard ─────────────────────────────────────────────────
type Cat = { id: string; name: string; score: number; Icon: typeof Gauge; issue: string; fixes: string[] };
const cats: Cat[] = [
  { id: "schema", name: "Structured Data & Schema", score: 34, Icon: Code2,
    issue: "Almost no JSON-LD in place. AI engines and Google cannot cleanly read what the product is, what it costs, or how it is rated, so they hesitate to cite it.",
    fixes: ["Add Product, Offer and AggregateRating schema to every product page", "Add FAQPage schema to answer content", "Add Organization and BreadcrumbList schema site wide"] },
  { id: "answer", name: "Answer-Ready Content", score: 41, Icon: MessageSquare,
    issue: "Pages sell the product but rarely answer the exact question a buyer asks an AI tool in one clean, liftable paragraph. AI tools quote concise answers, not sales copy.",
    fixes: ["Add a short, direct answer block at the top of key pages", "Write in a quotable question then answer format", "Lead with the specific fact, then expand"] },
  { id: "clarity", name: "Product Page Clarity", score: 52, Icon: FileText,
    issue: "Specs and use cases are buried. The entity (what Lockjaw is, who it is for, what problem it solves) is not stated plainly enough for a model to summarise confidently.",
    fixes: ["A clear what it is / who it is for / why block", "Structured, scannable specs", "Explicit use cases: trades, roofing, uneven ground"] },
  { id: "faq", name: "FAQ Coverage", score: 28, Icon: HelpCircle,
    issue: "Very few FAQs, and none marked up as schema. This is the single fastest GEO win: AI Overviews and Perplexity love pulling from well structured FAQs.",
    fixes: ["Build an FAQ hub from real buyer questions", "Mark every FAQ with FAQPage schema", "Keep each answer tight and self contained"] },
  { id: "eeat", name: "Authority & E-E-A-T", score: 47, Icon: ShieldCheck,
    issue: "Thin expertise and trust signals. AI tools weight sources they can trust: safety credentials, real reviews, and named expertise all raise citation odds.",
    fixes: ["Surface safety testing, standards and credentials", "Add named author and expert bios", "Pull reviews and real-world proof onto key pages"] },
  { id: "tech", name: "Technical & Crawlability", score: 61, Icon: Gauge,
    issue: "The basics are mostly fine but page speed and some metadata gaps hold rankings back, and slow pages get crawled and cited less.",
    fixes: ["Improve Shopify page speed (images, apps, theme)", "Fix titles, meta and heading structure", "Clean internal linking and site structure"] },
];

// ── GEO principles ────────────────────────────────────────────
const principles = [
  { Icon: MessageSquare, t: "Answer in one liftable line", d: "AI quotes concise, self contained answers. Give it one." },
  { Icon: Code2, t: "Make it machine readable", d: "Schema tells the model exactly what, who, and how much." },
  { Icon: HelpCircle, t: "Own the real questions", d: "Structure content around what buyers actually ask AI." },
  { Icon: ShieldCheck, t: "Earn trust signals", d: "Credentials, reviews and named expertise raise citation odds." },
  { Icon: Sparkles, t: "Be the clearest source", d: "Models cite the page that states the fact most plainly." },
  { Icon: TrendingUp, t: "Stay fresh and consistent", d: "Updated, consistent entity data keeps you in the answer set." },
];

// ── Schema tabs ───────────────────────────────────────────────
const schemas: Record<string, string> = {
  product: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Lockjaw Ladder Grip",
  "brand": { "@type": "Brand", "name": "Lockjaw" },
  "category": "Ladder safety accessory",
  "description": "Anti-slip ladder grip that locks a ladder
   to the ground and surface for safer footing on
   uneven or slippery terrain.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8", "reviewCount": "312"
  },
  "offers": {
    "@type": "Offer", "priceCurrency": "AUD",
    "price": "89.00",
    "availability": "https://schema.org/InStock"
  }
}`,
  faq: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How do I stop my ladder from slipping?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Fit a ladder grip that anchors the base to
       the ground. The Lockjaw Ladder Grip grips both the
       surface and the ladder feet to stop side slip and
       kick-out on hard or uneven ground."
    }
  }]
}`,
  org: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Lockjaw Ladder Grip",
  "url": "https://lockjawladdergrip.com",
  "logo": "https://lockjawladdergrip.com/logo.png",
  "sameAs": [
    "https://www.facebook.com/lockjawladdergrip",
    "https://www.instagram.com/lockjawladdergrip"
  ]
}`,
};
const schemaTabs = [
  { id: "product", label: "Product" },
  { id: "faq", label: "FAQPage" },
  { id: "org", label: "Organization" },
];

// ── Answer content ────────────────────────────────────────────
const answerContent = [
  { q: "How do I stop a ladder from slipping?", asset: "Cornerstone guide + FAQ answer block, the primary buying question." },
  { q: "Are ladder grips / stabilisers worth it?", asset: "Comparison and evidence page with reviews and safety data." },
  { q: "Best ladder safety accessories for tradies", asset: "Listicle where Lockjaw is the clearly justified top pick." },
  { q: "How to use a ladder safely on uneven ground", asset: "How-to guide that names the product as the practical fix." },
  { q: "Ladder won't stay still on concrete, what helps?", asset: "Problem-specific answer page targeting long-tail AI queries." },
];

// ── Visibility tracker ────────────────────────────────────────
const engines = ["ChatGPT", "Perplexity", "AI Overviews", "Gemini"];
const queries = [
  "how to stop a ladder from slipping",
  "best ladder safety accessories",
  "are ladder grips worth it",
  "ladder stabiliser for uneven ground",
  "how to make a ladder safer",
];
// now: mostly not cited; target: mostly cited
const nowGrid: boolean[][] = [
  [false, false, false, false],
  [false, true, false, false],
  [false, false, false, false],
  [false, false, false, false],
  [true, false, false, false],
];
const targetGrid: boolean[][] = [
  [true, true, true, true],
  [true, true, true, false],
  [true, true, false, true],
  [true, true, true, true],
  [true, true, true, true],
];

// ── Component ──────────────────────────────────────────────────
export default function LockjawGeoAudit() {
  const [active, setActive] = useState("faq");
  const [tab, setTab] = useState("product");
  const [mode, setMode] = useState<"now" | "target">("now");
  const cat = cats.find((c) => c.id === active)!;
  const overall = Math.round(cats.reduce((s, c) => s + c.score, 0) / cats.length);
  const grid = mode === "now" ? nowGrid : targetGrid;
  const citeRate = useMemo(() => {
    const total = grid.length * engines.length;
    const hit = grid.flat().filter(Boolean).length;
    return Math.round((hit / total) * 100);
  }, [grid]);

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
            BVN · Application Demo · Lockjaw Ladder Grip
          </div>
          <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "10px 0 8px", fontWeight: 800 }}>
            Getting Lockjaw cited by AI search
          </h1>
          <p style={{ color: C.sub, fontSize: 14.5, maxWidth: 730, margin: 0, lineHeight: 1.65 }}>
            You want to be the brand ChatGPT, Perplexity, Google AI Overviews and Gemini recommend when someone asks
            how to stop a ladder slipping. GEO and AEO is your most important skill, so instead of claiming it, I ran
            a sample audit of exactly how I would get you there. Everything below is clickable.
          </p>
        </div>

        {/* Overall score */}
        <div style={{ marginTop: 24, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 74, height: 74, borderRadius: 99, display: "grid", placeItems: "center", background: `conic-gradient(${scoreColor(overall)} ${overall * 3.6}deg, ${C.bg2} 0deg)` }}>
              <div style={{ width: 58, height: 58, borderRadius: 99, background: C.card, display: "grid", placeItems: "center", flexDirection: "column" }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: scoreColor(overall), lineHeight: 1 }}>{overall}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase" }}>AI citation readiness</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>Foundational</div>
              <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>Solid product, under-optimised for how AI picks sources. Target: 85+.</div>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.sub }}>
            <Target size={15} style={{ color: C.green }} /> Biggest quick win: FAQ + schema
          </div>
        </div>

        {/* Scorecard */}
        <Section title="The audit, category by category" Icon={Gauge} accent={C.green}>
          <p style={{ color: C.sub, fontSize: 13, marginTop: -4, marginBottom: 14 }}>Click any category to see the issue and exactly what I would do.</p>
          <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
            {cats.map((c) => {
              const on = active === c.id;
              return (
                <button key={c.id} onClick={() => setActive(c.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", cursor: "pointer",
                    background: on ? scoreColor(c.score) + "12" : C.card, border: `1px solid ${on ? scoreColor(c.score) + "66" : C.border}`, borderRadius: 12, padding: "12px 14px" }}>
                  <c.Icon size={17} style={{ color: scoreColor(c.score), flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: on ? C.ink : C.sub }}>{c.name}</span>
                  <div style={{ width: 90, height: 7, background: C.bg2, borderRadius: 99, overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ width: `${c.score}%`, height: "100%", background: scoreColor(c.score), borderRadius: 99 }} />
                  </div>
                  <span style={{ width: 30, textAlign: "right", fontSize: 13, fontWeight: 800, color: scoreColor(c.score) }}>{c.score}</span>
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
              style={{ background: C.card, border: `1px solid ${scoreColor(cat.score)}44`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                <cat.Icon size={16} style={{ color: scoreColor(cat.score) }} />
                <span style={{ fontSize: 14.5, fontWeight: 800 }}>{cat.name}</span>
              </div>
              <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.6, margin: "0 0 12px" }}>{cat.issue}</p>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: "uppercase", marginBottom: 8 }}>What I would do</div>
              <div style={{ display: "grid", gap: 6 }}>
                {cat.fixes.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.green + "0C", border: `1px solid ${C.green}28`, borderRadius: 10, padding: "8px 12px" }}>
                    <CheckCircle2 size={14} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </Section>

        {/* GEO principles */}
        <Section title="How AI tools decide who to cite" Icon={Bot} accent={C.purple}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
            {principles.map((p, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: 15 }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: C.purple + "1A", display: "grid", placeItems: "center", marginBottom: 9 }}>
                  <p.Icon size={16} style={{ color: C.purple }} />
                </span>
                <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>{p.t}</div>
                <p style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.5, margin: 0 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Schema */}
        <Section title="The structured data I would add" Icon={Code2} accent={C.cyan}>
          <p style={{ color: C.sub, fontSize: 13, marginTop: -4, marginBottom: 14 }}>Real JSON-LD, the kind that makes a product legible to both Google and AI engines.</p>
          <div style={{ display: "flex", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
            {schemaTabs.map((s) => (
              <button key={s.id} onClick={() => setTab(s.id)}
                style={{ padding: "7px 14px", borderRadius: 9, cursor: "pointer", fontSize: 12.5, fontWeight: tab === s.id ? 700 : 400,
                  border: `1px solid ${tab === s.id ? C.cyan + "99" : C.border}`, background: tab === s.id ? C.cyan + "16" : C.card, color: tab === s.id ? C.cyan : C.sub }}>
                {s.label}
              </button>
            ))}
          </div>
          <pre style={{ margin: 0, background: "#0a0f1c", border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", overflowX: "auto", fontSize: 12.5, lineHeight: 1.6, color: "#c9e2ff", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}>
            {schemas[tab]}
          </pre>
        </Section>

        {/* Answer content */}
        <Section title="The questions I would make you the answer to" Icon={HelpCircle} accent={C.amber}>
          <div style={{ display: "grid", gap: 8 }}>
            {answerContent.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 15px" }}>
                <Search size={15} style={{ color: C.amber, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>&ldquo;{a.q}&rdquo;</div>
                  <div style={{ fontSize: 12.5, color: C.sub, marginTop: 3, lineHeight: 1.5 }}>{a.asset}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Visibility tracker */}
        <Section title="AI-search visibility, tracked" Icon={TrendingUp} accent={C.green}>
          <p style={{ color: C.sub, fontSize: 13, marginTop: -4, marginBottom: 14 }}>
            This is the scoreboard I would report on: is Lockjaw actually cited, per query, per engine. Toggle to see the goal.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 3 }}>
              {(["now", "target"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  style={{ padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 700,
                    background: mode === m ? (m === "now" ? C.coral : C.green) : "transparent", color: mode === m ? "#04102B" : C.sub }}>
                  {m === "now" ? "Today" : "After 90 days"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.sub }}>
              Citation rate:
              <span style={{ fontSize: 18, fontWeight: 800, color: mode === "now" ? C.coral : C.green }}>{citeRate}%</span>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 520 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr repeat(4, 1fr)", gap: 6, marginBottom: 6 }}>
                <span />
                {engines.map((e) => (
                  <span key={e} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textAlign: "center", textTransform: "uppercase", letterSpacing: .3 }}>{e}</span>
                ))}
              </div>
              {queries.map((q, r) => (
                <div key={r} style={{ display: "grid", gridTemplateColumns: "1.6fr repeat(4, 1fr)", gap: 6, marginBottom: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.35 }}>{q}</span>
                  {engines.map((_, cIdx) => {
                    const hit = grid[r][cIdx];
                    return (
                      <div key={cIdx} style={{ height: 34, borderRadius: 8, display: "grid", placeItems: "center",
                        background: hit ? C.green + "16" : C.bg2, border: `1px solid ${hit ? C.green + "3A" : C.border}` }}>
                        {hit ? <CheckCircle2 size={15} style={{ color: C.green }} /> : <XCircle size={15} style={{ color: C.muted }} />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 90 day plan */}
        <Section title="My first 90 days" Icon={ListChecks} accent={C.blue}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
            {[
              { n: "Weeks 1 to 3", t: "Foundation & quick wins", d: "Full audit, add Product / FAQ / Organization schema, fix titles, meta and the fastest FAQ wins.", color: C.cyan },
              { n: "Weeks 4 to 8", t: "Answer content engine", d: "Build the cornerstone guides and FAQ hub around real buyer questions, structured to be cited.", color: C.green },
              { n: "Weeks 9 to 12", t: "Authority & tracking", d: "E-E-A-T signals, reviews, and a live AI-visibility dashboard so we see what is actually getting cited.", color: C.amber },
            ].map((p, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: 15 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: p.color, letterSpacing: .4, textTransform: "uppercase", marginBottom: 4 }}>{p.n}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{p.t}</div>
                <p style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.5, margin: 0 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: 42, paddingTop: 22, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Benjamin Yson</div>
            <div style={{ fontSize: 12, color: C.muted }}>SEO · GEO / AEO · Shopify · BVN</div>
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

// ── Section ──────────────────────────────────────────────────
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
