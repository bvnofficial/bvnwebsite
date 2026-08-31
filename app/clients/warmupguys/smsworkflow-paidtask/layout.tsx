import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Inbound SMS to Complete Contact Record | BVN",
    description:
      "Paid task response for Warm Up Guys: how inbound SMS conversations get turned into complete contact records with location captured naturally, no forms, inside GoHighLevel.",
    path: "/clients/warmupguys/smsworkflow-paidtask",
    ogTitle: "Warm Up Guys — SMS Workflow",
    eyebrow: "Paid Task Response",
    theme: "orange",
  }),
  robots: { index: false, follow: false },
};

export default function WarmUpGuysSmsWorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
