import type { Locale } from "@/lib/i18n";

// Fiche track record : deux volets dans cet ordre, ce que le fondateur a déjà
// fait ailleurs, puis ce que la société a déjà fait elle-même. L'ordre porte du
// sens : le second volet est petit en montants, et il ne se lit correctement
// qu'après le premier.
//
// Le contenu vit ici plutôt qu'en base : ce sont des chiffres à tenir à jour
// avec l'équipe, pas de la prose éditable depuis l'admin.

// Fonds cités en exemple sur la période Bpifrance. Liens vérifiés à la main :
// un lien mort dans une data room investisseur coûte plus cher qu'un
// aller-retour par le code. Vérifiés le 9 septembre 2026.
// Logo Bpifrance fourni par l'équipe. S'il venait à manquer, le cartouche
// typographique reprend la main plutôt qu'une image cassée.
const BPI_LOGO: string | null = "/brand/logos/bpifrance.png";

const FUNDS = [
  { name: "Ardian", url: "https://www.ardian.com" },
  { name: "New Form Capital", url: "https://www.newformcap.com/" },
  { name: "Cathay Capital", url: "https://www.cathaycapital.com" },
  { name: "PSG Equity", url: "https://www.psgequity.com" },
];

const copy = {
  fr: {
    personalEyebrow: "Volet 1 · Le fondateur",
    personalTitle: "Un demi-milliard d'euros déployé, avant Minah.",
    personalLead:
      "Julien Gakpé a passé plus de cinq ans du côté institutionnel de la table, chez Bpifrance, en investisseur fonds de fonds. Il ne s'agit pas d'une ligne de CV, mais de la discipline exacte que Minah applique aujourd'hui à ses propres opérations : instruire, structurer, doser le risque et répondre de ses engagements.",
    bigStatLabel: "Déployés via Bpifrance",
    bigStatValue: "≈ 500 M€",
    bigStatNote:
      "En investisseur institutionnel fonds de fonds : sélection, structuration et suivi des véhicules souscrits.",
    facts: [
      { label: "Taille des tickets", value: "5 à 80 M€" },
      { label: "Structuration d'opérations", value: "Plus de 5 ans" },
      { label: "Position", value: "Investisseur institutionnel" },
    ],
    fundsLabel: "Exemples de fonds souscrits",
    fundsNote:
      "Une capacité de structuration éprouvée sur des véhicules de ce calibre.",

    companyEyebrow: "Volet 2 · La société",
    companyTitle: "Deux jalons franchis, et non une promesse.",
    companyLead:
      "Les montants sont sans commune mesure avec le volet précédent, et c'est le sujet : il ne s'agissait pas de déployer, il s'agissait de vérifier que la mécanique tient : juridiquement, opérationnellement, puis financièrement.",

    mvps: [
      {
        tag: "MVP #1",
        title: "Test",
        amountLabel: "Montant engagé",
        amount: "< 100 K€",
        goalLabel: "Objectif",
        goal: "Éprouver les flux financiers, sur le plan opérationnel comme juridique, avant tout déploiement en zone UEMOA.",
        resultLabel: "Résultat",
        result:
          "Le dispositif fonctionne. Le remboursement est en cours au taux de 8 %, avec un remboursement anticipé du capital jugé probable.",
        status: "Validé",
      },
      {
        tag: "MVP #2",
        title: "Première itération",
        amountLabel: "Taille du deal",
        amount: "2 M€",
        goalLabel: "Closing réalisé",
        goal: "500 K€ et plus, avec des retours sur investissement confirmés par le partenaire.",
        resultLabel: "En cours",
        result:
          "Structuration des niveaux de protection (assurance, garanties) afin d'être prêt pour des investisseurs institutionnels.",
        status: "En cours",
      },
    ],

    statsLabel: "Chiffres consolidés",
    stats: [
      { value: "500 K€+", label: "de closings" },
      {
        value: "10 M€+",
        label: "déjà déployés par le partenaire",
        note: "Capital propre du partenaire, engagé en avance des closings. À ne pas confondre avec le closing de 500 K€.",
      },
      {
        value: "15 M€",
        label: "accord signé de déploiement",
        note: "Sur les prochaines années.",
      },
      {
        value: "Afrique de l'Ouest",
        label: "déploiement en cours de closing",
        small: true,
      },
    ],

    closing:
      "Nous avons validé la thèse sur une première stratégie. L'objectif est désormais de porter le déploiement à 100 M€, en prolongeant la trajectoire de croissance déjà constatée.",
  },

  en: {
    personalEyebrow: "Part 1 · The founder",
    personalTitle: "Half a billion euros deployed, before Minah.",
    personalLead:
      "Julien Gakpé spent more than five years on the institutional side of the table, at Bpifrance, as a fund-of-funds investor. That is not a CV line: it is exactly the discipline Minah now applies to its own operations: assess, structure, calibrate risk and answer for what has been signed.",
    bigStatLabel: "Deployed through Bpifrance",
    bigStatValue: "≈ €500M",
    bigStatNote:
      "As an institutional fund-of-funds investor: selection, structuring and monitoring of the subscribed vehicles.",
    facts: [
      { label: "Ticket size", value: "€5M to €80M" },
      { label: "Deal structuring", value: "Over 5 years" },
      { label: "Seat", value: "Institutional investor" },
    ],
    fundsLabel: "Examples of subscribed funds",
    fundsNote:
      "A structuring capability proven on vehicles of that calibre.",

    companyEyebrow: "Part 2 · The company",
    companyTitle: "Two milestones delivered, not a promise.",
    companyLead:
      "The amounts bear no comparison with the previous section, and that is the point: this was not about deploying, it was about verifying that the mechanics hold: legally, operationally, then financially.",

    mvps: [
      {
        tag: "MVP #1",
        title: "Test",
        amountLabel: "Amount committed",
        amount: "< €100K",
        goalLabel: "Objective",
        goal: "Test the financial flows, operationally and legally, before any deployment in the WAEMU zone.",
        resultLabel: "Outcome",
        result:
          "The mechanism works. Repayment is under way at an 8% rate, with early repayment of the principal considered likely.",
        status: "Validated",
      },
      {
        tag: "MVP #2",
        title: "First iteration",
        amountLabel: "Deal size",
        amount: "€2M",
        goalLabel: "Closing achieved",
        goal: "€500K and above, with returns on investment confirmed by the partner.",
        resultLabel: "In progress",
        result:
          "Structuring the protection layers (insurance, guarantees) in order to be ready for institutional investors.",
        status: "In progress",
      },
    ],

    statsLabel: "Consolidated figures",
    stats: [
      { value: "€500K+", label: "in closings" },
      {
        value: "€10M+",
        label: "already deployed by the partner",
        note: "The partner's own capital, committed ahead of the closings. Not to be confused with the €500K closing.",
      },
      {
        value: "€15M",
        label: "signed deployment agreement",
        note: "Over the coming years.",
      },
      {
        value: "West Africa",
        label: "deployment currently closing",
        small: true,
      },
    ],

    closing:
      "We have validated the thesis on a first strategy. The objective is now to raise deployment to €100M, extending the growth trajectory already observed.",
  },
};

