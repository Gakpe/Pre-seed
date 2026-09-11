// Conditions de la levée affichées sur la home investisseurs.
// À ajuster ici au fil du deal (montants en clair, pas de calcul).

import type { Locale } from "@/lib/i18n";

export const deal = {
  round: "Pre-seed 2026",
  period: "Q3–Q4 2026",
  target: "1,5 M€",
  minTicket: "100 K€",
  leadWanted: "500 K€",
  matchingFund: "500 K€ en soft commitment",
  engagedLabel: "700 K€ d'engagements à date, pondérés",
  progressPct: 47,
  tranches: ["< 100 K€", "< 250 K€", "< 500 K€", "500 K€+ (lead)"],
  // Lien de prise de RDV Cal.com (pitch pre-seed, équipe complète).
  meetingUrl: "https://cal.com/julien-gakpe-1icblz/pre-seed-pitch-minah-full-team",
} as const;

// Mêmes montants, format anglophone (« 1,5 M€ » → « €1.5M »).
const dealEn = {
  period: "Q3–Q4 2026",
  target: "€1.5M",
  minTicket: "€100K",
  leadWanted: "€500K",
  matchingFund: "€500K soft commitment",
  engagedLabel: "€700K of weighted commitments to date",
  tranches: ["< €100K", "< €250K", "< €500K", "€500K+ (lead)"],
} as const;

export function dealFor(locale: Locale) {
  return locale === "en" ? { ...deal, ...dealEn } : deal;
}

// Engagements à date. Le chiffre affiché est un total pondéré : présenté seul,
// c'est un nombre sans justification, d'où l'infobulle qui le détaille.
//
// Aucune identité n'est publiée. Chaque ligne porte un rôle, jamais un nom :
// les contreparties ne sont communiquées qu'après réception d'une intention
// d'investissement. Ne pas requalifier une ligne en engagement ferme sans
// instruction écrite de l'équipe.
export type Commitment = {
  id: string;
  /** Rôle affiché à la place du nom. */
  role: { fr: string; en: string };
  gross: number;
  /** Plafond et non montant ferme : affiché « jusqu'à ». */
  capped?: boolean;
  /** Part retenue dans le total pondéré. */
  weight: number;
  status: "soft" | "discussion";
};

export const commitments: Commitment[] = [
  {
    id: "co-lead",
    role: { fr: "Co-lead", en: "Co-lead" },
    gross: 500_000,
    capped: true,
    weight: 1,
    status: "soft",
  },
  {
    id: "vc",
    role: { fr: "Fonds de capital-risque", en: "Venture capital fund" },
    gross: 200_000,
    weight: 0.5,
    status: "discussion",
  },
  {
    id: "institutionnel",
    role: { fr: "Acteur institutionnel", en: "Institutional investor" },
    gross: 300_000,
    weight: 0.5,
    status: "discussion",
  },
  {
    id: "business-angel",
    role: { fr: "Business angel", en: "Business angel" },
    gross: 100_000,
    weight: 0.5,
    status: "discussion",
  },
];

// Somme pondérée des lignes ci-dessus, à titre de contrôle : 800 000 €.
export const commitmentsWeightedSum = commitments.reduce(
  (sum, line) => sum + line.gross * line.weight,
  0
);

// Total retenu et communiqué par l'équipe. Volontairement plus prudent que la
// somme pondérée : c'est ce chiffre qui s'affiche partout, jauge comprise.
// À réaligner avec les lignes dès qu'une pondération est arrêtée.
export const commitmentsTotal = 700_000;
