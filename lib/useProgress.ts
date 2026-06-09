"use client";
import { useState, useEffect, useCallback } from "react";

export type LessonKey = string; // `${moduleIdx}-${lessonIdx}`

export function useProgress(slug: string) {
  const storageKey = `bvn-progress-${slug}`;
  const [completed, setCompleted] = useState<Set<LessonKey>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {}
    setLoaded(true);
  }, [storageKey]);

  const markComplete = useCallback((moduleIdx: number, lessonIdx: number) => {
    const key = `${moduleIdx}-${lessonIdx}`;
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(key);
      try { localStorage.setItem(storageKey, JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  }, [storageKey]);

  const toggleComplete = useCallback((moduleIdx: number, lessonIdx: number) => {
    const key = `${moduleIdx}-${lessonIdx}`;
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try { localStorage.setItem(storageKey, JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  }, [storageKey]);

  const isCompleted = useCallback((moduleIdx: number, lessonIdx: number) => {
    return completed.has(`${moduleIdx}-${lessonIdx}`);
  }, [completed]);

  return { completed, loaded, markComplete, toggleComplete, isCompleted };
}

export function useCourseProgressCount(slug: string, totalLessons: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`bvn-progress-${slug}`);
      if (raw) setCount(JSON.parse(raw).length);
    } catch {}
  }, [slug]);

  const pct = totalLessons > 0 ? Math.round((count / totalLessons) * 100) : 0;
  return { count, pct };
}
