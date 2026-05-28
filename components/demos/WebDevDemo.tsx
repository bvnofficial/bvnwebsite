"use client";
import { useState } from "react";
import { Monitor, Smartphone, CheckCircle2, Zap, Lock, Globe } from "lucide-react";

const websiteTypes = [
  { id: "landing", label: "Landing Page", desc: "High-converting single page", time: "1–2 weeks" },
  { id: "corporate", label: "Corporate Website", desc: "Multi-page company site", time: "3–4 weeks" },
  { id: "ecommerce", label: "E-commerce Store", desc: "Full online store with payments", time: "4–6 weeks" },
  { id: "webapp", label: "Web Application", desc: "Custom SaaS or portal", time: "6–12 weeks" },
];

const lighthouseScores = {
  landing: { performance: 98, accessibility: 96, seo: 100, bestPractices: 95 },
  corporate: { performance: 95, accessibility: 98, seo: 98, bestPractices: 93 },
  ecommerce: { performance: 91, accessibility: 94, seo: 96, bestPractices: 92 },
  webapp: { performance: 93, accessibility: 97, seo: 88, bestPractices: 95 },
};

const techStack = [
  { name: "Next.js 15", category: "Framework", icon: "▲", color: "bg-black" },
  { name: "TypeScript", category: "Language", icon: "TS", color: "bg-blue-600" },
  { name: "Tailwind CSS", category: "Styling", icon: "🎨", color: "bg-teal-600" },
  { name: "Vercel", category: "Hosting", icon: "▲", color: "bg-gray-900" },
  { name: "Supabase", category: "Database", icon: "⚡", color: "bg-green-700" },
  { name: "Stripe", category: "Payments", icon: "💳", color: "bg-purple-700" },
];

const mockPages = {
  landing: ["Home / Hero", "Features", "Social Proof", "Pricing", "CTA Section"],
  corporate: ["Home", "About Us", "Services", "Team", "Blog", "Contact"],
  ecommerce: ["Home", "Shop / Products", "Product Detail", "Cart / Checkout", "Account", "Order History"],
  webapp: ["Dashboard", "Analytics", "Settings", "User Management", "API Docs", "Billing"],
};

