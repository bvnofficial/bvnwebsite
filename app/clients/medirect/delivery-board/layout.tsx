import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Delivery Board Demo | BVN",
    description:
      "A sample Jira-style delivery board for MEDirect 2.0: epics for AI report production, intelligent document processing and workflow automation, user stories with acceptance criteria, a sprint board, a dependency and risk tracker, a delivery status report, and a sample BRD.",
    path: "/clients/medirect/delivery-board",
    ogTitle: "MEDirect 2.0 — Delivery Board",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function MedirectDeliveryBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
