import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, Minus, ShieldCheck, Sparkles, Star } from "lucide-react";
import { getTool } from "@/lib/recommends";
import { buildMetadata } from "@/lib/og";
import { breadcrumbSchema, faqSchema, jsonLdScript, SITE_URL } from "@/lib/jsonld";
import { AffiliateCTA, AffiliateDisclosure } from "@/components/ui/AffiliateCTA";

const tool = getTool("gohighlevel")!;

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GoHighLevel vs HubSpot (2026): An Honest Comparison for Small Businesses",
    description:
      "GoHighLevel vs HubSpot compared by a builder who ships on GoHighLevel. Pricing, features, who each one actually suits, and where HubSpot still wins. Plus a free setup if you choose GoHighLevel through my link.",
    path: "/gohighlevel/vs-hubspot",
    ogTitle: "GoHighLevel vs HubSpot, honestly compared",
    eyebrow: "Comparison",
    theme: "orange",
    keywords:
      "GoHighLevel vs HubSpot, HubSpot vs GoHighLevel, GoHighLevel alternative, HubSpot alternative, best CRM for small business, GoHighLevel pricing vs HubSpot, all in one CRM comparison",
  }),
  alternates: { canonical: `${SITE_URL}/gohighlevel/vs-hubspot` },
};

type Row = { label: string; ghl: "yes" | "no" | "part"; hub: "yes" | "no" | "part"; note?: string };

const ROWS: Row[] = [
  { label: "Flat pricing that does not scale with contacts", ghl: "yes", hub: "no", note: "HubSpot pricing climbs steeply as your contact list and seats grow." },
  { label: "CRM and pipelines", ghl: "yes", hub: "yes" },
  { label: "Email marketing", ghl: "yes", hub: "yes" },
  { label: "Two way SMS built in", ghl: "yes", hub: "part", note: "HubSpot needs paid add ons or integrations for full SMS." },
  { label: "Funnel and landing page builder included", ghl: "yes", hub: "part" },
  { label: "Native AI voice agent", ghl: "yes", hub: "no" },
  { label: "Booking calendars included", ghl: "yes", hub: "part" },
  { label: "Review and reputation management", ghl: "yes", hub: "no" },
  { label: "Run unlimited sub accounts (agency use)", ghl: "yes", hub: "no" },
  { label: "Polished, gentle onboarding", ghl: "part", hub: "yes", note: "HubSpot is more refined out of the box. GoHighLevel rewards a proper setup." },
  { label: "Large app marketplace and integrations", ghl: "part", hub: "yes" },
  { label: "Enterprise sales reporting depth", ghl: "part", hub: "yes" },
];

const cell = (v: "yes" | "no" | "part") =>
  v === "yes" ? (
    <Check size={18} className="mx-auto text-[#22A06B]" />
  ) : v === "no" ? (
    <X size={18} className="mx-auto text-[#D7263D]" />
  ) : (
    <Minus size={18} className="mx-auto text-gray-400" />
  );

const FAQ = [
  {
    question: "Is GoHighLevel better than HubSpot?",
    answer:
      "It depends on who you are. For a service business or a marketer who wants CRM, email, SMS, funnels, booking, AI and reviews in one flat priced login, GoHighLevel is usually the better fit. For a large sales team that needs deep enterprise reporting and a huge integration marketplace, HubSpot still leads. GoHighLevel wins on breadth and price. HubSpot wins on polish and depth in sales reporting.",
  },
  {
    question: "Is GoHighLevel cheaper than HubSpot?",
    answer:
      "Almost always, and the gap widens as you grow. GoHighLevel charges a flat monthly price no matter how many contacts you hold. HubSpot starts affordable but the paid tiers and per contact pricing climb quickly once you need marketing automation and more seats. If cost predictability matters, GoHighLevel is the safer bill.",
  },
  {
    question: "Can GoHighLevel replace HubSpot?",
    answer:
      "For most small and mid sized service businesses, yes. It covers the CRM, the marketing automation, the follow up and the booking that those teams rely on HubSpot for. The businesses that should stay on HubSpot are the ones leaning on its advanced sales reporting, its ecosystem of integrations, or a large existing HubSpot setup that would be costly to move.",
  },
  {
    question: "What do I get if I choose GoHighLevel through your link?",
    answer:
      "A starter automation snapshot loaded into your account, a free 30 minute setup call, my build SOP pack and a free audit of your first workflow. That setup is the thing that closes the polish gap with HubSpot, because a well built GoHighLevel account feels just as smooth. The link is an affiliate link, so I may earn a commission at no extra cost to you.",
  },
];

