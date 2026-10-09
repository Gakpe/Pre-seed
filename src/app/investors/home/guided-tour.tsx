"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n";

// Visite guidée de l'accueil. Chaque étape a son texte et, au besoin, une
// cible mise en lumière (un élément de la page marqué `data-tour`) ; sans
// cible, la carte s'affiche au centre. La dernière étape peut porter une
// action principale (ouvrir une fiche, prendre rendez-vous). Les étapes sont
// composées par l'accueil (welcome.tsx) : celles par défaut, ou celles d'un
// onboarding sur mesure.
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
export function useTourAutostart(
  storageKey: string | null,
  storage: "local" | "session",
  enabled = true
) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!storageKey || !enabled) return;
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
  }, [storageKey, storage, enabled]);

  const close = useCallback(() => {
    setOpen(false);
    if (!storageKey) return;
    const store = storage === "local" ? window.localStorage : window.sessionStorage;
    store.setItem(storageKey, "1");
  }, [storageKey, storage]);

  return { open, start: () => setOpen(true), close };
}

export type TourStep = {
  /** Retours à la ligne gardés, **gras** pour ce qui doit ressortir. */
  text: string;
  /** Valeur(s) `data-tour` des éléments mis en lumière ; null : carte centrée. */
  target: string | string[] | null;
};

type Box = { left: number; top: number; right: number; bottom: number };

// **gras** dans le texte d'une étape.
function withBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

export type TourFinish = {
  label: string;
  href: string;
  external: boolean;
  onClick?: () => void;
};

export function GuidedTour({
  steps,
  finish,
  locale,
  onClose,
}: {
  steps: TourStep[];
  /** Action principale de la dernière étape ; absente, « Fermer ». */
  finish: TourFinish | null;
  locale: Locale;
  onClose: () => void;
}) {
  const c = copy[locale];
  const [index, setIndex] = useState(0);
  // Une boîte par élément mis en lumière, et leur enveloppe pour placer la carte.
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [narrow, setNarrow] = useState(false);
  const primary = useRef<HTMLElement>(null);
  const last = index === steps.length - 1;
  const rawTarget = steps[index]?.target ?? null;
  const targetKey = rawTarget === null ? "" : [rawTarget].flat().join(" ");

  // Suit les cibles pendant le défilement doux et au redimensionnement.
  useLayoutEffect(() => {
    const els = targetKey
      ? targetKey
          .split(" ")
          .map((t) => document.querySelector(`[data-tour="${t}"]`))
          .filter((el): el is Element => el !== null)
      : [];
    const update = () => {
      setNarrow(window.innerWidth < 640);
      setBoxes(els.map((el) => el.getBoundingClientRect()));
    };
    if (els.length) {
      const all = els.map((el) => el.getBoundingClientRect());
      const top = Math.min(...all.map((b) => b.top)) + window.scrollY;
      const bottom = Math.max(...all.map((b) => b.bottom)) + window.scrollY;
      // Sur mobile, la carte occupe le bas de l'écran : les cibles remontent
      // juste sous l'en-tête collant. Au large, elles sont centrées.
      const header = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      window.scrollTo({
        top:
          window.innerWidth < 640
            ? top - header - 24
            : top - Math.max(header + 24, (window.innerHeight - (bottom - top)) / 2),
        behavior: "smooth",
      });
    }
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [targetKey]);

  useEffect(() => {
    primary.current?.focus({ preventScroll: true });
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, steps.length]);

  // Enveloppe des cibles : c'est elle que la carte évite.
  const rect: Box | null = boxes.length
    ? {
        left: Math.min(...boxes.map((b) => b.left)),
        top: Math.min(...boxes.map((b) => b.top)),
        right: Math.max(...boxes.map((b) => b.right)),
        bottom: Math.max(...boxes.map((b) => b.bottom)),
      }
    : null;

  // Carte sous les cibles s'il y a la place, au-dessus sinon ; centrée quand
  // il n'y a pas de cible ; en bas d'écran sur mobile.
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
    // Un clic hors de la carte ferme la visite : le voile, comme la cible mise
    // en lumière, sont sous ce conteneur.
    <div
      className="fixed inset-0 z-[90]"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {boxes.length ? (
        // Voile percé d'une découpe par cible : elles restent nettes.
        <svg aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" data-tour-veil>
          <defs>
            <mask id="tour-holes">
              <rect width="100%" height="100%" fill="white" />
              {boxes.map((b, i) => (
                <rect
                  key={i}
                  x={b.left - PAD}
                  y={b.top - PAD}
                  width={b.right - b.left + PAD * 2}
                  height={b.bottom - b.top + PAD * 2}
                  rx={12}
                  fill="black"
                />
              ))}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(28, 15, 12, 0.55)" mask="url(#tour-holes)" />
        </svg>
      ) : (
        <div aria-hidden className="pointer-events-none fixed inset-0 bg-[rgba(28,15,12,0.55)]" />
      )}

      <div
        className="fixed overflow-y-auto rounded-xl border border-foreground/10 bg-white p-5 shadow-xl transition-all duration-300 ease-out"
        style={{ ...cardStyle, maxHeight: `calc(100dvh - ${GAP * 2}px)` }}
      >
        <button
          onClick={onClose}
          aria-label={c.close}
          className={`absolute top-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-foreground/5 hover:text-foreground ${FOCUS}`}
        >
          <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
        </button>
        <p className="whitespace-pre-line pr-7 text-[15px] leading-[1.8] text-neutral-700">
          {withBold(steps[index]?.text ?? "")}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-neutral-600">
            {index + 1}/{steps.length}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {/* Sur mobile, la croix suffit : la ligne garde Retour et l'action. */}
            {!(last && !finish) && (
              <button onClick={onClose} className={`hidden rounded text-sm text-neutral-600 hover:underline sm:inline ${FOCUS}`}>
                {last ? c.close : c.skip}
              </button>
            )}
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
            ) : finish ? (
              finish.external ? (
                <a
                  ref={(el) => {
                    primary.current = el;
                  }}
                  href={finish.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    finish.onClick?.();
                    onClose();
                  }}
                  className={`whitespace-nowrap ${primaryClass}`}
                >
                  {finish.label} ↗
                </a>
              ) : (
                <Link
                  ref={(el) => {
                    primary.current = el;
                  }}
                  href={finish.href}
                  onClick={() => {
                    finish.onClick?.();
                    onClose();
                  }}
                  className={`whitespace-nowrap ${primaryClass}`}
                >
                  {finish.label} →
                </Link>
              )
            ) : (
              <button
                ref={(el) => {
                  primary.current = el;
                }}
                onClick={onClose}
                className={primaryClass}
              >
                {c.close}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
