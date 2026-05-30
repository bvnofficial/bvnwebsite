import type { Metadata } from "next";
import Link from "next/link";
import {
  Home, Info, Megaphone, Settings2, DollarSign, Mail, BookOpen, Grid3X3,
  Share2, BarChart2, Search, FileText, Video, Users, Globe, Smartphone, Database,
  Bot, Workflow, UserCheck, Settings, Clock, Shield, PieChart, Plug,
  Sun, LayoutDashboard, ImageDown, Receipt, Bluetooth, QrCode, Gift, Landmark,
  Calculator, Hash, KeyRound, Building2, Paintbrush, Link2, TrendingUp, Tag,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Site Map — BVN Digital Marketing & Automation Agency",
  metaTitle: "BVN Website Sitemap — All Pages, Apps & Blog Posts",
  description:
    "Complete sitemap of bvnofficial.com — all pages, services, free tools, blog posts, and resources from BVN Digital Marketing & Business Automation Agency.",
  alternates: { canonical: "https://www.bvnofficial.com/sitemap-page" },
} as Metadata;

const sections = [
  {
    title: "Main Pages",
    color: "orange",
    icon: Home,
    links: [
      { label: "Home", href: "/", icon: Home },
      { label: "About BVN", href: "/about", icon: Info },
      { label: "Pricing & Packages", href: "/pricing", icon: DollarSign },
      { label: "Contact Us", href: "/contact", icon: Mail },
      { label: "Get Started", href: "/get-started", icon: ChevronRight },
    ],
  },
  {
    title: "Marketing Services",
    color: "orange",
    icon: Megaphone,
    links: [
      { label: "All Marketing Services", href: "/marketing", icon: Megaphone },
      { label: "Social Media Management", href: "/marketing/social-media-management", icon: Share2 },
      { label: "Digital Marketing", href: "/marketing/digital-marketing", icon: BarChart2 },
      { label: "SEO Services", href: "/marketing/seo", icon: Search },
      { label: "Email Marketing", href: "/marketing/email-marketing", icon: Mail },
      { label: "Content Marketing", href: "/marketing/content-marketing", icon: FileText },
      { label: "Video Marketing", href: "/marketing/video-marketing", icon: Video },
      { label: "Influencer Marketing", href: "/marketing/influencer-marketing", icon: Users },
      { label: "Web Development", href: "/marketing/web-development", icon: Globe },
      { label: "App Development", href: "/marketing/app-development", icon: Smartphone },
      { label: "CRM Solutions", href: "/marketing/crm-solutions", icon: Database },
    ],
  },
  {
    title: "Operations & Automation",
    color: "blue",
    icon: Settings2,
    links: [
      { label: "All Operations Services", href: "/operations", icon: Settings2 },
      { label: "AI Agents & Automation", href: "/operations/ai-agents", icon: Bot },
      { label: "CRM Automation", href: "/operations/crm-automation", icon: Workflow },
      { label: "HR & Payroll Automation", href: "/operations/hr-payroll", icon: UserCheck },
      { label: "Operations Automation", href: "/operations/operations-automation", icon: Settings },
      { label: "Time & Location Tracking", href: "/operations/time-tracking", icon: Clock },
      { label: "Admin Automation", href: "/operations/admin-automation", icon: Shield },
      { label: "Analytics & Reporting", href: "/operations/analytics", icon: PieChart },
      { label: "Integrations", href: "/operations/integrations", icon: Plug },
    ],
  },
  {
    title: "Free Business Tools & Apps",
    color: "green",
    icon: Grid3X3,
    links: [
      { label: "All Free Tools", href: "/apps", icon: Grid3X3 },
      { label: "Salary Calculator Philippines", href: "/apps/salary-calculator", icon: DollarSign },
      { label: "13th Month Pay Calculator", href: "/apps/13th-month-calculator", icon: Gift },
      { label: "Loan Calculator Philippines", href: "/apps/loan-calculator", icon: Landmark },
      { label: "VAT Calculator Philippines", href: "/apps/vat-calculator", icon: Calculator },
      { label: "Break-Even Calculator", href: "/apps/break-even-calculator", icon: TrendingUp },
      { label: "QR Code Generator", href: "/apps/qr-code-generator", icon: QrCode },
      { label: "Hashtag Generator", href: "/apps/hashtag-generator", icon: Hash },
      { label: "Password Generator", href: "/apps/password-generator", icon: KeyRound },
      { label: "Meta Tag Generator", href: "/apps/meta-tag-generator", icon: Tag },
      { label: "UTM Link Builder", href: "/apps/utm-builder", icon: Link2 },
      { label: "Image Compressor", href: "/apps/image-compressor", icon: ImageDown },
      { label: "Invoice Generator", href: "/apps/invoice-generator", icon: Receipt },
      { label: "Solar Sizing Calculator", href: "/apps/solar-calculator", icon: Sun },
      { label: "Tile Calculator", href: "/apps/tile-calculator", icon: Grid3X3 },
      { label: "CHB Block Calculator", href: "/apps/chb-calculator", icon: Building2 },
      { label: "Paint Calculator", href: "/apps/paint-calculator", icon: Paintbrush },
      { label: "Floor Plan Designer", href: "/apps/floor-plan-designer", icon: LayoutDashboard },
      { label: "Tracker Detector", href: "/apps/tracker-detector", icon: Bluetooth },
    ],
  },
  {
    title: "Blog — Marketing & Automation",
    color: "emerald",
    icon: BookOpen,
    links: [
      { label: "All Blog Posts", href: "/blog", icon: BookOpen },
      { label: "Philippine Take-Home Pay Guide", href: "/blog/philippine-salary-calculator-take-home-pay-guide", icon: DollarSign },
      { label: "13th Month Pay Complete Guide", href: "/blog/13th-month-pay-philippines-complete-guide", icon: Gift },
      { label: "Loan Calculator Philippines Guide", href: "/blog/loan-calculator-philippines-monthly-amortization-guide", icon: Landmark },
      { label: "VAT Calculator Philippines Guide", href: "/blog/vat-calculator-philippines-12-percent-guide", icon: Calculator },
      { label: "QR Code for Business Philippines", href: "/blog/qr-code-generator-philippines-business-guide", icon: QrCode },
      { label: "Hashtag Generator Guide", href: "/blog/hashtag-generator-instagram-tiktok-philippines", icon: Hash },
      { label: "Strong Password Guide", href: "/blog/strong-password-guide-cybersecurity-philippines", icon: KeyRound },
      { label: "CHB Calculator Guide", href: "/blog/chb-hollow-block-calculator-philippines-wall-construction", icon: Building2 },
      { label: "Paint Calculator Philippines", href: "/blog/paint-calculator-philippines-how-much-paint-guide", icon: Paintbrush },
      { label: "UTM Link Builder Guide", href: "/blog/utm-link-builder-track-marketing-campaigns-philippines", icon: Link2 },
      { label: "Break-Even Analysis Guide", href: "/blog/break-even-analysis-philippines-business-guide", icon: TrendingUp },
      { label: "Meta Tag Generator Guide", href: "/blog/meta-tag-generator-seo-guide-philippines", icon: Tag },
      { label: "Solar Panel Sizing Philippines", href: "/blog/solar-panel-sizing-philippines-guide", icon: Sun },
      { label: "Free Invoice Generator Philippines", href: "/blog/free-invoice-generator-philippines-small-business", icon: Receipt },
      { label: "Detect Hidden Trackers Guide", href: "/blog/how-to-detect-hidden-trackers-website-privacy", icon: Shield },
      { label: "Compress Images Free Guide", href: "/blog/compress-images-free-guide-website-speed", icon: ImageDown },
      { label: "Tile Calculator Philippines", href: "/blog/tile-calculator-philippines-how-many-tiles", icon: Grid3X3 },
      { label: "Business Automation Guide PH", href: "/blog/business-automation-philippines-guide", icon: Settings },
      { label: "Social Media Management PH", href: "/blog/social-media-management-philippines", icon: Share2 },
      { label: "AI Automation for Business", href: "/blog/ai-automation-save-time-business", icon: Bot },
      { label: "SEO Philippines 2025", href: "/blog/seo-philippines-rank-google-2025", icon: Search },
      { label: "CRM Automation Philippines", href: "/blog/crm-automation-philippines-sales", icon: Database },
      { label: "Digital Marketing Strategy", href: "/blog/digital-marketing-philippines-strategy-2025", icon: BarChart2 },
      { label: "HR & Payroll Automation", href: "/blog/hr-payroll-automation-philippines", icon: UserCheck },
      { label: "Content Marketing Converts", href: "/blog/content-marketing-strategy-converts", icon: FileText },
      { label: "Website Losing Customers?", href: "/blog/website-losing-customers-fix", icon: Globe },
      { label: "Cost of Not Automating", href: "/blog/cost-not-automating-business-2025", icon: TrendingUp },
    ],
  },
];

