"use client";
import { useState } from "react";
import { DollarSign, Users, MousePointer, TrendingUp, Eye, ChevronRight } from "lucide-react";

const channels = [
  { id: "google", name: "Google Search", cpc: 2.8, convRate: 0.048, icon: "🔍", color: "bg-blue-400" },
  { id: "meta", name: "Meta Ads", cpc: 1.2, convRate: 0.023, icon: "📘", color: "bg-blue-500" },
  { id: "youtube", name: "YouTube Ads", cpc: 0.9, convRate: 0.018, icon: "▶️", color: "bg-red-500" },
  { id: "linkedin", name: "LinkedIn Ads", cpc: 5.2, convRate: 0.062, icon: "💼", color: "bg-blue-700" },
  { id: "display", name: "Display / Programmatic", cpc: 0.45, convRate: 0.008, icon: "🖥", color: "bg-purple-400" },
];

const adPreviews: Record<string, { headline: string; description: string; url: string; badge: string }> = {
  google: {
    headline: "BVN Marketing Agency Philippines",
    description: "Drive growth with expert digital marketing & automation. Free consultation. 300%+ ROI results. Trusted by 500+ businesses.",
    url: "bvnofficial.com/marketing",
    badge: "Sponsored",
  },
  meta: {
    headline: "Grow Your Business with BVN",
    description: "Expert digital marketing that delivers results. Social media, SEO, automation — all in one place.",
    url: "bvnofficial.com",
    badge: "Sponsored",
  },
  youtube: {
    headline: "Watch: How We Grew a Brand 300% in 90 Days",
    description: "BVN Official • 2.4K views • 3 days ago",
    url: "youtube.com/watch?v=demo",
    badge: "Ad",
  },
  linkedin: {
    headline: "BVN Marketing Solutions for B2B",
    description: "We help Philippine businesses automate operations and grow revenue. See our enterprise solutions.",
    url: "bvnofficial.com/operations",
    badge: "Promoted",
  },
  display: {
    headline: "BVN — Smart Marketing Automation",
    description: "Reach your audience on 3M+ websites with precision targeting and real-time optimization.",
    url: "bvnofficial.com",
    badge: "Ad",
  },
};

const funnelStages = [
  { label: "Impressions", width: "100%", count: "", color: "bg-blue-400/40" },
  { label: "Clicks", width: "6%", count: "", color: "bg-orange/60" },
  { label: "Landing Page", width: "4.2%", count: "", color: "bg-yellow-400/60" },
  { label: "Leads", width: "1.8%", count: "", color: "bg-green-400/60" },
  { label: "Conversions", width: "0.8%", count: "", color: "bg-green-500" },
];

