import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Course & Membership Experience Demo | BVN",
    description:
      "A sample GoHighLevel course and membership learner experience for two separate brands in one environment: switch between Advanced Aesthetics Academy and PsyFortis to see clean brand separation, structured modules and lessons, video, PDF and MP3 resources, progress tracking, and a full learner-journey test.",
    path: "/clients/psyfortis-aaa/courses",
    ogTitle: "Two Brands, One Course Platform",
    eyebrow: "Application Demo",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function PsyfortisAaaCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
