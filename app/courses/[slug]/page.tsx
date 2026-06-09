"use client";

import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Clock, PlayCircle, BookOpen, ChevronRight, ChevronDown,
  Award, ArrowLeft, CheckCircle2, Users, Zap,
} from "lucide-react";
import { useState } from "react";
import { getCourse, colorStyles } from "@/lib/courses";
import { useProgress } from "@/lib/useProgress";
import GlowButton from "@/components/ui/GlowButton";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const childVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const levelColor: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Intermediate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Advanced: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function CoursePage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const course = getCourse(slug);

  const [openModule, setOpenModule] = useState<number | null>(0);
  const { isCompleted, loaded } = useProgress(slug ?? "");

  if (!course) return notFound();

  const styles = colorStyles[course.color];
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  // Find the first incomplete lesson for "Continue" CTA
  const allLessons: { mIdx: number; lIdx: number }[] = [];
  course.modules.forEach((mod, mIdx) =>
    mod.lessons.forEach((_, lIdx) => allLessons.push({ mIdx, lIdx }))
  );
  const completedCount = loaded ? allLessons.filter((l) => isCompleted(l.mIdx, l.lIdx)).length : 0;
  const firstIncomplete = allLessons.find((l) => !isCompleted(l.mIdx, l.lIdx)) ?? allLessons[0];
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const startHref = firstIncomplete
    ? `/courses/${slug}/learn?m=${firstIncomplete.mIdx}&l=${firstIncomplete.lIdx}`
    : `/courses/${slug}/learn?m=0&l=0`;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 px-6 md:px-12 lg:px-24 bg-navy-dark overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 80% 30%, ${styles.glow.replace("0.12", "0.08")} 0%, transparent 70%)` }} />

        <div className="relative max-w-7xl mx-auto">
          {/* Back link */}
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm font-accent mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to All Courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mb-6 ${styles.icon}`}>
                {course.icon}
              </div>

              {/* Category + level */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-accent font-semibold uppercase tracking-widest ${styles.heading}`}>
                  {course.category}
                </span>
                <span className="text-white/20">·</span>
                <span className={`text-xs font-accent font-semibold px-2.5 py-1 rounded-full border ${levelColor[course.level]}`}>
                  {course.level}
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white leading-tight mb-4">
                {course.title}
              </h1>
              <p className={`font-heading font-semibold text-lg mb-5 ${styles.heading}`}>
                {course.tagline}
              </p>
              <p className="text-white/60 text-base leading-relaxed mb-8 max-w-xl">
                {course.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-white/5 border border-white/10 text-white/65 px-3 py-1 rounded-full text-xs font-accent"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {loaded && completedCount > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${styles.bar}`} style={{ width: `${progressPct}%` }} />
                  </div>
                  <span className="text-white/40 text-xs font-accent shrink-0">{completedCount}/{totalLessons} lessons</span>
                </div>
              )}
              <GlowButton href={startHref} variant="filled" showArrow className="text-base px-8 py-4">
                {loaded && completedCount > 0 ? "Continue Learning" : "Start Learning — It's Free"}
              </GlowButton>
            </motion.div>

            {/* Right — course card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className={`bg-white/[0.04] border rounded-2xl p-7 ${styles.border}`}
            >
              <p className={`text-xs font-accent font-semibold uppercase tracking-widest mb-5 ${styles.heading}`}>
                Course Overview
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: BookOpen, label: "Modules", value: `${course.modules.length}` },
                  { icon: PlayCircle, label: "Lessons", value: `${totalLessons}` },
                  { icon: Clock, label: "Duration", value: course.duration },
                  { icon: Award, label: "Certificate", value: "Included" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={13} className="text-white/40" />
                      <span className="text-white/40 text-xs font-accent">{label}</span>
                    </div>
                    <p className="font-heading font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/8 pt-5 space-y-3">
                {[
                  "100% free — no credit card needed",
                  "Self-paced — learn on your schedule",
                  "Practical projects for your portfolio",
                  "BVN Certificate upon completion",
                  "Community access included",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 size={14} className={styles.heading} />
                    <span className="text-white/65 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {loaded && completedCount > 0 && (
                <div className="mt-4 mb-2">
                  <div className="flex items-center justify-between text-xs text-white/40 font-accent mb-1.5">
                    <span>Progress</span><span>{progressPct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${styles.bar}`} style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              )}
              <div className="mt-6">
                <GlowButton href={startHref} variant="filled" showArrow className="w-full justify-center">
                  {loaded && completedCount > 0 ? "Continue Course" : "Start This Course Free"}
                </GlowButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ───────────────────────────────────────── */}
      <motion.section
        id="curriculum"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative py-24 px-6 md:px-12 lg:px-24 bg-[#080C18] border-t border-white/5"
      >
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className={`text-xs font-accent font-semibold uppercase tracking-widest block mb-2 ${styles.heading}`}>
                Course Curriculum
              </span>
              <h2 className="font-heading font-extrabold text-3xl text-white">
                {course.modules.length} Modules · {totalLessons} Lessons
              </h2>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-3"
          >
            {course.modules.map((module, idx) => {
              const isOpen = openModule === idx;
              return (
                <motion.div
                  key={module.number}
                  variants={childVariant}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? styles.border : "border-white/8 hover:border-white/15"
                  }`}
                >
                  {/* Module header */}
                  <button
                    onClick={() => setOpenModule(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 font-heading font-bold text-sm ${styles.icon}`}>
                        {module.number}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-white text-base leading-snug">
                          {module.title}
                        </p>
                        <p className="text-white/40 text-xs font-accent mt-0.5">
                          {module.lessons.length} lessons
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-white/40 transition-transform duration-300 shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Lessons list */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/8 divide-y divide-white/5"
                    >
                      {module.lessons.map((lesson, lIdx) => {
                        const done = loaded && isCompleted(idx, lIdx);
                        return (
                          <Link
                            key={lIdx}
                            href={`/courses/${slug}/learn?m=${idx}&l=${lIdx}`}
                            className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.06] transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              {done ? (
                                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                              ) : (
                                <PlayCircle size={14} className={`text-white/30 shrink-0 group-hover:${styles.heading?.replace("text-", "text-")}`} />
                              )}
                              <span className={`text-sm ${done ? "text-white/45 line-through" : "text-white/70 group-hover:text-white"} transition-colors`}>
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                              <span className="text-white/30 text-xs font-accent">{lesson.duration}</span>
                              <ChevronRight size={12} className="text-white/20 group-hover:text-white/50 transition-colors" />
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ── WHAT YOU'LL LEARN ────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className={`text-xs font-accent font-semibold uppercase tracking-widest block mb-3 ${styles.heading}`}>
                Skills You&apos;ll Gain
              </span>
              <h2 className="font-heading font-extrabold text-3xl text-white mb-5">
                What You&apos;ll Be Able to Do
              </h2>
              <p className="text-white/55 text-base leading-relaxed mb-8">
                By the time you finish this course, you&apos;ll have both the knowledge and the practical work
                to start landing clients in the {course.title} niche.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className={styles.heading} />
                    <span className="text-white/70 text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: Zap, title: "Hands-On Projects", desc: "Every module ends with a real project you can add to your portfolio and show to clients." },
                { icon: Users, title: "Client-Ready Skills", desc: "The curriculum is built around what agencies and business owners actually hire VAs to do." },
                { icon: Award, title: "Earn Your Certificate", desc: "Complete all modules and receive a BVN Certificate of Completion to display on your profile." },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className={`flex gap-4 items-start bg-white/[0.04] border rounded-xl p-5 transition-all ${styles.border}`}
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${styles.icon}`}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm mb-1">{title}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── OTHER COURSES ────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-20 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-white mb-1">
              Explore More Courses
            </h2>
            <p className="text-white/50 text-sm">6 more niches to master in BVN Academy.</p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 font-heading font-semibold text-sm text-orange hover:text-orange-light transition-colors"
          >
            View All <ChevronRight size={15} />
          </Link>
        </div>
      </motion.section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-20 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-4">
            Ready to start?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            This course is free. No sign-up required. Just click start and begin learning.
          </p>
          <GlowButton href={startHref} variant="filled" showArrow className="text-base px-8 py-4">
            {loaded && completedCount > 0 ? "Continue Course" : `Begin ${course.title} Course`}
          </GlowButton>
        </div>
      </motion.section>
    </>
  );
}
