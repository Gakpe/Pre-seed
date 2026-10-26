"use client";

import { ZAMBIA_FINE, ZAMBIA_PROVINCES } from "@/lib/kupanda-zambia";
import type { Locale } from "@/lib/i18n";
import { project, toPath, type Camera } from "./projection";
import type { Box } from "./zoom";

// Le zoom sur la Zambie, quand les sous-jacents sont à l'écran : le pays et
// ses provinces, Lusaka en surbrillance, Africa Rise, l'État et ses deux
// ministères partenaires, et deux PME sous contrat, une par cas d'usage.
//
// Les positions viennent de la carte ; les tailles sont données en pixels
// d'écran et divisées par l'échelle du zoom (`k`, pixels par unité du
// viewBox), pour que textes et cartes gardent leur taille une fois zoomés.

export const LUSAKA: [number, number] = [28.28, -15.42];
// Deux sites d'exemple dans la province de Lusaka.
const SITES = {
  "uc-infrastructure": [28.42, -15.82] as [number, number],
  "uc-energie": [29.55, -15.05] as [number, number],
};

const copy = {
  fr: {
    province: "Province de Lusaka",
    africaRise: "Africa Rise",
    africaRiseSub: "Suit les financements",
    state: "État zambien",
    stateSub: "Acheteur final des contrats",
    cases: {
      "uc-infrastructure": { t: "Infrastructure", s: "Cantines de toutes les écoles" },
      "uc-energie": { t: "Énergie", s: "Contrat avec ZESCO" },
    },
  },
  en: {
    province: "Lusaka Province",
    africaRise: "Africa Rise",
    africaRiseSub: "Monitors the financings",
    state: "Zambian State",
    stateSub: "Final buyer of the contracts",
    cases: {
      "uc-infrastructure": { t: "Infrastructure", s: "Canteens for every school" },
      "uc-energie": { t: "Energy", s: "Contract with ZESCO" },
    },
  },
} as const;

/** Zone de zoom : le pays, avec de la place au-dessus et en dessous. */
export function zambiaBox(cam: Camera): Box {
  const pts = ZAMBIA_FINE.map(([lo, la]) => project(cam, lo, la));
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const h = y1 - y0;
  return { x: x0 - (x1 - x0) * 0.1, y: y0 - h * 0.8, w: (x1 - x0) * 1.2, h: h * 3.05 };
}

type PickFn = (id: string, label: string) => Record<string, unknown>;

