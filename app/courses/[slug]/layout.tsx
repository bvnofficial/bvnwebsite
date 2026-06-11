import type { Metadata } from "next";
import { getCourse } from "@/lib/courses";
import { buildMetadata, type OgTheme } from "@/lib/og";

// Map a course's accent color to an OG theme (cyan has no OG theme → blue)
function courseTheme(color: string): OgTheme {
  const allowed: OgTheme[] = ["orange", "blue", "green", "rose", "yellow", "purple"];
  return (allowed as string[]).includes(color) ? (color as OgTheme) : "blue";
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = getCourse(params.slug);
  if (!course) return { title: "Course Not Found" };

  return buildMetadata({
    title: `${course.title} — Free VA Course`,
    description: course.description,
    path: `/courses/${course.slug}`,
    ogTitle: course.title,
    eyebrow: `Course · ${course.level}`,
    theme: courseTheme(course.color),
    keywords: course.skills.join(", "),
  });
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
