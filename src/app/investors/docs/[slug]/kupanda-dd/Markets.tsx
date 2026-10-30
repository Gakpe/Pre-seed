"use client";

import { useMemo, useState } from "react";
import { GEO_LAT0, GEO_LON0, GEO_RUNS, GEO_STEP, ZAMBIA_OUTLINE } from "@/lib/kupanda-geo";
import type { Locale } from "@/lib/i18n";
import { MARKETS, REGIONAL_CONTEXT } from "@/lib/kupanda-client";

// Onglet « Où va l'argent » de la due diligence, version souscripteurs. À
// gauche, une vignette : l'Afrique en points (même semis que la scène du
// flux, à plat), la Zambie et le Kenya en orange, chacun avec son repère qui
// pulse ; un clic sur un pays ouvre sa fiche à droite, qui entre ligne après
// ligne (dd-stagger). La carte reste une vignette de 360 px (Coralie, 30/10/2026), d'où des
// libellés larges dans le viewBox. Le contenu vit dans src/lib/kupanda-client.ts.

const copy = {
  fr: {
    alt: "Carte de l'Afrique : la Zambie, marché principal, et le Kenya, marché d'expansion, en orange. Cliquez sur un pays pour ouvrir sa fiche.",
    hint: "Cliquez sur un pays",
    pick: "Choisir un pays",
    partners: "Les deux ministères partenaires",
  },
  en: {
    alt: "Map of Africa: Zambia, the main market, and Kenya, the expansion market, in orange. Click a country to open its sheet.",
    hint: "Click a country",
    pick: "Pick a country",
    partners: "The two partner ministries",
  },
} as const;

// Contour simplifié du Kenya, en [longitude, latitude] : il sert à colorer
// les points du semis et à tracer le pays.
const KENYA_OUTLINE: [number, number][] = [
  [33.9, -1.0], [34.0, 0.5], [34.5, 1.1], [34.9, 1.6], [35.0, 2.5], [34.4, 3.7], [34.5, 4.6],
  [35.9, 4.6], [36.9, 4.4], [38.1, 3.6], [39.5, 3.5], [40.8, 4.3], [41.9, 3.9], [41.0, 2.8],
  [40.98, -0.9], [41.6, -1.7], [41.0, -2.2], [40.2, -2.7], [39.7, -3.4], [39.2, -4.7],
  [37.7, -3.1], [36.5, -2.6], [34.1, -1.1],
];

const PINS: Record<string, [number, number]> = { zambia: [28.28, -15.42], kenya: [36.82, -1.29] };

// Cadre : l'Afrique, de 20° W à 62° E et de 36° S à 38° N, en projection plate.
const LON = [-20, 62] as const;
const LAT = [-36, 38] as const;
const W = 656;
const H = 592;
const px = (lon: number) => ((lon - LON[0]) / (LON[1] - LON[0])) * W;
const py = (lat: number) => ((LAT[1] - lat) / (LAT[1] - LAT[0])) * H;

function inside(poly: [number, number][], lon: number, lat: number): boolean {
  let on = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) on = !on;
  }
  return on;
}

const path = (pts: [number, number][]) => pts.map(([lo, la], i) => `${i ? "L" : "M"}${px(lo).toFixed(1)} ${py(la).toFixed(1)}`).join("") + "Z";

