import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Password Generator - Free Online Tool",
  description: "Generate strong, secure passwords instantly. Customize length and characters. Nothing is stored.",
  path: "/apps/password-generator",
  ogTitle: "Password Generator",
  eyebrow: "Free Tool",
  theme: "green",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
