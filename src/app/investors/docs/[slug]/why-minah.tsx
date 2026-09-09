import Link from "next/link";
import { deal } from "@/lib/deal";
import type { Locale } from "@/lib/i18n";
import { ScrollReveal } from "./scroll-reveal";

// Fiche « Pourquoi Minah » : trois temps, et une sortie vers la levée.
//
// Le texte vit ici plutôt qu'en base : c'est une prise de position, arrêtée
// mot à mot avec l'équipe, pas de la prose à éditer depuis l'admin. La fiche
// est donc rendue sans le contenu Supabase (voir `richOnly` dans page.tsx).

const copy = {
  fr: {
    lead: "L'Afrique n'a pas un problème de croissance, elle a un problème d'infrastructure financière.",

    chapters: [
      {
        eyebrow: "Le constat",
        body: "Le continent concentre la démographie et la croissance des trente prochaines années, mais sa finance est restée calibrée pour un autre marché. Le capital existe, les projets existent ; ce qui manque, c'est la couche qui les rend lisibles l'un pour l'autre. La première génération de fintech africaine (M-Pesa, Wave, Flutterwave, Paystack) a résolu le mouvement de l'argent. La deuxième résoudra son usage : le structurer, le tarifer, l'allouer, le tracer. C'est là que se situe Minah : non pas un rail de transfert de plus, mais la couche de structuration qui permet au capital international d'atteindre l'économie réelle africaine avec les standards de traçabilité et de reporting qu'exige un investisseur institutionnel.",
        quote:
          "La première génération de fintech africaine (M-Pesa, Wave, Flutterwave, Paystack) a résolu le mouvement de l'argent. La deuxième résoudra le sujet de son investissement.",
      },
      {
        eyebrow: "L'opportunité",
        body: "Les PME africaines empruntent à ~20 % en moyenne, bien au-dessus du risque réel des meilleurs dossiers. Ce n'est pas le prix du risque, c'est le prix de l'opacité : sans données fiables, le prêteur international évite ou surtarife. Notre métier est de produire cette information (structuration, scoring sur données locales, suivi continu, traçabilité on-chain) avec une gestion du risque de niveau institutionnel. La convergence des taux aura lieu ; la question est qui aura construit l'infrastructure qui la déclenche et capté la valeur de l'écart pendant qu'il se referme.",
        stat: { value: "~20 %", label: "le taux d'emprunt moyen des PME africaines" },
      },
      {
        eyebrow: "La conviction technologique",
        body: "On ne construit pas l'infrastructure financière de 2035 avec les outils de 2010. Deux choix structurent notre architecture : la blockchain, pour qu'un investisseur puisse vérifier plutôt que croire, et l'IA, intégrée à l'analyse, au scoring et à l'exécution, qui nous permet de collecter et d'actualiser en continu la donnée d'un marché fragmenté avec une équipe resserrée. Ce n'est pas une posture d'innovation : c'est ce qui rend l'économie du modèle possible, avec un coût marginal de structuration assez bas pour servir un marché que la finance traditionnelle juge trop coûteux.",
      },
    ],

    ctaEyebrow: "Prendre part",
    ctaTitle: "Investir au capital de Minah.",
    ctaBody:
      "Le tour de pre-seed est ouvert. Il ne s'agit pas de souscrire à une stratégie de dette, mais d'entrer au capital de la société qui construit cette couche de structuration, et de prendre part à sa croissance.",
    ctaTerms: [
      { label: "Objectif", value: deal.target },
      { label: "Ticket minimum", value: deal.minTicket },
      { label: "Période", value: deal.period },
    ],
    ctaPrimary: "Voir la levée en cours",
    ctaSecondary: "Prendre rendez-vous",
  },

  en: {
    lead: "Africa does not have a growth problem, it has a financial infrastructure problem.",

    chapters: [
      {
        eyebrow: "The diagnosis",
        body: "The continent holds the demographics and the growth of the next thirty years, but its finance is still calibrated for another market. The capital exists, the projects exist; what is missing is the layer that makes them legible to one another. African fintech's first generation (M-Pesa, Wave, Flutterwave, Paystack) solved the movement of money. The second will solve its use: structuring it, pricing it, allocating it, tracing it. That is where Minah sits: not one more transfer rail, but the structuring layer that lets international capital reach the African real economy with the traceability and reporting standards an institutional investor requires.",
        quote:
          "African fintech's first generation (M-Pesa, Wave, Flutterwave, Paystack) solved the movement of money. The second will solve how it is invested.",
      },
      {
        eyebrow: "The opportunity",
        body: "African SMEs borrow at around 20% on average, well above the actual risk of the best files. That is not the price of risk, it is the price of opacity: without reliable data, the international lender avoids or overprices. Our business is to produce that information (structuring, scoring on local data, continuous monitoring, on-chain traceability) with institutional-grade risk management. Rate convergence will happen; the question is who will have built the infrastructure that triggers it, and captured the value of the spread while it closes.",
        stat: { value: "~20%", label: "the average borrowing rate for African SMEs" },
      },
      {
        eyebrow: "The technology conviction",
        body: "You do not build the financial infrastructure of 2035 with the tools of 2010. Two choices structure our architecture: blockchain, so that an investor can verify rather than believe, and AI, embedded in analysis, scoring and execution, which lets us collect and continuously refresh the data of a fragmented market with a small team. This is not an innovation posture: it is what makes the economics of the model possible, with a marginal structuring cost low enough to serve a market traditional finance considers too expensive.",
      },
    ],

    ctaEyebrow: "Take part",
    ctaTitle: "Invest in Minah's equity.",
    ctaBody:
      "The pre-seed round is open. This is not about subscribing to a debt strategy, but about taking equity in the company building that structuring layer, and sharing in its growth.",
    ctaTerms: [
      { label: "Target", value: deal.target },
      { label: "Minimum ticket", value: deal.minTicket },
      { label: "Period", value: deal.period },
    ],
    ctaPrimary: "See the current round",
    ctaSecondary: "Book a meeting",
  },
};

