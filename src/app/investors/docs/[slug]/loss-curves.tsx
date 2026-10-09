"use client";

import { useState } from "react";
import { LOSS_SCENARIOS, type LossScenario } from "@/lib/risk-levels";
import type { Locale } from "@/lib/i18n";
import { SectionTitle } from "./section-title";

// Scénarios de pertes cumulées, version synthétique de la courbe du deck risk
// Kupanda : trois courbes, leur niveau final au bout, et une légende qui tient
// lieu de tableau (niveau, multiple de l'historique, impact investisseur).
// Survoler une courbe ou une ligne de légende met ce scénario en avant.
//
// Couleurs validées au script dataviz (08/10/2026) contre la surface de la
// fiche : vert, marsala, orange. Le vert est sous 3:1, d'où l'étiquette au
// bout de chaque courbe et la légende détaillée. Le point mort est aussi en
// pointillé : l'identité ne repose jamais sur la seule couleur.
const STYLE: Record<LossScenario["id"], { color: string; dash?: string }> = {
  breakeven: { color: "#f26522", dash: "7 6" },
  base: { color: "#8a3b2e" },
  historical: { color: "#1baf7a" },
};

// Largeur de référence resserrée : sur mobile le SVG rétrécit, et ses textes
// avec lui ; à 440 ils restent lisibles.
const W = 440;
const H = 300;
const PAD = { left: 44, right: 64, top: 16, bottom: 36 };
const Y_MAX = 32;
const TICKS = [0, 10, 20, 30];

const x = (i: number) => PAD.left + (i * (W - PAD.left - PAD.right)) / 3;
const y = (v: number) => H - PAD.bottom - (v / Y_MAX) * (H - PAD.top - PAD.bottom);

// Courbe lissée (Catmull-Rom vers Bézier) : l'allure du deck, sans angles.
function path(points: number[]) {
  const p = points.map((v, i) => [x(i), y(v)] as const);
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function withBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

export function LossCurves({ locale }: { locale: Locale }) {
  const d = LOSS_SCENARIOS;
  const [active, setActive] = useState<LossScenario["id"] | null>(null);
  const shown = d.scenarios.find((s) => s.id === active) ?? null;
  const fade = (id: LossScenario["id"]) => (active && active !== id ? 0.2 : 1);

  return (
    <section className="mt-14">
      <SectionTitle icon="trend">{d.title[locale]}</SectionTitle>
      <p className="mt-4 max-w-3xl text-[15px] leading-[1.8] text-neutral-700">
        {withBold(d.lead[locale])}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
        <figure className="rounded-xl border border-risk-border bg-risk-surface p-4 sm:p-6">
          <div className="relative">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="h-auto w-full"
              role="img"
              aria-label={d.scenarios
                .map((s) => `${s.name[locale]} ${s.value[locale]}`)
                .join(", ")}
            >
              {TICKS.map((t) => (
                <g key={t}>
                  <line
                    x1={PAD.left}
                    x2={W - PAD.right + 8}
                    y1={y(t)}
                    y2={y(t)}
                    stroke="var(--risk-border)"
                    strokeWidth={1}
                  />
                  <text
                    x={PAD.left - 8}
                    y={y(t) + 4}
                    textAnchor="end"
                    className="fill-neutral-600 text-[13px] tabular-nums"
                  >
                    {t}
                    {locale === "fr" ? " %" : "%"}
                  </text>
                </g>
              ))}
              {d.quarters.map((q, i) => (
                <text
                  key={q.fr}
                  x={x(i)}
                  y={H - 10}
                  textAnchor="middle"
                  className="fill-neutral-600 text-[13px]"
                >
                  {q[locale]}
                </text>
              ))}

              {d.scenarios.map((s) => {
                const end = s.points[s.points.length - 1];
                return (
                  <g
                    key={s.id}
                    style={{ opacity: fade(s.id), transition: "opacity 150ms" }}
                    onMouseEnter={() => setActive(s.id)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <path
                      d={path(s.points)}
                      fill="none"
                      stroke={STYLE[s.id].color}
                      strokeWidth={2}
                      strokeDasharray={STYLE[s.id].dash}
                      strokeLinecap="round"
                    />
                    {/* Zone de survol plus large que le trait. */}
                    <path
                      d={path(s.points)}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={18}
                      pointerEvents="stroke"
                    />
                    <circle
                      cx={x(3)}
                      cy={y(end)}
                      r={4}
                      fill={STYLE[s.id].color}
                      stroke="var(--risk-surface)"
                      strokeWidth={2}
                    />
                    <text
                      x={x(3) + 10}
                      y={y(end) + 4}
                      className="fill-foreground text-[15px] font-semibold tabular-nums"
                    >
                      {s.value[locale]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Infobulle du scénario survolé, au bout de sa courbe. */}
            {shown && (
              <div
                className="pointer-events-none absolute z-10 w-56 -translate-x-full -translate-y-full rounded-lg border border-foreground/10 bg-white px-3 py-2 text-xs leading-5 shadow-md"
                style={{
                  left: `${(x(2) / W) * 100}%`,
                  top: `${(y(shown.points[2]) / H) * 100}%`,
                }}
              >
                <p className="font-semibold text-foreground">
                  {shown.name[locale]}, {shown.value[locale]}
                </p>
                <p className="text-neutral-600">
                  {shown.multiple[locale]}, {shown.impact[locale]}
                </p>
              </div>
            )}
          </div>
          <figcaption className="mt-3 text-xs leading-5 text-neutral-600">
            {d.caption[locale]}
          </figcaption>
        </figure>

        {/* Légende et vue en tableau : un scénario par ligne, du plus dur au
            plus doux, dans l'ordre des courbes. */}
        <ul className="divide-y divide-risk-border border-y border-risk-border">
          {d.scenarios.map((s) => (
            <li
              key={s.id}
              tabIndex={0}
              onMouseEnter={() => setActive(s.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(s.id)}
              onBlur={() => setActive(null)}
              className="py-4 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-marsala/40"
              style={{ opacity: fade(s.id) === 1 ? 1 : 0.45 }}
            >
              <p className="flex items-center gap-3 text-sm font-semibold text-foreground">
                <svg aria-hidden width="28" height="8" className="shrink-0">
                  <line
                    x1="1"
                    x2="27"
                    y1="4"
                    y2="4"
                    stroke={STYLE[s.id].color}
                    strokeWidth={2.5}
                    strokeDasharray={STYLE[s.id].dash ? "5 4" : undefined}
                    strokeLinecap="round"
                  />
                </svg>
                {s.name[locale]}, {s.value[locale]}
              </p>
              <p className="mt-1.5 pl-10 text-sm leading-6 text-neutral-700">{s.body[locale]}</p>
              <p className="mt-1 pl-10 text-sm text-neutral-600">
                {s.multiple[locale]}, {s.impact[locale]}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
