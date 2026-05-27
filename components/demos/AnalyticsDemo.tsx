"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Eye } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const revenueData = [42, 58, 51, 67, 74, 89, 96, 108, 115, 102, 128, 142];
const trafficData = [12, 18, 15, 22, 28, 35, 41, 38, 45, 52, 48, 61];

const kpis = [
  { label: "Monthly Revenue", value: "$142,800", change: "+11%", up: true, icon: DollarSign },
  { label: "Total Visitors", value: "61,240", change: "+27%", up: true, icon: Users },
  { label: "Conversion Rate", value: "3.8%", change: "+0.4%", up: true, icon: TrendingUp },
  { label: "Avg Order Value", value: "$284", change: "-3%", up: false, icon: ShoppingCart },
];

export default function AnalyticsDemo() {
  const [activeMetric, setActiveMetric] = useState<"revenue" | "traffic">("revenue");
  const data = activeMetric === "revenue" ? revenueData : trafficData;
  const maxVal = Math.max(...data);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const topChannels = [
    { name: "Organic Search", value: 38, color: "bg-blue-400" },
    { name: "Paid Social", value: 27, color: "bg-orange" },
    { name: "Direct", value: 18, color: "bg-green-400" },
    { name: "Email", value: 11, color: "bg-purple-400" },
    { name: "Referral", value: 6, color: "bg-yellow-400" },
  ];

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(({ label, value, change, up, icon: Icon }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <Icon size={14} className="text-orange" />
              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${up ? "text-green-400" : "text-red-400"}`}>
                {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {change}
              </span>
            </div>
            <div className="font-heading font-extrabold text-lg text-white">{value}</div>
            <div className="text-white/35 text-[10px]">{label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-heading font-bold text-white text-sm">📈 12-Month Performance</h4>
          <div className="flex gap-1">
            {(["revenue", "traffic"] as const).map(m => (
              <button key={m} onClick={() => setActiveMetric(m)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${activeMetric === m ? "bg-orange text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>
                {m === "revenue" ? "Revenue ($K)" : "Traffic (K)"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-36">
          {data.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
              {hoveredBar === i && (
                <div className="bg-navy-dark border border-white/20 rounded px-1.5 py-0.5 text-[10px] text-white whitespace-nowrap">
                  {activeMetric === "revenue" ? `$${val}K` : `${val}K visitors`}
                </div>
              )}
              <div className="w-full rounded-t-sm transition-all duration-200"
                style={{ height: `${(val / maxVal) * 100}%`, background: hoveredBar === i ? "#F5A623" : "#E86010", opacity: hoveredBar !== null && hoveredBar !== i ? 0.4 : 1 }} />
              <span className="text-white/25 text-[9px]">{months[i].slice(0, 1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="font-heading font-bold text-white text-sm mb-3">🔀 Traffic Sources</h4>
        <div className="space-y-2.5">
          {topChannels.map(({ name, value, color }) => (
            <div key={name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/70">{name}</span>
                <span className="text-white/50 font-semibold">{value}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
