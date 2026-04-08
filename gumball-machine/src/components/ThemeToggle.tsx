"use client";
// src/components/ThemeToggle.tsx
import { motion } from "framer-motion";

interface Props {
  darkMode: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ darkMode, onToggle }: Props) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full border-2 transition-colors duration-300 focus:outline-none"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #1a0a2e, #2d1060)"
          : "linear-gradient(135deg, #FFD93D, #FF9A3C)",
        borderColor: darkMode ? "rgba(199,125,255,0.4)" : "rgba(255,59,92,0.3)",
      }}
      whileTap={{ scale: 0.92 }}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full shadow-md flex items-center justify-center text-xs"
        style={{ background: darkMode ? "#C77DFF" : "#FF3B5C" }}
        animate={{ left: darkMode ? "calc(100% - 22px)" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {darkMode ? "🌙" : "☀️"}
      </motion.div>
    </motion.button>
  );
}
