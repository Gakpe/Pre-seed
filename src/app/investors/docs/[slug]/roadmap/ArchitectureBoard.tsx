"use client";

// Roadmap datée, partagée par la vue équipe et la vue investisseurs.
//
// Trois éléments, du haut vers le bas :
//  1. une frise au temps réel — bandes proportionnelles à la durée, graduations tous les
//     quatre mois : on voit d'un coup d'œil qu'une période n'est pas aussi longue qu'une
//     autre. On y fait glisser le curseur pour changer de période ;
//  2. l'expérience utilisateur de la période sélectionnée, sur une seule ligne pleine
//     largeur (et elle seule : six textes à la fois rendaient le tableau illisible) ;
//  3. le contenu, en deux modes — « cette période » (ce qui y est livré, par couche) ou
//     « vue d'ensemble » (les six périodes en colonnes, Liquidité en dernier).
//
// Les colonnes de la vue d'ensemble gardent une largeur minimale ; en dessous, le tableau
// défile plutôt que d'écraser le texte. Aucune dépendance au layout admin.

import { useMemo, useRef, useState } from "react";
import { LAYERS, PHASES, PHASE_WINDOWS, TODAY, type Phase, type PhaseCapacity, type PhaseProof, type PublicObjective } from "@/lib/roadmap/types";
import { STATUS_STYLE, type RoadmapLabels } from "@/lib/roadmap/labels";

const INK = "#2C1716";
const MUTED = "#766962";
const FAINT = "#A39A8E";
const LINE = "#E6E1D4";
const HAIRLINE = "#F4F2EB";
const ACCENT = "#E27B30";

/** Colonne des libellés de couche. */
const LABEL_W = 136;
/** Largeur minimale d'une colonne de période : en dessous, le texte devient illisible. */
const MIN_COL = 158;
/** Graduation de la frise, en mois. */
const TICK_MONTHS = 4;

const days = (a: string, b: string) => Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000));
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const ms = (d: string) => new Date(d).getTime();

/**
 * Dates hybrides : mois exacts sur le passé (ce sont des faits), trimestres sur le futur,
 * « 2028+ » sur la dernière période. Évite la fausse précision sur ce qui reste à faire.
 */
function fmtPeriod(start: string, end: string, locale: string, isLast: boolean) {
  if (end <= TODAY || start <= TODAY) {
    const f = (d: string) => new Date(d).toLocaleDateString(locale, { month: "short", year: "numeric" });
    return `${f(start)} – ${f(end)}`;
  }
  const y0 = start.slice(0, 4), y1 = end.slice(0, 4);
  if (isLast) return `${y0}+`;
  const q = (d: string) => `Q${Math.floor((Number(d.slice(5, 7)) - 1) / 3) + 1}`;
  if (y0 === y1) {
    const full = start.endsWith("-01-01") && end.endsWith("-12-31");
    return full ? y0 : `${q(start)} – ${q(end)} ${y0}`;
  }
  return `${q(start)} ${y0} – ${q(end)} ${y1}`;
}

function fmtEur(n: number, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);
}

