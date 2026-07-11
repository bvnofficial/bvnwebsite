// Certificate of Employment records. Each has a public verification page at
// /coe/<slug> and a downloadable PDF at /coe/<slug>.pdf. The PDF carries a QR
// that points back to the verification page so employers can confirm it.
//
// When `email` matches a logged-in user's account, the certificate also shows
// in that user's dashboard ("Your Documents").

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
