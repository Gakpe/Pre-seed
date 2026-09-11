import { RISK_CLOSING, RISK_LEVELS } from "@/lib/risk-levels";
import type { Locale } from "@/lib/i18n";

// Clôture de la fiche « gestion du risque » : ce que l'exemple Kupanda
// démontre, puis les renvois aux pièces contractuelles.
export function RiskClosing({ locale }: { locale: Locale }) {
  return (
    <section className="mt-14">
      <h2 className="text-base font-semibold tracking-tight">
        {RISK_CLOSING.title[locale]}
      </h2>
      <p className="mt-3 text-sm leading-7 text-neutral-700">
        {RISK_CLOSING.intro[locale]}
      </p>
      <ul className="mt-4 space-y-3">
        {RISK_CLOSING.variables.map((v) => (
          <li
            key={v.lead.fr}
            className="flex gap-3 text-sm leading-7 text-neutral-700"
          >
            <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-risk-critical" />
            <span>
              <strong className="font-semibold text-foreground">
                {v.lead[locale]}
              </strong>{" "}
              {v.body[locale]}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-7 text-neutral-700">
        {RISK_CLOSING.conclusion[locale]}
      </p>
      <Footnotes locale={locale} />
    </section>
  );
}

function Footnotes({ locale }: { locale: Locale }) {
  const notes = RISK_LEVELS.filter((l) => l.footnote);
  return (
    <ol className="mt-10 space-y-1 border-t border-risk-border pt-4 text-[11px] leading-5 text-neutral-400">
      {notes.map((l, i) => (
        <li key={l.id}>
          {i + 1}) {l.footnote?.[locale]}
        </li>
      ))}
    </ol>
  );
}
