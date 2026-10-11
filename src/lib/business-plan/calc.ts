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
  /** Canal de distribution principal ; null tant qu'il n'est pas renseigné. */
  channel?: "direct" | "api" | "onchain" | null;
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
  /** Ce que le levier doit permettre de lever en plus (estimation hors BP). */
  impact?: { volume: number; axis: string; text: string; text_en: string; status?: string };
  /**
   * Borne haute du coût (estimation hors BP) : retenue quand la levée est la
   * plus haute, pour que l'argent en plus serve à accélérer. Les champs de
   * premier niveau sont la borne basse.
   */
  high?: {
    monthly_cost: number;
    one_off_cost: number;
    pct_of_raised: number;
    assumptions: string;
    assumptions_en: string;
  };
  /** Ce que le levier débloque côté produit (levier tech). */
  unlocks?: { fr: string; en: string }[];
};

export type AcceleratedPool = {
  name: string;
  name_en: string;
  amount: number;
  /** Montant de levée à partir duquel le fonds entre dans le plan. */
  requires_raise: number;
  description: string;
  description_en: string;
};

export type BusinessPlanData = {
  version: string;
  strategies: Strategy[];
  strategy_revenue: StrategyRevenue[];
  pnl_split: PnlLine[];
  cash_flows: CashFlow[];
  levers: Lever[];
  /** Objectifs de l'équipe, hors BP : ils pilotent les chiffres phares. */
  targets?: {
    revenue_2027_locked: number;
    volume_early_2028: number;
    raise_time_months?: number;
    /** Trésorerie sous laquelle on ne veut pas descendre. */
    cash_floor?: number;
  };
  accelerated_pool?: AcceleratedPool;
  /**
   * Marché secondaire on-chain, hors BP (proxy) : part du volume cumulé émis
   * qui s'échange chaque année, et commission prélevée sur ces échanges.
   */
  secondary_market?: {
    start: string;
    share_by_year: Record<string, number>;
    fee_rate: number;
    status?: string;
  };
  /** Indicateurs de plateforme, hors BP ; null tant qu'ils ne sont pas renseignés. */
  platform?: {
    launch_time_weeks: number | null;
    marginal_cost: number | null;
    api_channels: number | null;
    onchain_share: number | null;
  };
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

export type Bound = "low" | "high";

/** Borne retenue pour un montant levé : la haute pour la levée la plus haute. */
export function boundFor(raised: number): Bound {
  return raised >= RAISE_OPTIONS[RAISE_OPTIONS.length - 1] ? "high" : "low";
}

/** Paramètres de coût d'un levier pour une borne. */
export function leverParams(l: Lever, bound: Bound) {
  const h = bound === "high" ? l.high : undefined;
  return {
    monthly_cost: h?.monthly_cost ?? l.monthly_cost,
    one_off_cost: h?.one_off_cost ?? l.one_off_cost,
    pct_of_raised: h?.pct_of_raised ?? l.pct_of_raised,
  };
}

/** Coût d'un levier sur un mois donné (formule du brief), pour une borne. */
export function leverCost(d: BusinessPlanData, l: Lever, month: string, bound: Bound = "low"): number {
  const p = leverParams(l, bound);
  let c = 0;
  if (month >= l.start) c += p.monthly_cost;
  if (l.one_off_month === month) c += p.one_off_cost;
  if (p.pct_of_raised && month >= l.start) {
    c += p.pct_of_raised * sum(d.strategies.filter((s) => s.first_closing === month).map((s) => s.amount_raised));
  }
  return c;
}

/** Coût mensuel du scénario k : leviers de niveau 1 à k ; k = 0, Plan BP. */
function scenarioCost(d: BusinessPlanData, k: number, month: string, bound: Bound): number {
  return sum(d.levers.filter((l) => l.level <= k).map((l) => leverCost(d, l, month, bound)));
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

export function scenarios(d: BusinessPlanData, raised: number, bound: Bound = boundFor(raised)): ScenarioRow[] {
  const ks = [0, ...d.levers.map((l) => l.level).sort((a, b) => a - b)];
  return ks.map((k) => {
    let cumulated = 0;
    const series = d.cash_flows.map((c) => {
      cumulated += scenarioCost(d, k, c.month, bound);
      return { month: c.month, cash: c.cash_position + (c.month >= RAISE_MONTH ? raised : 0) - cumulated };
    });
    const cost = cumulated;
    const in2027 = d.cash_flows.filter((c) => c.month.startsWith("2027"));
    const burn2027 = sum(in2027.map((c) => scenarioCost(d, k, c.month, bound) - c.operations_cash)) / (in2027.length || 1);
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

// ── Ajouts du 11/10/2026 ────────────────────────────────────────────────────

/** Revenus d'une année par stratégie : intérêts et frais de transaction. */
export function revenueByStrategy(d: BusinessPlanData, year: number) {
  return d.strategy_revenue
    .filter((r) => r.year === year && (r.interest_income || r.transaction_fees))
    .map((r) => ({ strategy: r.strategy, interest: r.interest_income, fees: r.transaction_fees }));
}

/**
 * Part d'une stratégie à lever pour atteindre un revenu net 2027 donné, en plus
 * des autres stratégies déjà comptées. Au prorata : le revenu d'une stratégie
 * suit le montant levé.
 */
export function amountNeededFor(
  d: BusinessPlanData,
  strategy: string,
  target: number,
  alreadyCounted: string[]
): number {
  const s = d.strategies.find((x) => x.strategy === strategy);
  if (!s) return 0;
  const base = sum(alreadyCounted.map((n) => netRevenue(d, n, 2027)));
  const full = netRevenue(d, strategy, 2027);
  if (full <= 0) return s.amount_raised;
  return Math.max(0, Math.min(1, (target - base) / full)) * s.amount_raised;
}

/** Détail du coût d'un levier sur l'horizon du BP, pour expliquer son total. */
export function leverBreakdown(d: BusinessPlanData, l: Lever, bound: Bound = "low") {
  const p = leverParams(l, bound);
  const months = d.cash_flows.map((c) => c.month).filter((m) => m >= l.start);
  const closings = p.pct_of_raised
    ? d.strategies
        .filter((s) => s.first_closing >= l.start && months.includes(s.first_closing))
        .map((s) => ({ strategy: s.strategy, month: s.first_closing, cost: s.amount_raised * p.pct_of_raised }))
    : [];
  const monthly = p.monthly_cost * months.length;
  const oneOff = l.one_off_month && d.cash_flows.some((c) => c.month === l.one_off_month) ? p.one_off_cost : 0;
  return {
    pct: p.pct_of_raised,
    monthly: { perMonth: p.monthly_cost, months: months.length, total: monthly },
    oneOff: { amount: oneOff, month: l.one_off_month },
    closings,
    total: monthly + oneOff + sum(closings.map((c) => c.cost)),
  };
}

// ── Où est le risque (ajout du 11/10/2026) ──────────────────────────────────

/**
 * Revenu net 2027 perdu si chaque stratégie à venir closait `delay` mois plus
 * tard. Approximation, à afficher comme telle : intérêts et coupons étalés
 * uniformément à partir du closing ; les frais de transaction restent en 2027
 * tant que le closing y reste, sinon ils basculent en 2028.
 */
export function delayImpact2027(d: BusinessPlanData, delay: number): number {
  return sum(
    d.strategies
      .filter((s) => s.status === "À venir" && s.first_closing.startsWith("2027"))
      .map((s) => {
        const r = d.strategy_revenue.find((x) => x.strategy === s.strategy && x.year === 2027);
        if (!r) return 0;
        const m = Number(s.first_closing.slice(5, 7));
        const active = 13 - m;
        const kept = Math.max(0, active - delay);
        const recurring = r.net_revenue - r.transaction_fees;
        const fees = m + delay <= 12 ? r.transaction_fees : 0;
        return r.net_revenue - (recurring * kept) / active - fees;
      })
  );
}

export function riskView(d: BusinessPlanData) {
  const all2027 = sum(d.strategies.map((s) => netRevenue(d, s.strategy, 2027)));
  const future = d.strategies.filter((s) => s.status === "À venir");
  const future2027 = sum(future.map((s) => netRevenue(d, s.strategy, 2027)));
  const closings = future.map((s) => s.first_closing).sort();
  const span = closings.length ? monthsBetween(closings[0], closings[closings.length - 1]) + 1 : 1;
  const totalAmount = sum(d.strategies.map((s) => s.amount_raised));
  const weightedDefault = totalAmount
    ? sum(d.strategies.map((s) => s.default_rate * s.amount_raised)) / totalAmount
    : 0;
  const riskCost = pnlByYear(d).map((y) => {
    const line = y.costs.find((l) => l.bucket.startsWith("Risque"));
    return { year: y.year, amount: line?.amount ?? 0, shareOfRevenue: y.rev ? (line?.amount ?? 0) / y.rev : 0 };
  });
  return {
    futureShare2027: all2027 ? future2027 / all2027 : 0,
    futureAmount: sum(future.map((s) => s.amount_raised)),
    span,
    firstClosing: closings[0],
    lastClosing: closings[closings.length - 1],
    pace: span ? sum(future.map((s) => s.amount_raised)) / span : 0,
    largest: [...future].sort((a, b) => b.amount_raised - a.amount_raised)[0],
    weightedDefault,
    defaults: d.strategies.map((s) => ({ strategy: s.strategy, rate: s.default_rate, amount: s.amount_raised })),
    riskCost,
  };
}

/** Toutes les stratégies du BP, en cours et à venir, triées par premier closing. */
export function pipeline(d: BusinessPlanData) {
  const list = [...d.strategies]
    .sort((a, b) => a.first_closing.localeCompare(b.first_closing))
    .map((s) => ({ ...s, net2027: netRevenue(d, s.strategy, 2027), net2028: netRevenue(d, s.strategy, 2028) }));
  return {
    list,
    amount: sum(list.map((s) => s.amount_raised)),
    net: sum(list.map((s) => s.net2027 + s.net2028)),
    maxAmount: Math.max(0, ...list.map((s) => s.amount_raised)),
  };
}

// ── Lecture « plateforme » (ajout du 11/10/2026) ────────────────────────────

/** Volume émis par année : montants des stratégies dont le premier closing tombe cette année-là. */
export function volumeByYear(d: BusinessPlanData, year: number): number {
  return sum(d.strategies.filter((s) => s.first_closing.startsWith(String(year))).map((s) => s.amount_raised));
}

/**
 * Levier opérationnel : coûts fixes de la plateforme (tech, équipe et frais
 * généraux) face au volume émis et au volume cumulé.
 */
export function operatingLeverage(d: BusinessPlanData) {
  const years = [...new Set(d.pnl_split.map((l) => l.year))].sort();
  let cumulated = 0;
  return years.map((year) => {
    const fixed = sum(
      d.pnl_split
        .filter((l) => l.year === year && l.side === "Dépenses" && (l.bucket === "Tech" || l.bucket.startsWith("Équipe")))
        .map((l) => l.amount)
    );
    const emitted = volumeByYear(d, year);
    cumulated += emitted;
    return { year, fixed, emitted, cumulated, ratio: emitted ? fixed / emitted : 0 };
  });
}

/** Take rate : frais de transaction et revenu net rapportés au volume émis. */
export function takeRate(d: BusinessPlanData) {
  const volume = sum(d.strategies.map((s) => s.amount_raised));
  const fees = sum(d.strategy_revenue.map((r) => r.transaction_fees));
  const net = sum(d.strategy_revenue.map((r) => r.net_revenue));
  const years = [...new Set(d.strategy_revenue.map((r) => r.year))].sort();
  return {
    volume,
    fees,
    net,
    feeRate: volume ? fees / volume : 0,
    netRate: volume ? net / volume : 0,
    firstYear: years[0],
    lastYear: years[years.length - 1],
  };
}

/** Marché secondaire par année : volume cumulé émis, part échangée, volume et commission. */
export function secondaryMarket(d: BusinessPlanData) {
  const m = d.secondary_market;
  if (!m) return null;
  let cumulated = 0;
  const years = [...new Set(d.strategies.map((s) => Number(s.first_closing.slice(0, 4))))].sort();
  const rows = years.map((year) => {
    cumulated += volumeByYear(d, year);
    const share = m.share_by_year[String(year)] ?? 0;
    const volume = cumulated * share;
    return { year, base: cumulated, share, volume, revenue: volume * m.fee_rate };
  });
  const byYear = (y: number) => rows.find((r) => r.year === y);
  return { ...m, rows, byYear };
}
