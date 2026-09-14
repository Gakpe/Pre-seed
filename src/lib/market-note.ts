// Chapitres de la note. La liste sert à la fois au corps de la note et au fil
// d'Ariane latéral : un titre modifié à un seul endroit.
export const CHAPTERS = [
  {
    id: "note-01",
    num: "01",
    title: {
      fr: "Le continent où le crédit n'existe presque pas",
      en: "The continent where credit barely exists",
    },
  },
  {
    id: "note-02",
    num: "02",
    title: {
      fr: "Des taux qui devraient converger, et qui ne convergent pas",
      en: "Rates that ought to converge, and do not",
    },
  },
  {
    id: "note-03",
    num: "03",
    title: {
      fr: "La dette privée africaine est déjà en train de décoller",
      en: "African private debt is already taking off",
    },
  },
  {
    id: "note-04",
    num: "04",
    title: { fr: "Ce que nous en concluons", en: "What we conclude from it" },
  },
] as const;

// Données de la note de marché. La silhouette de l'Afrique est un polygone
// tiré de coordonnées réelles de côtes (projection équirectangulaire, viewBox
// 400 × 470) ; les frontières entre régions sont simplifiées.

/** Chaîne à traduire. La note vit en deux langues comme le reste de la fiche. */
export type Bi = { fr: string; en: string };

// side : libellé à gauche du point, quand deux villes voisines se chevauchent.
export type City = { n: Bi; r: string; x: number; y: number; side?: "left" };

export type Region = {
  id: string;
  name: Bi;
  low: number;
  high: number;
  color: string;
  path: string;
  cities: City[];
  note: { lead: Bi; body: Bi };
};

export const RATE_AXIS = { min: 0, max: 40, reference: 20 };

