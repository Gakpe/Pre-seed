import type { Locale } from "@/lib/i18n";

export type EcoCopy = {
  intro: string;
  today: string;
  viewPhase: string;
  viewOverview: string;
  volumeLabel: string;
  volumesTitle: string;
  draftBanner: string;
  toConfirm: string;
  footer: string;
  actorsTitle: string;
  newHere: string;
};

const fr: EcoCopy = {
  intro: "L'écosystème que Minah construit autour d'elle, période par période, toujours une phase en avance sur le volume de la suivante. Déplacez le curseur : chaque période dit qui finance, d'où viennent les actifs, et où Minah est vue.",
  today: "Aujourd'hui",
  viewPhase: "Cette période",
  viewOverview: "Vue d'ensemble",
  volumeLabel: "Volume visé",
  volumesTitle: "Le volume, période par période",
  draftBanner: "Brouillon du 04/10/2026. Les passages marqués « à confirmer » sont des hypothèses à valider par l'équipe avant publication.",
  toConfirm: "à confirmer",
  actorsTitle: "Qui, par catégorie",
  newHere: "nouveau sur cette période",
  footer: "Les noms écrits sont ceux de partenaires signés ou publics. Un partenaire en discussion n'est pas nommé.",
};

const en: EcoCopy = {
  intro: "The ecosystem Minah builds around itself, period by period, always one phase ahead of the next period's volume. Move the cursor: each period tells who funds, where the assets come from, and where Minah is seen.",
  today: "Today",
  viewPhase: "This period",
  viewOverview: "Whole picture",
  volumeLabel: "Target volume",
  volumesTitle: "Volume, period by period",
  draftBanner: "Draft of 04/10/2026. Passages marked “to confirm” are assumptions to be validated by the team before publication.",
  toConfirm: "to confirm",
  actorsTitle: "Who, by category",
  newHere: "new in this period",
  footer: "Names written are those of signed or public partners. A partner in discussion is not named.",
};

export function ecoCopy(locale: Locale): EcoCopy {
  return locale === "en" ? en : fr;
}
