import type { Status } from "@/lib/roadmap/types";

// Roadmap écosystème, v2 du 04/10/2026. Deux axes :
//   - des PHASES DE CROISSANCE, lues en volume, pas en versions techniques ;
//   - des ZONES, géographiques ou de nature, où plusieurs choses se passent à
//     la fois : capital, actifs, partenaires, tables, cadre.
// BROUILLON : les entrées `aConfirmer` sont des hypothèses à valider par
// l'équipe. Règle de nommage : un partenaire en discussion n'est pas nommé.

export type Bilingual = { fr: string; en: string };

export type GrowthPhase = "amorcage" | "traction" | "distribution" | "echelle" | "marche";

export const GROWTH_PHASES: Array<{
  id: GrowthPhase;
  start: string;
  end: string;
  label: Bilingual;
  volume: Bilingual;
  /** La phase en une phrase : ce que l'écosystème rend possible. */
  tagline: Bilingual;
}> = [
  {
    id: "amorcage", start: "2025-01-01", end: "2026-01-31",
    label: { fr: "Amorçage", en: "Seeding" },
    volume: { fr: "Premières émissions, moins de 100 K€", en: "First issuances, under €100K" },
    tagline: { fr: "Les rails sont posés et les premiers souscripteurs viennent du réseau direct des fondateurs.", en: "The rails are laid and the first subscribers come from the founders' direct network." },
  },
  {
    id: "traction", start: "2026-02-01", end: "2027-03-31",
    label: { fr: "Traction", en: "Traction" },
    volume: { fr: "De 2 M€ à 15 M€", en: "€2M to €15M" },
    tagline: { fr: "Un État sous contrat, une machine à réseau formalisée, un premier protocole qui distribue.", en: "A State under contract, a formalised network machine, a first protocol distributing." },
  },
  {
    id: "distribution", start: "2027-04-01", end: "2027-12-31",
    label: { fr: "Distribution", en: "Distribution" },
    volume: { fr: "Nouvelle stratégie de 15 à 20 M€", en: "New strategy of €15M to €20M" },
    tagline: { fr: "Des tiers distribuent les stratégies : protocoles, second rail, partenaire bancaire.", en: "Third parties distribute the strategies: protocols, a second rail, a banking partner." },
  },
  {
    id: "echelle", start: "2028-01-01", end: "2028-12-31",
    label: { fr: "Échelle", en: "Scale" },
    volume: { fr: "Objectif : dépasser 100 M€", en: "Target: above €100M" },
    tagline: { fr: "Trois sources de capital, trois sources d'actifs, sur la même infrastructure.", en: "Three sources of capital, three sources of assets, on the same infrastructure." },
  },
  {
    id: "marche", start: "2029-01-01", end: "2029-12-31",
    label: { fr: "Marché", en: "Market" },
    volume: { fr: "Road to 1 Md€", en: "Road to €1B" },
    tagline: { fr: "Un marché secondaire, des institutions branchées en direct : Minah devient une couche de l'écosystème.", en: "A secondary market, institutions plugged in directly: Minah becomes a layer of the ecosystem." },
  },
];

export const ECO_TODAY = "2026-10-01";

export type Zone = "europe" | "golfe" | "afrique_ouest" | "afrique_australe" | "onchain";
export const ZONES: Zone[] = ["europe", "golfe", "afrique_ouest", "afrique_australe", "onchain"];

