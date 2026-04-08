// src/app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { totalCredits: { gt: 0 } },
      orderBy: { totalCredits: "desc" },
      take: 10,
    });

    const entries = users.map((user, i) => ({
      rank: i + 1,
      sessionId: user.sessionId,
      totalCredits: user.totalCredits,
    }));

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
