"use client";
import { useState } from "react";
import { CheckCircle2, Zap, RefreshCw, AlertCircle, Plus } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  category: string;
  icon: string;
  connected: boolean;
  lastSync: string;
  records: string;
  color: string;
}

const availableIntegrations: Integration[] = [
  { id: "hubspot", name: "HubSpot CRM", category: "CRM", icon: "🟠", connected: true, lastSync: "2 min ago", records: "4,820 contacts", color: "bg-orange-500" },
  { id: "quickbooks", name: "QuickBooks", category: "Accounting", icon: "💚", connected: true, lastSync: "5 min ago", records: "1,240 invoices", color: "bg-green-600" },
  { id: "slack", name: "Slack", category: "Communication", icon: "💬", connected: true, lastSync: "Real-time", records: "Notifications active", color: "bg-purple-600" },
  { id: "shopify", name: "Shopify", category: "E-Commerce", icon: "🛍", connected: false, lastSync: "—", records: "—", color: "bg-green-500" },
  { id: "stripe", name: "Stripe", category: "Payments", icon: "💳", connected: true, lastSync: "1 min ago", records: "$142K processed", color: "bg-purple-700" },
  { id: "mailchimp", name: "Mailchimp", category: "Email", icon: "🐵", connected: true, lastSync: "10 min ago", records: "18,400 subscribers", color: "bg-yellow-600" },
  { id: "google", name: "Google Analytics", category: "Analytics", icon: "📊", connected: true, lastSync: "15 min ago", records: "61K visitors/mo", color: "bg-blue-500" },
  { id: "zoom", name: "Zoom", category: "Meetings", icon: "📹", connected: false, lastSync: "—", records: "—", color: "bg-blue-600" },
  { id: "xero", name: "Xero", category: "Accounting", icon: "🔵", connected: false, lastSync: "—", records: "—", color: "bg-blue-700" },
  { id: "trello", name: "Trello", category: "Project Mgmt", icon: "📋", connected: false, lastSync: "—", records: "—", color: "bg-blue-400" },
  { id: "whatsapp", name: "WhatsApp Business", category: "Messaging", icon: "📱", connected: true, lastSync: "Real-time", records: "Messages active", color: "bg-green-500" },
  { id: "facebook", name: "Facebook Ads", category: "Advertising", icon: "📘", connected: true, lastSync: "30 min ago", records: "$3,200 spend tracked", color: "bg-blue-600" },
];

const dataFlows = [
  { from: "HubSpot CRM", to: "QuickBooks", type: "Deals → Invoices", frequency: "Real-time", records: "48 today", icon: "→" },
  { from: "Shopify", to: "HubSpot CRM", type: "Orders → Contacts", frequency: "On new order", records: "—", icon: "→" },
  { from: "Stripe", to: "QuickBooks", type: "Payments → Ledger", frequency: "Real-time", records: "12 today", icon: "→" },
  { from: "Mailchimp", to: "HubSpot CRM", type: "Subscribers → Leads", frequency: "Every 15 min", records: "3 today", icon: "→" },
  { from: "Google Analytics", to: "Custom Dashboard", type: "Traffic → Reports", frequency: "Hourly", records: "Continuous", icon: "→" },
];

const categories = ["All", "CRM", "Accounting", "E-Commerce", "Payments", "Email", "Analytics", "Communication", "Meetings", "Advertising", "Messaging", "Project Mgmt"];

