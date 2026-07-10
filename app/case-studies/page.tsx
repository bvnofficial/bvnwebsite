"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowUpRight, ArrowRight, Layers, Sparkles } from "lucide-react";
import {
  CASE_STUDIES,
  CATEGORY_ACCENT,
  type CaseCategory,
} from "@/lib/case-studies";
import GlowButton from "@/components/ui/GlowButton";

const CATEGORIES: (CaseCategory | "All")[] = [
  "All",
  "CRM & Automation",
  "AI & Automation",
  "Web & Apps",
  "Marketing & SEO",
  "Operations",
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function CaseStudiesPage() {
  const [filter, setFilter] = useState<CaseCategory | "All">("All");

  const shown = useMemo(
    () => (filter === "All" ? CASE_STUDIES : CASE_STUDIES.filter((c) => c.category === filter)),
    [filter],
  );

  const industries = useMemo(
    () => new Set(CASE_STUDIES.map((c) => c.industry.split(" · ")[0])).size,
    [],
  );

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 lg:px-24 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-1/4 w-96 h-96 rounded-full bg-orange/8 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-blue-500/8 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 font-accent font-semibold text-xs tracking-[0.2em] uppercase text-orange mb-5 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20">
            <Sparkles size={14} /> Our Clients
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-5">
            Client work that <span className="text-gradient">actually ships</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Real builds delivered for businesses across the globe, from GoHighLevel CRM and automation
            to AI chatbots, modern web apps, and SEO. Every one below is a working system you can open
            and click through.
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-14">
            {[
              { num: `${CASE_STUDIES.length}+`, label: "Client builds" },
              { num: `${industries}+`, label: "Industries served" },
              { num: "5", label: "Disciplines" },
              { num: "Global", label: "US · UK · AU · PH" },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="font-heading font-extrabold text-3xl md:text-4xl text-gradient">{num}</div>
                <div className="font-accent text-xs text-white/40 uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID ─────────────────────────────────────────── */}
      <section className="relative py-16 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {CATEGORIES.map((c) => {
              const on = filter === c;
              const accent = c === "All" ? "#E86010" : CATEGORY_ACCENT[c];
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-accent font-semibold transition-all border"
                  style={{
                    color: on ? "#0A0F1E" : "rgba(255,255,255,0.7)",
                    background: on ? accent : "rgba(255,255,255,0.04)",
                    borderColor: on ? accent : "rgba(255,255,255,0.1)",
                  }}
                >
                  {c === "All" && <Layers size={13} />} {c}
                </button>
              );
            })}
          </div>

          {/* Cards */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {shown.map((c) => {
                const accent = CATEGORY_ACCENT[c.category];
                return (
                  <motion.div key={c.title} layout variants={item} exit={{ opacity: 0, scale: 0.97 }}>
                    <Link href={c.href} target="_blank" rel="noopener noreferrer" className="block h-full group">
                      <div className="relative h-full bg-white/[0.04] border border-white/10 rounded-2xl p-6 overflow-hidden
                        transition-all duration-200 group-hover:border-white/25 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)]">
                        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

                        <div className="flex items-center justify-between gap-3 mb-3">
                          <span className="text-[11px] font-accent font-bold uppercase tracking-wider" style={{ color: accent }}>
                            {c.category}
                          </span>
                          {c.featured && (
                            <span className="text-[10px] font-accent font-bold uppercase tracking-wider text-orange bg-orange/10 border border-orange/25 rounded-full px-2 py-0.5">
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className="font-heading font-bold text-white text-lg leading-snug mb-1.5">{c.title}</h3>
                        <div className="flex items-center gap-1.5 text-white/40 text-xs mb-3">
                          <MapPin size={12} /> {c.industry} · {c.region}
                        </div>

                        <p className="text-white/55 text-sm leading-relaxed mb-4">{c.summary}</p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {c.tags.map((t) => (
                            <span key={t} className="text-[11px] font-accent text-white/55 bg-white/5 border border-white/10 rounded-md px-2 py-0.5">
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 text-sm font-heading font-semibold pt-3 border-t border-white/8"
                          style={{ color: accent }}>
                          View the live build
                          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-4">
            Want a system like these for your business?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Tell us what you are trying to fix. We will map it, build it, and hand it over running.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <GlowButton href="/get-started" variant="filled" showArrow className="text-base px-8 py-4">
              Start a project
            </GlowButton>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-heading font-semibold text-base border border-white/30 text-white hover:bg-white/10 hover:border-white/50 active:scale-95 transition-all duration-200"
            >
              View pricing <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