export function ArchitectureBoard({
  objectifs, phase, onPhaseChange, onSelect, selectedId, dimmedIds, labels, experience, proofs, proofLabels, locale, dark, todayLabel, highlightExperience,
}: {
  objectifs: PublicObjective[];
  phase: Phase;
  onPhaseChange: (p: Phase) => void;
  onSelect?: (id: string) => void;
  selectedId?: string | null;
  /** Briques à estomper (ex. filtre « mes objectifs »). */
  dimmedIds?: Set<string> | null;
  labels: RoadmapLabels;
  experience: Record<Phase, string>;
  /** Chiffres réels par période passée (null = indisponibles). */
  proofs?: Partial<Record<Phase, PhaseProof>> | null;
  /**
   * Preuve rédigée à la main par période. Si la période courante en a une, elle remplace
   * les chiffres de `proofs` — c'est ce que reçoit la dataroom. La vue équipe ne passe
   * rien ici et garde les chiffres exacts.
   */
  proofLabels?: Partial<Record<Phase, string>>;
  locale: string;
  dark?: boolean;
  /** Libellé du repère « aujourd'hui » sur la frise. */
  todayLabel?: string;
  /** Dataroom : expérience utilisateur légèrement mise en valeur (aplat dégradé, centrée).
   *  Par défaut — l'admin — c'est de la typographie nue. */
  highlightExperience?: boolean;
}) {
  const periods = useMemo(
    () => PHASES.map((p) => ({ id: p, ...PHASE_WINDOWS[p], days: days(PHASE_WINDOWS[p].start, PHASE_WINDOWS[p].end) })),
    [],
  );
  const selectedIdx = PHASES.indexOf(phase);
  const [overview, setOverview] = useState(false);

  const faint = dark ? "rgba(255,255,255,.5)" : FAINT;
  const muted = dark ? "rgba(255,255,255,.7)" : MUTED;
  const ink = dark ? "#fff" : INK;
  const line = dark ? "rgba(255,255,255,.12)" : LINE;
  const hairline = dark ? "rgba(255,255,255,.06)" : HAIRLINE;
  const selectedBg = dark ? "rgba(255,255,255,.04)" : "#FCFBF7";
  const surface = dark ? "#1E1410" : "#FFFFFE";
  const railBg = dark ? "rgba(255,255,255,.1)" : "#EFEADE";

  // ── Géométrie de la frise : le temps réel, du début de la première période à la fin de
  // la dernière. Les bandes sont proportionnelles à la durée, contrairement aux colonnes.
  const T0 = ms(periods[0].start);
  const T1 = ms(periods[periods.length - 1].end);
  const fracOf = (d: string) => clamp01((ms(d) - T0) / (T1 - T0));
  const bands = periods.map((p) => ({ id: p.id, left: fracOf(p.start), width: fracOf(p.end) - fracOf(p.start) }));
  const todayFrac = fracOf(TODAY);

  const ticks = useMemo(() => {
    const out: Array<{ frac: number; label: string; year: boolean }> = [];
    const d = new Date(periods[0].start);
    let seen = -1;
    while (d.getTime() <= T1) {
      const nouvelleAnnee = d.getFullYear() !== seen;
      seen = d.getFullYear();
      out.push({
        frac: clamp01((d.getTime() - T0) / (T1 - T0)),
        label: d.toLocaleDateString(locale, nouvelleAnnee ? { month: "short", year: "numeric" } : { month: "short" }),
        year: nouvelleAnnee,
      });
      d.setMonth(d.getMonth() + TICK_MONTHS);
    }
    return out;
  }, [periods, T0, T1, locale]);

  const periodAtFrac = (f: number) => {
    for (let i = bands.length - 1; i >= 0; i--) if (f >= bands[i].left) return i;
    return 0;
  };
  const midOf = (i: number) => bands[i].left + bands[i].width / 2;

  // Position du curseur, en fraction du temps total. Au départ : aujourd'hui si l'on est
  // déjà sur la période courante, sinon le milieu de la période demandée.
  const [pos, setPos] = useState(() => (periodAtFrac(todayFrac) === selectedIdx ? todayFrac : midOf(selectedIdx)));
  // La période a changé ailleurs (clic sur un en-tête) : replacer le curseur dessus.
  // État dérivé ajusté pendant le rendu plutôt que dans un effet, comme React le
  // recommande ; c'était un useEffect dans la version d'origine.
  const [seenIdx, setSeenIdx] = useState(selectedIdx);
  if (seenIdx !== selectedIdx) {
    setSeenIdx(selectedIdx);
    if (periodAtFrac(pos) !== selectedIdx) setPos(midOf(selectedIdx));
  }

  const railRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const applyAt = (clientX: number) => {
    const r = railRef.current?.getBoundingClientRect();
    if (!r) return;
    const f = clamp01((clientX - r.left) / Math.max(1, r.width));
    setPos(f);
    const i = periodAtFrac(f);
    if (PHASES[i] !== phase) onPhaseChange(PHASES[i]);
  };
  const step = (delta: number) => {
    const i = Math.min(periods.length - 1, Math.max(0, selectedIdx + delta));
    setPos(midOf(i));
    if (PHASES[i] !== phase) onPhaseChange(PHASES[i]);
  };

  const smallCaps: React.CSSProperties = {
    fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: faint,
  };

  const renderBrick = (o: PublicObjective) => {
    const status = o.statutsParPhase[phase];
    const st = STATUS_STYLE[status];
    const selected = selectedId === o.id;
    const dimmed = dimmedIds ? dimmedIds.has(o.id) : false;
    const showMoteur = o.couche === "produits" && o.moteur !== "transverse";
    return (
      <button
        key={o.id}
        type="button"
        onClick={() => onSelect?.(o.id)}
        title={o.titre}
        style={{
          textAlign: "left", padding: "8px 10px", borderRadius: 9, cursor: onSelect ? "pointer" : "default",
          background: st.bg, color: st.color, width: "100%",
          border: `1px ${status === "prevu" ? "dashed" : "solid"} ${selected ? ACCENT : st.border}`,
          boxShadow: selected ? "0 0 0 3px rgba(226,123,48,.18)" : "none",
          opacity: dimmed ? 0.35 : 1,
          transition: "background .25s ease, border-color .25s ease, color .25s ease, opacity .2s ease",
          display: "flex", flexDirection: "column", gap: 4,
        }}
      >
        <span style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>{o.titre}</span>
        <span style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 6, opacity: .9, flexWrap: "wrap" }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: st.dot, display: "inline-block", flexShrink: 0 }} />
          {labels.statuses[status]}
          {showMoteur && <span style={{ letterSpacing: "0.04em", textTransform: "uppercase", opacity: .75 }}>· {labels.moteurs[o.moteur]}</span>}
        </span>
      </button>
    );
  };

  /** Briques d'une couche pour une période. Rien n'est replié : on montre tout, toujours. */
  const bricksOf = (layer: string, p: Phase) =>
    objectifs.filter((o) => o.couche === layer && o.livreEn === p).sort((a, b) => a.ordre - b.ordre);

  const proofLabel = proofLabels?.[phase];
  const proof = proofs?.[phase];
  const rienLivre = LAYERS.every((l) => bricksOf(l, phase).length === 0);

  return (
    <div>
      {/* ── 1. Frise au temps réel ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ position: "relative", height: 15, marginBottom: 3 }}>
          {ticks.map((t, i) => (
            <span
              key={i}
              style={{
                position: "absolute", left: `${t.frac * 100}%`, top: 0, whiteSpace: "nowrap",
                transform: i === 0 ? "none" : "translateX(-50%)",
                fontSize: 9.5, letterSpacing: "0.03em", color: t.year ? muted : faint, fontWeight: t.year ? 600 : 400,
              }}
            >
              {t.label}
            </span>
          ))}
        </div>
        <div
          ref={railRef}
          onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); dragging.current = true; applyAt(e.clientX); }}
          onPointerMove={(e) => { if (dragging.current) applyAt(e.clientX); }}
          onPointerUp={(e) => { dragging.current = false; e.currentTarget.releasePointerCapture(e.pointerId); }}
          onPointerCancel={() => { dragging.current = false; }}
          style={{ position: "relative", height: 26, cursor: "ew-resize", touchAction: "none" }}
        >
          {/* bandes : largeur = durée réelle, nom à l'intérieur quand il tient */}
          {bands.map((b, i) => {
            const active = i === selectedIdx;
            return (
              <div
                key={b.id}
                title={`${labels.phases[b.id]} · ${fmtPeriod(periods[i].start, periods[i].end, locale, i === periods.length - 1)}`}
                style={{
                  position: "absolute", top: 0, height: 20, borderRadius: 5,
                  left: `calc(${b.left * 100}% + 1px)`, width: `calc(${b.width * 100}% - 2px)`,
                  background: active ? ACCENT : railBg,
                  opacity: active ? 1 : i < selectedIdx ? .95 : .6,
                  display: "flex", alignItems: "center", overflow: "hidden",
                  transition: "background .2s ease, opacity .2s ease",
                }}
              >
                <span style={{
                  padding: "0 7px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  fontSize: 9.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
                  color: active ? (dark ? "#1E1410" : "#fff") : muted,
                }}>
                  {labels.phases[b.id]}
                </span>
              </div>
            );
          })}
          {/* graduations régulières sous les bandes : c'est l'échelle de temps */}
          {ticks.map((t, i) => (
            <div key={i} style={{ position: "absolute", left: `${t.frac * 100}%`, top: 20, width: 1, height: 6, background: t.year ? faint : line }} />
          ))}
          {/* aujourd'hui */}
          <div title={todayLabel} style={{ position: "absolute", left: `${todayFrac * 100}%`, top: 0, width: 1, height: 20, background: dark ? "#fff" : INK, opacity: .4 }} />
          {/* curseur */}
          <div
            role="slider"
            tabIndex={0}
            aria-label={labels.experienceLabel}
            aria-valuemin={0}
            aria-valuemax={periods.length - 1}
            aria-valuenow={selectedIdx}
            aria-valuetext={labels.phases[phase]}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
              if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
            }}
            style={{
              position: "absolute", left: `${pos * 100}%`, top: -3, transform: "translateX(-50%)",
              width: 4, height: 26, borderRadius: 2, background: ACCENT,
              boxShadow: `0 0 0 1.5px ${surface}, 0 1px 3px rgba(44,23,22,.3)`, cursor: "grab", outlineOffset: 3,
            }}
          />
        </div>
      </div>

      {/* ── 2. La période sélectionnée, en toutes lettres ───────────────────── */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 19, color: ink }}>{labels.phases[phase]}</span>
          <span style={{ fontSize: 11.5, color: faint }}>{fmtPeriod(PHASE_WINDOWS[phase].start, PHASE_WINDOWS[phase].end, locale, selectedIdx === periods.length - 1)}</span>
          {proofLabel ? (
            <span style={{ fontSize: 11.5, color: faint }}>· {proofLabel}</span>
          ) : proof ? (
            <span style={{ fontSize: 11.5, color: faint }}>
              · {proof.investisseurs} {labels.proofs.investors} · {fmtEur(proof.souscrit, locale)} {labels.proofs.subscribed}
              {proof.strategies > 0 && <> · {proof.strategies} {labels.proofs.strategies}</>}
            </span>
          ) : null}
        </div>
        <div style={{ display: "flex", background: dark ? "rgba(255,255,255,.07)" : "#F4F2EB", borderRadius: 8, padding: 2 }}>
          {([false, true] as const).map((k) => (
            <button
              key={String(k)}
              type="button"
              onClick={() => setOverview(k)}
              style={{
                padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12,
                background: overview === k ? surface : "transparent", color: overview === k ? ink : muted,
                fontWeight: overview === k ? 600 : 400,
                boxShadow: overview === k ? "0 1px 2px rgba(44,23,22,.08)" : "none",
              }}
            >
              {k ? labels.viewOverview : labels.viewPeriod}
            </button>
          ))}
        </div>
      </div>
      {/* L'expérience utilisateur est la promesse de la période. L'admin la garde en
          typographie nue ; la dataroom la met légèrement en valeur. */}
      {highlightExperience ? (
        <div style={{ margin: "0 0 20px", padding: "18px 24px", borderRadius: 10, textAlign: "center", background: dark ? "rgba(255,255,255,.03)" : "#FDFAF4" }}>
          <div style={{ ...smallCaps, marginBottom: 7 }}>{labels.experienceLabel}</div>
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 17, lineHeight: 1.55, color: ink, margin: "0 auto", maxWidth: 780 }}>
            {experience[phase]}
          </p>
        </div>
      ) : (
        <div style={{ margin: "2px 0 18px" }}>
          <div style={{ ...smallCaps, marginBottom: 4 }}>{labels.experienceLabel}</div>
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 16, lineHeight: 1.5, color: ink, margin: 0, maxWidth: 900 }}>
            {experience[phase]}
          </p>
        </div>
      )}

      {/* ── 3a. Cette période : ce qui y est livré, couche par couche ────────── */}
      {!overview && (
        <div style={{ borderTop: `1px solid ${line}` }}>
          <div style={{ ...smallCaps, margin: "10px 0 2px" }}>{labels.deliveredHere}</div>
          {/* Les cinq couches sont toujours là, même vides : c'est l'architecture qui se lit,
              et voir qu'une couche ne bouge pas sur une période est une information. */}
          {LAYERS.map((layer) => {
            const shown = bricksOf(layer, phase);
            const vide = shown.length === 0;
            return (
              <div key={layer} style={{ display: "grid", gridTemplateColumns: `${LABEL_W}px 1fr`, gap: 12, borderBottom: `1px solid ${hairline}`, padding: "9px 0", minHeight: 42 }}>
                <div style={{ ...smallCaps, display: "flex", alignItems: "center", paddingRight: 12, opacity: vide ? .45 : 1 }}>{labels.layers[layer]}</div>
                {vide ? (
                  <div style={{ display: "flex", alignItems: "center", fontSize: 12, color: faint, opacity: .6 }}>—</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(216px, 1fr))", gap: 8, alignItems: "start" }}>
                    {shown.map(renderBrick)}
                  </div>
                )}
              </div>
            );
          })}
          {rienLivre && <div style={{ padding: "12px 0 0", fontSize: 12.5, color: faint }}>{labels.nothingDelivered}</div>}
        </div>
      )}

      {/* ── 3b. Vue d'ensemble : les six périodes en colonnes ────────────────── */}
      {overview && (
        <OverviewTable
          periods={periods}
          selectedIdx={selectedIdx}
          onPhaseChange={onPhaseChange}
          labels={labels}
          locale={locale}
          bricksOf={bricksOf}
          renderBrick={renderBrick}
          colors={{ faint, muted, ink, line, hairline, selectedBg, surface }}
          todayLabel={todayLabel}
        />
      )}
    </div>
  );
}

