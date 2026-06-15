"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Star, TrendingUp, Settings, Megaphone, Users,
  MapPin, Clock, Utensils, BarChart3, Target, Layers,
  ShieldAlert, CheckCircle, ArrowLeft, Soup, Egg, Coins,
} from "lucide-react";

// ── Brand tokens (warm carinderia palette) ───────────────────
const C = {
  brown: "#5A3018",
  brownDark: "#3A1F0E",
  red: "#B3261E",
  redBright: "#D4342B",
  gold: "#F4B400",
  goldBright: "#FFD23F",
  green: "#1D8A4E",
  cream: "#FFF7EC",
  cream2: "#FDEECF",
  card: "#FFFAF2",
  border: "#E7D6BD",
  ink: "#2A1A0E",
  muted: "#7C6A59",
};

// ── Menu data ────────────────────────────────────────────────
const paresMenu = [
  { name: "Pares Classic", desc: "Tender beef + garlic rice + sabaw", price: 75 },
  { name: "Pares Mami", desc: "Noodle soup version", price: 85 },
  { name: "Pares Bagnet", desc: "Crispy pork twist", price: 110 },
  { name: "PARES OVERLOAD", desc: "Extra beef + bone marrow + free refill", price: 120, star: true },
  { name: "Sabaw / Mami solo", desc: "Standalone soup", price: 45 },
];
const silogMenu = [
  { name: "Tapsilog", desc: "Beef tapa", price: 90 },
  { name: "Tocilog", desc: "Sweet tocino", price: 85 },
  { name: "Longsilog", desc: "Longganisa", price: 85 },
  { name: "Hotsilog", desc: "Hotdog favorite", price: 70 },
  { name: "Bangsilog", desc: "Boneless bangus", price: 95 },
  { name: "Porksilog", desc: "Pork chop / liempo", price: 95 },
  { name: "Cornsilog", desc: "Corned beef", price: 85 },
];
const addOns = [
  { name: "Plain rice", price: 15 }, { name: "Garlic (sinangag) rice", price: 20 },
  { name: "Extra egg (itlog)", price: 15 }, { name: "Extra beef / meat scoop", price: 40 },
  { name: "Softdrinks", price: 25 }, { name: "Bottled water", price: 15 },
  { name: "House iced tea", price: 20 }, { name: "Barako coffee", price: 20 },
];
const menuEng = [
  { item: "Tapsilog", sell: 90, cost: 33, margin: "63%" },
  { item: "Pares Classic", sell: 75, cost: 28, margin: "63%" },
  { item: "Hotsilog", sell: 70, cost: 22, margin: "69%" },
  { item: "Pares Overload", sell: 120, cost: 48, margin: "60%" },
  { item: "Softdrink", sell: 25, cost: 12, margin: "52%" },
];

// ── Startup costs ────────────────────────────────────────────
const startup = [
  { item: "Lease (2mo deposit + 1mo advance)", note: "@ ₱20,000/mo rent", cost: 60000 },
  { item: "Renovation & fit-out", note: "tiles, paint, counter, exhaust", cost: 20000 },
  { item: "Kitchen equipment", note: "range, freezer, ref, rice cookers, hood", cost: 60000 },
  { item: "Furniture & fixtures", note: "tables, stools, counter", cost: 10000 },
  { item: "Signage & branding", note: "panaflex, menu board, uniforms", cost: 25000 },
  { item: "Smallwares & utensils", note: "pots, plates, kaldero, ladles", cost: 35000 },
  { item: "Initial inventory", note: "first stock of raw materials", cost: 25000 },
  { item: "Permits & licenses", note: "DTI, Mayor's, BIR, Sanitary, Fire", cost: 25000 },
];

// ── Staffing ─────────────────────────────────────────────────
const staff = [
  { role: "Head Cook / Kitchen lead", count: 1, duty: "Pares broth, batch cooking, consistency", pay: 18000 },
  { role: "Assistant cook", count: 1, duty: "Silog station, grill, 2nd shift", pay: 14000 },
  { role: "Service crew / cashier", count: 2, duty: "Counter, POS, serving, cleaning", pay: 24000 },
  { role: "Utility / dishwasher", count: 1, duty: "Dishes, cleaning, stock runs", pay: 11000 },
];

// ── Risks ────────────────────────────────────────────────────
const risks = [
  { risk: "Beef / rice price spikes", impact: "Squeezed margins", fix: "Push high-margin silogs, portion control, multiple suppliers, small price tweaks" },
  { risk: "Low foot traffic", impact: "Weak sales", fix: "Rigorous location vetting, delivery apps, office bulk orders" },
  { risk: "Staff turnover / theft", impact: "Service drops, losses", fix: "Cross-training, fair pay, free meals, CCTV, daily reconciliation" },
  { risk: "Power interruption", impact: "Spoilage, closed hours", fix: "Inverter/genset for ref, LPG cooking independent of grid" },
  { risk: "Copycats nearby", impact: "Split market", fix: "Brand loyalty, signature broth, consistency, loyalty card" },
  { risk: "Permit / health issues", impact: "Fines, shutdown", fix: "Full compliance day one, strict hygiene SOPs, valid health certs" },
];

const timeline = [
  { when: "Week 1–2", title: "Lock location & lease", detail: "Sign contract, register DTI + barangay, open business bank + GCash." },
  { when: "Week 3–4", title: "Build-out", detail: "Renovation, electrical, exhaust, signage, equipment delivery." },
  { when: "Week 5", title: "Permits & suppliers", detail: "Mayor's/BIR/sanitary/fire, lock in beef & rice suppliers." },
  { when: "Week 6", title: "Recipe lock & hire", detail: "Standardize recipes & portions, hire + train crew, health certs." },
  { when: "Week 7", title: "Soft opening", detail: "Friends/barangay free-taste, fix bottlenecks, test POS & speed." },
  { when: "Week 8", title: "Grand opening", detail: "Promo blitz, opening discounts, social launch, delivery apps live." },
];

const growth = [
  { when: "Phase 1 · Mo 1–12", title: "Stabilize & systematize", detail: "Nail consistency, build suki base, recover capital, document every SOP." },
  { when: "Phase 2 · Mo 12–24", title: "Margin & reach", detail: "In-house tapa/tocino, scale delivery, catering, bottled-sauce retail." },
  { when: "Phase 3 · Mo 24–36", title: "Multiply", detail: "Open Branch 2 in proven format, build the franchise package." },
  { when: "Phase 4 · Year 3+", title: "Franchise & brand", detail: "PARESILOGAN as a recognizable masa-favorite chain." },
];

