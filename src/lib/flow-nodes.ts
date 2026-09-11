// Contenu du schéma de flux de la fiche « business model ».
//
// La fiche vit en deux langues : chaque chaîne affichée est bilingue (`Bi`),
// le composant lit `.fr` ou `.en` selon la locale.

/** Chaîne à traduire : la fiche vit en français et en anglais. */
export type Bi = { fr: string; en: string };

// Ordres de grandeur des deux commissions. Les modifier ici suffit à les
// mettre à jour partout : schéma, panneau de détail et légendes.
export const FEES: { transaction: Bi; performance: Bi } = {
  transaction: { fr: "3,5 %", en: "3.5%" },
  performance: { fr: "15 à 40 %", en: "15 to 40%" },
};

export type FlowNode = {
  id: string;
  title: Bi;
  tag: Bi;
  items: [Bi, Bi, Bi];
};

// Les cinq familles de souscripteurs, dans l'ordre où elles sont empilées.
export type Investor = { id: string; title: Bi; subtitle: Bi };

export const INVESTORS: Investor[] = [
  {
    id: "institutionnels",
    title: { fr: "Institutionnels", en: "Institutional investors" },
    subtitle: {
      fr: "Assureurs, mutuelles · Europe",
      en: "Insurers, mutuals · Europe",
    },
  },
  {
    id: "fonds-de-dette",
    title: { fr: "Fonds de dette", en: "Debt funds" },
    subtitle: {
      fr: "Private credit · Europe, Golfe",
      en: "Private credit · Europe, Gulf",
    },
  },
  {
    id: "hnwi",
    title: { fr: "HNWI & family offices", en: "HNWIs & family offices" },
    subtitle: { fr: "Golfe · Europe · Afrique", en: "Gulf · Europe · Africa" },
  },
  {
    id: "diaspora",
    title: { fr: "Investisseurs diaspora", en: "Diaspora investors" },
    subtitle: { fr: "Professionnels qualifiés", en: "Qualified professionals" },
  },
  {
    id: "digital-assets",
    title: { fr: "Digital asset holders", en: "Digital asset holders" },
    subtitle: {
      fr: "Trésoreries on-chain · International",
      en: "On-chain treasuries · International",
    },
  },
];

