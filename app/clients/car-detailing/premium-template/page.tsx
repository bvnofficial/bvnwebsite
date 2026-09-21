"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Sparkles, Star, ShieldCheck, Car, Droplets,
  Gem, Wand2, Phone, MapPin, Clock, CalendarCheck, Check, Smartphone,
  Copy, Braces, Search, Layers,
} from "lucide-react";

// Premium automotive palette (dark, glossy, gold accent)
const C = {
  bg: "#0B0B0D",
  bg2: "#121216",
  card: "#17171C",
  cardHi: "#1E1E25",
  border: "#2A2A33",
  ink: "#F5F5F7",
  sub: "#AEAEB8",
  muted: "#6E6E78",
  gold: "#C9A24B",
  goldHi: "#E7CC7E",
  chrome: "#C9CDD6",
  green: "#4ADE80",
};

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, y = 22 }: { children: React.ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
const SERVICES = [
  { Icon: Droplets, name: "Interior Detail", desc: "Deep clean, steam, and protect every surface inside the cabin.", from: "from $149" },
  { Icon: Car, name: "Exterior Detail", desc: "Hand wash, decontamination, and a deep gloss finish.", from: "from $129" },
  { Icon: Gem, name: "Ceramic Coating", desc: "Years of protection and a mirror shine that lasts.", from: "from $699" },
  { Icon: Wand2, name: "Paint Correction", desc: "Cut and polish away swirls, scratches, and oxidation.", from: "from $349" },
];

const GALLERY = [
  { label: "Ceramic coat", tone: "linear-gradient(135deg,#1b1b22,#2b2b36)" },
  { label: "Paint correction", tone: "linear-gradient(135deg,#201a12,#3a2e18)" },
  { label: "Interior reset", tone: "linear-gradient(135deg,#141a1c,#1f3034)" },
  { label: "Full detail", tone: "linear-gradient(135deg,#1c1620,#2e2036)" },
  { label: "Wheel & trim", tone: "linear-gradient(135deg,#1a1a1a,#2a2a2a)" },
  { label: "Show finish", tone: "linear-gradient(135deg,#20200f,#3a3a1c)" },
];

const CUSTOM_VALUES = [
  "{{business.name}}",
  "{{business.phone}}",
  "{{business.location}}",
  "{{service.list}}",
  "{{business.hours}}",
  "{{gallery.images}}",
  "{{booking.url}}",
  "{{review.rating}}",
];

const TEMPLATE_POINTS = [
  { Icon: Copy, title: "Duplicate in minutes", body: "Every business specific detail is a Custom Value, so a new client account is a duplicate plus a few field edits, not a rebuild.", },
  { Icon: Smartphone, title: "Clean on every screen", body: "Designed mobile first, then scaled up, so the desktop and phone both look deliberate, not squeezed.", },
  { Icon: Layers, title: "Native GHL elements", body: "Built with GoHighLevel sections and elements wherever they do the job, with custom code only where it genuinely earns its place.", },
  { Icon: Search, title: "SEO friendly structure", body: "One clear H1 per page, logical headings, alt text, and fast clean sections, so each duplicated site starts on solid SEO footing.", },
];

// ─────────────────────────────────────────────────────────────
export default function CarDetailingTemplate() {
  const [svc, setSvc] = useState(0);

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "22px 22px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="https://www.bvnofficial.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.sub, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
          <ArrowLeft size={15} /> BVN Official
        </a>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: C.gold, background: "rgba(201,162,75,0.10)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px" }}>
          Built for your application
        </span>
      </div>

      {/* ── HERO ─────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden" }}>
        {/* glow */}
        <div style={{ position: "absolute", top: -160, left: "50%", transform: "translateX(-50%)", width: 900, height: 460, background: "radial-gradient(ellipse at center, rgba(201,162,75,0.14), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "70px 22px 60px", position: "relative" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: C.gold }}>
              <Sparkles size={14} /> Premium mobile detailing
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 style={{ fontSize: 52, lineHeight: 1.04, fontWeight: 800, letterSpacing: -1, margin: "16px 0 0", maxWidth: 820 }}>
              Your car, finished to a
              <span style={{ background: `linear-gradient(90deg, ${C.goldHi}, ${C.gold})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}> showroom shine.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize: 18, color: C.sub, lineHeight: 1.6, maxWidth: 600, marginTop: 18 }}>
              <span style={{ color: C.chrome, fontWeight: 700 }}>{"{{business.name}}"}</span> brings mobile detailing to your door.
              Interior, exterior, ceramic coating, and paint correction, done with obsessive care.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
              <a href="#book" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 800, color: C.bg, background: `linear-gradient(90deg, ${C.goldHi}, ${C.gold})`, borderRadius: 12, padding: "14px 22px", textDecoration: "none" }}>
                <CalendarCheck size={17} /> Book your detail
              </a>
              <a href="#services" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 700, color: C.ink, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 22px", textDecoration: "none" }}>
                View services <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>

          {/* trust row */}
          <Reveal delay={0.2}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 34, marginTop: 46 }}>
              {[
                { v: "2,400+", k: "Cars detailed" },
                { v: "4.9", k: "Average rating", star: true },
                { v: "Mobile", k: "We come to you" },
                { v: "5 yrs", k: "Ceramic warranty" },
              ].map((s) => (
                <div key={s.k}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 24, fontWeight: 800, color: C.ink }}>
                    {s.v}{s.star && <Star size={16} color={C.gold} fill={C.gold} />}
                  </div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{s.k}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      {/* ── SERVICES ─────────────────────────── */}
      <section id="services" style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 22px" }}>
        <Reveal>
          <SectionLabel>Services</SectionLabel>
          <SectionTitle>Detailing packages, no corners cut</SectionTitle>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 26 }}>
          {SERVICES.map((s, i) => {
            const on = svc === i;
            return (
              <Reveal key={s.name} delay={i * 0.06}>
                <button
                  onMouseEnter={() => setSvc(i)}
                  onFocus={() => setSvc(i)}
                  onClick={() => setSvc(i)}
                  style={{
                    width: "100%", textAlign: "left", cursor: "pointer",
                    background: on ? C.cardHi : C.card,
                    border: `1px solid ${on ? C.gold : C.border}`,
                    borderRadius: 18, padding: "24px 22px", transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 13, display: "grid", placeItems: "center", background: on ? "rgba(201,162,75,0.14)" : "rgba(255,255,255,0.03)", border: `1px solid ${on ? C.gold : C.border}`, transition: "all 0.2s" }}>
                    <s.Icon size={22} color={on ? C.goldHi : C.chrome} />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, marginTop: 16 }}>{s.name}</div>
                  <p style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.55, margin: "7px 0 14px" }}>{s.desc}</p>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.gold }}>{s.from}</div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────── */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 22px" }}>
        <Reveal>
          <SectionLabel>The work</SectionLabel>
          <SectionTitle>Results that speak for themselves</SectionTitle>
          <p style={{ fontSize: 14.5, color: C.sub, maxWidth: 560, lineHeight: 1.6, marginTop: 8 }}>
            In a live client site these tiles are the {"{{gallery.images}}"} Custom Value, so each business shows its own real before and after work.
          </p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 24 }}>
          {GALLERY.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.04}>
              <div style={{ position: "relative", height: 168, borderRadius: 16, background: g.tone, border: `1px solid ${C.border}`, overflow: "hidden", display: "flex", alignItems: "flex-end", padding: 14 }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 55%)" }} />
                <span style={{ position: "relative", fontSize: 12.5, fontWeight: 700, color: C.ink, background: "rgba(0,0,0,0.4)", border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 11px", backdropFilter: "blur(4px)" }}>
                  {g.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TEMPLATE / CUSTOM VALUES (the differentiator) ── */}
      <section style={{ background: C.bg2, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, marginTop: 30 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 22px" }}>
          <Reveal>
            <SectionLabel>Built as a master template</SectionLabel>
            <SectionTitle>One design, duplicated cleanly for every client</SectionTitle>
            <p style={{ fontSize: 15, color: C.sub, maxWidth: 640, lineHeight: 1.65, marginTop: 10 }}>
              This is the part that matters for your use case. The design is premium, but it is also structured so you can duplicate it across car detailing clients in minutes. Every business specific detail is a GoHighLevel Custom Value.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22, marginTop: 28, alignItems: "start" }}>
            {/* custom values chips */}
            <Reveal>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, color: C.chrome, marginBottom: 14 }}>
                  <Braces size={15} color={C.gold} /> Custom Values used across the template
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {CUSTOM_VALUES.map((v) => (
                    <span key={v} style={{ fontSize: 12.5, fontFamily: "'SFMono-Regular', ui-monospace, monospace", fontWeight: 600, color: C.goldHi, background: "rgba(201,162,75,0.08)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px" }}>
                      {v}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.55, marginTop: 16, marginBottom: 0 }}>
                  Change these once per client. Nothing else in the design needs touching.
                </p>
              </div>
            </Reveal>

            {/* template points */}
            <div style={{ display: "grid", gap: 12 }}>
              {TEMPLATE_POINTS.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.05}>
                  <div style={{ display: "flex", gap: 13, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 16px" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, flexShrink: 0 }}>
                      <p.Icon size={17} color={C.gold} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{p.title}</div>
                      <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, margin: "3px 0 0" }}>{p.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────── */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "52px 22px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { q: "Booked online in two minutes and they came to my driveway. The car looks better than new.", n: "Marcus R." },
            { q: "The ceramic coating is unreal. Water just slides off. Worth every dollar.", n: "Elena T." },
            { q: "Clean, professional, and on time. This is my detailer from now on.", n: "Dev P." },
          ].map((t, i) => (
            <Reveal key={t.n} delay={i * 0.06}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 20px", height: "100%" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
                  {[0, 1, 2, 3, 4].map((k) => <Star key={k} size={14} color={C.gold} fill={C.gold} />)}
                </div>
                <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.6, margin: "0 0 12px" }}>{t.q}</p>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: C.muted }}>{t.n}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── BOOKING CTA ──────────────────────── */}
      <section id="book" style={{ maxWidth: 1120, margin: "0 auto", padding: "30px 22px 20px" }}>
        <Reveal>
          <div style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${C.cardHi}, ${C.card})`, border: `1px solid ${C.border}`, borderRadius: 22, padding: "40px 30px" }}>
            <div style={{ position: "absolute", top: -120, right: -60, width: 380, height: 320, background: "radial-gradient(ellipse at center, rgba(201,162,75,0.16), transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", maxWidth: 620 }}>
              <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>Ready to book your detail?</h2>
              <p style={{ fontSize: 15, color: C.sub, lineHeight: 1.6, margin: "12px 0 22px" }}>
                Pick a time and we come to you. Confirmation and reminders are automatic, powered by the GoHighLevel booking calendar behind {"{{booking.url}}"}.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
                <a href="#book" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 800, color: C.bg, background: `linear-gradient(90deg, ${C.goldHi}, ${C.gold})`, borderRadius: 12, padding: "14px 22px", textDecoration: "none" }}>
                  <CalendarCheck size={17} /> Book now
                </a>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, color: C.sub }}><Phone size={15} color={C.gold} /> {"{{business.phone}}"}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, color: C.sub }}><MapPin size={15} color={C.gold} /> {"{{business.location}}"}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, color: C.sub }}><Clock size={15} color={C.gold} /> {"{{business.hours}}"}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── BVN one-man + honesty ─────────────── */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "34px 22px 20px" }}>
        <Reveal>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
              <ShieldCheck size={18} color={C.gold} />
              <span style={{ fontSize: 15, fontWeight: 800 }}>What this demo is, and what it is not</span>
            </div>
            <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.65, margin: 0, maxWidth: 760 }}>
              I designed and built this page myself to show the premium look, spacing, and consistency I would bring to your
              master template, and how I would structure it around GoHighLevel Custom Values so it duplicates cleanly. I want to be
              straight: this page is the design showcase. My hands on GoHighLevel website builds live in client accounts that stay
              confidential, and I am glad to walk you through them on a screen share. BVN is not an agency, it is me, so you work
              directly with the designer.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
              <Link href="/benjaminyson" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 800, color: C.bg, textDecoration: "none", background: `linear-gradient(90deg, ${C.goldHi}, ${C.gold})`, borderRadius: 999, padding: "10px 16px" }}>
                Portfolio and CV <ArrowRight size={14} />
              </Link>
              <Link href="/intro" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: C.ink, textDecoration: "none", background: C.card, border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 16px" }}>
                Intro video <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Reveal>

        <div style={{ marginTop: 26, textAlign: "center", fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", paddingBottom: 30 }}>
          <Check size={14} color={C.green} /> Benjamin Yson · BVN Official
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Phone size={13} /> +63 981 655 6555</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock size={13} /> Overlaps United States hours daily</span>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: C.gold }}>
      {children}
    </div>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, margin: "8px 0 0" }}>{children}</h2>
  );
}
