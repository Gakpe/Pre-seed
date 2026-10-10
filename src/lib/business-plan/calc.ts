// Calculs de la fiche « Revenus, cash et runway » (business plan).
//
// Les chiffres eux-mêmes ne sont pas dans le code : le dépôt est public. Ils
// vivent dans app_settings (clé BP_SETTING_KEY, lecture service role, voir
// lib/business-plan/data.ts). Ce module ne fait que recalculer, à partir des
// cinq jeux de données, tout ce que la page affiche : aucun total n'est saisi
// à la main. Si le BP change, on remplace les données, la page suit.

export type Strategy = {
  strategy: string;
  family: string;
  amount_raised: number;
  /** "AAAA-MM" */
  first_closing: string;
  bond_rate: number;
  gross_yield: number;
  default_rate: number;
  duration_months: number;
  status: "En cours de levée" | "À venir";
};

export type StrategyRevenue = {
  strategy: string;
  year: number;
  interest_income: number;
  transaction_fees: number;
  coupons_paid: number;
  net_revenue: number;
};

export type PnlLine = { year: number; side: "Revenus" | "Dépenses"; bucket: string; amount: number };

export type CashFlow = {
  month: string;
  strategies_cash: number;
  operations_cash: number;
  net_flow: number;
  cash_position: number;
};

export type Lever = {
  level: number;
  name: string;
  name_en: string;
  start: string;
  monthly_cost: number;
  one_off_cost: number;
  one_off_month: string | null;
  pct_of_raised: number;
  assumptions: string;
  assumptions_en: string;
};

export type BusinessPlanData = {
  version: string;
  strategies: Strategy[];
  strategy_revenue: StrategyRevenue[];
  pnl_split: PnlLine[];
  cash_flows: CashFlow[];
  levers: Lever[];
};

/** Mois de la levée : la trésorerie la reçoit à partir de ce mois. */
export const RAISE_MONTH = "2026-11";
export const RAISE_OPTIONS = [1_500_000, 3_000_000] as const;

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function netRevenue(d: BusinessPlanData, strategy: string, year: number): number {
  return sum(
    d.strategy_revenue.filter((r) => r.strategy === strategy && r.year === year).map((r) => r.net_revenue)
  );
}

// ── Bloc Kupanda (stratégies en cours de levée) ─────────────────────────────

export function inProgress(d: BusinessPlanData) {
  const list = d.strategies.filter((s) => s.status === "En cours de levée");
  const all2027 = sum(d.strategies.map((s) => netRevenue(d, s.strategy, 2027)));
  const net2027 = sum(list.map((s) => netRevenue(d, s.strategy, 2027)));
  return {
    list: list.map((s) => ({
      ...s,
      net2027: netRevenue(d, s.strategy, 2027),
      fees: sum(d.strategy_revenue.filter((r) => r.strategy === s.strategy).map((r) => r.transaction_fees)),
    })),
    amount: sum(list.map((s) => s.amount_raised)),
    net2027,
    share2027: all2027 ? net2027 / all2027 : 0,
  };
}

// ── Bloc « Ce qui arrive » ──────────────────────────────────────────────────

export function upcoming(d: BusinessPlanData) {
  const list = d.strategies
    .filter((s) => s.status === "À venir")
    .sort((a, b) => a.first_closing.localeCompare(b.first_closing))
    .map((s) => ({ ...s, net2027: netRevenue(d, s.strategy, 2027), net2028: netRevenue(d, s.strategy, 2028) }));
  return {
    list,
    amount: sum(list.map((s) => s.amount_raised)),
    net: sum(list.map((s) => s.net2027 + s.net2028)),
    maxAmount: Math.max(0, ...list.map((s) => s.amount_raised)),
  };
}

// ── Revenus et dépenses par année ───────────────────────────────────────────

export function pnlByYear(d: BusinessPlanData) {
  const years = [...new Set(d.pnl_split.map((l) => l.year))].sort();
  return years.map((year) => {
    const lines = d.pnl_split.filter((l) => l.year === year);
    const revenues = lines.filter((l) => l.side === "Revenus");
    const costs = lines.filter((l) => l.side === "Dépenses");
    const rev = sum(revenues.map((l) => l.amount));
    const cost = sum(costs.map((l) => l.amount));
    return { year, revenues, costs, rev, cost, ebitda: rev - cost };
  });
}

// ── Trésorerie et leviers d'accélération ────────────────────────────────────

/** Coût d'un levier sur un mois donné (formule du brief). */
export function leverCost(d: BusinessPlanData, l: Lever, month: string): number {
  let c = 0;
  if (month >= l.start) c += l.monthly_cost;
  if (l.one_off_month === month) c += l.one_off_cost;
  if (l.pct_of_raised && month >= l.start) {
    c += l.pct_of_raised * sum(d.strategies.filter((s) => s.first_closing === month).map((s) => s.amount_raised));
  }
  return c;
}

/** Coût mensuel du scénario k : leviers de niveau 1 à k ; k = 0, Plan BP. */
function scenarioCost(d: BusinessPlanData, k: number, month: string): number {
  return sum(d.levers.filter((l) => l.level <= k).map((l) => leverCost(d, l, month)));
}

export type ScenarioRow = {
  k: number;
  cost: number;
  burn2027: number;
  runwayNoRevenue: number;
  /** Mois avant la première trésorerie négative ; null : jamais sur l'horizon. */
  runwayBp: number | null;
  low: { value: number; month: string };
  end: number;
  series: { month: string; cash: number }[];
};

function monthsBetween(a: string, b: string): number {
  const [ya, ma] = a.split("-").map(Number);
  const [yb, mb] = b.split("-").map(Number);
  return (yb - ya) * 12 + (mb - ma);
}

export function scenarios(d: BusinessPlanData, raised: number): ScenarioRow[] {
  const ks = [0, ...d.levers.map((l) => l.level).sort((a, b) => a - b)];
  return ks.map((k) => {
    let cumulated = 0;
    const series = d.cash_flows.map((c) => {
      cumulated += scenarioCost(d, k, c.month);
      return { month: c.month, cash: c.cash_position + (c.month >= RAISE_MONTH ? raised : 0) - cumulated };
    });
    const cost = cumulated;
    const in2027 = d.cash_flows.filter((c) => c.month.startsWith("2027"));
    const burn2027 = sum(in2027.map((c) => scenarioCost(d, k, c.month) - c.operations_cash)) / (in2027.length || 1);
    const after = series.filter((s) => s.month >= RAISE_MONTH);
    const negative = after.find((s) => s.cash < 0);
    const low = after.reduce((m, s) => (s.cash < m.cash ? s : m), after[0]);
    return {
      k,
      cost,
      burn2027,
      runwayNoRevenue: burn2027 > 0 ? Math.floor(raised / burn2027) : Infinity,
      runwayBp: negative ? monthsBetween(RAISE_MONTH, negative.month) : null,
      low: { value: low.cash, month: low.month },
      end: series[series.length - 1].cash,
      series,
    };
  });
}

/** Horizon du BP en mois, de la levée au dernier mois inclus (« > 26 mois »). */
export function horizonMonths(d: BusinessPlanData): number {
  const last = d.cash_flows[d.cash_flows.length - 1]?.month ?? RAISE_MONTH;
  return monthsBetween(RAISE_MONTH, last) + 1;
}
