"use client";

import Link from "next/link";
import { Bluetooth, Shield, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";

export default function TrackerDetectorPage() {
  return (
    <div className="min-h-screen bg-navy-dark pt-24 pb-16 px-6">
      <div className="max-w-lg mx-auto">

        {/* Icon + Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
            <Bluetooth size={36} className="text-blue-400" />
          </div>
          <span className="inline-block font-accent font-semibold text-xs tracking-[0.2em] uppercase
            text-blue-400 mb-3 px-3 py-1.5 rounded-full bg-blue-400/10 border border-blue-400/20">
            Free Tool
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white mb-3">
            BVN Tracker Detector
          </h1>
          <p className="text-white/60 text-base leading-relaxed">
            Scan for hidden Bluetooth trackers near you. Detects AirTags, Tile, Samsung SmartTags and unknown BLE tracking devices.
          </p>
        </div>

        {/* Requirements */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <h2 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-widest">Requirements</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span className="text-white/70 text-sm">Google Chrome (Desktop or Android)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span className="text-white/70 text-sm">Bluetooth enabled on your device</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span className="text-white/70 text-sm">HTTPS connection (this site is)</span>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
              <span className="text-white/70 text-sm">Does NOT work on Safari or Firefox (Apple restriction)</span>
            </div>
          </div>
        </div>

        {/* What it detects */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <h2 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-widest">Detects</h2>
          <div className="grid grid-cols-2 gap-2">
            {["🎯 Apple AirTag","⬛ Tile Tracker","🔵 Samsung SmartTag","🟣 Chipolo","🥜 Nut/Nutale Tag","❓ Unknown BLE Trackers"].map(item => (
              <div key={item} className="text-white/60 text-sm flex items-center gap-2 bg-white/3 rounded-lg px-3 py-2">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Launch button */}
        <a
          href="/tracker-detector.html"
          className="flex items-center justify-center gap-3 w-full py-4 px-6
            bg-blue-500 hover:bg-blue-400 text-white font-heading font-bold text-lg
            rounded-2xl shadow-[0_0_32px_rgba(59,130,246,0.4)]
            hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]
            transition-all duration-200 mb-4"
        >
          <Bluetooth size={22} />
          Launch Tracker Detector
          <ExternalLink size={16} className="opacity-70" />
        </a>

        <p className="text-center text-white/30 text-xs">
          All scanning happens locally on your device. Nothing is uploaded or stored on our servers.
        </p>

        <div className="mt-8 text-center">
          <Link href="/apps" className="text-white/40 hover:text-white/70 text-sm transition-colors">
            ← Back to Apps
          </Link>
        </div>

      </div>
    </div>
  );
}
