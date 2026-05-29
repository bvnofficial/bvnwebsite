"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Star, TrendingUp, Settings, Megaphone,
  ChevronDown, ChevronUp, CheckCircle, AlertCircle,
  Instagram, Facebook, MapPin, Clock, Users,
  Package, Zap, Award, ShoppingBag, Utensils,
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  red: "#C41E3A",
  redDark: "#8B0000",
  orange: "#E8721C",
  gold: "#FFB800",
  dark: "#0A0300",
  surface: "#160800",
  card: "#231000",
  cardHover: "#2E1500",
  border: "#3D1A00",
  text: "#FFF5E8",
  muted: "rgba(255,245,232,0.52)",
  dim: "rgba(255,245,232,0.22)",
};

// ── Sauces ────────────────────────────────────────────────────
const sauces = [
  { id: 1, name: "Inasal Klasiko", tag: "Signature", color: "#E8721C", emoji: "🍋", heat: 1, region: "Bacolod", desc: "Lemongrass, calamansi, and annatto butter — the soul of Filipino rotisserie. Bright, citrusy, golden." },
  { id: 2, name: "Adobo Negra", tag: "Dark & Deep", color: "#5A3200", emoji: "🧄", heat: 1, region: "Nationwide", desc: "Dark soy, native vinegar, roasted garlic glaze. Sticky, rich, and impossibly savoury." },
  { id: 3, name: "Bicol Maanghang", tag: "🔥 Hottest", color: "#CC2200", emoji: "🌶️", heat: 5, region: "Bicol", desc: "Bird's eye chili meets coconut cream. Fiery, creamy, and absolutely addictive. Not for the faint-hearted." },
  { id: 4, name: "Sinamak Ilokano", tag: "Tangy", color: "#7A4010", emoji: "🫙", heat: 2, region: "Ilocos", desc: "Spiced Ilocos cane vinegar with garlic and chili peppers. Sharp, clean, cuts right through the fat." },
  { id: 5, name: "Laing Sarsa", tag: "Creamy", color: "#2D5016", emoji: "🥥", heat: 2, region: "Bicol", desc: "Taro leaves simmered in coconut milk with dried fish. Earthy, smoky, unforgettable on rotisserie skin." },
  { id: 6, name: "Sinigang Asim", tag: "Sour Power", color: "#4A7A2E", emoji: "🍅", heat: 1, region: "Nationwide", desc: "Tamarind-based tangy glaze with roasted tomato. Bright and acidic — the palate cleanser you need." },
  { id: 7, name: "Mang Tomas Supreme", tag: "Crowd Fave", color: "#6B3A00", emoji: "👑", heat: 0, region: "Nationwide", desc: "Elevated Filipino liver sauce with native spices. Rich, thick, the ultimate comfort dip." },
  { id: 8, name: "Banana Ketchup Fiesta", tag: "Sweet", color: "#CC5500", emoji: "🍌", heat: 0, region: "Nationwide", desc: "Classic Filipino banana ketchup with calamansi zest. Sweet, tangy, party-ready. Kids go wild for this." },
  { id: 9, name: "Bagoong Verde", tag: "Funky", color: "#3D7A3D", emoji: "🦐", heat: 2, region: "Pangasinan", desc: "Green shrimp paste, lime, and garlic. Funky, pungent, intensely umami — uniquely Pinoy." },
  { id: 10, name: "Lechon Sauce Klasiko", tag: "Classic", color: "#8B1A1A", emoji: "🔥", heat: 0, region: "Cebu", desc: "The original liver-based lechon dipping sauce. Rich, peppery, and deeply Filipino. The closer." },
  { id: 11, name: "Adobo Sarsa", tag: "New", color: "#3A2800", emoji: "🍶", heat: 1, region: "Nationwide", desc: "Slow-reduced adobo sauce — soy, vinegar, bay leaf, and black pepper. Poured warm over your chicken, it soaks into every bite." },
  { id: 12, name: "Kaldereta Sarsa", tag: "New", color: "#8B2500", emoji: "🫕", heat: 2, region: "Luzon", desc: "Tomato-based kaldereta sauce with liver spread, olives, and bell pepper. Bold, hearty, and rich — turns your box into a full Filipino fiesta." },
  { id: 13, name: "Gravy Klasiko", tag: "New", color: "#5C4A1E", emoji: "🥣", heat: 0, region: "Nationwide", desc: "Thick, golden chicken gravy made from rotisserie drippings. Poured generously over rice and chicken. Simple, comforting, dangerous." },
];

