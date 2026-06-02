"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, CheckCircle, AlertCircle, ChevronRight, Shield, CreditCard } from "lucide-react";

function detectCard(num: string): string {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^35/.test(n)) return "jcb";
  return "";
}

function formatCard(val: string): string {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val: string): string {
  const n = val.replace(/\D/g, "").slice(0, 4);
  return n.length >= 2 ? n.slice(0, 2) + "/" + n.slice(2) : n;
}

const CARD_LABELS: Record<string, string> = {
  visa: "VISA", mastercard: "MC", amex: "AMEX", jcb: "JCB",
};

const PRESET_AMOUNTS = [
  { label: "₱500", value: "500", currency: "₱" },
  { label: "₱1,000", value: "1000", currency: "₱" },
  { label: "₱2,500", value: "2500", currency: "₱" },
  { label: "₱5,000", value: "5000", currency: "₱" },
  { label: "₱10,000", value: "10000", currency: "₱" },
  { label: "Custom", value: "custom", currency: "₱" },
];

function PaymentsForm() {
  const searchParams = useSearchParams();

  // Read URL params: ?amount=1200&description=Growth+Plan&currency=USD&plan=GROWTH
  const urlAmount = searchParams.get("amount") || "";
  const urlDescription = searchParams.get("description") || "";
  const urlCurrency = searchParams.get("currency") || "₱";
  const urlPlan = searchParams.get("plan") || "";

  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [flip, setFlip] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [refNo, setRefNo] = useState("");

  // Customer fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState(urlDescription);

  // Amount — if URL amount matches a preset, select that preset; otherwise use custom input
  const USD_PRESETS = ["300","500","1000","1200","2500"];
  const PHP_PRESETS = ["500","1000","2500","5000","10000"];
  const presetValues = urlCurrency === "$" ? USD_PRESETS : PHP_PRESETS;
  const [selectedAmt, setSelectedAmt] = useState(() => {
    if (!urlAmount) return "1000";
    return presetValues.includes(urlAmount) ? urlAmount : "custom";
  });
  const [customAmt, setCustomAmt] = useState(() =>
    urlAmount && !presetValues.includes(urlAmount) ? urlAmount : ""
  );
  const [currency] = useState(urlCurrency);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [agree, setAgree] = useState(false);

  const cardBrand = detectCard(cardNumber);
  const cardLast4 = cardNumber.replace(/\s/g, "").slice(-4) || "••••";
  const rawAmount = selectedAmt === "custom" ? customAmt.replace(/[^0-9.]/g, "") : selectedAmt;
  const displayAmount = rawAmount
    ? currency + Number(rawAmount).toLocaleString("en-PH")
    : currency + "0";

  // Build amount presets — show currency-adjusted labels when URL currency is USD
  const amountPresets = currency === "$"
    ? [
        { label: "$300", value: "300", currency: "$" },
        { label: "$500", value: "500", currency: "$" },
        { label: "$1,000", value: "1000", currency: "$" },
        { label: "$1,200", value: "1200", currency: "$" },
        { label: "$2,500", value: "2500", currency: "$" },
        { label: "Custom", value: "custom", currency: "$" },
      ]
    : PRESET_AMOUNTS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg("");
    if (!name || !email || !rawAmount || Number(rawAmount) < 1) {
      setErrMsg("Please fill in your name, email, and a valid amount.");
      return;
    }
    if (!cardNumber || !expiry || !cvv || !cardName) {
      setErrMsg("Please fill in all card details.");
      return;
    }
    if (!agree) {
      setErrMsg("Please agree to the terms.");
      return;
    }
    setLoading(true);
    setStep("processing");
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, amount: rawAmount,
          currency, description: description || urlPlan || undefined,
          cardBrand: CARD_LABELS[cardBrand] || "Card",
          cardLast4,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRefNo(data.refNo);
        setStep("success");
      } else {
        setErrMsg("Something went wrong. Please try again.");
        setStep("form");
      }
    } catch {
      setErrMsg("Network error. Please try again.");
      setStep("form");
    } finally {
      setLoading(false);
    }
  }

  /* ─── Processing Screen ─── */
  if (step === "processing") {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange/20 border-t-orange rounded-full animate-spin mx-auto mb-6" />
          <p className="text-white font-heading font-bold text-xl mb-2">Processing Payment</p>
          <p className="text-white/40 text-sm">Please wait, do not close this page...</p>
        </div>
      </div>
    );
  }

  /* ─── Success Screen ─── */
  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="bg-[#111827] border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
            <div style={{ background: "linear-gradient(135deg, #059669, #10b981)" }} className="px-8 py-10 text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle size={48} className="text-white" />
              </div>
              <h1 className="text-2xl font-heading font-extrabold text-white mb-1">Payment Submitted!</h1>
              <p className="text-emerald-100 text-sm">Your request has been received.</p>
            </div>
            <div className="p-8">
              <div className="bg-[#0A0F1E] rounded-2xl p-5 mb-5 text-center border border-white/8">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Reference Number</p>
                <p className="font-mono font-black text-orange text-2xl">{refNo}</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Amount</span>
                  <span className="text-white font-bold">{displayAmount}</span>
                </div>
                {(description || urlPlan) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Plan / Service</span>
                    <span className="text-white">{description || urlPlan}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Name</span>
                  <span className="text-white">{name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Email</span>
                  <span className="text-white">{email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Card</span>
                  <span className="text-white font-mono">•••• •••• •••• {cardLast4}</span>
                </div>
              </div>
              <div className="bg-orange/5 border border-orange/15 rounded-xl p-3 mb-6 text-center">
                <p className="text-white/40 text-xs leading-relaxed">
                  A confirmation has been sent to <span className="text-white">{email}</span>.{" "}
                  Our team will verify and confirm your payment shortly.
                </p>
              </div>
              <Link href="/"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-orange text-white font-heading font-bold text-sm rounded-xl
                  hover:bg-orange-light transition-all shadow-[0_0_25px_rgba(232,96,16,0.3)]">
                Back to Home <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Payment Form ─── */
  return (
    <div className="min-h-screen bg-[#0A0F1E] py-24 px-4">
      {/* BG glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30"
          style={{ background: "radial-gradient(ellipse, rgba(232,96,16,0.15), transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <Image src="/bvn-logo.png" alt="BVN" width={44} height={44} />
            <span className="font-heading font-extrabold text-white text-xl">BVN</span>
          </Link>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-2">
            {urlPlan ? `${urlPlan} — Secure Payment` : "Secure Payment"}
          </h1>
          <p className="text-white/40 text-sm">Complete your payment securely. All transactions are encrypted.</p>
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20 text-orange text-xs font-bold font-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
            DEMO GATEWAY — No Real Charge
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left Col: Amount + Summary ── */}
            <div className="lg:col-span-1 space-y-4">
              {/* Amount picker */}
              <div className="bg-[#111827] border border-white/8 rounded-2xl p-5">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-3 font-accent font-bold">Select Amount</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {amountPresets.map((a) => (
                    <button key={a.value} type="button" onClick={() => setSelectedAmt(a.value)}
                      className={`py-2.5 rounded-xl text-sm font-bold font-accent border transition-all
                        ${selectedAmt === a.value
                          ? "bg-orange text-white border-orange shadow-[0_0_15px_rgba(232,96,16,0.4)]"
                          : "bg-white/4 border-white/8 text-white/50 hover:border-white/20"}`}>
                      {a.label}
                    </button>
                  ))}
                </div>
                {selectedAmt === "custom" && (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">{currency}</span>
                    <input type="number" placeholder="Enter amount" value={customAmt}
                      onChange={e => setCustomAmt(e.target.value)} min="1"
                      className="w-full bg-white/6 border border-white/15 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm font-body outline-none focus:border-orange/60 transition" />
                  </div>
                )}
                {/* Total display */}
                <div className="mt-4 pt-4 border-t border-white/8 flex justify-between items-center">
                  <span className="text-white/40 text-sm">Total</span>
                  <span className="text-orange font-heading font-black text-2xl">{displayAmount}</span>
                </div>
              </div>

              {/* Description / Plan label */}
              <div className="bg-[#111827] border border-white/8 rounded-2xl p-5">
                <label className="block text-white/30 text-xs uppercase tracking-widest mb-3 font-accent font-bold">Payment For</label>
                <input type="text" placeholder="e.g. Social Media Package, Web Dev Deposit..."
                  value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 font-body outline-none focus:border-orange/50 transition" />
                {urlPlan && !description && (
                  <p className="mt-1.5 text-orange/60 text-xs font-accent">{urlPlan}</p>
                )}
              </div>

              {/* Security */}
              <div className="bg-[#111827] border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-bold font-accent uppercase tracking-widest">Secure Checkout</span>
                </div>
                {["256-bit TLS encryption", "Fraud & chargeback protection", "PCI DSS compliant"].map(t => (
                  <div key={t} className="flex items-center gap-2 py-1.5">
                    <CheckCircle size={11} className="text-emerald-400 shrink-0" />
                    <span className="text-white/40 text-xs">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right Col: Customer + Card ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Card visual */}
              <div
                className="relative h-48 rounded-2xl overflow-hidden cursor-pointer select-none"
                onClick={() => setFlip(!flip)}
                style={{
                  background: flip
                    ? "linear-gradient(135deg, #0A0F1E 0%, #1B3060 100%)"
                    : "linear-gradient(135deg, #1B3060 0%, #E86010 100%)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(232,96,16,0.1)",
                  transition: "background 0.3s",
                }}
              >
                <div className="absolute inset-0 opacity-20"
                  style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.3), transparent 60%)" }} />

                {!flip ? (
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-9 rounded-md border border-yellow-400/40"
                        style={{ background: "linear-gradient(135deg, #d4af37, #f5d67a, #d4af37)" }} />
                      <div className="text-right">
                        <span className="text-white/50 text-xs font-mono font-bold block">
                          {cardBrand ? CARD_LABELS[cardBrand] : ""}
                        </span>
                        <CreditCard size={18} className="text-white/30 ml-auto mt-1" />
                      </div>
                    </div>
                    <div>
                      <p className="font-mono text-white/90 text-xl tracking-[0.18em] mb-3 drop-shadow">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-white/35 text-[10px] uppercase tracking-widest mb-0.5">Card Holder</p>
                          <p className="text-white font-mono text-sm uppercase tracking-wide">{cardName || "YOUR NAME"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/35 text-[10px] uppercase tracking-widest mb-0.5">Expires</p>
                          <p className="text-white font-mono text-sm">{expiry || "MM/YY"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0">
                    <div className="mt-8 h-11 bg-black/70 w-full" />
                    <div className="mx-6 mt-4 bg-white rounded-lg px-4 py-2.5 flex items-center justify-between">
                      <span className="text-gray-400 text-xs italic">Signature</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 rounded px-3 py-1">
                          <span className="font-mono text-gray-700 font-bold tracking-[0.3em]">
                            {cvv ? cvv.replace(/./g, "•") : "•••"}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">CVV</span>
                      </div>
                    </div>
                    <p className="text-center text-white/20 text-xs mt-3">The CVV is on the back of your card</p>
                  </div>
                )}

                <div className="absolute top-3 right-3 px-2 py-0.5 bg-orange/25 border border-orange/40 rounded text-orange text-[10px] font-black tracking-widest">
                  DEMO
                </div>
                <p className="absolute bottom-2 right-3 text-white/15 text-[9px]">Tap to flip</p>
              </div>

              {/* Customer Info */}
              <div className="bg-[#111827] border border-white/8 rounded-2xl p-5">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-4 font-accent font-bold">Contact Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/45 text-xs font-semibold mb-1.5">Full Name *</label>
                    <input required value={name} onChange={e => setName(e.target.value)} placeholder="Juan Dela Cruz"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 font-body outline-none focus:border-orange/55 transition" />
                  </div>
                  <div>
                    <label className="block text-white/45 text-xs font-semibold mb-1.5">Email Address *</label>
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="juan@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 font-body outline-none focus:border-orange/55 transition" />
                  </div>
                  <div>
                    <label className="block text-white/45 text-xs font-semibold mb-1.5">Phone Number</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+63 9XX XXX XXXX"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 font-body outline-none focus:border-orange/55 transition" />
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="bg-[#111827] border border-white/8 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white/30 text-xs uppercase tracking-widest font-accent font-bold">Card Details</p>
                  <div className="flex items-center gap-1.5">
                    {["visa","mastercard","amex","jcb"].map(b => (
                      <span key={b} className={`text-[10px] font-black px-1.5 py-0.5 rounded border transition-all
                        ${cardBrand === b
                          ? "bg-orange/20 border-orange/40 text-orange"
                          : "border-white/10 text-white/20"}`}>
                        {CARD_LABELS[b]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-white/45 text-xs font-semibold mb-1.5">Card Number *</label>
                    <input required value={cardNumber}
                      onChange={e => setCardNumber(formatCard(e.target.value))}
                      placeholder="0000 0000 0000 0000" maxLength={19}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 font-mono outline-none focus:border-orange/55 transition tracking-widest" />
                  </div>
                  <div>
                    <label className="block text-white/45 text-xs font-semibold mb-1.5">Name on Card *</label>
                    <input required value={cardName}
                      onChange={e => setCardName(e.target.value.toUpperCase())}
                      placeholder="JUAN DELA CRUZ"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 font-mono outline-none focus:border-orange/55 transition uppercase tracking-wide" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/45 text-xs font-semibold mb-1.5">Expiry Date *</label>
                      <input required value={expiry}
                        onChange={e => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY" maxLength={5}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 font-mono outline-none focus:border-orange/55 transition" />
                    </div>
                    <div>
                      <label className="block text-white/45 text-xs font-semibold mb-1.5">
                        CVV * <span className="text-white/20 font-normal text-[10px]">(tap card to flip)</span>
                      </label>
                      <input required value={cvv}
                        onFocus={() => setFlip(true)}
                        onBlur={() => setFlip(false)}
                        onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••" maxLength={4} type="password"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 font-mono outline-none focus:border-orange/55 transition" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo notice */}
              <div className="flex items-start gap-3 bg-orange/5 border border-orange/15 rounded-2xl p-4">
                <Lock size={14} className="text-orange shrink-0 mt-0.5" />
                <p className="text-white/40 text-xs leading-relaxed">
                  <strong className="text-orange">Demo Gateway:</strong> Card fields are for visual demonstration only.
                  No card data is stored or charged. Submitting will send a payment inquiry to our team who will contact you to arrange actual payment.
                </p>
              </div>

              {/* Error */}
              {errMsg && (
                <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle size={15} className="text-red-400 shrink-0" />
                  <p className="text-red-300 text-sm font-body">{errMsg}</p>
                </div>
              )}

              {/* Agree */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-orange cursor-pointer shrink-0" />
                <span className="text-white/35 text-xs font-body leading-relaxed">
                  I understand this is a demo gateway — no real charge is made. I agree to be contacted by BVN to confirm payment.
                  By submitting, I agree to the <Link href="/contact" className="text-orange hover:underline">Terms of Service</Link>.
                </span>
              </label>

              {/* Submit button */}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-orange text-white font-heading font-extrabold text-base rounded-2xl
                  shadow-[0_0_30px_rgba(232,96,16,0.45)] hover:bg-orange-light hover:shadow-[0_0_50px_rgba(232,96,16,0.65)]
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-1">
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={16} />
                    Pay {displayAmount} Securely
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-white/20 text-xs pb-2">
                🔒 Secured by BVN · 256-bit SSL · PCI DSS · Demo Mode
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
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange/20 border-t-orange rounded-full animate-spin" />
      </div>
    }>
      <PaymentsForm />
    </Suspense>
  );
}
