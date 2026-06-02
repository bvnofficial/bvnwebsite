"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, CheckCircle, AlertCircle, ChevronRight, Shield, Zap } from "lucide-react";

const PHP_PRESETS = ["500", "1000", "2500", "5000", "10000"];

const PRESET_LABELS: Record<string, string> = {
  "500": "₱500",
  "1000": "₱1,000",
  "2500": "₱2,500",
  "5000": "₱5,000",
  "10000": "₱10,000",
};

const PAYMENT_METHODS = [
  { id: "card", label: "Card", icon: "💳" },
  { id: "gcash", label: "GCash", icon: "📱" },
  { id: "maya", label: "Maya", icon: "🟢" },
];

function PaymentsForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlAmount = searchParams.get("amount") || "";
  const urlDescription = searchParams.get("description") || "";
  const urlPlan = searchParams.get("plan") || "";

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState(urlDescription);

  const matchPreset = PHP_PRESETS.includes(urlAmount) ? urlAmount : "custom";
  const [selectedAmt, setSelectedAmt] = useState(matchPreset);
  const [customAmt, setCustomAmt] = useState(
    urlAmount && !PHP_PRESETS.includes(urlAmount) ? urlAmount : ""
  );

  const rawAmount = selectedAmt === "custom" ? customAmt.replace(/[^0-9.]/g, "") : selectedAmt;
  const displayAmount = rawAmount
    ? "₱" + Number(rawAmount).toLocaleString("en-PH")
    : "₱0";

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
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          amount: rawAmount,
          description: description || urlPlan || undefined,
        }),
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        router.push(data.checkoutUrl);
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
    <div className="min-h-screen bg-[#0A0F1E] py-24 px-4">
      {/* BG glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(232,96,16,0.15), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
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
          <p className="text-white/40 text-sm">
            Powered by PayMongo · 256-bit SSL · PCI DSS Level 1
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left Col: Amount + Summary ── */}
            <div className="lg:col-span-1 space-y-4">

              {/* Amount picker */}
              <div className="bg-[#111827] border border-white/8 rounded-2xl p-5">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-3 font-accent font-bold">
                  Select Amount
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {PHP_PRESETS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedAmt(v)}
                      className={`py-2.5 rounded-xl text-sm font-bold font-accent border transition-all
                        ${selectedAmt === v
                          ? "bg-orange text-white border-orange shadow-[0_0_15px_rgba(232,96,16,0.4)]"
                          : "bg-white/4 border-white/8 text-white/50 hover:border-white/20"
                        }`}
                    >
                      {PRESET_LABELS[v]}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedAmt("custom")}
                    className={`py-2.5 rounded-xl text-sm font-bold font-accent border transition-all
                      ${selectedAmt === "custom"
                        ? "bg-orange text-white border-orange shadow-[0_0_15px_rgba(232,96,16,0.4)]"
                        : "bg-white/4 border-white/8 text-white/50 hover:border-white/20"
                      }`}
                  >
                    Custom
                  </button>
                </div>

                {selectedAmt === "custom" && (
                  <div className="relative mb-3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">₱</span>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmt}
                      onChange={(e) => setCustomAmt(e.target.value)}
                      min="1"
                      className="w-full bg-white/6 border border-white/15 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm font-body outline-none focus:border-orange/60 transition"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-white/8 flex justify-between items-center">
                  <span className="text-white/40 text-sm">Total</span>
                  <span className="text-orange font-heading font-black text-2xl">{displayAmount}</span>
                </div>
              </div>

              {/* Payment for */}
              <div className="bg-[#111827] border border-white/8 rounded-2xl p-5">
                <label className="block text-white/30 text-xs uppercase tracking-widest mb-3 font-accent font-bold">
                  Payment For
                </label>
                <input
                  type="text"
                  placeholder="e.g. Social Media Package, Web Dev Deposit..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 font-body outline-none focus:border-orange/50 transition"
                />
                {urlPlan && !description && (
                  <p className="mt-1.5 text-orange/60 text-xs font-accent">{urlPlan}</p>
                )}
              </div>

              {/* Payment methods */}
              <div className="bg-[#111827] border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={13} className="text-orange" />
                  <span className="text-white/40 text-xs font-bold font-accent uppercase tracking-widest">
                    Accepted Payments
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {PAYMENT_METHODS.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <span className="text-sm">{m.icon}</span>
                      <span className="text-white/60 text-xs font-accent font-semibold">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="bg-[#111827] border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-bold font-accent uppercase tracking-widest">
                    Secure Checkout
                  </span>
                </div>
                {[
                  "256-bit TLS encryption",
                  "PCI DSS Level 1 certified",
                  "Powered by PayMongo",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 py-1.5">
                    <CheckCircle size={11} className="text-emerald-400 shrink-0" />
                    <span className="text-white/40 text-xs">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right Col: Contact Info + Submit ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Contact Info */}
              <div className="bg-[#111827] border border-white/8 rounded-2xl p-6">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-5 font-accent font-bold">
                  Contact Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/45 text-xs font-semibold mb-1.5">
                      Full Name *
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 font-body outline-none focus:border-orange/55 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-white/45 text-xs font-semibold mb-1.5">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="juan@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 font-body outline-none focus:border-orange/55 transition"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-white/45 text-xs font-semibold mb-1.5">
                      Phone Number
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+63 9XX XXX XXXX"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 font-body outline-none focus:border-orange/55 transition"
                    />
                  </div>
                </div>
              </div>

              {/* What happens next */}
              <div className="bg-[#111827] border border-white/8 rounded-2xl p-6">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-4 font-accent font-bold">
                  What Happens Next
                </p>
                <div className="space-y-3">
                  {[
                    {
                      step: "1",
                      text: "Click Pay — you'll be redirected to PayMongo's secure checkout",
                    },
                    {
                      step: "2",
                      text: "Choose your payment method: card, GCash, or Maya",
                    },
                    {
                      step: "3",
                      text: "Payment is confirmed instantly — you'll receive a receipt via email",
                    },
                    {
                      step: "4",
                      text: "BVN team will contact you within 24 hours to begin your project",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange/15 border border-orange/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-orange text-[10px] font-black">{item.step}</span>
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
                  <p className="text-red-300 text-sm font-body">{errMsg}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-orange text-white font-heading font-extrabold text-base rounded-2xl
                  shadow-[0_0_30px_rgba(232,96,16,0.45)] hover:bg-orange-light hover:shadow-[0_0_50px_rgba(232,96,16,0.65)]
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Redirecting to PayMongo...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Pay {displayAmount} via PayMongo
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-white/20 text-xs pb-2">
                🔒 Your payment is processed securely by PayMongo · PCI DSS Level 1
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
        <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-orange/20 border-t-orange rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentsForm />
    </Suspense>
  );
}
