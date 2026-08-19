import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gift, ShieldCheck, Check, Sparkles, Star, Repeat, Tag, Layers, Users } from "lucide-react";
import { getTool } from "@/lib/recommends";
import { buildMetadata } from "@/lib/og";
import { breadcrumbSchema, faqSchema, jsonLdScript, SITE_URL } from "@/lib/jsonld";
import { AffiliateCTA, AffiliateDisclosure } from "@/components/ui/AffiliateCTA";

const tool = getTool("gohighlevel-saas-pro")!;

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GoHighLevel SaaS Pro ($497 Plan): Resell It As Your Own Software",
    description:
      "The GoHighLevel SaaS Pro plan turns SaaS Mode on so you can rebill GoHighLevel under your own brand and earn recurring revenue. What the $497 plan unlocks, who it suits, and a free SaaS setup through my link.",
    path: "/gohighlevel/saas-pro",
    ogTitle: "GoHighLevel SaaS Pro, resell it as your own",
    eyebrow: "SaaS Pro Plan",
    theme: "orange",
    keywords:
      "GoHighLevel SaaS Pro, GoHighLevel $497 plan, GoHighLevel SaaS mode, white label GoHighLevel, resell GoHighLevel, start a SaaS agency, GoHighLevel agency plan, GoHighLevel rebilling, GoHighLevel Pro plan",
  }),
  alternates: { canonical: `${SITE_URL}/gohighlevel/saas-pro` },
};

const UNLOCKS = [
  {
    icon: Tag,
    title: "Your brand, your prices",
    body: "Rebill GoHighLevel to your clients under your own name at prices you set. They see your software, not the platform behind it.",
  },
  {
    icon: Repeat,
    title: "Recurring revenue",
    body: "You stop selling one off projects and start earning monthly software revenue that compounds with every client you add.",
  },
  {
    icon: Layers,
    title: "Unlimited sub accounts",
    body: "Spin up a fresh sub account for every client, each isolated with its own pipeline, automations and data.",
  },
  {
    icon: Users,
    title: "Client onboarding built in",
    body: "Load a snapshot into each new sub account so clients start on a working system, not a blank screen you have to babysit.",
  },
];

const FOR_YOU = [
  "You run an agency and want recurring software revenue, not just retainers",
  "You are already reselling tools and want the margin the platform keeps",
  "You want to package your service as software your clients log into",
  "You are ready to sign clients and want a repeatable way to stand each one up",
];

const FAQ = [
  {
    question: "What is the GoHighLevel SaaS Pro plan?",
    answer:
      "SaaS Pro is the higher GoHighLevel tier that unlocks SaaS Mode. SaaS Mode lets you rebill the platform to your own clients under your brand, at your prices, with unlimited sub accounts. It is the plan agencies use to sell GoHighLevel as their own software instead of just managing it for people.",
  },
  {
    question: "How much is the SaaS Pro plan?",
    answer:
      "The SaaS Pro plan is priced at 497 US dollars a month at the time of writing. Pricing can change, so check the current number on the signup page. The point of the plan is that it pays for itself once you have a handful of clients rebilling through it, because the recurring revenue you charge them is yours.",
  },
  {
    question: "Do I need to be a big agency to use SaaS Mode?",
    answer:
      "No. You need a way to sign a few clients and a system to onboard them, which is exactly what I help set up. Plenty of solo operators run a profitable SaaS on this plan. The plan makes sense the moment you have clients you can rebill, not when you hit some headcount.",
  },
  {
    question: "What do I get for starting through your link?",
    answer:
      "A rebill ready client snapshot, a free 45 minute call where we turn on SaaS Mode and set your plans and rebilling together, and my agency onboarding SOP so you can add clients without reinventing the process. The link is an affiliate link, so I may earn a commission at no extra cost to you.",
  },
  {
    question: "Can you set up SaaS Mode for me?",
    answer:
      "Yes. Turning SaaS Mode on is the easy part. The work is the snapshot each client starts on, the plans and rebilling, and the onboarding flow. That is the part I build with you on the setup call, and the SOP I hand you covers doing it again for every client after.",
  },
];

