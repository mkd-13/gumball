// src/app/api/spin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { upsertUser, incrementUserCredits, addSpin, getSpinsToday } from "@/lib/db";
import { getRandomReward, getTodayDateString } from "@/lib/rewards";
import { MAX_DAILY_SPINS, SpinResponse, UserState } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Missing sessionId" }, { status: 400 });
    }

    const today = getTodayDateString();

    // Check today's spins
    const spins = await getSpinsToday(sessionId, today);
    if (spins.length >= MAX_DAILY_SPINS) {
      return NextResponse.json(
        { success: false, error: "Daily spin limit reached" },
        { status: 429 }
      );
    }

    const result = getRandomReward();

    // Ensure user exists, add spin, increment credits
    await upsertUser(sessionId);
    await addSpin({ sessionId, credits: result.credits, rarity: result.rarity, spinDate: today });
    const updatedUser = await incrementUserCredits(sessionId, result.credits);

    const newSpinsToday = spins.length + 1;
    const spinsRemaining = Math.max(0, MAX_DAILY_SPINS - newSpinsToday);

    const userState: UserState = {
      sessionId,
      spinsToday: newSpinsToday,
      spinsRemaining,
      totalCredits: updatedUser.totalCredits,
      lastSpinDate: today,
      canSpin: spinsRemaining > 0,
    };

    const response: SpinResponse = { success: true, result, userState };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Spin error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
