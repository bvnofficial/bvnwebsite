"use client";
import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Plus, Check, Send } from "lucide-react";

const platforms = ["Instagram", "Facebook", "TikTok", "LinkedIn", "X"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlots = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

const hashtagSuggestions: Record<string, string[]> = {
  Instagram: ["#reels", "#explorepage", "#instagood", "#viral", "#contentcreator"],
  Facebook: ["#facebookmarketing", "#smallbusiness", "#growyourbusiness", "#digitalmarketing"],
  TikTok: ["#fyp", "#foryoupage", "#trending", "#viral", "#tiktokmarketing"],
  LinkedIn: ["#linkedin", "#b2b", "#leadership", "#marketing", "#business"],
  X: ["#marketing", "#growth", "#startup", "#socialmedia", "#digitalmarketing"],
};

const platformColors: Record<string, string> = {
  Instagram: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Facebook: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  TikTok: "bg-white/10 text-white border-white/20",
  LinkedIn: "bg-blue-600/20 text-blue-400 border-blue-600/30",
  X: "bg-white/10 text-white/80 border-white/20",
};

const platformGradients: Record<string, string> = {
  Instagram: "from-pink-500 via-purple-500 to-orange-400",
  Facebook: "from-blue-600 to-blue-400",
  TikTok: "from-gray-900 to-black",
  LinkedIn: "from-blue-700 to-blue-500",
  X: "from-gray-900 to-gray-800",
};

const maxChars: Record<string, number> = {
  Instagram: 2200, Facebook: 63206, TikTok: 2200, LinkedIn: 3000, X: 280,
};

export default function SocialMediaDemo() {
  const [scheduled, setScheduled] = useState<Record<string, string>>({
    "Mon-9:00 AM": "Instagram",
    "Wed-12:00 PM": "Facebook",
    "Fri-6:00 PM": "TikTok",
    "Sun-3:00 PM": "LinkedIn",
  });
  const [platform, setPlatform] = useState("Instagram");
  const [post, setPost] = useState(
    "Excited to share our latest win! 🚀 We helped a client grow their online presence by 300% in just 90 days with a smart social media strategy. Ready to grow yours? Drop a comment below! 👇"
  );
  const [selectedSlot, setSelectedSlot] = useState("");
  const [added, setAdded] = useState(false);
  const [likes, setLikes] = useState(247);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const max = maxChars[platform] || 280;

  function schedulePost() {
    if (!selectedSlot || !post) return;
    setScheduled((p) => ({ ...p, [selectedSlot]: platform }));
    setAdded(true);
    setTimeout(() => { setAdded(false); setSelectedSlot(""); }, 1800);
  }

  function addHashtag(tag: string) {
    setPost((p) => (p.endsWith(" ") ? p + tag : p + " " + tag));
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Composer */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <h4 className="font-heading font-bold text-white text-sm">📝 Post Composer</h4>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${platform === p ? platformColors[p] + " ring-1 ring-white/20" : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"}`}>
                {p}
              </button>
            ))}
          </div>
          <div className="relative">
            <textarea value={post} onChange={(e) => setPost(e.target.value)} rows={5}
              placeholder="Write your post..." maxLength={max}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-orange/40 resize-none" />
            <span className={`absolute bottom-2 right-2 text-[10px] ${post.length > max * 0.9 ? "text-red-400" : "text-white/25"}`}>
              {post.length}/{max}
            </span>
          </div>
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5">💡 Suggested Hashtags</p>
            <div className="flex flex-wrap gap-1.5">
              {(hashtagSuggestions[platform] || []).map((tag) => (
                <button key={tag} onClick={() => addHashtag(tag)}
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-white/50 text-[10px] hover:bg-orange/10 hover:border-orange/30 hover:text-orange transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/70 text-xs focus:outline-none focus:border-orange/40">
              <option value="">Select schedule time...</option>
              {days.map((d) =>
                timeSlots.map((t) => {
                  const key = `${d}-${t}`;
                  return (
                    <option key={key} value={key} disabled={!!scheduled[key]}>
                      {d} @ {t}{scheduled[key] ? ` — ${scheduled[key]}` : ""}
                    </option>
                  );
                })
              )}
            </select>
            <button onClick={schedulePost} disabled={!post || !selectedSlot}
              className="px-4 py-2 bg-orange text-white text-xs font-bold rounded-lg disabled:opacity-40 hover:bg-orange-light transition-colors flex items-center gap-1">
              {added ? <><Check size={12} /> Scheduled!</> : <><Plus size={12} /> Schedule</>}
            </button>
          </div>
        </div>

        {/* Live Post Preview */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h4 className="font-heading font-bold text-white text-sm mb-3">👁 Live Post Preview</h4>
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className={`bg-gradient-to-r ${platformGradients[platform]} h-1.5`} />
            <div className="px-3 pt-3 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${platformGradients[platform]} flex items-center justify-center text-white text-xs font-extrabold`}>
                  BV
                </div>
                <div>
                  <p className="text-gray-900 text-xs font-bold leading-tight">bvnofficial</p>
                  <p className="text-gray-400 text-[10px]">BVN Marketing · Just now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r ${platformGradients[platform]} text-white`}>
                  {platform}
                </span>
                <MoreHorizontal size={14} className="text-gray-400" />
              </div>
            </div>
            {/* Mock image area */}
            <div className={`h-28 bg-gradient-to-br ${platformGradients[platform]} opacity-80 flex items-center justify-center`}>
              <span className="text-white/60 text-xs">📸 Media Attachment</span>
            </div>
            {/* Caption */}
            <div className="px-3 py-2">
              <p className="text-gray-800 text-xs leading-relaxed">
                <span className="font-bold">bvnofficial </span>
                {post ? post.slice(0, 120) + (post.length > 120 ? "... more" : "") : "Your caption will appear here..."}
              </p>
              {post.length === 0 && (
                <p className="text-gray-300 text-[10px] mt-1 italic">Start typing to preview your post</p>
              )}
            </div>
            {/* Actions */}
            <div className="px-3 py-2.5 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setLiked(!liked); setLikes((l) => liked ? l - 1 : l + 1); }}
                  className="flex items-center gap-1 transition-transform hover:scale-110">
                  <Heart size={18} className={liked ? "fill-red-500 text-red-500" : "text-gray-500"} />
                  <span className="text-gray-500 text-xs font-semibold">{likes.toLocaleString()}</span>
                </button>
                <button className="flex items-center gap-1">
                  <MessageCircle size={18} className="text-gray-500" />
                  <span className="text-gray-500 text-xs">48</span>
                </button>
                <Send size={16} className="text-gray-500" />
              </div>
              <button onClick={() => setSaved(!saved)} className="transition-transform hover:scale-110">
                <Bookmark size={16} className={saved ? "fill-orange-500 text-orange-500" : "text-gray-500"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Calendar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-heading font-bold text-white text-sm">📅 Weekly Content Calendar</h4>
          <span className="bg-orange/10 border border-orange/20 text-orange text-[10px] font-bold px-2.5 py-1 rounded-full">
            {Object.keys(scheduled).length} posts scheduled
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[520px]">
            <thead>
              <tr>
                <td className="text-white/25 pb-2.5 pr-3 text-[10px] w-20">Time</td>
                {days.map((d) => (
                  <th key={d} className="text-white/50 font-semibold pb-2.5 text-center text-[10px]">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((t) => (
                <tr key={t}>
                  <td className="text-white/25 pr-3 py-1.5 text-[10px] whitespace-nowrap">{t}</td>
                  {days.map((d) => {
                    const key = `${d}-${t}`;
                    const p = scheduled[key];
                    return (
                      <td key={key} className="px-0.5 py-1">
                        {p ? (
                          <div className={`px-1.5 py-1 rounded-md text-[9px] text-center font-bold border ${platformColors[p]}`}>
                            {p.slice(0, 2)}
                          </div>
                        ) : (
                          <div className="h-6 rounded border border-dashed border-white/5 bg-white/2 hover:bg-white/5 transition-colors cursor-pointer" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Forecast */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Heart, label: "Est. Likes / Week", val: (Object.keys(scheduled).length * 847).toLocaleString(), color: "text-pink-400" },
          { icon: MessageCircle, label: "Est. Comments", val: (Object.keys(scheduled).length * 124).toLocaleString(), color: "text-blue-400" },
          { icon: Share2, label: "Est. Shares", val: (Object.keys(scheduled).length * 56).toLocaleString(), color: "text-green-400" },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <Icon size={16} className={`${color} mx-auto mb-1.5`} />
            <div className={`font-heading font-extrabold text-xl ${color}`}>{val}</div>
            <div className="text-white/35 text-[10px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
