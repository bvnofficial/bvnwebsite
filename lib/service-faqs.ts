// ───────────────────────────────────────────────────────────────────────────
// Generates genuine, on-page FAQ content for every marketing & operations
// service page — grounded entirely in the real service data. Feeds both the
// visible <ServiceFAQ> accordion and the FAQPage JSON-LD, which is one of the
// strongest signals for AI answer engines (ChatGPT, Perplexity, Google AI
// Overviews) to quote BVN directly.
// ───────────────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

interface ServiceLike {
  title: string;
  shortDesc: string;
  heroSubtext: string;
  features: { title: string; desc: string }[];
  caseStudies: {
    company: string;
    country: string;
    industry: string;
    metric: string;
    metricLabel: string;
    results: string[];
  }[];
}

/**
 * Build 6 answer-engine-friendly FAQs for a service.
 * @param service  The marketing or operations service record.
 * @param hub      "Marketing" or "Operations" (used for phrasing only).
 */
export function buildServiceFaqs(
  service: ServiceLike,
  hub: "Marketing" | "Operations"
): FaqItem[] {
  const t = service.title;
  const featureList = service.features
    .slice(0, 6)
    .map((f) => `${f.title} (${f.desc})`)
    .join("; ");

  const cs = service.caseStudies[0];
  const resultLine = cs?.results?.[0] ?? "";

  const faqs: FaqItem[] = [
    {
      question: `What is BVN's ${t} service?`,
      answer: `${service.shortDesc} ${service.heroSubtext} BVN is a global marketing and business-automation agency trusted by 238+ clients worldwide, serving businesses internationally and locally in the Philippines.`,
    },
    {
      question: `What does BVN's ${t} service include?`,
      answer: `BVN's ${t} service includes: ${featureList}.`,
    },
    {
      question: `Does BVN offer ${t} for international clients or only in the Philippines?`,
      answer: `Both. BVN is based in Las Piñas, Metro Manila, Philippines, and delivers ${t} to clients worldwide — including the United States, United Kingdom, Australia, Canada, and across Europe — as well as to local Philippine businesses. Work is delivered remotely with communication in English and Filipino.`,
    },
    ...(cs
      ? [
          {
            question: `What results has BVN achieved with ${t}?`,
            answer: `For ${cs.company}, a ${cs.industry.toLowerCase()} business in ${cs.country}, BVN's ${t} work delivered ${cs.metric} ${cs.metricLabel.toLowerCase()}.${resultLine ? ` Highlight: ${resultLine}.` : ""} Results vary by business, market, and starting point.`,
          },
        ]
      : []),
    {
      question: `How much does ${t} cost with BVN?`,
      answer: `Pricing for ${t} depends on your goals, scope, and current setup, so BVN scopes each engagement individually rather than using one-size-fits-all packages. You can see indicative packages on the pricing page (bvnofficial.com/pricing) and book a free consultation for a tailored quote.`,
    },
    {
      question: `How do I get started with BVN's ${t} service?`,
      answer: `Book a free consultation at bvnofficial.com/get-started or contact BVN at bvn@bvnofficial.com. BVN will review your goals, recommend an approach, and provide a tailored ${t} proposal — no obligation.`,
    },
  ];

  return faqs;
}
