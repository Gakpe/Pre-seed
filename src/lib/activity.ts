export type DayBucket = { day: string; label: string; minutes: number };

type LeaveEvent = { created_at: string; duration_ms: number | null };

// Agrège les page_leave en minutes par jour sur les `days` derniers jours.
export function buildDailyBuckets(events: LeaveEvent[], days: number): DayBucket[] {
  const key = (d: Date) => d.toISOString().slice(0, 10);
  const totals = new Map<string, number>();
  for (const e of events) {
    const k = key(new Date(e.created_at));
    totals.set(k, (totals.get(k) ?? 0) + (e.duration_ms ?? 0));
  }

  const labelFmt = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" });
  const buckets: DayBucket[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = key(d);
    buckets.push({
      day: k,
      label: labelFmt.format(d),
      minutes: Math.round((totals.get(k) ?? 0) / 60000),
    });
  }
  return buckets;
}
