"use client";

import { useEffect, useState } from "react";
import { matchingFund, matchingFundTotal } from "@/lib/deal";
import type { Locale } from "@/lib/i18n";

// Le chiffre du matching fund est un total pondéré. Affiché seul, c'est un
// nombre sorti de nulle part : l'infobulle donne les trois lignes et, pour
// celles qui ne sont pas confirmées, le brut et le pondéré côte à côte.
//
// Survol sur pointeur fin, appui ailleurs, même arbitrage que les portraits
// de la fiche équipe : sur tactile un tap émet aussi un mouseenter.

const copy = {
  fr: {
    title: "Engagements à date",
    weighted: "pondéré",
    soft: "soft commitment",
    total: "Total pondéré",
    open: "Voir le détail des engagements à date",
  },
  en: {
    title: "Commitments to date",
    weighted: "weighted",
    soft: "soft commitment",
    total: "Weighted total",
    open: "See the breakdown of commitments to date",
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

  // Sur tactile, l'infobulle reste ouverte : il faut pouvoir la fermer
  // ailleurs qu'en retouchant le montant.
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
        className="cursor-help border-b border-dashed border-neutral-400 pb-px text-left outline-none ring-brand/60 ring-offset-2 ring-offset-background focus-visible:ring-2"
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
      </button>

      <span
        role="tooltip"
        className={`mf-tip pointer-events-none absolute bottom-full z-30 mb-2 block w-[23rem] max-w-[calc(100vw-5rem)] rounded-lg border border-foreground/10 bg-white p-3.5 shadow-lg ${
          align === "right" ? "right-0" : "left-0"
        } ${open ? "mf-tip-open" : ""}`}
      >
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          {c.title}
        </span>

        <span className="mt-2 block space-y-1.5">
          {matchingFund.map((line) => (
            <span
              key={line.id}
              className="flex items-baseline justify-between gap-3 text-xs"
            >
              <span className="shrink-0 text-neutral-600">
                {line.label[locale]}
              </span>
              <span className="shrink-0 tabular-nums text-foreground">
                {euros(line.gross, locale)}
                {line.weight < 1 ? (
                  <span className="text-[10.5px] text-neutral-400">
                    {" "}
                    ({c.weighted} {Math.round(line.weight * 100)} % :{" "}
                    {euros(line.gross * line.weight, locale)})
                  </span>
                ) : (
                  <span className="text-[10.5px] text-neutral-400">
                    {" "}
                    ({c.soft})
                  </span>
                )}
              </span>
            </span>
          ))}
        </span>

        <span className="mt-2.5 flex items-baseline justify-between gap-3 border-t border-foreground/10 pt-2.5 text-xs font-semibold">
          <span>{c.total}</span>
          <span className="tabular-nums text-brand">
            {euros(matchingFundTotal, locale)}
          </span>
        </span>
      </span>
    </span>
  );
}
