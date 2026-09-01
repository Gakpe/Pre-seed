import type { DayBucket } from "@/lib/activity";

// Histogramme minutes/jour — n'affiche QUE les jours avec de l'activité,
// barres larges et faciles à survoler. Mini (liste) ou large (fiche).
export function ActivityHistogram({
  buckets,
  size = "mini",
}: {
  buckets: DayBucket[];
  size?: "mini" | "large";
}) {
  const active = buckets.filter((b) => b.minutes > 0);
  if (active.length === 0) {
    return size === "large" ? (
      <p className="text-sm text-neutral-500">Aucune activité enregistrée.</p>
    ) : null;
  }

  const max = Math.max(...active.map((b) => b.minutes), 1);

  if (size === "mini") {
    return (
      <div className="flex items-end gap-1" style={{ height: 24 }}>
        {active.map((b) => (
          <div
            key={b.day}
            title={`${b.label} — ${b.minutes} min`}
            className="w-2.5 rounded-sm bg-brand/80 hover:bg-brand"
            style={{ height: Math.max(6, (b.minutes / max) * 24) }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      {active.map((b) => (
        <div key={b.day} className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium tabular-nums text-neutral-600">
            {b.minutes}&thinsp;min
          </span>
          <div
            title={`${b.label} — ${b.minutes} min`}
            className="w-9 rounded-md bg-brand/80 transition-colors hover:bg-brand"
            style={{ height: Math.max(10, (b.minutes / max) * 80) }}
          />
          <span className="text-[10px] text-neutral-500">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
