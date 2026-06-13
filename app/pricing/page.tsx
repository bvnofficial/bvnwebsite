"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Minus, Info, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import PricingCard from "@/components/ui/PricingCard";
import GlowButton from "@/components/ui/GlowButton";
import HeroSection from "@/components/ui/HeroSection";

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

// ── Marketing Plans ───────────────────────────────────────
const marketingPlans = [
  {
    tier: "STARTER",
    price: "$500",
    isPopular: false,
    ctaLabel: "Get Started",
    ctaHref: "/payments?description=Marketing+Starter+Plan+%28%24500%2Fmo%29&plan=Marketing+STARTER&amount=500",
    features: [
      { label: "Platforms", value: "2" },
      { label: "Posts/Month", value: "12" },
      { label: "Content", value: "Basic graphics" },
      { label: "Community Mgmt", value: true },
      { label: "SEO", value: "On-page basics" },
      { label: "Email Marketing", value: "—" },
      { label: "Paid Ads", value: "—" },
      { label: "Blog Posts", value: "—" },
      { label: "Video Marketing", value: "—" },
      { label: "Influencer Mgmt", value: "—" },
      { label: "CRM Consultation", value: "—" },
      { label: "Monthly Report", value: true },
      { label: "Account Manager", value: "Shared" },
      { label: "Support", value: "Business hours" },
    ],
  },
  {
    tier: "GROWTH",
    price: "$1,200",
    isPopular: true,
    ctaLabel: "Get Started",
    ctaHref: "/payments?description=Marketing+Growth+Plan+%28%241%2C200%2Fmo%29&plan=Marketing+GROWTH&amount=1200",
    features: [
      { label: "Platforms", value: "4" },
      { label: "Posts/Month", value: "20" },
      { label: "Content", value: "Advanced creative" },
      { label: "Community Mgmt", value: true },
      { label: "SEO", value: "Full SEO" },
      { label: "Email Marketing", value: "2 campaigns/mo" },
      { label: "Paid Ads", value: "Up to $1,000" },
      { label: "Blog Posts", value: "2/mo" },
      { label: "Video Marketing", value: "—" },
      { label: "Influencer Mgmt", value: "—" },
      { label: "CRM Consultation", value: "—" },
      { label: "Monthly Report", value: true },
      { label: "Account Manager", value: "Shared" },
      { label: "Support", value: "Priority" },
    ],
  },
  {
    tier: "PRO",
    price: "$2,500",
    isPopular: false,
    ctaLabel: "Get Started",
    ctaHref: "/payments?description=Marketing+Pro+Plan+%28%242%2C500%2Fmo%29&plan=Marketing+PRO&amount=2500",
    features: [
      { label: "Platforms", value: "6+" },
      { label: "Posts/Month", value: "30+" },
      { label: "Content", value: "Premium production" },
      { label: "Community Mgmt", value: true },
      { label: "SEO", value: "Advanced + Link Building" },
      { label: "Email Marketing", value: "8 campaigns/mo" },
      { label: "Paid Ads", value: "Up to $3,000" },
      { label: "Blog Posts", value: "4/mo" },
      { label: "Video Marketing", value: "2 short videos/mo" },
      { label: "Influencer Mgmt", value: true },
      { label: "CRM Consultation", value: true },
      { label: "Monthly Report", value: true },
      { label: "Account Manager", value: "Dedicated" },
      { label: "Support", value: "24/7 Priority" },
    ],
  },
];

// ── Web Dev Pricing ───────────────────────────────────────
const webDevServices = [
  { service: "Landing Page", from: "$300", to: "$600", timeline: "5–7 days" },
  {
    service: "Basic Website (5 pages)",
    from: "$800",
    to: "$1,500",
    timeline: "2–3 weeks",
  },
  {
    service: "Business Website (10+ pages)",
    from: "$1,500",
    to: "$3,000",
    timeline: "3–5 weeks",
  },
  {
    service: "E-commerce Website",
    from: "$2,500",
    to: "$5,000",
    timeline: "4–8 weeks",
  },
  {
    service: "WordPress Maintenance",
    from: "$100/mo",
    to: "$200/mo",
    timeline: "Ongoing",
  },
  {
    service: "Mobile App (Basic)",
    from: "$3,000",
    to: "$8,000",
    timeline: "8–14 weeks",
  },
  {
    service: "Custom Web Application",
    from: "$5,000",
    to: "$15,000+",
    timeline: "12–24 weeks",
  },
  {
    service: "App Maintenance",
    from: "$200/mo",
    to: "$500/mo",
    timeline: "Ongoing",
  },
];

