"use client";

import { useRef } from "react";
import { PROTECTION_EXTRA } from "@/lib/kupanda-dd";
import { RISK_LEVELS } from "@/lib/risk-levels";
import type { Locale } from "@/lib/i18n";
import type { Layout } from "./FlowScene";
import { useViewBox } from "./zoom";

// La scène du risque : les quatre protections en dalles empilées, vues en
// perspective cavalière, sur le socle juridique. Les risques tombent des PME
// sur la première dalle ; ce qu'une dalle n'absorbe pas glisse le long du
// rail de gauche jusqu'à la suivante. À droite de chaque dalle, la hauteur
// couverte. Chaque dalle ouvre le panneau de détail.

const GEOM: Record<Layout, { W: number; H: number; x: number; top: number; w: number; t: number; dx: number; dy: number; gap: number; fs: number }> = {
  wide: { W: 1200, H: 600, x: 250, top: 150, w: 440, t: 60, dx: 64, dy: 36, gap: 22, fs: 1 },
  tall: { W: 600, H: 900, x: 64, top: 150, w: 430, t: 132, dx: 44, dy: 26, gap: 20, fs: 1.38 },
};

const copy = {
  fr: {
    alt: "Quatre protections empilées sur le socle juridique de l'obligation : performance bond, assurance crédit, assurance risque systémique et currency swap, réserve de trésorerie de Minah SAS.",
    source: "PME sous contrat",
    sourceSub: "Les risques entrent par le haut",
    leak: "non absorbé",
    socle: "Socle juridique",
    socleSub: "Obligation directe de Minah SAS, masse des obligataires",
    level: "Niveau",
    toFill: "à renseigner",
    investors: "Obligataires",
  },
  en: {
    alt: "Four protections stacked on the legal foundation of the bond: performance bond, credit insurance, systemic-risk insurance and currency swap, Minah SAS cash reserve.",
    source: "SMEs under contract",
    sourceSub: "Risks come in from the top",
    leak: "not absorbed",
    socle: "Legal foundation",
    socleSub: "Direct obligation of Minah SAS, bondholder body",
    level: "Level",
    toFill: "to be filled in",
    investors: "Bondholders",
  },
} as const;

