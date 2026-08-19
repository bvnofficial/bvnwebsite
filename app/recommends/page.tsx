import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gift, BadgeCheck, ShieldCheck, Sparkles, Star } from "lucide-react";
import { RECOMMENDED_TOOLS } from "@/lib/recommends";
import { buildMetadata } from "@/lib/og";
import { breadcrumbSchema, faqSchema, jsonLdScript, SITE_URL } from "@/lib/jsonld";

const tool = RECOMMENDED_TOOLS[0]; // primary recommendation

export const metadata: Metadata = {
  ...buildMetadata({
    title: `The Tools I Build Client Systems On | ${tool.name} + Free Setup`,
    description:
      `The software I actually build client CRMs and automations on. Sign up for ${tool.name} through my link and get a free starter automation snapshot, a setup call and my build SOPs. Honest recommendation from a working builder.`,
    path: "/recommends",
    ogTitle: "The tools I build client systems on",
    eyebrow: "Recommended",
    theme: "orange",
    keywords:
      "GoHighLevel, GoHighLevel free snapshot, GoHighLevel setup, GoHighLevel affiliate, best all in one CRM, CRM automation platform, agency CRM, recommended marketing tools, GoHighLevel review",
  }),
  alternates: { canonical: `${SITE_URL}/recommends` },
};

const FAQ = [
  {
    question: `Do you actually use ${tool.name}?`,
    answer:
      `Yes. I build client CRMs, pipelines, automations, AI agents, review engines and win back campaigns on ${tool.name} for real businesses. I only recommend tools I ship on, which is why this is the one I put my name behind.`,
  },
  {
    question: "What do I get for signing up through your link?",
    answer:
      "A starter automation snapshot loaded into your account, a free 30 minute setup call, my build SOP pack, and a free audit of your first workflow. You get real help standing it up, not just a link.",
  },
  {
    question: "Does the bonus cost me anything?",
    answer:
      "No. The bonuses are free when you start your account through my link. The link is an affiliate link, so I may earn a commission at no extra cost to you.",
  },
  {
    question: "How do I claim the free bonus?",
    answer:
      `Start your ${tool.name} account through the button on this page, then forward me your confirmation. I will send the snapshot and book your setup call.`,
  },
  {
    question: `Is ${tool.name} good for a small business, not just agencies?`,
    answer:
      "Yes. It replaces a stack of separate tools with one platform for your CRM, follow ups, funnels, calendars and reviews, which suits a solo operator or a small team just as well as an agency.",
  },
];

const HOW_IT_WORKS = [
  { n: "1", title: "Start your account", body: `Click the button and open your ${tool.name} account through my link.` },
  { n: "2", title: "Send me your confirmation", body: "Forward the signup confirmation so I can verify and set you up." },
  { n: "3", title: "Get built with, not just sold to", body: "I load your snapshot and we get on a call to stand up your first system." },
];

export default function RecommendsPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Recommends", path: "/recommends" },
  ]);
  const faq = faqSchema(FAQ);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tools I build client systems on",
    itemListElement: RECOMMENDED_TOOLS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      description: t.tagline,
      url: `${SITE_URL}/recommends`,
    })),
  };

  return (
    <main className="bg-white text-navy-dark">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faq)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(itemList)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-[#1B3060]/[0.04] to-white pt-28 pb-16 px-5">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E86010]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#E86010]">
            <Sparkles size={13} /> Recommended
          </span>
          <h1 className="mt-5 font-heading text-4xl md:text-5xl font-extrabold leading-tight text-navy-dark">
            The tools I build client systems on
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            I am BVN, a solo builder. I do not recommend software I have not shipped on. Below is the
            platform I actually run client CRMs and automations on, and the free help you get for
            starting through my link.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/go/${tool.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#E86010] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#E86010]/25 transition hover:brightness-110"
            >
              Get {tool.name} + my free bonus <ArrowRight size={16} />
            </Link>
            <Link href="/gohighlevel" className="text-sm font-semibold text-[#E86010] hover:underline">
              Read the full GoHighLevel review
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Affiliate link. I may earn a commission at no extra cost to you.
          </p>
        </div>
      </section>

      {/* Featured tool */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <article className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E86010]/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#E86010]">
              <BadgeCheck size={12} /> The tool I build on
            </span>
            <span className="text-xs font-semibold text-gray-400">{tool.category}</span>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-extrabold text-navy-dark">{tool.name}</h2>
          <p className="mt-3 text-lg leading-relaxed text-gray-700">{tool.tagline}</p>
          <p className="mt-4 leading-relaxed text-gray-600">{tool.description}</p>

          <blockquote className="mt-6 rounded-2xl border-l-4 border-[#E86010] bg-[#1B3060]/[0.03] p-5 text-gray-700 leading-relaxed">
            {tool.take}
          </blockquote>

          <div className="mt-6 flex flex-wrap gap-2">
            {tool.tags.map((t) => (
              <span key={t} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            {tool.proof.map((p) => (
              <Link key={p.href} href={p.href} className="text-sm font-semibold text-[#E86010] hover:underline">
                {p.label} →
              </Link>
            ))}
          </div>
        </article>
      </section>

      {/* Bonus */}
      <section id="bonus" className="border-y border-gray-100 bg-[#1B3060]/[0.03] py-16 px-5 scroll-mt-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E86010]">
              <Gift size={14} /> Free with your signup
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold text-navy-dark">
              Start through my link, get built with, not just sold to
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 leading-relaxed">
              Anyone can drop an affiliate link. I would rather earn it. Sign up through mine and you
              get real assets I have built, plus my time to help you start.
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
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">How to claim it</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#E86010] text-lg font-black text-white">
                {s.n}
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-navy-dark">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href={`/go/${tool.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E86010] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#E86010]/25 transition hover:brightness-110"
          >
            Get {tool.name} + my free bonus <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 px-5">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
            Questions, answered
          </h2>
          <div className="mt-8 divide-y divide-gray-200">
            {FAQ.map((f) => (
              <div key={f.question} className="py-5">
                <h3 className="flex items-start gap-2 font-heading text-lg font-bold text-navy-dark">
                  <Star size={16} className="mt-1 shrink-0 text-[#E86010]" /> {f.question}
                </h3>
                <p className="mt-2 pl-6 leading-relaxed text-gray-600">{f.answer}</p>
              </div>
            ))}
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
            extra cost to you. I only recommend tools I personally build client work on, and the bonus
            is my way of earning your signup rather than assuming it.
          </p>
        </div>
      </section>
    </main>
  );
}
