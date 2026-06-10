export const CHARTER_SEARCH_PENDING_KEY = "charterSearchPending";

export function markCharterSearchPending(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CHARTER_SEARCH_PENDING_KEY, "1");
}

export function clearCharterSearchPending(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHARTER_SEARCH_PENDING_KEY);
}

export function isCharterSearchPending(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(CHARTER_SEARCH_PENDING_KEY) === "1";
}