export function ZambiaZoom({
  cam,
  k,
  locale,
  visible,
  pick,
  on,
  labels,
  motion,
}: {
  cam: Camera;
  /** Pixels d'écran par unité du viewBox, une fois le zoom fini. */
  k: number;
  locale: Locale;
  visible: boolean;
  pick: PickFn;
  on: (id: string) => boolean;
  labels: Record<string, string>;
  motion: boolean;
}) {
  const c = copy[locale];
  const px = (v: number) => v / k;
  const L = project(cam, ...LUSAKA);
  const ACCENT = "var(--bm-accent)";

  const outline = (ring: [number, number][]) => toPath(ring.map(([lo, la]) => project(cam, lo, la))) + "Z";

  // Le pays à l'écran : l'État au-dessus, les deux PME dessous, bien
  // écartées, et Africa Rise centré en dessous, qui les finance par deux
  // flèches montantes. Tailles en pixels d'écran.
  const P = ZAMBIA_FINE.map(([lo, la]) => project(cam, lo, la));
  const x0 = Math.min(...P.map((q) => q.x));
  const x1 = Math.max(...P.map((q) => q.x));
  const y0 = Math.min(...P.map((q) => q.y));
  const y1 = Math.max(...P.map((q) => q.y));
  const cx = (x0 + x1) / 2;
  // Assez étroit pour tenir à côté du panneau de détail dès 1280 px.
  const cardW = px(196);
  const cardH = px(58);
  const mid = px(100);
  const rowY = y1 + px(30);
  const stateBox = { x: cx - px(170), y: y0 - px(22) - px(124), w: px(340), h: px(124) };
  const cards = {
    "uc-infrastructure": { x: cx - mid / 2 - cardW, y: rowY, w: cardW, h: cardH },
    "uc-energie": { x: cx + mid / 2, y: rowY, w: cardW, h: cardH },
  };
  const arBox = { x: cx - cardW / 2, y: rowY + cardH + px(78), w: cardW, h: cardH };
  const site = (id: keyof typeof SITES) => project(cam, ...SITES[id]);
  const pmeOn = on("pme");
  const ids = Object.keys(SITES) as (keyof typeof SITES)[];

  return (
    <g
      aria-hidden={!visible}
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none", transition: "opacity 450ms ease 200ms" }}
    >
      {/* Le pays et ses provinces */}
      <g aria-hidden>
        <path d={outline(ZAMBIA_FINE)} fill="#fff" fillOpacity="0.9" stroke={ACCENT} strokeOpacity="0.7" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {Object.entries(ZAMBIA_PROVINCES).map(([name, ring]) => (
          <path
            key={name}
            d={outline(ring)}
            fill={name === "Lusaka" ? ACCENT : "none"}
            fillOpacity={name === "Lusaka" ? 0.22 : 0}
            stroke={name === "Lusaka" ? ACCENT : "#2b1a16"}
            strokeOpacity={name === "Lusaka" ? 0.9 : 0.16}
            strokeWidth={name === "Lusaka" ? 1.6 : 1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <text x={L.x - px(8)} y={L.y + px(34)} textAnchor="end" fontSize={px(11)} fontWeight={600} fill="#7a2e1f">
          {c.province}
        </text>
      </g>

      {/* Règlement : l'État paie les PME, par les côtés du pays */}
      <g {...pick("reglement", labels.reglementAria)}>
        {ids.map((id) => {
          const b = cards[id];
          const left = id === "uc-infrastructure";
          const sx = left ? stateBox.x : stateBox.x + stateBox.w;
          const sy = stateBox.y + stateBox.h / 2;
          const side = left ? x0 - px(26) : x1 + px(26);
          const tx = b.x + b.w / 2;
          const d = `M${sx} ${sy}C${side} ${sy},${side} ${rowY - px(60)},${tx} ${rowY - px(2)}`;
          return <FlowPath key={id} d={d} active={on("reglement")} motion={motion} k={k} id={`rg-${id}`} />;
        })}
        <Chip x={x1 + px(30)} y={(y0 + y1) / 2} text={labels.reglement} k={k} active={on("reglement")} />
      </g>

      {/* Financement : Africa Rise, en dessous, finance les deux PME */}
      <g {...pick("financement", labels.financementAria)}>
        {ids.map((id) => {
          const b = cards[id];
          const left = id === "uc-infrastructure";
          const sx = left ? arBox.x + px(40) : arBox.x + arBox.w - px(40);
          const sy = arBox.y - px(2);
          const tx = b.x + b.w / 2;
          const ty = b.y + b.h + px(4);
          const d = `M${sx} ${sy}C${sx} ${sy - px(34)},${tx} ${ty + px(34)},${tx} ${ty}`;
          const head = `M${tx - px(5)} ${ty + px(8)}L${tx} ${ty}L${tx + px(5)} ${ty + px(8)}`;
          const active = on("financement");
          return (
            <g key={id}>
              <FlowPath d={d} active={active} motion={motion} k={k} id={`fn-${id}`} />
              <path d={head} fill="none" stroke={active ? ACCENT : "#2b1a16"} strokeOpacity={active ? 1 : 0.5} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
        <Chip x={cx} y={rowY + cardH + px(44)} text={labels.financement} k={k} active={on("financement")} />
      </g>

      {/* Les deux PME, une par cas d'usage, reliées à leur site */}
      {ids.map((id) => {
        const s = site(id);
        const b = cards[id];
        const active = on(id) || pmeOn;
        return (
          <g key={id} {...pick(id, `${c.cases[id].t}, ${c.cases[id].s}`)}>
            <line x1={s.x} y1={s.y} x2={b.x + b.w / 2} y2={b.y} stroke="#2b1a16" strokeOpacity="0.35" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
            <circle cx={s.x} cy={s.y} r={px(active ? 6.5 : 5)} fill={ACCENT} stroke="#fff" strokeWidth={px(2)} />
            <Card b={b} k={k} title={c.cases[id].t} sub={c.cases[id].s} active={active} />
          </g>
        );
      })}

      {/* L'État zambien et ses deux ministères partenaires */}
      <g {...pick("etat", c.state)}>
        <rect x={stateBox.x} y={stateBox.y} width={stateBox.w} height={stateBox.h} rx={px(10)} fill="#fff" stroke={on("etat") ? ACCENT : "rgb(43 26 22 / 0.18)"} strokeWidth={on("etat") ? 2 : 1} vectorEffect="non-scaling-stroke" filter="url(#dd-shadow)" />
        <text x={stateBox.x + px(14)} y={stateBox.y + px(22)} fontSize={px(13)} fontWeight={600} fill="var(--bm-ink)">
          {c.state}
        </text>
        <text x={stateBox.x + px(14)} y={stateBox.y + px(38)} fontSize={px(11)} fill="#57534e">
          {c.stateSub}
        </text>
        <image href="/partners/zambia-msmed.png" x={stateBox.x + px(12)} y={stateBox.y + px(52)} width={px(152)} height={px(52)} preserveAspectRatio="xMinYMid meet" />
        <image href="/partners/zambia-mlgrd.png" x={stateBox.x + px(176)} y={stateBox.y + px(52)} width={px(152)} height={px(52)} preserveAspectRatio="xMinYMid meet" />
      </g>

      {/* Africa Rise, à Lusaka, et sa carte dans la rangée */}
      <g {...pick("africa-rise", c.africaRise)}>
        <line x1={L.x} y1={L.y} x2={arBox.x + arBox.w / 2} y2={arBox.y} stroke="var(--bm-minah)" strokeOpacity="0.45" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
        <circle cx={L.x} cy={L.y} r={px(on("africa-rise") ? 8.5 : 7)} fill="var(--bm-minah)" stroke="#fff" strokeWidth={px(2.5)} />
        <Card b={arBox} k={k} title={c.africaRise} sub={c.africaRiseSub} active={on("africa-rise")} tint />
      </g>
    </g>
  );
}

function Card({
  b,
  k,
  title,
  sub,
  active,
  tint = false,
}: {
  b: { x: number; y: number; w: number; h: number };
  k: number;
  title: string;
  sub: string;
  active: boolean;
  tint?: boolean;
}) {
  const px = (v: number) => v / k;
  return (
    <g>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={px(9)} fill={tint ? "#fdf0e6" : "#fff"} stroke={active ? "var(--bm-accent)" : tint ? "rgb(242 100 4 / 0.35)" : "rgb(43 26 22 / 0.18)"} strokeWidth={active ? 2 : 1} vectorEffect="non-scaling-stroke" filter="url(#dd-shadow)" />
      <text x={b.x + px(12)} y={b.y + px(22)} fontSize={px(13)} fontWeight={600} fill="var(--bm-ink)">
        {title}
      </text>
      <text x={b.x + px(12)} y={b.y + px(40)} fontSize={px(10.5)} fill="#57534e">
        {sub}
      </text>
    </g>
  );
}

function FlowPath({ d, active, motion, k, id }: { d: string; active: boolean; motion: boolean; k: number; id: string }) {
  return (
    <g>
      <path id={`dd-z-${id}`} d={d} fill="none" stroke={active ? "var(--bm-accent)" : "#2b1a16"} strokeOpacity={active ? 1 : 0.35} strokeWidth={active ? 2 : 1.3} vectorEffect="non-scaling-stroke" className={active ? "flow-dash" : ""} />
      <path d={d} fill="none" stroke="transparent" strokeWidth={14 / k} />
      {motion && active && (
        <circle r={3.5 / k} fill="var(--bm-accent)">
          <animateMotion dur="2s" repeatCount="indefinite">
            <mpath href={`#dd-z-${id}`} />
          </animateMotion>
        </circle>
      )}
    </g>
  );
}

function Chip({ x, y, text, k, active }: { x: number; y: number; text: string; k: number; active: boolean }) {
  const w = (text.length * 6.6 + 16) / k;
  const h = 20 / k;
  return (
    <g>
      <rect x={x - w / 2} y={y - h + 5 / k} width={w} height={h} rx={6 / k} fill={active ? "#fdf0e6" : "#fbfaf7"} stroke={active ? "var(--bm-accent)" : "rgb(43 26 22 / 0.18)"} strokeWidth={active ? 1.6 : 1} vectorEffect="non-scaling-stroke" />
      <text x={x} y={y} textAnchor="middle" fontSize={11.5 / k} fontWeight={600} fill={active ? "#7a2e1f" : "#3f3a36"}>
        {text}
      </text>
    </g>
  );
}
