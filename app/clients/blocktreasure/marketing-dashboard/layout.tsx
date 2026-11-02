import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Block Treasure · Campaign Dashboard",
  description: "Private campaign dashboard for Block Treasure N.V.",
  robots: { index: false, follow: false },
};

export default function BlockTreasureDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
