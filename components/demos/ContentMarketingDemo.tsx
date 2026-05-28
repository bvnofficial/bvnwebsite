"use client";
import { useState } from "react";
import { FileText, CheckCircle2, AlertCircle, Zap, BarChart2, BookOpen } from "lucide-react";

const topicSuggestions = [
  "10 Ways to Grow Your Business with Digital Marketing",
  "The Ultimate Guide to Marketing Automation in 2025",
  "How to Build a Content Strategy That Actually Works",
  "Social Media vs. SEO: Which Should You Prioritize?",
  "ROI of Marketing Automation for SMEs",
];

const audienceOptions = ["SME Owners", "Marketing Managers", "E-commerce Brands", "B2B Companies", "Startups"];
const toneOptions = ["Professional", "Conversational", "Educational", "Persuasive", "Inspiring"];

function analyzeSEO(title: string, body: string) {
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const hasH2 = body.includes("## ") || body.split("\n").some(l => l.startsWith("## "));
  const titleLen = title.length;
  const hasKeywords = body.toLowerCase().includes("marketing") || body.toLowerCase().includes("business") || body.toLowerCase().includes("growth");
  const readability = wordCount > 100 ? 85 : wordCount > 50 ? 72 : 45;

  return {
    seoScore: Math.min(98, (titleLen > 30 && titleLen < 70 ? 20 : 10) + (hasKeywords ? 20 : 5) + (wordCount > 100 ? 20 : wordCount > 50 ? 12 : 5) + (hasH2 ? 15 : 0) + 20),
    wordCount,
    readability,
    checks: [
      { label: "Title length (30-70 chars)", pass: titleLen >= 30 && titleLen <= 70, detail: `${titleLen} chars` },
      { label: "Keyword in title", pass: title.toLowerCase().includes("market") || title.toLowerCase().includes("business") || title.toLowerCase().includes("growth"), detail: "Detected" },
      { label: "Min. 300 words", pass: wordCount >= 300, detail: `${wordCount} words` },
      { label: "Headings (H2/H3)", pass: hasH2, detail: hasH2 ? "Found" : "None found" },
      { label: "Readable for target audience", pass: readability > 60, detail: `Score: ${readability}/100` },
    ],
  };
}

const sampleOutline = `## Introduction
Brief hook and why this topic matters to your audience.

## Section 1: Understanding the Problem
Explain the core challenge businesses face.

## Section 2: The Solution Framework
Walk through the approach step-by-step.

## Section 3: Real-World Examples
Case studies and results from similar businesses.

## Section 4: How to Implement
Practical, actionable steps the reader can take today.

## Conclusion & CTA
Summarize key takeaways and invite readers to take action.`;

const calendar = [
  { week: "Week 1", type: "Blog Post", topic: "Guide: Marketing automation basics", status: "published" },
  { week: "Week 2", type: "Infographic", topic: "Stats: 2025 content marketing trends", status: "scheduled" },
  { week: "Week 3", type: "Case Study", topic: "How we grew Brand X 300% in 90 days", status: "draft" },
  { week: "Week 4", type: "Video Script", topic: "5 tools every marketer needs in 2025", status: "pending" },
  { week: "Week 5", type: "Email Newsletter", topic: "Monthly marketing roundup — May 2025", status: "scheduled" },
  { week: "Week 6", type: "Blog Post", topic: "SEO trends to watch: Q3 2025", status: "draft" },
];

const statusColors: Record<string, string> = {
  published: "bg-green-400/10 border-green-400/20 text-green-400",
  scheduled: "bg-blue-400/10 border-blue-400/20 text-blue-400",
  draft: "bg-yellow-400/10 border-yellow-400/20 text-yellow-400",
  pending: "bg-white/5 border-white/15 text-white/50",
};

