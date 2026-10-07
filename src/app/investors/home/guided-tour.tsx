"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n";
import type { WelcomeStep } from "@/lib/onboarding";

// Visite guidée d'un onboarding sur mesure. Le message préparé pour la
// personne est découpé en paragraphes (séparés par une ligne vide), un par
// étape : le premier s'affiche au centre de l'écran, les suivants mettent en
// lumière, dans la data room, la première fiche mise en avant, avec un
// bouton pour l'ouvrir sur la dernière étape.
// Elle se lance une fois, après la cinématique d'entrée ; ensuite on la
// rejoue depuis l'accueil.

const copy = {
  fr: { next: "Suivant", back: "Retour", skip: "Passer", close: "Fermer" },
  en: { next: "Next", back: "Back", skip: "Skip", close: "Close" },
} as const;

const CARD_W = 420;
const GAP = 16;
const PAD = 8;
const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-marsala/40 focus-visible:ring-offset-2";
const SECONDARY = `rounded-lg border border-foreground/15 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-foreground/35 ${FOCUS}`;

// Ouverture automatique à la première visite. `storage` : local pour un vrai
// investisseur (une fois par navigateur), session en démo (une fois par
// démo ouverte).
export function useTourAutostart(storageKey: string | null, storage: "local" | "session") {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!storageKey) return;
    const store = storage === "local" ? window.localStorage : window.sessionStorage;
    if (store.getItem(storageKey)) return;
    // La cinématique d'entrée passe devant : on attend qu'elle ait disparu.
    // Cet effet tourne avant celui de la cinématique (enfant avant layout) :
    // son déclencheur encore posé veut dire qu'elle va démarrer.
    let timer: ReturnType<typeof setTimeout>;
    const splashPending = () =>
      window.sessionStorage.getItem("minah_splash_pending") === "1" ||
      new URLSearchParams(window.location.search).has("welcome") ||
      document.querySelector("[data-splash]") !== null;
    const wait = () => {
      if (splashPending()) timer = setTimeout(wait, 300);
      // Second regard avant d'ouvrir : la cinématique a pu lire son
      // déclencheur sans être encore affichée.
      else timer = setTimeout(() => (splashPending() ? wait() : setOpen(true)), 500);
    };
    wait();
    return () => clearTimeout(timer);
  }, [storageKey, storage]);

  const close = useCallback(() => {
    setOpen(false);
    if (!storageKey) return;
    const store = storage === "local" ? window.localStorage : window.sessionStorage;
    store.setItem(storageKey, "1");
  }, [storageKey, storage]);

  return { open, start: () => setOpen(true), close };
}

export function GuidedTour({
  paragraphs,
  focus,
  locale,
  onClose,
}: {
  paragraphs: string[];
  /** Fiche mise en lumière à partir de la deuxième étape. */
  focus: WelcomeStep | null;
  locale: Locale;
  onClose: () => void;
}) {
  const c = copy[locale];
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [narrow, setNarrow] = useState(false);
  const primary = useRef<HTMLElement>(null);
  const last = index === paragraphs.length - 1;
  const spotlight = index > 0 && focus !== null;

  // Suit la cible pendant le défilement doux et au redimensionnement.
  useLayoutEffect(() => {
    const el = spotlight ? document.querySelector('[data-tour="focus"]') : null;
    const update = () => {
      setNarrow(window.innerWidth < 640);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    if (el) {
      // Sur mobile, la carte occupe le bas de l'écran : la cible remonte
      // juste sous l'en-tête collant au lieu d'être centrée.
      if (window.innerWidth < 640) {
        const header = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
        const top = el.getBoundingClientRect().top + window.scrollY - header - 24;
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [spotlight]);

  useEffect(() => {
    primary.current?.focus({ preventScroll: true });
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, paragraphs.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, paragraphs.length]);

  // Carte sous la cible s'il y a la place, au-dessus sinon ; centrée quand il
  // n'y a pas de cible ; en bas d'écran sur mobile.
  let cardStyle: React.CSSProperties;
  if (narrow) {
    cardStyle = { left: GAP, right: GAP, bottom: GAP };
  } else if (!rect) {
    cardStyle = { left: "50%", top: "50%", width: CARD_W + 40, transform: "translate(-50%, -50%)" };
  } else {
    const left = Math.min(Math.max(rect.left, GAP), window.innerWidth - CARD_W - GAP);
    const below = window.innerHeight - rect.bottom > 320;
    cardStyle = below
      ? { left, top: rect.bottom + PAD + GAP, width: CARD_W }
      : { left, bottom: window.innerHeight - rect.top + PAD + GAP, width: CARD_W };
  }

  const primaryClass = `rounded-lg bg-marsala px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 ${FOCUS}`;

  // Rendue dans body : la page crée des contextes d'empilement qui la
  // laisseraient sous la bulle de questions.
  return createPortal(
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-live="polite">
      {rect ? (
        // Le halo sombre est l'ombre de la découpe : la cible reste nette.
        <div
          aria-hidden
          className="pointer-events-none fixed rounded-xl transition-all duration-300 ease-out"
          style={{
            left: rect.left - PAD,
            top: rect.top - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: "0 0 0 9999px rgba(28, 15, 12, 0.55)",
          }}
        />
      ) : (
        <div aria-hidden className="fixed inset-0 bg-[rgba(28,15,12,0.55)]" />
      )}

      <div
        className="fixed rounded-xl border border-foreground/10 bg-white p-5 shadow-xl transition-all duration-300 ease-out"
        style={cardStyle}
      >
        <p className="whitespace-pre-line text-[15px] leading-[1.8] text-neutral-700">
          {paragraphs[index]}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-neutral-600">
            {index + 1}/{paragraphs.length}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button onClick={onClose} className={`rounded text-sm text-neutral-600 hover:underline ${FOCUS}`}>
              {last ? c.close : c.skip}
            </button>
            {index > 0 && (
              <button onClick={() => setIndex(index - 1)} className={SECONDARY}>
                {c.back}
              </button>
            )}
            {!last ? (
              <button
                ref={(el) => {
                  primary.current = el;
                }}
                onClick={() => setIndex(index + 1)}
                className={primaryClass}
              >
                {c.next}
              </button>
            ) : focus ? (
              focus.external ? (
                <a
                  ref={(el) => {
                    primary.current = el;
                  }}
                  href={focus.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className={`whitespace-nowrap ${primaryClass}`}
                >
                  {focus.title} ↗
                </a>
              ) : (
                <Link
                  ref={(el) => {
                    primary.current = el;
                  }}
                  href={focus.href}
                  onClick={onClose}
                  className={`whitespace-nowrap ${primaryClass}`}
                >
                  {focus.title} →
                </Link>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
