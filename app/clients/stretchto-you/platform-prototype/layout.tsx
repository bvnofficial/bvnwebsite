import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Platform Prototype | BVN",
    description:
      "An interactive product prototype for StretchTo.You, a mobile assisted stretching company: a live credit based membership dashboard where completing a session deducts a credit, a tap to pay flow connected to memberships, a recommended technology stack, customer, therapist and admin portals, and the future multi city two app marketplace vision. Built as an application demo.",
    path: "/clients/stretchto-you/platform-prototype",
    ogTitle: "StretchTo.You — Platform Prototype",
    eyebrow: "Application Demo",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function StretchToYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