export const ZONE_META: Record<Zone, { label: Bilingual; sub: Bilingual; parPhase: Partial<Record<GrowthPhase, Bilingual>> }> = {
  europe: {
    label: { fr: "Europe et international", en: "Europe and international" },
    sub: { fr: "Le capital, le cadre, les tables", en: "Capital, framework, tables" },
    parPhase: {
      amorcage: { fr: "Les premiers souscripteurs sont des particuliers fortunés du réseau direct ; le titre est structuré.", en: "The first subscribers are wealthy individuals from the direct network; the instrument is structured." },
      traction: { fr: "Le réseau se formalise : Network Builders, Minah Circle à Paris, présence à Davos et aux sommets.", en: "The network takes shape: Network Builders, a Minah Circle in Paris, presence at Davos and the summits." },
      distribution: { fr: "Un partenaire bancaire pour le règlement en euros, et le cadre réglementaire cible.", en: "A banking partner for euro settlement, and the target regulatory framework." },
      echelle: { fr: "Fonds et institutions souscrivent en direct, par l'API.", en: "Funds and institutions subscribe directly, through the API." },
    },
  },
  golfe: {
    label: { fr: "Golfe", en: "Gulf" },
    sub: { fr: "Le capital institutionnel", en: "Institutional capital" },
    parPhase: {
      traction: { fr: "Un fonds américain rencontré au Qatar co-structure le déploiement de Kupanda.", en: "A US fund met in Qatar co-structures the Kupanda deployment." },
      echelle: { fr: "Le capital institutionnel du Golfe entre sur les stratégies souveraines.", en: "Gulf institutional capital comes in on the sovereign strategies." },
    },
  },
  afrique_ouest: {
    label: { fr: "Afrique de l'Ouest", en: "West Africa" },
    sub: { fr: "Les actifs, les tables régionales", en: "Assets, regional tables" },
    parPhase: {
      traction: { fr: "L'Africa CEO Forum à Abidjan filtre les contreparties ; le pipeline de contrats publics se construit.", en: "The Africa CEO Forum in Abidjan filters counterparties; the public contract pipeline is built." },
      distribution: { fr: "Un Minah Circle à Abidjan ; les prochaines stratégies viennent de PME titulaires de contrats publics.", en: "A Minah Circle in Abidjan; the next strategies come from SMEs holding public contracts." },
      echelle: { fr: "Les fintechs de la région empruntent au vault, sans intermédiaire.", en: "The region's fintechs borrow from the vault, without intermediary." },
    },
  },
  afrique_australe: {
    label: { fr: "Afrique australe", en: "Southern Africa" },
    sub: { fr: "La première stratégie", en: "The first strategy" },
    parPhase: {
      traction: { fr: "Kupanda : un contrat cadre signé avec la République de Zambie, une émission de 2 M€ en cours.", en: "Kupanda: a framework agreement signed with the Republic of Zambia, a €2M issuance under way." },
      distribution: { fr: "Deuxième émission sur le même cadre, à taille supérieure.", en: "Second issuance on the same framework, at a larger size." },
    },
  },
  onchain: {
    label: { fr: "On-chain", en: "On-chain" },
    sub: { fr: "Les rails, les protocoles, la liquidité", en: "Rails, protocols, liquidity" },
    parPhase: {
      amorcage: { fr: "Rail d'émission, custody institutionnelle et KYC sont sous contrat : les premières obligations sont tokenisées.", en: "Issuance rail, institutional custody and KYC are under contract: the first bonds are tokenised." },
      traction: { fr: "Sereel, premier protocole partenaire, distribue les stratégies via l'API.", en: "Sereel, the first partner protocol, distributes the strategies through the API." },
      distribution: { fr: "Un second rail institutionnel, trois protocoles de plus, un émetteur souverain tokenisé.", en: "A second institutional rail, three more protocols, a tokenised sovereign issuer." },
      echelle: { fr: "La liquidité crypto finance le vault ; la trésorerie en attente travaille en T-bills tokenisés.", en: "Crypto liquidity funds the vault; idle treasury works in tokenised T-bills." },
      marche: { fr: "Places de liquidité et marché secondaire : une position Minah se cède avant l'échéance.", en: "Liquidity venues and a secondary market: a Minah position can be sold before maturity." },
    },
  },
};

/** Ce que l'entrée est, dans la zone. */
export type Role = "capital" | "actifs" | "partenaire" | "table" | "cadre";
/** Hiérarchie de validation lue par les investisseurs, du plus fort au plus faible. */
export type Validation = "signe" | "loi" | "pilote" | "discussion";

export type EcoItem = {
  id: string;
  zone: Zone;
  role: Role;
  titre: Bilingual;
  /** Phase à partir de laquelle l'entrée compte. Avant : absente de la zone. */
  depuis: GrowthPhase;
  validation: Validation;
  apporte: Bilingual;
  preuve?: Bilingual;
  prochaineEtape?: Bilingual;
  url?: string;
  aConfirmer?: boolean;
};

export const VALIDATION_STATUS: Record<Validation, Status> = { signe: "livre", loi: "en_cours", pilote: "en_cours", discussion: "prevu" };

