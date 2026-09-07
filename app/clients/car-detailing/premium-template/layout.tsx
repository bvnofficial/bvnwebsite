import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Car Detailing Master Template — Premium GHL Design | BVN",
    description:
      "A premium car detailing website design built as an application demo: a modern, consistent, mobile clean master template with services, gallery, booking, and social proof, plus a map of the GoHighLevel Custom Values that keep it duplicatable across client accounts with no rebuild. Shows the design eye and the template discipline this role needs.",
    path: "/clients/car-detailing/premium-template",
    ogTitle: "Car Detailing Master Template — Premium GHL Design",
    eyebrow: "Application Demo",
    theme: "yellow",
  }),
  robots: { index: false, follow: false },
};

export default function CarDetailingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
