"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Zap,
  Bot,
  BarChart3,
  ShoppingCart,
  Settings2,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle2,
  Briefcase,
  PlayCircle,
  GraduationCap,
  User,
  Award,
  BadgeCheck,
  Download,
  Layers,
  CreditCard,
  Search,
} from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import SectionHeader from "@/components/ui/SectionHeader";

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

const specializations = [
  {
    icon: Zap,
    title: "GoHighLevel & CRM Automation",
    color: "orange",
    items: [
      "Full CRM, pipelines & custom fields",
      "Workflow, email & SMS automation",
      "A2P 10DLC, calendars & booking",
      "Lead routing & nurture sequences",
      "Reporting dashboards & analytics",
      "SOPs, training & clean handoff",
    ],
  },
  {
    icon: Bot,
    title: "AI Chatbots & Automation",
    color: "blue",
    items: [
      "AI chatbots & conversational agents",
      "Prompt engineering & AI agents",
      "Zapier, Make & n8n workflows",
      "CRM & sales automation",
      "Custom automations & integrations",
      "Analytics & reporting dashboards",
    ],
  },
  {
    icon: Layers,
    title: "Modern Web Development",
    color: "purple",
    items: [
      "Next.js / React web applications",
      "Supabase / PostgreSQL backends",
      "WordPress, Duda & WooCommerce",
      "Payment & checkout integrations",
      "APIs & custom internal tools",
      "Cloud deployment on Vercel",
    ],
  },
  {
    icon: BarChart3,
    title: "Marketing & Growth",
    color: "green",
    items: [
      "SEO, AI search & content",
      "Social media & email marketing",
      "Funnels & landing pages",
      "Paid ads & cold outreach",
      "Conversion optimization",
      "Analytics & KPI tracking",
    ],
  },
];

const skills = [
  {
    icon: Code2,
    title: "Web Development",
    pills: ["HTML", "CSS", "JavaScript", "TypeScript", "PHP", "WordPress", "Elementor", "Divi", "Duda", "Responsive Design"],
  },
  {
    icon: Layers,
    title: "Modern Web Stack",
    pills: ["React", "Next.js", "Tailwind CSS", "Node.js", "Python", "Supabase", "PostgreSQL", "Vercel", "REST APIs", "Git"],
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    pills: ["SEO / SEM", "Social Media Mgmt", "Email Marketing", "Cold Email Outreach", "Paid Ads (Google / Meta)", "Content Marketing", "Video Marketing", "Copywriting", "Landing Pages", "Influencer Mktg"],
  },
  {
    icon: Search,
    title: "SEO & AI Search",
    pills: ["Technical SEO", "On-Page SEO", "Local SEO", "Schema / Structured Data", "AI Search Optimization", "Core Web Vitals", "Google Search Console"],
  },
  {
    icon: ShoppingCart,
    title: "CRM & E-Commerce",
    pills: ["GoHighLevel", "HubSpot", "Pipeline Mgmt", "CRM Migration", "A2P 10DLC Compliance", "Lead Nurturing", "Shopify", "WooCommerce"],
  },
  {
    icon: Bot,
    title: "AI & Automation",
    pills: ["AI Chatbots", "AI Agents", "Prompt Engineering", "OpenAI / Claude API", "Zapier", "Make", "n8n", "Workflow Automation"],
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    pills: ["PayMongo", "PayPal", "Stripe", "GCash / QR Ph", "Crypto (USDT / BTC)", "Gusto", "Subscription Billing"],
  },
  {
    icon: Settings2,
    title: "Operations & PM",
    pills: ["Agile / Scrum", "Project Management", "SOP Development", "Client Onboarding", "KPI Tracking", "Process Improvement", "Team Leadership"],
  },
  {
    icon: User,
    title: "Design & Data",
    pills: ["UX / UI Design", "Conversion Optim.", "User Research", "Power BI", "SQL", "Tableau", "System Architecture"],
  },
];

const experience = [
  {
    company: "BVN Digital Marketing Agency",
    role: "Operations & Marketing Manager",
    period: "Jan 2020 – Mar 2026",
    desc: "Managing the company's operational processes, ensuring they are streamlined, cost-effective, and deliver high-quality results. Led WordPress development, GoHighLevel deployments, and AI automation services for 238+ global clients.",
    color: "orange",
  },
  {
    company: "Filipino Creazione De Mano, Inc.",
    role: "Operations & Marketing Manager",
    period: "Mar 2015 – Dec 2019",
    desc: "Managed end-to-end operations including inventory, production coordination, supplier management, and order processing. Built the company's digital presence and online sales channels.",
    color: "blue",
  },
  {
    company: "CreativeB8 Marketing Solutions",
    role: "Operations & Marketing Head",
    period: "Jan 2013 – Feb 2015",
    desc: "Led overall marketing strategy, brand positioning, and client acquisition. Oversaw campaign planning across digital channels, managed the marketing team, and ensured sustained lead generation and growth.",
    color: "green",
  },
];