/**
 * Tableau six colonnes — la vision globale. En-têtes courts : le texte de la période
 * sélectionnée est déjà au-dessus, inutile d'empiler six paragraphes.
 */
function OverviewTable({
  periods, selectedIdx, onPhaseChange, labels, locale, bricksOf, renderBrick, colors, todayLabel,
}: {
  periods: Array<{ id: Phase; start: string; end: string; days: number }>;
  selectedIdx: number;
  onPhaseChange: (p: Phase) => void;
  labels: RoadmapLabels;
  locale: string;
  bricksOf: (layer: string, p: Phase) => PublicObjective[];
  renderBrick: (o: PublicObjective) => React.ReactNode;
  colors: { faint: string; muted: string; ink: string; line: string; hairline: string; selectedBg: string; surface: string };
  todayLabel?: string;
}) {
  const { faint, muted, ink, line, hairline, selectedBg, surface } = colors;
  const columns = `${LABEL_W}px ${periods.map((p) => `minmax(${MIN_COL}px, ${Math.sqrt(p.days).toFixed(2)}fr)`).join(" ")}`;
  const minWidth = LABEL_W + MIN_COL * periods.length;

  // Position de « aujourd'hui » dans l'espace des colonnes (≠ frise : les colonnes ne sont
  // pas proportionnelles à la durée).
  const todayCol = (() => {
    for (let i = 0; i < periods.length; i++) {
      const p = periods[i];
      if (TODAY < p.start) return { i, frac: 0 };
      if (TODAY <= p.end) return { i, frac: clamp01(days(p.start, TODAY) / p.days) };
    }
    return { i: periods.length - 1, frac: 1 };
  })();

  const stickyLabel = (extra?: React.CSSProperties): React.CSSProperties => ({
    display: "flex", alignItems: "center",
    fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: faint,
    paddingRight: 12, minWidth: 0, position: "sticky", left: 0, zIndex: 2, background: surface,
    ...extra,
  });

  return (
    <div style={{ overflowX: "auto", margin: "0 -4px", padding: 4 }}>
      <div style={{ position: "relative", minWidth }}>
        <div style={{ display: "grid", gridTemplateColumns: columns, alignItems: "stretch" }}>
          <div style={stickyLabel({ borderBottom: `2px solid ${line}` })} />
          {periods.map((p, i) => {
            const active = i === selectedIdx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPhaseChange(p.id)}
                aria-pressed={active}
                style={{
                  background: "transparent", border: "none", borderLeft: `1px solid ${hairline}`,
                  borderBottom: `2px solid ${active ? ACCENT : line}`,
                  padding: "4px 9px 8px", cursor: "pointer", textAlign: "left", minWidth: 0,
                }}
              >
                <span style={{ display: "block", fontSize: 12.5, fontWeight: active ? 600 : 500, color: active ? ink : muted, lineHeight: 1.25 }}>
                  {labels.phases[p.id]}
                </span>
                <span style={{ display: "block", fontSize: 10, color: faint, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {fmtPeriod(p.start, p.end, locale, i === periods.length - 1)}
                </span>
              </button>
            );
          })}

          {LAYERS.map((layer, li) => {
            const isLast = li === LAYERS.length - 1;
            return (
              <div key={layer} style={{ display: "contents" }}>
                <div style={stickyLabel({ borderBottom: isLast ? "none" : `1px solid ${hairline}`, padding: "8px 12px 8px 0" })}>
                  {labels.layers[layer]}
                </div>
                {periods.map((p, i) => {
                  const shown = bricksOf(layer, p.id);
                  return (
                    <div
                      key={`${layer}-${p.id}`}
                      style={{
                        background: i === selectedIdx ? selectedBg : "transparent",
                        borderLeft: `1px solid ${hairline}`, borderBottom: isLast ? "none" : `1px solid ${hairline}`,
                        padding: "7px 8px", minWidth: 0, minHeight: 40,
                        display: "flex", flexDirection: "column", gap: 5,
                      }}
                    >
                      {shown.map(renderBrick)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Repère « aujourd'hui », aligné sur les colonnes */}
        <div aria-hidden title={todayLabel} style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: columns, pointerEvents: "none", zIndex: 1 }}>
          <div />
          {periods.map((p, i) => (
            <div key={`rule-${p.id}`} style={{ position: "relative", minWidth: 0 }}>
              {todayCol.i === i && (
                <div style={{ position: "absolute", top: 0, bottom: 0, left: `${todayCol.frac * 100}%`, width: 0, borderLeft: `1px dashed ${faint}`, opacity: .6 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CapacityLine({ cap, labels, dark }: { cap: PhaseCapacity; labels: RoadmapLabels; dark?: boolean }) {
  const faint = dark ? "rgba(255,255,255,.5)" : FAINT;
  const ink = dark ? "#fff" : INK;
  const muted = dark ? "rgba(255,255,255,.75)" : MUTED;
  return (
    <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${dark ? "rgba(255,255,255,.12)" : LINE}`, display: "grid", gridTemplateColumns: "1fr auto", gap: "6px 32px", alignItems: "start" }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: faint, marginBottom: 4 }}>{labels.capacityLabel}</div>
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 17, color: ink, lineHeight: 1.4 }}>{cap.capacite}</div>
      </div>
      <div style={{ textAlign: "right", minWidth: 180 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: faint, marginBottom: 4 }}>{labels.volumeLabel}</div>
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 17, color: ink, lineHeight: 1.4, whiteSpace: "nowrap" }}>{cap.volume}</div>
      </div>
      {cap.api && (
        <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: faint, marginBottom: 4 }}>{labels.apiLabel}</div>
          <div style={{ fontSize: 13.5, color: muted, lineHeight: 1.55 }}>{cap.api}</div>
        </div>
      )}
    </div>
  );
}

/**
 * « Pourquoi c'est défendable » — les arguments changent avec la période sélectionnée :
 * sur le passé ce sont des faits acquis, sur le futur ce que la période débloquera.
 */
export function DefendableList({ items, title, dark }: { items: string[]; title?: string; dark?: boolean }) {
  const faint = dark ? "rgba(255,255,255,.5)" : FAINT;
  const ink = dark ? "#fff" : INK;
  if (!items?.length) return null;
  return (
    <div>
      {title && <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: faint, marginBottom: 10 }}>{title}</div>}
      <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
        {items.map((d, i) => (
          <li key={i} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 12, alignItems: "start" }}>
            <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 20, color: ACCENT, lineHeight: 1.3 }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontSize: 14.5, color: ink, lineHeight: 1.6 }}>{d}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
