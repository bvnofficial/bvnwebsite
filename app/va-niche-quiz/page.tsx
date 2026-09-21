import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NicheQuiz from "@/components/va-quiz/NicheQuiz";
import { NICHE_LIST, QUIZ_FAQ } from "@/lib/va-niches";

const TITLE = "VA Niche Quiz: Which Virtual Assistant Niche Is Right For You?";
const DESCRIPTION =
  "Take the free 2-minute VA niche quiz to find the best virtual assistant specialization for your skills and goals — from GoHighLevel and AI automation to social media, video, and more. Get your best-fit niche plus the course to start it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "VA niche quiz, which VA niche, best VA niche for beginners, virtual assistant niche quiz, VA career quiz, highest paying VA niches, how to choose a VA niche, become a virtual assistant, virtual assistant specialization, VA jobs, virtual assistant niches 2026",
  alternates: { canonical: "/va-niche-quiz" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.bvnofficial.com/va-niche-quiz",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function VaNicheQuizPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUIZ_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* ── Hero + Quiz ─────────────────────────────────── */}
      <section className="relative pt-28 pb-16 px-6 md:px-12 lg:px-24 bg-navy-dark border-b border-white/5">
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange/10 border border-orange/30 text-orange text-xs font-accent font-semibold mb-5">
            Free · 2 minutes · No sign-up
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white leading-tight">
            Which VA Niche Is Right For You?
          </h1>
          <p className="text-white/60 text-lg mt-4">
            Aspiring virtual assistants make one big mistake: trying to do everything. Answer 8 quick
            questions and get your <span className="text-white">best-fit VA niche</span> — plus the exact
            course to start it.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto mt-10">
          <NicheQuiz />
        </div>
      </section>

      {/* ── Why a niche matters ─────────────────────────── */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-navy-surface border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-4">
            Why choosing a VA niche changes everything
          </h2>
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              A <strong>virtual assistant niche</strong> is the specific type of work you focus on — like
              running ads, editing video, or managing a GoHighLevel CRM. Generalist VAs compete on price and
              get overlooked. Specialists get hired faster, charge more, and build a reputation clients
              refer.
            </p>
            <p>
              The hard part is knowing <em>which</em> niche fits you. This quiz matches your natural
              strengths, the tools you enjoy, and your income goals against the most in-demand VA niches in
              2026 — then points you to a real course so you can actually start.
            </p>
          </div>
        </div>
      </section>

      {/* ── The niches (crawlable) ──────────────────────── */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-navy-dark border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white text-center mb-3">
            The 12 in-demand VA niches
          </h2>
          <p className="text-white/50 text-center max-w-2xl mx-auto mb-10">
            Every result maps to a full BVN course. Explore them below, or take the quiz to find your match.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NICHE_LIST.map((n) => (
              <Link
                key={n.id}
                href={`/courses/${n.courseSlug}`}
                className="group flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-orange/30 transition-all"
              >
                <span className="text-3xl shrink-0">{n.emoji}</span>
                <span>
                  <span className="flex items-center gap-2">
                    <span className="font-heading font-bold text-white">{n.name}</span>
                    <span className="text-white/30 text-xs">{n.pay}</span>
                  </span>
                  <span className="block text-white/55 text-sm mt-1">{n.blurb}</span>
                  <span className="inline-flex items-center gap-1 text-orange text-xs font-accent font-semibold mt-2 group-hover:gap-2 transition-all">
                    View the course <ArrowRight size={12} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ (schema above) ──────────────────────────── */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-navy-surface border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-8">
            Virtual assistant niche FAQ
          </h2>
          <div className="space-y-4">
            {QUIZ_FAQ.map((f) => (
              <details key={f.q} className="group bg-white/5 border border-white/10 rounded-xl p-5">
                <summary className="cursor-pointer font-heading font-semibold text-white list-none flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-orange transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="text-white/60 text-sm leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-navy-dark text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-extrabold text-3xl text-white mb-4">Ready to pick your path?</h2>
          <p className="text-white/60 text-lg mb-8">
            Take the quiz, get your niche, and start the course today. Your remote VA career begins with one
            clear focus.
          </p>
          <Link
            href="#top"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange text-white font-heading font-bold shadow-[0_0_28px_rgba(232,96,16,0.45)] hover:bg-orange-light transition-all"
          >
            Take the VA niche quiz <ArrowRight size={16} />
          </Link>
          <p className="text-white/40 text-sm mt-6">
            Browse all <Link href="/courses" className="text-orange hover:underline">VA courses</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
