"use client";

import { Fragment, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  RAISE_MONTH,
  RAISE_OPTIONS,
  amountNeededFor,
  delayImpact2027,
  horizonMonths,
  inProgress,
  leverBreakdown,
  netRevenue,
  pipeline,
  pnlByYear,
  revenueByStrategy,
  riskView,
  scenarios,
  type BusinessPlanData,
  type PnlLine,
} from "@/lib/business-plan/calc";
import { SectionTitle } from "../section-title";
import Link from "next/link";
import { ScrollReveal } from "../scroll-reveal";

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

const FAMILY: Record<string, { fr: string; en: string }> = {
  "Eastern Africa - SMEs strategies": { fr: "Afrique de l'Est, PME", en: "Eastern Africa, SMEs" },
  "Western Africa - SMEs strategies": { fr: "Afrique de l'Ouest, PME", en: "Western Africa, SMEs" },
  "Eastern Africa - Startups strategies": { fr: "Afrique de l'Est, startups", en: "Eastern Africa, startups" },
  "Western Africa - Startups strategies": { fr: "Afrique de l'Ouest, startups", en: "Western Africa, startups" },
};

const AXIS_EN: Record<string, string> = { Temps: "Time", Volume: "Volume", Qualité: "Quality", Valorisation: "Valuation" };

