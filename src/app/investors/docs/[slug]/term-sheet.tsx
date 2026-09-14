import { FEES } from "@/lib/flow-nodes";
import type { Locale } from "@/lib/i18n";
import { SectionTitle } from "./section-title";

// Term sheet Kupanda. La fiche remplace le lien DocSend : les conditions
// tiennent en huit lignes, elles n'ont pas besoin d'un visualiseur externe, et
// un document hébergé ailleurs échappe au suivi de la data room.
//
// Chiffres à tenir à jour avec l'équipe. Le taux de transaction fees rejoint
// celui du business model : il est lu dans src/lib/flow-nodes.ts.

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
    value: { fr: "12\u00a0mois", en: "12\u00a0months" },
  },
  {
    label: { fr: "Valeur nominale (par titre)", en: "Bond face value (per note)" },
    value: { fr: "10\u00a0000\u00a0€", en: "€10,000" },
  },
  {
    label: { fr: "Montant total de l'émission", en: "Total issuance amount" },
    value: { fr: "2\u00a0000\u00a0000\u00a0€", en: "€2,000,000" },
  },
  {
    label: { fr: "Rendement annuel", en: "Annual yield" },
    value: { fr: "20\u00a0%", en: "20%" },
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
    value: FEES.transaction,
  },
  {
    label: { fr: "Période de blocage", en: "Lock-up period" },
    value: {
      fr: "12\u00a0mois, aucun remboursement anticipé",
      en: "12\u00a0months, no early redemption",
    },
  },
];

const copy = {
  fr: {
    title: "Les termes de l'émission",
    lead: "Kupanda est une obligation in fine adossée à des contrats publics déjà attribués. Les conditions ci-dessous sont celles de l'émission en cours.",
    footnote:
      "Document de synthèse, sans valeur contractuelle. La documentation juridique complète est communiquée au niveau 2 de la data room.",
  },
  en: {
    title: "The terms of the issuance",
    lead: "Kupanda is a bullet bond backed by public contracts already awarded. The terms below are those of the current issuance.",
    footnote:
      "Summary document, with no contractual value. Full legal documentation is shared at level 2 of the data room.",
  },
};

export function TermSheet({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <div className="mt-6">
      {/* Chapô sous l'en-tête encadré, au corps des autres fiches. */}
      <p className="max-w-2xl text-[15px] leading-[1.8] text-neutral-700">
        {c.lead}
      </p>

      <section className="mt-12">
        <SectionTitle icon="document">{c.title}</SectionTitle>

        {/* Deux colonnes de quatre lignes au large : le produit à gauche, sa
            rémunération et ses contraintes à droite. En pleine largeur, le
            libellé et sa valeur se retrouvaient à 700 px l'un de l'autre. */}
        <dl className="mt-6 grid rounded-xl border border-foreground/10 bg-white/60 px-6 py-2 md:grid-flow-col md:grid-cols-2 md:grid-rows-4 md:gap-x-12">
          {ROWS.map((row, i) => (
            <div
              key={row.label.fr}
              className={`flex flex-col gap-0.5 border-foreground/10 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${
                i === ROWS.length - 1 ? "" : "border-b"
              } ${i === 3 ? "md:border-b-0" : ""}`}
            >
              <dt className="text-[15px] leading-snug text-neutral-700">
                {row.label[locale]}
              </dt>
              <dd className="text-[15px] font-semibold leading-snug tracking-tight text-foreground sm:text-right">
                {row.value[locale]}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-sm leading-6 text-neutral-600">{c.footnote}</p>
      </section>
    </div>
  );
}
