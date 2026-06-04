'use client';

import { motion } from 'framer-motion';

const DURATION = 0.6;
const EASE = [0.4, 0, 0.2, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Dark overlay — slides down, revealing page from top */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: '#06060c',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
        initial={{ y: 0 }}
        animate={{ y: '100vh' }}
        transition={{ duration: DURATION, ease: EASE }}
      />

      {/* Gold scan line — rides the leading edge of the overlay */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: '#d4af37',
          boxShadow: '0 0 18px 4px rgba(212,175,55,0.55)',
          zIndex: 10000,
          pointerEvents: 'none',
        }}
        initial={{ y: 0 }}
        animate={{ y: '100vh' }}
        transition={{ duration: DURATION, ease: EASE }}
      />

      {children}
    </>
  );
}
