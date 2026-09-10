import Link from "next/link";
import type { Locale } from "@/lib/i18n";

// Fiche « Levée en cours » : trois blocs, l'état de la levée, puis deux
// sections de contexte (positionnement, horizon de sortie).
//
// Aucune identité n'est publiée : chaque ligne porte un rôle et un montant, le
// nom reste masqué jusqu'à réception d'une intention d'investissement. Les
// montants et les statuts sont tenus dans src/lib/deal.ts, qui alimente aussi
// l'infobulle de l'accueil : une seule source, un seul total.

import { commitments, dealFor } from "@/lib/deal";

// Précisions propres à la fiche, indexées par l'identifiant de l'engagement.
const NOTES: Record<string, { fr: string; en: string } | undefined> = {
  "co-lead": {
    fr: "Intention exprimée, non contractualisée",
    en: "Intention expressed, not contracted",
  },
};

const copy = {
  fr: {
    roundEyebrow: "01 · État de la levée",
    roundTitle: "Où en est le tour.",
    statuses: { soft: "Soft commitment", discussion: "En discussion" },
    upTo: "jusqu'à",
    weightedAt: "pondéré à",
    listTitle: "Souscripteurs",
    hidden: "Identité masquée",
    redacted:
      "L'identité des souscripteurs est communiquée après réception d'une intention d'investissement. La catégorie et le montant, eux, sont affichés dès maintenant.",
    terms: {
      target: "Objectif",
      minTicket: "Ticket minimum",
      lead: "Lead recherché",
      period: "Période",
    },

    posEyebrow: "02 · Paysage et positionnement",
    posTitle: "Où nous nous situons.",
    marketLink: "Le contexte général du marché est traité à part :",
    whereTitle: "Où nous nous situons",
    where: [
      "Acteur jeune et cutting-edge, tourné IA et blockchain.",
      "Connecté à des liquidités on-chain plus avancées : nos comparables sont les acteurs de la finance on-chain, pas les acteurs traditionnels.",
      "Le métier : construire l'infrastructure qui permet aux digital asset managers de déployer des fonds sur le continent africain via Minah : connexions API, cross-chain, suivi des investissements on-chain.",
      "Valorisations benchmarkées sur les meilleurs vintages et les meilleurs profils blockchain du marché. Ce sont précisément ces profils que nous cherchons à attirer.",
      "Dimension impact : chaque stratégie porte un impact indirect, avec des ODD clairement associés.",
    ],
    whoTitle: "Qui nous cherchons",
    whoLead:
      "De la smart money capable d'accompagner Minah vers le statut de leader de la dette privée on-chain à orientation fintech, et dotée d'une sensibilité impact et Afrique.",
    whoProfiles: ["Généralistes", "Spécialistes fintech", "Spécialistes blockchain", "Spécialistes impact"],

    exitEyebrow: "03 · Horizon de sortie",
    exitTitle: "Horizon 5 ans, deux scénarios.",
    exitLead:
      "Le raisonnement de fond est dans la note de marché : les acteurs traditionnels vont vouloir se digitaliser et devenir cutting-edge. Les deux scénarios ci-dessous se jouent à cinq ans.",
    exits: [
      {
        tag: "Sortie industrielle",
        body: "Rachat par des acteurs de marché traditionnels cherchant à se digitaliser, attirés par le volume et les opérations de Minah.",
      },
      {
        tag: "Sortie financière",
        body: "Un grand gestionnaire d'actifs accélère Minah par un LBO ou un montage équivalent, afin d'augmenter le volume, avec rachat ou build-up à terme.",
      },
    ],
    horizon: "5 ans",
    horizonLabel: "dans les deux scénarios",
  },

  en: {
    roundEyebrow: "01 · State of the round",
    roundTitle: "Where the round stands.",
    statuses: { soft: "Soft commitment", discussion: "In discussion" },
    upTo: "up to",
    weightedAt: "weighted at",
    listTitle: "Subscribers",
    hidden: "Identity withheld",
    redacted:
      "Subscriber identities are disclosed once an investment intention has been received. Category and amount are shown from the outset.",
    terms: {
      target: "Target",
      minTicket: "Minimum ticket",
      lead: "Lead wanted",
      period: "Period",
    },

    posEyebrow: "02 · Landscape and positioning",
    posTitle: "Where we sit.",
    marketLink: "The general market context is covered separately:",
    whereTitle: "Where we sit",
    where: [
      "A young, cutting-edge player, built around AI and blockchain.",
      "Connected to more advanced on-chain liquidity: our comparables are on-chain finance players, not traditional ones.",
      "The business: building the infrastructure that lets digital asset managers deploy funds across Africa through Minah: API connections, cross-chain, on-chain investment tracking.",
      "Valuations benchmarked against the best vintages and the best blockchain profiles on the market. These are precisely the profiles we intend to attract.",
      "Impact dimension: every strategy carries an indirect impact, with clearly mapped SDGs.",
    ],
    whoTitle: "Who we are looking for",
    whoLead:
      "Smart money able to take Minah to leadership of fintech-oriented on-chain private debt, with a genuine impact and Africa sensibility.",
    whoProfiles: ["Generalists", "Fintech specialists", "Blockchain specialists", "Impact specialists"],

    exitEyebrow: "03 · Exit horizon",
    exitTitle: "Five-year horizon, two scenarios.",
    exitLead:
      "The underlying reasoning is in the market note: traditional players will want to digitalise and turn cutting-edge. Both scenarios below play out over five years.",
    exits: [
      {
        tag: "Industrial exit",
        body: "Acquisition by traditional market players seeking to digitalise, drawn by Minah's volume and deal flow.",
      },
      {
        tag: "Financial exit",
        body: "A large asset manager accelerates Minah through an LBO or equivalent structure, in order to grow volume, with a buyout or build-up in due course.",
      },
    ],
    horizon: "5 years",
    horizonLabel: "in both scenarios",
  },
};

