"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown,
  Share2, BarChart2, Search, Mail, FileText, Video, Users, Globe, Smartphone, Database,
  Bot, Workflow, UserCheck, Settings, Clock, Shield, PieChart, Plug,
  Sun, Wrench, TrendingUp, BookOpen, Grid3X3, LayoutDashboard, ImageDown, Receipt, Bluetooth, DollarSign, QrCode, Gift,
  LogIn, Coins,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

// Lightweight auth-state hook for the navbar. Reads the current Supabase user
// and subscribes to sign-in/sign-out so the menu updates instantly without a
// full reload. Safe no-op if Supabase env vars aren't configured.
function useNavUser() {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }

    let mounted = true;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (mounted && data.user) {
        setUser({ email: data.user.email!, name: data.user.user_metadata?.full_name });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(
        session?.user
          ? { email: session.user.email!, name: session.user.user_metadata?.full_name }
          : null
      );
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return user;
}

function initialsOf(user: { email: string; name?: string }) {
  const base = user.name || user.email.split("@")[0];
  return base
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

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

const appsDropdown = [
  { label: "Salary Calculator PH", href: "/apps/salary-calculator", icon: DollarSign },
  { label: "13th Month Calculator", href: "/apps/13th-month-calculator", icon: Gift },
  { label: "QR Code Generator", href: "/apps/qr-code-generator", icon: QrCode },
  { label: "Solar Sizing Calculator", href: "/apps/solar-calculator", icon: Sun },
  { label: "Tile Calculator", href: "/apps/tile-calculator", icon: Grid3X3 },
  { label: "Floor Plan Designer", href: "/apps/floor-plan-designer", icon: LayoutDashboard },
  { label: "Image Compressor", href: "/apps/image-compressor", icon: ImageDown },
  { label: "Invoice Generator", href: "/apps/invoice-generator", icon: Receipt },
  { label: "Tracker Detector", href: "/apps/tracker-detector", icon: Bluetooth },
];

const blogDropdown = [
  { label: "Salary Calculator Guide", href: "/blog/philippine-salary-calculator-take-home-pay-guide", icon: DollarSign },
  { label: "13th Month Pay Guide", href: "/blog/13th-month-pay-philippines-complete-guide", icon: Gift },
  { label: "QR Code for Business", href: "/blog/qr-code-generator-philippines-business-guide", icon: QrCode },
  { label: "Solar Panel Sizing Guide", href: "/blog/solar-panel-sizing-philippines-guide", icon: Sun },
  { label: "Free Invoice Generator", href: "/blog/free-invoice-generator-philippines-small-business", icon: Receipt },
  { label: "Detect Hidden Trackers", href: "/blog/how-to-detect-hidden-trackers-website-privacy", icon: Shield },
  { label: "Compress Images Free", href: "/blog/compress-images-free-guide-website-speed", icon: ImageDown },
  { label: "Business Automation Guide", href: "/blog/business-automation-philippines-guide", icon: Settings },
  { label: "Social Media Management PH", href: "/blog/social-media-management-philippines", icon: Share2 },
  { label: "SEO Philippines 2025", href: "/blog/seo-philippines-rank-google-2025", icon: Search },
];

type AccentColor = "orange" | "blue" | "green";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  href: string;
  accentColor: AccentColor;
  items: NavItem[];
}

// ── Top-level menu groups ──────────────────────────────────
// Services = Marketing + Operations · Media = Apps + Blog
const servicesGroups: NavGroup[] = [
  { label: "Marketing", href: "/marketing", accentColor: "orange", items: marketingDropdown },
  { label: "Operations", href: "/operations", accentColor: "blue", items: operationsDropdown },
];

const mediaGroups: NavGroup[] = [
  { label: "Apps", href: "/apps", accentColor: "orange", items: appsDropdown },
  { label: "Blog", href: "/blog", accentColor: "green", items: blogDropdown },
];

function accentOf(accentColor: AccentColor) {
  return accentColor === "orange"
    ? { text: "text-orange", bg: "bg-orange/10", border: "border-orange/20", icon: "text-orange", hover: "hover:border-orange/40 hover:bg-orange/5", borderL: "border-orange/20" }
    : accentColor === "green"
    ? { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: "text-emerald-400", hover: "hover:border-emerald-400/40 hover:bg-emerald-400/5", borderL: "border-emerald-400/20" }
    : { text: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: "text-blue-400", hover: "hover:border-blue-400/40 hover:bg-blue-400/5", borderL: "border-blue-400/20" };
}