export default function ContentMarketingDemo() {
  const [activeTab, setActiveTab] = useState<"brief" | "seo" | "calendar">("brief");
  const [topic, setTopic] = useState(topicSuggestions[0]);
  const [audience, setAudience] = useState("SME Owners");
  const [tone, setTone] = useState("Professional");
  const [body, setBody] = useState(sampleOutline);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { seoScore, wordCount, readability, checks } = analyzeSEO(topic, body);

  function generate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerated(true);
      setGenerating(false);
    }, 1800);
  }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["brief", "seo", "calendar"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "brief" ? "📋 Content Brief" : tab === "seo" ? "📊 SEO Analyzer" : "📅 Content Calendar"}
          </button>
        ))}
      </div>

      {/* Content Brief */}
      {activeTab === "brief" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <h4 className="font-heading font-bold text-white text-sm">📋 AI Content Brief Generator</h4>
            <div>
              <label className="text-white/40 text-[10px] uppercase tracking-widest">Article Topic / Title</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)}
                className="w-full mt-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:border-orange/40" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-white/40 text-[10px] uppercase tracking-widest">Target Audience</label>
                <select value={audience} onChange={(e) => setAudience(e.target.value)}
                  className="w-full mt-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/70 text-sm focus:outline-none focus:border-orange/40">
                  {audienceOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-white/40 text-[10px] uppercase tracking-widest">Tone</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)}
                  className="w-full mt-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/70 text-sm focus:outline-none focus:border-orange/40">
                  {toneOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <p className="text-white/30 text-[10px] w-full uppercase tracking-widest">Topic Ideas</p>
              {topicSuggestions.map((s) => (
                <button key={s} onClick={() => setTopic(s)}
                  className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-white/50 text-[10px] hover:bg-orange/10 hover:border-orange/30 hover:text-orange transition-colors text-left">
                  {s.length > 40 ? s.slice(0, 40) + "…" : s}
                </button>
              ))}
            </div>
            <button onClick={generate} disabled={generating}
              className="w-full py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-orange-light transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
              {generating ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Generating Brief...</> : <><Zap size={14} /> Generate Content Brief</>}
            </button>
          </div>

          {generated && (
            <div className="bg-white/5 border border-orange/20 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-green-400" />
                <h4 className="font-heading font-bold text-white text-sm">Brief Generated!</h4>
              </div>
              {[
                { label: "🎯 Target Audience", val: audience },
                { label: "🔊 Tone of Voice", val: tone },
                { label: "📏 Target Length", val: "1,500 – 2,500 words" },
                { label: "🔑 Primary Keyword", val: topic.split(" ").slice(0, 4).join(" ").toLowerCase() },
                { label: "📎 Content Format", val: "Long-form guide with subheadings, bullet points, and CTA" },
                { label: "🔗 Internal Links", val: "Link to /marketing, /pricing, /contact" },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-start justify-between gap-3 py-1.5 border-b border-white/5">
                  <span className="text-white/50 text-xs">{label}</span>
                  <span className="text-white/80 text-xs font-semibold text-right">{val}</span>
                </div>
              ))}
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Suggested Outline</p>
                <div className="bg-white/3 border border-white/8 rounded-lg px-3 py-2.5 text-white/55 text-xs leading-relaxed whitespace-pre-line">
                  {sampleOutline}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEO Analyzer */}
      {activeTab === "seo" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
            <h4 className="font-heading font-bold text-white text-sm">Real-time SEO Content Analyzer</h4>
            <div>
              <label className="text-white/40 text-[10px] uppercase tracking-widest">Post Title</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)}
                className="w-full mt-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:border-orange/40" />
            </div>
            <div>
              <label className="text-white/40 text-[10px] uppercase tracking-widest">Content Body (type or paste)</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6}
                className="w-full mt-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/55 text-xs focus:outline-none focus:border-orange/40 resize-none" />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-heading font-bold text-white text-sm">SEO Score</h4>
              <span className={`font-heading font-extrabold text-2xl ${seoScore >= 80 ? "text-green-400" : seoScore >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                {seoScore}<span className="text-white/30 text-sm">/100</span>
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-4">
              <div className={`h-3 rounded-full transition-all duration-700 ${seoScore >= 80 ? "bg-green-400" : seoScore >= 60 ? "bg-yellow-400" : "bg-orange"}`}
                style={{ width: `${seoScore}%` }} />
            </div>
            <div className="space-y-2">
              {checks.map(({ label, pass, detail }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    {pass ? <CheckCircle2 size={13} className="text-green-400" /> : <AlertCircle size={13} className="text-yellow-400" />}
                    <span className="text-white/70 text-xs">{label}</span>
                  </div>
                  <span className="text-white/35 text-[10px]">{detail}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: "Word Count", val: wordCount.toString(), target: "300+" },
                { label: "Readability", val: `${readability}/100`, target: "60+ good" },
                { label: "SEO Score", val: `${seoScore}%`, target: "80%+ ideal" },
              ].map(({ label, val, target }) => (
                <div key={label} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                  <div className="font-heading font-bold text-base text-white">{val}</div>
                  <div className="text-white/40 text-[10px]">{label}</div>
                  <div className="text-white/20 text-[9px]">Target: {target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Calendar */}
      {activeTab === "calendar" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading font-bold text-white text-sm">6-Week Content Plan</h4>
            <div className="flex gap-2 text-[10px]">
              {["published", "scheduled", "draft"].map((s) => (
                <span key={s} className={`px-2 py-0.5 rounded-full border capitalize ${statusColors[s]}`}>{s}</span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {calendar.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5">
                <span className="text-white/30 text-[10px] font-semibold w-12 shrink-0">{item.week}</span>
                <span className="text-orange bg-orange/10 border border-orange/20 text-[10px] font-bold px-2 py-0.5 rounded-full w-24 text-center shrink-0">{item.type}</span>
                <span className="text-white/70 text-xs flex-1 truncate">{item.topic}</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold capitalize shrink-0 ${statusColors[item.status]}`}>{item.status}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Published", val: calendar.filter(c => c.status === "published").length },
              { label: "Scheduled", val: calendar.filter(c => c.status === "scheduled").length },
              { label: "In Progress", val: calendar.filter(c => c.status === "draft" || c.status === "pending").length },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                <div className="font-heading font-bold text-2xl text-white">{val}</div>
                <div className="text-white/35 text-[10px]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
