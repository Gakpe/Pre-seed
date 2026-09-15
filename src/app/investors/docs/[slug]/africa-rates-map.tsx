"use client";

import { useState } from "react";
import {
  MAP_RESTING_NOTE,
  RATE_AXIS,
  REGIONS,
  type Region,
} from "@/lib/market-note";
import type { Locale } from "@/lib/i18n";

// Carte des taux PME et fourchettes par région. Survol croisé : la carte et le
// graphique se répondent. Sous la carte, une fiche toujours visible : la
// synthèse au repos, le détail de la région survolée sinon. La visualisation
// doit tenir sur une capture d'écran, sans interaction.
const X0 = 130;
const X1 = 530;
const BAR_Y = (i: number) => 48 + i * 52;
const sx = (v: number) => X0 + (v / RATE_AXIS.max) * (X1 - X0);
const REF_X = sx(RATE_AXIS.reference);
// Fourchette continentale de la fiche au repos, lue dans les données.
const ALL_LOW = Math.min(...REGIONS.map((r) => r.low));
const ALL_HIGH = Math.max(...REGIONS.map((r) => r.high));

const copy = {
  fr: {
    title: "Coût du crédit PME, région par région",
    restingTitle: "Afrique",
    hint: "Survolez une région pour la détailler.",
    mapAlt:
      "Carte de l'Afrique en quatre régions, colorées selon le taux moyen payé par les PME",
    rangesAlt: "Fourchettes de taux par région, de 0 à 40 pour cent",
    referenceTag: "Kupanda",
    referenceTitle: "Kupanda, notre produit de dette actuel : 20 %",
    referenceBody:
      "Fourchettes observées sur le crédit aux petites et moyennes entreprises.",
    to: "à",
  },
  en: {
    title: "Cost of SME credit, region by region",
    restingTitle: "Africa",
    hint: "Hover a region for detail.",
    mapAlt:
      "Map of Africa in four regions, coloured by the average rate paid by SMEs",
    rangesAlt: "Rate ranges by region, from 0 to 40 percent",
    referenceTag: "Kupanda",
    referenceTitle: "Kupanda, our current debt product: 20%",
    referenceBody:
      "Ranges observed on credit to small and medium-sized enterprises.",
    to: "to",
  },
};