export function TrackRecord({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <div className="mt-10 space-y-16">
      {/* ---------- Volet 1 : le fondateur ---------- */}
      <section>
        <Eyebrow>{c.personalEyebrow}</Eyebrow>

        <div className="mt-4 grid gap-8 md:grid-cols-[minmax(0,300px)_1fr] md:gap-10">
          {/* Photo dominante : c'est l'argument du volet, pas une illustration. */}
          <figure className="max-w-[15rem] overflow-hidden rounded-xl bg-[#140d0b] sm:max-w-[18rem] md:max-w-none md:sticky md:top-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/team/julien.jpg"
              alt="Julien Gakpé"
              className="aspect-[2/3] w-full object-cover"
            />
            <figcaption className="px-4 py-3">
              <p className="text-sm font-semibold text-white">Julien Gakpé</p>
              <p className="mt-0.5 text-[11px] text-white/60">
                {locale === "en"
                  ? "Co-founder, CEO · formerly Bpifrance"
                  : "Co-fondateur, Directeur général · ex-Bpifrance"}
              </p>
            </figcaption>
          </figure>

          <div className="min-w-0">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight">
              {c.personalTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              {c.personalLead}
            </p>

            {/* Le chiffre existe pour être vu avant d'être lu. */}
            <div className="mt-7 rounded-xl border border-foreground/10 bg-white/60 p-6">
              <div className="flex items-center gap-3">
                {BPI_LOGO ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={BPI_LOGO}
                    alt="Bpifrance"
                    className="h-6 w-auto shrink-0 sm:h-7"
                  />
                ) : (
                  <span className="shrink-0 rounded border border-foreground/15 bg-chalk px-2 py-1 text-[11px] font-semibold tracking-tight text-marsala">
                    Bpifrance
                  </span>
                )}
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  {c.bigStatLabel}
                </p>
              </div>
              <p className="mt-1 text-5xl font-bold tracking-tight tabular-nums text-brand">
                {c.bigStatValue}
              </p>
              <p className="mt-2 max-w-md text-xs leading-5 text-neutral-500">
                {c.bigStatNote}
              </p>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {c.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs text-neutral-500">{f.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {c.fundsLabel}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {FUNDS.map((f) => (
                  <li key={f.name}>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="halo-hover inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-chalk px-3.5 py-1.5 text-xs text-neutral-700 transition-colors hover:border-brand/40 hover:text-foreground"
                    >
                      {f.name}
                      <span aria-hidden className="text-neutral-400">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-5 text-neutral-500">
                {c.fundsNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Volet 2 : la société ---------- */}
      <section>
        <Eyebrow>{c.companyEyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-tight tracking-tight">
          {c.companyTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
          {c.companyLead}
        </p>

        {/* Traitement compact, volontairement : pas de photo, pas d'emphase, ces montants ne sont pas l'argument, leur validation l'est. */}
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {c.mvps.map((m) => (
            <article
              key={m.tag}
              className="rounded-xl border border-foreground/10 bg-white/60 p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-xs text-neutral-400">{m.tag}</p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    m.status === "Validé" || m.status === "Validated"
                      ? "bg-salvia text-marsala"
                      : "border border-brand/40 bg-brand/10 text-foreground"
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <h3 className="mt-1 text-base font-semibold tracking-tight">
                {m.title}
              </h3>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {m.amountLabel}
              </p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight tabular-nums">
                {m.amount}
              </p>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {m.goalLabel}
              </p>
              <p className="mt-1 text-sm leading-6 text-neutral-700">{m.goal}</p>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {m.resultLabel}
              </p>
              <p className="mt-1 text-sm leading-6 text-neutral-700">
                {m.result}
              </p>
            </article>
          ))}
        </div>

        {/* Chiffres consolidés */}
        <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          {c.statsLabel}
        </p>
        <ul className="mt-3 grid gap-px overflow-hidden rounded-xl border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
          {c.stats.map((s) => (
            <li key={s.label} className="bg-white/70 p-5">
              <p
                className={`font-bold tracking-tight tabular-nums text-foreground ${
                  "small" in s && s.small ? "text-lg" : "text-3xl"
                }`}
              >
                {s.value}
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-600">
                {s.label}
              </p>
              {"note" in s && s.note && (
                <p className="mt-2 text-[11px] leading-4 text-neutral-400">
                  {s.note}
                </p>
              )}
            </li>
          ))}
        </ul>

        {/* Message de clôture du volet société */}
        <p className="mt-8 border-l-[3px] border-brand pl-5 text-lg font-medium leading-8 tracking-tight text-foreground">
          {c.closing}
        </p>
      </section>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
      {children}
    </p>
  );
}
