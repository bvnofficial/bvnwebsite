"use client";
import { useState } from "react";
import { Plus, ChevronRight, Phone, Mail, Calendar, X, DollarSign } from "lucide-react";

interface Deal {
  id: number;
  name: string;
  value: number;
  company: string;
  stage: string;
  initials: string;
  color: string;
  lastContact: string;
  probability: number;
}

const initialDeals: Deal[] = [
  { id: 1, name: "Sarah Johnson", value: 8500, company: "TechNova Inc.", stage: "Lead", initials: "SJ", color: "bg-pink-500", lastContact: "Today", probability: 15 },
  { id: 2, name: "Marcus Wei", value: 22000, company: "Wei Solutions", stage: "Qualified", initials: "MW", color: "bg-blue-500", lastContact: "Yesterday", probability: 35 },
  { id: 3, name: "Elena Preis", value: 45000, company: "Preis GmbH", stage: "Proposal", initials: "EP", color: "bg-purple-500", lastContact: "2d ago", probability: 60 },
  { id: 4, name: "James Carter", value: 12000, company: "Carter & Co.", stage: "Qualified", initials: "JC", color: "bg-orange", lastContact: "3d ago", probability: 40 },
  { id: 5, name: "Amara Diop", value: 67000, company: "Diop Enterprises", stage: "Negotiation", initials: "AD", color: "bg-yellow-500", lastContact: "Today", probability: 80 },
  { id: 6, name: "Yuki Tanaka", value: 19500, company: "Tanaka Corp", stage: "Closed", initials: "YT", color: "bg-green-500", lastContact: "1w ago", probability: 100 },
  { id: 7, name: "Carlos Reyes", value: 31000, company: "Reyes Group", stage: "Proposal", initials: "CR", color: "bg-teal-500", lastContact: "Today", probability: 55 },
  { id: 8, name: "Nina Hoffman", value: 9800, company: "Hoffman Media", stage: "Lead", initials: "NH", color: "bg-red-500", lastContact: "4d ago", probability: 20 },
];

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];
const stageColors: Record<string, { pill: string; header: string; dot: string }> = {
  Lead:        { pill: "bg-blue-400/10 border-blue-400/20 text-blue-300",   header: "text-blue-400",   dot: "bg-blue-400" },
  Qualified:   { pill: "bg-orange/10 border-orange/20 text-orange",          header: "text-orange",     dot: "bg-orange" },
  Proposal:    { pill: "bg-yellow-400/10 border-yellow-400/20 text-yellow-300", header: "text-yellow-400", dot: "bg-yellow-400" },
  Negotiation: { pill: "bg-purple-400/10 border-purple-400/20 text-purple-300", header: "text-purple-400", dot: "bg-purple-400" },
  Closed:      { pill: "bg-green-400/10 border-green-400/20 text-green-300", header: "text-green-400", dot: "bg-green-400" },
};

