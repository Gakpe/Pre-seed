import { CHAPTERS, SOURCES } from "@/lib/market-note";
import type { Locale } from "@/lib/i18n";
import { AfricaRatesMap } from "./africa-rates-map";
import { PrivateDebtLandscape } from "./private-debt-landscape";
import { NoteRail } from "./note-rail";

// Corps de la note de marché. Le rythme de la page tient à l'alternance des
// largeurs : prose en colonne étroite, visuels débordant du texte, et un seul
// bloc sombre d'un bord à l'autre de l'écran.
const serif = "font-[family-name:var(--font-serif)]";

// Copie de la note, dans les deux langues. Le corps vit ici plutôt qu'en base :
// c'est une note de recherche arrêtée mot à mot, pas de la prose éditable.
const copy = {
  fr: {
    readingTime:
      "Temps de lecture : 8 minutes · Document destiné à des investisseurs professionnels",
    c1: {
      statLabel: "Crédit au secteur privé, en % du PIB, Afrique subsaharienne",
      statValue: "~28 %",
      statBody:
        "Contre plus de 140 % en moyenne mondiale et près de 180 % en Asie de l'Est. Le rapport est de un à cinq.",
      p1: "Une économie où le crédit privé pèse moins d'un tiers du PIB n'est pas sous-bancarisée à la marge : l'essentiel de l'activité s'y finance sur fonds propres, sur la trésorerie, ou pas du tout.",
      p2: "Pour un investisseur, la conséquence est souvent mal comprise. Le manque de liquidité ne se voit pas à l'entrée, il se voit à la sortie.",
      stats: [
        { value: "81", label: "exits en 2025, second plus haut niveau historique" },
        { value: "5,9 ans", label: "durée de détention moyenne, la plus courte depuis 2018" },
        { value: "38 %", label: "des sorties réalisées auprès d'acheteurs industriels" },
        { value: "4", label: "introductions en bourse sur tout le continent en 2025" },
      ],
      source: "Source : AVCA, 2025.",
      p3: "Le marché des sorties s'améliore, mais il reste étroit et concentré : fenêtre boursière fermée hors d'Afrique du Sud, acheteurs industriels dominants, et 27 % des LPs qui déclarent vouloir ralentir leurs engagements, par doute sur la plomberie des sorties, non sur la classe d'actifs.",
      quote:
        "En equity, la performance est réelle mais la liquidité est otage de la sortie. En dette, le calendrier de retour est écrit dans le contrat.",
      p4: "L'argument est structurel : dans un marché où la sortie est le maillon faible, l'instrument qui n'en dépend pas prend mécaniquement de la valeur. La dette senior capte la surperformance de l'économie réelle africaine sans faire porter à l'investisseur le risque d'exécution d'un exit à cinq ou sept ans.",
    },
    c2: {
      p1: "La théorie des taux décrit ce qui devrait suivre : un différentiel de cette ampleur, à risque comparable, appelle un afflux de capitaux vers le marché le mieux rémunéré, jusqu'à ce que la concurrence entre prêteurs comprime l'écart. Le mécanisme a joué en Asie du Sud-Est dans les années 2000, en Amérique latine dans les années 2010.",
      p2: "Il n'a pas joué en Afrique. La question est de savoir pourquoi.",
      quote: "Ce n'est pas le prix du risque. C'est le prix de l'opacité.",
      p3: "Le prêteur international n'a pas les données qui lui permettraient de distinguer un bon dossier d'un mauvais : historiques fragmentaires, aucun reporting standardisé, aucun suivi à distance, aucune contrepartie locale à qui déléguer le recouvrement. Face à cette asymétrie, il ne tarife pas le risque, il l'évite, ou le surtarife massivement.",
      p4: "C'est un problème de confiance, pas de rendement. Et un problème de confiance se résout par de l'infrastructure, de la donnée, de la structuration contractuelle, du suivi. Pas par de la patience.",
    },
    c3: {
      s1Label: "Dette privée · 2025",
      s1Value: "+57 %",
      s1Body: "de croissance du nombre d'opérations de dette privée en Afrique, un record.",
      s2Label: "Venture debt · 2025",
      s2Value: "1,8 Md $",
      s2Body: "levés sur l'année, un quasi-doublement en douze mois.",
      s3Label: "Capital privé · 2025",
      s3Value: "5,1 Md $",
      s3Body: "investis sur 530 opérations, en hausse de 8 % malgré le ralentissement mondial.",
      source: "Source : AVCA, 2025.",
      p1: "Le mouvement a commencé. La dette est passée d'instrument d'appoint à composante centrale du financement, en particulier pour les entreprises en croissance qui cherchent à allonger leur horizon sans se diluer. Et pour 2026, les investisseurs déclarent augmenter leurs allocations à la dette privée, pour la visibilité de revenu, la protection à la baisse, et l'alignement avec des horizons de sortie qui s'allongent.",
      p2: "Les rendements se hiérarchisent proprement : private equity au-dessus de 16 %, mezzanine entre 12 et 16 %, dette senior entre 4 et 10 %, et une poche de dette senior sécurisée qui tient 12 à 14 % grâce aux garanties et aux protections contractuelles.",
      p3: "C'est dans cette dernière poche que se trouvent les acteurs qui nous ressemblent le plus, TLG Capital, Enko Capital, Cauris Finance. Elle est encore peu peuplée, et c'est précisément ce qui la rend intéressante.",
    },
    c4: {
      p1: "La place d'un acteur de référence est ouverte, et elle a une forme précise.",
      pt1Title: "Elle est panafricaine dès le premier jour.",
      pt1: "Un acteur mono-pays reste otage d'une banque centrale, d'une devise et d'un cycle politique. La diversification régionale n'est pas une ambition de croissance, c'est une condition de gestion du risque, et elle se décide à la structuration, pas trois ans plus tard.",
      pt2Title: "Elle est connectée aux marchés globaux.",
      pt2: "Le capital qui manque n'est pas sur le continent : il est chez des institutionnels européens, des fonds de dette et une diaspora professionnelle qui n'ont aujourd'hui aucun véhicule lisible pour s'exposer à ce rendement. Construire ce véhicule, c'est construire le pont.",
      pt3Title: "Elle est technologique, parce que le verrou est informationnel.",
      pt3: "Si l'écart de taux tient à l'opacité, l'avantage compétitif durable est du côté de celui qui produit l'information : scoring alimenté par la donnée locale, suivi continu, traçabilité vérifiable. C'est une infrastructure, pas une fonctionnalité.",
      p2: "Le marché compte aujourd'hui une trentaine d'acteurs sérieux, la plupart sous-dimensionnés par rapport à leur marché adressable. Dans un secteur où la sortie en bourse est fermée et où les acheteurs industriels dominent, la consolidation entre gestionnaires est la trajectoire naturelle, et elle offre aux LPs la liquidité que l'equity peine à leur fournir.",
      p3: "Nous nous positionnons dans cette configuration : construire un acteur assez structuré pour être un consolidateur crédible, et assez ouvert pour être un partenaire utile aux autres en attendant.",
    },
    sourcesTitle: "Sources et notes",
    toVerify: "À vérifier :",
  },

  en: {
    readingTime:
      "Reading time: 8 minutes · Document intended for professional investors",
    c1: {
      statLabel: "Credit to the private sector, as % of GDP, sub-Saharan Africa",
      statValue: "~28%",
      statBody:
        "Against more than 140% on the world average and close to 180% in East Asia. The ratio is one to five.",
      p1: "An economy where private credit weighs less than a third of GDP is not marginally under-banked: most of its activity is financed on equity, on cash flow, or not at all.",
      p2: "For an investor, the consequence is often misread. The lack of liquidity does not show on the way in, it shows on the way out.",
      stats: [
        { value: "81", label: "exits in 2025, the second highest level on record" },
        { value: "5.9 years", label: "average holding period, the shortest since 2018" },
        { value: "38%", label: "of exits completed with trade buyers" },
        { value: "4", label: "IPOs across the whole continent in 2025" },
      ],
      source: "Source: AVCA, 2025.",
      p3: "The exit market is improving, but it stays narrow and concentrated: the listing window is shut outside South Africa, trade buyers dominate, and 27% of LPs say they intend to slow their commitments, out of doubt about exit plumbing rather than about the asset class.",
      quote:
        "In equity, performance is real but liquidity is hostage to the exit. In debt, the repayment calendar is written into the contract.",
      p4: "The argument is structural: in a market where the exit is the weak link, the instrument that does not depend on it mechanically gains value. Senior debt captures the outperformance of the African real economy without making the investor carry the execution risk of an exit five or seven years out.",
    },
    c2: {
      p1: "Rate theory describes what should follow: a differential of that magnitude, at comparable risk, calls capital toward the better-paying market until competition between lenders compresses the spread. The mechanism played out in South-East Asia in the 2000s, and in Latin America in the 2010s.",
      p2: "It has not played out in Africa. The question is why.",
      quote: "This is not the price of risk. It is the price of opacity.",
      p3: "The international lender does not have the data that would let it tell a good file from a bad one: fragmentary track records, no standardised reporting, no remote monitoring, no local counterpart to delegate collection to. Faced with that asymmetry, it does not price risk, it avoids it, or overprices it massively.",
      p4: "This is a trust problem, not a yield problem. And a trust problem is solved with infrastructure, data, contractual structuring and monitoring. Not with patience.",
    },
    c3: {
      s1Label: "Private debt · 2025",
      s1Value: "+57%",
      s1Body: "growth in the number of private debt deals in Africa, a record.",
      s2Label: "Venture debt · 2025",
      s2Value: "US$1.8bn",
      s2Body: "raised over the year, close to a doubling in twelve months.",
      s3Label: "Private capital · 2025",
      s3Value: "US$5.1bn",
      s3Body: "invested across 530 deals, up 8% despite the global slowdown.",
      source: "Source: AVCA, 2025.",
      p1: "The shift has begun. Debt has moved from a secondary instrument to a core component of financing, particularly for growth companies looking to extend their horizon without diluting. And for 2026, investors say they are increasing their allocations to private debt, for income visibility, downside protection, and alignment with lengthening exit horizons.",
      p2: "Returns rank cleanly: private equity above 16%, mezzanine between 12 and 16%, senior debt between 4 and 10%, and a pocket of secured senior debt holding 12 to 14% thanks to guarantees and contractual protections.",
      p3: "It is in that last pocket that the players closest to us sit, TLG Capital, Enko Capital, Cauris Finance. It is still thinly populated, and that is precisely what makes it interesting.",
    },
    c4: {
      p1: "The seat of a reference player is open, and it has a precise shape.",
      pt1Title: "It is pan-African from day one.",
      pt1: "A single-country player stays hostage to one central bank, one currency and one political cycle. Regional diversification is not a growth ambition, it is a risk management condition, and it is decided at structuring, not three years later.",
      pt2Title: "It is connected to global markets.",
      pt2: "The missing capital is not on the continent: it sits with European institutions, debt funds and a professional diaspora who today have no legible vehicle to gain exposure to this yield. Building that vehicle is building the bridge.",
      pt3Title: "It is technological, because the lock is informational.",
      pt3: "If the rate gap comes from opacity, the durable competitive advantage lies with whoever produces the information: scoring fed by local data, continuous monitoring, verifiable traceability. That is infrastructure, not a feature.",
      p2: "The market today counts around thirty serious players, most of them undersized relative to their addressable market. In a sector where the listing exit is shut and trade buyers dominate, consolidation between managers is the natural trajectory, and it offers LPs the liquidity equity struggles to provide.",
      p3: "We position ourselves in that configuration: building a player structured enough to be a credible consolidator, and open enough to be a useful partner to the others in the meantime.",
    },
    sourcesTitle: "Sources and notes",
    toVerify: "To verify:",
  },
};


