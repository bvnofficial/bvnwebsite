"use client";
import { useState } from "react";
import { Mail, Eye, MousePointer, TrendingUp, Users, Play, ChevronRight } from "lucide-react";

const templates = [
  {
    id: "welcome", name: "Welcome Series", tag: "Onboarding",
    subject: "Welcome to {{Company}}! Here's what's next 🎉",
    preheader: "Your journey starts here — let's get you set up",
    body: "Hi {{First Name}},\n\nWe're thrilled to have you on board! Here's everything you need to get started with {{Product}}.\n\n✅ Step 1: Complete your profile\n✅ Step 2: Connect your first integration\n✅ Step 3: Invite your team\n\nOur team is here to help every step of the way.",
    cta: "Get Started Now →",
    openRate: "42%", clickRate: "18%",
  },
  {
    id: "cart", name: "Abandoned Cart", tag: "Recovery",
    subject: "You left something behind 🛒",
    preheader: "Your items are still waiting — don't miss out",
    body: "Hey {{Name}},\n\nYou were so close! You left these items in your cart:\n\n📦 {{Product Name}} — {{Price}}\n\nYour cart will expire in 24 hours. Complete your purchase now and enjoy free shipping on orders over $50.",
    cta: "Complete My Purchase →",
    openRate: "45%", clickRate: "22%",
  },
  {
    id: "promo", name: "Flash Sale", tag: "Promotional",
    subject: "⚡ 48-Hour Flash Sale — {{Discount}}% OFF Everything",
    preheader: "This offer expires in 48 hours — act now",
    body: "This is your exclusive offer.\n\n🔥 {{Discount}}% off everything in our store\n⏰ Offer expires: {{End Date}}\n🚚 Free shipping on all orders\n\nThis deal is only available to our VIP subscribers — don't share it!\n\nUse code: FLASH{{Discount}} at checkout.",
    cta: "Claim My Discount →",
    openRate: "38%", clickRate: "15%",
  },
  {
    id: "newsletter", name: "Monthly Newsletter", tag: "Nurture",
    subject: "{{Month}} Insights: What's Working in Digital Marketing",
    preheader: "3 strategies our clients used to 3x their ROI this month",
    body: "Hi {{First Name}},\n\nHere's your monthly roundup of what's working right now:\n\n📈 Trend #1: Short-form video continues to dominate\n🤖 Trend #2: AI-assisted content is 40% more engaging\n📧 Trend #3: Hyper-segmented emails see 2x open rates\n\nPlus: Case study — how we grew a client's organic traffic by 340% in 6 months.",
    cta: "Read Full Report →",
    openRate: "31%", clickRate: "9%",
  },
];

const flows = [
  { name: "Welcome Series", steps: ["Signup", "Email 1 (Day 0)", "Email 2 (Day 3)", "Email 3 (Day 7)", "Converted?"], color: "bg-blue-400" },
  { name: "Re-engagement", steps: ["Inactive 30d", "Win-back Email", "Offer Email", "Final Chance", "Unsubscribe"], color: "bg-purple-400" },
  { name: "Post-Purchase", steps: ["Purchase", "Thank You", "How-To Guide", "Review Request", "Upsell"], color: "bg-green-400" },
];

