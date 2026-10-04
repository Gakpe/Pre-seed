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
  stickyToday: string;
  stickyShown: string;
  stickyTarget: string;
};

const fr: EcoCopy = {
  intro: "Un écosystème se construit avant d'en avoir besoin. Le nôtre est aligné sur deux choses : les produits que nous distribuerons demain, et la distribution que nous serons capables d'opérer. Chaque période prépare donc la suivante, côté pipeline comme côté capital : l'écosystème a toujours un coup d'avance sur le volume, et c'est lui qui rend le prochain palier crédible. Déplacez le curseur : chaque période dit qui finance, d'où viennent les actifs, et où Minah est vue.",
  today: "Aujourd'hui",
  viewPhase: "Cette période",
  viewOverview: "Vue d'ensemble",
  volumeLabel: "Volume visé",
  volumesTitle: "Le volume, période par période",
  draftBanner: "Brouillon du 04/10/2026. Les passages marqués « à confirmer » sont des hypothèses à valider par l'équipe avant publication.",
  toConfirm: "à confirmer",
  actorsTitle: "Qui, par catégorie",
  stickyToday: "Aujourd'hui",
  stickyShown: "Période affichée",
  stickyTarget: "Cible",
  newHere: "nouveau sur cette période",
  footer: "Les noms écrits sont ceux de partenaires signés ou publics. Un partenaire en discussion n'est pas nommé.",
};

const en: EcoCopy = {
  intro: "An ecosystem is built before it is needed. Ours is aligned on two things: the products we will distribute tomorrow, and the distribution we will be able to run. Each period therefore prepares the next, on the pipeline side as on the capital side: the ecosystem is always one step ahead of volume, and it is what makes the next tier credible. Move the cursor: each period tells who funds, where the assets come from, and where Minah is seen.",
  today: "Today",
  viewPhase: "This period",
  viewOverview: "Whole picture",
  volumeLabel: "Target volume",
  volumesTitle: "Volume, period by period",
  draftBanner: "Draft of 04/10/2026. Passages marked “to confirm” are assumptions to be validated by the team before publication.",
  toConfirm: "to confirm",
  actorsTitle: "Who, by category",
  stickyToday: "Today",
  stickyShown: "Period shown",
  stickyTarget: "Target",
  newHere: "new in this period",
  footer: "Names written are those of signed or public partners. A partner in discussion is not named.",
};

export function ecoCopy(locale: Locale): EcoCopy {
  return locale === "en" ? en : fr;
}
