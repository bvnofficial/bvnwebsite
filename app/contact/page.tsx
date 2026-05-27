"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Facebook, Globe, CheckCircle2, Send } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const childVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm " +
    "focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/30 transition-colors";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[45vh] flex items-end bg-navy-dark overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 grid-bg" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "700px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(232,96,16,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block font-accent font-semibold text-xs tracking-[0.2em] uppercase text-orange mb-4 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20"
          >
            Contact BVN
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight"
          >
            Let&apos;s Build Something{" "}
            <span className="text-gradient">Great Together.</span>
          </motion.h1>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative py-20 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5"
      >
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Left — Contact Info */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              <motion.div variants={childVariant}>
                <h2 className="font-heading font-extrabold text-2xl text-white mb-2">
                  Get in Touch
                </h2>
                <p className="text-white/55 text-sm leading-relaxed">
                  We&apos;d love to hear about your project. Send us a message
                  and we&apos;ll get back to you within 24 hours.
                </p>
              </motion.div>

              {/* Contact Cards */}
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "bvn@bvnofficial.com",
                  href: "mailto:bvn@bvnofficial.com",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+63 981 655 6555",
                  href: "tel:+639816556555",
                },
                {
                  icon: Facebook,
                  label: "Facebook",
                  value: "facebook.com/bvndigital",
                  href: "https://www.facebook.com/bvndigital",
                },
                {
                  icon: Globe,
                  label: "Website",
                  value: "www.bvnofficial.com",
                  href: "https://www.bvnofficial.com",
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <motion.a
                  key={label}
                  variants={childVariant}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4
                    hover:border-orange/40 hover:bg-white/8 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center shrink-0 group-hover:bg-orange/20 transition-colors">
                    <Icon size={18} className="text-orange" />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs font-accent uppercase tracking-widest mb-0.5">
                      {label}
                    </div>
                    <div className="text-white/80 text-sm font-semibold">
                      {value}
                    </div>
                  </div>
                </motion.a>
              ))}

              {/* Response Time Badge */}
              <motion.div
                variants={childVariant}
                className="bg-green-500/5 border border-green-500/20 rounded-xl px-5 py-4 mt-2"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-accent font-semibold uppercase tracking-widest">
                    Response Time
                  </span>
                </div>
                <p className="text-white/60 text-sm">
                  We typically respond within{" "}
                  <span className="text-white font-semibold">24 hours</span>{" "}
                  on business days.
                </p>
              </motion.div>
            </motion.div>

            {/* Right — Contact Form */}
            <motion.div
              variants={childVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="lg:col-span-3"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/5 border border-green-500/30
                    rounded-2xl p-10 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} className="text-green-400" />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-white mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-white/60 text-base max-w-sm">
                    Thanks! We&apos;ll be in touch within 24 hours. We&apos;re
                    excited to learn about your project.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm(initialForm);
                    }}
                    className="mt-8 px-6 py-2.5 border border-white/20 text-white/60 rounded-lg text-sm
                      hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 space-y-5"
                >
                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-white/60 text-xs font-accent uppercase tracking-widest mb-2">
                        Full Name <span className="text-orange">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Juan Dela Cruz"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-accent uppercase tracking-widest mb-2">
                        Email Address <span className="text-orange">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="juan@company.com"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone + Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-white/60 text-xs font-accent uppercase tracking-widest mb-2">
                        Phone{" "}
                        <span className="text-white/30 normal-case font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+63 900 000 0000"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs font-accent uppercase tracking-widest mb-2">
                        Company{" "}
                        <span className="text-white/30 normal-case font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Your Company Name"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {/* Service Interest */}
                  <div>
                    <label className="block text-white/60 text-xs font-accent uppercase tracking-widest mb-2">
                      Service Interest <span className="text-orange">*</span>
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      required
                      className={`${inputClasses} appearance-none cursor-pointer`}
                    >
                      <option value="" disabled className="bg-navy-surface">
                        Select a service...
                      </option>
                      <option value="marketing" className="bg-navy-surface">
                        Marketing Automation
                      </option>
                      <option value="operations" className="bg-navy-surface">
                        Operations Automation
                      </option>
                      <option value="both" className="bg-navy-surface">
                        Both — Marketing & Operations
                      </option>
                      <option value="va" className="bg-navy-surface">
                        Virtual Assistant Services
                      </option>
                      <option value="web" className="bg-navy-surface">
                        Web / App Development
                      </option>
                      <option value="unsure" className="bg-navy-surface">
                        Not sure — need a recommendation
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-white/60 text-xs font-accent uppercase tracking-widest mb-2">
                      Message <span className="text-orange">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us about your business and what you're looking to achieve..."
                      className={`${inputClasses} resize-none`}
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-orange text-white
                      font-heading font-semibold text-sm rounded-xl transition-all duration-200
                      shadow-[0_0_20px_rgba(232,96,16,0.4)] hover:bg-orange-light hover:shadow-[0_0_32px_rgba(232,96,16,0.6)]
                      disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