// ── Menu ──────────────────────────────────────────────────────
const menuItems = [
  { name: "Sarsa Box Solo", desc: "¼ spatchcock chicken · Java rice · 1 sarsa · atchara", price: 159, badge: "BESTSELLER", badgeColor: C.orange },
  { name: "Sarsa Box Duo", desc: "½ spatchcock chicken · Java rice · 2 sarsas · atchara", price: 289, badge: "POPULAR", badgeColor: C.red },
  { name: "Sarsa Box Fiesta", desc: "Whole spatchcock · 3 cups rice · 3 sarsas · atchara + drink", price: 499, badge: "SULIT", badgeColor: "#2D7A2D" },
  { name: "Sarsa Add-On", desc: "Any signature sauce in a 50ml dipping cup", price: 25, badge: null, badgeColor: "" },
  { name: "Java Rice Solo", desc: "Garlic java rice, side order", price: 35, badge: null, badgeColor: "" },
  { name: "Egg or Coleslaw", desc: "Sunny side up or creamy coleslaw add-on", price: 30, badge: null, badgeColor: "" },
];

// ── Operations steps ──────────────────────────────────────────
const opsSteps = [
  { time: "5:00 AM", task: "Marinate chickens overnight", icon: "🐔", detail: "Dry-rub with salt, pepper, lemongrass, calamansi. Spatchcock and flatten. Refrigerate." },
  { time: "9:00 AM", task: "Cart setup & prep", icon: "🛒", detail: "Set up stainless cart. Load rotisserie spit. Prep rice, sauces, packaging materials." },
  { time: "10:00 AM", task: "Fire up rotisserie", icon: "🔥", detail: "LPG burners on. Load chickens on spit. Cooking time: 45–60 min per batch. Baste every 15 min." },
  { time: "11:00 AM", task: "Open for service", icon: "🎉", detail: "First batch ready. Java rice cooking. All sauces portioned and labeled. Atchara prepped." },
  { time: "11–8 PM", task: "Rolling service", icon: "⚡", detail: "Continuous rotation: sell, replenish, cook next batch. Maintain 2-chicken buffer at all times." },
  { time: "8:00 PM", task: "Close & clean", icon: "🧹", detail: "Count inventory. Clean cart and spit. Record daily sales. Marinate next day's batch." },
];

// ── Equipment list ────────────────────────────────────────────
const equipment = [
  { item: "Custom stainless rotisserie cart", cost: 35000 },
  { item: "Electric rotisserie motor + spit rods (3)", cost: 12000 },
  { item: "LPG burner setup + hose + regulator", cost: 5000 },
  { item: "Initial chicken stock (50 heads)", cost: 12000 },
  { item: "Sauce ingredients (all 10 variants)", cost: 8000 },
  { item: "Packaging: boxes, cups, bags (500 sets)", cost: 6000 },
  { item: "Branding: tarpaulin, stickers, uniforms", cost: 5000 },
  { item: "Permits: barangay, business, sanitary", cost: 8000 },
  { item: "Working capital buffer", cost: 9000 },
];

