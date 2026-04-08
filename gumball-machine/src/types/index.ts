// src/types/index.ts

export type Rarity = "common" | "uncommon" | "rare" | "legendary";

export interface RewardConfig {
  credits: number;
  rarity: Rarity;
  weight: number;
  label: string;
  color: string;
  gumballColor: string;
}

export interface SpinResult {
  credits: number;
  rarity: Rarity;
  label: string;
  color: string;
  gumballColor: string;
}

export interface UserState {
  sessionId: string;
  spinsToday: number;
  spinsRemaining: number;
  totalCredits: number;
  lastSpinDate: string | null;
  canSpin: boolean;
}

export interface SpinResponse {
  success: boolean;
  result?: SpinResult;
  userState?: UserState;
  error?: string;
}

export const MAX_DAILY_SPINS = 3;

export const REWARD_POOL: RewardConfig[] = [
  {
    credits: 5,
    rarity: "common",
    weight: 50,
    label: "+5 Gumloop Credits",
    color: "#6BCB77",
    gumballColor: "#6BCB77",
  },
  {
    credits: 10,
    rarity: "common",
    weight: 25,
    label: "+10 Gumloop Credits",
    color: "#4D96FF",
    gumballColor: "#4D96FF",
  },
  {
    credits: 20,
    rarity: "uncommon",
    weight: 15,
    label: "+20 Gumloop Credits",
    color: "#FFD93D",
    gumballColor: "#FFD93D",
  },
  {
    credits: 50,
    rarity: "rare",
    weight: 8,
    label: "+50 Gumloop Credits 🔥",
    color: "#FF9A3C",
    gumballColor: "#FF9A3C",
  },
  {
    credits: 100,
    rarity: "legendary",
    weight: 2,
    label: "+100 Gumloop Credits ⭐",
    color: "#C77DFF",
    gumballColor: "#C77DFF",
  },
];
