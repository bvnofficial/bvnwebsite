"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
}

export default function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2200,
  label,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
        setDone(true);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <div
      ref={ref}
      className="relative group text-center px-6 py-8 rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm
        hover:border-orange/30 transition-all duration-300 overflow-hidden"
      style={{ boxShadow: done ? "0 0 30px rgba(232,96,16,0.08)" : "none" }}
    >
      {/* Background glow on done */}
      <div
        className="absolute inset-0 transition-opacity duration-700 pointer-events-none rounded-2xl"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(232,96,16,0.1) 0%, transparent 70%)",
          opacity: done ? 1 : 0,
        }}
      />
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px transition-all duration-700"
        style={{
          width: done ? "80%" : "0%",
          background: "linear-gradient(90deg, transparent, #E86010, transparent)",
          boxShadow: "0 0 10px rgba(232,96,16,0.6)",
        }}
      />
      {/* Number */}
      <div
        className="relative font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-2 transition-all duration-300"
        style={{
          color: done ? "#E86010" : "#fff",
          textShadow: done ? "0 0 30px rgba(232,96,16,0.5)" : "none",
        }}
      >
        {prefix}{count}{suffix}
      </div>
      {/* Label */}
      <p className="relative text-white/50 font-accent font-semibold text-sm tracking-wide group-hover:text-white/70 transition-colors">
        {label}
      </p>
    </div>
  );
}
