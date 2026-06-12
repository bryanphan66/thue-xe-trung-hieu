import type { Config } from "tailwindcss";

/**
 * Tailwind config cho "Thuê Xe Trung Hiếu".
 * Map đúng design tokens trong README. Dùng với Next.js (App Router) + TypeScript.
 *
 * Font: khai báo bằng next/font/google trong app/layout.tsx rồi gán biến CSS:
 *   import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
 *   const sans = Be_Vietnam_Pro({ subsets:["latin","vietnamese"], weight:["400","500","600","700","800"], variable:"--font-sans" });
 *   const mono = JetBrains_Mono({ subsets:["latin"], weight:["400","500"], variable:"--font-mono" });
 *   <html className={`${sans.variable} ${mono.variable}`}> ...
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0C",
        surface: "#FFFFFF",
        bg: "#FAFAFA",
        muted: "#6B7280",
        hairline: "#E7E7E9",
        accent: "#2D5BFF",
        stage: {
          DEFAULT: "#0B0B0C", // nền hero / khu 3D / footer
          ink: "#FAFAFA",     // chữ trên nền tối
          muted: "#9A9CA3",   // chữ phụ trên nền tối
          hairline: "#1F2024" // viền trên nền tối
        },
      },
      borderRadius: { card: "14px", btn: "13px", sheet: "22px" },
      maxWidth: { mobile: "412px" },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        // easing dùng xuyên suốt cho reveal / sheet / hover
        smooth: "cubic-bezier(.16,1,.3,1)",
      },
      keyframes: {
        marquee:  { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        heroZoom: { from: { transform: "scale(1)" },      to: { transform: "scale(1.045)" } },
        dotPulse: { "0%": { transform: "scale(.7)", opacity: ".6" }, "70%": { opacity: "0" }, "100%": { transform: "scale(2.1)", opacity: "0" } },
        barUp:    { from: { transform: "translateY(120%)" }, to: { transform: "none" } },
        sheetUp:  { from: { transform: "translateY(100%)" }, to: { transform: "none" } },
      },
      animation: {
        marquee:  "marquee 52s linear infinite",
        heroZoom: "heroZoom 16s ease-in-out infinite alternate",
        dotPulse: "dotPulse 2.6s ease-out infinite",
        barUp:    "barUp .6s .25s cubic-bezier(.16,1,.3,1) both",
        sheetUp:  "sheetUp .32s cubic-bezier(.16,1,.3,1)",
      },
    },
  },
  plugins: [],
};

export default config;
