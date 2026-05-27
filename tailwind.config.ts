import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B3060",
          dark: "#0A0F1E",
          surface: "#111827",
        },
        orange: {
          DEFAULT: "#E86010",
          light: "#F5A623",
        },
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
        accent: ["Raleway", "sans-serif"],
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        "fade-up": "fadeUp 0.6s ease forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        grid: "gridMove 20s linear infinite",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%, -40%) scale(1)",
          },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(232,96,16,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(232,96,16,0.6)" },
        },
        gridMove: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "60px 60px" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
