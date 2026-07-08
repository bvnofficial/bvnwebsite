"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, Coins, Check, AlertCircle, Plus, Minus } from "lucide-react";

interface Props {
  adminEmail: string;
}

interface Result {
  ok: boolean;
  text: string;
  balance?: number;
}

export default function AdminClient({ adminEmail }: Props) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<number>(10);
  const [sign, setSign] = useState<1 | -1>(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

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
      <div className="max-w-lg mx-auto px-6 md:px-12">
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
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
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

        <p className="text-center text-white/25 text-xs font-body mt-4">
          The account must have registered on the site first. Adjustments appear instantly in their wallet.
        </p>
      </div>
    </div>
  );
}
