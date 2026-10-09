"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Phase, PublicRoadmap } from "@/lib/roadmap/types";
import { roadmapCopy } from "@/lib/roadmap/i18n";
import { STATUS_STYLE } from "@/lib/roadmap/labels";
import { ArchitectureBoard, CapacityLine, DefendableList } from "./ArchitectureBoard";
import { PartnerStrip } from "./PartnerStrip";
import { InvestorCardModal } from "./InvestorCard";
import { StatusEditor } from "./StatusEditor";
import { SectionTitle } from "../section-title";
import type { Status } from "@/lib/roadmap/types";

// Fiche « Roadmap technique », vue investisseurs. Portée le 02/10/2026 depuis la
// page /vision-technique de l'admin Minah (minah_interface). Ici la donnée arrive
// en props, projetée côté serveur par getPublicRoadmap : pas d'API, pas de
// chargement. Le titre, le chapô et la langue viennent de la fiche du portail.

export function VisionTechnique({
  data,
  locale,
  canEdit = false,
  overrides = {},
}: {
  data: PublicRoadmap;
  locale: Locale;
  /** Julien seulement : l'éditeur d'état apparaît dans la carte d'une brique. */
  canEdit?: boolean;
  overrides?: Partial<Record<string, Status>>;
}) {
  const c = roadmapCopy(locale);
  const [phase, setPhase] = useState<Phase>("fondations");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? data.objectifs.find((o) => o.id === selectedId) || null : null;
  const dateLocale = locale === "fr" ? "fr-FR" : "en-US";

  return (
    <div className="mt-8">
      {/* La phrase de vision prend la carte blanche des citations, sans
          guillemets : elle ne cite personne (voir AGENTS.md). */}
      <p className="rounded-xl border border-foreground/10 bg-white/60 px-6 py-7 text-center text-xl font-semibold leading-[1.4] tracking-tight text-foreground">
        {data.meta.vision}
      </p>

      <SectionTitle n="01" className="mt-14">{c.boardTitle}</SectionTitle>

      {/* Légende du code couleur, lisible avant la frise : chaque brique
          reprend exactement ces trois traitements. */}
      <ul className="mt-6 mb-3.5 flex flex-wrap gap-x-[18px] gap-y-2 text-sm text-neutral-600">
        {(["livre", "en_cours", "prevu"] as const).map((status) => {
          const st = STATUS_STYLE[status];
          return (
            <li key={status} className="flex items-center gap-2">
              <span aria-hidden style={{ width: 22, height: 14, borderRadius: 4, background: st.bg, border: `1px ${status === "prevu" ? "dashed" : "solid"} ${st.border}`, display: "inline-block" }} />
              <span className="font-semibold text-foreground">{c.labels.statuses[status]}</span>
              <span>{c.legend[status]}</span>
            </li>
          );
        })}
      </ul>

      {/* Fond blanc plein, et non le blanc à 60 % des autres cartes : sur ce
          tableau dense, le beige qui transparaissait gênait la lecture. */}
      <section className="rounded-xl border border-foreground/10 bg-white px-5 py-6 sm:px-7">
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
          <div className="mt-4">
            <p className="text-sm font-semibold text-foreground">{c.learnedLabel}</p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral-700">{data.meta.apprentissagesParPhase[phase]}</p>
          </div>
        )}
        <p className="mt-4 text-xs text-neutral-600">
          {c.updatedOn.replace("{date}", new Date(data.meta.misAJourLe).toLocaleDateString(dateLocale))}
        </p>
      </section>

      <section className="mt-14">
        <SectionTitle n="02">{c.defendableTitle}</SectionTitle>
        {/* Les arguments suivent la période choisie sur la frise : on la rappelle. */}
        <p className="mt-2 text-sm text-neutral-600">
          {locale === "fr" ? "Période\u00a0: " : "Period: "}
          <span className="font-medium text-foreground">{c.labels.phases[phase]}</span>
        </p>
        <div className="mt-6">
          <DefendableList items={data.meta.defendableParPhase[phase]} />
        </div>
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

      <p className="mt-12 text-sm text-neutral-600">{c.footer}</p>

      {selected && (
        <InvestorCardModal
          objectif={selected}
          phase={phase}
          labels={c.labels}
          t={c.card}
          lang={locale}
          onClose={() => setSelectedId(null)}
          extra={canEdit ? <StatusEditor id={selected.id} current={overrides[selected.id] ?? null} labels={c.labels.statuses} /> : undefined}
        />
      )}
    </div>
  );
}