const copy = {
  fr: {
    kicker: "Minah SAS, business plan 2026-2028, scénario Best Case",
    f1Label: "En cours",
    f1Title: "Kupanda 1 se finalise, Kupanda 2 arrive",
    f1Body: (k1: string, k2: string) =>
      `Kupanda 1 (${k1}) en finalisation, Kupanda 2 (${k2}) en bonne partie levé d'ici fin 2026.`,
    f2Label: "Ce que ça verrouille",
    f2Title: "de revenu net 2027, sécurisé avant fin 2026",
    f2Body: (k1: string, k2: string) =>
      `Kupanda 1 apporte ${k1} de revenu net en 2027 ; il suffit de lever ${k2} sur Kupanda 2 pour dépasser le million.`,
    f3Label: "Début 2028",
    f3Title: "de volume levé d'ici début 2028",
    f3Body: (rev: string, vol: string) =>
      `Dans le BP actuel (${vol} levés), le chiffre d'affaires 2028 atteint ${rev}. Le BP est en cours de mise à jour sur l'objectif de 100 M€.`,
    netDef:
      "Revenu net d'une stratégie : intérêts encaissés et frais de transaction, moins les coupons versés aux porteurs, avant coût du risque, partage de performance et distribution.",
    raised: "Montant levé",
    accelerated: "version accélérée",
    s1: "En cours : Kupanda 1 et 2",
    s1Lead:
      "Kupanda 1 et 2 sont nos deux premières grosses stratégies, en cours de levée. L'objectif : valider les deux d'ici le premier trimestre 2027, en deux étapes.",
    step: (n: number) => `Étape ${n}`,
    s1Synthesis: (amount: string, net: string, share: string) =>
      `Ensemble, Kupanda 1 et 2 représentent ${amount} levés et ${net} de revenu net en 2027, soit ${share} du revenu net 2027 de Minah.`,
    step1Title: (v: string) => `Plus de ${v} de revenu net 2027`,
    step1Body: (k2: string) => `Lever ${k2} sur Kupanda 2, en plus de Kupanda 1, suffit à le verrouiller.`,
    step2Title: "100\u00a0% de Kupanda 2 levé d'ici le T1 2027",
    step2Body: (amount: string, net: string) =>
      `${amount} levés sur Kupanda 1 et 2, qui portent ${net} de revenu net en 2027.`,
    s2: "Ce qui arrive",
    s3: "Revenus et dépenses en un coup d'œil",
    s4: "Cash burn, runway et accélération",
    open: "Déplier",
    close: "Replier",
    inProgress: "En cours de levée",
    net2027: "revenu net 2027",
    amount: "Montant",
    coupon: "Coupon porteurs",
    grossYield: "Rendement brut attendu",
    defaultRate: "Taux de défaut retenu",
    duration: "Durée",
    fees: "Frais de transaction",
    th: ["Stratégie", "Segment", "1er closing", "Montant", "Revenu net 2027", "Revenu net 2028"],
    upcomingTotal: "Total",
    withPool: "dont le fonds de la levée accélérée",
    clickStrategy: "Cliquez sur une stratégie pour voir ses caractéristiques.",
    poolTag: "Levée accélérée",
    tbd: "à définir",
    byYear: "Par année",
    interest: "Intérêts",
    coupons: "Coupons versés",
    net: "Revenu net",
    months: (n: number) => `${n} mois`,
    revenues: "Revenus",
    costs: "Dépenses",
    ebitda: "EBITDA",
    ofTotal: "du total",
    fromStrategies: "Par stratégie",
    scenarioTh: [
      "Scénario",
      "Coût du levier seul",
      "Coût cumulé",
      "Volume en plus, estimation",
      "Burn mensuel 2027",
      "Runway sans revenu",
      "Runway selon le BP",
      "Point bas de trésorerie",
      "Trésorerie fin 2028",
    ],
    planBp: "Plan BP",
    beyond: (n: number) => `> ${n} mois`,
    chartTitle: "Trésorerie mois par mois",
    raise: "Levée",
    clickHint: "Cliquez sur une ligne pour afficher sa courbe et le détail du levier.",
    pendingYear: (y: number) => `${y} : à venir avec le BP mis à jour, qui couvrira les stratégies jusqu'à leur échéance.`,
    whyCost: "Pourquoi ce coût",
    perMonth: (a: string, n: number) => `${a} par mois sur ${n} mois`,
    oneOff: (a: string, m: string) => `${a} ponctuels (${m})`,
    coverage: (rate: string) => `Couverture à ${rate} des montants levés à chaque closing`,
    assumptions: "Hypothèses",
    gain: "Ce que ça doit permettre de lever en plus",
    proposal: "Proposition, à valider",
    notModelled:
      "Les coûts des leviers sont des estimations, hors BP. Leurs revenus supplémentaires ne sont pas modélisés dans la trésorerie : le volume en plus est une estimation à part.",
    s5: "Où est le risque dans notre modèle",
    s5Lead:
      "Deux choses peuvent casser le plan : une stratégie qui ne se lève pas assez vite, et des défauts au-delà de ce que la structure absorbe. Voici comment le BP les prend en compte.",
    raiseTitle: "Lever vite",
    raiseBase: (n: number) => `Hypothèse de base : une stratégie se lève en ${n}\u00a0mois après son lancement.`,
    pace: (a: string, n: number, from: string, to: string) =>
      `Le BP suppose ${a} levés sur ${n}\u00a0mois (${from} à ${to}).`,
    perMonthPace: "par mois en moyenne",
    largest: (name: string, a: string, m: string) => `La plus grosse : ${name}, ${a} en ${m}.`,
    dependence: "du revenu net 2027 vient de stratégies pas encore levées",
    delayTitle: "Si chaque stratégie à venir closait plus tard",
    delay: (n: number) => `${n}\u00a0mois de retard`,
    lost2027: "de revenu net 2027 en moins",
    approx:
      "Approximation : intérêts et coupons étalés à partir du closing, frais de transaction reportés à 2028 si le closing y bascule.",
    cushion: (n: string, a: string) => `Si aucune nouvelle stratégie ne se levait, ${a} levés couvrent ${n} de burn (Plan BP).`,
    techLead: "C'est pour ça que la tech compte.",
    techBody:
      "Plus Minah est branchée à la liquidité on-chain, où les taux de nos stratégies sont très compétitifs, plus elle tire parti de son avance de premier acteur sur les actifs africains on-chain, et plus chaque stratégie se lève vite. C'est l'objet du levier « Équipe tech ».",
    techLink: "Voir la roadmap technique",
    defaultTitle: "Se protéger en cas de défaut",
    defaultRates: "Taux de défaut retenus par le BP",
    weighted: "moyenne pondérée par les montants",
    riskCost: (y: number) => `Coût du risque provisionné en ${y}`,
    ofRevenue: "des revenus",
    riskCostNote:
      "Le poste du P&L regroupe le coût du risque et le partage de performance : le BP ne les sépare pas.",
    cascade:
      "Au-delà du provisionnement, chaque stratégie a sa cascade de protections : performance bond, assurance crédit, assurance du risque systémique et currency swap, puis la tranche junior de Minah, en première perte. Sur Kupanda, la structure tient jusqu'à 30\u00a0% de pertes cumulées, 6,5\u00a0fois le niveau historique.",
    cascadeLink: "Voir l'architecture de risque",
    lever3: "Le levier « Protection du portefeuille » ajoute une couverture à 0,5\u00a0% des montants levés à chaque closing.",
    source:
      "Source : business plan Minah SAS (fichier 260902_Minah_BP.xlsx), scénario Best Case, montants en euros. Coûts des leviers d'accélération, volumes en plus et temps de levée : estimations, hors BP.",
  },
  en: {
    kicker: "Minah SAS, 2026-2028 business plan, Best Case scenario",
    f1Label: "In progress",
    f1Title: "Kupanda 1 is closing, Kupanda 2 is next",
    f1Body: (k1: string, k2: string) =>
      `Kupanda 1 (${k1}) being finalised, Kupanda 2 (${k2}) largely raised by end 2026.`,
    f2Label: "What it locks in",
    f2Title: "of 2027 net revenue, secured before end 2026",
    f2Body: (k1: string, k2: string) =>
      `Kupanda 1 brings ${k1} of net revenue in 2027; raising ${k2} on Kupanda 2 is enough to pass one million.`,
    f3Label: "Early 2028",
    f3Title: "of volume raised by early 2028",
    f3Body: (rev: string, vol: string) =>
      `In the current BP (${vol} raised), 2028 revenue reaches ${rev}. The BP is being updated on the €100M target.`,
    netDef:
      "Net revenue of a strategy: interest received and transaction fees, minus coupons paid to bondholders, before cost of risk, performance sharing and distribution.",
    raised: "Amount raised",
    accelerated: "accelerated version",
    s1: "In progress: Kupanda 1 and 2",
    s1Lead:
      "Kupanda 1 and 2 are our first two large strategies, currently being raised. The goal: close both by Q1 2027, in two steps.",
    step: (n: number) => `Step ${n}`,
    s1Synthesis: (amount: string, net: string, share: string) =>
      `Together, Kupanda 1 and 2 account for ${amount} raised and ${net} of net revenue in 2027, ${share} of Minah's 2027 net revenue.`,
    step1Title: (v: string) => `Over ${v} of 2027 net revenue`,
    step1Body: (k2: string) => `Raising ${k2} on Kupanda 2, on top of Kupanda 1, is enough to lock it in.`,
    step2Title: "100% of Kupanda 2 raised by Q1 2027",
    step2Body: (amount: string, net: string) =>
      `${amount} raised on Kupanda 1 and 2, carrying ${net} of net revenue in 2027.`,
    s2: "What comes next",
    s3: "Revenue and costs at a glance",
    s4: "Cash burn, runway and acceleration",
    open: "Expand",
    close: "Collapse",
    inProgress: "Raising",
    net2027: "net revenue 2027",
    amount: "Amount",
    coupon: "Bondholder coupon",
    grossYield: "Expected gross yield",
    defaultRate: "Assumed default rate",
    duration: "Duration",
    fees: "Transaction fees",
    th: ["Strategy", "Segment", "First closing", "Amount", "Net revenue 2027", "Net revenue 2028"],
    upcomingTotal: "Total",
    withPool: "including the accelerated round fund",
    clickStrategy: "Click a strategy to see its characteristics.",
    poolTag: "Accelerated round",
    tbd: "to be defined",
    byYear: "By year",
    interest: "Interest",
    coupons: "Coupons paid",
    net: "Net revenue",
    months: (n: number) => `${n} months`,
    revenues: "Revenue",
    costs: "Costs",
    ebitda: "EBITDA",
    ofTotal: "of total",
    fromStrategies: "By strategy",
    scenarioTh: [
      "Scenario",
      "Lever cost alone",
      "Cumulative cost",
      "Extra volume, estimate",
      "Monthly burn 2027",
      "Runway without revenue",
      "Runway per the BP",
      "Cash low point",
      "Cash end 2028",
    ],
    planBp: "BP plan",
    beyond: (n: number) => `> ${n} months`,
    chartTitle: "Monthly cash position",
    raise: "Raise",
    clickHint: "Click a row to show its curve and the lever's detail.",
    pendingYear: (y: number) => `${y}: coming with the updated BP, which will cover the strategies through to maturity.`,
    whyCost: "Why this cost",
    perMonth: (a: string, n: number) => `${a} per month over ${n} months`,
    oneOff: (a: string, m: string) => `${a} one-off (${m})`,
    coverage: (rate: string) => `Cover at ${rate} of the amounts raised at each closing`,
    assumptions: "Assumptions",
    gain: "What it should help raise on top",
    proposal: "Proposal, to be validated",
    notModelled:
      "Lever costs are estimates, outside the BP. Their extra revenue is not modelled in the cash position: the extra volume is a separate estimate.",
    s5: "Where the risk sits in our model",
    s5Lead:
      "Two things can break the plan: a strategy that does not raise fast enough, and defaults beyond what the structure absorbs. Here is how the BP accounts for them.",
    raiseTitle: "Raising fast",
    raiseBase: (n: number) => `Base assumption: a strategy is raised within ${n} months of its launch.`,
    pace: (a: string, n: number, from: string, to: string) =>
      `The BP assumes ${a} raised over ${n} months (${from} to ${to}).`,
    perMonthPace: "per month on average",
    largest: (name: string, a: string, m: string) => `The largest: ${name}, ${a} in ${m}.`,
    dependence: "of 2027 net revenue comes from strategies not yet raised",
    delayTitle: "If every upcoming strategy closed later",
    delay: (n: number) => `${n} months late`,
    lost2027: "less 2027 net revenue",
    approx:
      "Approximation: interest and coupons spread from closing, transaction fees moved to 2028 if the closing slips into it.",
    cushion: (n: string, a: string) => `If no new strategy were raised, ${a} raised covers ${n} of burn (BP plan).`,
    techLead: "This is why the tech matters.",
    techBody:
      "The more Minah is plugged into on-chain liquidity, where our strategies' rates are highly competitive, the more it benefits from its first-mover advantage on African on-chain assets, and the faster each strategy is raised. This is what the \u201cTech team\u201d lever is for.",
    techLink: "See the technical roadmap",
    defaultTitle: "Protecting against defaults",
    defaultRates: "Default rates assumed in the BP",
    weighted: "weighted average by amount",
    riskCost: (y: number) => `Cost of risk provisioned in ${y}`,
    ofRevenue: "of revenue",
    riskCostNote: "This P&L line combines cost of risk and performance sharing: the BP does not split them.",
    cascade:
      "Beyond provisioning, each strategy has its cascade of protections: performance bond, credit insurance, systemic risk insurance and currency swap, then Minah's junior tranche as first loss. On Kupanda, the structure holds up to 30% cumulative losses, 6.5 times the historical level.",
    cascadeLink: "See the risk architecture",
    lever3: "The \u201cPortfolio protection\u201d lever adds cover at 0.5% of the amounts raised at each closing.",
    source:
      "Source: Minah SAS business plan (file 260902_Minah_BP.xlsx), Best Case scenario, amounts in euros. Acceleration lever costs, extra volumes and raising time: estimates, outside the BP.",
  },
} as const;

