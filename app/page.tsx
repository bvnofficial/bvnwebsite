"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Megaphone,
  Settings2,
  Wrench,
  Bot,
  Target,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import HeroSection from "@/components/ui/HeroSection";
import BranchCard from "@/components/ui/BranchCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowButton from "@/components/ui/GlowButton";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
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
  { icon: Wrench, label: "Everything You Need" },
  { icon: Bot, label: "Smart Technology" },
  { icon: Target, label: "Results-Driven" },
  { icon: Users, label: "Proven Expertise" },
];

export default function HomePage() {
  // Default true to prevent server/client flash — corrected on mount
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
      {/* ── Entrance overlay — shown once per session ───── */}
      {!hasEntered && <ParticleTextEffect onEnter={handleEnter} />}

      {/* ── SECTION 1: Hero ─────────────────────────────── */}
      <HeroSection
        headline="Elevate Your Business. Dominate Your Market."
        subtext="BVN is your all-in-one growth partner — combining high-impact marketing strategies with intelligent business automation to help you scale faster, smarter, and stronger."
        primaryCta={{ label: "Explore Marketing", href: "/marketing" }}
        secondaryCta={{ label: "Explore Operations", href: "/operations" }}
      />

      {/* ── SECTION 2: Two Branches ──────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative bg-navy-dark border-t border-white/5 py-24 px-6 md:px-12 lg:px-24"
      >
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-60" />
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

      {/* ── SECTION 3: Why BVN ──────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Why BVN"
            title="Numbers That Speak<br/>for Themselves"
            subtitle="We've delivered results for businesses across industries — from startups to established enterprises."
            centered
          />

          {/* Stats Row */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {[
              { target: 100, suffix: "+", label: "Clients Served" },
              { target: 2, suffix: "", label: "Powerful Branches" },
              { target: 10, suffix: "+", label: "Marketing Services" },
              { target: 8, suffix: "+", label: "Automation Services" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={childVariant}>
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {featurePills.map(({ icon: PillIcon, label }) => (
              <motion.div
                key={label}
                variants={childVariant}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3
                  hover:border-orange/30 hover:bg-white/8 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                  <PillIcon size={16} className="text-orange" />
                </div>
                <span className="font-accent font-semibold text-white/80 text-sm">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION 4: CTA Banner ────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5"
        style={{
          background:
            "linear-gradient(135deg, #1B3060 0%, #E86010 50%, #F5A623 100%)",
        }}
      >
        {/* Overlay to darken and add texture */}
        <div className="absolute inset-0 bg-navy-dark/50 grid-bg" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.span
            variants={childVariant}
            className="inline-block font-accent font-semibold text-xs tracking-[0.2em] uppercase
              text-orange-light mb-4 px-3 py-1.5 rounded-full bg-white/10 border border-white/20"
          >
            Let&apos;s Grow Together
          </motion.span>

          <motion.h2
            variants={childVariant}
            className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight"
          >
            Ready to Grow?{" "}
            <span className="text-orange-light">Let&apos;s Talk.</span>
          </motion.h2>

          <motion.p
            variants={childVariant}
            className="text-white/80 text-lg mb-10 max-w-2xl mx-auto"
          >
            Contact us today and discover what BVN can do for your business.
          </motion.p>

          <motion.div variants={childVariant} className="mb-8">
            <GlowButton
              href="/contact"
              variant="filled"
              showArrow
              className="text-base px-8 py-4 shadow-[0_0_32px_rgba(232,96,16,0.6)]"
            >
              Book a Free Consultation
            </GlowButton>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={staggerContainer}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/70"
          >
            <a
              href="mailto:bvn@bvnofficial.com"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail size={16} className="text-orange-light" />
              <span className="text-sm">bvn@bvnofficial.com</span>
            </a>
            <a
              href="tel:+639816556555"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone size={16} className="text-orange-light" />
              <span className="text-sm">+63 981 655 6555</span>
            </a>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
