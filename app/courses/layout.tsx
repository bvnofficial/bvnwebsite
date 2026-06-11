import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Free Virtual Assistant Courses — BVN Academy",
  description:
    "Free, interactive Virtual Assistant courses by BVN Academy. Learn AI automation, social media management, GoHighLevel, e-commerce, content and more — track your progress, no sign-up required.",
  path: "/courses",
  ogTitle: "Free Virtual Assistant Courses",
  eyebrow: "BVN Academy",
  theme: "orange",
  keywords:
    "free VA courses, virtual assistant training, learn virtual assistant, AI automation course, social media management course",
});

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
