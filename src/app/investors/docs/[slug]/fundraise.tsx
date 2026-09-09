import Link from "next/link";
import { dealFor } from "@/lib/deal";
import type { Locale } from "@/lib/i18n";

// Fiche « Levée en cours » : trois blocs, l'état de la levée, puis deux
// sections de contexte (positionnement, horizon de sortie).
//
// ⚠️ La liste nominative des souscripteurs et leurs logos ne sont pas encore
// arrivés. Les entrées ne portent donc que ce qui est documenté : la nature de
// la contrepartie, sa catégorie et son montant. Dès que la liste est là,
// renseigner `name` et déposer le logo en `public/brand/investors/<id>.png` :
// le rendu bascule du monogramme au logo, en niveaux de gris au repos et en
// couleur au survol.
//
// Le matching fund est un soft commitment, jamais un engagement ferme, et la
// contrepartie n'est pas nommée. Voir aussi src/lib/deal.ts.

type Participant = {
  id: string;
  name: { fr: string; en: string };
  category: { fr: string; en: string };
  amount: { fr: string; en: string };
  detail?: { fr: string; en: string };
  /** Fichier dans public/brand/investors/. Monogramme si absent. */
  logo?: string;
  /** Monogramme de repli, deux lettres. */
  initials: string;
};

const COMMITTED: Participant[] = [
  {
    id: "business-angels",
    name: { fr: "Business angels", en: "Business angels" },
    category: { fr: "Personnes physiques", en: "Individuals" },
    amount: { fr: "200 K€", en: "€200K" },
    initials: "BA",
  },
];

const SOFT: Participant[] = [
  {
    id: "partenaire-blockchain",
    name: {
      fr: "Partenaire de l'écosystème blockchain",
      en: "Blockchain ecosystem partner",
    },
    category: { fr: "Partenaire stratégique", en: "Strategic partner" },
    amount: { fr: "500 K€", en: "€500K" },
    detail: {
      fr: "Intention exprimée, non contractualisée",
      en: "Intention expressed, not contracted",
    },
    initials: "PB",
  },
];

const IN_DISCUSSION: Participant[] = [
  {
    id: "bpifrance",
    name: { fr: "Bpifrance", en: "Bpifrance" },
    category: {
      fr: "Banque publique d'investissement",
      en: "Public investment bank",
    },
    amount: { fr: "400 K€", en: "€400K" },
    detail: { fr: "pondéré à 50 %", en: "weighted at 50%" },
    initials: "BP",
  },
  {
    id: "fonds-vc",
    name: { fr: "Fonds de capital-risque", en: "Venture capital fund" },
    category: { fr: "Capital-risque", en: "Venture capital" },
    amount: { fr: "200 K€", en: "€200K" },
    detail: { fr: "pondéré à 50 %", en: "weighted at 50%" },
    initials: "VC",
  },
];

const copy = {
  fr: {
    roundEyebrow: "01 · État de la levée",
    roundTitle: "Où en est le tour.",
    committed: "Engagements fermes",
    soft: "Soft commitment",
    inDiscussion: "En discussion",
    redacted:
      "Le détail complet des contreparties en discussion, comité et conditions compris, est communiqué après réception d'une intention d'investissement.",
    pending:
      "Liste nominative et logos des souscripteurs à compléter, en attente de la liste définitive côté équipe.",
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
    committed: "Firm commitments",
    soft: "Soft commitment",
    inDiscussion: "In discussion",
    redacted:
      "Full detail on the counterparties in discussion, including committee and terms, is shared once an investment intention has been received.",
    pending:
      "Named list and subscriber logos still to be filled in, awaiting the final list from the team.",
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

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Group
            title={c.committed}
            tone="committed"
            people={COMMITTED}
            locale={locale}
          />
          <Group title={c.soft} tone="soft" people={SOFT} locale={locale} />
          <Group
            title={c.inDiscussion}
            tone="discussion"
            people={IN_DISCUSSION}
            locale={locale}
            redacted
            redactedNote={c.redacted}
          />
        </div>

        <p className="mt-4 text-xs leading-5 text-brand/90">{c.pending}</p>
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

function Group({
  title,
  tone,
  people,
  locale,
  redacted = false,
  redactedNote,
}: {
  title: string;
  tone: "committed" | "soft" | "discussion";
  people: Participant[];
  locale: Locale;
  /** Bloc en discussion : nom, montant et catégorie seulement, le reste masqué. */
  redacted?: boolean;
  redactedNote?: string;
}) {
  const badge =
    tone === "committed"
      ? "bg-salvia text-marsala"
      : tone === "soft"
        ? "border border-foreground/15 bg-chalk text-neutral-600"
        : "border border-brand/40 bg-brand/10 text-foreground";

  return (
    <div className="flex flex-col rounded-xl border border-foreground/10 bg-white/60 p-5">
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${badge}`}
        >
          {title}
        </span>
      </div>

      <ul className="mt-4 flex-1 space-y-1">
        {people.map((p) => (
          <li key={p.id}>
            <div className="halo-hover group rounded-lg px-2 py-2 transition-colors hover:bg-white/70">
              <div className="flex items-center gap-3">
                {p.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.logo}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-md object-contain grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-neutral-200/70 text-[11px] font-semibold tracking-wide text-neutral-500 transition-colors duration-300 group-hover:bg-brand/15 group-hover:text-brand"
                  >
                    {p.initials}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-snug">
                    {p.name[locale]}
                  </span>
                  <span className="block text-[11px] text-neutral-500">
                    {p.category[locale]}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-medium tabular-nums text-neutral-700">
                  {p.amount[locale]}
                </span>
              </div>

              {p.detail && !redacted && (
                <p className="mt-1 pl-12 text-[11px] text-neutral-500">
                  {p.detail[locale]}
                </p>
              )}

              {/* Bloc en discussion : tout ce qui n'est pas nom, catégorie ou
                  montant reste masqué. Des barres, pas du faux texte flouté :
                  on signale une information retenue sans en inventer une. */}
              {redacted && (
                <span
                  aria-hidden
                  className="mt-2 flex flex-col gap-1.5 pl-12 blur-[3px]"
                >
                  <span className="h-1.5 w-4/5 rounded-full bg-neutral-300" />
                  <span className="h-1.5 w-3/5 rounded-full bg-neutral-300" />
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {redactedNote && (
        <p className="mt-4 border-t border-foreground/10 pt-3 text-[11px] leading-4 text-neutral-500">
          {redactedNote}
        </p>
      )}
    </div>
  );
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
