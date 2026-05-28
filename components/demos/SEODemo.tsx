"use client";
import { useState } from "react";
import { Search, TrendingUp, AlertCircle, CheckCircle2, Globe, ArrowUp, ArrowDown } from "lucide-react";

const mockKeywords = [
  { kw: "digital marketing agency", vol: 40500, diff: 78, intent: "Commercial", cpc: "$4.20" },
  { kw: "social media management", vol: 33100, diff: 65, intent: "Commercial", cpc: "$3.80" },
  { kw: "SEO services Philippines", vol: 2400, diff: 42, intent: "Commercial", cpc: "$2.10" },
  { kw: "marketing automation tools", vol: 18200, diff: 58, intent: "Informational", cpc: "$5.60" },
  { kw: "CRM software for small business", vol: 12100, diff: 49, intent: "Commercial", cpc: "$6.40" },
  { kw: "email marketing best practices", vol: 8900, diff: 38, intent: "Informational", cpc: "$2.90" },
  { kw: "content marketing strategy", vol: 14800, diff: 55, intent: "Informational", cpc: "$3.20" },
  { kw: "influencer marketing agency", vol: 6600, diff: 61, intent: "Commercial", cpc: "$4.80" },
  { kw: "web development Philippines", vol: 3200, diff: 35, intent: "Commercial", cpc: "$2.50" },
  { kw: "business automation software", vol: 9900, diff: 53, intent: "Commercial", cpc: "$7.10" },
];

const rankTracker = [
  { keyword: "BVN marketing agency", pos: 3, change: +2, url: "bvnofficial.com/" },
  { keyword: "social media Philippines", pos: 7, change: +5, url: "bvnofficial.com/marketing/social-media" },
  { keyword: "digital marketing automation", pos: 12, change: -1, url: "bvnofficial.com/marketing" },
  { keyword: "CRM automation services", pos: 5, change: +8, url: "bvnofficial.com/operations/crm-automation" },
  { keyword: "HR payroll software PH", pos: 18, change: +3, url: "bvnofficial.com/operations/hr-payroll" },
];

function diffColor(d: number) {
  if (d < 40) return "text-green-400 bg-green-400/10";
  if (d < 65) return "text-yellow-400 bg-yellow-400/10";
  return "text-red-400 bg-red-400/10";
}
function diffLabel(d: number) {
  if (d < 40) return "Easy";
  if (d < 65) return "Medium";
  return "Hard";
}

