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
  actorsTitle: string;
  newHere: string;
  showDetail: string;
  hideDetail: string;
  teamLabel: string;
  buildTitle: string;
  buildAdded: string;
  buildSince: string;
  stickyToday: string;
  stickyShown: string;
  stickyTarget: string;
};

const fr: EcoCopy = {
  intro: "Quatre périodes mènent de notre première stratégie live à un marché à part entière : Amorçage (0 à 2 M€), Traction (2 à 60 M€), Distribution (60 à 100 M€), puis la route vers 1 Md€. Dans chacune, trois fils racontent le go-to-market : qui finance et par quel canal, quels sous-jacents sont financés, et où Minah est vue. Déplacez le curseur pour suivre le chemin.",
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
  showDetail: "Voir le détail",
  hideDetail: "Masquer le détail",
  teamLabel: "Équipe",
  buildTitle: "Ce qui s'ajoute à chaque étape",
  buildAdded: "+{n} sur cette période · {t} au total",
  buildSince: "Déjà en place",
};

const en: EcoCopy = {
  intro: "Four periods take us from our first live strategy to a fully fledged market: Seeding (€0 to €2M), Traction (€2M to €60M), Distribution (€60M to €100M), then the road to €1B. In each one, three threads tell the go-to-market: who funds and through which channel, which underlyings are financed, and where Minah is seen. Move the cursor to follow the path.",
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
  showDetail: "Show detail",
  hideDetail: "Hide detail",
  teamLabel: "Team",
  buildTitle: "What each step adds",
  buildAdded: "+{n} in this period · {t} in total",
  buildSince: "Already in place",
};

export function ecoCopy(locale: Locale): EcoCopy {
  return locale === "en" ? en : fr;
}
