import type { Locale } from "@/lib/i18n";
import { CONTACT_EMAIL, DISCLAIMER, INTEREST_FORM_URL } from "@/lib/kupanda-client";

// Sous les onglets de la due diligence : l'intention de souscription et
// l'avertissement, rien d'autre. Le contenu vit dans src/lib/kupanda-client.ts.

const copy = {
  fr: {
    ctaTitle: "Vous êtes intéressé ?",
    ctaBody: "Indiquez-nous le montant que vous envisagez, sans engagement. L'équipe revient vers vous avec la notice de l'obligation et les étapes de la souscription.",
    cta: "Je suis intéressé par Kupanda",
    or: "ou écrivez-nous :",
    disclaimer: "Avertissement",
  },
  en: {
    ctaTitle: "Interested?",
    ctaBody: "Tell us the amount you have in mind, with no commitment. The team gets back to you with the bond notice and the subscription steps.",
    cta: "I am interested in Kupanda",
    or: "or write to us:",
    disclaimer: "Disclaimer",
  },
} as const;

const body = "text-[15px] leading-[1.8] text-neutral-700";

export function ClientSections({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <div className="mx-auto max-w-6xl">
      {/* L'intention de souscription : le formulaire du mémo. */}
      <section className="mt-14 rounded-xl border border-foreground/10 bg-white/60 px-6 py-8 text-center">
        <h2 className="text-2xl font-semibold leading-tight tracking-tight">{c.ctaTitle}</h2>
        <p className={`mx-auto mt-3 max-w-xl ${body}`}>{c.ctaBody}</p>
        <a
          href={INTEREST_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block whitespace-nowrap rounded-lg bg-marsala px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {c.cta} →
        </a>
        <p className="mt-4 text-sm text-neutral-600">
          {c.or}{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>

      {/* Avertissement, en fin de papier. */}
      <section className="mt-12 rounded-xl bg-foreground/[0.03] px-6 py-6">
        <h2 className="text-sm font-semibold text-foreground">{c.disclaimer}</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-neutral-600">{DISCLAIMER[locale]}</p>
      </section>
    </div>
  );
}
