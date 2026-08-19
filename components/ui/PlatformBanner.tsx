import { Layers } from "lucide-react";
import { AffiliateCTA } from "@/components/ui/AffiliateCTA";

// On-brand banner section carrying GoHighLevel's proven messaging pillars
// ("everything in one platform", "stop switching between tools", "replace ten
// subscriptions") in BVN's cobalt/amber look, with BVN's own affiliate CTA.
// Built as inline markup rather than embedding HighLevel's own story ads, which
// are portrait social creatives with a competing "Start free trial" button.
export function PlatformBanner({
  slug,
  ctaLabel = "Start GoHighLevel and claim my free setup",
}: {
  slug: string;
  ctaLabel?: string;
}) {
  return (
    <section className="px-5 py-12">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-navy-dark px-6 py-12 text-white sm:px-12">
        {/* Amber upward-motion accent, echoing the BVN arrow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#E86010]/20 blur-3xl"
        />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E86010]">
            <Layers size={14} /> Everything, connected
          </span>
          <h2 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            Everything you need in one platform. One login.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-300">
            Stop switching between tools. One platform runs your CRM, follow up, funnels, calendars, AI
            and reviews, so the leads stop leaking through the gaps between five separate apps.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {["Replaces ten subscriptions", "One flat monthly bill", "Everything connected"].map((c) => (
              <span
                key={c}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-gray-200"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <AffiliateCTA slug={slug} label={ctaLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
