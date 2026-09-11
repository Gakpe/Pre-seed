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
    roundLabel: "État de la levée",
    statuses: { soft: "Soft commitment", discussion: "En discussion" },
    upTo: "jusqu'à",
    weightedAt: "pondéré à",
    listTitle: "Souscripteurs",
    hidden: "Identité masquée",
    redacted:
      "L'identité des souscripteurs est communiquée après réception d'une intention d'investissement.",
    terms: {
      target: "Objectif",
      minTicket: "Ticket minimum",
      lead: "Lead recherché",
      period: "Période",
    },

    posLabel: "Paysage et positionnement",
    marketLink: "Le contexte général du marché est traité à part :",
    whereTitle: "Où est-ce que nous nous situons ?",
    where: [
      "Nous sommes un acteur jeune et innovant, construit autour de l'IA et de la blockchain.",
      "Nous construisons une infrastructure qui permet aux digital asset managers les plus avancés de se déployer en Afrique : connexions API, cross-chain, suivi des investissements.",
      "Nos comparables sont les acteurs de la finance on-chain.",
      "Les valorisations sont benchmarkées sur les meilleurs vintages et les profils blockchain du marché.",
      "Chaque stratégie porte une dimension d'impact, direct ou indirect, rattachée à des ODD de l'ONU identifiés.",
    ],
    whoTitle: "Qui est-ce que nous cherchons ?",
    whoLead:
      "De la smart money et des investisseurs familiers de la dette privée on-chain et des fintechs. Plus particulièrement des personnes qui ont une sensibilité pour l'impact et pour l'Afrique.",
    whoProfiles: ["Généralistes", "Spécialistes fintech", "Spécialistes blockchain", "Spécialistes impact"],

    exitLabel: "Horizons de sortie",
    exitLead:
      "Le raisonnement de fond est dans la note de marché : les acteurs traditionnels vont vouloir se digitaliser eux aussi. Les deux scénarios que nous envisageons se jouent à un horizon de cinq ans.",
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
    roundLabel: "State of the round",
    statuses: { soft: "Soft commitment", discussion: "In discussion" },
    upTo: "up to",
    weightedAt: "weighted at",
    listTitle: "Subscribers",
    hidden: "Identity withheld",
    redacted:
      "Subscriber identities are disclosed once an investment intention has been received.",
    terms: {
      target: "Target",
      minTicket: "Minimum ticket",
      lead: "Lead wanted",
      period: "Period",
    },

    posLabel: "Landscape and positioning",
    marketLink: "The general market context is covered separately:",
    whereTitle: "Where do we stand?",
    where: [
      "We are a young, innovative player, built around AI and blockchain.",
      "We build the infrastructure that lets the most advanced digital asset managers deploy across Africa: API connections, cross-chain, investment tracking.",
      "Our comparables are on-chain finance players.",
      "Valuations are benchmarked against the best vintages and blockchain profiles on the market.",
      "Every strategy carries a direct or indirect impact dimension, mapped to identified UN SDGs.",
    ],
    whoTitle: "Who are we looking for?",
    whoLead:
      "Smart money and investors familiar with on-chain private debt and fintech. More specifically, people with a sensibility for impact and for Africa.",
    whoProfiles: ["Generalists", "Fintech specialists", "Blockchain specialists", "Impact specialists"],

    exitLabel: "Exit horizons",
    exitLead:
      "The underlying reasoning is in the market note: traditional players will want to digitalise too. The two scenarios we envisage play out over a five-year horizon.",
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
        <SectionTitle n="01">{c.roundLabel}</SectionTitle>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-foreground/10 bg-white/60 p-5 sm:grid-cols-4">
          <Term label={c.terms.target} value={deal.target} />
          <Term label={c.terms.minTicket} value={deal.minTicket} />
          <Term label={c.terms.lead} value={deal.leadWanted} />
          <Term label={c.terms.period} value={deal.period} />
        </dl>

        <div className="mt-8 rounded-xl border border-foreground/10 bg-white/60 p-5 sm:p-6">
          <h3 className="text-sm font-semibold">{c.listTitle}</h3>

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
                      <span className="mt-2 block text-sm text-neutral-700">
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
        <SectionTitle n="02">{c.posLabel}</SectionTitle>

        <p className="mt-4 text-sm leading-7 text-neutral-600">
          {c.marketLink}{" "}
          <Link
            href="/investors/docs/note-marche"
            className="halo-hover rounded px-1 font-medium whitespace-nowrap text-marsala underline decoration-marsala/30 underline-offset-4 transition-colors hover:decoration-marsala"
          >
            {locale === "en" ? "Market note ↗" : "Note de marché ↗"}
          </Link>
        </p>

        <div className="mt-7 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-foreground/10 bg-white/60 p-6">
            <h3 className="text-sm font-semibold">{c.whereTitle}</h3>
            <ul className="mt-4 space-y-3">
              {c.where.map((w) => (
                <li key={w} className="text-sm leading-6 text-neutral-700">
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

      {/* ---------- 03 · Horizons de sortie ---------- */}
      <section>
        <SectionTitle n="03">{c.exitLabel}</SectionTitle>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">
          {c.exitLead}
        </p>
        <p className="mt-2">
          <Link
            href="/investors/docs/note-marche"
            className="halo-hover -mx-1 rounded px-1 text-sm font-medium whitespace-nowrap text-marsala underline decoration-marsala/30 underline-offset-4 transition-colors hover:decoration-marsala"
          >
            {locale === "en" ? "Market note ↗" : "Note de marché ↗"}
          </Link>
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-[auto_1fr] md:gap-8">
          <div className="flex flex-col justify-center rounded-xl border border-foreground/10 bg-white/60 px-6 py-5 text-center">
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

// Même habillage que les catégories de la data room, sur l'accueil : la
// pastille dit qu'on est sur un titre, le reste de la ligne dit lequel.
function SectionTitle({
  n,
  children,
}: {
  n: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-3 text-2xl font-semibold leading-tight tracking-tight">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 font-mono text-sm font-semibold text-marsala">
        {n}
      </span>
      {children}
    </h2>
  );
}