export default function GhlVsHubspotPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "GoHighLevel", path: "/gohighlevel" },
    { name: "GoHighLevel vs HubSpot", path: "/gohighlevel/vs-hubspot" },
  ]);
  const faq = faqSchema(FAQ);

  return (
    <main className="bg-white text-navy-dark">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faq)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-[#1B3060]/[0.05] to-white pt-28 pb-14 px-5">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E86010]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#E86010]">
            <Sparkles size={13} /> Comparison
          </span>
          <h1 className="mt-5 font-heading text-4xl md:text-5xl font-extrabold leading-tight text-navy-dark">
            GoHighLevel vs HubSpot
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            I build on GoHighLevel, so I will tell you upfront where my bias is. I will also tell you
            plainly where HubSpot is the better choice, because sending you to the wrong tool helps
            nobody. Here is the honest side by side.
          </p>
          <div className="mt-7">
            <AffiliateCTA slug={tool.slug} label="Choose GoHighLevel and claim my free setup" />
            <AffiliateDisclosure />
          </div>
        </div>
      </section>

      {/* Verdict summary */}
      <section className="mx-auto max-w-4xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#E86010]/25 bg-[#E86010]/[0.04] p-6">
            <h2 className="font-heading text-xl font-bold text-navy-dark">Choose GoHighLevel if</h2>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-gray-700">
              <li>You run a service business or manage marketing for one</li>
              <li>You want CRM, email, SMS, funnels, booking, AI and reviews in one flat priced login</li>
              <li>You want predictable billing that does not climb with your contact count</li>
              <li>You value breadth and are willing to invest in setup, or have me do it</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-heading text-xl font-bold text-navy-dark">Choose HubSpot if</h2>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-gray-700">
              <li>You have a large sales team that needs deep reporting</li>
              <li>You rely on a big library of native integrations</li>
              <li>You want the most polished out of the box onboarding and are fine paying for it</li>
              <li>You already have a mature HubSpot setup that would be costly to move</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-y border-gray-100 bg-[#1B3060]/[0.03] py-16 px-5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
            Feature by feature
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse overflow-hidden rounded-2xl border border-gray-200 bg-white text-sm">
              <thead>
                <tr className="bg-navy-dark text-white">
                  <th className="px-4 py-3 text-left font-heading font-bold">Feature</th>
                  <th className="px-4 py-3 text-center font-heading font-bold">GoHighLevel</th>
                  <th className="px-4 py-3 text-center font-heading font-bold">HubSpot</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={r.label} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-3 text-gray-700">
                      {r.label}
                      {r.note ? <span className="block text-xs text-gray-400">{r.note}</span> : null}
                    </td>
                    <td className="px-4 py-3">{cell(r.ghl)}</td>
                    <td className="px-4 py-3">{cell(r.hub)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-gray-400">
            Check mark is full support. Dash is partial or paid add on. Cross is not available or not a
            focus. Verify current pricing and features on each provider before you decide.
          </p>
        </div>
      </section>

      {/* My take */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="font-heading text-3xl font-extrabold text-navy-dark">The one honest sentence</h2>
        <div className="mt-5 rounded-2xl border-l-4 border-[#E86010] bg-[#1B3060]/[0.03] p-6 text-lg leading-relaxed text-gray-700">
          HubSpot is the more polished product, GoHighLevel is the better value and the wider toolkit,
          and the gap in polish closes almost entirely once a GoHighLevel account is set up properly,
          which is exactly the part I help with.
        </div>
        <div className="mt-8 text-center">
          <AffiliateCTA slug={tool.slug} label="Choose GoHighLevel and claim my free setup" />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 px-5">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-extrabold text-navy-dark">
            Common questions
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
        </div>
      </section>

      {/* Disclosure */}
      <section className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-5">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#E86010]" />
          <p className="text-sm leading-relaxed text-gray-500">
            <strong className="text-navy-dark">Affiliate disclosure.</strong> The GoHighLevel link on
            this page is an affiliate link. If you start an account through it, I may earn a commission
            at no extra cost to you. HubSpot is included as an honest comparison, not a recommendation
            against it. Choose the tool that fits your business.
          </p>
        </div>
      </section>
    </main>
  );
}
