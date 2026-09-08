import { softwareApplicationSchema, breadcrumbSchema, graphScript } from "@/lib/jsonld";

/**
 * Structured data for a free tool under /apps. Renders SoftwareApplication
 * (marked free) + a Home → Free Tools → <tool> breadcrumb in one script tag.
 * Drop into a tool's server layout: <ToolJsonLd name description path category />
 */
export default function ToolJsonLd({
  name,
  description,
  path,
  category,
}: {
  name: string;
  description: string;
  path: string;
  category?: string;
}) {
  const schema = graphScript([
    softwareApplicationSchema({ name, description, path, category }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Free Tools", path: "/apps" },
      { name, path },
    ]),
  ]);
  return <script type="application/ld+json" dangerouslySetInnerHTML={schema} />;
}
