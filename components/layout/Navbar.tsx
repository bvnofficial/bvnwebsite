"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown,
  Share2, BarChart2, Search, Mail, FileText, Video, Users, Globe, Smartphone, Database,
  Bot, Workflow, UserCheck, Settings, Clock, Shield, PieChart, Plug,
  Sun, Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const marketingDropdown = [
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
];

const appsDropdown = [
  { label: "Solar Sizing Calculator", href: "/apps/solar-calculator", icon: Sun },
  { label: "More Coming Soon", href: "/apps", icon: Wrench },
];

const operationsDropdown = [
  { label: "AI Agents & Automation", href: "/operations/ai-agents", icon: Bot },
  { label: "CRM Automation", href: "/operations/crm-automation", icon: Workflow },
  { label: "HR & Payroll Automation", href: "/operations/hr-payroll", icon: UserCheck },
  { label: "Operations Automation", href: "/operations/operations-automation", icon: Settings },
  { label: "Time & Location Tracking", href: "/operations/time-tracking", icon: Clock },
  { label: "Admin Automation", href: "/operations/admin-automation", icon: Shield },
  { label: "Analytics & Reporting", href: "/operations/analytics", icon: PieChart },
  { label: "Integrations", href: "/operations/integrations", icon: Plug },
];

interface DropdownMenuProps {
  label: string;
  href: string;
  items: { label: string; href: string; icon: LucideIcon }[];
  accentColor: "orange" | "blue";
  isActive: boolean;
  columns?: 1 | 2;
}

