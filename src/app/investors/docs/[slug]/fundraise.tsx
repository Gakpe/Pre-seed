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

type Status = "committed" | "soft" | "discussion";

type Participant = {
  id: string;
  name: { fr: string; en: string };
  category: { fr: string; en: string };
  amount: { fr: string; en: string };
  detail?: { fr: string; en: string };
  status: Status;
};

// Une seule liste : l'état de la levée se lit d'un coup d'œil, le statut est
// porté par la ligne et non par la colonne dans laquelle elle se trouve.
//
// Les noms restent masqués tant qu'aucune intention d'investissement n'a été
// reçue. La catégorie, elle, est affichée : c'est elle qui porte l'information
// utile à un lecteur, pas l'identité.
const PARTICIPANTS: Participant[] = [
  {
    id: "business-angels",
    name: { fr: "Business angels", en: "Business angels" },
    category: { fr: "Personnes physiques", en: "Individuals" },
    amount: { fr: "200 K€", en: "€200K" },
    status: "committed",
  },
  {
    id: "partenaire-blockchain",
    name: {
      fr: "Partenaire de l'écosystème blockchain",
      en: "Blockchain ecosystem partner",
    },
    category: {
      fr: "Partenaire stratégique, écosystème blockchain",
      en: "Strategic partner, blockchain ecosystem",
    },
    amount: { fr: "500 K€", en: "€500K" },
    detail: {
      fr: "Intention exprimée, non contractualisée",
      en: "Intention expressed, not contracted",
    },
    status: "soft",
  },
  {
    id: "bpifrance",
    name: { fr: "Bpifrance", en: "Bpifrance" },
    category: {
      fr: "Banque publique d'investissement",
      en: "Public investment bank",
    },
    amount: { fr: "400 K€", en: "€400K" },
    detail: { fr: "pondéré à 50 %", en: "weighted at 50%" },
    status: "discussion",
  },
  {
    id: "fonds-vc",
    name: { fr: "Fonds de capital-risque", en: "Venture capital fund" },
    category: { fr: "Capital-risque", en: "Venture capital" },
    amount: { fr: "200 K€", en: "€200K" },
    detail: { fr: "pondéré à 50 %", en: "weighted at 50%" },
    status: "discussion",
  },
];

const copy = {
  fr: {
    roundEyebrow: "01 · État de la levée",
    roundTitle: "Où en est le tour.",
    statuses: {
      committed: "Engagement ferme",
      soft: "Soft commitment",
      discussion: "En discussion",
    },
    listTitle: "Souscripteurs",
    redacted:
      "L'identité des souscripteurs est communiquée après réception d'une intention d'investissement. La catégorie et le montant, eux, sont affichés dès maintenant.",
    pending:
      "Libellés provisoires : la liste définitive des souscripteurs reste à confirmer côté équipe.",
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
    statuses: {
      committed: "Firm commitment",
      soft: "Soft commitment",
      discussion: "In discussion",
    },
    listTitle: "Subscribers",
    redacted:
      "Subscriber identities are disclosed once an investment intention has been received. Category and amount are shown from the outset.",
    pending:
      "Placeholder labels: the final subscriber list is still to be confirmed by the team.",
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
            {PARTICIPANTS.map((p) => (
              <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    {/* Le nom reste masqué : flouté et retiré de l'arbre
                        d'accessibilité, pour qu'il ne soit pas lu à voix haute
                        ni sélectionnable. */}
                    <span
                      aria-hidden
                      className="block select-none truncate text-sm font-medium blur-[5px]"
                    >
                      {p.name[locale]}
                    </span>
                    <span className="mt-1 block text-xs text-neutral-600">
                      {p.category[locale]}
                    </span>
                    {p.detail && (
                      <span className="mt-0.5 block text-[11px] text-neutral-400">
                        {p.detail[locale]}
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-sm font-medium tabular-nums text-neutral-700">
                      {p.amount[locale]}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        p.status === "committed"
                          ? "bg-salvia text-marsala"
                          : p.status === "soft"
                            ? "border border-foreground/15 bg-chalk text-neutral-600"
                            : "border border-brand/40 bg-brand/10 text-foreground"
                      }`}
                    >
                      {c.statuses[p.status]}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t border-foreground/10 pt-4 text-[11px] leading-4 text-neutral-500">
            {c.redacted}
          </p>
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
