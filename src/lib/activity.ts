export type DayBucket = {
  day: string;
  label: string;
  minutes: number;
  // Détail du jour (fiche admin) : pages avec durée, documents ouverts.
  lines: string[];
};

type LeaveEvent = {
  created_at: string;
  duration_ms: number | null;
  path?: string | null;
};
type ClickEvent = { created_at: string; label: string | null };

const dayKey = (iso: string) => iso.slice(0, 10);

// Agrège les page_leave en minutes par jour sur les `days` derniers jours,
// avec un breakdown par page et les documents DocSend ouverts.
export function buildDailyBuckets(
  leaves: LeaveEvent[],
  days: number,
  docClicks: ClickEvent[] = []
): DayBucket[] {
  const totals = new Map<string, number>();
  const perPage = new Map<string, Map<string, number>>();
  for (const e of leaves) {
    const k = dayKey(e.created_at);
    totals.set(k, (totals.get(k) ?? 0) + (e.duration_ms ?? 0));
    if (e.path) {
      const pages = perPage.get(k) ?? new Map<string, number>();
      pages.set(e.path, (pages.get(e.path) ?? 0) + (e.duration_ms ?? 0));
      perPage.set(k, pages);
    }
  }

  const docsByDay = new Map<string, string[]>();
  for (const c of docClicks) {
    const k = dayKey(c.created_at);
    const list = docsByDay.get(k) ?? [];
    if (c.label && !list.includes(c.label)) list.push(c.label);
    docsByDay.set(k, list);
  }

  const labelFmt = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const buckets: DayBucket[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = d.toISOString().slice(0, 10);
    const minutes = Math.round((totals.get(k) ?? 0) / 60000);

    const lines: string[] = [];
    const pages = [...(perPage.get(k) ?? new Map()).entries()].sort(
      (a, b) => b[1] - a[1]
    );
    for (const [path, ms] of pages.slice(0, 4)) {
      const min = Math.round(ms / 60000);
      lines.push(`${path}, ${min >= 1 ? `${min} min` : "< 1 min"}`);
    }
    for (const doc of (docsByDay.get(k) ?? []).slice(0, 4)) {
      lines.push(`📄 ${doc}`);
    }

    buckets.push({ day: k, label: labelFmt.format(d), minutes, lines });
  }
  return buckets;
}
