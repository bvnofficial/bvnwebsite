import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface GlowButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "filled" | "outline";
  showArrow?: boolean;
  className?: string;
  external?: boolean;
}

export default function GlowButton({
  href,
  children,
  variant = "filled",
  showArrow = false,
  className,
  external = false,
}: GlowButtonProps) {
  const baseClasses =
    "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-heading font-semibold text-sm transition-all duration-200";

  const variantClasses = {
    filled:
      "bg-orange text-white shadow-[0_0_20px_rgba(232,96,16,0.4)] hover:bg-orange-light hover:shadow-[0_0_32px_rgba(232,96,16,0.6)] active:scale-95",
    outline:
      "border border-white/30 text-white hover:bg-white/10 hover:border-white/50 active:scale-95",
  };

  const classes = cn(baseClasses, variantClasses[variant], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {showArrow && <ArrowRight size={16} />}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      {showArrow && <ArrowRight size={16} />}
    </Link>
  );
}
