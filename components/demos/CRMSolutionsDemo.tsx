"use client";
import { useState } from "react";
import { CheckCircle2, ArrowRight, Zap, Users, BarChart2, Settings } from "lucide-react";

const platforms = [
  { id: "hubspot", name: "HubSpot", logo: "🟠", tier: "Recommended", pros: ["Free tier available", "Marketing + Sales + CRM", "Easy to use", "Great automation"], bestFor: "Growing SMEs" },
  { id: "salesforce", name: "Salesforce", logo: "☁️", tier: "Enterprise", pros: ["Most powerful CRM", "Highly customizable", "Deep integrations", "AI-powered insights"], bestFor: "Large enterprises" },
  { id: "zoho", name: "Zoho CRM", logo: "🔵", tier: "Budget-Friendly", pros: ["Affordable pricing", "Full feature set", "Excellent support", "Mobile app"], bestFor: "SMEs on a budget" },
  { id: "pipedrive", name: "Pipedrive", logo: "🟢", tier: "Sales-Focused", pros: ["Sales pipeline focus", "Visual deal tracking", "Email integration", "Simple UI"], bestFor: "Sales-heavy teams" },
];

const migrationSteps = [
  { step: "Data Audit", desc: "Review and clean existing contacts, deals, and records", duration: "Day 1–2", status: "done" as const },
  { step: "Field Mapping", desc: "Map old data fields to new CRM structure", duration: "Day 3–4", status: "done" as const },
  { step: "Test Migration", desc: "Migrate 5% of data to verify accuracy", duration: "Day 5", status: "active" as const },
  { step: "Full Migration", desc: "Migrate all contacts, deals, history, and notes", duration: "Day 6–7", status: "pending" as const },
  { step: "Validation", desc: "Verify data integrity and completeness", duration: "Day 8", status: "pending" as const },
  { step: "Go Live", desc: "Switch teams over to the new CRM", duration: "Day 9–10", status: "pending" as const },
];

const pipelineConfig = [
  { stage: "Lead In", trigger: "Form submission / import", action: "Auto-assign to rep, send intro email" },
  { stage: "Qualified", trigger: "Rep marks as qualified", action: "Create deal, schedule follow-up" },
  { stage: "Proposal Sent", trigger: "Proposal email sent", action: "Start 3-day follow-up sequence" },
  { stage: "Negotiation", trigger: "Client responds", action: "Alert manager, pause automation" },
  { stage: "Closed Won", trigger: "Deal marked won", action: "Trigger onboarding workflow, send contract" },
  { stage: "Closed Lost", trigger: "Deal marked lost", action: "Move to re-engagement drip (90 days)" },
];

