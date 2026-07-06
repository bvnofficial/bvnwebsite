import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Home Care Recruiting and Onboarding CRM — Our Home Care Solutions | BVN",
    description:
      "An interactive GoHighLevel recruiting and onboarding CRM for a home care agency: a live recruitment pipeline board from new applicant to active employee with the automation that fires at each stage, the employee management, referral, and internal task pipelines, the full CRM architecture, and the onboarding and compliance flow. Built as an application demo by a specialist who has built GHL for a care operator.",
    path: "/clients/our-home-care/recruiting-crm",
    ogTitle: "Home Care Recruiting and Onboarding CRM",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function OurHomeCareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
