export function formatDuration(ms: number): string {
  const mins = Math.round(ms / 60000);
  if (mins < 1) return ms > 0 ? "< 1 min" : "—";
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)} h ${String(mins % 60).padStart(2, "0")}`;
}
