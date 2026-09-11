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
  status?: Bi;
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
        en: "The performance bond covers underperformance of the underlying asset, short of outright default — for instance poor working-capital management that erodes the operator's cash position.",
      },
    },
    status: {
      fr: "Aucune occurrence sur le portefeuille actuel.",
      en: "No occurrence on the current portfolio.",
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
    status: {
      fr: "Aucune occurrence sur le portefeuille actuel.",
      en: "No occurrence on the current portfolio.",
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

// Bandeau de résistance : repères fixes, aucun calcul, aucun curseur.
export const RESILIENCE: {
  headline: Bi;
  marks: { at: number; label: Bi; caption: Bi }[];
} = {
  headline: {
    fr: "Coupons et principal restent servis jusqu'à 30 % de pertes cumulées sur le portefeuille. Soit six fois le taux de perte historique observé sur les contrats publics de ce type.",
    en: "Coupons and principal keep being paid up to 30% of cumulative losses on the portfolio — six times the historical loss rate observed on public contracts of this type.",
  },
  marks: [
    {
      at: 5,
      label: { fr: "< 5 %", en: "< 5%" },
      caption: { fr: "historique observé à ce jour", en: "observed to date" },
    },
    {
      at: 15,
      label: { fr: "15 %", en: "15%" },
      caption: {
        fr: "scénario central de stress",
        en: "central stress scenario",
      },
    },
    {
      at: 30,
      label: { fr: "30 %", en: "30%" },
      caption: {
        fr: "point mort de la structure",
        en: "break-even of the structure",
      },
    },
  ],
};

// Section de clôture, « Ce que cet exemple démontre ».
export const RISK_CLOSING: {
  title: Bi;
  intro: Bi;
  variables: { lead: Bi; body: Bi }[];
  conclusion: Bi;
} = {
  title: {
    fr: "Ce que cet exemple démontre",
    en: "What this example demonstrates",
  },
  intro: {
    fr: "Kupanda est une illustration, pas un modèle unique. La cascade se recalibre pour chaque stratégie, selon trois variables :",
    en: "Kupanda is an illustration, not a single template. The cascade is recalibrated for each strategy, along three variables:",
  },
  variables: [
    {
      lead: {
        fr: "La contrepartie fixe les deux premiers niveaux.",
        en: "The counterparty sets the first two levels.",
      },
      body: {
        fr: "Un État, une grande entreprise ou un opérateur privé n'appellent ni les mêmes garanties, ni les mêmes assureurs.",
        en: "A State, a large corporate or a private operator call for neither the same guarantees nor the same insurers.",
      },
    },
    {
      lead: {
        fr: "La géographie et la devise fixent le troisième.",
        en: "Geography and currency set the third.",
      },
      body: {
        fr: "Zone UEMOA, Afrique australe, marché dollarisé : le risque de transfert et la couverture de change se traitent différemment.",
        en: "WAEMU zone, Southern Africa, dollarised market: transfer risk and currency hedging are handled differently.",
      },
    },
    {
      lead: {
        fr: "Notre bilan et la diversification des stratégies fixent le quatrième.",
        en: "Our balance sheet and the diversification of strategies set the fourth.",
      },
      body: {
        fr: "Plus le nombre de stratégies en portefeuille augmente, plus la réserve qui absorbe le résiduel s'épaissit.",
        en: "The more strategies in the portfolio, the thicker the reserve that absorbs the residual.",
      },
    },
  ],
  conclusion: {
    fr: "Concevoir cette cascade, la documenter, et la faire tenir contractuellement niveau par niveau : c'est précisément le produit que nous vendons à nos souscripteurs.",
    en: "Designing this cascade, documenting it, and making it hold contractually level by level — that is precisely the product we sell to our subscribers.",
  },
};
