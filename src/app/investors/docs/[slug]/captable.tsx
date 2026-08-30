"use client";

import { useState } from "react";

// Chiffres illustratifs — à remplacer par la vraie cap table.
const HOLDERS = [
  { name: "Fondateurs", pct: 85 },
  { name: "Advisors / BSA", pct: 5 },
  { name: "Pool (ESOP)", pct: 10 },
];

const ROUND_SIZE = 1_500_000;

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const pct = (v: number) => `${(v * 100).toFixed(1).replace(".", ",")} %`;

export function CapTableInteractive() {
  const [preMoney, setPreMoney] = useState(6_000_000);
  const [ticket, setTicket] = useState(250_000);

  const postMoney = preMoney + ROUND_SIZE;
  const dilution = preMoney / postMoney;
  const roundPct = ROUND_SIZE / postMoney;
  const myPct = Math.min(ticket, ROUND_SIZE) / postMoney;

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs text-neutral-500">
            Valorisation pre-money (illustrative)
          </span>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="range"
              min={3_000_000}
              max={12_000_000}
              step={500_000}
              value={preMoney}
              onChange={(e) => setPreMoney(Number(e.target.value))}
              className="w-full accent-neutral-800 dark:accent-neutral-200"
            />
            <span className="w-20 shrink-0 text-right text-sm font-medium tabular-nums">
              {eur.format(preMoney)}
            </span>
          </div>
        </label>
        <label className="block">
          <span className="text-xs text-neutral-500">Votre ticket</span>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="range"
              min={50_000}
              max={1_000_000}
              step={50_000}
              value={ticket}
              onChange={(e) => setTicket(Number(e.target.value))}
              className="w-full accent-neutral-800 dark:accent-neutral-200"
            />
            <span className="w-20 shrink-0 text-right text-sm font-medium tabular-nums">
              {eur.format(ticket)}
            </span>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4 rounded-md border border-neutral-200 p-4 text-center dark:border-neutral-800">
        <div>
          <div className="text-xs text-neutral-500">Post-money</div>
          <div className="mt-0.5 text-lg font-semibold tabular-nums">
            {eur.format(postMoney)}
          </div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">Le tour ({eur.format(ROUND_SIZE)})</div>
          <div className="mt-0.5 text-lg font-semibold tabular-nums">
            {pct(roundPct)}
          </div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">Votre participation</div>
          <div className="mt-0.5 text-lg font-semibold tabular-nums">
            {pct(myPct)}
          </div>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500 dark:border-neutral-800">
            <th className="py-2 font-medium">Actionnaire</th>
            <th className="py-2 text-right font-medium">Avant le tour</th>
            <th className="py-2 text-right font-medium">Après le tour</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {HOLDERS.map((h) => (
            <tr key={h.name}>
              <td className="py-2.5">{h.name}</td>
              <td className="py-2.5 text-right tabular-nums">
                {pct(h.pct / 100)}
              </td>
              <td className="py-2.5 text-right tabular-nums">
                {pct((h.pct / 100) * dilution)}
              </td>
            </tr>
          ))}
          <tr className="font-medium">
            <td className="py-2.5">Nouveaux investisseurs (pre-seed)</td>
            <td className="py-2.5 text-right tabular-nums">—</td>
            <td className="py-2.5 text-right tabular-nums">{pct(roundPct)}</td>
          </tr>
          <tr className="text-neutral-500">
            <td className="py-2.5 pl-4">dont vous</td>
            <td className="py-2.5 text-right tabular-nums">—</td>
            <td className="py-2.5 text-right tabular-nums">{pct(myPct)}</td>
          </tr>
        </tbody>
      </table>

      <p className="text-xs leading-5 text-neutral-400">
        Simulation indicative sur la base d&apos;un tour de{" "}
        {eur.format(ROUND_SIZE)} entièrement souscrit. Répartition et
        valorisation illustratives, non contractuelles.
      </p>
    </div>
  );
}
