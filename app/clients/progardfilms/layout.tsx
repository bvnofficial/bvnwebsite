import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Progard Films — Premium Films, Tailored for Australia | BVN",
    description:
      "A complete brand website for Progard Films covering both ranges: the Architectural Film Range (Black, Reflective, Clear, Security and Decorative Series) and the Automotive Film Range (XFactor Performance Ceramic, Night Rider HD Nano Ceramic and Fusion Ultra Ceramic) with full TSER, IRR and UV rejection specifications, an interactive film finder and a shade comparison tool.",
    path: "/clients/progardfilms",
    ogTitle: "Progard Films — Premium Films, Tailored for Australia",
    eyebrow: "Client Website",
    theme: "yellow",
  }),
  robots: { index: false, follow: false },
};

export default function ProgardFilmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
