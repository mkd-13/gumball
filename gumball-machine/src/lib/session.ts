// src/lib/session.ts
import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "gumball_session_id";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}
