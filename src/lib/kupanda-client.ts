// Contenu de la fiche « Due diligence Kupanda » hors panneaux : la simulation
// sur les deux émissions, la rotation du capital, les scénarios « que se
// passe-t-il si… » et les deux pays. Ajouté le 30/10/2026 depuis le mémorandum
// d'investissement (Coralie), aligné le 19/11/2026 sur la dataroom Kupanda du
// front (minah-front-v0.1, src/server/dataroom/kupanda/content.js). Rien ici ne
// répète les panneaux de la fiche (src/lib/kupanda-dd.ts) ni la cascade de
// risque (src/lib/risk-levels.ts).
//
// Le Q&A d'un family office (un lien DocSend par langue) a été retiré de la
// fiche à la demande de Julien : ne pas le remettre.

import type { Bi } from "@/lib/kupanda-dd";

// --- Kupanda 1 ferme le 1er décembre 2026 ---------------------------------------
// Bascule automatique (Julien, 19/11/2026) : à partir du 2 décembre, heure de
// Paris, la fiche dit que Kupanda 1 est close et la simulation ne porte plus
// que sur Kupanda 2. Les formulations « close » sont de la rédaction du
// portail, pas du front : à relire par Julien.

/** Le 2 décembre 2026 à 00:00, heure de Paris (UTC+1 en hiver). */
export const K1_CLOSES_AT = Date.UTC(2026, 11, 1, 23, 0);

export const isK1Closed = (now: number = Date.now()): boolean => now >= K1_CLOSES_AT;

/** Ce que la fiche dit avant et après la clôture : `open` est le texte du front. */
export const K1_CLOSURE: Record<"lead" | "minahLabel" | "seriesStatus" | "seriesBody", { open: Bi; closed: Bi }> = {
  lead: {
    open: { fr: "est ouverte jusqu'au 1er décembre 2026", en: "is open until 1 December 2026" },
    closed: { fr: "est close depuis le 1er décembre 2026", en: "closed on 1 December 2026" },
  },
  minahLabel: {
    open: { fr: "Kupanda 1, jusqu'au 1er décembre 2026", en: "Kupanda 1, until 1 December 2026" },
    closed: { fr: "Kupanda 1, close le 1er décembre 2026", en: "Kupanda 1, closed on 1 December 2026" },
  },
  seriesStatus: {
    open: { fr: "En cours", en: "Live" },
    closed: { fr: "Close", en: "Closed" },
  },
  seriesBody: {
    open: { fr: "Ouverte jusqu'au 1er décembre 2026", en: "Open until 1 December 2026" },
    closed: { fr: "Close depuis le 1er décembre 2026", en: "Closed on 1 December 2026" },
  },
};

// --- La simulation (onglet) ----------------------------------------------------
// Deux émissions : la taille, le nominal, le minimum, le seuil d'appel et le
// coupon changent. Termes tranchés par Julien le 19/11/2026, ceux qu'il avait
// donnés le 11/11 pour la salle Silver Birch : Kupanda 2 à 18 % brut, 3,5 % de
// frais, 14,5 % net ; Kupanda 1 à 20 % brut, 3,5 % de frais, 16,5 % net. (La
// salle Kupanda du front calcule encore Kupanda 2 à 20 % et 5,5 % de frais.)
// Coupon versé en deux fois (6 mois, échéance), frais prélevés à la
// souscription ; le rendement net rapporte le gain après frais au capital
// déployé.
// `committed` : déjà engagé, confirmé par Julien le 19/11/2026 (1 M€ sur
// Kupanda 1, 3 M€ sur Kupanda 2). La simulation s'arrête à ce qui reste : pour
// Kupanda 2, 233 obligations de 30 000 € (6 990 000 €), on ne vend pas le tiers
// d'obligation qui manque pour faire le compte rond.