// ── Tabs ─────────────────────────────────────────────────────
type Tab = "summary" | "concept" | "market" | "menu" | "startup" | "operations" | "team" | "marketing" | "financials" | "risk";
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "summary", label: "Summary", icon: <Star size={14} /> },
  { id: "concept", label: "Concept", icon: <Soup size={14} /> },
  { id: "market", label: "Market", icon: <MapPin size={14} /> },
  { id: "menu", label: "Menu & Pricing", icon: <Utensils size={14} /> },
  { id: "startup", label: "Startup Costs", icon: <Coins size={14} /> },
  { id: "operations", label: "Operations", icon: <Settings size={14} /> },
  { id: "team", label: "Team", icon: <Users size={14} /> },
  { id: "marketing", label: "Marketing", icon: <Megaphone size={14} /> },
  { id: "financials", label: "Financials", icon: <TrendingUp size={14} /> },
  { id: "risk", label: "Risk & Growth", icon: <ShieldAlert size={14} /> },
];

const peso = (n: number) => "₱" + Math.round(n).toLocaleString("en-PH");
const pesoK = (n: number) =>
  Math.abs(n) >= 1_000_000 ? "₱" + (n / 1_000_000).toFixed(1) + "M" : "₱" + (n / 1000).toFixed(0) + "K";

