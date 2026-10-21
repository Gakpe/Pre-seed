"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ACTORS, BUILDUP, CARDS, CATEGORIES, CATEGORY_LABEL, CIRCLES_PATH, ECO_TODAY, FOUNDERS_INTRO, GROWTH_PHASES, NARRATIVE, STREAMS, STREAM_META, type Actor, type Company, type EventCard, type GrowthPhase, type Layer, type Bridge, type Lever, type Offering, type Panel, type Partner, type Photo, type Stream } from "@/lib/ecosystem/seed";
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
  // Le détail est ouvert pour une phase donnée : il se referme dès qu'on passe à une autre étape.
  const [detailFor, setDetailFor] = useState<GrowthPhase | null>(null);
  const detail = detailFor === phase;
  const idx = phaseIdx(phase);
  const current = GROWTH_PHASES[idx];
  // Le bandeau collant n'apparaît qu'une fois les volumes sortis de l'écran :
  // tant qu'ils sont visibles, il ferait doublon. Une sentinelle sous les
  // barres, observée ; quand elle passe au-dessus de la fenêtre, on affiche.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [pastVolumes, setPastVolumes] = useState(false);
  // Le bandeau se cale sous l'en-tête collant du site : posé à top 0, il
  // passait dessous et restait invisible.
  const [headerH, setHeaderH] = useState(0);
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => setHeaderH(header.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPastVolumes(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const todayIdx = Math.max(0, GROWTH_PHASES.findIndex((g) => g.start <= ECO_TODAY && ECO_TODAY <= g.end));

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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))", gap: "10px 18px" }}>
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
    <div className="eco-photos" style={{ display: "grid", gap: 10, marginTop: 14 }}>
      {photos.map((p) => (
        <figure key={p.src} style={{ margin: 0 }}>
          <div style={{ aspectRatio: "16 / 10", overflow: "hidden", borderRadius: 10, background: HAIRLINE }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.t[l]} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos ?? "center", display: "block" }} />
          </div>
          <figcaption style={{ marginTop: 6, fontSize: 11.5, lineHeight: 1.45, color: MUTED }}>
            {p.href ? (
              <a href={p.href} target="_blank" rel="noopener noreferrer" style={{ color: INK, fontWeight: 600, textDecoration: "underline", textDecorationColor: LINE, textUnderlineOffset: 3 }}>{p.t[l]}</a>
            ) : (
              <span style={{ color: INK, fontWeight: 600 }}>{p.t[l]}</span>
            )}
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
      {pt.people?.map((pe) => {
        const inner = (
          <>
            {pe.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pe.photo} alt="" style={{ width: 28, height: 28, borderRadius: 999, objectFit: "cover", border: `1px solid ${LINE}`, display: "block" }} />
            )}
            <span><span style={{ color: INK, fontWeight: 600 }}>{pe.name}</span> {pe.role[l]}</span>
          </>
        );
        const style: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: MUTED, textDecoration: "none" };
        // Portrait et titre mènent au profil LinkedIn.
        return pe.href ? (
          <a key={pe.name} href={pe.href} target="_blank" rel="noopener noreferrer" aria-label={`${pe.name}, LinkedIn`} style={style}>{inner}</a>
        ) : (
          <span key={pe.name} style={style}>{inner}</span>
        );
      })}
    </div>
  );

  // La thèse de gestion du risque : intitulé explicite, puis les niveaux de
  // protection numérotés (numéro orangé, intitulé en encre, précision en gris).
  const riskLayers = (layers: Layer[]) => (
    <div style={{ marginTop: 16, borderTop: `1px solid ${HAIRLINE}`, paddingTop: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{l === "fr" ? "La thèse de gestion du risque" : "The risk management thesis"}</div>
      <p style={{ margin: "4px 0 10px", fontSize: 12.5, color: "#4B4039" }}>
        {l === "fr" ? "Nos souscripteurs sont toujours en dette senior, protégés par cinq niveaux :" : "Our subscribers are always senior debt, protected by five layers:"}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))", gap: "8px 24px" }}>
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

  // Pont de volume en cascade : une base, des étapes qui s'empilent, une cible.
  // Même grammaire que les cartes de la page (bordure LINE, fond SURFACE, chiffres
  // en serif), orange pour les étapes, encre pour la cible. Défile à l'horizontale
  // sur petit écran plutôt que d'écraser les barres.
  const bridgeChart = (b: Bridge) => {
    const H = 210, GAPW = 10, n = b.steps.length;
    const max = Math.max(...b.steps.map((st) => st.value)), k = H / max;
    const nb = "\u00a0";
    const money = (v: number, kind: "base" | "step" | "total") => {
      const big = v >= 1000;
      const num = big ? String(v / 1000) : String(v);
      if (l === "fr") return `${kind === "step" ? "+" : ""}${num}${nb}${big ? "Md€" : "M€"}`;
      return `${kind === "step" ? "+" : ""}€${num}${big ? "B" : "M"}`;
    };
    let cum = 0;
    const cols = b.steps.map((st) => {
      const from = st.kind === "step" ? cum : 0;
      cum = st.kind === "step" ? cum + st.value : st.kind === "base" ? st.value : cum;
      return { st, from, to: from + st.value };
    });
    const aria = b.steps.map((st) => `${st.label[l]} ${money(st.value, st.kind)}`).join(", ");
    const fill = (kind: "base" | "step" | "total") => (kind === "step" ? ACCENT : kind === "total" ? INK : "#D9D2C2");
    return (
      <div style={{ marginTop: 16, border: `1px solid ${LINE}`, borderRadius: 12, padding: "16px 18px 18px", background: SURFACE }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "8px 16px" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{b.title[l]}</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginTop: 3 }}>{b.sub[l]}</div>
          </div>
          {b.tag && <span style={{ border: `1px dashed ${ACCENT}`, borderRadius: 8, background: "#FFFBF6", padding: "3px 10px", fontSize: 11.5, color: ACCENT_TEXT, whiteSpace: "nowrap" }}>{b.tag[l]}</span>}
        </div>
        <div style={{ fontSize: 12, color: FAINT, marginTop: 12 }}>{b.unit[l]}</div>
        <div style={{ overflowX: "auto" }}>
          <div role="img" aria-label={aria} style={{ minWidth: 560, marginTop: 6 }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, columnGap: GAPW, borderBottom: `1px solid ${LINE}` }}>
              {cols.map(({ st, from, to }, i) => (
                <div key={st.label.en} style={{ position: "relative", height: H + 30 }}>
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: to * k + 6, textAlign: "center", fontFamily: SERIF, fontSize: 15, color: st.kind === "step" ? ACCENT_TEXT : INK, whiteSpace: "nowrap" }}>{money(st.value, st.kind)}</div>
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: from * k, height: st.value * k, background: fill(st.kind), borderRadius: 4 }} />
                  {i < n - 2 && <span aria-hidden style={{ position: "absolute", left: "100%", width: GAPW, bottom: to * k, borderTop: "1px dashed #C9C1B3" }} />}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, columnGap: GAPW, marginTop: 8 }}>
              {cols.map(({ st }) => (
                <div key={st.label.en} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: INK, lineHeight: 1.3 }}>{st.label[l]}</div>
                  {st.note && <div style={{ fontSize: 11.5, color: MUTED, marginTop: 3, lineHeight: 1.4 }}>{st.note[l]}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Vue cumulative : pour le capital et pour les sous-jacents, un bloc par période
  // déjà atteinte, empilés dans l'ordre. Celui de la période affichée est mis en
  // avant (fond ivoire, bordure orange) ; les précédents restent lisibles, plus
  // discrets. À la dernière période, la carte est complète.
  const buildUp = (ph: GrowthPhase) => {
    const upTo = phaseIdx(ph);
    return (
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: 10 }}>{c.buildTitle}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 14 }}>
          {(["distribution", "sous_jacents"] as const).map((side) => {
            const total = GROWTH_PHASES.slice(0, upTo + 1).reduce((a, g) => a + BUILDUP[side][g.id].length, 0);
            const added = BUILDUP[side][ph].length;
            return (
              <div key={side} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px 16px", background: SURFACE }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "2px 12px", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{STREAM_META[side].label[l]}</span>
                  <span style={{ fontSize: 12, color: ACCENT_TEXT }}>{c.buildAdded.replace("{n}", String(added)).replace("{t}", String(total))}</span>
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {GROWTH_PHASES.slice(0, upTo + 1).map((g) => {
                    const now = g.id === ph;
                    return (
                      <div key={g.id} style={{ borderRadius: 10, padding: "10px 12px", border: now ? `1px solid ${ACCENT}` : `1px solid ${HAIRLINE}`, background: now ? "#FFFBF6" : "#FBFAF6" }}>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: now ? INK : MUTED }}>{g.label[l]}</span>
                          <span style={{ fontSize: 11.5, color: now ? ACCENT_TEXT : FAINT }}>{now ? c.newHere : c.buildSince}</span>
                        </div>
                        <ul style={{ listStyle: "none", margin: "6px 0 0", padding: 0, display: "grid", gap: 4 }}>
                          {BUILDUP[side][g.id].map((it) => (
                            <li key={it.en} style={{ display: "flex", gap: 8, fontSize: 12.5, lineHeight: 1.45, color: now ? "#4B4039" : MUTED }}>
                              <span aria-hidden style={{ flex: "none", width: 5, height: 5, borderRadius: 999, background: now ? ACCENT : "#C9C1B3", marginTop: 6 }} />
                              {it[l]}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Stratégie à venir, en carte « offre » : badge d'ouverture, descriptif et
  // une ligne de métriques jointives (rendement, ticket, allocation, durée).
  const offeringCards = (offerings: Offering[], compact = false) => (
    <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
      {offerings.map((o) => (
        <div key={o.name.en} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "16px 18px", background: SURFACE }}>
          {!compact && o.partner && partnerHeader(o.partner)}
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
          {!compact && o.subtitle && <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "#4B4039", lineHeight: 1.7 }}>{rich(o.subtitle[l])}</p>}
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(130px, 100%), 1fr))", gap: 1, background: LINE, border: `1px solid ${LINE}`, borderRadius: 10, overflow: "hidden" }}>
            {o.metrics.map((m, i) => (
              <div key={i} style={{ background: m.accent ? ACCENT : SURFACE, padding: "10px 12px" }}>
                <div style={{ ...smallCaps, color: m.accent ? "rgba(255,255,255,0.92)" : FAINT }}>{m.k[l]}</div>
                <div style={{ fontFamily: SERIF, fontSize: 17, marginTop: 4, color: m.accent ? "#fff" : INK }}>{m.v[l]}</div>
              </div>
            ))}
          </div>
          {o.layers && o.layers.length > 0 && riskLayers(o.layers)}
          {!compact && o.companies && companyCards(o.companies.list, o.companies.title[l])}
          {!compact && o.note && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: MUTED, fontStyle: "italic" }}>{o.note[l]}</p>}
        </div>
      ))}
    </div>
  );

  // Scale-ups et opérateurs : cartes à chiffres clés, même grammaire que le
  // reste des sous-jacents (carte encadrée, nom en serif, puces orangées).
  const companyCards = (companies: Company[], title?: string) => (
    <div style={{ marginTop: 18 }}>
      <div style={{ ...smallCaps, color: MUTED, marginBottom: 10 }}>{title ?? (l === "fr" ? "Scale-ups et opérateurs" : "Scale-ups & operators")}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(190px, 100%), 1fr))", gap: 10 }}>
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

  // Évolution des Minah Circles : une étape par phase. Les étapes passées sont
  // acquises (point plein), l'étape en cours est encadrée en orange, les
  // suivantes restent en pointillés.
  const circlesLadder = (active: GrowthPhase) => {
    const activeAt = CIRCLES_PATH.steps.findIndex((st) => st.phase === active);
    return (
      <div style={{ marginTop: 18 }}>
        <div style={{ ...smallCaps, color: MUTED, marginBottom: 10 }}>{CIRCLES_PATH.title[l]}</div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(190px, 100%), 1fr))", gap: 10 }}>
          {CIRCLES_PATH.steps.map((st, i) => {
            const state = i < activeAt ? "past" : i === activeAt ? "now" : "next";
            const phaseLabel = GROWTH_PHASES.find((g) => g.id === st.phase)!.label[l];
            return (
              <li key={st.phase} aria-current={state === "now" ? "step" : undefined} style={{ position: "relative", border: state === "now" ? `1.5px solid ${ACCENT}` : state === "next" ? `1px dashed ${LINE}` : `1px solid ${LINE}`, borderRadius: 12, padding: "12px 14px 14px", background: state === "now" ? "#FFFBF6" : SURFACE, opacity: state === "next" ? 0.75 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span aria-hidden style={{ width: 9, height: 9, borderRadius: 999, flexShrink: 0, background: state === "next" ? "transparent" : ACCENT, border: `1.5px solid ${state === "next" ? FAINT : ACCENT}` }} />
                  <span style={{ ...smallCaps, color: state === "now" ? ACCENT_TEXT : MUTED }}>{phaseLabel}</span>
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 15, color: INK, lineHeight: 1.25 }}>{st.title[l]}</div>
                <p style={{ margin: "6px 0 0", fontSize: 12.5, lineHeight: 1.55, color: "#4B4039" }}>{st.sub[l]}</p>
              </li>
            );
          })}
        </ol>
      </div>
    );
  };

  // Événements clés : logo (quand on l'a), nom (lien vers le site), lieu et
  // dates en tête, puis une phrase.
  // Fiche de stratégie, dans la même grammaire que les cartes de leviers : nom et
  // intitulé en tête, montant en serif orangé, quelques lignes clé/valeur, puis les
  // couches de protection quand il y en a. Le statut garde sa pastille, en casse normale.
  const KEEP_UPPER = new Set(["TLG", "ISIN", "DFI", "API", "UEMOA", "WAEMU"]);
  const sentence = (t: string) => {
    const x = t.split(" ").map((w) => (/[A-ZÀ-Ý]{2,}/.test(w) && w === w.toUpperCase() && !KEEP_UPPER.has(w) ? w.toLowerCase() : w)).join(" ");
    return x.charAt(0).toUpperCase() + x.slice(1);
  };
  const strategyCards = (offerings: Offering[]) => (
    <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 10 }}>
      {offerings.map((o) => {
        const hero = o.metrics.find((m) => m.accent) ?? o.metrics[0];
        const rest = o.metrics.filter((m) => m !== hero);
        return (
          <div key={o.name.en} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px", background: SURFACE }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{o.name[l]}</div>
                {o.tag && <div style={{ fontSize: 12, color: FAINT, marginTop: 2 }}>{o.tag[l]}</div>}
              </div>
              {o.status && <span style={{ flex: "none", border: `1px solid ${ACCENT}`, borderRadius: 999, padding: "2px 10px", fontSize: 11.5, color: ACCENT_TEXT }}>{sentence(o.status[l])}</span>}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 20, color: ACCENT_TEXT, margin: "8px 0 6px", lineHeight: 1.15 }}>{hero.v[l]}</div>
            {o.logos && (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 14px", margin: "0 0 8px" }}>
                {o.logos.map((lg) => (
                  <span key={lg.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={lg.src} alt="" style={{ height: 16, width: "auto", maxWidth: 70, objectFit: "contain", display: "block" }} />
                    {lg.name}
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: "grid", gap: 0 }}>
              {rest.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "5px 0", borderTop: `1px solid ${HAIRLINE}`, fontSize: 12.5 }}>
                  <span style={{ color: MUTED }}>{m.k[l]}</span>
                  <span style={{ color: INK, fontWeight: 600, textAlign: "right" }}>{m.v[l]}</span>
                </div>
              ))}
            </div>
            {o.layers && o.layers.length > 0 && riskLayers(o.layers)}
            {o.note && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: MUTED }}>{o.note[l]}</p>}
          </div>
        );
      })}
    </div>
  );

  const eventCards = (ev: { title: { fr: string; en: string }; list: EventCard[] }) => (
    <div style={{ marginTop: 18 }}>
      <div style={{ ...smallCaps, color: MUTED, marginBottom: 10 }}>{ev.title[l]}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))", gap: 10 }}>
        {ev.list.map((e) => (
          <div key={e.name.en} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px", background: SURFACE }}>
            {e.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.logo} alt="" style={{ height: 22, width: "auto", maxWidth: 110, objectFit: "contain", objectPosition: "left", display: "block", marginBottom: 10 }} />
            )}
            <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>
              {e.href ? (
                <a href={e.href} target="_blank" rel="noopener noreferrer" style={{ color: INK, textDecoration: "underline", textDecorationColor: LINE, textUnderlineOffset: 3 }}>{e.name[l]}</a>
              ) : (
                e.name[l]
              )}
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: ACCENT_TEXT, margin: "4px 0 8px", lineHeight: 1.4 }}>{e.where[l]}</div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "#4B4039" }}>{e.text[l]}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Leviers de la machine réseau : cartes avec intitulé, chiffre-phare et une
  // phrase. Une vraie mise en page du récit, pas un bloc de texte.
  const leverCards = (levers: Lever[]) => (
    <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))", gap: 10 }}>
      {levers.map((lv, i) => (
        <div key={i} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px", background: SURFACE }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{lv.title[l]}</div>
          <div style={{ fontFamily: SERIF, fontSize: 20, color: ACCENT_TEXT, margin: "6px 0 8px", lineHeight: 1.15 }}>{lv.metric[l]}</div>
          {lv.logos && (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 14px", margin: "0 0 8px" }}>
              {lv.logos.map((lg) => (
                <span key={lg.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={lg.src} alt="" style={{ height: 16, width: "auto", maxWidth: 80, objectFit: "contain", display: "block" }} />
                  {lg.name}
                </span>
              ))}
            </div>
          )}
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
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 10 }}>
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
      {/* ── Sélecteur de période fixe : au défilement, on garde sous les yeux
          la période affichée, et l'on en change sans remonter. Il n'apparaît
          qu'une fois les volumes sortis de l'écran. ── */}
      <div
        data-eco-period-bar
        aria-hidden={!pastVolumes}
        style={{
          position: "fixed", top: headerH, left: 0, right: 0, zIndex: 29,
          padding: "8px 0", background: "rgba(246,244,239,.92)", backdropFilter: "blur(6px)",
          borderBottom: `1px solid ${HAIRLINE}`,
          transform: pastVolumes ? "translateY(0)" : "translateY(-120%)", opacity: pastVolumes ? 1 : 0,
          transition: "transform .25s ease, opacity .25s ease", pointerEvents: pastVolumes ? "auto" : "none",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div role="group" aria-label={c.stickyShown} style={{ display: "grid", gridTemplateColumns: `repeat(${GROWTH_PHASES.length}, minmax(0, 1fr))`, gap: 6, flex: "1 1 520px" }}>
            {GROWTH_PHASES.map((g, i) => {
              const active = i === idx;
              return (
                <button
                  key={g.id}
                  type="button"
                  tabIndex={pastVolumes ? 0 : -1}
                  onClick={() => go(i)}
                  aria-pressed={active}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, minWidth: 0,
                    padding: "6px clamp(6px, 1.6vw, 10px)", borderRadius: 8, cursor: "pointer", textAlign: "left",
                    border: `1px solid ${active ? ACCENT : LINE}`,
                    background: active ? ACCENT : i < idx ? "#EFEADE" : SURFACE,
                    color: active ? "#fff" : INK, transition: "background .2s ease, border-color .2s ease",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "clamp(10.5px, 2.9vw, 12px)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                    {g.label[l]}
                    {i === todayIdx && <span title={c.stickyToday} style={{ width: 6, height: 6, borderRadius: 3, flexShrink: 0, background: active ? "#fff" : ACCENT }} />}
                  </span>
                  <span style={{ fontSize: "clamp(10px, 2.7vw, 11px)", opacity: active ? 0.85 : 1, color: active ? "#fff" : MUTED, whiteSpace: "nowrap" }}>{g.volume[l]}</span>
                </button>
              );
            })}
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: MUTED, whiteSpace: "nowrap" }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: ACCENT }} />
            {c.stickyToday}
          </span>
        </div>
      </div>

      <section className="eco-card" style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 16 }}>
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

        {/* ── Cette période : équipe, trois cartes, pont, puis le détail à la demande ── */}
        {!overview && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{c.teamLabel}</span>
              <span aria-hidden style={{ display: "inline-flex", gap: 4 }}>
                {Array.from({ length: 2 + current.team.resources }, (_, k) => (
                  <span key={k} style={{ width: 14, height: 14, borderRadius: 999, background: k < 2 ? "#C9C1B3" : ACCENT }} />
                ))}
              </span>
              <span style={{ fontSize: 13, color: MUTED }}>{current.team.label[l]}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 14 }}>
              {STREAMS.map((s) => {
                const cd = CARDS[phase][s];
                return (
                  <div key={s} style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: "16px 18px", background: SURFACE }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{STREAM_META[s].label[l]}</div>
                    <div style={{ fontFamily: SERIF, fontSize: 30, lineHeight: 1.1, color: ACCENT_TEXT, margin: "12px 0 4px" }}>{cd.hero[l]}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.5, color: MUTED }}>{cd.caption[l]}</div>
                    <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0, display: "grid", gap: 6 }}>
                      {cd.points.map((pt) => (
                        <li key={pt.en} style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: 1.45, color: "#4B4039" }}>
                          <span aria-hidden style={{ flex: "none", width: 5, height: 5, borderRadius: 999, background: ACCENT, marginTop: 7 }} />
                          {pt[l]}
                        </li>
                      ))}
                    </ul>
                    {cd.logos && (
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 14px", marginTop: 12 }}>
                        {cd.logos.map((lg) => (
                          <span key={lg.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={lg.src} alt="" style={{ height: 16, width: "auto", maxWidth: 70, objectFit: "contain", display: "block" }} />
                            {lg.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {buildUp(phase)}
            {NARRATIVE[phase].distribution.bridge && bridgeChart(NARRATIVE[phase].distribution.bridge!)}
            <button type="button" onClick={() => setDetailFor(detail ? null : phase)} aria-expanded={detail} style={{ marginTop: 18, padding: "8px 16px", borderRadius: 8, border: `1px solid ${LINE}`, background: SURFACE, cursor: "pointer", fontSize: 13, color: INK }}>
              {detail ? c.hideDetail : c.showDetail}
            </button>
          </div>
        )}

        {/* ── Le détail : un court paragraphe par fil, puis ses cartes ─────── */}
        {!overview && detail && (
          <div style={{ marginTop: 18 }}>
            {STREAMS.map((s) => {
              const ch = NARRATIVE[phase][s];
              return (
                <div key={s} style={{ padding: "18px 0", borderTop: `1px solid ${HAIRLINE}` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{STREAM_META[s].label[l]}</div>
                  {!(ch.levers?.length || ch.offerings?.length) && <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.7, color: "#4B4039", maxWidth: 760 }}>{rich((ch.summary ?? ch.text)[l])}</p>}
                  {ch.ladder && circlesLadder(ch.ladder)}
                  {ch.levers && ch.levers.length > 0 && leverCards(ch.levers)}
                  {ch.offerings && ch.offerings.length > 0 && strategyCards(ch.offerings)}
                  {ch.events && eventCards(ch.events)}
                  {ch.photos && ch.photos.length > 0 && photoStrip(ch.photos)}
                  {ch.photoGroups?.map((grp) => (
                    <div key={grp.title[l]} style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: MUTED }}>{grp.title[l]}</div>
                      {photoStrip(grp.photos)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Vue d'ensemble : trois fils × cinq périodes, une phrase par case ── */}
        {overview && (
          <div style={{ overflowX: "auto", margin: "0 -4px", padding: 4 }}>
            <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${GROWTH_PHASES.length}, minmax(min(190px, 100%), 1fr))`, minWidth: 140 + 190 * GROWTH_PHASES.length }}>
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
