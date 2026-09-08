"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Loader2, AlertCircle, ArrowRight, CheckCircle2, Gauge, Sparkles, ShieldCheck,
  Zap, CalendarCheck,
} from "lucide-react";
import type { AuditResult } from "@/lib/audit";
import PayPalCheckout from "@/app/payments/PayPalCheckout";

const LOADING_STEPS = [
  "Scanning your website…",
  "Checking SEO & findability…",
  "Analyzing conversion & tracking…",
  "Writing your growth plan…",
];

function scoreColor(s: number) {
  if (s >= 75) return "#10b981";
  if (s >= 50) return "#f59e0b";
  return "#ef4444";
}

const impactStyle: Record<string, string> = {
  high: "bg-red-500/15 text-red-300 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  low: "bg-white/10 text-white/50 border-white/15",
};

export default function AuditClient() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ audit: AuditResult; url: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!url.trim()) return setError("Enter your website address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setError("Enter a valid email so we can send your full report.");

    setLoading(true);
    setStep(0);
    const ticker = setInterval(() => setStep((s) => (s < LOADING_STEPS.length - 1 ? s + 1 : s)), 3500);
    try {
      const res = await fetch("/api/growth-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), email: email.trim(), name: name.trim(), industry: industry.trim() }),
      });
      const d = await res.json();
      if (res.ok && d.ok) {
        setResult({ audit: d.audit, url: d.url });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(d.error || "Could not generate your audit. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      clearInterval(ticker);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {!result ? (
          <>
            {/* Hero */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/30 text-orange text-xs font-accent font-semibold mb-5">
                <Sparkles size={13} /> Free AI Growth Audit
              </div>
              <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-white leading-tight mb-4">
                Is your website <span className="text-orange">costing you customers?</span>
              </h1>
              <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                Get an instant, AI-powered audit of your website & marketing. See your growth score,
                what&apos;s holding you back, and a 3-step plan to fix it — in about 60 seconds.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={submit}
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/40"
            >
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-5 text-red-300 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <label className="block text-white/60 text-xs font-accent font-semibold uppercase tracking-wider mb-2">
                Your website
              </label>
              <div className="relative mb-4">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="yourbusiness.com"
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-orange/50"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white/60 text-xs font-accent font-semibold uppercase tracking-wider mb-2">
                    Email <span className="text-white/30 normal-case">(we send your full report)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-orange/50"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-accent font-semibold uppercase tracking-wider mb-2">
                    Name <span className="text-white/30 normal-case">(optional)</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-orange/50"
                  />
                </div>
              </div>

              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Industry (optional) — e.g. dentist, real estate, e-commerce"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-orange/50 mb-6 text-sm"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-orange text-white font-heading font-semibold rounded-xl shadow-[0_0_24px_rgba(232,96,16,0.35)] hover:bg-orange-light disabled:opacity-60 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Gauge size={18} />}
                {loading ? LOADING_STEPS[step] : "Get my free audit"}
              </button>
              <p className="text-center text-white/30 text-xs mt-3 flex items-center justify-center gap-1.5">
                <ShieldCheck size={12} /> Free · No obligation · Takes ~60 seconds
              </p>
            </form>

            <p className="text-center text-white/30 text-sm mt-6">
              Trusted by 238+ businesses worldwide · Built by BVN Digital Agency
            </p>
          </>
        ) : (
          <Results
            audit={result.audit}
            url={result.url}
            name={name}
            email={email}
            onReset={() => { setResult(null); setUrl(""); }}
          />
        )}
      </div>
    </div>
  );
}

