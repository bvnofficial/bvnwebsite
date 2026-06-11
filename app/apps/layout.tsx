import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Free Business Tools & Calculators",
  description:
    "Free calculators and tools by BVN — Philippine payroll and tax calculators, SEO and marketing utilities, construction estimators and more. No sign-up required.",
  path: "/apps",
  ogTitle: "Free Tools Built for Your Business",
  eyebrow: "Free Tools",
  theme: "orange",
  keywords:
    "free business tools Philippines, free calculators Philippines, salary calculator, SSS PhilHealth Pag-IBIG calculator, SEO tools",
});

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
