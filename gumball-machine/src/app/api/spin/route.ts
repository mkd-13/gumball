// src/app/api/spin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    // Upsert user
    let user = await prisma.user.findUnique({ where: { sessionId } });
    if (!user) {
      user = await prisma.user.create({ data: { sessionId, totalCredits: 0 } });
    }

    // Count today's spins
    const spinsToday = await prisma.spin.count({
      where: { userId: user.id, spinDate: today },
    });

    if (spinsToday >= MAX_DAILY_SPINS) {
      return NextResponse.json(
        { success: false, error: "Daily spin limit reached" },
        { status: 429 }
      );
    }

    // Generate reward
    const result = getRandomReward();

    // Record spin and update credits in a transaction
    await prisma.$transaction([
      prisma.spin.create({
        data: {
          userId: user.id,
          credits: result.credits,
          rarity: result.rarity,
          spinDate: today,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { totalCredits: { increment: result.credits } },
      }),
    ]);

    // Get updated state
    const newSpinsToday = spinsToday + 1;
    const spinsRemaining = Math.max(0, MAX_DAILY_SPINS - newSpinsToday);

    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });

    const userState: UserState = {
      sessionId,
      spinsToday: newSpinsToday,
      spinsRemaining,
      totalCredits: updatedUser?.totalCredits ?? 0,
      lastSpinDate: today,
      canSpin: spinsRemaining > 0,
    };

    const response: SpinResponse = {
      success: true,
      result,
      userState,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Spin error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
