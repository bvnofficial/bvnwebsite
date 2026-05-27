import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Operations Automation Philippines — BVN Operations",
  description:
    "BVN Operations delivers AI automation, CRM automation, HR & payroll automation, business workflows, time tracking, and admin automation for Philippine businesses.",
  keywords:
    "business automation Philippines, operations automation Philippines, CRM automation Philippines, HR payroll automation Philippines, AI agents Philippines, admin automation Philippines",
  openGraph: {
    title: "Business Operations Automation Philippines — BVN Operations",
    description:
      "Intelligent business automation for Philippine companies. AI agents, CRM, HR & payroll, workflows, analytics — all automated.",
    url: "https://www.bvnofficial.com/operations",
    type: "website",
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/operations",
  },
};

export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
