"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  RAISE_MONTH,
  RAISE_OPTIONS,
  horizonMonths,
  inProgress,
  pnlByYear,
  scenarios,
  upcoming,
  type BusinessPlanData,
  type PnlLine,
} from "@/lib/business-plan/calc";
import { SectionTitle } from "../section-title";

// Fiche « Revenus, cash et runway » (business plan, niveau 2, brouillon).
// Les chiffres arrivent du serveur (app_settings, jamais dans le code : le
// dépôt est public) ; tout ce qui s'affiche est recalculé ici, voir calc.ts.

// Couleurs (contrastes calculés sur le fond #f6f4ef) : marsala pour les
// revenus et le Plan BP (12,0), orange assombri pour le scénario sélectionné
// (5,0 ; l'orange de marque, à 2,9, ne tient pas même en trait), gris pour les
// coûts et les autres scénarios. Vert 5,9 et rouge 6,0 pour l'EBITDA, toujours
// avec son signe.
const MARSALA = "#61100d";
const SELECTED = "#c2410c";
const POSITIVE = "#1f6b45";
const NEGATIVE = "#b42318";
const REVENUE_SHADES = ["#61100d", "#a8502f", "#dda283"];
const COST_SHADES = ["#4f4a45", "#76706a", "#9d978f", "#bdb7af", "#d9d4cd"];

const BUCKETS_EN: Record<string, string> = {
  "Intérêts des crédits déployés": "Interest on deployed credit",
  "Frais de transaction": "Transaction fees",
  "Autres (projets, refinancement, sponsoring)": "Other (projects, refinancing, sponsoring)",
  "Coupons versés aux porteurs": "Coupons paid to bondholders",
  "Risque et partage de performance": "Risk and performance sharing",
  Distribution: "Distribution",
  Tech: "Tech",
  "Équipe et frais généraux": "Team and overheads",
};

const FAMILY_EN: Record<string, string> = {
  "Eastern Africa - SMEs strategies": "Eastern Africa, SMEs",
  "Western Africa - SMEs strategies": "Western Africa, SMEs",
  "Eastern Africa - Startups strategies": "Eastern Africa, startups",
  "Western Africa - Startups strategies": "Western Africa, startups",
};
const FAMILY_FR: Record<string, string> = {
  "Eastern Africa - SMEs strategies": "Afrique de l'Est, PME",
  "Western Africa - SMEs strategies": "Afrique de l'Ouest, PME",
  "Eastern Africa - Startups strategies": "Afrique de l'Est, startups",
  "Western Africa - Startups strategies": "Afrique de l'Ouest, startups",
};