export default function CRMDemo() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [view, setView] = useState<"kanban" | "pipeline">("kanban");

  function advance(id: number) {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const idx = stages.indexOf(d.stage);
        const nextStage = stages[Math.min(idx + 1, stages.length - 1)];
        return { ...d, stage: nextStage, probability: Math.min(100, d.probability + 20) };
      })
    );
  }

  function addDeal() {
    if (!newName || !newValue) return;
    const colors = ["bg-pink-500", "bg-blue-500", "bg-teal-500", "bg-red-400", "bg-indigo-500"];
    const initials = newName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    setDeals((prev) => [...prev, {
      id: Date.now(), name: newName, value: +newValue,
      company: newCompany || "New Company", stage: "Lead",
      initials, color: colors[Math.floor(Math.random() * colors.length)],
      lastContact: "Just now", probability: 15,
    }]);
    setNewName(""); setNewValue(""); setNewCompany("");
  }

  function removeDeal(id: number) {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    setSelectedDeal(null);
  }

  const totalPipeline = deals.reduce((s, d) => s + d.value, 0);
  const closedValue = deals.filter((d) => d.stage === "Closed").reduce((s, d) => s + d.value, 0);
  const weightedPipeline = deals.reduce((s, d) => s + d.value * (d.probability / 100), 0);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Pipeline", val: `$${(totalPipeline / 1000).toFixed(0)}K`, color: "text-white" },
          { label: "Weighted Pipeline", val: `$${(weightedPipeline / 1000).toFixed(0)}K`, color: "text-orange" },
          { label: "Closed Won", val: `$${(closedValue / 1000).toFixed(0)}K`, color: "text-green-400" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`font-heading font-extrabold text-2xl ${color}`}>{val}</div>
            <div className="text-white/40 text-[10px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["kanban", "pipeline"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${view === v ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {v === "kanban" ? "🗂 Kanban Board" : "📋 List Pipeline"}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      {view === "kanban" && (
        <div className="overflow-x-auto">
          <div className="flex gap-3 min-w-[800px]">
            {stages.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage);
              const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
              const c = stageColors[stage];
              return (
                <div key={stage} className="flex-1 min-w-[150px]">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                      <span className={`text-xs font-bold ${c.header}`}>{stage}</span>
                    </div>
                    <span className="text-white/30 text-[10px]">{stageDeals.length}</span>
                  </div>
                  <div className="bg-white/3 border border-white/8 rounded-xl p-2 min-h-[180px] space-y-2">
                    {stageDeals.map((deal) => (
                      <div key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        className="bg-navy-dark border border-white/10 rounded-lg p-2.5 cursor-pointer hover:border-white/20 hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-6 h-6 rounded-full ${deal.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                            {deal.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white/80 text-[11px] font-semibold truncate">{deal.name}</p>
                            <p className="text-white/30 text-[9px] truncate">{deal.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-orange font-bold text-[11px]">${deal.value.toLocaleString()}</span>
                          <span className="text-white/30 text-[9px]">{deal.probability}%</span>
                        </div>
                        {stage !== "Closed" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); advance(deal.id); }}
                            className="mt-2 w-full py-1 bg-white/5 hover:bg-orange/10 border border-white/10 hover:border-orange/30 rounded text-white/40 hover:text-orange text-[9px] font-semibold transition-all flex items-center justify-center gap-1">
                            Advance <ChevronRight size={9} />
                          </button>
                        )}
                      </div>
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="h-16 flex items-center justify-center">
                        <span className="text-white/15 text-[10px]">Drop deals here</span>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-white/25 text-[10px] mt-1">${(stageValue / 1000).toFixed(0)}K</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List Pipeline */}
      {view === "pipeline" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
          {deals.map((deal) => (
            <div key={deal.id} onClick={() => setSelectedDeal(deal)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-white/8 bg-white/3 hover:bg-white/8 cursor-pointer transition-all">
              <div className={`w-8 h-8 rounded-full ${deal.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                {deal.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-xs font-semibold">{deal.name}</p>
                <p className="text-white/35 text-[10px]">{deal.company} · {deal.lastContact}</p>
              </div>
              <span className="text-orange font-bold text-xs">${deal.value.toLocaleString()}</span>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${stageColors[deal.stage].pill}`}>
                {deal.stage}
              </span>
              <span className="text-white/30 text-[10px] w-8 text-right">{deal.probability}%</span>
              {deal.stage !== "Closed" && (
                <button onClick={(e) => { e.stopPropagation(); advance(deal.id); }}
                  className="p-1 hover:bg-white/10 rounded text-white/30 hover:text-orange transition-colors">
                  <ChevronRight size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Deal Detail Overlay */}
      {selectedDeal && (
        <div className="bg-white/5 border border-orange/20 rounded-xl p-5 relative">
          <button onClick={() => setSelectedDeal(null)}
            className="absolute top-3 right-3 p-1 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={14} />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full ${selectedDeal.color} flex items-center justify-center text-white font-bold text-sm`}>
              {selectedDeal.initials}
            </div>
            <div>
              <h4 className="text-white font-heading font-bold">{selectedDeal.name}</h4>
              <p className="text-white/50 text-xs">{selectedDeal.company}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-orange font-heading font-extrabold text-xl">${selectedDeal.value.toLocaleString()}</p>
              <p className="text-white/40 text-xs">{selectedDeal.probability}% probability</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { icon: Phone, label: "Call", action: "Log Call" },
              { icon: Mail, label: "Email", action: "Send Email" },
              { icon: Calendar, label: "Meeting", action: "Schedule" },
            ].map(({ icon: Icon, label, action }) => (
              <button key={label}
                className="flex flex-col items-center gap-1 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-orange/10 hover:border-orange/30 transition-all text-white/60 hover:text-orange">
                <Icon size={14} />
                <span className="text-[10px] font-semibold">{action}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {selectedDeal.stage !== "Closed" && (
              <button onClick={() => { advance(selectedDeal.id); setSelectedDeal(null); }}
                className="flex-1 py-2 bg-orange text-white text-xs font-bold rounded-lg hover:bg-orange-light transition-colors flex items-center justify-center gap-1">
                <ChevronRight size={13} /> Move to Next Stage
              </button>
            )}
            <button onClick={() => removeDeal(selectedDeal.id)}
              className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/20 transition-colors">
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Add Deal */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="font-heading font-bold text-white text-sm mb-3">➕ Add New Lead</h4>
        <div className="flex gap-2 flex-wrap">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Contact name"
            className="flex-1 min-w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-xs placeholder-white/25 focus:outline-none focus:border-orange/40" />
          <input value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="Company"
            className="flex-1 min-w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-xs placeholder-white/25 focus:outline-none focus:border-orange/40" />
          <input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Deal $" type="number"
            className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-xs focus:outline-none focus:border-orange/40" />
          <button onClick={addDeal} disabled={!newName || !newValue}
            className="px-4 py-2 bg-orange text-white text-xs font-bold rounded-lg disabled:opacity-40 hover:bg-orange-light transition-colors flex items-center gap-1">
            <Plus size={12} /> Add Lead
          </button>
        </div>
      </div>
    </div>
  );
}
