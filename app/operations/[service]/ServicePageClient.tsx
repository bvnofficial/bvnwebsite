"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import type { OperationsService } from "@/lib/operations-services";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowButton from "@/components/ui/GlowButton";
import TestimonialsSection from "@/components/ui/TestimonialsSection";
import CaseStudiesSection from "@/components/ui/CaseStudiesSection";
import dynamic from "next/dynamic";

const AIAgentsDemo = dynamic(() => import("@/components/demos/AIAgentsDemo"));
const CRMDemo = dynamic(() => import("@/components/demos/CRMDemo"));
const HRPayrollDemo = dynamic(() => import("@/components/demos/HRPayrollDemo"));
const AnalyticsDemo = dynamic(() => import("@/components/demos/AnalyticsDemo"));
const GenericDemo = dynamic(() => import("@/components/demos/GenericDemo"));

function renderDemo(demoType: string, title: string) {
  switch (demoType) {
    case "ai-agents": return <AIAgentsDemo />;
    case "crm-automation": return <CRMDemo />;
    case "hr-payroll": return <HRPayrollDemo />;
    case "analytics": return <AnalyticsDemo />;
    default: return <GenericDemo demoType={demoType} title={title} />;
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const childVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function ServicePageClient({ service }: { service: OperationsService }) {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end bg-navy-dark overflow-hidden pt-24 pb-20">
        <div className="absolute inset-0 grid-bg" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "800px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(27,48,96,0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full">
          <Link href="/operations" className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-blue-400 transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Operations
          </Link>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block font-accent font-semibold text-xs tracking-[0.2em] uppercase text-blue-400 mb-4 px-3 py-1.5 rounded-full bg-blue-400/10 border border-blue-400/20"
          >
            BVN Operations
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-5 max-w-4xl"
          >
            {service.heroHeadline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-lg max-w-3xl leading-relaxed mb-8"
          >
            {service.heroSubtext}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <GlowButton href="/contact" variant="filled" showArrow>
              Get a Free Quote
            </GlowButton>
            <GlowButton href="/pricing" variant="outline">
              View Pricing
            </GlowButton>
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative py-24 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5"
      >
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        <div className="relative max-w-7xl mx-auto">
          <SectionHeader
            label={service.title}
            title="What's Included"
            subtitle="Every automation is designed, built, and maintained by certified specialists."
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {service.features.map((f) => (
              <motion.div
                key={f.title}
                variants={childVariant}
                whileHover={{ y: -4, boxShadow: "0 0 24px rgba(59,130,246,0.15)" }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-blue-400/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-400/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-blue-400" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-sm mb-1.5">{f.title}</h3>
                    <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Interactive Demo ─────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            label="Live Demo"
            title="Try It Yourself"
            subtitle="Interact with a live sample of the automation system below."
            centered
          />
          {renderDemo(service.demoType, service.title)}
        </div>
      </motion.section>

      {/* ── Case Studies ─────────────────────────────────── */}
      <CaseStudiesSection caseStudies={service.caseStudies} />

      {/* ── Testimonials ─────────────────────────────────── */}
      <TestimonialsSection testimonials={service.testimonials} />

      {/* ── CTA ──────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-20 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-4">
            Ready to automate your {service.title.toLowerCase()}?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Book a free consultation and we&apos;ll design a custom automation system for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GlowButton href="/contact" variant="filled" showArrow className="px-8 py-4 text-base">
              Book Free Consultation
            </GlowButton>
            <GlowButton href="/pricing" variant="outline">
              See Pricing Plans
            </GlowButton>
          </div>
        </div>
      </motion.section>
    </>
  );
}