export function Markets({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [selected, setSelected] = useState<string>("zambia");
  const market = MARKETS.find((m) => m.id === selected) ?? MARKETS[0];

  const dots = useMemo(() => {
    const out: { x: number; y: number; country: string | null }[] = [];
    for (const [j, i0, i1, t] of GEO_RUNS) {
      const lat = GEO_LAT0 + j * GEO_STEP;
      if (lat < LAT[0] || lat > LAT[1]) continue;
      const off = j % 2 ? GEO_STEP / 2 : 0;
      for (let i = i0; i <= i1; i++) {
        const lon = GEO_LON0 + i * GEO_STEP + off;
        if (lon < LON[0] || lon > LON[1]) continue;
        const country = t === 2 ? "zambia" : inside(KENYA_OUTLINE, lon, lat) ? "kenya" : null;
        out.push({ x: px(lon), y: py(lat), country });
      }
    }
    return out;
  }, []);

  const outlines = { zambia: ZAMBIA_OUTLINE.map(path).join(""), kenya: path(KENYA_OUTLINE) };

  const pick = (id: string) => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-pressed": selected === id,
    onClick: () => setSelected(id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelected(id);
      }
    },
    className: "cursor-pointer outline-none",
  });

  return (
    <div>
      <p className="max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{REGIONAL_CONTEXT[locale]}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-10">
        {/* La vignette */}
        <div className="mx-auto w-full max-w-[360px] lg:mx-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={c.alt}>
            <defs>
              <radialGradient id="dd-mk-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f26404" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#f26404" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Le continent */}
            {dots.map((d, i) =>
              d.country ? null : <circle key={i} cx={d.x} cy={d.y} r={3.2} fill="#2c1716" fillOpacity={0.16} />
            )}
            {/* Les deux pays : points, halo, contour et repère. */}
            {MARKETS.map((m) => {
              const on = selected === m.id;
              const [lo, la] = PINS[m.id];
              const x = px(lo);
              const y = py(la);
              return (
                <g key={m.id} {...pick(m.id)} aria-label={`${m.title[locale]}, ${m.kicker[locale]}`} style={{ opacity: on ? 1 : 0.55, transition: "opacity 300ms" }}>
                  <ellipse cx={x} cy={y} rx={90} ry={72} fill="url(#dd-mk-glow)" />
                  <path d={outlines[m.id as "zambia" | "kenya"]} fill="#f26404" fillOpacity={on ? 0.16 : 0.08} stroke="#f26404" strokeOpacity={on ? 0.85 : 0.45} strokeWidth={2.5} strokeLinejoin="round" />
                  {dots
                    .filter((d) => d.country === m.id)
                    .map((d, i) => (
                      <circle key={i} cx={d.x} cy={d.y} r={3.6} fill="#f26404" fillOpacity={0.9} />
                    ))}
                  {/* Le repère et son onde */}
                  <circle cx={x} cy={y} r={16} fill="none" stroke="#f26404" strokeWidth={3} className={on ? "dd-pulse" : ""} style={{ transformOrigin: `${x}px ${y}px`, opacity: on ? 1 : 0 }} />
                  <circle cx={x} cy={y} r={9} fill="#61100d" stroke="#fff" strokeWidth={3} />
                  {/* Un seul libellé, large : la vignette fait 360 px. */}
                  <text x={x + 20} y={y + 10} fontSize={30} fontWeight={600} fill="#2c1716">
                    {m.title[locale].replace(/^(La|Le)\s/, "")}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-center text-xs text-neutral-600 lg:text-left">{c.hint}</p>
        </div>

        {/* La fiche du pays : le sélecteur, puis le contenu qui entre. */}
        <div>
          <div role="tablist" aria-label={c.pick} className="flex gap-1.5">
            {MARKETS.map((m) => {
              const on = selected === m.id;
              return (
                <button
                  key={m.id}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  onClick={() => setSelected(m.id)}
                  className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    on ? "border-brand/30 bg-brand/10 font-semibold text-marsala" : "border-foreground/15 bg-white/70 text-neutral-700 hover:border-foreground/35"
                  }`}
                >
                  {m.title[locale]}
                </button>
              );
            })}
          </div>

          <article key={market.id} role="tabpanel" className="dd-stagger mt-5">
            <div>
              <h3 className="text-2xl font-semibold leading-tight tracking-tight">{market.title[locale]}</h3>
              <p className="mt-0.5 text-sm text-neutral-600">{market.kicker[locale]}</p>
            </div>

            <dl className="mt-5 grid grid-cols-3 divide-x divide-foreground/10 border-y border-foreground/10">
              {market.stats.map((st) => (
                <div key={st.label.fr} className="py-3.5 pr-3 [&:not(:first-child)]:pl-4">
                  <dd className="whitespace-nowrap text-2xl font-semibold tracking-tight tabular-nums text-marsala">{st.value[locale]}</dd>
                  <dt className="mt-0.5 text-xs leading-4 text-neutral-600">{st.label[locale]}</dt>
                </div>
              ))}
            </dl>

            {market.body.map((p) => (
              <p key={p.fr} className="mt-4 text-sm leading-6 text-neutral-700">
                {p[locale]}
              </p>
            ))}

            <div className="mt-5">
              <h4 className="text-sm font-semibold text-foreground">{market.why.title[locale]}</h4>
              <p className="mt-1.5 text-sm leading-6 text-neutral-700">{market.why.body[locale]}</p>
            </div>

            {market.partners && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-foreground">{c.partners}</h4>
                <ul className="mt-2 divide-y divide-foreground/10 border-y border-foreground/10">
                  {market.partners.map((pt) => (
                    <li key={pt.logo} className="flex items-center gap-4 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pt.logo} alt="" className="h-9 w-auto max-w-[8.5rem] shrink-0 object-contain" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-5 text-foreground">{pt.name[locale]}</p>
                        <p className="mt-0.5 text-sm leading-5 text-neutral-600">{pt.role[locale]}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
