"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/tracking";
import type { Locale } from "@/lib/i18n";
import type { InterestState, WelcomeStep } from "@/lib/onboarding";
import { InterestModal } from "./interest-modal";

// Accueil de la data room, en tête de /investors/home : par où commencer.
// Le contenu (message, fiches) est décidé côté serveur, voir lib/onboarding :
// l'accueil par défaut, ou celui préparé pour la personne. Ici, l'affichage
// seulement. Pas de cadre autour du bloc : les étapes sont déjà des cartes.


const copy = {
  fr: {
    title: "Par où commencer",
    lead: "Trois étapes pour découvrir Minah : le deck pour le projet, l'équipe pour celles et ceux qui le portent et, si le projet vous parle, une manifestation d'intérêt pour ouvrir le reste de la data room.",
    read: "Lire →",
    docsend: "DocSend ↗",
    openedForYou: "Ouvert pour vous",
    interestTitle: "Manifester un intérêt",
    interestBlurb:
      "Indicatif et non engageant. Il ouvre le niveau\u00a02 : go-to-market complet, gestion du risque, documents clés.",
    interestRecorded: "Intérêt enregistré : l'équipe vous ouvre le niveau\u00a02.",
    interestUnlocked: "Niveau\u00a02 ouvert ↓",
  },
  en: {
    title: "Where to start",
    lead: "Three steps to discover Minah: the deck for the project, the team for the people behind it and, if the project speaks to you, an expression of interest to open the rest of the data room.",
    read: "Read →",
    docsend: "DocSend ↗",
    openedForYou: "Opened for you",
    interestTitle: "Express interest",
    interestBlurb:
      "Indicative and non-binding. It opens level\u00a02: the full go-to-market, risk management, key documents.",
    interestRecorded: "Interest recorded: the team is opening level 2 for you.",
    interestUnlocked: "Level 2 open ↓",
  },
} as const;

// Classes écrites en toutes lettres pour que Tailwind les génère.
const COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

const STEP =
  "halo-hover group flex flex-col rounded-lg border border-foreground/10 bg-white/60 p-4 transition-colors hover:border-foreground/25";

export function Welcome({
  locale,
  message,
  steps,
  interest,
  demo = false,
  preview = false,
}: {
  locale: Locale;
  /** Message sur mesure ; absent, l'accueil par défaut. */
  message: string | null;
  steps: WelcomeStep[];
  interest: InterestState;
  demo?: boolean;
  /** Aperçu depuis l'admin : rien n'est tracé, l'intérêt n'est pas cliquable. */
  preview?: boolean;
}) {
  const c = copy[locale];
  const pathname = usePathname();
  const total = steps.length + (interest === "unlocked" ? 0 : 1);

  return (
    <section>
      <h2 className="text-2xl font-semibold leading-tight tracking-tight">{c.title}</h2>
      <p className="mt-3 max-w-3xl whitespace-pre-line text-[15px] leading-7 text-neutral-700">
        {message ?? c.lead}
      </p>

      <ol className={`mt-6 grid gap-3 sm:grid-cols-2 ${COLS[Math.min(total, 5)] ?? ""}`}>
        {steps.map((s, i) => {
          const inner = (
            <>
              <StepHead n={i + 1} badge={s.openedForYou ? c.openedForYou : null} />
              <h3 className="mt-3 text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1 flex-1 text-sm leading-6 text-neutral-600">{s.blurb}</p>
              <span className="mt-3 text-xs text-neutral-500 transition-colors group-hover:text-marsala">
                {s.external ? c.docsend : c.read}
              </span>
            </>
          );
          return (
            <li key={s.slug} className="flex">
              {s.external ? (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (!preview)
                      track({ type: "docsend_click", path: pathname, label: s.title });
                  }}
                  className={`${STEP} w-full`}
                >
                  {inner}
                </a>
              ) : (
                <Link href={s.href} className={`${STEP} w-full`}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}

        {interest !== "unlocked" && (
          <li className="flex">
            <div className="flex w-full flex-col rounded-lg border border-dashed border-foreground/20 p-4">
              <StepHead n={steps.length + 1} badge={null} />
              <h3 className="mt-3 text-sm font-semibold text-foreground">{c.interestTitle}</h3>
              <p className="mt-1 flex-1 text-sm leading-6 text-neutral-600">{c.interestBlurb}</p>
              <div className="mt-3">
                {interest === "recorded" ? (
                  <p className="text-sm text-neutral-700">{c.interestRecorded}</p>
                ) : preview ? (
                  <span className="inline-block rounded-md bg-marsala/80 px-4 py-2 text-sm font-medium text-white">
                    {copy[locale].interestTitle}
                  </span>
                ) : (
                  <InterestModal locale={locale} demo={demo} />
                )}
              </div>
            </div>
          </li>
        )}
      </ol>
      {interest === "unlocked" && (
        <a href="#niveau-2" className="mt-3 inline-block text-sm text-marsala hover:underline">
          {c.interestUnlocked}
        </a>
      )}
    </section>
  );
}

function StepHead({ n, badge }: { n: number; badge: string | null }) {
  return (
    <span className="flex items-center justify-between gap-2">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand/10 font-mono text-[11px] font-semibold text-marsala">
        {String(n).padStart(2, "0")}
      </span>
      {badge && (
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-marsala">
          {badge}
        </span>
      )}
    </span>
  );
}
