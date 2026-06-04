"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, CheckCircle, AlertCircle, ChevronRight, Shield, ChevronDown } from "lucide-react";

const FALLBACK_TO_PHP: Record<string, number> = {
  USD: 56, PHP: 1, GBP: 72, AUD: 37, EUR: 61, SGD: 42,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", PHP: "₱", GBP: "£", AUD: "A$", EUR: "€", SGD: "S$",
};

const PRESETS: Record<string, string[]> = {
  USD: ["100", "300", "500", "1000", "2500"],
  PHP: ["500", "1000", "2500", "5000", "10000"],
  GBP: ["100", "250", "500", "1000", "2000"],
  AUD: ["150", "300", "500", "1000", "2500"],
  EUR: ["100", "250", "500", "1000", "2000"],
  SGD: ["100", "300", "500", "1000", "2500"],
};

const CURRENCIES = ["USD", "PHP", "GBP", "AUD", "EUR", "SGD"];

function fmt(amount: string, currency: string) {
  if (!amount || isNaN(Number(amount))) return CURRENCY_SYMBOLS[currency] + "0";
  return CURRENCY_SYMBOLS[currency] + Number(amount).toLocaleString("en-US");
}

function PaymentsForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlAmount = searchParams.get("amount") || "";
  const urlDescription = searchParams.get("description") || "";
  const urlPlan = searchParams.get("plan") || "";

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [toPhp, setToPhp] = useState<Record<string, number>>(FALLBACK_TO_PHP);
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/PHP")
      .then((r) => r.json())
      .then((data) => {
        if (data?.rates) {
          const rates: Record<string, number> = { PHP: 1 };
          for (const c of CURRENCIES.filter((x) => x !== "PHP")) {
            if (data.rates[c]) rates[c] = Math.round((1 / data.rates[c]) * 100) / 100;
          }
          setToPhp(rates);
        }
      })
      .catch(() => {})
      .finally(() => setRatesLoading(false));
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState(urlDescription);
  const [currency, setCurrency] = useState("USD");

  const presets = PRESETS[currency];
  const sym = CURRENCY_SYMBOLS[currency];
  const initPreset = urlAmount
    ? presets.includes(urlAmount) ? urlAmount : "custom"
    : presets[1];

  const [selectedAmt, setSelectedAmt] = useState(initPreset);
  const [customAmt, setCustomAmt] = useState(
    urlAmount && !presets.includes(urlAmount) ? urlAmount : ""
  );

  const rawAmount = selectedAmt === "custom" ? customAmt.replace(/[^0-9.]/g, "") : selectedAmt;
  const phpAmount = rawAmount ? Math.round(Number(rawAmount) * (toPhp[currency] ?? FALLBACK_TO_PHP[currency])) : 0;
  const displayAmount = fmt(rawAmount, currency);
  const phpDisplay = phpAmount ? "₱" + phpAmount.toLocaleString("en-PH") : "₱0";

  function selectCurrency(c: string) {
    setCurrency(c);
    setCurrencyOpen(false);
    setSelectedAmt(PRESETS[c][1]);
    setCustomAmt("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg("");

    if (!name || !email) {
      setErrMsg("Please fill in your name and email.");
      return;
    }
    if (!rawAmount || Number(rawAmount) < 1) {
      setErrMsg("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/nowpayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          amount: rawAmount,
          currency,
          description: description || urlPlan || undefined,
        }),
      });
      const data = await res.json();
      if (data.invoiceUrl) {
        router.push(data.invoiceUrl);
      } else {
        setErrMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setErrMsg("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06060c] py-24 px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(212,175,55,0.12), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <Image src="/bvn-logo.png" alt="BVN" width={44} height={44} />
            <span className="font-heading font-extrabold text-white text-xl tracking-widest">BVN</span>
          </Link>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-2">
            {urlPlan ? `${urlPlan} — Secure Payment` : "Secure Payment"}
          </h1>
          <p className="text-white/30 text-sm tracking-widest uppercase font-sans text-xs">
            Encrypted · Secure · Instant Settlement
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left Col ── */}
            <div className="lg:col-span-1 space-y-4">

              {/* Currency + Amount */}
              <div className="bg-[#0e0e1a] border border-white/8 rounded-2xl p-5">

                {/* Currency selector */}
                <div className="mb-4">
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-2 font-sans font-bold">Currency</p>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCurrencyOpen(!currencyOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:border-[#d4af37]/40 transition"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[#d4af37] font-bold font-mono">{sym}</span>
                        <span>{currency}</span>
                        {currency !== "PHP" && (
                          <span className="text-white/30 text-xs flex items-center gap-1">
                            ≈ ₱{(toPhp[currency] ?? FALLBACK_TO_PHP[currency]).toLocaleString()}/1
                            {ratesLoading
                              ? <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                              : <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Live rate" />
                            }
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-white/40 transition-transform ${currencyOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {currencyOpen && (
                      <div className="absolute top-full mt-1 left-0 right-0 bg-[#12121e] border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => selectCurrency(c)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5 transition text-left
                              ${currency === c ? "text-[#d4af37] font-bold" : "text-white/70"}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-mono w-6">{CURRENCY_SYMBOLS[c]}</span>
                              <span>{c}</span>
                            </span>
                            {currency === c && <CheckCircle size={12} className="text-[#d4af37]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount presets */}
                <p className="text-white/30 text-xs uppercase tracking-widest mb-2 font-sans font-bold">Amount</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {presets.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedAmt(v)}
                      className={`py-2.5 rounded-xl text-sm font-bold border transition-all
                        ${selectedAmt === v
                          ? "bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.35)]"
                          : "bg-white/4 border-white/8 text-white/50 hover:border-white/20"}`}
                    >
                      {fmt(v, currency)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedAmt("custom")}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all
                      ${selectedAmt === "custom"
                        ? "bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.35)]"
                        : "bg-white/4 border-white/8 text-white/50 hover:border-white/20"}`}
                  >
                    Custom
                  </button>
                </div>

                {selectedAmt === "custom" && (
                  <div className="relative mb-3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">{sym}</span>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmt}
                      onChange={(e) => setCustomAmt(e.target.value)}
                      min="1"
                      className="w-full bg-white/6 border border-white/15 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#d4af37]/50 transition"
                    />
                  </div>
                )}

                <div className="pt-3 border-t border-white/8 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-sm">Total</span>
                    <span className="text-[#d4af37] font-heading font-black text-2xl">{displayAmount}</span>
                  </div>
                </div>
              </div>

              {/* Payment for */}
              <div className="bg-[#0e0e1a] border border-white/8 rounded-2xl p-5">
                <label className="block text-white/30 text-xs uppercase tracking-widest mb-3 font-sans font-bold">
                  Payment For
                </label>
                <input
                  type="text"
                  placeholder="e.g. Social Media Package, Web Dev Deposit..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#d4af37]/40 transition"
                />
                {urlPlan && !description && (
                  <p className="mt-1.5 text-[#d4af37]/60 text-xs">{urlPlan}</p>
                )}
              </div>

              {/* Accepted payments */}
              <div className="bg-[#0e0e1a] border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#d4af37] text-lg">₿</span>
                  <span className="text-white/40 text-xs font-bold font-sans uppercase tracking-widest">
                    Accepted Payments
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "USDT (ERC-20)", icon: "🔷" },
                    { label: "BTC", icon: "₿" },
                    { label: "ETH", icon: "⟠" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                      <span className="text-sm">{m.icon}</span>
                      <span className="text-white/60 text-xs font-sans font-semibold">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="bg-[#0e0e1a] border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-bold font-sans uppercase tracking-widest">
                    Secure Checkout
                  </span>
                </div>
                {[
                  "256-bit TLS encryption",
                  "Crypto settled instantly to USDT",
                  "Funds received in GCash via GCrypto",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 py-1.5">
                    <CheckCircle size={11} className="text-emerald-400 shrink-0" />
                    <span className="text-white/40 text-xs">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right Col ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Contact Info */}
              <div className="bg-[#0e0e1a] border border-white/8 rounded-2xl p-6">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-5 font-sans font-bold">
                  Contact Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/45 text-xs font-semibold mb-1.5">Full Name *</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#d4af37]/45 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-white/45 text-xs font-semibold mb-1.5">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="juan@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#d4af37]/45 transition"
                    />
                  </div>
                </div>
              </div>

              {/* What happens next */}
              <div className="bg-[#0e0e1a] border border-white/8 rounded-2xl p-6">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-4 font-sans font-bold">
                  What Happens Next
                </p>
                <div className="space-y-3">
                  {[
                    { step: "1", text: "Click Pay — you'll be taken to the secure checkout page" },
                    { step: "2", text: "Choose your preferred crypto (USDT, BTC, ETH and more)" },
                    { step: "3", text: "Send the exact amount shown — payment confirms automatically" },
                    { step: "4", text: "BVN team will contact you within 24 hours to begin your project" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[#d4af37] text-[10px] font-black">{item.step}</span>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error */}
              {errMsg && (
                <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle size={15} className="text-red-400 shrink-0" />
                  <p className="text-red-300 text-sm">{errMsg}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-heading font-extrabold text-base text-black
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                style={{
                  background: loading ? "#555" : "#d4af37",
                  boxShadow: loading ? "none" : "0 0 30px rgba(212,175,55,0.4)",
                }}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Pay {displayAmount} Securely
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-white/20 text-xs pb-2 tracking-widest uppercase font-sans">
                🔒 256-bit encrypted · crypto settlement
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#06060c] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentsForm />
    </Suspense>
  );
}