export type Issue = {
  id: "k1" | "k2";
  name: string;
  faceValue: number;
  size: number;
  committed: number;
  /** Seuil d'appel du capital. */
  threshold: number;
  couponRate: number;
  feeRate: number;
  minBonds: number;
  defaultBonds: number;
  /** Paliers ronds ; le curseur monte quand même jusqu'au maximum réel. */
  presets: number[];
  note: Bi;
  /** Mention sous le choix de l'émission, quand elle est sélectionnée. */
  hint?: Bi;
};

// Dans l'ordre de l'affichage : Kupanda 2, celle qui recueille les engagements,
// s'ouvre par défaut.
export const ISSUES: Issue[] = [
  {
    id: "k2",
    name: "Kupanda 2",
    faceValue: 30_000,
    size: 10_000_000,
    committed: 3_000_000,
    threshold: 500_000,
    couponRate: 0.18,
    feeRate: 0.035,
    minBonds: 1,
    defaultBonds: 4,
    presets: [4, 10, 50, 100, 200],
    note: { fr: "10 M€, dont 3 M€ déjà engagés, premier closing en janvier 2027", en: "€10M, €3M already committed, first closing in January 2027" },
  },
  {
    id: "k1",
    name: "Kupanda 1",
    faceValue: 10_000,
    size: 2_000_000,
    committed: 1_000_000,
    threshold: 200_000,
    couponRate: 0.2,
    feeRate: 0.035,
    minBonds: 3,
    defaultBonds: 3,
    presets: [3, 5, 10, 30, 100],
    note: { fr: "Il reste 1 M€ sur 2 M€, jusqu'au 1er décembre 2026", en: "€1M left of €2M, until 1 December 2026" },
    hint: { fr: "Il ne reste que 1 M€ sur Kupanda 1 : pour vous y positionner, avancez avant le 1er décembre 2026.", en: "Only €1M is left on Kupanda 1: to secure a position, move ahead before 1 December 2026." },
  },
];

/** Les obligations encore disponibles : ce qui reste une fois retiré le déjà engagé. */
export const maxBondsOf = (issue: Issue): number => Math.floor((issue.size - issue.committed) / issue.faceValue);

export type Simulation = {
  bonds: number;
  capital: number;
  fees: number;
  paid: number;
  couponMid: number;
  couponEnd: number;
  received: number;
  gain: number;
  grossYield: number;
  netYield: number;
};

export function simulate(issue: Issue, bonds: number): Simulation {
  const capital = bonds * issue.faceValue;
  const fees = Math.round(capital * issue.feeRate);
  const coupon = Math.round(capital * issue.couponRate);
  const couponMid = coupon / 2;
  const couponEnd = coupon - couponMid;
  return {
    bonds,
    capital,
    fees,
    paid: capital + fees,
    couponMid,
    couponEnd,
    received: capital + coupon,
    gain: coupon - fees,
    grossYield: issue.couponRate,
    netYield: issue.couponRate - issue.feeRate,
  };
}

// --- La rotation du capital sur 12 mois (sous la cascade de risque) ------------
// Les contrats publics courent sur cinq ans et plus ; Kupanda n'en finance que
// le fonds de roulement, par cycles de 3 à 5 mois, l'un après l'autre, et
// chaque financement est assuré (Julien, 01/11/2026). Cycles indicatifs, en
// mois ; les textes sont dans RotationChart.tsx.
export const ROTATION_CYCLES = [
  { from: 0, to: 4 },
  { from: 4, to: 8.5 },
  { from: 8.5, to: 12 },
] as const;

// --- Que se passe-t-il si… (sous la cascade de risque) ---------------------------
// Quatre situations du mémo, chacune renvoyée vers la protection qui joue.
// Le détail de chaque protection est dans son panneau : ici, le chemin seulement.

