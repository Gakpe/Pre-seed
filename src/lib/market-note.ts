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

// Données de la note de marché. Tracés SVG et valeurs repris du prototype
// validé ; la silhouette de l'Afrique est stylisée, c'est assumé.

/** Chaîne à traduire. La note vit en deux langues comme le reste de la fiche. */
export type Bi = { fr: string; en: string };

export type City = { n: Bi; r: string; x: number; y: number };

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
    path: "M 34 150 L 62 150 L 130 158 L 200 162 L 218 205 L 224 255 L 218 292 L 178 292 L 172 262 L 178 238 L 152 232 L 118 236 L 92 226 L 68 206 L 52 180 L 36 164 Z",
    cities: [
      { n: { fr: "Abuja", en: "Abuja" }, r: "21,5 %", x: 168, y: 214 },
      { n: { fr: "Accra", en: "Accra" }, r: "25 %", x: 126, y: 230 },
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
    path: "M 200 162 L 275 160 L 348 152 L 372 172 L 388 178 L 366 198 L 352 226 L 340 258 L 330 288 L 262 290 L 218 292 L 224 255 L 218 205 Z",
    cities: [
      { n: { fr: "Nairobi", en: "Nairobi" }, r: "14,8 %", x: 330, y: 262 },
      { n: { fr: "Kigali", en: "Kigali" }, r: "16 %", x: 288, y: 250 },
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
    path: "M 178 292 L 218 292 L 262 290 L 330 288 L 318 322 L 298 362 L 270 400 L 240 428 L 216 436 L 196 418 L 184 386 L 174 348 L 168 314 Z",
    cities: [
      { n: { fr: "Lusaka", en: "Lusaka" }, r: "28 %", x: 268, y: 326 },
      { n: { fr: "Pretoria", en: "Pretoria" }, r: "11 %", x: 250, y: 392 },
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
    path: "M 50 105 L 105 72 L 185 62 L 255 68 L 305 78 L 328 95 L 340 130 L 348 152 L 275 160 L 200 162 L 130 158 L 62 150 Z",
    cities: [{ n: { fr: "Le Caire", en: "Cairo" }, r: "21 %", x: 300, y: 108 }],
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