function Results({
  audit, url, name, email, onReset,
}: {
  audit: AuditResult;
  url: string;
  name: string;
  email: string;
  onReset: () => void;
}) {
  const [paid, setPaid] = useState(false);
  const [payErr, setPayErr] = useState("");
  return (
    <div>
      {/* Score header */}
      <div className="text-center mb-8">
        <p className="text-white/40 text-sm font-body mb-4">Growth audit for <span className="text-white/70">{url}</span></p>
        <div
          className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4"
          style={{ background: `${scoreColor(audit.overallScore)}22`, border: `3px solid ${scoreColor(audit.overallScore)}` }}
        >
          <span className="text-5xl font-heading font-extrabold" style={{ color: scoreColor(audit.overallScore) }}>
            {audit.overallScore}
          </span>
        </div>
        <p className="text-white/40 text-xs font-accent uppercase tracking-widest mb-3">Overall growth score</p>
        <h1 className="font-heading font-bold text-xl md:text-2xl text-white max-w-2xl mx-auto leading-snug">
          {audit.verdict}
        </h1>
      </div>

      {/* Biggest opportunity */}
      <div className="bg-orange/10 border border-orange/25 rounded-2xl p-5 mb-6 flex items-start gap-3">
        <Sparkles size={18} className="text-orange shrink-0 mt-0.5" />
        <p className="text-white/85 text-sm leading-relaxed">
          <span className="font-heading font-semibold text-orange">Biggest opportunity: </span>
          {audit.biggestOpportunity}
        </p>
      </div>

      {/* Category scores */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-accent font-bold text-white/50 uppercase tracking-widest mb-4">Score breakdown</h2>
        <div className="space-y-4">
          {audit.categories.map((c) => (
            <div key={c.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-white font-body">{c.name}</span>
                <span className="text-sm font-heading font-bold" style={{ color: scoreColor(c.score) }}>{c.score}</span>
              </div>
              <div className="h-2 rounded-full bg-white/8 overflow-hidden mb-1.5">
                <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: scoreColor(c.score) }} />
              </div>
              <p className="text-white/45 text-xs leading-relaxed">{c.insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top fixes */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-accent font-bold text-white/50 uppercase tracking-widest mb-4">Top fixes</h2>
        <ul className="space-y-4">
          {audit.issues.map((i, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-white/8 text-white/60 text-xs font-bold flex items-center justify-center mt-0.5">{idx + 1}</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-heading font-semibold text-sm">{i.title}</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${impactStyle[i.impact] || impactStyle.low}`}>{i.impact}</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mt-0.5">{i.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Plan */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-accent font-bold text-white/50 uppercase tracking-widest mb-4">Your 3-step growth plan</h2>
        <ol className="space-y-3">
          {audit.plan.map((p, idx) => (
            <li key={idx} className="flex gap-3 text-white/80 text-sm">
              <CheckCircle2 size={17} className="text-emerald-400 shrink-0 mt-0.5" /> {p}
            </li>
          ))}
        </ol>
      </div>

      {/* Premium Growth Plan — $49 upsell (self-liquidating offer) */}
      {paid ? (
        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-3xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 mb-4">
            <CheckCircle2 size={26} className="text-emerald-400" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-white mb-2">Payment received — thank you!</h2>
          <p className="text-white/55 text-sm mb-6 max-w-md mx-auto">
            Your Premium Growth Plan is on its way. Book your 20-minute strategy call now and we&apos;ll walk
            you through exactly how to fix your site.
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-orange text-white font-heading font-semibold rounded-xl hover:bg-orange-light transition-all"
          >
            <CalendarCheck size={17} /> Book my strategy call
          </Link>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1206] to-[#0d1220] border border-orange/40 rounded-3xl p-7 md:p-9">
          <div className="pointer-events-none absolute -top-16 -right-10 w-56 h-56 rounded-full bg-orange/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-orange" />
              <span className="text-orange font-accent font-bold text-xs uppercase tracking-widest">Premium Growth Plan</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-heading font-extrabold text-4xl text-white">$49</span>
              <span className="text-white/40 text-sm">one-time · done-with-you</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {[
                "A personalized, prioritized action plan for your exact site",
                "A 20-minute 1-on-1 strategy call with a BVN expert",
                "The fixes ranked by ROI — know what to do first",
                "Priority email support to get it done",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-white/80 text-sm">
                  <CheckCircle2 size={16} className="text-orange shrink-0 mt-0.5" /> {b}
                </li>
              ))}
            </ul>

            {payErr && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 mb-4 text-red-300 text-sm">
                <AlertCircle size={15} /> {payErr}
              </div>
            )}

            <PayPalCheckout
              amount="49.00"
              currency="USD"
              name={name.trim() || "Growth Audit Customer"}
              email={email.trim()}
              description={`Premium Growth Plan — ${url} (score ${audit.overallScore}/100)`}
              onSuccess={() => {
                setPaid(true);
                setPayErr("");
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
              }}
              onError={(m) => setPayErr(m)}
            />

            <p className="text-center text-white/30 text-xs mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} /> Secure payment · Instant booking after checkout
            </p>
          </div>
        </div>
      )}

      {/* Secondary: free call */}
      {!paid && (
        <div className="text-center mt-6">
          <p className="text-white/40 text-sm mb-3">
            Not ready? We already emailed your full report — or book a free intro call.
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/15 text-white/80 font-heading font-semibold text-sm rounded-xl hover:bg-white/5 transition-all"
          >
            Book a free 20-min call <ArrowRight size={15} />
          </Link>
        </div>
      )}

      <div className="text-center mt-6">
        <button onClick={onReset} className="text-white/40 hover:text-white text-sm font-accent transition-colors">
          ← Audit another website
        </button>
      </div>
    </div>
  );
}