export const SCENARIOS: { q: Bi; a: Bi }[] = [
  {
    q: { fr: "… une PME financée fait défaut ?", en: "… a financed SME defaults?" },
    a: {
      fr: "La créance sur le contrat public est le premier niveau de recouvrement, que Minah SAS fait valoir via Africa Rise au nom de la masse des obligataires. Au-delà, la cascade ci-dessus joue dans l'ordre, du performance bond à la réserve de Minah SAS.",
      en: "The receivable on the public contract is the first level of recovery, enforced by Minah SAS through Africa Rise on behalf of the bondholder body. Beyond that, the cascade above applies in order, from the performance bond to Minah SAS's reserve.",
    },
  },
  {
    q: { fr: "… Minah SAS rencontre des difficultés ?", en: "… Minah SAS runs into difficulty?" },
    a: {
      fr: "Vos fonds sont séparés des actifs opérationnels de Minah. La masse des obligataires, représentée par Julca, fait valoir vos droits et recouvre les actifs sans passer par Minah SAS : c'est le socle, en bas de la cascade.",
      en: "Your funds are separated from Minah's operating assets. The bondholder body, represented by Julca, enforces your rights and recovers the assets without going through Minah SAS: that is the foundation, at the bottom of the cascade.",
    },
  },
  {
    q: { fr: "… un remboursement prend du retard ?", en: "… a repayment is late?" },
    a: {
      fr: "Clauses pénales dès le premier jour, intervention d'Africa Rise sur place auprès de l'entreprise et de l'acheteur public, et compte séquestre sur les contrats avec une entité publique. Un retard n'entame pas le coupon : Minah SAS le doit à date.",
      en: "Penalty clauses from day one, Africa Rise stepping in locally with the company and the public buyer, and an escrow account on contracts with a public entity. A delay does not touch the coupon: Minah SAS owes it on the date.",
    },
  },
  {
    q: { fr: "… le change joue contre l'opération ?", en: "… currency moves against the deal?" },
    a: {
      fr: "C'est le niveau 3 : capital structuré en dollars chez le partenaire, swap avec Zanaco Bank pour la disponibilité en USD à maturité. Vous êtes remboursé dans la devise reçue à la souscription, en euros ou équivalent, quelle que soit la performance des actifs.",
      en: "That is level 3: capital structured in dollars at partner level, a swap with Zanaco Bank for USD availability at maturity. You are repaid in the currency received at subscription, in euros or equivalent, whatever the performance of the assets.",
    },
  },
];

// --- Où va l'argent (onglet) ---------------------------------------------------
// Le chapitre du mémo absent des panneaux : les deux pays et leur région. Le
// taux bancaire zambien (28 %) est déjà dans le panneau de l'État, il n'est
// pas repris ici.

export const REGIONAL_CONTEXT: Bi = {
  fr: "L'Afrique de l'Est et australe cumule des programmes d'investissement dans les infrastructures, une population urbaine en forte croissance, une monnaie mobile largement adoptée et des gouvernements qui formalisent leur secteur des PME. Kupanda y est déployée principalement en Zambie, et pour une partie au Kenya.",
  en: "East and Southern Africa combine infrastructure investment programmes, a fast-growing urban population, widely adopted mobile money and governments formalising their SME sector. Kupanda is deployed there mainly in Zambia, with part going to Kenya.",
};

export type Market = {
  id: string;
  title: Bi;
  kicker: Bi;
  stats: { value: Bi; label: Bi }[];
  body: Bi[];
  why: { title: Bi; body: Bi };
  /** Partenaires publics, avec leur logo dans public/partners. */
  partners?: { logo: string; name: Bi; role: Bi }[];
};

