"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  LogOut, ChevronRight,
  User, Lock, Check, AlertCircle, Pencil, Coins, Shield,
  BookOpen, CreditCard, Rocket, LifeBuoy, FileText, Download,
} from "lucide-react";

interface DocItem {
  kind: string;
  title: string;
  refId: string;
  pdfUrl: string;
  verifyUrl: string;
}

interface Props {
  user: { email: string; name?: string; createdAt?: string };
  credits?: number;
  admin?: boolean;
  documents?: DocItem[];
}

// Customer-facing shortcuts — every destination is a real, live page.
const quickLinks = [
  { label: "My Courses", href: "/courses", icon: BookOpen, desc: "Browse & continue learning" },
  { label: "Credits & Wallet", href: "/credits", icon: Coins, desc: "Top up & unlock premium items" },
  { label: "Make a Payment", href: "/payments", icon: CreditCard, desc: "Pay by card, PayPal or crypto" },
  { label: "Start a Project", href: "/get-started", icon: Rocket, desc: "Tell us what you need" },
  { label: "Support", href: "/contact", icon: LifeBuoy, desc: "Get help from the BVN team" },
];

export default function DashboardClient({ user, credits = 0, admin = false, documents = [] }: Props) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Profile (name) editing
  const [name, setName] = useState(user.name || "");
  const [editingName, setEditingName] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const displayName = name || user.email.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setNameMsg(null);
    setSavingName(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    setSavingName(false);
    if (error) {
      setNameMsg({ ok: false, text: error.message });
    } else {
      setNameMsg({ ok: true, text: "Name updated." });
      setEditingName(false);
      router.refresh();
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (newPassword.length < 6) {
      setPwMsg({ ok: false, text: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ ok: false, text: "Passwords do not match." });
      return;
    }
    setSavingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      setPwMsg({ ok: false, text: error.message });
    } else {
      setPwMsg({ ok: true, text: "Password updated." });
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] pt-20">
      {/* Top bar */}
      <div className="bg-[#111827]/80 backdrop-blur-xl border-b border-white/10 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange/20 border border-orange/30 flex items-center justify-center">
              <span className="text-xs font-heading font-bold text-orange">{initials}</span>
            </div>
            <div>
              <p className="text-sm font-heading font-semibold text-white">{displayName}</p>
              <p className="text-[11px] text-white/40 font-body">{user.email}</p>
            </div>
          </div>
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

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/bvn-logo.png" alt="BVN" width={40} height={40} />
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">
                Hey, {displayName.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-white/40 font-body">Welcome to your BVN account</p>
            </div>
          </div>

          {/* Credits balance chip (+ admin shortcut for the admin account only) */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Link
              href="/credits"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange/10 border border-orange/25
                hover:bg-orange/15 hover:border-orange/40 transition-all"
            >
              <Coins size={15} className="text-orange" />
              <span className="text-sm font-heading font-bold text-white">{credits}</span>
              <span className="text-xs font-accent text-white/50">credits</span>
              <ChevronRight size={13} className="text-orange/60" />
            </Link>

            {admin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10
                  hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Shield size={15} className="text-white/60" />
                <span className="text-xs font-accent font-semibold text-white/70">Admin Panel</span>
                <ChevronRight size={13} className="text-white/30" />
              </Link>
            )}
          </div>
        </div>

        {/* Your Documents — shown when a certificate is issued to this account */}
        {documents.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-accent font-bold text-white/40 uppercase tracking-widest mb-4">
              Your Documents
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.refId}
                  className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex flex-wrap items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-accent font-semibold text-white">{doc.kind}</p>
                    <p className="text-xs text-white/40 font-body truncate">
                      {doc.title} · Ref {doc.refId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={doc.pdfUrl}
                      download
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange text-white text-xs font-accent font-semibold hover:bg-orange-light transition-all"
                    >
                      <Download size={13} /> Download PDF
                    </a>
                    <Link
                      href={doc.verifyUrl}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs font-accent font-semibold hover:bg-white/10 transition-all"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Access */}
        <div className="mb-10">
          <h2 className="text-sm font-accent font-bold text-white/40 uppercase tracking-widest mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
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

        {/* Profile */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-accent font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Profile
            </h2>
            {!editingName && (
              <button
                onClick={() => { setEditingName(true); setNameMsg(null); }}
                className="flex items-center gap-1.5 text-xs font-accent font-semibold text-white/50 hover:text-orange transition-colors"
              >
                <Pencil size={12} /> Edit
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange/20 border border-orange/30 flex items-center justify-center shrink-0">
              <span className="text-lg font-heading font-bold text-orange">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="font-heading font-semibold text-white truncate">{displayName}</p>
              <p className="text-sm text-white/40 font-body truncate">{user.email}</p>
              {memberSince && (
                <p className="text-[11px] text-white/30 font-body mt-0.5">Member since {memberSince}</p>
              )}
            </div>
          </div>

          {editingName && (
            <form onSubmit={handleSaveName} className="space-y-3 border-t border-white/10 pt-4">
              <div>
                <label className="block text-xs font-accent font-semibold text-white/60 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 font-body
                    focus:outline-none focus:border-orange/50 focus:bg-white/8 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={savingName}
                  className="flex items-center gap-1.5 px-4 py-2 bg-orange text-white font-accent font-semibold text-xs rounded-lg
                    hover:bg-orange-light disabled:opacity-50 transition-all"
                >
                  {savingName ? (
                    <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check size={13} />
                  )}
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingName(false); setName(user.name || ""); setNameMsg(null); }}
                  className="px-4 py-2 text-white/50 hover:text-white font-accent font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {nameMsg && (
            <p className={`flex items-center gap-1.5 text-xs font-body mt-3 ${nameMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
              {nameMsg.ok ? <Check size={13} /> : <AlertCircle size={13} />} {nameMsg.text}
            </p>
          )}
        </div>

        {/* Security */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-accent font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Lock size={14} /> Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
            <div>
              <label className="block text-xs font-accent font-semibold text-white/60 mb-1.5 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 font-body
                  focus:outline-none focus:border-orange/50 focus:bg-white/8 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-accent font-semibold text-white/60 mb-1.5 uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 font-body
                  focus:outline-none focus:border-orange/50 focus:bg-white/8 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/8 border border-white/10 text-white font-accent font-semibold text-xs rounded-lg
                hover:bg-white/12 disabled:opacity-50 transition-all"
            >
              {savingPassword ? (
                <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Lock size={13} />
              )}
              Update Password
            </button>
            {pwMsg && (
              <p className={`flex items-center gap-1.5 text-xs font-body mt-1 ${pwMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
                {pwMsg.ok ? <Check size={13} /> : <AlertCircle size={13} />} {pwMsg.text}
              </p>
            )}
          </form>
        </div>

        {/* Sign out (footer) */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 px-4 py-2.5 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/10
            text-sm font-accent font-semibold transition-all disabled:opacity-50"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
