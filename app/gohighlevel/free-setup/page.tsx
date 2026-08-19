import type { Metadata } from "next";
import Link from "next/link";
import { Gift, ShieldCheck, Sparkles, Check, Clock, Star } from "lucide-react";
import { getTool } from "@/lib/recommends";
import { buildMetadata } from "@/lib/og";
import { breadcrumbSchema, faqSchema, jsonLdScript, SITE_URL } from "@/lib/jsonld";
import { AffiliateCTA, AffiliateDisclosure } from "@/components/ui/AffiliateCTA";
import { PlatformBanner } from "@/components/ui/PlatformBanner";

const tool = getTool("gohighlevel")!;

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Free GoHighLevel Setup: I Build Your First System With You",
    description:
      "Start GoHighLevel through my link and I set it up with you for free. A starter automation snapshot, a live 30 minute setup call, my build SOPs and a free workflow audit. Real help from a builder, not just a link.",
    path: "/gohighlevel/free-setup",
    ogTitle: "Free GoHighLevel setup, done with you",
    eyebrow: "Free Offer",
    theme: "orange",
    keywords:
      "GoHighLevel free setup, GoHighLevel setup service, GoHighLevel onboarding, GoHighLevel done for you, GoHighLevel snapshot, GoHighLevel setup help, free GoHighLevel automation",
  }),
  alternates: { canonical: `${SITE_URL}/gohighlevel/free-setup` },
};

const STEPS = [
  { n: "1", title: "Start your account", body: "Click the button and open your GoHighLevel account through my link. Takes a couple of minutes." },
  { n: "2", title: "Forward your confirmation", body: "Send me the signup confirmation so I can verify it and get your bonuses ready." },
  { n: "3", title: "We build it together", body: "I load your snapshot, then we get on a 30 minute screen share and stand up your first pipeline and automation live." },
];

const FAQ = [
  {
    question: "Is the setup really free?",
    answer:
      "Yes. When you start your GoHighLevel account through my link, the snapshot, the setup call, the SOP pack and the first workflow audit are all free. My side is covered by the affiliate commission GoHighLevel pays, so it costs you nothing extra.",
  },
  {
    question: "What is a snapshot?",
    answer:
      "A snapshot is a ready made GoHighLevel setup that imports into your account in one click. Mine includes a lead pipeline, the core follow up workflows and a nurture sequence, so you open your account to a working system instead of a blank screen.",
  },
  {
    question: "Do I need any experience?",
    answer:
      "No. The whole point of the setup call is that I walk you through it. You watch me build the first pieces, ask questions as we go, and end the call with something running that you understand.",
  },
  {
    question: "What if I already started a GoHighLevel account?",
    answer:
      "The bonus is tied to a new signup through my link, because that is what the affiliate program tracks. If you already have an account you can still book a paid setup with me. Reach out and I will tell you the straight options.",
  },
  {
    question: "How soon can we do the setup call?",
    answer:
      "Usually within a few days of your signup. Forward your confirmation, tell me your rough availability, and I will send times. The snapshot goes in first so the call is spent building, not importing.",
  },
];

export default function FreeSetupPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "GoHighLevel", path: "/gohighlevel" },
    { name: "Free Setup", path: "/gohighlevel/free-setup" },
  ]);
  const faq = faqSchema(FAQ);
  const offer = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: "Free GoHighLevel setup with signup",
    description:
      "A starter automation snapshot, a free 30 minute setup call, a build SOP pack and a free first workflow audit, free when you start GoHighLevel through the BVN affiliate link.",
    price: "0",
    priceCurrency: "USD",
    seller: { "@type": "Person", name: "Benjamin Vincent Yson", url: `${SITE_URL}/benjaminyson` },
  };

  return (
    <main className="bg-white text-navy-dark">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faq)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(offer)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-navy-dark pt-28 pb-16 px-5 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E86010]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#E86010]">
            <Gift size={13} /> Free setup offer
          </span>
          <h1 className="mt-5 font-heading text-4xl md:text-5xl font-extrabold leading-tight">
            Start GoHighLevel, and I build your first system with you. Free.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-300">
            Anyone can hand you an affiliate link. I would rather earn it. Start your GoHighLevel
            account through my link and you get a working setup and my time on a call, not a login and a
            shrug.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <AffiliateCTA slug={tool.slug} label="Start GoHighLevel and claim my free setup" />
            <a href="#whatyouget" className="text-sm font-semibold text-[#E86010] hover:underline">
              See everything included
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Affiliate link. The setup is free. I may earn a commission at no extra cost to you.
          </p>
        </div>
      </section>

      {/* Platform banner */}
      <PlatformBanner slug={tool.slug} />

      {/* What you get */}
      <section id="whatyouget" className="mx-auto max-w-4xl px-5 py-16 scroll-mt-24">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E86010]">
            <Sparkles size={14} /> Everything included
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-navy-dark">
            Four things, all free, all real
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {tool.bonuses.map((b, i) => (
            <div key={b.title} className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#E86010]/12 text-sm font-black text-[#E86010]">
                  {i + 1}
                </div>
                <h3 className="font-heading text-lg font-bold text-navy-dark">{b.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{b.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why free */}
      <section className="border-y border-gray-100 bg-[#1B3060]/[0.03] py-16 px-5">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-extrabold text-navy-dark">Why I give the setup away</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Two reasons, both honest. First, GoHighLevel pays me a commission when you sign up through
            my link, so I can afford to put real work in and still come out ahead. Second, a customer
            who actually gets their account running is a customer who stays, and that is better for
            everyone, you most of all.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "No upsell on the call. The free setup is the free setup",
              "You keep everything I build, snapshot and all",
              "You end the call with a working system, not homework",
              "If you want me to build more later, we talk. If not, no pressure",
            ].map((x) => (
              <div key={x} className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                <Check size={16} className="mt-0.5 shrink-0 text-[#22A06B]" /> {x}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to claim */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
          How to claim it, in three steps
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#E86010] text-lg font-black text-white">
                {s.n}
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-navy-dark">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center">
          <AffiliateCTA slug={tool.slug} label="Start GoHighLevel and claim my free setup" />
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={13} /> Setup call usually booked within a few days of signup
          </p>
          <AffiliateDisclosure />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 px-5">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
            Questions about the free setup
          </h2>
          <div className="mt-8 divide-y divide-gray-200">
            {FAQ.map((f) => (
              <details key={f.question} className="group py-5">
                <summary className="flex cursor-pointer items-start gap-2 font-heading text-lg font-bold text-navy-dark marker:content-['']">
                  <Star size={16} className="mt-1 shrink-0 text-[#E86010]" /> {f.question}
                </summary>
                <p className="mt-2 pl-6 leading-relaxed text-gray-600">{f.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            Prefer to read the full review first?{" "}
            <Link href="/gohighlevel" className="font-semibold text-[#E86010] hover:underline">
              See my honest GoHighLevel review
            </Link>
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <section className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-5">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#E86010]" />
          <p className="text-sm leading-relaxed text-gray-500">
            <strong className="text-navy-dark">Affiliate disclosure.</strong> The GoHighLevel link on
            this page is an affiliate link. If you start an account through it, I may earn a commission
            at no extra cost to you. The setup bonuses are genuinely free and are my way of earning your
            signup rather than assuming it.
          </p>
        </div>
      </section>
    </main>
  );
}
