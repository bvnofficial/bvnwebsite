import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Automation Business Operating System | BVN",
    description:
      "An interactive operating system blueprint for a workflow automation business selling ROI sprints to Australian SMEs: a live ROI and time savings calculator, the sprint delivery pipeline from discovery to QA, an opportunity scoring framework, the company structure and roles, the ClickUp and Airtable ops hub, and the B2B setter and closer sales pipeline. Built as an application demo.",
    path: "/clients/automation-ops/operating-system",
    ogTitle: "Automation Business Operating System",
    eyebrow: "Application Demo",
    theme: "orange",
  }),
  robots: { index: false, follow: false },
};

export default function AutomationOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
