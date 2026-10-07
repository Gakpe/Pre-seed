import type { Locale } from "@/lib/i18n";
import type { Partner } from "./partners";
import type { RoadmapLabels } from "./labels";

// Libellés de la fiche « Roadmap technique », extraits des locales de l'admin
// Minah (pages.roadmap et pages.visionTechnique) : seul ce que la fiche utilise.

export type CardLabels = {
  quarter: string;
  moteur: string;
  what: string;
  why: string;
  capacity: string;
  partner: string;
  partnerLink: string;
  close: string;
};

export type RoadmapCopy = {
  labels: RoadmapLabels;
  today: string;
  intro: string;
  defendableTitle: string;
  footer: string;
  updatedOn: string;
  learnedLabel: string;
  partnersTitle: string;
  partnersIntro: string;
  partnerStatuses: Record<Partner["statut"], string>;
  partnerLink: string;
  card: CardLabels;
  /** Légende du code couleur, un mot d'explication par état. */
  legend: Record<"livre" | "en_cours" | "prevu", string>;
};

const fr: RoadmapCopy = {
  labels: {
    phases: { fondations: "Fondations", b2c: "Plateforme minah.io B2C", b2b: "Plateforme B2B", api_v1: "API v1", api_v2: "API v2", vision: "Vision" },
    layers: { liquidite: "Liquidité", produits: "Produits et moteurs", api: "API", admin: "Admin, Web3 et sécurité", rails: "Rails et custody" },
    statuses: { prevu: "En projet", en_cours: "En développement", livre: "Intégré" },
    lanes: { web3: "Smart contracts et web3", backend: "Backend et API", front: "Front et admin", securite: "Sécurité et conformité", partenaires: "Intégrations partenaires" },
    taskStatuses: { a_faire: "à faire", en_cours: "en cours", fait: "fait" },
    moteurs: { dette_privee: "Dette privée", dette_souveraine: "Dette souveraine", liquidite_crypto: "Liquidité crypto", transverse: "Transverse" },
    capacityLabel: "Capacité débloquée",
    volumeLabel: "Volume",
    apiLabel: "Ce que l'API permet",
    experienceLabel: "Expérience utilisateur",
    health: { on_track: "Dans les temps", at_risk: "À risque", off_track: "En retard" },
    proofs: { investors: "investisseurs", subscribed: "souscrits", strategies: "stratégies" },
    viewPeriod: "Cette période",
    viewOverview: "Vue d'ensemble",
    deliveredHere: "Ce qui est livré sur cette période",
    nothingDelivered: "Rien n'est livré sur cette période.",
  },
  today: "Aujourd'hui",
  intro:
    "Ce qui est construit, où va Minah, et pourquoi l'infrastructure est défendable. Déplacez le curseur pour voir la plateforme évoluer, des fondations à la vision.",
  defendableTitle: "Pourquoi c'est défendable",
  footer: "Document confidentiel, réservé aux investisseurs sous NDA. Les phases sont indicatives.",
  updatedOn: "Mis à jour le {date}",
  learnedLabel: "Ce qu'on a appris",
  partnersTitle: "Écosystème et partenaires",
  partnersIntro:
    "Les rails et les fournisseurs sur lesquels Minah émet, garde et distribue ses stratégies, et ceux avec qui nous sommes en discussion.",
  partnerStatuses: { actif: "En production", en_cours: "Intégration en cours", pressenti: "Pressenti" },
  partnerLink: "ouvrir le site (nouvel onglet)",
  legend: { livre: "en production", en_cours: "en cours sur la période", prevu: "prévu plus tard" },
  card: { quarter: "Livré en", moteur: "Moteur", what: "Ce que c'est", why: "Pourquoi c'est important", capacity: "Capacité débloquée", partner: "Partenaire", partnerLink: "Voir le site", close: "Fermer" },
};

const en: RoadmapCopy = {
  labels: {
    phases: { fondations: "Foundations", b2c: "minah.io B2C platform", b2b: "B2B platform", api_v1: "API v1", api_v2: "API v2", vision: "Vision" },
    layers: { liquidite: "Liquidity", produits: "Products & engines", api: "API", admin: "Admin, Web3 & security", rails: "Rails & custody" },
    statuses: { prevu: "Planned", en_cours: "In development", livre: "Integrated" },
    lanes: { web3: "Smart contracts & web3", backend: "Backend & API", front: "Front & admin", securite: "Security & compliance", partenaires: "Partner integrations" },
    taskStatuses: { a_faire: "to do", en_cours: "in progress", fait: "done" },
    moteurs: { dette_privee: "Private debt", dette_souveraine: "Sovereign debt", liquidite_crypto: "Crypto liquidity", transverse: "Cross-cutting" },
    capacityLabel: "Capability unlocked",
    volumeLabel: "Volume",
    apiLabel: "What the API enables",
    experienceLabel: "User experience",
    health: { on_track: "On track", at_risk: "At risk", off_track: "Off track" },
    proofs: { investors: "investors", subscribed: "subscribed", strategies: "strategies" },
    viewPeriod: "This period",
    viewOverview: "Whole picture",
    deliveredHere: "What ships in this period",
    nothingDelivered: "Nothing ships in this period.",
  },
  today: "Today",
  intro:
    "What is built, where Minah is going, and why the infrastructure is defensible. Move the cursor to see the platform evolve, from the foundations to the vision.",
  defendableTitle: "Why it is defensible",
  footer: "Confidential document, for investors under NDA. Phases are indicative.",
  updatedOn: "Updated on {date}",
  learnedLabel: "What we learned",
  partnersTitle: "Ecosystem and partners",
  partnersIntro:
    "The rails and providers Minah uses to issue, hold and distribute its strategies, and those we are in discussions with.",
  partnerStatuses: { actif: "Live", en_cours: "Integration under way", pressenti: "Prospective" },
  partnerLink: "open website (new tab)",
  legend: { livre: "in production", en_cours: "under way in the period", prevu: "planned for later" },
  card: { quarter: "Delivered in", moteur: "Engine", what: "What it is", why: "Why it matters", capacity: "Capability unlocked", partner: "Partner", partnerLink: "Visit website", close: "Close" },
};

export function roadmapCopy(locale: Locale): RoadmapCopy {
  return locale === "en" ? en : fr;
}
