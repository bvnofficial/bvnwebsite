"use client";
import { useState } from "react";
import { CheckCircle2, PlayCircle, Zap, BarChart2, Settings, ArrowRight } from "lucide-react";

interface GenericDemoProps {
  demoType: string;
  title: string;
}

const demoConfigs: Record<string, {
  steps: string[];
  metrics: { label: string; before: string; after: string }[];
  features: string[];
}> = {
  "content-marketing": {
    steps: ["Define target audience & goals", "Keyword & topic research", "Content calendar creation", "Long-form article writing", "SEO optimization & publishing", "Distribution & promotion", "Performance tracking"],
    metrics: [
      { label: "Organic Traffic", before: "2,400/mo", after: "12,800/mo" },
      { label: "Leads from Content", before: "8/mo", after: "67/mo" },
      { label: "Domain Authority", before: "18", after: "42" },
    ],
    features: ["Topic cluster strategy", "12+ content formats", "SEO-first writing", "Monthly editorial calendar"],
  },
  "video-marketing": {
    steps: ["Video strategy & brief", "Script writing", "Production planning", "Filming & direction", "Professional editing", "Platform optimization", "Performance analytics"],
    metrics: [
      { label: "Video Views", before: "1,200/mo", after: "148,000/mo" },
      { label: "Engagement Rate", before: "1.2%", after: "8.7%" },
      { label: "Leads from Video", before: "3/mo", after: "42/mo" },
    ],
    features: ["Short-form & long-form", "Platform-native formats", "Motion graphics", "A/B tested thumbnails"],
  },
  "influencer-marketing": {
    steps: ["Define influencer criteria", "Discovery & vetting", "Outreach & negotiation", "Brief & content guidelines", "Campaign execution", "Performance tracking", "ROI reporting"],
    metrics: [
      { label: "Reach", before: "12,000", after: "2.4M" },
      { label: "Cost Per Engagement", before: "$4.20", after: "$0.18" },
      { label: "Conversions", before: "28/mo", after: "340/mo" },
    ],
    features: ["AI-powered creator matching", "Nano to mega influencers", "FTC compliance", "Real-time performance tracking"],
  },
  "web-development": {
    steps: ["Discovery & wireframes", "UI/UX design", "Development", "CMS integration", "Performance optimization", "Testing & QA", "Launch & monitoring"],
    metrics: [
      { label: "Page Load Speed", before: "4.8s", after: "0.9s" },
      { label: "Conversion Rate", before: "1.2%", after: "4.8%" },
      { label: "Bounce Rate", before: "74%", after: "38%" },
    ],
    features: ["Mobile-first design", "Core Web Vitals optimized", "CMS integration", "Security hardened"],
  },
  "app-development": {
    steps: ["Requirements gathering", "UX/UI prototyping", "Backend architecture", "Frontend development", "API integrations", "Testing & QA", "App store submission"],
    metrics: [
      { label: "App Store Rating", before: "N/A", after: "4.8 ⭐" },
      { label: "Daily Active Users", before: "0", after: "12,400" },
      { label: "User Retention D7", before: "—", after: "68%" },
    ],
    features: ["iOS & Android", "Real-time features", "Offline capability", "Analytics built-in"],
  },
  "crm-solutions": {
    steps: ["Sales process audit", "CRM platform selection", "Data migration", "Pipeline configuration", "Automation setup", "Team training", "Go-live & support"],
    metrics: [
      { label: "Lead Response Time", before: "48 hrs", after: "4 mins" },
      { label: "Pipeline Accuracy", before: "58%", after: "96%" },
      { label: "Close Rate", before: "18%", after: "34%" },
    ],
    features: ["HubSpot, Salesforce, Zoho", "Full data migration", "Automation workflows", "Custom dashboards"],
  },
  "crm-automation": {
    steps: ["Sales process mapping", "Automation blueprint", "CRM configuration", "Workflow automation", "Integration setup", "Team enablement", "Optimization"],
    metrics: [
      { label: "Admin Time Saved", before: "18 hrs/week", after: "3 hrs/week" },
      { label: "Follow-up Rate", before: "42%", after: "100%" },
      { label: "Revenue Per Rep", before: "$84K/yr", after: "$142K/yr" },
    ],
    features: ["Automated lead routing", "Follow-up sequences", "Pipeline triggers", "Forecasting automation"],
  },
  "operations-automation": {
    steps: ["Process audit & mapping", "Automation opportunity analysis", "Workflow design", "System configuration", "Integration & testing", "Staff training", "Go-live monitoring"],
    metrics: [
      { label: "Process Time", before: "5 days", after: "4 hours" },
      { label: "Error Rate", before: "8.2%", after: "0.3%" },
      { label: "Cost Per Process", before: "$180", after: "$12" },
    ],
    features: ["Process digitization", "Approval workflows", "Inventory automation", "Compliance tracking"],
  },
  "time-tracking": {
    steps: ["Workforce audit", "System selection", "GPS & geofence setup", "Mobile app deployment", "Payroll integration", "Team onboarding", "Reporting setup"],
    metrics: [
      { label: "Timesheet Accuracy", before: "71%", after: "99.8%" },
      { label: "Payroll Processing", before: "3 days", after: "2 hours" },
      { label: "Overtime Costs", before: "$28K/mo", after: "$18K/mo" },
    ],
    features: ["GPS tracking", "Geofencing", "Mobile clock-in", "Payroll sync"],
  },
  "admin-automation": {
    steps: ["Admin audit & bottleneck ID", "Document template creation", "Automation workflow design", "System integration", "Testing & validation", "Team training", "Launch & monitoring"],
    metrics: [
      { label: "Document Gen Time", before: "2 hrs/doc", after: "8 mins/doc" },
      { label: "Data Entry Hours", before: "15 hrs/week", after: "0 hrs/week" },
      { label: "Invoice Processing", before: "5 days", after: "Same day" },
    ],
    features: ["Document automation", "Email triage", "Invoice automation", "Data sync"],
  },
  "integrations": {
    steps: ["Tech stack audit", "Integration architecture", "API development", "Data mapping", "Testing & validation", "Error handling setup", "Monitoring & maintenance"],
    metrics: [
      { label: "Manual Data Entry", before: "6 hrs/day", after: "0 hrs/day" },
      { label: "Data Accuracy", before: "78%", after: "99.5%" },
      { label: "Process Handoff Time", before: "4 hours", after: "Instant" },
    ],
    features: ["500+ app connectors", "Bi-directional sync", "Error handling", "Real-time webhooks"],
  },
};

