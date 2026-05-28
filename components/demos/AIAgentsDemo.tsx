"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Zap } from "lucide-react";

interface Message { role: "user" | "bot"; text: string; timestamp: string; }

type Scenario = "support" | "lead" | "booking";

const scenarios: Record<Scenario, { label: string; icon: string; desc: string; greeting: string; quickReplies: string[]; replies: Record<string, string> }> = {
  support: {
    label: "Customer Support",
    icon: "🎧",
    desc: "24/7 automated support agent",
    greeting: "Hello! 👋 I'm BVN's AI support agent. I can help with billing questions, account issues, service inquiries, and more. How can I help you today?",
    quickReplies: ["What services do you offer?", "Tell me about pricing", "How do I get started?", "I need technical help"],
    replies: {
      default: "Thanks for reaching out! Let me connect you with the right information. Could you share a bit more detail about your question?",
      pricing: "Our pricing starts from ₱25,000/month for marketing services and ₱30,000/month for operations automation. We also offer bundled packages with savings up to 20%. Would you like a detailed quote?",
      services: "BVN offers two main service branches:\n\n🎯 **Marketing:** Social Media, SEO, Digital Ads, Email, Content, Video, Influencer, Web & App Dev, CRM Solutions\n\n⚙️ **Operations:** CRM Automation, AI Agents, HR & Payroll, Time Tracking, Admin, Analytics, Integrations\n\nWhich area interests you most?",
      started: "Getting started is easy! Here's what happens:\n\n1️⃣ Book a free 30-min consultation\n2️⃣ We audit your current systems\n3️⃣ We build a custom strategy\n4️⃣ We go live in 2-3 weeks\n\nWant me to schedule that call now?",
      technical: "For technical support, I can help with integration guides, API documentation, and troubleshooting. Could you describe the issue in more detail?",
      billing: "I can help with billing questions! Our invoices are sent monthly. For account changes or disputes, I'll escalate you to our finance team within 24 hours.",
      hello: "Hi there! 👋 Great to have you here. I'm BVN's AI assistant ready to help. What can I do for you today?",
      hi: "Hello! 😊 I'm here to help. What would you like to know about BVN's services?",
    },
  },
  lead: {
    label: "Lead Qualification",
    icon: "🎯",
    desc: "Qualifies prospects automatically",
    greeting: "Hi! I'm BVN's intelligent sales assistant. I'll ask you a few quick questions to understand your business needs and match you with the right solution. Ready to begin?",
    quickReplies: ["Yes, let's start", "Tell me about your process", "What's the price range?", "How long does it take?"],
    replies: {
      default: "That's great to know! To better match you with our services, what's your biggest business challenge right now — growing your online presence, automating operations, or managing customer relationships?",
      "yes": "Perfect! First question: What industry is your business in? (e.g., retail, professional services, e-commerce, F&B, etc.)",
      process: "Our qualification process takes about 10 minutes. We'll learn about your business size, goals, current tools, and budget — then we'll recommend the exact services that fit. No fluff, just clarity. Shall we start?",
      price: "Our services range from ₱25,000 to ₱150,000+/month depending on scope. We also offer project-based pricing. What's your approximate monthly marketing or operations budget?",
      time: "Most clients see initial results within 30 days. Full ROI is typically realized within 90 days. We've helped clients achieve 300%+ growth in under 6 months. What timeline are you working with?",
      marketing: "Marketing is a great area to focus on! Are you looking more at brand awareness (SEO, social, content) or direct response (paid ads, email, conversion optimization)?",
      operations: "Operations automation can save 10-20 hours/week per team member. Are you most interested in CRM, HR/payroll, admin workflows, or system integrations?",
      small: "We work with businesses of all sizes! For SMEs, we have growth-focused packages starting at ₱25,000/month. What team size are you working with?",
      hello: "Hi there! Ready to find the perfect BVN solution for your business?",
      hi: "Hello! Let's find out how BVN can help grow your business. What's your biggest challenge right now?",
    },
  },
  booking: {
    label: "Appointment Booking",
    icon: "📅",
    desc: "Books meetings on autopilot",
    greeting: "Hello! I'm BVN's scheduling assistant. I can book you a free consultation with our team. It only takes 2 minutes. What's your name to get started?",
    quickReplies: ["Book a consultation", "What time slots are available?", "How long is the meeting?", "Can I meet online?"],
    replies: {
      default: "Got it! Let me check our team's availability for a free 30-minute strategy session. What day works best for you — this week or next week?",
      book: "Great! We have the following slots available:\n\n📅 **This Week:**\n• Thursday, Jun 12 at 10:00 AM\n• Thursday, Jun 12 at 2:00 PM\n• Friday, Jun 13 at 11:00 AM\n\n📅 **Next Week:**\n• Monday, Jun 16 at 9:00 AM\n• Tuesday, Jun 17 at 3:00 PM\n\nWhich works best for you?",
      slots: "Our available slots for the next 7 days:\n\n• Thu Jun 12: 10AM, 2PM\n• Fri Jun 13: 11AM, 4PM\n• Mon Jun 16: 9AM, 1PM\n• Tue Jun 17: 3PM\n• Wed Jun 18: 10AM, 2PM\n\nPick any of these and I'll lock it in!",
      long: "Our free strategy consultation is 30 minutes. We'll cover:\n✅ Understanding your goals\n✅ Auditing your current setup\n✅ Recommending the right services\n✅ Providing a ballpark budget\n\nNo hard selling — just honest advice. Want to book now?",
      online: "Absolutely! All our consultations are available via Zoom or Google Meet. You'll receive a calendar invite with the link after booking. Which platform do you prefer?",
      thursday: "Perfect! I'll book you for Thursday, June 12 at 10:00 AM Manila time. Could I get your:\n1. Full name\n2. Email address\n3. Company name\n\nI'll send a calendar invite right away!",
      friday: "Great choice! Friday June 13 at 11:00 AM works perfectly. Please share your name, email, and company so I can send the calendar invite!",
      monday: "Excellent! Monday mornings are great for strategy sessions. I'll book June 16 at 9:00 AM for you. Can I get your name and email to complete the booking?",
      hello: "Hi! Ready to book your free BVN consultation?",
      hi: "Hello! Let me help you schedule a free strategy call with our team. What day works best for you?",
    },
  },
};

function getTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function getReply(scenario: Scenario, msg: string): string {
  const lower = msg.toLowerCase();
  const s = scenarios[scenario];
  for (const key of Object.keys(s.replies)) {
    if (key !== "default" && lower.includes(key)) return s.replies[key];
  }
  return s.replies.default;
}

export default function AIAgentsDemo() {
  const [activeScenario, setActiveScenario] = useState<Scenario>("support");
  const [chats, setChats] = useState<Record<Scenario, Message[]>>({
    support: [{ role: "bot", text: scenarios.support.greeting, timestamp: getTime() }],
    lead: [{ role: "bot", text: scenarios.lead.greeting, timestamp: getTime() }],
    booking: [{ role: "bot", text: scenarios.booking.greeting, timestamp: getTime() }],
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = chats[activeScenario];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function switchScenario(s: Scenario) {
    setActiveScenario(s);
    setInput("");
  }

  function send(text?: string) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    const userMsg: Message = { role: "user", text: msg, timestamp: getTime() };
    setChats((prev) => ({ ...prev, [activeScenario]: [...prev[activeScenario], userMsg] }));
    setTyping(true);
    setTimeout(() => {
      const reply = getReply(activeScenario, msg);
      const botMsg: Message = { role: "bot", text: reply, timestamp: getTime() };
      setChats((prev) => ({ ...prev, [activeScenario]: [...prev[activeScenario], botMsg] }));
      setTyping(false);
    }, 800 + Math.random() * 700);
  }

  return (
    <div className="space-y-4">
      {/* Scenario selector */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(scenarios) as [Scenario, typeof scenarios.support][]).map(([key, s]) => (
          <button key={key} onClick={() => switchScenario(key)}
            className={`text-left p-3 rounded-xl border transition-all ${activeScenario === key ? "border-orange/50 bg-orange/8" : "border-white/10 bg-white/3 hover:bg-white/8"}`}>
            <div className="text-lg mb-1">{s.icon}</div>
            <div className="text-white/80 text-xs font-bold">{s.label}</div>
            <div className="text-white/35 text-[10px] mt-0.5">{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-orange/10 border-b border-white/10">
          <div className="w-9 h-9 rounded-full bg-orange flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">BVN AI · {scenarios[activeScenario].label}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-[10px]">Online · Responds instantly</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
            <Zap size={10} className="text-orange" />
            <span className="text-white/50 text-[10px]">AI-powered</span>
          </div>
        </div>

        {/* Messages */}
        <div className="h-64 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "bot" && (
                <div className="w-7 h-7 rounded-full bg-orange/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={13} className="text-orange" />
                </div>
              )}
              <div className="max-w-[80%] space-y-0.5">
                <div className={`px-3 py-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-line ${m.role === "bot" ? "bg-white/8 text-white/80 rounded-tl-sm" : "bg-orange text-white rounded-tr-sm"}`}>
                  {m.text}
                </div>
                <p className={`text-[9px] text-white/20 ${m.role === "user" ? "text-right" : "text-left"}`}>{m.timestamp}</p>
              </div>
              {m.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={12} className="text-white/50" />
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex gap-2 items-center">
              <div className="w-7 h-7 rounded-full bg-orange/20 flex items-center justify-center">
                <Bot size={13} className="text-orange" />
              </div>
              <div className="bg-white/8 px-3 py-2.5 rounded-xl rounded-tl-sm flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {scenarios[activeScenario].quickReplies.map((q) => (
            <button key={q} onClick={() => send(q)}
              className="px-2.5 py-1 bg-white/5 border border-white/15 rounded-full text-white/55 text-[11px] hover:bg-orange/10 hover:border-orange/30 hover:text-orange transition-colors">
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 p-3 border-t border-white/10">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Message ${scenarios[activeScenario].label} agent...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-orange/40" />
          <button onClick={() => send()}
            className="w-9 h-9 bg-orange text-white rounded-xl flex items-center justify-center hover:bg-orange-light transition-colors">
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Conversations / Day", val: "1,240", sub: "Automated" },
          { label: "Resolution Rate", val: "87%", sub: "Without human handoff" },
          { label: "Avg Response Time", val: "0.8s", sub: "vs 4hrs human avg" },
        ].map(({ label, val, sub }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="font-heading font-extrabold text-xl text-white">{val}</div>
            <div className="text-white/50 text-[10px] font-semibold mt-0.5">{label}</div>
            <div className="text-white/25 text-[9px]">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