export default function DigitalMarketingDemo() {
  const [budget, setBudget] = useState(3000);
  const [allocation, setAllocation] = useState<Record<string, number>>({
    google: 40, meta: 30, youtube: 15, linkedin: 10, display: 5,
  });
  const [activeTab, setActiveTab] = useState<"allocate" | "preview" | "funnel">("allocate");
  const [selectedChannel, setSelectedChannel] = useState("google");

  function updateAlloc(id: string, val: number) {
    const others = Object.keys(allocation).filter((k) => k !== id);
    const remaining = 100 - val;
    const otherTotal = others.reduce((s, k) => s + allocation[k], 0);
    const newAlloc: Record<string, number> = { ...allocation, [id]: val };
    if (otherTotal > 0) {
      others.forEach((k) => { newAlloc[k] = Math.round((allocation[k] / otherTotal) * remaining); });
    }
    const total = Object.values(newAlloc).reduce((a, b) => a + b, 0);
    if (total !== 100) newAlloc[others[0]] += 100 - total;
    setAllocation(newAlloc);
  }

  const totalImpressions = channels.reduce((s, c) => {
    const spend = ((allocation[c.id] || 0) / 100) * budget;
    return s + Math.floor((spend / c.cpc) * 15);
  }, 0);
  const totalClicks = channels.reduce((s, c) => {
    const spend = ((allocation[c.id] || 0) / 100) * budget;
    return s + Math.floor(spend / c.cpc);
  }, 0);
  const totalConvs = channels.reduce((s, c) => {
    const spend = ((allocation[c.id] || 0) / 100) * budget;
    return s + Math.floor((spend / c.cpc) * c.convRate);
  }, 0);
  const avgCPA = totalConvs > 0 ? (budget / totalConvs).toFixed(0) : "—";
  const roas = totalConvs > 0 ? ((totalConvs * 85) / budget).toFixed(1) : "—";

  const adData = adPreviews[selectedChannel];

  return (
    <div className="space-y-5">
      {/* Budget */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-heading font-bold text-white text-sm">💰 Monthly Ad Budget</h4>
          <span className="text-orange font-heading font-extrabold text-2xl">${budget.toLocaleString()}</span>
        </div>
        <input type="range" min="500" max="20000" step="100" value={budget}
          onChange={(e) => setBudget(+e.target.value)} className="w-full accent-orange" />
        <div className="flex justify-between text-[10px] text-white/25 mt-1">
          <span>$500</span><span>$20,000/mo</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["allocate", "preview", "funnel"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "allocate" ? "📊 Channel Mix" : tab === "preview" ? "🖼 Ad Preview" : "🔽 Funnel"}
          </button>
        ))}
      </div>

      {/* Channel Allocation */}
      {activeTab === "allocate" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="space-y-4">
            {channels.map((c) => {
              const spend = ((allocation[c.id] || 0) / 100) * budget;
              const clicks = Math.floor(spend / c.cpc);
              const convs = Math.floor(clicks * c.convRate);
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{c.icon}</span>
                      <span className="text-white/80 text-xs font-semibold">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <span className="text-orange font-bold text-xs w-16">${spend.toFixed(0)}</span>
                      <span className="text-white/40 text-[10px] w-18">{clicks.toLocaleString()} clicks</span>
                      <span className="text-green-400 text-[10px] w-16">{convs} conv.</span>
                      <span className="text-white/60 text-xs font-bold w-8">{allocation[c.id]}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${c.color} shrink-0`} />
                    <input type="range" min="0" max="100" value={allocation[c.id] || 0}
                      onChange={(e) => updateAlloc(c.id, +e.target.value)}
                      className="flex-1 accent-orange h-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ad Preview */}
      {activeTab === "preview" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {channels.map((c) => (
              <button key={c.id} onClick={() => setSelectedChannel(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${selectedChannel === c.id ? "border-orange/50 bg-orange/10 text-orange" : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"}`}>
                <span>{c.icon}</span> {c.name.split(" ")[0]}
              </button>
            ))}
          </div>
          {/* Google-style preview */}
          {selectedChannel === "google" && (
            <div className="bg-white rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center text-[8px] text-white font-bold">G</div>
                <span className="text-gray-700 text-xs">{adData.url}</span>
                <span className="border border-gray-400 text-gray-500 text-[9px] px-1 rounded">{adData.badge}</span>
              </div>
              <h3 className="text-blue-700 text-lg font-normal hover:underline cursor-pointer leading-snug">{adData.headline}</h3>
              <p className="text-gray-600 text-sm mt-1 leading-snug">{adData.description}</p>
              <div className="flex gap-4 mt-3">
                {["Free Consultation", "Our Services", "Pricing", "Contact Us"].map((ext) => (
                  <span key={ext} className="text-blue-600 text-xs hover:underline cursor-pointer">{ext}</span>
                ))}
              </div>
            </div>
          )}
          {/* Meta-style preview */}
          {selectedChannel === "meta" && (
            <div className="bg-white rounded-xl overflow-hidden shadow-lg max-w-sm">
              <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-orange flex items-center justify-center text-white text-xs font-bold">BV</div>
                <div>
                  <p className="text-gray-900 text-xs font-bold">BVN Official</p>
                  <p className="text-gray-400 text-[10px]">{adData.badge} · {channels.find(c => c.id === "meta")?.name}</p>
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-orange to-orange-light flex items-center justify-center">
                <span className="text-white font-bold text-lg px-4 text-center">{adData.headline}</span>
              </div>
              <div className="px-4 py-3 border-t border-gray-100">
                <p className="text-gray-700 text-xs mb-2">{adData.description}</p>
                <button className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">Learn More</button>
              </div>
            </div>
          )}
          {/* Other channels */}
          {!["google", "meta"].includes(selectedChannel) && (
            <div className="bg-white rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{channels.find(c => c.id === selectedChannel)?.icon}</span>
                <div>
                  <span className="border border-gray-400 text-gray-500 text-[9px] px-1.5 rounded-full">{adData.badge}</span>
                  <p className="text-gray-400 text-[10px] mt-0.5">{adData.url}</p>
                </div>
              </div>
              <h3 className="text-gray-900 font-semibold text-base mb-1">{adData.headline}</h3>
              <p className="text-gray-600 text-sm">{adData.description}</p>
              <button className="mt-3 px-5 py-2 bg-orange text-white text-sm font-bold rounded-lg">Get Started</button>
            </div>
          )}
        </div>
      )}

      {/* Funnel */}
      {activeTab === "funnel" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h4 className="font-heading font-bold text-white text-sm mb-4">Conversion Funnel (estimated for ${budget.toLocaleString()}/mo)</h4>
          <div className="space-y-2">
            {[
              { label: "Impressions", val: totalImpressions, pct: "100%", color: "bg-blue-400/40", width: 100 },
              { label: "Clicks", val: totalClicks, pct: `${((totalClicks / Math.max(totalImpressions, 1)) * 100).toFixed(1)}%`, color: "bg-orange/60", width: Math.max(5, (totalClicks / Math.max(totalImpressions, 1)) * 100) },
              { label: "Qualified Leads", val: Math.floor(totalClicks * 0.3), pct: `${(0.3 * 100).toFixed(0)}% of clicks`, color: "bg-yellow-400/60", width: Math.max(3, 0.3 * 6) },
              { label: "Conversions", val: totalConvs, pct: `${(totalConvs / Math.max(totalClicks, 1) * 100).toFixed(1)}% CVR`, color: "bg-green-400", width: Math.max(2, (totalConvs / Math.max(totalClicks, 1)) * 100) },
            ].map(({ label, val, pct, color, width }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-28 text-white/60 text-xs text-right shrink-0">{label}</div>
                <div className="flex-1 bg-white/5 rounded-full h-7 overflow-hidden">
                  <div className={`h-full ${color} rounded-full flex items-center px-3 transition-all duration-700`}
                    style={{ width: `${Math.min(100, width + 20)}%` }}>
                    <span className="text-white text-[10px] font-bold whitespace-nowrap">
                      {val.toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="text-white/35 text-[10px] w-20 shrink-0">{pct}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="font-heading font-extrabold text-xl text-white">$ROAS {roas}x</div>
              <div className="text-white/35 text-[10px]">Return on Ad Spend</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="font-heading font-extrabold text-xl text-green-400">${avgCPA}</div>
              <div className="text-white/35 text-[10px]">Cost Per Conversion</div>
            </div>
          </div>
        </div>
      )}

      {/* Results summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Eye, label: "Est. Impressions", val: `${(totalImpressions / 1000).toFixed(0)}K`, color: "text-blue-400" },
          { icon: MousePointer, label: "Est. Clicks", val: totalClicks.toLocaleString(), color: "text-orange" },
          { icon: TrendingUp, label: "Est. Conversions", val: totalConvs.toString(), color: "text-green-400" },
          { icon: DollarSign, label: "Cost / Conversion", val: `$${avgCPA}`, color: "text-white" },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <Icon size={16} className={`${color} mx-auto mb-1.5`} />
            <div className={`font-heading font-extrabold text-xl ${color}`}>{val}</div>
            <div className="text-white/35 text-[10px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
