// Pre-written, fully static lesson content so courses never depend on an
// external AI API. Each course exports a 2D array: module index → lesson
// index → the lesson body (in the ##OVERVIEW## / ##CONCEPTS## / ##CONTENT## /
// ##EXERCISE## / ##SUMMARY## format the lesson player renders).
//
// Courses are filled in over time. Any lesson not yet present here falls back
// gracefully in the player, so a partially-written course always works.

import aiAutomationVa from "./ai-automation-va";
import gohighlevelVa from "./gohighlevel-va";

export const courseContent: Record<string, string[][]> = {
  "ai-automation-va": aiAutomationVa,
  "gohighlevel-va": gohighlevelVa,
};

export function getLessonContent(
  slug: string,
  moduleIndex: number,
  lessonIndex: number
): string | undefined {
  return courseContent[slug]?.[moduleIndex]?.[lessonIndex];
}
