// Porté le 02/10/2026 depuis minah_interface, voir types.ts.
// src/lib/roadmap/public.ts
// Projection « investisseurs » : ne renvoie jamais dates précises, owner, dépendances,
// forçages, tâches, notes internes ni brief théorique. Les objectifs non visibles sont
// exclus. À remplacer par une vue SQL filtrée en phase B — le contrat de sortie reste.

import { partnersByIds } from "./partners";
import { ROADMAP_META, ROADMAP_OBJECTIVES } from "./seed";
import { META_EN, OBJECTIVES_EN } from "./seed.en";
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

/**
 * État forcé par Julien (voir overrides.ts) : il s'applique de la période courante
 * à la fin. Avant, « intégré » garde l'historique calculé (en développement puis
 * livré), les deux autres sont « en projet ».
 */
function dataroomStatuses(o: Objective, override?: Status): Record<Phase, Status> {
  const now = PHASES.indexOf(currentPhase());
  if (override) {
    return Object.fromEntries(
      PHASES.map((p, i) => [p, i >= now ? override : override === "livre" ? o.statutsParPhase[p] : "prevu"])
    ) as Record<Phase, Status>;
  }
  if (PHASES.indexOf(o.livreEn) <= now) return o.statutsParPhase;
  const later: Status = IN_DEVELOPMENT.has(o.id) ? "en_cours" : "prevu";
  return Object.fromEntries(PHASES.map((p, i) => [p, i >= now ? later : "prevu"])) as Record<Phase, Status>;
}

/**
 * `dataroom` vaut true pour la vue investisseurs : un partenaire non signé
 * (`visibleDataroom: false`) ne doit pas sortir d'ici. La vue équipe passe false et
 * garde la liste complète — c'est le seul écart entre les deux projections.
 */
export function toPublicObjective(o: Objective, dataroom = true, override?: Status): PublicObjective {
  return {
    id: o.id,
    slug: o.slug,
    titre: o.titre,
    couche: o.couche,
    moteur: o.moteur,
    ordre: o.ordre,
    livreEn: o.livreEn,
    miseEnAvant: o.miseEnAvant,
    statutsParPhase: dataroom ? dataroomStatuses(o, override) : o.statutsParPhase,
    capaciteDebloquee: o.capaciteDebloquee,
    briefInvestisseur: o.briefInvestisseur,
    partenaires: partnersByIds(o.partenaires, dataroom).map((p) => p.id),
  };
}

// Textes anglais en surcouche (seed.en.ts) ; une entrée absente garde le français.
function localize(o: PublicObjective, locale: "fr" | "en"): PublicObjective {
  const en = locale === "en" ? OBJECTIVES_EN[o.id] : undefined;
  return en ? { ...o, titre: en.titre, capaciteDebloquee: en.capaciteDebloquee, briefInvestisseur: en.brief } : o;
}

export function getPublicRoadmap(
  preuves: Partial<Record<Phase, PhaseProof>> | null,
  overrides: Partial<Record<string, Status>> = {},
  locale: "fr" | "en" = "fr"
): PublicRoadmap {
  const m = locale === "en" ? META_EN : ROADMAP_META;
  return {
    meta: {
      vision: m.vision,
      defendableParPhase: m.defendableParPhase,
      misAJourLe: ROADMAP_META.misAJourLe,
      experienceParPhase: m.experienceParPhase,
      capacitesParPhase: m.capacitesParPhase,
      apprentissagesParPhase: m.apprentissagesParPhase,
      preuveLibreParPhase: m.preuveLibreParPhase,
    },
    preuves,
    objectifs: ROADMAP_OBJECTIVES.filter((o) => o.visibleDataroom).map((o) => localize(toPublicObjective(o, true, overrides[o.id]), locale)),
  };
}
