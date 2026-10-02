// Porté le 02/10/2026 depuis minah_interface, voir types.ts.
// src/lib/roadmap/public.ts
// Projection « investisseurs » : ne renvoie jamais dates précises, owner, dépendances,
// forçages, tâches, notes internes ni brief théorique. Les objectifs non visibles sont
// exclus. À remplacer par une vue SQL filtrée en phase B — le contrat de sortie reste.

import { partnersByIds } from "./partners";
import { ROADMAP_META, ROADMAP_OBJECTIVES } from "./seed";
import type { Objective, PhaseProof, Phase, PublicObjective, PublicRoadmap } from "./types";

/**
 * `dataroom` vaut true pour la vue investisseurs : un partenaire non signé
 * (`visibleDataroom: false`) ne doit pas sortir d'ici. La vue équipe passe false et
 * garde la liste complète — c'est le seul écart entre les deux projections.
 */
export function toPublicObjective(o: Objective, dataroom = true): PublicObjective {
  return {
    id: o.id,
    slug: o.slug,
    titre: o.titre,
    couche: o.couche,
    moteur: o.moteur,
    ordre: o.ordre,
    livreEn: o.livreEn,
    miseEnAvant: o.miseEnAvant,
    statutsParPhase: o.statutsParPhase,
    capaciteDebloquee: o.capaciteDebloquee,
    briefInvestisseur: o.briefInvestisseur,
    partenaires: partnersByIds(o.partenaires, dataroom).map((p) => p.id),
  };
}

export function getPublicRoadmap(preuves: Partial<Record<Phase, PhaseProof>> | null): PublicRoadmap {
  return {
    meta: {
      vision: ROADMAP_META.vision,
      defendableParPhase: ROADMAP_META.defendableParPhase,
      misAJourLe: ROADMAP_META.misAJourLe,
      experienceParPhase: ROADMAP_META.experienceParPhase,
      capacitesParPhase: ROADMAP_META.capacitesParPhase,
      apprentissagesParPhase: ROADMAP_META.apprentissagesParPhase,
      preuveLibreParPhase: ROADMAP_META.preuveLibreParPhase,
    },
    preuves,
    objectifs: ROADMAP_OBJECTIVES.filter((o) => o.visibleDataroom).map((o) => toPublicObjective(o)),
  };
}
