"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp } from "lucide-react";
import type { CaseStudy } from "@/lib/marketing-services";
import SectionHeader from "./SectionHeader";

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
}

export default function CaseStudiesSection({ caseStudies }: CaseStudiesSectionProps) {
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHeader
          label="International Case Studies"
          title="Proven Results. Global Scale."
          subtitle="See how top companies worldwide used these strategies to achieve breakthrough results."
          centered
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          {caseStudies.map((cs, i) => (
            <motion.div
              key={i}
              variants={item}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden
                hover:border-orange/30 hover:shadow-[0_0_32px_rgba(232,96,16,0.12)] transition-all"
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-5 border-b border-white/8">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{cs.flag}</span>
                      <span className="text-white/40 text-xs font-accent uppercase tracking-widest">
                        {cs.country}
                      </span>
                    </div>
                    <h3 className="font-heading font-extrabold text-xl text-white">
                      {cs.company}
                    </h3>
                    <p className="text-white/40 text-xs mt-0.5">{cs.industry}</p>
                  </div>
                  {/* Big metric */}
                  <div className="text-right shrink-0">
                    <div className="font-heading font-extrabold text-3xl text-gradient leading-tight">
                      {cs.metric}
                    </div>
                    <div className="text-white/40 text-xs mt-0.5 max-w-[100px] text-right">
                      {cs.metricLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-5">
                <div>
                  <p className="font-accent font-semibold text-xs uppercase tracking-widest text-white/40 mb-1.5">
                    Challenge
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed">{cs.challenge}</p>
                </div>
                <div>
                  <p className="font-accent font-semibold text-xs uppercase tracking-widest text-white/40 mb-1.5">
                    Solution
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed">{cs.solution}</p>
                </div>
                <div>
                  <p className="font-accent font-semibold text-xs uppercase tracking-widest text-white/40 mb-2.5">
                    Results
                  </p>
                  <ul className="space-y-2">
                    {cs.results.map((r, ri) => (
                      <li key={ri} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className="text-orange shrink-0 mt-0.5" />
                        <span className="text-white/70 text-sm">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
