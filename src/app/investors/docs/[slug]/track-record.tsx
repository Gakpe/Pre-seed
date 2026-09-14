import type { Locale } from "@/lib/i18n";
import { SectionTitle } from "./section-title";

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
    personalTitle: "Un demi-milliard d'euros déployé, avant Minah",
    personalLead:
      "Julien Gakpé a passé plus de cinq ans du côté institutionnel de la table, chez Bpifrance, en investisseur fonds de fonds. Il ne s'agit pas d'une ligne de CV, mais de la discipline exacte que Minah applique aujourd'hui à ses propres opérations : instruire, structurer, doser le risque et répondre de ses engagements.",
    bigStatLabel: "Déployés via Bpifrance",
    bigStatValue: "≈\u00a0500\u00a0M€",
    bigStatNote:
      "En investisseur institutionnel fonds de fonds : sélection, structuration et suivi des véhicules souscrits.",
    facts: [
      { label: "Taille des tickets", value: "5 à 80\u00a0M€" },
      { label: "Structuration d'opérations", value: "Plus de 5 ans" },
      { label: "Position", value: "Investisseur institutionnel" },
    ],
    fundsLabel: "Exemples de fonds souscrits",
    fundsNote:
      "Une capacité de structuration éprouvée sur des véhicules de ce calibre.",

    companyTitle: "Deux jalons franchis, et non une promesse",
    companyLead:
      "Les montants sont sans commune mesure avec le volet précédent, et c'est le sujet : il ne s'agissait pas de déployer, il s'agissait de vérifier que la mécanique tient : juridiquement, opérationnellement, puis financièrement.",

    mvps: [
      {
        tag: "MVP #1",
        title: "Test",
        amountLabel: "Montant engagé",
        amount: "<\u00a0100\u00a0K€",
        goalLabel: "Objectif",
        goal: "Éprouver les flux financiers, sur le plan opérationnel comme juridique, avant tout déploiement en zone UEMOA.",
        resultLabel: "Résultat",
        result:
          "Le dispositif fonctionne. Le remboursement est en cours au taux de 8\u00a0%, avec un remboursement anticipé du capital jugé probable.",
        status: "Validé",
      },
      {
        tag: "MVP #2",
        title: "Première itération",
        amountLabel: "Taille du deal",
        amount: "2\u00a0M€",
        goalLabel: "Closing réalisé",
        goal: "500\u00a0K€ et plus, avec des retours sur investissement confirmés par le partenaire.",
        resultLabel: "En cours",
        result:
          "Structuration des niveaux de protection (assurance, garanties) afin d'être prêt pour des investisseurs institutionnels.",
        status: "En cours",
      },
    ],

    statsLabel: "Chiffres consolidés",
    stats: [
      { value: "500\u00a0K€+", label: "de closings" },
      {
        value: "10\u00a0M€+",
        label: "déjà déployés par le partenaire",
        note: "Capital propre du partenaire, engagé en avance des closings. À ne pas confondre avec le closing de 500\u00a0K€.",
      },
      {
        value: "15\u00a0M€",
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
      "Nous avons validé la thèse sur une première stratégie. L'objectif est désormais de porter le déploiement à 100\u00a0M€, en prolongeant la trajectoire de croissance déjà constatée.",
  },

  en: {
    personalTitle: "Half a billion euros deployed, before Minah",
    personalLead:
      "Julien Gakpé spent more than five years on the institutional side of the table, at Bpifrance, as a fund-of-funds investor. That is not a CV line: it is exactly the discipline Minah now applies to its own operations: assess, structure, calibrate risk and answer for what has been signed.",
    bigStatLabel: "Deployed through Bpifrance",
    bigStatValue: "≈\u00a0€500M",
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

    companyTitle: "Two milestones delivered, not a promise",
    companyLead:
      "The amounts bear no comparison with the previous section, and that is the point: this was not about deploying, it was about verifying that the mechanics hold: legally, operationally, then financially.",

    mvps: [
      {
        tag: "MVP #1",
        title: "Test",
        amountLabel: "Amount committed",
        amount: "<\u00a0€100K",
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

// Filets du bandeau de chiffres, case par case : une colonne sur mobile, deux
// sur tablette, quatre au large. Seuls les séparateurs internes sont tracés.
const STAT_CELL = [
  "sm:pr-5",
  "border-t sm:border-t-0 sm:border-l sm:pl-5 lg:pr-5",
  "border-t sm:pr-5 lg:border-t-0 lg:border-l lg:pl-5",
  "border-t sm:border-l sm:pl-5 lg:border-t-0",
];

// Numéro d'appel d'une précision : rang parmi les chiffres qui en portent une.
function noteNumber(stats: readonly { note?: string }[], index: number) {
  return stats.slice(0, index + 1).filter((s) => s.note).length;
}

export function TrackRecord({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <div className="mt-12 space-y-20">
      {/* ---------- 01. Le fondateur ----------
          Titre de section numéroté : la fiche se lit en deux chapitres, dans
          cet ordre. L'accroche du volet devient le titre, le libellé « Volet 1 »
          le doublait. */}
      <section>
        <SectionTitle n="01">{c.personalTitle}</SectionTitle>

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,300px)_1fr] md:gap-10">
          {/* Photo dominante : c'est l'argument du volet, pas une illustration. */}
          <figure className="max-w-[15rem] overflow-hidden rounded-xl bg-[#140d0b] sm:max-w-[18rem] md:max-w-none md:sticky md:top-8 md:self-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/team/julien.jpg"
              alt="Julien Gakpé"
              className="aspect-[2/3] w-full object-cover"
            />
            <figcaption className="px-4 py-3">
              <p className="text-sm font-semibold text-white">Julien Gakpé</p>
              <p className="mt-0.5 text-xs text-white/70">
                {locale === "en"
                  ? "Co-founder, CEO, formerly Bpifrance"
                  : "Co-fondateur, directeur général, ex-Bpifrance"}
              </p>
            </figcaption>
          </figure>

          <div className="min-w-0">
            <p className="text-[15px] leading-[1.8] text-neutral-700">
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
                <p className="text-sm font-semibold">{c.bigStatLabel}</p>
              </div>
              <p className="mt-3 text-5xl font-bold tracking-tight tabular-nums text-marsala">
                {c.bigStatValue}
              </p>
              <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600">
                {c.bigStatNote}
              </p>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {c.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm text-neutral-600">{f.label}</dt>
                  <dd className="mt-0.5 text-[15px] font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <p className="text-sm font-semibold">{c.fundsLabel}</p>
              {/* Liens en cartouches carrés : les pastilles arrondies sont
                  réservées aux statuts. */}
              <ul className="mt-3 flex flex-wrap gap-2">
                {FUNDS.map((f) => (
                  <li key={f.name}>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="halo-hover inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-foreground/10 bg-white/60 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:border-brand/40 hover:text-foreground"
                    >
                      {f.name}
                      <span aria-hidden className="text-neutral-500">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {c.fundsNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 02. La société ---------- */}
      <section>
        <SectionTitle n="02">{c.companyTitle}</SectionTitle>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.8] text-neutral-700">
          {c.companyLead}
        </p>

        {/* Traitement compact, volontairement : pas de photo, pas d'emphase, ces montants ne sont pas l'argument, leur validation l'est. */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {c.mvps.map((m) => (
            <article
              key={m.tag}
              className="rounded-xl border border-foreground/10 bg-white/60 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">
                  <span className="font-mono font-normal text-neutral-500">
                    {m.tag}
                  </span>
                  <span className="mx-2 text-neutral-300" aria-hidden>
                    /
                  </span>
                  {m.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    m.status === "Validé" || m.status === "Validated"
                      ? "bg-salvia text-marsala"
                      : "border border-brand/40 bg-brand/10 text-foreground"
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <dl>
                <dt className="mt-5 text-sm text-neutral-600">{m.amountLabel}</dt>
                <dd className="mt-0.5 text-2xl font-bold tracking-tight tabular-nums">
                  {m.amount}
                </dd>

                <dt className="mt-5 text-sm text-neutral-600">{m.goalLabel}</dt>
                <dd className="mt-1 text-[15px] leading-[1.7] text-neutral-700">
                  {m.goal}
                </dd>

                <dt className="mt-5 text-sm text-neutral-600">{m.resultLabel}</dt>
                <dd className="mt-1 text-[15px] leading-[1.7] text-neutral-700">
                  {m.result}
                </dd>
              </dl>
            </article>
          ))}
        </div>

        {/* Chiffres consolidés : bandeau à filets et séparateurs verticaux,
            le traitement des chiffres mis en avant (AGENTS.md). */}
        <h3 className="mt-12 text-sm font-semibold">{c.statsLabel}</h3>
        <ul className="mt-3 grid border-y border-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
          {c.stats.map((s, i) => (
            <li
              key={s.label}
              className={`border-foreground/10 py-5 ${STAT_CELL[i]}`}
            >
              <p
                className={`font-bold tracking-tight tabular-nums text-foreground ${
                  "small" in s && s.small ? "text-xl leading-9" : "text-3xl"
                }`}
              >
                {s.value}
                {"note" in s && s.note && (
                  <sup className="relative -top-3.5 ml-1 font-mono text-xs font-semibold text-neutral-500">
                    {noteNumber(c.stats, i)}
                  </sup>
                )}
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-700">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
        {/* Les précisions passent sous le bandeau, appelées par un numéro :
            dans leur case, elles laissaient les cases voisines à moitié vides. */}
        <ol className="mt-3 space-y-1">
          {c.stats.map((s, i) =>
            "note" in s && s.note ? (
              <li key={s.label} className="flex gap-2 text-sm leading-6 text-neutral-600">
                <span className="font-mono text-xs leading-6 text-neutral-500">
                  {noteNumber(c.stats, i)}
                </span>
                <span>{s.note}</span>
              </li>
            ) : null
          )}
        </ol>

        {/* Message de clôture du volet société : carte blanche, comme une
            citation, sans guillemets puisque personne n'est cité. */}
        <p className="mt-10 rounded-xl border border-foreground/10 bg-white/60 p-6 text-[17px] font-semibold leading-[1.5] tracking-tight text-foreground">
          {c.closing}
        </p>
      </section>
    </div>
  );
}
