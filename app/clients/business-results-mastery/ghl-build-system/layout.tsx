import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "GHL Build System — Business Results Mastery | BVN",
    description:
      "An interactive GoHighLevel agency build system: taking a client from an empty sub account to a live system via snapshots, A2P 10DLC and deliverability setup, AI booking, list hygiene for 15k to 20k contacts, conversion tracking, Meta sync, and reporting, with a deliverability and A2P rejection playbook and real GHL screenshots. Built as an application demo.",
    path: "/clients/business-results-mastery/ghl-build-system",
    ogTitle: "GHL Build System — Empty Account to Live",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function BrmBuildSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
