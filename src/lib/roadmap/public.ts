// Porté le 02/10/2026 depuis minah_interface, voir types.ts.
// src/lib/roadmap/public.ts
// Projection « investisseurs » : ne renvoie jamais dates précises, owner, dépendances,
// forçages, tâches, notes internes ni brief théorique. Les objectifs non visibles sont
// exclus. À remplacer par une vue SQL filtrée en phase B — le contrat de sortie reste.

import { partnersByIds } from "./partners";
import { ROADMAP_META, ROADMAP_OBJECTIVES } from "./seed";
import { PHASES, currentPhase, type Objective, type PhaseProof, type Phase, type PublicObjective, type PublicRoadmap, type Status } from "./types";

/**
 * Règle data room (03/10/2026) : rien de ce qui se livre dans le futur n'est montré
 * comme intégré ni en développement, quelle que soit la période sous le curseur.
 * Une brique livrée après la période courante est « en projet » partout ; les
 * briques passées et courantes gardent leurs statuts (forçages compris). Sans ça,
 * placer le curseur sur « API v1 » peignait en vert des choses qui n'existent pas.
 */
// Chantiers réellement ouverts aujourd'hui bien que livrés plus tard : montrés
// « en développement » à partir de la période courante, « en projet » avant.
// Liste arrêtée avec Julien le 03/10/2026.
const IN_DEVELOPMENT = new Set(["api-v1", "integration-sereel", "web3-admin", "cross-chain-stellar"]);

function dataroomStatuses(o: Objective): Record<Phase, Status> {
  const now = PHASES.indexOf(currentPhase());
  if (PHASES.indexOf(o.livreEn) <= now) return o.statutsParPhase;
  const later: Status = IN_DEVELOPMENT.has(o.id) ? "en_cours" : "prevu";
  return Object.fromEntries(PHASES.map((p, i) => [p, i >= now ? later : "prevu"])) as Record<Phase, Status>;
}

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
    statutsParPhase: dataroom ? dataroomStatuses(o) : o.statutsParPhase,
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