export function WhyMinah({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <div className="mt-8">
      {/* L'accroche porte la thèse à elle seule : elle est traitée comme un
          titre, pas comme un paragraphe. */}
      <ScrollReveal>
        <p className="max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-[28px]">
          {c.lead}
        </p>
      </ScrollReveal>

      <div className="mt-14 space-y-14">
        {c.chapters.map((ch) => (
          <section
            key={ch.eyebrow}
            className="grid gap-8 md:grid-cols-[minmax(0,1fr)_300px] md:gap-12"
          >
            <div>
              <ScrollReveal>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                  {ch.eyebrow}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={70}>
                <p className="mt-3 text-[15px] leading-[1.8] text-neutral-700">
                  {ch.body}
                </p>
              </ScrollReveal>
            </div>

            {/* Colonne de marge : la phrase qui résume le chapitre, ou le
                chiffre qui le tient. Vide sur le dernier, c'est voulu. */}
            <div className="md:pt-7">
              {"quote" in ch && ch.quote && (
                <ScrollReveal delay={140}>
                  <blockquote className="border-l-[3px] border-brand pl-5 text-[19px] font-semibold leading-[1.35] tracking-tight text-foreground">
                    {ch.quote}
                  </blockquote>
                </ScrollReveal>
              )}
              {"stat" in ch && ch.stat && (
                <ScrollReveal delay={140}>
                  <div className="border-l-[3px] border-salvia pl-5">
                    <p className="text-5xl font-bold tracking-tight tabular-nums text-brand">
                      {ch.stat.value}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-neutral-500">
                      {ch.stat.label}
                    </p>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Sortie de page : la fiche explique la thèse, elle doit finir par
          proposer d'y prendre part. */}
      <ScrollReveal>
        <section className="mt-16 rounded-xl border border-brand/25 bg-brand/[0.05] p-7 sm:p-9">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
            {c.ctaEyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight">
            {c.ctaTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.8] text-neutral-700">
            {c.ctaBody}
          </p>

          <dl className="mt-6 grid grid-cols-3 gap-x-6 gap-y-4 border-t border-brand/20 pt-5 sm:max-w-lg">
            {c.ctaTerms.map((term) => (
              <div key={term.label}>
                <dt className="text-xs text-neutral-500">{term.label}</dt>
                <dd className="mt-0.5 text-sm font-medium">{term.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/investors/docs/la-levee"
              className="halo-hover rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              {c.ctaPrimary}
            </Link>
            <a
              href={deal.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="halo-hover rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground/50"
            >
              {c.ctaSecondary} ↗
            </a>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
