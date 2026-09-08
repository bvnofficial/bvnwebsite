import { buildMetadata } from "@/lib/og";
import { breadcrumbSchema, graphScript, SITE_URL } from "@/lib/jsonld";
import { courses } from "@/lib/courses";

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
  const schema = graphScript([
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Free Virtual Assistant Courses — BVN Academy",
      itemListElement: courses.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.title,
        url: `${SITE_URL}/courses/${c.slug}`,
      })),
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Courses", path: "/courses" },
    ]),
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={schema} />
      {children}
    </>
  );
}
