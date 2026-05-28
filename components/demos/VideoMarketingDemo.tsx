"use client";
import { useState } from "react";
import { Play, CheckCircle2, Clock, Film, Zap, BarChart2 } from "lucide-react";

const videoTypes = [
  { id: "explainer", label: "Explainer Video", duration: "60–90s", platforms: ["YouTube", "Website", "LinkedIn"] },
  { id: "testimonial", label: "Client Testimonial", duration: "30–60s", platforms: ["Instagram", "Facebook", "Website"] },
  { id: "reels", label: "Short-Form Reels", duration: "15–30s", platforms: ["TikTok", "Instagram", "YouTube Shorts"] },
  { id: "corporate", label: "Corporate Profile", duration: "2–5 min", platforms: ["YouTube", "Website", "LinkedIn"] },
];

interface ProductionStage {
  name: string;
  duration: string;
  status: "done" | "active" | "pending";
  deliverable: string;
}

const stagesByType: Record<string, ProductionStage[]> = {
  explainer: [
    { name: "Discovery & Brief", duration: "Day 1–2", status: "done", deliverable: "Creative brief, audience personas" },
    { name: "Scriptwriting", duration: "Day 3–4", status: "done", deliverable: "Full script + voiceover copy" },
    { name: "Storyboarding", duration: "Day 5–6", status: "active", deliverable: "Visual storyboard (12 frames)" },
    { name: "Motion Design", duration: "Day 7–10", status: "pending", deliverable: "Animated video draft" },
    { name: "Voiceover Recording", duration: "Day 11", status: "pending", deliverable: "Professional VO track" },
    { name: "Sound Design", duration: "Day 12", status: "pending", deliverable: "Music + SFX mix" },
    { name: "Final Delivery", duration: "Day 13–14", status: "pending", deliverable: "MP4 in all platform formats" },
  ],
  testimonial: [
    { name: "Client Pre-Shoot Brief", duration: "Day 1", status: "done", deliverable: "Questions, logistics, location" },
    { name: "Filming Day", duration: "Day 2–3", status: "done", deliverable: "Raw footage (4+ hours)" },
    { name: "Rough Cut", duration: "Day 4–5", status: "active", deliverable: "60s rough cut for approval" },
    { name: "Color Grading", duration: "Day 6", status: "pending", deliverable: "Color-corrected footage" },
    { name: "Graphics & Captions", duration: "Day 7", status: "pending", deliverable: "Lower thirds, subtitles" },
    { name: "Final Export", duration: "Day 8", status: "pending", deliverable: "Multi-format delivery" },
  ],
  reels: [
    { name: "Concept Development", duration: "Day 1", status: "done", deliverable: "3 creative concepts" },
    { name: "Content Filming", duration: "Day 2", status: "done", deliverable: "Raw clips + B-roll" },
    { name: "Editing & Cuts", duration: "Day 3", status: "active", deliverable: "Fast-paced reel cut" },
    { name: "Music & Captions", duration: "Day 4", status: "pending", deliverable: "Trending audio, text overlays" },
    { name: "Platform Optimization", duration: "Day 5", status: "pending", deliverable: "9:16 + 1:1 exports" },
  ],
  corporate: [
    { name: "Discovery & Strategy", duration: "Day 1–2", status: "done", deliverable: "Brand guidelines, interview Qs" },
    { name: "Pre-Production", duration: "Day 3–5", status: "done", deliverable: "Script, shot list, call sheet" },
    { name: "Principal Photography", duration: "Day 6–8", status: "active", deliverable: "Interview + B-roll footage" },
    { name: "Post-Production", duration: "Day 9–14", status: "pending", deliverable: "Edit, color, motion graphics" },
    { name: "Music & VO", duration: "Day 15", status: "pending", deliverable: "Licensed music, professional VO" },
    { name: "Revisions (2 rounds)", duration: "Day 16–18", status: "pending", deliverable: "Client-approved cut" },
    { name: "Master Delivery", duration: "Day 19–20", status: "pending", deliverable: "All formats + raw assets" },
  ],
};

const platformMetrics = [
  { platform: "YouTube", views: "148K", watchTime: "8.4K hrs", ctr: "6.2%", icon: "▶️" },
  { platform: "Instagram Reels", views: "284K", watchTime: "—", ctr: "4.8% eng.", icon: "📱" },
  { platform: "TikTok", views: "520K", watchTime: "—", ctr: "8.7% eng.", icon: "🎵" },
  { platform: "LinkedIn", views: "38K", watchTime: "—", ctr: "3.2%", icon: "💼" },
];

