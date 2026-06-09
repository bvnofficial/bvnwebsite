"use client";
import { useCourseProgressCount } from "@/lib/useProgress";

export function CourseProgressBadge({ slug, totalLessons }: { slug: string; totalLessons: number }) {
  const { count, pct } = useCourseProgressCount(slug, totalLessons);
  if (count === 0) return null;
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-white/35 font-accent mb-1">
        <span>{count}/{totalLessons} lessons</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 bg-white/8 rounded-full overflow-hidden">
        <div className="h-full bg-orange rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
