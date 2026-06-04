import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'EQ 80th Birthday',
  robots: { index: false, follow: false },
};

const DRIVE_ID = "1EN1iANtRzyTXlQ7gv_P3Xc0mUXH6YNzu";

export default function EQFPage() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#06060c] flex flex-col items-center justify-center overflow-hidden">

      {/* Top gold rule */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />

      {/* Header */}
      <div className="text-center mb-5 px-6">
        <p className="text-[#d4af37] tracking-[6px] text-[10px] uppercase mb-3 font-sans">
          A Celebration of Life
        </p>
        <h1
          className="text-white font-serif tracking-widest"
          style={{ fontSize: "clamp(18px, 3.5vw, 34px)" }}
        >
          PMGEN Efren &ldquo;EQ&rdquo; Fernandez
        </h1>
        <p className="text-[#777] text-[12px] tracking-[5px] mt-1 uppercase font-sans">
          80th Birthday
        </p>
      </div>

      {/* Video */}
      <div
        className="rounded-xl overflow-hidden bg-black border border-[#1c1c2e]"
        style={{
          width: "min(92vw, 960px)",
          aspectRatio: "16/9",
          boxShadow: "0 0 80px rgba(212,175,55,0.10), 0 0 0 1px rgba(212,175,55,0.08)",
        }}
      >
        <iframe
          src={`https://drive.google.com/file/d/${DRIVE_ID}/preview`}
          width="100%"
          height="100%"
          allow="autoplay"
          allowFullScreen
          style={{ border: "none", display: "block" }}
        />
      </div>

      {/* Footer */}
      <p className="text-[#1e1e2e] text-[10px] tracking-[5px] mt-5 uppercase font-sans select-none">
        With Love From The Family
      </p>

      {/* Bottom gold rule */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />

    </div>
  );
}