export default function GenericDemo({ demoType, title }: GenericDemoProps) {
  const config = demoConfigs[demoType] || demoConfigs["crm-automation"];
  const [activeStep, setActiveStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);

  function runDemo() {
    if (running || complete) return;
    setRunning(true);
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= config.steps.length - 1) {
          clearInterval(interval);
          setRunning(false);
          setComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
  }

  function reset() {
    setComplete(false);
    setRunning(false);
    setActiveStep(0);
  }

  return (
    <div className="space-y-5">
      {/* Workflow Steps */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-heading font-bold text-white text-sm">⚙️ {title} Workflow</h4>
          <div className="flex gap-2">
            {complete && (
              <button onClick={reset} className="px-3 py-1.5 text-xs text-white/50 border border-white/15 rounded-lg hover:bg-white/10 transition-colors">
                Reset
              </button>
            )}
            <button onClick={runDemo} disabled={running || complete}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${complete ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-orange text-white hover:bg-orange-light disabled:opacity-60"}`}>
              {complete ? <><CheckCircle2 size={12} /> Complete!</> : running ? <><Zap size={12} className="animate-pulse" /> Running...</> : <><PlayCircle size={12} /> Run Demo</>}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.steps.map((step, i) => (
            <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all duration-300 ${i < activeStep || complete ? "bg-orange/10 border-orange/30 text-orange" : i === activeStep && running ? "bg-orange/20 border-orange/50 text-white animate-pulse" : "bg-white/3 border-white/10 text-white/40"}`}>
              {(i < activeStep || complete) ? <CheckCircle2 size={11} /> : <span className="text-[10px] w-4 text-center">{i + 1}</span>}
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Before / After Metrics */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h4 className="font-heading font-bold text-white text-sm mb-3">📊 Before & After BVN</h4>
        <div className="space-y-3">
          {config.metrics.map(({ label, before, after }) => (
            <div key={label} className="grid grid-cols-3 items-center py-2 border-b border-white/5">
              <span className="text-white/60 text-xs">{label}</span>
              <div className="text-center">
                <span className="text-red-400/70 text-xs line-through">{before}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <ArrowRight size={11} className="text-white/20" />
                <span className="text-green-400 text-xs font-bold">{after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="font-heading font-bold text-white text-sm mb-2">✅ What&apos;s Included</h4>
        <div className="flex flex-wrap gap-2">
          {config.features.map(f => (
            <span key={f} className="px-3 py-1.5 bg-orange/8 border border-orange/20 text-orange text-xs rounded-full font-semibold">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
