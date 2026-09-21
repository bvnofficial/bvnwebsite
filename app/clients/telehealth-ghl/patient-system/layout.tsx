import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Telehealth GoHighLevel System Architecture",
    description:
      "An interactive demo for architecting and owning a complex GoHighLevel system for an Australian telehealth business: the full patient journey from lead to call to consultation to payment to patient to ongoing care to reactivation, the anatomy of a complex branching workflow with triggers, conditions, tags, custom fields, pipeline moves and integrations, a systems thinking walkthrough of diagnosing a sudden booking drop, WordPress and Make and webhook integration, QA discipline, and real screenshots from a live GoHighLevel account. Built as an application demo with no patient data.",
    path: "/clients/telehealth-ghl/patient-system",
    ogTitle: "Telehealth GoHighLevel System Architecture",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function TelehealthGhlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
