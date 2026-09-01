import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Productised Sales AI — Multi Tenant Build | BVN",
    description:
      "An interactive architecture demo for productising a proven AI sales stack into a repeatable, multi tenant system: the four layers (daily briefing engine, conversational SMS agent, Retell voice agent over Twilio AU, and a client dashboard), a CRM abstraction layer so HubSpot, GoHighLevel, Pipedrive, and Salesforce plug in without rewriting the agents, a config driven provisioning model that turns onboarding client forty into hours not weeks, the self hosted n8n stack recommendation, and the Milestone 1 foundation. Built as an application demo.",
    path: "/clients/productised-sales-ai/multi-tenant-build",
    ogTitle: "Productised Sales AI — Multi Tenant Build",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function ProductisedSalesAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
