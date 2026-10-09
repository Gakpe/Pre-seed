"use client";

import { track } from "@/lib/tracking";
import { deal } from "@/lib/deal";
import { t, type Locale } from "@/lib/i18n";
import type { WelcomeStep } from "@/lib/onboarding";
import { GuidedTour, useTourAutostart, type TourFinish, type TourStep } from "./guided-tour";

// Accueil de la data room, en tête de /investors/home : une visite guidée,
// lancée à la première visite, et un lien pour la revoir.
//
// Par défaut, trois étapes écrites ici : un mot d'accueil, « Pourquoi Minah ? »
// mis en lumière dans la data room, puis le rendez-vous. Un onboarding sur
// mesure (lib/onboarding) les remplace par son message, un paragraphe par
// étape : le premier au centre, chacun des suivants sur la fiche mise en
// avant de même rang (le deuxième sur la première fiche, etc.), le dernier
// sur toutes les fiches restantes. Des fiches mises en avant consécutives de
// la même catégorie comptent pour une seule et s'allument ensemble (le deck
// risk et l'architecture de risque, par exemple). Le bouton final ouvre la première fiche de
// la dernière étape.

const copy = {
  fr: {
    replay: "Revoir la présentation",
    tourActions: "Bouton : ouvrir {doc}.",
    spotlight: "En lumière : {doc}",
    welcome: (name: string | null) =>
      `Bonjour${name ? ` ${name}` : ""}, merci de prendre le temps de regarder l'opportunité Minah. Cette data room réunit ce qu'il faut pour vous faire une idée du projet.`,
    why: "Commencez par « Pourquoi Minah ? » : le constat, l'opportunité, et les choix technologiques sur lesquels repose Minah.",
    startWith: (title: string) => `Commencez par «\u00a0${title}\u00a0».`,
    talk: "Les documents de la data room servent surtout à saisir l'ambition du projet ; le récit complet, nous le faisons de vive voix. Prenez rendez-vous pour un voice over de l'équipe, ou posez-nous vos questions depuis la bulle en bas à droite.",
  },
  en: {
    replay: "Replay the introduction",
    tourActions: "Button: open {doc}.",
    spotlight: "Spotlight: {doc}",
    welcome: (name: string | null) =>
      `Hello${name ? ` ${name}` : ""}, thank you for taking the time to look at the Minah opportunity. This data room brings together what you need to form a view of the project.`,
    why: "Start with “Why Minah?”: the diagnosis, the opportunity, and the technology choices Minah is built on.",
    startWith: (title: string) => `Start with “${title}”.`,
    talk: "The data room documents are mostly there to convey the ambition of the project; we tell the full story in person. Book a meeting for a voice-over from the team, or ask us your questions from the bubble at the bottom right.",
  },
} as const;

