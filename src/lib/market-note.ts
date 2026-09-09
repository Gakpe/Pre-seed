// Données de la note de marché. Tracés SVG et valeurs repris du prototype
// validé ; la silhouette de l'Afrique est stylisée, c'est assumé.

export type City = { n: string; r: string; x: number; y: number };

export type Region = {
  id: string;
  name: string;
  low: number;
  high: number;
  color: string;
  path: string;
  cities: City[];
  note: { lead: string; body: string };
};

export const RATE_AXIS = { min: 0, max: 40, reference: 20 };

export const REGIONS: Region[] = [
  {
    id: "west",
    name: "Afrique de l'Ouest",
    low: 8,
    high: 30,
    color: "#EE7A34",
    path: "M 34 150 L 62 150 L 130 158 L 200 162 L 218 205 L 224 255 L 218 292 L 178 292 L 172 262 L 178 238 L 152 232 L 118 236 L 92 226 L 68 206 L 52 180 L 36 164 Z",
    cities: [
      { n: "Abuja", r: "21,5 %", x: 168, y: 214 },
      { n: "Accra", r: "25 %", x: 126, y: 230 },
    ],
    note: {
      lead: "La dispersion la plus forte du continent.",
      body: "Le coût du crédit y dépend davantage de l'accès au prêteur que du risque réel de l'emprunteur.",
    },
  },
  {
    id: "east",
    name: "Afrique de l'Est",
    low: 13,
    high: 22,
    color: "#B4501A",
    path: "M 200 162 L 275 160 L 348 152 L 372 172 L 388 178 L 366 198 L 352 226 L 340 258 L 330 288 L 262 290 L 218 292 L 224 255 L 218 205 Z",
    cities: [
      { n: "Nairobi", r: "14,8 %", x: 330, y: 262 },
      { n: "Kigali", r: "16 %", x: 288, y: 250 },
    ],
    note: {
      lead: "La fourchette la plus resserrée,",
      body: "portée par des marchés bancaires plus profonds et une concurrence réelle entre prêteurs.",
    },
  },
  {
    id: "southern",
    name: "Afrique australe",
    low: 11,
    high: 28,
    color: "#D2571A",
    path: "M 178 292 L 218 292 L 262 290 L 330 288 L 318 322 L 298 362 L 270 400 L 240 428 L 216 436 L 196 418 L 184 386 L 174 348 L 168 314 Z",
    cities: [
      { n: "Lusaka", r: "28 %", x: 268, y: 326 },
      { n: "Pretoria", r: "11 %", x: 250, y: 392 },
    ],
    note: {
      lead: "Deux marchés en un :",
      body: "un pôle sud-africain aux standards internationaux, et des marchés voisins où le crédit reste rare et cher.",
    },
  },
  {
    id: "north",
    name: "Afrique du Nord",
    low: 5,
    high: 21,
    color: "#8A3B12",
    path: "M 50 105 L 105 72 L 185 62 L 255 68 L 305 78 L 328 95 L 340 130 L 348 152 L 275 160 L 200 162 L 130 158 L 62 150 Z",
    cities: [{ n: "Le Caire", r: "21 %", x: 300, y: 108 }],
    note: {
      lead: "Les taux nominaux les plus bas du continent,",
      body: "mais une inflation qui en absorbe une large part.",
    },
  },
];

export const MAP_RESTING_NOTE =
  "Une PME africaine emprunte entre 8 % et 30 % selon la région et l'accès qu'elle a à un prêteur. La dispersion à l'intérieur d'une même zone est souvent plus forte qu'entre deux continents.";

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
    { cx: 163, label: "Private equity" },
    { cx: 330, label: "Dette mezzanine" },
    { cx: 490, label: "Venture & dette mixte" },
    { cx: 650, label: "Dette senior" },
    { cx: 810, label: "Dette senior sécurisée" },
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
export type Source = { text: string; toVerify?: string };

export const SOURCES: Source[] = [
  {
    text: "Crédit intérieur au secteur privé (% du PIB), Banque mondiale, indicateur FS.AST.PRVT.GD.ZS.",
    toVerify:
      "confirmer la valeur exacte pour l'Afrique subsaharienne sur le dernier millésime disponible, ainsi que les comparatifs monde et Asie de l'Est, avant publication.",
  },
  {
    text: "Nombre d'exits, durée de détention, part des acheteurs industriels, introductions en bourse, intentions des LPs, AVCA, 2025 African Private Capital Activity Report et couverture associée.",
  },
  {
    text: "Croissance du volume d'opérations de dette privée (+57 %), venture debt (1,8 Md $), capital privé total (5,1 Md $ sur 530 opérations), AVCA, mêmes sources.",
  },
  {
    text: "Taux d'intérêt PME par région et par ville, compilation interne Minah.",
    toVerify:
      "préciser la méthodologie et la date de collecte, sans quoi ces chiffres seront contestés en due diligence.",
  },
  {
    text: "Fourchettes de rendement par classe d'instrument et positionnement des acteurs, issu d'une cartographie de marché de type AGIF II.",
    toVerify:
      "confirmer les droits de reproduction, ou reconstruire nos propres fourchettes à partir de sources publiques.",
  },
];
