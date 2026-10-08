// Contenu validé de la fiche « gestion du risque ». Texte figé : il a été
// relu côté deal, il ne doit pas être reformulé. C'est le seul endroit à
// modifier pour faire évoluer la cascade.
//
// La fiche vit en deux langues comme le reste de la data room : chaque chaîne
// affichée est bilingue (`Bi`), le composant lit `.fr` ou `.en` selon la locale.

/** Chaîne à traduire : la fiche vit en français et en anglais. */
export type Bi = { fr: string; en: string };

export type RiskLevel = {
  id: string;
  index: 1 | 2 | 3 | 4;
  name: Bi;
  // `lead` est mis en gras, `body` prolonge la phrase.
  trigger: { lead: Bi; body: Bi };
  protection: { name: Bi; body: Bi };
  footnote?: Bi;
};

export const AXIS_CAPTION: Bi = {
  fr: "Du sous-jacent (haut) vers l'émetteur (bas), chaque niveau non absorbé descend au suivant.",
  en: "From the underlying asset (top) down to the issuer (bottom), each level not absorbed cascades to the next.",
};

export const RISK_LEVELS: RiskLevel[] = [
  {
    id: "performance",
    index: 1,
    name: { fr: "Risque de performance", en: "Performance risk" },
    trigger: {
      lead: {
        fr: "Un opérateur exécute mal ou en retard :",
        en: "An operator delivers poorly or late:",
      },
      body: {
        fr: "livraison incomplète, calendrier non tenu, spécifications non respectées, taux de remboursement attendu non atteint.",
        en: "incomplete delivery, missed schedule, specifications not met, expected repayment rate not reached.",
      },
    },
    protection: {
      name: { fr: "Performance bond", en: "Performance bond" },
      body: {
        fr: "Le performance bond couvre la sous-performance de l'actif sous-jacent, en deçà du défaut avéré, par exemple une mauvaise gestion du besoin en fonds de roulement qui dégrade la trésorerie de l'opérateur.",
        en: "The performance bond covers underperformance of the underlying asset, short of outright default, for instance poor working-capital management that erodes the operator's cash position.",
      },
    },
    footnote: {
      fr: "Termes et conditions du performance bond disponibles sur demande.",
      en: "Performance bond terms and conditions available on request.",
    },
  },
  {
    id: "credit",
    index: 2,
    name: { fr: "Risque de crédit", en: "Credit risk" },
    trigger: {
      lead: {
        fr: "L'offtaker ne paie pas :",
        en: "The offtaker does not pay:",
      },
      body: {
        fr: "une contrepartie publique accuse un retard significatif, ou fait défaut sur son engagement pour la transaction concernée.",
        en: "a public counterparty falls significantly behind, or defaults on its commitment for the transaction concerned.",
      },
    },
    protection: {
      name: { fr: "Assurance crédit", en: "Credit insurance" },
      body: {
        fr: "L'assurance crédit prend le relais en cas de défaut souverain sur le produit : la défaillance de l'État à honorer son engagement, à distinguer de la défaillance de l'actif sous-jacent.",
        en: "Credit insurance steps in on a sovereign default on the product: the State's failure to honour its commitment, to be distinguished from a failure of the underlying asset.",
      },
    },
    footnote: {
      fr: "Termes clés de l'assurance crédit disponibles sur demande.",
      en: "Key terms of the credit insurance available on request.",
    },
  },
  {
    id: "systemique",
    index: 3,
    name: {
      fr: "Risque politique, systémique et de transfert",
      en: "Political, systemic and transfer risk",
    },
    trigger: {
      lead: {
        fr: "Un événement systémique survient :",
        en: "A systemic event occurs:",
      },
      body: {
        fr: "conflit, défaut souverain, inconvertibilité de la devise ou restrictions de transfert, mettant en cause la stabilité régionale et le rapatriement du cash.",
        en: "conflict, sovereign default, currency inconvertibility or transfer restrictions, calling into question regional stability and the repatriation of cash.",
      },
    },
    protection: {
      name: {
        fr: "Assurance risque systémique et currency swap",
        en: "Systemic-risk insurance and currency swap",
      },
      body: {
        fr: "Un accord contractuel avec Africa Rise garantit un niveau minimal de performance : il couvre les coûts opérationnels et le remboursement des investisseurs jusqu'à 2 M€, adossé à leur propre réserve de liquidité. Un currency swap avec Zanaco Bank sécurise la disponibilité en USD à maturité.",
        en: "A contractual agreement with Africa Rise guarantees a minimum level of performance: it covers operating costs and investor repayment up to €2M, backed by their own liquidity reserve. A currency swap with Zanaco Bank secures USD availability at maturity.",
      },
    },
    footnote: {
      fr: "Détails de l'accord de currency swap disponibles sur demande.",
      en: "Details of the currency swap agreement available on request.",
    },
  },
  {
    id: "residuel",
    index: 4,
    name: { fr: "Risque structurel résiduel", en: "Residual structural risk" },
    trigger: {
      lead: {
        fr: "Une accumulation des risques précédents",
        en: "An accumulation of the preceding risks",
      },
      body: {
        fr: "empêche le remboursement de 100 % de la performance minimale due aux investisseurs.",
        en: "prevents repayment of 100% of the minimum performance owed to investors.",
      },
    },
    protection: {
      name: {
        fr: "Réserve de trésorerie et surdimensionnement",
        en: "Cash reserve and overcollateralisation",
      },
      body: {
        fr: "L'émission étant une obligation directe, Minah SAS engage ses propres fonds pour sécuriser l'échéancier de paiement. Les revenus dégagés par les autres stratégies sont maintenus en réserve et constituent le tampon face à ce risque résiduel.",
        en: "As the issuance is a direct obligation, Minah SAS commits its own funds to secure the payment schedule. Revenue generated by the other strategies is held in reserve and forms the buffer against this residual risk.",
      },
    },
  },
];


