"use client";

// Bandeau écosystème : les partenaires auxquels Minah se branche, avec lien vers leur site.
// Message porté : la versatilité et la connexion aux autres font partie de la vision —
// Minah ne refait pas les rails, elle s'y raccorde.
// Les partenaires dont la période est postérieure au curseur restent affichés, estompés :
// on voit arriver l'écosystème au fur et à mesure qu'on avance la frise.

import { PHASES, type Phase } from "@/lib/roadmap/types";
import { partnersFor, type Partner } from "@/lib/roadmap/partners";
import { PartnerLogo } from "./PartnerLogo";

const INK = "#2C1716";
const MUTED = "#766962";
const FAINT = "#A39A8E";
const LINE = "#E6E1D4";

const STATUT_DOT: Record<Partner["statut"], string> = {
  actif: "#6E8A72",
  en_cours: "#E27B30",
  pressenti: "#C9C1B3",
};

export function PartnerStrip({
  title, intro, statusLabels, linkLabel, phase, dataroom, lang,
}: {
  title: string;
  intro: string;
  statusLabels: Record<Partner["statut"], string>;
  /** Libellé lu par les lecteurs d'écran sur le lien. */
  linkLabel: string;
  /** Période sélectionnée : les partenaires à venir sont estompés. */
  phase: Phase;
  /** true = vue investisseurs (masque les partenaires non signés). */
  dataroom: boolean;
  lang: "fr" | "en";
}) {
  const idx = PHASES.indexOf(phase);
  const partners = partnersFor(dataroom);

  return (
    <section style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${LINE}` }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: FAINT, marginBottom: 4 }}>{title}</div>
      <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.55, margin: "0 0 14px", maxWidth: 720 }}>{intro}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(212px, 1fr))", gap: 10 }}>
        {partners.map((p) => {
          const aVenir = PHASES.indexOf(p.depuis) > idx;
          const inner = (
            <>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, minHeight: 22 }}>
                <PartnerLogo p={p} />
                <span style={{ fontSize: 9.5, letterSpacing: "0.05em", textTransform: "uppercase", color: FAINT, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
                  <span style={{ width: 5, height: 5, borderRadius: 3, background: STATUT_DOT[p.statut], display: "inline-block" }} />
                  {statusLabels[p.statut]}
                </span>
              </span>
              <span style={{ fontSize: 12, color: MUTED, lineHeight: 1.45 }}>{p.role[lang]}</span>
              {p.url && (
                <span style={{ fontSize: 11, color: INK, opacity: .75 }}>
                  {p.url.replace(/^https?:\/\/(www\.)?/, "")} ↗
                </span>
              )}
            </>
          );
          const style: React.CSSProperties = {
            display: "flex", flexDirection: "column", gap: 7,
            border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 13px",
            background: "#FFFFFE", textDecoration: "none", height: "100%", boxSizing: "border-box",
            opacity: aVenir ? 0.5 : 1, transition: "opacity .25s ease, border-color .2s ease, box-shadow .2s ease",
          };
          return (
            <li key={p.id} style={{ display: "flex" }}>
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${p.nom}, ${linkLabel}`}
                  style={{ ...style, width: "100%" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D9D2C2"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(44,23,22,.07)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = LINE; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {inner}
                </a>
              ) : (
                <div style={{ ...style, width: "100%" }}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