export const FLOW_NODES: FlowNode[] = [
  {
    id: "institutionnels",
    title: { fr: "Institutionnels", en: "Institutional investors" },
    tag: { fr: "Assureurs, mutuelles · Europe", en: "Insurers, mutuals · Europe" },
    items: [
      {
        fr: "Souscrivent à une stratégie identifiée, adossée à des contrats déjà signés, pas à un fonds aveugle.",
        en: "Subscribe to an identified strategy, backed by already-signed contracts, not a blind pool.",
      },
      {
        fr: "Exigent un reporting standardisé et une traçabilité vérifiable en continu.",
        en: "Require standardised reporting and continuously verifiable traceability.",
      },
      {
        fr: "Maturité et coupon connus à l'entrée, ticket à partir de 100 K€.",
        en: "Maturity and coupon known upfront, ticket from €100K.",
      },
    ],
  },
  {
    id: "fonds-de-dette",
    title: { fr: "Fonds de dette", en: "Debt funds" },
    tag: { fr: "Private credit · Europe, Golfe", en: "Private credit · Europe, Gulf" },
    items: [
      {
        fr: "Cherchent une prime de rendement peu corrélée aux marchés cotés.",
        en: "Seek a yield premium with low correlation to public markets.",
      },
      {
        fr: "Analysent la cascade de protections avant de regarder le rendement affiché.",
        en: "Analyse the protection cascade before looking at the headline yield.",
      },
      {
        fr: "Allouent stratégie par stratégie, et non au véhicule global.",
        en: "Allocate strategy by strategy, not to the overall vehicle.",
      },
    ],
  },
  {
    id: "hnwi",
    title: { fr: "HNWI & family offices", en: "HNWIs & family offices" },
    tag: { fr: "Golfe · Europe · Afrique", en: "Gulf · Europe · Africa" },
    items: [
      {
        fr: "Accèdent par leur banquier privé ou leur conseil en gestion de patrimoine.",
        en: "Come in through their private banker or wealth adviser.",
      },
      {
        fr: "Recherchent un actif adossé au réel, sur une maturité courte.",
        en: "Look for a real-asset-backed instrument on a short maturity.",
      },
      {
        fr: "Réinvestissent souvent d'une stratégie à la suivante.",
        en: "Often reinvest from one strategy to the next.",
      },
    ],
  },
  {
    id: "diaspora",
    title: { fr: "Investisseurs diaspora", en: "Diaspora investors" },
    tag: { fr: "Professionnels qualifiés", en: "Qualified professionals" },
    items: [
      {
        fr: "Connaissent les marchés financés et en lisent le risque autrement.",
        en: "Know the financed markets and read their risk differently.",
      },
      {
        fr: "Entrent sur des tickets plus petits, avec une forte récurrence.",
        en: "Come in on smaller tickets, with strong recurrence.",
      },
      {
        fr: "Apportent un ancrage local que les investisseurs institutionnels n'ont pas.",
        en: "Bring a local anchoring that institutional investors lack.",
      },
    ],
  },
  {
    id: "digital-assets",
    title: { fr: "Digital asset holders", en: "Digital asset holders" },
    tag: {
      fr: "Trésoreries on-chain · International",
      en: "On-chain treasuries · International",
    },
    items: [
      {
        fr: "Détiennent des actifs numériques et cherchent un rendement adossé à l'économie réelle.",
        en: "Hold digital assets and seek a yield backed by the real economy.",
      },
      {
        fr: "Le règlement on-chain leur évite la friction d'un aller-retour bancaire.",
        en: "On-chain settlement spares them the friction of a banking round-trip.",
      },
      {
        fr: "La traçabilité native du registre répond à leur exigence de vérifiabilité.",
        en: "The registry's native traceability meets their requirement for verifiability.",
      },
    ],
  },
  {
    id: "minah",
    title: { fr: "Minah", en: "Minah" },
    tag: {
      fr: "Structuration · registre · exécution",
      en: "Structuring · registry · execution",
    },
    items: [
      {
        fr: "Sélectionne les contrats, monte les protections, fixe le coupon et la maturité.",
        en: "Selects the contracts, builds the protections, sets the coupon and maturity.",
      },
      {
        fr: "Tient le registre digital et le règlement on-chain de chaque position.",
        en: "Maintains the digital registry and on-chain settlement of each position.",
      },
      {
        fr: "Ne se rémunère qu'à deux moments : à la souscription, puis sur la performance.",
        en: "Earns at only two moments: at subscription, then on performance.",
      },
    ],
  },
  {
    id: "societes-locales",
    title: { fr: "Sociétés financières locales", en: "Local finance companies" },
    tag: { fr: "Entités de droit local", en: "Locally incorporated entities" },
    items: [
      {
        fr: "Portent le déploiement au plus près du payeur et du tribunal compétent.",
        en: "Carry the deployment closest to the payer and the competent court.",
      },
      {
        fr: "Rendent les protections exécutables : garanties, assurance crédit, lettres d'engagement.",
        en: "Make the protections enforceable: guarantees, credit insurance, engagement letters.",
      },
      {
        fr: "Africa Rise Ltd (Lusaka) porte la stratégie Kupanda.",
        en: "Africa Rise Ltd (Lusaka) carries the Kupanda strategy.",
      },
    ],
  },
  {
    id: "pme",
    title: { fr: "PME sous contrat", en: "SMEs under contract" },
    tag: { fr: "Marchés publics exécutés", en: "Public contracts delivered" },
    items: [
      {
        fr: "Financent l'exécution d'un contrat déjà attribué, pas un plan d'affaires.",
        en: "Fund delivery of an already-awarded contract, not a business plan.",
      },
      {
        fr: "Le risque porte sur l'exécution et le délai de paiement, pas sur la demande.",
        en: "The risk sits on execution and payment timing, not on demand.",
      },
      {
        fr: "Le paiement est dirigé du ministère vers la structure de portage.",
        en: "Payment is routed from the ministry to the holding structure.",
      },
    ],
  },
  {
    id: "transaction-fees",
    title: { fr: "Transaction fees", en: "Transaction fees" },
    tag: { fr: "Prélevés à la souscription", en: "Charged at subscription" },
    items: [
      {
        fr: "Prélevés sur le flux entrant, au moment précis où l'investisseur souscrit.",
        en: "Charged on the inbound flow, at the precise moment the investor subscribes.",
      },
      {
        fr: "Couvrent la structuration du produit, l'onboarding et la mise en registre.",
        en: "Cover product structuring, onboarding and registry entry.",
      },
      {
        fr: `Taux appliqué : ${FEES.transaction.fr}.`,
        en: `Rate applied: ${FEES.transaction.en}.`,
      },
    ],
  },
  {
    id: "performance-fees",
    title: { fr: "Performance fees", en: "Performance fees" },
    tag: { fr: "Prélevés sur le flux de retour", en: "Charged on the return flow" },
    items: [
      {
        fr: "Prélevés sur la remontée des coupons, avant redistribution aux souscripteurs.",
        en: "Charged on the coupons flowing back, before redistribution to subscribers.",
      },
      {
        fr: "Alignent notre rémunération sur ce qui revient réellement aux investisseurs.",
        en: "Align our fee with what actually returns to investors.",
      },
      {
        fr: `Taux appliqué : ${FEES.performance.fr}.`,
        en: `Rate applied: ${FEES.performance.en}.`,
      },
    ],
  },
];
