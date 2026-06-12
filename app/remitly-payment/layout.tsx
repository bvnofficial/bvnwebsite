import type { Metadata } from "next";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "How to Pay with Remitly — BVN",
  description:
    "A simple, step-by-step guide to completing your BVN payment after you receive a Remitly payment request. What it is, how to pay safely, fees, identity checks, and how to send your receipt.",
  openGraph: {
    title: "How to Pay with Remitly — BVN",
    description:
      "Received a Remitly payment request from BVN? Follow this secure, step-by-step guide to complete your payment.",
    url: "https://www.bvnofficial.com/remitly-payment",
    type: "website",
    images: [
      ogImage({
        title: "How to Pay Your BVN Invoice with Remitly",
        eyebrow: "Secure Payment Guide",
        theme: "blue",
      }),
    ],
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/remitly-payment",
  },
  // Private client-facing utility page — keep it out of search results.
  robots: {
    index: false,
    follow: false,
  },
};

export default function RemitlyPaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
