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
  engagedLabel: "800 K€ d'engagements à date, pondérés",
  progressPct: 53,
  tranches: ["< 100 K€", "< 250 K€", "< 500 K€", "500 K€+ (lead)"],
  // Lien de prise de RDV (Calendly / Cal.com), placeholder à remplacer.
  meetingUrl: "https://cal.com/minah/30min",
} as const;

// Mêmes montants, format anglophone (« 1,5 M€ » → « €1.5M »).
const dealEn = {
  period: "Q3–Q4 2026",
  target: "€1.5M",
  minTicket: "€100K",
  leadWanted: "€500K",
  matchingFund: "€500K soft commitment",
  engagedLabel: "€800K of weighted commitments to date",
  tranches: ["< €100K", "< €250K", "< €500K", "€500K+ (lead)"],
} as const;

export function dealFor(locale: Locale) {
  return locale === "en" ? { ...deal, ...dealEn } : deal;
}

// Détail des engagements à date. Le chiffre affiché est un total pondéré :
// présenté seul, c'est un nombre sans justification. D'où l'infobulle, qui
// montre le brut et le pondéré côte à côte pour les lignes non fermes.
//
// Le matching fund n'est pas confirmé : il est porté comme soft commitment, et
// la contrepartie n'est pas nommée. Ne pas requalifier cette ligne en
// engagement ferme sans instruction écrite de l'équipe.
export type MatchingLine = {
  id: string;
  label: { fr: string; en: string };
  category: { fr: string; en: string };
  gross: number;
  /** Part retenue dans le total. 1 pour un soft commitment, 0,5 en discussion. */
  weight: number;
  status: "soft" | "discussion";
};

export const matchingFund: MatchingLine[] = [
  {
    id: "partenaire-blockchain",
    label: {
      fr: "Partenaire de l'écosystème blockchain",
      en: "Blockchain ecosystem partner",
    },
    category: { fr: "Soft commitment", en: "Soft commitment" },
    gross: 500_000,
    weight: 1,
    status: "soft",
  },
  {
    id: "bpifrance",
    label: { fr: "Bpifrance", en: "Bpifrance" },
    category: {
      fr: "Banque publique d'investissement",
      en: "Public investment bank",
    },
    gross: 400_000,
    weight: 0.5,
    status: "discussion",
  },
  {
    id: "fonds-vc",
    label: { fr: "Fonds de capital-risque", en: "Venture capital fund" },
    category: { fr: "Capital-risque", en: "Venture capital" },
    gross: 200_000,
    weight: 0.5,
    status: "discussion",
  },
];

export const matchingFundTotal = matchingFund.reduce(
  (sum, line) => sum + line.gross * line.weight,
  0
); // 800 000 €
