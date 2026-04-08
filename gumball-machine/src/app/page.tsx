"use client";
// src/app/page.tsx
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { UserState, SpinResult } from "@/types";
import { getOrCreateSessionId } from "@/lib/session";
import GumballMachine from "@/components/GumballMachine";
import DailyCounter from "@/components/DailyCounter";
import RewardDisplay from "@/components/RewardDisplay";
import Leaderboard from "@/components/Leaderboard";
import ThemeToggle from "@/components/ThemeToggle";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const [userState, setUserState] = useState<UserState | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastReward, setLastReward] = useState<SpinResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Init
  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);

    const saved = localStorage.getItem("gumball_dark");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user state
  const fetchUserState = useCallback(
    async (sid: string) => {
      if (!sid) return;
      try {
        const res = await fetch(`/api/user?sessionId=${sid}`);
        if (res.ok) {
          const data: UserState = await res.json();
          setUserState(data);
        }
      } catch (err) {
        console.error("Failed to fetch user state", err);
      }
    },
    []
  );

  useEffect(() => {
    if (sessionId) fetchUserState(sessionId);
  }, [sessionId, fetchUserState]);

  const handleSpin = async () => {
    if (!sessionId || !userState?.canSpin || isSpinning) return;

    setIsSpinning(true);
    setLastReward(null);

    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();

      if (data.success && data.result) {
        setTimeout(() => {
          setLastReward(data.result);
          setUserState(data.userState);
          setIsSpinning(false);

          if (data.result.rarity === "legendary" || data.result.rarity === "rare") {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        }, 1200); // Wait for animation
      } else {
        setIsSpinning(false);
        await fetchUserState(sessionId);
      }
    } catch (err) {
      console.error("Spin failed", err);
      setIsSpinning(false);
    }
  };

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("gumball_dark", String(next));
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleRedeem = () => {
    alert(
      `🎉 ${userState?.totalCredits ?? 0} Gumloop Credits queued for redemption!\n\n(Real Gumloop API integration coming soon)`
    );
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-[#0d0520] via-[#1a0a2e] to-[#0d0520]"
          : "bg-gradient-to-b from-[#FFF5F7] via-[#FFF0F5] to-[#FFEAF2]"
      }`}
    >
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          colors={["#FF3B5C", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF", "#FF9A3C"]}
        />
      )}

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-candy-red to-candy-pink shadow-lg"
            style={{ background: "linear-gradient(135deg, #FF3B5C, #FF6B9D)" }}
          />
          <span
            className="font-display text-2xl tracking-wide"
            style={{ color: darkMode ? "#fff" : "#1a0a2e" }}
          >
            Gumloop
          </span>
        </div>
        <ThemeToggle darkMode={darkMode} onToggle={toggleDark} />
      </header>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-4 pt-4 pb-12 max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h1
            className="font-display text-5xl md:text-7xl leading-tight mb-2"
            style={{
              color: darkMode ? "#fff" : "#1a0a2e",
              textShadow: darkMode ? "0 0 40px rgba(199,125,255,0.4)" : "none",
            }}
          >
            Daily Gumballs
          </h1>
          <p
            className="font-body text-lg md:text-xl max-w-md mx-auto"
            style={{ color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(26,10,46,0.6)" }}
          >
            Spin up to 3 times per day to earn Gumloop Credits
          </p>
        </div>

        {/* Daily Counter */}
        <DailyCounter userState={userState} darkMode={darkMode} />

        {/* Machine */}
        <div className="relative my-4">
          <GumballMachine
            canSpin={!!userState?.canSpin && !isSpinning}
            isSpinning={isSpinning}
            lastReward={lastReward}
            onSpin={handleSpin}
            darkMode={darkMode}
          />
        </div>

        {/* Reward Display */}
        <RewardDisplay reward={lastReward} darkMode={darkMode} />

        {/* Credits + Redeem */}
        {userState && userState.totalCredits > 0 && (
          <div className="mt-6 flex flex-col items-center gap-3 animate-fade-in">
            <div
              className="px-8 py-4 rounded-2xl text-center shadow-lg border-2"
              style={{
                background: darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.9)",
                borderColor: darkMode
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(255, 59, 92, 0.2)",
              }}
            >
              <p
                className="font-display text-lg mb-1"
                style={{ color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(26,10,46,0.6)" }}
              >
                Total Credits Earned
              </p>
              <p
                className="font-display text-4xl"
                style={{ color: darkMode ? "#FFD93D" : "#FF3B5C" }}
              >
                {userState.totalCredits.toLocaleString()}
              </p>
            </div>

            <button
              onClick={handleRedeem}
              className="px-8 py-3 rounded-xl font-body font-800 text-white text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #FF3B5C, #C77DFF)",
                boxShadow: "0 4px 20px rgba(199, 125, 255, 0.4)",
              }}
            >
              🚀 Use on Gumloop
            </button>
          </div>
        )}

        {/* Leaderboard hint */}
        <Leaderboard darkMode={darkMode} />
      </div>

      {/* Footer */}
      <footer
        className="text-center py-6 font-body text-sm"
        style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(26,10,46,0.3)" }}
      >
        Gumloop Credits reset daily at midnight UTC ·{" "}
        <a
          href="https://gumloop.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-70"
        >
          gumloop.com
        </a>
      </footer>
    </main>
  );
}
