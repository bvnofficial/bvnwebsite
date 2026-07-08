import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "VA Rate Calculator – What Should a Virtual Assistant Charge?",
  description:
    "Find out what to charge as a Virtual Assistant. Get a realistic hourly and monthly rate range based on your niche, experience, and client region. Free.",
  path: "/apps/va-rate-calculator",
  ogTitle: "VA Rate Calculator",
  eyebrow: "Free Tool",
  theme: "orange",
  keywords:
    "VA rate calculator, virtual assistant rates, how much to charge VA, freelance rate calculator, VA hourly rate",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
