"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  UserPlus,
  Wallet,
  BadgeCheck,
  ShieldCheck,
  Receipt,
  Send,
  CheckCircle2,
  Circle,
  ChevronDown,
  Lock,
  Globe,
  Clock,
  Smartphone,
  Monitor,
  HelpCircle,
  AlertTriangle,
  Phone,
  ArrowRight,
  Banknote,
  CreditCard,
} from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

type Platform = "app" | "web";

interface Step {
  id: number;
  icon: typeof Mail;
  title: string;
  summary: string;
  bullets: string[];
  appNote?: string;
  webNote?: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    icon: Mail,
    title: "Open the payment request",
    summary:
      "You received an email (or link) saying “Benjamin Vincent Yson has requested …”. This is your official BVN invoice.",
    bullets: [
      "Confirm the requester name reads Benjamin Vincent Yson and the amount matches the invoice we agreed on.",
      "The big blue button says Pay with Remitly — that is the only button you need to press.",
      "Nothing is charged yet. This page just starts a secure transfer; you confirm everything before any money moves.",
    ],
    webNote:
      "On a computer, the request opens in your browser. Tap “Pay with Remitly” to begin.",
    appNote:
      "On your phone, tapping the button can open the Remitly app if you have it installed, or your mobile browser if you don’t.",
  },
  {
    id: 2,
    icon: UserPlus,
    title: "Sign in or create a free account",
    summary:
      "Remitly is a licensed, regulated money-transfer company (like Wise or Western Union). A free account takes about 2 minutes.",
    bullets: [
      "New to Remitly? Choose “Sign up”, enter your email, and create a password.",
      "Already have an account? Just “Log in” — your details carry over.",
      "Use your real legal name and details. It must match your ID for the security check in Step 6.",
    ],
    appNote:
      "The app remembers you, so future payments are faster — but the website works exactly the same.",
    webNote:
      "You can do the entire payment in your browser. No app download is required.",
  },
  {
    id: 3,
    icon: BadgeCheck,
    title: "Confirm the recipient & amount",
    summary:
      "Remitly shows who you are paying and how much. Take a moment to check it.",
    bullets: [
      "Recipient: Benjamin Vincent Yson (BVN).",
      "Amount: should match your invoice exactly (e.g. 1,000.00 USD).",
      "Delivery is pre-set by us — you don’t need to enter any bank details for BVN. If a field is already filled in, leave it as is.",
    ],
  },
  {
    id: 4,
    icon: Wallet,
    title: "Choose how YOU want to pay",
    summary:
      "This is how the money leaves your side. Pick whatever is most convenient for you.",
    bullets: [
      "Bank account (ACH/transfer) — usually the lowest fee, takes a little longer.",
      "Debit card — fast, small fee.",
      "Credit card — fastest, highest fee (your card issuer may treat it as a cash advance).",
      "Tip: a debit card is the best balance of speed and low cost for most clients.",
    ],
  },
  {
    id: 5,
    icon: Receipt,
    title: "Review fees & exchange rate",
    summary:
      "Remitly shows the full breakdown before you commit — no hidden charges.",
    bullets: [
      "You’ll see the transfer fee and the exchange rate (if your currency differs from the invoice).",
      "Make sure the amount BVN receives matches the invoice — adjust the “send” amount if a fee is added on top.",
      "Nothing is final until you press the confirm/pay button on the final screen.",
    ],
  },
  {
    id: 6,
    icon: ShieldCheck,
    title: "Verify your identity (first time only)",
    summary:
      "By law, money-transfer services must confirm who you are. This protects you against fraud.",
    bullets: [
      "Have a photo ID ready: passport, driver’s licence, or national ID.",
      "You may be asked to take a quick selfie or photo of the ID.",
      "This is a one-time check — future payments skip it.",
    ],
    appNote: "The app can use your phone camera for the ID photo, which is quickest.",
    webNote:
      "On a computer you may be sent a link to finish the photo step on your phone — that’s normal.",
  },
  {
    id: 7,
    icon: Send,
    title: "Submit & save your confirmation",
    summary:
      "Press the final pay button. You’ll get a confirmation number and an email receipt.",
    bullets: [
      "Look for the “Transfer successful” / confirmation screen.",
      "Remitly emails you a receipt with a confirmation/order number.",
      "Take a screenshot of the confirmation just in case.",
    ],
  },
  {
    id: 8,
    icon: BadgeCheck,
    title: "Send BVN your receipt",
    summary:
      "Final step — let us know it’s done so we can confirm and continue your project.",
    bullets: [
      "Reply to the invoice email, or message us, with your Remitly confirmation number or a screenshot.",
      "Email: bvn@bvnofficial.com · WhatsApp/Call: +63 981 655 6555",
      "We’ll confirm receipt, usually within a few hours.",
    ],
  },
];

