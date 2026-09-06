import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Agency OS — Onboarding, Delivery, Reporting, SOPs | BVN",
    description:
      "An interactive agency operating system built as an application demo: client onboarding, delivery pipelines, task and project flow, reporting dashboards, and a documented SOP library, all wired on GoHighLevel with custom code and Claude Code where no code falls short. Click each module to see what it does, how it is built, and how it hands over with a Loom and a written SOP.",
    path: "/clients/agency-os/operating-system",
    ogTitle: "Agency OS — The Internal Operating System",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function AgencyOsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
