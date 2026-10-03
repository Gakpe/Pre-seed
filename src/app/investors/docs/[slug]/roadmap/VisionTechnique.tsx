"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Phase, PublicRoadmap } from "@/lib/roadmap/types";
import { roadmapCopy } from "@/lib/roadmap/i18n";
import { STATUS_STYLE } from "@/lib/roadmap/labels";
import { ArchitectureBoard, CapacityLine, DefendableList } from "./ArchitectureBoard";
import { PartnerStrip } from "./PartnerStrip";
import { InvestorCardModal } from "./InvestorCard";

// Fiche « Roadmap technique », vue investisseurs. Portée le 02/10/2026 depuis la
// page /vision-technique de l'admin Minah (minah_interface). Ici la donnée arrive
// en props, projetée côté serveur par getPublicRoadmap : pas d'API, pas de
// chargement. Le titre, le chapô et la langue viennent de la fiche du portail.

const INK = "#2C1716";
const MUTED = "#766962";
const FAINT = "#A39A8E";
const LINE = "#E6E1D4";

export function VisionTechnique({ data, locale }: { data: PublicRoadmap; locale: Locale }) {
  const c = roadmapCopy(locale);
  const [phase, setPhase] = useState<Phase>("fondations");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? data.objectifs.find((o) => o.id === selectedId) || null : null;
  const dateLocale = locale === "fr" ? "fr-FR" : "en-US";

  return (
    <div className="mt-8">
      <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 30, fontWeight: 400, color: INK, lineHeight: 1.2, letterSpacing: "-0.02em", margin: "0 0 32px", maxWidth: 760 }}>
        {data.meta.vision}
      </p>

      {/* Légende du code couleur, lisible avant la frise : chaque brique
          reprend exactement ces trois traitements. */}
      <ul style={{ listStyle: "none", margin: "0 0 14px", padding: 0, display: "flex", flexWrap: "wrap", gap: "8px 18px", fontSize: 12.5, color: MUTED }}>
        {(["livre", "en_cours", "prevu"] as const).map((status) => {
          const st = STATUS_STYLE[status];
          return (
            <li key={status} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span aria-hidden style={{ width: 22, height: 14, borderRadius: 4, background: st.bg, border: `1px ${status === "prevu" ? "dashed" : "solid"} ${st.border}`, display: "inline-block" }} />
              <span style={{ color: INK, fontWeight: 600 }}>{c.labels.statuses[status]}</span>
              <span>{c.legend[status]}</span>
            </li>
          );
        })}
      </ul>

      <section style={{ background: "#FFFFFE", border: `1px solid ${LINE}`, borderRadius: 16, padding: "26px 28px 26px" }}>
        <ArchitectureBoard
          objectifs={data.objectifs}
          phase={phase}
          onPhaseChange={setPhase}
          onSelect={setSelectedId}
          selectedId={selectedId}
          labels={c.labels}
          experience={data.meta.experienceParPhase}
          proofs={data.preuves}
          proofLabels={data.meta.preuveLibreParPhase}
          locale={dateLocale}
          todayLabel={c.today}
          highlightExperience
        />
        <CapacityLine cap={data.meta.capacitesParPhase[phase]} labels={c.labels} />
        {data.meta.apprentissagesParPhase[phase] && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: FAINT, marginBottom: 4 }}>{c.learnedLabel}</div>
            <div style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.55, maxWidth: 720 }}>{data.meta.apprentissagesParPhase[phase]}</div>
          </div>
        )}
        <div style={{ marginTop: 16 }}>
          <span style={{ fontSize: 11.5, color: FAINT }}>
            {c.updatedOn.replace("{date}", new Date(data.meta.misAJourLe).toLocaleDateString(dateLocale))}
          </span>
        </div>
      </section>

      <section style={{ marginTop: 44, maxWidth: 860 }}>
        <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 24, fontWeight: 400, color: INK, margin: "0 0 6px" }}>{c.defendableTitle}</h2>
        <p style={{ fontSize: 12.5, color: FAINT, margin: "0 0 18px" }}>{c.labels.phases[phase]}</p>
        <DefendableList items={data.meta.defendableParPhase[phase]} />
      </section>

      <PartnerStrip
        title={c.partnersTitle}
        intro={c.partnersIntro}
        statusLabels={c.partnerStatuses}
        linkLabel={c.partnerLink}
        phase={phase}
        dataroom
        lang={locale}
      />

      <p style={{ marginTop: 44, fontSize: 12, color: FAINT }}>{c.footer}</p>

      {selected && (
        <InvestorCardModal objectif={selected} phase={phase} labels={c.labels} t={c.card} lang={locale} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
