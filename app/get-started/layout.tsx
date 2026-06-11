import type { Metadata } from "next";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Claim Your Free Website — BVN Digital",
  description:
    "BVN builds your first business page for free. No upfront cost, no contracts. Live in 7 days. Fill in your details and we'll be in touch within 24 hours.",
  openGraph: {
    title: "Claim Your Free Website — BVN Digital",
    description:
      "BVN builds your first business page for free. No upfront cost, no contracts. Live in 7 days.",
    url: "https://www.bvnofficial.com/get-started",
    type: "website",
    images: [ogImage({ title: "Claim Your Free Business Website", eyebrow: "Free Website Offer", theme: "green" })],
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/get-started",
  },
};

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
