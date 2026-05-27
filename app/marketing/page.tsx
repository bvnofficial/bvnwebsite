"use client";

import { motion } from "framer-motion";
import {
  Share2,
  BarChart3,
  Search,
  Mail,
  FileText,
  Video,
  Users,
  Globe,
  Smartphone,
  Database,
} from "lucide-react";
import HeroSection from "@/components/ui/HeroSection";
import ServiceCard from "@/components/ui/ServiceCard";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowButton from "@/components/ui/GlowButton";

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const childVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const services = [
  {
    icon: Share2,
    title: "Social Media Management",
    href: "/marketing/social-media-management",
    description:
      "We manage your entire social presence — content creation, scheduling, community engagement, and analytics across Facebook, Instagram, TikTok, LinkedIn, and more.",
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    href: "/marketing/digital-marketing",
    description:
      "Data-driven campaigns across Google Ads, Meta Ads, and programmatic platforms targeting the right audience to maximize ROI.",
  },
  {
    icon: Search,
    title: "Search Engine Optimization (SEO)",
    href: "/marketing/seo",
    description:
      "Dominate search rankings with proven SEO strategies — keyword research, on-page optimization, link building, and technical SEO.",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    href: "/marketing/email-marketing",
    description:
      "Automated email sequences, newsletters, and drip campaigns that nurture leads and turn subscribers into customers.",
  },
  {
    icon: FileText,
    title: "Content Marketing",
    href: "/marketing/content-marketing",
    description:
      "Strategic content that educates, entertains, and converts — blog posts, infographics, case studies, and thought leadership pieces.",
  },
  {
    icon: Video,
    title: "Video Marketing",
    href: "/marketing/video-marketing",
    description:
      "From short-form reels to full brand videos — compelling visual content that captures attention and drives engagement.",
  },
  {
    icon: Users,
    title: "Creator & Influencer Marketing",
    href: "/marketing/influencer-marketing",
    description:
      "Connect with the right creators to expand your reach, build credibility, and drive authentic engagement.",
  },
  {
    icon: Globe,
    title: "Web Development",
    href: "/marketing/web-development",
    description:
      "Beautiful, fast, conversion-optimized websites on WordPress and modern tech stacks — designed to turn visitors into customers.",
  },
  {
    icon: Smartphone,
    title: "App Development",
    href: "/marketing/app-development",
    description:
      "Custom mobile and web applications from concept to launch — built to scale with your business needs.",
  },
  {
    icon: Database,
    title: "CRM Solutions",
    href: "/marketing/crm-solutions",
    description:
      "Implement and optimize CRM systems that streamline your sales pipeline and improve client retention.",
  },
];

export default function MarketingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroSection
        badge="BVN Marketing Automation"
        headline="Amplify Your Brand. Accelerate Your Growth."
        subtext="BVN Marketing is your all-in-one digital marketing powerhouse — combining creative strategy, data-driven execution, and smart automation to grow your brand at scale."
        primaryCta={{ label: "Book a Consultation", href: "/contact" }}
        secondaryCta={{ label: "View Pricing", href: "/pricing" }}
      />

      {/* ── Services Grid ────────────────────────────────── */}
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
            label="Marketing Services"
            title="Everything Your Brand Needs to Win"
            subtitle="From social media and SEO to video production and web development — we cover every channel with precision and creativity."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {services.map((service) => (
              <motion.div key={service.title} variants={childVariant}>
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  href={service.href}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Why BVN Marketing ────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Our Approach"
            title="Strategy + Creativity + Data"
            subtitle="Every campaign we run is grounded in insights, driven by creativity, and optimized for results."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                step: "01",
                title: "Discovery & Strategy",
                description:
                  "We audit your current digital presence, analyze competitors, define your target audience, and build a tailored marketing roadmap.",
              },
              {
                step: "02",
                title: "Creative Execution",
                description:
                  "Our team produces high-quality content, runs precision ad campaigns, and manages your community across all platforms.",
              },
              {
                step: "03",
                title: "Optimize & Scale",
                description:
                  "We track every metric, run A/B tests, and continuously optimize to maximize ROI and scale what works.",
              },
            ].map(({ step, title, description }) => (
              <motion.div
                key={step}
                variants={childVariant}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6
                  hover:border-orange/30 hover:shadow-[0_0_24px_rgba(232,96,16,0.15)] transition-all"
              >
                <span className="font-heading font-extrabold text-5xl text-orange/15 absolute top-4 right-6">
                  {step}
                </span>
                <h3 className="font-heading font-bold text-white text-xl mb-3">
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
        className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5"
        style={{
          background:
            "linear-gradient(135deg, #0A0F1E 0%, #1B3060 50%, #0A0F1E 100%)",
        }}
      >
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

        {/* Orange glow blob */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(232,96,16,0.15) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.h2
            variants={childVariant}
            className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5 leading-tight"
          >
            Let&apos;s Build Your Brand Together.
          </motion.h2>
          <motion.p
            variants={childVariant}
            className="text-white/60 text-lg mb-10"
          >
            Ready to elevate your marketing? Book a free consultation and
            let&apos;s talk about what&apos;s possible.
          </motion.p>
          <motion.div
            variants={childVariant}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <GlowButton href="/contact" variant="filled" showArrow className="text-base px-8 py-4">
              Book a Free Consultation
            </GlowButton>
            <GlowButton href="/pricing" variant="outline">
              View Pricing
            </GlowButton>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
