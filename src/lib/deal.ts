// Conditions de la levée affichées sur la home investisseurs.
// À ajuster ici au fil du deal (montants en clair, pas de calcul).

import type { Locale } from "@/lib/i18n";

export const deal = {
  round: "Pre-seed 2026",
  period: "Q3–Q4 2026",
  target: "1,5 M€",
  minTicket: "100 K€",
  leadWanted: "500 K€",
  matchingFund: "~700 K€ pondérés",
  engagedLabel: "~700 K€ matching fund — pondéré",
  progressPct: 47,
  tranches: ["< 100 K€", "< 250 K€", "< 500 K€", "500 K€+ (lead)"],
  // Lien de prise de RDV (Calendly / Cal.com) — placeholder à remplacer.
  meetingUrl: "https://cal.com/minah/30min",
} as const;

// Mêmes montants, format anglophone (« 1,5 M€ » → « €1.5M »).
const dealEn = {
  period: "Q3–Q4 2026",
  target: "€1.5M",
  minTicket: "€100K",
  leadWanted: "€500K",
  matchingFund: "~€700K weighted",
  engagedLabel: "~€700K matching fund — weighted",
  tranches: ["< €100K", "< €250K", "< €500K", "€500K+ (lead)"],
} as const;

export function dealFor(locale: Locale) {
  return locale === "en" ? { ...deal, ...dealEn } : deal;
}

// Détail du matching fund. Le chiffre affiché (~700 K€) est un total pondéré :
// sans le détail, c'est un nombre sorti de nulle part. D'où l'infobulle, qui
// montre le brut et le pondéré côte à côte pour les lignes non confirmées.
export type MatchingLine = {
  id: string;
  label: { fr: string; en: string };
  gross: number;
  /** Part retenue dans le total. 1 = confirmé, 0,5 = pondéré à 50 %. */
  weight: number;
};

export const matchingFund: MatchingLine[] = [
  {
    id: "confirme",
    label: { fr: "Matching fund confirmé", en: "Matching fund committed" },
    gross: 500_000,
    weight: 1,
  },
  {
    id: "vcs",
    label: { fr: "Discussions VCs", en: "VC discussions" },
    gross: 200_000,
    weight: 0.5,
  },
  {
    id: "bpifrance",
    label: { fr: "Bpifrance", en: "Bpifrance" },
    gross: 300_000,
    weight: 0.5,
  },
];

export const matchingFundTotal = matchingFund.reduce(
  (sum, line) => sum + line.gross * line.weight,
  0
); // 750 000 €, arrondi à ~700 K€ dans le chiffre principal
