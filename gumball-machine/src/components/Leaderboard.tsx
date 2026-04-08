"use client";
// src/components/Leaderboard.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardEntry {
  rank: number;
  sessionId: string;
  totalCredits: number;
}

interface Props {
  darkMode: boolean;
}

export default function Leaderboard({ darkMode }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (e) {
      console.error("Leaderboard fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!open) fetchLeaderboard();
    setOpen((prev) => !prev);
  };

  const cardBg = darkMode
    ? "rgba(255,255,255,0.06)"
    : "rgba(255,255,255,0.9)";
  const border = darkMode
    ? "rgba(255,255,255,0.12)"
    : "rgba(255,59,92,0.15)";
  const textColor = darkMode ? "#fff" : "#1a0a2e";
  const mutedColor = darkMode ? "rgba(255,255,255,0.4)" : "rgba(26,10,46,0.4)";

  const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  return (
    <div className="mt-8 w-full max-w-sm">
      <button
        onClick={handleToggle}
        className="w-full py-3 px-6 rounded-2xl font-body font-700 text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: cardBg,
          color: textColor,
          border: `1.5px solid ${border}`,
          backdropFilter: "blur(8px)",
        }}
      >
        🏆 {open ? "Hide" : "View"} Leaderboard
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="mt-3 rounded-2xl p-4 border"
              style={{
                background: cardBg,
                borderColor: border,
                backdropFilter: "blur(8px)",
              }}
            >
              <h3
                className="font-display text-xl mb-3 text-center"
                style={{ color: textColor }}
              >
                Top Credit Earners
              </h3>

              {loading ? (
                <p className="text-center py-4 font-body text-sm" style={{ color: mutedColor }}>
                  Loading…
                </p>
              ) : entries.length === 0 ? (
                <p className="text-center py-4 font-body text-sm" style={{ color: mutedColor }}>
                  No spins yet. Be the first!
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {entries.map((entry, i) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                      style={{
                        background:
                          i === 0
                            ? darkMode
                              ? "rgba(255,215,0,0.12)"
                              : "rgba(255,215,0,0.15)"
                            : "transparent",
                        border:
                          i === 0
                            ? `1px solid rgba(255,215,0,0.3)`
                            : "1px solid transparent",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="font-display text-lg w-6 text-center"
                          style={{ color: rankColors[i] ?? mutedColor }}
                        >
                          {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${entry.rank}`}
                        </span>
                        <span
                          className="font-body text-sm font-600"
                          style={{ color: textColor }}
                        >
                          Player {entry.sessionId.slice(0, 6).toUpperCase()}
                        </span>
                      </div>
                      <span
                        className="font-display text-base"
                        style={{ color: i === 0 ? "#FFD700" : "#FF3B5C" }}
                      >
                        {entry.totalCredits.toLocaleString()} pts
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
