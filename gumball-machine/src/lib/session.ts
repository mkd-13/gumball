// src/lib/session.ts
const SESSION_KEY = "gumball_session_id";

function generateId(): string {
  // crypto.randomUUID() is available in all modern browsers and Node 14.17+
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}