export default function SEODemo() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<typeof mockKeywords>([]);
  const [metaTitle, setMetaTitle] = useState("BVN Official | Digital Marketing & Automation Agency Philippines");
  const [metaDesc, setMetaDesc] = useState("BVN helps businesses grow with expert social media management, SEO, digital marketing, and operations automation. Get a free consultation today.");
  const [activeTab, setActiveTab] = useState<"keywords" | "serp" | "rank">("keywords");
  const [auditDomain, setAuditDomain] = useState("yourdomain.com");
  const [score, setScore] = useState<number | null>(null);

  function search() {
    if (!query.trim()) return;
    const filtered = mockKeywords.filter(
      (k) => k.kw.includes(query.toLowerCase()) || query.length > 3
    );
    setResults(filtered.length ? filtered : mockKeywords.slice(0, 6));
    setSearched(true);
  }

  function auditSite() {
    setScore(Math.floor(Math.random() * 28) + 58);
  }

  const titleLen = metaTitle.length;
  const descLen = metaDesc.length;

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["keywords", "serp", "rank"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "keywords" ? "🔍 Keyword Research" : tab === "serp" ? "📄 SERP Preview" : "📈 Rank Tracker"}
          </button>
        ))}
      </div>

      {/* Keyword Research */}
      {activeTab === "keywords" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex gap-2 mb-4">
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="e.g. marketing agency, CRM tools, SEO services..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-orange/40" />
              <button onClick={search} className="px-4 py-2 bg-orange text-white text-sm font-bold rounded-lg hover:bg-orange-light transition-colors flex items-center gap-1.5">
                <Search size={14} /> Analyze
              </button>
            </div>
            {searched ? (
              <div className="space-y-2">
                <div className="grid grid-cols-5 text-[10px] text-white/30 font-semibold uppercase tracking-widest px-3 pb-1">
                  <span className="col-span-2">Keyword</span>
                  <span className="text-center">Vol/mo</span>
                  <span className="text-center">Difficulty</span>
                  <span className="text-center">CPC</span>
                </div>
                {results.map((k, i) => (
                  <div key={i} className="grid grid-cols-5 items-center bg-white/3 border border-white/8 rounded-lg px-3 py-2.5 hover:bg-white/8 transition-colors">
                    <span className="col-span-2 text-white/80 text-xs font-medium">{k.kw}</span>
                    <span className="text-center text-orange font-heading font-bold text-xs">{k.vol.toLocaleString()}</span>
                    <span className="flex justify-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diffColor(k.diff)}`}>
                        {k.diff} · {diffLabel(k.diff)}
                      </span>
                    </span>
                    <span className="text-center text-white/50 text-xs">{k.cpc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search size={28} className="text-white/20 mx-auto mb-2" />
                <p className="text-white/30 text-xs">Enter a keyword to see volume, difficulty & CPC data</p>
              </div>
            )}
          </div>

          {/* Quick Site Audit */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h4 className="font-heading font-bold text-white text-sm mb-3">🏥 Quick SEO Health Check</h4>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input value={auditDomain} onChange={(e) => setAuditDomain(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2.5 text-white/80 text-sm focus:outline-none focus:border-orange/40" />
              </div>
              <button onClick={auditSite} className="px-4 py-2 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-lg hover:bg-white/20 transition-colors">
                Audit
              </button>
            </div>
            {score !== null && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">SEO Health Score</span>
                  <span className={`font-heading font-extrabold text-2xl ${score > 74 ? "text-green-400" : score > 55 ? "text-yellow-400" : "text-red-400"}`}>
                    {score}<span className="text-white/30 text-sm">/100</span>
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all duration-1000 ${score > 74 ? "bg-green-400" : score > 55 ? "bg-yellow-400" : "bg-red-400"}`}
                    style={{ width: `${score}%` }} />
                </div>
                {[
                  { label: "Page Speed", pass: score > 60, detail: score > 60 ? "Under 2.1s load time" : "Needs optimization" },
                  { label: "Meta Tags", pass: score > 55, detail: score > 55 ? "All titles & descriptions found" : "Missing meta descriptions" },
                  { label: "Mobile Friendly", pass: true, detail: "Responsive design detected" },
                  { label: "Core Web Vitals", pass: score > 65, detail: score > 65 ? "LCP 1.8s · CLS 0.02" : "LCP needs improvement" },
                  { label: "Backlink Profile", pass: score > 70, detail: score > 70 ? "DA 38 · 1,240 backlinks" : "Low domain authority" },
                ].map(({ label, pass, detail }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      {pass ? <CheckCircle2 size={13} className="text-green-400" /> : <AlertCircle size={13} className="text-yellow-400" />}
                      <span className="text-white/70 text-xs">{label}</span>
                    </div>
                    <span className="text-white/40 text-xs">{detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SERP Preview */}
      {activeTab === "serp" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h4 className="font-heading font-bold text-white text-sm mb-1">Edit your page metadata and see how Google displays it</h4>
          <div className="space-y-2">
            <div>
              <label className="text-white/40 text-[10px] uppercase tracking-widest">
                Meta Title <span className={titleLen > 60 ? "text-red-400" : "text-white/30"}>({titleLen}/60)</span>
              </label>
              <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:border-orange/40" />
            </div>
            <div>
              <label className="text-white/40 text-[10px] uppercase tracking-widest">
                Meta Description <span className={descLen > 160 ? "text-red-400" : "text-white/30"}>({descLen}/160)</span>
              </label>
              <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={2}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:border-orange/40 resize-none" />
            </div>
          </div>
          {/* SERP Preview */}
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Google Preview</p>
            <div className="bg-white rounded-xl p-5 shadow-lg">
              <p className="text-[11px] text-gray-400 mb-1">https://bvnofficial.com › home</p>
              <p className="text-blue-700 text-lg font-normal hover:underline cursor-pointer leading-snug line-clamp-1">
                {metaTitle || "Page Title"}
              </p>
              <p className="text-gray-600 text-sm mt-1 leading-snug line-clamp-2">
                {metaDesc || "No description provided."}
              </p>
              <div className="flex gap-3 mt-2">
                {["About", "Services", "Contact", "Pricing"].map((link) => (
                  <span key={link} className="text-blue-600 text-xs hover:underline cursor-pointer">{link}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border text-xs ${titleLen <= 60 ? "bg-green-400/5 border-green-400/20 text-green-400" : "bg-red-400/5 border-red-400/20 text-red-400"}`}>
              {titleLen <= 60 ? "✅" : "⚠️"} Title: {titleLen} chars {titleLen <= 60 ? "(Good)" : "(Too long)"}
            </div>
            <div className={`p-3 rounded-lg border text-xs ${descLen <= 160 ? "bg-green-400/5 border-green-400/20 text-green-400" : "bg-red-400/5 border-red-400/20 text-red-400"}`}>
              {descLen <= 160 ? "✅" : "⚠️"} Description: {descLen} chars {descLen <= 160 ? "(Good)" : "(Too long)"}
            </div>
          </div>
        </div>
      )}

      {/* Rank Tracker */}
      {activeTab === "rank" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading font-bold text-white text-sm">Keyword Position Tracker</h4>
            <span className="bg-green-400/10 border border-green-400/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full">↑ Avg +3.4 positions</span>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-4 text-[10px] text-white/30 font-semibold uppercase tracking-widest px-3 pb-2">
              <span className="col-span-2">Keyword</span>
              <span className="text-center">Position</span>
              <span className="text-center">Change</span>
            </div>
            {rankTracker.map((r, i) => (
              <div key={i} className="grid grid-cols-4 items-center bg-white/3 border border-white/8 rounded-lg px-3 py-3 hover:bg-white/8 transition-colors">
                <div className="col-span-2">
                  <p className="text-white/80 text-xs font-medium">{r.keyword}</p>
                  <p className="text-white/30 text-[10px] truncate">{r.url}</p>
                </div>
                <div className="text-center">
                  <span className={`font-heading font-extrabold text-base ${r.pos <= 3 ? "text-green-400" : r.pos <= 10 ? "text-orange" : "text-white/60"}`}>
                    #{r.pos}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  {r.change > 0 ? (
                    <span className="flex items-center gap-0.5 text-green-400 text-xs font-bold">
                      <ArrowUp size={11} /> {r.change}
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-red-400 text-xs font-bold">
                      <ArrowDown size={11} /> {Math.abs(r.change)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
