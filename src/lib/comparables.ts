// Fiche « Comparables et positionnement » : la matrice de la slide « Comparables
// & Valuation » du deck pre-seed (annexe 2), portée en page de niveau 1 le
// 04/10/2026. Deux axes : on-chain / off-chain, global ou émergents / Afrique.
// Trois groupes de comparables, Minah seule dans le quadrant on-chain Afrique.
// Les logos sont servis en local (public/comparables) ; sans fichier, le nom.

export type Bilingual = { fr: string; en: string };
export type GroupId = "A" | "B" | "C";

export type Player = { name: string; logo?: string; note?: Bilingual };

export type Group = {
  id: GroupId;
  /** Quadrant : y haut = on-chain, x droite = Afrique. */
  quadrant: { onChain: boolean; africa: boolean };
  title: Bilingual;
  size?: Bilingual;
  summary: Bilingual;
  /** Ce qui caractérise le groupe, mis en avant au survol. */
  traits: Bilingual[];
  /** Ce qui lui manque face au besoin que Minah adresse. */
  gaps: Bilingual[];
  players: Player[];
};

export const GROUPS: Group[] = [
  {
    id: "A",
    quadrant: { onChain: true, africa: false },
    title: { fr: "Crédit privé on-chain, global et marchés émergents", en: "On-chain private credit, global and emerging markets" },
    size: { fr: "500 Md€", en: "€500B" },
    summary: {
      fr: "Les acteurs du prêt on-chain adossé à des actifs réels sont en plein essor, mais aucun ne se concentre sur l'Afrique. Les deux seuls noms actifs à proximité, Jia et Oval, visent surtout l'Asie et les paiements.",
      en: "On-chain real-world-asset lenders are booming, yet none focuses on Africa. The only two active names nearby, Jia and Oval, target mainly Asia and payments.",
    },
    traits: [
      { fr: "Financent des fintechs prêteuses des marchés émergents", en: "Fund fintech lenders in emerging markets" },
      { fr: "Rails tokenisés, tickets accessibles, liquidité on-chain", en: "Tokenised rails, accessible tickets, on-chain liquidity" },
      { fr: "Croissance rapide, capital crypto-natif", en: "Fast growth, crypto-native capital" },
    ],
    gaps: [
      { fr: "Aucune structuration régulée pour l'Afrique", en: "No regulated structuring for Africa" },
      { fr: "Pas d'origination africaine : pas de contrats publics, pas d'États en contrepartie", en: "No African origination: no public contracts, no States as counterparties" },
    ],
    players: [
      { name: "Centrifuge", logo: "/comparables/centrifuge.png" },
      { name: "Goldfinch", logo: "/comparables/goldfinch.png" },
      { name: "Maple", logo: "/comparables/maple.png" },
      { name: "Credix", logo: "/comparables/credix.png" },
      { name: "Untangled", logo: "/comparables/untangled.png" },
      { name: "Jia", logo: "/comparables/jia.png", note: { fr: "Asie", en: "Asia" } },
      { name: "Oval", note: { fr: "paiements", en: "payments" } },
    ],
  },
  {
    id: "B",
    quadrant: { onChain: false, africa: false },
    title: { fr: "Crédit privé institutionnel, global", en: "Institutional private credit, global" },
    summary: {
      fr: "Les grands acteurs du crédit privé sont connus et en forte expansion, sans prêter beaucoup d'attention aux marchés émergents.",
      en: "The major private credit players are well known and expanding fast, without paying much attention to emerging markets.",
    },
    traits: [
      { fr: "Capacité de déploiement considérable, marques installées", en: "Considerable deployment capacity, established brands" },
      { fr: "Produits pour institutionnels, tickets élevés", en: "Products for institutions, high tickets" },
    ],
    gaps: [
      { fr: "L'Afrique reste marginale dans l'allocation", en: "Africa remains marginal in allocation" },
      { fr: "Aucun rail digital, aucune souscription en ligne", en: "No digital rail, no online subscription" },
    ],
    players: [
      { name: "Blackstone Credit", logo: "/comparables/blackstone.png" },
      { name: "Ares", logo: "/comparables/ares.png" },
      { name: "Fonds marchés émergents", note: { fr: "catégorie", en: "category" } },
    ],
  },
  {
    id: "C",
    quadrant: { onChain: false, africa: true },
    title: { fr: "Dette privée africaine, hors chaîne", en: "African private debt, off-chain" },
    summary: {
      fr: "Les acteurs de pure dette privée sur le marché africain sont rares, et tous font partie de notre réseau proche. Aucun n'utilise de technologie nouvelle dans ses produits financiers.",
      en: "Pure private debt players in the African market are scarce, and all sit within our close network. None of them leverages new technology in their financial products.",
    },
    traits: [
      { fr: "Connaissance du terrain et des contreparties africaines", en: "Knowledge of the field and of African counterparties" },
      { fr: "Fonds institutionnels, cycles longs", en: "Institutional funds, long cycles" },
      { fr: "Tous dans notre réseau proche", en: "All within our close network" },
    ],
    gaps: [
      { fr: "Réservés aux institutionnels, tickets élevés", en: "Institutional-only, high tickets" },
      { fr: "Pas de rails digitaux, pas de liquidité", en: "No digital rails, no liquidity" },
    ],
    players: [
      { name: "Cauris Finance", logo: "/comparables/cauris.png" },
      { name: "TLG Capital", logo: "/comparables/tlg.png" },
      { name: "Enko Capital", logo: "/comparables/enko.png" },
      { name: "AfricInvest" },
      { name: "BluePeak" },
    ],
  },
];