type Copy = (typeof copy)[Locale];

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

/** Dernière année que la partie 3 doit montrer : les stratégies courent jusque-là. */
const LAST_YEAR = 2029;

// ── Page ────────────────────────────────────────────────────────────────────

export function BusinessPlan({ data, locale }: { data: BusinessPlanData; locale: Locale }) {
  const c = copy[locale];
  // Montant de la levée : piloté en haut de page, il ouvre le fonds de la
  // levée accélérée (partie 2) et recalcule la trésorerie (partie 4).
  const [raised, setRaised] = useState<number>(RAISE_OPTIONS[0]);
  const ip = useMemo(() => inProgress(data), [data]);
  const pnl = useMemo(() => pnlByYear(data), [data]);
  // « Ce qui arrive » montre toute la file, Kupanda 1 et 2 compris (11/10/2026).
  const all = useMemo(() => pipeline(data), [data]);
  const pool = data.accelerated_pool && raised >= data.accelerated_pool.requires_raise ? data.accelerated_pool : null;

  return (
    <div className="mt-8">
      <p className="text-sm text-neutral-600">{c.kicker}</p>
      <KeyFacts data={data} locale={locale} />
      <p className="mt-6 max-w-3xl text-sm leading-6 text-neutral-600">{c.netDef}</p>

      <RaiseToggle raised={raised} setRaised={setRaised} locale={locale} className="mt-8" />

      <Section n="01" title={c.s1} c={c}>
        <p className="max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{c.s1Lead}</p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
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
        </ul>
        {/* Les deux étapes, en bandeau à deux colonnes séparées d'un filet. */}
        <ol className="mt-6 grid border-y border-foreground/10 sm:grid-cols-2 sm:divide-x sm:divide-foreground/10">
          {[
            {
              title: c.step1Title(eur(data.targets?.revenue_2027_locked ?? 1_000_000, locale)),
              body: c.step1Body(
                eur(amountNeededFor(data, "Kupanda 2", data.targets?.revenue_2027_locked ?? 1_000_000, ["Kupanda 1"]), locale)
              ),
            },
            { title: c.step2Title, body: c.step2Body(eur(ip.amount, locale), eur(ip.net2027, locale)) },
          ].map((st, i) => (
            <li key={i} className="py-5 max-sm:border-t max-sm:border-foreground/10 max-sm:first:border-t-0 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <p className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand/10 font-mono text-[11px] font-semibold text-marsala">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {c.step(i + 1)}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">{st.title}</p>
              <p className="mt-1 text-sm leading-6 text-neutral-600">{st.body}</p>
            </li>
          ))}
        </ol>
        {/* Ce que disait la carte « Kupanda 1 + 2 », en une phrase. */}
        <p className="mt-5 max-w-3xl text-[15px] leading-[1.8] text-neutral-700">
          {c.s1Synthesis(eur(ip.amount, locale), eur(ip.net2027, locale), pct(ip.share2027, locale, 0))}
        </p>
      </Section>

      <Section n="02" title={c.s2} c={c}>
        <Upcoming data={data} up={all} pool={pool} locale={locale} />
      </Section>

      <Section n="03" title={c.s3} c={c}>
        <PnlBars data={data} pnl={pnl} locale={locale} />
      </Section>

      <Section n="04" title={c.s4} c={c}>
        <RaiseToggle raised={raised} setRaised={setRaised} locale={locale} />
        <Runway data={data} raised={raised} locale={locale} />
      </Section>

      <Section n="05" title={c.s5} c={c}>
        <RiskSection data={data} raised={raised} locale={locale} />
      </Section>

      <p className="mt-14 border-t border-foreground/10 pt-4 text-xs leading-5 text-neutral-600">{c.source}</p>
    </div>
  );
}

