"use client";
import { useState } from "react";
import { CheckCircle2, Smartphone, Zap, Star } from "lucide-react";

const appTypes = [
  { id: "customer", label: "Customer App", desc: "B2C mobile experience", weeks: "8–12 weeks", icon: "👤" },
  { id: "business", label: "Business Dashboard", desc: "Internal operations app", weeks: "6–10 weeks", icon: "📊" },
  { id: "ecommerce", label: "E-Commerce App", desc: "Mobile shopping experience", weeks: "10–14 weeks", icon: "🛒" },
  { id: "delivery", label: "Delivery / Field App", desc: "GPS-enabled field operations", weeks: "8–12 weeks", icon: "🚚" },
];

type AppType = "customer" | "business" | "ecommerce" | "delivery";

const screenContent: Record<AppType, { screens: string[]; features: string[]; metrics: { label: string; val: string }[] }> = {
  customer: {
    screens: ["Onboarding / Login", "Home Feed", "Product / Service Detail", "Search & Filter", "User Profile", "Notifications", "Settings"],
    features: ["Push notifications", "In-app chat", "Social login (Google/FB)", "Biometric auth", "Offline mode", "Deep linking"],
    metrics: [{ label: "App Store Rating", val: "4.8 ⭐" }, { label: "D7 Retention", val: "68%" }, { label: "DAU", val: "12.4K" }],
  },
  business: {
    screens: ["Login / 2FA", "Main Dashboard", "Reports & Analytics", "Team Management", "Tasks / Workflow", "Settings & Permissions"],
    features: ["Role-based access", "Real-time sync", "Export to PDF/Excel", "Approval workflows", "Audit logs", "API integrations"],
    metrics: [{ label: "Time Saved / Week", val: "14 hrs" }, { label: "Error Reduction", val: "94%" }, { label: "Team Adoption", val: "98%" }],
  },
  ecommerce: {
    screens: ["Home / Featured", "Category Browse", "Product Detail", "Cart & Checkout", "Payment Gateway", "Order Tracking", "Reviews"],
    features: ["One-tap checkout", "Saved payment methods", "Wishlist & favorites", "Product reviews", "Real-time inventory", "Promo codes"],
    metrics: [{ label: "Cart Abandon Rate", val: "-42%" }, { label: "Conversion Rate", val: "5.8%" }, { label: "Avg Order Value", val: "+28%" }],
  },
  delivery: {
    screens: ["Dispatcher Dashboard", "Live Driver Map", "Order Assignment", "Route Optimization", "Proof of Delivery", "Chat", "Reports"],
    features: ["Real-time GPS tracking", "Geofence alerts", "Digital POD (signature)", "Route optimization", "Driver scoring", "Offline capability"],
    metrics: [{ label: "Delivery Speed", val: "+35% faster" }, { label: "Failed Deliveries", val: "-61%" }, { label: "Driver Efficiency", val: "+42%" }],
  },
};

const buildPhases = [
  { phase: "Discovery & Design", duration: "Week 1–2", deliverable: "Wireframes, UI mockups, tech spec" },
  { phase: "Backend Development", duration: "Week 3–5", deliverable: "APIs, database, auth, business logic" },
  { phase: "Frontend / Mobile Dev", duration: "Week 4–8", deliverable: "iOS + Android screens, navigation" },
  { phase: "Integrations & Testing", duration: "Week 8–10", deliverable: "3rd-party APIs, QA, bug fixes" },
  { phase: "Beta & UAT", duration: "Week 10–11", deliverable: "Internal beta, user testing" },
  { phase: "App Store Submission", duration: "Week 12", deliverable: "Published on App Store & Google Play" },
];

