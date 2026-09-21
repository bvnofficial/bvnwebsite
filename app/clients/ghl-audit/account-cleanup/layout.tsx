import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "GHL Audit & CRM Cleanup — Find It Before You Build | BVN",
    description:
      "An interactive GoHighLevel account audit built as an application demo: walk through a messy existing account and see the real problems found first, duplicate and conflicting workflows, duplicate lead communications, leads in the wrong pipeline, fragmented tags, broken triggers, and lost lead source attribution, each with how it was diagnosed, the fix, and how it is documented. Built for an audit first, clean foundation before expanding.",
    path: "/clients/ghl-audit/account-cleanup",
    ogTitle: "GHL Audit & CRM Cleanup — Find It Before You Build",
    eyebrow: "Application Demo",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function GhlAuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
