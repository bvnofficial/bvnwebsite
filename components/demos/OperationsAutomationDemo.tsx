"use client";
import { useState } from "react";
import { CheckCircle2, Zap, Play, ArrowRight, Plus, X, Settings } from "lucide-react";

interface WorkflowStep {
  id: number;
  type: "trigger" | "action" | "condition" | "delay";
  label: string;
  detail: string;
  icon: string;
}

const triggerOptions = [
  { label: "New form submission", icon: "📋" },
  { label: "Invoice created", icon: "📄" },
  { label: "Inventory low", icon: "📦" },
  { label: "New customer signup", icon: "👤" },
  { label: "Payment received", icon: "💰" },
  { label: "Support ticket opened", icon: "🎫" },
];

const actionOptions = [
  { label: "Send email notification", icon: "📧" },
  { label: "Create task in CRM", icon: "✅" },
  { label: "Update spreadsheet", icon: "📊" },
  { label: "Send Slack message", icon: "💬" },
  { label: "Generate PDF report", icon: "📑" },
  { label: "Assign to team member", icon: "👥" },
];

const processMetrics = [
  { process: "Invoice Processing", before: "3 days", after: "2 hours", saving: "94%" },
  { process: "Purchase Orders", before: "5 days", after: "4 hours", saving: "88%" },
  { process: "Employee Onboarding", before: "1 week", after: "1 day", saving: "85%" },
  { process: "Report Generation", before: "6 hrs", after: "5 min", saving: "99%" },
  { process: "Approval Workflows", before: "2 days", after: "15 min", saving: "96%" },
];

const automationStats = [
  { label: "Processes Automated", val: "47" },
  { label: "Hours Saved / Week", val: "142" },
  { label: "Error Rate", val: "-96%" },
  { label: "Cost Reduction", val: "68%" },
];

