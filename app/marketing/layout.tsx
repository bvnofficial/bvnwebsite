import type { Metadata } from "next";
import { ogImage } from "@/lib/og";
import { serviceSchema, breadcrumbSchema, graphScript, SITE_URL } from "@/lib/jsonld";
import { marketingServices } from "@/lib/marketing-services";

export const metadata: Metadata = {
  title: "Digital Marketing Services Philippines — BVN Marketing",
  description:
    "BVN Marketing delivers social media management, SEO, content marketing, email marketing, video marketing, web development, and influencer marketing for Philippine businesses.",
  keywords:
    "digital marketing services Philippines, social media management Philippines, SEO Philippines, content marketing Philippines, email marketing Philippines, web development Philippines",
  openGraph: {
    title: "Digital Marketing Services Philippines — BVN Marketing",
    description:
      "Full-service digital marketing for Philippine businesses. Social media, SEO, content, email, video, web development — all under one roof.",
    url: "https://www.bvnofficial.com/marketing",
    type: "website",
    images: [ogImage({ title: "Full-Service Digital Marketing", eyebrow: "Marketing Services", theme: "orange" })],
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/marketing",
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const schema = graphScript([
    serviceSchema({
      name: "Digital Marketing Services",
      description:
        "Full-service digital marketing for Philippine businesses: social media management, SEO, content, email, video, web development and influencer marketing.",
      path: "/marketing",
      serviceType: "Digital Marketing",
      category: "Marketing",
    }),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "BVN Marketing Services",
      itemListElement: marketingServices.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.title,
        url: `${SITE_URL}/marketing/${s.slug}`,
      })),
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Marketing", path: "/marketing" },
    ]),
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schema} />
      {children}
    </>
  );
}
