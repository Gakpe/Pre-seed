import type { Locale } from "@/lib/i18n";
import type { Role, Validation } from "./seed";

export type EcoCopy = {
  intro: string;
  today: string;
  viewPhase: string;
  viewOverview: string;
  newHere: string;
  carriedOver: string;
  nothingNew: string;
  volumeLabel: string;
  statuses: Record<"livre" | "en_cours" | "prevu", string>;
  legend: Record<"livre" | "en_cours" | "prevu", string>;
  validation: Record<Validation, string>;
  roles: Record<Role, string>;
  draftBanner: string;
  toConfirm: string;
  card: { brings: string; since: string; proof: string; next: string; link: string; close: string };
  footer: string;
};

const fr: EcoCopy = {
  intro: "Avec qui Minah avance, phase par phase, zone par zone. Déplacez le curseur : chaque zone montre ce qui s'y passe à ce moment-là.",
  today: "Aujourd'hui",
  viewPhase: "Cette phase",
  viewOverview: "Vue d'ensemble",
  newHere: "nouveau sur cette phase",
  carriedOver: "déjà en place",
  nothingNew: "Rien de nouveau dans cette zone sur cette phase.",
  volumeLabel: "Volume visé",
  statuses: { livre: "Signé ou acquis", en_cours: "Lettre d'intention ou pilote", prevu: "En discussion" },
  legend: { livre: "contrat signé, ou présence acquise", en_cours: "engagement écrit ou intégration en cours", prevu: "pas encore nommé, décision à venir" },
  validation: { signe: "Signé", loi: "Lettre d'intention", pilote: "Pilote ou intégration en cours", discussion: "En discussion" },
  roles: { capital: "capital", actifs: "actifs", partenaire: "partenaire", table: "table", cadre: "cadre" },
  draftBanner: "Brouillon du 04/10/2026. Les cartes marquées « à confirmer » portent des hypothèses à valider par l'équipe avant publication.",
  toConfirm: "à confirmer",
  card: { brings: "Ce qu'il apporte", since: "Compte depuis", proof: "Déjà acquis", next: "Prochaine étape", link: "Voir le site", close: "Fermer" },
  footer: "Un partenaire en discussion n'est pas nommé : seule sa catégorie apparaît, jusqu'à signature ou accord.",
};

const en: EcoCopy = {
  intro: "Who Minah moves forward with, phase by phase, zone by zone. Move the cursor: each zone shows what is happening there at that moment.",
  today: "Today",
  viewPhase: "This phase",
  viewOverview: "Whole picture",
  newHere: "new in this phase",
  carriedOver: "already in place",
  nothingNew: "Nothing new in this zone during this phase.",
  volumeLabel: "Target volume",
  statuses: { livre: "Signed or secured", en_cours: "LOI or pilot", prevu: "In discussion" },
  legend: { livre: "signed contract, or secured presence", en_cours: "written commitment or integration under way", prevu: "not yet named, decision to come" },
  validation: { signe: "Signed", loi: "Letter of intent", pilote: "Pilot or integration under way", discussion: "In discussion" },
  roles: { capital: "capital", actifs: "assets", partenaire: "partner", table: "table", cadre: "framework" },
  draftBanner: "Draft of 04/10/2026. Cards marked “to confirm” carry assumptions to be validated by the team before publication.",
  toConfirm: "to confirm",
  card: { brings: "What it brings", since: "Counts since", proof: "Already secured", next: "Next step", link: "Visit website", close: "Close" },
  footer: "A partner in discussion is not named: only its category appears, until signature or agreement.",
};

export function ecoCopy(locale: Locale): EcoCopy {
  return locale === "en" ? en : fr;
}
