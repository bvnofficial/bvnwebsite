"use client";
import { useState } from "react";
import { Plus, ArrowRight, DollarSign, User } from "lucide-react";

interface Deal { id: number; name: string; value: number; company: string; stage: string; }

const initialDeals: Deal[] = [
  { id: 1, name: "Sarah Johnson", value: 8500, company: "TechNova Inc.", stage: "Lead" },
  { id: 2, name: "Marcus Wei", value: 22000, company: "Wei Solutions", stage: "Qualified" },
  { id: 3, name: "Elena Preis", value: 45000, company: "Preis GmbH", stage: "Proposal" },
  { id: 4, name: "James Carter", value: 12000, company: "Carter & Co.", stage: "Qualified" },
  { id: 5, name: "Amara Diop", value: 67000, company: "Diop Enterprises", stage: "Negotiation" },
  { id: 6, name: "Yuki Tanaka", value: 19500, company: "Tanaka Corp", stage: "Closed" },
];

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];
const stageColors: Record<string, string> = {
  Lead: "border-blue-400/40 bg-blue-400/5",
  Qualified: "border-orange/40 bg-orange/5",
  Proposal: "border-yellow-400/40 bg-yellow-400/5",
  Negotiation: "border-purple-400/40 bg-purple-400/5",
  Closed: "border-green-400/40 bg-green-400/5",
};
const stageDot: Record<string, string> = {
  Lead: "bg-blue-400", Qualified: "bg-orange", Proposal: "bg-yellow-400", Negotiation: "bg-purple-400", Closed: "bg-green-400",
};

export default function CRMDemo() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");

  function advance(id: number) {
    setDeals(prev => prev.map(d => {
      if (d.id !== id) return d;
      const idx = stages.indexOf(d.stage);
      return { ...d, stage: stages[Math.min(idx + 1, stages.length - 1)] };
    }));
  }

  function addDeal() {
    if (!newName || !newValue) return;
    setDeals(prev => [...prev, { id: Date.now(), name: newName, value: +newValue, company: "New Company", stage: "Lead" }]);
    setNewName(""); setNewValue("");
  }

  const totalPipeline = deals.reduce((s, d) => s + d.value, 0);
  const closedValue = deals.filter(d => d.stage === "Closed").reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Pipeline", val: `$${(totalPipeline / 1000).toFixed(0)}K`, color: "text-white" },
          { label: "Active Deals", val: deals.filter(d => d.stage !== "Closed").length.toString(), color: "text-orange" },
          { label: "Closed Won", val: `$${(closedValue / 1000).toFixed(0)}K`, color: "text-green-400" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`font-heading font-extrabold text-2xl ${color}`}>{val}</div>
            <div className="text-white/40 text-[10px]">{label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="font-heading font-bold text-white text-sm mb-3">📋 Sales Pipeline</h4>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {deals.map((deal) => (
            <div key={deal.id} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${stageColors[deal.stage]} transition-all`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${stageDot[deal.stage]} shrink-0`} />
                <div>
                  <p className="text-white/80 text-xs font-semibold">{deal.name}</p>
                  <p className="text-white/35 text-[10px]">{deal.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange font-bold text-xs">${deal.value.toLocaleString()}</span>
                <span className="text-white/40 text-[10px] w-20">{deal.stage}</span>
                {deal.stage !== "Closed" && (
                  <button onClick={() => advance(deal.id)} className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-orange transition-colors">
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Deal */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="font-heading font-bold text-white text-sm mb-3">➕ Add New Lead</h4>
        <div className="flex gap-2">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Contact name"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-xs placeholder-white/25 focus:outline-none focus:border-orange/40" />
          <input value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Deal value $" type="number"
            className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-xs focus:outline-none focus:border-orange/40" />
          <button onClick={addDeal} disabled={!newName || !newValue}
            className="px-3 py-2 bg-orange text-white text-xs font-bold rounded-lg disabled:opacity-40 hover:bg-orange-light transition-colors flex items-center gap-1">
            <Plus size={12} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
