import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Real Estate Recruiting SaaS on GoHighLevel",
    description:
      "An interactive demo for building a subscription real estate recruiting platform on GoHighLevel: the recruiting engine (websites, forms, SMS and email follow up, long term nurture, pipelines, booking, reminders, missed call automations, reactivation, dashboards), a snapshot and SaaS mode onboarding model that deploys a new customer sub account by configuration instead of a rebuild, the phone, A2P 10DLC, domain, and deliverability infrastructure, and real screenshots from a live GoHighLevel account. Built as an application demo.",
    path: "/clients/real-estate-recruiting/ghl-saas-platform",
    ogTitle: "Real Estate Recruiting SaaS on GoHighLevel",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function RealEstateRecruitingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
