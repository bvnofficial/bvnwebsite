import type { Metadata } from "next";

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
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/marketing",
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
