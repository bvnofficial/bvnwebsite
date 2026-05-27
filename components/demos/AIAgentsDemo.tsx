"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

interface Message { role: "user" | "bot"; text: string; }

const autoReplies: Record<string, string> = {
  default: "Thanks for reaching out to BVN! I'm here to help. Could you tell me a bit more about what your business needs?",
  pricing: "Our plans start from $500/month for marketing and $600/month for operations automation. We also offer custom enterprise packages. Would you like me to schedule a free consultation with our team?",
  marketing: "BVN's Marketing branch covers Social Media Management, SEO, Digital Marketing, Email Marketing, Content, Video, Influencer Marketing, Web & App Development, and CRM Solutions. Which area interests you most?",
  operations: "Our Operations Automation services include CRM & Sales Automation, AI Agents, HR & Payroll, Time Tracking, Admin Automation, Analytics, and System Integrations. What's your biggest operational challenge?",
  contact: "You can reach our team at bvn@bvnofficial.com or call +639816556555. We typically respond within 24 hours. Would you like me to take down your details for a callback?",
  hello: "Hello! 👋 Welcome to BVN. I'm your AI assistant. I can help you with information about our marketing services, operations automation, pricing, or connecting you with our team. What can I help you with today?",
  hi: "Hi there! 👋 Great to have you here. I'm BVN's AI assistant. How can I help you today?",
  services: "BVN has two main service branches: 🎯 Marketing Automation (10 services) and ⚙️ Operations Automation (8 services). We're a Philippines-based agency serving businesses globally. What would you like to know more about?",
  crm: "Our CRM services cover both implementation and automation — from setting up HubSpot, Salesforce, or Zoho to full sales pipeline automation. Would you like details on our CRM packages?",
  seo: "Our SEO services include technical audits, keyword strategy, on-page optimization, link building, and local SEO. We've helped clients achieve 300-400% organic traffic growth. Want to know more?",
  social: "We manage your entire social media presence — strategy, content creation, scheduling, community management, and analytics across Facebook, Instagram, TikTok, LinkedIn, and more. What platforms are you currently on?",
};

function getReply(msg: string): string {
  const lower = msg.toLowerCase();
  for (const key of Object.keys(autoReplies)) {
    if (lower.includes(key)) return autoReplies[key];
  }
  return autoReplies.default;
}

export default function AIAgentsDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! 👋 I'm BVN's AI customer service agent. I can answer questions about our services, pricing, and help connect you with the right team. What can I help you with today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: "bot", text: getReply(userMsg) }]);
    }, 900 + Math.random() * 600);
  }

  const quickReplies = ["What services do you offer?", "Tell me about pricing", "I need marketing help", "Operations automation info"];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-orange/10 border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold">BVN AI Assistant</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[10px]">Online · Responds instantly</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "bot" && (
              <div className="w-6 h-6 rounded-full bg-orange/20 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={12} className="text-orange" />
              </div>
            )}
            <div className={`max-w-[80%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${m.role === "bot" ? "bg-white/8 text-white/80 rounded-tl-sm" : "bg-orange text-white rounded-tr-sm"}`}>
              {m.text}
            </div>
            {m.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                <User size={12} className="text-white/60" />
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex gap-2 items-center">
            <div className="w-6 h-6 rounded-full bg-orange/20 flex items-center justify-center">
              <Bot size={12} className="text-orange" />
            </div>
            <div className="bg-white/8 px-3 py-2.5 rounded-xl rounded-tl-sm flex gap-1">
              {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {quickReplies.map(q => (
          <button key={q} onClick={() => { setInput(q); }} className="px-2.5 py-1 bg-white/5 border border-white/15 rounded-full text-white/60 text-[11px] hover:bg-orange/10 hover:border-orange/30 hover:text-orange transition-colors">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t border-white/10">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Type your message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-orange/40" />
        <button onClick={send} className="w-9 h-9 bg-orange text-white rounded-lg flex items-center justify-center hover:bg-orange-light transition-colors">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
