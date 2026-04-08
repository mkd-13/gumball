"use client";
// src/components/GumballMachine.tsx
import { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { SpinResult } from "@/types";

interface Props {
  canSpin: boolean;
  isSpinning: boolean;
  lastReward: SpinResult | null;
  onSpin: () => void;
  darkMode: boolean;
}

// Gumball colors for display inside globe
const GLOBE_GUMBALLS = [
  { cx: 110, cy: 155, r: 16, color: "#FF3B5C" },
  { cx: 142, cy: 170, r: 14, color: "#4D96FF" },
  { cx: 90, cy: 175, r: 13, color: "#FFD93D" },
  { cx: 125, cy: 145, r: 15, color: "#6BCB77" },
  { cx: 155, cy: 158, r: 13, color: "#C77DFF" },
  { cx: 100, cy: 195, r: 14, color: "#FF9A3C" },
  { cx: 135, cy: 195, r: 15, color: "#FF6B9D" },
  { cx: 160, cy: 185, r: 12, color: "#FFD93D" },
  { cx: 80, cy: 200, r: 11, color: "#4D96FF" },
  { cx: 115, cy: 215, r: 13, color: "#6BCB77" },
  { cx: 145, cy: 215, r: 14, color: "#FF3B5C" },
  { cx: 170, cy: 205, r: 12, color: "#C77DFF" },
];

export default function GumballMachine({ canSpin, isSpinning, lastReward, onSpin, darkMode }: Props) {
  const machineControls = useAnimation();
  const knobControls = useAnimation();
  const [gumballColor, setGumballColor] = useState("#FF3B5C");
  const [knobAngle, setKnobAngle] = useState(0);

  useEffect(() => {
    if (isSpinning) {
      // Machine shake
      machineControls.start({
        x: [0, -6, 6, -5, 5, -3, 3, -2, 2, 0],
        rotate: [0, -1, 1, -0.8, 0.8, -0.3, 0.3, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      });

      // Knob spin
      knobControls.start({
        rotate: knobAngle + 180,
        transition: { duration: 0.5, ease: "easeInOut" },
      });
      setKnobAngle((prev) => prev + 180);

      // Show gumball drop
      setTimeout(() => {
        const colors = ["#FF3B5C", "#4D96FF", "#FFD93D", "#6BCB77", "#C77DFF", "#FF9A3C"];
        setGumballColor(colors[Math.floor(Math.random() * colors.length)]);
      }, 500);

      setTimeout(() => {
      }, 1400);
    }
  }, [isSpinning]);

  useEffect(() => {
    if (lastReward) {
      setGumballColor(lastReward.gumballColor);
    }
  }, [lastReward]);

  const handleClick = () => {
    if (canSpin && !isSpinning) onSpin();
  };

  return (
    <div className="relative select-none" style={{ width: 320, height: 480 }}>
      <motion.div
        animate={machineControls}
        className="w-full h-full"
        style={{ originX: "50%", originY: "50%" }}
      >
        <svg
          viewBox="0 0 320 480"
          width="320"
          height="480"
          xmlns="http://www.w3.org/2000/svg"
          className={canSpin ? "cursor-pointer" : "cursor-not-allowed"}
          onClick={handleClick}
        >
          <defs>
            {/* Globe gradient */}
            <radialGradient id="globeGrad" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#D6F0FF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8CC8E8" stopOpacity="0.95" />
            </radialGradient>
            {/* Body gradient */}
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C01020" />
              <stop offset="30%" stopColor="#E8213A" />
              <stop offset="70%" stopColor="#FF3B5C" />
              <stop offset="100%" stopColor="#B01828" />
            </linearGradient>
            {/* Chrome gradient */}
            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0E0E0" />
              <stop offset="40%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#A8A8A8" />
            </linearGradient>
            {/* Knob gradient */}
            <radialGradient id="knobGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFD93D" />
              <stop offset="60%" stopColor="#FF9A3C" />
              <stop offset="100%" stopColor="#E07020" />
            </radialGradient>
            {/* Stand gradient */}
            <linearGradient id="standGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B1010" />
              <stop offset="50%" stopColor="#C01020" />
              <stop offset="100%" stopColor="#8B1010" />
            </linearGradient>
            {/* Coin slot */}
            <linearGradient id="slotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#888" />
              <stop offset="100%" stopColor="#444" />
            </linearGradient>
            {/* Chute gradient */}
            <linearGradient id="chuteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A01020" />
              <stop offset="50%" stopColor="#C01828" />
              <stop offset="100%" stopColor="#A01020" />
            </linearGradient>
            {/* Globe shine */}
            <radialGradient id="shineGrad" cx="30%" cy="25%" r="40%">
              <stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── STAND ── */}
          {/* Base plate */}
          <ellipse cx="160" cy="460" rx="90" ry="12" fill="#7A0E18" />
          <rect x="115" y="432" width="90" height="28" rx="6" fill="url(#standGrad)" />
          {/* Stand legs */}
          <rect x="125" y="400" width="18" height="35" rx="4" fill="url(#standGrad)" />
          <rect x="177" y="400" width="18" height="35" rx="4" fill="url(#standGrad)" />
          {/* Stand crossbar */}
          <rect x="120" y="405" width="80" height="10" rx="3" fill="#A01020" />

          {/* ── MACHINE BODY ── */}
          <rect x="80" y="270" width="160" height="135" rx="14" fill="url(#bodyGrad)" />
          {/* Body shading */}
          <rect x="80" y="270" width="12" height="135" rx="6" fill="rgba(0,0,0,0.15)" />
          <rect x="228" y="270" width="12" height="135" rx="6" fill="rgba(0,0,0,0.2)" />

          {/* Chrome ring at top of body */}
          <rect x="78" y="268" width="164" height="16" rx="8" fill="url(#chromeGrad)" />

          {/* ── CHUTE / DISPENSER ── */}
          {/* Chute opening */}
          <rect x="100" y="360" width="80" height="30" rx="6" fill="url(#chuteGrad)" />
          <rect x="110" y="365" width="60" height="20" rx="4" fill="#600010" />
          {/* Chute lip */}
          <rect x="95" y="390" width="90" height="10" rx="4" fill="#8B1020" />
          {/* Gumball collection tray */}
          <path d="M 95 398 Q 95 418 115 420 L 205 420 Q 225 418 225 398 Z" fill="#7A0E18" />
          <path d="M 105 420 Q 105 432 120 435 L 200 435 Q 215 432 215 420 Z" fill="#600010" />

          {/* Coin slot */}
          <rect x="168" y="295" width="36" height="8" rx="4" fill="url(#slotGrad)" />
          <rect x="172" y="297" width="28" height="4" rx="2" fill="#222" />

          {/* Label area */}
          <rect x="100" y="310" width="80" height="36" rx="8" fill="rgba(0,0,0,0.2)" />
          <text x="140" y="325" textAnchor="middle" fill="#FFD93D" fontSize="8" fontFamily="Nunito" fontWeight="800">
            GUMLOOP
          </text>
          <text x="140" y="337" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="7" fontFamily="Nunito">
            CREDITS MACHINE
          </text>

          {/* ── KNOB / HANDLE ── */}
          <motion.g
            animate={knobControls}
            style={{ originX: "236px", originY: "320px" }}
          >
            {/* Knob arm */}
            <rect x="228" y="315" width="24" height="10" rx="5" fill="#888" />
            {/* Knob handle */}
            <circle cx="254" cy="320" r="14" fill="url(#knobGrad)" />
            <circle cx="254" cy="320" r="14" fill="none" stroke="#C06010" strokeWidth="2" />
            {/* Knob shine */}
            <circle cx="250" cy="315" r="5" fill="rgba(255,255,255,0.4)" />
            {/* Arrow indicator */}
            <path d="M 254 310 L 254 314 M 254 326 L 254 330" stroke="#C06010" strokeWidth="2" strokeLinecap="round" />
          </motion.g>

          {/* ── GLOBE NECK ── */}
          <rect x="120" y="245" width="80" height="30" rx="4" fill="url(#chromeGrad)" />
          <rect x="128" y="247" width="64" height="26" rx="3" fill="#d0d0d0" />

          {/* ── GLASS GLOBE ── */}
          {/* Globe shadow behind */}
          <ellipse cx="160" cy="155" rx="84" ry="86" fill="rgba(0,0,0,0.12)" transform="translate(4,5)" />
          {/* Main globe sphere */}
          <circle cx="160" cy="148" r="84" fill="url(#globeGrad)" />
          {/* Globe outline */}
          <circle cx="160" cy="148" r="84" fill="none" stroke="url(#chromeGrad)" strokeWidth="6" />

          {/* Gumballs inside globe */}
          {GLOBE_GUMBALLS.map((gb, i) => (
            <g key={i}>
              <circle cx={gb.cx} cy={gb.cy} r={gb.r} fill={gb.color} opacity="0.85" />
              {/* Highlight on each gumball */}
              <circle
                cx={gb.cx - gb.r * 0.3}
                cy={gb.cy - gb.r * 0.3}
                r={gb.r * 0.3}
                fill="rgba(255,255,255,0.5)"
              />
            </g>
          ))}

          {/* Globe shine overlay */}
          <ellipse cx="130" cy="100" rx="40" ry="30" fill="url(#shineGrad)" />

          {/* Globe bottom chrome cap */}
          <ellipse cx="160" cy="232" rx="84" ry="12" fill="url(#chromeGrad)" />
          <ellipse cx="160" cy="232" rx="76" ry="8" fill="#C8C8C8" />

          {/* Globe top cap */}
          <ellipse cx="160" cy="64" rx="84" ry="12" fill="url(#chromeGrad)" />

          {/* Spinning shimmer on globe */}
          <motion.rect
            x="70"
            y="64"
            width="40"
            height="180"
            fill="rgba(255,255,255,0.12)"
            style={{ originX: "160px", originY: "148px" }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            rx="20"
          />
        </svg>
      </motion.div>

      {/* Falling gumball in chute */}
      <AnimatePresence>
        {isSpinning && (
          <motion.div
            key="falling"
            className="absolute"
            style={{ left: "50%", top: "35%", x: "-50%", zIndex: 20 }}
            initial={{ y: -80, opacity: 0, scale: 0.5 }}
            animate={{ y: 200, opacity: [0, 1, 1, 1], scale: [0.5, 1, 1, 0.95] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div
              className="w-10 h-10 rounded-full shadow-xl"
              style={{
                background: `radial-gradient(circle at 35% 32%, rgba(255,255,255,0.6) 0%, ${gumballColor} 50%, ${gumballColor}cc 100%)`,
                boxShadow: `0 4px 14px ${gumballColor}80`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disabled overlay */}
      {!canSpin && !isSpinning && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ mixBlendMode: "multiply" }}
        />
      )}
    </div>
  );
}
