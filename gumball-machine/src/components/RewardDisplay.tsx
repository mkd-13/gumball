"use client";
// src/components/RewardDisplay.tsx
import { AnimatePresence, motion } from "framer-motion";
import { SpinResult } from "@/types";
import Gumball from "./Gumball";

interface Props {
  reward: SpinResult | null;
  darkMode: boolean;
}

const rarityMessages: Record<string, string> = {
  common: "Nice spin!",
  uncommon: "Ooh, not bad!",
  rare: "🔥 Hot streak!",
  legendary: "⭐ LEGENDARY! You're on fire!",
};

export default function RewardDisplay({ reward, darkMode }: Props) {
  return (
    <div className="min-h-[160px] flex items-center justify-center w-full">
      <AnimatePresence mode="wait">
        {reward ? (
          <motion.div
            key={reward.credits + "-" + Date.now()}
            initial={{ opacity: 0, y: 30, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-4 px-8 py-6 rounded-3xl shadow-xl border"
            style={{
              background: darkMode
                ? `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))`
                : `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))`,
              borderColor: reward.gumballColor + "44",
              boxShadow: `0 8px 40px ${reward.gumballColor}30`,
              backdropFilter: "blur(12px)",
            }}
          >
            <Gumball reward={reward} />

            <div className="text-center">
              <motion.p
                className="font-display text-4xl mb-1"
                style={{ color: reward.gumballColor }}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
              >
                {reward.label}
              </motion.p>
              <p
                className="font-body text-sm font-600"
                style={{
                  color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(26,10,46,0.4)",
                }}
              >
                {rarityMessages[reward.rarity]}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p
              className="font-body text-base"
              style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(26,10,46,0.3)" }}
            >
              Click the machine to spin!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