// ── Operations Plans ──────────────────────────────────────
const operationsPlans = [
  {
    tier: "STARTER",
    price: "$600",
    isPopular: false,
    ctaLabel: "Get Started",
    ctaHref: "/payments?description=Operations+Starter+Plan+%28%24600%2Fmo%29&plan=Operations+STARTER&amount=600",
    features: [
      { label: "CRM", value: "Basic (2 pipelines)" },
      { label: "AI Agents", value: "—" },
      { label: "HR & Payroll", value: "—" },
      { label: "Payroll Processing", value: "—" },
      { label: "Workflows", value: "2" },
      { label: "Time & Location Tracking", value: "—" },
      { label: "Admin Automation", value: "Email + scheduling" },
      { label: "Reporting", value: "Monthly" },
      { label: "Integrations", value: "Up to 3" },
      { label: "Support", value: "Email" },
      { label: "System Monitoring", value: "—" },
      { label: "Custom Workflow Dev", value: "—" },
    ],
  },
  {
    tier: "GROWTH",
    price: "$1,400",
    isPopular: true,
    ctaLabel: "Get Started",
    ctaHref: "/payments?description=Operations+Growth+Plan+%28%241%2C400%2Fmo%29&plan=Operations+GROWTH&amount=1400",
    features: [
      { label: "CRM", value: "Advanced (5 pipelines)" },
      { label: "AI Agents", value: "1 agent" },
      { label: "HR & Payroll", value: true },
      { label: "Payroll Processing", value: "Up to 20 employees" },
      { label: "Workflows", value: "5" },
      { label: "Time & Location Tracking", value: true },
      { label: "Admin Automation", value: "Full admin suite" },
      { label: "Reporting", value: "Weekly" },
      { label: "Integrations", value: "Up to 8" },
      { label: "Support", value: "Priority email" },
      { label: "System Monitoring", value: true },
      { label: "Custom Workflow Dev", value: "—" },
    ],
  },
  {
    tier: "PRO",
    price: "$3,000",
    isPopular: false,
    ctaLabel: "Get Started",
    ctaHref: "/payments?description=Operations+Pro+Plan+%28%243%2C000%2Fmo%29&plan=Operations+PRO&amount=3000",
    features: [
      { label: "CRM", value: "Enterprise (unlimited)" },
      { label: "AI Agents", value: "Up to 3 agents" },
      { label: "HR & Payroll", value: true },
      { label: "Payroll Processing", value: "Unlimited" },
      { label: "Workflows", value: "Unlimited" },
      { label: "Time & Location Tracking", value: true },
      { label: "Admin Automation", value: "Premium + custom" },
      { label: "Reporting", value: "Real-time dashboard" },
      { label: "Integrations", value: "Unlimited" },
      { label: "Support", value: "Dedicated manager" },
      { label: "System Monitoring", value: true },
      { label: "Custom Workflow Dev", value: true },
    ],
  },
];

// ── VA Hourly Rates ───────────────────────────────────────
const vaRates = [
  { type: "General / Admin VA", rate: "$8–$12/hr" },
  { type: "Customer Support VA", rate: "$9–$14/hr" },
  { type: "Social Media Manager VA", rate: "$12–$18/hr" },
  { type: "Executive Assistant", rate: "$15–$22/hr" },
  { type: "Research & Content VA", rate: "$10–$16/hr" },
  { type: "HR & Recruitment VA", rate: "$12–$18/hr" },
];

const vaPackages = [
  { name: "Trial", hours: "20 hrs/mo", price: "$200–$350" },
  { name: "Part-Time", hours: "80 hrs/mo", price: "$800–$1,400" },
  { name: "Full-Time", hours: "160 hrs/mo", price: "$1,600–$2,800+" },
];

// Builds a prefilled link to the unified payment page (PayMongo / PayPal / Crypto).
function payHref(plan: string, description: string, amount?: string) {
  const params = new URLSearchParams({ plan, description });
  if (amount) params.set("amount", amount);
  return `/payments?${params.toString()}`;
}

