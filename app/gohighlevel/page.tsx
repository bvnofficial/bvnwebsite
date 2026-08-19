import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Gift,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Star,
  Layers,
  MessageSquare,
  GitBranch,
  Bot,
} from "lucide-react";
import { getTool } from "@/lib/recommends";
import { buildMetadata } from "@/lib/og";
import { breadcrumbSchema, faqSchema, jsonLdScript, SITE_URL } from "@/lib/jsonld";
import { AffiliateCTA, AffiliateDisclosure } from "@/components/ui/AffiliateCTA";
import { PlatformBanner } from "@/components/ui/PlatformBanner";

const tool = getTool("gohighlevel")!;

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GoHighLevel Review 2026: Honest Take From a Builder Who Ships On It",
    description:
      "An honest GoHighLevel review from a builder who runs real client CRMs, pipelines and AI agents on it. What it does well, where it falls short, real pricing, and a free setup if you start through my link.",
    path: "/gohighlevel",
    ogTitle: "GoHighLevel Review, from a builder who ships on it",
    eyebrow: "Review",
    theme: "orange",
    keywords:
      "GoHighLevel review, GoHighLevel review 2026, is GoHighLevel worth it, GoHighLevel pricing, GoHighLevel free setup, GoHighLevel CRM, best all in one CRM, all in one platform, replace multiple tools, stop switching between tools, everything in one platform, GoHighLevel for small business, GoHighLevel vs HubSpot, HighLevel review",
  }),
  alternates: { canonical: `${SITE_URL}/gohighlevel` },
};

const FEATURES = [
  {
    icon: GitBranch,
    title: "CRM and pipelines",
    body: "A real CRM with drag and drop pipelines, so every lead has a stage and nothing sits forgotten in an inbox.",
  },
  {
    icon: MessageSquare,
    title: "Email and SMS",
    body: "Two way email and text from one place, with automations that follow up the moment a lead comes in.",
  },
  {
    icon: Layers,
    title: "Funnels and sites",
    body: "Build landing pages, funnels and full sites without a separate page builder subscription.",
  },
  {
    icon: Bot,
    title: "AI voice and chat",
    body: "Native AI that can answer calls, reply to messages and book jobs, so after hours enquiries do not go cold.",
  },
  {
    icon: Star,
    title: "Reviews and reputation",
    body: "Ask for reviews automatically and reply to them from the same dashboard your team already lives in.",
  },
  {
    icon: Sparkles,
    title: "Calendars and booking",
    body: "Booking calendars that write straight into the pipeline, so a booked call is already a tracked opportunity.",
  },
];

const PROS = [
  "One platform replaces a stack of five or six separate tools, so you pay and manage one thing",
  "Automations are genuinely powerful once set up, and the same workflow engine runs email, SMS and AI",
  "Native AI voice and chat that plug straight into your CRM, not a bolt on from a third party",
  "Flat pricing that does not punish you for growing your contact list the way some CRMs do",
  "Built for service businesses and the people who run their marketing, not just enterprise sales teams",
];

const CONS = [
  "The learning curve is real. There is a lot in here, and a blank account is intimidating on day one",
  "Setup is where most people stall. The tool is only as good as the pipelines and workflows you build in it",
  "Support can be slow at busy times, which matters more when you are still learning the platform",
  "It does so much that it is easy to leave half of it switched off and never see the value you pay for",
];

const FAQ = [
  {
    question: "Is GoHighLevel worth it?",
    answer:
      "If you are currently paying for a separate CRM, email tool, SMS tool, funnel builder and booking app, then yes, because GoHighLevel replaces all of them for one flat price. The catch is that the value comes from setup. An empty account is not worth anything. A properly built account with pipelines, follow up automations and AI cover pays for itself quickly. That is exactly why I offer a free setup when you start through my link.",
  },
  {
    question: "How much does GoHighLevel cost?",
    answer:
      "GoHighLevel runs on flat monthly plans rather than charging per contact. The starter plan suits a single business, and the higher plan adds the ability to run unlimited sub accounts, which is what agencies and builders use. Pricing changes over time, so check the current numbers on the signup page. The important point is that it is flat, so growing your list does not quietly inflate the bill.",
  },
  {
    question: "Is GoHighLevel good for a small business, not just agencies?",
    answer:
      "Yes. It is marketed heavily at agencies, but the core product is a CRM and automation platform that a solo operator or small team benefits from just as much. You do not need the agency features to get value. You need a pipeline, some follow up automations and a booking calendar, all of which come standard.",
  },
  {
    question: "What do I get for signing up through your link?",
    answer:
      "A starter automation snapshot loaded into your account, a free 30 minute setup call on a screen share, my build SOP pack, and a free audit of your first workflow. You get real help standing it up, not just a link. The bonus is free, and the link is an affiliate link so I may earn a commission at no extra cost to you.",
  },
  {
    question: "Do you actually use GoHighLevel yourself?",
    answer:
      "Yes. I build client CRMs, pipelines, automations, AI voice and chat agents, review engines and win back campaigns on GoHighLevel for real businesses. I only recommend tools I ship on, which is why this is the one I put my name behind.",
  },
];

