import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Insurance Lead System Demo | BVN",
    description:
      "A working piece of an insurance agency lead system: request a quote and watch it captured in the CRM, estimated, offered an appointment, and followed up by SMS and email, plus the lead pipeline and how the whole stack is wired.",
    path: "/clients/insurance-agency/quote-to-book",
    ogTitle: "Insurance Quote-to-Booked Lead System",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function InsuranceQuoteToBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
