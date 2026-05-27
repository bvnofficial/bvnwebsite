"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/marketing-services";
import SectionHeader from "./SectionHeader";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-navy-surface border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Client Testimonials"
          title="What Our Clients Are Saying"
          subtitle="Hear directly from businesses around the world who've experienced the BVN difference."
          centered
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -4, boxShadow: "0 0 28px rgba(232,96,16,0.15)" }}
              transition={{ duration: 0.2 }}
              className="break-inside-avoid bg-white/5 border border-white/10 rounded-2xl p-6
                hover:border-orange/30 transition-colors"
            >
              {/* Quote icon */}
              <Quote size={20} className="text-orange/40 mb-3" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    size={14}
                    className={si < t.rating ? "text-orange fill-orange" : "text-white/20"}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-white/70 text-sm leading-relaxed mb-5 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-orange to-orange-light
                    flex items-center justify-center text-white text-xs font-heading font-bold shrink-0"
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">
                    {t.role} · {t.company}
                  </p>
                  <p className="text-white/30 text-xs">{t.country}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
