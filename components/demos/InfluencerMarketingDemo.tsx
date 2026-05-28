"use client";
import { useState } from "react";
import { Search, Star, Users, Heart, TrendingUp, Filter } from "lucide-react";

interface Influencer {
  id: number;
  name: string;
  handle: string;
  niche: string;
  platform: string;
  followers: string;
  followersRaw: number;
  engRate: number;
  avgLikes: string;
  location: string;
  rate: string;
  tier: "Nano" | "Micro" | "Macro" | "Mega";
  score: number;
  initials: string;
  color: string;
}

const influencers: Influencer[] = [
  { id: 1, name: "Maria Santos", handle: "@mariasantos", niche: "Lifestyle", platform: "Instagram", followers: "24.8K", followersRaw: 24800, engRate: 6.4, avgLikes: "1,587", location: "Manila", rate: "$180/post", tier: "Micro", score: 91, initials: "MS", color: "bg-pink-500" },
  { id: 2, name: "Jake Reyes", handle: "@jakereyes_ph", niche: "Tech & Business", platform: "YouTube", followers: "142K", followersRaw: 142000, engRate: 4.2, avgLikes: "5,964", location: "Cebu", rate: "$850/video", tier: "Macro", score: 87, initials: "JR", color: "bg-blue-500" },
  { id: 3, name: "Sofia Tan", handle: "@sofiatanph", niche: "Food & Travel", platform: "TikTok", followers: "380K", followersRaw: 380000, engRate: 8.1, avgLikes: "30,780", location: "Manila", rate: "$1,200/reel", tier: "Macro", score: 94, initials: "ST", color: "bg-orange" },
  { id: 4, name: "Chris Luna", handle: "@chrisluna", niche: "Fitness", platform: "Instagram", followers: "8.2K", followersRaw: 8200, engRate: 9.8, avgLikes: "803", location: "Davao", rate: "$80/post", tier: "Nano", score: 83, initials: "CL", color: "bg-green-500" },
  { id: 5, name: "Angela Lim", handle: "@angelabusiness", niche: "Entrepreneurship", platform: "LinkedIn", followers: "48K", followersRaw: 48000, engRate: 3.8, avgLikes: "1,824", location: "BGC", rate: "$420/post", tier: "Micro", score: 88, initials: "AL", color: "bg-purple-500" },
  { id: 6, name: "Paolo Cruz", handle: "@paolocruzph", niche: "Finance", platform: "YouTube", followers: "215K", followersRaw: 215000, engRate: 5.6, avgLikes: "12,040", location: "Manila", rate: "$1,800/video", tier: "Macro", score: 90, initials: "PC", color: "bg-teal-500" },
  { id: 7, name: "Bea Villanueva", handle: "@beav_creates", niche: "Fashion", platform: "Instagram", followers: "1.2M", followersRaw: 1200000, engRate: 2.4, avgLikes: "28,800", location: "Manila", rate: "$4,500/post", tier: "Mega", score: 85, initials: "BV", color: "bg-red-500" },
  { id: 8, name: "Marco Dy", handle: "@marcody_ph", niche: "Marketing", platform: "LinkedIn", followers: "18.4K", followersRaw: 18400, engRate: 7.2, avgLikes: "1,325", location: "QC", rate: "$220/post", tier: "Micro", score: 92, initials: "MD", color: "bg-indigo-500" },
];

const niches = ["All", "Lifestyle", "Tech & Business", "Food & Travel", "Fitness", "Entrepreneurship", "Finance", "Fashion", "Marketing"];
const tiers = ["All", "Nano", "Micro", "Macro", "Mega"];
const platforms = ["All", "Instagram", "YouTube", "TikTok", "LinkedIn"];
const tierColors: Record<string, string> = {
  Nano: "bg-green-400/10 text-green-400 border-green-400/20",
  Micro: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  Macro: "bg-orange/10 text-orange border-orange/20",
  Mega: "bg-purple-400/10 text-purple-400 border-purple-400/20",
};

