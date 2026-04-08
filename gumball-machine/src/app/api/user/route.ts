// src/app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTodayDateString } from "@/lib/rewards";
import { MAX_DAILY_SPINS, UserState } from "@/types";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { sessionId },
      include: {
        spins: {
          where: { spinDate: getTodayDateString() },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      // New user — return default state
      const state: UserState = {
        sessionId,
        spinsToday: 0,
        spinsRemaining: MAX_DAILY_SPINS,
        totalCredits: 0,
        lastSpinDate: null,
        canSpin: true,
      };
      return NextResponse.json(state);
    }

    const spinsToday = user.spins.length;
    const spinsRemaining = Math.max(0, MAX_DAILY_SPINS - spinsToday);

    const state: UserState = {
      sessionId,
      spinsToday,
      spinsRemaining,
      totalCredits: user.totalCredits,
      lastSpinDate: user.spins[0]?.spinDate ?? null,
      canSpin: spinsRemaining > 0,
    };

    return NextResponse.json(state);
  } catch (error) {
    console.error("Error fetching user state:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
