"use client";
import { useState } from "react";
import { FileText, CheckCircle2, Zap, Download, Clock, Mail } from "lucide-react";

const docTypes = [
  { id: "invoice", label: "Invoice", icon: "💵", fields: ["Client Name", "Invoice #", "Due Date", "Service Description", "Amount"] },
  { id: "contract", label: "Service Contract", icon: "📝", fields: ["Client Name", "Service Type", "Start Date", "Monthly Fee", "Duration"] },
  { id: "proposal", label: "Proposal", icon: "📋", fields: ["Client Name", "Company", "Services", "Budget Range", "Project Timeline"] },
  { id: "report", label: "Monthly Report", icon: "📊", fields: ["Month", "Client Name", "Key Metrics", "Highlights", "Next Steps"] },
];

const automationRules = [
  { trigger: "New client signs up", action: "Generate welcome email + onboarding checklist", status: "active", runs: 248 },
  { trigger: "Invoice overdue by 7 days", action: "Send payment reminder email", status: "active", runs: 89 },
  { trigger: "Project milestone reached", action: "Generate milestone report PDF", status: "active", runs: 124 },
  { trigger: "Contract expiry in 30 days", action: "Send renewal reminder to client", status: "active", runs: 31 },
  { trigger: "New lead form submitted", action: "Create CRM record + assign to rep", status: "active", runs: 562 },
  { trigger: "Support ticket resolved", action: "Send satisfaction survey", status: "paused", runs: 203 },
];

const timeSavings = [
  { task: "Invoice generation", manual: "45 min/invoice", auto: "< 30 sec", saving: "99%" },
  { task: "Contract drafting", manual: "2 hrs/contract", auto: "2 minutes", saving: "98%" },
  { task: "Email follow-ups", manual: "3 hrs/week", auto: "Fully automated", saving: "100%" },
  { task: "Report compilation", manual: "4 hrs/report", auto: "5 minutes", saving: "98%" },
  { task: "Data entry", manual: "15 hrs/week", auto: "0 hrs/week", saving: "100%" },
];

