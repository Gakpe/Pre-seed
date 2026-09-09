import { FEES } from "@/lib/flow-nodes";
// Les deux blocs de bas de page de la fiche « business model » : où se place
// notre risque, et l'ambition de traçabilité de bout en bout.
// Aucun état, aucune interaction.

const TRACEABILITY_STAGES = [
  {
    title: "Votre position",
    body: "Souscription, échéancier et coupons versés : tenus au registre et consultables à tout moment.",
  },
  {
    title: "La stratégie",
    body: "Encours déployé, contrats financés, taux de remboursement agrégé sur le portefeuille.",
  },
  {
    title: "Le véhicule local",
    body: "Flux entrants et sortants de la société de portage qui exécute le déploiement.",
  },
  {
    title: "Le contrat sous-jacent",
    body: "Exécution et paiement de chaque marché financé, jusqu'au versement du payeur public.",
  },
];

export function BusinessModelBlocks() {
  return (
    <div className="mt-12 grid gap-6 min-[860px]:grid-cols-2">
      {/* --- Où se place notre risque --- */}
      <section className="rounded-xl border border-bm-border bg-bm-surface p-6">
        <h2 className="text-base font-semibold tracking-tight">
          Où se place notre risque
        </h2>
        <p className="mt-3 text-sm leading-[1.6] text-neutral-700">
          Nos souscripteurs sont en dette senior : payés les premiers, exposés
          les derniers. La tranche junior, nos propres fonds et les revenus
          des autres stratégies maintenus en réserve, encaisse la première
          perte avant que le coupon senior ne soit touché.
        </p>

        <svg
          viewBox="0 0 560 236"
          className="mt-6 w-full"
          role="img"
          aria-label="Dette senior au-dessus de la tranche junior first loss ; les paiements descendent, les pertes remontent"
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
            PAIEMENTS
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
            PERTES
          </text>

          {/* dette senior */}
          <rect x="60" y="26" width="440" height="78" rx="10" fill="var(--bm-minah)" />
          <text x="82" y="58" className="text-[14px] font-semibold" fill="#fff">
            Dette senior
          </text>
          <text x="82" y="80" className="text-[11.5px]" fill="rgba(255,255,255,0.72)">
            Nos souscripteurs · coupon fixe, remboursé en premier
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
            Tranche junior · first loss
          </text>
          <text x="82" y="176" className="text-[11.5px]" fill="var(--bm-muted)">
            Fonds propres Minah · absorbe la première perte
          </text>
        </svg>
      </section>

      {/* --- Suivre son argent sur toute la chaîne --- */}
      <section className="rounded-xl border border-bm-border bg-bm-surface p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold tracking-tight">
            Suivre son argent sur toute la chaîne
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-bm-accent px-2.5 py-0.5 text-[11px] font-medium text-bm-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-bm-accent" />
            Ambition · en construction
          </span>
        </div>

        <p className="mt-3 text-sm leading-[1.6] text-neutral-700">
          Aujourd&apos;hui, la traçabilité de votre position repose sur notre
          reporting. Ce que nous visons est plus exigeant : que chaque étage de
          la chaîne soit vérifiable sans avoir à nous croire sur parole.
        </p>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.1em] text-bm-muted">
          Les quatre étages visés
        </p>
        <ol className="mt-3 space-y-3">
          {TRACEABILITY_STAGES.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bm-accent-soft text-[11px] font-semibold text-bm-accent">
                {i + 1}
              </span>
              <span className="text-sm leading-[1.6] text-neutral-700">
                <strong className="font-semibold text-bm-ink">{s.title}.</strong>{" "}
                {s.body}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-6 border-t border-bm-border pt-4 text-[13px] leading-[1.6] text-bm-muted">
          Seul le premier étage est tenu par notre registre à ce jour. Les trois
          suivants dépendent de la capacité de nos partenaires locaux et des
          payeurs publics à exposer leurs données : nous les construisons
          stratégie après stratégie, et nous ne les annoncerons livrés que
          lorsqu&apos;ils le seront.
        </p>
      </section>

      {/* --- Comment nous nous rémunérons ---
          Les deux commissions sont les seuls moments où nous prélevons. Le
          mécanisme de la seconde est le cœur du modèle : il mérite d'être
          expliqué, pas seulement chiffré. */}
      <section className="rounded-xl border border-bm-border bg-bm-surface p-6 min-[860px]:col-span-2">
        <h2 className="text-base font-semibold tracking-tight">
          Comment nous nous rémunérons
        </h2>

        <dl className="mt-5 grid gap-5 min-[620px]:grid-cols-2">
          <div className="rounded-lg border border-bm-border bg-bm-accent-soft/40 p-5">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-bm-muted">
              Transaction fees
            </dt>
            <dd className="mt-1 text-3xl font-bold tracking-tight tabular-nums text-bm-accent">
              {FEES.transaction}
            </dd>
            <dd className="mt-2 text-[13px] leading-[1.6] text-neutral-700">
              Prélevés sur le flux entrant, à la souscription. Ils couvrent la
              structuration du produit, l&apos;entrée en relation et la mise en
              registre.
            </dd>
          </div>

          <div className="rounded-lg border border-bm-border bg-bm-accent-soft/40 p-5">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-bm-muted">
              Performance fees
            </dt>
            <dd className="mt-1 text-3xl font-bold tracking-tight tabular-nums text-bm-accent">
              {FEES.performance}
            </dd>
            <dd className="mt-2 text-[13px] leading-[1.6] text-neutral-700">
              Prélevés sur la remontée des coupons, avant redistribution. La
              fourchette dépend de la stratégie et du niveau de surperformance
              constaté.
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-sm leading-[1.7] text-neutral-700">
          Les souscripteurs sont exposés en dette, avec un rendement annoncé à
          l&apos;entrée. Toute performance dégagée au-delà de ce rendement
          constitue notre rémunération. Notre exposition en dette senior et en
          venture debt nous permet ainsi de capter la surperformance des
          produits sous-jacents.
        </p>

        <p className="mt-4 border-t border-bm-border pt-4 text-[13px] leading-[1.6] text-bm-muted">
          Le détail complet de la mécanique, hypothèses et cas chiffrés compris,
          est disponible au niveau 2 de la data room.
        </p>
      </section>
    </div>
  );
}
