"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Sun, ShieldCheck, Eye, Leaf, Shield, Building2,
  Award, FileText, CheckCircle2, Car, Home, Sparkles, Thermometer,
  Radio, Gem, Layers, Scale, Phone, Mail, MapPin, ChevronRight, Star,
  Bot, Send, TrendingUp, Users, Calendar, DollarSign, Instagram, Facebook,
  Zap, Wrench, Clock, BarChart3, Heart, Share2, Activity, Bell, Megaphone,
  MessageSquare, LayoutDashboard,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Brand tokens — taken from the Progard collateral: deep black,
// champagne gold, and a per-film accent for the automotive range.
const C = {
  bg: "#07080B",
  bg2: "#0C0E13",
  card: "#111319",
  cardHi: "#171A22",
  border: "#252A35",
  borderHi: "#3A4150",
  ink: "#F4F6FA",
  sub: "#A8B0BF",
  muted: "#6C7484",
  gold: "#C6A662",
  goldHi: "#E3C989",
  red: "#E11D2E",
  purple: "#8B5CF6",
  amber: "#D4AF37",
  blue: "#3B82F6",
  green: "#34D399",
  silver: "#9CA8BC",
};

// ─────────────────────────────────────────────────────────────
// DATA — every value below is taken from the Progard range sheets.

const BENEFITS = [
  { Icon: Sun, title: "Reduce Heat", body: "Stay cooler and more comfortable" },
  { Icon: ShieldCheck, title: "Block UV", body: "Protect your skin, furnishings and floors" },
  { Icon: Eye, title: "Enhance Privacy", body: "Daytime privacy from the outside" },
  { Icon: Shield, title: "Improve Security", body: "Stronger glass. Greater protection" },
  { Icon: Leaf, title: "Save Energy", body: "Lower energy bills all year round" },
];

type Series = {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  accent: string;
  badge: string;
  img: string;
  products: { name: string; kind: string; body: string }[];
};

const ARCHITECTURAL: Series[] = [
  {
    id: "black",
    img: "/clients/progardfilms/black-series.jpg",
    name: "Black Series",
    tag: "Natural black appearance",
    blurb: "Natural black appearance with high performance heat rejection.",
    accent: C.gold,
    badge: "Most Popular",
    products: [
      {
        name: "Vista",
        kind: "Standard Solar Film",
        body: "Excellent heat reduction and UV protection.",
      },
      {
        name: "NanoBlack",
        kind: "High Performance Ceramic Film",
        body: "Superior heat rejection. Maximum comfort. Our premium choice.",
      },
    ],
  },
  {
    id: "reflective",
    img: "/clients/progardfilms/reflective-series.jpg",
    name: "Reflective Series",
    tag: "Mirrored appearance",
    blurb: "Mirrored appearance for daytime privacy and superior solar performance.",
    accent: C.blue,
    badge: "Premium Performance",
    products: [
      {
        name: "Lumina Silver",
        kind: "Reflective Solar Film",
        body: "Classic silver look with excellent heat rejection.",
      },
      {
        name: "Lumina Dual",
        kind: "Dual Reflective Film",
        body: "Advanced dual reflective technology for maximum heat rejection and privacy.",
      },
    ],
  },
  {
    id: "clear",
    img: "/clients/progardfilms/clear-series.jpg",
    name: "Clear Series",
    tag: "Virtually clear",
    blurb: "Virtually clear appearance that lets in natural light while reducing heat.",
    accent: "#38BDF8",
    badge: "Keep Your View",
    products: [
      {
        name: "TrueVue",
        kind: "Solar Control Film",
        body: "Near-clear performance with excellent heat rejection and UV protection.",
      },
    ],
  },
  {
    id: "security",
    img: "/clients/progardfilms/security-series.jpg",
    name: "Security Series",
    tag: "Safety and security",
    blurb: "Safety and security films designed to strengthen glass and protect what matters.",
    accent: "#60A5FA",
    badge: "Protect What Matters",
    products: [
      {
        name: "ShieldVue",
        kind: "Security Film",
        body: "Helps hold broken glass together, deters break-ins and provides added safety for your family or business.",
      },
    ],
  },
  {
    id: "decorative",
    img: "/clients/progardfilms/decorative-series.jpg",
    name: "Decorative Series",
    tag: "Decorative and frosted",
    blurb: "Decorative and frosted films for privacy, style and design.",
    accent: "#C084FC",
    badge: "Style & Privacy",
    products: [
      {
        name: "FrostVue",
        kind: "Decorative Privacy Film",
        body: "Create privacy and add a stylish finish to any glass surface.",
      },
    ],
  },
];

type Auto = {
  id: string;
  img: string;
  name: string;
  sub: string;
  accent: string;
  headline: string;
  tagline: string;
  popular?: boolean;
  body: string;
  features: { Icon: typeof Sun; label: string }[];
  specs: { shade: string; tser: number; irr: number; uvr: number }[];
  build: string[];
};