export function AfricaRatesMap({ locale }: { locale: Locale }) {
  const t = copy[locale];
  // « 20 % » en français (insécable), « 20% » en anglais.
  const pct = locale === "fr" ? "\u00a0%" : "%";
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
    // data-note-dark : repère lu par le fil d'Ariane pour passer en surbrillance.
    <section
      data-note-dark
      className="relative left-1/2 mt-12 w-screen -translate-x-1/2 bg-note-dark-bg py-14"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h3 className="text-2xl font-semibold leading-snug tracking-tight text-note-dark-ink">
          {t.title}
        </h3>
        <div
          onFocus={onFocusIn}
          onBlur={() => setActive(null)}
          className="mt-8 grid gap-y-4 lg:grid-cols-[320px_1fr] lg:gap-x-10"
        >
          {/* Grille 2 × 2 sur grand écran : carte et graphique alignés en
              haut (viewBox recadrés au ras du continent et du libellé
              Kupanda), fiche et encart Kupanda centrés l'un sur l'autre.
              Sur mobile : carte, fiche, graphique, encart. */}
          {/* --- la carte --- */}
          <div className="lg:col-start-1 lg:row-start-1">
            <svg
              viewBox="0 36 400 402"
              className="w-full"
              role="img"
              aria-label={t.mapAlt}
            >
              {REGIONS.map((r) => (
                <path
                  key={r.id}
                  d={r.path}
                  fill={r.color}
                  stroke="var(--note-dark-bg)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  opacity={on(r) ? 1 : 0.38}
                  style={{ transition: "opacity 150ms" }}
                  aria-label={`${r.name[locale]}, ${r.low} ${t.to} ${r.high} %`}
                  {...handlers(r.id)}
                />
              ))}

              {/* villes repères : seulement sur la région active, sinon surcharge.
                  La carte est rendue à 80 % de son viewBox : les tailles sont
                  posées en unités SVG pour tomber à ~13 px à l'écran. Le taux
                  sort dans un petit cadre sombre, lisible sur toutes les
                  couleurs de région ; le nom est détouré du fond pour la même
                  raison. */}
              {region?.cities.map((c) => {
                const left = c.side === "left";
                const tx = left ? c.x - 9 : c.x + 9;
                const w = c.r.length * 8 + 12;
                const bx = left ? tx - w : tx;
                return (
                  // pointer-events à none : posée sur la région survolée,
                  // l'étiquette lui volait le survol et la carte clignotait.
                  <g key={c.n[locale]} aria-hidden pointerEvents="none">
                    <circle cx={c.x} cy={c.y} r="4" fill="var(--note-dark-ink)" />
                    <text
                      x={tx}
                      y={c.y + 5}
                      textAnchor={left ? "end" : "start"}
                      className="text-[16px] font-semibold"
                      fill="var(--note-dark-ink)"
                      stroke="var(--note-dark-bg)"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      style={{ paintOrder: "stroke" }}
                    >
                      {c.n[locale]}
                    </text>
                    <rect
                      x={bx}
                      y={c.y + 11}
                      width={w}
                      height="21"
                      rx="4"
                      fill="var(--note-dark-bg)"
                      stroke="var(--note-dark-ink)"
                      strokeOpacity="0.35"
                    />
                    <text
                      x={bx + w / 2}
                      y={c.y + 26}
                      textAnchor="middle"
                      className="text-[14px] font-semibold tabular-nums"
                      fill="var(--note-dark-ink)"
                    >
                      {c.r.replace(" ", "\u00a0")}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* fiche : synthèse au repos, détail de la région au survol.
              Toutes les variantes sont empilées dans la même cellule et
              seule l'active est visible : la fiche prend la hauteur de la
              plus longue et ne bouge plus, sinon la colonne de droite se
              recentre sous la souris et le survol du graphique clignote. */}
          <div
            aria-live="polite"
            className="grid rounded-lg border border-white/10 bg-white/[0.04] p-4 lg:col-start-1 lg:row-start-2"
          >
            {[null, ...REGIONS].map((r) => {
              const shown = (r?.id ?? null) === active;
              return (
                <div
                  key={r?.id ?? "resting"}
                  className={`[grid-area:1/1] transition-opacity duration-150 ${
                    shown ? "opacity-100" : "invisible opacity-0"
                  }`}
                >
                  <p className="flex items-baseline justify-between gap-3 text-sm font-semibold text-note-dark-ink">
                    {r ? r.name[locale] : t.restingTitle}
                    <span className="tabular-nums text-brand">
                      {r ? r.low : ALL_LOW} {t.to} {r ? r.high : ALL_HIGH}
                      {pct}
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-[1.65] text-note-dark-muted">
                    {r ? (
                      <>
                        <span className="text-note-dark-ink">
                          {r.note.lead[locale]}
                        </span>{" "}
                        {r.note.body[locale]}
                      </>
                    ) : (
                      <>
                        {MAP_RESTING_NOTE[locale]
                          .replace("{low}", String(ALL_LOW))
                          .replace("{high}", String(ALL_HIGH))}{" "}
                        <span className="text-note-dark-ink">{t.hint}</span>
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          {/* --- les fourchettes --- */}
          <div className="mt-6 lg:col-start-2 lg:row-start-1 lg:mt-0">
            <svg
              viewBox="0 6 560 284"
              className="w-full"
              role="img"
              aria-label={t.rangesAlt}
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
                {t.referenceTag}
              </text>

              {REGIONS.map((r, i) => {
                const y = BAR_Y(i);
                return (
                  <g
                    key={r.id}
                    opacity={on(r) ? 1 : 0.38}
                    style={{ transition: "opacity 150ms" }}
                    aria-label={`${r.name[locale]}, ${r.low} ${t.to} ${r.high} %`}
                    {...handlers(r.id)}
                  >
                    <text
                      x={X0 - 12}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[12px]"
                      fill="var(--note-dark-ink)"
                    >
                      {r.name[locale]}
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
                      {r.low}
                  {pct}
                    </text>
                    <text
                      x={sx(r.high) + 8}
                      y={y + 4}
                      className="text-[11px] font-semibold tabular-nums"
                      fill="var(--note-dark-ink)"
                    >
                      {r.high}
                  {pct}
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
                  {v}
                  {pct}
                </text>
              ))}
            </svg>
          </div>
          <div className="rounded-lg border border-note-accent/35 bg-note-accent/10 p-4 lg:col-start-2 lg:row-start-2 lg:self-center">
            <p className="text-sm font-semibold text-note-dark-ink">
              {t.referenceTitle}
            </p>
            <p className="mt-1.5 text-sm leading-[1.65] text-note-dark-muted">
              {t.referenceBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
