// Certificate of Employment records. Each has a public verification page at
// /coe/<slug> and a downloadable PDF at /coe/<slug>.pdf. The PDF carries a QR
// that points back to the verification page so employers can confirm it.
//
// When `email` matches a logged-in user's account, the certificate also shows
// in that user's dashboard ("Your Documents").

export type CoeResponsibilityGroup = {
  area: string;
  items: string[];
};

export type CoeRecord = {
  slug: string;
  refId: string;
  name: string;
  honorific?: string; // "Mr." / "Ms."
  role: string;
  start: string; // e.g. "January 2023"
  end: string; // e.g. "August 2023"
  issued: string; // ISO date the certificate was issued
  email?: string; // account this certificate belongs to (for the dashboard)
  responsibilities?: CoeResponsibilityGroup[];
};

export const COE_RECORDS: CoeRecord[] = [
  {
    slug: "gabriel-balenton",
    refId: "BVN-COE-2026-0001",
    name: "Gabriel Franco Roca Balenton",
    honorific: "Mr.",
    role: "Marketing Associate",
    start: "January 2023",
    end: "August 2023",
    issued: "2026-07-11",
    email: "gabrielbalenton@gmail.com",
    responsibilities: [
      {
        area: "Search Engine Optimization (SEO)",
        items: [
          "Keyword and search-intent research to guide site structure, content, and priorities",
          "On-page and technical optimization: titles, meta descriptions, semantic HTML, internal linking, site speed, and indexation",
          "Structured data and schema markup, plus optimization for answer engines and AI-driven search (AEO)",
          "Tracking rankings, organic traffic, and search performance, and reporting on outcomes",
        ],
      },
      {
        area: "Automation & AI",
        items: [
          "Designing and building automated workflows that reduce manual, repetitive work",
          "Integrating AI tools and APIs into content, marketing, and operational processes",
          "Building automations for lead capture, data enrichment, reporting, and notifications",
          "Connecting platforms (forms, spreadsheets, CRM, email) into cohesive systems and documenting them as SOPs",
        ],
      },
      {
        area: "Web Development",
        items: [
          "Designing, building, and maintaining the company website end to end",
          "Implementing responsive, accessible, and performance-optimized layouts",
          "Managing content updates, page creation, and ongoing site maintenance",
          "Integrating analytics and marketing tools, troubleshooting issues, and delivering iterative improvements",
        ],
      },
    ],
  },
];

export function getCoe(slug: string): CoeRecord | null {
  return COE_RECORDS.find((c) => c.slug === slug) ?? null;
}

// All certificates owned by an account email (for the user's dashboard).
export function getCoesByEmail(email: string | null | undefined): CoeRecord[] {
  if (!email) return [];
  const e = email.trim().toLowerCase();
  return COE_RECORDS.filter((c) => c.email && c.email.toLowerCase() === e);
}

export function coeIssuedLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