export default function GoHighLevelReviewPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "GoHighLevel", path: "/gohighlevel" },
  ]);
  const faq = faqSchema(FAQ);
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GoHighLevel",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "97", priceCurrency: "USD" },
  };
  const review = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: "GoHighLevel",
      applicationCategory: "BusinessApplication",
    },
    author: { "@type": "Person", name: "Benjamin Vincent Yson", url: `${SITE_URL}/benjaminyson` },
    reviewRating: { "@type": "Rating", ratingValue: "4.6", bestRating: "5" },
    reviewBody:
      "GoHighLevel replaces a stack of separate tools with one CRM and automation platform. The learning curve is real, but a properly built account pays for itself. It is the platform I build almost every client system on.",
  };

  return (
    <main className="bg-white text-navy-dark">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faq)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(software)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(review)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-[#1B3060]/[0.05] to-white pt-28 pb-16 px-5">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E86010]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#E86010]">
            <Sparkles size={13} /> GoHighLevel Review 2026
          </span>
          <h1 className="mt-5 font-heading text-4xl md:text-5xl font-extrabold leading-tight text-navy-dark">
            GoHighLevel, reviewed by a builder who ships on it
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            Most reviews are written by people who signed up once to earn a commission. I run real
            client CRMs, pipelines and AI agents on GoHighLevel every week. Here is the honest version,
            what it does well, where it stalls people, and the free setup you get if you start through
            my link.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <AffiliateCTA slug={tool.slug} label="Start GoHighLevel and claim my free setup" />
            <a href="#verdict" className="text-sm font-semibold text-[#E86010] hover:underline">
              Read the verdict first
            </a>
          </div>
          <AffiliateDisclosure />
        </div>
      </section>

      {/* Platform banner */}
      <PlatformBanner slug={tool.slug} />

      {/* What it is */}
      <section className="mx-auto max-w-3xl px-5 py-14">
        <h2 className="font-heading text-3xl font-extrabold text-navy-dark">What GoHighLevel actually is</h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">{tool.description}</p>
        <p className="mt-4 leading-relaxed text-gray-600">
          The short version. Instead of a CRM here, an email tool there, a texting app, a funnel
          builder and a booking calendar all stitched together, GoHighLevel is one login that does all
          of it. That is the whole pitch, and it is a good one, because the seams between separate
          tools are where leads leak and follow up dies.
        </p>
      </section>

      {/* Features */}
      <section className="border-y border-gray-100 bg-[#1B3060]/[0.03] py-16 px-5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
            What you get in one login
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#E86010]/12 text-[#E86010]">
                  <f.icon size={20} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-navy-dark">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pros and cons */}
      <section id="verdict" className="mx-auto max-w-5xl px-5 py-16 scroll-mt-24">
        <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
          The honest verdict
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600 leading-relaxed">
          I would not put my name on a page that only says good things. Here is the balanced view after
          building on it for real clients.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#22A06B]/30 bg-[#22A06B]/[0.04] p-6">
            <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-navy-dark">
              <Check size={18} className="text-[#22A06B]" /> What it does well
            </h3>
            <ul className="mt-4 space-y-3">
              {PROS.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#22A06B]" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#D7263D]/25 bg-[#D7263D]/[0.03] p-6">
            <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-navy-dark">
              <X size={18} className="text-[#D7263D]" /> Where it falls short
            </h3>
            <ul className="mt-4 space-y-3">
              {CONS.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700">
                  <X size={16} className="mt-0.5 shrink-0 text-[#D7263D]" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 rounded-2xl border-l-4 border-[#E86010] bg-[#1B3060]/[0.03] p-6 text-gray-700 leading-relaxed">
          <strong className="text-navy-dark">My take.</strong> {tool.take}
        </div>
      </section>

      {/* Free setup offer */}
      <section className="border-y border-gray-100 bg-[#1B3060]/[0.03] py-16 px-5">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E86010]">
              <Gift size={14} /> Free when you start through my link
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold text-navy-dark">
              The tool is only as good as the setup, so I do the setup with you
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 leading-relaxed">
              The number one reason people quit GoHighLevel is a blank account they never built out.
              Start through my link and that does not happen, because I build the first version with
              you.
            </p>
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
          <div className="mt-10 text-center">
            <AffiliateCTA slug={tool.slug} label="Start GoHighLevel and claim my free setup" />
            <div className="mt-3">
              <Link href="/gohighlevel/free-setup" className="text-sm font-semibold text-[#E86010] hover:underline">
                See the full free setup offer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison teaser + proof */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/gohighlevel/vs-hubspot"
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#E86010]/40 hover:shadow-sm"
          >
            <h3 className="font-heading text-lg font-bold text-navy-dark">GoHighLevel vs HubSpot</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Deciding between the two most common all in one options. The honest breakdown of who each
              one actually suits.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#E86010]">
              Read the comparison <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link
            href="/case-studies"
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#E86010]/40 hover:shadow-sm"
          >
            <h3 className="font-heading text-lg font-bold text-navy-dark">The systems I have built on it</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Real pipelines, AI agents and campaigns I have shipped inside GoHighLevel for real
              businesses. Proof the free setup is real.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#E86010]">
              See the builds <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 px-5">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
            GoHighLevel questions, answered
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
          <div className="mt-10 text-center">
            <AffiliateCTA slug={tool.slug} label="Start GoHighLevel and claim my free setup" />
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <section className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-5">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#E86010]" />
          <p className="text-sm leading-relaxed text-gray-500">
            <strong className="text-navy-dark">Affiliate disclosure.</strong> Some links on this page
            are affiliate links. If you start an account through them, I may earn a commission at no
            extra cost to you. I only recommend tools I personally build client work on, and the free
            setup is my way of earning your signup rather than assuming it.
          </p>
        </div>
      </section>
    </main>
  );
}