export default function AdminAutomationDemo() {
  const [selectedDoc, setSelectedDoc] = useState(docTypes[0]);
  const [formData, setFormData] = useState<Record<string, string>>({
    "Client Name": "TechNova Inc.",
    "Invoice #": "INV-0048",
    "Due Date": "Jun 30, 2025",
    "Service Description": "Social Media Management + SEO — May 2025",
    "Amount": "₱45,000.00",
  });
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"generator" | "automation" | "savings">("generator");

  function generate() {
    setGenerating(true);
    setTimeout(() => { setGenerated(true); setGenerating(false); }, 1500);
  }

  function switchDoc(doc: typeof docTypes[0]) {
    setSelectedDoc(doc);
    setGenerated(false);
    const defaults: Record<string, Record<string, string>> = {
      invoice: { "Client Name": "TechNova Inc.", "Invoice #": "INV-0048", "Due Date": "Jun 30, 2025", "Service Description": "Social Media Management — May 2025", "Amount": "₱45,000.00" },
      contract: { "Client Name": "TechNova Inc.", "Service Type": "Marketing Automation", "Start Date": "Jul 1, 2025", "Monthly Fee": "₱45,000.00", "Duration": "12 months" },
      proposal: { "Client Name": "Wei Solutions", "Company": "Wei Solutions Corp.", "Services": "SEO + Content Marketing", "Budget Range": "₱40,000 – ₱60,000/mo", "Project Timeline": "6 months" },
      report: { "Month": "May 2025", "Client Name": "TechNova Inc.", "Key Metrics": "Organic traffic +142%, Leads +67", "Highlights": "Ranked #3 for target keyword", "Next Steps": "Expand to Q3 campaign" },
    };
    setFormData(defaults[doc.id] || {});
  }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["generator", "automation", "savings"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "generator" ? "📄 Doc Generator" : tab === "automation" ? "⚡ Auto Rules" : "⏱ Time Savings"}
          </button>
        ))}
      </div>

      {/* Document Generator */}
      {activeTab === "generator" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {docTypes.map((doc) => (
                <button key={doc.id} onClick={() => switchDoc(doc)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all ${selectedDoc.id === doc.id ? "border-orange/50 bg-orange/8" : "border-white/10 bg-white/3 hover:bg-white/8"}`}>
                  <span>{doc.icon}</span>
                  <span className="text-white/70 font-semibold">{doc.label}</span>
                </button>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <h4 className="font-heading font-bold text-white text-sm">{selectedDoc.icon} {selectedDoc.label} Details</h4>
              {selectedDoc.fields.map((field) => (
                <div key={field}>
                  <label className="text-white/40 text-[10px] uppercase tracking-widest">{field}</label>
                  <input
                    value={formData[field] || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, [field]: e.target.value }))}
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-xs focus:outline-none focus:border-orange/40" />
                </div>
              ))}
              <button onClick={generate} disabled={generating}
                className="w-full py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-orange-light transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                {generating ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Generating...</>
                  : <><Zap size={14} /> Generate {selectedDoc.label}</>}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-heading font-bold text-white text-sm mb-3">📄 Document Preview</h4>
            {!generated ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FileText size={40} className="text-white/10 mb-3" />
                <p className="text-white/30 text-xs">Fill in the fields and click Generate to preview your document</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                {/* Doc header */}
                <div className="bg-orange px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-xs">BVN Official</p>
                    <p className="text-orange-100 text-[9px]">bvnofficial.com · hello@bvnofficial.com</p>
                  </div>
                  <div className="text-white font-bold text-lg">{selectedDoc.icon}</div>
                </div>
                {/* Doc body */}
                <div className="px-5 py-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-[9px] uppercase tracking-widest">To</p>
                      <p className="text-gray-800 font-bold text-sm">{formData["Client Name"] || "Client Name"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-[9px] uppercase tracking-widest">{selectedDoc.id === "invoice" ? "Invoice #" : "Document #"}</p>
                      <p className="text-gray-700 font-semibold text-xs">{formData["Invoice #"] || formData["Contract #"] || `DOC-00${Math.floor(Math.random() * 90) + 10}`}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3 space-y-1.5">
                    {selectedDoc.fields.slice(2).map((field) => (
                      <div key={field} className="flex justify-between text-[10px]">
                        <span className="text-gray-500">{field}:</span>
                        <span className="text-gray-700 font-medium">{formData[field] || "—"}</span>
                      </div>
                    ))}
                  </div>
                  {selectedDoc.id === "invoice" && (
                    <div className="bg-orange/5 border border-orange/20 rounded-lg p-2.5 flex justify-between items-center mt-2">
                      <span className="text-gray-600 text-xs font-semibold">Total Amount Due</span>
                      <span className="text-orange font-extrabold text-base">{formData["Amount"] || "₱0.00"}</span>
                    </div>
                  )}
                </div>
                {/* Footer */}
                <div className="bg-gray-50 px-5 py-2.5 flex gap-2 justify-end">
                  <button className="flex items-center gap-1 text-gray-500 text-[10px] hover:text-gray-700">
                    <Download size={11} /> Download PDF
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 text-[10px] hover:text-gray-700">
                    <Mail size={11} /> Send via Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Automation Rules */}
      {activeTab === "automation" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-heading font-bold text-white text-sm">Active Automation Rules</h4>
            <span className="text-green-400 text-xs font-semibold">{automationRules.filter(r => r.status === "active").length} active</span>
          </div>
          {automationRules.map((rule, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white/3 border border-white/8 rounded-xl hover:border-orange/20 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${rule.status === "active" ? "bg-green-400 animate-pulse" : "bg-white/20"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-orange/70 text-[10px] font-semibold bg-orange/10 px-1.5 py-0.5 rounded-full">IF</span>
                  <span className="text-white/70 text-xs">{rule.trigger}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-blue-400/70 text-[10px] font-semibold bg-blue-400/10 px-1.5 py-0.5 rounded-full">THEN</span>
                  <span className="text-white/50 text-xs">{rule.action}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${rule.status === "active" ? "bg-green-400/10 text-green-400 border border-green-400/20" : "bg-white/5 text-white/30 border border-white/10"}`}>
                  {rule.status}
                </span>
                <p className="text-white/25 text-[9px] mt-0.5">{rule.runs.toLocaleString()} runs</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Time Savings */}
      {activeTab === "savings" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h4 className="font-heading font-bold text-white text-sm mb-3">Time Saved with Admin Automation</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-4 text-[10px] text-white/25 uppercase tracking-widest px-2 pb-2 font-semibold">
                <span>Task</span>
                <span className="text-center">Manual</span>
                <span className="text-center">Automated</span>
                <span className="text-right">Saved</span>
              </div>
              {timeSavings.map(({ task, manual, auto, saving }) => (
                <div key={task} className="grid grid-cols-4 items-center py-2.5 px-2 bg-white/3 border border-white/8 rounded-lg">
                  <span className="text-white/70 text-xs font-medium">{task}</span>
                  <span className="text-center text-red-400/70 text-xs line-through">{manual}</span>
                  <span className="text-center text-green-400 text-xs font-bold">{auto}</span>
                  <span className="text-right text-orange font-bold text-xs">{saving}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Clock, label: "Hours Saved / Week", val: "32 hrs", color: "text-blue-400" },
              { icon: FileText, label: "Docs Auto-Generated / Mo", val: "480+", color: "text-orange" },
              { icon: CheckCircle2, label: "Manual Errors Eliminated", val: "100%", color: "text-green-400" },
            ].map(({ icon: Icon, label, val, color }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <Icon size={16} className={`${color} mx-auto mb-1.5`} />
                <div className={`font-heading font-extrabold text-xl ${color}`}>{val}</div>
                <div className="text-white/35 text-[10px] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