const certificates = [
  {
    title: "Google Ads Search Certification",
    issuer: "Google",
    logo: "🔍",
    date: "Sep 2024",
    id: "12c99f413",
    color: "blue",
  },
  {
    title: "Inbound Marketing Certified",
    issuer: "HubSpot Academy",
    logo: "🟠",
    date: "Mar 2024",
    color: "orange",
  },
  {
    title: "Basics of Digital Marketing",
    issuer: "Cambridge International Qualifications (CIQ) · UniAthens · FEDE",
    logo: "🎓",
    date: "Apr 2024",
    color: "purple",
  },
  {
    title: "Certified Lean Six Sigma White Belt (CSSWB)",
    issuer: "Six Sigma PH · Minitab · ISSSP",
    logo: "⚡",
    date: "Mar 2024",
    id: "cert_1hIcIlv5",
    color: "green",
  },
  {
    title: "Bachelor of Science in Business Administration",
    issuer: "Saint Francis of Assisi College, Pasay City",
    logo: "🏛️",
    date: "2012",
    color: "orange",
  },
];

const education = [
  {
    icon: GraduationCap,
    degree: "BS in Business Management (Marketing)",
    school: "St. Francis of Assisi College, Las Piñas",
    year: "2008 – 2012",
  },
  {
    icon: GraduationCap,
    degree: "BS in Information Technology",
    school: "Informatics College, Alabang",
    year: "2004 – 2008",
  },
];

const colorMap: Record<string, string> = {
  orange: "border-orange/30 hover:border-orange/60 hover:shadow-[0_0_30px_rgba(232,96,16,0.15)]",
  blue: "border-blue-500/30 hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  purple: "border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
  green: "border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
};

const iconColorMap: Record<string, string> = {
  orange: "text-orange bg-orange/10 border-orange/20 group-hover:bg-orange/20",
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20",
  green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20",
};

const labelColorMap: Record<string, string> = {
  orange: "text-orange",
  blue: "text-blue-400",
  purple: "text-purple-400",
  green: "text-emerald-400",
};

const dotColorMap: Record<string, string> = {
  orange: "bg-orange shadow-[0_0_0_3px_rgba(232,96,16,0.3)]",
  blue: "bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.3)]",
  green: "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.3)]",
};

