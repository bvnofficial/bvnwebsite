"use client";

import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  animate?: boolean;
}

export default function GridBackground({
  className,
  children,
  animate = false,
}: GridBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Grid layer */}
      <div
        className={cn("absolute inset-0 grid-bg pointer-events-none", {
          "animate-grid": animate,
        })}
      />
      {/* Radial vignette to fade grid at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, #0A0F1E 100%)",
        }}
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