export default function AppDevDemo() {
  const [selectedType, setSelectedType] = useState<AppType>("customer");
  const [activeScreen, setActiveScreen] = useState(0);
  const [activeTab, setActiveTab] = useState<"mockup" | "features" | "timeline">("mockup");

  const content = screenContent[selectedType];

  return (
    <div className="space-y-5">
      {/* App type selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {appTypes.map((t) => (
          <button key={t.id} onClick={() => { setSelectedType(t.id as AppType); setActiveScreen(0); }}
            className={`text-left p-3 rounded-xl border transition-all ${selectedType === t.id ? "border-orange/50 bg-orange/8" : "border-white/10 bg-white/3 hover:bg-white/8"}`}>
            <div className="text-xl mb-1.5">{t.icon}</div>
            <p className="text-white/80 text-xs font-bold">{t.label}</p>
            <p className="text-white/35 text-[10px]">{t.weeks}</p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["mockup", "features", "timeline"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "mockup" ? "📱 App Mockup" : tab === "features" ? "✅ Features" : "📅 Build Timeline"}
          </button>
        ))}
      </div>

      {/* Mockup */}
      {activeTab === "mockup" && (
        <div className="flex gap-4 flex-col md:flex-row">
          {/* Phone mockup */}
          <div className="flex justify-center shrink-0">
            <div className="relative">
              {/* Phone frame */}
              <div className="w-52 bg-gray-900 rounded-3xl p-2 shadow-2xl border-2 border-gray-700">
                {/* Status bar */}
                <div className="bg-gray-800 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-1.5">
                    <span className="text-white/60 text-[9px]">9:41</span>
                    <div className="w-16 h-4 bg-gray-900 rounded-full" />
                    <div className="flex gap-1">
                      <div className="w-3 h-1.5 rounded-sm bg-white/60" />
                      <div className="w-1 h-1.5 rounded-sm bg-white/40" />
                    </div>
                  </div>
                  {/* Screen content */}
                  <div className="bg-gray-50 min-h-72 rounded-xl overflow-hidden">
                    {selectedType === "customer" && (
                      <div>
                        <div className="bg-orange px-4 py-3">
                          <p className="text-white text-[10px] font-bold">Good morning! 👋</p>
                          <p className="text-orange-100 text-[8px]">What can we help you with?</p>
                          <div className="bg-white/20 rounded-lg px-2 py-1.5 mt-2 flex items-center gap-1">
                            <span className="text-white/60 text-[9px]">🔍 Search services...</span>
                          </div>
                        </div>
                        <div className="px-3 py-2">
                          <p className="text-gray-500 text-[8px] font-semibold mb-2">FEATURED</p>
                          {["Marketing Package", "SEO Boost", "Social Media Pro"].map((s, i) => (
                            <div key={s} className="bg-white rounded-lg p-2 mb-1.5 flex items-center gap-2 shadow-sm">
                              <div className="w-7 h-7 rounded-lg bg-orange/10 flex items-center justify-center text-[10px]">⭐</div>
                              <div>
                                <p className="text-gray-700 text-[9px] font-semibold">{s}</p>
                                <p className="text-gray-400 text-[8px]">From ₱25,000/mo</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedType === "business" && (
                      <div className="bg-gray-900 h-full p-3">
                        <p className="text-white text-[9px] font-bold mb-2">Dashboard</p>
                        <div className="grid grid-cols-2 gap-1.5 mb-3">
                          {[{ l: "Revenue", v: "$142K", c: "text-green-400" }, { l: "Clients", v: "48", c: "text-blue-400" }, { l: "Tasks", v: "12", c: "text-orange" }, { l: "Tickets", v: "3", c: "text-yellow-400" }].map(({ l, v, c }) => (
                            <div key={l} className="bg-white/5 rounded-lg p-1.5 text-center">
                              <div className={`text-[11px] font-bold ${c}`}>{v}</div>
                              <div className="text-white/30 text-[8px]">{l}</div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-white/40 text-[8px] mb-1">RECENT ACTIVITY</p>
                          {["New client: TechNova", "Invoice #0048 paid", "Task completed ✓"].map((a) => (
                            <div key={a} className="flex items-center gap-1.5 py-0.5">
                              <div className="w-1 h-1 rounded-full bg-orange" />
                              <span className="text-white/50 text-[8px]">{a}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedType === "ecommerce" && (
                      <div>
                        <div className="bg-gray-900 px-3 py-2 flex items-center justify-between">
                          <span className="text-white text-[9px] font-bold">Shop</span>
                          <span className="text-white text-[9px]">🛒 3</span>
                        </div>
                        <div className="px-2 py-1.5 grid grid-cols-2 gap-1.5">
                          {["Marketing Kit", "SEO Bundle", "Social Pack", "Analytics Pro"].map((p) => (
                            <div key={p} className="bg-white rounded-lg shadow-sm overflow-hidden">
                              <div className="h-12 bg-gradient-to-br from-orange/20 to-orange/40 flex items-center justify-center text-lg">📦</div>
                              <div className="p-1.5">
                                <p className="text-gray-700 text-[8px] font-semibold">{p}</p>
                                <p className="text-orange text-[8px] font-bold">₱4,999</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedType === "delivery" && (
                      <div className="bg-gray-900 h-full p-2">
                        <div className="bg-gray-800 rounded-lg p-2 mb-2">
                          <p className="text-white text-[9px] font-bold">📍 Driver Map</p>
                          <div className="bg-gray-700 rounded h-20 mt-1 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-20">
                              {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className="border border-gray-500" />
                              ))}
                            </div>
                            <div className="absolute top-3 left-8 w-3 h-3 rounded-full bg-orange animate-pulse" />
                            <div className="absolute top-8 right-6 w-2 h-2 rounded-full bg-blue-400" />
                            <div className="absolute bottom-3 left-16 w-2 h-2 rounded-full bg-green-400" />
                          </div>
                        </div>
                        {["Order #1042 — Pickup", "Order #1043 — En Route", "Order #1044 — Delivered ✓"].map((o) => (
                          <div key={o} className="bg-white/5 rounded p-1.5 mb-1">
                            <p className="text-white/60 text-[8px]">{o}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Bottom nav */}
                  <div className="bg-white border-t border-gray-100 px-4 py-1.5 flex justify-around">
                    {["🏠", "🔍", "📋", "👤"].map((icon, i) => (
                      <button key={i} className={`p-1.5 ${i === 0 ? "text-orange" : "text-gray-400"} text-sm`}>{icon}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screens list + metrics */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">App Screens</p>
              <div className="space-y-1.5">
                {content.screens.map((screen, i) => (
                  <button key={i} onClick={() => setActiveScreen(i)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all text-xs ${activeScreen === i ? "border-orange/40 bg-orange/8 text-orange" : "border-white/8 bg-white/3 text-white/60 hover:bg-white/8"}`}>
                    <span className="text-[10px] w-4 text-center text-white/25">{i + 1}</span>
                    <Smartphone size={11} className={activeScreen === i ? "text-orange" : "text-white/30"} />
                    {screen}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {content.metrics.map(({ label, val }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                  <div className="font-heading font-bold text-sm text-orange">{val}</div>
                  <div className="text-white/35 text-[9px] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      {activeTab === "features" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h4 className="font-heading font-bold text-white text-sm mb-4">{appTypes.find(t => t.id === selectedType)?.label} — Feature Set</h4>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {content.features.map((f) => (
              <div key={f} className="flex items-center gap-2 py-1.5 border-b border-white/5">
                <CheckCircle2 size={12} className="text-green-400 shrink-0" />
                <span className="text-white/70 text-xs">{f}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "📱", label: "iOS + Android", desc: "Native performance on both platforms" },
              { icon: "☁️", label: "Cloud Backend", desc: "Scalable serverless architecture" },
              { icon: "🔒", label: "Enterprise Security", desc: "JWT auth, encryption, HTTPS" },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-white/70 text-xs font-bold">{label}</div>
                <div className="text-white/30 text-[10px] mt-0.5">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {activeTab === "timeline" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h4 className="font-heading font-bold text-white text-sm mb-4">
            Development Timeline — {appTypes.find(t => t.id === selectedType)?.weeks}
          </h4>
          <div className="relative space-y-3">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
            {buildPhases.map((phase, i) => (
              <div key={i} className="flex items-start gap-4 pl-12 relative">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-orange/20 border border-orange/30 flex items-center justify-center text-orange text-[10px] font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 bg-white/3 border border-white/8 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white/80 text-xs font-bold">{phase.phase}</p>
                    <span className="text-orange text-[10px] font-semibold shrink-0">{phase.duration}</span>
                  </div>
                  <p className="text-white/35 text-[10px] mt-0.5">📦 {phase.deliverable}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
