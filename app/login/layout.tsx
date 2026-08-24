import type { Metadata } from "next";

// Thin utility page: keep it out of the search index so it does not dilute
// the pages that should rank.
export const metadata: Metadata = {
  title: "Log In | BVN",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
