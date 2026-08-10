import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "AI Sales CRM Dashboard Demo | BVN",
    description:
      "A working AI-powered sales CRM: inbound messages arrive over webhooks, an LLM classifies intent and urgency, a conversational agent drafts replies, and everything lives in a Supabase (PostgreSQL) schema with real-time updates to a Next.js dashboard. Includes the backend architecture, not just the UI.",
    path: "/clients/ai-sales-crm/dashboard",
    ogTitle: "AI-Powered Sales CRM Dashboard",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function AiSalesCrmDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
