import type { Metadata } from "next";

// Thin utility page: keep it out of the search index so it does not dilute
// the pages that should rank.
export const metadata: Metadata = {
  title: "Payment | BVN",
  robots: { index: false, follow: false },
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