export const MARKETS: Market[] = [
  {
    id: "zambia",
    title: { fr: "La Zambie", en: "Zambia" },
    kicker: { fr: "Marché principal", en: "Main market" },
    stats: [
      { value: { fr: "20\u00a0M", en: "20M" }, label: { fr: "habitants", en: "inhabitants" } },
      { value: { fr: "8", en: "8" }, label: { fr: "pays frontaliers", en: "bordering countries" } },
      { value: { fr: "2021", en: "2021" }, label: { fr: "gouvernement Hichilema, en place depuis", en: "Hichilema government, in office since" } },
    ],
    body: [
      {
        fr: "Une démocratie stable d'Afrique australe. Le gouvernement du président Hichilema a fait du développement des PME une priorité, avec la création d'un ministère dédié. Frontalière de huit pays, la Zambie est un corridor commercial et la porte d'entrée de la SADC, la Communauté de développement d'Afrique australe.",
        en: "A stable democracy in Southern Africa. President Hichilema's government has made SME development a priority, creating a dedicated ministry. Bordering eight countries, Zambia is a trade corridor and the gateway to the SADC, the Southern African Development Community.",
      },
      {
        fr: "Les PME financées livrent des infrastructures essentielles aux communautés, de l'énergie solaire aux équipements scolaires, sur des contrats que l'État a signés et budgétés.",
        en: "The financed SMEs deliver essential infrastructure to communities, from solar energy to school equipment, on contracts the State has signed and budgeted.",
      },
    ],
    why: {
      title: { fr: "Pourquoi Lusaka ?", en: "Why Lusaka?" },
      body: {
        fr: "La capitale concentre les ministères, un secteur bancaire établi et un écosystème de PME en croissance. C'est de là qu'Africa Rise source, structure et suit chaque financement, et que les relations ministérielles se nouent en direct.",
        en: "The capital concentrates the ministries, an established banking sector and a growing SME ecosystem. That is where Africa Rise sources, structures and monitors every financing, and where ministerial relationships are built directly.",
      },
    },
    partners: [
      {
        logo: "/partners/zambia-msmed.png",
        name: { fr: "Ministère du Développement des petites et moyennes entreprises (MSMED)", en: "Ministry of Small and Medium Enterprise Development (MSMED)" },
        role: { fr: "Chargé de la croissance des PME et des coopératives à travers le pays.", en: "In charge of the growth of SMEs and cooperatives across the country." },
      },
      {
        logo: "/partners/zambia-mlgrd.png",
        name: { fr: "Ministère de l'Administration locale et du Développement rural (MLGRD)", en: "Ministry of Local Government and Rural Development (MLGRD)" },
        role: { fr: "Chargé de la gouvernance décentralisée, des services municipaux et des infrastructures à l'échelle nationale.", en: "In charge of decentralised governance, municipal services and infrastructure nationwide." },
      },
    ],
  },
  {
    id: "kenya",
    title: { fr: "Le Kenya", en: "Kenya" },
    kicker: { fr: "Marché d'expansion", en: "Expansion market" },
    stats: [
      { value: { fr: "1re", en: "1st" }, label: { fr: "économie d'Afrique de l'Est", en: "economy in East Africa" } },
      { value: { fr: "14,8\u00a0%", en: "14.8%" }, label: { fr: "taux bancaire moyen aux entreprises", en: "average bank lending rate to companies" } },
      { value: { fr: "Nairobi", en: "Nairobi" }, label: { fr: "pôle financier et fintech de la région", en: "the region's financial and fintech hub" } },
    ],
    body: [
      {
        fr: "Les marchés financiers développés de Nairobi et son cadre réglementaire offrent un modèle éprouvé de financement de PME adossé à des marchés publics. Le Kenya est le marché secondaire de la stratégie, sur le même modèle : des PME titulaires de contrats publics signés.",
        en: "Nairobi's developed financial markets and regulatory framework offer a proven model of SME financing backed by public contracts. Kenya is the strategy's secondary market, on the same model: SMEs holding signed public contracts.",
      },
    ],
    why: {
      title: { fr: "Pourquoi un second pays ?", en: "Why a second country?" },
      body: {
        fr: "Une partie du capital déployée hors de Zambie diversifie le portefeuille, pays par pays, sans changer la nature des actifs : le risque porté reste une créance sur un acheteur public.",
        en: "Part of the capital deployed outside Zambia diversifies the portfolio, country by country, without changing the nature of the assets: the risk carried remains a receivable on a public buyer.",
      },
    },
  },
];