const colorMap: Record<string, { badge: string; icon: string; border: string; dot: string }> = {
  orange: { badge: "bg-orange/10 border-orange/20 text-orange", icon: "text-orange", border: "border-orange/20", dot: "bg-orange" },
  blue: { badge: "bg-blue-400/10 border-blue-400/20 text-blue-400", icon: "text-blue-400", border: "border-blue-400/20", dot: "bg-blue-400" },
  green: { badge: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400", icon: "text-emerald-400", border: "border-emerald-400/20", dot: "bg-emerald-400" },
  emerald: { badge: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400", icon: "text-emerald-400", border: "border-emerald-400/20", dot: "bg-emerald-400" },
};

export default function SitemapPage() {
  const totalLinks = sections.reduce((acc, s) => acc + s.links.length, 0);

  return (
    <div className="min-h-screen bg-[#0A0F1E] pt-24 pb-20 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-14 text-center">
        <span className="inline-block font-accent font-semibold text-xs tracking-[0.2em] uppercase text-orange mb-4 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20">
          Site Map
        </span>
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4">
          Complete BVN Sitemap
        </h1>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Every page, tool, and article on bvnofficial.com — {totalLinks} links across {sections.length} sections.
        </p>
        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { label: "Pages & Services", count: "20+" },
            { label: "Free Tools & Apps", count: "18" },
            { label: "Blog Articles", count: "27+" },
            { label: "Total Links", count: totalLinks.toString() },
          ].map(({ label, count }) => (
            <div key={label} className="px-5 py-3 rounded-xl bg-white/[0.04] border border-white/8">
              <span className="font-heading font-bold text-orange text-lg">{count}</span>
              <span className="text-white/40 text-sm ml-2 font-accent">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-7xl mx-auto space-y-10">
        {sections.map((section) => {
          const c = colorMap[section.color] || colorMap.orange;
          const SectionIcon = section.icon;
          return (
            <div key={section.title} className="bg-[#111827] border border-white/8 rounded-2xl overflow-hidden">
              {/* Section header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/8 bg-white/[0.02]">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.badge} border`}>
                  <SectionIcon size={15} className={c.icon} />
                </div>
                <h2 className="font-heading font-bold text-white">{section.title}</h2>
                <span className={`ml-auto text-xs font-accent font-bold px-2.5 py-1 rounded-full border ${c.badge}`}>
                  {section.links.length} links
                </span>
              </div>

              {/* Links grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 divide-white/5">
                {section.links.map(({ label, href, icon: ItemIcon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.04] border-b border-r border-white/5 transition-colors group"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                    <ItemIcon size={13} className={`${c.icon} shrink-0 opacity-60 group-hover:opacity-100 transition-opacity`} />
                    <span className="text-white/60 group-hover:text-white text-sm font-body transition-colors truncate">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* XML Sitemap note */}
      <div className="max-w-7xl mx-auto mt-12 p-6 bg-orange/5 border border-orange/15 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center shrink-0">
            <Search size={18} className="text-orange" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white mb-1">XML Sitemap for Search Engines</h3>
            <p className="text-white/50 text-sm mb-3">
              The machine-readable XML sitemap for Google, Bing, and other search engines is available at:
            </p>
            <a
              href="/sitemap.xml"
              target="_blank"
              className="inline-flex items-center gap-2 text-orange font-accent font-semibold text-sm hover:text-orange-light transition-colors"
            >
              bvnofficial.com/sitemap.xml
              <ChevronRight size={14} />
            </a>
            <p className="text-white/35 text-xs mt-2">
              Submit this URL in Google Search Console → Sitemaps to request immediate crawling of all pages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
