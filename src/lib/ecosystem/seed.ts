import { PHASES, type Phase, type Status } from "@/lib/roadmap/types";

// Roadmap écosystème : avec qui Minah avance, période par période, et pour quel
// volume. BROUILLON du 04/10/2026 : la structure est arrêtée, les statuts et les
// prochaines étapes marqués `aConfirmer` sont des hypothèses à valider par
// l'équipe avant toute mise en ligne.
//
// Règle de nommage : un partenaire se nomme s'il est signé ou en pilote ; en
// lettre d'intention, avec son accord ; en discussion, jamais (on écrit la
// catégorie). Les entrées en discussion portent donc un titre générique.

export type EcoLayer = "capital" | "sous_jacents" | "infrastructure" | "institutions" | "tables";
export const ECO_LAYERS: EcoLayer[] = ["capital", "sous_jacents", "infrastructure", "institutions", "tables"];

/** Hiérarchie de validation lue par les investisseurs, du plus fort au plus faible. */
export type Validation = "signe" | "loi" | "pilote" | "discussion";

export type Bilingual = { fr: string; en: string };

export type EcoItem = {
  id: string;
  titre: Bilingual;
  couche: EcoLayer;
  ordre: number;
  /** Période à partir de laquelle le partenaire compte. Avant : en projet. */
  depuis: Phase;
  validation: Validation;
  /** Ce qu'il apporte, en une ligne. */
  apporte: Bilingual;
  /** Prochaine étape datée. */
  prochaineEtape?: Bilingual;
  /** Preuve ou chiffre déjà acquis. */
  preuve?: Bilingual;
  url?: string;
  /** Hypothèse à valider par l'équipe avant publication. */
  aConfirmer?: boolean;
};

/** Couleur de la brique : signé en vert, LOI et pilote en orange, discussion en gris. */
export const VALIDATION_STATUS: Record<Validation, Status> = {
  signe: "livre",
  loi: "en_cours",
  pilote: "en_cours",
  discussion: "prevu",
};

export function ecoStatuses(item: EcoItem): Record<Phase, Status> {
  const from = PHASES.indexOf(item.depuis);
  return Object.fromEntries(
    PHASES.map((p, i) => [p, i < from ? "prevu" : VALIDATION_STATUS[item.validation]])
  ) as Record<Phase, Status>;
}

export const ECO_META: {
  vision: Bilingual;
  experienceParPhase: Record<Phase, Bilingual>;
  capacitesParPhase: Record<Phase, { capacite: Bilingual; volume: Bilingual }>;
} = {
  vision: {
    fr: "Minah ne refait pas les rails ni les réseaux : elle s'y branche, des deux côtés du capital.",
    en: "Minah does not rebuild the rails or the networks: it plugs into them, on both sides of capital.",
  },
  experienceParPhase: {
    fondations: {
      fr: "Les briques d'infrastructure sont choisies et contractualisées : un rail d'émission, une custody institutionnelle, un KYC. Le réseau, lui, est encore celui des fondateurs.",
      en: "The infrastructure building blocks are chosen and contracted: an issuance rail, institutional custody, KYC. The network is still the founders' own.",
    },
    b2c: {
      fr: "Le réseau des fondateurs et les premiers Minah Circles amènent les premiers souscripteurs. On apprend qui finance, et à quelles conditions.",
      en: "The founders' network and the first Minah Circles bring the first subscribers. We learn who funds, and on what terms.",
    },
    b2b: {
      fr: "La machine à réseau se formalise : Network Builders, Minah Circles, les tables où se concentre le capital. Un premier État contractualisé, un premier protocole en intégration.",
      en: "The network machine takes shape: Network Builders, Minah Circles, the tables where capital gathers. A first State under contract, a first protocol being integrated.",
    },
    api_v1: {
      fr: "La distribution passe par des tiers : des protocoles branchés sur l'API, un second rail institutionnel, un partenaire bancaire pour le règlement.",
      en: "Distribution goes through third parties: protocols connected to the API, a second institutional rail, a banking partner for settlement.",
    },
    api_v2: {
      fr: "Trois moteurs alimentés par trois écosystèmes : les fintechs pour la dette privée, les émetteurs souverains pour les T-bills, les allocataires crypto pour la liquidité.",
      en: "Three engines fed by three ecosystems: fintechs for private debt, sovereign issuers for T-bills, crypto allocators for liquidity.",
    },
    vision: {
      fr: "Un marché : des places de liquidité, des teneurs de marché, des institutions qui se branchent directement. Minah devient une couche de l'écosystème, pas un guichet.",
      en: "A market: liquidity venues, market makers, institutions plugging in directly. Minah becomes a layer of the ecosystem, not a counter.",
    },
  },
  capacitesParPhase: {
    fondations: { capacite: { fr: "Rail, custody et KYC sous contrat.", en: "Rail, custody and KYC under contract." }, volume: { fr: "Premières émissions", en: "First issuances" } },
    b2c: { capacite: { fr: "Premiers souscripteurs, par le réseau direct.", en: "First subscribers, through the direct network." }, volume: { fr: "Moins de 100 K€", en: "Under €100K" } },
    b2b: { capacite: { fr: "Un réseau d'apporteurs, des événements propriétaires, un État sous contrat.", en: "An introducer network, proprietary events, a State under contract." }, volume: { fr: "De 2 M€ à 15 M€ sur la période", en: "€2M to €15M over the period" } },
    api_v1: { capacite: { fr: "Des tiers distribuent les stratégies.", en: "Third parties distribute the strategies." }, volume: { fr: "Nouvelle stratégie de 15 à 20 M€", en: "New strategy of €15M to €20M" } },
    api_v2: { capacite: { fr: "Trois sources de capital, trois sources d'actifs.", en: "Three sources of capital, three sources of assets." }, volume: { fr: "Objectif : dépasser 100 M€", en: "Target: above €100M" } },
    vision: { capacite: { fr: "Un marché secondaire et des institutions branchées en direct.", en: "A secondary market and institutions plugged in directly." }, volume: { fr: "Road to 1 Md€", en: "Road to €1B" } },
  },
};

