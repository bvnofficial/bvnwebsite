import type { FaqItem } from "@/lib/service-faqs";

// Server-rendered, JS-free FAQ using native <details>/<summary> so the answers
// are fully crawlable by search + AI engines while staying interactive. Paired
// with FAQPage JSON-LD on the service pages.
export default function ServiceFAQ({
  faqs,
  accent = "orange",
  heading = "Frequently Asked Questions",
}: {
  faqs: FaqItem[];
  accent?: "orange" | "blue";
  heading?: string;
}) {
  const accentText = accent === "blue" ? "text-blue-400" : "text-orange";
  const accentBorder =
    accent === "blue" ? "hover:border-blue-400/25" : "hover:border-orange/25";
  const accentMarker = accent === "blue" ? "text-blue-400" : "text-orange";

  return (
    <section className="bg-navy-dark border-t border-white/5 px-6 md:px-12 lg:px-24 py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        <p
          className={`font-accent font-semibold text-xs uppercase tracking-[0.2em] ${accentText} mb-3`}
        >
          FAQ
        </p>
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-8 leading-tight">
          {heading}
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className={`group bg-white/5 border border-white/10 rounded-2xl px-5 py-4 transition-colors ${accentBorder}`}
            >
              <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                <h3 className="font-heading font-semibold text-white text-base md:text-lg leading-snug">
                  {faq.question}
                </h3>
                <span
                  className={`${accentMarker} shrink-0 text-xl leading-none mt-0.5 transition-transform duration-200 group-open:rotate-45`}
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="text-white/70 text-[15px] md:text-base leading-relaxed font-body mt-3">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
