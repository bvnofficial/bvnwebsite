"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, CreditCard, CheckCircle, AlertCircle, ChevronRight, Shield } from "lucide-react";

const CARD_ICONS: Record<string, string> = {
  visa: "VISA",
  mastercard: "MC",
  amex: "AMEX",
  jcb: "JCB",
};

function detectCard(num: string): string {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^35/.test(n)) return "jcb";
  return "";
}

function formatCard(val: string): string {
  const n = val.replace(/\D/g, "").slice(0, 16);
  return n.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val: string): string {
  const n = val.replace(/\D/g, "").slice(0, 4);
  if (n.length >= 2) return n.slice(0, 2) + "/" + n.slice(2);
  return n;
}

const AMOUNTS = ["₱500", "₱1,000", "₱2,500", "₱5,000", "₱10,000", "Custom"];

export default function PaymentPage() {
  const [step, setStep] = useState<"form" | "success" | "error">("form");
  const [loading, setLoading] = useState(false);
  const [refNo, setRefNo] = useState("");
  const [flip, setFlip] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amountPreset, setAmountPreset] = useState("₱1,000");
  const [customAmount, setCustomAmount] = useState("");
  const [description, setDescription] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [agree, setAgree] = useState(false);

  const cardBrand = detectCard(cardNumber);
  const cardLast4 = cardNumber.replace(/\s/g, "").slice(-4) || "••••";

  const displayAmount =
    amountPreset === "Custom"
      ? customAmount
        ? `₱${Number(customAmount.replace(/\D/g, "")).toLocaleString()}`
        : "₱0"
      : amountPreset;

  const rawAmount =
    amountPreset === "Custom"
      ? customAmount.replace(/\D/g, "")
      : amountPreset.replace(/[₱,]/g, "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg("");

    if (!name || !email || !rawAmount || !cardNumber || !expiry || !cvv) {
      setErrMsg("Please fill in all required fields.");
      return;
    }
    if (!agree) {
      setErrMsg("Please agree to the terms to continue.");
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
          phone,
          amount: rawAmount,
          currency: "₱",
          description,
          cardBrand: CARD_ICONS[cardBrand] || "Card",
          cardLast4,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRefNo(data.refNo);
        setStep("success");
      } else {
        setErrMsg("Something went wrong. Please try again.");
        setStep("error");
      }
    } catch {
      setErrMsg("Network error. Please check your connection.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="bg-[#111827] border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 px-8 py-10 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-white mb-1">Payment Received!</h1>
              <p className="text-emerald-100 text-sm">Your request has been submitted successfully.</p>
            </div>
            <div className="p-8 text-center">
              <div className="bg-white/4 rounded-xl p-4 mb-6">
                <p className="text-white/40 text-xs mb-1">Reference Number</p>
                <p className="font-mono font-bold text-orange text-xl">{refNo}</p>
              </div>
              <p className="text-white/50 text-sm mb-2">Amount: <span className="text-white font-bold">{displayAmount}</span></p>
              <p className="text-white/40 text-xs mb-6">A confirmation email has been sent to <span className="text-white">{email}</span></p>
              <p className="text-white/30 text-xs mb-6 bg-orange/5 border border-orange/15 rounded-lg p-3">
                ⚠️ This is a <strong className="text-orange">DEMO</strong> gateway — no real charge was made. Our team will contact you to confirm payment.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-heading font-semibold text-sm rounded-xl
                  hover:bg-orange-light transition-all"
              >
                Back to Home <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] py-24 px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(232,96,16,0.06), transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Demo badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 border border-orange/25 text-orange text-xs font-bold font-accent tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
            Demo Payment Gateway — No Real Charges
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            {/* Logo & Brand */}
            <div className="bg-[#111827] border border-white/8 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <Image src="/bvn-logo.png" alt="BVN" width={40} height={40} />
                <div>
                  <p className="font-heading font-bold text-white text-sm">BVN Digital Agency</p>
                  <p className="text-white/40 text-xs">bvnofficial.com</p>
                </div>
              </div>
              <div className="border-t border-white/8 pt-5">
                <p className="text-white/40 text-xs mb-3 uppercase tracking-widest font-accent">Amount to Pay</p>
                <p className="font-heading font-black text-3xl text-orange mb-1">{displayAmount}</p>
                {description && <p className="text-white/50 text-sm">{description}</p>}
              </div>
            </div>

            {/* Quick Amount Select */}
            <div className="bg-[#111827] border border-white/8 rounded-2xl p-5">
              <p className="text-white/40 text-xs mb-3 uppercase tracking-widest font-accent">Quick Select</p>
              <div className="grid grid-cols-3 gap-2">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmountPreset(a)}
                    className={`py-2 rounded-xl text-xs font-bold font-accent border transition-all
                      ${amountPreset === a
                        ? "bg-orange/15 border-orange/40 text-orange"
                        : "bg-white/4 border-white/8 text-white/50 hover:border-orange/25"
                      }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              {amountPreset === "Custom" && (
                <div className="mt-3">
                  <input
                    type="number"
                    placeholder="Enter amount (₱)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm font-body outline-none focus:border-orange/50 transition"
                  />
                </div>
              )}
            </div>

            {/* Security badges */}
            <div className="bg-[#111827] border border-white/8 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-emerald-400" />
                <span className="text-white/50 text-xs font-accent font-semibold">Secure Payment</span>
              </div>
              {[
                "256-bit SSL encryption",
                "PCI DSS compliant",
                "Fraud protection",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 py-1.5">
                  <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                  <span className="text-white/40 text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="lg:col-span-3">
            <div className="bg-[#111827] border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
              {/* Card Visual */}
              <div className="px-6 pt-6 pb-2">
                <div
                  className="relative h-44 rounded-2xl overflow-hidden mb-5 cursor-pointer select-none"
                  onClick={() => setFlip(!flip)}
                  style={{
                    background: "linear-gradient(135deg, #1B3060 0%, #0A0F1E 50%, #E86010 100%)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(232,96,16,0.15)",
                  }}
                >
                  {/* Card glow effects */}
                  <div className="absolute inset-0 opacity-30"
                    style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(232,96,16,0.4), transparent 70%)" }} />

                  {!flip ? (
                    /* Front */
                    <div className="absolute inset-0 p-5 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-80" />
                        <span className="text-white/60 text-xs font-mono font-bold">
                          {cardBrand ? CARD_ICONS[cardBrand] : "CARD"}
                        </span>
                      </div>
                      <div>
                        <p className="font-mono text-white/90 text-lg tracking-[0.2em] mb-3">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Card Holder</p>
                            <p className="text-white font-mono text-sm uppercase">{cardName || "YOUR NAME"}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Expires</p>
                            <p className="text-white font-mono text-sm">{expiry || "MM/YY"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Back */
                    <div className="absolute inset-0">
                      <div className="mt-7 h-10 bg-black/60 w-full" />
                      <div className="mx-5 mt-4 bg-white/10 rounded-lg px-4 py-2 flex items-center justify-between">
                        <span className="text-white/30 text-xs">CVV</span>
                        <span className="font-mono text-white/80 tracking-widest">{cvv || "•••"}</span>
                      </div>
                    </div>
                  )}

                  {/* Demo watermark */}
                  <div className="absolute top-2 right-12 px-2 py-0.5 bg-orange/20 border border-orange/30 rounded text-orange text-[10px] font-bold tracking-widest">
                    DEMO
                  </div>
                  <p className="absolute bottom-2 right-3 text-white/20 text-[9px]">Click to flip</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
                {/* Section: Customer */}
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-3 font-accent">Your Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Full Name *</label>
                      <input required value={name} onChange={e => setName(e.target.value)} placeholder="Juan Dela Cruz"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 font-body outline-none focus:border-orange/50 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Email *</label>
                      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 font-body outline-none focus:border-orange/50 transition" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Phone</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+63 9XX XXX XXXX"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 font-body outline-none focus:border-orange/50 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Description</label>
                      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Service description"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 font-body outline-none focus:border-orange/50 transition" />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/8" />
                  <div className="flex items-center gap-1.5 text-white/30 text-xs font-accent">
                    <Lock size={10} />
                    <span>Card Details (Demo)</span>
                  </div>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                {/* Section: Card */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5">Card Number *</label>
                  <div className="relative">
                    <input required value={cardNumber}
                      onChange={e => setCardNumber(formatCard(e.target.value))}
                      placeholder="0000 0000 0000 0000" maxLength={19}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-16 text-sm text-white placeholder-white/25 font-mono outline-none focus:border-orange/50 transition" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {["visa","mastercard","amex"].map(b => (
                        <span key={b} className={`text-[9px] font-bold px-1 rounded ${cardBrand === b ? "bg-orange/30 text-orange" : "text-white/20"}`}>
                          {CARD_ICONS[b]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5">Name on Card *</label>
                  <input required value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())}
                    placeholder="JUAN DELA CRUZ"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 font-mono outline-none focus:border-orange/50 transition uppercase" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Expiry Date *</label>
                    <input required value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY" maxLength={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 font-mono outline-none focus:border-orange/50 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">CVV * <span className="text-white/25 font-normal">(click card to see)</span></label>
                    <input required value={cvv} onFocus={() => setFlip(true)} onBlur={() => setFlip(false)}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="•••" maxLength={4} type="password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 font-mono outline-none focus:border-orange/50 transition" />
                  </div>
                </div>

                {/* Demo notice */}
                <div className="flex items-start gap-2.5 bg-orange/5 border border-orange/15 rounded-xl p-3">
                  <Lock size={13} className="text-orange shrink-0 mt-0.5" />
                  <p className="text-white/45 text-xs leading-relaxed font-body">
                    <strong className="text-orange">Demo Mode:</strong> Card details are for visual demonstration only. No payment is processed and no card data is stored or transmitted. A notification email will be sent to confirm your request.
                  </p>
                </div>

                {/* Error */}
                {errMsg && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle size={14} className="text-red-400 shrink-0" />
                    <p className="text-red-300 text-xs font-body">{errMsg}</p>
                  </div>
                )}

                {/* Agree */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-orange cursor-pointer" />
                  <span className="text-white/40 text-xs font-body leading-relaxed">
                    I understand this is a demo payment gateway and no real charge will be made. I agree to the{" "}
                    <Link href="/contact" className="text-orange hover:underline">terms of service</Link>.
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange text-white font-heading font-bold text-sm rounded-xl
                    shadow-[0_0_25px_rgba(232,96,16,0.4)] hover:bg-orange-light hover:shadow-[0_0_40px_rgba(232,96,16,0.6)]
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock size={15} />
                      Pay {displayAmount} Securely
                    </>
                  )}
                </button>

                <p className="text-center text-white/25 text-xs font-body">
                  🔒 256-bit SSL encryption · PCI DSS compliant · Demo Mode
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
