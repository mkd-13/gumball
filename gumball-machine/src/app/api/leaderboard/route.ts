// src/app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

export async function GET() {
  try {
    const entries = await getLeaderboard(10);
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
