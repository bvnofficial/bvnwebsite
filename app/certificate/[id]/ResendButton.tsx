"use client";

import { useState } from "react";

export default function ResendButton({ id }: { id: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function resend() {
    setState("sending");
    setMsg("");
    try {
      const res = await fetch(`/api/certificate/${id}/resend`, { method: "POST" });
      const d = await res.json();
      if (res.ok && d.ok) {
        setState("sent");
        setMsg(d.email ? `Sent to ${d.email}` : "Email sent!");
      } else {
        setState("error");
        setMsg(d.error || "Could not send email.");
      }
    } catch {
      setState("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={resend}
        disabled={state === "sending" || state === "sent"}
        className="w-full sm:w-auto text-center px-6 py-3 rounded-xl border border-white/15 text-white/80 font-heading font-semibold text-sm hover:bg-white/5 disabled:opacity-60 transition-all"
      >
        {state === "sending" ? "Sending…" : state === "sent" ? "✓ Emailed" : "✉ Email me this certificate"}
      </button>
      {msg && (
        <p className={`text-xs mt-2 ${state === "error" ? "text-red-400" : "text-emerald-400"}`}>{msg}</p>
      )}
    </div>
  );
}