function Chapter({
  chapter,
  locale,
  children,
}: {
  chapter: (typeof CHAPTERS)[number];
  locale: Locale;
  children: React.ReactNode;
}) {
  const { id, num, title } = chapter;
  return (
    // scroll-mt : le fil d'Ariane amène le titre sous l'en-tête, pas dessous.
    <section id={id} className="mt-20 scroll-mt-24">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-note-accent">
        {num}
      </p>
      <h2 className={`${serif} mt-2 text-[27px] leading-tight tracking-tight`}>
        {title[locale]}
      </h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${serif} mt-6 text-[17px] leading-[1.75] text-note-ink`}>
      {children}
    </p>
  );
}

// Existe pour être vu avant d'être lu.
function BigStat({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-note-muted">
        {label}
      </p>
      <p
        className="mt-1 font-bold tabular-nums leading-none text-note-accent"
        style={{ fontSize: "clamp(58px, 8vw, 96px)" }}
      >
        {value}
      </p>
      <p className={`${serif} mt-3 text-[17px] leading-[1.75] text-note-ink`}>
        {children}
      </p>
    </div>
  );
}

// Notre thèse sortie du flux, ni guillemets ni italique : ce n'est pas une
// citation d'un tiers.
function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={`${serif} mt-10 border-l-[3px] border-note-accent pl-6 font-medium text-note-ink`}
      style={{ fontSize: "clamp(23px, 2.4vw, 31px)", lineHeight: 1.34 }}
    >
      {children}
    </p>
  );
}

function StatRow({
  stats,
}: {
  stats: { value: string; label: string }[];
}) {
  return (
    <dl className="mt-10 grid grid-cols-2 border-y border-note-border py-6 min-[780px]:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`px-4 py-3 min-[780px]:py-0 ${
            i % 2 === 1 ? "border-l border-note-border" : ""
          } ${i > 0 ? "min-[780px]:border-l min-[780px]:border-note-border" : "min-[780px]:border-l-0"}`}
        >
          <dd className="text-[38px] font-bold leading-none tabular-nums text-note-ink">
            {s.value}
          </dd>
          <dt className="mt-2 text-xs leading-5 text-note-muted">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

// Les visuels débordent de la colonne de lecture.
function Wide({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 w-[min(1120px,calc(100vw-3rem))] -translate-x-1/2">
      {children}
    </div>
  );
}

export function MarketNote({
  title,
  locale,
}: {
  title: string;
  locale: Locale;
}) {
  const c = copy[locale];
  return (
    <div>
      <NoteRail title={title} locale={locale} />
      <p className="mt-6 text-xs text-note-muted">{c.readingTime}</p>

      <Chapter chapter={CHAPTERS[0]} locale={locale}>
        <BigStat label={c.c1.statLabel} value={c.c1.statValue}>
          {c.c1.statBody}
          <Ref n={1} />
        </BigStat>

        <P>{c.c1.p1}</P>
        <P>{c.c1.p2}</P>

        <StatRow stats={c.c1.stats} />
        <p className="mt-3 text-xs text-note-muted">
          {c.c1.source}
          <Ref n={2} />
        </p>

        <P>{c.c1.p3}</P>
        <PullQuote>{c.c1.quote}</PullQuote>
        <P>{c.c1.p4}</P>
      </Chapter>

      <Chapter chapter={CHAPTERS[1]} locale={locale}>
        <AfricaRatesMap locale={locale} />

        <P>
          {c.c2.p1}
          <Ref n={4} />
        </P>
        <P>{c.c2.p2}</P>

        <PullQuote>{c.c2.quote}</PullQuote>

        <P>{c.c2.p3}</P>
        <P>{c.c2.p4}</P>
      </Chapter>

      <Chapter chapter={CHAPTERS[2]} locale={locale}>
        <div className="grid gap-8 min-[780px]:grid-cols-3">
          <SmallStat label={c.c3.s1Label} value={c.c3.s1Value}>
            {c.c3.s1Body}
          </SmallStat>
          <SmallStat label={c.c3.s2Label} value={c.c3.s2Value}>
            {c.c3.s2Body}
          </SmallStat>
          <SmallStat label={c.c3.s3Label} value={c.c3.s3Value}>
            {c.c3.s3Body}
          </SmallStat>
        </div>
        <p className="mt-3 text-xs text-note-muted">
          {c.c3.source}
          <Ref n={3} />
        </p>

        <P>{c.c3.p1}</P>

        <Wide>
          <PrivateDebtLandscape locale={locale} />
        </Wide>

        <P>
          {c.c3.p2}
          <Ref n={5} />
        </P>
        <P>{c.c3.p3}</P>
      </Chapter>

      <Chapter chapter={CHAPTERS[3]} locale={locale}>
        <P>{c.c4.p1}</P>

        <Point title={c.c4.pt1Title}>{c.c4.pt1}</Point>
        <Point title={c.c4.pt2Title}>{c.c4.pt2}</Point>
        <Point title={c.c4.pt3Title}>{c.c4.pt3}</Point>

        <P>{c.c4.p2}</P>
        <P>{c.c4.p3}</P>
      </Chapter>

      <section className="mt-20 border-t border-note-border pt-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-note-muted">
          {c.sourcesTitle}
        </h3>
        <ol className="mt-4 space-y-2.5">
          {SOURCES.map((s, i) => (
            <li key={s.text.fr} className="text-xs leading-5 text-note-muted">
              <span className="font-semibold tabular-nums">{i + 1}.</span>{" "}
              {s.text[locale]}
              {s.toVerify && (
                <>
                  {" "}
                  <span className="font-semibold text-note-accent">
                    {c.toVerify}
                  </span>{" "}
                  <span className="text-note-accent">{s.toVerify[locale]}</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function SmallStat({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-note-muted">
        {label}
      </p>
      <p className="mt-1 text-[42px] font-bold leading-none tabular-nums text-note-accent">
        {value}
      </p>
      <p className={`${serif} mt-2 text-[15px] leading-[1.6] text-note-ink`}>
        {children}
      </p>
    </div>
  );
}

function Point({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <h3 className={`${serif} text-[19px] font-semibold leading-snug`}>
        {title}
      </h3>
      <p className={`${serif} mt-2 text-[17px] leading-[1.75] text-note-ink`}>
        {children}
      </p>
    </div>
  );
}

// Renvoi vers la note de source correspondante.

function Ref({ n }: { n: number }) {
  return (
    <sup className="ml-0.5 font-sans text-[11px] font-semibold text-note-accent">
      {n}
    </sup>
  );
}