export default function IntegrationsDemo() {
  const [integrations, setIntegrations] = useState(availableIntegrations);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"catalog" | "flows" | "status">("catalog");
  const [syncing, setSyncing] = useState<string | null>(null);

  const filtered = integrations.filter((i) => selectedCategory === "All" || i.category === selectedCategory);
  const connectedCount = integrations.filter((i) => i.connected).length;

  function toggleConnect(id: string) {
    setIntegrations((prev) => prev.map((i) => i.id === id ? { ...i, connected: !i.connected, lastSync: !i.connected ? "Just now" : "—", records: !i.connected ? "Connected" : "—" } : i));
  }

  function syncAll() {
    setSyncing("all");
    setTimeout(() => setSyncing(null), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Connected Apps", val: connectedCount.toString(), color: "text-green-400" },
          { label: "Data Points / Day", val: "12,840", color: "text-blue-400" },
          { label: "Sync Frequency", val: "Real-time", color: "text-orange" },
          { label: "Manual Entry", val: "0 hrs", color: "text-white" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`font-heading font-extrabold text-xl ${color}`}>{val}</div>
            <div className="text-white/35 text-[10px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["catalog", "flows", "status"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "catalog" ? "🔌 App Catalog" : tab === "flows" ? "🔄 Data Flows" : "📡 Sync Status"}
          </button>
        ))}
      </div>

      {/* App Catalog */}
      {activeTab === "catalog" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 8).map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${selectedCategory === cat ? "bg-orange/20 border-orange/30 text-orange" : "bg-white/5 border-white/10 text-white/45 hover:bg-white/10"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map((intg) => (
              <div key={intg.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${intg.connected ? "border-green-400/20 bg-green-400/3" : "border-white/10 bg-white/3"}`}>
                <div className={`w-9 h-9 rounded-xl ${intg.color} flex items-center justify-center text-lg shrink-0`}>
                  {intg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-bold truncate">{intg.name}</p>
                  <p className="text-white/30 text-[9px]">{intg.category}</p>
                  {intg.connected && (
                    <p className="text-green-400/70 text-[9px] mt-0.5">{intg.records}</p>
                  )}
                </div>
                <button onClick={() => toggleConnect(intg.id)}
                  className={`shrink-0 text-[9px] font-bold px-2 py-1 rounded-lg border transition-all ${intg.connected ? "bg-red-400/10 border-red-400/20 text-red-400 hover:bg-red-400/20" : "bg-orange/10 border-orange/20 text-orange hover:bg-orange/20"}`}>
                  {intg.connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Flows */}
      {activeTab === "flows" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-heading font-bold text-white text-sm">Automated Data Flows</h4>
            <button onClick={syncAll} disabled={!!syncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-400/20 transition-colors disabled:opacity-60">
              <RefreshCw size={11} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : "Sync All"}
            </button>
          </div>
          {dataFlows.map((flow, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 bg-white/3 border border-white/8 rounded-xl">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white/70 text-xs font-semibold">{flow.from}</span>
                  <Zap size={11} className="text-orange shrink-0" />
                  <span className="text-white/70 text-xs font-semibold">{flow.to}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/40 text-[10px]">{flow.type}</span>
                  <span className="text-white/20 text-[10px]">·</span>
                  <span className="text-white/30 text-[10px]">{flow.frequency}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${flow.records !== "—" ? "bg-green-400 animate-pulse" : "bg-white/20"}`} />
                <span className="text-white/30 text-[9px]">{flow.records}</span>
              </div>
            </div>
          ))}
          <button className="w-full py-2.5 border border-dashed border-white/15 rounded-xl text-white/30 text-xs hover:border-orange/30 hover:text-orange transition-colors flex items-center justify-center gap-1.5">
            <Plus size={12} /> Add New Data Flow
          </button>
        </div>
      )}

      {/* Sync Status */}
      {activeTab === "status" && (
        <div className="space-y-3">
          {integrations.filter((i) => i.connected).map((intg) => (
            <div key={intg.id} className="flex items-center gap-3 p-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
              <div className={`w-8 h-8 rounded-xl ${intg.color} flex items-center justify-center text-sm shrink-0`}>
                {intg.icon}
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-xs font-semibold">{intg.name}</p>
                <p className="text-white/35 text-[10px]">{intg.records} · Last sync: {intg.lastSync}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-[10px] font-semibold">Live</span>
              </div>
            </div>
          ))}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-heading font-bold text-white text-sm mb-3">Integration Health</h4>
            {[
              { label: "API Uptime", val: "99.98%", pass: true },
              { label: "Sync Errors (last 30 days)", val: "0", pass: true },
              { label: "Data Latency", val: "< 2s", pass: true },
              { label: "Records Synced Today", val: "12,840", pass: true },
            ].map(({ label, val, pass }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-green-400" />
                  <span className="text-white/60">{label}</span>
                </div>
                <span className="text-green-400 font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
