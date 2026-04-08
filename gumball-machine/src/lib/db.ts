// src/lib/db.ts
//
// Storage adapter — zero native imports.
// • Production (Vercel KV set):  uses Vercel KV REST API via fetch()
// • Local / no-KV:              falls back to in-memory store
//
// Required env vars (auto-set when you add a KV store in Vercel dashboard):
//   KV_REST_API_URL
//   KV_REST_API_TOKEN

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

// ---------------------------------------------------------------------------
// In-memory fallback (local dev without KV env vars)
// ---------------------------------------------------------------------------
const memUsers = new Map<string, UserRecord>();
const memSpins: SpinRecord[] = [];

// ---------------------------------------------------------------------------
// KV REST helpers — plain fetch, no npm package needed
// ---------------------------------------------------------------------------
function kvConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

async function kvFetch(
  cfg: { url: string; token: string },
  ...parts: (string | number)[]
): Promise<unknown> {
  const path = parts.map(encodeURIComponent).join("/");
  const res = await fetch(`${cfg.url}/${path}`, {
    headers: { Authorization: `Bearer ${cfg.token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.result ?? null;
}

async function kvSet(cfg: { url: string; token: string }, key: string, value: unknown) {
  await kvFetch(cfg, "SET", key, JSON.stringify(value));
}

async function kvGet<T>(cfg: { url: string; token: string }, key: string): Promise<T | null> {
  const raw = await kvFetch(cfg, "GET", key);
  if (raw === null || raw === undefined) return null;
  try { return typeof raw === "string" ? JSON.parse(raw) as T : raw as T; }
  catch { return raw as T; }
}

async function kvRpush(cfg: { url: string; token: string }, key: string, value: string) {
  await kvFetch(cfg, "RPUSH", key, value);
}

async function kvExpire(cfg: { url: string; token: string }, key: string, secs: number) {
  await kvFetch(cfg, "EXPIRE", key, secs);
}

async function kvLrange(
  cfg: { url: string; token: string },
  key: string, start: number, stop: number
): Promise<string[]> {
  const r = await kvFetch(cfg, "LRANGE", key, start, stop);
  return (r as string[]) ?? [];
}

async function kvZadd(
  cfg: { url: string; token: string },
  key: string, score: number, member: string
) {
  await kvFetch(cfg, "ZADD", key, score, member);
}

async function kvZrevrange(
  cfg: { url: string; token: string },
  key: string, start: number, stop: number
): Promise<string[]> {
  const r = await kvFetch(cfg, "ZREVRANGE", key, start, stop);
  return (r as string[]) ?? [];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getUser(sessionId: string): Promise<UserRecord | null> {
  const cfg = kvConfig();
  if (cfg) return kvGet<UserRecord>(cfg, `user:${sessionId}`);
  return memUsers.get(sessionId) ?? null;
}

export async function upsertUser(sessionId: string): Promise<UserRecord> {
  const existing = await getUser(sessionId);
  if (existing) return existing;
  const record: UserRecord = { sessionId, totalCredits: 0, createdAt: new Date().toISOString() };
  const cfg = kvConfig();
  if (cfg) {
    await kvSet(cfg, `user:${sessionId}`, record);
    await kvZadd(cfg, "leaderboard", 0, sessionId);
  } else {
    memUsers.set(sessionId, record);
  }
  return record;
}

export async function incrementUserCredits(sessionId: string, amount: number): Promise<UserRecord> {
  const cfg = kvConfig();
  const existing = await getUser(sessionId);
  const user: UserRecord = existing ?? { sessionId, totalCredits: 0, createdAt: new Date().toISOString() };
  user.totalCredits += amount;
  if (cfg) {
    await kvSet(cfg, `user:${sessionId}`, user);
    await kvZadd(cfg, "leaderboard", user.totalCredits, sessionId);
  } else {
    memUsers.set(sessionId, user);
  }
  return user;
}

export async function addSpin(spin: Omit<SpinRecord, "id" | "createdAt">): Promise<SpinRecord> {
  const record: SpinRecord = { ...spin, id: Math.random().toString(36).slice(2), createdAt: new Date().toISOString() };
  const cfg = kvConfig();
  if (cfg) {
    const key = `spins:${spin.sessionId}:${spin.spinDate}`;
    await kvRpush(cfg, key, JSON.stringify(record));
    await kvExpire(cfg, key, 60 * 60 * 48);
  } else {
    memSpins.push(record);
  }
  return record;
}

export async function getSpinsToday(sessionId: string, today: string): Promise<SpinRecord[]> {
  const cfg = kvConfig();
  if (cfg) {
    const raw = await kvLrange(cfg, `spins:${sessionId}:${today}`, 0, -1);
    return raw.map((r) => { try { return typeof r === "string" ? JSON.parse(r) as SpinRecord : r as unknown as SpinRecord; } catch { return r as unknown as SpinRecord; } });
  }
  return memSpins.filter((s) => s.sessionId === sessionId && s.spinDate === today);
}

export async function getLeaderboard(limit = 10): Promise<Array<{ sessionId: string; totalCredits: number; rank: number }>> {
  const cfg = kvConfig();
  if (cfg) {
    const members = await kvZrevrange(cfg, "leaderboard", 0, limit - 1);
    const entries: Array<{ sessionId: string; totalCredits: number; rank: number }> = [];
    for (const member of members) {
      const user = await kvGet<UserRecord>(cfg, `user:${member}`);
      if (user && user.totalCredits > 0) entries.push({ sessionId: member, totalCredits: user.totalCredits, rank: entries.length + 1 });
    }
    return entries;
  }
  return Array.from(memUsers.values())
    .filter((u) => u.totalCredits > 0)
    .sort((a, b) => b.totalCredits - a.totalCredits)
    .slice(0, limit)
    .map((u, i) => ({ sessionId: u.sessionId, totalCredits: u.totalCredits, rank: i + 1 }));
}
