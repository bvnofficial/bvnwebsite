import Link from "next/link";
import { Mail, Phone, Facebook, Globe, ArrowRight } from "lucide-react";

const marketingLinks = [
  { label: "Social Media Management", href: "/marketing#social-media" },
  { label: "SEO Services", href: "/marketing#seo" },
  { label: "Digital Marketing", href: "/marketing#digital" },
  { label: "Content Marketing", href: "/marketing#content" },
  { label: "Web Development", href: "/marketing#web-dev" },
  { label: "Email Marketing", href: "/marketing#email" },
];

const operationsLinks = [
  { label: "CRM & Sales Automation", href: "/operations#crm" },
  { label: "AI Agents", href: "/operations#ai-agents" },
  { label: "HR & Payroll Automation", href: "/operations#hr-payroll" },
  { label: "Time & Location Tracking", href: "/operations#time-tracking" },
  { label: "Reporting & Analytics", href: "/operations#analytics" },
  { label: "System Integrations", href: "/operations#integrations" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-navy-surface grid-bg border-t border-white/5">
      {/* Gradient overlay on grid bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy-dark/60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-16 pb-8">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1 — Logo + Tagline */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <svg
                width="26"
                height="26"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  points="4,24 14,4 24,24 14,18"
                  fill="#E86010"
                  stroke="#F5A623"
                  strokeWidth="1"
                />
              </svg>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                BVN
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Philippines-based digital agency combining high-impact marketing
              with intelligent operations automation.
            </p>
            {/* Social */}
            <a
              href="https://www.facebook.com/bvndigital"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/50 hover:text-orange transition-colors text-sm"
            >
              <Facebook size={16} />
              <span>facebook.com/bvndigital</span>
            </a>
          </div>

          {/* Column 2 — Marketing Services */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5">
              Marketing
            </h4>
            <ul className="space-y-2.5">
              {marketingLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-orange text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-orange"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Operations Services */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5">
              Operations
            </h4>
            <ul className="space-y-2.5">
              {operationsLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-orange text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-orange"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-5">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:bvn@bvnofficial.com"
                  className="flex items-center gap-2 text-white/50 hover:text-orange text-sm transition-colors"
                >
                  <Mail size={15} className="text-orange/70 shrink-0" />
                  bvn@bvnofficial.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+639816556555"
                  className="flex items-center gap-2 text-white/50 hover:text-orange text-sm transition-colors"
                >
                  <Phone size={15} className="text-orange/70 shrink-0" />
                  +63 981 655 6555
                </a>
              </li>
              <li>
                <a
                  href="https://www.bvnofficial.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/50 hover:text-orange text-sm transition-colors"
                >
                  <Globe size={15} className="text-orange/70 shrink-0" />
                  www.bvnofficial.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/bvndigital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/50 hover:text-orange text-sm transition-colors"
                >
                  <Facebook size={15} className="text-orange/70 shrink-0" />
                  facebook.com/bvndigital
                </a>
              </li>
            </ul>

            {/* Quick CTA */}
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange/10 border border-orange/30
                  text-orange text-sm font-semibold rounded-lg hover:bg-orange hover:text-white hover:border-orange
                  transition-all duration-200"
              >
                Book a Consultation
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {currentYear} BVN. All rights reserved. Philippines-Based Digital
            Agency.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
