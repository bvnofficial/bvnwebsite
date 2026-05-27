"use client";
import { useState } from "react";
import { DollarSign, Users, MousePointer, TrendingUp } from "lucide-react";

const channels = [
  { id: "google", name: "Google Search", cpc: 2.8, convRate: 0.048, icon: "🔍" },
  { id: "meta", name: "Meta Ads", cpc: 1.2, convRate: 0.023, icon: "📘" },
  { id: "display", name: "Display/Programmatic", cpc: 0.45, convRate: 0.008, icon: "🖥" },
  { id: "youtube", name: "YouTube Ads", cpc: 0.9, convRate: 0.018, icon: "▶️" },
  { id: "linkedin", name: "LinkedIn Ads", cpc: 5.2, convRate: 0.062, icon: "💼" },
];

export default function DigitalMarketingDemo() {
  const [budget, setBudget] = useState(3000);
  const [allocation, setAllocation] = useState<Record<string, number>>({
    google: 40, meta: 35, display: 10, youtube: 10, linkedin: 5,
  });

  function updateAlloc(id: string, val: number) {
    const others = Object.keys(allocation).filter(k => k !== id);
    const remaining = 100 - val;
    const otherTotal = others.reduce((s, k) => s + allocation[k], 0);
    const newAlloc = { ...allocation, [id]: val };
    if (otherTotal > 0) {
      others.forEach(k => { newAlloc[k] = Math.round((allocation[k] / otherTotal) * remaining); });
    }
    // Normalize
    const total = Object.values(newAlloc).reduce((a, b) => a + b, 0);
    if (total !== 100) newAlloc[others[0]] += (100 - total);
    setAllocation(newAlloc);
  }

  const totalImpressions = channels.reduce((s, c) => {
    const spend = (allocation[c.id] / 100) * budget;
    return s + Math.floor(spend / c.cpc * 15);
  }, 0);

  const totalClicks = channels.reduce((s, c) => {
    const spend = (allocation[c.id] / 100) * budget;
    return s + Math.floor(spend / c.cpc);
  }, 0);

  const totalConvs = channels.reduce((s, c) => {
    const spend = (allocation[c.id] / 100) * budget;
    const clicks = Math.floor(spend / c.cpc);
    return s + Math.floor(clicks * c.convRate);
  }, 0);

  const avgCPA = totalConvs > 0 ? (budget / totalConvs).toFixed(2) : "—";

  return (
    <div className="space-y-5">
      {/* Budget Slider */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h4 className="font-heading font-bold text-white text-sm mb-3">💰 Monthly Ad Budget</h4>
        <div className="flex items-center gap-3 mb-1">
          <input type="range" min="500" max="20000" step="100" value={budget} onChange={e => setBudget(+e.target.value)} className="flex-1 accent-orange" />
          <span className="text-orange font-heading font-extrabold text-xl w-24 text-right">${budget.toLocaleString()}</span>
        </div>
        <p className="text-white/30 text-xs">Drag to set your monthly budget</p>
      </div>

      {/* Channel Allocation */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h4 className="font-heading font-bold text-white text-sm mb-3">📊 Channel Allocation</h4>
        <div className="space-y-3">
          {channels.map((c) => {
            const spend = ((allocation[c.id] || 0) / 100) * budget;
            const clicks = Math.floor(spend / c.cpc);
            const convs = Math.floor(clicks * c.convRate);
            return (
              <div key={c.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{c.icon}</span>
                    <span className="text-white/80 text-xs font-semibold">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-orange font-bold text-xs">${spend.toFixed(0)}</span>
                    <span className="text-white/40 text-[10px]">{clicks.toLocaleString()} clicks</span>
                    <span className="text-green-400 text-[10px]">{convs} convs.</span>
                    <span className="text-white/60 text-xs font-bold w-8">{allocation[c.id]}%</span>
                  </div>
                </div>
                <input type="range" min="0" max="100" value={allocation[c.id] || 0} onChange={e => updateAlloc(c.id, +e.target.value)} className="w-full accent-orange h-1.5" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Users, label: "Est. Impressions", val: `${(totalImpressions / 1000).toFixed(0)}K`, color: "text-blue-400" },
          { icon: MousePointer, label: "Est. Clicks", val: totalClicks.toLocaleString(), color: "text-orange" },
          { icon: TrendingUp, label: "Est. Conversions", val: totalConvs.toString(), color: "text-green-400" },
          { icon: DollarSign, label: "Cost Per Conversion", val: `$${avgCPA}`, color: "text-white" },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <Icon size={18} className={`${color} mx-auto mb-1.5`} />
            <div className={`font-heading font-extrabold text-xl ${color}`}>{val}</div>
            <div className="text-white/35 text-[10px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