export default function EmailMarketingDemo() {
  const [selected, setSelected] = useState(templates[0]);
  const [listSize, setListSize] = useState(5000);
  const [activeTab, setActiveTab] = useState<"preview" | "flow" | "score">("preview");
  const [subjectInput, setSubjectInput] = useState("");
  const [tested, setTested] = useState(false);
  const [testScore, setTestScore] = useState(0);

  const openRate = 0.28;
  const clickRate = 0.047;
  const converts = 0.031;

  function testSubject() {
    const s = subjectInput.toLowerCase();
    let score = 65;
    if (s.includes("{{") && s.includes("}}")) score += 12;
    if (s.includes("?")) score += 5;
    if (s.match(/\d+%/)) score += 8;
    if (s.length < 50) score += 5;
    if (s.includes("free")) score -= 8;
    if (s.match(/[!]{2,}/)) score -= 5;
    if (s.match(/😀|🎉|🚀|💡|⚡/)) score += 6;
    setTestScore(Math.min(98, Math.max(42, score)));
    setTested(true);
  }

  function scoreColor(s: number) {
    if (s >= 85) return "text-green-400";
    if (s >= 70) return "text-yellow-400";
    return "text-orange";
  }

  return (
    <div className="space-y-5">
      {/* Template selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {templates.map((t) => (
          <button key={t.id} onClick={() => setSelected(t)}
            className={`text-left p-3 rounded-xl border transition-all ${selected.id === t.id ? "border-orange/50 bg-orange/8" : "border-white/10 bg-white/3 hover:bg-white/8"}`}>
            <span className="text-[9px] font-bold uppercase tracking-widest text-orange/70 bg-orange/10 px-1.5 py-0.5 rounded-full">{t.tag}</span>
            <p className="text-white/80 text-xs font-semibold mt-1.5">{t.name}</p>
            <p className="text-white/35 text-[10px] mt-0.5">Open: {t.openRate} · CTR: {t.clickRate}</p>
          </button>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["preview", "flow", "score"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "preview" ? "📧 Email Preview" : tab === "flow" ? "🔄 Automation Flow" : "🧪 Subject Scorer"}
          </button>
        ))}
      </div>

      {/* Email Preview */}
      {activeTab === "preview" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          {/* Email client window */}
          <div className="bg-gray-100 rounded-xl overflow-hidden shadow-xl">
            {/* Email client header */}
            <div className="bg-gray-200 px-4 py-2 flex items-center gap-2 border-b border-gray-300">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-gray-500 text-xs ml-2">Email Preview — {selected.name}</span>
            </div>
            {/* Email metadata */}
            <div className="bg-white border-b border-gray-200 px-5 py-3 space-y-1">
              <div className="flex gap-2 text-xs">
                <span className="text-gray-400 w-16">From:</span>
                <span className="text-gray-700 font-medium">BVN Official &lt;hello@bvnofficial.com&gt;</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-gray-400 w-16">Subject:</span>
                <span className="text-gray-900 font-semibold">{selected.subject}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-gray-400 w-16">Preview:</span>
                <span className="text-gray-500 italic">{selected.preheader}</span>
              </div>
            </div>
            {/* Email body */}
            <div className="bg-gray-50 px-5 py-4">
              {/* Header */}
              <div className="bg-orange rounded-xl px-5 py-4 text-center mb-4">
                <p className="text-white font-extrabold text-lg tracking-tight">BVN Official</p>
                <p className="text-orange-100 text-xs mt-0.5">Marketing · Automation · Growth</p>
              </div>
              {/* Body text */}
              <div className="bg-white rounded-xl px-5 py-4 shadow-sm">
                <h2 className="text-gray-900 font-bold text-sm mb-3">{selected.subject.replace("{{Company}}", "BVN").replace("🎉", "").replace("⚡", "").replace("🛒", "").trim()}</h2>
                <div className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">
                  {selected.body.replace(/{{.*?}}/g, (m) => `[${m.slice(2, -2)}]`)}
                </div>
                <button className="mt-4 w-full py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors">
                  {selected.cta}
                </button>
              </div>
              {/* Footer */}
              <div className="text-center mt-4 text-gray-400 text-[10px]">
                <p>BVN Official · Manila, Philippines</p>
                <p className="mt-0.5">Unsubscribe · View in browser · Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automation Flow */}
      {activeTab === "flow" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h4 className="font-heading font-bold text-white text-sm">Email Automation Sequences</h4>
          {flows.map((flow) => (
            <div key={flow.name}>
              <p className="text-white/50 text-xs font-semibold mb-2">{flow.name}</p>
              <div className="flex items-center gap-1 flex-wrap">
                {flow.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className={`px-3 py-1.5 rounded-lg ${flow.color}/20 border border-${flow.color.replace("bg-", "")}/30 text-white/70 text-[10px] font-medium whitespace-nowrap`}>
                      {step}
                    </div>
                    {i < flow.steps.length - 1 && (
                      <ChevronRight size={12} className="text-white/20 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-2">
            {[
              { icon: Mail, label: "Active Campaigns", val: "12", color: "text-white" },
              { icon: Eye, label: "Avg Open Rate", val: "32%", color: "text-blue-400" },
              { icon: MousePointer, label: "Avg Click Rate", val: "6.8%", color: "text-orange" },
              { icon: TrendingUp, label: "Revenue Attr.", val: "$18.4K", color: "text-green-400" },
            ].map(({ icon: Icon, label, val, color }) => (
              <div key={label} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                <Icon size={14} className={`${color} mx-auto mb-1`} />
                <div className={`font-heading font-bold text-lg ${color}`}>{val}</div>
                <div className="text-white/30 text-[10px]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Line Scorer */}
      {activeTab === "score" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h4 className="font-heading font-bold text-white text-sm">AI Subject Line Optimizer</h4>
          <div className="flex gap-2">
            <input value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && testSubject()}
              placeholder="Type a subject line to score it..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-orange/40" />
            <button onClick={testSubject} disabled={!subjectInput}
              className="px-4 py-2 bg-orange text-white text-xs font-bold rounded-lg disabled:opacity-40 hover:bg-orange-light transition-colors flex items-center gap-1.5">
              <Play size={12} /> Score
            </button>
          </div>
          {tested && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className={`font-heading font-extrabold text-4xl ${scoreColor(testScore)}`}>
                  {testScore}<span className="text-sm text-white/30">/100</span>
                </div>
                <div>
                  <div className={`font-semibold ${scoreColor(testScore)}`}>
                    {testScore >= 85 ? "🏆 Excellent" : testScore >= 70 ? "✅ Good" : "⚠️ Needs Work"}
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">
                    {testScore >= 85 ? "High open rate predicted" : testScore >= 70 ? "Above average expected" : "Try personalization or urgency"}
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 mb-4">
                <div className={`h-2.5 rounded-full transition-all duration-700 ${testScore >= 85 ? "bg-green-400" : testScore >= 70 ? "bg-yellow-400" : "bg-orange"}`}
                  style={{ width: `${testScore}%` }} />
              </div>
              <div className="space-y-1.5 text-xs">
                {[
                  { label: "Personalization token ({{Name}})", pass: subjectInput.includes("{{"), impact: "+12 pts" },
                  { label: "Contains a number or stat", pass: /\d/.test(subjectInput), impact: "+8 pts" },
                  { label: "Under 50 characters", pass: subjectInput.length < 50, impact: "+5 pts" },
                  { label: "Includes emoji", pass: ["🎉","🚀","⚡","💡","✅","🔥","💰","🎯","👉","🎁","💙","😊","⭐","🏆","📢","🆕"].some(e => subjectInput.includes(e)), impact: "+6 pts" },
                  { label: "No spam triggers (FREE, !!!)", pass: !subjectInput.toLowerCase().includes("free") && !/[!]{2,}/.test(subjectInput), impact: "+8 pts" },
                ].map(({ label, pass, impact }) => (
                  <div key={label} className="flex items-center justify-between py-1 border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      {pass ? <Checkmark /> : <Cross />}
                      <span className="text-white/60">{label}</span>
                    </div>
                    <span className="text-white/30">{impact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campaign Estimator */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-white/70 text-xs font-semibold">Campaign Performance Estimator</h5>
              <span className="text-orange font-bold text-sm">{listSize.toLocaleString()} subscribers</span>
            </div>
            <input type="range" min="500" max="100000" step="500" value={listSize}
              onChange={(e) => setListSize(+e.target.value)} className="w-full accent-orange mb-4" />
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: Mail, label: "Sent", val: listSize.toLocaleString(), color: "text-white" },
                { icon: Eye, label: "Opens", val: Math.floor(listSize * openRate).toLocaleString(), color: "text-blue-400" },
                { icon: MousePointer, label: "Clicks", val: Math.floor(listSize * clickRate).toLocaleString(), color: "text-orange" },
                { icon: TrendingUp, label: "Converts", val: Math.floor(listSize * converts).toLocaleString(), color: "text-green-400" },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="bg-white/5 border border-white/8 rounded-lg p-2.5 text-center">
                  <Icon size={13} className={`${color} mx-auto mb-1`} />
                  <div className={`font-heading font-bold text-base ${color}`}>{val}</div>
                  <div className="text-white/30 text-[9px]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Checkmark() {
  return <span className="w-3.5 h-3.5 rounded-full bg-green-400/20 flex items-center justify-center text-green-400 text-[9px] font-bold shrink-0">✓</span>;
}
function Cross() {
  return <span className="w-3.5 h-3.5 rounded-full bg-red-400/20 flex items-center justify-center text-red-400 text-[9px] font-bold shrink-0">✕</span>;
}