export const ECO_ITEMS: EcoItem[] = [
  // ── Capital : qui finance ────────────────────────────────────────────────
  {
    id: "network-builders", couche: "capital", ordre: 1, depuis: "b2b", validation: "signe",
    titre: { fr: "Network Builders", en: "Network Builders" },
    apporte: { fr: "Un réseau choisi d'apporteurs (brokers, banquiers privés, asset managers) : des introductions chaudes, pas de prospection de masse.", en: "A selected network of introducers (brokers, private bankers, asset managers): warm introductions, no mass prospecting." },
    preuve: { fr: "10 investisseurs qualifiés déjà introduits.", en: "10 qualified investors already introduced." },
    prochaineEtape: { fr: "Élargir le programme à vingt apporteurs actifs, Q4 2026.", en: "Grow the programme to twenty active introducers, Q4 2026." },
    aConfirmer: true,
  },
  {
    id: "minah-circles", couche: "capital", ordre: 2, depuis: "b2c", validation: "signe",
    titre: { fr: "Minah Circles", en: "Minah Circles" },
    apporte: { fr: "Nos événements propriétaires, une cinquantaine de personnes qualifiées par édition.", en: "Our proprietary events, around fifty qualified people per edition." },
    prochaineEtape: { fr: "Prochains hubs : Paris, Abidjan (en parallèle de l'Africa CEO Forum), Davos (en parallèle du WEF).", en: "Next hubs: Paris, Abidjan (alongside the Africa CEO Forum), Davos (alongside the WEF)." },
  },
  {
    id: "fonds-us", couche: "capital", ordre: 3, depuis: "b2b", validation: "pilote",
    titre: { fr: "Fonds américain, co-structuration Kupanda", en: "US fund, Kupanda co-structuring" },
    apporte: { fr: "Rencontré au Qatar ; co-structure le déploiement de Kupanda.", en: "Met in Qatar; co-structures the Kupanda deployment." },
    prochaineEtape: { fr: "Formaliser le rôle sur la prochaine émission.", en: "Formalise the role on the next issuance." },
    aConfirmer: true,
  },
  {
    id: "sereel", couche: "capital", ordre: 4, depuis: "b2b", validation: "pilote",
    titre: { fr: "Sereel", en: "Sereel" },
    apporte: { fr: "Premier protocole partenaire : il distribue les stratégies Minah à ses propres clients via l'API.", en: "First partner protocol: it distributes Minah strategies to its own clients through the API." },
    prochaineEtape: { fr: "Mise en production de l'intégration, mi-octobre 2026.", en: "Integration goes live, mid-October 2026." },
  },
  {
    id: "protocoles-suivants", couche: "capital", ordre: 5, depuis: "api_v1", validation: "discussion",
    titre: { fr: "Trois protocoles de distribution", en: "Three distribution protocols" },
    apporte: { fr: "Des protocoles DeFi institutionnels et de titrisation tokenisée, branchés sur le même modèle que le premier.", en: "Institutional DeFi and tokenised securitisation protocols, connected on the same model as the first." },
    prochaineEtape: { fr: "Décision attendue T1 2027.", en: "Decision expected Q1 2027." },
    aConfirmer: true,
  },
  {
    id: "allocataires-crypto", couche: "capital", ordre: 6, depuis: "api_v2", validation: "discussion",
    titre: { fr: "Allocataires crypto-natifs", en: "Crypto-native allocators" },
    apporte: { fr: "Investissent dans le vault qui prête aux fintechs : la liquidité crypto finance l'économie réelle.", en: "Invest in the vault that lends to fintechs: crypto liquidity funds the real economy." },
    aConfirmer: true,
  },
  // ── Sous-jacents : d'où viennent les actifs ──────────────────────────────
  {
    id: "zambie", couche: "sous_jacents", ordre: 1, depuis: "b2b", validation: "signe",
    titre: { fr: "République de Zambie", en: "Republic of Zambia" },
    apporte: { fr: "Contrat cadre signé : la contrepartie finale de la stratégie Kupanda est un État.", en: "Framework agreement signed: the final counterparty of the Kupanda strategy is a State." },
    preuve: { fr: "Le contrat cadre est dans la data room, niveau 2.", en: "The framework agreement is in the data room, level 2." },
  },
  {
    id: "kupanda", couche: "sous_jacents", ordre: 2, depuis: "b2b", validation: "signe",
    titre: { fr: "Kupanda, émission en cours", en: "Kupanda, current issuance" },
    apporte: { fr: "Obligation in fine de 2 M€, 12 mois, 20 % annuel, adossée à des contrats publics déjà attribués.", en: "€2M bullet bond, 12 months, 20% annual, backed by already-awarded public contracts." },
  },
  {
    id: "contrats-publics", couche: "sous_jacents", ordre: 3, depuis: "api_v1", validation: "discussion",
    titre: { fr: "Pipeline de contrats publics", en: "Public contract pipeline" },
    apporte: { fr: "Les prochaines stratégies : des PME titulaires de contrats publics dans d'autres pays de la région.", en: "The next strategies: SMEs holding public contracts in other countries of the region." },
    prochaineEtape: { fr: "Nouvelle stratégie de 15 à 20 M€ structurée sur la période.", en: "New €15M to €20M strategy structured over the period." },
    aConfirmer: true,
  },
  {
    id: "souverain", couche: "sous_jacents", ordre: 4, depuis: "api_v1", validation: "discussion",
    titre: { fr: "Émetteur de dette souveraine tokenisée", en: "Tokenised sovereign debt issuer" },
    apporte: { fr: "Ouvre le moteur de dette souveraine et place la trésorerie en attente en T-bills.", en: "Opens the sovereign debt engine and places idle treasury in T-bills." },
    aConfirmer: true,
  },
  {
    id: "fintechs", couche: "sous_jacents", ordre: 5, depuis: "api_v2", validation: "discussion",
    titre: { fr: "Fintechs africaines", en: "African fintechs" },
    apporte: { fr: "Emprunteuses du vault : déploiement direct, sans intermédiaire.", en: "Borrowers from the vault: direct deployment, no intermediary." },
    aConfirmer: true,
  },
  // ── Infrastructure : les rails ───────────────────────────────────────────
  {
    id: "stellar", couche: "infrastructure", ordre: 1, depuis: "fondations", validation: "signe", url: "https://stellar.org",
    titre: { fr: "Stellar", en: "Stellar" },
    apporte: { fr: "Rail d'émission et de règlement des obligations tokenisées.", en: "Issuance and settlement rail for tokenised bonds." },
  },
  {
    id: "fireblocks", couche: "infrastructure", ordre: 2, depuis: "fondations", validation: "signe", url: "https://www.fireblocks.com",
    titre: { fr: "Fireblocks", en: "Fireblocks" },
    apporte: { fr: "Custody institutionnelle et contrôle des transactions (KYT).", en: "Institutional custody and transaction screening (KYT)." },
  },
  {
    id: "sumsub", couche: "infrastructure", ordre: 3, depuis: "fondations", validation: "signe", url: "https://sumsub.com",
    titre: { fr: "Sumsub", en: "Sumsub" },
    apporte: { fr: "Vérification d'identité et conformité des investisseurs.", en: "Identity verification and investor compliance." },
  },
  {
    id: "canton", couche: "infrastructure", ordre: 4, depuis: "api_v1", validation: "pilote", url: "https://www.canton.network",
    titre: { fr: "Canton Network", en: "Canton Network" },
    apporte: { fr: "Second rail institutionnel, derrière la même abstraction multi-providers.", en: "Second institutional rail, behind the same multi-provider abstraction." },
    prochaineEtape: { fr: "Second provider branché et testé, décembre 2026.", en: "Second provider connected and tested, December 2026." },
  },
  {
    id: "rail-alternatif", couche: "infrastructure", ordre: 5, depuis: "api_v1", validation: "discussion",
    titre: { fr: "Rail alternatif d'émission", en: "Alternative issuance rail" },
    apporte: { fr: "Évalué pour l'émission ; choix du rail par stratégie.", en: "Under evaluation for issuance; rail chosen per strategy." },
    aConfirmer: true,
  },
  {
    id: "tbills-provider", couche: "infrastructure", ordre: 6, depuis: "api_v2", validation: "discussion",
    titre: { fr: "Fournisseur de T-bills tokenisés", en: "Tokenised T-bills provider" },
    apporte: { fr: "Place automatiquement la trésorerie en attente.", en: "Automatically places idle treasury." },
    prochaineEtape: { fr: "Deux acteurs en contact, décision 2027.", en: "Two players in contact, decision in 2027." },
    aConfirmer: true,
  },
  {
    id: "liquidite", couche: "infrastructure", ordre: 7, depuis: "vision", validation: "discussion",
    titre: { fr: "Places de liquidité (PT / YT, secondaire)", en: "Liquidity venues (PT / YT, secondary)" },
    apporte: { fr: "Marchés de taux on-chain et places de marché pour actifs privés tokenisés.", en: "On-chain yield markets and marketplaces for tokenised private assets." },
    aConfirmer: true,
  },
  // ── Institutions et cadre ────────────────────────────────────────────────
  {
    id: "titre-financier", couche: "institutions", ordre: 1, depuis: "fondations", validation: "signe",
    titre: { fr: "Structuration du titre (security token)", en: "Instrument structuring (security token)" },
    apporte: { fr: "Le titre reste un instrument financier : la tokenisation n'en change pas la nature juridique.", en: "The instrument remains a financial security: tokenisation does not change its legal nature." },
    aConfirmer: true,
  },
  {
    id: "banque-reglement", couche: "institutions", ordre: 2, depuis: "api_v1", validation: "discussion",
    titre: { fr: "Partenaire bancaire pour le règlement fiat", en: "Banking partner for fiat settlement" },
    apporte: { fr: "Entrées et sorties en euros pour les souscripteurs qui ne tiennent pas de wallet.", en: "Euro on- and off-ramps for subscribers who do not hold a wallet." },
    aConfirmer: true,
  },
  {
    id: "cadre-reglementaire", couche: "institutions", ordre: 3, depuis: "api_v1", validation: "discussion",
    titre: { fr: "Cadre réglementaire cible", en: "Target regulatory framework" },
    apporte: { fr: "Le statut ou l'enregistrement visé pour distribuer à l'échelle, et son calendrier. À préciser par l'équipe.", en: "The licence or registration targeted to distribute at scale, and its timeline. To be specified by the team." },
    aConfirmer: true,
  },
  // ── Tables et visibilité ─────────────────────────────────────────────────
  {
    id: "davos", couche: "tables", ordre: 1, depuis: "b2c", validation: "signe",
    titre: { fr: "Davos, en parallèle du WEF", en: "Davos, alongside the WEF" },
    apporte: { fr: "Là où se concentre le capital international ; un Minah Circle y est prévu.", en: "Where international capital gathers; a Minah Circle is planned there." },
  },
  {
    id: "africa-ceo-forum", couche: "tables", ordre: 2, depuis: "b2b", validation: "signe",
    titre: { fr: "Africa CEO Forum, Abidjan", en: "Africa CEO Forum, Abidjan" },
    apporte: { fr: "10 M€ de chiffre d'affaires minimum pour y accéder : un filtre sur le calibre des participants.", en: "€10M minimum revenue to attend: a filter on the calibre of participants." },
  },
  {
    id: "autres-tables", couche: "tables", ordre: 3, depuis: "b2b", validation: "signe",
    titre: { fr: "AFIS, Choiseul Afrique, TLG Capital, Web Summit, FT Africa Summit, ChangeNOW", en: "AFIS, Choiseul Africa, TLG Capital, Web Summit, FT Africa Summit, ChangeNOW" },
    apporte: { fr: "Les tables où Minah est invitée ; c'est à l'une d'elles qu'un fonds américain a rejoint Kupanda.", en: "The tables Minah is invited to; at one of them a US fund joined Kupanda." },
  },
];
