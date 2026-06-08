"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Clock, PlayCircle, ChevronRight, Award, Users, Zap } from "lucide-react";
import HeroSection from "@/components/ui/HeroSection";
import SectionHeader from "@/components/ui/SectionHeader";
import { courses, colorStyles } from "@/lib/courses";

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const childVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const levelColor: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Intermediate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Advanced: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function CoursesPage() {
  return (
    <>
      <HeroSection
        badge="BVN Academy"
        headline="Learn the Skills That Pay."
        subtext="Free, premium-quality courses built by BVN for aspiring Virtual Assistants. Master the top 7 VA niches — from AI automation to paid ads — and land better clients faster."
        primaryCta={{ label: "Browse Courses", href: "#courses" }}
        secondaryCta={{ label: "Learn About BVN", href: "/about" }}
      />

      {/* Stats strip */}
      <div className="border-y border-white/5 bg-white/[0.02] py-8 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-white/10">
          {[
            { icon: BookOpen, label: "Courses", value: "7" },
            { icon: PlayCircle, label: "Total Lessons", value: "210+" },
            { icon: Clock, label: "Hours of Content", value: "40+" },
            { icon: Award, label: "Certificate Included", value: "Yes" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 md:px-8 first:pl-0 last:pr-0">
              <div className="w-10 h-10 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-orange" />
              </div>
              <div>
                <p className="font-heading font-extrabold text-white text-xl leading-none">{value}</p>
                <p className="text-white/40 text-xs font-accent mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course grid */}
      <motion.section
        id="courses"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="relative py-24 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5"
      >
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        <div className="relative max-w-7xl mx-auto">
          <SectionHeader
            label="All Courses"
            title="7 VA Niches. One Academy."
            subtitle="Each course is structured with real modules, practical lessons, and projects you can show clients."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map((course) => {
              const styles = colorStyles[course.color];
              return (
                <motion.div key={course.slug} variants={childVariant}>
                  <Link href={`/courses/${course.slug}`} className="group block h-full">
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.2 }}
                      className={`h-full bg-white/[0.04] border rounded-2xl p-6 flex flex-col transition-all duration-300 ${styles.border}`}
                    >
                      {/* Icon + level */}
                      <div className="flex items-start justify-between mb-5">
                        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-2xl transition-all ${styles.icon}`}>
                          {course.icon}
                        </div>
                        <span className={`text-xs font-accent font-semibold px-2.5 py-1 rounded-full border ${levelColor[course.level]}`}>
                          {course.level}
                        </span>
                      </div>

                      {/* Category */}
                      <span className={`text-xs font-accent font-semibold uppercase tracking-widest mb-2 ${styles.heading}`}>
                        {course.category}
                      </span>

                      {/* Title + tagline */}
                      <h3 className="font-heading font-bold text-white text-xl leading-tight mb-2 group-hover:text-white transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-5 flex-grow">
                        {course.tagline}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {course.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="bg-white/5 border border-white/10 text-white/55 px-2.5 py-0.5 rounded-md text-xs font-accent"
                          >
                            {skill}
                          </span>
                        ))}
                        {course.skills.length > 4 && (
                          <span className="text-white/35 text-xs px-2 py-0.5">
                            +{course.skills.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/8">
                        <div className="flex items-center gap-4 text-white/40 text-xs">
                          <span className="flex items-center gap-1">
                            <PlayCircle size={12} />
                            {course.lessons} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {course.duration}
                          </span>
                        </div>
                        <span className={`flex items-center gap-1 text-xs font-accent font-semibold ${styles.heading}`}>
                          View Course <ChevronRight size={13} />
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Why BVN Academy */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Why BVN Academy"
            title="Built by Practitioners. Not Theorists."
            subtitle="Every course is designed by BVN — a real agency with 238+ clients and 22+ years of experience across marketing, automation, and operations."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[
              {
                icon: Zap,
                title: "Real-World Curriculum",
                desc: "Every module mirrors what BVN VAs actually do for clients every day — no fluff, no theory for its own sake.",
              },
              {
                icon: BookOpen,
                title: "Structured Learning Path",
                desc: "Each course progresses logically — from fundamentals to hands-on projects you can add to your portfolio immediately.",
              },
              {
                icon: Award,
                title: "BVN Certificate",
                desc: "Complete a course and earn a BVN Certificate of Completion — a credible signal to clients and agencies worldwide.",
              },
              {
                icon: Users,
                title: "Community Access",
                desc: "Join the BVN learner community — ask questions, share wins, and connect with other VAs on the same path.",
              },
              {
                icon: PlayCircle,
                title: "Self-Paced, Forever Free",
                desc: "Go at your own speed with no deadlines. All courses are free — because everyone deserves access to quality education.",
              },
              {
                icon: ChevronRight,
                title: "Hire-Ready Skills",
                desc: "Courses are built around what clients and agencies actually look for when hiring VAs in each niche.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={childVariant}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6
                  hover:border-orange/30 hover:bg-white/[0.07] transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center mb-4
                  group-hover:bg-orange/20 group-hover:border-orange/40 transition-colors">
                  <Icon size={18} className="text-orange" />
                </div>
                <h3 className="font-heading font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="py-20 px-6 md:px-12 lg:px-24 bg-navy-dark border-t border-white/5 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-4">
            Ready to level up your VA career?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Pick a niche, start a course, and build skills that clients are actively paying for right now.
          </p>
          <a
            href="#courses"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-heading font-semibold text-base
              bg-orange text-white shadow-[0_0_20px_rgba(232,96,16,0.4)]
              hover:bg-orange-light hover:shadow-[0_0_32px_rgba(232,96,16,0.6)]
              active:scale-95 transition-all duration-200"
          >
            Browse All Courses <ChevronRight size={16} />
          </a>
        </div>
      </motion.section>
    </>
  );
}
