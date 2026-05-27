"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  TrendingUp,
  ShieldCheck,
  Heart,
  Megaphone,
  Settings2,
} from "lucide-react";
import HeroSection from "@/components/ui/HeroSection";
import SectionHeader from "@/components/ui/SectionHeader";
import BranchCard from "@/components/ui/BranchCard";
import GlowButton from "@/components/ui/GlowButton";

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const childVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const coreValues = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We embrace emerging technologies and creative thinking to deliver solutions that stay ahead of the curve.",
  },
  {
    icon: TrendingUp,
    title: "Results",
    description:
      "Every strategy, campaign, and automation we build is measured against one benchmark: tangible business outcomes.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "We operate with transparency and honesty in every engagement — building partnerships built on trust.",
  },
  {
    icon: Heart,
    title: "Client-First",
    description:
      "Our clients' growth is our success. We go beyond deliverables to become a true extension of your team.",
  },
];

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

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroSection
        badge="About BVN"
        headline="Built to Move Businesses Forward."
        subtext="BVN is a Philippines-based digital agency built for the modern business. From startups to enterprises, we empower brands to grow their digital presence and streamline their operations."
      />

      {/* ── About Block ──────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative py-24 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5"
      >
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-50" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block font-accent font-semibold text-xs tracking-[0.2em] uppercase text-orange mb-4 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20">
                Who We Are
              </span>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-6 leading-tight">
                Your All-in-One Growth Partner
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-5">
                BVN is a Philippines-based digital agency built for the modern
                business. From startups to enterprises, we empower brands to
                grow their digital presence and streamline their operations.
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-8">
                With two powerful service branches — Marketing Automation and
                Operations Automation — we bring together the full spectrum of
                digital capabilities your business needs to compete and win in
                today&apos;s fast-paced environment.
              </p>
              <GlowButton href="/contact" variant="filled" showArrow>
                Work With Us
              </GlowButton>
            </div>

            {/* Stats block */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "100+", label: "Clients Served" },
                { number: "2", label: "Service Branches" },
                { number: "10+", label: "Marketing Services" },
                { number: "8+", label: "Automation Services" },
              ].map(({ number, label }) => (
                <div
                  key={label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center
                    hover:border-orange/30 transition-colors"
                >
                  <div className="font-heading font-extrabold text-4xl text-gradient mb-2">
                    {number}
                  </div>
                  <p className="text-white/55 text-sm font-accent">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Mission & Vision ─────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Our Purpose"
            title="Mission & Vision"
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Mission */}
            <motion.div
              variants={childVariant}
              className="relative bg-white/5 border border-orange/25 rounded-2xl p-8
                hover:border-orange/50 hover:shadow-[0_0_30px_rgba(232,96,16,0.15)] transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-2xl opacity-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-bl from-orange to-transparent" />
              </div>
              <span className="font-accent font-semibold text-xs tracking-[0.2em] uppercase text-orange mb-3 block">
                Our Mission
              </span>
              <h3 className="font-heading font-bold text-white text-2xl mb-4">
                Empower Every Business
              </h3>
              <p className="text-white/60 leading-relaxed">
                To empower businesses of every size with world-class marketing
                solutions and intelligent automation systems — enabling them to
                compete, grow, and thrive in the digital economy without limits.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              variants={childVariant}
              className="relative bg-white/5 border border-blue-500/25 rounded-2xl p-8
                hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-2xl opacity-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-bl from-blue-500 to-transparent" />
              </div>
              <span className="font-accent font-semibold text-xs tracking-[0.2em] uppercase text-blue-400 mb-3 block">
                Our Vision
              </span>
              <h3 className="font-heading font-bold text-white text-2xl mb-4">
                Philippines&apos; Most Trusted Agency
              </h3>
              <p className="text-white/60 leading-relaxed">
                To become the Philippines&apos; most trusted all-in-one digital
                agency — known for innovation, integrity, and measurable results
                that transform businesses and create lasting value for our
                clients.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Two Branches ─────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative py-24 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5"
      >
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-50" />
        <div className="relative max-w-7xl mx-auto">
          <SectionHeader
            label="Our Divisions"
            title="Two Branches. Unlimited Potential."
            subtitle="Each branch is purpose-built with dedicated specialists, tools, and systems."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <BranchCard
              icon={Megaphone}
              title="Marketing Automation"
              tagline="Amplify Your Brand. Accelerate Your Growth."
              services={marketingServices}
              ctaLabel="Explore Marketing"
              ctaHref="/marketing"
              variant="marketing"
            />
            <BranchCard
              icon={Settings2}
              title="Operations Automation"
              tagline="Work Smarter. Scale Faster. Automate Everything."
              services={operationsServices}
              ctaLabel="Explore Operations"
              ctaHref="/operations"
              variant="operations"
            />
          </div>
        </div>
      </motion.section>

      {/* ── Core Values ──────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Core Values"
            title="What Drives Everything We Do"
            subtitle="Our values aren't just words on a wall — they're the principles behind every decision and delivery."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {coreValues.map(({ icon: ValueIcon, title, description }) => (
              <motion.div
                key={title}
                variants={childVariant}
                whileHover={{ y: -6, boxShadow: "0 0 32px rgba(232,96,16,0.2)" }}
                transition={{ duration: 0.2 }}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 text-center
                  hover:border-orange/40 transition-colors"
              >
                <div
                  className="w-14 h-14 rounded-2xl bg-orange/10 border border-orange/20 flex items-center
                    justify-center mx-auto mb-5 group-hover:bg-orange/20 group-hover:border-orange/40 transition-colors"
                >
                  <ValueIcon size={26} className="text-orange" />
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-3">
                  {title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

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
            Ready to work with BVN?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Let&apos;s build something great together.
          </p>
          <GlowButton href="/contact" variant="filled" showArrow className="text-base px-8 py-4">
            Get in Touch
          </GlowButton>
        </div>
      </motion.section>
    </>
  );
}
