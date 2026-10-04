import type { Locale } from "@/lib/i18n";
import type { RoadmapLabels } from "@/lib/roadmap/labels";
import { roadmapCopy } from "@/lib/roadmap/i18n";
import type { EcoLayer, Validation } from "./seed";

export type EcoCopy = {
  labels: RoadmapLabels;
  layers: Record<EcoLayer, string>;
  validation: Record<Validation, string>;
  legend: Record<"livre" | "en_cours" | "prevu", string>;
  intro: string;
  today: string;
  draftBanner: string;
  toConfirm: string;
  card: { status: string; brings: string; since: string; proof: string; next: string; link: string; close: string };
  footer: string;
};

export function ecoCopy(locale: Locale): EcoCopy {
  const base = roadmapCopy(locale);
  const fr = locale !== "en";
  return {
    labels: {
      ...base.labels,
      statuses: fr
        ? { livre: "Signé ou acquis", en_cours: "Lettre d'intention ou pilote", prevu: "En discussion" }
        : { livre: "Signed or secured", en_cours: "LOI or pilot", prevu: "In discussion" },
      experienceLabel: fr ? "Ce que l'écosystème rend possible" : "What the ecosystem makes possible",
      capacityLabel: fr ? "Ce qui est en place" : "What is in place",
      deliveredHere: fr ? "Qui compte sur cette période" : "Who counts in this period",
      nothingDelivered: fr ? "Rien de nouveau sur cette période." : "Nothing new in this period.",
    },
    layers: fr
      ? { capital: "Capital : qui finance", sous_jacents: "Sous-jacents : d'où viennent les actifs", infrastructure: "Infrastructure : les rails", institutions: "Institutions et cadre", tables: "Tables et visibilité" }
      : { capital: "Capital: who funds", sous_jacents: "Underlyings: where assets come from", infrastructure: "Infrastructure: the rails", institutions: "Institutions and framework", tables: "Tables and visibility" },
    validation: fr
      ? { signe: "Signé", loi: "Lettre d'intention", pilote: "Pilote ou intégration en cours", discussion: "En discussion" }
      : { signe: "Signed", loi: "Letter of intent", pilote: "Pilot or integration under way", discussion: "In discussion" },
    legend: fr
      ? { livre: "contrat signé, ou présence acquise", en_cours: "engagement écrit ou intégration en cours", prevu: "pas encore nommé, décision à venir" }
      : { livre: "signed contract, or secured presence", en_cours: "written commitment or integration under way", prevu: "not yet named, decision to come" },
    intro: fr
      ? "Avec qui Minah avance, période par période, et pour quel volume. Déplacez le curseur : les partenaires apparaissent quand ils comptent."
      : "Who Minah moves forward with, period by period, and for what volume. Move the cursor: partners appear when they count.",
    today: base.today,
    draftBanner: fr
      ? "Brouillon du 04/10/2026. Les cartes marquées « à confirmer » portent des hypothèses à valider par l'équipe avant publication."
      : "Draft of 04/10/2026. Cards marked “to confirm” carry assumptions to be validated by the team before publication.",
    toConfirm: fr ? "à confirmer" : "to confirm",
    card: fr
      ? { status: "Statut", brings: "Ce qu'il apporte", since: "Compte depuis", proof: "Déjà acquis", next: "Prochaine étape", link: "Voir le site", close: "Fermer" }
      : { status: "Status", brings: "What it brings", since: "Counts since", proof: "Already secured", next: "Next step", link: "Visit website", close: "Close" },
    footer: fr
      ? "Un partenaire en discussion n'est pas nommé : seule sa catégorie apparaît, jusqu'à signature ou accord."
      : "A partner in discussion is not named: only its category appears, until signature or agreement.",
  };
}