const TRUST = [
  { icon: Lock, label: "Bank-level encryption", sub: "Your card & ID data is protected" },
  { icon: ShieldCheck, label: "Licensed & regulated", sub: "Remitly is a registered money transmitter" },
  { icon: Globe, label: "Used worldwide", sub: "Trusted by millions across 170+ countries" },
  { icon: Clock, label: "On-time delivery", sub: "Or Remitly refunds the fee" },
];

const CHECKLIST = [
  { icon: CreditCard, text: "A debit/credit card OR your bank login" },
  { icon: BadgeCheck, text: "A photo ID (passport, licence, or national ID)" },
  { icon: Mail, text: "Access to the email Remitly sends receipts to" },
  { icon: Banknote, text: "Your BVN invoice amount handy" },
];

const FAQS = [
  {
    q: "Is this safe? I’ve never used Remitly.",
    a: "Yes. Remitly is a publicly listed, licensed money-transfer company (NASDAQ: RELY) regulated in the US, UK, EU and more. We use it to receive international payments safely. You enter your details directly into Remitly’s secure site — BVN never sees your card or bank login.",
  },
  {
    q: "Do I need to download an app?",
    a: "No. You can complete everything in your web browser on a phone or computer. The app is optional and just makes future payments faster.",
  },
  {
    q: "Why do I have to verify my ID?",
    a: "All licensed money-transfer services are legally required to confirm a sender’s identity to prevent fraud and money laundering. It’s a one-time step and protects you as much as us.",
  },
  {
    q: "What are the fees?",
    a: "Remitly shows the exact fee and exchange rate before you confirm — there are no hidden charges. Paying from a bank account is usually cheapest; credit cards cost the most. Please make sure the amount BVN receives matches the invoice after fees.",
  },
  {
    q: "The amount or name looks wrong — what do I do?",
    a: "Stop and don’t pay. Contact us first at bvn@bvnofficial.com or +63 981 655 6555 and we’ll sort it out. The request should always read “Benjamin Vincent Yson” and match the figure we agreed.",
  },
  {
    q: "How long does it take to arrive?",
    a: "It depends on how you pay — debit/credit card transfers are often near-instant, bank transfers can take 1–3 business days. Remitly shows an estimated delivery time before you confirm.",
  },
  {
    q: "Can I pay in my own currency?",
    a: "Yes. Remitly handles the conversion and shows you the rate up front. Just double-check the amount BVN receives still matches the invoice.",
  },
];

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const STORAGE_KEY = "bvn-remitly-progress";

