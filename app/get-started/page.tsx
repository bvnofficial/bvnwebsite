"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Globe, Clock, Star } from "lucide-react";

export default function GetStartedPage() {
  const [form, setForm] = useState({
    name: "", business: "", email: "", phone: "", services: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/get-started", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const canSubmit = form.name && form.business && form.email;

  return (
    <div className="min-h-screen bg-navy-dark">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange/10 border border-orange/25 text-orange text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <Globe size={12} /> Free to Get Started
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white leading-tight mb-4">
            Your website is ready.<br />
            <span className="text-gradient">Let&apos;s make it live.</span>
          </h1>
          <p className="text-white/60 text-lg mb-8">
            BVN builds your first page for free — no upfront cost, no contracts.
            Just fill in your details and we&apos;ll be in touch within 24 hours.
          </p>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50 mb-4">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-orange" /> Live in 7 days</span>
            <span className="flex items-center gap-1.5"><Star size={14} className="text-orange" /> Free first page</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-orange" /> No contracts</span>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 px-6">
        <div className="max-w-lg mx-auto">
          {status === "success" ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center">
                  <CheckCircle2 size={36} className="text-orange" />
                </div>
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white mb-2">You&apos;re on the list!</h2>
              <p className="text-white/55 text-base">
                We got your details. Expect a message from us within 24 hours to get your site live.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Business Name *</label>
                  <input
                    type="text"
                    name="business"
                    value={form.business}
                    onChange={handleChange}
                    placeholder="Juniper Kitchen"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/30 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@yourbusiness.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/30 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 555 000 0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/30 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider">What does your business do?</label>
                <textarea
                  name="services"
                  value={form.services}
                  onChange={handleChange}
                  placeholder="e.g. Plumbing, gardening, café, barber shop..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/30 transition resize-none"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={!canSubmit || status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-orange hover:bg-orange-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading font-bold text-base py-4 rounded-xl transition-colors"
              >
                {status === "loading" ? (
                  <><Loader2 size={18} className="animate-spin" /> Sending...</>
                ) : (
                  "Claim My Free Website →"
                )}
              </button>

              <p className="text-center text-white/30 text-xs">
                No spam. We&apos;ll only use your details to reach out about your website.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
