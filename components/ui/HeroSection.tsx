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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroSection({
  badge,
  headline,
  subtext,
  primaryCta,
  secondaryCta,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-navy-dark",
        className
      )}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 grid-bg" />

      {/* Radial spotlight — drifting orange glow */}
      <div
        className="absolute pointer-events-none animate-spotlight"
        style={{
          width: "clamp(600px, 80vw, 1200px)",
          height: "clamp(600px, 80vw, 1200px)",
          top: "50%",
          left: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(232,96,16,0.12) 0%, rgba(27,48,96,0.08) 40%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Secondary blue accent glow */}
      <div
        className="absolute pointer-events-none top-1/4 right-1/4"
        style={{
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(ellipse at center, rgba(27,48,96,0.2) 0%, transparent 60%)",
          borderRadius: "50%",
        }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center pt-32 pb-24"
      >
        {/* Badge */}
        {badge && (
          <motion.div variants={itemVariants} className="mb-6">
            <span
              className="inline-block font-accent text-sm font-semibold px-4 py-2 rounded-full
                bg-white/5 backdrop-blur-sm border border-white/15 text-white/80"
            >
              {badge}
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-white mb-6"
        >
          {headline.split(". ").map((part, i, arr) => (
            <span key={i}>
              <span className={i === 0 ? "text-white" : "text-gradient"}>
                {part}
              </span>
              {i < arr.length - 1 ? ". " : ""}
            </span>
          ))}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-white/60 text-base md:text-xl leading-relaxed max-w-3xl mx-auto mb-10"
        >
          {subtext}
        </motion.p>

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
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
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-dark to-transparent pointer-events-none" />
    </section>
  );
}
