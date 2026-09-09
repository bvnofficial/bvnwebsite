"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, RotateCcw, Check, Sparkles } from "lucide-react";
import { QUESTIONS, scoreQuiz, type QuizOption, type Niche } from "@/lib/va-niches";

export default function NicheQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[]>([]);
  const [result, setResult] = useState<{ niche: Niche; score: number }[] | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const total = QUESTIONS.length;

  function choose(opt: QuizOption) {
    const next = [...answers, opt];
    setAnswers(next);
    if (step + 1 >= total) {
      setResult(scoreQuiz(next));
      setStep(total);
    } else {
      setStep(step + 1);
    }
  }
  function back() {
    if (step > 0 && !result) {
      setStep(step - 1);
      setAnswers((a) => a.slice(0, -1));
    }
  }
  function restart() {
    setStep(0);
    setAnswers([]);
    setResult(null);
    setSent(false);
    setEmail("");
    setName("");
  }

  async function sendRoadmap(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || sending || !result) return;
    setSending(true);
    try {
      await fetch("/api/va-quiz-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          niche: result[0].niche.name,
          courseSlug: result[0].niche.courseSlug,
        }),
      });
      setSent(true);
    } catch {
      setSent(true); // best-effort; don't block the user
    } finally {
      setSending(false);
    }
  }

  // ── RESULT ──────────────────────────────────────────────
  if (result) {
    const top = result[0].niche;
    const alts = result.slice(1, 3).map((r) => r.niche);
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10"
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange/10 border border-orange/30 text-orange text-xs font-accent font-semibold mb-4">
            <Sparkles size={13} /> Your result
          </div>
          <div className="text-5xl mb-2">{top.emoji}</div>
          <p className="text-white/50 text-sm">Your best-fit VA niche is</p>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mt-1">{top.name}</h2>
          <p className="text-orange font-accent mt-2">{top.tagline}</p>
        </div>

        <p className="text-white/70 text-base leading-relaxed max-w-2xl mx-auto mt-6 text-center">{top.blurb}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mt-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="text-white/40 text-[11px] uppercase tracking-wider">Demand</div>
            <div className="text-white font-heading font-bold text-sm mt-0.5">{top.demand}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="text-white/40 text-[11px] uppercase tracking-wider">Typical pay</div>
            <div className="text-white font-heading font-bold text-sm mt-0.5">{top.pay}</div>
          </div>
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-white/40 text-[11px] uppercase tracking-wider mb-1">Why it fits you</div>
            <div className="flex flex-wrap gap-1.5">
              {top.strengths.map((s) => (
                <span key={s} className="text-white/70 text-[11px] bg-white/5 border border-white/10 rounded-full px-2 py-0.5">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Primary CTA → the real course */}
        <div className="flex flex-col items-center mt-8">
          <Link
            href={`/courses/${top.courseSlug}`}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-orange text-white font-heading font-bold shadow-[0_0_28px_rgba(232,96,16,0.45)] hover:bg-orange-light transition-all"
          >
            Start the {top.name} course <ArrowRight size={16} />
          </Link>
          <button onClick={restart} className="mt-4 inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
            <RotateCcw size={13} /> Retake the quiz
          </button>
        </div>

        {/* Alternates */}
        {alts.length > 0 && (
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-center text-white/40 text-xs uppercase tracking-wider mb-4">Also worth exploring</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {alts.map((n) => (
                <Link
                  key={n.id}
                  href={`/courses/${n.courseSlug}`}
                  className="group flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-orange/30 transition-all"
                >
                  <span className="text-2xl">{n.emoji}</span>
                  <span className="flex-1">
                    <span className="block text-white font-heading font-semibold text-sm">{n.name}</span>
                    <span className="block text-white/40 text-xs">{n.pay} · {n.demand} demand</span>
                  </span>
                  <ArrowRight size={14} className="text-white/30 group-hover:text-orange transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Optional email capture */}
        <div className="mt-10 pt-8 border-t border-white/10 max-w-lg mx-auto">
          {sent ? (
            <p className="text-center text-emerald-400 text-sm flex items-center justify-center gap-2">
              <Check size={15} /> Sent! Check your inbox for your {top.name} roadmap.
            </p>
          ) : (
            <form onSubmit={sendRoadmap} className="text-center">
              <p className="text-white/70 text-sm mb-3">Want a personalized roadmap for becoming a {top.name}? We&apos;ll email it to you.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First name (optional)"
                  className="sm:w-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-orange/40"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="Your email"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-orange/40"
                />
                <button
                  type="submit"
                  disabled={sending || !email.trim()}
                  className="px-5 py-3 rounded-xl bg-white/10 text-white font-heading font-semibold text-sm hover:bg-white/15 disabled:opacity-40"
                >
                  {sending ? "Sending…" : "Email it"}
                </button>
              </div>
              <p className="text-white/25 text-[11px] mt-2">No spam. Just your roadmap and the occasional VA tip.</p>
            </form>
          )}
        </div>
      </motion.div>
    );
  }

  // ── QUESTION ────────────────────────────────────────────
  const q = QUESTIONS[step];
  const pct = Math.round((step / total) * 100);
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/40 text-xs font-accent">Question {step + 1} of {total}</span>
        <span className="text-orange text-xs font-accent font-semibold">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-8">
        <motion.div className="h-full bg-orange" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.3 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-6">{q.question}</h2>
          <div className="grid gap-3">
            {q.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => choose(opt)}
                className="group text-left flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-orange/50 hover:bg-orange/5 transition-all"
              >
                <span className="w-5 h-5 rounded-full border-2 border-white/25 group-hover:border-orange shrink-0 transition-colors" />
                <span className="text-white/85 text-sm md:text-base">{opt.label}</span>
                <ArrowRight size={16} className="ml-auto text-white/0 group-hover:text-orange transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <button onClick={back} className="mt-6 inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
      )}
    </div>
  );
}
