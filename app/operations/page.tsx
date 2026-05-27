"use client";

import { motion } from "framer-motion";
import {
  Bot,
  GitBranch,
  Users,
  Workflow,
  MapPin,
  ClipboardList,
  BarChart2,
  Plug,
  Clock,
  DollarSign,
  TrendingUp,
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
    icon: GitBranch,
    title: "CRM & Sales Automation",
    href: "/operations/crm-automation",
    description:
      "Deploy powerful CRM systems tailored to your workflows — track leads, manage client relationships, automate follow-ups, and gain full sales pipeline visibility.",
  },
  {
    icon: Bot,
    title: "AI Agents & Intelligent Automation",
    href: "/operations/ai-agents",
    description:
      "Leverage cutting-edge AI agents to handle customer inquiries, automate repetitive tasks, generate reports, and make intelligent decisions 24/7.",
  },
  {
    icon: Users,
    title: "HR & Payroll Automation",
    href: "/operations/hr-payroll",
    description:
      "Streamline your entire HR cycle — from onboarding and attendance tracking to automated payroll processing, leave management, and compliance reporting.",
  },
  {
    icon: Workflow,
    title: "Operations Automation",
    href: "/operations/operations-automation",
    description:
      "Map, digitize, and automate your core business processes — purchase orders, approvals, inventory management, and task workflows.",
  },
  {
    icon: MapPin,
    title: "Time & Location Tracking",
    href: "/operations/time-tracking",
    description:
      "Real-time employee time tracking and GPS-based location monitoring for accurate attendance and remote workforce management.",
  },
  {
    icon: ClipboardList,
    title: "Admin Automation",
    href: "/operations/admin-automation",
    description:
      "Automate document generation, email responses, scheduling, data entry, and reporting — saving hours every week.",
  },
  {
    icon: BarChart2,
    title: "Reporting & Analytics",
    href: "/operations/analytics",
    description:
      "Real-time dashboards and custom reports that give you complete visibility into your business performance and team productivity.",
  },
  {
    icon: Plug,
    title: "System Integrations",
    href: "/operations/integrations",
    description:
      "Connect your existing tools — from accounting to e-commerce — into one seamless, automated ecosystem.",
  },
];

const advantages = [
  {
    icon: Clock,
    emoji: "⏱",
    title: "Save Time",
    description:
      "Eliminate manual work and free your team for high-value tasks. Automation handles the repetitive so your people can focus on what matters.",
  },
  {
    icon: DollarSign,
    emoji: "💰",
    title: "Cut Costs",
    description:
      "Reduce operational overhead with intelligent automation systems. Less manual labor means lower costs and fewer errors.",
  },
  {
    icon: TrendingUp,
    emoji: "📈",
    title: "Scale Faster",
    description:
      "Systems that grow with your business, no limits. Automation removes the bottlenecks that hold growing teams back.",
  },
];

export default function OperationsPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroSection
        badge="BVN Operations Automation"
        headline="Work Smarter. Scale Faster. Automate Everything."
        subtext="BVN Business Operations Automation transforms how your company works — replacing manual processes with intelligent systems that run automatically, accurately, and at scale."
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
            label="Automation Services"
            title="Automate Every Corner of Your Business"
            subtitle="From CRM and HR to AI agents and analytics — BVN Operations replaces manual work with intelligent, scalable systems."
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

      {/* ── Automation Advantage ─────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="The Automation Advantage"
            title="Why Businesses Choose to Automate"
            subtitle="Companies that automate gain a significant edge — faster execution, lower costs, and the ability to scale without limits."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {advantages.map(({ emoji, title, description }) => (
              <motion.div
                key={title}
                variants={childVariant}
                whileHover={{ y: -6, boxShadow: "0 0 32px rgba(232,96,16,0.2)" }}
                transition={{ duration: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center
                  hover:border-orange/40 transition-colors"
              >
                <div className="text-5xl mb-5">{emoji}</div>
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

      {/* ── How It Works ─────────────────────────────────── */}
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
            label="How We Work"
            title="From Audit to Automation"
            subtitle="Our proven 3-step process ensures every system we build fits your business perfectly."
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
                title: "Business Audit",
                description:
                  "We map your current workflows, identify bottlenecks, and pinpoint exactly where automation will deliver the highest impact.",
              },
              {
                step: "02",
                title: "System Design & Build",
                description:
                  "Our specialists design and build custom automation systems — CRM, HR, AI agents, integrations — tailored to your exact needs.",
              },
              {
                step: "03",
                title: "Launch, Train & Support",
                description:
                  "We deploy your systems, train your team, and provide ongoing support to ensure your automations run flawlessly.",
              },
            ].map(({ step, title, description }) => (
              <motion.div
                key={step}
                variants={childVariant}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6
                  hover:border-blue-400/30 hover:shadow-[0_0_24px_rgba(96,165,250,0.1)] transition-all"
              >
                <span className="font-heading font-extrabold text-5xl text-blue-500/15 absolute top-4 right-6">
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
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(232,96,16,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.h2
            variants={childVariant}
            className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5 leading-tight"
          >
            Let&apos;s Automate Your Business.
          </motion.h2>
          <motion.p
            variants={childVariant}
            className="text-white/60 text-lg mb-10"
          >
            Ready to eliminate manual work and scale with confidence? Let&apos;s
            build your automation stack.
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
