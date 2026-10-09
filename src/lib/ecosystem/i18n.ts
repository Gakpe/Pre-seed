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
  intro: "Notre écosystème se construit une période avant le volume qu'il doit porter. Quatre périodes mènent de notre première stratégie live à un marché à part entière : Amorçage (0 à 2 M€), Traction (2 à 50 M€), Distribution (50 à 100 M€), puis la route vers 1 Md€. Dans chacune, trois fils disent qui finance et par quel canal, d'où viennent les actifs, et où Minah est vue. Déplacez le curseur pour suivre le chemin.",
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
  intro: "Our ecosystem is built one period ahead of the volume it has to carry. Four periods take us from our first live strategy to a fully fledged market: Seeding (€0 to €2M), Traction (€2M to €50M), Distribution (€50M to €100M), then the road to €1B. In each one, three threads tell who funds and through which channel, where the assets come from, and where Minah is seen. Move the cursor to follow the path.",
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
