"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4";

const NAV_LINKS = ["Labs", "Studio", "Openings", "Shop"];
const SERVICE_OPTIONS = ["Brand", "Digital", "Campaign", "Other"];

// ── Typewriter hook ────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval>;

    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function ContactHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState<string[]>([]);

  const { displayed, done } = useTypewriter("we'd love to\nhear from you!");

  // ── Desktop mouse-scrubbing ──────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;
    const targetRef = { current: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return; // scrubbing disabled on mobile
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;

      const currentX = e.clientX;
      if (prevX === null) {
        prevX = currentX;
        targetRef.current = video.currentTime;
        return;
      }
      const delta = currentX - prevX;
      prevX = currentX;

      let targetTime =
        targetRef.current + (delta / window.innerWidth) * 0.8 * duration;
      targetTime = Math.max(0, Math.min(targetTime, duration));
      targetRef.current = targetTime;
      video.currentTime = targetTime;
    };

    // Smooth frame-to-frame tracking: re-assert the target on each seek settle
    const handleSeeked = () => {
      if (window.innerWidth < 1024) return;
      const duration = video.duration;
      if (!duration) return;
      if (Math.abs(video.currentTime - targetRef.current) > 0.01) {
        video.currentTime = targetRef.current;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    video.addEventListener("seeked", handleSeeked);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  // ── Mobile autoplay (scrubbing disabled below 1024px) ────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.innerWidth < 1024) {
      video.autoplay = true;
      video.loop = true;
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => {});
    }
  }, []);

  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      {/* ── Background Video ── */}
      <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-right lg:object-right-bottom bg-neutral-50"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      {/* ── Navbar (scoped to hero) ── */}
      <header className="absolute top-0 inset-x-0 z-20 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
        {/* Logo */}
        <div className="flex flex-row items-center gap-3">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium select-none">
            BVN&reg;
          </span>
          <span className="text-[25px] sm:text-[30px] text-black select-none tracking-[-0.02em] font-medium leading-none mb-1">
            &#10033;
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex flex-row text-[23px] text-black">
          {NAV_LINKS.map((link, i) => (
            <span key={link} className="flex flex-row">
              <a
                href="#"
                className="hover:opacity-60 transition-opacity"
              >
                {link}
              </a>
              {i < NAV_LINKS.length - 1 && (
                <span className="opacity-40">,&nbsp;</span>
              )}
            </span>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="/contact"
          className="hidden md:inline-block text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden relative z-20 flex flex-col justify-center gap-[5px] w-6 h-6"
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* ── Mobile Navigation Overlay ── */}
      <div
        className={`md:hidden fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm transition-opacity duration-300 flex flex-col items-center justify-center gap-8 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-3xl text-black font-medium hover:opacity-60 transition-opacity"
          >
            {link}
          </a>
        ))}
        <a
          href="/contact"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-3xl text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>
      </div>

      {/* ── Content Layer ── */}
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main
          id="spade-hero"
          className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center"
        >
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap">
              {displayed}
              {!done && (
                <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
              )}
            </h1>
          </motion.div>

          {/* Secondary description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-14 max-w-2xl">
              Whether you have questions, feedback, <br />
              drop us a message and we&apos;ll get back to you as soon as possible.
            </p>
          </motion.div>

          {/* Service pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h2 className="text-2xl font-medium tracking-tight mb-2 text-[#1C2E1E]">
              What sort of service?
            </h2>
            <p className="opacity-85 text-[#738273] mb-8">Select all that apply</p>

            <div className="flex flex-wrap gap-3">
              {SERVICE_OPTIONS.map((option) => {
                const active = services.includes(option);
                return (
                  <motion.button
                    key={option}
                    type="button"
                    onClick={() => toggleService(option)}
                    whileTap={{ scale: 0.96 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium transition-colors duration-200 ${
                      active
                        ? "bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5 transform"
                        : "bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55"
                    }`}
                  >
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="flex items-center"
                        >
                          <Check size={16} strokeWidth={2.5} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {option}
                  </motion.button>
                );
              })}
            </div>

            {/* Contingent feedback banner */}
            <AnimatePresence mode="wait">
              {services.length === 0 ? (
                <motion.p
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="italic text-xs text-[#738273] mt-6"
                >
                  Please click to select services above.
                </motion.p>
              ) : (
                <motion.div
                  key="banner"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                  className="overflow-hidden mt-6"
                >
                  <div className="flex items-center justify-between gap-4 bg-[#FAFBF9] border border-[#F1F3F1] rounded-2xl px-5 py-4">
                    <p className="text-sm text-[#1C2E1E]">
                      Ready to inquire about:{" "}
                      <span className="font-medium">{services.join(", ")}</span>
                    </p>
                    <a
                      href="/contact"
                      className="flex items-center gap-1.5 text-[#4D6D47] uppercase text-xs font-semibold tracking-wide hover:gap-2.5 transition-all whitespace-nowrap"
                    >
                      Let&apos;s Go <ArrowRight size={14} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