export default function SaasProPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "GoHighLevel", path: "/gohighlevel" },
    { name: "SaaS Pro", path: "/gohighlevel/saas-pro" },
  ]);
  const faq = faqSchema(FAQ);
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "GoHighLevel SaaS Pro Plan",
    description:
      "The GoHighLevel SaaS Pro plan unlocks SaaS Mode for reselling GoHighLevel under your own brand with unlimited sub accounts and rebilling.",
    brand: { "@type": "Brand", name: "GoHighLevel" },
    offers: { "@type": "Offer", price: "497", priceCurrency: "USD" },
  };

  return (
    <main className="bg-white text-navy-dark">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faq)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(product)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-navy-dark pt-28 pb-16 px-5 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E86010]/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E86010]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#E86010]">
            <Sparkles size={13} /> SaaS Pro Plan
          </span>
          <h1 className="mt-5 font-heading text-4xl md:text-5xl font-extrabold leading-tight">
            Stop selling hours. Sell software.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-300">
            The GoHighLevel SaaS Pro plan turns on SaaS Mode, so you can rebill the whole platform to
            your clients under your own brand and keep the recurring revenue. Here is what the plan
            unlocks, who it is for, and the free setup you get for starting through my link.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <AffiliateCTA slug={tool.slug} label="Start SaaS Pro and claim my free setup" />
            <a href="#unlocks" className="text-sm font-semibold text-[#E86010] hover:underline">
              See what it unlocks
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Affiliate link. If you start an account through it I may earn a commission at no extra cost to you.
          </p>
        </div>
      </section>

      {/* What it is */}
      <section className="mx-auto max-w-3xl px-5 py-14">
        <h2 className="font-heading text-3xl font-extrabold text-navy-dark">What the SaaS Pro plan is</h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">{tool.description}</p>
        <div className="mt-6 rounded-2xl border-l-4 border-[#E86010] bg-[#1B3060]/[0.03] p-6 text-gray-700 leading-relaxed">
          <strong className="text-navy-dark">My take.</strong> {tool.take}
        </div>
      </section>

      {/* Unlocks */}
      <section id="unlocks" className="border-y border-gray-100 bg-[#1B3060]/[0.03] py-16 px-5 scroll-mt-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
            What SaaS Mode unlocks
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {UNLOCKS.map((u) => (
              <div key={u.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#E86010]/12 text-[#E86010]">
                  <u.icon size={20} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-navy-dark">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="font-heading text-3xl font-extrabold text-navy-dark">Who this plan is for</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {FOR_YOU.map((f) => (
            <div key={f} className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
              <Check size={16} className="mt-0.5 shrink-0 text-[#22A06B]" /> {f}
            </div>
          ))}
        </div>
        <p className="mt-6 leading-relaxed text-gray-600">
          If you only need a CRM for your own business, you do not need this tier. Start with the{" "}
          <Link href="/gohighlevel" className="font-semibold text-[#E86010] hover:underline">
            standard plan
          </Link>{" "}
          instead. SaaS Pro earns its price when you are reselling to clients.
        </p>
      </section>

      {/* Offer */}
      <section className="border-y border-gray-100 bg-[#1B3060]/[0.03] py-16 px-5">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E86010]">
              <Gift size={14} /> Free when you start through my link
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold text-navy-dark">
              I set up SaaS Mode with you, not just point you at it
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600 leading-relaxed">
              Turning SaaS Mode on takes a minute. Making it run, with a client snapshot, rebilling and
              an onboarding flow, is the real work. That is what I do with you.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {tool.bonuses.map((b, i) => (
              <div key={b.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#E86010]/12 text-sm font-black text-[#E86010]">
                    {i + 1}
                  </div>
                  <h3 className="font-heading text-base font-bold text-navy-dark">{b.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{b.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <AffiliateCTA slug={tool.slug} label="Start SaaS Pro and claim my free setup" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
          SaaS Pro questions, answered
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
          New to the platform first?{" "}
          <Link href="/gohighlevel" className="font-semibold text-[#E86010] hover:underline">
            Read my GoHighLevel review
          </Link>
        </div>
      </section>

      {/* Disclosure */}
      <section className="mx-auto max-w-3xl px-5 pb-14">
        <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-5">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#E86010]" />
          <p className="text-sm leading-relaxed text-gray-500">
            <strong className="text-navy-dark">Affiliate disclosure.</strong> The link on this page is
            an affiliate link. If you start an account through it, I may earn a commission at no extra
            cost to you. I only recommend tools I actually build client work on.
          </p>
        </div>
      </section>
    </main>
  );
}
