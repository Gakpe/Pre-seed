import { LANDSCAPE, PEER_URLS } from "@/lib/market-note";
import type { Locale } from "@/lib/i18n";

// Positionnement par classe d'instrument. Noms en texte et non en logos :
// nous n'avons pas les droits, et le texte reste lisible partout.
const copy = {
  fr: {
    alt: "Positionnement des acteurs de la dette privée africaine par classe d'instrument et rendement cible",
    axis: "Rendement cible brut (%)",
    visit: "site de la société, nouvel onglet",
    caption:
      "Positionnement indicatif par classe d'instrument. Les fourchettes de rendement sont des ordres de grandeur de marché.",
  },
  en: {
    alt: "Positioning of African private debt players by instrument class and target return",
    axis: "Gross target return (%)",
    visit: "company website, opens in a new tab",
    caption:
      "Indicative positioning by instrument class. The return ranges are market orders of magnitude.",
  },
};

export function PrivateDebtLandscape({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <figure className="mt-12">
      <svg
        viewBox="0 0 900 450"
        className="w-full"
        role="img"
        aria-label={t.alt}
      >
        <text
          x="0"
          y="18"
          className="text-[11px] font-semibold uppercase"
          style={{ letterSpacing: "0.12em" }}
          fill="var(--note-muted)"
        >
          {t.axis}
        </text>

        {/* grille horizontale et axe des rendements */}
        {LANDSCAPE.ticks.map((t) => (
          <g key={t.v}>
            <text
              x="66"
              y={t.y + 4}
              textAnchor="end"
              className="text-[11px] tabular-nums"
              fill="var(--note-muted)"
            >
              {t.v}
            </text>
            <line
              x1="76"
              y1={t.y - 4}
              x2="890"
              y2={t.y - 4}
              stroke="var(--note-border)"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* séparateurs de bandes d'instrument */}
        {LANDSCAPE.separators.map((x) => (
          <line
            key={x}
            x1={x}
            y1="40"
            x2={x}
            y2="400"
            stroke="var(--note-border)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        ))}

        {/* groupes de pairs */}
        {LANDSCAPE.groups.map((g) => (
          <g key={`${g.cx}-${g.cy}`}>
            {/* Bulle pleine, du blanc des cartes : le quadrillage ne passe
                plus sous les noms. */}
            <ellipse
              cx={g.cx}
              cy={g.cy}
              rx={g.rx}
              ry={g.ry}
              fill="#fbfaf7"
              stroke="var(--note-border-strong)"
              strokeWidth="1.2"
            />
            {/* Chaque nom renvoie au site de la société, dans un nouvel
                onglet. Soulignement discret au repos pour dire que c'est
                cliquable, orange au survol. */}
            {g.names.map((n, i) => {
              const lines = g.names.length + (g.highlight ? 1 : 0);
              const y = g.cy - ((lines - 1) * 18) / 2 + i * 18 + 4;
              const label = (
                <text
                  x={g.cx}
                  y={y}
                  textAnchor="middle"
                  className="text-[12px]"
                  fill="var(--note-ink)"
                >
                  {n}
                </text>
              );
              const url = PEER_URLS[n];
              return url ? (
                <a
                  key={n}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${n}, ${t.visit}`}
                  className="cursor-pointer underline decoration-note-muted/40 underline-offset-2 transition-colors hover:fill-note-accent hover:decoration-note-accent [&:hover_text]:fill-note-accent"
                >
                  {label}
                </a>
              ) : (
                <g key={n}>{label}</g>
              );
            })}
            {/* Minah dans la bulle de ses pairs, en orange et en gras, avec
                un lien vers son site. */}
            {g.highlight && (() => {
              const y = g.cy - (g.names.length * 18) / 2 + g.names.length * 18 + 4;
              // Largeur estimée du nom en 13 px gras : le soulignement CSS sort
              // en noir dans un SVG, il est donc tracé à la main, en orange.
              const half = g.highlight.name.length * 4.2;
              return (
                <a
                  href={g.highlight.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${g.highlight.name}, ${t.visit}`}
                  className="cursor-pointer"
                >
                  <text
                    x={g.cx}
                    y={y}
                    textAnchor="middle"
                    className="text-[13px] font-bold"
                    fill="var(--note-accent)"
                  >
                    {g.highlight.name}
                  </text>
                  <line
                    x1={g.cx - half}
                    y1={y + 4}
                    x2={g.cx + half}
                    y2={y + 4}
                    stroke="var(--note-accent)"
                    strokeWidth="1.2"
                  />
                </a>
              );
            })()}
            {g.muted && (
              <text
                x={g.cx}
                y={g.cy + 18}
                textAnchor="middle"
                className="text-[11px]"
                fill="var(--note-muted)"
              >
                {g.muted}
              </text>
            )}
          </g>
        ))}

        {/* bandes d'instrument */}
        {LANDSCAPE.bands.map((b) => (
          <text
            key={b.label.fr}
            x={b.cx}
            y="428"
            textAnchor="middle"
            className="text-[11px] font-semibold uppercase"
            style={{ letterSpacing: "0.08em" }}
            fill="var(--note-muted)"
          >
            {b.label[locale]}
          </text>
        ))}
      </svg>
      <figcaption className="mt-3 text-xs leading-5 text-note-muted">
        {t.caption}
      </figcaption>
    </figure>
  );
}