function DropdownMenu({ label, href, items, accentColor, isActive, columns = 1 }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const accent = accentColor === "orange"
    ? { text: "text-orange", bg: "bg-orange/10", border: "border-orange/20", icon: "text-orange", hover: "hover:border-orange/40 hover:bg-orange/5", underline: "bg-orange" }
    : { text: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: "text-blue-400", hover: "hover:border-blue-400/40 hover:bg-blue-400/5", underline: "bg-blue-400" };

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex items-center gap-1 px-4 py-2 text-sm font-accent font-semibold transition-colors duration-200 rounded-md",
          isActive ? accent.text : "text-white/80 hover:text-white"
        )}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-200 mt-0.5", open && "rotate-180")}
        />
        {isActive && (
          <span className={cn("absolute bottom-0 left-4 right-4 h-0.5 rounded-full", accent.underline)} />
        )}
      </button>

      {/* Dropdown Panel */}
      <div
        className={cn(
          "absolute top-full left-0 mt-1 rounded-2xl border border-white/10 bg-navy-dark/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden z-50",
          "transition-all duration-200 origin-top-left",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none",
          columns === 2 ? "w-[480px]" : "w-64"
        )}
      >
        {/* Header link to parent section */}
        <div className={cn("px-4 pt-4 pb-3 border-b border-white/5 mb-1")}>
          <Link
            href={href}
            className={cn("text-xs font-accent font-semibold uppercase tracking-widest", accent.text)}
          >
            View All {label} →
          </Link>
        </div>

        <div className={cn("p-2", columns === 2 && "grid grid-cols-2 gap-0")}>
          {items.map(({ label: itemLabel, href: itemHref, icon: Icon }) => (
            <Link
              key={itemHref}
              href={itemHref}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white text-xs font-accent font-semibold transition-all group",
                accent.hover
              )}
            >
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border", accent.bg, accent.border)}>
                <Icon size={13} className={accent.icon} />
              </div>
              <span className="leading-tight">{itemLabel}</span>
            </Link>
          ))}
        </div>
        <div className="h-2" />
      </div>
    </li>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMarketing, setMobileMarketing] = useState(false);
  const [mobileOperations, setMobileOperations] = useState(false);
  const [mobileApps, setMobileApps] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileMarketing(false);
    setMobileOperations(false);
    setMobileApps(false);
  }, [pathname]);

  const simpleLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-navy-dark/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex items-center gap-1">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="group-hover:scale-110 transition-transform"
              >
                <polygon
                  points="4,24 14,4 24,24 14,18"
                  fill="#E86010"
                  stroke="#F5A623"
                  strokeWidth="1"
                />
              </svg>
              <span
                className="font-heading font-extrabold text-2xl tracking-tight"
                style={{ color: "#FFFFFF" }}
              >
                BVN
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {/* Home */}
            <li>
              <Link
                href="/"
                className={cn(
                  "relative px-4 py-2 text-sm font-accent font-semibold transition-colors duration-200 rounded-md",
                  pathname === "/" ? "text-orange" : "text-white/80 hover:text-white"
                )}
              >
                Home
                {pathname === "/" && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange rounded-full" />
                )}
              </Link>
            </li>

            {/* About */}
            <li>
              <Link
                href="/about"
                className={cn(
                  "relative px-4 py-2 text-sm font-accent font-semibold transition-colors duration-200 rounded-md",
                  pathname.startsWith("/about") ? "text-orange" : "text-white/80 hover:text-white"
                )}
              >
                About
                {pathname.startsWith("/about") && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange rounded-full" />
                )}
              </Link>
            </li>

            {/* Marketing Dropdown */}
            <DropdownMenu
              label="Marketing"
              href="/marketing"
              items={marketingDropdown}
              accentColor="orange"
              isActive={pathname.startsWith("/marketing")}
              columns={2}
            />

            {/* Operations Dropdown */}
            <DropdownMenu
              label="Operations"
              href="/operations"
              items={operationsDropdown}
              accentColor="blue"
              isActive={pathname.startsWith("/operations")}
              columns={1}
            />

            {/* Apps Dropdown */}
            <DropdownMenu
              label="Apps"
              href="/apps"
              items={appsDropdown}
              accentColor="orange"
              isActive={pathname.startsWith("/apps")}
              columns={1}
            />

            {/* Pricing */}
            <li>
              <Link
                href="/pricing"
                className={cn(
                  "relative px-4 py-2 text-sm font-accent font-semibold transition-colors duration-200 rounded-md",
                  pathname.startsWith("/pricing") ? "text-orange" : "text-white/80 hover:text-white"
                )}
              >
                Pricing
                {pathname.startsWith("/pricing") && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange rounded-full" />
                )}
              </Link>
            </li>

            {/* Contact */}
            <li>
              <Link
                href="/contact"
                className={cn(
                  "relative px-4 py-2 text-sm font-accent font-semibold transition-colors duration-200 rounded-md",
                  pathname.startsWith("/contact") ? "text-orange" : "text-white/80 hover:text-white"
                )}
              >
                Contact
                {pathname.startsWith("/contact") && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange rounded-full" />
                )}
              </Link>
            </li>
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-orange text-white text-sm font-heading font-semibold rounded-lg
                shadow-[0_0_20px_rgba(232,96,16,0.4)] hover:bg-orange-light hover:shadow-[0_0_30px_rgba(232,96,16,0.6)]
                transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Drawer */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileOpen ? "max-h-[85vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-navy-dark/97 backdrop-blur-xl border-t border-white/10 py-4 px-2 flex flex-col gap-1">

            {/* Simple links */}
            {[{ label: "Home", href: "/" }, { label: "About", href: "/about" }].map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg font-accent font-semibold text-sm transition-colors",
                    isActive ? "text-orange bg-orange/10" : "text-white/80 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Marketing Accordion */}
            <div>
              <button
                onClick={() => setMobileMarketing((v) => !v)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg font-accent font-semibold text-sm transition-colors",
                  pathname.startsWith("/marketing") ? "text-orange bg-orange/10" : "text-white/80 hover:text-white hover:bg-white/5"
                )}
              >
                Marketing
                <ChevronDown
                  size={14}
                  className={cn("transition-transform duration-200", mobileMarketing && "rotate-180")}
                />
              </button>
              {mobileMarketing && (
                <div className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-orange/20 pl-3">
                  <Link
                    href="/marketing"
                    className="px-3 py-2 text-xs font-accent font-bold text-orange/80 hover:text-orange transition-colors uppercase tracking-widest"
                  >
                    All Marketing Services →
                  </Link>
                  {marketingDropdown.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/65 hover:text-white hover:bg-white/5 text-xs font-accent font-semibold transition-colors"
                    >
                      <Icon size={12} className="text-orange shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Operations Accordion */}
            <div>
              <button
                onClick={() => setMobileOperations((v) => !v)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg font-accent font-semibold text-sm transition-colors",
                  pathname.startsWith("/operations") ? "text-blue-400 bg-blue-400/10" : "text-white/80 hover:text-white hover:bg-white/5"
                )}
              >
                Operations
                <ChevronDown
                  size={14}
                  className={cn("transition-transform duration-200", mobileOperations && "rotate-180")}
                />
              </button>
              {mobileOperations && (
                <div className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-blue-400/20 pl-3">
                  <Link
                    href="/operations"
                    className="px-3 py-2 text-xs font-accent font-bold text-blue-400/80 hover:text-blue-400 transition-colors uppercase tracking-widest"
                  >
                    All Operations Services →
                  </Link>
                  {operationsDropdown.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/65 hover:text-white hover:bg-white/5 text-xs font-accent font-semibold transition-colors"
                    >
                      <Icon size={12} className="text-blue-400 shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Apps Accordion */}
            <div>
              <button
                onClick={() => setMobileApps((v) => !v)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg font-accent font-semibold text-sm transition-colors",
                  pathname.startsWith("/apps") ? "text-orange bg-orange/10" : "text-white/80 hover:text-white hover:bg-white/5"
                )}
              >
                Apps
                <ChevronDown
                  size={14}
                  className={cn("transition-transform duration-200", mobileApps && "rotate-180")}
                />
              </button>
              {mobileApps && (
                <div className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-orange/20 pl-3">
                  <Link
                    href="/apps"
                    className="px-3 py-2 text-xs font-accent font-bold text-orange/80 hover:text-orange transition-colors uppercase tracking-widest"
                  >
                    All Apps →
                  </Link>
                  {appsDropdown.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/65 hover:text-white hover:bg-white/5 text-xs font-accent font-semibold transition-colors"
                    >
                      <Icon size={12} className="text-orange shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing + Contact */}
            {[{ label: "Pricing", href: "/pricing" }, { label: "Contact", href: "/contact" }].map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg font-accent font-semibold text-sm transition-colors",
                    isActive ? "text-orange bg-orange/10" : "text-white/80 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* CTA */}
            <div className="pt-2 pb-1 px-2">
              <Link
                href="/contact"
                className="block text-center px-5 py-3 bg-orange text-white text-sm font-heading font-semibold rounded-lg
                  shadow-[0_0_20px_rgba(232,96,16,0.4)] hover:bg-orange-light transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