export default function VideoMarketingDemo() {
  const [selectedType, setSelectedType] = useState(videoTypes[0]);
  const [activeTab, setActiveTab] = useState<"production" | "metrics" | "preview">("production");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const stages = stagesByType[selectedType.id] || stagesByType.explainer;
  const doneCount = stages.filter((s) => s.status === "done").length;
  const progressPct = Math.round((doneCount / stages.length) * 100);

  function togglePlay() {
    if (playing) { setPlaying(false); return; }
    setPlaying(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setPlaying(false); return 100; }
        return p + 2;
      });
    }, 60);
  }

  return (
    <div className="space-y-5">
      {/* Video type selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {videoTypes.map((t) => (
          <button key={t.id} onClick={() => setSelectedType(t)}
            className={`text-left p-3 rounded-xl border transition-all ${selectedType.id === t.id ? "border-orange/50 bg-orange/8" : "border-white/10 bg-white/3 hover:bg-white/8"}`}>
            <Film size={14} className="text-orange mb-1.5" />
            <p className="text-white/80 text-xs font-bold">{t.label}</p>
            <p className="text-white/35 text-[10px] mt-0.5">{t.duration}</p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(["production", "metrics", "preview"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-orange text-white" : "text-white/50 hover:text-white/80"}`}>
            {tab === "production" ? "🎬 Production Pipeline" : tab === "metrics" ? "📊 Platform Metrics" : "▶️ Video Preview"}
          </button>
        ))}
      </div>

      {/* Production Pipeline */}
      {activeTab === "production" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-white text-sm">{selectedType.label} — Production Stages</h4>
            <span className="text-orange text-xs font-bold">{progressPct}% complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5">
            <div className="h-2.5 rounded-full bg-orange transition-all duration-700" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="space-y-2">
            {stages.map((stage, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${stage.status === "done" ? "border-green-400/20 bg-green-400/3" : stage.status === "active" ? "border-orange/30 bg-orange/5" : "border-white/8 bg-white/2"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${stage.status === "done" ? "bg-green-400/20" : stage.status === "active" ? "bg-orange/20 animate-pulse" : "bg-white/5"}`}>
                  {stage.status === "done" ? (
                    <CheckCircle2 size={14} className="text-green-400" />
                  ) : stage.status === "active" ? (
                    <Zap size={12} className="text-orange" />
                  ) : (
                    <span className="text-white/25 text-[10px] font-bold">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-semibold ${stage.status === "done" ? "text-green-400" : stage.status === "active" ? "text-white" : "text-white/50"}`}>
                      {stage.name}
                    </p>
                    <span className="text-white/25 text-[10px] shrink-0">{stage.duration}</span>
                  </div>
                  <p className="text-white/30 text-[10px] mt-0.5">📦 {stage.deliverable}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics */}
      {activeTab === "metrics" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {platformMetrics.map((p) => (
              <div key={p.platform} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="font-heading font-extrabold text-xl text-white">{p.views}</div>
                <div className="text-white/40 text-[10px] font-semibold mt-0.5">{p.platform}</div>
                <div className="text-white/25 text-[9px] mt-1">{p.watchTime !== "—" ? `Watch time: ${p.watchTime}` : `Engagement: ${p.ctr}`}</div>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h4 className="font-heading font-bold text-white text-sm mb-3">📈 Video Performance vs. Static Content</h4>
            {[
              { metric: "Engagement Rate", video: "8.7%", static: "1.2%", lift: "7x" },
              { metric: "Time on Page", video: "4:32 min", static: "0:48 min", lift: "5.6x" },
              { metric: "Lead Conversion", video: "4.8%", static: "1.2%", lift: "4x" },
              { metric: "Brand Recall", video: "80%", static: "22%", lift: "3.6x" },
            ].map(({ metric, video, static: stat, lift }) => (
              <div key={metric} className="grid grid-cols-4 items-center py-2.5 border-b border-white/5 text-xs">
                <span className="text-white/60">{metric}</span>
                <span className="text-center text-red-400/70 line-through">{stat}</span>
                <span className="text-center text-green-400 font-bold">{video}</span>
                <span className="text-right text-orange font-heading font-bold">{lift} better</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          {/* Mock video player */}
          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative">
            <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-orange/20 to-navy-dark flex items-center justify-center">
              {!playing ? (
                <div className="text-center">
                  <button onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-orange/90 flex items-center justify-center hover:bg-orange hover:scale-105 transition-all shadow-2xl">
                    <Play size={24} className="text-white ml-1" fill="white" />
                  </button>
                  <p className="text-white/60 text-xs mt-3">{selectedType.label} Preview</p>
                  <p className="text-white/30 text-[10px]">{selectedType.duration}</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-white font-heading font-extrabold text-2xl animate-pulse">BVN Official</div>
                  <p className="text-white/60 text-xs mt-2">Playing: {selectedType.label}</p>
                </div>
              )}
            </div>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-3">
              <div className="w-full bg-white/20 rounded-full h-1 mb-2">
                <div className="h-1 bg-orange rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-white/50 text-[10px]">
                <span>{playing ? `0:${Math.floor(progress * 0.9).toString().padStart(2, "0")}` : "0:00"}</span>
                <button onClick={togglePlay} className="text-white/70 hover:text-white transition-colors">
                  {playing ? "⏸" : "▶"} {playing ? "Pause" : "Play"}
                </button>
                <span>{selectedType.duration.split("–")[0]}s</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🎬", label: "Format", val: selectedType.label },
              { icon: "⏱", label: "Duration", val: selectedType.duration },
              { icon: "📱", label: "Platforms", val: selectedType.platforms.join(", ") },
            ].map(({ icon, label, val }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-lg mb-1">{icon}</div>
                <div className="text-white/70 text-xs font-semibold">{label}</div>
                <div className="text-white/40 text-[10px] mt-0.5">{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
