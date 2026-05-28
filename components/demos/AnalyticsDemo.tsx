"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Eye, Globe, Smartphone, Monitor } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const revenueData = [42, 58, 51, 67, 74, 89, 96, 108, 115, 102, 128, 142];
const trafficData = [12, 18, 15, 22, 28, 35, 41, 38, 45, 52, 48, 61];
const conversionData = [1.8, 2.1, 1.9, 2.4, 2.8, 3.1, 3.5, 3.2, 3.8, 3.4, 4.1, 4.4];

const kpis = [
  { label: "Monthly Revenue", value: "$142,800", change: "+11%", up: true, icon: DollarSign, sub: "vs $128.6K last month" },
  { label: "Total Visitors", value: "61,240", change: "+27%", up: true, icon: Users, sub: "48.2K last month" },
  { label: "Conversion Rate", value: "4.4%", change: "+0.3%", up: true, icon: TrendingUp, sub: "Industry avg: 2.8%" },
  { label: "Avg Order Value", value: "$284", change: "-3%", up: false, icon: ShoppingCart, sub: "$293 last month" },
];

const topChannels = [
  { name: "Organic Search", value: 38, sessions: "23,271", color: "bg-blue-400" },
  { name: "Paid Social", value: 27, sessions: "16,535", color: "bg-orange" },
  { name: "Direct", value: 18, sessions: "11,023", color: "bg-green-400" },
  { name: "Email", value: 11, sessions: "6,736", color: "bg-purple-400" },
  { name: "Referral", value: 6, sessions: "3,674", color: "bg-yellow-400" },
];

const topPages = [
  { page: "/marketing", views: 18420, bounce: "38%", time: "3:42" },
  { page: "/pricing", views: 12890, bounce: "29%", time: "4:18" },
  { page: "/operations", views: 9340, bounce: "44%", time: "2:55" },
  { page: "/contact", views: 7820, bounce: "18%", time: "2:12" },
  { page: "/about", views: 5610, bounce: "51%", time: "2:08" },
];

const devices = [
  { name: "Mobile", icon: Smartphone, pct: 54, color: "bg-orange" },
  { name: "Desktop", icon: Monitor, pct: 38, color: "bg-blue-400" },
  { name: "Tablet", icon: Globe, pct: 8, color: "bg-purple-400" },
];