export function RiskScene({
  locale,
  layout,
  selected,
  onSelect,
  motion,
  cover,
}: {
  locale: Locale;
  layout: Layout;
  selected: string | null;
  onSelect: (id: string) => void;
  motion: boolean;
  /** Largeur en pixels masquée à droite par le panneau de détail. */
  cover: number;
}) {
  const c = copy[locale];
  const g = GEOM[layout];
  const fs = g.fs;
  const slabY = (i: number) => g.top + i * (g.t + g.gap);
  const socleY = slabY(4);
  const wide = layout === "wide";
  // Panneau ouvert : la pile et ses montants se recentrent à côté.
  const svgRef = useRef<SVGSVGElement>(null);
  const stackBox = {
    x: g.x - 70 * fs,
    y: g.top - 130 * fs,
    w: g.w + g.dx + (wide ? 420 : 90) * fs,
    h: socleY + g.t + 40 - (g.top - 130 * fs),
  };
  const { viewBox } = useViewBox(svgRef, g.W, g.H, selected ? stackBox : null, cover);

  const pick = (id: string, label: string) => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-label": label,
    "aria-pressed": selected === id,
    onClick: () => onSelect(id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(id);
      }
    },
    className: "cursor-pointer outline-none",
    style: { opacity: !selected || selected === id ? 1 : 0.35, transition: "opacity 300ms" },
  });

  // Rail des fuites, le long de la face gauche.
  const railX = g.x - 26 * fs;

  // Trajets des risques : la plupart s'arrêtent sur la première dalle,
  // quelques-uns glissent jusqu'à la deuxième ou la troisième.
  const drops = [
    { x: 0.3, stop: 0, d: 0 },
    { x: 0.62, stop: 0, d: 0.7 },
    { x: 0.45, stop: 0, d: 1.4 },
    { x: 0.8, stop: 0, d: 2.1 },
    { x: 0.15, stop: 1, d: 1.0 },
    { x: 0.1, stop: 2, d: 2.6 },
  ];
  const dropPath = (fx: number, stop: number) => {
    const sx = g.x + g.dx * 0.5 + g.w * fx;
    const y0 = g.top - (wide ? 84 : 76);
    const land = (i: number) => slabY(i) - g.dy * 0.5;
    if (stop === 0) return `M${sx} ${y0}L${sx} ${land(0)}`;
    // vers le bord gauche, puis le rail, puis la dalle visée
    let d = `M${sx} ${y0}L${sx} ${land(0)}L${railX} ${land(0)}`;
    d += `L${railX} ${land(stop)}L${g.x + 30 * fs} ${land(stop)}`;
    return d;
  };

  return (
    <svg ref={svgRef} viewBox={viewBox} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={c.alt}>
      <defs>
        <filter id="dd-rshadow" x="-10%" y="-10%" width="130%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#2b1a16" floodOpacity="0.12" />
        </filter>
        <pattern id="dd-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="2" height="7" fill="#f26404" fillOpacity="0.35" />
        </pattern>
      </defs>

      {/* La source des risques */}
      <g aria-hidden>
        <text x={g.x + g.dx * 0.5 + g.w / 2} y={g.top - (wide ? 118 : 116)} textAnchor="middle" fontSize={13 * fs} fontWeight={600} fill="var(--bm-ink)">
          {c.source}
        </text>
        <text x={g.x + g.dx * 0.5 + g.w / 2} y={g.top - (wide ? 100 : 94)} textAnchor="middle" fontSize={11 * fs} fill="#57534e">
          {c.sourceSub}
        </text>
        {/* le rail des fuites */}
        <line x1={railX} y1={slabY(0) - g.dy * 0.5} x2={railX} y2={slabY(3) - g.dy * 0.5} stroke="#2b1a16" strokeOpacity="0.25" strokeDasharray="2 4" />
        {[1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${railX - 4} ${slabY(i) - g.dy * 0.5 - 7}L${railX} ${slabY(i) - g.dy * 0.5 - 1}L${railX + 4} ${slabY(i) - g.dy * 0.5 - 7}`}
            fill="none"
            stroke="#2b1a16"
            strokeOpacity="0.35"
            strokeWidth="1.3"
          />
        ))}
        <text
          x={railX - 10 * fs}
          y={(slabY(1) + slabY(2)) / 2}
          textAnchor="middle"
          fontSize={10.5 * fs}
          fill="#57534e"
          transform={`rotate(-90 ${railX - 10 * fs} ${(slabY(1) + slabY(2)) / 2})`}
        >
          {c.leak}
        </text>
      </g>

      {/* Socle, puis dalles du bas vers le haut : les plus hautes passent devant. */}
      <g {...pick("socle", c.socle)}>
        <Slab x={g.x - 10 * fs} y={socleY} w={g.w + 20 * fs} t={g.t * 0.9} dx={g.dx} dy={g.dy} tone="base" active={selected === "socle"} />
        <text x={g.x + 10 * fs} y={socleY + g.t * 0.42} fontSize={13.5 * fs} fontWeight={600} fill="#fff">
          {c.socle}
        </text>
        <text x={g.x + 10 * fs} y={socleY + g.t * 0.42 + 17 * fs} fontSize={11 * fs} fill="rgb(255 255 255 / 0.75)">
          {wide ? c.socleSub : c.investors}
        </text>
      </g>

      {[...RISK_LEVELS].reverse().map((l) => {
        const i = l.index - 1;
        const y = slabY(i);
        const cover = PROTECTION_EXTRA[l.id]?.cover[0];
        const value = cover?.value?.[locale] ?? null;
        const critical = l.index === 4;
        const midY = y + g.t / 2;
        return (
          <g key={l.id} {...pick(l.id, l.protection.name[locale])}>
            <Slab x={g.x} y={y} w={g.w} t={g.t} dx={g.dx} dy={g.dy} tone={critical ? "critical" : "light"} active={selected === l.id} />
            <text x={g.x + 16 * fs} y={y + 22 * fs} fontSize={11 * fs} fontWeight={600} fill={critical ? "rgb(255 255 255 / 0.8)" : "#7a2e1f"}>
              {c.level} {l.index}
            </text>
            <text x={g.x + 16 * fs} y={y + 40 * fs} fontSize={13.5 * fs} fontWeight={600} fill={critical ? "#fff" : "var(--bm-ink)"}>
              {(wide ? [l.protection.name[locale]] : wrap(l.protection.name[locale], 30)).map((line, k) => (
                <tspan key={k} x={g.x + 16 * fs} dy={k ? 18 * fs : 0}>
                  {line}
                </tspan>
              ))}
            </text>
            {!wide && cover && (
              <ValueText
                x={g.x + 16 * fs}
                y={y + g.t - 14 * fs}
                label={cover.label[locale]}
                value={value}
                placeholder={c.toFill}
                fs={fs}
                dark={critical}
              />
            )}
            {wide && cover && (
              <g>
                <line x1={g.x + g.w + g.dx + 8} y1={midY - g.dy / 2} x2={g.x + g.w + g.dx + 56} y2={midY - g.dy / 2} stroke="#2b1a16" strokeOpacity="0.3" />
                <circle cx={g.x + g.w + g.dx + 8} cy={midY - g.dy / 2} r="2.5" fill="#2b1a16" fillOpacity="0.4" />
                <text x={g.x + g.w + g.dx + 66} y={midY - g.dy / 2 - 6} fontSize={11.5} fill="#57534e">
                  {cover.label[locale]}
                </text>
                {value ? (
                  <text x={g.x + g.w + g.dx + 66} y={midY - g.dy / 2 + 14} fontSize={15} fontWeight={600} fill="var(--bm-ink)">
                    {value}
                  </text>
                ) : (
                  <Mark x={g.x + g.w + g.dx + 66} y={midY - g.dy / 2 + 14} text={c.toFill} fs={1.1} />
                )}
                <text x={g.x + g.w + g.dx + 66} y={midY - g.dy / 2 + 32} fontSize={11} fill="#57534e">
                  {l.name[locale]}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Les risques qui tombent */}
      {motion && (
        <g aria-hidden>
          {drops.map((dr, k) => {
            const d = dropPath(dr.x, dr.stop);
            const dur = 2.4 + dr.stop * 1.2;
            return (
              <g key={k}>
                <path id={`dd-drop-${k}`} d={d} fill="none" stroke="none" />
                <rect x={-3.5 * fs} y={-3.5 * fs} width={7 * fs} height={7 * fs} rx={1.5} fill="var(--bm-accent)" transform="rotate(45)">
                  <animateMotion dur={`${dur}s`} begin={`-${dr.d}s`} repeatCount="indefinite" rotate="0">
                    <mpath href={`#dd-drop-${k}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.82;1" dur={`${dur}s`} begin={`-${dr.d}s`} repeatCount="indefinite" />
                </rect>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}

// Une dalle : face avant, dessus, flanc droit.
function Slab({
  x,
  y,
  w,
  t,
  dx,
  dy,
  tone,
  active,
}: {
  x: number;
  y: number;
  w: number;
  t: number;
  dx: number;
  dy: number;
  tone: "light" | "critical" | "base";
  active: boolean;
}) {
  const fill = {
    light: { front: "#ffffff", top: "#fdf0e6", side: "#f3e3d6" },
    critical: { front: "#7a2e1f", top: "#9a4532", side: "#5c1f15" },
    base: { front: "#2b1a16", top: "#463029", side: "#1d1210" },
  }[tone];
  const stroke = active ? "var(--bm-accent)" : tone === "light" ? "rgb(43 26 22 / 0.16)" : "transparent";
  const sw = active ? 2.2 : 1;
  return (
    <g filter="url(#dd-rshadow)">
      <path d={`M${x} ${y}L${x + dx} ${y - dy}L${x + w + dx} ${y - dy}L${x + w} ${y}Z`} fill={fill.top} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d={`M${x + w} ${y}L${x + w + dx} ${y - dy}L${x + w + dx} ${y - dy + t}L${x + w} ${y + t}Z`} fill={fill.side} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <rect x={x} y={y} width={w} height={t} fill={fill.front} stroke={stroke} strokeWidth={sw} />
    </g>
  );
}

function Mark({ x, y, text, fs }: { x: number; y: number; text: string; fs: number }) {
  const w = text.length * 6.9 * fs + 10;
  return (
    <g>
      <rect x={x - 3} y={y - 13 * fs} width={w} height={17 * fs} rx={3} fill="#fef08a" />
      <text x={x + 2} y={y} fontSize={12 * fs} fontWeight={600} fill="var(--bm-ink)">
        {text}
      </text>
    </g>
  );
}

function ValueText({
  x,
  y,
  label,
  value,
  placeholder,
  fs,
  dark,
}: {
  x: number;
  y: number;
  label: string;
  value: string | null;
  placeholder: string;
  fs: number;
  dark: boolean;
}) {
  // Libellé et valeur dans un même texte : les tspan s'enchaînent sans
  // mesurer la largeur du libellé. Le montant à renseigner, lui, passe
  // sur sa ligne pour porter son surlignage.
  return value ? (
    <text x={x} y={y} fontSize={10.5 * fs} fill={dark ? "rgb(255 255 255 / 0.8)" : "#57534e"}>
      {label} :{" "}
      <tspan fontWeight={600} fill={dark ? "#fff" : "var(--bm-ink)"}>
        {value}
      </tspan>
    </text>
  ) : (
    <g>
      <text x={x} y={y} fontSize={10.5 * fs} fill={dark ? "rgb(255 255 255 / 0.8)" : "#57534e"}>
        {label} :
      </text>
      <Mark x={x + (label.length + 3) * 5.4 * fs} y={y} text={placeholder} fs={fs * 0.88} />
    </g>
  );
}

// Coupe un libellé en lignes d'au plus `max` caractères, aux espaces.
function wrap(text: string, max: number): string[] {
  const out: string[] = [];
  let line = "";
  for (const w of text.split(" ")) {
    if (line && (line + " " + w).length > max) {
      out.push(line);
      line = w;
    } else line = line ? `${line} ${w}` : w;
  }
  if (line) out.push(line);
  return out;
}