const copy = {
  fr: {
    kicker: "Minah SAS, business plan 2026-2028, scénario Best Case",
    lead: (a: string, b: string, n: number, c: string, d: string) =>
      `Kupanda 1 et 2, en cours de levée pour ${a}, génèrent ${b} de revenu net en 2027. ${n} autres stratégies, soit ${c} à lever d'ici début 2028, ajoutent ${d} sur 2027-2028.`,
    netDef:
      "Revenu net d'une stratégie : intérêts encaissés et frais de transaction, moins les coupons versés aux porteurs, avant coût du risque, partage de performance et distribution.",
    s1: "En cours : Kupanda 1 et 2",
    s2: "Ce qui arrive",
    s3: "Revenus et dépenses en un coup d'œil",
    s4: "Cash burn, runway et accélération",
    inProgress: "En cours de levée",
    net2027: "revenu net 2027",
    amount: "Montant",
    coupon: "Coupon porteurs",
    grossYield: "Rendement brut attendu",
    fees: "Frais de transaction",
    total: "Kupanda 1 + 2",
    totalAmount: "Montant total",
    share: "Part du revenu net 2027 de Minah",
    th: ["Stratégie", "Segment", "1er closing", "Montant", "Revenu net 2027", "Revenu net 2028"],
    upcomingTotal: "Total",
    revenues: "Revenus",
    costs: "Dépenses",
    ebitda: "EBITDA",
    ofTotal: "du total",
    raised: "Montant levé",
    scenarioTh: [
      "Scénario",
      "Coût de l'accélération (estimations)",
      "Burn mensuel 2027",
      "Runway sans revenu",
      "Runway selon le BP",
      "Point bas de trésorerie",
      "Trésorerie fin 2028",
    ],
    planBp: "Plan BP",
    months: (n: number) => `${n} mois`,
    beyond: (n: number) => `> ${n} mois`,
    chartTitle: "Trésorerie mois par mois",
    raise: "Levée",
    clickHint: "Cliquez sur une ligne pour afficher sa courbe.",
    leversTitle: "Hypothèses de chaque levier",
    addedCost: "coût ajouté, estimation",
    notModelled:
      "Les revenus supplémentaires que ces leviers peuvent apporter ne sont pas modélisés : seuls leurs coûts le sont.",
    source:
      "Source : business plan Minah SAS (fichier 260902_Minah_BP.xlsx), scénario Best Case, montants en euros. Coûts des leviers d'accélération : estimations, hors BP.",
  },
  en: {
    kicker: "Minah SAS, 2026-2028 business plan, Best Case scenario",
    lead: (a: string, b: string, n: number, c: string, d: string) =>
      `Kupanda 1 and 2, currently raising ${a}, generate ${b} of net revenue in 2027. ${n} further strategies, ${c} to raise by early 2028, add ${d} over 2027-2028.`,
    netDef:
      "Net revenue of a strategy: interest received and transaction fees, minus coupons paid to bondholders, before cost of risk, performance sharing and distribution.",
    s1: "In progress: Kupanda 1 and 2",
    s2: "What comes next",
    s3: "Revenue and costs at a glance",
    s4: "Cash burn, runway and acceleration",
    inProgress: "Raising",
    net2027: "net revenue 2027",
    amount: "Amount",
    coupon: "Bondholder coupon",
    grossYield: "Expected gross yield",
    fees: "Transaction fees",
    total: "Kupanda 1 + 2",
    totalAmount: "Total amount",
    share: "Share of Minah's 2027 net revenue",
    th: ["Strategy", "Segment", "First closing", "Amount", "Net revenue 2027", "Net revenue 2028"],
    upcomingTotal: "Total",
    revenues: "Revenue",
    costs: "Costs",
    ebitda: "EBITDA",
    ofTotal: "of total",
    raised: "Amount raised",
    scenarioTh: [
      "Scenario",
      "Acceleration cost (estimates)",
      "Monthly burn 2027",
      "Runway without revenue",
      "Runway per the BP",
      "Cash low point",
      "Cash end 2028",
    ],
    planBp: "BP plan",
    months: (n: number) => `${n} months`,
    beyond: (n: number) => `> ${n} months`,
    chartTitle: "Monthly cash position",
    raise: "Raise",
    clickHint: "Click a row to show its curve.",
    leversTitle: "Assumptions behind each lever",
    addedCost: "added cost, estimate",
    notModelled:
      "The additional revenue these levers may bring is not modelled: only their costs are.",
    source:
      "Source: Minah SAS business plan (file 260902_Minah_BP.xlsx), Best Case scenario, amounts in euros. Acceleration lever costs: estimates, outside the BP.",
  },
} as const;

// ── Formats ─────────────────────────────────────────────────────────────────

function trim(n: number, decimals: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  }).format(n);
}

/** Montant : compact à partir de 10 000 € (« 3,95 M€ », « 41,6 k€ »), entier en dessous. */
function eur(n: number, locale: Locale) {
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  const fr = locale === "fr";
  if (a >= 1_000_000) {
    const v = trim(a / 1_000_000, 2, locale);
    return fr ? `${sign}${v} M€` : `${sign}€${v}M`;
  }
  if (a >= 10_000) {
    const k = a / 1000;
    const v = trim(k, k >= 100 ? 0 : 1, locale);
    return fr ? `${sign}${v} k€` : `${sign}€${v}K`;
  }
  const v = trim(a, 0, locale);
  return fr ? `${sign}${v} €` : `${sign}€${v}`;
}

function pct(r: number, locale: Locale, decimals = 2) {
  const v = trim(r * 100, decimals, locale);
  return locale === "fr" ? `${v} %` : `${v}%`;
}