// Scénarios de pertes cumulées de la stratégie Kupanda, repris du deck risk
// (08/10/2026). Les points tracent l'allure des courbes du deck, trimestre par
// trimestre ; seuls les niveaux finaux (< 5 %, 15 %, 30 %) et les multiples
// sont des chiffres du deck, c'est eux que la fiche affiche.
export type LossScenario = {
  id: "breakeven" | "base" | "historical";
  points: number[];
  value: Bi;
  name: Bi;
  multiple: Bi;
  impact: Bi;
  body: Bi;
};

export const LOSS_SCENARIOS: {
  title: Bi;
  lead: Bi;
  quarters: Bi[];
  caption: Bi;
  scenarios: LossScenario[];
} = {
  title: { fr: "Scénarios de pertes cumulées", en: "Cumulative loss scenarios" },
  lead: {
    fr: "Toutes protections réunies, seul un taux de pertes supérieur à **six fois le niveau historique** exposerait les investisseurs à une perte partielle de performance.",
    en: "With every protection in place, only a loss rate above **six times the historical level** would expose investors to a partial loss of performance.",
  },
  quarters: [
    { fr: "T1", en: "Q1" },
    { fr: "T2", en: "Q2" },
    { fr: "T3", en: "Q3" },
    { fr: "T4", en: "Q4" },
  ],
  caption: {
    fr: "Pertes nettes cumulées (CNL), par trimestre. Source : deck risk Kupanda.",
    en: "Cumulative net loss (CNL), by quarter. Source: Kupanda risk deck.",
  },
  scenarios: [
    {
      id: "breakeven",
      points: [13.5, 22.5, 27.5, 30],
      value: { fr: "30\u00a0%", en: "30%" },
      name: { fr: "Point mort", en: "Breakeven" },
      multiple: { fr: "6,5\u00a0× l'historique", en: "6.5× historical" },
      impact: { fr: "première perte pour les investisseurs", en: "first loss for investors" },
      body: {
        fr: "Perte cumulée maximale que la structure absorbe, une fois épuisés le performance bond, l'assurance crédit et la réserve de trésorerie.",
        en: "Maximum cumulative loss the structure absorbs, once the performance bond, credit insurance and cash reserve are exhausted.",
      },
    },
    {
      id: "base",
      points: [6.8, 11.2, 13.8, 15],
      value: { fr: "15\u00a0%", en: "15%" },
      name: { fr: "Scénario central", en: "Base case" },
      multiple: { fr: "3,3\u00a0× l'historique", en: "3.3× historical" },
      impact: { fr: "aucun impact investisseur", en: "no investor impact" },
      body: {
        fr: "Défauts modérés sur les PME sous-jacentes, service de la dette maintenu.",
        en: "Moderate defaults on the underlying SMEs, debt service maintained.",
      },
    },
    {
      id: "historical",
      points: [2.1, 3.4, 4.1, 4.6],
      value: { fr: "<\u00a05\u00a0%", en: "< 5%" },
      name: { fr: "Historique", en: "Historical" },
      multiple: { fr: "1,0\u00a0×", en: "1.0×" },
      impact: { fr: "aucun impact investisseur", en: "no investor impact" },
      body: {
        fr: "Performance réelle des millésimes financés à ce jour dans la même structure, sans aucun défaut de paiement.",
        en: "Actual performance of the vintages financed to date through the same structure, with no payment default.",
      },
    },
  ],
};
