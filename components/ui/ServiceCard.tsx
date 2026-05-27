"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
}: ServiceCardProps) {
  const inner = (
    <>
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center mb-5
          group-hover:bg-orange/20 group-hover:border-orange/40 transition-colors"
      >
        <Icon size={22} className="text-orange" />
      </div>

      {/* Content */}
      <h3 className="font-heading font-bold text-white text-lg mb-3 leading-snug">
        {title}
      </h3>
      <p className="text-white/55 text-sm leading-relaxed flex-1">{description}</p>

      {/* Learn more / bottom bar */}
      {href ? (
        <div className="mt-5 flex items-center gap-1 text-orange text-xs font-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more <ArrowRight size={12} />
        </div>
      ) : (
        <div
          className="mt-5 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-orange to-orange-light
            rounded-full transition-all duration-500"
        />
      )}
    </>
  );

  const cardClasses =
    "group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-orange/50 transition-colors duration-300 flex flex-col";

  if (href) {
    return (
      <motion.div whileHover={{ y: -6, boxShadow: "0 0 32px rgba(232,96,16,0.25)" }} transition={{ duration: 0.2 }}>
        <Link href={href} className={cardClasses}>{inner}</Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 0 32px rgba(232,96,16,0.25)" }}
      transition={{ duration: 0.2 }}
      className={cardClasses}
    >
      {inner}
    </motion.div>
  );
}