export const REGIONS: Region[] = [
  {
    id: "west",
    name: { fr: "Afrique de l'Ouest", en: "West Africa" },
    low: 8,
    high: 30,
    color: "#EE7A34",
    path: "M 161.0 230.9 L 160.4 221.6 L 153.9 218.4 L 140.9 220.0 L 134.3 209.7 L 126.2 208.6 L 114.3 210.2 L 96.9 217.3 L 83.3 215.1 L 67.0 219.4 L 56.2 214.0 L 45.8 205.9 L 36.1 197.2 L 27.9 185.8 L 17.1 176.0 L 14.9 163.5 L 18.7 155.4 L 20.3 143.4 L 18.1 137.5 L 15.4 129.3 L 42.6 126.6 L 80.6 121.2 L 124.0 137.5 L 172.9 121.2 L 227.2 137.5 L 189.2 178.2 L 186.5 216.2 Z",
    cities: [
      { n: { fr: "Abuja", en: "Abuja" }, r: "21,5 %", x: 148.5, y: 193.9 },
      { n: { fr: "Accra", en: "Accra" }, r: "25 %", x: 106.7, y: 212.9 },
    ],
    note: {
      lead: {
        fr: "La dispersion la plus forte du continent.",
        en: "The widest dispersion on the continent.",
      },
      body: {
        fr: "Le coût du crédit y dépend davantage de l'accès au prêteur que du risque réel de l'emprunteur.",
        en: "The cost of credit there depends more on access to a lender than on the borrower's actual risk.",
      },
    },
  },
  {
    id: "east",
    name: { fr: "Afrique de l'Est", en: "East Africa" },
    low: 13,
    high: 22,
    color: "#B4501A",
    path: "M 317.3 145.6 L 322.2 160.8 L 333.1 168.4 L 342.3 175.5 L 341.8 180.4 L 349.4 186.9 L 368.4 182.5 L 385.8 179.3 L 384.7 186.9 L 376.5 208.0 L 367.3 219.4 L 353.7 232.5 L 340.1 246.1 L 333.1 252.6 L 323.3 265.1 L 319.0 273.7 L 321.1 280.3 L 322.8 291.1 L 327.7 300.4 L 295.1 305.8 L 270.6 289.5 L 238.1 303.1 L 205.5 286.8 L 174.0 275.9 L 171.8 266.1 L 158.2 248.8 L 158.2 240.1 L 161.0 230.9 L 186.5 216.2 L 189.2 178.2 L 227.2 137.5 L 235.3 189.0 L 286.9 191.8 L 305.9 170.0 Z",
    cities: [
      { n: { fr: "Nairobi", en: "Nairobi" }, r: "14,8 %", x: 307.6, y: 250.4 },
      { n: { fr: "Kigali", en: "Kigali" }, r: "16 %", x: 271.2, y: 253.9, side: "left" },
    ],
    note: {
      lead: { fr: "La fourchette la plus resserrée,", en: "The tightest range," },
      body: {
        fr: "portée par des marchés bancaires plus profonds et une concurrence réelle entre prêteurs.",
        en: "carried by deeper banking markets and genuine competition between lenders.",
      },
    },
  },
  {
    id: "southern",
    name: { fr: "Afrique australe", en: "Southern Africa" },
    low: 11,
    high: 28,
    color: "#D2571A",
    path: "M 327.7 300.4 L 328.2 313.9 L 328.7 324.8 L 320.6 334.0 L 308.1 340.5 L 298.3 351.9 L 300.5 365.5 L 300.5 373.7 L 286.4 384.5 L 284.2 398.6 L 275.5 405.7 L 266.8 414.4 L 259.2 422.5 L 246.7 427.4 L 228.8 428.0 L 216.3 432.3 L 207.7 429.0 L 204.9 419.8 L 197.3 398.6 L 190.3 387.8 L 186.5 367.7 L 180.5 354.7 L 171.8 337.3 L 174.5 322.1 L 181.6 311.2 L 179.4 291.1 L 174.0 275.9 L 205.5 286.8 L 238.1 303.1 L 270.6 289.5 L 295.1 305.8 Z M 375.4 308.5 L 380.3 321.0 L 381.4 327.5 L 376.0 340.0 L 369.5 360.1 L 363.5 378.5 L 353.2 381.8 L 345.0 370.4 L 342.9 361.7 L 348.3 349.2 L 347.2 335.6 L 359.1 328.6 L 367.8 321.0 Z",
    cities: [
      { n: { fr: "Lusaka", en: "Lusaka" }, r: "28 %", x: 261.4, y: 327.0 },
      { n: { fr: "Pretoria", en: "Pretoria" }, r: "11 %", x: 260.9, y: 382.9 },
    ],
    note: {
      lead: { fr: "Deux marchés en un :", en: "Two markets in one:" },
      body: {
        fr: "un pôle sud-africain aux standards internationaux, et des marchés voisins où le crédit reste rare et cher.",
        en: "a South African hub at international standards, and neighbouring markets where credit stays scarce and expensive.",
      },
    },
  },
  {
    id: "north",
    name: { fr: "Afrique du Nord", en: "North Africa" },
    low: 5,
    high: 21,
    color: "#8A3B12",
    path: "M 15.4 129.3 L 24.7 111.4 L 29.0 101.1 L 37.1 92.9 L 48.0 88.6 L 54.5 83.2 L 55.6 75.0 L 57.8 66.9 L 70.8 58.7 L 76.2 48.9 L 96.9 52.7 L 124.0 43.5 L 151.2 43.0 L 164.8 41.3 L 167.5 50.0 L 163.1 58.7 L 170.2 63.6 L 179.4 64.7 L 191.4 71.8 L 205.5 77.7 L 216.3 73.4 L 218.0 67.4 L 229.9 65.2 L 243.5 70.7 L 270.1 73.9 L 283.1 73.4 L 284.8 81.0 L 292.4 95.6 L 301.0 113.6 L 309.7 136.9 L 317.3 145.6 L 305.9 170.0 L 286.9 191.8 L 235.3 189.0 L 227.2 137.5 L 172.9 121.2 L 124.0 137.5 L 80.6 121.2 L 42.6 126.6 Z",
    cities: [{ n: { fr: "Le Caire", en: "Cairo" }, r: "21 %", x: 277.2, y: 80.4 }],
    note: {
      lead: {
        fr: "Les taux nominaux les plus bas du continent,",
        en: "The lowest nominal rates on the continent,",
      },
      body: {
        fr: "mais une inflation qui en absorbe une large part.",
        en: "but inflation absorbs a large share of them.",
      },
    },
  },
];

export const MAP_RESTING_NOTE: Bi = {
  fr: "Une PME africaine emprunte entre 8 % et 30 % selon la région et l'accès qu'elle a à un prêteur. La dispersion à l'intérieur d'une même zone est souvent plus forte qu'entre deux continents.",
  en: "An African SME borrows at between 8% and 30% depending on the region and the access it has to a lender. Dispersion within a single zone is often wider than between two continents.",
};

// --- Paysage de la dette privée : positionnement par classe d'instrument ---

