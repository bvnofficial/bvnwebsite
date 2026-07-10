import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "AI Automation Engineer — Systems That Replace Manual Work | BVN",
    description:
      "A senior automation engineer's systems portfolio: real automation systems shipped end to end (an AI job pipeline, a two way webhook and API relay, a property data ETL pipeline, and a payments and wallet system), the engineering stack (Python, JavaScript/TypeScript, REST and GraphQL APIs, Scrapy/Selenium/Playwright, Postgres/Supabase, MongoDB, AWS/Azure, LLM APIs), the process for turning an idea into a working system, secure work readiness, and real operational proof. Built with Claude Code as an application demo.",
    path: "/clients/automation-engineer/systems",
    ogTitle: "Systems That Replace Manual Work",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function AutomationEngineerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
