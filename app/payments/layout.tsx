import type { Metadata } from "next";

// Thin utility page: keep it out of the search index so it does not dilute
// the pages that should rank.
export const metadata: Metadata = {
  title: "Secure Payment | BVN",
  robots: { index: false, follow: false },
};

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
