"use client";
import { useState } from "react";
import { Mail, Eye, MousePointer, TrendingUp } from "lucide-react";

const templates = [
  { id: "welcome", name: "Welcome Series", subject: "Welcome to {{Company}}! Here's what's next 🎉", preview: "We're thrilled to have you on board. Here's everything you need to get started..." },
  { id: "cart", name: "Abandoned Cart", subject: "You left something behind 🛒", preview: "Hey {{Name}}, you left items in your cart. They're still waiting for you..." },
  { id: "promo", name: "Promotional", subject: "⚡ 48-Hour Flash Sale — {{Discount}}% OFF Everything", preview: "This is your exclusive offer. Don't let it slip away..." },
  { id: "reengagement", name: "Re-engagement", subject: "We miss you, {{Name}} 💙", preview: "It's been a while since we last heard from you. Here's what you've been missing..." },
  { id: "newsletter", name: "Newsletter", subject: "{{Month}} Insights: {{Topic}} & More", preview: "Here are the top trends, tips, and updates from this month..." },
];

const subjectLines = [
  { text: "Don't miss out — offer ends tonight!", score: 68 },
  { text: "Your exclusive discount is waiting 🎁", score: 82 },
  { text: "{{Name}}, we made this just for you", score: 91 },
  { text: "LAST CHANCE: 50% off ends in 2 hours", score: 75 },
  { text: "Results: How we grew 300% in 90 days", score: 88 },
];

export default function EmailMarketingDemo() {
  const [selected, setSelected] = useState(templates[0]);
  const [listSize, setListSize] = useState(5000);
  const [customSubject, setCustomSubject] = useState("");
  const [tested, setTested] = useState(false);
  const [testScore, setTestScore] = useState(0);

  const openRate = 0.28;
  const clickRate = 0.047;
  const converts = 0.031;

  function testSubject() {
    const score = Math.floor(Math.random() * 30) + 60;
    setTestScore(score);
    setTested(true);
  }

  function scoreColor(s: number) {
    if (s >= 85) return "text-green-400";
    if (s >= 70) return "text-yellow-400";
    return "text-orange";
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Template Selector */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h4 className="font-heading font-bold text-white text-sm mb-3">📧 Email Templates</h4>
          <div className="space-y-2 mb-4">
            {templates.map((t) => (
              <button key={t.id} onClick={() => setSelected(t)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all text-xs ${selected.id === t.id ? "border-orange/50 bg-orange/8 text-white" : "border-white/10 bg-white/3 text-white/60 hover:bg-white/8"}`}>
                <div className="font-semibold">{t.name}</div>
                <div className="text-white/40 mt-0.5 truncate">{t.subject}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Email Preview */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col">
          <h4 className="font-heading font-bold text-white text-sm mb-3">👁 Live Preview</h4>
          <div className="flex-1 bg-white/3 border border-white/8 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Mail size={14} className="text-orange" />
              <span className="text-white/40 text-xs">Subject:</span>
              <span className="text-white/80 text-xs font-medium">{selected.subject}</span>
            </div>
            <div className="text-white/50 text-xs leading-relaxed">{selected.preview}</div>
            <div className="flex gap-2 pt-2">
              <div className="flex-1 h-2 bg-white/10 rounded" />
              <div className="w-16 h-2 bg-white/10 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-2 bg-white/10 rounded" />
              <div className="w-24 h-2 bg-white/10 rounded" />
            </div>
            <button className="w-full py-2 bg-orange text-white text-xs font-bold rounded-lg mt-2">
              👉 Click Here — CTA
            </button>
          </div>
        </div>
      </div>

      {/* Campaign Estimator */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h4 className="font-heading font-bold text-white text-sm mb-3">📊 Campaign Performance Estimator</h4>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-white/60 text-xs">List Size:</span>
          <input type="range" min="500" max="100000" step="500" value={listSize} onChange={e => setListSize(+e.target.value)} className="flex-1 accent-orange" />
          <span className="text-orange font-bold text-sm w-20 text-right">{listSize.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Mail, label: "Sent", val: listSize.toLocaleString(), color: "text-white" },
            { icon: Eye, label: "Opens (28%)", val: Math.floor(listSize * openRate).toLocaleString(), color: "text-blue-400" },
            { icon: MousePointer, label: "Clicks (4.7%)", val: Math.floor(listSize * clickRate).toLocaleString(), color: "text-orange" },
            { icon: TrendingUp, label: "Converts (3.1%)", val: Math.floor(listSize * converts).toLocaleString(), color: "text-green-400" },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="bg-white/5 border border-white/8 rounded-lg p-3 text-center">
              <Icon size={16} className={`${color} mx-auto mb-1`} />
              <div className={`font-heading font-bold text-lg ${color}`}>{val}</div>
              <div className="text-white/35 text-[10px]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Line Tester */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h4 className="font-heading font-bold text-white text-sm mb-3">🧪 Subject Line Score Tester</h4>
        <div className="flex gap-2 mb-4">
          <input value={customSubject} onChange={e => setCustomSubject(e.target.value)} placeholder="Type a subject line..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-orange/40" />
          <button onClick={testSubject} disabled={!customSubject} className="px-4 py-2 bg-orange text-white text-xs font-bold rounded-lg disabled:opacity-40 hover:bg-orange-light transition-colors">Test</button>
        </div>
        {tested && (
          <div className="flex items-center gap-4 mb-4">
            <div className={`font-heading font-extrabold text-3xl ${scoreColor(testScore)}`}>{testScore}<span className="text-sm text-white/40">/100</span></div>
            <div>
              <div className={`text-sm font-semibold ${scoreColor(testScore)}`}>{testScore >= 85 ? "Excellent!" : testScore >= 70 ? "Good" : "Needs Work"}</div>
              <div className="text-white/40 text-xs">{testScore >= 85 ? "High open rate predicted" : testScore >= 70 ? "Solid performance expected" : "Try adding personalization or urgency"}</div>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-1">Top Performing Examples</p>
          {subjectLines.map((sl, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5">
              <span className="text-white/60 text-xs">{sl.text}</span>
              <span className={`text-xs font-bold ${scoreColor(sl.score)}`}>{sl.score}/100</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
