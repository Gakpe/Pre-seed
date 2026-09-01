import type { DayBucket } from "@/lib/activity";

// Histogramme minutes/jour. Version mini (liste) ou large (fiche, avec labels).
export function ActivityHistogram({
  buckets,
  size = "mini",
}: {
  buckets: DayBucket[];
  size?: "mini" | "large";
}) {
  const max = Math.max(...buckets.map((b) => b.minutes), 1);
  const barHeight = size === "mini" ? 22 : 72;
  const gap = size === "mini" ? "gap-[2px]" : "gap-1";
  const width = size === "mini" ? "w-[5px]" : "flex-1";

  return (
    <div>
      <div className={`flex items-end ${gap}`} style={{ height: barHeight }}>
        {buckets.map((b) => (
          <div
            key={b.day}
            title={`${b.label} — ${b.minutes} min`}
            className={`${width} rounded-sm ${
              b.minutes > 0 ? "bg-brand/80" : "bg-neutral-200"
            }`}
            style={{
              height: b.minutes > 0 ? Math.max(4, (b.minutes / max) * barHeight) : 2,
            }}
          />
        ))}
      </div>
      {size === "large" && (
        <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
          <span>{buckets[0]?.label}</span>
          <span>{buckets[Math.floor(buckets.length / 2)]?.label}</span>
          <span>{buckets[buckets.length - 1]?.label}</span>
        </div>
      )}
    </div>
  );
}