// Pulls the first whole number out of a price string, e.g. "$1,500" -> "1500".
function firstNumber(s: string) {
  const m = s.replace(/,/g, "").match(/\d+/);
  return m ? m[0] : "";
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 flex items-start gap-3 bg-orange/5 border border-orange/20 rounded-xl p-4">
      <Info size={16} className="text-orange shrink-0 mt-0.5" />
      <p className="text-white/60 text-sm">{children}</p>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroSection
        badge="Transparent Pricing"
        headline="Simple, Clear Pricing. No Surprises."
        subtext="Choose the plan that fits your business. All packages are flexible, scalable, and backed by our full team of specialists."
        primaryCta={{ label: "Get a Custom Quote", href: "/contact" }}
        secondaryCta={{ label: "Learn About Services", href: "/marketing" }}
      />

      {/* ── Section 1: Marketing Plans ───────────────────── */}
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
            label="Marketing Plans"
            title="Marketing Automation Plans"
            subtitle="Monthly retainer packages for social media, SEO, content, and more."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {marketingPlans.map((plan) => (
              <motion.div key={plan.tier} variants={childVariant}>
                <PricingCard {...plan} />
              </motion.div>
            ))}
          </motion.div>

          <Note>
            ★ All packages require a minimum 3-month commitment. One-time setup
            fee of $150 (waived for Pro plan).
          </Note>
        </div>
      </motion.section>

      {/* ── Section 2: Web & App Dev ──────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Web & App Development"
            title="Project-Based Development"
            subtitle="One-time project rates for websites and applications — built to convert and built to scale."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="overflow-hidden rounded-2xl border border-white/10"
          >
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-5 bg-white/8 border-b border-white/10 px-6 py-4">
              {["Service", "Starting From", "Up To", "Timeline", ""].map((h, hi) => (
                <span
                  key={hi}
                  className="font-heading font-bold text-white/70 text-xs uppercase tracking-widest"
                >
                  {h}
                </span>
              ))}
            </div>

            {webDevServices.map(({ service, from, to, timeline }, i) => (
              <motion.div
                key={service}
                variants={childVariant}
                className={`grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-0 px-6 py-5 border-b border-white/5
                  hover:bg-white/5 transition-colors items-center ${i % 2 === 0 ? "bg-white/2" : ""}`}
              >
                <div className="font-heading font-semibold text-white text-sm md:text-base">
                  {service}
                </div>
                <div className="flex md:block items-center gap-2">
                  <span className="text-white/30 text-xs md:hidden">From:</span>
                  <span className="text-orange font-heading font-bold">
                    {from}
                  </span>
                </div>
                <div className="flex md:block items-center gap-2">
                  <span className="text-white/30 text-xs md:hidden">Up to:</span>
                  <span className="text-orange-light font-semibold">{to}</span>
                </div>
                <div className="flex md:block items-center gap-2">
                  <span className="text-white/30 text-xs md:hidden">
                    Timeline:
                  </span>
                  <span className="text-white/55 text-sm">{timeline}</span>
                </div>
                <div className="md:text-right">
                  <Link
                    href={payHref(service, `${service} — Project Deposit`, firstNumber(from))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange/10 border border-orange/30
                      text-orange text-xs font-heading font-bold hover:bg-orange hover:text-white transition-all"
                  >
                    Get Started <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <Note>
            ★ 50% deposit required to begin all projects. Balance due upon
            delivery. Prices vary based on complexity and requirements. The
            “Get Started” button opens secure checkout (GCash · Card · PayPal · Crypto).
          </Note>
        </div>
      </motion.section>

      {/* ── Section 3: Operations Plans ──────────────────── */}
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
            label="Operations Plans"
            title="Operations Automation Plans"
            subtitle="Monthly automation packages for CRM, HR, AI agents, and full business process automation."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {operationsPlans.map((plan) => (
              <motion.div key={plan.tier} variants={childVariant}>
                <PricingCard {...plan} />
              </motion.div>
            ))}
          </motion.div>

          <Note>
            ★ One-time system audit & setup fee of $200 (waived for Pro plan).
            All plans include onboarding and documentation.
          </Note>
        </div>
      </motion.section>

      {/* ── Section 4: VA Services ────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Virtual Assistant Services"
            title="Skilled Filipino Virtual Assistants"
            subtitle="Skilled, English-proficient Filipino virtual assistants — vetted, trained, and managed by our team."
            centered
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hourly Rates */}
            <motion.div
              variants={childVariant}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                <h3 className="font-heading font-bold text-white">
                  Hourly Rates
                </h3>
              </div>
              <div className="divide-y divide-white/5">
                {vaRates.map(({ type, rate }, i) => (
                  <motion.div
                    key={type}
                    variants={childVariant}
                    className={`flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors
                      ${i % 2 === 0 ? "bg-white/2" : ""}`}
                  >
                    <span className="text-white/70 text-sm">{type}</span>
                    <span className="font-heading font-bold text-orange text-sm">
                      {rate}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Monthly Packages */}
            <motion.div variants={childVariant} className="flex flex-col gap-4">
              <h3 className="font-heading font-bold text-white text-lg mb-2">
                Monthly Packages
              </h3>
              {vaPackages.map(({ name, hours, price }) => (
                <Link
                  key={name}
                  href={payHref(`VA — ${name}`, `Virtual Assistant — ${name} (${hours})`, firstNumber(price))}
                  className="group flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-6 py-5
                    hover:border-orange/30 hover:bg-white/8 transition-all"
                >
                  <div>
                    <div className="font-heading font-bold text-white mb-1">
                      {name}
                    </div>
                    <div className="text-white/45 text-sm">{hours}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-heading font-extrabold text-xl text-gradient">
                      {price}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-white/40 group-hover:text-orange text-xs transition-colors">
                      Reserve <ArrowRight size={11} />
                    </div>
                  </div>
                </Link>
              ))}

              {/* VA Feature Highlights */}
              <div className="mt-2 bg-orange/5 border border-orange/20 rounded-xl p-5">
                <h4 className="font-heading font-bold text-white text-sm mb-3">
                  All VAs Include:
                </h4>
                <ul className="space-y-2">
                  {[
                    "English-proficient, college-educated professionals",
                    "Fully vetted and background-checked",
                    "Trained and onboarded by BVN",
                    "Managed and supervised by our team",
                    "Available in your timezone",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check size={13} className="text-orange shrink-0" />
                      <span className="text-white/65">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
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
            Not sure which plan is right for you?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Book a free consultation and we&apos;ll build a custom package
            tailored to your business goals and budget.
          </p>
          <GlowButton
            href="/contact"
            variant="filled"
            showArrow
            className="text-base px-8 py-4"
          >
            Book a Free Consultation
          </GlowButton>
        </div>
      </motion.section>
    </>
  );
}
