// src/lib/rewards.ts
import { REWARD_POOL, SpinResult } from "@/types";

export function getRandomReward(): SpinResult {
  const totalWeight = REWARD_POOL.reduce((sum, r) => sum + r.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const reward of REWARD_POOL) {
    rand -= reward.weight;
    if (rand <= 0) {
      return {
        credits: reward.credits,
        rarity: reward.rarity,
        label: reward.label,
        color: reward.color,
        gumballColor: reward.gumballColor,
      };
    }
  }

  // Fallback to first reward
  const fallback = REWARD_POOL[0];
  return {
    credits: fallback.credits,
    rarity: fallback.rarity,
    label: fallback.label,
    color: fallback.color,
    gumballColor: fallback.gumballColor,
  };
}

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}