export default function AnalyticsDemo() {
  const [activeMetric, setActiveMetric] = useState<"revenue" | "traffic" | "conversion">("revenue");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "pages" | "audience">("overview");

  const dataMap = { revenue: revenueData, traffic: trafficData, conversion: conversionData };
  const data = dataMap[activeMetric];
  const maxVal = Math.max(...data);

  const labelMap = {
    revenue: (v: number) => `$${v}K`,
    traffic: (v: number) => `${v}K visits`,
    conversion: (v: number) => `${v}% CVR`,
  };

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(({ label, value, change, up, icon: Icon, sub }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3.5 hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <Icon size={14} className="text-orange" />
              <span className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${up ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>
                {up ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {change}
              </span>
            </div>
            <div className="font-heading font-extrabold text-xl text-white leading-tight">{value}</div>
            <div className="text-white/35 text-[10px] mt-0.5">{label}</div>
            <div className="text-white/20 text-[9px] mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["overview", "pages", "audience"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "overview" ? "📈 Performance" : tab === "pages" ? "📄 Top Pages" : "👥 Audience"}
          </button>
        ))}
      </div>

      {/* Performance Chart */}
      {activeTab === "overview" && (
        <>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-bold text-white text-sm">12-Month Performance</h4>
              <div className="flex gap-1">
                {(["revenue", "traffic", "conversion"] as const).map((m) => (
                  <button key={m} onClick={() => setActiveMetric(m)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${activeMetric === m ? "bg-orange text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>
                    {m === "revenue" ? "Revenue" : m === "traffic" ? "Traffic" : "CVR"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-36 mb-1">
              {data.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                  onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                  {hoveredBar === i && (
                    <div className="bg-navy-dark border border-white/20 rounded-lg px-2 py-1 text-[10px] text-white whitespace-nowrap shadow-lg">
                      {months[i]}: {labelMap[activeMetric](val)}
                    </div>
                  )}
                  <div className="w-full rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${(val / maxVal) * 100}%`,
                      background: hoveredBar === i ? "#F5A623" : "#E86010",
                      opacity: hoveredBar !== null && hoveredBar !== i ? 0.35 : 1,
                    }} />
                  <span className="text-white/20 text-[8px]">{months[i][0]}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-white/25 mt-2 border-t border-white/5 pt-2">
              <span>YTD {activeMetric === "revenue" ? "Revenue: $1.07M" : activeMetric === "traffic" ? "Visitors: 414K" : "Avg CVR: 3.1%"}</span>
              <span className="text-green-400">↑ {activeMetric === "revenue" ? "+34%" : activeMetric === "traffic" ? "+127%" : "+1.3pp"} YoY</span>
            </div>
          </div>
          {/* Traffic Sources */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-heading font-bold text-white text-sm mb-3">🔀 Traffic Sources</h4>
            <div className="space-y-2.5">
              {topChannels.map(({ name, value, sessions, color }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-white/60 text-xs w-28 shrink-0">{name}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-white/40 text-[10px] w-12 text-right">{value}%</span>
                  <span className="text-white/25 text-[10px] w-16 text-right">{sessions}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Top Pages */}
      {activeTab === "pages" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h4 className="font-heading font-bold text-white text-sm mb-3">Top Performing Pages</h4>
          <div className="space-y-2">
            <div className="grid grid-cols-4 text-[10px] text-white/25 uppercase tracking-widest px-3 pb-1 font-semibold">
              <span className="col-span-1">Page</span>
              <span className="text-right">Views</span>
              <span className="text-right">Bounce</span>
              <span className="text-right">Avg Time</span>
            </div>
            {topPages.map((p, i) => (
              <div key={i} className="grid grid-cols-4 items-center bg-white/3 border border-white/8 rounded-lg px-3 py-2.5 hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-white/20 text-[10px] font-bold w-4">{i + 1}</span>
                  <span className="text-white/70 text-xs font-medium">{p.page}</span>
                </div>
                <span className="text-right text-orange font-bold text-xs">{p.views.toLocaleString()}</span>
                <span className={`text-right text-xs ${parseFloat(p.bounce) < 35 ? "text-green-400" : parseFloat(p.bounce) < 50 ? "text-yellow-400" : "text-red-400"}`}>
                  {p.bounce}
                </span>
                <span className="text-right text-white/50 text-xs">{p.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audience */}
      {activeTab === "audience" && (
        <div className="space-y-4">
          {/* Devices */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-heading font-bold text-white text-sm mb-3">Device Breakdown</h4>
            <div className="grid grid-cols-3 gap-3">
              {devices.map(({ name, icon: Icon, pct, color }) => (
                <div key={name} className="bg-white/3 border border-white/8 rounded-xl p-4 text-center">
                  <Icon size={20} className="text-white/40 mx-auto mb-2" />
                  <div className="font-heading font-extrabold text-2xl text-white">{pct}%</div>
                  <div className="text-white/40 text-[10px] mt-0.5">{name}</div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                    <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Top Locations */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-heading font-bold text-white text-sm mb-3">🌏 Top Locations</h4>
            {[
              { country: "🇵🇭 Philippines", pct: 48, users: "29,395" },
              { country: "🇺🇸 United States", pct: 22, users: "13,473" },
              { country: "🇬🇧 United Kingdom", pct: 11, users: "6,736" },
              { country: "🇦🇺 Australia", pct: 8, users: "4,899" },
              { country: "🌐 Others", pct: 11, users: "6,737" },
            ].map(({ country, pct, users }) => (
              <div key={country} className="flex items-center gap-3 py-2 border-b border-white/5">
                <span className="text-white/70 text-xs w-36">{country}</span>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div className="h-2 rounded-full bg-orange/60" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-white/40 text-[10px] w-8 text-right">{pct}%</span>
                <span className="text-white/25 text-[10px] w-14 text-right">{users}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
