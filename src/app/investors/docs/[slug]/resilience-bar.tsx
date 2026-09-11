import { RESILIENCE } from "@/lib/risk-levels";
import type { Locale } from "@/lib/i18n";

// Bandeau de résistance du portefeuille. Repères fixes, aucun curseur, aucun
// calcul : c'est une échelle de lecture, pas un modèle. La barre couvre 0–30 %
// de pertes cumulées, chaque segment est proportionnel à sa plage.
const SEGMENTS = [
  { width: "16.6667%", className: "bg-risk-ok" },
  { width: "33.3333%", className: "bg-risk-critical/35" },
  { width: "50%", className: "bg-risk-critical" },
];

export function ResilienceBar({ locale }: { locale: Locale }) {
  return (
    <section className="mt-12 rounded-lg border border-risk-border bg-risk-surface p-6 sm:p-8">
      <p className="max-w-2xl text-sm leading-7 text-neutral-700">
        {RESILIENCE.headline[locale]}
      </p>

      <div className="mt-8">
        <div className="resilience-fill flex h-3 overflow-hidden rounded-full">
          {SEGMENTS.map((s) => (
            <div key={s.width} className={s.className} style={{ width: s.width }} />
          ))}
        </div>

        {/* repères aux frontières de segments */}
        <div className="relative h-3">
          {SEGMENTS.map((s, i) => {
            const left = SEGMENTS.slice(0, i + 1).reduce(
              (acc, seg) => acc + parseFloat(seg.width),
              0
            );
            return (
              <span
                key={s.width}
                className="absolute top-0 h-2 w-px bg-neutral-300"
                style={{ left: `calc(${left}% - 0.5px)` }}
              />
            );
          })}
        </div>

        {/* Au-delà du mobile, chaque repère s'aligne sur son segment. */}
        <dl className="hidden text-xs sm:flex">
          {RESILIENCE.marks.map((m, i) => (
            <div key={m.at} style={{ width: SEGMENTS[i].width }} className="pr-3">
              <dt className="font-semibold tabular-nums text-foreground">
                {m.label[locale]}
              </dt>
              <dd className="mt-0.5 leading-5 text-neutral-500">{m.caption[locale]}</dd>
            </div>
          ))}
        </dl>

        {/* En mobile les segments sont trop étroits : on empile la légende. */}
        <dl className="mt-1 space-y-1 text-xs sm:hidden">
          {RESILIENCE.marks.map((m) => (
            <div key={m.at} className="flex gap-3">
              <dt className="w-12 shrink-0 font-semibold tabular-nums text-foreground">
                {m.label[locale]}
              </dt>
              <dd className="leading-5 text-neutral-500">{m.caption[locale]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
