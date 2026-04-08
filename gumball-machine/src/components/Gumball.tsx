"use client";
// src/components/Gumball.tsx
import { motion } from "framer-motion";
import { SpinResult } from "@/types";

interface Props {
  reward: SpinResult;
}

const rarityLabel: Record<string, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "🔥 Rare",
  legendary: "⭐ Legendary",
};

export default function Gumball({ reward }: Props) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className="flex flex-col items-center gap-2"
    >
      {/* The gumball itself */}
      <motion.div
        className="relative w-20 h-20 rounded-full shadow-2xl"
        style={{
          background: `radial-gradient(circle at 35% 32%, rgba(255,255,255,0.65) 0%, ${reward.gumballColor} 48%, ${reward.gumballColor}bb 100%)`,
          boxShadow: `0 6px 30px ${reward.gumballColor}70`,
        }}
        animate={{ y: [0, -8, 0, -4, 0] }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Highlight */}
        <div
          className="absolute w-5 h-5 rounded-full opacity-60"
          style={{
            top: "18%",
            left: "22%",
            background: "rgba(255,255,255,0.8)",
            filter: "blur(3px)",
          }}
        />
      </motion.div>

      {/* Rarity badge */}
      <span
        className="text-xs font-body font-800 px-3 py-1 rounded-full uppercase tracking-wider"
        style={{
          background: reward.gumballColor + "22",
          color: reward.gumballColor,
          border: `1.5px solid ${reward.gumballColor}55`,
        }}
      >
        {rarityLabel[reward.rarity]}
      </span>
    </motion.div>
  );
}
