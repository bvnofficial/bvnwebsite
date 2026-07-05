import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "AI Operating System Blueprint — Short Term Rental Company | BVN",
    description:
      "An interactive blueprint for an internal AI operating system for a short term rental and hospitality business: department AI agents for operations, onboarding, guest support, owner communication, leads, reporting, documents and tasks, over a Supabase knowledge layer with vector search, wired with role based access, row level security, and a human in the loop on sensitive actions. Built as an application demo.",
    path: "/clients/str-hospitality/ai-operating-system",
    ogTitle: "AI Operating System Blueprint",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function StrAiOsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
