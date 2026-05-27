"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PricingFeature {
  label: string;
  value: string | boolean;
}

interface PricingCardProps {
  tier: string;
  price: string;
  period?: string;
  features: PricingFeature[];
  isPopular?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  highlight?: string;
}

export default function PricingCard({
  tier,
  price,
  period = "/mo",
  features,
  isPopular = false,
  ctaLabel = "Get Started",
  ctaHref = "/contact",
  highlight,
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300",
        isPopular
          ? "border-orange shadow-[0_0_40px_rgba(232,96,16,0.2)] bg-white/8"
          : "border-white/10 hover:border-orange/30"
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className="px-4 py-1 bg-orange text-white text-xs font-heading font-bold rounded-full
              shadow-[0_0_16px_rgba(232,96,16,0.5)] whitespace-nowrap"
          >
            ★ Most Popular
          </span>
        </div>
      )}

      {/* Tier */}
      <div className="mb-6 mt-2">
        <span className="font-accent font-semibold text-xs tracking-[0.2em] uppercase text-orange/80">
          {tier}
        </span>
        {highlight && (
          <p className="text-white/40 text-xs mt-1">{highlight}</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-6 pb-6 border-b border-white/10">
        <div className="flex items-end gap-1">
          <span className="font-heading font-extrabold text-4xl text-white">
            {price}
          </span>
          <span className="text-white/40 text-sm mb-1">{period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-8">
        {features.map((feature, i) => {
          const hasValue = feature.value !== false && feature.value !== "—";
          return (
            <li key={i} className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center",
                  hasValue ? "text-orange" : "text-white/20"
                )}
              >
                {hasValue ? <Check size={12} strokeWidth={3} /> : <Minus size={12} />}
              </span>
              <div className="text-sm">
                <span className="text-white/50 mr-1">{feature.label}:</span>
                <span
                  className={cn(
                    "font-semibold",
                    hasValue ? "text-white/90" : "text-white/25"
                  )}
                >
                  {typeof feature.value === "boolean"
                    ? feature.value
                      ? "Included"
                      : "—"
                    : feature.value}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      <Link
        href={ctaHref}
        className={cn(
          "block text-center py-3 px-6 rounded-lg font-heading font-semibold text-sm transition-all duration-200",
          isPopular
            ? "bg-orange text-white shadow-[0_0_20px_rgba(232,96,16,0.4)] hover:bg-orange-light hover:shadow-[0_0_28px_rgba(232,96,16,0.6)]"
            : "border border-white/20 text-white hover:bg-white/10 hover:border-white/40"
        )}
      >
        {ctaLabel}
      </Link>
    </motion.div>
  );
}
