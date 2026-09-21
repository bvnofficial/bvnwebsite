import type { Metadata } from "next";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Book a Call with Benjamin — BVN",
  description:
    "Book a free 30 minute call with Benjamin Vincent Yson (BVN). Pick a time that suits you and see exactly what he'd build for your business. No cost, no pressure.",
  openGraph: {
    title: "Book a Call with Benjamin — BVN",
    description:
      "Book a free 30 minute call with Benjamin (BVN). Pick a time that suits you. No cost, no pressure.",
    url: "https://www.bvnofficial.com/book",
    type: "website",
    images: [ogImage({ title: "Book a Free Call with Benjamin", eyebrow: "30 Minute Call", theme: "orange" })],
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/book",
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
