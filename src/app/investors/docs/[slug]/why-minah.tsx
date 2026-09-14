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
    lead: "La croissance africaine avance plus vite que l'infrastructure supposée la financer.",

    chapters: [
      {
        eyebrow: "Le constat",
        body: "Le continent concentre la démographie et la croissance des trente prochaines années, mais sa finance est restée calibrée pour un autre marché. Le capital existe, les projets existent ; ce qui manque, c'est la couche qui les rend lisibles l'un pour l'autre. La première génération de fintech africaine (M-Pesa, Wave, Flutterwave, Paystack) a résolu le mouvement de l'argent. La deuxième résoudra son usage : le structurer, le tarifer, l'allouer, le tracer. À l'inverse des rails de transfert d'argent, Minah se positionne comme une couche de structuration : elle permet au capital international d'atteindre l'économie réelle africaine avec les standards de traçabilité et de reporting qu'exige un investisseur institutionnel.",
        quote:
          "La première génération de fintech a résolu le problème de la circulation des capitaux. La seconde résoudra le sujet de leur investissement.",
      },
      {
        eyebrow: "L'opportunité",
        body: "Les PME africaines empruntent à ~20 % en moyenne, bien au-dessus du risque réel des meilleurs dossiers. Cet écart rémunère surtout l'opacité : sans données fiables, le prêteur international évite ou surtarife. Notre métier est de produire cette information (structuration, scoring sur données locales, suivi continu, traçabilité on-chain) avec une gestion du risque de niveau institutionnel. La convergence des taux aura lieu ; la question est qui aura construit l'infrastructure qui la déclenche et capté la valeur de l'écart pendant qu'il se referme.",
        stat: { value: "~20 %", label: "le taux d'emprunt moyen des PME africaines" },
      },
      {
        eyebrow: "La conviction technologique",
        body: "On ne construit pas l'infrastructure financière de 2035 avec les outils de 2010. Notre architecture repose sur deux choix : la blockchain, pour qu'un investisseur puisse vérifier plutôt que croire, et l'IA, intégrée à l'analyse, au scoring et à l'exécution, pour collecter et actualiser en continu la donnée d'un marché fragmenté avec une équipe resserrée. Ces derniers rendent l'économie du modèle possible : un coût marginal de structuration assez bas pour servir un marché que la finance traditionnelle juge trop coûteux.",
      },
    ],

    ctaTitle: "Investir au capital de Minah.",
    ctaBody:
      "Le tour de pre-seed est ouvert. Il porte sur le capital de la société qui construit cette couche de structuration, et non sur les stratégies d'investissement obligataires de la plateforme.",
    ctaTerms: [
      { label: "Objectif", value: deal.target },
      { label: "Ticket minimum", value: deal.minTicket },
      { label: "Période", value: deal.period },
    ],
    ctaPrimary: "Voir la levée en cours",
    ctaSecondary: "Prendre rendez-vous",
  },

  en: {
    lead: "African growth is moving faster than the infrastructure meant to finance it.",

    chapters: [
      {
        eyebrow: "The diagnosis",
        body: "The continent holds the demographics and the growth of the next thirty years, but its finance is still calibrated for another market. The capital exists, the projects exist; what is missing is the layer that makes them legible to one another. African fintech's first generation (M-Pesa, Wave, Flutterwave, Paystack) solved the movement of money. The second will solve its use: structuring it, pricing it, allocating it, tracing it. Unlike money transfer rails, Minah positions itself as a structuring layer: it lets international capital reach the African real economy with the traceability and reporting standards an institutional investor requires.",
        quote:
          "The first generation of fintech solved the circulation of capital. The second will solve how that capital is invested.",
      },
      {
        eyebrow: "The opportunity",
        body: "African SMEs borrow at around 20% on average, well above the actual risk of the best files. That spread mostly pays for opacity: without reliable data, the international lender avoids or overprices. Our business is to produce that information (structuring, scoring on local data, continuous monitoring, on-chain traceability) with institutional-grade risk management. Rate convergence will happen; the question is who will have built the infrastructure that triggers it, and captured the value of the spread while it closes.",
        stat: { value: "~20%", label: "the average borrowing rate for African SMEs" },
      },
      {
        eyebrow: "The technology conviction",
        body: "You do not build the financial infrastructure of 2035 with the tools of 2010. Our architecture rests on two choices: blockchain, so that an investor can verify rather than believe, and AI, embedded in analysis, scoring and execution, to collect and continuously refresh the data of a fragmented market with a small team. Together they make the model's economics work: a marginal structuring cost low enough to serve a market traditional finance considers too expensive.",
      },
    ],

    ctaTitle: "Invest in Minah's equity.",
    ctaBody:
      "The pre-seed round is open. It concerns equity in the company building that structuring layer, not the platform's bond investment strategies.",
    ctaTerms: [
      { label: "Target", value: deal.target },
      { label: "Minimum ticket", value: deal.minTicket },
      { label: "Period", value: deal.period },
    ],
    ctaPrimary: "See the current round",
    ctaSecondary: "Book a meeting",
  },
};

