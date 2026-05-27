"use client";
import { useState } from "react";
import { Search, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

const mockKeywords = [
  { kw: "digital marketing agency", vol: 40500, diff: 78, intent: "Commercial" },
  { kw: "social media management", vol: 33100, diff: 65, intent: "Commercial" },
  { kw: "SEO services Philippines", vol: 2400, diff: 42, intent: "Commercial" },
  { kw: "marketing automation tools", vol: 18200, diff: 58, intent: "Informational" },
  { kw: "CRM software for small business", vol: 12100, diff: 49, intent: "Commercial" },
  { kw: "email marketing best practices", vol: 8900, diff: 38, intent: "Informational" },
  { kw: "content marketing strategy", vol: 14800, diff: 55, intent: "Informational" },
  { kw: "influencer marketing agency", vol: 6600, diff: 61, intent: "Commercial" },
  { kw: "web development Philippines", vol: 3200, diff: 35, intent: "Commercial" },
  { kw: "business automation software", vol: 9900, diff: 53, intent: "Commercial" },
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
  const [site, setSite] = useState("yourdomain.com");
  const [score, setScore] = useState<number | null>(null);

  function search() {
    if (!query.trim()) return;
    const filtered = mockKeywords.filter(k => k.kw.includes(query.toLowerCase()) || query.length > 3);
    setResults(filtered.length ? filtered : mockKeywords.slice(0, 5));
    setSearched(true);
  }

  function auditSite() {
    setScore(Math.floor(Math.random() * 35) + 50);
  }

  return (
    <div className="space-y-5">
      {/* Keyword Research */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h4 className="font-heading font-bold text-white text-sm mb-3">🔍 Keyword Research Tool</h4>
        <div className="flex gap-2 mb-4">
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
            placeholder="e.g. marketing agency, CRM tools..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-orange/40" />
          <button onClick={search} className="px-4 py-2 bg-orange text-white text-sm font-bold rounded-lg hover:bg-orange-light transition-colors flex items-center gap-1.5">
            <Search size={14} /> Analyze
          </button>
        </div>
        {searched && (
          <div className="space-y-2">
            <div className="grid grid-cols-4 text-[10px] text-white/30 font-semibold uppercase tracking-widest px-2 pb-1">
              <span>Keyword</span><span className="text-center">Volume/mo</span><span className="text-center">Difficulty</span><span className="text-center">Intent</span>
            </div>
            {results.map((k, i) => (
              <div key={i} className="grid grid-cols-4 items-center bg-white/3 border border-white/8 rounded-lg px-3 py-2.5 text-sm hover:bg-white/8 transition-colors">
                <span className="text-white/80 text-xs font-medium">{k.kw}</span>
                <span className="text-center text-orange font-heading font-bold text-xs">{k.vol.toLocaleString()}</span>
                <span className="flex justify-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diffColor(k.diff)}`}>{k.diff} · {diffLabel(k.diff)}</span>
                </span>
                <span className="text-center text-white/50 text-[10px]">{k.intent}</span>
              </div>
            ))}
          </div>
        )}
        {!searched && (
          <p className="text-white/30 text-xs text-center py-4">Enter a keyword to see search volume and difficulty scores</p>
        )}
      </div>

      {/* Quick Site Audit */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h4 className="font-heading font-bold text-white text-sm mb-3">🏥 Quick SEO Health Check</h4>
        <div className="flex gap-2 mb-4">
          <input value={site} onChange={e => setSite(e.target.value)}
            placeholder="Enter domain..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:border-orange/40" />
          <button onClick={auditSite} className="px-4 py-2 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-lg hover:bg-white/20 transition-colors">
            Audit
          </button>
        </div>
        {score !== null && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">SEO Health Score</span>
              <span className={`font-heading font-extrabold text-2xl ${score > 74 ? "text-green-400" : score > 55 ? "text-yellow-400" : "text-red-400"}`}>{score}/100</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div className={`h-2.5 rounded-full transition-all duration-1000 ${score > 74 ? "bg-green-400" : score > 55 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${score}%` }} />
            </div>
            {[
              { label: "Page Speed", pass: score > 60, detail: score > 60 ? "Under 2s load time" : "Needs optimization" },
              { label: "Meta Tags", pass: score > 55, detail: score > 55 ? "Titles & descriptions found" : "Missing meta descriptions" },
              { label: "Mobile Friendly", pass: score > 50, detail: "Responsive design detected" },
              { label: "Backlink Profile", pass: score > 70, detail: score > 70 ? "Healthy authority" : "Needs link building" },
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
  );
}
