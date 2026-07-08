import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "BVN Pro – Unlock the Full VA Toolkit",
  description:
    "Upgrade to BVN Pro once and unlock premium document themes and branding-free exports across the CV, portfolio, proposal, contract, and onboarding tools. One-time payment.",
  path: "/apps/pro",
  ogTitle: "BVN Pro — Unlock the Full VA Toolkit",
  eyebrow: "BVN Pro",
  theme: "orange",
  keywords: "BVN Pro, VA toolkit, premium resume templates, remove branding, VA tools upgrade",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