const AUTOMOTIVE: Auto[] = [
  {
    id: "xfactor",
    img: "/clients/progardfilms/auto-xfactor.jpg",
    name: "XFactor",
    sub: "Performance Ceramic",
    accent: C.red,
    headline: "Everyday comfort.",
    tagline: "Premium performance. Exceptional value.",
    body: "XFactor combines advanced ceramic technology with outstanding everyday performance. It delivers excellent heat rejection, over 99% UV protection and a refined charcoal appearance at exceptional value.",
    features: [
      { Icon: Thermometer, label: "Excellent heat rejection" },
      { Icon: ShieldCheck, label: "99% UV protection" },
      { Icon: Sparkles, label: "Stable charcoal colour" },
      { Icon: Award, label: "Lifetime warranty" },
    ],
    specs: [
      { shade: "35%", tser: 45, irr: 80, uvr: 99 },
      { shade: "20%", tser: 46, irr: 70, uvr: 99 },
      { shade: "05%", tser: 50, irr: 85, uvr: 99 },
    ],
    build: ["2 MIL thickness", "Advanced Ceramic Technology", "ZR Prima Series Technology"],
  },
  {
    id: "nightrider",
    img: "/clients/progardfilms/auto-nightrider.jpg",
    name: "Night Rider",
    sub: "HD Nano Ceramic",
    accent: C.purple,
    headline: "Maximum comfort. Perfect balance.",
    tagline: "Australia's most popular choice.",
    popular: true,
    body: "Night Rider HD Nano Ceramic delivers the perfect balance of comfort, clarity and performance. Built using advanced HD Nano Ceramic technology enhanced with ZirconiumTech™, it provides exceptional infrared rejection while maintaining crystal-clear visibility.",
    features: [
      { Icon: Thermometer, label: "Outstanding heat rejection" },
      { Icon: Layers, label: "Exceptional infrared rejection" },
      { Icon: Eye, label: "Ultra low haze clarity" },
      { Icon: Radio, label: "GPS & signal friendly" },
      { Icon: Award, label: "Lifetime warranty" },
    ],
    specs: [
      { shade: "35%", tser: 48, irr: 91, uvr: 99 },
      { shade: "20%", tser: 50, irr: 91, uvr: 99 },
      { shade: "05%", tser: 55, irr: 92, uvr: 99 },
    ],
    build: ["2 MIL thickness", "HD Nano Ceramic Technology", "ZR Intella Series with ZirconiumTech™"],
  },
  {
    id: "fusion",
    img: "/clients/progardfilms/auto-fusion.jpg",
    name: "Fusion",
    sub: "Ultra Ceramic",
    accent: C.amber,
    headline: "The pinnacle of automotive window film.",
    tagline: "Ultimate performance. No compromise.",
    body: "Fusion represents the highest level of automotive window film technology. Built with next-generation Ultra Ceramic construction enhanced with ZirconiumTech™, Fusion delivers outstanding infrared rejection, superior heat reduction and exceptional optical clarity.",
    features: [
      { Icon: Thermometer, label: "Class-leading heat rejection" },
      { Icon: Layers, label: "Maximum infrared protection" },
      { Icon: Eye, label: "Superior optical clarity" },
      { Icon: Gem, label: "Colour stability & durability" },
      { Icon: Award, label: "Lifetime warranty" },
    ],
    specs: [
      { shade: "35%", tser: 56, irr: 98, uvr: 99 },
      { shade: "20%", tser: 60, irr: 98, uvr: 99 },
      { shade: "05%", tser: 66, irr: 98, uvr: 99 },
    ],
    build: ["2 MIL thickness", "Ultra Ceramic Technology", "ZR Nova Series with ZirconiumTech™"],
  },
];

const AUTO_BAR = [
  { Icon: Sun, label: "Blocks 99% of harmful UV rays" },
  { Icon: Thermometer, label: "Reduces interior heat & glare" },
  { Icon: CheckCircle2, label: "Increases comfort all year round" },
  { Icon: Shield, label: "Protects your interior from fading" },
  { Icon: Award, label: "Backed by lifetime warranty" },
];

const TRUST = [
  { Icon: MapPin, title: "Australian Owned", body: "Proudly Australian owned and operated." },
  { Icon: Award, title: "Premium Quality", body: "High performance films backed by industry leading warranties." },
  { Icon: Home, title: "Residential & Commercial", body: "Solutions for homes, offices, retail and commercial buildings." },
  { Icon: FileText, title: "Expert Advice", body: "Over 25 years of experience helping Australians find the right film." },
  { Icon: CheckCircle2, title: "Professionally Installed", body: "Installed by trusted professionals for long lasting performance and peace of mind." },
];

// ─────────────────────────────────────────────────────────────
function Section({
  eyebrow, title, sub, children, id,
}: {
  eyebrow: string; title: string; sub?: string; children: React.ReactNode; id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: 88, scrollMarginTop: 90 }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: C.gold }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 30, fontWeight: 800, margin: "10px 0 8px", letterSpacing: -0.6, color: C.ink }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: C.sub, maxWidth: 720, lineHeight: 1.65, margin: 0 }}>{sub}</p>}
      <div style={{ marginTop: 28 }}>{children}</div>
    </motion.section>
  );
}

