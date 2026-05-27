import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Digital Marketing & Automation Plans | BVN Philippines",
  description:
    "Transparent pricing for BVN's digital marketing and business automation services. Find the right plan for your Philippine business — from startups to enterprises.",
  keywords:
    "BVN pricing Philippines, digital marketing pricing Philippines, business automation cost Philippines, marketing agency prices Philippines",
  openGraph: {
    title: "Pricing — Digital Marketing & Automation Plans | BVN Philippines",
    description:
      "Transparent pricing for digital marketing and business automation. Find the right plan for your business.",
    url: "https://www.bvnofficial.com/pricing",
    type: "website",
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
