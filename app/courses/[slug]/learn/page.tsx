"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, Circle, ChevronDown, ChevronRight,
  ChevronLeft, PlayCircle, Clock, Menu, X, BookOpen, Award,
} from "lucide-react";
import { getCourse, colorStyles } from "@/lib/courses";
import { getLessonContent } from "@/lib/course-content";
import { useProgress } from "@/lib/useProgress";

// ── Simple markdown renderer ──────────────────────────────────────────────
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^## (.+)$/gm, '<h2 class="text-white font-heading font-bold text-xl mt-8 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-white font-heading font-semibold text-base mt-6 mb-2">$1</h3>')
    .replace(/^- (.+)$/gm, '<li class="flex gap-2 items-start"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange shrink-0"></span><span>$1</span></li>')
    .replace(/(<li[\s\S]*?<\/li>\n?)+/g, (m) => `<ul class="space-y-2 my-3 text-white/70 text-sm leading-relaxed">${m}</ul>`)
    .replace(/\n\n/g, '</p><p class="text-white/70 text-sm leading-relaxed my-3">');
}

// ── Parsed sections from streamed response ────────────────────────────────
function parseSections(raw: string) {
  const get = (tag: string) => {
    const re = new RegExp(`##${tag}##([\\s\\S]*?)(?=##[A-Z]+##|$)`);
    return raw.match(re)?.[1]?.trim() ?? "";
  };
  return {
    overview: get("OVERVIEW"),
    concepts: get("CONCEPTS"),
    content: get("CONTENT"),
    exercise: get("EXERCISE"),
    summary: get("SUMMARY"),
    raw: raw,
  };
}

