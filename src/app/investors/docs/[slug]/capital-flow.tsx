"use client";

import { useState } from "react";
import { FEES, FLOW_NODES, INVESTORS } from "@/lib/flow-nodes";

// Schéma de flux de capitaux. SVG écrit à la main : la géométrie porte le
// sens, notamment la position des deux pastilles de commission.
//
// Repères horizontaux : colonne investisseurs → point de convergence →
// tronc de souscription (traversant les transaction fees) → Minah →
// sociétés locales → PME. Le chemin de retour longe le bas et remonte vers
// les investisseurs ; une branche verticale en prélève les performance fees.
const CARD = { w: 200, h: 58, gap: 12 };
const STACK_TOP = 40;
const CONVERGE = { x: 330, y: 209 };
const NODE_H = 82;
const NODE_Y = 168;
const RETURN_Y = 430;

const NODES = {
  minah: { x: 580, w: 170 },
  locales: { x: 800, w: 170 },
  pme: { x: 1005, w: 170 },
};

function cardY(i: number) {
  return STACK_TOP + i * (CARD.h + CARD.gap);
}
function cardX(i: number) {
  return i % 2 === 0 ? 20 : 52;
}

export function CapitalFlow() {
  const [selected, setSelected] = useState("minah");
  const node = FLOW_NODES.find((n) => n.id === selected) ?? FLOW_NODES[5];

  const pick = (id: string) => ({
    role: "button" as const,
    tabIndex: 0,
    onMouseEnter: () => setSelected(id),
    onFocus: () => setSelected(id),
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
    <section className="mt-10">
      <div className="overflow-x-auto rounded-xl border border-bm-border bg-bm-surface p-4 sm:p-6">
        <svg
          viewBox="0 0 1190 480"
          className="w-full"
          style={{ minWidth: 900 }}
          role="img"
          aria-label="Schéma des flux de capitaux, des souscripteurs aux PME et retour"
        >
          <defs>
            <marker
              id="bm-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill="var(--bm-accent)" />
            </marker>
            <pattern
              id="bm-dots"
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.4" cy="1.4" r="1.4" fill="var(--bm-border)" />
            </pattern>
          </defs>

          {/* fond pointillé : le capital vient de plusieurs endroits */}
          <rect x="8" y="30" width="256" height="360" fill="url(#bm-dots)" opacity="0.7" />

          <text
            x="8"
            y="20"
            className="text-[10px] font-semibold"
            style={{ letterSpacing: "0.1em" }}
            fill="var(--bm-muted)"
          >
            INVESTISSEURS GLOBAUX
          </text>

          {/* convergence des cinq familles vers un point unique */}
          {INVESTORS.map((inv, i) => {
            const x = cardX(i) + CARD.w;
            const y = cardY(i) + CARD.h / 2;
            return (
              <path
                key={`c-${inv.id}`}
                d={`M${x} ${y} C ${x + 70} ${y}, ${CONVERGE.x - 60} ${CONVERGE.y}, ${CONVERGE.x - 6} ${CONVERGE.y}`}
                fill="none"
                stroke="var(--bm-accent)"
                strokeWidth="1.4"
                className="flow-dash"
              />
            );
          })}
          <circle cx={CONVERGE.x} cy={CONVERGE.y} r="6" fill="var(--bm-accent)" />

          {/* tronc de souscription — il passe DERRIÈRE la pastille de fees */}
          <path
            d={`M${CONVERGE.x + 6} ${CONVERGE.y} L${NODES.minah.x - 6} ${CONVERGE.y}`}
            fill="none"
            stroke="var(--bm-accent)"
            strokeWidth="2"
            markerEnd="url(#bm-arrow)"
            className="flow-dash"
          />
          <text
            x="460"
            y="252"
            textAnchor="middle"
            className="text-[10.5px]"
            fill="var(--bm-muted)"
          >
            prélevés à la souscription
          </text>

          {/* chaîne de déploiement */}
          <path
            d={`M${NODES.minah.x + NODES.minah.w + 6} ${CONVERGE.y} L${NODES.locales.x - 6} ${CONVERGE.y}`}
            fill="none"
            stroke="var(--bm-accent)"
            strokeWidth="2"
            markerEnd="url(#bm-arrow)"
            className="flow-dash"
          />
          <path
            d={`M${NODES.locales.x + NODES.locales.w + 6} ${CONVERGE.y} L${NODES.pme.x - 6} ${CONVERGE.y}`}
            fill="none"
            stroke="var(--bm-accent)"
            strokeWidth="2"
            markerEnd="url(#bm-arrow)"
            className="flow-dash"
          />

          {/* chemin de retour : coupons et principal remontent aux investisseurs */}
          <path
            d={`M${NODES.pme.x + NODES.pme.w / 2} ${NODE_Y + NODE_H + 6} L${NODES.pme.x + NODES.pme.w / 2} ${RETURN_Y} L120 ${RETURN_Y} L120 ${cardY(4) + CARD.h + 14}`}
            fill="none"
            stroke="var(--bm-accent)"
            strokeWidth="1.6"
            opacity="0.85"
            markerEnd="url(#bm-arrow)"
            className="flow-dash"
          />
          <text
            x="620"
            y={RETURN_Y + 20}
            textAnchor="middle"
            className="text-[10px] font-semibold"
            style={{ letterSpacing: "0.1em" }}
            fill="var(--bm-muted)"
          >
            RETOUR — COUPONS ET PRINCIPAL
          </text>

          {/* branche des performance fees : tout ne remonte pas à 100 % */}
          <path
            d={`M665 ${RETURN_Y} L665 ${NODE_Y + NODE_H + 6}`}
            fill="none"
            stroke="var(--bm-accent)"
            strokeWidth="1.6"
            opacity="0.85"
            markerEnd="url(#bm-arrow)"
            className="flow-dash"
          />

          {/* cartes investisseurs, en quinconce */}
          {INVESTORS.map((inv, i) => {
            const on = selected === inv.id;
            return (
              <g
                key={inv.id}
                {...pick(inv.id)}
                aria-label={`${inv.title} — ${inv.subtitle}`}
              >
                <rect
                  x={cardX(i)}
                  y={cardY(i)}
                  width={CARD.w}
                  height={CARD.h}
                  rx="8"
                  fill="var(--bm-surface)"
                  stroke={on ? "var(--bm-accent)" : "var(--bm-border-strong)"}
                  strokeWidth={on ? 1.8 : 1}
                  style={{ transition: "stroke 150ms, stroke-width 150ms" }}
                />
                <text
                  x={cardX(i) + 14}
                  y={cardY(i) + 25}
                  className="text-[13px] font-semibold"
                  fill="var(--bm-ink)"
                >
                  {inv.title}
                </text>
                <text
                  x={cardX(i) + 14}
                  y={cardY(i) + 43}
                  className="text-[10.5px]"
                  fill="var(--bm-muted)"
                >
                  {inv.subtitle}
                </text>
              </g>
            );
          })}

          {/* Minah — seul nœud en fond plein : c'est le centre du modèle */}
          <Node
            id="minah"
            x={NODES.minah.x}
            w={NODES.minah.w}
            title="Minah"
            subtitle="Structuration · registre"
            filled
            selected={selected === "minah"}
            pick={pick}
          />
          <Node
            id="societes-locales"
            x={NODES.locales.x}
            w={NODES.locales.w}
            title="Sociétés financières"
            subtitle="Entités de droit local"
            selected={selected === "societes-locales"}
            pick={pick}
          />
          <Node
            id="pme"
            x={NODES.pme.x}
            w={NODES.pme.w}
            title="PME sous contrat"
            subtitle="Marchés publics exécutés"
            selected={selected === "pme"}
            pick={pick}
          />

          {/* les deux moments de rémunération */}
          <FeePill
            id="transaction-fees"
            cx={460}
            cy={CONVERGE.y}
            label="Transaction fees"
            rate={FEES.transaction}
            selected={selected === "transaction-fees"}
            pick={pick}
          />
          <FeePill
            id="performance-fees"
            cx={665}
            cy={350}
            label="Performance fees"
            rate={FEES.performance}
            selected={selected === "performance-fees"}
            pick={pick}
          />
        </svg>
      </div>

      {/* panneau de détail — enrichit, ne conditionne rien */}
      <div
        aria-live="polite"
        className="mt-4 rounded-xl border border-bm-border bg-bm-surface-2 p-6"
      >
        <h3 className="text-sm font-semibold text-bm-ink">{node.title}</h3>
        <p className="mt-0.5 text-xs text-bm-muted">{node.tag}</p>
        <ul className="mt-4 space-y-2">
          {node.items.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-[1.6] text-neutral-700">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-bm-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type PickFn = (id: string) => Record<string, unknown>;

function Node({
  id,
  x,
  w,
  title,
  subtitle,
  filled = false,
  selected,
  pick,
}: {
  id: string;
  x: number;
  w: number;
  title: string;
  subtitle: string;
  filled?: boolean;
  selected: boolean;
  pick: PickFn;
}) {
  return (
    <g {...pick(id)} aria-label={`${title} — ${subtitle}`}>
      <rect
        x={x}
        y={NODE_Y}
        width={w}
        height={NODE_H}
        rx="10"
        fill={filled ? "var(--bm-minah)" : "var(--bm-surface)"}
        stroke={selected ? "var(--bm-accent)" : "var(--bm-border-strong)"}
        strokeWidth={selected ? 1.8 : 1}
        style={{ transition: "stroke 150ms, stroke-width 150ms" }}
      />
      <text
        x={x + w / 2}
        y={NODE_Y + 36}
        textAnchor="middle"
        className="text-[14.5px] font-semibold"
        fill={filled ? "#fff" : "var(--bm-ink)"}
      >
        {title}
      </text>
      <text
        x={x + w / 2}
        y={NODE_Y + 56}
        textAnchor="middle"
        className="text-[11.5px]"
        fill={filled ? "rgba(255,255,255,0.72)" : "var(--bm-muted)"}
      >
        {subtitle}
      </text>
    </g>
  );
}

// Pastille de commission. Posée à cheval sur le flux : le trait passe
// derrière et en ressort — le prélèvement se lit au moment où il se produit.
function FeePill({
  id,
  cx,
  cy,
  label,
  rate,
  selected,
  pick,
}: {
  id: string;
  cx: number;
  cy: number;
  label: string;
  rate: string;
  selected: boolean;
  pick: PickFn;
}) {
  const w = 170;
  const h = 46;
  return (
    <g {...pick(id)} aria-label={`${label} — taux ${rate}`}>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx="23"
        fill={selected ? "var(--bm-accent-soft)" : "var(--bm-surface)"}
        stroke="var(--bm-accent)"
        strokeWidth={selected ? 1.8 : 1.2}
        style={{ transition: "fill 150ms, stroke-width 150ms" }}
      />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        className="text-[12px] font-semibold"
        fill="var(--bm-accent)"
      >
        {label}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        className="text-[11.5px] font-semibold tabular-nums"
        fill="var(--bm-ink)"
      >
        {rate}
      </text>
    </g>
  );
}