// ── Marketing campaigns ───────────────────────────────────────
const campaigns = [
  {
    phase: "Phase 1 — Launch", timeline: "Week 1–2", color: C.red,
    activities: [
      "Teaser posts: 'Sarsa Republic is coming 🇵🇭🔥' — 7 days countdown on IG/FB",
      "Behind-the-scenes Reels: cart build, sauce prep, chicken marinade process",
      "Free taste day: first 30 customers get a Sarsa Box free. Film every reaction.",
      "Influencer invite: 3 local food content creators, free boxes, tag @sarsarepublika",
    ],
  },
  {
    phase: "Phase 2 — Growth", timeline: "Week 3–8", color: C.orange,
    activities: [
      "'Sarsa of the Week' feature — highlight one sauce every week with story post",
      "UGC campaign: 'Which sarsa are you?' personality quiz on Stories",
      "Loyalty stamp card: buy 5 boxes, get 1 free — post it on IG stories daily",
      "Collab with nearby businesses: rice supplier, drinks brand cross-promotion",
    ],
  },
  {
    phase: "Phase 3 — Scale", timeline: "Month 2+", color: "#2D7A2D",
    activities: [
      "GrabFood / FoodPanda listing — delivery ready Sarsa Boxes",
      "Catering packages: Sarsa Republic at your events (minimum 20 boxes)",
      "Second cart: target high-foot-traffic area (market, school, office district)",
      "Build a Sarsa Club loyalty group on Viber/Telegram — exclusive promos",
    ],
  },
];

// ── Tabs ──────────────────────────────────────────────────────
type Tab = "brand" | "menu" | "marketing" | "operations" | "financials";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "brand",      label: "Brand",       icon: <Star size={14} /> },
  { id: "menu",       label: "Menu & Sauces", icon: <Flame size={14} /> },
  { id: "marketing",  label: "Marketing",   icon: <Megaphone size={14} /> },
  { id: "operations", label: "Operations",  icon: <Settings size={14} /> },
  { id: "financials", label: "Financials",  icon: <TrendingUp size={14} /> },
];

