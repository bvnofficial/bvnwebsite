"use client";
import { FileSignature, ArrowLeft } from "lucide-react";
import Link from "next/link";
export default function Page() {
  return (
    <div className="min-h-screen bg-navy-dark flex flex-col">
      <div className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/10 bg-navy-dark/80 backdrop-blur-xl">
        <Link href="/apps" className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-accent font-semibold transition-colors"><ArrowLeft size={16}/> Back to Apps</Link>
        <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-orange/20 flex items-center justify-center"><FileSignature size={14} className="text-orange"/></div><span className="text-white/80 text-sm font-accent font-semibold">Proposal Generator</span></div>
        <div className="w-24"/>
      </div>
      <iframe src="/proposal-generator.html" className="flex-1 w-full border-0" style={{minHeight:"calc(100vh - 57px)"}} title="Client Proposal Generator"/>
    </div>
  );
}
