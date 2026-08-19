import Link from "next/link";
import { Gift, ShieldCheck, Sparkles, Check, Star } from "lucide-react";
import { getTool } from "@/lib/recommends";
import { breadcrumbSchema, faqSchema, jsonLdScript } from "@/lib/jsonld";
import { AffiliateCTA, AffiliateDisclosure } from "@/components/ui/AffiliateCTA";

// Shared layout for a single HighLevel sub-program page (AI Employee, Ad Manager,
// WordPress Unlimited). Each route passes unique copy so pages do not read as
// duplicates, while the structure, schema and affiliate wiring stay in one place.
export type ProgramPageProps = {
  slug: string;
  breadcrumbName: string;
  breadcrumbPath: string;
  eyebrow: string;
  h1: string;
  intro: string;
  whatItIs: string[];
  features: { title: string; body: string }[];
  useCasesTitle: string;
  useCases: string[];
  ctaLabel: string;
  faq: { question: string; answer: string }[];
};

export function ProgramPage(props: ProgramPageProps) {
  const tool = getTool(props.slug);
  if (!tool) return null;

  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "GoHighLevel", path: "/gohighlevel" },
    { name: props.breadcrumbName, path: props.breadcrumbPath },
  ]);
  const faq = faqSchema(props.faq);

  return (
    <main className="bg-white text-navy-dark">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faq)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-[#1B3060]/[0.05] to-white pt-28 pb-14 px-5">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E86010]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#E86010]">
            <Sparkles size={13} /> {props.eyebrow}
          </span>
          <h1 className="mt-5 font-heading text-4xl md:text-5xl font-extrabold leading-tight text-navy-dark">
            {props.h1}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">{props.intro}</p>
          <div className="mt-7">
            <AffiliateCTA slug={props.slug} label={props.ctaLabel} />
            <AffiliateDisclosure />
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="mx-auto max-w-3xl px-5 py-14">
        <h2 className="font-heading text-3xl font-extrabold text-navy-dark">What it is</h2>
        {props.whatItIs.map((p, i) => (
          <p key={i} className={`${i === 0 ? "mt-4 text-lg" : "mt-4"} leading-relaxed text-gray-700`}>
            {p}
          </p>
        ))}
        <div className="mt-6 rounded-2xl border-l-4 border-[#E86010] bg-[#1B3060]/[0.03] p-6 text-gray-700 leading-relaxed">
          <strong className="text-navy-dark">My take.</strong> {tool.take}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-gray-100 bg-[#1B3060]/[0.03] py-16 px-5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
            What it does
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {props.features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="font-heading text-lg font-bold text-navy-dark">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="font-heading text-3xl font-extrabold text-navy-dark">{props.useCasesTitle}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {props.useCases.map((u) => (
            <div key={u} className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
              <Check size={16} className="mt-0.5 shrink-0 text-[#22A06B]" /> {u}
            </div>
          ))}
        </div>
      </section>

      {/* Bonus / free setup */}
      <section className="border-y border-gray-100 bg-[#1B3060]/[0.03] py-16 px-5">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E86010]">
              <Gift size={14} /> Free when you start through my link
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold text-navy-dark">
              Start through my link and I set it up with you
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <AffiliateCTA slug={props.slug} label={props.ctaLabel} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
          Questions, answered
        </h2>
        <div className="mt-8 divide-y divide-gray-200">
          {props.faq.map((f) => (
            <details key={f.question} className="group py-5">
              <summary className="flex cursor-pointer items-start gap-2 font-heading text-lg font-bold text-navy-dark marker:content-['']">
                <Star size={16} className="mt-1 shrink-0 text-[#E86010]" /> {f.question}
              </summary>
              <p className="mt-2 pl-6 leading-relaxed text-gray-600">{f.answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          Want the whole platform first?{" "}
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
