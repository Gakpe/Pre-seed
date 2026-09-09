// Contenu validé de la fiche « gestion du risque ». Texte figé : il a été
// relu côté deal, il ne doit pas être reformulé. C'est le seul endroit à
// modifier pour faire évoluer la cascade.

export type RiskLevel = {
  id: string;
  index: 1 | 2 | 3 | 4;
  name: string;
  // `lead` est mis en gras, `body` prolonge la phrase.
  trigger: { lead: string; body: string };
  protection: { name: string; body: string };
  status?: string;
  footnote?: string;
};

export const AXIS_CAPTION =
  "Du sous-jacent (haut) vers l'émetteur (bas), chaque niveau non absorbé descend au suivant.";

export const RISK_LEVELS: RiskLevel[] = [
  {
    id: "performance",
    index: 1,
    name: "Risque de performance",
    trigger: {
      lead: "Un opérateur exécute mal ou en retard :",
      body: "livraison incomplète, calendrier non tenu, spécifications non respectées, taux de remboursement attendu non atteint.",
    },
    protection: {
      name: "Performance bond",
      body: "Le performance bond couvre la sous-performance de l'actif sous-jacent, en deçà du défaut avéré, par exemple une mauvaise gestion du besoin en fonds de roulement qui dégrade la trésorerie de l'opérateur.",
    },
    status: "Aucune occurrence sur le portefeuille actuel.",
    footnote: "Termes et conditions du performance bond disponibles sur demande.",
  },
  {
    id: "credit",
    index: 2,
    name: "Risque de crédit",
    trigger: {
      lead: "L'offtaker ne paie pas :",
      body: "une contrepartie publique accuse un retard significatif, ou fait défaut sur son engagement pour la transaction concernée.",
    },
    protection: {
      name: "Assurance crédit",
      body: "L'assurance crédit prend le relais en cas de défaut souverain sur le produit : la défaillance de l'État à honorer son engagement, à distinguer de la défaillance de l'actif sous-jacent.",
    },
    status: "Aucune occurrence sur le portefeuille actuel.",
    footnote: "Termes clés de l'assurance crédit disponibles sur demande.",
  },
  {
    id: "systemique",
    index: 3,
    name: "Risque politique, systémique et de transfert",
    trigger: {
      lead: "Un événement systémique survient :",
      body: "conflit, défaut souverain, inconvertibilité de la devise ou restrictions de transfert, mettant en cause la stabilité régionale et le rapatriement du cash.",
    },
    protection: {
      name: "Assurance risque systémique et currency swap",
      body: "Un accord contractuel avec Africa Rise garantit un niveau minimal de performance : il couvre les coûts opérationnels et le remboursement des investisseurs jusqu'à 2 M€, adossé à leur propre réserve de liquidité. Un currency swap avec Zanaco Bank sécurise la disponibilité en USD à maturité.",
    },
    footnote: "Détails de l'accord de currency swap disponibles sur demande.",
  },
  {
    id: "residuel",
    index: 4,
    name: "Risque structurel résiduel",
    trigger: {
      lead: "Une accumulation des risques précédents",
      body: "empêche le remboursement de 100 % de la performance minimale due aux investisseurs.",
    },
    protection: {
      name: "Réserve de trésorerie et surdimensionnement",
      body: "L'émission étant une obligation directe, Minah SAS engage ses propres fonds pour sécuriser l'échéancier de paiement. Les revenus dégagés par les autres stratégies sont maintenus en réserve et constituent le tampon face à ce risque résiduel.",
    },
  },
];

// Bandeau de résistance : repères fixes, aucun calcul, aucun curseur.
export const RESILIENCE = {
  headline:
    "Coupons et principal restent servis jusqu'à 30 % de pertes cumulées sur le portefeuille. Soit six fois le taux de perte historique observé sur les contrats publics de ce type.",
  marks: [
    { at: 5, label: "< 5 %", caption: "historique observé à ce jour" },
    { at: 15, label: "15 %", caption: "scénario central de stress" },
    { at: 30, label: "30 %", caption: "point mort de la structure" },
  ],
} as const;

// Section de clôture, « Ce que cet exemple démontre ».
export const RISK_CLOSING = {
  title: "Ce que cet exemple démontre",
  intro:
    "Kupanda est une illustration, pas un modèle unique. La cascade se recalibre pour chaque stratégie, selon trois variables :",
  variables: [
    {
      lead: "La contrepartie fixe les deux premiers niveaux.",
      body: "Un État, une grande entreprise ou un opérateur privé n'appellent ni les mêmes garanties, ni les mêmes assureurs.",
    },
    {
      lead: "La géographie et la devise fixent le troisième.",
      body: "Zone UEMOA, Afrique australe, marché dollarisé : le risque de transfert et la couverture de change se traitent différemment.",
    },
    {
      lead: "Notre bilan et la diversification des stratégies fixent le quatrième.",
      body: "Plus le nombre de stratégies en portefeuille augmente, plus la réserve qui absorbe le résiduel s'épaissit.",
    },
  ],
  conclusion:
    "Concevoir cette cascade, la documenter, et la faire tenir contractuellement niveau par niveau : c'est précisément le produit que nous vendons à nos souscripteurs.",
} as const;
