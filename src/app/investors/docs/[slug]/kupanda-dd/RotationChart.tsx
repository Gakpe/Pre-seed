"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ROTATION_CYCLES } from "@/lib/kupanda-client";

// La rotation du capital sur 12 mois, sous la cascade de risque : le capital
// finance le fonds de roulement de contrats publics par cycles de 3 à 5 mois,
// l'un après l'autre (trois cycles indicatifs), et chaque financement est
// assuré ; les deux versements tombent au 6e mois et à l'échéance. Une frise,
// une seule série ; chaque cycle s'explique au survol, et le tableau en repli
// redit tout sans survol. Textes de la dataroom Kupanda du front (Julien,
// 01/11/2026).

const copy = {
  fr: {
    title: "La rotation du capital sur 12 mois",
    lead: "Le capital n'attend pas l'échéance. Les contrats publics courent sur cinq ans et plus ; Kupanda n'en finance que le fonds de roulement, par cycles de 3 à 5 mois, l'un après l'autre, soit environ trois cycles dans l'année. Chaque financement est assuré.",
    capital: "Le capital",
    payments: "Les versements",
    cycle: "Cycle {n}",
    duration: "{n} mois",
    tip: "Mois {from} à {to} : le fonds de roulement de contrats publics, financé sur {len}, couvert par un performance bond et une assurance crédit.",
    coupon6: "Coupon, 6e mois",
    coupon12: "Coupon et principal, 12e mois",
    month: "mois",
    note: "Durées indicatives : chaque cycle de financement dure 3 à 5 mois ; les contrats publics, eux, courent sur cinq ans et plus. Chaque financement est couvert par un performance bond et une assurance crédit ; l'ensemble du portefeuille, par la garantie d'Africa Rise.",
    table: "Voir les cycles en tableau",
    tableHide: "Masquer le tableau",
    cols: ["Cycle", "Mois", "Durée", "Protection"],
    protection: "Performance bond et assurance crédit",
  },
  en: {
    title: "Capital rotation over 12 months",
    lead: "Capital does not wait for maturity. Public contracts run for five years or more; Kupanda only finances their working capital, in 3 to 5 month cycles, one after another, about three cycles a year. Every financing is insured.",
    capital: "Capital",
    payments: "Payments",
    cycle: "Cycle {n}",
    duration: "{n} months",
    tip: "Months {from} to {to}: working capital for public contracts, financed over {len}, covered by a performance bond and credit insurance.",
    coupon6: "Coupon, month 6",
    coupon12: "Coupon and principal, month 12",
    month: "months",
    note: "Indicative durations: each financing cycle lasts 3 to 5 months; the public contracts themselves run for five years or more. Every financing is covered by a performance bond and credit insurance; the whole portfolio, by the Africa Rise guarantee.",
    table: "Show the cycles as a table",
    tableHide: "Hide the table",
    cols: ["Cycle", "Months", "Length", "Protection"],
    protection: "Performance bond and credit insurance",
  },
} as const;

const TICKS = [0, 3, 6, 9, 12];
const pct = (m: number) => `${(m / 12) * 100}%`;
const fill = (tpl: string, vars: Record<string, string | number>): string =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

function Shield({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function Grid() {
  return TICKS.map((m) => <span key={m} aria-hidden className="absolute inset-y-0 w-px bg-foreground/10" style={{ left: pct(m) }} />);
}

export function RotationChart({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [open, setOpen] = useState(false);
  const num = (m: number) => (locale === "fr" ? String(m).replace(".", ",") : String(m));
  const rows = ROTATION_CYCLES.map((cy, i) => {
    const length = fill(c.duration, { n: num(cy.to - cy.from) });
    return {
      cy,
      name: fill(c.cycle, { n: i + 1 }),
      span: `${num(cy.from)} → ${num(cy.to)}`,
      length,
      tip: fill(c.tip, { from: num(cy.from), to: num(cy.to), len: length }),
    };
  });
  const row = "grid gap-x-4 gap-y-1 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:items-center";
  const label = "text-sm text-neutral-600";

  return (
    <section>
      <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
      <p className="mt-1.5 max-w-3xl text-sm leading-6 text-neutral-700">{c.lead}</p>

      <figure className="mt-3 rounded-xl border border-foreground/10 bg-white/50 px-5 py-5 sm:px-7">
        <div className="space-y-3">
          {/* Le capital : trois cycles bout à bout. */}
          <div className={row}>
            <span className={label}>{c.capital}</span>
            <div className="relative h-10">
              <Grid />
              {rows.map((r) => (
                <span
                  key={r.name}
                  title={r.tip}
                  // Fond opaque : translucide, les graduations se liraient à travers.
                  className="absolute inset-y-1 flex items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-md bg-[#fdefe5] px-2 text-xs font-semibold text-marsala ring-1 ring-inset ring-brand/30"
                  style={{ left: `calc(${pct(r.cy.from)} + 1px)`, width: `calc(${pct(r.cy.to - r.cy.from)} - 2px)` }}
                >
                  <Shield className="h-3.5 w-3.5 shrink-0" />
                  <span aria-hidden>{r.name}</span>
                  <span aria-hidden className="font-normal max-sm:hidden">
                    {r.length}
                  </span>
                  <span className="sr-only">{r.tip}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Les versements : le coupon du 6e mois au-dessus de la ligne, coupon
              et principal à l'échéance en dessous. */}
          <div className={row}>
            <span className={label}>{c.payments}</span>
            <div className="relative h-16">
              <Grid />
              <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-foreground/15" />
              <span aria-hidden className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-marsala" style={{ left: pct(6) }} />
              <span className="absolute bottom-[calc(50%+9px)] -translate-x-1/2 whitespace-nowrap text-xs font-medium text-foreground" style={{ left: pct(6) }}>
                {c.coupon6}
              </span>
              <span aria-hidden className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-marsala" />
              <span className="absolute right-0 top-[calc(50%+9px)] whitespace-nowrap text-xs font-medium text-foreground">{c.coupon12}</span>
            </div>
          </div>

          {/* L'axe des mois : la dernière graduation porte l'unité. */}
          <div className={row}>
            <span className="max-sm:hidden" />
            <div className="relative h-5 text-xs tabular-nums text-neutral-600">
              {TICKS.map((m, i) => {
                const last = i === TICKS.length - 1;
                return (
                  <span
                    key={m}
                    className={`absolute top-0 whitespace-nowrap ${last ? "right-0" : i ? "-translate-x-1/2" : ""}`}
                    style={last ? undefined : { left: pct(m) }}
                  >
                    {last ? `${m} ${c.month}` : m}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-5 flex gap-2 text-sm leading-6 text-neutral-600">
          <Shield className="mt-1 h-4 w-4 shrink-0 text-marsala" />
          <span>{c.note}</span>
        </p>

        {/* La même chose sans survol ni couleur. */}
        <details className="mt-3" onToggle={(e) => setOpen(e.currentTarget.open)}>
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-marsala underline decoration-marsala/30 underline-offset-4 hover:decoration-marsala [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
            {open ? c.tableHide : c.table}
          </summary>
          <div className="overflow-x-auto">
            <table className="mt-3 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-neutral-600">
                  {c.cols.map((h) => (
                    <th key={h} className="py-2 pr-4 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10 text-neutral-800">
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td className="py-2 pr-4 font-medium">{r.name}</td>
                    <td className="whitespace-nowrap py-2 pr-4 tabular-nums">{r.span}</td>
                    <td className="whitespace-nowrap py-2 pr-4 tabular-nums">{r.length}</td>
                    <td className="py-2 pr-4">{c.protection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </figure>
    </section>
  );
}
