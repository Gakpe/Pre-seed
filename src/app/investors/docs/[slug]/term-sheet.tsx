import type { Locale } from "@/lib/i18n";

// Term sheet Kupanda. La fiche remplace le lien DocSend : les conditions
// tiennent en huit lignes, elles n'ont pas besoin d'un visualiseur externe, et
// un document hébergé ailleurs échappe au suivi de la data room.
//
// Chiffres à tenir à jour avec l'équipe. Le taux de transaction fees rejoint
// celui du business model (src/lib/flow-nodes.ts) : les changer ensemble.

type Row = {
  label: { fr: string; en: string };
  value: { fr: string; en: string };
};

const ROWS: Row[] = [
  {
    label: { fr: "Catégorie / produit", en: "Category / product" },
    value: { fr: "Bullet bond", en: "Bullet bond" },
  },
  {
    label: { fr: "Durée", en: "Duration" },
    value: { fr: "12 mois", en: "12 months" },
  },
  {
    label: { fr: "Valeur nominale (par titre)", en: "Bond face value (per note)" },
    value: { fr: "10 000 €", en: "€10,000" },
  },
  {
    label: { fr: "Montant total de l'émission", en: "Total issuance amount" },
    value: { fr: "2 000 000 €", en: "€2,000,000" },
  },
  {
    label: { fr: "Rendement annuel", en: "Annual yield" },
    value: { fr: "20 %", en: "20%" },
  },
  {
    label: { fr: "Versement des intérêts", en: "Interest payment schedule" },
    value: {
      fr: "Semestriel et à l'échéance",
      en: "Semi-annual and at maturity",
    },
  },
  {
    label: { fr: "Transaction fees", en: "Transaction fees" },
    value: { fr: "3,5 %", en: "3.5%" },
  },
  {
    label: { fr: "Période de blocage", en: "Lock-up period" },
    value: {
      fr: "12 mois, aucun remboursement anticipé",
      en: "12 months, no early redemption",
    },
  },
];

const copy = {
  fr: {
    eyebrow: "Conditions",
    title: "Les termes de l'émission.",
    lead: "Kupanda est une obligation in fine adossée à des contrats publics déjà attribués. Les conditions ci-dessous sont celles de l'émission en cours.",
    footnote:
      "Document de synthèse, sans valeur contractuelle. La documentation juridique complète est communiquée au niveau 2 de la data room.",
  },
  en: {
    eyebrow: "Terms",
    title: "The terms of the issuance.",
    lead: "Kupanda is a bullet bond backed by public contracts already awarded. The terms below are those of the current issuance.",
    footnote:
      "Summary document, with no contractual value. Full legal documentation is shared at level 2 of the data room.",
  },
};

export function TermSheet({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <div className="mt-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
        {c.eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight">
        {c.title}
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-[1.8] text-neutral-700">
        {c.lead}
      </p>

      {/* Libellé à gauche, valeur à droite, filet accent sous chaque ligne :
          la lecture se fait en diagonale, sur la colonne des valeurs. */}
      <dl className="mt-9">
        {ROWS.map((row) => (
          <div
            key={row.label.fr}
            className="flex flex-col gap-1 border-b-2 border-brand/70 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
          >
            <dt className="text-[15px] leading-snug text-neutral-700">
              {row.label[locale]}
            </dt>
            <dd className="text-right text-[15px] font-bold leading-snug tracking-tight text-brand sm:text-[17px]">
              {row.value[locale]}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-xs leading-5 text-neutral-500">{c.footnote}</p>
    </div>
  );
}
