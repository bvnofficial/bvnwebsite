import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Premium Window Films, Tailored for Australia | BVN",
    description:
      "Premium window film for Australian homes, offices and vehicles. The full Progard range: Architectural (Black, Reflective, Clear, Security, Decorative) and Automotive (XFactor, Night Rider, Fusion) with complete performance specifications.",
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