function Bar({ value, accent }: { value: number; accent: string }) {
  return (
    <div style={{ height: 6, borderRadius: 99, background: "#20242E", overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ height: "100%", borderRadius: 99, background: accent }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// PROGARD AI ADVISOR — a demo assistant. Responses are matched from the real
// product data below; it is not a live language model, so nothing it says is
// invented. Labelled "demo" in the UI.
type Chip = { name: string; sub: string; accent: string; href?: string };
type Msg = { role: "user" | "ai"; text: string; chips?: Chip[] };

function advise(qRaw: string): Msg {
  const q = qRaw.toLowerCase();
  const has = (...w: string[]) => w.some((x) => q.includes(x));
  const chip = (name: string, sub: string, accent: string): Chip => ({ name, sub, accent });

  if (has("hello", "hi", "hey", "start"))
    return {
      role: "ai",
      text: "Hi! I'm the Progard advisor. Tell me what you're fitting — a home, an office, or a vehicle — and what matters most (heat, privacy, security, or budget), and I'll point you to the right film.",
    };
  if (has("law", "legal", "vlt", "dark enough", "how dark", "allowed"))
    return {
      role: "ai",
      text: "Tint darkness is set by each Australian state, and differs per window. Front side windows usually need at least 35% light transmission; rears can go darker. Because Progard's ceramic films reject heat through the film itself, a legal 35% Fusion or Night Rider still keeps you cool — you don't have to break the rules to be comfortable. Your installer confirms the exact limit for your state before fitting.",
    };
  if (has("car", "vehicle", "auto", "windscreen", "windshield") || (has("tint") && !has("home", "house", "office"))) {
    if (has("best", "max", "most", "ultimate", "premium"))
      return { role: "ai", text: "For the best automotive performance, Fusion Ultra Ceramic is the top of the range — up to 66% heat rejection and 98% infrared rejection, with lifetime warranty. If you want that balance of comfort and crystal-clear visibility, Night Rider is our most popular pick.", chips: [chip("Fusion", "Ultra Ceramic", C.amber), chip("Night Rider", "HD Nano Ceramic", C.purple)] };
    if (has("cheap", "budget", "value", "afford", "price", "cost"))
      return { role: "ai", text: "XFactor Performance Ceramic is our best value — genuine ceramic tech, 99% UV protection and a clean charcoal look, at the sharpest price. A great everyday choice.", chips: [chip("XFactor", "Performance Ceramic", C.red)] };
    return { role: "ai", text: "For vehicles we have three ceramic films: XFactor for everyday value, Night Rider for the best balance of comfort and clarity (our most popular), and Fusion for maximum performance. What matters most — value, clarity, or absolute heat rejection?", chips: [chip("XFactor", "Value", C.red), chip("Night Rider", "Balance", C.purple), chip("Fusion", "Maximum", C.amber)] };
  }
  if (has("security", "safe", "break", "burglar", "intruder", "shatter", "glass hold"))
    return { role: "ai", text: "ShieldVue is our security film — it helps hold broken glass together, deters break-ins and adds a layer of safety for your home or business. Ideal for ground-floor windows and glass doors.", chips: [chip("ShieldVue", "Security Film", "#60A5FA")] };
  if (has("privacy", "private", "see in", "frost", "bathroom", "partition"))
    return { role: "ai", text: "For daytime privacy from outside, the Reflective Series (Lumina Silver / Lumina Dual) gives a mirrored look while cutting heat. For full privacy on bathrooms, offices or partitions, FrostVue adds a frosted, decorative finish to any glass.", chips: [chip("Lumina Dual", "Dual Reflective", C.blue), chip("FrostVue", "Decorative", "#C084FC")] };
  if (has("home", "house", "office", "building", "window", "residential", "commercial")) {
    if (has("view", "clear", "natural light", "keep my view"))
      return { role: "ai", text: "If you want to keep the view and natural light while cutting heat, TrueVue is the one — a virtually clear solar film with strong heat and UV rejection.", chips: [chip("TrueVue", "Clear Series", "#38BDF8")] };
    return { role: "ai", text: "For homes and offices, NanoBlack is our premium pick — superior heat rejection with a natural black look. Prefer to keep the view? TrueVue stays near-clear. Want privacy too? The Reflective Series adds a mirrored finish.", chips: [chip("NanoBlack", "Ceramic", C.gold), chip("TrueVue", "Near-clear", "#38BDF8")] };
  }
  if (has("heat", "hot", "cool", "warm", "temperature", "infrared"))
    return { role: "ai", text: "Heat rejection comes from the film's construction, not how dark it looks. For a vehicle, Fusion leads at up to 66% heat and 98% infrared rejection. For a home, NanoBlack ceramic delivers superior heat rejection with maximum comfort.", chips: [chip("Fusion", "Vehicle", C.amber), chip("NanoBlack", "Home", C.gold)] };
  if (has("warranty", "guarantee"))
    return { role: "ai", text: "Every Progard film is backed by an industry-leading warranty — the automotive ceramic range (XFactor, Night Rider, Fusion) carries a lifetime warranty, and architectural films are backed by their own long-term warranties." };
  if (has("uv", "skin", "fade", "furniture", "floor"))
    return { role: "ai", text: "All Progard films block over 99% of UV, protecting skin, furnishings and floors from fading. Every product in both ranges hits that 99% UV mark." };
  if (has("book", "quote", "install", "buy", "price", "cost", "how much"))
    return { role: "ai", text: "Pricing depends on the film and the glass or vehicle, so it's quoted per job. Tell me what you're fitting and I'll recommend the film — then hit 'Get a Quote' and a Progard installer will confirm the price.", chips: [chip("Get a quote", "Talk to an installer", C.gold)] };
  return {
    role: "ai",
    text: "I can help you pick the right film for a home, office or vehicle — just tell me what you're fitting and whether you care most about heat, privacy, security, keeping the view, or budget. For example: \"I want the coolest tint that's still legal for my car.\"",
  };
}

function AiAdvisor() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi, I'm the Progard advisor 👋 Tell me what you're fitting — a home, office or vehicle — and what matters most. I'll recommend the right film." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function ask(text: string) {
    const t = text.trim();
    if (!t || typing) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: t }]);
    setTyping(true);
    const delay = 500 + Math.min(t.length * 12, 900);
    setTimeout(() => {
      setMessages((m) => [...m, advise(t)]);
      setTyping(false);
    }, delay);
  }

  const suggestions = [
    "Coolest legal tint for my car?",
    "Best film for a home with a view",
    "I need privacy for my office",
    "What's your best value tint?",
  ];

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 18, background: C.card, overflow: "hidden", boxShadow: "0 24px 60px -30px rgba(0,0,0,0.8)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "16px 20px", borderBottom: `1px solid ${C.border}`, background: `linear-gradient(90deg, ${C.gold}14, transparent)` }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: `${C.gold}1F`, border: `1px solid ${C.gold}44`, display: "grid", placeItems: "center" }}>
          <Bot size={19} color={C.gold} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            Progard AI Advisor
            <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: C.gold, border: `1px solid ${C.gold}55`, padding: "2px 6px", borderRadius: 99 }}>Demo</span>
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: C.green, boxShadow: `0 0 8px ${C.green}` }} /> Online · replies instantly
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ height: 340, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12, background: C.bg2 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%" }}>
              <div
                style={{
                  fontSize: 13.5, lineHeight: 1.6, padding: "11px 14px", borderRadius: 14,
                  background: m.role === "user" ? C.gold : C.card,
                  color: m.role === "user" ? "#0A0A0A" : C.ink,
                  border: m.role === "user" ? "none" : `1px solid ${C.border}`,
                  borderBottomRightRadius: m.role === "user" ? 4 : 14,
                  borderBottomLeftRadius: m.role === "user" ? 14 : 4,
                  fontWeight: m.role === "user" ? 600 : 400,
                }}
              >
                {m.text}
              </div>
              {m.chips && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 8 }}>
                  {m.chips.map((c) => (
                    <a
                      key={c.name}
                      href="#contact"
                      style={{ display: "inline-flex", alignItems: "center", gap: 7, textDecoration: "none", border: `1px solid ${c.accent}66`, background: `${c.accent}14`, borderRadius: 10, padding: "7px 11px" }}
                    >
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: C.ink }}>{c.name}</span>
                      <span style={{ fontSize: 10.5, color: c.accent, fontWeight: 700 }}>{c.sub}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "11px 14px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, borderBottomLeftRadius: 4, width: "fit-content" }}>
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                style={{ width: 6, height: 6, borderRadius: 99, background: C.muted, display: "block" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, padding: "12px 16px 0" }}>
        {suggestions.map((s) => (
          <button key={s} onClick={() => ask(s)} style={{ cursor: "pointer", border: `1px solid ${C.border}`, background: C.bg2, color: C.sub, borderRadius: 99, padding: "6px 12px", fontSize: 11.5, fontWeight: 600 }}>
            {s}
          </button>
        ))}
      </div>

      {/* Composer */}
      <form onSubmit={(e) => { e.preventDefault(); ask(input); }} style={{ display: "flex", gap: 9, padding: 16 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about heat, privacy, security, price…"
          style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 11, padding: "12px 14px", color: C.ink, fontSize: 13.5, outline: "none" }}
        />
        <button type="submit" disabled={!input.trim() || typing} style={{ cursor: input.trim() && !typing ? "pointer" : "not-allowed", background: C.gold, color: "#0A0A0A", border: "none", borderRadius: 11, padding: "0 16px", display: "grid", placeItems: "center", opacity: input.trim() && !typing ? 1 : 0.5 }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BUSINESS OPERATING SYSTEM — an interactive mock of the CEO dashboard BVN runs
// behind the brand (GoHighLevel CRM + ServiceM8 jobs + social media marketing).
// All figures are sample data for demonstration.
type OpsTab = "ceo" | "pipeline" | "social" | "jobs";

const REVENUE = [22, 31, 28, 44, 39, 52, 61, 58]; // last 8 weeks, sample ($k)

const PIPELINE = [
  { stage: "New Enquiry", accent: "#38BDF8", cards: [
    { name: "Sarah M.", job: "Home · NanoBlack", value: "$2,400" },
    { name: "Coastal Cafe", job: "Shopfront · TrueVue", value: "$3,900" },
  ]},
  { stage: "Quoted", accent: C.blue, cards: [
    { name: "James T.", job: "BMW M4 · Fusion", value: "$780" },
    { name: "Bayside Dental", job: "Office · FrostVue", value: "$5,200" },
  ]},
  { stage: "Booked", accent: C.purple, cards: [
    { name: "Nguyen L.", job: "Ranger · Night Rider", value: "$650" },
  ]},
  { stage: "Installed", accent: C.gold, cards: [
    { name: "Harper R.", job: "Home · Lumina Dual", value: "$4,100" },
    { name: "Metro Fitness", job: "Glass wall · ShieldVue", value: "$6,800" },
  ]},
  { stage: "Review Sent", accent: C.green, cards: [
    { name: "Daniel K.", job: "GT-R · Fusion", value: "$920" },
  ]},
];

const SOCIAL_POSTS = [
  { day: "Mon", plat: "ig", title: "Before / after: NanoBlack on a Toorak home", status: "Posted", eng: "1.2k", accent: "#E1306C" },
  { day: "Tue", plat: "fb", title: "Why ceramic beats dyed tint — 60-sec explainer", status: "Posted", eng: "840", accent: "#1877F2" },
  { day: "Wed", plat: "ig", title: "Reel: Fusion install on a GT-R", status: "Scheduled", eng: "—", accent: "#E1306C" },
  { day: "Thu", plat: "fb", title: "Customer review spotlight ★★★★★", status: "Scheduled", eng: "—", accent: "#1877F2" },
  { day: "Fri", plat: "ig", title: "Tint & the law: WA limits explained", status: "Draft", eng: "—", accent: "#E1306C" },
];

const JOBS = [
  { time: "8:00 AM", client: "Sarah M.", job: "NanoBlack — 6 windows", tech: "Ben", status: "In progress", color: C.amber },
  { time: "10:30 AM", client: "James T.", job: "Fusion — full vehicle", tech: "Alex", status: "Scheduled", color: C.blue },
  { time: "1:00 PM", client: "Bayside Dental", job: "FrostVue — partitions", tech: "Ben", status: "Scheduled", color: C.blue },
  { time: "3:30 PM", client: "Metro Fitness", job: "ShieldVue — glass wall", tech: "Priya", status: "Scheduled", color: C.blue },
];

function StatTile({ Icon, label, value, delta, accent }: { Icon: typeof Sun; label: string; value: string; delta?: string; accent: string }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 13, background: C.bg2, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${accent}1A`, display: "grid", placeItems: "center" }}>
          <Icon size={15} color={accent} />
        </div>
        {delta && <span style={{ fontSize: 10.5, fontWeight: 800, color: C.green, display: "flex", alignItems: "center", gap: 2 }}><TrendingUp size={11} /> {delta}</span>}
      </div>
      <div style={{ fontSize: 23, fontWeight: 900, marginTop: 11, letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function OpsDashboard() {
  const [tab, setTab] = useState<OpsTab>("ceo");
  const tabs: { id: OpsTab; label: string; Icon: typeof Sun }[] = [
    { id: "ceo", label: "CEO Dashboard", Icon: LayoutDashboard },
    { id: "pipeline", label: "Lead Pipeline", Icon: Users },
    { id: "social", label: "Social Media", Icon: Megaphone },
    { id: "jobs", label: "Jobs & Installs", Icon: Wrench },
  ];

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 18, background: C.card, overflow: "hidden", boxShadow: "0 24px 60px -30px rgba(0,0,0,0.8)" }}>
      {/* Window chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
        <span style={{ width: 11, height: 11, borderRadius: 99, background: "#FF5F57" }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: "#FEBC2E" }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, background: "#28C840" }} />
        <div style={{ marginLeft: 10, fontSize: 11.5, color: C.muted, display: "flex", alignItems: "center", gap: 7 }}>
          <Building2 size={12} /> progard.ceo-dashboard.app
        </div>
        <span style={{ marginLeft: "auto", fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: C.gold, border: `1px solid ${C.gold}44`, padding: "3px 8px", borderRadius: 99 }}>Live demo</span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "10px 12px", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap",
              padding: "9px 14px", borderRadius: 9, border: "none", cursor: "pointer",
              fontSize: 12.5, fontWeight: 800,
              background: tab === t.id ? C.gold : "transparent",
              color: tab === t.id ? "#0A0A0A" : C.sub, transition: "all .16s",
            }}
          >
            <t.Icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 18, minHeight: 360 }}>
        <AnimatePresence mode="wait">
          {/* ── CEO OVERVIEW ── */}
          {tab === "ceo" && (
            <motion.div key="ceo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                <StatTile Icon={Users} label="New leads this week" value="18" delta="+22%" accent="#38BDF8" />
                <StatTile Icon={Calendar} label="Installs booked" value="11" delta="+9%" accent={C.purple} />
                <StatTile Icon={DollarSign} label="Revenue MTD" value="$61k" delta="+17%" accent={C.green} />
                <StatTile Icon={Star} label="Google rating" value="4.9" accent={C.gold} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12, marginTop: 12 }}>
                {/* Revenue chart */}
                <div style={{ border: `1px solid ${C.border}`, borderRadius: 13, background: C.bg2, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800 }}>Revenue — last 8 weeks</span>
                    <BarChart3 size={14} color={C.muted} />
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110 }}>
                    {REVENUE.map((v, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(v / 61) * 100}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          style={{ width: "100%", borderRadius: "5px 5px 0 0", background: i === REVENUE.length - 1 ? C.gold : `${C.gold}55` }}
                        />
                        <span style={{ fontSize: 8.5, color: C.muted }}>${v}k</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Marketing snapshot — social included */}
                <div style={{ border: `1px solid ${C.border}`, borderRadius: 13, background: C.bg2, padding: 16 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
                    <Megaphone size={14} color={C.gold} /> Social marketing
                  </div>
                  {[
                    { Icon: Share2, label: "Reach this month", value: "34,900" },
                    { Icon: Heart, label: "Engagements", value: "2,180" },
                    { Icon: Calendar, label: "Posts scheduled", value: "12" },
                    { Icon: Users, label: "Leads from social", value: "7" },
                  ].map((r) => (
                    <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0", borderTop: `1px solid ${C.border}` }}>
                      <r.Icon size={13} color={C.gold} />
                      <span style={{ fontSize: 11.5, color: C.sub, flex: 1 }}>{r.label}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 800 }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity feed */}
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 13, background: C.bg2, padding: 16, marginTop: 12 }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}><Activity size={14} color={C.muted} /> Live activity</div>
                {[
                  { Icon: Bell, txt: "New lead — Sarah M. enquired about home tinting", t: "2m ago", c: "#38BDF8" },
                  { Icon: MessageSquare, txt: "AI assistant booked James T. for a Fusion quote", t: "18m ago", c: C.gold },
                  { Icon: Star, txt: "New 5★ Google review from Daniel K.", t: "1h ago", c: C.green },
                  { Icon: Instagram, txt: "Reel published — 1,204 views so far", t: "3h ago", c: "#E1306C" },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: `${a.c}1A`, display: "grid", placeItems: "center", flexShrink: 0 }}><a.Icon size={13} color={a.c} /></div>
                    <span style={{ fontSize: 12, color: C.sub, flex: 1 }}>{a.txt}</span>
                    <span style={{ fontSize: 10.5, color: C.muted, whiteSpace: "nowrap" }}>{a.t}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── LEAD PIPELINE (GHL-style) ── */}
          {tab === "pipeline" && (
            <motion.div key="pipeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
                <Zap size={13} color={C.gold} /> GoHighLevel CRM · drag-and-drop pipeline, automations fire at every stage
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
                {PIPELINE.map((col) => (
                  <div key={col.stage} style={{ minWidth: 168, flex: "1 0 168px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 99, background: col.accent }} />
                      <span style={{ fontSize: 11.5, fontWeight: 800 }}>{col.stage}</span>
                      <span style={{ fontSize: 10, color: C.muted, marginLeft: "auto" }}>{col.cards.length}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {col.cards.map((c) => (
                        <motion.div key={c.name} whileHover={{ y: -2, borderColor: col.accent }} style={{ border: `1px solid ${C.border}`, borderRadius: 10, background: C.bg2, padding: 11, cursor: "grab" }}>
                          <div style={{ fontSize: 12.5, fontWeight: 800 }}>{c.name}</div>
                          <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3 }}>{c.job}</div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: col.accent, marginTop: 7 }}>{c.value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── SOCIAL MEDIA MARKETING ── */}
          {tab === "social" && (
            <motion.div key="social" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
                <Megaphone size={13} color={C.gold} /> Content planned, created and scheduled for you — included in the CEO dashboard
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 14 }}>
                <StatTile Icon={Share2} label="Reach this month" value="34.9k" delta="+28%" accent={C.gold} />
                <StatTile Icon={Heart} label="Engagements" value="2,180" delta="+14%" accent="#E1306C" />
                <StatTile Icon={Users} label="Leads from social" value="7" accent="#38BDF8" />
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 9 }}>This week&apos;s content calendar</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SOCIAL_POSTS.map((p) => (
                  <div key={p.title} style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${C.border}`, borderRadius: 11, background: C.bg2, padding: "11px 13px" }}>
                    <div style={{ width: 38, textAlign: "center" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: C.sub }}>{p.day}</div>
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${p.accent}1F`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                      {p.plat === "ig" ? <Instagram size={14} color={p.accent} /> : <Facebook size={14} color={p.accent} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                    </div>
                    {p.eng !== "—" && (
                      <span style={{ fontSize: 10.5, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}><Heart size={11} color="#E1306C" /> {p.eng}</span>
                    )}
                    <span style={{
                      fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", padding: "4px 8px", borderRadius: 99, whiteSpace: "nowrap",
                      color: p.status === "Posted" ? C.green : p.status === "Scheduled" ? C.gold : C.muted,
                      border: `1px solid ${p.status === "Posted" ? C.green : p.status === "Scheduled" ? C.gold : C.muted}55`,
                    }}>{p.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── JOBS & INSTALLS (ServiceM8-style) ── */}
          {tab === "jobs" && (
            <motion.div key="jobs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
                <Wrench size={13} color={C.gold} /> ServiceM8 · today&apos;s schedule syncs to the CRM automatically
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 14 }}>
                <StatTile Icon={Wrench} label="Jobs today" value="4" accent={C.gold} />
                <StatTile Icon={CheckCircle2} label="Completed this week" value="19" delta="+6%" accent={C.green} />
                <StatTile Icon={DollarSign} label="Awaiting payment" value="$3.2k" accent={C.amber} />
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 9 }}>Today&apos;s installs</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {JOBS.map((j) => (
                  <div key={j.time} style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${C.border}`, borderRadius: 11, background: C.bg2, padding: "11px 13px" }}>
                    <div style={{ width: 62, fontSize: 11.5, fontWeight: 800, color: C.sub, display: "flex", alignItems: "center", gap: 5 }}><Clock size={12} color={C.muted} /> {j.time}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 800 }}>{j.client}</div>
                      <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>{j.job}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.sub }}>
                      <div style={{ width: 22, height: 22, borderRadius: 99, background: `${C.gold}22`, display: "grid", placeItems: "center", fontSize: 9.5, fontWeight: 800, color: C.gold }}>{j.tech[0]}</div>
                      {j.tech}
                    </div>
                    <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", padding: "4px 8px", borderRadius: 99, whiteSpace: "nowrap", color: j.color, border: `1px solid ${j.color}55` }}>{j.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProgardFilmsPage() {
  const [range, setRange] = useState<"architectural" | "automotive">("architectural");
  const [shade, setShade] = useState("20%");
  const [openSeries, setOpenSeries] = useState<string>("black");

  // Film finder
  const [priority, setPriority] = useState<"heat" | "clarity" | "value" | null>(null);
  const recommendation = useMemo(() => {
    if (priority === "heat") return AUTOMOTIVE[2];
    if (priority === "clarity") return AUTOMOTIVE[1];
    if (priority === "value") return AUTOMOTIVE[0];
    return null;
  }, [priority]);

  const compare = useMemo(
    () => AUTOMOTIVE.map((f) => ({ film: f, row: f.specs.find((s) => s.shade === shade)! })),
    [shade]
  );

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif", position: "relative" }}>
      {/* Hero backdrop — the film applied to architectural glass, faded into the page */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 620, overflow: "hidden", pointerEvents: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/clients/progardfilms/black-series.jpg"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", opacity: 0.34 }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.bg} 4%, ${C.bg}D9 42%, ${C.bg}A6 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.bg} 0%, ${C.bg}B3 38%, transparent 100%)` }} />
      </div>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,8,11,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, border: `1.5px solid ${C.gold}`, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 14, color: C.gold }}>
              P
            </div>
            <div>
              <div style={{ fontWeight: 900, letterSpacing: 3, fontSize: 15 }}>PROGARD</div>
              <div style={{ fontSize: 8, letterSpacing: 2.2, color: C.muted, fontWeight: 700 }}>FILMS</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 13, color: C.sub }}>
            <a href="#range" style={{ color: C.sub, textDecoration: "none" }} className="pg-link">The Range</a>
            <a href="#finder" style={{ color: C.sub, textDecoration: "none" }} className="pg-link">Ask AI</a>
            <a href="#system" style={{ color: C.sub, textDecoration: "none" }} className="pg-link">The System</a>
            <a href="#why" style={{ color: C.sub, textDecoration: "none" }} className="pg-link">Why Progard</a>
            <a
              href="#contact"
              style={{ background: C.gold, color: "#0A0A0A", padding: "9px 16px", borderRadius: 8, fontWeight: 800, fontSize: 12.5, textDecoration: "none" }}
            >
              Get a Quote
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 22px 100px", position: "relative", zIndex: 1 }}>
        {/* Back to BVN */}
        <div style={{ paddingTop: 20 }}>
          <Link href="/clients" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.muted, textDecoration: "none", fontSize: 12.5 }}>
            <ArrowLeft size={13} /> BVN Client Workspaces
          </Link>
        </div>

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ paddingTop: 54, paddingBottom: 10 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}`, background: C.card, padding: "6px 13px", borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, color: C.gold, textTransform: "uppercase" }}>
            <Star size={11} /> Architectural & Automotive Films
          </div>
          <h1 style={{ fontSize: 58, lineHeight: 1.04, fontWeight: 900, letterSpacing: -1.8, margin: "22px 0 0" }}>
            Premium films,
            <br />
            tailored for <span style={{ color: C.gold }}>Australia.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.sub, maxWidth: 640, lineHeight: 1.7, marginTop: 20 }}>
            High performance window film for homes, offices and vehicles. Engineered for Australian
            conditions, backed by industry leading warranties, and installed by trusted professionals.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <a href="#range" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.gold, color: "#0A0A0A", padding: "13px 22px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
              Explore the range <ArrowRight size={15} />
            </a>
            <a href="#finder" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${C.borderHi}`, color: C.ink, padding: "13px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              Find my film
            </a>
          </div>
        </motion.div>

        {/* ── BENEFITS STRIP ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: 54, border: `1px solid ${C.border}`, borderRadius: 16, background: C.bg2,
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", overflow: "hidden",
          }}
        >
          {BENEFITS.map((b, i) => (
            <div key={b.title} style={{ padding: "22px 20px", borderLeft: i === 0 ? "none" : `1px solid ${C.border}` }}>
              <b.Icon size={20} color={C.gold} />
              <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 0.9, textTransform: "uppercase", marginTop: 11 }}>{b.title}</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 5, lineHeight: 1.55 }}>{b.body}</div>
            </div>
          ))}
        </motion.div>

        {/* ── RANGE SWITCH ── */}
        <Section
          id="range"
          eyebrow="The Progard Film Range"
          title="Two ranges. One standard."
          sub="Every Progard film is selected for Australian conditions — from the glass in your home or office to the windows of your vehicle."
        >
          <div style={{ display: "inline-flex", gap: 6, padding: 5, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12 }}>
            {([
              { id: "architectural" as const, label: "Architectural", Icon: Building2 },
              { id: "automotive" as const, label: "Automotive", Icon: Car },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setRange(t.id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 9,
                  border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 800,
                  background: range === t.id ? C.gold : "transparent",
                  color: range === t.id ? "#0A0A0A" : C.sub,
                  transition: "all .18s",
                }}
              >
                <t.Icon size={15} /> {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ══ ARCHITECTURAL ══ */}
            {range === "architectural" && (
              <motion.div
                key="arch"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: 28 }}
              >
                <div style={{ display: "grid", gap: 12 }}>
                  {ARCHITECTURAL.map((s) => {
                    const open = openSeries === s.id;
                    return (
                      <div
                        key={s.id}
                        style={{
                          border: `1px solid ${open ? s.accent + "66" : C.border}`,
                          borderRadius: 14, background: open ? C.cardHi : C.card, overflow: "hidden",
                          transition: "all .2s",
                        }}
                      >
                        <button
                          onClick={() => setOpenSeries(open ? "" : s.id)}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                            gap: 16, padding: "20px 22px", background: "transparent", border: "none",
                            cursor: "pointer", textAlign: "left", color: C.ink,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                            <div style={{ width: 4, height: 40, borderRadius: 99, background: s.accent, flexShrink: 0 }} />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={s.img}
                              alt=""
                              style={{
                                width: 62, height: 46, objectFit: "cover", borderRadius: 8,
                                border: `1px solid ${C.border}`, flexShrink: 0,
                                filter: open ? "none" : "grayscale(0.5) brightness(0.8)",
                                transition: "filter .25s",
                              }}
                            />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3, textTransform: "uppercase" }}>{s.name}</span>
                                <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: s.accent, border: `1px solid ${s.accent}55`, padding: "3px 8px", borderRadius: 99 }}>
                                  {s.badge}
                                </span>
                              </div>
                              <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{s.blurb}</div>
                            </div>
                          </div>
                          <ChevronRight
                            size={17}
                            color={C.muted}
                            style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s", flexShrink: 0 }}
                          />
                        </button>
                        <AnimatePresence>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              style={{ overflow: "hidden" }}
                            >
                              {/* Series hero image */}
                              <div style={{ padding: "0 22px 16px" }}>
                                <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, height: 210 }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={s.img}
                                    alt={`${s.name} film application`}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                  />
                                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.card} 2%, transparent 55%)` }} />
                                  <div style={{ position: "absolute", left: 16, bottom: 12, fontSize: 10.5, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: s.accent }}>
                                    {s.tag}
                                  </div>
                                </div>
                              </div>
                              <div style={{ padding: "0 22px 22px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                                {s.products.map((p) => (
                                  <div key={p.name} style={{ border: `1px solid ${C.border}`, borderRadius: 11, padding: 18, background: C.bg2 }}>
                                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.2, textTransform: "uppercase" }}>{p.name}</div>
                                    <div style={{ fontSize: 11.5, fontWeight: 700, color: s.accent, marginTop: 3 }}>{p.kind}</div>
                                    <div style={{ fontSize: 13, color: C.sub, marginTop: 9, lineHeight: 1.6 }}>{p.body}</div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ══ AUTOMOTIVE ══ */}
            {range === "automotive" && (
              <motion.div
                key="auto"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: 28 }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
                  {AUTOMOTIVE.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        border: `1px solid ${f.popular ? f.accent + "66" : C.border}`,
                        borderRadius: 16, background: C.card, position: "relative", overflow: "hidden",
                      }}
                    >
                      {/* Vehicle image */}
                      <div style={{ position: "relative", height: 190, overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={f.img}
                          alt={`${f.name} ${f.sub} window film`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.card} 3%, ${f.accent}18 60%, transparent 100%)` }} />
                        {f.popular && (
                          <div style={{ position: "absolute", top: 0, right: 0, background: f.accent, color: "#fff", fontSize: 9, fontWeight: 900, letterSpacing: 1.2, padding: "5px 12px", borderBottomLeftRadius: 9, textTransform: "uppercase" }}>
                            ★ Most Popular
                          </div>
                        )}
                      </div>
                      <div style={{ position: "relative", padding: "4px 24px 24px", marginTop: -34 }}>
                        <div style={{ fontSize: 9, letterSpacing: 2, color: C.muted, fontWeight: 800, textTransform: "uppercase" }}>
                          Progard Automotive
                        </div>
                        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginTop: 8, textTransform: "uppercase" }}>{f.name}</div>
                        <div style={{ display: "inline-block", background: f.accent, color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 1.4, padding: "4px 10px", borderRadius: 5, textTransform: "uppercase", marginTop: 6 }}>
                          {f.sub}
                        </div>

                        <div style={{ fontSize: 15, fontWeight: 800, marginTop: 18, textTransform: "uppercase", letterSpacing: -0.2 }}>{f.headline}</div>
                        <div style={{ fontSize: 12.5, color: f.accent, fontWeight: 600, marginTop: 3 }}>{f.tagline}</div>

                        <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.65, marginTop: 14 }}>{f.body}</p>

                        {/* Features */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 16 }}>
                          {f.features.map((ft) => (
                            <div key={ft.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${C.border}`, borderRadius: 99, padding: "5px 10px", fontSize: 11, color: C.sub }}>
                              <ft.Icon size={11} color={f.accent} /> {ft.label}
                            </div>
                          ))}
                        </div>

                        {/* Spec table */}
                        <div style={{ marginTop: 20, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                          <div style={{ background: f.accent + "1A", padding: "8px 12px", fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: f.accent, textTransform: "uppercase", textAlign: "center" }}>
                            Performance Specifications
                          </div>
                          <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                              <thead>
                                <tr style={{ background: C.bg2 }}>
                                  {["Shade", "Heat (TSER)", "Infrared (IRR)", "UV (UVR)"].map((h) => (
                                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.muted, fontWeight: 700, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {f.specs.map((s) => (
                                  <tr key={s.shade} style={{ borderTop: `1px solid ${C.border}` }}>
                                    <td style={{ padding: "9px 10px", fontWeight: 800, color: f.accent }}>{s.shade}</td>
                                    <td style={{ padding: "9px 10px", fontWeight: 700 }}>{s.tser}%</td>
                                    <td style={{ padding: "9px 10px", fontWeight: 700 }}>{s.irr}%</td>
                                    <td style={{ padding: "9px 10px", fontWeight: 700 }}>{s.uvr}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Build */}
                        <div style={{ display: "grid", gap: 6, marginTop: 14 }}>
                          {f.build.map((b) => (
                            <div key={b} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: C.muted }}>
                              <Layers size={10} color={f.accent} /> {b}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Automotive bottom bar */}
                <div style={{ marginTop: 14, border: `1px solid ${C.border}`, borderRadius: 14, background: C.bg2, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", overflow: "hidden" }}>
                  {AUTO_BAR.map((b, i) => (
                    <div key={b.label} style={{ padding: "16px 18px", borderLeft: i === 0 ? "none" : `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 9 }}>
                      <b.Icon size={15} color={C.gold} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.4 }}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* ── SHADE COMPARISON ── */}
        <Section
          eyebrow="Compare the automotive range"
          title="Same shade. Different performance."
          sub="Shade (VLT) controls how dark the film looks. It does not control how much heat it rejects — that comes from the film's construction. Pick a shade to see how the three Progard films compare at the identical darkness."
        >
          <div style={{ display: "inline-flex", gap: 6, padding: 5, background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, marginBottom: 20 }}>
            {["35%", "20%", "05%"].map((s) => (
              <button
                key={s}
                onClick={() => setShade(s)}
                style={{
                  padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 800,
                  background: shade === s ? C.gold : "transparent",
                  color: shade === s ? "#0A0A0A" : C.sub, transition: "all .18s",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {compare.map(({ film, row }) => (
              <div key={film.id} style={{ border: `1px solid ${C.border}`, borderRadius: 13, background: C.card, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{ width: 4, height: 30, borderRadius: 99, background: film.accent }} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, textTransform: "uppercase", letterSpacing: -0.2 }}>{film.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{film.sub}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    at <span style={{ color: film.accent, fontWeight: 800 }}>{shade}</span> shade
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 18, marginTop: 16 }}>
                  {[
                    { label: "Heat rejection (TSER)", v: row.tser },
                    { label: "Infrared rejection (IRR)", v: row.irr },
                    { label: "UV rejection (UVR)", v: row.uvr },
                  ].map((m) => (
                    <div key={m.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: C.muted }}>{m.label}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: film.accent }}>{m.v}%</span>
                      </div>
                      <Bar value={m.v} accent={film.accent} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── AI ADVISOR + FILM FINDER ── */}
        <Section
          id="finder"
          eyebrow="Ask Progard AI"
          title="Not sure which film? Just ask."
          sub="Chat with the Progard advisor about heat, privacy, security, the law or budget — for your home, office or vehicle — and get a straight recommendation. Or use the quick picks below."
        >
          <div style={{ marginBottom: 22 }}>
            <AiAdvisor />
          </div>

          <div style={{ fontSize: 11.5, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
            Or pick what matters most (automotive)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {([
              { id: "value" as const, Icon: Sparkles, title: "Everyday value", body: "Premium ceramic performance at the sharpest price." },
              { id: "clarity" as const, Icon: Eye, title: "Comfort & clarity", body: "The balance of heat rejection and crystal-clear visibility." },
              { id: "heat" as const, Icon: Thermometer, title: "Maximum heat rejection", body: "The absolute best performance available, no compromise." },
            ]).map((o) => {
              const on = priority === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setPriority(o.id)}
                  style={{
                    textAlign: "left", cursor: "pointer", padding: 20, borderRadius: 13,
                    border: `1px solid ${on ? C.gold : C.border}`,
                    background: on ? C.cardHi : C.card, color: C.ink, transition: "all .18s",
                  }}
                >
                  <o.Icon size={19} color={on ? C.gold : C.muted} />
                  <div style={{ fontSize: 14.5, fontWeight: 800, marginTop: 11 }}>{o.title}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 5, lineHeight: 1.55 }}>{o.body}</div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {recommendation && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                style={{
                  marginTop: 14, border: `1px solid ${recommendation.accent}55`, borderRadius: 14,
                  background: C.card, padding: 24, position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(500px 140px at 20% 0%, ${recommendation.accent}20, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ position: "relative" }}>
                  <div style={{ fontSize: 10, letterSpacing: 1.6, color: C.muted, fontWeight: 800, textTransform: "uppercase" }}>
                    Our recommendation
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 27, fontWeight: 900, textTransform: "uppercase", letterSpacing: -0.8 }}>{recommendation.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: recommendation.accent, textTransform: "uppercase", letterSpacing: 1 }}>{recommendation.sub}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.65, marginTop: 10, maxWidth: 640 }}>{recommendation.body}</p>
                  <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
                    {recommendation.specs.map((s) => (
                      <div key={s.shade} style={{ fontSize: 11.5, color: C.muted }}>
                        <span style={{ color: recommendation.accent, fontWeight: 800 }}>{s.shade}</span> — {s.tser}% heat · {s.irr}% IR · {s.uvr}% UV
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* ── TINT & THE LAW ── */}
        <Section
          eyebrow="Australian compliance"
          title="Tint and the law."
          sub="Window tint darkness is regulated by state and territory, and the limits differ for each window on the vehicle."
        >
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, background: C.card, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <Scale size={18} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 800 }}>Darker is not always legal</div>
                <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.7, marginTop: 8, maxWidth: 760 }}>
                  Across most of Australia, front side windows must keep a minimum visible light
                  transmission (commonly 35%), while rear side windows and the rear windscreen are
                  generally permitted darker. Windscreens are restricted to a limited band along the
                  top. Limits vary between states and territories, and some vary by vehicle type.
                </p>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginTop: 10, maxWidth: 760 }}>
                  Because Progard&apos;s ceramic construction rejects heat through the film itself rather
                  than through darkness, a legal 35% Night Rider or Fusion can outperform a much darker
                  budget film. You do not have to choose between comfort and compliance.
                </p>
                <div style={{ marginTop: 14, padding: "11px 14px", borderRadius: 9, background: C.bg2, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                  Your Progard installer will confirm the exact limits that apply in your state and to
                  your vehicle before fitting. Always confirm current requirements with your state road
                  authority.
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── BUSINESS OPERATING SYSTEM ── */}
        <Section
          id="system"
          eyebrow="Powered by BVN"
          title="The system behind the brand."
          sub="Progard doesn't just get a website. It runs on a complete operating system — a CEO dashboard that unifies the CRM, job scheduling and social media marketing, so every lead, install and post lives in one place. Explore it below."
        >
          <OpsDashboard />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 16 }}>
            {[
              { Icon: Users, title: "GoHighLevel CRM", body: "Every enquiry captured and moved through the pipeline, with automations firing at each stage — instant replies, quote follow-ups and review requests." },
              { Icon: Megaphone, title: "Social media marketing", body: "Content planned, created and scheduled across Instagram and Facebook — built into the same dashboard, turning posts into tracked leads." },
              { Icon: Wrench, title: "ServiceM8 jobs", body: "Installs scheduled, assigned to technicians and synced back to the CRM, so the office always knows what's booked, done and awaiting payment." },
              { Icon: Bot, title: "AI assistant", body: "The website advisor answers questions and books quotes around the clock, feeding straight into the pipeline as new leads." },
            ].map((f) => (
              <div key={f.title} style={{ border: `1px solid ${C.border}`, borderRadius: 13, background: C.card, padding: 20 }}>
                <f.Icon size={19} color={C.gold} />
                <div style={{ fontSize: 13.5, fontWeight: 800, marginTop: 11 }}>{f.title}</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── WHY PROGARD ── */}
        <Section
          id="why"
          eyebrow="Why Progard"
          title="Backed by people, not just film."
          sub="Premium films, tailored for Australia — and supported by the experience to match them to the right job."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
            {TRUST.map((t) => (
              <div key={t.title} style={{ border: `1px solid ${C.border}`, borderRadius: 13, background: C.card, padding: 20 }}>
                <t.Icon size={19} color={C.gold} />
                <div style={{ fontSize: 13.5, fontWeight: 800, marginTop: 11 }}>{t.title}</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>{t.body}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── CONTACT ── */}
        <Section
          id="contact"
          eyebrow="Get started"
          title="Request a quote."
          sub="Tell us the job — home, office or vehicle — and we'll recommend the right film and put you with a trusted installer."
        >
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, background: C.card, padding: 28, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(700px 180px at 50% 0%, ${C.gold}18, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 22 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>
                  Premium films, tailored for <span style={{ color: C.gold }}>Australia.</span>
                </div>
                <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.7, marginTop: 10 }}>
                  Residential, commercial and automotive. Australian owned, professionally installed,
                  and backed by industry leading warranties.
                </p>
                <div style={{ display: "grid", gap: 9, marginTop: 18 }}>
                  {[
                    { Icon: Mail, v: "info@progardfilms.com.au" },
                    { Icon: Phone, v: "Request a callback" },
                    { Icon: MapPin, v: "Australia wide installer network" },
                  ].map((r) => (
                    <div key={r.v} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: C.sub }}>
                      <r.Icon size={13} color={C.gold} /> {r.v}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
                {["Home & residential glass", "Office, retail & commercial", "Automotive tinting"].map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 9, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 15px", background: C.bg2, fontSize: 13 }}>
                    <CheckCircle2 size={14} color={C.gold} /> {s}
                  </div>
                ))}
                <a
                  href="#"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.gold, color: "#0A0A0A", padding: "14px 22px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none", marginTop: 4 }}
                >
                  Get a quote <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* ── FOOTER ── */}
        <div style={{ marginTop: 70, paddingTop: 26, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, border: `1.5px solid ${C.gold}`, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 12, color: C.gold }}>P</div>
            <span style={{ fontWeight: 900, letterSpacing: 2.4, fontSize: 13 }}>PROGARD FILMS</span>
          </div>
          <div style={{ fontSize: 12.5, color: C.muted }}>
            Premium films, tailored for <span style={{ color: C.gold }}>Australia.</span>
          </div>
          <div style={{ fontSize: 12.5, color: C.muted }}>progardfilms.com.au</div>
        </div>

        <div style={{ marginTop: 18, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
          Specifications shown are taken from the Progard range sheets. TSER = Total Solar Energy
          Rejected, IRR = Infrared Rejection, UVR = UV Rejection. Photography is licensed stock
          used as placeholder art and does not depict Progard installations. The AI advisor is a
          demonstration and the CEO dashboard figures are sample data. To be replaced with the
          client&apos;s own images and live systems. Built by BVN Digital Agency.
        </div>
      </div>

      <style>{`.pg-link:hover{color:${C.ink} !important;}`}</style>
    </div>
  );
}