export type PeerGroup = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  names: string[];
  muted?: string;
};

export const LANDSCAPE = {
  bands: [
    { cx: 163, label: { fr: "Private equity", en: "Private equity" } },
    { cx: 330, label: { fr: "Dette mezzanine", en: "Mezzanine debt" } },
    { cx: 490, label: { fr: "Venture & dette mixte", en: "Venture & blended debt" } },
    { cx: 650, label: { fr: "Dette senior", en: "Senior debt" } },
    { cx: 810, label: { fr: "Dette senior sécurisée", en: "Secured senior debt" } },
  ],
  separators: [250, 410, 570, 730],
  // Axe : 0 % en y=404, 20 % en y=77.
  ticks: [
    { v: 0, y: 404 },
    { v: 5, y: 322 },
    { v: 10, y: 240 },
    { v: 15, y: 159 },
    { v: 20, y: 77 },
  ],
  groups: [
    { cx: 163, cy: 112, rx: 82, ry: 62, names: ["AfricInvest", "Helios", "DPI", "Partech", "SPE Capital"] },
    { cx: 330, cy: 171, rx: 72, ry: 40, names: ["BluePeak", "Vantage Capital"] },
    { cx: 490, cy: 187, rx: 62, ry: 26, names: ["Lendable"], muted: "venture debt" },
    { cx: 490, cy: 288, rx: 70, ry: 46, names: ["Verdant Capital", "Gemcorp", "Triple Jump"] },
    { cx: 650, cy: 292, rx: 76, ry: 58, names: ["Symbiotics", "XSML", "Scipion", "Ninety One", "Mirova"] },
    { cx: 810, cy: 150, rx: 74, ry: 46, names: ["TLG Capital", "Enko Capital", "Cauris Finance"] },
  ] as PeerGroup[],
  minah: { x: 758, y: 208, w: 104, h: 30 },
};

// --- Sources : la traçabilité des chiffres fait partie de la crédibilité.
// Les mentions « À vérifier » restent visibles tant que rien n'est confirmé.
export type Source = { text: Bi; toVerify?: Bi };

export const SOURCES: Source[] = [
  {
    text: {
      fr: "Crédit intérieur au secteur privé (% du PIB), Banque mondiale, indicateur FS.AST.PRVT.GD.ZS.",
      en: "Domestic credit to the private sector (% of GDP), World Bank, indicator FS.AST.PRVT.GD.ZS.",
    },
    toVerify: {
      fr: "confirmer la valeur exacte pour l'Afrique subsaharienne sur le dernier millésime disponible, ainsi que les comparatifs monde et Asie de l'Est, avant publication.",
      en: "confirm the exact figure for sub-Saharan Africa on the latest available vintage, along with the world and East Asia comparators, before publication.",
    },
  },
  {
    text: {
      fr: "Nombre d'exits, durée de détention, part des acheteurs industriels, introductions en bourse, intentions des LPs, AVCA, 2025 African Private Capital Activity Report et couverture associée.",
      en: "Exit count, holding period, share of trade buyers, IPOs, LP intentions, AVCA, 2025 African Private Capital Activity Report and related coverage.",
    },
  },
  {
    text: {
      fr: "Croissance du volume d'opérations de dette privée (+57 %), venture debt (1,8 Md $), capital privé total (5,1 Md $ sur 530 opérations), AVCA, mêmes sources.",
      en: "Growth in private debt deal volume (+57%), venture debt (US$1.8bn), total private capital (US$5.1bn across 530 deals), AVCA, same sources.",
    },
  },
  {
    text: {
      fr: "Taux d'intérêt PME par région et par ville, compilation interne Minah.",
      en: "SME interest rates by region and city, Minah internal compilation.",
    },
    toVerify: {
      fr: "préciser la méthodologie et la date de collecte, sans quoi ces chiffres seront contestés en due diligence.",
      en: "state the methodology and the collection date, failing which these figures will be challenged in due diligence.",
    },
  },
  {
    text: {
      fr: "Fourchettes de rendement par classe d'instrument et positionnement des acteurs, issu d'une cartographie de marché de type AGIF II.",
      en: "Return ranges by instrument class and player positioning, from an AGIF II-style market mapping.",
    },
    toVerify: {
      fr: "confirmer les droits de reproduction, ou reconstruire nos propres fourchettes à partir de sources publiques.",
      en: "confirm reproduction rights, or rebuild our own ranges from public sources.",
    },
  },
];
