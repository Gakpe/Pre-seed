import { LANDSCAPE } from "@/lib/market-note";

// Positionnement par classe d'instrument. Noms en texte et non en logos :
// nous n'avons pas les droits, et le texte reste lisible partout.
export function PrivateDebtLandscape() {
  return (
    <figure className="mt-12">
      <svg
        viewBox="0 0 900 450"
        className="w-full"
        role="img"
        aria-label="Positionnement des acteurs de la dette privée africaine par classe d'instrument et rendement cible"
      >
        <text
          x="0"
          y="18"
          className="text-[11px] font-semibold uppercase"
          style={{ letterSpacing: "0.12em" }}
          fill="var(--note-muted)"
        >
          Rendement cible brut (%)
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
            <ellipse
              cx={g.cx}
              cy={g.cy}
              rx={g.rx}
              ry={g.ry}
              fill="none"
              stroke="var(--note-border-strong)"
              strokeWidth="1.2"
            />
            {g.names.map((n, i) => (
              <text
                key={n}
                x={g.cx}
                y={g.cy - ((g.names.length - 1) * 18) / 2 + i * 18 + 4}
                textAnchor="middle"
                className="text-[12px]"
                fill="var(--note-ink)"
              >
                {n}
              </text>
            ))}
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

        {/* Minah, rattachée par un trait au groupe de ses pairs */}
        <line
          x1={LANDSCAPE.minah.x + LANDSCAPE.minah.w / 2}
          y1={LANDSCAPE.minah.y}
          x2={LANDSCAPE.minah.x + LANDSCAPE.minah.w / 2}
          y2={LANDSCAPE.minah.y - 12}
          stroke="var(--note-accent)"
          strokeWidth="1.4"
        />
        <rect
          x={LANDSCAPE.minah.x}
          y={LANDSCAPE.minah.y}
          width={LANDSCAPE.minah.w}
          height={LANDSCAPE.minah.h}
          rx="15"
          fill="var(--marsala)"
        />
        <text
          x={LANDSCAPE.minah.x + LANDSCAPE.minah.w / 2}
          y={LANDSCAPE.minah.y + 20}
          textAnchor="middle"
          className="text-[13px] font-bold"
          fill="#fdf2ee"
        >
          Minah
        </text>

        {/* bandes d'instrument */}
        {LANDSCAPE.bands.map((b) => (
          <text
            key={b.label}
            x={b.cx}
            y="428"
            textAnchor="middle"
            className="text-[11px] font-semibold uppercase"
            style={{ letterSpacing: "0.08em" }}
            fill="var(--note-muted)"
          >
            {b.label}
          </text>
        ))}
      </svg>
      <figcaption className="mt-3 text-xs leading-5 text-note-muted">
        Positionnement indicatif par classe d&apos;instrument. Les fourchettes
        de rendement sont des ordres de grandeur de marché, à confirmer avant
        diffusion.
      </figcaption>
    </figure>
  );
}
