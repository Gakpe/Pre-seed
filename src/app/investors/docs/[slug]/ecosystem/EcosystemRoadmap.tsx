"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ACTORS, CATEGORIES, CATEGORY_LABEL, ECO_TODAY, FOUNDERS_INTRO, GROWTH_PHASES, NARRATIVE, STREAMS, STREAM_META, type Actor, type Company, type GrowthPhase, type Layer, type Lever, type Offering, type Panel, type Partner, type Photo, type Stream } from "@/lib/ecosystem/seed";
import { useState as useLocalState } from "react";
import { ecoCopy } from "@/lib/ecosystem/i18n";

// Roadmap écosystème, v3 (04/10/2026). Un récit par période : la frise des
// phases de croissance, les volumes en regard, puis trois fils racontés en
// quelques phrases avec des photos, distribution, sous-jacents, marché.
// Pas de briques, pas de tâches. Brouillon : voir seed.ts.

const INK = "#2C1716";
const MUTED = "#766962";
const FAINT = "#A39A8E";
const LINE = "#E6E1D4";
const HAIRLINE = "#F4F2EB";
const ACCENT = "#E27B30";
// Orange foncé pour les chiffres orangés sur fond clair : #E27B30 tombe à ~2,9
// de contraste (sous le plancher WCAG), #9A4B10 passe à ~6,2. On garde l'ACCENT
// vif pour les fonds, badges et puces, l'ACCENT_TEXT pour le texte.
const ACCENT_TEXT = "#9A4B10";
const SURFACE = "#FFFFFE";
const SERIF = "Georgia, 'Times New Roman', serif";

type Lang = "fr" | "en";
const ms = (d: string) => new Date(d).getTime();
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const phaseIdx = (p: GrowthPhase) => GROWTH_PHASES.findIndex((g) => g.id === p);

function fmtPeriod(start: string, end: string, locale: string, isLast: boolean) {
  // Pas de tiret long entre deux dates : « à », ou « to » en anglais.
  const to = locale.startsWith("en") ? " to " : " à ";
  const y0 = start.slice(0, 4), y1 = end.slice(0, 4);
  if (isLast) return `${y0}+`;
  if (start <= ECO_TODAY) {
    const f = (d: string) => new Date(d).toLocaleDateString(locale, { month: "short", year: "numeric" });
    return `${f(start)}${to}${f(end)}`;
  }
  const q = (d: string) => `Q${Math.floor((Number(d.slice(5, 7)) - 1) / 3) + 1}`;
  return y0 === y1 ? (start.endsWith("-01-01") && end.endsWith("-12-31") ? y0 : `${q(start)}${to}${q(end)} ${y0}`) : `${q(start)} ${y0}${to}${q(end)} ${y1}`;
}

/** Les **gras** du récit deviennent des noms mis en évidence. */
function rich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? <strong key={i} style={{ fontWeight: 600, color: INK }}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
  );
}

const smallCaps: React.CSSProperties = { fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: FAINT };

