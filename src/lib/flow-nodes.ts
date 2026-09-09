// Contenu du schéma de flux de la fiche « business model ».
//
// Ordres de grandeur des deux commissions. Les modifier ici suffit à les
// mettre à jour partout : schéma, panneau de détail et légendes.
export const FEES = {
  transaction: "3,5 %",
  performance: "15 à 40 %",
} as const;

export type FlowNode = {
  id: string;
  title: string;
  tag: string;
  items: [string, string, string];
};

// Les cinq familles de souscripteurs, dans l'ordre où elles sont empilées.
export type Investor = { id: string; title: string; subtitle: string };

export const INVESTORS: Investor[] = [
  {
    id: "institutionnels",
    title: "Institutionnels",
    subtitle: "Assureurs, mutuelles · Europe",
  },
  {
    id: "fonds-de-dette",
    title: "Fonds de dette",
    subtitle: "Private credit · Europe, Golfe",
  },
  {
    id: "hnwi",
    title: "HNWI & family offices",
    subtitle: "Golfe · Europe · Afrique",
  },
  {
    id: "diaspora",
    title: "Investisseurs diaspora",
    subtitle: "Professionnels qualifiés",
  },
  {
    id: "digital-assets",
    title: "Digital asset holders",
    subtitle: "Trésoreries on-chain · International",
  },
];

export const FLOW_NODES: FlowNode[] = [
  {
    id: "institutionnels",
    title: "Institutionnels",
    tag: "Assureurs, mutuelles · Europe",
    items: [
      "Souscrivent à une stratégie identifiée, adossée à des contrats déjà signés, pas à un fonds aveugle.",
      "Exigent un reporting standardisé et une traçabilité vérifiable en continu.",
      "Maturité et coupon connus à l'entrée, ticket à partir de 100 K€.",
    ],
  },
  {
    id: "fonds-de-dette",
    title: "Fonds de dette",
    tag: "Private credit · Europe, Golfe",
    items: [
      "Cherchent une prime de rendement peu corrélée aux marchés cotés.",
      "Analysent la cascade de protections avant de regarder le rendement affiché.",
      "Allouent stratégie par stratégie, et non au véhicule global.",
    ],
  },
  {
    id: "hnwi",
    title: "HNWI & family offices",
    tag: "Golfe · Europe · Afrique",
    items: [
      "Accèdent par leur banquier privé ou leur conseil en gestion de patrimoine.",
      "Recherchent un actif adossé au réel, sur une maturité courte.",
      "Réinvestissent souvent d'une stratégie à la suivante.",
    ],
  },
  {
    id: "diaspora",
    title: "Investisseurs diaspora",
    tag: "Professionnels qualifiés",
    items: [
      "Connaissent les marchés financés et en lisent le risque autrement.",
      "Entrent sur des tickets plus petits, avec une forte récurrence.",
      "Apportent un ancrage local que les investisseurs institutionnels n'ont pas.",
    ],
  },
  {
    id: "digital-assets",
    title: "Digital asset holders",
    tag: "Trésoreries on-chain · International",
    items: [
      "Détiennent des actifs numériques et cherchent un rendement adossé à l'économie réelle.",
      "Le règlement on-chain leur évite la friction d'un aller-retour bancaire.",
      "La traçabilité native du registre répond à leur exigence de vérifiabilité.",
    ],
  },
  {
    id: "minah",
    title: "Minah",
    tag: "Structuration · registre · exécution",
    items: [
      "Sélectionne les contrats, monte les protections, fixe le coupon et la maturité.",
      "Tient le registre digital et le règlement on-chain de chaque position.",
      "Ne se rémunère qu'à deux moments : à la souscription, puis sur la performance.",
    ],
  },
  {
    id: "societes-locales",
    title: "Sociétés financières locales",
    tag: "Entités de droit local",
    items: [
      "Portent le déploiement au plus près du payeur et du tribunal compétent.",
      "Rendent les protections exécutables : garanties, assurance crédit, lettres d'engagement.",
      "Africa Rise Ltd (Lusaka) porte la stratégie Kupanda.",
    ],
  },
  {
    id: "pme",
    title: "PME sous contrat",
    tag: "Marchés publics exécutés",
    items: [
      "Financent l'exécution d'un contrat déjà attribué, pas un plan d'affaires.",
      "Le risque porte sur l'exécution et le délai de paiement, pas sur la demande.",
      "Le paiement est dirigé du ministère vers la structure de portage.",
    ],
  },
  {
    id: "transaction-fees",
    title: "Transaction fees",
    tag: "Prélevés à la souscription",
    items: [
      "Prélevés sur le flux entrant, au moment précis où l'investisseur souscrit.",
      "Couvrent la structuration du produit, l'onboarding et la mise en registre.",
      `Taux appliqué : ${FEES.transaction}.`,
    ],
  },
  {
    id: "performance-fees",
    title: "Performance fees",
    tag: "Prélevés sur le flux de retour",
    items: [
      "Prélevés sur la remontée des coupons, avant redistribution aux souscripteurs.",
      "Alignent notre rémunération sur ce qui revient réellement aux investisseurs.",
      `Taux appliqué : ${FEES.performance}.`,
    ],
  },
];