export function Fundraise({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const deal = dealFor(locale);

  return (
    <div className="mt-10 space-y-16">
      {/* ---------- 01 · État de la levée ---------- */}
      <section>
        <Eyebrow>{c.roundEyebrow}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight">
          {c.roundTitle}
        </h2>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-foreground/10 bg-white/60 p-5 sm:grid-cols-4">
          <Term label={c.terms.target} value={deal.target} />
          <Term label={c.terms.minTicket} value={deal.minTicket} />
          <Term label={c.terms.lead} value={deal.leadWanted} />
          <Term label={c.terms.period} value={deal.period} />
        </dl>

        <div className="mt-8 rounded-xl border border-foreground/10 bg-white/60 p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            {c.listTitle}
          </p>

          <ul className="mt-4 divide-y divide-foreground/10">
            {commitments.map((line) => {
              const note = NOTES[line.id];
              return (
                <li key={line.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                    <div className="min-w-0 flex-1">
                      {/* Une barre plutôt qu'un nom flouté : une identité
                          masquée ne doit pas exister dans la page. */}
                      <span
                        aria-hidden
                        className="block h-2.5 w-32 rounded-full bg-neutral-300/80 blur-[3px]"
                      />
                      <span className="sr-only">{c.hidden}</span>
                      <span className="mt-2 block text-sm font-medium">
                        {line.role[locale]}
                      </span>
                      {line.weight < 1 && (
                        <span className="mt-0.5 block text-[11px] text-neutral-400">
                          {c.weightedAt} {Math.round(line.weight * 100)} %
                        </span>
                      )}
                      {note && (
                        <span className="mt-0.5 block text-[11px] text-neutral-400">
                          {note[locale]}
                        </span>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
                      <span className="text-sm font-medium tabular-nums text-neutral-700">
                        {line.capped && (
                          <span className="font-normal text-neutral-400">
                            {c.upTo}{" "}
                          </span>
                        )}
                        {amount(line.gross, locale)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          line.status === "soft"
                            ? "border border-foreground/15 bg-chalk text-neutral-600"
                            : "border border-brand/40 bg-brand/10 text-foreground"
                        }`}
                      >
                        {c.statuses[line.status]}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 border-t border-foreground/10 pt-4 text-[11px] leading-4 text-neutral-500">
            {c.redacted}
          </p>
        </div>

      </section>

      {/* ---------- 02 · Paysage et positionnement ---------- */}
      <section>
        <Eyebrow>{c.posEyebrow}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight">
          {c.posTitle}
        </h2>

        <p className="mt-3 text-sm leading-7 text-neutral-600">
          {c.marketLink}{" "}
          <Link
            href="/investors/docs/note-marche"
            className="halo-hover rounded px-1 font-medium text-marsala underline decoration-marsala/30 underline-offset-4 transition-colors hover:decoration-marsala"
          >
            {locale === "en" ? "Market note ↗" : "Note de marché ↗"}
          </Link>
        </p>

        <div className="mt-7 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-foreground/10 bg-white/60 p-6">
            <h3 className="text-sm font-semibold">{c.whereTitle}</h3>
            <ul className="mt-4 space-y-3">
              {c.where.map((w) => (
                <li
                  key={w}
                  className="border-l-2 border-salvia pl-4 text-sm leading-6 text-neutral-700"
                >
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-brand/25 bg-brand/[0.04] p-6">
            <h3 className="text-sm font-semibold">{c.whoTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-700">
              {c.whoLead}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.whoProfiles.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-foreground/10 bg-white/70 px-3 py-1 text-xs text-neutral-600"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- 03 · Horizon de sortie ---------- */}
      <section>
        <Eyebrow>{c.exitEyebrow}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight">
          {c.exitTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
          {c.exitLead}{" "}
          <Link
            href="/investors/docs/note-marche"
            className="halo-hover rounded px-1 font-medium text-marsala underline decoration-marsala/30 underline-offset-4 transition-colors hover:decoration-marsala"
          >
            {locale === "en" ? "Market note ↗" : "Note de marché ↗"}
          </Link>
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-[auto_1fr] md:items-start md:gap-8">
          <div className="rounded-xl border border-foreground/10 bg-white/60 px-6 py-5 text-center">
            <p className="text-3xl font-bold tracking-tight text-brand">
              {c.horizon}
            </p>
            <p className="mt-1 text-xs text-neutral-500">{c.horizonLabel}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {c.exits.map((e) => (
              <article
                key={e.tag}
                className="rounded-xl border border-foreground/10 bg-white/60 p-5"
              >
                <h3 className="text-sm font-semibold tracking-tight">{e.tag}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-700">
                  {e.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function amount(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function Term({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
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