export const ECO_ITEMS: EcoItem[] = [
  // ── Europe et international ─────────────────────────────────────────────
  { id: "hnwi", zone: "europe", role: "capital", depuis: "amorcage", validation: "signe",
    titre: { fr: "Particuliers fortunés du réseau direct", en: "Wealthy individuals from the direct network" },
    apporte: { fr: "Les premiers souscripteurs, moins de 40 investisseurs.", en: "The first subscribers, under 40 investors." } },
  { id: "titre-financier", zone: "europe", role: "cadre", depuis: "amorcage", validation: "signe",
    titre: { fr: "Structuration du titre (security token)", en: "Instrument structuring (security token)" },
    apporte: { fr: "Le titre reste un instrument financier : la tokenisation n'en change pas la nature juridique.", en: "The instrument remains a financial security: tokenisation does not change its legal nature." }, aConfirmer: true },
  { id: "network-builders", zone: "europe", role: "capital", depuis: "traction", validation: "signe",
    titre: { fr: "Network Builders", en: "Network Builders" },
    apporte: { fr: "Un réseau choisi d'apporteurs : brokers, banquiers privés, asset managers. Des introductions chaudes.", en: "A selected network of introducers: brokers, private bankers, asset managers. Warm introductions." },
    preuve: { fr: "10 investisseurs qualifiés déjà introduits.", en: "10 qualified investors already introduced." },
    prochaineEtape: { fr: "Vingt apporteurs actifs, Q4 2026.", en: "Twenty active introducers, Q4 2026." }, aConfirmer: true },
  { id: "circle-paris", zone: "europe", role: "table", depuis: "traction", validation: "signe",
    titre: { fr: "Minah Circle, Paris", en: "Minah Circle, Paris" },
    apporte: { fr: "Notre événement propriétaire, une cinquantaine de personnes qualifiées par édition.", en: "Our proprietary event, around fifty qualified people per edition." } },
  { id: "davos", zone: "europe", role: "table", depuis: "traction", validation: "signe",
    titre: { fr: "Davos, en parallèle du WEF", en: "Davos, alongside the WEF" },
    apporte: { fr: "Là où se concentre le capital international ; un Minah Circle y est prévu.", en: "Where international capital gathers; a Minah Circle is planned there." } },
  { id: "sommets", zone: "europe", role: "table", depuis: "traction", validation: "signe",
    titre: { fr: "Web Summit, FT Africa Summit, ChangeNOW", en: "Web Summit, FT Africa Summit, ChangeNOW" },
    apporte: { fr: "Les tables européennes où Minah est invitée.", en: "The European tables Minah is invited to." } },
  { id: "banque-reglement", zone: "europe", role: "cadre", depuis: "distribution", validation: "discussion",
    titre: { fr: "Partenaire bancaire pour le règlement en euros", en: "Banking partner for euro settlement" },
    apporte: { fr: "Entrées et sorties en euros pour les souscripteurs qui ne tiennent pas de wallet.", en: "Euro on- and off-ramps for subscribers who do not hold a wallet." }, aConfirmer: true },
  { id: "cadre-reglementaire", zone: "europe", role: "cadre", depuis: "distribution", validation: "discussion",
    titre: { fr: "Cadre réglementaire cible", en: "Target regulatory framework" },
    apporte: { fr: "Le statut ou l'enregistrement visé pour distribuer à l'échelle, et son calendrier. À préciser par l'équipe.", en: "The licence or registration targeted to distribute at scale, and its timeline. To be specified by the team." }, aConfirmer: true },
  { id: "institutions-api", zone: "europe", role: "capital", depuis: "echelle", validation: "discussion",
    titre: { fr: "Fonds et institutions en direct", en: "Funds and institutions directly" },
    apporte: { fr: "Souscrivent par l'API, branchés sur leurs propres systèmes.", en: "Subscribe through the API, plugged into their own systems." }, aConfirmer: true },
  // ── Golfe ────────────────────────────────────────────────────────────────
  { id: "fonds-us", zone: "golfe", role: "capital", depuis: "traction", validation: "pilote",
    titre: { fr: "Fonds américain, co-structuration Kupanda", en: "US fund, Kupanda co-structuring" },
    apporte: { fr: "Rencontré au Qatar ; co-structure le déploiement de Kupanda.", en: "Met in Qatar; co-structures the Kupanda deployment." },
    prochaineEtape: { fr: "Formaliser le rôle sur la prochaine émission.", en: "Formalise the role on the next issuance." }, aConfirmer: true },
  { id: "capital-golfe", zone: "golfe", role: "capital", depuis: "echelle", validation: "discussion",
    titre: { fr: "Capital institutionnel du Golfe", en: "Gulf institutional capital" },
    apporte: { fr: "Entre sur les stratégies souveraines et les tickets de taille institutionnelle.", en: "Comes in on the sovereign strategies and institutional-size tickets." }, aConfirmer: true },
  // ── Afrique de l'Ouest ───────────────────────────────────────────────────
  { id: "africa-ceo-forum", zone: "afrique_ouest", role: "table", depuis: "traction", validation: "signe",
    titre: { fr: "Africa CEO Forum, Abidjan", en: "Africa CEO Forum, Abidjan" },
    apporte: { fr: "10 M€ de chiffre d'affaires minimum pour y accéder : un filtre sur le calibre des contreparties.", en: "€10M minimum revenue to attend: a filter on the calibre of counterparties." } },
  { id: "tables-afrique", zone: "afrique_ouest", role: "table", depuis: "traction", validation: "signe",
    titre: { fr: "AFIS, Choiseul Afrique, TLG Capital", en: "AFIS, Choiseul Africa, TLG Capital" },
    apporte: { fr: "Les tables régionales où se rencontrent capital et entreprises.", en: "The regional tables where capital and companies meet." } },
  { id: "circle-abidjan", zone: "afrique_ouest", role: "table", depuis: "distribution", validation: "loi",
    titre: { fr: "Minah Circle, Abidjan", en: "Minah Circle, Abidjan" },
    apporte: { fr: "En parallèle de l'Africa CEO Forum.", en: "Alongside the Africa CEO Forum." }, aConfirmer: true },
  { id: "contrats-publics", zone: "afrique_ouest", role: "actifs", depuis: "distribution", validation: "discussion",
    titre: { fr: "Pipeline de contrats publics", en: "Public contract pipeline" },
    apporte: { fr: "Les prochaines stratégies : des PME titulaires de contrats publics déjà attribués.", en: "The next strategies: SMEs holding already-awarded public contracts." },
    prochaineEtape: { fr: "Nouvelle stratégie de 15 à 20 M€ structurée sur la phase.", en: "New €15M to €20M strategy structured during the phase." }, aConfirmer: true },
  { id: "fintechs", zone: "afrique_ouest", role: "actifs", depuis: "echelle", validation: "discussion",
    titre: { fr: "Fintechs de la région", en: "Fintechs in the region" },
    apporte: { fr: "Emprunteuses du vault : déploiement direct, sans intermédiaire.", en: "Borrowers from the vault: direct deployment, no intermediary." }, aConfirmer: true },
  // ── Afrique australe ─────────────────────────────────────────────────────
  { id: "zambie", zone: "afrique_australe", role: "actifs", depuis: "traction", validation: "signe",
    titre: { fr: "République de Zambie", en: "Republic of Zambia" },
    apporte: { fr: "Contrat cadre signé : la contrepartie finale de la stratégie Kupanda est un État.", en: "Framework agreement signed: the final counterparty of the Kupanda strategy is a State." },
    preuve: { fr: "Le contrat cadre est dans la data room, niveau 2.", en: "The framework agreement is in the data room, level 2." } },
  { id: "kupanda", zone: "afrique_australe", role: "actifs", depuis: "traction", validation: "signe",
    titre: { fr: "Kupanda, émission en cours", en: "Kupanda, current issuance" },
    apporte: { fr: "Obligation in fine de 2 M€, 12 mois, 20 % annuel, adossée à des contrats publics déjà attribués.", en: "€2M bullet bond, 12 months, 20% annual, backed by already-awarded public contracts." } },
  { id: "kupanda-2", zone: "afrique_australe", role: "actifs", depuis: "distribution", validation: "discussion",
    titre: { fr: "Deuxième émission Kupanda", en: "Second Kupanda issuance" },
    apporte: { fr: "Même cadre, taille supérieure.", en: "Same framework, larger size." }, aConfirmer: true },
  // ── On-chain ─────────────────────────────────────────────────────────────
  { id: "stellar", zone: "onchain", role: "partenaire", depuis: "amorcage", validation: "signe", url: "https://stellar.org",
    titre: { fr: "Stellar", en: "Stellar" }, apporte: { fr: "Rail d'émission et de règlement des obligations tokenisées.", en: "Issuance and settlement rail for tokenised bonds." } },
  { id: "fireblocks", zone: "onchain", role: "partenaire", depuis: "amorcage", validation: "signe", url: "https://www.fireblocks.com",
    titre: { fr: "Fireblocks", en: "Fireblocks" }, apporte: { fr: "Custody institutionnelle et contrôle des transactions (KYT).", en: "Institutional custody and transaction screening (KYT)." } },
  { id: "sumsub", zone: "onchain", role: "partenaire", depuis: "amorcage", validation: "signe", url: "https://sumsub.com",
    titre: { fr: "Sumsub", en: "Sumsub" }, apporte: { fr: "Vérification d'identité et conformité des investisseurs.", en: "Identity verification and investor compliance." } },
  { id: "sereel", zone: "onchain", role: "partenaire", depuis: "traction", validation: "pilote",
    titre: { fr: "Sereel", en: "Sereel" },
    apporte: { fr: "Premier protocole partenaire : il distribue les stratégies Minah à ses propres clients via l'API.", en: "First partner protocol: it distributes Minah strategies to its own clients through the API." },
    prochaineEtape: { fr: "Mise en production de l'intégration, mi-octobre 2026.", en: "Integration goes live, mid-October 2026." } },
  { id: "canton", zone: "onchain", role: "partenaire", depuis: "distribution", validation: "pilote", url: "https://www.canton.network",
    titre: { fr: "Canton Network", en: "Canton Network" },
    apporte: { fr: "Second rail institutionnel, derrière la même abstraction multi-providers.", en: "Second institutional rail, behind the same multi-provider abstraction." },
    prochaineEtape: { fr: "Second provider branché et testé, décembre 2026.", en: "Second provider connected and tested, December 2026." } },
  { id: "protocoles-suivants", zone: "onchain", role: "partenaire", depuis: "distribution", validation: "discussion",
    titre: { fr: "Trois protocoles de distribution", en: "Three distribution protocols" },
    apporte: { fr: "DeFi institutionnelle et titrisation tokenisée, branchés sur le même modèle que le premier.", en: "Institutional DeFi and tokenised securitisation, connected on the same model as the first." },
    prochaineEtape: { fr: "Décision attendue T1 2027.", en: "Decision expected Q1 2027." }, aConfirmer: true },
  { id: "souverain", zone: "onchain", role: "actifs", depuis: "distribution", validation: "discussion",
    titre: { fr: "Émetteur de dette souveraine tokenisée", en: "Tokenised sovereign debt issuer" },
    apporte: { fr: "Ouvre le moteur de dette souveraine.", en: "Opens the sovereign debt engine." }, aConfirmer: true },
  { id: "allocataires-crypto", zone: "onchain", role: "capital", depuis: "echelle", validation: "discussion",
    titre: { fr: "Allocataires crypto-natifs", en: "Crypto-native allocators" },
    apporte: { fr: "Investissent dans le vault qui prête aux fintechs.", en: "Invest in the vault that lends to fintechs." }, aConfirmer: true },
  { id: "tbills-provider", zone: "onchain", role: "partenaire", depuis: "echelle", validation: "discussion",
    titre: { fr: "Fournisseur de T-bills tokenisés", en: "Tokenised T-bills provider" },
    apporte: { fr: "Place automatiquement la trésorerie en attente.", en: "Automatically places idle treasury." },
    prochaineEtape: { fr: "Deux acteurs en contact.", en: "Two players in contact." }, aConfirmer: true },
  { id: "liquidite", zone: "onchain", role: "partenaire", depuis: "marche", validation: "discussion",
    titre: { fr: "Places de liquidité (PT / YT, secondaire)", en: "Liquidity venues (PT / YT, secondary)" },
    apporte: { fr: "Marchés de taux on-chain et places de marché pour actifs privés tokenisés.", en: "On-chain yield markets and marketplaces for tokenised private assets." }, aConfirmer: true },
];
