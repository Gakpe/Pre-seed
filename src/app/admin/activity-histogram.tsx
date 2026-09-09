import type { DayBucket } from "@/lib/activity";

// Infobulle CSS instantanée (pas le `title` natif, trop lent).
function Tooltip({ bucket, below }: { bucket: DayBucket; below?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute left-1/2 z-30 w-max max-w-56 -translate-x-1/2 rounded-md bg-foreground px-3 py-2 text-left text-xs leading-5 text-background opacity-0 shadow-lg transition-opacity duration-100 group-hover/bar:opacity-100 ${
        below ? "top-full mt-1.5" : "bottom-full mb-1.5"
      }`}
    >
      <p className="font-semibold">
        {bucket.label}, {bucket.minutes} min
      </p>
      {bucket.lines.map((line) => (
        <p key={line} className="truncate text-background/80">
          {line}
        </p>
      ))}
    </div>
  );
}

// Histogramme minutes/jour, n'affiche QUE les jours avec de l'activité.
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
      <div className="flex items-end gap-1" style={{ height: 26 }}>
        {active.map((b) => (
          <div
            key={b.day}
            className="group/bar relative flex h-full items-end px-0.5"
          >
            <Tooltip bucket={b} below />
            <div
              className="w-3 rounded-sm bg-brand/80 group-hover/bar:bg-brand"
              style={{ height: Math.max(7, (b.minutes / max) * 26) }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
      {active.map((b) => (
        <div
          key={b.day}
          className="group/bar relative flex cursor-default flex-col items-center gap-1"
        >
          <Tooltip bucket={b} />
          <span className="text-xs font-medium tabular-nums text-neutral-600">
            {b.minutes}&thinsp;min
          </span>
          <div
            className="w-10 rounded-md bg-brand/80 transition-colors group-hover/bar:bg-brand"
            style={{ height: Math.max(10, (b.minutes / max) * 80) }}
          />
          <span className="text-[10px] text-neutral-500">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
