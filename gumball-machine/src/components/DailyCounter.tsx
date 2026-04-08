"use client";
// src/components/DailyCounter.tsx
import { motion } from "framer-motion";
import { UserState, MAX_DAILY_SPINS } from "@/types";

interface Props {
  userState: UserState | null;
  darkMode: boolean;
}

export default function DailyCounter({ userState, darkMode }: Props) {
  const spinsRemaining = userState?.spinsRemaining ?? MAX_DAILY_SPINS;
  const spinsUsed = userState?.spinsToday ?? 0;
  const canSpin = userState?.canSpin ?? true;

  const textColor = darkMode ? "rgba(255,255,255,0.85)" : "rgba(26,10,46,0.85)";
  const mutedColor = darkMode ? "rgba(255,255,255,0.45)" : "rgba(26,10,46,0.45)";

  return (
    <div className="flex flex-col items-center gap-3 mb-2">
      {/* Spin dots */}
      <div className="flex items-center gap-3">
        {Array.from({ length: MAX_DAILY_SPINS }).map((_, i) => {
          const used = i < spinsUsed;
          return (
            <motion.div
              key={i}
              className="w-5 h-5 rounded-full border-2 transition-all duration-300"
              style={{
                borderColor: used
                  ? darkMode
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(26,10,46,0.2)"
                  : "#FF3B5C",
                background: used
                  ? darkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(26,10,46,0.08)"
                  : "linear-gradient(135deg, #FF3B5C, #FF6B9D)",
                boxShadow: used ? "none" : "0 2px 10px rgba(255,59,92,0.5)",
              }}
              initial={false}
              animate={used ? { scale: [1, 0.8, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </div>

      {/* Message */}
      <motion.p
        className="font-body text-sm font-700 text-center"
        style={{ color: canSpin ? textColor : mutedColor }}
        key={spinsRemaining}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {!userState ? (
          <span style={{ color: mutedColor }}>Loading…</span>
        ) : canSpin ? (
          <span>
            <span style={{ color: "#FF3B5C", fontWeight: 900 }}>
              {spinsRemaining}
            </span>
            {" "}spin{spinsRemaining !== 1 ? "s" : ""} remaining today
          </span>
        ) : (
          <span>
            🎰 You&apos;ve used all your spins today.{" "}
            <span style={{ color: "#FF3B5C" }}>Come back tomorrow!</span>
          </span>
        )}
      </motion.p>
    </div>
  );
}
