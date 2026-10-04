"use client";

import { useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { STATUS_STYLE } from "@/lib/roadmap/labels";
import {
  ECO_ITEMS, ECO_TODAY, GROWTH_PHASES, VALIDATION_STATUS, ZONES, ZONE_META,
  type EcoItem, type GrowthPhase, type Zone,
} from "@/lib/ecosystem/seed";
import { ecoCopy, type EcoCopy } from "@/lib/ecosystem/i18n";

// Roadmap écosystème, v2 (04/10/2026). Une frise de phases de croissance, lues
// en volume ; sous le curseur, des ZONES où plusieurs choses se passent à la
// fois : capital, actifs, partenaires, tables, cadre. Même code couleur que la
// roadmap technique. Brouillon : voir seed.ts.

const INK = "#2C1716";
const MUTED = "#766962";
const FAINT = "#A39A8E";
const LINE = "#E6E1D4";
const HAIRLINE = "#F4F2EB";
const ACCENT = "#E27B30";
const SURFACE = "#FFFFFE";

type Lang = "fr" | "en";
const ms = (d: string) => new Date(d).getTime();
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const phaseIdx = (p: GrowthPhase) => GROWTH_PHASES.findIndex((g) => g.id === p);

function fmtPeriod(start: string, end: string, locale: string, isLast: boolean) {
  const y0 = start.slice(0, 4), y1 = end.slice(0, 4);
  if (isLast) return `${y0}+`;
  if (end <= ECO_TODAY || start <= ECO_TODAY) {
    const f = (d: string) => new Date(d).toLocaleDateString(locale, { month: "short", year: "numeric" });
    return `${f(start)} – ${f(end)}`;
  }
  const q = (d: string) => `Q${Math.floor((Number(d.slice(5, 7)) - 1) / 3) + 1}`;
  return y0 === y1 ? (start.endsWith("-01-01") && end.endsWith("-12-31") ? y0 : `${q(start)} – ${q(end)} ${y0}`) : `${q(start)} ${y0} – ${q(end)} ${y1}`;
}

const smallCaps: React.CSSProperties = { fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: FAINT };

export function EcosystemRoadmap({ locale, draft = false }: { locale: Locale; draft?: boolean }) {
  const c = ecoCopy(locale);
  const l: Lang = locale === "en" ? "en" : "fr";
  const dateLocale = l === "fr" ? "fr-FR" : "en-US";
  const [phase, setPhase] = useState<GrowthPhase>("traction");
  const [overview, setOverview] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const idx = phaseIdx(phase);
  const current = GROWTH_PHASES[idx];
  const selected = selectedId ? ECO_ITEMS.find((it) => it.id === selectedId) ?? null : null;

  // ── Frise : bandes proportionnelles à la durée, curseur déplaçable ───────
  const T0 = ms(GROWTH_PHASES[0].start), T1 = ms(GROWTH_PHASES[GROWTH_PHASES.length - 1].end);
  const fracOf = (d: string) => clamp01((ms(d) - T0) / (T1 - T0));
  const bands = GROWTH_PHASES.map((g) => ({ id: g.id, left: fracOf(g.start), width: fracOf(g.end) - fracOf(g.start) }));
  const todayFrac = fracOf(ECO_TODAY);
  const periodAtFrac = (f: number) => { for (let i = bands.length - 1; i >= 0; i--) if (f >= bands[i].left) return i; return 0; };
  const midOf = (i: number) => bands[i].left + bands[i].width / 2;
  const [pos, setPos] = useState(() => (periodAtFrac(todayFrac) === idx ? todayFrac : midOf(idx)));
  const [seenIdx, setSeenIdx] = useState(idx);
  if (seenIdx !== idx) { setSeenIdx(idx); if (periodAtFrac(pos) !== idx) setPos(midOf(idx)); }
  const ticks = useMemo(() => {
    const out: Array<{ frac: number; label: string }> = [];
    for (let y = Number(GROWTH_PHASES[0].start.slice(0, 4)); y <= Number(GROWTH_PHASES[GROWTH_PHASES.length - 1].end.slice(0, 4)); y++) out.push({ frac: fracOf(`${y}-01-01`), label: String(y) });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const railRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const applyAt = (x: number) => {
    const r = railRef.current?.getBoundingClientRect(); if (!r) return;
    const f = clamp01((x - r.left) / Math.max(1, r.width)); setPos(f);
    const i = periodAtFrac(f); if (GROWTH_PHASES[i].id !== phase) setPhase(GROWTH_PHASES[i].id);
  };
  const step = (d: number) => { const i = Math.min(GROWTH_PHASES.length - 1, Math.max(0, idx + d)); setPos(midOf(i)); setPhase(GROWTH_PHASES[i].id); };

  // ── Zones : ce qui compte sur la phase, nouveau ou déjà en place ─────────
  const itemsOf = (zone: Zone, p: GrowthPhase) => ECO_ITEMS.filter((it) => it.zone === zone && phaseIdx(it.depuis) <= phaseIdx(p));

  const chip = (it: EcoItem, p: GrowthPhase, compact = false) => {
    const st = STATUS_STYLE[VALIDATION_STATUS[it.validation]];
    const isNew = it.depuis === p;
    const selectedChip = selectedId === it.id;
    return (
      <button
        key={it.id}
        type="button"
        onClick={() => setSelectedId(it.id)}
        title={`${it.titre[l]}, ${c.validation[it.validation]}`}
        style={{
          textAlign: "left", padding: compact ? "5px 8px" : "7px 10px", borderRadius: 9, cursor: "pointer",
          background: st.bg, color: st.color, width: "100%",
          border: `1px ${it.validation === "discussion" ? "dashed" : "solid"} ${selectedChip ? ACCENT : st.border}`,
          boxShadow: selectedChip ? "0 0 0 3px rgba(226,123,48,.18)" : "none",
          opacity: isNew || compact ? 1 : 0.72,
          display: "flex", flexDirection: "column", gap: 3,
        }}
      >
        <span style={{ fontSize: compact ? 11.5 : 12.5, fontWeight: 600, lineHeight: 1.3 }}>{it.titre[l]}</span>
        <span style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 6, opacity: .9, flexWrap: "wrap" }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: st.dot, display: "inline-block", flexShrink: 0 }} />
          {c.validation[it.validation]}
          <span style={{ letterSpacing: "0.04em", textTransform: "uppercase", opacity: .7 }}>· {c.roles[it.role]}</span>
          {isNew && !compact && <span style={{ color: ACCENT, fontWeight: 600 }}>· {c.newHere}</span>}
        </span>
      </button>
    );
  };

  return (
    <div className="mt-8">
      {draft && <p style={{ margin: "0 0 20px", padding: "10px 14px", borderRadius: 8, background: "#FCE6D3", color: "#6B3A0E", fontSize: 13 }}>{c.draftBanner}</p>}
      <p style={{ fontSize: 15, color: MUTED, margin: "0 0 22px", maxWidth: 680, lineHeight: 1.6 }}>{c.intro}</p>

      {/* Légende : les trois couleurs, et la marque « nouveau » */}
      <ul style={{ listStyle: "none", margin: "0 0 14px", padding: 0, display: "flex", flexWrap: "wrap", gap: "8px 18px", fontSize: 12.5, color: MUTED }}>
        {(["livre", "en_cours", "prevu"] as const).map((s) => {
          const st = STATUS_STYLE[s];
          return (
            <li key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span aria-hidden style={{ width: 22, height: 14, borderRadius: 4, background: st.bg, border: `1px ${s === "prevu" ? "dashed" : "solid"} ${st.border}`, display: "inline-block" }} />
              <span style={{ color: INK, fontWeight: 600 }}>{c.statuses[s]}</span>
              <span>{c.legend[s]}</span>
            </li>
          );
        })}
        <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: ACCENT, fontWeight: 600 }}>· {c.newHere}</span>
          <span>/ {c.carriedOver}</span>
        </li>
      </ul>

      <section style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "26px 28px 26px" }}>
        {/* ── Frise des phases de croissance ──────────────────────────────── */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ position: "relative", height: 15, marginBottom: 3 }}>
            {ticks.map((t, i) => (
              <span key={i} style={{ position: "absolute", left: `${t.frac * 100}%`, top: 0, transform: i === 0 ? "none" : "translateX(-50%)", fontSize: 9.5, color: MUTED, fontWeight: 600 }}>{t.label}</span>
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
            {bands.map((b, i) => {
              const active = i === idx; const g = GROWTH_PHASES[i];
              return (
                <div key={b.id} title={`${g.label[l]} · ${g.volume[l]}`} style={{ position: "absolute", top: 0, height: 20, borderRadius: 5, left: `calc(${b.left * 100}% + 1px)`, width: `calc(${b.width * 100}% - 2px)`, background: active ? ACCENT : "#EFEADE", opacity: active ? 1 : i < idx ? .95 : .6, display: "flex", alignItems: "center", overflow: "hidden", transition: "background .2s ease, opacity .2s ease" }}>
                  <span style={{ padding: "0 7px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: active ? "#fff" : MUTED }}>{g.label[l]}</span>
                </div>
              );
            })}
            {ticks.map((t, i) => <div key={i} style={{ position: "absolute", left: `${t.frac * 100}%`, top: 20, width: 1, height: 6, background: FAINT }} />)}
            <div title={c.today} style={{ position: "absolute", left: `${todayFrac * 100}%`, top: 0, width: 1, height: 20, background: INK, opacity: .4 }} />
            <div
              role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={GROWTH_PHASES.length - 1} aria-valuenow={idx} aria-valuetext={current.label[l]}
              onKeyDown={(e) => { if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); } if (e.key === "ArrowRight") { e.preventDefault(); step(1); } }}
              style={{ position: "absolute", left: `${pos * 100}%`, top: -3, transform: "translateX(-50%)", width: 4, height: 26, borderRadius: 2, background: ACCENT, boxShadow: `0 0 0 1.5px ${SURFACE}, 0 1px 3px rgba(44,23,22,.3)`, cursor: "grab", outlineOffset: 3 }}
            />
          </div>
        </div>

        {/* ── La phase : nom, dates, volume, et sa phrase ─────────────────── */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 19, color: INK }}>{current.label[l]}</span>
            <span style={{ fontSize: 11.5, color: FAINT }}>{fmtPeriod(current.start, current.end, dateLocale, idx === GROWTH_PHASES.length - 1)}</span>
            <span style={{ fontSize: 11.5, color: FAINT }}>· {c.volumeLabel} : {current.volume[l]}</span>
          </div>
          <div style={{ display: "flex", background: "#F4F2EB", borderRadius: 8, padding: 2 }}>
            {([false, true] as const).map((k) => (
              <button key={String(k)} type="button" onClick={() => setOverview(k)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, background: overview === k ? SURFACE : "transparent", color: overview === k ? INK : MUTED, fontWeight: overview === k ? 600 : 400, boxShadow: overview === k ? "0 1px 2px rgba(44,23,22,.08)" : "none" }}>
                {k ? c.viewOverview : c.viewPhase}
              </button>
            ))}
          </div>
        </div>
        <div style={{ margin: "0 0 20px", padding: "18px 24px", borderRadius: 10, textAlign: "center", background: "#FDFAF4" }}>
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 17, lineHeight: 1.55, color: INK, margin: "0 auto", maxWidth: 780 }}>{current.tagline[l]}</p>
        </div>

        {/* ── Cette phase : les zones, en cartes ──────────────────────────── */}
        {!overview && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
            {ZONES.map((z) => {
              const zm = ZONE_META[z];
              const items = itemsOf(z, phase);
              const news = items.filter((it) => it.depuis === phase);
              const older = items.filter((it) => it.depuis !== phase);
              const text = zm.parPhase[phase]?.[l];
              const quiet = !text && news.length === 0;
              return (
                <section key={z} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px 16px", background: quiet ? "transparent" : SURFACE, opacity: quiet ? .75 : 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 17, color: INK, lineHeight: 1.2 }}>{zm.label[l]}</div>
                    <div style={{ ...smallCaps, marginTop: 3 }}>{zm.sub[l]}</div>
                  </div>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: text ? INK : FAINT }}>{text ?? c.nothingNew}</p>
                  {news.length > 0 && <div style={{ display: "grid", gap: 6 }}>{news.map((it) => chip(it, phase))}</div>}
                  {older.length > 0 && (
                    <div>
                      <div style={{ ...smallCaps, margin: "4px 0 6px" }}>{c.carriedOver}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {older.map((it) => {
                          const st = STATUS_STYLE[VALIDATION_STATUS[it.validation]];
                          return (
                            <button key={it.id} type="button" onClick={() => setSelectedId(it.id)} title={c.validation[it.validation]} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 999, background: st.bg, color: st.color, border: `1px ${it.validation === "discussion" ? "dashed" : "solid"} ${st.border}`, cursor: "pointer" }}>
                              {it.titre[l]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {/* ── Vue d'ensemble : zones × phases, ce qui arrive à chaque phase ── */}
        {overview && (
          <div style={{ overflowX: "auto", margin: "0 -4px", padding: 4 }}>
            <div style={{ display: "grid", gridTemplateColumns: `150px repeat(${GROWTH_PHASES.length}, minmax(170px, 1fr))`, minWidth: 150 + 170 * GROWTH_PHASES.length }}>
              <div style={{ borderBottom: `2px solid ${LINE}` }} />
              {GROWTH_PHASES.map((g, i) => (
                <button key={g.id} type="button" onClick={() => setPhase(g.id)} aria-pressed={i === idx} style={{ background: "transparent", border: "none", borderLeft: `1px solid ${HAIRLINE}`, borderBottom: `2px solid ${i === idx ? ACCENT : LINE}`, padding: "4px 9px 8px", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ display: "block", fontSize: 12.5, fontWeight: i === idx ? 600 : 500, color: i === idx ? INK : MUTED }}>{g.label[l]}</span>
                  <span style={{ display: "block", fontSize: 10, color: FAINT, marginTop: 1 }}>{g.volume[l]}</span>
                </button>
              ))}
              {ZONES.map((z, zi) => (
                <div key={z} style={{ display: "contents" }}>
                  <div style={{ ...smallCaps, display: "flex", alignItems: "center", padding: "8px 12px 8px 0", borderBottom: zi === ZONES.length - 1 ? "none" : `1px solid ${HAIRLINE}`, position: "sticky", left: 0, background: SURFACE, zIndex: 2 }}>{ZONE_META[z].label[l]}</div>
                  {GROWTH_PHASES.map((g, i) => (
                    <div key={`${z}-${g.id}`} style={{ background: i === idx ? "#FCFBF7" : "transparent", borderLeft: `1px solid ${HAIRLINE}`, borderBottom: zi === ZONES.length - 1 ? "none" : `1px solid ${HAIRLINE}`, padding: "7px 8px", minHeight: 40, display: "flex", flexDirection: "column", gap: 5 }}>
                      {ECO_ITEMS.filter((it) => it.zone === z && it.depuis === g.id).map((it) => chip(it, g.id, true))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <p style={{ marginTop: 28, fontSize: 12, color: FAINT }}>{c.footer}</p>

      {selected && <EcoCardModal item={selected} lang={l} copy={c} onClose={() => setSelectedId(null)} />}
    </div>
  );
}

// La carte d'une entrée : statut dans la hiérarchie de validation, ce qu'elle
// apporte, depuis quand, ce qui est acquis, la prochaine étape.
function EcoCardModal({ item, lang, copy, onClose }: { item: EcoItem; lang: Lang; copy: EcoCopy; onClose: () => void }) {
  const st = STATUS_STYLE[VALIDATION_STATUS[item.validation]];
  const since = GROWTH_PHASES[phaseIdx(item.depuis)];
  const dt: React.CSSProperties = { color: FAINT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 2 };
  const dd: React.CSSProperties = { margin: 0, color: INK, lineHeight: 1.5 };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(44,23,22,.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE, borderRadius: 16, width: "100%", maxWidth: 560, padding: "26px 28px 22px", boxShadow: "0 8px 40px rgba(44,23,22,.18)" }}>
        <div style={{ ...smallCaps, marginBottom: 6 }}>{ZONE_META[item.zone].label[lang]} · {copy.roles[item.role]}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, color: INK }}>{item.titre[lang]}</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{copy.validation[item.validation]}</span>
          {item.aConfirmer && <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, border: "1px dashed #C9C1B3", color: MUTED }}>{copy.toConfirm}</span>}
        </div>
        <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 10, columnGap: 16, fontSize: 13.5 }}>
          <dt style={dt}>{copy.card.brings}</dt><dd style={dd}>{item.apporte[lang]}</dd>
          <dt style={dt}>{copy.card.since}</dt><dd style={dd}>{since.label[lang]} · {since.volume[lang]}</dd>
          {item.preuve && (<><dt style={dt}>{copy.card.proof}</dt><dd style={dd}>{item.preuve[lang]}</dd></>)}
          {item.prochaineEtape && (<><dt style={dt}>{copy.card.next}</dt><dd style={{ ...dd, color: MUTED }}>{item.prochaineEtape[lang]}</dd></>)}
        </dl>
        <div style={{ marginTop: 22, paddingTop: 14, borderTop: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          {item.url ? <a href={item.url} target="_blank" rel="noreferrer noopener" style={{ fontSize: 12.5, color: INK, whiteSpace: "nowrap" }}>{copy.card.link} ↗</a> : <span />}
          <button type="button" onClick={onClose} style={{ background: "none", border: `1px solid ${LINE}`, borderRadius: 8, padding: "7px 14px", fontSize: 12.5, color: MUTED, cursor: "pointer" }}>{copy.card.close}</button>
        </div>
      </div>
    </div>
  );
}
