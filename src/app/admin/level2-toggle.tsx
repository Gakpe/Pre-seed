"use client";

import { useState, useTransition } from "react";
import { setLevel2Access } from "./actions";

// Ouverture du niveau 2 : une fenêtre de confirmation avant, parce que le
// bouton se trouvait à un clic d'un autre et que des niveaux 2 ont été ouverts
// sans le vouloir. Le retrait, lui, reste immédiat : il ne donne rien à voir.
export function Level2Toggle({
  investorId,
  name,
  granted,
  compact = false,
  canGrant,
}: {
  investorId: string;
  name: string;
  granted: boolean;
  /** Dans la liste : libellé court, sans cadre. */
  compact?: boolean;
  /** Seul Julien ouvre le niveau 2 ; les autres admins voient l'état, sans bouton. */
  canGrant: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  function apply(next: boolean) {
    start(async () => {
      await setLevel2Access(investorId, next);
      setOpen(false);
    });
  }

  const label = compact
    ? granted ? "retirer" : "donner"
    : granted ? "Retirer le niveau 2" : "Donner le niveau 2";
  const buttonClass = compact
    ? "text-xs text-neutral-500 hover:underline disabled:opacity-50"
    : "rounded-md border border-neutral-300 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900";

  if (!granted && !canGrant) {
    return (
      <span
        className="text-xs text-neutral-400"
        title="L'ouverture du niveau 2 est réservée à Julien."
      >
        {compact ? "Julien" : "Ouverture réservée à Julien"}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => (granted ? apply(false) : setOpen(true))}
        className={buttonClass}
      >
        {pending ? "…" : label}
      </button>

      {open && (
        // Les clics s'arrêtent ici : dans la liste, la ligne entière navigue au clic.
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/25 p-6 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="level2-title"
            className="w-full max-w-sm rounded-xl border border-foreground/10 bg-background p-6 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="level2-title" className="text-base font-semibold">
              Donner le niveau 2 à {name} ?
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Cette personne verra la cap table, le contrat cadre, le pacte
              d&apos;associés, les scénarios de sortie, la gestion des risques, la
              roadmap écosystème et la roadmap technique.
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Rien ne lui est envoyé : à vous de la prévenir, avec le mail type
              « Bienvenue au niveau 2 ».
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => apply(true)}
                disabled={pending}
                className="flex-1 rounded-md bg-marsala py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {pending ? "…" : "Donner le niveau 2"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:border-neutral-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
