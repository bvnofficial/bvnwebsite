import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-14",
        centered && "text-center mx-auto max-w-2xl",
        className
      )}
    >
      {label && (
        <span
          className="inline-block font-accent font-semibold text-xs tracking-[0.2em] uppercase
            text-orange mb-4 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20"
        >
          {label}
        </span>
      )}
      <h2
        className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {subtitle && (
        <p className="text-white/60 text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
