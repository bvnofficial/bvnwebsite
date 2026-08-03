"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Sparkles, Volume2, VolumeX, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

// Minimal Web Speech typings (not in the standard TS lib).
type SRResult = ArrayLike<{ transcript: string }> & { isFinal: boolean };
type SREvent = { resultIndex: number; results: ArrayLike<SRResult> };
type SR = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SREvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: unknown) => void) | null;
  start: () => void;
  stop: () => void;
};
type SRCtor = new () => SR;

export default function BvnAssistant() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [speakBack, setSpeakBack] = useState(false);
  const [supported, setSupported] = useState(false);
  const [err, setErr] = useState("");

  const recogRef = useRef<SR | null>(null);
  const listeningRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, interim]);

  function speak(text: string) {
    if (!speakBack || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || sending) return;
    setErr("");
    const next: Msg[] = [...messages, { role: "user", content: q }, { role: "assistant", content: "" }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/command/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m.content || m.role === "user") }),
      });
      if (!res.ok || !res.body) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Request failed.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
      speak(acc);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
      setMessages((prev) => prev.slice(0, -1)); // drop the empty assistant bubble
    } finally {
      setSending(false);
    }
  }

  function handleTranscript(text: string) {
    const lower = text.toLowerCase();
    const i = lower.indexOf("bvn");
    if (i === -1) return; // wake word not heard, ignore
    const query = text.slice(i + 3).replace(/^[\s,.:;!?]+/, "").trim();
    if (query) send(query);
  }

  function startVoice() {
    const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e: SREvent) => {
      let finalText = "";
      let interimText = "";
      for (let k = e.resultIndex; k < e.results.length; k++) {
        const res = e.results[k];
        const t = res[0]?.transcript || "";
        if (res.isFinal) finalText += t;
        else interimText += t;
      }
      setInterim(interimText);
      if (finalText) {
        setInterim("");
        handleTranscript(finalText);
      }
    };
    r.onerror = () => {};
    r.onend = () => {
      if (listeningRef.current) {
        try { r.start(); } catch {}
      }
    };
    recogRef.current = r;
    listeningRef.current = true;
    setListening(true);
    try { r.start(); } catch {}
  }

  function stopVoice() {
    listeningRef.current = false;
    setListening(false);
    setInterim("");
    try { recogRef.current?.stop(); } catch {}
  }

  return (
    <section className="mt-6 bg-gradient-to-br from-orange/10 to-[#111827] border border-orange/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-sm font-heading font-bold text-white">
          <Sparkles size={15} className="text-orange" /> Talk to BVN
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeakBack((v) => !v)}
            title="Read replies aloud"
            className={`p-2 rounded-lg border transition-colors ${speakBack ? "bg-orange/15 border-orange/30 text-orange" : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"}`}
          >
            {speakBack ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          {supported && (
            <button
              onClick={() => (listening ? stopVoice() : startVoice())}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-accent font-semibold transition-colors ${
                listening
                  ? "bg-red-500/15 border-red-500/30 text-red-300"
                  : "bg-orange/15 border-orange/30 text-orange hover:bg-orange/25"
              }`}
            >
              {listening ? <><MicOff size={14} /> Stop</> : <><Mic size={14} /> Listen</>}
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-white/50 font-body mb-3">
        {supported
          ? <>Say <span className="text-orange font-semibold">&quot;BVN&quot;</span> then your question, or type below. Ask about clients, jobs, or what to do next.</>
          : <>Voice is not supported in this browser. Type below to chat with BVN.</>}
      </p>

      {/* Transcript */}
      <div ref={scrollRef} className="max-h-72 overflow-y-auto space-y-2.5 mb-3 pr-1">
        {messages.length === 0 && !interim && (
          <p className="text-sm text-white/30 font-body py-6 text-center">No conversation yet.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm font-body leading-relaxed ${
                m.role === "user"
                  ? "bg-orange/20 text-white"
                  : "bg-white/[0.04] border border-white/10 text-white/85"
              }`}
            >
              {m.content || (sending && i === messages.length - 1 ? <Loader2 size={14} className="animate-spin text-white/50" /> : "")}
            </div>
          </div>
        ))}
        {interim && (
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl px-3.5 py-2 text-sm font-body italic text-white/40 bg-white/[0.02] border border-white/5">
              {interim}
            </div>
          </div>
        )}
      </div>

      {listening && (
        <div className="flex items-center gap-2 text-[11px] font-accent text-orange mb-2">
          <span className="w-2 h-2 rounded-full bg-orange animate-pulse" /> Listening for &quot;BVN&quot;…
        </div>
      )}
      {err && <p className="text-red-300 text-xs font-body mb-2">{err}</p>}

      {/* Text input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex items-center gap-2 rounded-xl bg-black/20 border border-white/10 px-3 py-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask BVN anything..."
          className="flex-1 bg-transparent text-sm text-white placeholder-white/30 font-body focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange text-white disabled:opacity-40 hover:bg-orange-light transition-all"
        >
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </form>
    </section>
  );
}