// Pastilles de section : un picto plutôt qu'un numéro, la fiche se lit comme
// un raisonnement et non comme une liste. Même pastille que la levée.
const CHAPTER_ICONS = ["search", "trend", "chip"] as const;

function ChapterIcon({ kind }: { kind: (typeof CHAPTER_ICONS)[number] }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "search" && (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </>
      )}
      {kind === "trend" && (
        <>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M15 7h6v6" />
        </>
      )}
      {kind === "chip" && (
        <>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M10 10h4v4h-4zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
        </>
      )}
    </svg>
  );
}

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
        {c.chapters.map((ch, i) => (
          <section
            key={ch.eyebrow}
            className="grid gap-8 md:grid-cols-[minmax(0,1fr)_300px] md:gap-12"
          >
            <div>
              <ScrollReveal>
                <h2 className="flex items-center gap-3 text-2xl font-semibold leading-tight tracking-tight">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-marsala">
                    <ChapterIcon kind={CHAPTER_ICONS[i]} />
                  </span>
                  {ch.eyebrow}
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={70}>
                <p className="mt-4 text-[15px] leading-[1.8] text-neutral-700">
                  {ch.body}
                </p>
              </ScrollReveal>
            </div>

            {/* Colonne de marge : la phrase qui résume le chapitre, ou le
                chiffre qui le tient, centrés sur la hauteur du chapitre.
                Vide sur le dernier, c'est voulu. */}
            <div className="md:self-center">
              {"quote" in ch && ch.quote && (
                <ScrollReveal delay={140}>
                  <blockquote className="rounded-xl border border-foreground/10 bg-white/60 p-6 text-[17px] font-semibold leading-[1.4] tracking-tight text-foreground">
                    {/* Guillemets en orange, dans la ligne : les espaces
                        insécables empêchent le dernier de tomber seul. */}
                    <span className="text-brand">
                      {locale === "fr" ? "«\u00a0" : "“"}
                    </span>
                    {ch.quote}
                    <span className="text-brand">
                      {locale === "fr" ? "\u00a0»" : "”"}
                    </span>
                  </blockquote>
                </ScrollReveal>
              )}
              {"stat" in ch && ch.stat && (
                <ScrollReveal delay={140}>
                  <div className="rounded-xl border border-foreground/10 bg-white/60 p-6 text-center">
                    <p className="text-6xl font-bold tracking-tight tabular-nums text-marsala">
                      {ch.stat.value}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-neutral-500">
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
          <h2 className="text-2xl font-semibold leading-tight tracking-tight">
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
              className="halo-hover rounded-md border border-foreground/15 bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
            >
              {c.ctaSecondary} ↗
            </a>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
