"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Minimize2, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What services does BVN offer?",
  "How much do your packages cost?",
  "Can you build a GoHighLevel funnel for me?",
  "I need a WordPress website",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! 👋 I'm BVN's AI assistant. I can help you explore our marketing and automation services, answer questions, or point you in the right direction. What can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDot, setShowDot] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized, messages]);

  // Hide notification dot once opened
  useEffect(() => {
    if (open) setShowDot(false);
  }, [open]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      // Add placeholder
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I ran into an issue. Please try again or email us at bvn@bvnofficial.com 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showSuggestions = messages.length === 1;

  return (
    <>
      {/* ── Floating bubble ── */}
      <button
        onClick={() => { setOpen(true); setMinimized(false); }}
        className={`bvn-chat fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-orange shadow-[0_4px_24px_rgba(232,96,16,0.5)] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-[0_4px_32px_rgba(232,96,16,0.7)] ${open && !minimized ? "opacity-0 pointer-events-none scale-90" : "opacity-100"}`}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
        {showDot && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0f172a] rounded-full animate-pulse" />
        )}
      </button>

      {/* ── Chat window ── */}
      <div
        className={`bvn-chat fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-2xl overflow-hidden shadow-[0_8px_48px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-300 origin-bottom-right ${
          open && !minimized
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
        style={{ height: minimized ? "60px" : "520px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0f172a] rounded-full" />
            </div>
            <div>
              <p className="text-white text-sm font-heading font-semibold leading-none">BVN Assistant</p>
              <p className="text-emerald-400 text-xs font-accent mt-0.5">Online · Powered by AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized((m) => !m)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Minimize"
            >
              <Minimize2 size={14} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#0d1526]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-orange flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                  <Bot size={12} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-orange text-white rounded-br-sm"
                    : "bg-white/8 border border-white/8 text-white/85 rounded-bl-sm"
                }`}
              >
                {msg.content || (
                  <span className="flex gap-1 items-center py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Suggested questions */}
          {showSuggestions && (
            <div className="flex flex-col gap-1.5 mt-2">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left text-xs text-white/60 border border-white/10 rounded-xl px-3 py-2 hover:bg-white/8 hover:text-white/90 hover:border-orange/30 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 bg-[#0f172a] border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-orange/40 transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-7 h-7 rounded-lg bg-orange flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-light transition-colors"
              aria-label="Send"
            >
              {loading ? (
                <Loader2 size={13} className="text-white animate-spin" />
              ) : (
                <Send size={13} className="text-white" />
              )}
            </button>
          </div>
          <p className="text-center text-white/20 text-[10px] mt-2 font-accent">
            Powered by Claude AI · bvnofficial.com
          </p>
        </div>
      </div>
    </>
  );
}
