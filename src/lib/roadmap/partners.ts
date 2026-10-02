// Porté le 02/10/2026 depuis minah_interface, voir types.ts.
// src/lib/roadmap/partners.ts
// Écosystème : les rails, protocoles et fournisseurs auxquels Minah se branche.
// Sert la démonstration de versatilité — Minah ne refait pas ce qui existe, elle s'y connecte.
//
// Logos : déposer le fichier dans `public/partners/` puis renseigner `logo` ci-dessous
// (ex. `logo: "/partners/stellar.svg"`). Tant que le champ est vide, la carte affiche le nom
// en typographie — aucun logo n'est chargé depuis un service tiers : la dataroom ne doit pas
// signaler à l'extérieur qui la consulte.
//
// Règle dataroom : un partenaire en négociation non signée n'est pas nommé côté investisseurs
// (`visibleDataroom: false`). À revoir au fur et à mesure des signatures.

import type { Phase } from "./types";

export interface Partner {
  id: string;
  nom: string;
  /** Site officiel. Vide = lien à confirmer, la carte s'affiche alors sans lien. */
  url: string;
  /** Ce qu'il apporte à l'infrastructure, en une ligne. */
  role: { fr: string; en: string };
  statut: "actif" | "en_cours" | "pressenti";
  /** Période à partir de laquelle le partenaire compte (avant : estompé). */
  depuis: Phase;
  visibleDataroom: boolean;
  /** Chemin du logo dans /public, ex. "/partners/stellar.svg". Vide = nom en typographie. */
  logo?: string;
}

export const PARTNERS: Partner[] = [
  {
    id: "stellar",
    nom: "Stellar",
    url: "https://stellar.org",
    role: { fr: "Rail d'émission et de règlement des obligations tokenisées.", en: "Issuance and settlement rail for tokenised bonds." },
    statut: "actif", depuis: "fondations", visibleDataroom: true,
  },
  {
    id: "fireblocks",
    nom: "Fireblocks",
    url: "https://www.fireblocks.com",
    role: { fr: "Custody institutionnelle et contrôle des transactions (KYT).", en: "Institutional custody and transaction screening (KYT)." },
    statut: "actif", depuis: "fondations", visibleDataroom: true,
  },
  {
    id: "sumsub",
    nom: "Sumsub",
    url: "https://sumsub.com",
    role: { fr: "Vérification d'identité et conformité des investisseurs.", en: "Identity verification and investor compliance." },
    statut: "actif", depuis: "fondations", visibleDataroom: true,
  },
  {
    id: "canton",
    nom: "Canton Network",
    url: "https://www.canton.network",
    role: { fr: "Second rail institutionnel, derrière la même abstraction multi-providers.", en: "Second institutional rail, behind the same multi-provider abstraction." },
    statut: "en_cours", depuis: "api_v1", visibleDataroom: true,
    logo: "/partners/canton.png",
  },
  {
    id: "starknet",
    nom: "Starknet",
    url: "https://www.starknet.io",
    role: { fr: "Rail alternatif évalué pour l'émission, à confirmer.", en: "Alternative issuance rail under evaluation, to be confirmed." },
    statut: "pressenti", depuis: "fondations", visibleDataroom: true,
  },
  {
    id: "sereel",
    nom: "Sereel",
    url: "", // URL officielle à confirmer avant publication dataroom
    role: { fr: "Premier protocole partenaire : il distribue les stratégies Minah via l'API.", en: "First partner protocol: it distributes Minah strategies through the API." },
    statut: "en_cours", depuis: "b2b", visibleDataroom: true,
  },
  {
    id: "etherfuse",
    nom: "Etherfuse",
    url: "https://www.etherfuse.com",
    role: { fr: "Obligations souveraines tokenisées — moteur de dette souveraine.", en: "Tokenised sovereign bonds — sovereign debt engine." },
    statut: "pressenti", depuis: "api_v1", visibleDataroom: true,
  },
  {
    id: "untangled",
    nom: "Untangled Finance",
    url: "https://untangled.finance",
    role: { fr: "DeFi institutionnelle adossée à des actifs réels.", en: "Institutional DeFi backed by real-world assets." },
    statut: "pressenti", depuis: "api_v1", visibleDataroom: true,
  },
  {
    id: "realiz",
    nom: "Realiz",
    url: "", // URL officielle à confirmer avant publication dataroom
    role: { fr: "Titrisation tokenisée d'actifs non bancables.", en: "Tokenised securitisation of non-bankable assets." },
    statut: "pressenti", depuis: "api_v1", visibleDataroom: true,
  },
  {
    id: "pendle",
    nom: "Pendle",
    url: "https://www.pendle.finance",
    role: { fr: "Référence du découpage principal / rendement (PT, YT) — partenaire pressenti.", en: "Reference for principal / yield splitting (PT, YT) — prospective partner." },
    statut: "pressenti", depuis: "vision", visibleDataroom: true,
  },
  {
    id: "spectra",
    nom: "Spectra",
    url: "https://www.spectra.finance",
    role: { fr: "Marché de taux on-chain, piste de liquidité sur le modèle PT / YT.", en: "On-chain yield market, liquidity lead on the PT / YT model." },
    statut: "pressenti", depuis: "b2c", visibleDataroom: true,
  },
  {
    id: "tradable",
    nom: "Tradable",
    url: "https://tradable.xyz",
    role: { fr: "Place de marché pour actifs privés tokenisés — piste pour le secondaire.", en: "Marketplace for tokenised private assets — secondary market lead." },
    statut: "pressenti", depuis: "vision", visibleDataroom: true,
  },
  {
    id: "spiko",
    nom: "Spiko",
    url: "https://www.spiko.xyz",
    role: { fr: "T-bills tokenisés pour le placement de la trésorerie en attente.", en: "Tokenised T-bills for idle treasury placement." },
    statut: "pressenti", depuis: "api_v2", visibleDataroom: false, // en contact, ne pas nommer côté investisseurs
  },
  {
    id: "zeno",
    nom: "Zeno",
    url: "",
    role: { fr: "Piste T-bills, en contact.", en: "T-bills lead, early contact." },
    statut: "pressenti", depuis: "api_v2", visibleDataroom: false,
  },
];

/** Partenaires visibles selon le contexte ; l'ordre suit la chronologie d'arrivée. */
export function partnersFor(dataroom: boolean): Partner[] {
  return PARTNERS.filter((p) => (dataroom ? p.visibleDataroom : true));
}

/**
 * Résout les identifiants portés par un objectif (`Objective.partenaires`) en partenaires.
 * `dataroom` applique la même règle que `partnersFor` : un partenaire non signé
 * (`visibleDataroom: false`) disparaît de la carte investisseurs. Un identifiant inconnu
 * est ignoré plutôt que de casser la carte. L'ordre de l'objectif est conservé.
 */
export function partnersByIds(ids: string[] | undefined, dataroom: boolean): Partner[] {
  if (!ids?.length) return [];
  const byId = new Map(partnersFor(dataroom).map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is Partner => Boolean(p));
}
