"use client";

import { motion } from "framer-motion";
import { Sun, ArrowRight, Wrench, Grid3X3, LayoutDashboard, ImageDown, Receipt, Bluetooth, DollarSign, QrCode, Gift, Landmark, Calculator, Hash, KeyRound, Building2, Paintbrush, Link2, TrendingUp, Tag } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const apps = [
  {
    icon: DollarSign,
    title: "Salary Calculator Philippines",
    description:
      "Calculate your exact take-home pay after SSS, PhilHealth, Pag-IBIG, and BIR withholding tax. Uses 2026 TRAIN Law rates. Shows monthly and annual breakdown.",
    href: "/apps/salary-calculator",
    badge: "🔥 Popular",
    color: "green",
  },
  {
    icon: Gift,
    title: "13th Month Pay Calculator",
    description:
      "Compute your 13th month pay based on months worked, salary, and LWOP deductions. Includes tax-exempt status check and advance payment guide.",
    href: "/apps/13th-month-calculator",
    badge: "Free Tool",
    color: "yellow",
  },
  {
    icon: QrCode,
    title: "QR Code Generator",
    description:
      "Create QR codes for URLs, WiFi passwords, contacts, emails, phone numbers, and SMS. Customizable colors and sizes. Download as PNG instantly.",
    href: "/apps/qr-code-generator",
    badge: "Free Tool",
    color: "purple",
  },
  {
    icon: Sun,
    title: "Solar Sizing Calculator",
    description:
      "Calculate the ideal solar panel system size for your home or business. Upload your utility bill or enter usage manually to get a full system recommendation.",
    href: "/apps/solar-calculator",
    badge: "Free Tool",
    color: "yellow",
  },
  {
    icon: Grid3X3,
    title: "Tile Calculator",
    description:
      "Draw your room or floor area on a grid, choose your tile size, and instantly see how many tiles you need — with a live tile overlay preview and waste factor.",
    href: "/apps/tile-calculator",
    badge: "Free Tool",
    color: "orange",
  },
  {
    icon: LayoutDashboard,
    title: "Floor Plan Designer",
    description:
      "Design your floor plan online for free. Draw rooms, add furniture, label spaces, resize and export as PNG. No signup required.",
    href: "/apps/floor-plan-designer",
    badge: "Free Tool",
    color: "blue",
  },
  {
    icon: ImageDown,
    title: "Image Compressor",
    description:
      "Compress and resize images instantly in your browser. Supports JPEG, PNG, and WebP. Nothing is uploaded — 100% private.",
    href: "/apps/image-compressor",
    badge: "Free Tool",
    color: "green",
  },
  {
    icon: Receipt,
    title: "Invoice Generator",
    description:
      "Create professional invoices in seconds. Add your logo, line items, tax, and download as PDF. Free with no signup needed.",
    href: "/apps/invoice-generator",
    badge: "Free Tool",
    color: "purple",
  },
  {
    icon: Bluetooth,
    title: "Tracker Detector",
    description:
      "Detect hidden Bluetooth trackers near you. Identifies AirTags, Tile, Samsung SmartTags and unknown BLE devices. Requires Bluetooth & Chrome.",
    href: "/apps/tracker-detector",
    badge: "Free Tool",
    color: "blue",
  },
  {
    icon: Landmark,
    title: "Loan Calculator Philippines",
    description: "Calculate monthly amortization for personal loans, car loans, housing loans, SSS, and Pag-IBIG. Full amortization schedule included.",
    href: "/apps/loan-calculator",
    badge: "🔥 Popular",
    color: "yellow",
  },
  {
    icon: Calculator,
    title: "VAT Calculator Philippines",
    description: "Compute 12% VAT inclusive and exclusive instantly. Includes 3% percentage tax for non-VAT businesses and bulk calculation.",
    href: "/apps/vat-calculator",
    badge: "Free Tool",
    color: "blue",
  },
  {
    icon: Hash,
    title: "Hashtag Generator",
    description: "Find the best Instagram and TikTok hashtags for your content. Sorted by popularity — popular, medium, and niche tags by category.",
    href: "/apps/hashtag-generator",
    badge: "Free Tool",
    color: "purple",
  },
  {
    icon: KeyRound,
    title: "Password Generator",
    description: "Generate strong, secure passwords instantly. Customize length, character types, and strength. 100% private — nothing is stored.",
    href: "/apps/password-generator",
    badge: "Free Tool",
    color: "green",
  },
  {
    icon: Building2,
    title: "CHB / Hollow Block Calculator",
    description: "Calculate CHB blocks, cement bags, and sand needed for any wall. Includes door/window deductions and wastage factor.",
    href: "/apps/chb-calculator",
    badge: "Free Tool",
    color: "orange",
  },
  {
    icon: Paintbrush,
    title: "Paint Calculator Philippines",
    description: "Calculate how many liters of paint you need for any room, wall, ceiling, or exterior. Includes cost estimate and local brand reference.",
    href: "/apps/paint-calculator",
    badge: "Free Tool",
    color: "orange",
  },
  {
    icon: Link2,
    title: "UTM Link Builder",
    description: "Build trackable campaign URLs for Google Analytics, Facebook, TikTok, and email marketing. Save history, use presets.",
    href: "/apps/utm-builder",
    badge: "Free Tool",
    color: "blue",
  },
  {
    icon: TrendingUp,
    title: "Break-Even Calculator",
    description: "Find exactly when your business starts making profit. Enter fixed costs, variable costs, and selling price — get your break-even point.",
    href: "/apps/break-even-calculator",
    badge: "Free Tool",
    color: "green",
  },
  {
    icon: Tag,
    title: "Meta Tag Generator",
    description: "Generate perfect SEO meta tags, Open Graph, and Twitter Card tags with live Google and Facebook preview. Copy-ready HTML output.",
    href: "/apps/meta-tag-generator",
    badge: "Free Tool",
    color: "purple",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const child = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AppsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center bg-navy-dark overflow-hidden pt-24 pb-16 px-6">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <span className="inline-block font-accent font-semibold text-xs tracking-[0.2em] uppercase
            text-orange mb-4 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20">
            BVN Apps
          </span>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4 leading-tight">
            Free Tools Built for <span className="text-gradient">Your Business</span>
          </h1>
          <p className="text-white/60 text-lg">
            Practical calculators and tools designed to help you make smarter decisions — no sign-up required.
          </p>
        </div>
      </section>

      {/* Apps Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative py-20 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Available Tools"
            title="Tools &amp; Calculators"
            subtitle="More tools are being added regularly. Check back for updates."
            centered
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {apps.map(({ icon: Icon, title, description, href, badge, color }) => (
              <motion.div key={href} variants={child}>
                <Link
                  href={href}
                  className="group flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl p-6
                    hover:border-orange/30 hover:bg-white/8 hover:shadow-[0_0_32px_rgba(232,96,16,0.12)]
                    transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                      ${color === "yellow" ? "bg-yellow-500/15 border border-yellow-500/20"
                      : color === "blue" ? "bg-blue-500/15 border border-blue-500/20"
                      : color === "green" ? "bg-emerald-500/15 border border-emerald-500/20"
                      : color === "purple" ? "bg-purple-500/15 border border-purple-500/20"
                      : "bg-orange/10 border border-orange/20"}`}>
                      <Icon size={22} className={
                        color === "yellow" ? "text-yellow-400"
                        : color === "blue" ? "text-blue-400"
                        : color === "green" ? "text-emerald-400"
                        : color === "purple" ? "text-purple-400"
                        : "text-orange"} />
                    </div>
                    <span className="text-xs font-accent font-semibold px-2.5 py-1 rounded-full
                      bg-green-500/10 border border-green-500/20 text-green-400">
                      {badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-white text-lg mb-2">{title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed flex-1">{description}</p>

                  <div className="flex items-center gap-1.5 mt-5 text-orange text-sm font-accent font-semibold
                    group-hover:gap-2.5 transition-all duration-200">
                    Open Tool <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Coming soon placeholder */}
            <motion.div variants={child}>
              <div className="flex flex-col h-full bg-white/3 border border-white/5 rounded-2xl p-6 opacity-50">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Wrench size={22} className="text-white/30" />
                </div>
                <h3 className="font-heading font-bold text-white/40 text-lg mb-2">More Coming Soon</h3>
                <p className="text-white/30 text-sm leading-relaxed">
                  We&apos;re building more business tools. Stay tuned.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
