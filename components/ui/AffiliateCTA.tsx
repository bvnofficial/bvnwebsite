import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Shared affiliate call to action button. Points at the branded /go/<slug>
// redirect so the real URL lives only in lib/recommends.ts. Reused across every
// GoHighLevel SEO and campaign page.
export function AffiliateCTA({
  slug,
  label,
  size = "lg",
}: {
  slug: string;
  label: string;
  size?: "lg" | "md";
}) {
  const pad = size === "lg" ? "px-6 py-3.5 text-base" : "px-5 py-3 text-sm";
  return (
    <Link
      href={`/go/${slug}`}
      className={`inline-flex items-center gap-2 rounded-xl bg-[#E86010] ${pad} font-bold text-white shadow-lg shadow-[#E86010]/25 transition hover:brightness-110`}
    >
      {label} <ArrowRight size={16} />
    </Link>
  );
}

// The affiliate disclosure block. FTC-friendly, honest, always rendered on any
// page that carries an affiliate link.
export function AffiliateDisclosure() {
  return (
    <p className="mt-4 text-xs leading-relaxed text-gray-400">
      Affiliate link. If you start an account through it I may earn a commission at no extra cost to
      you. I only recommend tools I actually build client work on.
    </p>
  );
}