export default function InfluencerMarketingDemo() {
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("All");
  const [selectedTier, setSelectedTier] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selected, setSelected] = useState<number[]>([]);
  const [budget, setBudget] = useState(5000);
  const [activeTab, setActiveTab] = useState<"find" | "calculator">("find");

  const filtered = influencers.filter((inf) => {
    const matchSearch = inf.name.toLowerCase().includes(search.toLowerCase()) || inf.handle.toLowerCase().includes(search.toLowerCase());
    const matchNiche = selectedNiche === "All" || inf.niche === selectedNiche;
    const matchTier = selectedTier === "All" || inf.tier === selectedTier;
    const matchPlatform = selectedPlatform === "All" || inf.platform === selectedPlatform;
    return matchSearch && matchNiche && matchTier && matchPlatform;
  });

  function toggleSelect(id: number) {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }

  const selectedInfluencers = influencers.filter((i) => selected.includes(i.id));
  const totalReach = selectedInfluencers.reduce((s, i) => s + i.followersRaw, 0);
  const avgEng = selectedInfluencers.length > 0
    ? (selectedInfluencers.reduce((s, i) => s + i.engRate, 0) / selectedInfluencers.length).toFixed(1)
    : "—";
  const estimatedReach = Math.floor(totalReach * 0.35).toLocaleString();
  const estimatedConversions = Math.floor(totalReach * 0.012).toLocaleString();

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["find", "calculator"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "find" ? "🔍 Influencer Discovery" : "📊 Campaign ROI Calculator"}
          </button>
        ))}
      </div>

      {activeTab === "find" && (
        <>
          {/* Filters */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or @handle..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-orange/40" />
              </div>
              <div className="flex items-center gap-1.5 text-white/40 text-xs">
                <Filter size={12} /> {filtered.length} found
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Niche", value: selectedNiche, options: niches, setter: setSelectedNiche },
                { label: "Tier", value: selectedTier, options: tiers, setter: setSelectedTier },
                { label: "Platform", value: selectedPlatform, options: platforms, setter: setSelectedPlatform },
              ].map(({ label, value, options, setter }) => (
                <select key={label} value={value} onChange={(e) => setter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 text-xs focus:outline-none focus:border-orange/40">
                  {options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filtered.map((inf) => (
              <div key={inf.id}
                onClick={() => toggleSelect(inf.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected.includes(inf.id) ? "border-orange/40 bg-orange/5" : "border-white/10 bg-white/3 hover:bg-white/8"}`}>
                <div className={`w-10 h-10 rounded-full ${inf.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {inf.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white/80 text-xs font-bold">{inf.name}</p>
                    <span className="text-white/30 text-[10px]">{inf.handle}</span>
                    <span className={`px-1.5 py-0.5 rounded-full border text-[9px] font-bold ${tierColors[inf.tier]}`}>{inf.tier}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-white/40 text-[10px]">{inf.platform} · {inf.niche} · {inf.location}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="text-center hidden sm:block">
                      <div className="text-white/70 text-xs font-bold">{inf.followers}</div>
                      <div className="text-white/25 text-[9px]">followers</div>
                    </div>
                    <div className="text-center hidden sm:block">
                      <div className={`text-xs font-bold ${inf.engRate > 6 ? "text-green-400" : inf.engRate > 3 ? "text-yellow-400" : "text-white/50"}`}>{inf.engRate}%</div>
                      <div className="text-white/25 text-[9px]">eng. rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange text-xs font-bold">{inf.rate}</div>
                      <div className="text-white/25 text-[9px]">per post</div>
                    </div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border ${inf.score >= 90 ? "bg-green-400/20 border-green-400/30 text-green-400" : "bg-orange/20 border-orange/30 text-orange"}`}>
                      {inf.score}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selected.length > 0 && (
            <div className="bg-orange/5 border border-orange/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/70 text-xs font-semibold">{selected.length} influencer{selected.length > 1 ? "s" : ""} selected</p>
                <button onClick={() => setSelected([])} className="text-white/30 text-[10px] hover:text-white/60">Clear</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Total Reach", val: totalReach.toLocaleString() },
                  { label: "Avg Engagement", val: `${avgEng}%` },
                  { label: "Est. Impressions", val: estimatedReach },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
                    <div className="font-heading font-bold text-sm text-white">{val}</div>
                    <div className="text-white/35 text-[9px]">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "calculator" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h4 className="font-heading font-bold text-white text-sm mb-4">Campaign ROI Estimator</h4>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-white/60 text-xs">Campaign Budget</span>
              <input type="range" min="1000" max="50000" step="500" value={budget}
                onChange={(e) => setBudget(+e.target.value)} className="flex-1 accent-orange" />
              <span className="text-orange font-heading font-extrabold text-xl w-24 text-right">${budget.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              {[
                { icon: Users, label: "Est. Total Reach", val: `${Math.floor(budget / 0.02 / 1000).toFixed(0)}K`, color: "text-blue-400" },
                { icon: Heart, label: "Est. Engagements", val: `${Math.floor(budget / 0.02 / 1000 * 0.05).toFixed(0)}K`, color: "text-pink-400" },
                { icon: TrendingUp, label: "Est. Conversions", val: `${Math.floor(budget * 0.8)}`, color: "text-green-400" },
                { icon: Star, label: "Est. ROAS", val: `${(budget * 0.8 * 85 / budget).toFixed(1)}x`, color: "text-orange" },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <Icon size={16} className={`${color} mx-auto mb-1.5`} />
                  <div className={`font-heading font-extrabold text-xl ${color}`}>{val}</div>
                  <div className="text-white/35 text-[10px] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h4 className="font-heading font-bold text-white text-sm mb-3">Optimal Campaign Mix for ${budget.toLocaleString()}</h4>
            {[
              { tier: "Nano (1K–10K)", qty: Math.floor(budget / 80 * 0.2), costEach: "$60–$100", engRate: "9–12%" },
              { tier: "Micro (10K–100K)", qty: Math.floor(budget / 300 * 0.4), costEach: "$150–$500", engRate: "5–8%" },
              { tier: "Macro (100K–1M)", qty: Math.floor(budget / 1500 * 0.3), costEach: "$500–$2,500", engRate: "2–5%" },
              { tier: "Mega (1M+)", qty: budget >= 10000 ? 1 : 0, costEach: "$3,000+", engRate: "1–3%" },
            ].map(({ tier, qty, costEach, engRate }) => (
              <div key={tier} className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-white/70 text-xs">{tier}</span>
                <span className="text-orange font-bold text-xs">{qty} influencer{qty !== 1 ? "s" : ""}</span>
                <span className="text-white/40 text-[10px]">{costEach}/post</span>
                <span className="text-green-400 text-[10px]">{engRate} eng.</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
