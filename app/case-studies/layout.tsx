import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients & Case Studies | BVN",
  description:
    "Real, clickable client builds by BVN: GoHighLevel CRM and automation, AI chatbots and voice, modern web apps, and SEO across industries worldwide.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Clients & Case Studies | BVN",
    description:
      "Real, clickable client builds by BVN across CRM automation, AI, web apps, and marketing.",
    url: "https://www.bvnofficial.com/case-studies",
    type: "website",
  },
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
