import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";
import { jsonLdScript, SITE_URL } from "@/lib/jsonld";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Benjamin Vincent Yson — GoHighLevel, Automation & AI Builder",
    description:
      "The work and stack of Benjamin Vincent Yson: a solo builder who designs, builds and ships GoHighLevel CRM and automation, AI chatbots and voice agents, ServiceM8 field service, and modern web apps for businesses worldwide.",
    path: "/benjaminyson",
    ogTitle: "Benjamin Vincent Yson",
    eyebrow: "Builder & Developer",
    theme: "orange",
    keywords:
      "Benjamin Vincent Yson, Benjamin Yson, GoHighLevel expert, GoHighLevel developer, CRM automation specialist, AI chatbot builder, AI voice agent, ServiceM8 automation, full stack developer, BVN",
  }),
  alternates: { canonical: `${SITE_URL}/benjaminyson` },
};

export default function BenjaminYsonLayout({ children }: { children: React.ReactNode }) {
  // Person + ProfilePage structured data so search and AI engines understand
  // who this page is about and what he does.
  const person = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Benjamin Vincent Yson",
      alternateName: "Benjamin Yson",
      url: `${SITE_URL}/benjaminyson`,
      jobTitle: "CRM, Automation & AI Builder",
      worksFor: { "@type": "Organization", name: "BVN Digital", url: SITE_URL },
      knowsAbout: [
        "GoHighLevel",
        "CRM automation",
        "AI chatbots",
        "AI voice agents",
        "ServiceM8",
        "Lifecycle marketing",
        "Web development",
        "SEO",
      ],
      sameAs: [SITE_URL],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(person)} />
      {children}
    </>
  );
}