export function EcosystemRoadmap({ locale, draft = false, initialPhase = "amorcage" }: { locale: Locale; /** Aperçu admin : bandeau et mentions « à confirmer ». */ draft?: boolean; /** Phase ouverte au chargement. */ initialPhase?: GrowthPhase }) {
  const c = ecoCopy(locale);
  const l: Lang = locale === "en" ? "en" : "fr";
  const dateLocale = l === "fr" ? "fr-FR" : "en-US";
  const [phase, setPhase] = useState<GrowthPhase>(initialPhase);
  const [overview, setOverview] = useState(false);
  const idx = phaseIdx(phase);
  const current = GROWTH_PHASES[idx];
  // Le bandeau collant n'apparaît qu'une fois les volumes sortis de l'écran :
  // tant qu'ils sont visibles, il ferait doublon. Une sentinelle sous les
  // barres, observée ; quand elle passe au-dessus de la fenêtre, on affiche.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [pastVolumes, setPastVolumes] = useState(false);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPastVolumes(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const todayIdx = Math.max(0, GROWTH_PHASES.findIndex((g) => g.start <= ECO_TODAY && ECO_TODAY <= g.end));
  const today = GROWTH_PHASES[todayIdx];
  const last = GROWTH_PHASES[GROWTH_PHASES.length - 1];

  // ── Frise ────────────────────────────────────────────────────────────────
  const T0 = ms(GROWTH_PHASES[0].start), T1 = ms(GROWTH_PHASES[GROWTH_PHASES.length - 1].end);
  const fracOf = (d: string) => clamp01((ms(d) - T0) / (T1 - T0));
  const bands = GROWTH_PHASES.map((g) => ({ id: g.id, left: fracOf(g.start), width: fracOf(g.end) - fracOf(g.start) }));
  const todayFrac = fracOf(ECO_TODAY);
  const periodAtFrac = (f: number) => { for (let i = bands.length - 1; i >= 0; i--) if (f >= bands[i].left) return i; return 0; };
  const midOf = (i: number) => bands[i].left + bands[i].width / 2;
  const [pos, setPos] = useState(() => (periodAtFrac(todayFrac) === idx ? todayFrac : midOf(idx)));
  const [seenIdx, setSeenIdx] = useState(idx);
  if (seenIdx !== idx) { setSeenIdx(idx); if (periodAtFrac(pos) !== idx) setPos(midOf(idx)); }
  const years = useMemo(() => {
    const out: Array<{ frac: number; label: string }> = [];
    for (let y = Number(GROWTH_PHASES[0].start.slice(0, 4)); y <= Number(GROWTH_PHASES[GROWTH_PHASES.length - 1].end.slice(0, 4)); y++) out.push({ frac: clamp01((ms(`${y}-01-01`) - T0) / (T1 - T0)), label: String(y) });
    return out;
  }, [T0, T1]);
  const railRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const applyAt = (x: number) => {
    const r = railRef.current?.getBoundingClientRect(); if (!r) return;
    const f = clamp01((x - r.left) / Math.max(1, r.width)); setPos(f);
    const i = periodAtFrac(f); if (GROWTH_PHASES[i].id !== phase) setPhase(GROWTH_PHASES[i].id);
  };
  const go = (i: number) => { const k = Math.min(GROWTH_PHASES.length - 1, Math.max(0, i)); setPos(midOf(k)); setPhase(GROWTH_PHASES[k].id); };

  // Courbe des volumes : échelle log, de 100 K€ à 1 Md€.
  const maxLog = Math.log10(GROWTH_PHASES[GROWTH_PHASES.length - 1].volumeMEur) + 1;
  const barH = (v: number) => clamp01((Math.log10(v) + 1) / maxLog);

  // Les acteurs du fil sur la période, par catégorie, cumulés depuis le début.
  const actorGrid = (stream: Stream) => {
    const cats = CATEGORIES[stream].map((cat) => ({
      cat,
      actors: ACTORS.filter((a) => a.stream === stream && a.category === cat && phaseIdx(a.depuis) <= idx),
    })).filter((g) => g.actors.length > 0);
    if (cats.length === 0) return null;
    return (
      <div style={{ marginTop: 16 }}>
        <div style={{ ...smallCaps, marginBottom: 8 }}>{c.actorsTitle}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px 18px" }}>
          {cats.map(({ cat, actors }) => (
            <div key={cat}>
              <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 5 }}>{CATEGORY_LABEL[cat][l]}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {actors.map((a) => <ActorRow key={a.id} a={a} lang={l} isNew={a.depuis === phase} newLabel={c.newHere} toConfirm={draft ? c.toConfirm : null} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const photoStrip = (photos: Photo[]) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
      {photos.map((p) => (
        <figure key={p.src} style={{ margin: 0 }}>
          <div style={{ aspectRatio: "16 / 10", overflow: "hidden", borderRadius: 10, background: HAIRLINE }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.t[l]} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos ?? "center", display: "block" }} />
          </div>
          <figcaption style={{ marginTop: 6, fontSize: 11.5, lineHeight: 1.45, color: MUTED }}>
            <span style={{ color: INK, fontWeight: 600 }}>{p.t[l]}</span>
            {p.d && <>{" - "}<span>{p.d[l]}</span></>}
          </figcaption>
        </figure>
      ))}
    </div>
  );

  // En-tête du co-structurant (Africa Rise) : nom en tête, dirigeants en
  // regard, chacun avec son petit portrait rond quand on en a un.
  const partnerHeader = (pt: Partner) => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 20px", marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${HAIRLINE}` }}>
      <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: INK }}>{pt.name}</span>
      {pt.people?.map((pe) => (
        <span key={pe.name} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: MUTED }}>
          {pe.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pe.photo} alt={pe.name} style={{ width: 28, height: 28, borderRadius: 999, objectFit: "cover", border: `1px solid ${LINE}`, display: "block" }} />
          )}
          <span><span style={{ color: INK, fontWeight: 600 }}>{pe.name}</span> {pe.role[l]}</span>
        </span>
      ))}
    </div>
  );

  // La thèse de gestion du risque : intitulé explicite, puis les niveaux de
  // protection numérotés (numéro orangé, intitulé en encre, précision en gris).
  const riskLayers = (layers: Layer[]) => (
    <div style={{ marginTop: 16, borderTop: `1px solid ${HAIRLINE}`, paddingTop: 12 }}>
      <div style={{ ...smallCaps, color: MUTED }}>{l === "fr" ? "La thèse de gestion du risque" : "The risk management thesis"}</div>
      <p style={{ margin: "4px 0 10px", fontSize: 12.5, color: "#4B4039" }}>
        {l === "fr" ? "Nos souscripteurs sont toujours en dette senior, protégés par cinq niveaux :" : "Our subscribers are always senior debt, protected by five layers:"}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "8px 24px" }}>
        {layers.map((ly) => (
          <div key={ly.n} style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 13, lineHeight: 1.5 }}>
            <span style={{ fontFamily: SERIF, color: ACCENT, minWidth: 12 }}>{ly.n}</span>
            <span style={{ color: INK, fontWeight: 600 }}>{ly.title[l]}</span>
            <span style={{ color: MUTED }}>{ly.detail[l]}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Encart « liquidité qui arrive » : montant en vedette, colonnes à côté.
  const liquidityPanel = (pnl: Panel) => (
    <div style={{ marginTop: 16, border: `1px dashed ${ACCENT}`, borderRadius: 12, padding: "16px 18px", background: "#FFFBF6" }}>
      <div style={{ ...smallCaps, color: MUTED, marginBottom: 10 }}>{pnl.title[l]}</div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px" }}>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: 26, lineHeight: 1, color: ACCENT_TEXT }}>{pnl.amount[l]}</div>
          <div style={{ ...smallCaps, color: FAINT, marginTop: 5 }}>{pnl.note[l]}</div>
        </div>
        {pnl.cols.map((col, i) => (
          <div key={i} style={{ minWidth: 150 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{col.h[l]}</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{col.d[l]}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // Stratégie à venir, en carte « offre » : badge d'ouverture, descriptif et
  // une ligne de métriques jointives (rendement, ticket, allocation, durée).
  const offeringCards = (offerings: Offering[]) => (
    <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
      {offerings.map((o) => (
        <div key={o.name.en} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "16px 18px", background: SURFACE }}>
          {o.partner && partnerHeader(o.partner)}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "6px 16px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: SERIF, fontSize: 18, color: INK }}>{o.name[l]}</span>
              {o.tag && <span style={{ fontSize: 12.5, color: MUTED }}>{o.tag[l]}</span>}
              {o.logos?.map((lg) => (
                <span key={lg.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: MUTED }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={lg.src} alt="" style={{ height: 16, width: "auto", maxWidth: 70, objectFit: "contain", display: "block" }} />
                  {lg.name}
                </span>
              ))}
            </div>
            {o.status && <span style={{ ...smallCaps, color: ACCENT_TEXT, border: `1px solid ${ACCENT}`, borderRadius: 999, padding: "3px 10px" }}>{o.status[l]}</span>}
          </div>
          {o.subtitle && <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "#4B4039", lineHeight: 1.7 }}>{rich(o.subtitle[l])}</p>}
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 1, background: LINE, border: `1px solid ${LINE}`, borderRadius: 10, overflow: "hidden" }}>
            {o.metrics.map((m, i) => (
              <div key={i} style={{ background: m.accent ? ACCENT : SURFACE, padding: "10px 12px" }}>
                <div style={{ ...smallCaps, color: m.accent ? "rgba(255,255,255,0.92)" : FAINT }}>{m.k[l]}</div>
                <div style={{ fontFamily: SERIF, fontSize: 17, marginTop: 4, color: m.accent ? "#fff" : INK }}>{m.v[l]}</div>
              </div>
            ))}
          </div>
          {o.layers && o.layers.length > 0 && riskLayers(o.layers)}
          {o.companies && companyCards(o.companies.list, o.companies.title[l])}
          {o.note && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: MUTED, fontStyle: "italic" }}>{o.note[l]}</p>}
        </div>
      ))}
    </div>
  );

  // Scale-ups et opérateurs : cartes à chiffres clés, même grammaire que le
  // reste des sous-jacents (carte encadrée, nom en serif, puces orangées).
  const companyCards = (companies: Company[], title?: string) => (
    <div style={{ marginTop: 18 }}>
      <div style={{ ...smallCaps, color: MUTED, marginBottom: 10 }}>{title ?? (l === "fr" ? "Scale-ups et opérateurs" : "Scale-ups & operators")}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
        {companies.map((co) => (
          <div key={co.name[l]} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px", background: SURFACE }}>
            <div style={{ fontFamily: SERIF, fontSize: 16, color: INK, lineHeight: 1.2 }}>
              {co.name[l]}
              {draft && co.aConfirmer && <span style={{ marginLeft: 6, fontSize: 10, color: FAINT }}>({c.toConfirm})</span>}
            </div>
            <div style={{ fontSize: 12, color: FAINT, marginTop: 3 }}>{co.tag[l]}</div>
            <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {co.figs.map((f, i) => (
                <li key={i} style={{ display: "flex", gap: 8, fontSize: 12.5, lineHeight: 1.5, color: "#4B4039" }}>
                  <span aria-hidden style={{ marginTop: 7, width: 4, height: 4, borderRadius: 999, background: ACCENT, flexShrink: 0 }} />
                  <span>{f[l]}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  // Leviers de la machine réseau : cartes avec intitulé, chiffre-phare et une
  // phrase. Une vraie mise en page du récit, pas un bloc de texte.
  const leverCards = (levers: Lever[]) => (
    <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
      {levers.map((lv, i) => (
        <div key={i} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px", background: SURFACE }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{lv.title[l]}</div>
          <div style={{ fontFamily: SERIF, fontSize: 20, color: ACCENT_TEXT, margin: "6px 0 8px", lineHeight: 1.15 }}>{lv.metric[l]}</div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "#4B4039" }}>{rich(lv.text[l])}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-8">
      {draft && <p style={{ margin: "0 0 20px", padding: "10px 14px", borderRadius: 8, background: "#FCE6D3", color: "#6B3A0E", fontSize: 13 }}>{c.draftBanner}</p>}
      <p style={{ fontSize: 15, color: MUTED, margin: "0 0 24px", maxWidth: 680, lineHeight: 1.6 }}>{c.intro}</p>

      {/* ── Le réseau des fondateurs, premier actif : l'intro avant la frise ── */}
      <section style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "22px 28px 24px", marginBottom: 20 }}>
        <div style={{ fontFamily: SERIF, fontSize: 19, color: INK }}>{FOUNDERS_INTRO.title[l]}</div>
        <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.7, color: "#4B4039", maxWidth: 760 }}>{FOUNDERS_INTRO.body[l]}</p>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
          {FOUNDERS_INTRO.people.map((pe) => (
            <div key={pe.name} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ ...smallCaps, color: MUTED }}>{pe.side[l]}</div>
              <div style={{ fontFamily: SERIF, fontSize: 16, color: INK, marginTop: 4 }}>{pe.name}</div>
              <p style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.6, color: "#4B4039" }}>{pe.text[l]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bandeau fixe : où l'on est, ce qu'on regarde, où l'on va. Il ne
          s'affiche qu'une fois les volumes défilés hors de l'écran. ── */}
      <div
        aria-hidden={!pastVolumes}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
          padding: "8px 0", background: "rgba(246,244,239,.92)", backdropFilter: "blur(6px)",
          transform: pastVolumes ? "translateY(0)" : "translateY(-110%)", opacity: pastVolumes ? 1 : 0,
          transition: "transform .25s ease, opacity .25s ease", pointerEvents: pastVolumes ? "auto" : "none",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 22px", padding: "9px 14px", borderRadius: 10, border: `1px solid ${LINE}`, background: SURFACE, fontSize: 12.5 }}>
            <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={smallCaps}>{c.stickyToday}</span>
              <span style={{ color: INK, fontWeight: 600 }}>{today.label[l]}</span>
              <span style={{ color: MUTED }}>{today.volume[l]}</span>
            </span>
            {idx !== todayIdx && (
              <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={smallCaps}>{c.stickyShown}</span>
                <span style={{ color: ACCENT, fontWeight: 600 }}>{current.label[l]}</span>
                <span style={{ color: MUTED }}>{current.volume[l]}</span>
              </span>
            )}
            <span style={{ display: "flex", alignItems: "baseline", gap: 8, marginLeft: "auto" }}>
              <span style={smallCaps}>{c.stickyTarget}</span>
              <span style={{ fontFamily: SERIF, color: INK, fontSize: 14 }}>{last.volume[l]}</span>
            </span>
            <span aria-hidden style={{ flexBasis: "100%", height: 3, borderRadius: 2, background: HAIRLINE, position: "relative", overflow: "hidden" }}>
              <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${((todayIdx + 1) / GROWTH_PHASES.length) * 100}%`, background: "#D9D2C2" }} />
              <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${((idx + 1) / GROWTH_PHASES.length) * 100}%`, background: ACCENT, opacity: .85 }} />
            </span>
          </div>
        </div>
      </div>

      <section style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "26px 28px 28px" }}>
        {/* ── Frise des périodes ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ position: "relative", height: 15, marginBottom: 3 }}>
            {years.map((t, i) => <span key={i} style={{ position: "absolute", left: `${t.frac * 100}%`, top: 0, transform: i === 0 ? "none" : "translateX(-50%)", fontSize: 9.5, color: MUTED, fontWeight: 600 }}>{t.label}</span>)}
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
            {years.map((t, i) => <div key={i} style={{ position: "absolute", left: `${t.frac * 100}%`, top: 20, width: 1, height: 6, background: FAINT }} />)}
            <div title={c.today} style={{ position: "absolute", left: `${todayFrac * 100}%`, top: 0, width: 1, height: 20, background: INK, opacity: .4 }} />
            <div
              role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={GROWTH_PHASES.length - 1} aria-valuenow={idx} aria-valuetext={current.label[l]}
              onKeyDown={(e) => { if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); } if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); } }}
              style={{ position: "absolute", left: `${pos * 100}%`, top: -3, transform: "translateX(-50%)", width: 4, height: 26, borderRadius: 2, background: ACCENT, boxShadow: `0 0 0 1.5px ${SURFACE}, 0 1px 3px rgba(44,23,22,.3)`, cursor: "grab", outlineOffset: 3 }}
            />
          </div>
        </div>

        {/* ── Les volumes, en regard des périodes ─────────────────────────── */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ ...smallCaps, marginBottom: 8 }}>{c.volumesTitle}</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${GROWTH_PHASES.length}, 1fr)`, gap: 8, alignItems: "end" }}>
            {GROWTH_PHASES.map((g, i) => {
              const active = i === idx;
              return (
                <button key={g.id} type="button" onClick={() => go(i)} aria-pressed={active} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 6, height: 110 }}>
                  <span style={{ fontFamily: SERIF, fontSize: active ? 18 : 14, color: active ? INK : MUTED, lineHeight: 1.15, transition: "font-size .2s ease" }}>{g.volume[l]}</span>
                  <span style={{ display: "block", width: "100%", height: `${Math.max(6, barH(g.volumeMEur) * 56)}px`, borderRadius: 4, background: active ? ACCENT : i < idx ? "#D9D2C2" : HAIRLINE, border: i > idx ? `1px dashed ${LINE}` : "none", transition: "background .2s ease" }} />
                  <span style={{ fontSize: 10.5, color: active ? INK : FAINT, fontWeight: active ? 600 : 400 }}>{g.label[l]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div ref={sentinelRef} aria-hidden style={{ height: 1 }} />

        {/* ── La période ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: SERIF, fontSize: 19, color: INK }}>{current.label[l]}</span>
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
        <div style={{ margin: "0 0 24px", padding: "18px 24px", borderRadius: 10, textAlign: "center", background: "#FDFAF4" }}>
          <p style={{ fontFamily: SERIF, fontSize: 18, lineHeight: 1.55, color: INK, margin: "0 auto", maxWidth: 780 }}>{current.tagline[l]}</p>
        </div>

        {/* ── Cette période : trois fils racontés ─────────────────────────── */}
        {!overview && (
          <div>
            {STREAMS.map((s, si) => {
              const ch = NARRATIVE[phase][s];
              return (
                <div key={s} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24, padding: "20px 0", borderTop: `1px solid ${si === 0 ? LINE : HAIRLINE}` }}>
                  <div>
                    <div style={{ fontFamily: SERIF, fontSize: 18, color: INK, lineHeight: 1.2 }}>{STREAM_META[s].label[l]}</div>
                    <div style={{ fontSize: 12, color: FAINT, marginTop: 4, lineHeight: 1.45 }}>{STREAM_META[s].sub[l]}</div>
                    {draft && ch.aConfirmer && <div style={{ marginTop: 8, display: "inline-block", fontSize: 10.5, padding: "2px 8px", borderRadius: 999, border: "1px dashed #C9C1B3", color: MUTED }}>{c.toConfirm}</div>}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: "#4B4039", maxWidth: 760 }}>{rich(ch.text[l])}</p>
                    {ch.levers && ch.levers.length > 0 && leverCards(ch.levers)}
                    {/* Graphique de convergence, en rail : un tombant sous
                        chaque carte, un collecteur horizontal, une descente
                        orangée vers le nœud central. */}
                    {ch.hub && (
                      <div>
                        <div aria-hidden style={{ position: "relative", height: 36 }}>
                          {[12.5, 37.5, 62.5, 87.5].map((x) => (
                            <span key={x} style={{ position: "absolute", left: `${x}%`, top: 0, width: 1, height: 13, background: "#D9D2C2" }} />
                          ))}
                          <span style={{ position: "absolute", left: "12.5%", right: "12.5%", top: 13, height: 1, background: "#D9D2C2" }} />
                          <span style={{ position: "absolute", left: "50%", top: 13, width: 2, height: 23, marginLeft: -1, background: ACCENT }} />
                        </div>
                        <div style={{ margin: "0 auto", maxWidth: 380, borderRadius: 12, borderTop: `3px solid ${ACCENT}`, background: INK, color: "#fff", textAlign: "center", padding: "14px 18px" }}>
                          <div style={{ fontFamily: SERIF, fontSize: 16 }}>{ch.hub.title[l]}</div>
                          <div style={{ fontSize: 11.5, marginTop: 3, color: "rgba(255,255,255,0.75)" }}>{ch.hub.sub[l]}</div>
                        </div>
                      </div>
                    )}
                    {/* Graphique de scission : la position se découpe en
                        deux jambes, qui se rejoignent sur le marché
                        secondaire. Même grammaire de rail que le hub. */}
                    {ch.split && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ margin: "0 auto", maxWidth: 320, borderRadius: 12, borderTop: `3px solid ${ACCENT}`, background: INK, color: "#fff", textAlign: "center", padding: "12px 16px", fontFamily: SERIF, fontSize: 15 }}>
                          {ch.split.source[l]}
                        </div>
                        <div aria-hidden style={{ position: "relative", height: 30 }}>
                          <span style={{ position: "absolute", left: "50%", top: 0, width: 1, height: 10, background: "#D9D2C2" }} />
                          <span style={{ position: "absolute", left: "25%", right: "25%", top: 10, height: 1, background: "#D9D2C2" }} />
                          {[25, 75].map((x) => (
                            <span key={x} style={{ position: "absolute", left: `${x}%`, top: 10, width: 1, height: 20, background: "#D9D2C2" }} />
                          ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                          {ch.split.parts.map((part) => (
                            <div key={part.en} style={{ justifySelf: "center", border: `1px solid ${LINE}`, borderRadius: 10, background: SURFACE, padding: "9px 22px", fontFamily: SERIF, fontSize: 15, color: INK }}>
                              {part[l]}
                            </div>
                          ))}
                        </div>
                        <div aria-hidden style={{ position: "relative", height: 30 }}>
                          {[25, 75].map((x) => (
                            <span key={x} style={{ position: "absolute", left: `${x}%`, top: 0, width: 1, height: 10, background: "#D9D2C2" }} />
                          ))}
                          <span style={{ position: "absolute", left: "25%", right: "25%", top: 10, height: 1, background: "#D9D2C2" }} />
                          <span style={{ position: "absolute", left: "50%", top: 10, width: 2, height: 20, marginLeft: -1, background: ACCENT }} />
                        </div>
                        <div style={{ border: `1px dashed ${ACCENT}`, borderRadius: 12, background: "#FFFBF6", padding: "14px 18px", textAlign: "center" }}>
                          <div style={{ fontFamily: SERIF, fontSize: 16, color: INK }}>{ch.split.market.title[l]}</div>
                          <div style={{ fontSize: 12.5, color: MUTED, marginTop: 3 }}>{ch.split.market.sub[l]}</div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                          {ch.split.badges.map((b) => (
                            <span key={b.en} style={{ border: `1px solid ${LINE}`, borderRadius: 8, background: SURFACE, padding: "5px 12px", fontSize: 12, color: INK }}>
                              {b[l]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {ch.panel && liquidityPanel(ch.panel)}
                    {/* La grille d'acteurs s'efface sur un bloc à encart, sauf
                        demande explicite (showActors). */}
                    {(ch.showActors ?? !ch.panel) && actorGrid(s)}
                    {ch.offerings && ch.offerings.length > 0 && offeringCards(ch.offerings)}
                    {ch.companies && ch.companies.length > 0 && companyCards(ch.companies)}
                    {ch.footnote && <p style={{ margin: "14px 0 0", fontSize: 12.5, lineHeight: 1.6, color: MUTED, fontStyle: "italic", maxWidth: 760 }}>{ch.footnote[l]}</p>}
                    {ch.photos && ch.photos.length > 0 && photoStrip(ch.photos)}
                    {ch.photoGroups?.map((grp) => (
                      <div key={grp.title[l]} style={{ marginTop: 20 }}>
                        <div style={{ ...smallCaps, color: MUTED, paddingBottom: 6, borderBottom: `1px solid ${HAIRLINE}` }}>{grp.title[l]}</div>
                        {photoStrip(grp.photos)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Vue d'ensemble : trois fils × cinq périodes, une phrase par case ── */}
        {overview && (
          <div style={{ overflowX: "auto", margin: "0 -4px", padding: 4 }}>
            <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${GROWTH_PHASES.length}, minmax(190px, 1fr))`, minWidth: 140 + 190 * GROWTH_PHASES.length }}>
              <div style={{ borderBottom: `2px solid ${LINE}` }} />
              {GROWTH_PHASES.map((g, i) => (
                <button key={g.id} type="button" onClick={() => go(i)} aria-pressed={i === idx} style={{ background: "transparent", border: "none", borderLeft: `1px solid ${HAIRLINE}`, borderBottom: `2px solid ${i === idx ? ACCENT : LINE}`, padding: "4px 10px 8px", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ display: "block", fontSize: 12.5, fontWeight: i === idx ? 600 : 500, color: i === idx ? INK : MUTED }}>{g.label[l]}</span>
                  <span style={{ display: "block", fontFamily: SERIF, fontSize: 13, color: i === idx ? INK : FAINT, marginTop: 2 }}>{g.volume[l]}</span>
                </button>
              ))}
              {STREAMS.map((s, si) => (
                <div key={s} style={{ display: "contents" }}>
                  <div style={{ padding: "12px 12px 12px 0", borderBottom: si === STREAMS.length - 1 ? "none" : `1px solid ${HAIRLINE}`, position: "sticky", left: 0, background: SURFACE, zIndex: 2 }}>
                    <div style={{ fontFamily: SERIF, fontSize: 15, color: INK }}>{STREAM_META[s].label[l]}</div>
                  </div>
                  {GROWTH_PHASES.map((g, i) => (
                    <div key={`${s}-${g.id}`} style={{ background: i === idx ? "#FCFBF7" : "transparent", borderLeft: `1px solid ${HAIRLINE}`, borderBottom: si === STREAMS.length - 1 ? "none" : `1px solid ${HAIRLINE}`, padding: "12px 10px", fontSize: 12.5, lineHeight: 1.6, color: "#4B4039" }}>
                      {rich((NARRATIVE[g.id][s].summary ?? NARRATIVE[g.id][s].text)[l])}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <p style={{ marginTop: 28, fontSize: 12, color: FAINT }}>{c.footer}</p>
    </div>
  );
}


// Une ligne d'acteur : logo local s'il existe, sinon une pastille typographique.
// Un acteur « nouveau sur cette période » porte un point orange.
function ActorRow({ a, lang, isNew, newLabel, toConfirm }: { a: Actor; lang: Lang; isNew: boolean; newLabel: string; toConfirm: string | null }) {
  const [broken, setBroken] = useLocalState(false);
  const showLogo = a.logo && !broken;
  const inner = (
    <>
      <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", background: showLogo ? SURFACE : HAIRLINE, border: `1px solid ${LINE}`, overflow: "hidden" }}>
        {showLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.logo} alt="" onError={() => setBroken(true)} style={{ width: 16, height: 16, objectFit: "contain", display: "block" }} />
        ) : (
          <span style={{ fontFamily: SERIF, fontSize: 11, color: a.named === false ? FAINT : INK }}>{a.named === false ? "·" : a.name[lang].slice(0, 1)}</span>
        )}
      </span>
      <span style={{ fontSize: 12.5, lineHeight: 1.35, color: a.named === false ? MUTED : INK, fontStyle: a.named === false ? "italic" : "normal" }}>
        {a.name[lang]}
        {isNew && <span title={newLabel} style={{ color: ACCENT, marginLeft: 6 }}>●</span>}
        {toConfirm && a.aConfirmer && <span style={{ marginLeft: 6, fontSize: 10, color: FAINT }}>({toConfirm})</span>}
      </span>
    </>
  );
  const style: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, textDecoration: "none" };
  return a.url ? <a href={a.url} target="_blank" rel="noreferrer noopener" style={style}>{inner}</a> : <div style={style}>{inner}</div>;
}
