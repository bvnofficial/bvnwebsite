"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Shield, Coins, Check, AlertCircle, Plus, Minus,
  Users, Search, ShoppingBag, Wallet,
} from "lucide-react";
import type { AdminUserRow } from "@/lib/admin-data";

interface Props {
  adminEmail: string;
  users: AdminUserRow[];
  creditsReady: boolean;
}

interface Result {
  ok: boolean;
  text: string;
  balance?: number;
}

export default function AdminClient({ adminEmail, users, creditsReady }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<number>(10);
  const [sign, setSign] = useState<1 | -1>(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [query, setQuery] = useState("");

  // Summary stats.
  const totalUsers = users.length;
  const buyers = users.filter((u) => u.purchased > 0).length;
  const creditsOutstanding = users.reduce((sum, u) => sum + u.balance, 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || (u.name || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  // Prefill the adjust form with a user's email and scroll to it.
  function creditUser(userEmail: string) {
    setEmail(userEmail);
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    if (!email.trim()) {
      setResult({ ok: false, text: "Enter an account email." });
      return;
    }
    const signed = sign * Math.abs(Math.trunc(amount || 0));
    if (!signed) {
      setResult({ ok: false, text: "Enter a non-zero amount." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), amount: signed, note }),
      });
      const d = await res.json();
      if (res.ok && d.ok) {
        setResult({
          ok: true,
          text: `${signed > 0 ? "Added" : "Removed"} ${Math.abs(signed)} credits ${
            signed > 0 ? "to" : "from"
          } ${d.email}.`,
          balance: d.balance,
        });
        setNote("");
        router.refresh(); // refresh the user table with new balances
      } else {
        setResult({ ok: false, text: d.error || "Adjustment failed." });
      }
    } catch {
      setResult({ ok: false, text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-accent font-semibold text-white/40 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={13} /> Back to dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Image src="/bvn-logo.png" alt="BVN" width={40} height={40} />
          <div>
            <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-heading font-bold text-white">
              Admin <Shield size={20} className="text-orange" />
            </h1>
            <p className="text-sm text-white/40 font-body">{adminEmail}</p>
          </div>
        </div>

        {/* Manual credit adjustment */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 max-w-lg">
          <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/50 uppercase tracking-widest mb-5">
            <Coins size={14} className="text-orange" /> Adjust Credits
          </h2>

          {result && (
            <div
              className={`flex items-start gap-2 rounded-xl px-4 py-3 mb-5 text-sm font-body border ${
                result.ok
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-red-500/10 border-red-500/20 text-red-300"
              }`}
            >
              {result.ok ? <Check size={15} className="mt-0.5 shrink-0" /> : <AlertCircle size={15} className="mt-0.5 shrink-0" />}
              <div>
                {result.text}
                {typeof result.balance === "number" && (
                  <span className="block text-white/60 text-xs mt-0.5">
                    New balance: <span className="font-semibold text-white">{result.balance} credits</span>
                  </span>
                )}
              </div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-accent font-semibold text-white/60 mb-1.5 uppercase tracking-wider">
                Account Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 font-body
                  focus:outline-none focus:border-orange/50 focus:bg-white/8 transition-all"
              />
            </div>

            {/* Amount + direction */}
            <div>
              <label className="block text-xs font-accent font-semibold text-white/60 mb-1.5 uppercase tracking-wider">
                Amount (credits)
              </label>
              <div className="flex gap-2">
                <div className="flex rounded-xl border border-white/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setSign(1)}
                    className={`flex items-center gap-1 px-3 text-sm font-accent font-semibold transition-colors ${
                      sign === 1 ? "bg-emerald-500/20 text-emerald-300" : "bg-white/[0.03] text-white/40 hover:text-white/70"
                    }`}
                  >
                    <Plus size={13} /> Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setSign(-1)}
                    className={`flex items-center gap-1 px-3 text-sm font-accent font-semibold transition-colors ${
                      sign === -1 ? "bg-red-500/20 text-red-300" : "bg-white/[0.03] text-white/40 hover:text-white/70"
                    }`}
                  >
                    <Minus size={13} /> Remove
                  </button>
                </div>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-body
                    focus:outline-none focus:border-orange/50 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-accent font-semibold text-white/60 mb-1.5 uppercase tracking-wider">
                Note <span className="text-white/30 normal-case">(optional — shows in their history)</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Refund, promo, manual top-up"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 font-body
                  focus:outline-none focus:border-orange/50 focus:bg-white/8 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange text-white font-heading font-semibold text-sm rounded-xl
                shadow-[0_0_20px_rgba(232,96,16,0.35)] hover:bg-orange-light disabled:opacity-50 transition-all mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Coins size={15} />
                  {sign === 1 ? "Add Credits" : "Remove Credits"}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-white/25 text-xs font-body mt-3 max-w-lg">
          The account must have registered on the site first. Adjustments appear instantly in their wallet.
        </p>

        {/* ── Registered users ────────────────────────────────────────────── */}
        <div className="mt-12">
          <h2 className="flex items-center gap-2 text-sm font-accent font-bold text-white/50 uppercase tracking-widest mb-4">
            <Users size={15} className="text-orange" /> Registered Users
          </h2>

          {/* Summary chips */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-white/40 text-[11px] font-accent uppercase tracking-wider mb-1">
                <Users size={12} /> Registered
              </div>
              <p className="text-2xl font-heading font-bold text-white">{totalUsers}</p>
            </div>
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-white/40 text-[11px] font-accent uppercase tracking-wider mb-1">
                <ShoppingBag size={12} /> Buyers
              </div>
              <p className="text-2xl font-heading font-bold text-emerald-400">{buyers}</p>
            </div>
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-white/40 text-[11px] font-accent uppercase tracking-wider mb-1">
                <Wallet size={12} /> Credits Out
              </div>
              <p className="text-2xl font-heading font-bold text-orange">{creditsOutstanding}</p>
            </div>
          </div>

          {!creditsReady && (
            <div className="flex items-start gap-2 bg-amber-500/8 border border-amber-500/25 rounded-xl px-4 py-3 mb-4">
              <AlertCircle size={15} className="text-amber-300 shrink-0 mt-0.5" />
              <p className="text-white/50 text-xs leading-relaxed">
                Credit balances show 0 until the credits SQL migration is run in Supabase. User list is accurate.
              </p>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by email or name…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 font-body
                focus:outline-none focus:border-orange/50 focus:bg-white/8 transition-all"
            />
          </div>

          {/* Table */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/40 text-[11px] font-accent uppercase tracking-wider border-b border-white/10">
                    <th className="px-4 py-3 font-semibold">User</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 font-semibold">Last Active</th>
                    <th className="px-4 py-3 font-semibold text-right">Bought</th>
                    <th className="px-4 py-3 font-semibold text-right">Balance</th>
                    <th className="px-4 py-3 font-semibold">Items Used</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-white/40 font-body">
                        {users.length === 0 ? "No registered users yet." : "No users match your search."}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-white font-body font-semibold leading-tight">
                            {u.name || u.email.split("@")[0]}
                          </p>
                          <p className="text-white/40 text-xs font-body">{u.email}</p>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs font-body whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs font-body whitespace-nowrap">
                          {u.lastActive ? (
                            new Date(u.lastActive).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          ) : (
                            <span className="text-white/25">Never</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {u.purchased > 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-heading font-semibold">
                              {u.purchased}
                            </span>
                          ) : (
                            <span className="text-white/25">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-white font-heading font-bold">{u.balance}</span>
                        </td>
                        <td className="px-4 py-3">
                          {u.items.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {u.items.map((it, i) => (
                                <span
                                  key={i}
                                  className="inline-block bg-orange/10 border border-orange/20 text-orange/90 px-2 py-0.5 rounded-md text-[11px] font-accent whitespace-nowrap"
                                >
                                  {it}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/25">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => creditUser(u.email)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange/10 border border-orange/25
                              text-orange text-xs font-accent font-semibold hover:bg-orange/20 transition-all whitespace-nowrap"
                          >
                            <Coins size={12} /> Credit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-white/25 text-xs font-body mt-3">
            Showing {filtered.length} of {totalUsers} users. &quot;Bought&quot; = credits purchased via top-up
            (excludes manual admin adjustments). Click <span className="text-orange">Credit</span> to pre-fill the form above.
          </p>
        </div>
      </div>
    </div>
  );
}
