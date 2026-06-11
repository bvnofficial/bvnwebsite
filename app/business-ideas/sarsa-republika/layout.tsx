import type { Metadata } from "next";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Sarsa Republika — Filipino Rotisserie Chicken Business Concept",
  description:
    "Full business concept for Sarsa Republika — a Filipino spatchcock rotisserie chicken brand with unlimited Filipino sauces. Branding, menu, marketing, operations, and financial projections.",
  openGraph: {
    title: "Sarsa Republika — Filipino Rotisserie Chicken Business Concept",
    description: "Full business concept: branding, menu, marketing, operations & financials for a Filipino rotisserie chicken brand.",
    url: "https://www.bvnofficial.com/business-ideas/sarsa-republika",
    type: "website",
    images: [ogImage({ title: "Filipino Rotisserie Chicken Concept", eyebrow: "Business Concept", theme: "yellow" })],
  },
};

export default function SarsaRepublikaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
