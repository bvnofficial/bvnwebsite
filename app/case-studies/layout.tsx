import type { Metadata } from "next";
import { CASE_STUDIES } from "@/lib/case-studies";
import { breadcrumbSchema, jsonLdScript, SITE_URL } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Clients & Case Studies | BVN",
  description:
    "Real, clickable client builds by BVN: GoHighLevel CRM and automation, AI chatbots and voice agents, ServiceM8 field service, modern web apps, and SEO across industries worldwide.",
  keywords:
    "GoHighLevel case studies, GoHighLevel CRM builds, ServiceM8 automation, AI chatbot builds, AI voice agent, lifecycle automation, marketing automation portfolio, BVN clients, agency case studies",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Clients & Case Studies | BVN",
    description:
      "Real, clickable client builds by BVN across CRM automation, AI, web apps, and marketing.",
    url: `${SITE_URL}/case-studies`,
    type: "website",
  },
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  // Structured data: an ItemList of every case study (rich-result + AI-search
  // eligible) plus a breadcrumb. Rendered server-side so crawlers see it.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "BVN client builds and case studies",
    description:
      "Delivered client work by BVN across CRM and automation, AI, web apps, marketing and operations.",
    numberOfItems: CASE_STUDIES.length,
    itemListElement: CASE_STUDIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      description: c.summary,
      url: `${SITE_URL}${c.href}`,
    })),
  };
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Clients", path: "/case-studies" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(itemList)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumb)} />
      {children}
    </>
  );
}
