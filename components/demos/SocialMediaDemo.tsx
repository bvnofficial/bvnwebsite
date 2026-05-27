"use client";
import { useState } from "react";
import { Heart, MessageCircle, Share2, Plus, Check } from "lucide-react";

const platforms = ["Instagram", "Facebook", "TikTok", "LinkedIn", "X"];
const timeSlots = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SocialMediaDemo() {
  const [scheduled, setScheduled] = useState<Record<string, string>>({
    "Mon-9:00 AM": "Instagram",
    "Wed-12:00 PM": "Facebook",
    "Fri-6:00 PM": "TikTok",
    "Sun-3:00 PM": "LinkedIn",
  });
  const [platform, setPlatform] = useState("Instagram");
  const [post, setPost] = useState("");
  const [added, setAdded] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  function schedulePost() {
    if (!selectedSlot || !post) return;
    setScheduled((p) => ({ ...p, [selectedSlot]: platform }));
    setAdded(true);
    setTimeout(() => { setAdded(false); setPost(""); setSelectedSlot(""); }, 1800);
  }

  const platformColors: Record<string, string> = {
    Instagram: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    Facebook: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    TikTok: "bg-white/10 text-white border-white/20",
    LinkedIn: "bg-blue-600/20 text-blue-400 border-blue-600/30",
    X: "bg-white/10 text-white/80 border-white/20",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Post Composer */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h4 className="font-heading font-bold text-white text-sm">📝 Compose Post</h4>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${platform === p ? platformColors[p] + " ring-1 ring-orange/50" : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"}`}>
                {p}
              </button>
            ))}
          </div>
          <textarea value={post} onChange={(e) => setPost(e.target.value)} rows={3}
            placeholder="Write your post here..." maxLength={280}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-orange/40 resize-none" />
          <div className="flex gap-2">
            {days.map((d) =>
              timeSlots.slice(0, 3).map((t) => {
                const key = `${d}-${t}`;
                const taken = !!scheduled[key];
                return (
                  <button key={key} onClick={() => !taken && setSelectedSlot(key)}
                    className={`px-2 py-1 rounded text-[10px] border transition-all hidden`} />
                );
              })
            )}
          </div>
          <div className="flex gap-2 items-center">
            <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/70 text-xs focus:outline-none focus:border-orange/40">
              <option value="">Select time slot...</option>
              {days.map((d) => timeSlots.map((t) => {
                const key = `${d}-${t}`;
                return <option key={key} value={key} disabled={!!scheduled[key]}>{d} {t}{scheduled[key] ? " (taken)" : ""}</option>;
              }))}
            </select>
            <button onClick={schedulePost} disabled={!post || !selectedSlot}
              className="px-4 py-2 bg-orange text-white text-xs font-bold rounded-lg disabled:opacity-40 hover:bg-orange-light transition-colors flex items-center gap-1">
              {added ? <><Check size={12} /> Done!</> : <><Plus size={12} /> Schedule</>}
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h4 className="font-heading font-bold text-white text-sm mb-3">📅 Content Calendar</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <td className="text-white/30 pb-2 pr-2 text-[10px]">Time</td>
                  {days.map((d) => <th key={d} className="text-white/50 font-semibold pb-2 px-1 text-[10px]">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((t) => (
                  <tr key={t}>
                    <td className="text-white/30 pr-2 py-1 text-[10px] whitespace-nowrap">{t}</td>
                    {days.map((d) => {
                      const key = `${d}-${t}`;
                      const p = scheduled[key];
                      return (
                        <td key={key} className="px-0.5 py-1">
                          {p ? (
                            <div className={`px-1 py-0.5 rounded text-[9px] text-center font-semibold border ${platformColors[p]}`}>
                              {p.slice(0, 2)}
                            </div>
                          ) : (
                            <div className="h-5 rounded border border-white/5 bg-white/2" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/30 text-[10px] mt-3">{Object.keys(scheduled).length} posts scheduled this week</p>
        </div>
      </div>

      {/* Engagement Preview */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h4 className="font-heading font-bold text-white text-sm mb-3">📊 Engagement Forecast</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Heart, label: "Est. Likes", val: `${(Object.keys(scheduled).length * 847).toLocaleString()}` },
            { icon: MessageCircle, label: "Est. Comments", val: `${(Object.keys(scheduled).length * 124).toLocaleString()}` },
            { icon: Share2, label: "Est. Shares", val: `${(Object.keys(scheduled).length * 56).toLocaleString()}` },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <Icon size={16} className="text-orange mx-auto mb-1" />
              <div className="font-heading font-bold text-white text-lg">{val}</div>
              <div className="text-white/40 text-[10px]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
