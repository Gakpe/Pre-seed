import type { EventType } from "@/lib/types";

export type TrackPayload = {
  type: EventType;
  path: string;
  label?: string;
  duration_ms?: number;
  scroll_depth?: number;
  session_id?: string;
};

const SESSION_KEY = "minah_session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// sendBeacon pour survivre à la fermeture de l'onglet, fetch keepalive en secours.
export function track(payload: TrackPayload) {
  const body = JSON.stringify({ ...payload, session_id: getSessionId() });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([body], { type: "application/json" })
      );
      return;
    }
  } catch {
    // on retombe sur fetch
  }
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
