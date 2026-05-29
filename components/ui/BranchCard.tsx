"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BranchCardProps {
  icon: LucideIcon;
  title: string;
  tagline: string;
  services: string[];
  ctaLabel: string;
  ctaHref: string;
  variant?: "marketing" | "operations";
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const listItem = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function BranchCard({
  icon: Icon,
  title,
  tagline,
  services,
  ctaLabel,
  ctaHref,
  variant = "marketing",
}: BranchCardProps) {
  const isMarketing = variant === "marketing";
  const accent = isMarketing
    ? { text: "text-orange", border: "border-orange/30", hoverBorder: "hover:border-orange/70", bg: "bg-orange/10", borderColor: "rgba(232,96,16", glow: "rgba(232,96,16,0.25)" }
    : { text: "text-blue-400", border: "border-blue-500/30", hoverBorder: "hover:border-blue-400/70", bg: "bg-blue-500/10", borderColor: "rgba(96,165,250", glow: "rgba(96,165,250,0.2)" };

  return (
    <motion.div
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col bg-white/[0.04] backdrop-blur-sm rounded-2xl p-8 border transition-all duration-400 overflow-hidden",
        accent.border, accent.hoverBorder
      )}
      style={{ boxShadow: `0 0 0 rgba(0,0,0,0)` }}
      whileHover={{ scale: 1.01, y: -8 } as never}
    >
      {/* Holographic shimmer on hover */}
      <div className="absolute inset-0 holo-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />

      {/* Top scan line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accent.borderColor},0.8), transparent)` }}
      />

      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none rounded-2xl" />

      {/* Corner decorators */}
      <div className={cn("corner-tl w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300", isMarketing ? "border-orange/60" : "border-blue-400/60")} />
      <div className={cn("corner-br w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300", isMarketing ? "border-orange/60" : "border-blue-400/60")} />

      {/* Gradient inner glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isMarketing
            ? "radial-gradient(ellipse at 20% 0%, rgba(232,96,16,0.12) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 20% 0%, rgba(96,165,250,0.1) 0%, transparent 60%)",
        }}
      />

      {/* Icon with pulse */}
      <div className="relative mb-6">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative",
            isMarketing
              ? "bg-orange/10 border border-orange/25 group-hover:bg-orange/20 group-hover:border-orange/60"
              : "bg-blue-500/10 border border-blue-500/25 group-hover:bg-blue-500/20 group-hover:border-blue-400/60"
          )}
          style={{ boxShadow: isMarketing ? "0 0 0 rgba(232,96,16,0)" : "0 0 0 rgba(96,165,250,0)" }}
        >
          <Icon size={26} className={accent.text} />
          {/* Pulse ring on hover */}
          <span
            className={cn(
              "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100",
              isMarketing ? "ring-2 ring-orange/30" : "ring-2 ring-blue-400/30"
            )}
            style={{ animation: "neonBorder 2s ease-in-out infinite" }}
          />
        </div>
      </div>

      {/* Label */}
      <span className={cn("font-accent font-bold text-xs tracking-[0.22em] uppercase mb-2", accent.text)}>
        BVN {title}
      </span>

      {/* Title */}
      <h3 className="font-heading font-extrabold text-2xl text-white mb-2 group-hover:text-gradient transition-all duration-300">
        {title}
      </h3>

      {/* Tagline */}
      <p className="text-white/55 text-sm mb-6 leading-relaxed">{tagline}</p>

      {/* Services List */}
      <motion.ul
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-2.5 flex-1 mb-8"
      >
        {services.map((service) => (
          <motion.li key={service} variants={listItem} className="flex items-center gap-2.5">
            <span
              className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                isMarketing
                  ? "bg-orange/15 text-orange group-hover:bg-orange/25"
                  : "bg-blue-500/15 text-blue-400 group-hover:bg-blue-500/25"
              )}
            >
              <Check size={10} strokeWidth={3} />
            </span>
            <span className="text-white/65 text-sm group-hover:text-white/80 transition-colors duration-200">{service}</span>
          </motion.li>
        ))}
      </motion.ul>

      {/* CTA */}
      <Link
        href={ctaHref}
        className={cn(
          "inline-flex items-center gap-2 font-heading font-semibold text-sm transition-all duration-200 group/cta",
          isMarketing ? "text-orange hover:text-orange-light" : "text-blue-400 hover:text-blue-300"
        )}
      >
        {ctaLabel}
        <ArrowRight size={16} className="group-hover/cta:translate-x-2 transition-transform duration-200" />
      </Link>
    </motion.div>
  );
}
