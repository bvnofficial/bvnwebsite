import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "QR Code Generator - Free Online Tool",
  description: "Create free QR codes for URLs, WiFi, contacts, email and SMS. Customizable colors and instant PNG download.",
  path: "/apps/qr-code-generator",
  ogTitle: "QR Code Generator",
  eyebrow: "Free Tool",
  theme: "purple",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
