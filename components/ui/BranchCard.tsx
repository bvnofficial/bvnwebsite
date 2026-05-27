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

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "group relative flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300",
        "hover:shadow-[0_0_40px_rgba(232,96,16,0.2)]",
        isMarketing
          ? "border-orange/30 hover:border-orange/60"
          : "border-blue-500/30 hover:border-blue-400/60"
      )}
    >
      {/* Gradient border shimmer on hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          isMarketing
            ? "bg-gradient-to-br from-orange/10 via-transparent to-orange-light/5"
            : "bg-gradient-to-br from-blue-600/10 via-transparent to-purple-500/5"
        )}
      />

      {/* Icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300",
          isMarketing
            ? "bg-orange/10 border border-orange/25 group-hover:bg-orange/20 group-hover:border-orange/50"
            : "bg-blue-500/10 border border-blue-500/25 group-hover:bg-blue-500/20 group-hover:border-blue-400/50"
        )}
      >
        <Icon
          size={26}
          className={isMarketing ? "text-orange" : "text-blue-400"}
        />
      </div>

      {/* Label */}
      <span
        className={cn(
          "font-accent font-semibold text-xs tracking-[0.2em] uppercase mb-2",
          isMarketing ? "text-orange/80" : "text-blue-400/80"
        )}
      >
        BVN {title}
      </span>

      {/* Title */}
      <h3 className="font-heading font-extrabold text-2xl text-white mb-2">
        {title}
      </h3>

      {/* Tagline */}
      <p className="text-white/60 text-sm mb-6 leading-relaxed">{tagline}</p>

      {/* Services List */}
      <ul className="space-y-2.5 flex-1 mb-8">
        {services.map((service) => (
          <li key={service} className="flex items-center gap-2.5">
            <span
              className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                isMarketing
                  ? "bg-orange/15 text-orange"
                  : "bg-blue-500/15 text-blue-400"
              )}
            >
              <Check size={10} strokeWidth={3} />
            </span>
            <span className="text-white/70 text-sm">{service}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={ctaHref}
        className={cn(
          "inline-flex items-center gap-2 font-heading font-semibold text-sm transition-all duration-200 group/cta",
          isMarketing
            ? "text-orange hover:text-orange-light"
            : "text-blue-400 hover:text-blue-300"
        )}
      >
        {ctaLabel}
        <ArrowRight
          size={16}
          className="group-hover/cta:translate-x-1 transition-transform"
        />
      </Link>
    </motion.div>
  );
}
