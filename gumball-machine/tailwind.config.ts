import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Boogaloo'", "cursive"],
        body: ["'Nunito'", "sans-serif"],
      },
      colors: {
        candy: {
          red: "#FF3B5C",
          pink: "#FF6B9D",
          yellow: "#FFD93D",
          green: "#6BCB77",
          blue: "#4D96FF",
          purple: "#C77DFF",
          orange: "#FF9A3C",
        },
        machine: {
          body: "#E8213A",
          dark: "#A01020",
          chrome: "#C0C0C0",
          globe: "#B8E4F9",
        },
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        dropIn: {
          "0%": { transform: "translateY(-200px)", opacity: "0" },
          "60%": { transform: "translateY(10px)", opacity: "1" },
          "80%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        knobTurn: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(180deg)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-12px)" },
          "60%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
        dropIn: "dropIn 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        float: "float 3s ease-in-out infinite",
        shine: "shine 2s linear infinite",
        knobTurn: "knobTurn 0.5s ease-in-out",
        bounce: "bounce 0.6s ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
