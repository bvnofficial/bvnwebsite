import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Shym Saunas · CEO and Marketing Dashboard" },
  description: "Private CEO and marketing dashboard for Shym Saunas and Spas.",
  robots: { index: false, follow: false },
};

export default function ShymSaunasDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
