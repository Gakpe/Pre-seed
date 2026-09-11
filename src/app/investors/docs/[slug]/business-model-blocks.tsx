import { FEES } from "@/lib/flow-nodes";
import type { Locale } from "@/lib/i18n";
// Les deux blocs de bas de page de la fiche « business model » : où se place
// notre risque, et l'ambition de traçabilité de bout en bout.
// Aucun état, aucune interaction.

const TRACEABILITY_STAGES = [
  {
    title: { fr: "Votre position", en: "Your position" },
    body: {
      fr: "Souscription, échéancier et coupons versés : tenus au registre et consultables à tout moment.",
      en: "Subscription, schedule and coupons paid: held in the registry and viewable at any time.",
    },
  },
  {
    title: { fr: "La stratégie", en: "The strategy" },
    body: {
      fr: "Encours déployé, contrats financés, taux de remboursement agrégé sur le portefeuille.",
      en: "Outstanding volume deployed, contracts financed, repayment rate aggregated across the portfolio.",
    },
  },
  {
    title: { fr: "Le véhicule local", en: "The local vehicle" },
    body: {
      fr: "Flux entrants et sortants de la société de portage qui exécute le déploiement.",
      en: "Inbound and outbound flows of the holding company that carries out the deployment.",
    },
  },
  {
    title: { fr: "Le contrat sous-jacent", en: "The underlying contract" },
    body: {
      fr: "Exécution et paiement de chaque marché financé, jusqu'au versement du payeur public.",
      en: "Delivery and payment of each financed contract, through to disbursement by the public payer.",
    },
  },
];

const copy = {
  fr: {
    riskTitle: "Où se place notre risque",
    riskBody:
      "Nos souscripteurs sont en dette senior : payés les premiers, exposés les derniers. La tranche junior, nos propres fonds et les revenus des autres stratégies maintenus en réserve, encaisse la première perte avant que le coupon senior ne soit touché.",
    svgAlt:
      "Dette senior au-dessus de la tranche junior first loss ; les paiements descendent, les pertes remontent",
    payments: "PAIEMENTS",
    losses: "PERTES",
    seniorLabel: "Dette senior",
    seniorSub: "Nos souscripteurs · coupon fixe, remboursé en premier",
    juniorLabel: "Tranche junior · first loss",
    juniorSub: "Fonds propres Minah · absorbe la première perte",
    traceTitle: "Suivre son argent sur toute la chaîne",
    badge: "Ambition · en construction",
    traceBody:
      "Aujourd'hui, la traçabilité de votre position repose sur notre reporting. Ce que nous visons est plus exigeant : que chaque étage de la chaîne soit vérifiable sans avoir à nous croire sur parole.",
    stagesLabel: "Les quatre étages visés",
    traceFootnote:
      "Seul le premier étage est tenu par notre registre à ce jour. Les trois suivants dépendent de la capacité de nos partenaires locaux et des payeurs publics à exposer leurs données : nous les construisons stratégie après stratégie, et nous ne les annoncerons livrés que lorsqu'ils le seront.",
    feesTitle: "Comment nous nous rémunérons",
    transactionLabel: "Transaction fees",
    transactionBody:
      "Prélevés sur le flux entrant, à la souscription. Ils couvrent la structuration du produit, l'entrée en relation et la mise en registre.",
    performanceLabel: "Performance fees",
    performanceBody:
      "Prélevés sur la remontée des coupons, avant redistribution. La fourchette dépend de la stratégie et du niveau de surperformance constaté.",
    feesLead:
      "Les souscripteurs sont exposés en dette, avec un rendement annoncé à l'entrée. Toute performance dégagée au-delà de ce rendement constitue notre rémunération. Notre exposition en dette senior et en venture debt nous permet ainsi de capter la surperformance des produits sous-jacents.",
    rotationTitle: "La rotation du capital",
    rotationBody:
      "Un souscripteur s'expose sur douze mois. Sur cette même période, le capital sous-jacent tourne trois à quatre fois, sur des opérations courtes rémunérées à des taux de l'ordre de 20 %. C'est cet écart entre la durée d'exposition de l'investisseur et la vitesse de rotation du capital qui alimente la surperformance, et donc notre rémunération.",
    stat1: "100 €",
    caption1: "de volume déployé",
    stat2: "≈ 50 €",
    caption2: "de chiffre d'affaires",
    stat3: "25 %",
    caption3: "d'EBITDA",
    rotationFootnote:
      "Ordres de grandeur, sur la base de trois à quatre rotations annuelles. Ce sont des estimations de modèle, pas un historique constaté.",
    feesFootnote:
      "Le détail complet de la mécanique, hypothèses et cas chiffrés compris, est disponible au niveau 2 de la data room.",
  },
  en: {
    riskTitle: "Where our risk sits",
    riskBody:
      "Our subscribers hold senior debt: paid first, exposed last. The junior tranche — our own funds and the revenue from other strategies held in reserve — takes the first loss before the senior coupon is ever touched.",
    svgAlt:
      "Senior debt above the junior first-loss tranche; payments flow down, losses flow up",
    payments: "PAYMENTS",
    losses: "LOSSES",
    seniorLabel: "Senior debt",
    seniorSub: "Our subscribers · fixed coupon, repaid first",
    juniorLabel: "Junior tranche · first loss",
    juniorSub: "Minah equity · absorbs the first loss",
    traceTitle: "Track your money along the whole chain",
    badge: "Ambition · in progress",
    traceBody:
      "Today, the traceability of your position rests on our reporting. What we are aiming for is more demanding: that every stage of the chain be verifiable without taking our word for it.",
    stagesLabel: "The four stages targeted",
    traceFootnote:
      "Only the first stage is held by our registry to date. The next three depend on our local partners' and public payers' ability to expose their data: we build them strategy after strategy, and we will only announce them as delivered once they are.",
    feesTitle: "How we get paid",
    transactionLabel: "Transaction fees",
    transactionBody:
      "Charged on the inbound flow, at subscription. They cover product structuring, onboarding and registry entry.",
    performanceLabel: "Performance fees",
    performanceBody:
      "Charged on the coupons flowing back, before redistribution. The range depends on the strategy and the level of outperformance observed.",
    feesLead:
      "Subscribers are exposed through debt, with a return set upfront. Any performance generated beyond that return is our fee. Our exposure in senior debt and venture debt lets us capture the outperformance of the underlying products.",
    rotationTitle: "Capital rotation",
    rotationBody:
      "A subscriber is exposed over twelve months. Over that same period, the underlying capital turns over three to four times, on short operations paid at rates of around 20%. It is this gap between the investor's exposure period and the speed of capital rotation that drives the outperformance — and therefore our fee.",
    stat1: "€100",
    caption1: "of volume deployed",
    stat2: "≈ €50",
    caption2: "of revenue",
    stat3: "25%",
    caption3: "of EBITDA",
    rotationFootnote:
      "Orders of magnitude, based on three to four annual rotations. These are model estimates, not an observed track record.",
    feesFootnote:
      "The full detail of the mechanics, including assumptions and worked figures, is available at level 2 of the data room.",
  },
} as const;

