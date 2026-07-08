"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Check, PartyPopper, Loader2, Smartphone } from "lucide-react";

const PHP_AMOUNT = 499; // BVN Pro one-time price in PHP (~$9)
const DESCRIPTION = "BVN Pro — VA Toolkit lifetime unlock";

const BENEFITS = [
  "Premium document themes across every tool",
  "Remove the “Built with BVN” footer from your exports",
  "Unlock all accent colors and styles",
  "Works on CV, Portfolio, Proposal, Contract & Onboarding tools",
  "One-time payment — yours forever, no subscription",
];

const TOOLS = [
  { label: "CV Builder", href: "/apps/cv-builder" },
  { label: "Portfolio Builder", href: "/apps/portfolio-builder" },
  { label: "Proposal Generator", href: "/apps/proposal-generator" },
  { label: "Contract Generator", href: "/apps/contract-generator" },
  { label: "Onboarding Kit", href: "/apps/onboarding-kit-generator" },
];

type Status = "idle" | "verifying" | "done" | "failed";

export default function ProPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [alreadyPro, setAlreadyPro] = useState(false);

  // On load: detect existing Pro, or verify a returning PayMongo payment.
  useEffect(() => {
    try {
      if (localStorage.getItem("bvn_pro") === "1") {
        setAlreadyPro(true);
        return;
      }
    } catch {
      /* ignore */
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      let sid: string | null = null;
      try {
        sid = localStorage.getItem("bvn_pro_session");
      } catch {
        /* ignore */
      }
      if (sid) {
        setStatus("verifying");
        verifyPayment(sid);
      } else {
        setStatus("failed");
        setError(
          "We couldn't find your payment session on this browser. If you completed payment, email bvn@bvnofficial.com and we'll unlock it."
        );
      }
    }
  }, []);

  async function verifyPayment(sessionId: string) {
    try {
      const res = await fetch(`/api/payment/verify?session_id=${encodeURIComponent(sessionId)}`);
      const d = await res.json();
      if (d.status === "paid" || d.status === "succeeded") {
        try {
          localStorage.setItem("bvn_pro", "1");
          localStorage.setItem(
            "bvn_pro_meta",
            JSON.stringify({ email: d.customerEmail || "", session: sessionId, at: Date.now() })
          );
          localStorage.removeItem("bvn_pro_session");
        } catch {
          /* ignore */
        }
        setStatus("done");
      } else {
        setStatus("failed");
        setError(
          "Your payment isn't confirmed yet. If you just paid, refresh this page in a moment — or email bvn@bvnofficial.com."
        );
      }
    } catch {
      setStatus("failed");
      setError("We couldn't verify your payment. Please refresh, or contact bvn@bvnofficial.com.");
    }
  }

  async function pay() {
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          amount: PHP_AMOUNT,
          description: DESCRIPTION,
          successPath: "/apps/pro?paid=1",
        }),
      });
      const d = await res.json();
      if (d.checkoutUrl) {
        try {
          if (d.sessionId) localStorage.setItem("bvn_pro_session", d.sessionId);
        } catch {
          /* ignore */
        }
        window.location.href = d.checkoutUrl;
      } else {
        setError(d.error || "Could not start checkout. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  const showSuccess = alreadyPro || status === "done";

  return (
    <div className="min-h-screen bg-navy-dark flex flex-col">
      <div className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/10 bg-navy-dark/80 backdrop-blur-xl">
        <Link
          href="/apps"
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-accent font-semibold transition-colors"
        >
          <ArrowLeft size={16} /> Back to Apps
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange/20 flex items-center justify-center">
            <Sparkles size={14} className="text-orange" />
          </div>
          <span className="text-white/80 text-sm font-accent font-semibold">BVN Pro</span>
        </div>
        <div className="w-24" />
      </div>

      <div className="flex-1 px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block font-accent font-semibold text-xs tracking-[0.2em] uppercase text-orange mb-4 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20">
              BVN Pro
            </span>
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-3 leading-tight">
              Unlock the full VA toolkit
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
              Keep every tool free forever — or upgrade once to make your documents look truly
              premium and remove all BVN branding.
            </p>
          </div>

          {status === "verifying" ? (
            <div className="max-w-md mx-auto text-center bg-white/[0.04] border border-white/10 rounded-3xl p-10">
              <Loader2 size={34} className="text-orange animate-spin mx-auto mb-4" />
              <h2 className="font-heading font-bold text-xl text-white mb-1">Confirming your payment…</h2>
              <p className="text-white/50 text-sm">One moment while we unlock BVN Pro.</p>
            </div>
          ) : showSuccess ? (
            <div className="max-w-md mx-auto text-center bg-white/[0.04] border border-emerald-500/25 rounded-3xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-5">
                <PartyPopper size={28} className="text-emerald-400" />
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white mb-2">
                {status === "done" ? "You’re now BVN Pro!" : "You already have BVN Pro"}
              </h2>
              <p className="text-white/55 text-sm mb-6 leading-relaxed">
                Premium themes and branding-free exports are unlocked on this browser. Open any tool
                and pick a premium theme.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TOOLS.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-accent font-semibold hover:border-orange/40 hover:bg-white/[0.07] transition-all"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
              {/* Benefits */}
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-heading font-extrabold text-4xl text-white">₱499</span>
                  <span className="text-white/45 text-sm font-accent">one-time · lifetime</span>
                </div>
                <p className="text-white/40 text-xs font-accent mb-6">
                  ≈ $9 · Pay with GCash or any debit/credit card.
                </p>
                <ul className="space-y-3">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-white/75 text-sm leading-relaxed">
                      <span className="w-5 h-5 mt-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-emerald-400" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checkout */}
              <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8">
                <h2 className="font-heading font-bold text-white text-lg mb-4">Upgrade to Pro</h2>
                <label className="block text-white/50 text-xs font-accent font-semibold mb-1.5">
                  Your name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maria Santos"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange/40 mb-4"
                />
                <label className="block text-white/50 text-xs font-accent font-semibold mb-1.5">
                  Email (your receipt goes here)
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maria@email.com"
                  type="email"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange/40 mb-5"
                />

                {error && <p className="text-rose-400 text-xs mb-3 leading-relaxed">{error}</p>}

                <button
                  onClick={pay}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-heading font-semibold text-base bg-orange text-white shadow-[0_0_24px_rgba(232,96,16,0.4)] hover:bg-orange-light active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" /> Starting checkout…
                    </>
                  ) : (
                    <>
                      <Smartphone size={17} /> Pay ₱499 with GCash / Card
                    </>
                  )}
                </button>

                <p className="text-center text-white/30 text-xs mt-4 leading-relaxed">
                  Secure checkout via PayMongo. Unlock applies to this browser. Tools stay 100% free —
                  Pro only adds premium themes and removes branding.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
