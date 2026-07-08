import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "VA Portfolio Builder – Free One-Page Portfolio Maker",
  description:
    "Create a professional Virtual Assistant portfolio in minutes. Add your services, work, and testimonials, then download a hostable HTML page or PDF. Free, no signup.",
  path: "/apps/portfolio-builder",
  ogTitle: "VA Portfolio Builder",
  eyebrow: "Free Tool",
  theme: "orange",
  keywords:
    "VA portfolio builder, virtual assistant portfolio, freelancer portfolio maker, one page portfolio, free portfolio website",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