export default function BenjaminYsonPage() {
  return (
    <>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 px-6 md:px-12 lg:px-24 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-orange/8 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-blue-500/8 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 font-accent font-semibold text-xs tracking-[0.2em] uppercase text-orange mb-5 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available for Remote Work
            </div>

            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-2">
              Benjamin{" "}
              <span className="text-gradient">Vincent</span>{" "}
              Yson
            </h1>
            <p className="font-accent font-semibold text-xs tracking-[0.2em] uppercase text-white/40 mb-5">
              GOHIGHLEVEL · AI AUTOMATION · MODERN WEB
            </p>
            <p className="text-white/60 text-base leading-relaxed mb-7 max-w-xl">
              22+ years of cross-functional expertise in web development, digital marketing,
              and business automation. Specializing in GoHighLevel CRM automation, AI chatbots,
              and modern web applications for businesses that want to scale.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {["WordPress", "GoHighLevel (GHL)", "Next.js / React", "Supabase", "AI Chatbots", "Funnels & Automations", "CRM Setup", "SEO / SEM", "AI Automation", "E-Commerce"].map((tag) => (
                <span
                  key={tag}
                  className="bg-white/5 border border-white/10 text-white/70 px-3 py-1 rounded-full text-xs font-accent font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              <GlowButton href="#contact" variant="filled" showArrow>
                Let&apos;s Work Together
              </GlowButton>
              <a
                href="/benjamin-yson-cv.pdf"
                download="Benjamin-Yson-CV.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-heading font-semibold text-sm border border-white/30 text-white hover:bg-white/10 hover:border-white/50 active:scale-95 transition-all duration-200"
              >
                <Download size={15} /> Download CV
              </a>
              <a
                href="/intro"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-heading font-semibold text-sm border border-orange/40 text-orange hover:bg-orange/10 hover:border-orange/70 active:scale-95 transition-all duration-200"
              >
                <PlayCircle size={15} /> Watch Intro
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { num: "22+", label: "Years Exp." },
                { num: "238+", label: "Clients Served" },
                { num: "3", label: "Companies Led" },
              ].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <div className="font-heading font-extrabold text-3xl text-gradient">{num}</div>
                  <div className="font-accent text-xs text-white/40 uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="hidden lg:flex flex-col gap-4"
          >
            {[
              { label: "Currently Excels In", value: "GoHighLevel + AI Automation", sub: "CRM · Chatbots · Web Apps · Automations", delay: 0 },
              { label: "Latest Role", value: "Operations & Marketing Manager", sub: "Digital Agency · Jan 2020 – Mar 2026", delay: 0.8 },
              { label: "Location", value: "Las Piñas, Philippines 🇵🇭", sub: "Available for remote work worldwide", delay: 1.6 },
            ].map(({ label, value, sub, delay }, i) => (
              <motion.div
                key={label}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
                className={`bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm ${i === 1 ? "ml-6" : ""}`}
              >
                <p className="font-accent text-xs uppercase tracking-widest text-white/40 mb-1">{label}</p>
                <p className="font-heading font-bold text-white text-base">{value}</p>
                <p className="text-white/50 text-sm mt-0.5">{sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SPECIALIZATIONS ────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Core Specializations"
            title="GoHighLevel, AI & Modern Web"
            subtitle="CRM automation, AI chatbots, and modern web applications, backed by full funnel marketing. End to end digital infrastructure."
            centered
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {specializations.map(({ icon: Icon, title, color, items }) => (
              <motion.div
                key={title}
                variants={childVariant}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className={`group bg-white/5 border rounded-2xl p-7 transition-all ${colorMap[color]}`}
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 transition-colors ${iconColorMap[color]}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-white text-xl mb-4">{title}</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white/60 text-sm">
                      <CheckCircle2 size={14} className={labelColorMap[color]} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── SKILLS ─────────────────────────────────────────── */}
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
            label="Technical Skills"
            title="Full-Stack Skill Set"
            subtitle="Hands-on expertise spanning modern web development, CRM automation, AI, payment systems, and full-funnel marketing."
            centered
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {skills.map(({ icon: Icon, title, pills }) => (
              <motion.div
                key={title}
                variants={childVariant}
                whileHover={{ y: -4, boxShadow: "0 0 32px rgba(232,96,16,0.12)" }}
                transition={{ duration: 0.2 }}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center mb-4 group-hover:bg-orange/20 transition-colors">
                  <Icon size={18} className="text-orange" />
                </div>
                <h3 className="font-heading font-bold text-white text-base mb-3">{title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {pills.map((pill) => (
                    <span
                      key={pill}
                      className="bg-white/5 border border-white/10 text-white/60 px-2.5 py-0.5 rounded-md text-xs font-accent"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── EXPERIENCE ─────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Work Experience"
            title="22+ Years of Impact"
            subtitle="From leading marketing agencies to managing full-scale operations and digital transformation."
          />
          <div className="relative mt-12">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange via-blue-500 to-emerald-500 opacity-40" />
            <div className="space-y-8">
              {experience.map(({ company, role, period, desc, color }) => (
                <motion.div
                  key={company}
                  variants={childVariant}
                  className="relative pl-14"
                >
                  <div className={`absolute left-3 top-2 w-5 h-5 rounded-full ${dotColorMap[color]}`} />
                  <div className={`bg-white/5 border rounded-2xl p-6 transition-all ${colorMap[color]}`}>
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                      <div>
                        <p className={`font-accent font-semibold text-xs uppercase tracking-widest mb-1 ${labelColorMap[color]}`}>
                          {company}
                        </p>
                        <h3 className="font-heading font-bold text-white text-lg">{role}</h3>
                      </div>
                      <span className="bg-white/5 border border-white/10 text-white/50 px-3 py-1 rounded-lg text-xs font-accent whitespace-nowrap">
                        {period}
                      </span>
                    </div>
                    <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── EDUCATION ──────────────────────────────────────── */}
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
            label="Education"
            title="Academic Background"
            subtitle="Dual degrees in Business Management and Information Technology — the foundation for marketing + tech expertise."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10"
          >
            {education.map(({ icon: Icon, degree, school, year }) => (
              <motion.div
                key={degree}
                variants={childVariant}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4 items-start
                  hover:border-orange/30 hover:shadow-[0_0_30px_rgba(232,96,16,0.1)] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange/20 transition-colors">
                  <Icon size={22} className="text-orange" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base mb-1">{degree}</h3>
                  <p className="text-white/50 text-sm">{school}</p>
                  <p className="text-orange text-xs font-accent font-semibold mt-1">{year}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── CERTIFICATES ───────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Certifications & Credentials"
            title="Verified Qualifications"
            subtitle="Professionally certified across digital marketing, automation, and quality management."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10"
          >
            {certificates.map(({ title, issuer, logo, date, id, color }) => (
              <motion.div
                key={title}
                variants={childVariant}
                whileHover={{ y: -5, boxShadow: "0 0 32px rgba(232,96,16,0.12)" }}
                transition={{ duration: 0.2 }}
                className={`group bg-white/5 border rounded-2xl p-6 transition-all ${colorMap[color]}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl flex-shrink-0 transition-colors ${iconColorMap[color]}`}>
                    {logo}
                  </div>
                  <BadgeCheck size={18} className={`mt-1 ${labelColorMap[color]}`} />
                </div>
                <h3 className="font-heading font-bold text-white text-base leading-snug mb-2">{title}</h3>
                <p className="text-white/45 text-xs mb-3 leading-relaxed">{issuer}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-white/5 border border-white/10 text-white/50 px-2.5 py-0.5 rounded-md text-xs font-accent">
                    Issued: {date}
                  </span>
                </div>
                {id && (
                  <p className="text-white/25 text-xs mt-2 font-mono">ID: {id}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── CONTACT ────────────────────────────────────────── */}
      <motion.section
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Get In Touch"
            title="Let's Build Something Together"
            subtitle="Looking for a WordPress developer, GoHighLevel specialist, or marketing automation expert? I'm available for remote work."
            centered
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            {/* Contact info */}
            <div className="space-y-5">
              {[
                { icon: Mail, label: "Email", value: "bvnyson@gmail.com" },
                { icon: Phone, label: "Phone", value: "(+63) 981-655-6555" },
                { icon: MapPin, label: "Location", value: "Las Piñas, Philippines 🇵🇭" },
                { icon: Globe, label: "Portfolio", value: "bvnofficial.com/benjaminyson", href: "https://www.bvnofficial.com/benjaminyson" },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-orange" />
                  </div>
                  <div>
                    <p className="font-accent text-xs text-white/40 uppercase tracking-wider">{label}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-white/80 text-sm font-medium hover:text-orange transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-white/80 text-sm font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="font-accent text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Briefcase size={12} /> References
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-white text-sm font-semibold">Tricia May Hilario</p>
                    <p className="text-white/45 text-xs">CEO, BVN Digital Marketing · tinyhilario@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Marifel Star Querido</p>
                    <p className="text-white/45 text-xs">Operations Manager, Fernandez Group · mstarquerido@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! Benjamin will get back to you within 24 hours.");
                (e.target as HTMLFormElement).reset();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-accent text-xs text-white/40 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text" required placeholder="John Smith"
                    className="bg-white/5 border border-white/10 text-white placeholder-white/25 px-4 py-3 rounded-xl text-sm outline-none focus:border-orange/50 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-accent text-xs text-white/40 uppercase tracking-wider">Email</label>
                  <input
                    type="email" required placeholder="john@company.com"
                    className="bg-white/5 border border-white/10 text-white placeholder-white/25 px-4 py-3 rounded-xl text-sm outline-none focus:border-orange/50 transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-accent text-xs text-white/40 uppercase tracking-wider">I need help with</label>
                <select className="bg-white/5 border border-white/10 text-white/80 px-4 py-3 rounded-xl text-sm outline-none focus:border-orange/50 transition-colors">
                  <option value="" className="bg-[#0f172a]">Select a service...</option>
                  <option className="bg-[#0f172a]">WordPress Website Build</option>
                  <option className="bg-[#0f172a]">GoHighLevel Setup / CRM</option>
                  <option className="bg-[#0f172a]">Funnel & Automation Build</option>
                  <option className="bg-[#0f172a]">Marketing Strategy</option>
                  <option className="bg-[#0f172a]">AI & Workflow Automation</option>
                  <option className="bg-[#0f172a]">E-Commerce (Shopify / WooCommerce)</option>
                  <option className="bg-[#0f172a]">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-accent text-xs text-white/40 uppercase tracking-wider">Message</label>
                <textarea
                  rows={4} placeholder="Tell me about your project..."
                  className="bg-white/5 border border-white/10 text-white placeholder-white/25 px-4 py-3 rounded-xl text-sm outline-none focus:border-orange/50 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-heading font-semibold text-sm bg-orange text-white shadow-[0_0_20px_rgba(232,96,16,0.4)] hover:bg-orange-light hover:shadow-[0_0_32px_rgba(232,96,16,0.6)] active:scale-95 transition-all duration-200"
              >
                Send Message <span>→</span>
              </button>
            </form>
          </div>
        </div>
      </motion.section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-20 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-4">
            Ready to hire Benjamin?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            22+ years of experience. Available for remote work. Let&apos;s build something great.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <GlowButton href="#contact" variant="filled" showArrow className="text-base px-8 py-4">
              Get in Touch
            </GlowButton>
            <a
              href="/benjamin-yson-cv.pdf"
              download="Benjamin-Yson-CV.pdf"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-heading font-semibold text-base border border-white/30 text-white hover:bg-white/10 hover:border-white/50 active:scale-95 transition-all duration-200"
            >
              <Download size={16} /> Download CV
            </a>
          </div>
        </div>
      </motion.section>
    </>
  );
}
