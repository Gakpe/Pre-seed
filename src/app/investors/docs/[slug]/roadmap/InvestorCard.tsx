"use client";

// Carte légère d'un objectif, telle que vue par un investisseur : titre, statut,
// trimestre, ce que c'est, pourquoi c'est important, capacité, partenaire si public.
// Utilisée par la vue investisseurs et par l'« aperçu investisseur » de la vue équipe —
// même composant, mêmes champs : rien d'interne ne peut y fuir.

import { partnersByIds, type Partner } from "@/lib/roadmap/partners";
import type { Phase, PublicObjective } from "@/lib/roadmap/types";
import { STATUS_STYLE, type RoadmapLabels } from "@/lib/roadmap/labels";
import { PartnerLogo } from "./PartnerLogo";

const INK = "#2C1716";
const MUTED = "#766962";
const FAINT = "#A39A8E";
const LINE = "#E6E1D4";

/**
 * Les tiers sur lesquels l'objectif s'appuie : logo, ce que c'est en une ligne, et le
 * lien vers leur site. On ne demande pas à l'investisseur de savoir ce qu'est Canton
 * Network — la carte le lui dit, et lui laisse aller vérifier.
 * Sans URL renseignée (`partners.ts`), la vignette s'affiche sans lien.
 */
function PartnerChips({ partners, label, linkLabel, lang }: { partners: Partner[]; label: string; linkLabel: string; lang: "fr" | "en" }) {
  const base: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: 6,
    border: `1px solid ${LINE}`, borderRadius: 10, padding: "11px 12px",
    background: "#FFFFFE", textDecoration: "none", height: "100%", boxSizing: "border-box",
    transition: "border-color .2s ease, box-shadow .2s ease",
  };

  return (
    <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${LINE}` }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: FAINT, marginBottom: 9 }}>{label}</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 9 }}>
        {partners.map((p) => {
          const inner = (
            <>
              <span style={{ display: "flex", alignItems: "center", minHeight: 20 }}>
                <PartnerLogo p={p} height={18} maxWidth={116} />
              </span>
              <span style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.45 }}>{p.role[lang]}</span>
              {p.url && (
                <span style={{ fontSize: 10.5, color: INK, opacity: 0.7 }}>{p.url.replace(/^https?:\/\/(www\.)?/, "")} ↗</span>
              )}
            </>
          );
          return (
            <li key={p.id} style={{ display: "flex" }}>
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${p.nom} — ${linkLabel}`}
                  style={{ ...base, width: "100%" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D9D2C2"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(44,23,22,.07)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = LINE; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {inner}
                </a>
              ) : (
                <div style={{ ...base, width: "100%" }}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function InvestorCardBody({
  objectif, phase, labels, t, lang = "fr",
}: {
  objectif: PublicObjective;
  phase: Phase;
  labels: RoadmapLabels;
  t: { quarter: string; moteur: string; what: string; why: string; capacity: string; partner: string; partnerLink: string };
  lang?: "fr" | "en";
}) {
  const status = objectif.statutsParPhase[phase];
  const st = STATUS_STYLE[status];
  const b = objectif.briefInvestisseur;
  // Les identifiants sont déjà filtrés par la projection publique ; `true` ici est une
  // seconde barrière, pas la première — un partenaire non signé ne passe jamais.
  const partners = partnersByIds(objectif.partenaires, true);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, color: INK }}>{objectif.titre}</span>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
          {labels.statuses[status]}
        </span>
      </div>
      <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 10, columnGap: 16, fontSize: 13.5 }}>
        <dt style={{ color: FAINT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 2 }}>{t.quarter}</dt>
        <dd style={{ margin: 0, color: INK }}>{labels.phases[objectif.livreEn]}</dd>
        <dt style={{ color: FAINT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 2 }}>{t.moteur}</dt>
        <dd style={{ margin: 0, color: INK }}>{labels.moteurs[objectif.moteur]}</dd>
        <dt style={{ color: FAINT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 2 }}>{t.what}</dt>
        <dd style={{ margin: 0, color: INK, lineHeight: 1.5 }}>{b.quoi}</dd>
        <dt style={{ color: FAINT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 2 }}>{t.why}</dt>
        <dd style={{ margin: 0, color: MUTED, lineHeight: 1.5 }}>{b.pourquoi}</dd>
        <dt style={{ color: FAINT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 2 }}>{t.capacity}</dt>
        <dd style={{ margin: 0, color: INK, lineHeight: 1.5 }}>{b.capacite}</dd>
        {/* Texte libre conservé pour un tiers qui n'est pas (encore) dans `partners.ts`. */}
        {b.partenaire && partners.length === 0 && (
          <>
            <dt style={{ color: FAINT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 2 }}>{t.partner}</dt>
            <dd style={{ margin: 0, color: INK }}>{b.partenaire}</dd>
          </>
        )}
      </dl>
      {partners.length > 0 && (
        <PartnerChips partners={partners} label={t.partner} linkLabel={t.partnerLink} lang={lang} />
      )}
    </div>
  );
}

export function InvestorCardModal({
  objectif, phase, labels, t, onClose, lang = "fr", extra,
}: {
  objectif: PublicObjective;
  phase: Phase;
  labels: RoadmapLabels;
  t: { quarter: string; moteur: string; what: string; why: string; capacity: string; partner: string; partnerLink: string; close: string };
  onClose: () => void;
  lang?: "fr" | "en";
  /** Bloc supplémentaire sous la carte (éditeur d'état réservé à Julien). */
  extra?: React.ReactNode;
}) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(44,23,22,.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFFFFE", borderRadius: 16, width: "100%", maxWidth: 560, padding: "26px 28px 22px", boxShadow: "0 8px 40px rgba(44,23,22,.18)" }}>
        <InvestorCardBody objectif={objectif} phase={phase} labels={labels} t={t} lang={lang} />
        {extra}
        <div style={{ marginTop: 22, paddingTop: 14, borderTop: `1px solid ${LINE}`, textAlign: "right" }}>
          <button type="button" onClick={onClose} style={{ background: "none", border: `1px solid ${LINE}`, borderRadius: 8, padding: "7px 14px", fontSize: 12.5, color: MUTED, cursor: "pointer" }}>
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
