import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Retell to ServiceTitan AI Dispatch Demo | BVN",
    description:
      "A working model of an HVAC AI integration: a Retell AI call comes in, customer info is captured, structured call data is parsed to JSON, and a new customer plus job is created in ServiceTitan automatically, with a live outage simulation showing the fallback that never loses a booking.",
    path: "/clients/hvac-ai/servicetitan-dispatch",
    ogTitle: "AI Call to ServiceTitan Job, Automatically",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function HvacServiceTitanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
