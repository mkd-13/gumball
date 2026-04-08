// src/lib/db.ts
// Portable DB adapter:
//   - On Vercel: uses Vercel KV (Redis) via @vercel/kv
//   - Locally:   falls back to a simple in-memory store (resets on restart)
//
// To enable persistence locally, set DATABASE_URL="file:./dev.db" and use
// the Prisma branch instead (see README).

export interface UserRecord {
  sessionId: string;
  totalCredits: number;
  createdAt: string;
}

export interface SpinRecord {
  id: string;
  sessionId: string;
  credits: number;
  rarity: string;
  spinDate: string;
  createdAt: string;
}

// ─── In-process fallback store (dev / non-KV environments) ───────────────────
const memUsers = new Map<string, UserRecord>();
const memSpins: SpinRecord[] = [];

// ─── KV helpers ──────────────────────────────────────────────────────────────
async function getKV() {
  // Dynamically import so the app doesn't crash when KV isn't configured
  if (
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    const { kv } = await import("@vercel/kv");
    return kv;
  }
  return null;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getUser(sessionId: string): Promise<UserRecord | null> {
  const kv = await getKV();
  if (kv) {
    return (await kv.get<UserRecord>(`user:${sessionId}`)) ?? null;
  }
  return memUsers.get(sessionId) ?? null;
}

export async function upsertUser(sessionId: string, credits = 0): Promise<UserRecord> {
  const existing = await getUser(sessionId);
  if (existing) return existing;

  const record: UserRecord = {
    sessionId,
    totalCredits: credits,
    createdAt: new Date().toISOString(),
  };

  const kv = await getKV();
  if (kv) {
    await kv.set(`user:${sessionId}`, record);
    // Track session list for leaderboard
    await kv.zadd("leaderboard", { score: 0, member: sessionId });
  } else {
    memUsers.set(sessionId, record);
  }
  return record;
}

export async function incrementUserCredits(
  sessionId: string,
  amount: number
): Promise<UserRecord> {
  const kv = await getKV();
  if (kv) {
    const user = await getUser(sessionId) ?? {
      sessionId,
      totalCredits: 0,
      createdAt: new Date().toISOString(),
    };
    user.totalCredits += amount;
    await kv.set(`user:${sessionId}`, user);
    await kv.zadd("leaderboard", { score: user.totalCredits, member: sessionId });
    return user;
  }

  // mem fallback
  const user = memUsers.get(sessionId) ?? {
    sessionId,
    totalCredits: 0,
    createdAt: new Date().toISOString(),
  };
  user.totalCredits += amount;
  memUsers.set(sessionId, user);
  return user;
}

export async function addSpin(spin: Omit<SpinRecord, "id" | "createdAt">): Promise<SpinRecord> {
  const record: SpinRecord = {
    ...spin,
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
  };

  const kv = await getKV();
  if (kv) {
    // Store spin in a list keyed by sessionId + date
    const key = `spins:${spin.sessionId}:${spin.spinDate}`;
    await kv.rpush(key, JSON.stringify(record));
    // Expire after 2 days so we don't accumulate forever
    await kv.expire(key, 60 * 60 * 48);
  } else {
    memSpins.push(record);
  }
  return record;
}

export async function getSpinsToday(
  sessionId: string,
  today: string
): Promise<SpinRecord[]> {
  const kv = await getKV();
  if (kv) {
    const key = `spins:${sessionId}:${today}`;
    const raw = await kv.lrange<string>(key, 0, -1);
    return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
  }
  return memSpins.filter(
    (s) => s.sessionId === sessionId && s.spinDate === today
  );
}

export async function getLeaderboard(
  limit = 10
): Promise<Array<{ sessionId: string; totalCredits: number; rank: number }>> {
  const kv = await getKV();
  if (kv) {
    // Get members sorted by score descending, without withScores
    // Then fetch each user's totalCredits from their record for accuracy
    const members = await kv.zrange("leaderboard", 0, limit - 1, { rev: true });

    const entries: Array<{ sessionId: string; totalCredits: number; rank: number }> = [];
    for (const member of members as string[]) {
      const user = await kv.get<UserRecord>(`user:${member}`);
      if (user && user.totalCredits > 0) {
        entries.push({
          sessionId: member,
          totalCredits: user.totalCredits,
          rank: entries.length + 1,
        });
      }
    }
    return entries;
  }

  // mem fallback
  const map = new Map<string, number>();
  for (const user of memUsers.values()) {
    if (user.totalCredits > 0) map.set(user.sessionId, user.totalCredits);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([sessionId, totalCredits], i) => ({ sessionId, totalCredits, rank: i + 1 }));
}
