import Link from "next/link";
import { ArrowRight, Gift, BadgeCheck } from "lucide-react";
import { getTool } from "@/lib/recommends";

// Reusable affiliate promo card. Drop <AffiliatePromo slug="gohighlevel" /> into
// any blog post or tool page. Server component (SSR, good for SEO). The affiliate
// disclosure is baked in and always renders.
export default function AffiliatePromo({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  const tool = getTool(slug);
  if (!tool) return null;
  const topBonus = tool.bonuses[0];

  return (
    <aside
      className="not-prose my-8 rounded-2xl border border-[#E86010]/25 bg-gradient-to-br from-[#1B3060]/[0.06] to-[#E86010]/[0.06] p-6"
      aria-label={`Recommended tool: ${tool.name}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E86010]/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#E86010]">
          <BadgeCheck size={12} /> The tool I build on
        </span>
      </div>

      <h3 className="text-xl font-extrabold text-navy-dark dark:text-white">{tool.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{tool.tagline}</p>

      {!compact && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#E86010]/20 bg-white/60 dark:bg-white/[0.03] p-3.5">
          <Gift size={18} className="mt-0.5 shrink-0 text-[#E86010]" />
          <div>
            <p className="text-sm font-bold text-navy-dark dark:text-white">
              Sign up through my link and get {topBonus.title.toLowerCase()} free
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{topBonus.detail}</p>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={`/go/${tool.slug}`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#E86010] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#E86010]/25 transition hover:brightness-110"
        >
          Get {tool.name} + my free bonus <ArrowRight size={15} />
        </Link>
        <Link
          href="/recommends"
          className="text-sm font-semibold text-[#E86010] hover:underline"
        >
          See what you get
        </Link>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
        This is an affiliate link. If you sign up I may earn a commission, at no extra cost to you. I
        only recommend tools I actually build on.
      </p>
    </aside>
  );
}
