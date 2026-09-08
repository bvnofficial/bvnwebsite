import type { Metadata } from "next";
import { ogImage } from "@/lib/og";
import { serviceSchema, breadcrumbSchema, graphScript, SITE_URL } from "@/lib/jsonld";
import { operationsServices } from "@/lib/operations-services";

export const metadata: Metadata = {
  title: "Business Operations Automation Philippines — BVN Operations",
  description:
    "BVN Operations delivers AI automation, CRM automation, HR & payroll automation, business workflows, time tracking, and admin automation for Philippine businesses.",
  keywords:
    "business automation Philippines, operations automation Philippines, CRM automation Philippines, HR payroll automation Philippines, AI agents Philippines, admin automation Philippines",
  openGraph: {
    title: "Business Operations Automation Philippines — BVN Operations",
    description:
      "Intelligent business automation for Philippine companies. AI agents, CRM, HR & payroll, workflows, analytics — all automated.",
    url: "https://www.bvnofficial.com/operations",
    type: "website",
    images: [ogImage({ title: "Intelligent Business Automation", eyebrow: "Operations Automation", theme: "blue" })],
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/operations",
  },
};

export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  const schema = graphScript([
    serviceSchema({
      name: "Business Operations Automation",
      description:
        "Intelligent business automation for Philippine companies: AI agents, CRM automation, HR & payroll automation, workflows, time tracking and admin automation.",
      path: "/operations",
      serviceType: "Business Process Automation",
      category: "Operations",
    }),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "BVN Operations Services",
      itemListElement: operationsServices.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.title,
        url: `${SITE_URL}/operations/${s.slug}`,
      })),
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Operations", path: "/operations" },
    ]),
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schema} />
      {children}
    </>
  );
}
