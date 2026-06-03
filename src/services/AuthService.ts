import { getUserByEmail, getUserById, recordLogin } from "./UserService";
import type { User } from "../types";

const SESSION_KEY = "urbanova_auth_session";
const ATTEMPTS_PREFIX = "urbanova_auth_attempts_";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

interface Session {
  userId: string;
  loginAt: string;
}

interface AttemptRecord {
  count: number;
  lockUntil: number | null;
}

export type LoginError =
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_LOCKED"
  | "ACCOUNT_INACTIVE";

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: LoginError;
  lockUntil?: number;
}

function attemptKey(email: string): string {
  return `${ATTEMPTS_PREFIX}${email.toLowerCase()}`;
}

function getRecord(email: string): AttemptRecord {
  try {
    const raw = localStorage.getItem(attemptKey(email));
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lockUntil: null };
}

function saveRecord(email: string, record: AttemptRecord): void {
  localStorage.setItem(attemptKey(email), JSON.stringify(record));
}

function recordFailedAttempt(email: string): number | null {
  const record = getRecord(email);
  const count = record.count + 1;
  const lockUntil = count >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : null;
  saveRecord(email, { count, lockUntil });
  return lockUntil;
}

function clearAttempts(email: string): void {
  localStorage.removeItem(attemptKey(email));
}

export function getLockoutUntil(email: string): number | null {
  const record = getRecord(email);
  if (record.lockUntil && record.lockUntil <= Date.now()) {
    clearAttempts(email);
    return null;
  }
  return record.lockUntil;
}

export function getRemainingAttempts(email: string): number {
  return Math.max(0, MAX_ATTEMPTS - getRecord(email).count);
}

export function login(email: string, password: string): LoginResult {
  const lockUntil = getLockoutUntil(email);
  if (lockUntil) {
    return { success: false, error: "ACCOUNT_LOCKED", lockUntil };
  }

  const user = getUserByEmail(email);
  if (!user || user.password !== password) {
    const newLock = recordFailedAttempt(email);
    if (newLock) {
      return { success: false, error: "ACCOUNT_LOCKED", lockUntil: newLock };
    }
    return { success: false, error: "INVALID_CREDENTIALS" };
  }

  if (!user.isActive) {
    return { success: false, error: "ACCOUNT_INACTIVE" };
  }

  clearAttempts(email);
  recordLogin(user.id);

  const session: Session = { userId: user.id, loginAt: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, user };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getStoredSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: Session = JSON.parse(raw);
    const user = getUserById(session.userId);
    return user?.isActive ? user : null;
  } catch {
    return null;
  }
}