export default function WebDevDemo() {
  const [selectedType, setSelectedType] = useState(websiteTypes[0]);
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"preview" | "lighthouse" | "stack">("preview");

  const scores = lighthouseScores[selectedType.id as keyof typeof lighthouseScores];
  const pages = mockPages[selectedType.id as keyof typeof mockPages];

  function scoreColor(s: number) {
    if (s >= 90) return "text-green-400";
    if (s >= 70) return "text-yellow-400";
    return "text-red-400";
  }

  function scoreRing(s: number) {
    if (s >= 90) return "border-green-400";
    if (s >= 70) return "border-yellow-400";
    return "border-red-400";
  }

  return (
    <div className="space-y-5">
      {/* Type selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {websiteTypes.map((t) => (
          <button key={t.id} onClick={() => setSelectedType(t)}
            className={`text-left p-3 rounded-xl border transition-all ${selectedType.id === t.id ? "border-orange/50 bg-orange/8" : "border-white/10 bg-white/3 hover:bg-white/8"}`}>
            <Globe size={14} className="text-orange mb-1.5" />
            <p className="text-white/80 text-xs font-bold">{t.label}</p>
            <p className="text-white/35 text-[10px]">{t.time}</p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["preview", "lighthouse", "stack"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "preview" ? "🖥 Site Preview" : tab === "lighthouse" ? "🏎 Lighthouse" : "⚙️ Tech Stack"}
          </button>
        ))}
      </div>

      {/* Preview */}
      {activeTab === "preview" && (
        <div className="space-y-3">
          <div className="flex gap-2 justify-center">
            {(["desktop", "mobile"] as const).map((d) => (
              <button key={d} onClick={() => setDeviceView(d)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${deviceView === d ? "border-orange/40 bg-orange/10 text-orange" : "border-white/10 bg-white/5 text-white/50"}`}>
                {d === "desktop" ? <Monitor size={13} /> : <Smartphone size={13} />}
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          <div className={`mx-auto transition-all duration-300 ${deviceView === "desktop" ? "max-w-full" : "max-w-[280px]"}`}>
            {/* Browser chrome */}
            <div className="bg-gray-200 rounded-t-xl px-3 py-2 flex items-center gap-2 border-b border-gray-300">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 flex items-center gap-1.5">
                <Lock size={9} className="text-green-600" />
                <span className="text-gray-500 text-[10px]">bvnofficial.com · {selectedType.label.toLowerCase().replace(" ", "-")}</span>
              </div>
            </div>
            {/* Website mockup */}
            <div className="bg-white rounded-b-xl overflow-hidden shadow-2xl">
              {/* Navbar */}
              <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-orange flex items-center justify-center text-white text-[8px] font-bold">B</div>
                  <span className="text-white text-[10px] font-bold">BVN Official</span>
                </div>
                {deviceView === "desktop" && (
                  <div className="flex gap-3">
                    {pages.slice(0, 4).map((p) => (
                      <span key={p} className="text-gray-400 text-[9px] hover:text-white cursor-pointer">{p}</span>
                    ))}
                  </div>
                )}
                <button className="bg-orange text-white text-[9px] px-2 py-1 rounded-md font-bold">Get Started</button>
              </div>
              {/* Hero area */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-6 text-center">
                <div className="inline-block bg-orange/20 border border-orange/30 text-orange text-[9px] px-2 py-0.5 rounded-full mb-2">🚀 Award-Winning Agency</div>
                <h1 className="text-white font-bold text-sm mb-1">
                  {selectedType.id === "landing" ? "Turn Visitors Into Customers" :
                   selectedType.id === "corporate" ? "Your Trusted Business Partner" :
                   selectedType.id === "ecommerce" ? "Shop the Future, Today" : "Build Smarter, Scale Faster"}
                </h1>
                <p className="text-gray-400 text-[10px] max-w-48 mx-auto">
                  {selectedType.desc}
                </p>
                <div className="flex gap-2 justify-center mt-3">
                  <button className="bg-orange text-white text-[9px] px-3 py-1.5 rounded-lg font-bold">Get Started</button>
                  <button className="border border-gray-600 text-gray-400 text-[9px] px-3 py-1.5 rounded-lg">Learn More</button>
                </div>
              </div>
              {/* Features */}
              <div className="bg-gray-50 px-4 py-3">
                <div className={`grid ${deviceView === "desktop" ? "grid-cols-3" : "grid-cols-1"} gap-2`}>
                  {["Lightning Fast", "Mobile First", "SEO Optimized"].map((f) => (
                    <div key={f} className="bg-white rounded-lg p-2 text-center border border-gray-100">
                      <div className="w-5 h-5 rounded-full bg-orange/10 mx-auto mb-1 flex items-center justify-center">
                        <CheckCircle2 size={10} className="text-orange" />
                      </div>
                      <p className="text-gray-700 text-[9px] font-semibold">{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Site pages */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Pages Included</p>
            <div className="flex flex-wrap gap-2">
              {pages.map((p) => (
                <span key={p} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-[10px]">{p}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lighthouse */}
      {activeTab === "lighthouse" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-orange flex items-center justify-center">
                <Zap size={12} className="text-white" />
              </div>
              <p className="text-gray-700 font-semibold text-sm">Lighthouse Report — {selectedType.label}</p>
              <span className="ml-auto text-gray-400 text-[10px]">Google Lighthouse v12</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Performance", score: scores.performance },
                { label: "Accessibility", score: scores.accessibility },
                { label: "SEO", score: scores.seo },
                { label: "Best Practices", score: scores.bestPractices },
              ].map(({ label, score }) => (
                <div key={label} className="text-center">
                  <div className={`w-14 h-14 rounded-full border-4 ${scoreRing(score)} mx-auto flex items-center justify-center`}>
                    <span className={`font-bold text-lg ${scoreColor(score)}`}>{score}</span>
                  </div>
                  <p className="text-gray-600 text-[10px] mt-1.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
            <h4 className="font-heading font-bold text-white text-sm">Core Web Vitals</h4>
            {[
              { metric: "LCP (Largest Contentful Paint)", val: "0.9s", target: "< 2.5s", pass: true },
              { metric: "FID (First Input Delay)", val: "18ms", target: "< 100ms", pass: true },
              { metric: "CLS (Cumulative Layout Shift)", val: "0.03", target: "< 0.1", pass: true },
              { metric: "TTFB (Time to First Byte)", val: "0.18s", target: "< 0.8s", pass: true },
              { metric: "FCP (First Contentful Paint)", val: "0.7s", target: "< 1.8s", pass: true },
            ].map(({ metric, val, target, pass }) => (
              <div key={metric} className="flex items-center justify-between py-1.5 border-b border-white/5 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-green-400" />
                  <span className="text-white/70">{metric}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 font-bold">{val}</span>
                  <span className="text-white/25">{target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {activeTab === "stack" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {techStack.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.icon}
                </div>
                <div>
                  <p className="text-white/80 text-xs font-bold">{t.name}</p>
                  <p className="text-white/35 text-[10px]">{t.category}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h4 className="font-heading font-bold text-white text-sm mb-3">What You Get</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Mobile-responsive design", "Core Web Vitals optimized",
                "CMS integration", "SSL security hardened",
                "SEO-ready structure", "Analytics setup",
                "99.9% uptime hosting", "Source code ownership",
                "6-month support", "Performance monitoring",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 py-1">
                  <CheckCircle2 size={11} className="text-green-400 shrink-0" />
                  <span className="text-white/60 text-xs">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