export default function CRMSolutionsDemo() {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);
  const [activeTab, setActiveTab] = useState<"platform" | "migration" | "pipeline">("platform");

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["platform", "migration", "pipeline"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "platform" ? "🏆 Platform Selector" : tab === "migration" ? "📦 Data Migration" : "🔄 Pipeline Setup"}
          </button>
        ))}
      </div>

      {/* Platform Selector */}
      {activeTab === "platform" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {platforms.map((p) => (
              <button key={p.id} onClick={() => setSelectedPlatform(p)}
                className={`text-left p-3 rounded-xl border transition-all ${selectedPlatform.id === p.id ? "border-orange/50 bg-orange/8" : "border-white/10 bg-white/3 hover:bg-white/8"}`}>
                <div className="text-2xl mb-1.5">{p.logo}</div>
                <p className="text-white/80 text-xs font-bold">{p.name}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${p.tier === "Recommended" ? "bg-green-400/10 text-green-400" : p.tier === "Enterprise" ? "bg-blue-400/10 text-blue-400" : "bg-white/10 text-white/50"}`}>
                  {p.tier}
                </span>
              </button>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{selectedPlatform.logo}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-heading font-bold text-white">{selectedPlatform.name}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${selectedPlatform.tier === "Recommended" ? "bg-green-400/10 text-green-400 border border-green-400/20" : "bg-white/10 text-white/50 border border-white/20"}`}>
                    {selectedPlatform.tier}
                  </span>
                </div>
                <p className="text-white/40 text-xs mb-3">Best for: {selectedPlatform.bestFor}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedPlatform.pros.map((pro) => (
                    <div key={pro} className="flex items-center gap-1.5">
                      <CheckCircle2 size={11} className="text-green-400 shrink-0" />
                      <span className="text-white/60 text-xs">{pro}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Comparison */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-heading font-bold text-white text-sm mb-3">Platform Comparison</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[400px]">
                <thead>
                  <tr>
                    <td className="text-white/30 pb-2 text-[10px]">Feature</td>
                    {platforms.map((p) => (
                      <th key={p.id} className={`text-center pb-2 text-[10px] font-bold ${selectedPlatform.id === p.id ? "text-orange" : "text-white/40"}`}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Free Plan", vals: [true, false, true, true] },
                    { feature: "Marketing Hub", vals: [true, true, false, false] },
                    { feature: "AI Features", vals: [true, true, false, false] },
                    { feature: "Email Sequences", vals: [true, true, true, true] },
                    { feature: "Mobile App", vals: [true, true, true, true] },
                    { feature: "Custom Reports", vals: [true, true, true, false] },
                  ].map(({ feature, vals }) => (
                    <tr key={feature} className="border-t border-white/5">
                      <td className="py-2 text-white/60">{feature}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="text-center py-2">
                          {v ? <CheckCircle2 size={12} className="text-green-400 mx-auto" /> : <span className="text-white/20 text-sm">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Data Migration */}
      {activeTab === "migration" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-bold text-white text-sm">Data Migration Pipeline</h4>
              <span className="text-orange text-xs font-bold">Step 3 of 6 — In Progress</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 mb-5">
              <div className="h-2.5 rounded-full bg-orange" style={{ width: "42%" }} />
            </div>
            <div className="space-y-2">
              {migrationSteps.map((step, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${step.status === "done" ? "border-green-400/20 bg-green-400/3" : step.status === "active" ? "border-orange/30 bg-orange/5" : "border-white/8 bg-white/2"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${step.status === "done" ? "bg-green-400/20" : step.status === "active" ? "bg-orange/20 animate-pulse" : "bg-white/5"}`}>
                    {step.status === "done" ? <CheckCircle2 size={13} className="text-green-400" /> :
                     step.status === "active" ? <Zap size={12} className="text-orange" /> :
                     <span className="text-white/25 text-[10px]">{i + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold ${step.status === "done" ? "text-green-400" : step.status === "active" ? "text-white" : "text-white/40"}`}>
                        {step.step}
                      </p>
                      <span className="text-white/25 text-[10px]">{step.duration}</span>
                    </div>
                    <p className="text-white/30 text-[10px] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Records to Migrate", val: "24,840" },
              { label: "Migration Accuracy", val: "99.8%" },
              { label: "Est. Downtime", val: "0 hrs" },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="font-heading font-bold text-xl text-white">{val}</div>
                <div className="text-white/35 text-[10px]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline Setup */}
      {activeTab === "pipeline" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <h4 className="font-heading font-bold text-white text-sm">Automated Sales Pipeline Configuration</h4>
          <p className="text-white/40 text-xs">Each stage triggers automatic actions — no manual follow-up needed.</p>
          <div className="space-y-2">
            {pipelineConfig.map((stage, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 bg-white/3 border border-white/8 rounded-xl hover:border-orange/20 hover:bg-orange/3 transition-all">
                <div className="w-7 h-7 rounded-full bg-orange/15 border border-orange/25 flex items-center justify-center text-orange text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-white/80 text-xs font-bold">{stage.stage}</p>
                    <span className="text-white/30 text-[10px]">Trigger: {stage.trigger}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Zap size={10} className="text-orange shrink-0" />
                    <span className="text-orange/70 text-[10px]">{stage.action}</span>
                  </div>
                </div>
                {i < pipelineConfig.length - 1 && <ArrowRight size={12} className="text-white/15 shrink-0 mt-2" />}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { label: "Lead Response", before: "48 hrs", after: "4 min" },
              { label: "Follow-up Rate", before: "42%", after: "100%" },
              { label: "Close Rate", before: "18%", after: "34%" },
            ].map(({ label, before, after }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-red-400/60 text-xs line-through">{before}</span>
                  <ArrowRight size={10} className="text-white/20" />
                  <span className="text-green-400 text-xs font-bold">{after}</span>
                </div>
                <div className="text-white/35 text-[10px] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
