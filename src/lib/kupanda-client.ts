// Contenu propre à la page souscripteurs « Due diligence Kupanda » (/kupanda),
// repris du mémorandum d'investissement Kupanda (avril 2026, version du
// 14/09/2026). Rien ici ne répète les panneaux de la fiche (src/lib/kupanda-dd.ts)
// ni la cascade de risque (src/lib/risk-levels.ts) : la page ne dit rien deux
// fois. Deux points du mémo sont alignés sur la fiche : le déploiement passe
// par le dollar et un swap avec Zanaco (pas le franc CFA), et les juridictions
// sont la Zambie puis le Kenya (plus de Rwanda).

import type { Bi, DdDoc } from "@/lib/kupanda-dd";

// Documents sur demande propres aux souscripteurs, en plus de ceux de la
// fiche (DD_DOCS). Le Q&A est celui préparé pour un family office le
// 15 octobre 2026 (Dropbox, Seed Round/Team_Gautier, Q A_TeamG_x_Minah_vf.xlsx).
export const CLIENT_DOCS: DdDoc[] = [
  {
    id: "qa-family-office",
    title: {
      fr: "Q&A risque de crédit et risque souverain, questions d'un family office (octobre 2026)",
      en: "Credit and sovereign risk Q&A, a family office's questions (October 2026)",
    },
    kind: { type: "request" },
  },
];

/** Formulaire d'intention de souscription, celui du mémo (page « What's next »). */
export const INTEREST_FORM_URL = "https://tally.so/r/0QjrQP";
export const CONTACT_EMAIL = "contact@minah.io";

// --- La simulation (onglet) ----------------------------------------------------
// Hypothèses de la term sheet : nominal 10 000 €, coupon 20 % versé en deux
// fois (6 mois, échéance), frais de transaction 3,5 % prélevés à la
// souscription. Le rendement net du mémo, 16,5 %, rapporte le gain après
// frais au capital déployé.

export const SIM = {
  faceValue: 10_000,
  minBonds: 3,
  /** Toute l'émission : 2 M€. */
  maxBonds: 200,
  couponRate: 0.2,
  feeRate: 0.035,
  presets: [3, 5, 10, 30],
} as const;

export type Simulation = {
  bonds: number;
  capital: number;
  fees: number;
  paid: number;
  couponMid: number;
  couponEnd: number;
  received: number;
  gain: number;
  netYield: number;
};

export function simulate(bonds: number): Simulation {
  const capital = bonds * SIM.faceValue;
  const fees = Math.round(capital * SIM.feeRate);
  const coupon = Math.round(capital * SIM.couponRate);
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
    netYield: SIM.couponRate - SIM.feeRate,
  };
}

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

// --- Avertissement ------------------------------------------------------------------

export const DISCLAIMER: Bi = {
  fr: "Cette page est une présentation sommaire, fournie à titre d'information. Elle ne constitue ni une offre de souscription ni un conseil en investissement. Les termes financiers présentés sont indicatifs et susceptibles d'être modifiés : seules les conditions générales définitives, remises avant l'ouverture de la période de souscription, ont valeur contractuelle. L'investissement en obligations comporte un risque de perte en capital. Les rendements sont présentés avant impôts. L'offre est réservée aux investisseurs avertis. Les paramètres de la stratégie et les opérations sous-jacentes peuvent être ajustés pour tenir compte des réalités opérationnelles sur le terrain.",
  en: "This page is a summary presentation, provided for information. It is neither an offer to subscribe nor investment advice. The financial terms shown are indicative and may change: only the final terms and conditions, provided before the subscription period opens, are contractually binding. Investing in bonds carries a risk of capital loss. Returns are shown before tax. The offer is reserved for qualified investors. The strategy's parameters and the underlying operations may be adjusted to reflect operational realities on the ground.",
};
