import type { Metadata } from "next";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "PARESILOGAN — Pares & Tapsilogan Carinderia Business Plan",
  description:
    "Complete interactive business plan for PARESILOGAN — an affordable pares and tapsilogan carinderia-style restaurant. Concept, market, menu, startup costs, operations, marketing, and a live financial calculator.",
  openGraph: {
    title: "PARESILOGAN — Pares & Tapsilogan Carinderia Business Plan",
    description: "Interactive business plan: concept, menu, startup costs, operations, marketing & a live profit calculator for a Filipino pares-tapsilogan eatery.",
    url: "https://www.bvnofficial.com/business/paresilogan",
    type: "website",
    images: [ogImage({ title: "Pares & Tapsilogan Carinderia Plan", eyebrow: "Business Plan", theme: "rose" })],
  },
};

export default function ParesiloganLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
