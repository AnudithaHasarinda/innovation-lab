import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        panel: "#0c0d0c",
        line: "#232623",
        sage: "#abb8a8",
        cream: "#f2efe9",
        mute: "#8d9889",
      },
      fontFamily: {
        display: ["var(--font-outfit)", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: { blink: "blink 1s steps(1) infinite", shimmer: "shimmer 1.6s infinite" },
    },
  },
  plugins: [],
};

export default config;
