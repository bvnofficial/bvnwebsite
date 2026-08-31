"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Megaphone, Settings2, Wrench, Bot, Target, Users, Mail, Phone, Zap, Globe, TrendingUp, Shield, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import HeroSection from "@/components/ui/HeroSection";
import BranchCard from "@/components/ui/BranchCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowButton from "@/components/ui/GlowButton";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import ServiceFAQ from "@/components/ui/ServiceFAQ";
import { faqSchema, jsonLdScript } from "@/lib/jsonld";
import type { FaqItem } from "@/lib/service-faqs";

// Home-page FAQ — deliberately answers the exact questions AI engines field
// about BVN ("who / where / what / how much / how to start"), so ChatGPT,
// Perplexity & Google AI Overviews can quote authoritative answers. Rendered
// visibly AND as FAQPage JSON-LD.
const homeFaqs: FaqItem[] = [
  {
    question: "What is BVN?",
    answer:
      "BVN is a global digital marketing and business-automation agency trusted by 238+ clients worldwide. Founded by Benjamin Vincent Yson and based in Las Piñas, Metro Manila, Philippines, BVN combines high-impact marketing (social media, SEO, content, web) with intelligent operations automation (CRM, AI agents, HR & payroll) to help businesses scale.",
  },
  {
    question: "Does BVN work with international clients or only in the Philippines?",
    answer:
      "Both. BVN serves clients worldwide — including the United States, United Kingdom, Australia, Canada, and across Europe and Asia — and also supports local Philippine businesses. All work is delivered remotely, with communication available in English and Filipino.",
  },
  {
    question: "What services does BVN offer?",
    answer:
      "BVN offers two branches. Marketing: social media management, SEO, digital/paid advertising, email marketing, content marketing, video marketing, influencer marketing, web development, app development, and CRM solutions. Operations automation: CRM & sales automation, AI agents, HR & payroll automation, business workflow automation, time tracking, admin automation, analytics, and system integrations.",
  },
  {
    question: "How much does BVN charge for its services?",
    answer:
      "Pricing depends on your goals, scope, and current setup, so BVN scopes each engagement individually rather than using fixed one-size-fits-all packages. Indicative packages are shown at bvnofficial.com/pricing, and you can book a free, no-obligation consultation for a tailored quote.",
  },
  {
    question: "Who founded BVN?",
    answer:
      "BVN was founded by Benjamin Vincent Yson, who leads the agency's marketing and operations-automation work for clients globally and in the Philippines.",
  },
  {
    question: "How do I get started with BVN?",
    answer:
      "Book a free consultation at bvnofficial.com/get-started, email bvn@bvnofficial.com, or call +63 981 655 6555. BVN will review your goals and recommend the right mix of marketing and automation services for your business.",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const childVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const marketingServices = [
  "Social Media Management",
  "SEO & Digital Marketing",
  "Web Development",
  "Email Marketing",
  "Video Marketing",
  "Content Marketing",
  "Creator & Influencer Marketing",
  "App Development",
  "CRM Solutions",
];

const operationsServices = [
  "CRM & Sales Automation",
  "AI Agents & Intelligent Automation",
  "HR & Payroll Automation",
  "Business Workflows",
  "Time & Location Tracking",
  "Admin Automation",
  "Reporting & Analytics",
  "System Integrations",
];

const featurePills = [
  { icon: Wrench, label: "Everything You Need", sub: "All services under one roof" },
  { icon: Bot, label: "Smart Technology", sub: "AI-powered solutions" },
  { icon: Target, label: "Results-Driven", sub: "Measurable ROI always" },
  { icon: Users, label: "Proven Expertise", sub: "238+ clients served" },
];

// Marquee items for the services strip
const marqueeItems = [
  { icon: Zap, text: "Social Media Management" },
  { icon: Globe, text: "SEO & Digital Marketing" },
  { icon: Bot, text: "AI Automation" },
  { icon: TrendingUp, text: "CRM Solutions" },
  { icon: Shield, text: "HR & Payroll" },
  { icon: Target, text: "Content Marketing" },
  { icon: Megaphone, text: "Influencer Marketing" },
  { icon: Settings2, text: "Operations Automation" },
];

export default function HomePage() {
  const [hasEntered, setHasEntered] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem("bvn-entered")) {
      setHasEntered(false);
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem("bvn-entered", "1");
    setHasEntered(true);
  };

  return (
    <>
      {!hasEntered && <ParticleTextEffect onEnter={handleEnter} />}

      {/* ── SECTION 1: Hero ─────────────────────────────────── */}
      <HeroSection
        headline="Elevate Your Business. Dominate Your Market."
        subtext="BVN is a global digital marketing and business automation agency trusted by 238+ clients worldwide. We combine high-impact marketing with intelligent automation to help you scale faster, smarter, and stronger."
        primaryCta={{ label: "Explore Marketing", href: "/marketing" }}
        secondaryCta={{ label: "Explore Operations", href: "/operations" }}
      />

      {/* ── TRUSTED BY (clients) ────────────────────────────── */}
      <section className="relative py-12 px-6 bg-[#0A0F1E] border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-accent font-semibold text-xs tracking-[0.2em] uppercase text-white/40 mb-7">
            Trusted by 238+ businesses worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-orange text-sm font-accent font-semibold hover:gap-2.5 transition-all duration-200"
            >
              See our client work <ArrowRight size={14} />
            </Link>
            <Link
              href="/intro"
              className="inline-flex items-center gap-1.5 text-white/70 text-sm font-accent font-semibold hover:text-white hover:gap-2.5 transition-all duration-200"
            >
              Watch my introduction <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES MARQUEE STRIP ──────────────────────────── */}
      <div className="relative py-5 border-y border-orange/10 bg-black/30 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #0A0F1E 0%, transparent 8%, transparent 92%, #0A0F1E 100%)" }} />
        <div className="marquee-track marquee-track-fast">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map(({ icon: ItemIcon, text }, i) => (
            <span key={i} className="inline-flex items-center gap-2.5 px-8 whitespace-nowrap">
              <span className="w-6 h-6 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center shrink-0">
                <ItemIcon size={12} className="text-orange" />
              </span>
              <span className="font-accent font-semibold text-xs tracking-widest text-white/45 uppercase">{text}</span>
              <span className="w-1 h-1 rounded-full bg-orange/30 shrink-0 ml-4" />
            </span>
          ))}
        </div>
      </div>

      {/* ── SECTION 2: Two Branches ──────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative bg-[#0A0F1E] border-t border-white/5 py-28 px-6 md:px-12 lg:px-24"
      >
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        {/* Subtle scan line */}
        <div className="scan-line" style={{ animationDelay: "3s", opacity: 0.4 }} />

        <div className="relative max-w-7xl mx-auto">
          <SectionHeader
            label="Our Services"
            title="Two Powerful Branches.<br/>One Unstoppable Agency."
            subtitle="BVN brings together marketing excellence and operations intelligence under one roof."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            <motion.div variants={childVariant}>
              <BranchCard
                icon={Megaphone}
                title="Marketing Automation"
                tagline="Amplify Your Brand. Accelerate Your Growth."
                services={marketingServices}
                ctaLabel="Explore Marketing"
                ctaHref="/marketing"
                variant="marketing"
              />
            </motion.div>
            <motion.div variants={childVariant}>
              <BranchCard
                icon={Settings2}
                title="Operations Automation"
                tagline="Work Smarter. Scale Faster. Automate Everything."
                services={operationsServices}
                ctaLabel="Explore Operations"
                ctaHref="/operations"
                variant="operations"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION 3: Why BVN / Stats ──────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative py-28 px-6 md:px-12 lg:px-24 bg-[#080C18] border-t border-white/5"
      >
        {/* Floating orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(232,96,16,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(96,165,250,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <div className="max-w-7xl mx-auto relative">
          <SectionHeader
            label="Why BVN"
            title="Numbers That Speak<br/>for Themselves"
            subtitle="Delivering results for businesses across industries — from startups to established enterprises worldwide."
            centered
          />

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16"
          >
            {[
              { target: 238, suffix: "+", label: "Clients Served" },
              { target: 2, suffix: "", label: "Powerful Branches" },
              { target: 10, suffix: "+", label: "Marketing Services" },
              { target: 8, suffix: "+", label: "Automation Services" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={childVariant}>
                <AnimatedCounter target={stat.target} suffix={stat.suffix} label={stat.label} />
              </motion.div>
            ))}
          </motion.div>

          {/* Feature pills — futuristic version */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {featurePills.map(({ icon: PillIcon, label, sub }) => (
              <motion.div
                key={label}
                variants={childVariant}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group relative flex items-center gap-4 bg-white/[0.04] border border-white/8 rounded-2xl px-5 py-4
                  hover:border-orange/40 hover:bg-white/[0.07] transition-all duration-300 overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(232,96,16,0.1), transparent 70%)" }} />
                <div className="w-10 h-10 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center shrink-0
                  group-hover:bg-orange/20 group-hover:border-orange/50 transition-all duration-300">
                  <PillIcon size={18} className="text-orange" />
                </div>
                <div>
                  <p className="font-accent font-bold text-white/85 text-sm group-hover:text-white transition-colors">{label}</p>
                  <p className="font-body text-white/35 text-xs mt-0.5 group-hover:text-white/55 transition-colors">{sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION 4: CTA Banner ────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative py-28 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5"
      >
        {/* Aurora background */}
        <div className="absolute inset-0 bg-[#0A0F1E]" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232,96,16,0.18) 0%, rgba(27,48,96,0.12) 40%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(27,48,96,0.3) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 grid-bg opacity-30" />

        {/* Animated scan line */}
        <div className="scan-line" style={{ animationDelay: "1s" }} />

        {/* Corner decorators */}
        <div className="absolute top-8 left-8 corner-tl w-10 h-10" />
        <div className="absolute top-8 right-8 corner-tr w-10 h-10" />
        <div className="absolute bottom-8 left-8 corner-bl w-10 h-10" />
        <div className="absolute bottom-8 right-8 corner-br w-10 h-10" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div variants={childVariant} className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 font-accent font-semibold text-xs tracking-[0.2em] uppercase
              text-orange px-4 py-2 rounded-full bg-orange/10 border border-orange/25 neon-border">
              <span className="w-1.5 h-1.5 rounded-full bg-orange" style={{ boxShadow: "0 0 6px rgba(232,96,16,1)" }} />
              Let&apos;s Grow Together
            </span>
          </motion.div>

          <motion.h2
            variants={childVariant}
            className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight"
          >
            Ready to Grow?{" "}
            <span className="text-gradient">Let&apos;s Talk.</span>
          </motion.h2>

          {/* Glowing line */}
          <motion.div variants={childVariant} className="flex justify-center mb-6">
            <div className="h-px w-40"
              style={{ background: "linear-gradient(90deg, transparent, #E86010, transparent)", boxShadow: "0 0 20px rgba(232,96,16,0.5)" }} />
          </motion.div>

          <motion.p variants={childVariant} className="text-white/55 text-lg mb-10 max-w-2xl mx-auto">
            Contact us today and discover what BVN can do for your business.
          </motion.p>

          <motion.div variants={childVariant} className="mb-8">
            <GlowButton href="/contact" variant="filled" showArrow
              className="text-base px-8 py-4 neon-glow">
              Book a Free Consultation
            </GlowButton>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/50"
          >
            <a href="mailto:bvn@bvnofficial.com"
              className="flex items-center gap-2 hover:text-orange transition-colors duration-200 group">
              <div className="w-7 h-7 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center group-hover:border-orange/50 transition-colors">
                <Mail size={13} className="text-orange" />
              </div>
              <span className="text-sm">bvn@bvnofficial.com</span>
            </a>
            <a href="tel:+639816556555"
              className="flex items-center gap-2 hover:text-orange transition-colors duration-200 group">
              <div className="w-7 h-7 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center group-hover:border-orange/50 transition-colors">
                <Phone size={13} className="text-orange" />
              </div>
              <span className="text-sm">+63 981 655 6555</span>
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION 5: FAQ (visible + FAQPage schema for AI search) ──── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqSchema(homeFaqs))}
      />
      <ServiceFAQ faqs={homeFaqs} accent="orange" heading="Frequently Asked Questions" />
    </>
  );
}
