"use client";

import { useState } from "react";
import {
  MAP_RESTING_NOTE,
  RATE_AXIS,
  REGIONS,
  type Region,
} from "@/lib/market-note";

// Carte des taux PME et fourchettes par région. Survol croisé : la carte et le
// graphique se répondent. Au repos la synthèse reste affichée, la
// visualisation doit tenir sur une capture d'écran, sans interaction.
const X0 = 130;
const X1 = 530;
const BAR_Y = (i: number) => 48 + i * 52;
const sx = (v: number) => X0 + (v / RATE_AXIS.max) * (X1 - X0);
const REF_X = sx(RATE_AXIS.reference);

export function AfricaRatesMap() {
  const [active, setActive] = useState<string | null>(null);
  const region = REGIONS.find((r) => r.id === active) ?? null;
  const on = (r: Region) => !active || active === r.id;

  const handlers = (id: string) => ({
    role: "button" as const,
    tabIndex: 0,
    "data-region": id,
    onMouseEnter: () => setActive(id),
    onMouseLeave: () => setActive(null),
    className: "cursor-pointer focus-visible:outline-2 focus-visible:outline-note-accent",
  });

  // Le focus est capté ici : posé sur les <path> et <g>, React ne le voit pas.
  function onFocusIn(e: React.FocusEvent) {
    const id = (e.target as SVGElement).dataset?.region;
    if (id) setActive(id);
  }

  return (
    <section className="relative left-1/2 mt-20 w-screen -translate-x-1/2 bg-note-dark-bg py-14">
      <div
        onFocus={onFocusIn}
        onBlur={() => setActive(null)}
        className="mx-auto grid max-w-[1120px] gap-10 px-6 lg:grid-cols-[340px_1fr]"
      >
        {/* --- la carte --- */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-note-accent">
            Coût du crédit PME
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-serif)] text-2xl leading-snug text-note-dark-ink">
            Ce que paie une PME africaine, région par région
          </h3>

          <svg
            viewBox="0 0 400 470"
            className="mt-6 w-full"
            role="img"
            aria-label="Carte de l'Afrique en quatre régions, colorées selon le taux moyen payé par les PME"
          >
            {REGIONS.map((r) => (
              <path
                key={r.id}
                d={r.path}
                fill={r.color}
                stroke="var(--note-dark-bg)"
                strokeWidth="1.5"
                opacity={on(r) ? 1 : 0.38}
                style={{ transition: "opacity 150ms" }}
                aria-label={`${r.name}, ${r.low} à ${r.high} pour cent`}
                {...handlers(r.id)}
              />
            ))}

            {/* villes repères : seulement sur la région active, sinon surcharge */}
            {region?.cities.map((c) => (
              <g key={c.n} aria-hidden>
                <circle cx={c.x} cy={c.y} r="3.5" fill="var(--note-dark-ink)" />
                <text
                  x={c.x + 8}
                  y={c.y + 1}
                  className="text-[11px] font-semibold"
                  fill="var(--note-dark-ink)"
                >
                  {c.n}
                </text>
                <text
                  x={c.x + 8}
                  y={c.y + 14}
                  className="text-[10.5px]"
                  fill="var(--note-dark-muted)"
                >
                  {c.r}
                </text>
              </g>
            ))}
          </svg>

          {/* commentaire : synthèse au repos, détail au survol */}
          <p
            aria-live="polite"
            className="mt-4 min-h-20 text-sm leading-[1.7] text-note-dark-muted"
          >
            {region ? (
              <>
                <strong className="font-semibold text-note-dark-ink">
                  {region.note.lead}
                </strong>{" "}
                {region.note.body}
              </>
            ) : (
              MAP_RESTING_NOTE
            )}
          </p>
        </div>

        {/* --- les fourchettes --- */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-note-dark-muted">
            Taux moyen · bas → élevé
          </p>
          <svg
            viewBox="0 0 560 290"
            className="mt-4 w-full"
            role="img"
            aria-label="Fourchettes de taux par région, de 0 à 40 pour cent"
          >
            {/* repère : notre coupon actuel */}
            <line
              x1={REF_X}
              y1="24"
              x2={REF_X}
              y2="248"
              stroke="var(--note-accent)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <text
              x={REF_X - 8}
              y="18"
              textAnchor="end"
              className="text-[11px] font-semibold"
              fill="var(--note-accent)"
            >
              Kupanda, notre produit de dette actuel : 20 %
            </text>

            {REGIONS.map((r, i) => {
              const y = BAR_Y(i);
              return (
                <g
                  key={r.id}
                  opacity={on(r) ? 1 : 0.38}
                  style={{ transition: "opacity 150ms" }}
                  aria-label={`${r.name}, ${r.low} à ${r.high} pour cent`}
                  {...handlers(r.id)}
                >
                  <text
                    x={X0 - 12}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[12px]"
                    fill="var(--note-dark-ink)"
                  >
                    {r.name}
                  </text>
                  <rect
                    x={sx(r.low)}
                    y={y - 6}
                    width={sx(r.high) - sx(r.low)}
                    height="12"
                    rx="6"
                    fill={r.color}
                  />
                  <text
                    x={sx(r.low) - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[11px] tabular-nums"
                    fill="var(--note-dark-muted)"
                  >
                    {r.low} %
                  </text>
                  <text
                    x={sx(r.high) + 8}
                    y={y + 4}
                    className="text-[11px] font-semibold tabular-nums"
                    fill="var(--note-dark-ink)"
                  >
                    {r.high} %
                  </text>
                </g>
              );
            })}

            {/* axe 0 → 40 % */}
            <line
              x1={X0}
              y1="252"
              x2={X1}
              y2="252"
              stroke="var(--note-dark-muted)"
              strokeWidth="0.8"
            />
            {[0, 10, 20, 30, 40].map((v) => (
              <text
                key={v}
                x={sx(v)}
                y="270"
                textAnchor="middle"
                className="text-[10.5px] tabular-nums"
                fill="var(--note-dark-muted)"
              >
                {v} %
              </text>
            ))}
          </svg>
          <p className="mt-2 text-xs text-note-dark-muted">
            Survolez une région ou une barre pour la détailler. Fourchettes
            observées sur le crédit aux petites et moyennes entreprises.
          </p>
        </div>
      </div>
    </section>
  );
}
