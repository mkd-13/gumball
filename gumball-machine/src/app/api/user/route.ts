// src/app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUser, getSpinsToday } from "@/lib/db";
import { getTodayDateString } from "@/lib/rewards";
import { MAX_DAILY_SPINS, UserState } from "@/types";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  try {
    const today = getTodayDateString();
    const [user, spins] = await Promise.all([
      getUser(sessionId),
      getSpinsToday(sessionId, today),
    ]);

    const spinsToday = spins.length;
    const spinsRemaining = Math.max(0, MAX_DAILY_SPINS - spinsToday);

    const state: UserState = {
      sessionId,
      spinsToday,
      spinsRemaining,
      totalCredits: user?.totalCredits ?? 0,
      lastSpinDate: spins.length > 0 ? today : null,
      canSpin: spinsRemaining > 0,
    };

    return NextResponse.json(state);
  } catch (error) {
    console.error("Error fetching user state:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
