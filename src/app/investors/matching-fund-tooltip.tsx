"use client";

import { useEffect, useState } from "react";
import { commitments, commitmentsTotal } from "@/lib/deal";
import type { Locale } from "@/lib/i18n";

// Détail des engagements à date, en infobulle sur le montant.
//
// Aucune identité n'y figure : chaque ligne porte un rôle, et une barre floutée
// tient la place du nom. Une barre plutôt qu'un nom rendu illisible, parce
// qu'un nom flouté reste dans le DOM, se sélectionne et se lit à voix haute.
//
// Survol sur pointeur fin, appui ailleurs : même arbitrage que les portraits de
// la fiche équipe, où un tap émet aussi un mouseenter.

const copy = {
  fr: {
    title: "Engagements à date",
    total: "Total pondéré",
    upTo: "jusqu'à",
    weighted: "pondéré à",
    open: "Voir le détail des engagements à date",
    close: "Fermer",
    statuses: { soft: "Soft commitment", discussion: "En discussion" },
    footer:
      "Les identités sont communiquées après réception d'une intention d'investissement.",
  },
  en: {
    title: "Commitments to date",
    total: "Weighted total",
    upTo: "up to",
    weighted: "weighted at",
    open: "See the breakdown of commitments to date",
    close: "Close",
    statuses: { soft: "Soft commitment", discussion: "In discussion" },
    footer:
      "Identities are disclosed once an investment intention has been received.",
  },
};

function euros(amount: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function MatchingFundTooltip({
  children,
  locale,
  align = "left",
}: {
  children: React.ReactNode;
  locale: Locale;
  align?: "left" | "right";
}) {
  const c = copy[locale];
  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setCanHover(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Au doigt l'infobulle reste ouverte : il faut pouvoir la fermer ailleurs
  // qu'en retouchant le montant.
  useEffect(() => {
    if (!open || canHover) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close);
    };
  }, [open, canHover]);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        aria-label={c.open}
        className="inline-flex cursor-help items-center gap-1.5 rounded text-left underline decoration-dotted decoration-neutral-400 underline-offset-[5px] outline-none ring-brand/60 ring-offset-2 ring-offset-background transition-colors hover:decoration-brand focus-visible:ring-2"
        onPointerEnter={canHover ? () => setOpen(true) : undefined}
        onPointerLeave={canHover ? () => setOpen(false) : undefined}
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible")) setOpen(true);
        }}
        onBlur={() => setOpen(false)}
        onClick={() => {
          if (!canHover) setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {children}
        <span
          aria-hidden
          className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border border-current text-[9px] font-semibold leading-none opacity-55"
        >
          i
        </span>
      </button>

      <span
        role="tooltip"
        className={`mf-tip pointer-events-none absolute bottom-full z-30 mb-2.5 block w-[24rem] max-w-[calc(100vw-3rem)] rounded-xl border border-foreground/10 bg-white p-4 text-left shadow-xl ${
          align === "right" ? "right-0" : "left-0"
        } ${open ? "mf-tip-open" : ""}`}
      >
        <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
          {c.title}
        </span>

        <span className="mt-3 block divide-y divide-foreground/10">
          {commitments.map((line) => (
            <span key={line.id} className="flex items-start gap-3 py-2.5">
              <span className="min-w-0 flex-1">
                {/* La barre tient la place du nom. Elle ne contient rien : une
                    identité masquée ne doit pas exister dans la page. */}
                <span
                  aria-hidden
                  className="block h-2 w-24 rounded-full bg-neutral-300/80 blur-[3px]"
                />
                <span className="mt-1.5 block text-[13px] font-medium leading-tight text-foreground">
                  {line.role[locale]}
                </span>
                <span className="mt-0.5 block text-[11px] leading-tight text-neutral-400">
                  {c.statuses[line.status]}
                </span>
              </span>

              <span className="shrink-0 text-right">
                <span className="block text-[13px] font-semibold tabular-nums text-foreground">
                  {line.capped && (
                    <span className="font-normal text-neutral-400">
                      {c.upTo}{" "}
                    </span>
                  )}
                  {euros(line.gross, locale)}
                </span>
                {line.weight < 1 && (
                  <span className="mt-0.5 block text-[11px] leading-tight text-neutral-400">
                    {c.weighted} {Math.round(line.weight * 100)} %
                    <span className="mx-1">→</span>
                    <span className="tabular-nums text-neutral-500">
                      {euros(line.gross * line.weight, locale)}
                    </span>
                  </span>
                )}
              </span>
            </span>
          ))}
        </span>

        <span className="mt-3 flex items-baseline justify-between gap-3 border-t border-foreground/15 pt-3">
          <span className="text-[13px] font-semibold">{c.total}</span>
          <span className="text-base font-bold tabular-nums text-brand">
            {euros(commitmentsTotal, locale)}
          </span>
        </span>

        <span className="mt-2.5 block text-[11px] leading-4 text-neutral-400">
          {c.footer}
        </span>
      </span>
    </span>
  );
}
