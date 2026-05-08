export type SessionRole = "admin" | "teacher" | "parent";

export interface Session {
  role: SessionRole;
  phone: string;
  schoolCode: string;
  name?: string;
  activeChildId?: string;
}

export interface PendingAuth {
  role: SessionRole;
  phone: string;
}

const SESSION_KEY = "smartschool_session";
const PENDING_KEY = "ss_pending_auth";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PENDING_KEY);
}

export function getPendingAuth(): PendingAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingAuth) : null;
  } catch {
    return null;
  }
}

export function setPendingAuth(auth: PendingAuth): void {
  localStorage.setItem(PENDING_KEY, JSON.stringify(auth));
}

export function clearPendingAuth(): void {
  localStorage.removeItem(PENDING_KEY);
}

export function setActiveChild(childId: string): void {
  const session = getSession();
  if (session?.role === "parent") {
    setSession({ ...session, activeChildId: childId });
  }
}
