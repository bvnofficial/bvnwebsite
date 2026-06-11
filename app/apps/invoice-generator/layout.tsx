import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Invoice Generator - Free Online Tool",
  description: "Create professional invoices in seconds. Add your logo, line items and tax, then download as PDF.",
  path: "/apps/invoice-generator",
  ogTitle: "Invoice Generator",
  eyebrow: "Free Tool",
  theme: "purple",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
