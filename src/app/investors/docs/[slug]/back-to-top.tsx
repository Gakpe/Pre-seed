"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n";
import { useOverDark } from "@/lib/use-over-dark";

// Retour en haut de page, pour les fiches longues seulement (la note de marché,
// près de sept écrans). Il apparaît une fois le premier écran dépassé.
//
// Au large (1 360 px et plus), il se pose dans la marge droite, à 32 px du bord
// de la colonne de texte (max-w-5xl moins son px-6), sur la ligne du
// bouton de questions, et son infobulle sort au-dessus : à droite, elle mordait
// sur le bouton de questions dès que la marge est étroite (1 440 px). Plus
// étroit, la marge ne suffit pas : il s'empile au-dessus du bouton de questions.
//
// Même infobulle que « Posez-nous vos questions », qui passe en crème sur la
// section sombre. Angles `rounded-lg` : les pastilles arrondies restent
// réservées aux statuts (AGENTS.md). Rendu dans <body> : un parent transformé
// de la fiche faisait défiler le bouton avec la page au lieu de le fixer. Pas
// de `halo-hover` ici : la classe pose position: relative et annule le fixed.
export function BackToTop({ locale }: { locale: Locale }) {
  const [shown, setShown] = useState(false);
  const overDark = useOverDark(42);
  // Vrai côté client seulement : le portail a besoin de document.body.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const label = locale === "fr" ? "Retour en haut" : "Back to top";

  if (!mounted) return null;

  return createPortal(
    <div
      className={`group fixed right-4 bottom-16 z-40 transition-all sm:max-[1359px]:right-5 sm:max-[1359px]:bottom-[4.5rem] min-[1360px]:right-auto min-[1360px]:bottom-5 min-[1360px]:left-[calc(50%+520px)] ${
        shown ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label={label}
        tabIndex={shown ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="grid h-9 w-9 place-items-center rounded-lg border border-foreground/15 bg-white/90 text-foreground shadow-sm backdrop-blur transition-colors hover:border-foreground/40 sm:h-11 sm:w-11"
      >
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
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
      <span
        className={`pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md px-2.5 py-1 text-xs opacity-0 shadow transition-all group-hover:translate-y-0 group-hover:opacity-100 min-[1360px]:block ${
          overDark ? "bg-background text-foreground" : "bg-foreground text-background"
        }`}
      >
        {label}
      </span>
    </div>,
    document.body
  );
}