export function Welcome({
  locale,
  message,
  steps,
  firstName = null,
  demo = false,
  preview = false,
  autoStart = true,
  tourKey = null,
}: {
  locale: Locale;
  /** Message sur mesure ; absent, la visite par défaut. */
  message: string | null;
  /** Fiches mises en avant ; la première est mise en lumière. */
  steps: WelcomeStep[];
  firstName?: string | null;
  demo?: boolean;
  /** Aperçu depuis l'admin : les étapes à plat, sans visite. */
  preview?: boolean;
  /** Lancer la visite d'elle-même si elle n'a pas encore été vue. */
  autoStart?: boolean;
  /** Clé de la visite déjà vue ; change quand le message est modifié. */
  tourKey?: string | null;
}) {
  const c = copy[locale];
  const focus = steps[0] ?? null;
  const paragraphs = (message ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const custom = paragraphs.length > 0;
  // Fiches mises en avant consécutives regroupées sur une même étape : même
  // catégorie, ou toutes deux ouvertes pour la personne au-dessus de son
  // niveau (les deux roadmaps de Newform, par exemple).
  const groups: WelcomeStep[][] = [];
  for (const st of steps) {
    const g = groups[groups.length - 1];
    const last = g?.[g.length - 1];
    if (last && (last.category === st.category || (last.openedForYou && st.openedForYou))) g.push(st);
    else groups.push([st]);
  }
  // Un paragraphe de plus qu'il n'y a de groupes : le dernier met en lumière
  // le rendez-vous, comme la visite par défaut, et la visite se ferme dessus.
  const meetingStep = custom && paragraphs.length - 1 > groups.length;
  const lastDocPara = paragraphs.length - 1 - (meetingStep ? 1 : 0);
  // Fiches mises en lumière par le paragraphe i (i >= 1) d'un message sur
  // mesure : le groupe de même rang, et pour le dernier paragraphe de fiches
  // tous les groupes qui restent.
  const focusFor = (i: number): WelcomeStep[] => {
    if (i === 0 || i > lastDocPara || groups.length === 0) return [];
    const from = Math.min(i - 1, groups.length - 1);
    return i === lastDocPara && !meetingStep ? groups.slice(from).flat() : groups[from];
  };
  const lastFocus = custom && lastDocPara > 0 ? (focusFor(lastDocPara)[0] ?? null) : focus;
  const tour = useTourAutostart(
    preview ? null : tourKey,
    demo ? "session" : "local",
    autoStart
  );

  // Aperçu admin d'un onboarding sur mesure : ses étapes, dans l'ordre.
  if (preview) {
    return (
      <ol className="grid gap-3 sm:grid-cols-2">
        {paragraphs.map((p, i) => (
          <li key={i} className="rounded-lg border border-foreground/10 bg-white/60 p-4">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/10 font-mono text-[11px] font-semibold text-marsala">
              {String(i + 1).padStart(2, "0")}
            </span>
            {focusFor(i).length > 0 && (
              <p className="mt-2 text-xs leading-5 text-neutral-600">
                {c.spotlight.replace("{doc}", focusFor(i).map((d) => d.title).join(", "))}
              </p>
            )}
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-700">
              {p.replace(/\*\*/g, "")}
            </p>
            {meetingStep && i === paragraphs.length - 1 && (
              <p className="mt-2 text-xs leading-5 text-neutral-600">
                {c.spotlight.replace("{doc}", t(locale, "meeting.cta"))}
              </p>
            )}
            {i === paragraphs.length - 1 && (meetingStep || lastFocus) && (
              <p className="mt-2 text-xs leading-5 text-neutral-600">
                {c.tourActions.replace(
                  "{doc}",
                  meetingStep ? t(locale, "meeting.cta") : (lastFocus?.title ?? "")
                )}
              </p>
            )}
          </li>
        ))}
      </ol>
    );
  }

  const tourSteps: TourStep[] = custom
    ? paragraphs.map((text, i) => {
        if (meetingStep && i === paragraphs.length - 1) return { text, target: "meeting" };
        const docs = focusFor(i);
        return { text, target: docs.length ? docs.map((d) => `doc-${d.slug}`) : null };
      })
    : [
        { text: c.welcome(firstName), target: null },
        {
          // Un onboarding sans message mais avec ses fiches garde la visite par
          // défaut : l'étape nomme alors la fiche mise en avant.
          text: !focus || focus.slug === "pourquoi-minah" ? c.why : c.startWith(focus.title),
          target: focus ? `doc-${focus.slug}` : null,
        },
        { text: c.talk, target: "meeting" },
      ];

  // Sur mesure : ouvrir la dernière fiche montrée, ou le rendez-vous si la
  // visite finit dessus. Par défaut : le rendez-vous.
  const finish: TourFinish | null = custom && !meetingStep
    ? lastFocus && { label: lastFocus.title, href: lastFocus.href, external: lastFocus.external }
    : {
        label: t(locale, "meeting.cta"),
        href: deal.meetingUrl,
        external: true,
        onClick: () => {
          if (!demo) track({ type: "cta_click", path: "/investors/home", label: "rdv-visite" });
        },
      };

  return (
    <>
      <button
        onClick={tour.start}
        className="inline-flex items-center gap-1.5 rounded-lg text-[15px] text-marsala underline decoration-marsala/30 underline-offset-4 hover:decoration-marsala"
      >
        {c.replay}
        <span aria-hidden>↺</span>
      </button>
      {tour.open && (
        <GuidedTour steps={tourSteps} finish={finish} locale={locale} onClose={tour.close} />
      )}
    </>
  );
}