// ── Partie 5 : où est le risque ─────────────────────────────────────────────

function RiskSection({ data, raised, locale }: { data: BusinessPlanData; raised: number; locale: Locale }) {
  const c = copy[locale];
  const r = useMemo(() => riskView(data), [data]);
  const plan = useMemo(() => scenarios(data, raised)[0], [data, raised]);
  const base = data.targets?.raise_time_months;

  return (
    <div>
      <p className="max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{c.s5Lead}</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className={CARD}>
          <h3 className="text-sm font-semibold text-foreground">{c.raiseTitle}</h3>
          {base ? (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-700">
              {c.raiseBase(base)}
              <span className="rounded-full border border-dashed border-neutral-400 px-2 py-0.5 text-[11px] text-neutral-600">
                {c.proposal}
              </span>
            </p>
          ) : null}
          <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums text-marsala">{pct(r.futureShare2027, locale, 0)}</p>
          <p className="text-sm text-neutral-600">{c.dependence}</p>
          <p className="mt-4 text-sm leading-6 text-neutral-700">
            {c.pace(eur(r.futureAmount, locale), r.span, month(r.firstClosing, locale), month(r.lastClosing, locale))}{" "}
            <span className="font-semibold text-foreground">{eur(r.pace, locale)}</span> {c.perMonthPace}.{" "}
            {r.largest && c.largest(r.largest.strategy, eur(r.largest.amount_raised, locale), month(r.largest.first_closing, locale))}
          </p>
          <p className="mt-5 text-sm font-semibold text-foreground">{c.delayTitle}</p>
          <dl className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-foreground/10">
            {[3, 6].map((m) => (
              <div key={m} className="bg-[#fbfaf7] p-3">
                <dt className="text-sm text-neutral-600">{c.delay(m)}</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums" style={{ color: NEGATIVE }}>
                  {eur(-delayImpact2027(data, m), locale)}
                </dd>
                <dd className="text-xs text-neutral-600">{c.lost2027}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs leading-5 text-neutral-600">{c.approx}</p>
          <p className="mt-4 text-sm leading-6 text-neutral-700">{c.cushion(c.months(plan.runwayNoRevenue), eur(raised, locale))}</p>
          {/* La réponse au risque de lenteur : la liquidité on-chain, donc la tech. */}
          <div className="mt-5 border-t border-foreground/10 pt-4">
            <p className="text-sm leading-6 text-neutral-700">
              <span className="font-semibold text-foreground">{c.techLead}</span> {c.techBody}
            </p>
            <Link
              href="/investors/docs/vision-technique"
              className="mt-3 inline-block whitespace-nowrap rounded-lg text-sm font-medium text-marsala underline decoration-marsala/30 underline-offset-4 hover:decoration-marsala"
            >
              {c.techLink} →
            </Link>
          </div>
        </div>

        <div className={CARD}>
          <h3 className="text-sm font-semibold text-foreground">{c.defaultTitle}</h3>
          <p className="mt-3 text-sm text-neutral-600">{c.defaultRates}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {r.defaults.map((x) => (
              <li key={x.strategy} className="flex justify-between gap-3">
                <span className="text-neutral-700">{x.strategy}</span>
                <span className="tabular-nums text-foreground">{pct(x.rate, locale, 1)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-3 border-t border-foreground/10 pt-1 font-semibold text-foreground">
              <span>{c.weighted}</span>
              <span className="tabular-nums">{pct(r.weightedDefault, locale, 1)}</span>
            </li>
          </ul>
          <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-foreground/10">
            {r.riskCost
              .filter((y) => y.year >= 2027)
              .map((y) => (
                <div key={y.year} className="bg-[#fbfaf7] p-3">
                  <p className="text-sm text-neutral-600">{c.riskCost(y.year)}</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">{eur(y.amount, locale)}</p>
                  <p className="text-xs text-neutral-600">
                    {pct(y.shareOfRevenue, locale, 0)} {c.ofRevenue}
                  </p>
                </div>
              ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-neutral-600">{c.riskCostNote}</p>
          <p className="mt-4 text-sm leading-6 text-neutral-700">{c.cascade}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-700">{c.lever3}</p>
          <Link
            href="/investors/docs/gestion-du-risque"
            className="mt-3 inline-block whitespace-nowrap rounded-lg text-sm font-medium text-marsala underline decoration-marsala/30 underline-offset-4 hover:decoration-marsala"
          >
            {c.cascadeLink} →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Trois chiffres phares, qui arrivent au défilement ───────────────────────

function KeyFacts({ data, locale }: { data: BusinessPlanData; locale: Locale }) {
  const c = copy[locale];
  const k1 = data.strategies.find((s) => s.strategy === "Kupanda 1");
  const k2 = data.strategies.find((s) => s.strategy === "Kupanda 2");
  const target = data.targets?.revenue_2027_locked ?? 1_000_000;
  const volume = data.targets?.volume_early_2028 ?? 100_000_000;
  const k1Net = netRevenue(data, "Kupanda 1", 2027);
  const k2Needed = amountNeededFor(data, "Kupanda 2", target, ["Kupanda 1"]);
  const bpVolume = data.strategies.reduce((a, s) => a + s.amount_raised, 0);
  const rev2028 = pnlByYear(data).find((y) => y.year === 2028)?.rev ?? 0;
  const k1Amount = k1?.amount_raised ?? 0;
  const k2Amount = k2?.amount_raised ?? 0;

  const facts = [
    {
      label: c.f1Label,
      value: eur(k1Amount + k2Amount, locale),
      title: c.f1Title,
      body: c.f1Body(eur(k1Amount, locale), eur(k2Amount, locale)),
    },
    {
      label: c.f2Label,
      value: `> ${eur(target, locale)}`,
      title: c.f2Title,
      body: c.f2Body(eur(k1Net, locale), eur(k2Needed, locale)),
    },
    {
      label: c.f3Label,
      value: `> ${eur(volume, locale)}`,
      title: c.f3Title,
      body: c.f3Body(eur(rev2028, locale), eur(bpVolume, locale)),
    },
  ];

  // Bandeau de trois colonnes séparées par des filets : les trois chiffres
  // tiennent ensemble à l'écran et entrent l'un après l'autre.
  return (
    <ol className="mt-5 grid border-y border-foreground/10 md:grid-cols-3 md:divide-x md:divide-foreground/10">
      {facts.map((f, i) => (
        <li key={i} className="border-foreground/10 py-6 max-md:border-t max-md:first:border-t-0 md:px-6 md:first:pl-0 md:last:pr-0">
          <ScrollReveal delay={i * 150}>
            <p className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand/10 font-mono text-[11px] font-semibold text-marsala">
                {String(i + 1).padStart(2, "0")}
              </span>
              {f.label}
            </p>
            <p className="mt-3 whitespace-nowrap text-3xl font-semibold tracking-tight tabular-nums text-marsala">{f.value}</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-foreground">{f.title}</p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{f.body}</p>
          </ScrollReveal>
        </li>
      ))}
    </ol>
  );
}

// ── Commandes communes ──────────────────────────────────────────────────────

function RaiseToggle({
  raised,
  setRaised,
  locale,
  className = "",
}: {
  raised: number;
  setRaised: (r: number) => void;
  locale: Locale;
  className?: string;
}) {
  const c = copy[locale];
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
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
            {r === RAISE_OPTIONS[RAISE_OPTIONS.length - 1] && (
              <span className={raised === r ? "text-background/75" : "text-neutral-600"}>, {c.accelerated}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Partie repliable : le titre est le bouton, ouvert par défaut.
function Section({ n, title, c, children }: { n: string; title: string; c: Copy; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="mt-14">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-marsala/40"
      >
        <SectionTitle n={n}>{title}</SectionTitle>
        <span className="flex shrink-0 items-center gap-2 text-sm text-neutral-600 group-hover:text-foreground">
          <span className="hidden sm:inline">{open ? c.close : c.open}</span>
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>
      {open && <div className="mt-6">{children}</div>}
    </section>
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

// ── Partie 2 : les stratégies à venir ───────────────────────────────────────

function Upcoming({
  data,
  up,
  pool,
  locale,
}: {
  data: BusinessPlanData;
  up: ReturnType<typeof pipeline>;
  pool: BusinessPlanData["accelerated_pool"] | null;
  locale: Locale;
}) {
  const c = copy[locale];
  const [selected, setSelected] = useState<string | null>(null);
  const max = Math.max(up.maxAmount, pool?.amount ?? 0);
  const rowClass = (key: string) =>
    `cursor-pointer border-b border-foreground/10 transition-all ${
      selected === key ? "bg-brand/[0.06]" : selected ? "text-[13px] opacity-50 hover:opacity-80" : "hover:bg-foreground/[0.03]"
    }`;
  const pad = (key: string) => (selected && selected !== key ? "py-1.5" : "py-3");
  const toggle = (key: string) => setSelected(selected === key ? null : key);
  const bar = (amount: number, color: string) => (
    <span className="hidden h-2 w-24 shrink-0 rounded-full bg-foreground/[0.06] sm:block">
      <span className="block h-2 rounded-full" style={{ width: `${(amount / max) * 100}%`, background: color }} />
    </span>
  );

  return (
    <div>
      <p className="text-sm text-neutral-600">{c.clickStrategy}</p>
      <div className="mt-3 overflow-x-auto">
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
              <Fragment key={s.strategy}>
                <tr className={rowClass(s.strategy)} onClick={() => toggle(s.strategy)}>
                  <td className={`${pad(s.strategy)} pr-4 font-medium text-foreground`}>
                    <span className="flex flex-wrap items-center gap-2">
                      {s.strategy}
                      {s.status === "En cours de levée" && (
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-marsala">
                          {c.inProgress}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className={`hidden ${pad(s.strategy)} pr-4 text-neutral-600 md:table-cell`}>
                    {FAMILY[s.family]?.[locale] ?? s.family}
                  </td>
                  <td className={`whitespace-nowrap ${pad(s.strategy)} pr-4 text-neutral-700`}>{month(s.first_closing, locale)}</td>
                  <td className={`${pad(s.strategy)} pr-4`}>
                    <div className="flex items-center gap-3">
                      <span className="w-16 shrink-0 tabular-nums text-neutral-700">{eur(s.amount_raised, locale)}</span>
                      {bar(s.amount_raised, MARSALA)}
                    </div>
                  </td>
                  <td className={`${pad(s.strategy)} pr-4 text-right tabular-nums text-neutral-700`}>{eur(s.net2027, locale)}</td>
                  <td className={`${pad(s.strategy)} text-right tabular-nums text-neutral-700`}>{eur(s.net2028, locale)}</td>
                </tr>
                {selected === s.strategy && (
                  <tr className="border-b border-foreground/10 bg-brand/[0.03]">
                    <td colSpan={6} className="px-1 py-5">
                      <StrategyDetail data={data} name={s.strategy} locale={locale} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {pool && (
              <Fragment>
                <tr className={rowClass("pool")} onClick={() => toggle("pool")}>
                  <td className={`${pad("pool")} pr-4 font-medium text-foreground`}>
                    <span className="flex flex-wrap items-center gap-2">
                      {locale === "fr" ? pool.name : pool.name_en}
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-marsala">{c.poolTag}</span>
                    </span>
                  </td>
                  <td className={`hidden ${pad("pool")} pr-4 text-neutral-600 md:table-cell`}>{c.tbd}</td>
                  <td className={`${pad("pool")} pr-4 text-neutral-600`}>{c.tbd}</td>
                  <td className={`${pad("pool")} pr-4`}>
                    <div className="flex items-center gap-3">
                      <span className="w-16 shrink-0 tabular-nums text-neutral-700">{eur(pool.amount, locale)}</span>
                      {bar(pool.amount, SELECTED)}
                    </div>
                  </td>
                  <td className={`${pad("pool")} pr-4 text-right text-neutral-600`}>{c.tbd}</td>
                  <td className={`${pad("pool")} text-right text-neutral-600`}>{c.tbd}</td>
                </tr>
                {selected === "pool" && (
                  <tr className="border-b border-foreground/10 bg-brand/[0.03]">
                    <td colSpan={6} className="px-1 py-5 text-[15px] leading-[1.7] text-neutral-700">
                      {locale === "fr" ? pool.description : pool.description_en}
                    </td>
                  </tr>
                )}
              </Fragment>
            )}
            <tr className="font-semibold text-foreground">
              <td className="py-3 pr-4">{c.upcomingTotal}</td>
              <td className="hidden md:table-cell" />
              <td />
              <td className="py-3 pr-4 tabular-nums">{eur(up.amount + (pool?.amount ?? 0), locale)}</td>
              <td className="py-3 pr-4 text-right tabular-nums">{eur(up.list.reduce((a, s) => a + s.net2027, 0), locale)}</td>
              <td className="py-3 text-right tabular-nums">{eur(up.list.reduce((a, s) => a + s.net2028, 0), locale)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {pool && (
        <p className="mt-2 text-sm text-neutral-600">
          {eur(up.amount + pool.amount, locale)}, {c.withPool} ({eur(pool.amount, locale)}).
        </p>
      )}
    </div>
  );
}

function StrategyDetail({ data, name, locale }: { data: BusinessPlanData; name: string; locale: Locale }) {
  const c = copy[locale];
  const s = data.strategies.find((x) => x.strategy === name);
  if (!s) return null;
  const years = data.strategy_revenue.filter((r) => r.strategy === name && (r.interest_income || r.transaction_fees || r.coupons_paid));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <dl className="space-y-1.5 text-sm">
        <Row label={c.th[1]} value={FAMILY[s.family]?.[locale] ?? s.family} />
        <Row label={c.amount} value={eur(s.amount_raised, locale)} />
        <Row label={c.th[2]} value={month(s.first_closing, locale)} />
        <Row label={c.duration} value={c.months(s.duration_months)} />
        <Row label={c.coupon} value={pct(s.bond_rate, locale)} />
        <Row label={c.grossYield} value={pct(s.gross_yield, locale)} />
        <Row label={c.defaultRate} value={pct(s.default_rate, locale)} />
      </dl>
      <div>
        <p className="text-sm font-semibold text-foreground">{c.byYear}</p>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr className="text-neutral-600">
              <th className="py-1 pr-3 text-left font-medium" />
              {years.map((y) => (
                <th key={y.year} className="py-1 pl-3 text-right font-medium">{y.year}</th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {([
              [c.interest, "interest_income"],
              [c.fees, "transaction_fees"],
              [c.coupons, "coupons_paid"],
            ] as const).map(([label, key]) => (
              <tr key={key}>
                <td className="py-1 pr-3 text-neutral-600">{label}</td>
                {years.map((y) => (
                  <td key={y.year} className="py-1 pl-3 text-right text-neutral-700">{eur(y[key], locale)}</td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-foreground/10 font-semibold text-foreground">
              <td className="py-1 pr-3">{c.net}</td>
              {years.map((y) => (
                <td key={y.year} className="py-1 pl-3 text-right">{eur(y.net_revenue, locale)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Partie 3 : barres revenus / dépenses ────────────────────────────────────

type Hover = {
  label: string;
  amount: number;
  share: number;
  x: number;
  y: number;
  parts?: { name: string; amount: number }[];
} | null;

function PnlBars({ data, pnl, locale }: { data: BusinessPlanData; pnl: ReturnType<typeof pnlByYear>; locale: Locale }) {
  const c = copy[locale];
  const [hover, setHover] = useState<Hover>(null);
  const max = Math.max(...pnl.flatMap((y) => [y.rev, y.cost]), 1);
  const bucketName = (b: string) => (locale === "fr" ? b : (BUCKETS_EN[b] ?? b));
  const revBuckets = pnl[0]?.revenues.map((l) => l.bucket) ?? [];
  const costBuckets = pnl[0]?.costs.map((l) => l.bucket) ?? [];

  // Intérêts et frais se ventilent par stratégie (onglet P&L) : l'info-bulle
  // dit d'où vient le revenu. Les autres postes n'ont pas de stratégie.
  const partsFor = (year: number, l: PnlLine) => {
    const rows = revenueByStrategy(data, year);
    const key = l.bucket.startsWith("Intérêts") ? "interest" : l.bucket.startsWith("Frais") ? "fees" : null;
    if (l.side !== "Revenus" || !key) return undefined;
    return rows
      .map((r) => ({ name: r.strategy, amount: r[key] }))
      .filter((p) => p.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  };

  const bar = (year: number, lines: PnlLine[], shades: string[], total: number, label: string) => (
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
                  setHover({
                    label: `${bucketName(l.bucket)}, ${year}`,
                    amount: l.amount,
                    share: v / total,
                    x: Math.min(Math.max(s.left - r.left + s.width / 2, 130), r.width - 130),
                    y: s.top - r.top,
                    parts: partsFor(year, l),
                  });
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
    <div>
      <div data-pnl className="relative space-y-7">
        {pnl.map((y) => (
          <div key={y.year}>
            <p className="text-sm font-semibold text-foreground">{y.year}</p>
            <div className="mt-2 space-y-1.5">
              {bar(y.year, y.revenues, REVENUE_SHADES, y.rev, c.revenues)}
              {bar(y.year, y.costs, COST_SHADES, y.cost, c.costs)}
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
        {/* Les stratégies courent jusqu'en 2029 : l'année reste affichée, en
            attente, tant que le BP ne la chiffre pas. Elle se remplit seule
            dès que pnl_split contient 2029. */}
        {!pnl.some((y) => y.year === LAST_YEAR) && (
          <div>
            <p className="text-sm font-semibold text-foreground">{LAST_YEAR}</p>
            <div className="mt-2 space-y-1.5">
              {[c.revenues, c.costs].map((label) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-sm text-neutral-600">{label}</span>
                  <span className="h-5 flex-1 rounded-sm border border-dashed border-neutral-300 bg-foreground/[0.03]" />
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-neutral-600">{c.pendingYear(LAST_YEAR)}</p>
          </div>
        )}
        {hover && (
          <div
            className="pointer-events-none absolute z-10 w-64 -translate-x-1/2 -translate-y-full rounded-lg border border-foreground/10 bg-white px-3 py-2 text-xs leading-5 shadow-md"
            style={{ left: hover.x, top: hover.y - 6 }}
          >
            <p className="font-semibold text-foreground">{hover.label}</p>
            <p className="text-neutral-600">
              {eur(hover.amount, locale)}, {pct(hover.share, locale, 0)} {c.ofTotal}
            </p>
            {hover.parts && hover.parts.length > 0 && (
              <div className="mt-1.5 border-t border-foreground/10 pt-1.5">
                <p className="text-neutral-600">{c.fromStrategies}</p>
                {hover.parts.map((p) => (
                  <p key={p.name} className="flex justify-between gap-3 text-neutral-700">
                    <span>{p.name}</span>
                    <span className="tabular-nums">{eur(p.amount, locale)}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
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

// ── Partie 4 : trésorerie, scénarios et leviers ─────────────────────────────

function Runway({ data, raised, locale }: { data: BusinessPlanData; raised: number; locale: Locale }) {
  const c = copy[locale];
  const [selected, setSelected] = useState(0);
  const rows = useMemo(() => scenarios(data, raised), [data, raised]);
  const horizon = horizonMonths(data);
  const levers = [...data.levers].sort((a, b) => a.level - b.level);
  const name = (k: number) =>
    k === 0 ? c.planBp : `${k > 1 ? "+ " : ""}${locale === "fr" ? levers[k - 1].name : levers[k - 1].name_en}`;
  // Volume en plus, cumulé comme les coûts : chaque scénario ajoute un levier.
  const volumeUpTo = (k: number) => levers.filter((l) => l.level <= k).reduce((a, l) => a + (l.impact?.volume ?? 0), 0);
  const hide = new Set([2, 5, 7]);

  return (
    <div className="mt-5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-foreground/15 text-left align-bottom text-neutral-600">
              {c.scenarioTh.map((h, i) => (
                <th key={h} className={`py-2 pr-4 font-medium ${i > 0 ? "text-right" : ""} ${hide.has(i) ? "hidden lg:table-cell" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const l = r.k ? levers[r.k - 1] : null;
              // Comme la partie 2 : la ligne choisie s'ouvre sur son détail, les
              // autres se réduisent. Un second clic referme et revient au Plan BP.
              const dimmed = selected !== 0 && selected !== r.k;
              const py = dimmed ? "py-1.5" : "py-3";
              return (
                <Fragment key={r.k}>
                <tr
                  onClick={() => setSelected(selected === r.k ? 0 : r.k)}
                  className={`cursor-pointer border-b border-foreground/10 transition-all ${
                    selected === r.k && r.k !== 0
                      ? "bg-brand/[0.06]"
                      : dimmed
                        ? "text-[13px] opacity-50 hover:opacity-80"
                        : "hover:bg-foreground/[0.03]"
                  }`}
                >
                  <td className={`${py} pr-4 font-medium text-foreground`}>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-0.5 w-4 shrink-0 rounded"
                        style={{ background: r.k === 0 ? MARSALA : selected === r.k ? SELECTED : "#bdb7af" }}
                      />
                      {name(r.k)}
                    </span>
                  </td>
                  <td className={`${py} pr-4 text-right tabular-nums`}>{l ? eur(r.cost - rows[r.k - 1].cost, locale) : "0"}</td>
                  <td className={`hidden ${py} pr-4 text-right tabular-nums lg:table-cell`}>{r.cost ? eur(r.cost, locale) : "0"}</td>
                  <td className={`${py} pr-4 text-right tabular-nums`}>{r.k ? `+${eur(volumeUpTo(r.k), locale)}` : "0"}</td>
                  <td className={`${py} pr-4 text-right tabular-nums`}>{eur(r.burn2027, locale)}</td>
                  <td className={`hidden ${py} pr-4 text-right tabular-nums lg:table-cell`}>{c.months(r.runwayNoRevenue)}</td>
                  <td className={`${py} pr-4 text-right tabular-nums`}>{r.runwayBp === null ? c.beyond(horizon) : c.months(r.runwayBp)}</td>
                  <td className={`hidden whitespace-nowrap ${py} pr-4 text-right tabular-nums lg:table-cell`}>
                    {eur(r.low.value, locale)} ({month(r.low.month, locale)})
                  </td>
                  <td className={`${py} text-right tabular-nums`}>{eur(r.end, locale)}</td>
                </tr>
                {selected === r.k && l && (
                  <tr className="border-b border-foreground/10 bg-brand/[0.03]">
                    <td colSpan={9} className="px-1 py-5">
                      <LeverDetail data={data} lever={l} locale={locale} />
                    </td>
                  </tr>
                )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-neutral-600">{c.clickHint}</p>

      <CashChart rows={rows} selected={selected} locale={locale} name={name} />

      <p className="mt-4 text-sm leading-6 text-neutral-600">{c.notModelled}</p>
    </div>
  );
}

function LeverDetail({ data, lever, locale }: { data: BusinessPlanData; lever: BusinessPlanData["levers"][number]; locale: Locale }) {
  const c = copy[locale];
  const breakdown = leverBreakdown(data, lever);
  return (
  <div className="grid gap-6 md:grid-cols-2">
    <div>
      <h3 className="text-sm font-semibold text-foreground">
        {lever.level}. {locale === "fr" ? lever.name : lever.name_en}
      </h3>
      <p className="mt-3 text-sm font-semibold text-foreground">{c.whyCost}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-neutral-700">
        {breakdown.monthly.total > 0 && (
          <li className="flex justify-between gap-3">
            <span>{c.perMonth(eur(breakdown.monthly.perMonth, locale), breakdown.monthly.months)}</span>
            <span className="tabular-nums">{eur(breakdown.monthly.total, locale)}</span>
          </li>
        )}
        {breakdown.oneOff.amount > 0 && breakdown.oneOff.month && (
          <li className="flex justify-between gap-3">
            <span>{c.oneOff(eur(breakdown.oneOff.amount, locale), month(breakdown.oneOff.month, locale))}</span>
            <span className="tabular-nums">{eur(breakdown.oneOff.amount, locale)}</span>
          </li>
        )}
        {breakdown.closings.length > 0 && (
          <li>
            <span className="flex justify-between gap-3">
              <span>{c.coverage(pct(lever.pct_of_raised, locale))}</span>
              <span className="tabular-nums">{eur(breakdown.closings.reduce((a, x) => a + x.cost, 0), locale)}</span>
            </span>
            <span className="mt-1 block text-neutral-600">
              {breakdown.closings.map((x) => `${x.strategy} (${month(x.month, locale)}) ${eur(x.cost, locale)}`).join(", ")}
            </span>
          </li>
        )}
        <li className="flex justify-between gap-3 border-t border-foreground/10 pt-1.5 font-semibold text-foreground">
          <span />
          <span className="tabular-nums">{eur(breakdown.total, locale)}</span>
        </li>
      </ul>
      <p className="mt-4 text-sm font-semibold text-foreground">{c.assumptions}</p>
      <p className="mt-1 text-sm leading-6 text-neutral-700">{locale === "fr" ? lever.assumptions : lever.assumptions_en}</p>
    </div>
    {lever.impact && (
      <div>
        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
          {c.gain}
          {lever.impact.status === "proposition" && (
            <span className="rounded-full border border-dashed border-neutral-400 px-2 py-0.5 text-[11px] font-normal text-neutral-600">
              {c.proposal}
            </span>
          )}
        </p>
        <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums text-marsala">
          +{eur(lever.impact.volume, locale)}
        </p>
        <p className="text-sm text-neutral-600">
          {locale === "fr" ? "de volume" : "of volume"}, {(locale === "fr" ? lever.impact.axis : (AXIS_EN[lever.impact.axis] ?? lever.impact.axis)).toLowerCase()}
        </p>
        <p className="mt-3 text-sm leading-6 text-neutral-700">{locale === "fr" ? lever.impact.text : lever.impact.text_en}</p>
      </div>
    )}
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