// ── Heat indicator ────────────────────────────────────────────
function HeatDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className="w-2 h-2 rounded-full"
          style={{ background: n <= level ? "#CC2200" : "rgba(255,245,232,0.15)" }}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function SarsaRepublikaPage() {
  const [tab, setTab] = useState<Tab>("brand");
  const [openSauce, setOpenSauce] = useState<number | null>(null);
  const [boxesPerDay, setBoxesPerDay] = useState(60);

  // Financial calculations
  const avgPrice = 165;
  const daysPerMonth = 26;
  const cogsPct = 0.34;
  const labor = 18000;
  const fixedMonthly = 12000; // rent, LPG, packaging, misc

  const financials = useMemo(() => {
    const dailyRevenue = boxesPerDay * avgPrice;
    const monthlyRevenue = dailyRevenue * daysPerMonth;
    const cogs = monthlyRevenue * cogsPct;
    const totalCosts = cogs + labor + fixedMonthly;
    const netProfit = monthlyRevenue - totalCosts;
    const totalStartup = equipment.reduce((s, e) => s + e.cost, 0);
    const paybackMonths = totalStartup / Math.max(netProfit, 1);
    return { dailyRevenue, monthlyRevenue, cogs, totalCosts, netProfit, totalStartup, paybackMonths };
  }, [boxesPerDay]);

  const fade = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  return (
    <div style={{ background: C.dark, color: C.text, minHeight: "100vh", fontFamily: "inherit" }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${C.redDark}55 0%, ${C.dark} 70%)` }}
      >
        {/* Decorative ring */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border"
          style={{ borderColor: `${C.orange}55`, background: `${C.orange}15`, color: C.orange }}
        >
          <Flame size={12} /> Business Concept · Developed by BVN
        </motion.div>

        {/* Logo text */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <div className="text-7xl md:text-9xl mb-2" style={{ lineHeight: 1 }}>🐓</div>
          <h1
            className="font-heading font-extrabold text-5xl md:text-7xl lg:text-8xl leading-none mb-3"
            style={{ color: C.text, letterSpacing: "-0.02em" }}
          >
            SARSA
          </h1>
          <h1
            className="font-heading font-extrabold text-5xl md:text-7xl lg:text-8xl leading-none"
            style={{
              background: `linear-gradient(135deg, ${C.red}, ${C.orange})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            REPUBLIKA
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-6 text-lg md:text-xl max-w-xl"
          style={{ color: C.muted }}
        >
          Filipino spatchcock rotisserie chicken · 10 signature sauces · served in a box, street-food style
        </motion.p>

        {/* Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-8"
        >
          {[
            { icon: "🔥", text: "Spatchcock Rotisserie" },
            { icon: "🫙", text: "13 Filipino Sauces" },
            { icon: "📦", text: "Rice Box Concept" },
            { icon: "🛒", text: "Stainless Street Cart" },
          ].map((p) => (
            <div
              key={p.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: `${C.card}`, border: `1px solid ${C.border}`, color: C.text }}
            >
              <span>{p.icon}</span> {p.text}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── STICKY TABS ───────────────────────────────────── */}
      <div className="sticky top-0 z-40" style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all"
                style={{
                  background: tab === t.id ? C.red : "transparent",
                  color: tab === t.id ? "#fff" : C.muted,
                  border: `1px solid ${tab === t.id ? C.red : "transparent"}`,
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ───────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">

          {/* ── BRAND TAB ─────────────────────────────────── */}
          {tab === "brand" && (
            <motion.div key="brand" {...fade}>

              {/* Brand Story */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.orange }}>The Concept</p>
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-heading">One Chicken.<br />A Republic of Sauces.</h2>
                  <p className="text-base leading-relaxed mb-4" style={{ color: C.muted }}>
                    Sarsa Republika takes everything Filipinos love about lechon manok — the golden skin, the smoky rotisserie smell, the community gathering around a cart — and upgrades it.
                  </p>
                  <p style={{ color: C.muted }} className="text-base leading-relaxed mb-4">
                    Spatchcock (butterfly) cut means faster, more even cooking and crispier skin all around. A premium stainless cart signals quality before the customer even tastes anything. And 13 rotating Filipino sauces make every visit different.
                  </p>
                  <p style={{ color: C.muted }} className="text-base leading-relaxed">
                    The packaging is the game-changer: a Peri Peri-style rice box, branded, clean, Instagrammable. You&apos;re not just buying chicken — you&apos;re buying an experience.
                  </p>
                </div>

                {/* Brand identity cards */}
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Brand Name", value: "Sarsa Republika", note: '"Sarsa" = sauce · "Republika" = republic' },
                    { label: "Tagline", value: "Sarsa ng Pilipino", note: "The sauce of the Filipino" },
                    { label: "Sub-tagline", value: "One chicken. Unlimited sarsa.", note: "Highlighting the sauce variety USP" },
                    { label: "Tone of Voice", value: "Bold · Proud · Makulay", note: "Filipino pride meets modern street food" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.dim }}>{item.label}</p>
                      <p className="text-lg font-bold" style={{ color: C.text }}>{item.value}</p>
                      <p className="text-xs mt-1" style={{ color: C.muted }}>{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.orange }}>Brand Palette</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { name: "Republika Red", hex: "#C41E3A", role: "Primary" },
                    { name: "Rotisserie Orange", hex: "#E8721C", role: "Secondary" },
                    { name: "Gold Sarsa", hex: "#FFB800", role: "Accent" },
                    { name: "Burnt Dark", hex: "#231000", role: "Background" },
                  ].map((col) => (
                    <div key={col.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                      <div className="h-20" style={{ background: col.hex }} />
                      <div className="p-3" style={{ background: C.card }}>
                        <p className="font-bold text-sm">{col.name}</p>
                        <p className="text-xs" style={{ color: C.muted }}>{col.hex}</p>
                        <p className="text-xs" style={{ color: C.dim }}>{col.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* USPs */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.orange }}>Why Sarsa Republika Wins</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: "🐔", title: "Spatchcock Method", desc: "Butterfly cut = 40% faster cooking, crispier skin on all sides, more even heat distribution." },
                    { icon: "🫙", title: "13 Filipino Sauces", desc: "No other cart offers this. Each sauce is a different region, a different story. Repeat customers guaranteed." },
                    { icon: "📦", title: "The Sarsa Box", desc: "Rice box presentation = premium perception, higher price tolerance, Instagrammable, delivery-ready." },
                    { icon: "🛒", title: "Premium Stainless Cart", desc: "Signals cleanliness, quality, and legitimacy before the customer even tastes anything." },
                    { icon: "🏳️", title: "Filipino Pride Branding", desc: "Every sauce tells a regional story. Customers feel connected to their heritage with every bite." },
                    { icon: "🚀", title: "Scalable Model", desc: "Single cart → multiple carts → GrabFood → catering → franchise. The path to scale is clear." },
                  ].map((u) => (
                    <div
                      key={u.title}
                      className="rounded-xl p-5 flex flex-col gap-3"
                      style={{ background: C.card, border: `1px solid ${C.border}` }}
                    >
                      <div className="text-3xl">{u.icon}</div>
                      <div>
                        <p className="font-bold text-sm mb-1">{u.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{u.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── MENU & SAUCES TAB ─────────────────────────── */}
          {tab === "menu" && (
            <motion.div key="menu" {...fade}>

              {/* Menu */}
              <div className="mb-14">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>The Menu</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">What We Sell</h2>
                <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                  <div className="hidden md:grid grid-cols-12 px-5 py-3 text-xs font-bold uppercase tracking-widest" style={{ background: C.card, color: C.muted, borderBottom: `1px solid ${C.border}` }}>
                    <span className="col-span-5">Item</span>
                    <span className="col-span-5">Description</span>
                    <span className="col-span-2 text-right">Price</span>
                  </div>
                  {menuItems.map((item, i) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-0 px-5 py-4 items-center"
                      style={{
                        background: i % 2 === 0 ? C.surface : C.card,
                        borderBottom: i < menuItems.length - 1 ? `1px solid ${C.border}` : "none",
                      }}
                    >
                      <div className="md:col-span-5 flex items-center gap-3">
                        <span className="font-bold text-sm">{item.name}</span>
                        {item.badge && (
                          <span
                            className="text-[10px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wider"
                            style={{ background: item.badgeColor }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="md:col-span-5 text-xs" style={{ color: C.muted }}>{item.desc}</div>
                      <div className="md:col-span-2 text-right font-heading font-extrabold text-lg" style={{ color: C.gold }}>
                        ₱{item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sauces */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>The Sauces</p>
                <h2 className="text-3xl font-extrabold font-heading mb-2">10 Regions. 10 Sarsas.</h2>
                <p className="mb-6 text-sm" style={{ color: C.muted }}>Click any sauce to learn more. Rotate weekly specials to keep customers coming back.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sauces.map((sauce) => {
                    const isOpen = openSauce === sauce.id;
                    return (
                      <motion.div
                        key={sauce.id}
                        layout
                        onClick={() => setOpenSauce(isOpen ? null : sauce.id)}
                        className="rounded-xl p-5 cursor-pointer transition-all"
                        style={{
                          background: isOpen ? C.cardHover : C.card,
                          border: `1px solid ${isOpen ? sauce.color : C.border}`,
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                              style={{ background: `${sauce.color}25` }}
                            >
                              {sauce.emoji}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{sauce.name}</p>
                              <p className="text-xs mt-0.5" style={{ color: sauce.color }}>{sauce.tag}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {isOpen ? <ChevronUp size={16} style={{ color: C.muted }} /> : <ChevronDown size={16} style={{ color: C.muted }} />}
                          </div>
                        </div>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 border-t mt-4" style={{ borderColor: C.border }}>
                                <p className="text-xs leading-relaxed mb-3" style={{ color: C.muted }}>{sauce.desc}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs" style={{ color: C.dim }}>Heat:</span>
                                    <HeatDots level={sauce.heat} />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin size={11} style={{ color: C.dim }} />
                                    <span className="text-xs" style={{ color: C.muted }}>{sauce.region}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── MARKETING TAB ─────────────────────────────── */}
          {tab === "marketing" && (
            <motion.div key="marketing" {...fade}>

              {/* Target market */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Target Market</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">Who Buys From Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { emoji: "👨‍💼", name: "The Daily Commuter", age: "25–40", desc: "Wants a fast, filling, affordable lunch near work or transit hubs. Values convenience and taste.", spend: "₱150–200/visit", freq: "3–4×/week" },
                    { emoji: "👨‍👩‍👧", name: "The Family", age: "30–50", desc: "Looking for a satisfying dinner takeaway. Loves the Fiesta Box for the family. Values the rice + sauce combo.", spend: "₱400–600/visit", freq: "1–2×/week" },
                    { emoji: "📱", name: "The Foodie", age: "18–30", desc: "Follows food content online. Will try for the sauces, share on IG, come back for more. Your biggest marketer.", spend: "₱180–280/visit", freq: "2–3×/week" },
                  ].map((p) => (
                    <div key={p.name} className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <div className="text-4xl mb-3">{p.emoji}</div>
                      <p className="font-bold text-base mb-1">{p.name}</p>
                      <p className="text-xs mb-3" style={{ color: C.orange }}>Age {p.age}</p>
                      <p className="text-xs leading-relaxed mb-4" style={{ color: C.muted }}>{p.desc}</p>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs">
                          <span style={{ color: C.dim }}>Avg. spend</span>
                          <span className="font-semibold">{p.spend}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span style={{ color: C.dim }}>Frequency</span>
                          <span className="font-semibold">{p.freq}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social media */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Social Media Strategy</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">Content That Sells</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#E1306C25" }}>
                        <Instagram size={18} style={{ color: "#E1306C" }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Instagram @sarsarepublika</p>
                        <p className="text-xs" style={{ color: C.muted }}>Primary visual channel</p>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {[
                        "Daily: Box reveal Reel (slow pour of sauce onto chicken) — 3–5s hook",
                        "Weekly: 'Sarsa of the Week' carousel — sauce origin story + how to pair",
                        "Biweekly: Customer reaction video — authentic, unscripted",
                        "Stories: Daily polls ('Inasal or Adobo Negra today?'), countdown to new sauce",
                      ].map((item) => (
                        <li key={item} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                          <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: C.orange }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#1877F225" }}>
                        <Facebook size={18} style={{ color: "#1877F2" }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Facebook Page: Sarsa Republika</p>
                        <p className="text-xs" style={{ color: C.muted }}>Community & local reach</p>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {[
                        "Post daily location update: 'We're at [area] today!' with map pin",
                        "Weekly: Sauce pairing guide — text post with photo, high shareability",
                        "Run a ₱500 Sarsa Box giveaway — comment to join, must tag 2 friends",
                        "Join local food Facebook groups and post weekly (with admin permission)",
                      ].map((item) => (
                        <li key={item} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                          <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: C.orange }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Campaign phases */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Launch Roadmap</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">90-Day Campaign Plan</h2>
                <div className="flex flex-col gap-5">
                  {campaigns.map((c) => (
                    <div key={c.phase} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${c.color}55` }}>
                      <div className="px-5 py-3 flex items-center justify-between" style={{ background: `${c.color}20`, borderBottom: `1px solid ${c.color}30` }}>
                        <div>
                          <p className="font-bold text-sm">{c.phase}</p>
                          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{c.timeline}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                      </div>
                      <div className="px-5 py-4" style={{ background: C.card }}>
                        <ul className="flex flex-col gap-2.5">
                          {c.activities.map((a) => (
                            <li key={a} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                              <Zap size={12} className="flex-shrink-0 mt-0.5" style={{ color: c.color }} />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── OPERATIONS TAB ────────────────────────────── */}
          {tab === "operations" && (
            <motion.div key="operations" {...fade}>

              {/* Daily workflow */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Daily Operations</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">A Day in the Republika</h2>
                <div className="relative flex flex-col gap-4">
                  <div className="absolute left-[22px] top-0 bottom-0 w-0.5" style={{ background: C.border }} />
                  {opsSteps.map((step, i) => (
                    <div key={step.time} className="flex gap-5 relative">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10"
                        style={{ background: C.card, border: `2px solid ${C.border}` }}
                      >
                        {step.icon}
                      </div>
                      <div className="flex-1 rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-sm">{step.task}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: C.surface, color: C.orange }}>
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Equipment & Setup</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">What You Need to Start</h2>
                <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                  {equipment.map((item, i) => (
                    <div
                      key={item.item}
                      className="flex items-center justify-between px-5 py-4"
                      style={{
                        background: i % 2 === 0 ? C.surface : C.card,
                        borderBottom: i < equipment.length - 1 ? `1px solid ${C.border}` : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Package size={14} style={{ color: C.orange }} />
                        <span className="text-sm">{item.item}</span>
                      </div>
                      <span className="font-heading font-bold text-sm" style={{ color: C.gold }}>₱{item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                  <div
                    className="flex items-center justify-between px-5 py-4"
                    style={{ background: `${C.red}20`, borderTop: `2px solid ${C.red}` }}
                  >
                    <span className="font-bold">Total Startup Cost</span>
                    <span className="font-heading font-extrabold text-lg" style={{ color: C.gold }}>
                      ₱{equipment.reduce((s, e) => s + e.cost, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Staffing */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Staffing</p>
                <h2 className="text-3xl font-extrabold font-heading mb-6">Your Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      role: "Pitmaster / Cook", emoji: "👨‍🍳", salary: "₱9,000–12,000/mo",
                      duties: ["Marinate and load chickens onto spit", "Monitor rotisserie and baste", "Batch cooking and quality control", "Prep sauces and rice"],
                    },
                    {
                      role: "Cashier / Packager", emoji: "🧑‍💼", salary: "₱7,000–9,000/mo",
                      duties: ["Take orders and handle cash/GCash", "Pack Sarsa Boxes to standard", "Manage sauce portioning", "Customer service and upselling"],
                    },
                  ].map((staff) => (
                    <div key={staff.role} className="rounded-xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{staff.emoji}</span>
                        <div>
                          <p className="font-bold text-sm">{staff.role}</p>
                          <p className="text-xs" style={{ color: C.orange }}>{staff.salary}</p>
                        </div>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {staff.duties.map((d) => (
                          <li key={d} className="flex gap-2 text-xs" style={{ color: C.muted }}>
                            <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: C.orange }} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── FINANCIALS TAB ────────────────────────────── */}
          {tab === "financials" && (
            <motion.div key="financials" {...fade}>

              {/* Calculator */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.orange }}>Revenue Calculator</p>
                <h2 className="text-3xl font-extrabold font-heading mb-2">How Much Will You Make?</h2>
                <p className="text-sm mb-8" style={{ color: C.muted }}>Adjust the slider to model your daily sales volume. All calculations use live pricing.</p>

                {/* Slider */}
                <div className="rounded-2xl p-6 mb-8" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-sm">Boxes Sold Per Day</p>
                    <p className="font-heading font-extrabold text-2xl" style={{ color: C.gold }}>{boxesPerDay}</p>
                  </div>
                  <input
                    type="range" min={20} max={200} step={5}
                    value={boxesPerDay}
                    onChange={(e) => setBoxesPerDay(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: C.red }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: C.dim }}>20 (slow day)</span>
                    <span className="text-xs" style={{ color: C.dim }}>200 (peak)</span>
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Daily Revenue", value: `₱${financials.dailyRevenue.toLocaleString()}`, sub: `${boxesPerDay} boxes × ₱${avgPrice}`, color: C.gold },
                    { label: "Monthly Revenue", value: `₱${financials.monthlyRevenue.toLocaleString()}`, sub: `${daysPerMonth} days open`, color: C.orange },
                    { label: "Monthly Costs", value: `₱${financials.totalCosts.toLocaleString()}`, sub: "COGS + labor + overhead", color: C.red },
                    { label: "Net Profit", value: `₱${Math.max(0, financials.netProfit).toLocaleString()}`, sub: financials.netProfit < 0 ? "⚠️ Increase volume" : "Per month", color: financials.netProfit >= 0 ? "#2D9E2D" : C.red },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl p-4 flex flex-col gap-1" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <p className="text-xs" style={{ color: C.dim }}>{m.label}</p>
                      <p className="font-heading font-extrabold text-xl leading-tight" style={{ color: m.color }}>{m.value}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{m.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Payback */}
                <div
                  className="rounded-xl p-5 flex items-center gap-4"
                  style={{ background: financials.paybackMonths <= 3 ? "#0D2E0D" : C.card, border: `1px solid ${financials.paybackMonths <= 3 ? "#2D9E2D55" : C.border}` }}
                >
                  {financials.paybackMonths <= 3
                    ? <CheckCircle size={24} style={{ color: "#2D9E2D", flexShrink: 0 }} />
                    : <AlertCircle size={24} style={{ color: C.orange, flexShrink: 0 }} />
                  }
                  <div>
                    <p className="font-bold text-sm">
                      Startup recovered in <span style={{ color: C.gold }}>{financials.netProfit > 0 ? financials.paybackMonths.toFixed(1) : "∞"} months</span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                      Based on ₱{financials.totalStartup.toLocaleString()} startup cost and ₱{Math.max(0, financials.netProfit).toLocaleString()}/mo net profit.
                      {financials.netProfit < 0 ? " Sell more boxes to reach profitability." : " At this volume you break even fast."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.orange }}>Monthly Cost Breakdown</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Cost of Goods Sold (COGS)", value: financials.cogs, pct: "34%" },
                    { label: "Labor (cook + cashier)", value: labor, pct: "—" },
                    { label: "Space rent / stall fee", value: 5000, pct: "—" },
                    { label: "LPG & utilities", value: 3000, pct: "—" },
                    { label: "Packaging materials", value: 2500, pct: "—" },
                    { label: "Miscellaneous", value: 1500, pct: "—" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: C.card }}>
                      <span className="text-sm">{row.label}</span>
                      <div className="flex items-center gap-3">
                        {row.pct !== "—" && <span className="text-xs" style={{ color: C.muted }}>{row.pct} of revenue</span>}
                        <span className="font-bold text-sm font-heading" style={{ color: C.gold }}>₱{Math.round(row.value).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6-month projection */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.orange }}>6-Month Growth Projection</p>
                <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
                  <table className="w-full min-w-[480px]">
                    <thead>
                      <tr style={{ background: C.card }}>
                        {["Month", "Boxes/Day", "Revenue", "Costs", "Profit"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: C.muted }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { month: "Month 1", boxes: 40, note: "Soft launch" },
                        { month: "Month 2", boxes: 60, note: "Word spreads" },
                        { month: "Month 3", boxes: 75, note: "Loyalty building" },
                        { month: "Month 4", boxes: 90, note: "GrabFood live" },
                        { month: "Month 5", boxes: 110, note: "Peak traction" },
                        { month: "Month 6", boxes: 130, note: "2nd cart planning" },
                      ].map((row, i) => {
                        const rev = row.boxes * avgPrice * daysPerMonth;
                        const costs = rev * cogsPct + labor + fixedMonthly;
                        const profit = rev - costs;
                        return (
                          <tr key={row.month} style={{ background: i % 2 === 0 ? C.surface : C.card, borderTop: `1px solid ${C.border}` }}>
                            <td className="px-4 py-3">
                              <p className="text-sm font-semibold">{row.month}</p>
                              <p className="text-xs" style={{ color: C.dim }}>{row.note}</p>
                            </td>
                            <td className="px-4 py-3 text-sm" style={{ color: C.muted }}>{row.boxes}</td>
                            <td className="px-4 py-3 text-sm font-bold" style={{ color: C.gold }}>₱{rev.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm" style={{ color: C.muted }}>₱{Math.round(costs).toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm font-bold" style={{ color: profit >= 0 ? "#2D9E2D" : C.red }}>
                              {profit >= 0 ? "+" : ""}₱{Math.round(profit).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── CTA FOOTER ────────────────────────────────────── */}
      <section
        className="mt-8 py-16 px-6 text-center"
        style={{ background: `linear-gradient(180deg, ${C.dark} 0%, ${C.redDark}40 100%)`, borderTop: `1px solid ${C.border}` }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.orange }}>Ready to Launch?</p>
        <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-4">Let BVN build the brand.</h2>
        <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: C.muted }}>
          Sarsa Republika is a BVN concept. We handle branding, website, social media, and marketing — so you focus on the chicken.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 font-heading font-bold px-8 py-4 rounded-xl text-white text-base transition-all hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${C.red}, ${C.orange})` }}
        >
          Work With BVN <Zap size={16} />
        </a>
        <p className="mt-6 text-xs" style={{ color: C.dim }}>
          Business concept developed by BVN Digital · bvnofficial.com
        </p>
      </section>
    </div>
  );
}
