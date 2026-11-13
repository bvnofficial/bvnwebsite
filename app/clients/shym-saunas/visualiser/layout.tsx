import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Shym Saunas · Backyard Sauna Visualiser" },
  description: "See a Shym sauna in your own backyard before you buy.",
  robots: { index: false, follow: false },
};

export default function ShymSaunasVisualiserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