export const MINAH_POSITION: { title: Bilingual; lines: Bilingual[]; traits: Bilingual[] } = {
  title: { fr: "Le positionnement de Minah", en: "Minah's positioning" },
  lines: [
    { fr: "Le crédit privé on-chain (Goldfinch, Credix, Maple, Centrifuge) finance des fintechs prêteuses des marchés émergents ; aucun n'offre de structuration régulée pour l'Afrique.", en: "On-chain private credit (Goldfinch, Credix, Maple, Centrifuge) funds EM fintech lenders; none offers African regulated structuring." },
    { fr: "Les fonds de dette privée africains (AfricInvest, TLG, BluePeak) sont réservés aux institutionnels : pas de rails digitaux, tickets élevés.", en: "African private credit funds (AfricInvest, TLG, BluePeak) are institutional-only: no digital rails, high tickets." },
    { fr: "Minah combine les deux : un accès régulé en Europe, une origination africaine, des rails tokenisés, des tickets accessibles.", en: "Minah combines both: EU-regulated access, African origination, tokenised rails, accessible tickets." },
  ],
  traits: [
    { fr: "Accès régulé en Europe", en: "EU-regulated access" },
    { fr: "Origination africaine", en: "African origination" },
    { fr: "Rails tokenisés", en: "Tokenised rails" },
    { fr: "Tickets accessibles", en: "Accessible tickets" },
  ],
};

export const AXES = {
  top: { fr: "Finance on-chain", en: "On-chain finance" },
  bottom: { fr: "Hors chaîne", en: "Off-chain" },
  left: { fr: "Global et marchés émergents", en: "Global and emerging markets" },
  right: { fr: "Afrique", en: "Africa-focused" },
};

// ── Comparables de valorisation ───────────────────────────────────────────────
// Deux grilles de lecture, et Minah entre les deux : la trajectoire d'une
// plateforme on-chain, le modèle de revenus d'un gérant de dette privée.
export const VALUATION: {
  title: Bilingual;
  lead: Bilingual;
  columns: Array<{ id: "onchain" | "funds" | "minah"; title: Bilingual; sub: Bilingual; points: Bilingual[]; verdict: Bilingual }>;
  closing: Bilingual;
} = {
  title: { fr: "Comparables de valorisation", en: "Valuation comparables" },
  lead: {
    fr: "Minah se lit avec deux grilles à la fois. Par sa structure de coûts et sa distribution, c'est une plateforme on-chain : le marché valorise ces acteurs pour leur croissance. Par son modèle de revenus et la nature de ses actifs, c'est un gérant de dette privée : le marché valorise ceux-là pour leur résilience. Nous avons les deux moteurs, et nous demandons à être lus avec les deux grilles.",
    en: "Minah reads through two lenses at once. By its cost structure and distribution, it is an on-chain platform: the market values those players for growth. By its revenue model and the nature of its assets, it is a private debt manager: the market values those for resilience. We have both engines, and we ask to be read through both lenses.",
  },
  columns: [
    {
      id: "onchain",
      title: { fr: "Prêteurs on-chain des marchés émergents", en: "On-chain lenders in emerging markets" },
      sub: { fr: "La grille de la croissance", en: "The growth lens" },
      points: [
        { fr: "Rails tokenisés : émission, règlement et suivi sans infrastructure propre", en: "Tokenised rails: issuance, settlement and tracking without proprietary infrastructure" },
        { fr: "Distribution par API : chaque partenaire branché élargit le réseau sans coût marginal notable", en: "Distribution through APIs: every connected partner widens the network at little marginal cost" },
        { fr: "Capital crypto-natif, liquidité de marché, croissance rapide des encours", en: "Crypto-native capital, market liquidity, fast growth in assets" },
      ],
      verdict: { fr: "Ce que Minah partage avec eux : la scalabilité.", en: "What Minah shares with them: scalability." },
    },
    {
      id: "funds",
      title: { fr: "Fonds de dette privée traditionnels", en: "Traditional private debt funds" },
      sub: { fr: "La grille de la résilience", en: "The resilience lens" },
      points: [
        { fr: "Revenus récurrents et prévisibles : frais à la souscription, frais de performance sur les flux de retour", en: "Recurring, predictable revenue: subscription fees, performance fees on return flows" },
        { fr: "Actifs sécurisés, horizon long, contreparties connues, cascade de protections", en: "Secured assets, long horizon, known counterparties, a cascade of protections" },
        { fr: "Un modèle éprouvé sur plusieurs cycles de crédit", en: "A model proven over several credit cycles" },
      ],
      verdict: { fr: "Ce que Minah partage avec eux : le modèle de revenus et la discipline de risque.", en: "What Minah shares with them: the revenue model and the risk discipline." },
    },
    {
      id: "minah",
      title: { fr: "Minah", en: "Minah" },
      sub: { fr: "Les deux moteurs", en: "Both engines" },
      points: [
        { fr: "La base de coûts et la distribution d'une plateforme on-chain", en: "The cost base and distribution of an on-chain platform" },
        { fr: "Le modèle de revenus et les actifs d'un gérant de dette privée", en: "The revenue model and assets of a private debt manager" },
        { fr: "Une origination africaine que ni les uns ni les autres n'ont", en: "African origination that neither of the two has" },
      ],
      verdict: { fr: "La scalabilité de l'un, la résilience de l'autre : c'est la thèse de valorisation.", en: "The scalability of one, the resilience of the other: that is the valuation thesis." },
    },
  ],
  closing: {
    fr: "Concrètement : une fintech d'infrastructure dont les revenus se comportent comme ceux d'un gérant d'actifs. Le premier terme justifie un multiple de plateforme ; le second en réduit le risque.",
    en: "Concretely: an infrastructure fintech whose revenue behaves like an asset manager's. The first term supports a platform multiple; the second lowers its risk.",
  },
};
