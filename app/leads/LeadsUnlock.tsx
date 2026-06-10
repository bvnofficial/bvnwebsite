"use client";

import { useState } from "react";
import { Lock, Loader2, ArrowRight } from "lucide-react";

export default function LeadsUnlock({ notConfigured = false }: { notConfigured?: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/leads-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Incorrect password.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex items-center justify-center px-5">
      <div className="grid-bg absolute inset-0 opacity-30 pointer-events-none" />
      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-orange/15 border border-orange/30 flex items-center justify-center mb-4">
            <Lock size={22} className="text-orange" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl">BVN Lead Tracker</h1>
          <p className="text-white/45 text-sm mt-1">Private — enter the password to continue.</p>
        </div>

        {notConfigured ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200/90">
            The tracker password isn&apos;t set yet. Add <code className="text-amber-100">LEADS_PASSWORD</code> to your
            environment variables and redeploy.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-orange/50 transition-colors"
            />
            {error && <p className="text-rose-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange text-white font-accent font-semibold hover:bg-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Unlock <ArrowRight size={15} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
