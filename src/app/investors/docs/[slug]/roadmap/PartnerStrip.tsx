"use client";

// Bandeau écosystème : les partenaires auxquels Minah se branche, avec lien vers leur site.
// Message porté : la versatilité et la connexion aux autres font partie de la vision —
// Minah ne refait pas les rails, elle s'y raccorde.
// Les partenaires dont la période est postérieure au curseur restent affichés, estompés :
// on voit arriver l'écosystème au fur et à mesure qu'on avance la frise.

import { PHASES, type Phase } from "@/lib/roadmap/types";
import { partnersFor, type Partner } from "@/lib/roadmap/partners";
import { PartnerLogo } from "./PartnerLogo";
import { SectionTitle } from "../section-title";

const INK = "#2C1716";
// Gris du texte relevé le 08/10/2026 : l'ancien gris clair (#A39A8E) donnait 2,5 de contraste.
const MUTED = "#5F5650";
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
    <section className="mt-14">
      <SectionTitle n="03">{title}</SectionTitle>
      <p className="mt-4 mb-6 max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{intro}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
        {partners.map((p) => {
          const aVenir = PHASES.indexOf(p.depuis) > idx;
          const inner = (
            <>
              {/* Le statut passe sous le logo quand la place manque : avec les vrais
                  logos, plus larges que les noms, il débordait de la carte. */}
              <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", columnGap: 8, rowGap: 6, minHeight: 22 }}>
                <PartnerLogo p={p} />
                <span style={{ fontSize: 11.5, color: MUTED, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
                  <span style={{ width: 5, height: 5, borderRadius: 3, background: STATUT_DOT[p.statut], display: "inline-block" }} />
                  {statusLabels[p.statut]}
                </span>
              </span>
              <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{p.role[lang]}</span>
              {p.url && (
                <span style={{ fontSize: 12, color: INK, opacity: .8, whiteSpace: "nowrap" }}>
                  {p.url.replace(/^https?:\/\/(www\.)?/, "")} ↗
                </span>
              )}
            </>
          );
          const style: React.CSSProperties = {
            display: "flex", flexDirection: "column", gap: 7,
            border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 15px",
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