interface GroupedDropdownProps {
  label: string;
  groups: NavGroup[];
  isActive: boolean;
  width?: string;
}

// Desktop mega-menu: one column per sub-group (e.g. Marketing | Operations),
// each with its own "View all" header and accent-coloured items.
function GroupedDropdown({ label, groups, isActive, width }: GroupedDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setOpen(false), 120);
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex items-center gap-1 px-4 py-2 text-sm font-accent font-semibold transition-colors duration-200 rounded-md",
          isActive ? "text-orange" : "text-white/80 hover:text-white"
        )}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-200 mt-0.5", open && "rotate-180")}
        />
        {isActive && (
          <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-orange" />
        )}
      </button>

      {/* Dropdown Panel — pt-2 fills the gap so mouse never leaves the li */}
      <div
        className={cn(
          "absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "rounded-2xl border border-white/10 bg-navy-dark/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden",
            "transition-all duration-200 origin-top",
            open ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
          style={{ width: width ?? "680px" }}
        >
          <div className="grid grid-cols-2 divide-x divide-white/5">
            {groups.map((group) => {
              const a = accentOf(group.accentColor);
              return (
                <div key={group.label} className="p-2">
                  <div className="px-3 pt-3 pb-2 mb-1 border-b border-white/5">
                    <Link
                      href={group.href}
                      className={cn("text-xs font-accent font-semibold uppercase tracking-widest", a.text)}
                    >
                      {group.label} — View All →
                    </Link>
                  </div>
                  <div className="flex flex-col">
                    {group.items.map(({ label: itemLabel, href: itemHref, icon: Icon }) => (
                      <Link
                        key={itemHref}
                        href={itemHref}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-white/70 hover:text-white text-xs font-accent font-semibold transition-all",
                          a.hover
                        )}
                      >
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border", a.bg, a.border)}>
                          <Icon size={13} className={a.icon} />
                        </div>
                        <span className="leading-tight">{itemLabel}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="h-2" />
        </div>
      </div>
    </li>
  );
}

// Mobile accordion for a grouped menu (Services / Media).
function MobileGroupAccordion({
  label,
  groups,
  isActive,
  open,
  onToggle,
}: {
  label: string;
  groups: NavGroup[];
  isActive: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 rounded-lg font-accent font-semibold text-sm transition-colors",
          isActive ? "text-orange bg-orange/10" : "text-white/80 hover:text-white hover:bg-white/5"
        )}
      >
        {label}
        <ChevronDown size={14} className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-1 ml-3 flex flex-col gap-2 border-l border-white/10 pl-3 pb-1">
          {groups.map((group) => {
            const a = accentOf(group.accentColor);
            return (
              <div key={group.label}>
                <Link
                  href={group.href}
                  className={cn("block px-3 py-2 text-xs font-accent font-bold uppercase tracking-widest", a.text)}
                >
                  All {group.label} →
                </Link>
                {group.items.map(({ label: itemLabel, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/65 hover:text-white hover:bg-white/5 text-xs font-accent font-semibold transition-colors"
                  >
                    <Icon size={12} className={cn("shrink-0", a.icon)} />
                    {itemLabel}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const user = useNavUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const [mobileMedia, setMobileMedia] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileServices(false);
    setMobileMedia(false);
  }, [pathname]);

  const servicesActive = pathname.startsWith("/marketing") || pathname.startsWith("/operations");
  const mediaActive = pathname.startsWith("/apps") || pathname.startsWith("/blog");

  // Individual /apps/* tool pages are full-screen and ship their own "Back to Apps"
  // header, so the global fixed navbar would overlap them. We hide it on those
  // routes (but keep it on the /apps index) by toggling a `hide-navbar` class on
  // <html> — CSS then hides `.site-navbar`. A pre-paint script in the root layout
  // sets the same class on first load so there's no flash of the overlapping nav.
  const isAppToolPage = /^\/apps\/.+/.test(pathname);
  useEffect(() => {
    document.documentElement.classList.toggle("hide-navbar", isAppToolPage);
  }, [isAppToolPage]);

  return (
    <header
      className={cn(
        "site-navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-navy-dark/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/bvn-logo.png"
              alt="BVN Logo"
              width={52}
              height={52}
              className="group-hover:scale-105 transition-transform duration-200"
              priority
            />
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

            {/* Services Dropdown (Marketing + Operations) */}
            <GroupedDropdown
              label="Services"
              groups={servicesGroups}
              isActive={servicesActive}
            />

            {/* Media Dropdown (Apps + Blog) */}
            <GroupedDropdown
              label="Media"
              groups={mediaGroups}
              isActive={mediaActive}
            />

            {/* Courses */}
            <li>
              <Link
                href="/courses"
                className={cn(
                  "relative px-4 py-2 text-sm font-accent font-semibold transition-colors duration-200 rounded-md",
                  pathname.startsWith("/courses") ? "text-orange" : "text-white/80 hover:text-white"
                )}
              >
                Courses
                {pathname.startsWith("/courses") && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange rounded-full" />
                )}
              </Link>
            </li>

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

            {/* Dashboard — only when logged in */}
            {user && (
              <li>
                <Link
                  href="/dashboard"
                  className={cn(
                    "relative px-4 py-2 text-sm font-accent font-semibold transition-colors duration-200 rounded-md",
                    pathname.startsWith("/dashboard") ? "text-orange" : "text-white/80 hover:text-white"
                  )}
                >
                  Dashboard
                  {pathname.startsWith("/dashboard") && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange rounded-full" />
                  )}
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop CTA / Account */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/credits"
                  className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-accent font-semibold text-white/80 hover:text-white
                    rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  <Coins size={15} className="text-orange" />
                  Credits
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-lg bg-orange/10 border border-orange/25
                    hover:bg-orange/15 hover:border-orange/40 transition-all duration-200"
                >
                  <span className="w-7 h-7 rounded-full bg-orange/20 border border-orange/30 flex items-center justify-center">
                    <span className="text-[11px] font-heading font-bold text-orange">{initialsOf(user)}</span>
                  </span>
                  <span className="text-sm font-accent font-semibold text-orange">Dashboard</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-accent font-semibold text-white/80 hover:text-white
                    rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  <LogIn size={15} />
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-orange text-white text-sm font-heading font-semibold rounded-lg
                    shadow-[0_0_20px_rgba(232,96,16,0.4)] hover:bg-orange-light hover:shadow-[0_0_30px_rgba(232,96,16,0.6)]
                    transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
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

            {/* Services Accordion (Marketing + Operations) */}
            <MobileGroupAccordion
              label="Services"
              groups={servicesGroups}
              isActive={servicesActive}
              open={mobileServices}
              onToggle={() => setMobileServices((v) => !v)}
            />

            {/* Media Accordion (Apps + Blog) */}
            <MobileGroupAccordion
              label="Media"
              groups={mediaGroups}
              isActive={mediaActive}
              open={mobileMedia}
              onToggle={() => setMobileMedia((v) => !v)}
            />

            {/* Courses + Pricing + Contact (+ Dashboard when logged in) */}
            {[
              { label: "Courses", href: "/courses" },
              { label: "Pricing", href: "/pricing" },
              { label: "Contact", href: "/contact" },
              ...(user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
            ].map((link) => {
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

            {/* CTA / Account */}
            <div className="pt-2 pb-1 px-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/credits"
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-white/8 border border-white/10 text-white text-sm font-accent font-semibold rounded-lg
                      hover:bg-white/12 transition-all"
                  >
                    <Coins size={16} className="text-orange" />
                    Credits
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-orange text-white text-sm font-heading font-semibold rounded-lg
                      shadow-[0_0_20px_rgba(232,96,16,0.4)] hover:bg-orange-light transition-all"
                  >
                    <LayoutDashboard size={16} />
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 border border-white/15 text-white text-sm font-accent font-semibold rounded-lg
                        hover:bg-white/5 transition-all"
                    >
                      <LogIn size={15} />
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 text-center px-4 py-3 bg-white/8 border border-white/10 text-white text-sm font-accent font-semibold rounded-lg
                        hover:bg-white/12 transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                  <Link
                    href="/contact"
                    className="block text-center px-5 py-3 bg-orange text-white text-sm font-heading font-semibold rounded-lg
                      shadow-[0_0_20px_rgba(232,96,16,0.4)] hover:bg-orange-light transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