// ── Small UI helpers ─────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"rounded-2xl p-6 " + className} style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 10px 30px rgba(90,48,24,.10)" }}>
      {children}
    </div>
  );
}
function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 font-black mb-2" style={{ color: C.brown, fontSize: "clamp(26px,5vw,38px)" }}>
      <span style={{ color: C.red }}>{icon}</span>{children}
    </h2>
  );
}
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-block font-bold text-xs px-3 py-1 rounded-full mr-2 mb-2" style={{ background: C.cream2, border: `1px solid ${C.border}`, color: C.brown }}>{children}</span>;
}
function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 py-2" style={{ borderBottom: `1px dashed ${C.border}` }}>
      <CheckCircle size={18} style={{ color: C.green, flexShrink: 0, marginTop: 3 }} />
      <span>{children}</span>
    </li>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function ParesiloganPage() {
  const [tab, setTab] = useState<Tab>("summary");

  // calculator state
  const [cust, setCust] = useState(100);
  const [avg, setAvg] = useState(100);
  const [days, setDays] = useState(30);
  const [cogsPct, setCogsPct] = useState(35);
  const [rent, setRent] = useState(20000);
  const [pay, setPay] = useState(72000);
  const [util, setUtil] = useState(30000);
  const [cap, setCap] = useState(260000);

  const fin = useMemo(() => {
    const daily = cust * avg;
    const revenue = daily * days;
    const food = revenue * (cogsPct / 100);
    const supplies = revenue * 0.03;
    const marketing = 5000, misc = 7000;
    const fixed = rent + pay + util + marketing + misc;
    const profit = revenue - food - supplies - fixed;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const annual = profit * 12;
    const payback = profit > 0 ? cap / profit : Infinity;
    const grossRate = 1 - cogsPct / 100 - 0.03;
    const breakEvenCust = Math.ceil(fixed / grossRate / (avg * days));
    const roi = cap > 0 ? (annual / cap) * 100 : 0;
    const bars = [
      { n: "Food cost", v: food, c: C.red },
      { n: "Payroll", v: pay, c: C.brown },
      { n: "Utilities", v: util, c: C.gold },
      { n: "Rent", v: rent, c: C.green },
      { n: "Supplies", v: supplies, c: "#9A5A2A" },
      { n: "Mktg + Misc", v: marketing + misc, c: "#C98A3A" },
      { n: "NET PROFIT", v: Math.max(profit, 0), c: C.green },
    ];
    const max = Math.max(...bars.map((b) => b.v), 1);
    return { daily, revenue, food, profit, margin, annual, payback, breakEvenCust, roi, bars, max };
  }, [cust, avg, days, cogsPct, rent, pay, util, cap]);

  const fade = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  return (
    <div style={{ background: C.cream, color: C.ink, minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-center px-6 pt-10 pb-20"
        style={{ background: `linear-gradient(135deg, ${C.brown} 0%, ${C.brownDark} 60%, #9A5A2A 100%)`, borderBottom: `6px solid ${C.gold}` }}>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/business" className="inline-flex items-center gap-2 text-sm font-semibold mb-6" style={{ color: C.goldBright }}>
            <ArrowLeft size={16} /> All Business Plans
          </Link>
          <div className="inline-block font-extrabold uppercase text-xs tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: C.gold, color: C.brown }}>
            🇵🇭 BVN Official · Business Blueprint
          </div>
          <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="font-black mb-2" style={{ fontSize: "clamp(40px,9vw,82px)", letterSpacing: 2, color: C.goldBright, textShadow: "0 3px 0 rgba(0,0,0,.18)" }}>
            PARESILOGAN
          </motion.h1>
          <p className="font-bold mb-3" style={{ color: "#FFE9C2", fontSize: "clamp(16px,3.5vw,22px)" }}>
            Pares &amp; Tapsilogan ng Bayan — Mura, Masarap, Masustansya
          </p>
          <p className="max-w-xl mx-auto" style={{ color: "#F6E3C7", fontSize: 15 }}>
            A complete, interactive business plan for a carinderia-style restaurant serving Filipino comfort food at prices the masa can afford — from startup to operations to marketing.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-7">
            <button onClick={() => setTab("financials")} className="font-extrabold rounded-full px-6 py-3 text-sm" style={{ background: C.redBright, color: "#fff", boxShadow: "0 8px 20px rgba(179,38,30,.4)" }}>
              📊 Open Profit Calculator
            </button>
            <button onClick={() => setTab("summary")} className="font-extrabold rounded-full px-6 py-3 text-sm" style={{ background: "rgba(255,255,255,.14)", color: "#fff", border: "1.5px solid rgba(255,255,255,.5)" }}>
              📖 Read the Plan
            </button>
          </div>
        </div>
      </section>

      {/* ── QUICK STATS ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ marginTop: -34 }}>
          {[
            { b: "₱260K", s: "Startup Capital" },
            { b: "₱52K", s: "Monthly Net Profit*" },
            { b: "~5 mo", s: "Payback Period" },
            { b: "~17%", s: "Net Margin" },
          ].map((q) => (
            <div key={q.s} className="rounded-2xl p-4 text-center" style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 10px 30px rgba(90,48,24,.12)" }}>
              <div className="font-black leading-none" style={{ color: C.red, fontSize: "clamp(20px,4vw,28px)" }}>{q.b}</div>
              <div className="font-semibold uppercase tracking-wide mt-1" style={{ color: C.muted, fontSize: 11 }}>{q.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── STICKY TABS ──────────────────────────────────── */}
      <div className="sticky top-0 z-40 mt-8" style={{ background: "rgba(255,247,236,.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2.5">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all"
                style={{ background: tab === t.id ? C.brown : "transparent", color: tab === t.id ? "#fff" : C.brown }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">

          {/* SUMMARY */}
          {tab === "summary" && (
            <motion.div key="summary" {...fade}>
              <SectionTitle icon={<Star size={30} />}>Executive Summary</SectionTitle>
              <p className="mb-6" style={{ color: C.muted, fontSize: 17 }}>
                PARESILOGAN is a no-frills, high-volume Filipino eatery built on one promise: <b style={{ color: C.brown }}>busog ka na, mura pa</b>. We combine the two most reliable crowd-pleasers in Pinoy food — beef <b>pares</b> and the <b>-silog</b> family — under one roof, breakfast to late-night.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-2">
                <Card>
                  <h4 className="uppercase font-bold text-sm mb-2" style={{ color: C.red }}>The Opportunity</h4>
                  <p style={{ color: C.muted }}>Filipinos eat out for value and familiarity. Pares and silog are everyday cravings with proven demand across every income class. A clean, branded carinderia in a high-traffic spot captures commuters, students, workers, and the late-night crowd most restaurants ignore.</p>
                </Card>
                <Card>
                  <h4 className="uppercase font-bold text-sm mb-2" style={{ color: C.red }}>The Concept in One Line</h4>
                  <p className="font-bold mb-2" style={{ color: C.brown, fontSize: 18 }}>&ldquo;Karinderya prices, restaurant consistency, with a brand people remember.&rdquo;</p>
                  <p style={{ color: C.muted }}>Affordable (₱70–₱120 meals), fast service, generous portions, ~18 hrs/day, and a look that turns an eatery into a habit.</p>
                </Card>
              </div>
              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>Why this wins</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <Check><b>Low startup cost</b> — about ₱260K to open a real, equipped 16–24 seater.</Check>
                <Check><b>High table turnover</b> — silog &amp; pares cook fast and eat fast.</Check>
                <Check><b>Healthy food-cost margin</b> — beef, eggs, cured meats and rice are cheap at volume (~35% COGS).</Check>
                <Check><b>All-day revenue</b> — breakfast silog → lunch → merienda → dinner → late-night pares.</Check>
                <Check><b>Recession-proof</b> — when budgets tighten, people trade <em>down</em> into eateries like ours.</Check>
              </ul>
              <div className="rounded-xl p-4 mt-6" style={{ borderLeft: `5px solid ${C.green}`, background: "#F0FBF4" }}>
                <b style={{ color: C.brown }}>Bottom line:</b> At a conservative ~100 customers/day and ₱100 average spend, PARESILOGAN nets <b>₱52,000/month</b> and returns your full ₱260K capital in roughly <b>5 months</b> — then it is profit-machine mode. Model every number yourself in the <button onClick={() => setTab("financials")} className="font-bold underline" style={{ color: C.red }}>Financials calculator →</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <Card><h4 className="uppercase font-bold text-sm mb-2" style={{ color: C.red }}>Vision</h4><p style={{ color: C.muted }}>To become the most-loved neighborhood pares-tapsilogan brand in the city — and a franchise-ready system within 3 years.</p></Card>
                <Card><h4 className="uppercase font-bold text-sm mb-2" style={{ color: C.red }}>Mission</h4><p style={{ color: C.muted }}>Serve honest, delicious, affordable Filipino food fast and consistently, give fair jobs to our community, and make every peso feel worth it.</p></Card>
              </div>
            </motion.div>
          )}

          {/* CONCEPT */}
          {tab === "concept" && (
            <motion.div key="concept" {...fade}>
              <SectionTitle icon={<Soup size={30} />}>The Concept</SectionTitle>
              <p className="mb-6" style={{ color: C.muted, fontSize: 17 }}>A hybrid <b>pares house + silogan</b> in a clean, branded carinderia format — the warmth and price of a karinderya, with the consistency, signage, and hygiene of a real restaurant.</p>
              <Card className="mb-4">
                <h4 className="uppercase font-bold text-sm mb-2" style={{ color: C.red }}>Brand Identity</h4>
                <p style={{ color: C.ink }}><b>Name:</b> PARESILOGAN &nbsp;·&nbsp; <b>Tagline:</b> Pares &amp; Tapsilogan ng Bayan</p>
                <p style={{ color: C.muted }} className="mt-1"><b>Look:</b> Warm brown + bold red + sunny yellow. Carinderia energy made tidy and Instagrammable. Big legible menu board, steaming-bowl logo, chalkboard specials.</p>
                <div className="mt-3">
                  {["Mura", "Masarap", "Mabilis", "Malinis", "Masustansya", "Maaasahan"].map((p) => <Pill key={p}>{p}</Pill>)}
                </div>
              </Card>
              <div className="grid md:grid-cols-3 gap-4">
                <Card><h4 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: C.red }}><Layers size={15} /> Size</h4><p style={{ color: C.muted }}>20–30 sqm stall. 16–24 seats (mix of long tables &amp; stools) + takeout/delivery counter.</p></Card>
                <Card><h4 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: C.red }}><Clock size={15} /> Hours</h4><p style={{ color: C.muted }}><b>5:00 AM – 11:00 PM</b> (~18 hrs). Two shifts. The money-maker: late-night pares.</p></Card>
                <Card><h4 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: C.red }}><Utensils size={15} /> Service</h4><p style={{ color: C.muted }}>Counter-order, pay-first, fast seat or takeout. Self-bus stations keep labor lean. GCash + cash.</p></Card>
              </div>
              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>What sets us apart from the karinderya next door</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <Check><b>Signature pares broth</b> — a slow-simmered beef stock with star anise; the taste you crave gabi-gabi.</Check>
                <Check><b>Consistency</b> — standardized recipes &amp; portion scoops so the tapa tastes the same every visit.</Check>
                <Check><b>Cleanliness &amp; brand</b> — uniformed crew, visible hygiene, real signage.</Check>
                <Check><b>Combo value</b> — bundles that feel generous and raise the average ticket.</Check>
                <Check><b>All-in-one</b> — both pares AND silog cravings solved in one stop.</Check>
              </ul>
              <div className="rounded-xl p-4 mt-5" style={{ borderLeft: `5px solid ${C.red}`, background: "#FFF4F3" }}>
                <b style={{ color: C.brown }}>Signature hook:</b> The <b>PARES OVERLOAD</b> — extra beef, bone marrow, garlic rice + free sabaw refill for ₱120. The dish people post and tag friends to try.
              </div>
            </motion.div>
          )}

          {/* MARKET */}
          {tab === "market" && (
            <motion.div key="market" {...fade}>
              <SectionTitle icon={<MapPin size={30} />}>Market Analysis</SectionTitle>
              <p className="mb-6" style={{ color: C.muted, fontSize: 17 }}>We sell to people who eat out daily for value — the largest, most repeatable customer base in the Philippines.</p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card><h4 className="font-bold mb-1" style={{ color: C.red }}>🛺 Commuters &amp; drivers</h4><p style={{ color: C.muted }}>Jeepney/tricycle/delivery riders needing fast, filling, cheap meals at all hours. Daily frequency, high loyalty.</p></Card>
                <Card><h4 className="font-bold mb-1" style={{ color: C.red }}>🎓 Students &amp; workers</h4><p style={{ color: C.muted }}>Budget ₱50–₱120/meal. Want busog over fancy. 3–6 visits/week near schools, offices, BPOs.</p></Card>
                <Card><h4 className="font-bold mb-1" style={{ color: C.red }}>🌙 Late-night crowd</h4><p style={{ color: C.muted }}>After-shift workers, barkada post-gimik, inuman pulutan. Pares + extra rice = premium ticket.</p></Card>
              </div>
              <h3 className="font-extrabold mb-2" style={{ color: C.brown, fontSize: 20 }}>Ideal location checklist</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <Check>Near a transport terminal, palengke, school, hospital, or BPO/office cluster.</Check>
                <Check>High pedestrian foot traffic; visible from the road; ground floor with open front.</Check>
                <Check>Reliable water + adequate electrical; space for an exhaust/vent.</Check>
                <Check>Rent ideally ≤ 10–12% of projected monthly sales (₱20K–₱30K for this format).</Check>
                <Check>24-hour-friendly area (security, lighting) to unlock late-night sales.</Check>
              </ul>
              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>Competitive landscape</h3>
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{ background: C.brown, color: "#fff" }}>
                    <th className="text-left p-3 rounded-l-lg">Competitor</th><th className="text-left p-3">Their edge</th><th className="text-left p-3 rounded-r-lg">Our edge</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Karinderya / turo-turo", "Cheapest, familiar", "Cleaner, branded, consistent, late-night, both pares + silog"],
                      ["Fast-food chains", "Brand, aircon, speed", "Cheaper, more ulam-rice, Pinoy comfort, no premium pricing"],
                      ["Existing pares stalls", "Niche loyalty", "Better branding, silog add-ons, hygiene, combos"],
                      ["Convenience stores", "24/7, fast", "Real hot meals, bigger portions, lower ₱/calorie"],
                    ].map((r) => (
                      <tr key={r[0]} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td className="p-3 font-semibold">{r[0]}</td><td className="p-3" style={{ color: C.muted }}>{r[1]}</td><td className="p-3" style={{ color: C.muted }}>{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>SWOT</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { t: "💪 Strengths", bg: "#F0FBF4", items: ["Low price, high demand, fast cook", "Healthy margins on rice/egg/beef", "All-day & late-night revenue", "Strong, memorable brand"] },
                  { t: "⚠️ Weaknesses", bg: "#FFF4F3", items: ["Thin per-item margin → needs volume", "Owner-dependent early on", "Labor & gas cost sensitivity"] },
                  { t: "🚀 Opportunities", bg: "#EEF6FF", items: ["Delivery apps (GrabFood/Foodpanda)", "Franchising / 2nd branch", "Bottled sauces & frozen tapa retail", "Catering & office bulk orders"] },
                  { t: "🌩️ Threats", bg: "#FFFAEF", items: ["Beef/rice price spikes", "Copycats nearby", "Rent increases", "Power interruptions"] },
                ].map((box) => (
                  <div key={box.t} className="rounded-2xl p-5" style={{ background: box.bg, border: `1px solid ${C.border}` }}>
                    <h4 className="font-bold mb-2" style={{ color: C.brown }}>{box.t}</h4>
                    <ul className="list-disc pl-5 text-sm" style={{ color: C.muted }}>{box.items.map((i) => <li key={i} className="mb-1">{i}</li>)}</ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* MENU */}
          {tab === "menu" && (
            <motion.div key="menu" {...fade}>
              <SectionTitle icon={<Utensils size={30} />}>Menu &amp; Pricing</SectionTitle>
              <p className="mb-6" style={{ color: C.muted, fontSize: 17 }}>A tight, fast-cooking menu engineered for low food cost and high crave-ability. Every item shares core ingredients to minimize waste.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: C.red }}><Soup size={16} /> The Pares</h4>
                  {paresMenu.map((m) => (
                    <div key={m.name} className="flex justify-between items-baseline gap-3 py-2" style={{ borderBottom: `1px dotted ${C.border}` }}>
                      <span><b style={{ color: m.star ? C.red : C.ink }}>{m.name}{m.star ? " ⭐" : ""}</b> <span className="text-xs" style={{ color: C.muted }}>{m.desc}</span></span>
                      <b style={{ color: C.red, whiteSpace: "nowrap" }}>{peso(m.price)}</b>
                    </div>
                  ))}
                </Card>
                <Card>
                  <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: C.red }}><Egg size={16} /> The Silog Family</h4>
                  {silogMenu.map((m) => (
                    <div key={m.name} className="flex justify-between items-baseline gap-3 py-2" style={{ borderBottom: `1px dotted ${C.border}` }}>
                      <span><b>{m.name}</b> <span className="text-xs" style={{ color: C.muted }}>{m.desc}</span></span>
                      <b style={{ color: C.red, whiteSpace: "nowrap" }}>{peso(m.price)}</b>
                    </div>
                  ))}
                </Card>
              </div>
              <Card className="mt-4">
                <h4 className="font-bold mb-3" style={{ color: C.red }}>➕ Add-ons &amp; Drinks</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {addOns.map((a) => (
                    <div key={a.name} className="flex justify-between rounded-lg px-3 py-2 text-sm" style={{ background: C.cream2 }}>
                      <span>{a.name}</span><b style={{ color: C.red }}>{peso(a.price)}</b>
                    </div>
                  ))}
                </div>
              </Card>
              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>Menu engineering — why these prices</h3>
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{ background: C.brown, color: "#fff" }}>
                    <th className="text-left p-3 rounded-l-lg">Item</th><th className="text-right p-3">Sell ₱</th><th className="text-right p-3">Food cost ₱</th><th className="text-right p-3 rounded-r-lg">Margin</th>
                  </tr></thead>
                  <tbody>
                    {menuEng.map((m) => (
                      <tr key={m.item} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td className="p-3 font-semibold">{m.item}</td><td className="p-3 text-right">{m.sell}</td>
                        <td className="p-3 text-right">{m.cost}</td><td className="p-3 text-right font-bold" style={{ color: C.green }}>{m.margin}</td>
                      </tr>
                    ))}
                    <tr style={{ background: C.cream2, fontWeight: 800 }}><td className="p-3">Blended target</td><td className="p-3 text-right">—</td><td className="p-3 text-right">—</td><td className="p-3 text-right">~65%</td></tr>
                  </tbody>
                </table>
                <div className="rounded-xl p-4 mt-4" style={{ borderLeft: `5px solid ${C.green}`, background: "#F0FBF4" }}>
                  <b style={{ color: C.brown }}>Strategy:</b> Price silogs as the volume anchor, push high-margin drinks + extra rice/egg on every order, and let &ldquo;Overload&rdquo; raise the average ticket.
                </div>
              </Card>
            </motion.div>
          )}

          {/* STARTUP */}
          {tab === "startup" && (
            <motion.div key="startup" {...fade}>
              <SectionTitle icon={<Coins size={30} />}>Startup Costs &amp; Setup</SectionTitle>
              <p className="mb-6" style={{ color: C.muted, fontSize: 17 }}>A realistic, fully-equipped opening budget for a small Metro Manila / Las Piñas eatery. Conservative — go leaner with a smaller stall.</p>
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{ background: C.brown, color: "#fff" }}>
                    <th className="text-left p-3 rounded-l-lg">Capital item</th><th className="text-left p-3">Notes</th><th className="text-right p-3 rounded-r-lg">Cost (₱)</th>
                  </tr></thead>
                  <tbody>
                    {startup.map((s) => (
                      <tr key={s.item} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td className="p-3 font-semibold">{s.item}</td><td className="p-3 text-xs" style={{ color: C.muted }}>{s.note}</td><td className="p-3 text-right">{s.cost.toLocaleString("en-PH")}</td>
                      </tr>
                    ))}
                    <tr style={{ background: C.cream2, fontWeight: 800 }}>
                      <td className="p-3" colSpan={2}>TOTAL STARTUP CAPITAL</td>
                      <td className="p-3 text-right" style={{ color: C.red }}>{peso(startup.reduce((s, e) => s + e.cost, 0))}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="rounded-xl p-4 mt-4" style={{ borderLeft: `5px solid ${C.gold}`, background: "#FFFAEF" }}>
                  <b style={{ color: C.brown }}>Heads up on cash runway:</b> this ₱260K covers fixed assets and your first inventory only — it does not include a cash cushion. Keep a separate personal reserve of ~₱40K–₱60K to cover the first months of rent, salaries, and slow opening weeks before sales stabilize.
                </div>
              </Card>
              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>Permits &amp; legal checklist (PH)</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <Check><b>DTI</b> business name registration (sole prop) — or SEC if corporation.</Check>
                <Check><b>Barangay Clearance</b> for the location.</Check>
                <Check><b>Mayor&apos;s / Business Permit</b> from the city/municipality.</Check>
                <Check><b>BIR registration</b> — TIN, Certificate of Registration, official receipts, books.</Check>
                <Check><b>Sanitary Permit</b> + <b>Health Certificates</b> for all food handlers.</Check>
                <Check><b>Fire Safety Inspection Certificate</b> (BFP).</Check>
                <Check><b>SSS, PhilHealth, Pag-IBIG</b> employer registration for staff.</Check>
              </ul>
              <h3 className="font-extrabold mt-7 mb-3" style={{ color: C.brown, fontSize: 20 }}>Pre-opening timeline (8 weeks)</h3>
              <div className="relative pl-8" style={{ borderLeft: `3px solid ${C.gold}` }}>
                {timeline.map((t) => (
                  <div key={t.when} className="mb-5 relative">
                    <div className="absolute rounded-full" style={{ left: -38, top: 4, width: 16, height: 16, background: C.red, border: `3px solid ${C.cream}` }} />
                    <span className="inline-block font-bold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wide mb-1" style={{ background: C.brown, color: "#fff" }}>{t.when}</span>
                    <b className="block" style={{ color: C.brown, fontSize: 16 }}>{t.title}</b>
                    <span style={{ color: C.muted }}>{t.detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* OPERATIONS */}
          {tab === "operations" && (
            <motion.div key="operations" {...fade}>
              <SectionTitle icon={<Settings size={30} />}>Operations</SectionTitle>
              <p className="mb-6" style={{ color: C.muted, fontSize: 17 }}>Speed and consistency are the product. Standardize everything so any trained crew member produces the same plate, fast.</p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card><h4 className="font-bold mb-1" style={{ color: C.red }}>🌅 Open (4:30–5 AM)</h4><p style={{ color: C.muted }}>Pre-cook pares broth (started prior night), cook tapa/tocino batches, set rice cookers, fire grill for breakfast.</p></Card>
                <Card><h4 className="font-bold mb-1" style={{ color: C.red }}>☀️ Mid-day</h4><p style={{ color: C.muted }}>Replenish hot items, monitor rice, restock drinks, fast counter service, bus tables, reconcile at shift change.</p></Card>
                <Card><h4 className="font-bold mb-1" style={{ color: C.red }}>🌙 Late-night</h4><p style={{ color: C.muted }}>Pares is king. Keep broth hot, beef tender. Skeleton crew. Lock inventory count + sales report before close.</p></Card>
              </div>
              <h3 className="font-extrabold mb-2" style={{ color: C.brown, fontSize: 20 }}>Standard operating procedures</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <Check><b>Portion control:</b> color-coded scoops &amp; ladles. Every tapa &amp; rice portion fixed. Protects margins.</Check>
                <Check><b>FIFO inventory:</b> first-in-first-out on perishables; daily beef/rice count; date labels on prepped items.</Check>
                <Check><b>Broth standard:</b> master recipe card; the pares sabaw never changes — it is your moat.</Check>
                <Check><b>Cleanliness cadence:</b> hourly wipe-downs, end-of-shift deep clean, daily exhaust + grease check.</Check>
                <Check><b>Cash control:</b> pay-first model, sequential ORs, daily Z-report, owner reviews sales vs. inventory.</Check>
              </ul>
              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>Supply chain</h3>
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{ background: C.brown, color: "#fff" }}>
                    <th className="text-left p-3 rounded-l-lg">Ingredient</th><th className="text-left p-3">Source</th><th className="text-left p-3 rounded-r-lg">Buying tip</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Beef (pares + tapa)", "Wet market wholesaler", "Negotiate per-kilo at volume; brisket cuts for slow simmer"],
                      ["Rice", "Rice dealer in sacks", "Buy by sack; lock a reliable dealer for steady price"],
                      ["Eggs", "Egg supplier / palengke", "Order by tray; daily delivery to keep fresh"],
                      ["Cured meats", "Local maker or in-house", "In-house tapa/tocino later = higher margin + signature taste"],
                      ["Drinks & LPG", "Distributor accounts", "Consignment for softdrinks; track gas use per day"],
                    ].map((r) => (
                      <tr key={r[0]} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td className="p-3 font-semibold">{r[0]}</td><td className="p-3" style={{ color: C.muted }}>{r[1]}</td><td className="p-3" style={{ color: C.muted }}>{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="rounded-xl p-4 mt-4" style={{ borderLeft: `5px solid ${C.green}`, background: "#F0FBF4" }}>
                  <b style={{ color: C.brown }}>Margin upgrade:</b> Once stable, make your own tapa, tocino &amp; longganisa in-house. Cuts cured-meat cost 30–40% and makes your flavor un-copyable.
                </div>
              </Card>
              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>Lean tech stack</h3>
              <div>{["Tablet POS (sales + inventory)", "GCash / Maya QR", "GrabFood + Foodpanda", "Facebook Page + Messenger", "Daily sales logbook", "CCTV (loss prevention)"].map((p) => <Pill key={p}>{p}</Pill>)}</div>
            </motion.div>
          )}

          {/* TEAM */}
          {tab === "team" && (
            <motion.div key="team" {...fade}>
              <SectionTitle icon={<Users size={30} />}>Team &amp; Staffing</SectionTitle>
              <p className="mb-6" style={{ color: C.muted, fontSize: 17 }}>Lean crew, cross-trained, two shifts to cover ~18 operating hours. The owner is hands-on for the first 6–12 months.</p>
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{ background: C.brown, color: "#fff" }}>
                    <th className="text-left p-3 rounded-l-lg">Role</th><th className="text-center p-3">#</th><th className="text-left p-3">Responsibilities</th><th className="text-right p-3 rounded-r-lg">Monthly ₱</th>
                  </tr></thead>
                  <tbody>
                    {staff.map((s) => (
                      <tr key={s.role} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td className="p-3 font-semibold">{s.role}</td><td className="p-3 text-center">{s.count}</td><td className="p-3" style={{ color: C.muted }}>{s.duty}</td><td className="p-3 text-right">{s.pay.toLocaleString("en-PH")}</td>
                      </tr>
                    ))}
                    <tr style={{ background: C.cream2, fontWeight: 800 }}>
                      <td className="p-3" colSpan={3}>Base payroll (5 staff)</td>
                      <td className="p-3 text-right" style={{ color: C.red }}>{peso(staff.reduce((s, e) => s + e.pay, 0))}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs mt-3" style={{ color: C.muted }}>+ SSS/PhilHealth/Pag-IBIG employer share (~10–12%) and the owner&apos;s draw. The model uses a conservative ₱72,000 fully-loaded payroll. A lean opening can run 3–4 staff with the owner cooking.</p>
              </Card>
              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>Culture &amp; retention</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <Check>Free staff meal every shift (built into food cost) — morale up, theft incentive down.</Check>
                <Check>Cross-training so anyone can cover any station; no single point of failure.</Check>
                <Check>Small daily sales-target bonus / tip pool to reward speed and upselling.</Check>
                <Check>Respect &amp; fair pay — treated-well crew = consistent service = repeat customers.</Check>
              </ul>
              <div className="rounded-xl p-4 mt-5" style={{ borderLeft: `5px solid ${C.red}`, background: "#FFF4F3" }}>
                <b style={{ color: C.brown }}>Owner&apos;s role early on:</b> You are the head of quality, cash control, and marketing. Guard the broth recipe, watch food-cost %, be the face customers recognize. Systematize so you can step back by month 9–12.
              </div>
            </motion.div>
          )}

          {/* MARKETING */}
          {tab === "marketing" && (
            <motion.div key="marketing" {...fade}>
              <SectionTitle icon={<Megaphone size={30} />}>Marketing &amp; Growth</SectionTitle>
              <p className="mb-6" style={{ color: C.muted, fontSize: 17 }}>For a neighborhood eatery, marketing = location buzz + social proof + relentless consistency. Cheap, local, word-of-mouth driven.</p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card><h4 className="font-bold mb-2" style={{ color: C.red }}>🎉 Grand opening</h4>
                  <ul className="list-disc pl-5 text-sm" style={{ color: C.muted }}>
                    <li className="mb-1">Opening week: <b>₱1 add-on egg</b> or &ldquo;buy silog, free iced tea.&rdquo;</li>
                    <li className="mb-1">First-50-customers freebie / raffle.</li>
                    <li className="mb-1">Tarpaulin + barangay announcement + flyer drop to nearby offices.</li>
                    <li>Loud, festive opening day — balloons, sample tasting.</li>
                  </ul>
                </Card>
                <Card><h4 className="font-bold mb-2" style={{ color: C.red }}>📱 Social media</h4>
                  <ul className="list-disc pl-5 text-sm" style={{ color: C.muted }}>
                    <li className="mb-1">Facebook + Instagram + TikTok from day one.</li>
                    <li className="mb-1">Mouth-watering reels of the Pares Overload &amp; sizzling tapa.</li>
                    <li className="mb-1">Tag-a-friend &amp; check-in-for-discount promos.</li>
                    <li>Repost every customer photo — free social proof.</li>
                  </ul>
                </Card>
              </div>
              <h3 className="font-extrabold mb-2" style={{ color: C.brown, fontSize: 20 }}>Ongoing marketing engine</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <Check><b>Loyalty card</b> — &ldquo;10th silog libre&rdquo; punch card drives repeat visits.</Check>
                <Check><b>Combo upselling</b> — crew always offers drink + extra rice/egg (highest margin).</Check>
                <Check><b>Delivery apps</b> — GrabFood/Foodpanda for reach beyond walking distance.</Check>
                <Check><b>Daily specials</b> — chalkboard Ulam ng Araw, student combos, payday promos (15th &amp; 30th).</Check>
                <Check><b>Local partnerships</b> — bulk meal deals with offices, schools, driver associations.</Check>
              </ul>
              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>Marketing budget</h3>
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{ background: C.brown, color: "#fff" }}>
                    <th className="text-left p-3 rounded-l-lg">Channel</th><th className="text-right p-3">₱ / month</th><th className="text-left p-3 rounded-r-lg">Goal</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["FB/IG boosted posts", "2,000", "Local reach, awareness"],
                      ["Flyers / tarpaulin / print", "1,000", "Foot traffic capture"],
                      ["Promos / loyalty freebies", "1,500", "Repeat visits"],
                      ["Content / minor influencer", "500", "Viral reels / reviews"],
                    ].map((r) => (
                      <tr key={r[0]} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td className="p-3 font-semibold">{r[0]}</td><td className="p-3 text-right">₱{r[1]}</td><td className="p-3" style={{ color: C.muted }}>{r[2]}</td>
                      </tr>
                    ))}
                    <tr style={{ background: C.cream2, fontWeight: 800 }}><td className="p-3">Total</td><td className="p-3 text-right" style={{ color: C.red }}>₱5,000/mo</td><td className="p-3">~2% of sales</td></tr>
                  </tbody>
                </table>
              </Card>
              <div className="rounded-xl p-4 mt-5" style={{ borderLeft: `5px solid ${C.green}`, background: "#F0FBF4" }}>
                <b style={{ color: C.brown }}>Viral play:</b> Lean into one hero dish (Pares Overload) and one signature visual (marrow-shot / sabaw refill). One good TikTok of a ₱120 overload bowl can fill your store for weeks.
              </div>
            </motion.div>
          )}

          {/* FINANCIALS */}
          {tab === "financials" && (
            <motion.div key="financials" {...fade}>
              <SectionTitle icon={<TrendingUp size={30} />}>Financial Projections</SectionTitle>
              <p className="mb-6" style={{ color: C.muted, fontSize: 17 }}>Drag the sliders to model your scenario. Everything recalculates instantly — daily sales, monthly profit, margin, and payback on your ₱260K capital.</p>

              <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg,#FFFAF0,#FDEDD0)`, border: `2px solid ${C.gold}`, boxShadow: "0 10px 30px rgba(90,48,24,.12)" }}>
                <div className="grid sm:grid-cols-2 gap-x-7 gap-y-5">
                  {[
                    { label: "Customers per day", val: cust, set: setCust, min: 40, max: 250, step: 5, fmt: (v: number) => String(v) },
                    { label: "Average spend per customer (₱)", val: avg, set: setAvg, min: 60, max: 200, step: 5, fmt: (v: number) => String(v) },
                    { label: "Days open per month", val: days, set: setDays, min: 24, max: 31, step: 1, fmt: (v: number) => String(v) },
                    { label: "Food cost (% of sales)", val: cogsPct, set: setCogsPct, min: 28, max: 45, step: 1, fmt: (v: number) => v + "%" },
                    { label: "Monthly rent (₱)", val: rent, set: setRent, min: 10000, max: 60000, step: 1000, fmt: (v: number) => v.toLocaleString("en-PH") },
                    { label: "Monthly payroll (₱)", val: pay, set: setPay, min: 40000, max: 120000, step: 2000, fmt: (v: number) => v.toLocaleString("en-PH") },
                    { label: "Utilities — power/water/gas/net (₱)", val: util, set: setUtil, min: 12000, max: 60000, step: 1000, fmt: (v: number) => v.toLocaleString("en-PH") },
                    { label: "Startup capital to recover (₱)", val: cap, set: setCap, min: 200000, max: 900000, step: 5000, fmt: (v: number) => v.toLocaleString("en-PH") },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="flex justify-between font-bold text-sm mb-1" style={{ color: C.brown }}>
                        <span>{f.label}</span><span style={{ color: C.red }}>{f.fmt(f.val)}</span>
                      </label>
                      <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                        onChange={(e) => f.set(Number(e.target.value))} className="w-full" style={{ accentColor: C.red }} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  {[
                    { b: peso(fin.daily), s: "Daily Sales", good: false },
                    { b: peso(fin.revenue), s: "Monthly Revenue", good: false },
                    { b: peso(fin.profit), s: "Monthly Net Profit", good: true },
                    { b: fin.margin.toFixed(1) + "%", s: "Net Margin", good: true },
                  ].map((r) => (
                    <div key={r.s} className="rounded-xl p-3.5 text-center" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
                      <div className="font-black leading-tight" style={{ color: r.good ? (fin.profit > 0 ? C.green : C.red) : C.brown, fontSize: "clamp(18px,3.5vw,26px)" }}>{r.b}</div>
                      <div className="font-bold uppercase tracking-wide mt-0.5" style={{ color: C.muted, fontSize: 11 }}>{r.s}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {[
                    { b: pesoK(fin.annual), s: "Annual Net Profit" },
                    { b: fin.payback === Infinity ? "—" : fin.payback.toFixed(1) + " mo", s: "Payback Period" },
                    { b: String(fin.breakEvenCust), s: "Break-even cust/day" },
                    { b: fin.roi.toFixed(0) + "%", s: "1st-Year ROI" },
                  ].map((r) => (
                    <div key={r.s} className="rounded-xl p-3.5 text-center" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
                      <div className="font-black leading-tight" style={{ color: C.brown, fontSize: "clamp(18px,3.5vw,26px)" }}>{r.b}</div>
                      <div className="font-bold uppercase tracking-wide mt-0.5" style={{ color: C.muted, fontSize: 11 }}>{r.s}</div>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="font-extrabold mt-8 mb-2" style={{ color: C.brown, fontSize: 20 }}>Cost breakdown at current settings</h3>
              <Card>
                {fin.bars.map((b) => (
                  <div key={b.n} className="flex items-center gap-3 my-2">
                    <div className="text-sm font-bold" style={{ width: 120, color: C.brown }}>{b.n}</div>
                    <div className="flex-1 rounded-full overflow-hidden" style={{ background: C.cream2, height: 22, border: `1px solid ${C.border}` }}>
                      <div className="h-full flex items-center justify-end pr-2 text-xs font-bold text-white" style={{ width: `${Math.max(b.v / fin.max * 100, 6)}%`, background: b.c }}>{peso(b.v)}</div>
                    </div>
                  </div>
                ))}
              </Card>

              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>Monthly operating costs (base case · 100 cust/day)</h3>
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{ background: C.brown, color: "#fff" }}>
                    <th className="text-left p-3 rounded-l-lg">Line item</th><th className="text-right p-3">₱ / month</th><th className="text-right p-3 rounded-r-lg">% of sales</th>
                  </tr></thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}><td className="p-3 font-bold">Revenue</td><td className="p-3 text-right font-bold">300,000</td><td className="p-3 text-right">100%</td></tr>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}><td className="p-3">Less: Food cost (COGS)</td><td className="p-3 text-right" style={{ color: C.red }}>(105,000)</td><td className="p-3 text-right">35.0%</td></tr>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}><td className="p-3 font-bold">Gross Profit</td><td className="p-3 text-right font-bold" style={{ color: C.green }}>195,000</td><td className="p-3 text-right">65.0%</td></tr>
                    {[
                      ["Rent", "20,000", "6.7%"],
                      ["Payroll (loaded, 5 staff)", "72,000", "24.0%"],
                      ["Utilities (power/water/gas/net)", "30,000", "10.0%"],
                      ["Packaging & supplies", "9,000", "3.0%"],
                      ["Marketing", "5,000", "1.7%"],
                      ["Misc / maintenance", "7,000", "2.3%"],
                    ].map((r) => (
                      <tr key={r[0]} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td className="p-3">{r[0]}</td><td className="p-3 text-right" style={{ color: C.red }}>({r[1]})</td><td className="p-3 text-right" style={{ color: C.muted }}>{r[2]}</td>
                      </tr>
                    ))}
                    <tr style={{ borderBottom: `2px solid ${C.brown}` }}><td className="p-3 font-bold">Total operating expenses</td><td className="p-3 text-right font-bold" style={{ color: C.red }}>(143,000)</td><td className="p-3 text-right">47.7%</td></tr>
                  </tbody>
                  <tfoot><tr style={{ background: C.cream2, fontWeight: 800 }}><td className="p-3">NET PROFIT (before tax)</td><td className="p-3 text-right" style={{ color: C.green }}>₱52,000</td><td className="p-3 text-right">17.3%</td></tr></tfoot>
                </table>
                <p className="text-xs mt-3" style={{ color: C.muted }}>Fixed monthly OPEX (rent + payroll + utilities + marketing + misc) ≈ ₱134,000; food cost &amp; packaging scale with sales. Move the sliders above to model other volumes.</p>
              </Card>

              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>3-year outlook</h3>
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{ background: C.brown, color: "#fff" }}>
                    <th className="text-left p-3 rounded-l-lg">Year</th><th className="text-left p-3">Avg cust/day</th><th className="text-right p-3">Revenue</th><th className="text-right p-3">Net profit</th><th className="text-left p-3 rounded-r-lg">Milestone</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Year 1", "90 → 120", "₱3.6M", "₱550K", "Recover capital, build suki base"],
                      ["Year 2", "140", "₱5.1M", "₱950K", "In-house tapa, delivery scale, retail sauces"],
                      ["Year 3", "160 + Branch 2", "₱9M+", "₱1.6M+", "2nd branch / start franchising"],
                    ].map((r) => (
                      <tr key={r[0]} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td className="p-3 font-semibold">{r[0]}</td><td className="p-3" style={{ color: C.muted }}>{r[1]}</td>
                        <td className="p-3 text-right">{r[2]}</td><td className="p-3 text-right font-bold" style={{ color: C.green }}>{r[3]}</td><td className="p-3" style={{ color: C.muted }}>{r[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          )}

          {/* RISK */}
          {tab === "risk" && (
            <motion.div key="risk" {...fade}>
              <SectionTitle icon={<ShieldAlert size={30} />}>Risk Management &amp; Growth</SectionTitle>
              <p className="mb-6" style={{ color: C.muted, fontSize: 17 }}>Know the threats before they hit, and have the next move ready when it works.</p>
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{ background: C.brown, color: "#fff" }}>
                    <th className="text-left p-3 rounded-l-lg">Risk</th><th className="text-left p-3">Impact</th><th className="text-left p-3 rounded-r-lg">Mitigation</th>
                  </tr></thead>
                  <tbody>
                    {risks.map((r) => (
                      <tr key={r.risk} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td className="p-3 font-semibold">{r.risk}</td><td className="p-3" style={{ color: C.muted }}>{r.impact}</td><td className="p-3" style={{ color: C.muted }}>{r.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              <h3 className="font-extrabold mt-7 mb-2" style={{ color: C.brown, fontSize: 20 }}>Break-even reality check</h3>
              <Card>
                <p style={{ color: C.ink }}>Fixed monthly costs ≈ <b>₱134,000</b> (rent + payroll + utilities + marketing + misc). After ~62% margin (net of food + supplies), you break even at about <b>₱216,000 in monthly sales</b> — roughly <b>73 customers/day</b> at ₱100 average.</p>
                <div className="mt-3">
                  {[
                    { l: "Break-even", v: "73 cust/day", w: 56 },
                    { l: "Base case", v: "100 cust/day", w: 77 },
                    { l: "Strong case", v: "130+ cust/day", w: 100 },
                  ].map((b) => (
                    <div key={b.l} className="flex items-center gap-3 my-2">
                      <div className="text-sm font-bold" style={{ width: 110, color: C.brown }}>{b.l}</div>
                      <div className="flex-1 rounded-full overflow-hidden" style={{ background: C.cream2, height: 22, border: `1px solid ${C.border}` }}>
                        <div className="h-full flex items-center justify-end pr-2 text-xs font-bold text-white" style={{ width: `${b.w}%`, background: `linear-gradient(90deg,${C.red},${C.gold})` }}>{b.v}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm mt-2" style={{ color: C.muted }}>Every customer past ~73/day is mostly profit — fixed costs are already covered. This is the leverage of a high-turnover eatery.</p>
              </Card>
              <h3 className="font-extrabold mt-7 mb-3" style={{ color: C.brown, fontSize: 20 }}>Growth roadmap</h3>
              <div className="relative pl-8" style={{ borderLeft: `3px solid ${C.gold}` }}>
                {growth.map((t) => (
                  <div key={t.when} className="mb-5 relative">
                    <div className="absolute rounded-full" style={{ left: -38, top: 4, width: 16, height: 16, background: C.red, border: `3px solid ${C.cream}` }} />
                    <span className="inline-block font-bold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wide mb-1" style={{ background: C.brown, color: "#fff" }}>{t.when}</span>
                    <b className="block" style={{ color: C.brown, fontSize: 16 }}>{t.title}</b>
                    <span style={{ color: C.muted }}>{t.detail}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-4 mt-5" style={{ borderLeft: `5px solid ${C.green}`, background: "#F0FBF4" }}>
                <b style={{ color: C.brown }}>The endgame:</b> A single proven, systematized PARESILOGAN branch is a ₱500K–₱1M/year profit asset AND a franchise template. Build one perfectly, then copy-paste. 🐐
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="text-center py-9 px-4" style={{ background: C.brown, color: "#F6E3C7", borderTop: `6px solid ${C.gold}` }}>
        <p className="font-black tracking-widest mb-1" style={{ color: "#fff", fontSize: 22 }}>PARESILOGAN</p>
        <p className="mb-1">Pares &amp; Tapsilogan ng Bayan — <b style={{ color: "#fff" }}>Mura, Masarap, Masustansya</b></p>
        <p className="text-xs opacity-80 mt-2">Interactive Business Plan · BVN Official · bvnofficial.com/business</p>
        <p className="text-xs opacity-60 mt-2 max-w-2xl mx-auto">All figures are planning estimates for Metro Manila / Las Piñas market conditions. Validate with your actual location, suppliers, and local permit fees before investing.</p>
      </footer>
    </div>
  );
}
