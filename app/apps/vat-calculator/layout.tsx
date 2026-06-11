import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "VAT Calculator Philippines - Free Online Tool",
  description: "Compute 12 percent VAT inclusive and exclusive instantly, plus 3 percent percentage tax for non-VAT.",
  path: "/apps/vat-calculator",
  ogTitle: "VAT Calculator Philippines",
  eyebrow: "Free Tool",
  theme: "blue",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