export default function RemitlyPaymentPage() {
  const [platform, setPlatform] = useState<Platform>("app");
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Restore progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {}
  }, [done]);

  const completed = Object.values(done).filter(Boolean).length;
  const pct = Math.round((completed / STEPS.length) * 100);

  function toggleDone(id: number) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="min-h-screen bg-navy-dark text-white">
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(600px circle at 50% 0%, rgba(27,48,96,0.6), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-light"
          >
            <ShieldCheck size={14} />
            Secure Payment Guide
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.05 }}
            className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl"
          >
            How to Pay Your BVN Invoice
            <br />
            <span className="text-orange">with Remitly</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-white/70 sm:text-lg"
          >
            Received a “Benjamin Vincent Yson has requested…” payment request? You’re
            in the right place. This is a simple, safe way to send your payment — follow
            the steps below and you’ll be done in a few minutes.
          </motion.p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Sample request callout                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white text-navy-dark shadow-2xl"
        >
          <div className="px-6 py-8 text-center sm:px-10 sm:py-10">
            <p className="font-body text-sm text-gray-600">
              Benjamin Vincent Yson has requested
            </p>
            <p className="mt-1 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
              1,000.00 <span className="text-gray-500">USD</span>
            </p>
            <p className="mt-1 font-body text-sm text-gray-500">Payment</p>
            <span className="mt-6 inline-flex cursor-default items-center gap-2 rounded-full bg-[#1f3a5f] px-7 py-3 font-heading text-sm font-semibold text-white">
              Pay with Remitly
            </span>
            <p className="mt-4 font-body text-xs text-gray-400">
              ↑ This is what your request looks like. The amount you see is just an example.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Trust strip                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 pb-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div
              key={t.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center"
            >
              <t.icon className="mx-auto text-orange-light" size={22} />
              <p className="mt-2 font-heading text-sm font-semibold">{t.label}</p>
              <p className="mt-0.5 font-body text-xs text-white/50">{t.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* What you'll need                                                 */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-heading text-2xl font-bold">Before you start</h2>
        <p className="mt-2 font-body text-white/60">Have these handy — it makes the whole thing quicker:</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {CHECKLIST.map((c) => (
            <div
              key={c.text}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <c.icon className="shrink-0 text-orange" size={18} />
              <span className="font-body text-sm text-white/80">{c.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Steps                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold">Step-by-step</h2>
            <p className="mt-2 font-body text-white/60">
              Tap a step to expand it. Tick each one off as you go — your progress is saved on this device.
            </p>
          </div>

          {/* Platform toggle */}
          <div className="inline-flex shrink-0 rounded-lg border border-white/15 bg-white/[0.03] p-1">
            {(
              [
                { id: "app", icon: Smartphone, label: "On my phone" },
                { id: "web", icon: Monitor, label: "On a computer" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPlatform(opt.id)}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 font-heading text-sm font-semibold transition-all ${
                  platform === opt.id
                    ? "bg-orange text-white shadow-[0_0_16px_rgba(232,96,16,0.4)]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <opt.icon size={16} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between font-body text-sm">
            <span className="text-white/70">
              {completed} of {STEPS.length} steps done
            </span>
            <span className="font-heading font-semibold text-orange-light">{pct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-orange"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          {pct === 100 && (
            <p className="mt-3 flex items-center gap-2 font-body text-sm text-green-400">
              <CheckCircle2 size={16} /> All done — thank you! Make sure you’ve sent us your receipt (Step 8).
            </p>
          )}
        </div>

        {/* Step list */}
        <div className="mt-6 space-y-3">
          {STEPS.map((step) => {
            const isOpen = openStep === step.id;
            const isDone = !!done[step.id];
            const note = platform === "app" ? step.appNote : step.webNote;
            return (
              <div
                key={step.id}
                className={`overflow-hidden rounded-xl border bg-white/[0.03] transition-colors ${
                  isDone ? "border-green-500/40" : "border-white/10"
                }`}
              >
                <div className="flex items-center gap-3 p-4">
                  {/* tick */}
                  <button
                    onClick={() => toggleDone(step.id)}
                    aria-label={isDone ? "Mark step not done" : "Mark step done"}
                    className="shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="text-green-400" size={26} />
                    ) : (
                      <Circle className="text-white/30 hover:text-orange" size={26} />
                    )}
                  </button>

                  {/* header (click to expand) */}
                  <button
                    onClick={() => setOpenStep(isOpen ? null : step.id)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange/15 font-heading text-sm font-bold text-orange-light">
                      {step.id}
                    </span>
                    <span className="flex-1">
                      <span
                        className={`block font-heading text-base font-semibold ${
                          isDone ? "text-white/50 line-through" : "text-white"
                        }`}
                      >
                        {step.title}
                      </span>
                    </span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-white/40 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="border-t border-white/10 px-4 py-5 pl-16">
                        <p className="font-body text-sm leading-relaxed text-white/75">
                          {step.summary}
                        </p>
                        <ul className="mt-4 space-y-2">
                          {step.bullets.map((b, i) => (
                            <li key={i} className="flex gap-2 font-body text-sm text-white/70">
                              <ArrowRight size={15} className="mt-1 shrink-0 text-orange" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                        {note && (
                          <div className="mt-4 flex gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
                            {platform === "app" ? (
                              <Smartphone size={16} className="mt-0.5 shrink-0 text-orange-light" />
                            ) : (
                              <Monitor size={16} className="mt-0.5 shrink-0 text-orange-light" />
                            )}
                            <p className="font-body text-xs leading-relaxed text-white/60">{note}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Safety note                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex gap-4 rounded-2xl border border-orange/30 bg-orange/[0.06] p-6">
          <AlertTriangle className="mt-0.5 shrink-0 text-orange-light" size={24} />
          <div>
            <h3 className="font-heading text-lg font-semibold">Stay safe — quick checks</h3>
            <ul className="mt-3 space-y-2 font-body text-sm text-white/75">
              <li>• The request will always be from <strong>Benjamin Vincent Yson</strong> and match the amount we agreed.</li>
              <li>• Enter your card/bank details only on Remitly’s own secure site or app — never share them with us by email or chat.</li>
              <li>• BVN will <strong>never</strong> ask for your password, card PIN, or a one-time code.</li>
              <li>• If anything looks off — wrong name, wrong amount, an unexpected request — pause and contact us first.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-6 flex items-center gap-2">
          <HelpCircle className="text-orange" size={22} />
          <h2 className="font-heading text-2xl font-bold">Common questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-heading text-sm font-semibold text-white sm:text-base">
                    {f.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-white/40 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="border-t border-white/10 px-5 py-4 font-body text-sm leading-relaxed text-white/70">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Help CTA                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-navy to-navy-dark p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Stuck on any step? We’re here.
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-white/70">
            Don’t guess — reach out and a real person from BVN will walk you through it.
            We’d rather help than have you worry.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <GlowButton href="mailto:bvn@bvnofficial.com" external showArrow>
              Email bvn@bvnofficial.com
            </GlowButton>
            <GlowButton href="tel:+639816556555" external variant="outline">
              <Phone size={16} /> +63 981 655 6555
            </GlowButton>
          </div>
          <p className="mt-6 font-body text-xs text-white/40">
            BVN · Benjamin Vincent Yson · Las Piñas, Philippines · www.bvnofficial.com
          </p>
        </div>
      </section>
    </div>
  );
}
