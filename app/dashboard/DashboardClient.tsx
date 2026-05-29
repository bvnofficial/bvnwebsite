"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  LogOut, Users, BarChart2, Mail, Globe, TrendingUp,
  Settings, BookOpen, ShoppingBag, ChevronRight, Bell
} from "lucide-react";

interface Props {
  user: { email: string; name?: string };
}

const stats = [
  { label: "Active Clients", value: "238+", change: "+12%", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { label: "Campaigns Running", value: "14", change: "+3 this month", icon: BarChart2, color: "text-orange", bg: "bg-orange/10", border: "border-orange/20" },
  { label: "Leads This Week", value: "30", change: "UK · US · AU", icon: Mail, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { label: "Site Visitors", value: "4.2k", change: "+18% vs last week", icon: Globe, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
];

const quickLinks = [
  { label: "Marketing Services", href: "/marketing", icon: TrendingUp, desc: "Manage campaigns & services" },
  { label: "Operations", href: "/operations", icon: Settings, desc: "AI agents & automation" },
  { label: "Blog", href: "/blog", icon: BookOpen, desc: "Content & articles" },
  { label: "Shop (x1r)", href: "https://x1r.shop", icon: ShoppingBag, desc: "x1r store management", external: true },
];

export default function DashboardClient({ user }: Props) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = user.name || user.email.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] pt-20">
      {/* Top bar */}
      <div className="bg-[#111827]/80 backdrop-blur-xl border-b border-white/10 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange/20 border border-orange/30 flex items-center justify-center">
              <span className="text-xs font-heading font-bold text-orange">{initials}</span>
            </div>
            <div>
              <p className="text-sm font-heading font-semibold text-white">{displayName}</p>
              <p className="text-[11px] text-white/40 font-body">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
              <Bell size={16} />
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10
                text-xs font-accent font-semibold transition-all disabled:opacity-50"
            >
              {loggingOut ? (
                <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogOut size={13} />
              )}
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/bvn-logo.png" alt="BVN" width={40} height={40} />
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">
                Hey, {displayName.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-white/40 font-body">BVN Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-[#111827] border ${stat.border} rounded-2xl p-5 flex flex-col gap-3`}
            >
              <div className={`w-9 h-9 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                <stat.icon size={17} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50 font-body mt-0.5">{stat.label}</p>
              </div>
              <p className={`text-[11px] font-accent font-semibold ${stat.color}`}>{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mb-10">
          <h2 className="text-sm font-accent font-bold text-white/40 uppercase tracking-widest mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="group bg-[#111827] border border-white/10 rounded-2xl p-5 flex items-center gap-4
                  hover:border-orange/30 hover:bg-orange/5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center shrink-0
                  group-hover:bg-orange/20 transition-colors">
                  <link.icon size={18} className="text-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-accent font-semibold text-white group-hover:text-orange transition-colors">{link.label}</p>
                  <p className="text-xs text-white/40 font-body truncate">{link.desc}</p>
                </div>
                <ChevronRight size={14} className="text-white/20 group-hover:text-orange/60 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Account info */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-accent font-bold text-white/40 uppercase tracking-widest mb-4">
            Account
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange/20 border border-orange/30 flex items-center justify-center">
                <span className="text-lg font-heading font-bold text-orange">{initials}</span>
              </div>
              <div>
                <p className="font-heading font-semibold text-white">{displayName}</p>
                <p className="text-sm text-white/40 font-body">{user.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-orange/10 border border-orange/20 rounded-full text-[10px] font-accent font-bold text-orange uppercase tracking-wide">
                  Admin
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 px-4 py-2.5 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/10
                text-sm font-accent font-semibold transition-all disabled:opacity-50 self-start sm:self-auto"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
