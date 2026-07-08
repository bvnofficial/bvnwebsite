import { ArrowRight, Check } from "lucide-react";

// BVN VA Job Board — Slack community invite.
// Update this single constant if the Slack invite link ever changes.
const SLACK_INVITE =
  "https://join.slack.com/t/bvnofficial/shared_invite/zt-42zfx8bp2-yOPi8uiPCzUb5p~mXrYTmw";

const PERKS = [
  "Fresh remote VA jobs posted every day",
  "Hand-picked & scraped from across the web",
  "Free to join — no catch",
];

/**
 * Call-to-action inviting job-seeking VAs to join the BVN Slack, where the
 * job scraper posts updated listings. Drop it on high-intent pages
 * (Academy, Apps). Plain server component — no client JS required.
 */
export default function JobsSlackCTA() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 bg-navy-surface border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl border border-white/10
            bg-gradient-to-br from-[#141b2e] to-[#0d1220] p-8 md:p-12"
        >
          {/* glow accent */}
          <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-orange/15 blur-3xl" />

          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 md:gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {/* Slack mark */}
                <span className="w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 122.8 122.8" aria-hidden="true">
                    <path fill="#E01E5A" d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" />
                    <path fill="#36C5F0" d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" />
                    <path fill="#2EB67D" d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" />
                    <path fill="#ECB22E" d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" />
                  </svg>
                </span>
                <span className="font-accent font-semibold text-xs tracking-[0.18em] uppercase text-orange">
                  BVN Job Board · Slack
                </span>
              </div>

              <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white leading-tight mb-3">
                Looking for active VA jobs?
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-5 max-w-xl">
                Skip the endless scrolling. We post fresh, hand-picked remote Virtual Assistant
                job listings every day in our free Slack community — so you can spend your time
                applying, not searching.
              </p>

              <ul className="space-y-2">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-white/70 text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-emerald-400" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-stretch gap-3">
              <a
                href={SLACK_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl
                  font-heading font-semibold text-base bg-orange text-white
                  shadow-[0_0_24px_rgba(232,96,16,0.4)]
                  hover:bg-orange-light hover:shadow-[0_0_36px_rgba(232,96,16,0.6)]
                  active:scale-95 transition-all duration-200"
              >
                Join the Slack — Free
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <p className="text-center text-white/35 text-xs font-accent">
                New listings posted daily · Opens in Slack
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