export default function OperationsAutomationDemo() {
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([
    { id: 1, type: "trigger", label: "New form submission", detail: "Purchase Request Form", icon: "📋" },
    { id: 2, type: "condition", label: "Amount > ₱10,000?", detail: "Requires manager approval", icon: "❓" },
    { id: 3, type: "action", label: "Send approval email", detail: "To: finance@company.com", icon: "📧" },
    { id: 4, type: "delay", label: "Wait 24 hours", detail: "Business hours only", icon: "⏰" },
    { id: 5, type: "action", label: "Generate PO document", detail: "Auto-fill with form data", icon: "📄" },
    { id: 6, type: "action", label: "Update ERP system", detail: "Post to accounting ledger", icon: "📊" },
  ]);

  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [complete, setComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<"builder" | "metrics" | "savings">("builder");

  const stepColors: Record<string, string> = {
    trigger: "border-blue-400/40 bg-blue-400/5 text-blue-300",
    action: "border-orange/40 bg-orange/5 text-orange",
    condition: "border-purple-400/40 bg-purple-400/5 text-purple-300",
    delay: "border-yellow-400/40 bg-yellow-400/5 text-yellow-300",
  };

  function runWorkflow() {
    if (running || complete) return;
    setRunning(true);
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= workflow.length - 1) {
          clearInterval(interval);
          setRunning(false);
          setComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  }

  function reset() {
    setComplete(false);
    setRunning(false);
    setActiveStep(-1);
  }

  function removeStep(id: number) {
    setWorkflow((prev) => prev.filter((s) => s.id !== id));
  }

  function addAction() {
    const opts = actionOptions;
    const opt = opts[Math.floor(Math.random() * opts.length)];
    setWorkflow((prev) => [...prev, {
      id: Date.now(),
      type: "action",
      label: opt.label,
      detail: "Automated trigger",
      icon: opt.icon,
    }]);
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["builder", "metrics", "savings"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "builder" ? "⚙️ Workflow Builder" : tab === "metrics" ? "📊 Live Metrics" : "💰 Cost Savings"}
          </button>
        ))}
      </div>

      {/* Workflow Builder */}
      {activeTab === "builder" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-bold text-white text-sm">Purchase Request Automation</h4>
              <div className="flex gap-2">
                {complete && <button onClick={reset} className="px-3 py-1.5 text-xs border border-white/15 text-white/50 rounded-lg hover:bg-white/10">Reset</button>}
                <button onClick={addAction} className="px-3 py-1.5 bg-white/10 border border-white/15 text-white/70 text-xs font-semibold rounded-lg hover:bg-white/20 flex items-center gap-1">
                  <Plus size={11} /> Add Step
                </button>
                <button onClick={runWorkflow} disabled={running || complete}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${complete ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-orange text-white hover:bg-orange-light disabled:opacity-60"}`}>
                  {running ? <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Running...</>
                    : complete ? <><CheckCircle2 size={12} /> Complete!</>
                    : <><Play size={12} /> Run</>}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {workflow.map((step, i) => (
                <div key={step.id} className="relative">
                  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${i <= activeStep || complete ? (step.type === "trigger" ? "border-green-400/30 bg-green-400/5" : "border-orange/30 bg-orange/5") : stepColors[step.type]}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 ${i === activeStep && running ? "animate-pulse" : ""}`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${stepColors[step.type]}`}>
                          {step.type}
                        </span>
                        {(i <= activeStep || complete) && <CheckCircle2 size={11} className="text-green-400" />}
                      </div>
                      <p className="text-white/80 text-xs font-semibold mt-0.5">{step.label}</p>
                      <p className="text-white/30 text-[10px]">{step.detail}</p>
                    </div>
                    {!running && !complete && step.type !== "trigger" && (
                      <button onClick={() => removeStep(step.id)} className="p-1 hover:bg-white/10 rounded text-white/20 hover:text-white/60 transition-colors">
                        <X size={11} />
                      </button>
                    )}
                  </div>
                  {i < workflow.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ArrowRight size={12} className="text-white/20 rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {complete && (
            <div className="bg-green-400/5 border border-green-400/20 rounded-xl p-4 text-center">
              <CheckCircle2 size={20} className="text-green-400 mx-auto mb-2" />
              <p className="text-green-400 text-sm font-bold">Workflow Executed Successfully!</p>
              <p className="text-white/40 text-xs mt-1">Process completed in 0.3s vs. 3 days manually · Saved 71 hours of work</p>
            </div>
          )}
        </div>
      )}

      {/* Live Metrics */}
      {activeTab === "metrics" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {automationStats.map(({ label, val }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="font-heading font-extrabold text-2xl text-orange">{val}</div>
                <div className="text-white/40 text-[10px] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-heading font-bold text-white text-sm mb-3">Live Process Monitor</h4>
            {[
              { process: "Invoice Approvals", running: 3, queued: 8, completed: 142, color: "bg-blue-400" },
              { process: "Purchase Orders", running: 1, queued: 4, completed: 67, color: "bg-orange" },
              { process: "Onboarding Flows", running: 2, queued: 1, completed: 28, color: "bg-green-400" },
              { process: "Report Generation", running: 0, queued: 2, completed: 480, color: "bg-purple-400" },
            ].map(({ process, running: r, queued, completed, color }) => (
              <div key={process} className="flex items-center gap-3 py-2.5 border-b border-white/5">
                <div className={`w-2 h-2 rounded-full ${color} ${r > 0 ? "animate-pulse" : ""}`} />
                <span className="text-white/70 text-xs flex-1">{process}</span>
                <span className="text-orange text-[10px] font-semibold">{r} running</span>
                <span className="text-white/30 text-[10px]">{queued} queued</span>
                <span className="text-green-400 text-[10px] font-semibold">{completed} done</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Savings */}
      {activeTab === "savings" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h4 className="font-heading font-bold text-white text-sm mb-3">Before & After Automation</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-4 text-[10px] text-white/25 uppercase tracking-widest px-2 pb-2 font-semibold">
                <span>Process</span>
                <span className="text-center">Before</span>
                <span className="text-center">After BVN</span>
                <span className="text-right">Time Saved</span>
              </div>
              {processMetrics.map(({ process, before, after, saving }) => (
                <div key={process} className="grid grid-cols-4 items-center py-2.5 px-2 bg-white/3 border border-white/8 rounded-lg">
                  <span className="text-white/70 text-xs font-medium">{process}</span>
                  <span className="text-center text-red-400/70 text-xs line-through">{before}</span>
                  <span className="text-center text-green-400 text-xs font-bold">{after}</span>
                  <span className="text-right text-orange font-bold text-xs">{saving}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-orange/5 border border-orange/20 rounded-xl p-5">
            <h4 className="font-heading font-bold text-white text-sm mb-1">💰 Annual Savings Calculator</h4>
            <p className="text-white/40 text-xs mb-3">Based on 10-person operations team at ₱30,000/mo average salary</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Hours Saved / Year", val: "7,384 hrs" },
                { label: "Labor Cost Saved", val: "₱2.2M/yr" },
                { label: "Error Cost Avoided", val: "₱840K/yr" },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="font-heading font-bold text-lg text-orange">{val}</div>
                  <div className="text-white/35 text-[10px] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