export function BusinessModelBlocks({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <div className="mt-12 grid gap-6 min-[860px]:grid-cols-2">
      {/* --- Où se place notre risque --- */}
      <section className="rounded-xl border border-bm-border bg-bm-surface p-6">
        <h2 className="text-base font-semibold tracking-tight">{c.riskTitle}</h2>
        <p className="mt-3 text-sm leading-[1.6] text-neutral-700">{c.riskBody}</p>

        <svg
          viewBox="0 0 560 236"
          className="mt-6 w-full"
          role="img"
          aria-label={c.svgAlt}
        >
          <defs>
            <marker
              id="bm-down"
              viewBox="0 0 10 10"
              refX="5"
              refY="9"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0 0L5 10L10 0z" fill="var(--bm-muted)" />
            </marker>
            <marker
              id="bm-up"
              viewBox="0 0 10 10"
              refX="5"
              refY="1"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0 10L5 0L10 10z" fill="var(--bm-accent)" />
            </marker>
          </defs>

          {/* rail gauche, les paiements descendent */}
          <path
            d="M26 34 L26 196"
            stroke="var(--bm-muted)"
            strokeWidth="1.2"
            markerEnd="url(#bm-down)"
            fill="none"
          />
          <text
            x="18"
            y="220"
            className="text-[10px] font-semibold"
            style={{ letterSpacing: "0.1em" }}
            fill="var(--bm-muted)"
          >
            {c.payments}
          </text>

          {/* rail droit, les pertes remontent */}
          <path
            d="M534 196 L534 34"
            stroke="var(--bm-accent)"
            strokeWidth="1.2"
            markerEnd="url(#bm-up)"
            fill="none"
          />
          <text
            x="490"
            y="220"
            className="text-[10px] font-semibold"
            style={{ letterSpacing: "0.1em" }}
            fill="var(--bm-accent)"
          >
            {c.losses}
          </text>

          {/* dette senior */}
          <rect x="60" y="26" width="440" height="78" rx="10" fill="var(--bm-minah)" />
          <text x="82" y="58" className="text-[14px] font-semibold" fill="#fff">
            {c.seniorLabel}
          </text>
          <text x="82" y="80" className="text-[11.5px]" fill="rgba(255,255,255,0.72)">
            {c.seniorSub}
          </text>

          {/* tranche junior */}
          <rect
            x="60"
            y="122"
            width="440"
            height="78"
            rx="10"
            fill="var(--bm-surface-2)"
            stroke="var(--bm-accent)"
            strokeWidth="1.4"
            strokeDasharray="6 5"
          />
          <text x="82" y="154" className="text-[14px] font-semibold" fill="var(--bm-ink)">
            {c.juniorLabel}
          </text>
          <text x="82" y="176" className="text-[11.5px]" fill="var(--bm-muted)">
            {c.juniorSub}
          </text>
        </svg>
      </section>

      {/* --- Suivre son argent sur toute la chaîne --- */}
      <section className="rounded-xl border border-bm-border bg-bm-surface p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold tracking-tight">{c.traceTitle}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-bm-accent px-2.5 py-0.5 text-[11px] font-medium text-bm-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-bm-accent" />
            {c.badge}
          </span>
        </div>

        <p className="mt-3 text-sm leading-[1.6] text-neutral-700">{c.traceBody}</p>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.1em] text-bm-muted">
          {c.stagesLabel}
        </p>
        <ol className="mt-3 space-y-3">
          {TRACEABILITY_STAGES.map((s, i) => (
            <li key={s.title.fr} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bm-accent-soft text-[11px] font-semibold text-bm-accent">
                {i + 1}
              </span>
              <span className="text-sm leading-[1.6] text-neutral-700">
                <strong className="font-semibold text-bm-ink">
                  {s.title[locale]}.
                </strong>{" "}
                {s.body[locale]}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-6 border-t border-bm-border pt-4 text-[13px] leading-[1.6] text-bm-muted">
          {c.traceFootnote}
        </p>
      </section>

      {/* --- Comment nous nous rémunérons ---
          Les deux commissions sont les seuls moments où nous prélevons. Le
          mécanisme de la seconde est le cœur du modèle : il mérite d'être
          expliqué, pas seulement chiffré. */}
      <section className="rounded-xl border border-bm-border bg-bm-surface p-6 min-[860px]:col-span-2">
        <h2 className="text-base font-semibold tracking-tight">{c.feesTitle}</h2>

        <dl className="mt-5 grid gap-5 min-[620px]:grid-cols-2">
          <div className="rounded-lg border border-bm-border bg-bm-accent-soft/40 p-5">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-bm-muted">
              {c.transactionLabel}
            </dt>
            <dd className="mt-1 text-3xl font-bold tracking-tight tabular-nums text-bm-accent">
              {FEES.transaction[locale]}
            </dd>
            <dd className="mt-2 text-[13px] leading-[1.6] text-neutral-700">
              {c.transactionBody}
            </dd>
          </div>

          <div className="rounded-lg border border-bm-border bg-bm-accent-soft/40 p-5">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-bm-muted">
              {c.performanceLabel}
            </dt>
            <dd className="mt-1 text-3xl font-bold tracking-tight tabular-nums text-bm-accent">
              {FEES.performance[locale]}
            </dd>
            <dd className="mt-2 text-[13px] leading-[1.6] text-neutral-700">
              {c.performanceBody}
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-sm leading-[1.7] text-neutral-700">{c.feesLead}</p>

        {/* La rotation est le ressort du modèle : sans elle, l'écart entre le
            coupon servi et le rendement capté n'a pas d'explication. */}
        <div className="mt-6 rounded-lg border border-bm-border bg-bm-surface p-5">
          <h3 className="text-sm font-semibold tracking-tight">
            {c.rotationTitle}
          </h3>
          <p className="mt-2 text-sm leading-[1.7] text-neutral-700">
            {c.rotationBody}
          </p>

          <ul className="mt-5 grid gap-px overflow-hidden rounded-lg border border-bm-border bg-bm-border sm:grid-cols-3">
            <li className="bg-bm-surface p-4">
              <p className="text-2xl font-bold tracking-tight tabular-nums text-bm-ink">
                {c.stat1}
              </p>
              <p className="mt-1 text-xs text-neutral-600">{c.caption1}</p>
            </li>
            <li className="bg-bm-surface p-4">
              <p className="text-2xl font-bold tracking-tight tabular-nums text-bm-accent">
                {c.stat2}
              </p>
              <p className="mt-1 text-xs text-neutral-600">{c.caption2}</p>
            </li>
            <li className="bg-bm-surface p-4">
              <p className="text-2xl font-bold tracking-tight tabular-nums text-bm-ink">
                {c.stat3}
              </p>
              <p className="mt-1 text-xs text-neutral-600">{c.caption3}</p>
            </li>
          </ul>

          <p className="mt-3 text-[12px] leading-5 text-bm-muted">
            {c.rotationFootnote}
          </p>
        </div>

        <p className="mt-4 border-t border-bm-border pt-4 text-[13px] leading-[1.6] text-bm-muted">
          {c.feesFootnote}
        </p>
      </section>
    </div>
  );
}