// ── Lesson content renderer ───────────────────────────────────────────────
function LessonContent({ text, isLoading }: { text: string; isLoading: boolean }) {
  const sections = parseSections(text);
  const hasStructure = text.includes("##OVERVIEW##");

  if (isLoading && !text) {
    return (
      <div className="space-y-4 animate-pulse">
        {[80, 60, 95, 70, 85, 50].map((w, i) => (
          <div key={i} className="h-4 rounded-full bg-white/5" style={{ width: `${w}%` }} />
        ))}
      </div>
    );
  }

  if (!hasStructure) {
    return (
      <div
        className="text-white/70 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: `<p class="text-white/70 text-sm leading-relaxed my-3">${renderMarkdown(text)}</p>`,
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {sections.overview && (
        <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
          <p className="text-xs font-accent font-semibold uppercase tracking-widest text-white/40 mb-2">Overview</p>
          <p className="text-white/80 text-sm leading-relaxed">{sections.overview}</p>
        </div>
      )}

      {sections.concepts && (
        <div>
          <p className="text-xs font-accent font-semibold uppercase tracking-widest text-white/40 mb-3">Key Concepts</p>
          <div
            className="space-y-2"
            dangerouslySetInnerHTML={{
              __html: sections.concepts
                .split("\n")
                .filter(Boolean)
                .map((line) =>
                  `<div class="flex gap-2 text-sm"><span class="text-white/70 leading-relaxed">${renderMarkdown(line)}</span></div>`
                )
                .join(""),
            }}
          />
        </div>
      )}

      {sections.content && (
        <div>
          <p className="text-xs font-accent font-semibold uppercase tracking-widest text-white/40 mb-3">Lesson</p>
          <div
            className="prose-lesson"
            dangerouslySetInnerHTML={{
              __html: `<p class="text-white/70 text-sm leading-relaxed my-3">${renderMarkdown(sections.content)}</p>`,
            }}
          />
        </div>
      )}

      {sections.exercise && (
        <div className="bg-orange/5 border border-orange/20 rounded-xl p-5">
          <p className="text-xs font-accent font-semibold uppercase tracking-widest text-orange mb-3">Hands-On Exercise</p>
          <div
            dangerouslySetInnerHTML={{
              __html: `<p class="text-white/75 text-sm leading-relaxed my-3">${renderMarkdown(sections.exercise)}</p>`,
            }}
          />
        </div>
      )}

      {sections.summary && (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <p className="text-xs font-accent font-semibold uppercase tracking-widest text-white/40 mb-3">Key Takeaways</p>
          <div
            dangerouslySetInnerHTML={{
              __html: sections.summary
                .split("\n")
                .filter(Boolean)
                .map((line) => {
                  const clean = line.replace(/^[-•]\s*/, "");
                  return `<div class="flex gap-2 items-start mb-2">
                    <svg class="mt-1 shrink-0 w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-white/70 text-sm leading-relaxed">${renderMarkdown(clean)}</span>
                  </div>`;
                })
                .join(""),
            }}
          />
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
          Generating…
        </div>
      )}
    </div>
  );
}

// ── Main learn page (wrapped in Suspense below) ───────────────────────────
function LearnPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = typeof params.slug === "string" ? params.slug : "";
  const course = getCourse(slug);

  const moduleIdx = Math.max(0, parseInt(searchParams.get("m") ?? "0", 10));
  const lessonIdx = Math.max(0, parseInt(searchParams.get("l") ?? "0", 10));

  const { isCompleted, markComplete, toggleComplete, loaded } = useProgress(slug);

  const [lessonText, setLessonText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openModules, setOpenModules] = useState<Set<number>>(new Set([moduleIdx]));
  const abortRef = useRef<AbortController | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Derive values safely — hooks must all run before any early return
  const styles = course ? colorStyles[course.color] : colorStyles["orange"];
  const currentModule = course?.modules[moduleIdx];
  const currentLesson = currentModule?.lessons[lessonIdx];

  // Flat list of all lessons for prev/next
  const allLessons: { mIdx: number; lIdx: number }[] = [];
  if (course) {
    course.modules.forEach((mod, mIdx) =>
      mod.lessons.forEach((_, lIdx) => allLessons.push({ mIdx, lIdx }))
    );
  }
  const currentFlatIdx = allLessons.findIndex(
    (l) => l.mIdx === moduleIdx && l.lIdx === lessonIdx
  );
  const prevLesson = currentFlatIdx > 0 ? allLessons[currentFlatIdx - 1] : null;
  const nextLesson = currentFlatIdx < allLessons.length - 1 ? allLessons[currentFlatIdx + 1] : null;

  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => isCompleted(l.mIdx, l.lIdx)).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Navigate to a lesson
  const goTo = (mIdx: number, lIdx: number) => {
    setOpenModules((prev) => { const next = new Set(prev); next.add(mIdx); return next; });
    router.push(`/courses/${slug}/learn?m=${mIdx}&l=${lIdx}`);
    setSidebarOpen(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  // Load lesson content — use static content if available, otherwise stream from AI
  const loadLesson = useCallback(async () => {
    if (!currentModule || !currentLesson) return;
    if (abortRef.current) abortRef.current.abort();

    setLessonText("");

    // 1. Inline static content on the lesson object — render instantly
    if (currentLesson.content) {
      setLessonText(currentLesson.content);
      setIsLoading(false);
      return;
    }

    // 2. Pre-written static content from the course-content registry
    const staticBody = getLessonContent(slug, moduleIdx, lessonIdx);
    if (staticBody) {
      setLessonText(staticBody);
      setIsLoading(false);
      return;
    }

    // 3. Optional AI fallback (only if configured) — fails gracefully
    const ac = new AbortController();
    abortRef.current = ac;
    setIsLoading(true);

    try {
      const res = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
        body: JSON.stringify({
          courseTitle: course.title,
          moduleTitle: currentModule.title,
          lessonTitle: currentLesson.title,
          lessonDuration: currentLesson.duration,
          skills: course.skills,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to load lesson.");
      }
      const reader = res.body?.getReader();
      if (!reader) return;

      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setLessonText((prev) => prev + dec.decode(value));
      }
    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError") {
        setLessonText(
          "The written guide for this lesson is being finalized and will be available here shortly. The lesson title, duration, and objectives above outline exactly what this lesson covers — check back soon for the full walkthrough."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [course, currentModule, currentLesson, slug, moduleIdx, lessonIdx]);

  useEffect(() => {
    loadLesson();
    return () => abortRef.current?.abort();
  }, [moduleIdx, lessonIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleModule = (idx: number) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Early return AFTER all hooks
  if (!course) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center text-white/50">
        Course not found. <Link href="/courses" className="text-orange ml-2">Back to courses</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C18] flex flex-col">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-40 bg-navy-dark/95 backdrop-blur border-b border-white/8">
        {/* Progress bar */}
        <div className="h-0.5 bg-white/5">
          <div
            className={`h-full transition-all duration-500 ${styles.bar}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/50 hover:text-white transition-colors shrink-0"
            >
              <Menu size={20} />
            </button>
            <Link
              href={`/courses/${slug}`}
              className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm font-accent transition-colors shrink-0"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Course</span>
            </Link>
            <span className="text-white/20 hidden sm:inline">·</span>
            <span className="text-white/60 text-sm font-heading font-semibold truncate hidden sm:block">
              {course.title}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-white/40 text-xs font-accent">
              {completedCount}/{totalLessons} complete
            </span>
            <div className={`text-xs font-accent font-semibold px-2.5 py-1 rounded-full border ${styles.badge ?? "border-orange/20 text-orange bg-orange/10"}`}>
              {progressPct}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>
        {/* ── Sidebar overlay (mobile) ── */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-navy-dark border-r border-white/8 overflow-y-auto">
              <SidebarContent
                course={course}
                styles={styles}
                slug={slug}
                moduleIdx={moduleIdx}
                lessonIdx={lessonIdx}
                openModules={openModules}
                toggleModule={toggleModule}
                goTo={goTo}
                isCompleted={isCompleted}
                completedCount={completedCount}
                totalLessons={totalLessons}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 bg-navy-dark border-r border-white/8 overflow-y-auto">
          <SidebarContent
            course={course}
            styles={styles}
            slug={slug}
            moduleIdx={moduleIdx}
            lessonIdx={lessonIdx}
            openModules={openModules}
            toggleModule={toggleModule}
            goTo={goTo}
            isCompleted={isCompleted}
            completedCount={completedCount}
            totalLessons={totalLessons}
          />
        </aside>

        {/* ── Main content ── */}
        <main ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
            {/* Lesson header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-accent text-white/35 mb-3">
                <span>Module {currentModule?.number}</span>
                <ChevronRight size={12} />
                <span>{currentModule?.title}</span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-3">
                {currentLesson?.title}
              </h1>
              <div className="flex items-center gap-4 text-white/40 text-xs font-accent">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} /> {currentLesson?.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <PlayCircle size={12} />
                  Lesson {lessonIdx + 1} of {currentModule?.lessons.length}
                </span>
                {loaded && isCompleted(moduleIdx, lessonIdx) && (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 size={12} /> Completed
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <LessonContent text={lessonText} isLoading={isLoading} />

            {/* Bottom nav */}
            <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Mark complete */}
              <button
                onClick={() => toggleComplete(moduleIdx, lessonIdx)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-heading font-semibold text-sm border transition-all duration-200 ${
                  loaded && isCompleted(moduleIdx, lessonIdx)
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/5"
                    : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {loaded && isCompleted(moduleIdx, lessonIdx) ? (
                  <><CheckCircle2 size={15} /> Completed — undo?</>
                ) : (
                  <><Circle size={15} /> Mark Complete</>
                )}
              </button>

              <div className="flex items-center gap-3 sm:ml-auto">
                {prevLesson && (
                  <button
                    onClick={() => goTo(prevLesson.mIdx, prevLesson.lIdx)}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-sm font-heading font-semibold transition-all"
                  >
                    <ChevronLeft size={15} /> Previous
                  </button>
                )}
                {nextLesson ? (
                  <button
                    onClick={() => {
                      if (!isCompleted(moduleIdx, lessonIdx)) markComplete(moduleIdx, lessonIdx);
                      goTo(nextLesson.mIdx, nextLesson.lIdx);
                    }}
                    className={`flex items-center gap-1.5 px-5 py-3 rounded-xl font-heading font-semibold text-sm text-white transition-all
                      bg-orange shadow-[0_0_20px_rgba(232,96,16,0.3)] hover:bg-orange-light hover:shadow-[0_0_28px_rgba(232,96,16,0.5)] active:scale-95`}
                  >
                    Next Lesson <ChevronRight size={15} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!isCompleted(moduleIdx, lessonIdx)) markComplete(moduleIdx, lessonIdx);
                    }}
                    className="flex items-center gap-1.5 px-5 py-3 rounded-xl font-heading font-semibold text-sm bg-emerald-500 text-white hover:bg-emerald-400 active:scale-95 transition-all"
                  >
                    <Award size={15} /> Finish Course
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Sidebar component ─────────────────────────────────────────────────────
type SidebarProps = {
  course: ReturnType<typeof getCourse> & object;
  styles: Record<string, string>;
  slug: string;
  moduleIdx: number;
  lessonIdx: number;
  openModules: Set<number>;
  toggleModule: (idx: number) => void;
  goTo: (mIdx: number, lIdx: number) => void;
  isCompleted: (mIdx: number, lIdx: number) => boolean;
  completedCount: number;
  totalLessons: number;
  onClose?: () => void;
};

function SidebarContent({
  course, styles, moduleIdx, lessonIdx, openModules,
  toggleModule, goTo, isCompleted, completedCount, totalLessons, onClose,
}: SidebarProps) {
  if (!course) return null;
  return (
    <div className="flex flex-col h-full">
      {/* Sidebar header */}
      <div className="p-5 border-b border-white/8 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base ${styles.icon}`}>
            {course.icon}
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X size={18} />
            </button>
          )}
        </div>
        <h2 className="font-heading font-bold text-white text-sm leading-snug mb-3">
          {course.title}
        </h2>
        <div className="flex items-center justify-between text-xs text-white/40 font-accent mb-2">
          <span className="flex items-center gap-1"><BookOpen size={11} /> {completedCount}/{totalLessons}</span>
          <span>{Math.round((completedCount / totalLessons) * 100)}% complete</span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
            style={{ width: `${totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}%` }}
          />
        </div>
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto py-2">
        {course.modules.map((mod, mIdx) => {
          const isModOpen = openModules.has(mIdx);
          const modCompleted = mod.lessons.filter((_, lIdx) => isCompleted(mIdx, lIdx)).length;
          return (
            <div key={mod.number} className="border-b border-white/5 last:border-0">
              <button
                onClick={() => toggleModule(mIdx)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-heading font-bold shrink-0 ${
                    modCompleted === mod.lessons.length
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : styles.icon
                  }`}>
                    {modCompleted === mod.lessons.length ? "✓" : mod.number}
                  </div>
                  <span className="text-white/70 text-xs font-heading font-semibold truncate">{mod.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-white/30 text-xs">{modCompleted}/{mod.lessons.length}</span>
                  <ChevronDown
                    size={13}
                    className={`text-white/30 transition-transform duration-200 ${isModOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isModOpen && (
                <div className="pb-1">
                  {mod.lessons.map((lesson, lIdx) => {
                    const active = mIdx === moduleIdx && lIdx === lessonIdx;
                    const done = isCompleted(mIdx, lIdx);
                    return (
                      <button
                        key={lIdx}
                        onClick={() => goTo(mIdx, lIdx)}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${
                          active
                            ? `bg-white/[0.07] border-l-2 ${styles.bar?.replace("bg-", "border-")}`
                            : "hover:bg-white/[0.04] border-l-2 border-transparent"
                        }`}
                      >
                        <div className="shrink-0">
                          {done ? (
                            <CheckCircle2 size={13} className="text-emerald-400" />
                          ) : active ? (
                            <PlayCircle size={13} className={styles.heading} />
                          ) : (
                            <Circle size={13} className="text-white/20" />
                          )}
                        </div>
                        <span className={`text-xs leading-snug flex-1 min-w-0 ${
                          active ? "text-white font-semibold" : done ? "text-white/50" : "text-white/55"
                        }`}>
                          {lesson.title}
                        </span>
                        <span className="text-white/25 text-xs shrink-0">{lesson.duration}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Export (Suspense required for useSearchParams) ────────────────────────
export default function LearnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080C18] flex items-center justify-center">
        <div className="text-white/30 text-sm font-accent animate-pulse">Loading lesson…</div>
      </div>
    }>
      <LearnPageInner />
    </Suspense>
  );
}
