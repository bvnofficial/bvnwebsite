"use client";

import { motion } from "framer-motion";
import GlowButton from "./GlowButton";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  badge?: string;
  headline: string;
  subtext: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
}

// Deterministic particles — no hydration mismatch
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  size: (i % 3) + 1,
  delay: ((i * 0.4) % 4).toFixed(1),
  duration: (((i * 0.7) % 3) + 2.5).toFixed(1),
  type: i % 3 === 0 ? "particle-blue" : i % 3 === 1 ? "particle-purple" : "",
}));

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const ticker = [
  "238+ CLIENTS WORLDWIDE",
  "GLOBAL DIGITAL MARKETING",
  "AI-POWERED AUTOMATION",
  "SEO & GROWTH STRATEGY",
  "CRM & SALES AUTOMATION",
  "HR & PAYROLL SYSTEMS",
  "WEB & APP DEVELOPMENT",
  "CONTENT THAT CONVERTS",
];

export default function HeroSection({
  badge,
  headline,
  subtext,
  primaryCta,
  secondaryCta,
  className,
}: HeroSectionProps) {
  const words = headline.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <section
      className={cn(
        "relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-[#0A0F1E]",
        className
      )}
    >
      {/* ── Layer 1: Animated grid ── */}
      <div className="absolute inset-0 grid-bg-animated opacity-70 pointer-events-none" />

      {/* ── Layer 2: Floating orbs ── */}
      {/* Orange orb — left-center */}
      <div
        className="orb-orange absolute pointer-events-none"
        style={{
          width: "700px", height: "700px",
          top: "10%", left: "-10%",
          background: "radial-gradient(ellipse at center, rgba(232,96,16,0.18) 0%, rgba(232,96,16,0.06) 40%, transparent 70%)",
          borderRadius: "50%", filter: "blur(40px)",
        }}
      />
      {/* Blue orb — right-top */}
      <div
        className="orb-blue absolute pointer-events-none"
        style={{
          width: "600px", height: "600px",
          top: "-5%", right: "-5%",
          background: "radial-gradient(ellipse at center, rgba(27,48,96,0.5) 0%, rgba(96,165,250,0.1) 40%, transparent 70%)",
          borderRadius: "50%", filter: "blur(50px)",
        }}
      />
      {/* Purple orb — bottom-right */}
      <div
        className="orb-purple absolute pointer-events-none"
        style={{
          width: "500px", height: "500px",
          bottom: "5%", right: "15%",
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(60px)",
        }}
      />
      {/* Center orange glow */}
      <div
        className="absolute pointer-events-none animate-spotlight"
        style={{
          width: "clamp(600px, 80vw, 1100px)",
          height: "clamp(600px, 80vw, 1100px)",
          top: "50%", left: "50%",
          background: "radial-gradient(ellipse at center, rgba(232,96,16,0.1) 0%, rgba(27,48,96,0.05) 40%, transparent 70%)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── Layer 3: Particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className={cn("particle", p.type)}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* ── Layer 4: Scan line ── */}
      <div className="scan-line scan-line-slow" />

      {/* ── Layer 5: Corner decorators ── */}
      <div className="corner-tl" style={{ width: 40, height: 40 }} />
      <div className="corner-tr" style={{ width: 40, height: 40 }} />
      <div className="corner-bl" style={{ width: 40, height: 40 }} />
      <div className="corner-br" style={{ width: 40, height: 40 }} />

      {/* ── Layer 6: Main content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center pt-32 pb-20"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <div className="relative inline-flex items-center">
            {/* Pulse rings */}
            <span className="absolute left-3 w-2 h-2 rounded-full bg-orange">
              <span className="absolute inset-0 rounded-full bg-orange pulse-ring" />
              <span className="absolute inset-0 rounded-full bg-orange pulse-ring pulse-ring-delay" />
            </span>
            <span
              className="inline-flex items-center pl-8 pr-4 py-2 rounded-full font-accent font-semibold text-xs tracking-[0.2em] uppercase
                bg-white/5 backdrop-blur-sm border border-orange/25 text-orange/90 neon-border"
            >
              {badge ?? "🌏 Trusted by 238+ Businesses Worldwide"}
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] text-white mb-2"
        >
          <span className="block">{line1}</span>
          <span className="block text-gradient">{line2}</span>
        </motion.h1>

        {/* Glowing underline accent */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-4 mb-8"
        >
          <div
            className="h-px w-48 md:w-72"
            style={{
              background: "linear-gradient(90deg, transparent, #E86010, #F5A623, #E86010, transparent)",
              boxShadow: "0 0 20px rgba(232,96,16,0.6)",
            }}
          />
        </motion.div>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
        >
          {subtext}
        </motion.p>

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            {primaryCta && (
              <GlowButton href={primaryCta.href} variant="filled" showArrow>
                {primaryCta.label}
              </GlowButton>
            )}
            {secondaryCta && (
              <GlowButton href={secondaryCta.href} variant="outline">
                {secondaryCta.label}
              </GlowButton>
            )}
          </motion.div>
        )}

        {/* Floating stats row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {[
            { val: "238+", label: "Clients" },
            { val: "10+", label: "Marketing Services" },
            { val: "8+", label: "Automation Services" },
            { val: "24/7", label: "Support" },
          ].map(({ val, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/4 border border-white/8 backdrop-blur-sm"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}
            >
              <span className="font-heading font-bold text-orange text-sm">{val}</span>
              <span className="text-white/40 text-xs font-accent">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Layer 7: Bottom marquee ticker ── */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-orange/10 bg-black/20 backdrop-blur-sm overflow-hidden"
           style={{ height: 40 }}>
        <div className="flex items-center h-full">
          <div className="marquee-track">
            {[...ticker, ...ticker].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 px-6 font-accent font-semibold text-xs tracking-widest whitespace-nowrap"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-orange shrink-0"
                  style={{ boxShadow: "0 0 6px rgba(232,96,16,0.8)" }}
                />
                <span className="text-white/50 hover:text-orange/80 transition-colors">{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-10 left-0 right-0 h-20 bg-gradient-to-t from-[#0A0F1E] to-transparent pointer-events-none" />
    </section>
  );
}
