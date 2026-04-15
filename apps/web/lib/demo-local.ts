export type PendingQueuedReport = {
  id: string;
  location: string;
  summary: string;
  signalType: string;
  confidenceScore: number;
  verificationState: string;
  createdAt: string;
};

const PENDING_REPORTS_KEY = "gin.pendingReports";
const FOCUS_KEY_PREFIX = "gin.focus.";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Swallow storage exceptions in demo mode.
  }
}

export function isLocalProfileId(profileId?: string) {
  return Boolean(profileId?.startsWith("profile-"));
}

export function getLocalFocus(profileId: string) {
  return readJson<string>(`${FOCUS_KEY_PREFIX}${profileId}`, "");
}

export function saveLocalFocus(profileId: string, sector: string) {
  writeJson(`${FOCUS_KEY_PREFIX}${profileId}`, sector);
}

export function enqueuePendingReport(report: Omit<PendingQueuedReport, "createdAt">) {
  const current = readJson<PendingQueuedReport[]>(PENDING_REPORTS_KEY, []);
  const next: PendingQueuedReport[] = [{ ...report, createdAt: new Date().toISOString() }, ...current];
  writeJson(PENDING_REPORTS_KEY, next.slice(0, 30));
}

export function getPendingQueuedReports() {
  return readJson<PendingQueuedReport[]>(PENDING_REPORTS_KEY, []);
}
