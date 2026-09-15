import type { Locale } from "@/lib/i18n";

// Tranches proposées à un investisseur intéressé par Kupanda. La valeur
// enregistrée est le libellé français, comme pour les tranches du tour : c'est
// lui que l'admin relit. Le nominal (10 000 €) et le minimum de trois titres
// sont ceux de la term sheet, à tenir à jour avec elle.
export const kupanda = {
  bondFaceValue: { fr: "10 000 €", en: "€10,000" },
  minBonds: 3,
  minAmount: { fr: "30 000 €", en: "€30,000" },
  tranches: [
    "3 obligations, 30 000 € (minimum)",
    "Moins de 300 000 €",
    "Moins de 500 000 €",
    "500 000 € et plus",
  ],
} as const;

const tranchesEn = [
  "3 bonds, €30,000 (minimum)",
  "Under €300,000",
  "Under €500,000",
  "€500,000 and above",
] as const;

export type KupandaTranche = (typeof kupanda.tranches)[number];

export function isKupandaTranche(value: unknown): value is KupandaTranche {
  return (
    typeof value === "string" &&
    (kupanda.tranches as readonly string[]).includes(value)
  );
}

export function kupandaTrancheLabels(locale: Locale): readonly string[] {
  return locale === "en" ? tranchesEn : kupanda.tranches;
}
