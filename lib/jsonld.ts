// ───────────────────────────────────────────────────────────────────────────
// Centralized JSON-LD (schema.org) builders.
// Reused across layouts/pages so Google can render rich results:
// Organization/ProfessionalService, sitelinks search box, breadcrumbs,
// Service pages, and articles.
// ───────────────────────────────────────────────────────────────────────────

export const SITE_URL = "https://www.bvnofficial.com";
export const SITE_NAME = "BVN";

/** Stable @id so multiple schemas can reference the same Organization node. */
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Organization / ProfessionalService node.
 * ProfessionalService is a LocalBusiness subtype — gives BVN eligibility for
 * local/knowledge-panel treatment while still describing a global agency.
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: SITE_NAME,
  legalName: "BVN",
  alternateName: "BVN Official",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/bvn-logo.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/bvn-logo.png`,
  description:
    "BVN is a global digital marketing and business automation agency trusted by 238+ clients worldwide. We help businesses scale through marketing excellence and intelligent operations automation — globally and locally in the Philippines.",
  email: "bvn@bvnofficial.com",
  telephone: "+63-981-655-6555",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Las Piñas",
    addressRegion: "Metro Manila",
    addressCountry: "PH",
  },
  areaServed: [
    { "@type": "Country", name: "Philippines" },
    { "@type": "Place", name: "Worldwide" },
  ],
  knowsAbout: [
    "Digital Marketing",
    "Search Engine Optimization",
    "Social Media Management",
    "Business Process Automation",
    "CRM Automation",
    "HR & Payroll Automation",
    "AI Agents",
    "Web Development",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+63-981-655-6555",
    email: "bvn@bvnofficial.com",
    contactType: "customer service",
    areaServed: ["PH", "Worldwide"],
    availableLanguage: ["English", "Filipino"],
  },
  founder: {
    "@type": "Person",
    name: "Benjamin Vincent Yson",
    url: `${SITE_URL}/benjaminyson`,
  },
  sameAs: ["https://www.facebook.com/bvndigital"],
};

/**
 * WebSite node + Sitelinks Search Box action.
 * Makes the brand SERP eligible for an in-results search box.
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": ORG_ID },
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/** Breadcrumb trail. Pass ordered [{ name, path }] from home → current page. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** A single Service offered by BVN, linked back to the Organization as provider. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType ?? opts.name,
    ...(opts.category ? { category: opts.category } : {}),
    url: `${SITE_URL}${opts.path}`,
    provider: { "@id": ORG_ID },
    areaServed: [
      { "@type": "Country", name: "Philippines" },
      { "@type": "Place", name: "Worldwide" },
    ],
  };
}

/** FAQPage — eligible for FAQ rich results. Pass [{ question, answer }]. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Render-ready helper: serialize one or more schema objects into a <script> string. */
export function jsonLdScript(schema: object) {
  return { __html: JSON.stringify(schema) };
}
