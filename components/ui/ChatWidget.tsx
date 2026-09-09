"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MessageCircle, X, Send } from "lucide-react";

// Human chat: visitors message BVN directly and Benjamin replies from BVN OS.
// Anonymous — a random conversation id in localStorage, no account needed.

type Msg = { id: string; sender: "visitor" | "admin"; body: string; created_at: string };

const CID_KEY = "bvn_chat_cid";
const NAME_KEY = "bvn_chat_name";

function getCid(): string {
  try {
    let c = localStorage.getItem(CID_KEY);
    if (!c) {
      c = crypto.randomUUID();
      localStorage.setItem(CID_KEY, c);
    }
    return c;
  } catch {
    return crypto.randomUUID();
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [hp, setHp] = useState("");
  const [showDot, setShowDot] = useState(true);
  const cid = useRef<string>("");
  const since = useRef<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cid.current = getCid();
    try { setName(localStorage.getItem(NAME_KEY) || ""); } catch {}
  }, []);

  const poll = useCallback(async () => {
    if (!cid.current) return;
    try {
      const qs = `conversationId=${cid.current}${since.current ? `&since=${encodeURIComponent(since.current)}` : ""}`;
      const r = await fetch(`/api/chat/thread?${qs}`, { cache: "no-store" });
      if (!r.ok) return;
      const j = await r.json();
      const incoming: Msg[] = j.messages || [];
      if (incoming.length) {
        since.current = incoming[incoming.length - 1].created_at;
        setMsgs((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          const additions = incoming.filter((m) => !seen.has(m.id));
          if (!additions.length) return prev;
          const realVisitorBodies = new Set(additions.filter((m) => m.sender === "visitor").map((m) => m.body));
          const withoutTemps = prev.filter((m) => !(String(m.id).startsWith("tmp-") && realVisitorBodies.has(m.body)));
          return [...withoutTemps, ...additions];
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    setShowDot(false);
    poll();
    const t = setInterval(poll, 4000);
    return () => clearInterval(t);
  }, [open, poll]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [msgs, open]);

  async function send() {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    const optimistic: Msg = { id: "tmp-" + Date.now(), sender: "visitor", body, created_at: new Date().toISOString() };
    setMsgs((p) => [...p, optimistic]);
    setText("");
    try { if (name) localStorage.setItem(NAME_KEY, name); } catch {}
    try {
      const r = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: cid.current, body, name: name || undefined, hp }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setMsgs((p) => p.filter((m) => m.id !== optimistic.id));
        setText(body);
        alert(j.error || "Could not send. Please try again.");
      } else {
        poll();
      }
    } catch {
      setMsgs((p) => p.filter((m) => m.id !== optimistic.id));
      setText(body);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`bvn-chat fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-orange shadow-[0_4px_24px_rgba(232,96,16,0.5)] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 ${open ? "opacity-0 pointer-events-none scale-90" : "opacity-100"}`}
        aria-label="Message us"
      >
        <MessageCircle size={24} />
        {showDot && !open && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0f172a] rounded-full animate-pulse" />
        )}
      </button>

      {/* Chat window */}
      <div
        className={`bvn-chat fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-2xl overflow-hidden shadow-[0_8px_48px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-300 origin-bottom-right ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"}`}
        style={{ height: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0f172a] rounded-full" />
            </div>
            <div>
              <p className="text-white text-sm font-heading font-semibold leading-none">Message BVN</p>
              <p className="text-white/50 text-xs font-accent mt-0.5">We usually reply within a day</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close">
            <X size={14} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scroller} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#0d1526]">
          {msgs.length === 0 && (
            <div className="text-white/50 text-sm text-center px-4 py-6">
              Hi 👋 A real person here. Ask about services, pricing, or a project — send us a message and we&apos;ll get back to you.
            </div>
          )}
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "visitor" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${m.sender === "visitor" ? "bg-orange text-white rounded-br-sm" : "bg-white/8 border border-white/8 text-white/85 rounded-bl-sm"}`}>
                {m.body}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-3 py-3 bg-[#0f172a] border-t border-white/10 flex-shrink-0">
          {msgs.length === 0 && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full mb-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 outline-none focus:border-orange/40"
            />
          )}
          <input value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-orange/40 transition-colors">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
            />
            <button onClick={send} disabled={!text.trim() || sending} className="w-7 h-7 rounded-lg bg-orange flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-orange-light transition-colors" aria-label="Send">
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
