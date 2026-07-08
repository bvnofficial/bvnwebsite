import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Freelance Contract Generator – Free Client Agreement Maker",
  description:
    "Generate a clear freelance service agreement in minutes — scope, payment, IP, confidentiality, and termination clauses. Download as PDF or HTML. Free, no signup.",
  path: "/apps/contract-generator",
  ogTitle: "Freelance Contract Generator",
  eyebrow: "Free Tool",
  theme: "blue",
  keywords:
    "freelance contract generator, client agreement template, VA contract, service agreement maker, freelance contract PDF",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