function month(m: string, locale: Locale) {
  const [y, mo] = m.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

const CARD = "rounded-xl border border-foreground/10 bg-white/50 p-5";

export function BusinessPlan({ data, locale }: { data: BusinessPlanData; locale: Locale }) {
  const c = copy[locale];
  const ip = useMemo(() => inProgress(data), [data]);
  const up = useMemo(() => upcoming(data), [data]);
  const pnl = useMemo(() => pnlByYear(data), [data]);

  return (
    <div className="mt-8">
      <p className="text-sm text-neutral-600">{c.kicker}</p>
      <p className="mt-3 max-w-3xl text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
        {c.lead(eur(ip.amount, locale), eur(ip.net2027, locale), up.list.length, eur(up.amount, locale), eur(up.net, locale))}
      </p>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600">{c.netDef}</p>

      {/* 01, Kupanda 1 et 2 */}
      <section className="mt-14">
        <SectionTitle n="01">{c.s1}</SectionTitle>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {ip.list.map((s) => (
            <li key={s.strategy} className={`${CARD} flex flex-col`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{s.strategy}</h3>
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-marsala">
                  {c.inProgress}
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums text-marsala">
                {eur(s.net2027, locale)}
              </p>
              <p className="text-sm text-neutral-600">{c.net2027}</p>
              <dl className="mt-4 space-y-1.5 border-t border-foreground/10 pt-4 text-sm">
                <Row label={c.amount} value={eur(s.amount_raised, locale)} />
                <Row label={c.coupon} value={pct(s.bond_rate, locale)} />
                <Row label={c.grossYield} value={pct(s.gross_yield, locale)} />
                <Row label={c.fees} value={eur(s.fees, locale)} />
              </dl>
            </li>
          ))}
          <li className={`${CARD} flex flex-col`}>
            <h3 className="text-sm font-semibold text-foreground">{c.total}</h3>
            <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums text-marsala">
              {eur(ip.net2027, locale)}
            </p>
            <p className="text-sm text-neutral-600">{c.net2027}</p>
            <dl className="mt-4 space-y-1.5 border-t border-foreground/10 pt-4 text-sm">
              <Row label={c.totalAmount} value={eur(ip.amount, locale)} />
              <Row label={c.share} value={pct(ip.share2027, locale, 0)} />
            </dl>
          </li>
        </ul>
      </section>

      {/* 02, ce qui arrive */}
      <section className="mt-14">
        <SectionTitle n="02">{c.s2}</SectionTitle>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-foreground/15 text-left text-neutral-600">
                <th className="py-2 pr-4 font-medium">{c.th[0]}</th>
                <th className="hidden py-2 pr-4 font-medium md:table-cell">{c.th[1]}</th>
                <th className="py-2 pr-4 font-medium">{c.th[2]}</th>
                <th className="py-2 pr-4 font-medium">{c.th[3]}</th>
                <th className="py-2 pr-4 text-right font-medium">{c.th[4]}</th>
                <th className="py-2 text-right font-medium">{c.th[5]}</th>
              </tr>
            </thead>
            <tbody>
              {up.list.map((s) => (
                <tr key={s.strategy} className="border-b border-foreground/10">
                  <td className="py-3 pr-4 font-medium text-foreground">{s.strategy}</td>
                  <td className="hidden py-3 pr-4 text-neutral-600 md:table-cell">
                    {(locale === "fr" ? FAMILY_FR : FAMILY_EN)[s.family] ?? s.family}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-neutral-700">{month(s.first_closing, locale)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="w-16 shrink-0 tabular-nums text-neutral-700">{eur(s.amount_raised, locale)}</span>
                      <span className="hidden h-2 flex-1 rounded-full bg-foreground/[0.06] sm:block">
                        <span
                          className="block h-2 rounded-full"
                          style={{ width: `${(s.amount_raised / up.maxAmount) * 100}%`, background: MARSALA }}
                        />
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-neutral-700">{eur(s.net2027, locale)}</td>
                  <td className="py-3 text-right tabular-nums text-neutral-700">{eur(s.net2028, locale)}</td>
                </tr>
              ))}
              <tr className="font-semibold text-foreground">
                <td className="py-3 pr-4">{c.upcomingTotal}</td>
                <td className="hidden md:table-cell" />
                <td />
                <td className="py-3 pr-4 tabular-nums">{eur(up.amount, locale)}</td>
                <td className="py-3 pr-4 text-right tabular-nums">
                  {eur(up.list.reduce((a, s) => a + s.net2027, 0), locale)}
                </td>
                <td className="py-3 text-right tabular-nums">
                  {eur(up.list.reduce((a, s) => a + s.net2028, 0), locale)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 03, revenus et dépenses */}
      <section className="mt-14">
        <SectionTitle n="03">{c.s3}</SectionTitle>
        <PnlBars pnl={pnl} locale={locale} />
      </section>

      {/* 04, trésorerie et accélération */}
      <section className="mt-14">
        <SectionTitle n="04">{c.s4}</SectionTitle>
        <Runway data={data} locale={locale} />
      </section>

      <p className="mt-14 border-t border-foreground/10 pt-4 text-xs leading-5 text-neutral-600">{c.source}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-neutral-600">{label}</dt>
      <dd className="font-medium tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

// ── Barres revenus / dépenses ───────────────────────────────────────────────

type Hover = { label: string; amount: number; share: number; x: number; y: number } | null;

function PnlBars({ pnl, locale }: { pnl: ReturnType<typeof pnlByYear>; locale: Locale }) {
  const c = copy[locale];
  const [hover, setHover] = useState<Hover>(null);
  const max = Math.max(...pnl.flatMap((y) => [y.rev, y.cost]), 1);
  const bucketName = (b: string) => (locale === "fr" ? b : (BUCKETS_EN[b] ?? b));
  const revBuckets = pnl[0]?.revenues.map((l) => l.bucket) ?? [];
  const costBuckets = pnl[0]?.costs.map((l) => l.bucket) ?? [];

  const bar = (lines: PnlLine[], shades: string[], total: number, label: string) => (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-sm text-neutral-600">{label}</span>
      <div className="flex h-5 flex-1 items-center">
        <div className="flex h-5 overflow-hidden rounded-sm" style={{ width: `${(total / max) * 100}%` }}>
          {lines.map((l, i) => {
            const v = Math.max(0, l.amount);
            if (!v) return null;
            return (
              <span
                key={l.bucket}
                className="h-full border-r-2 border-[#f6f4ef] last:border-r-0"
                style={{ width: `${(v / total) * 100}%`, background: shades[i % shades.length] }}
                onMouseEnter={(e) => {
                  const r = (e.currentTarget.closest("[data-pnl]") as HTMLElement).getBoundingClientRect();
                  const s = e.currentTarget.getBoundingClientRect();
                  setHover({ label: bucketName(l.bucket), amount: l.amount, share: v / total, x: s.left - r.left + s.width / 2, y: s.top - r.top });
                }}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
        </div>
        <span className="ml-2 whitespace-nowrap text-sm font-medium tabular-nums text-foreground">{eur(total, locale)}</span>
      </div>
    </div>
  );

  return (
    <div className="mt-6">
      <div data-pnl className="relative space-y-7">
        {pnl.map((y) => (
          <div key={y.year}>
            <p className="text-sm font-semibold text-foreground">{y.year}</p>
            <div className="mt-2 space-y-1.5">
              {bar(y.revenues, REVENUE_SHADES, y.rev, c.revenues)}
              {bar(y.costs, COST_SHADES, y.cost, c.costs)}
            </div>
            <p className="mt-2 text-sm">
              <span className="text-neutral-600">{c.ebitda} </span>
              <span className="font-semibold tabular-nums" style={{ color: y.ebitda >= 0 ? POSITIVE : NEGATIVE }}>
                {y.ebitda >= 0 ? "+" : ""}
                {eur(y.ebitda, locale)}
              </span>
            </p>
          </div>
        ))}
        {hover && (
          <div
            className="pointer-events-none absolute z-10 w-56 -translate-x-1/2 -translate-y-full rounded-lg border border-foreground/10 bg-white px-3 py-2 text-xs leading-5 shadow-md"
            style={{ left: hover.x, top: hover.y - 6 }}
          >
            <p className="font-semibold text-foreground">{hover.label}</p>
            <p className="text-neutral-600">
              {eur(hover.amount, locale)}, {pct(hover.share, locale, 0)} {c.ofTotal}
            </p>
          </div>
        )}
      </div>
      {/* Légende des huit postes : revenus puis dépenses. */}
      <ul className="mt-6 grid gap-x-6 gap-y-2 text-sm text-neutral-700 sm:grid-cols-2">
        {revBuckets.map((b, i) => (
          <Legend key={b} color={REVENUE_SHADES[i % REVENUE_SHADES.length]} label={bucketName(b)} />
        ))}
        {costBuckets.map((b, i) => (
          <Legend key={b} color={COST_SHADES[i % COST_SHADES.length]} label={bucketName(b)} />
        ))}
      </ul>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: color }} />
      {label}
    </li>
  );
}

// ── Trésorerie, scénarios et leviers ────────────────────────────────────────

function Runway({ data, locale }: { data: BusinessPlanData; locale: Locale }) {
  const c = copy[locale];
  const [raised, setRaised] = useState<number>(RAISE_OPTIONS[0]);
  const [selected, setSelected] = useState(0);
  const rows = useMemo(() => scenarios(data, raised), [data, raised]);
  const horizon = horizonMonths(data);
  const levers = [...data.levers].sort((a, b) => a.level - b.level);
  const name = (k: number) =>
    k === 0 ? c.planBp : `${k > 1 ? "+ " : ""}${locale === "fr" ? levers[k - 1].name : levers[k - 1].name_en}`;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-neutral-600">{c.raised}</span>
        <div className="inline-flex rounded-lg border border-foreground/15 p-0.5" role="group">
          {RAISE_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRaised(r)}
              aria-pressed={raised === r}
              className={`rounded-md px-3 py-1 text-sm transition-colors ${
                raised === r ? "bg-foreground text-background" : "text-foreground hover:bg-foreground/5"
              }`}
            >
              {eur(r, locale)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-foreground/15 text-left align-bottom text-neutral-600">
              {c.scenarioTh.map((h, i) => (
                <th
                  key={h}
                  className={`py-2 pr-4 font-medium ${i > 0 ? "text-right" : ""} ${i === 3 || i === 5 ? "hidden md:table-cell" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.k}
                onClick={() => setSelected(r.k)}
                className={`cursor-pointer border-b border-foreground/10 transition-colors ${
                  selected === r.k ? "bg-brand/[0.06]" : "hover:bg-foreground/[0.03]"
                }`}
              >
                <td className="py-3 pr-4 font-medium text-foreground">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-0.5 w-4 shrink-0 rounded"
                      style={{ background: r.k === 0 ? MARSALA : selected === r.k ? SELECTED : "#bdb7af" }}
                    />
                    {name(r.k)}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right tabular-nums">{r.cost ? eur(r.cost, locale) : "0"}</td>
                <td className="py-3 pr-4 text-right tabular-nums">{eur(r.burn2027, locale)}</td>
                <td className="hidden py-3 pr-4 text-right tabular-nums md:table-cell">{c.months(r.runwayNoRevenue)}</td>
                <td className="py-3 pr-4 text-right tabular-nums">
                  {r.runwayBp === null ? c.beyond(horizon) : c.months(r.runwayBp)}
                </td>
                <td className="hidden whitespace-nowrap py-3 pr-4 text-right tabular-nums md:table-cell">
                  {eur(r.low.value, locale)} ({month(r.low.month, locale)})
                </td>
                <td className="py-3 text-right tabular-nums">{eur(r.end, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-neutral-600">{c.clickHint}</p>

      <CashChart rows={rows} selected={selected} locale={locale} name={name} />

      <p className="mt-4 text-sm leading-6 text-neutral-600">{c.notModelled}</p>

      <h3 className="mt-10 text-sm font-semibold text-foreground">{c.leversTitle}</h3>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2">
        {levers.map((l) => {
          const added = rows[l.level].cost - rows[l.level - 1].cost;
          return (
            <li key={l.level} className={CARD}>
              <h4 className="text-sm font-semibold text-foreground">
                {l.level}. {locale === "fr" ? l.name : l.name_en}
              </h4>
              <p className="mt-2 text-lg font-semibold tabular-nums text-marsala">
                +{eur(added, locale)}{" "}
                <span className="text-sm font-normal text-neutral-600">{c.addedCost}</span>
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                {locale === "fr" ? l.assumptions : l.assumptions_en}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── Graphique de trésorerie mensuelle ───────────────────────────────────────

const W = 720;
const H = 300;
const P = { left: 56, right: 92, top: 16, bottom: 30 };

function CashChart({
  rows,
  selected,
  locale,
  name,
}: {
  rows: ReturnType<typeof scenarios>;
  selected: number;
  locale: Locale;
  name: (k: number) => string;
}) {
  const c = copy[locale];
  const [hover, setHover] = useState<number | null>(null);
  const months = rows[0].series.map((s) => s.month);
  const all = rows.flatMap((r) => r.series.map((s) => s.cash));
  const yMin = Math.min(0, ...all);
  const yMax = Math.max(...all);
  const x = (i: number) => P.left + (i * (W - P.left - P.right)) / (months.length - 1);
  const y = (v: number) => P.top + ((yMax - v) / (yMax - yMin || 1)) * (H - P.top - P.bottom);
  const path = (s: { cash: number }[]) => s.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.cash)}`).join(" ");
  const ticks = niceTicks(yMin, yMax);
  const raiseIdx = months.indexOf(RAISE_MONTH);
  const order = rows.map((r) => r.k).sort((a, b) => (a === selected ? 1 : b === selected ? -1 : a === 0 ? 1 : b === 0 ? -1 : 0));
  const color = (k: number) => (k === selected && k !== 0 ? SELECTED : k === 0 ? MARSALA : "#c9c4be");

  return (
    <figure className="mt-6 rounded-xl border border-foreground/10 bg-white/50 p-4 sm:p-5">
      <figcaption className="text-sm font-semibold text-foreground">{c.chartTitle}</figcaption>
      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={c.chartTitle}
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const px = ((e.clientX - r.left) / r.width) * W;
            const i = Math.round(((px - P.left) / (W - P.left - P.right)) * (months.length - 1));
            setHover(i >= 0 && i < months.length ? i : null);
          }}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={P.left} x2={W - P.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#9d978f" : "#e7e2da"} strokeWidth={1} />
              <text x={P.left - 8} y={y(t) + 4} textAnchor="end" className="fill-neutral-600 text-[12px] tabular-nums">
                {eur(t, locale)}
              </text>
            </g>
          ))}
          {months.map((m, i) =>
            m.endsWith("-01") || i === 0 ? (
              <text key={m} x={x(i)} y={H - 8} textAnchor="middle" className="fill-neutral-600 text-[12px]">
                {m.slice(0, 4)}
              </text>
            ) : null
          )}
          {raiseIdx >= 0 && (
            <g>
              <line x1={x(raiseIdx)} x2={x(raiseIdx)} y1={P.top} y2={H - P.bottom} stroke="#9d978f" strokeDasharray="4 4" />
              <text x={x(raiseIdx) + 5} y={P.top + 10} className="fill-neutral-600 text-[12px]">
                {c.raise}
              </text>
            </g>
          )}
          {order.map((k) => {
            const r = rows[k];
            const strong = k === 0 || k === selected;
            const last = r.series[r.series.length - 1];
            return (
              <g key={k}>
                <path d={path(r.series)} fill="none" stroke={color(k)} strokeWidth={strong ? 2.25 : 1} strokeLinejoin="round" />
                {strong && (
                  <text x={W - P.right + 6} y={y(last.cash) + 4} className="text-[12px] font-semibold tabular-nums" fill={color(k)}>
                    {eur(last.cash, locale)}
                  </text>
                )}
              </g>
            );
          })}
          {hover !== null && (
            <line x1={x(hover)} x2={x(hover)} y1={P.top} y2={H - P.bottom} stroke="#2c1716" strokeOpacity={0.25} />
          )}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 w-52 rounded-lg border border-foreground/10 bg-white px-3 py-2 text-xs leading-5 shadow-md"
            style={{
              left: `${(x(hover) / W) * 100}%`,
              transform: x(hover) > W / 2 ? "translateX(calc(-100% - 10px))" : "translateX(10px)",
            }}
          >
            <p className="font-semibold capitalize text-foreground">{month(months[hover], locale)}</p>
            {[0, ...(selected ? [selected] : [])].map((k) => (
              <p key={k} className="flex justify-between gap-3 text-neutral-700">
                <span>{name(k)}</span>
                <span className="tabular-nums">{eur(rows[k].series[hover].cash, locale)}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}

function niceTicks(min: number, max: number): number[] {
  const span = max - min || 1;
  const raw = span / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => span / s <= 5) ?? raw;
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-6; v += step) out.push(Math.round(v));
  if (!out.includes(0) && min <= 0 && max >= 0) out.push(0);
  return out.sort((a, b) => a - b);
}
