import { CHAPTERS, SOURCES } from "@/lib/market-note";
import type { Locale } from "@/lib/i18n";
import { AfricaRatesMap } from "./africa-rates-map";
import { PrivateDebtLandscape } from "./private-debt-landscape";
import { NoteRail } from "./note-rail";

// Corps de la note de marché. Texte et visuels prennent la largeur de la fiche
// (max-w-5xl), comme les autres. Seule la carte des taux sort d'un bord à
// l'autre de l'écran : le fil d'Ariane passe alors en surbrillance.

// Copie de la note, dans les deux langues. Le corps vit ici plutôt qu'en base :
// c'est une note de recherche arrêtée mot à mot, pas de la prose éditable.
const copy = {
  fr: {
    // Chapô : il vivait en base, il est repris ici avec la note (le texte en
    // base reste pour la liste de la data room, voir `richOnly`).
    intro: [
      "L'Afrique est le continent où le capital est le plus rare et le plus cher. C'est aussi celui où l'on parle le plus d'equity.",
      "Dans cette note de marché, nous expliquons pourquoi nous pensons que l'opportunité des dix prochaines années se trouve davantage dans la dette privée structurée que dans l'equity, et pourquoi la fenêtre est ouverte maintenant.",
    ],
    readingTime: "Temps de lecture : 8 minutes.",
    c1: {
      statLabel: "Crédit au secteur privé, en % du PIB, Afrique subsaharienne",
      statValue: "~29\u00a0%",
      statBody:
        "Contre plus de 140\u00a0% en moyenne mondiale et près de 175\u00a0% en Asie de l'Est et Pacifique.\nLe rapport est de 1 à 5.",
      p1: "Dans une économie où le crédit privé pèse moins d'un tiers du PIB, parler de sous-bancarisation minimise le problème. Le déficit de crédit est structurel : l'essentiel de l'activité s'y finance sur fonds propres, sur la trésorerie, ou pas du tout.",
      p2: "Pour un investisseur sur le continent africain, la conséquence est souvent mal comprise. Le manque de liquidité ne se voit pas forcément à l'entrée d'une opération, où les projets à financer ne manquent pas. Il se voit plutôt à la sortie : pour céder sa participation, un investisseur en equity a besoin d'un acheteur, qui a souvent besoin de dette pour financer son rachat. Là où le crédit est rare, peu de repreneurs en ont les moyens, et la bourse reste une porte étroite hors d'Afrique du Sud.",
      stats: [
        { value: "81", label: "exits en 2025, second plus haut niveau historique" },
        { value: "5,9\u00a0ans", label: "durée de détention moyenne, la plus courte depuis 2018" },
        { value: "38\u00a0%", label: "des sorties réalisées auprès d'acheteurs industriels" },
        { value: "4", label: "introductions en bourse sur tout le continent en 2025" },
      ],
      source: "Source : AVCA, 2025.",
      p3: "Le marché des sorties s'améliore, mais il reste étroit : hors d'Afrique du Sud, la bourse ne joue presque aucun rôle, et quelques acheteurs industriels dictent le calendrier. Les LPs le mesurent : 27\u00a0% d'entre eux déclarent vouloir ralentir leurs engagements, inquiets de la mécanique des sorties plus que de la classe d'actifs.",
      quote:
        "En equity, la performance est réelle mais la liquidité dépend de la sortie. En dette, l'échéancier de remboursement est écrit dans le contrat.",
      p4: "L'argument est structurel. Un investisseur en equity dépend d'un acheteur pour récupérer son capital ; un prêteur est remboursé par les flux de l'emprunteur, selon un échéancier fixé à la signature. Dans un marché où la sortie est le maillon faible, la dette senior donne accès à la croissance de l'économie réelle africaine sans le risque d'un exit à cinq ou sept ans.",
    },
    c2: {
      p1: "En théorie économique, des taux élevés devraient, à risque comparable, attirer les capitaux vers le marché le mieux rémunéré. Les prêteurs se font alors concurrence, et les écarts se referment. Ce mécanisme a fonctionné en Asie du Sud-Est dans les années 2000, puis en Amérique latine dans les années 2010.",
      p2: "Force est de constater qu'il ne fonctionne pas en Afrique : les taux restent élevés alors que les capitaux en quête de rendement ne manquent pas. La question est de savoir pourquoi.",
      quote: "Ces taux paient l'opacité bien plus que le risque.",
      p3: "Le prêteur international n'a pas les données qui lui permettraient de distinguer un bon dossier d'un mauvais : historiques fragmentaires, reporting rarement standardisé, peu de suivi à distance, et pas de contrepartie locale à qui déléguer le recouvrement. Face à cette asymétrie, il préfère éviter le dossier, ou le surtarifer largement, plutôt que d'évaluer son risque réel. Le bon emprunteur paie alors pour le mauvais.",
      p4: "Le frein est la confiance. Un rendement plus élevé ne la crée pas ; elle se construit avec de l'infrastructure : de la donnée fiable, des contrats qui protègent le prêteur et un suivi continu des opérations. Le temps seul ne fera pas avancer ce chantier.",
    },
    c3: {
      s1Label: "Dette privée, 2025",
      s1Value: "+57\u00a0%",
      s1Body: "de croissance du nombre d'opérations de dette privée en Afrique, un record.",
      s2Label: "Venture debt, 2025",
      s2Value: "1,8\u00a0Md $",
      s2Body: "levés sur l'année, un quasi-doublement en douze mois.",
      s3Label: "Capital privé, 2025",
      s3Value: "5,1\u00a0Md $",
      s3Body: "investis sur 530 opérations, en hausse de 8\u00a0% malgré le ralentissement mondial.",
      source: "Source : AVCA, 2025.",
      p1: "Le mouvement a commencé. Longtemps utilisée en appoint, la dette est devenue une composante centrale du financement sur le continent, en particulier pour les entreprises en croissance qui veulent financer leur développement sans diluer leurs actionnaires. Les investisseurs suivent : pour 2026, ils déclarent augmenter leurs allocations à la dette privée. Ils y cherchent la visibilité des revenus, une protection en cas de baisse, et un instrument compatible avec des sorties de plus en plus tardives.",
      p2: "Les rendements cibles suivent le rang de chaque instrument dans la structure : plus de 16\u00a0% en private equity, 12 à 16\u00a0% en mezzanine, 4 à 10\u00a0% en dette senior. Une poche fait exception : la dette senior sécurisée vise 12 à 14\u00a0%, grâce aux garanties et aux protections contractuelles qui l'encadrent.",
      p3: "C'est dans cette poche que se trouvent les acteurs les plus proches de notre modèle : TLG Capital, Enko Capital et Cauris Finance. Elle compte encore peu d'acteurs, ce qui laisse de la place à un nouvel entrant.",
    },
    c4: {
      p1: "Il n'existe pas encore d'acteur de référence sur ce segment.\nCelui qui s'imposera réunira, selon nous, trois caractéristiques.",
      pt1Title: "C'est un acteur [panafricain dès le premier jour].",
      pt1: "Un acteur présent dans un seul pays dépend d'une seule banque centrale, d'une seule devise et d'un seul cycle politique. Répartir le portefeuille entre plusieurs régions limite ce risque, à condition de le prévoir dès la structuration des véhicules plutôt que de l'ajouter après coup.",
      pt2Title: "C'est un acteur [connecté aux marchés internationaux].",
      pt2: "Le capital ne manque pas, ni sur le continent ni à l'extérieur. L'épargne africaine est abondante mais reste peu investie, faute de véhicule qui la mette au service de ce rendement. À l'international, institutionnels européens, fonds de dette et diaspora qualifiée cherchent aussi un véhicule lisible pour s'exposer au continent. Le premier acteur à proposer ce véhicule fera le lien entre les deux.",
      pt3Title: "C'est un acteur [qui repose sur la technologie, parce que le frein est l'information].",
      pt3: "Si l'écart de taux tient à l'opacité, l'avantage durable revient à celui qui produit l'information : un scoring alimenté par la donnée locale, un suivi continu des opérations et une traçabilité que l'investisseur peut vérifier. Cette capacité se construit sur plusieurs années, et se copie difficilement.",
      p2: "Le marché compte aujourd'hui une trentaine d'acteurs sérieux, pour la plupart trop petits au regard du marché qu'ils adressent. Comme la sortie en bourse est fermée et que les acheteurs industriels dominent, les gestionnaires devraient se regrouper. Cette consolidation offrirait aussi aux LPs une liquidité que l'equity leur fournit mal.",
      p3: "Minah veut être cet acteur. C'est l'objet de la levée en cours : réunir dès maintenant les moyens de construire une plateforme panafricaine, connectée aux capitaux internationaux et fondée sur la donnée, en mesure de mener la consolidation du secteur.",
    },
    sourcesTitle: "Sources et notes",
    backToText: "Revenir au texte",
    toVerify: "À vérifier :",
  },

  en: {
    intro: [
      "Africa is the continent where capital is scarcest and most expensive. It is also the one where equity is discussed the most.",
      "In this market note, we explain why we believe the opportunity of the next ten years lies more in structured private debt than in equity, and why the window is open now.",
    ],
    readingTime: "Reading time: 8 minutes.",
    c1: {
      statLabel: "Credit to the private sector, as % of GDP, sub-Saharan Africa",
      statValue: "~29%",
      statBody:
        "Against more than 140% on the world average and close to 175% in East Asia and the Pacific.\nThe ratio is 1 to 5.",
      p1: "In an economy where private credit weighs less than a third of GDP, calling it under-banked understates the problem. The credit shortfall is structural: most activity is financed on equity, on cash flow, or not at all.",
      p2: "For an investor on the African continent, the consequence is often misread. The lack of liquidity does not necessarily show on the way into a deal, where there is no shortage of projects to finance. It shows rather on the way out: to sell a stake, an equity investor needs a buyer, who often needs debt to fund the acquisition. Where credit is scarce, few buyers can afford it, and the stock market remains a narrow door outside South Africa.",
      stats: [
        { value: "81", label: "exits in 2025, the second highest level on record" },
        { value: "5.9 years", label: "average holding period, the shortest since 2018" },
        { value: "38%", label: "of exits completed with trade buyers" },
        { value: "4", label: "IPOs across the whole continent in 2025" },
      ],
      source: "Source: AVCA, 2025.",
      p3: "The exit market is improving, but it stays narrow: outside South Africa, the stock market plays almost no role, and a handful of trade buyers set the timetable. LPs have taken note: 27% of them say they intend to slow their commitments, worried about how exits work more than about the asset class.",
      quote:
        "In equity, performance is real but liquidity depends on the exit. In debt, the repayment schedule is written into the contract.",
      p4: "The argument is structural. An equity investor depends on a buyer to get their capital back; a lender is repaid from the borrower's cash flows, on a schedule set at signing. In a market where the exit is the weak link, senior debt gives access to the growth of the African real economy without the risk of an exit five or seven years out.",
    },
    c2: {
      p1: "In economic theory, high rates should, at comparable risk, draw capital toward the better-paying market. Lenders then compete with one another, and the spreads close. This mechanism worked in South-East Asia in the 2000s, then in Latin America in the 2010s.",
      p2: "It clearly does not work in Africa: rates stay high even though capital in search of yield is not in short supply. The question is why.",
      quote: "These rates pay for opacity far more than for risk.",
      p3: "The international lender does not have the data that would let it tell a good file from a bad one: fragmentary track records, rarely standardised reporting, little remote monitoring, and no local counterpart to delegate collection to. Faced with that asymmetry, it prefers to avoid the file, or overprice it heavily, rather than assess its actual risk. The good borrower then pays for the bad one.",
      p4: "The obstacle is trust. A higher yield does not create it; it is built with infrastructure: reliable data, contracts that protect the lender and continuous monitoring of operations. Time alone will not move this work forward.",
    },
    c3: {
      s1Label: "Private debt, 2025",
      s1Value: "+57%",
      s1Body: "growth in the number of private debt deals in Africa, a record.",
      s2Label: "Venture debt, 2025",
      s2Value: "US$1.8bn",
      s2Body: "raised over the year, close to a doubling in twelve months.",
      s3Label: "Private capital, 2025",
      s3Value: "US$5.1bn",
      s3Body: "invested across 530 deals, up 8% despite the global slowdown.",
      source: "Source: AVCA, 2025.",
      p1: "The shift has begun. Long used as a supplement, debt has become a central component of financing on the continent, especially for growth companies that want to fund their development without diluting their shareholders. Investors are following: for 2026, they say they are increasing their allocations to private debt. They look for revenue visibility, downside protection, and an instrument that fits exits coming later and later.",
      p2: "Target returns follow each instrument's rank in the capital structure: above 16% in private equity, 12 to 16% in mezzanine, 4 to 10% in senior debt. One pocket stands out: secured senior debt targets 12 to 14%, thanks to the guarantees and contractual protections around it.",
      p3: "This pocket is where the players closest to our model sit: TLG Capital, Enko Capital and Cauris Finance. It still counts few players, which leaves room for a new entrant.",
    },
    c4: {
      p1: "There is not yet a reference player in this segment.\nWhoever establishes themselves will, in our view, combine three characteristics.",
      pt1Title: "A player [that is pan-African from day one].",
      pt1: "A player present in a single country depends on one central bank, one currency and one political cycle. Spreading the portfolio across several regions limits that risk, provided it is planned when the vehicles are structured rather than added afterwards.",
      pt2Title: "A player [connected to international markets].",
      pt2: "Capital is not in short supply, on the continent or beyond it. African savings are abundant but remain little invested, for lack of a vehicle to put them to work at this yield. Internationally, European institutions, debt funds and a qualified diaspora are also looking for a legible vehicle to gain exposure to the continent. The first player to offer that vehicle will connect the two.",
      pt3Title: "A player [built on technology, because the obstacle is information].",
      pt3: "If the rate gap comes from opacity, the durable advantage goes to whoever produces the information: scoring fed by local data, continuous monitoring of operations and traceability the investor can verify. That capability takes several years to build, and is hard to copy.",
      p2: "The market today counts around thirty serious players, most of them too small for the market they address. With the listing exit shut and trade buyers dominant, managers are likely to consolidate. That consolidation would also give LPs a liquidity that equity provides poorly.",
      p3: "Minah intends to be that player. That is the purpose of the current round: to put in place, now, the means to build a pan-African platform, connected to international capital and grounded in data, able to lead the consolidation of the sector.",
    },
    sourcesTitle: "Sources and notes",
    backToText: "Back to the text",
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
      <h2 className="flex items-center gap-3 text-2xl font-semibold leading-tight tracking-tight">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 font-mono text-sm font-semibold text-marsala">
          {num}
        </span>
        {title[locale]}
      </h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.8] text-neutral-700">
      {children}
    </p>
  );
}

// Existe pour être vu avant d'être lu. Centré entre deux filets courts.
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
    <div className="mt-10 text-center">
      <span aria-hidden className="mx-auto block h-px w-2/3 bg-note-border-strong" />
      <p className="mt-8 text-sm font-semibold">{label}</p>
      <p
        className="mt-2 font-bold tabular-nums leading-none text-note-accent"
        style={{ fontSize: "clamp(58px, 8vw, 96px)" }}
      >
        {value}
      </p>
      <p className="mx-auto mt-3 max-w-2xl whitespace-pre-line text-[15px] leading-[1.8] text-neutral-700">
        {children}
      </p>
      <span aria-hidden className="mx-auto mt-8 block h-px w-2/3 bg-note-border-strong" />
    </div>
  );
}

// Notre thèse sortie du flux, dans la même carte que les citations de
// « Pourquoi Minah » : guillemets orange dans la ligne, insécables.
function PullQuote({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <blockquote className="mt-10 rounded-xl border border-foreground/10 bg-white/60 px-7 py-6 text-center text-xl font-semibold leading-snug tracking-tight text-foreground">
      <span className="text-brand">{locale === "fr" ? "«\u00a0" : "“"}</span>
      {children}
      <span className="text-brand">{locale === "fr" ? "\u00a0»" : "”"}</span>
    </blockquote>
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

      <div className="mt-6 rounded-xl border border-foreground/10 bg-white/60 px-6 py-6">
        {c.intro.map((para, i) => (
          <p
            key={i}
            className={`text-[15px] leading-[1.8] text-neutral-700 ${i ? "mt-4" : ""}`}
          >
            {para}
          </p>
        ))}
        <p className="mt-5 text-xs italic text-neutral-500">{c.readingTime}</p>
      </div>

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
        <PullQuote locale={locale}>{c.c1.quote}</PullQuote>
        <P>{c.c1.p4}</P>
      </Chapter>

      <Chapter chapter={CHAPTERS[1]} locale={locale}>
        <AfricaRatesMap locale={locale} />

        <P>
          {c.c2.p1}
          <Ref n={4} />
        </P>
        <P>{c.c2.p2}</P>

        <PullQuote locale={locale}>{c.c2.quote}</PullQuote>

        <P>{c.c2.p3}</P>
        <P>{c.c2.p4}</P>
      </Chapter>

      <Chapter chapter={CHAPTERS[2]} locale={locale}>
        {/* Même bandeau fileté que les chiffres de sortie du chapitre 1. */}
        <div className="mt-10 grid gap-y-6 border-y border-note-border py-7 min-[780px]:grid-cols-3">
          <SmallStat label={c.c3.s1Label} value={c.c3.s1Value}>
            {c.c3.s1Body}
          </SmallStat>
          <SmallStat label={c.c3.s2Label} value={c.c3.s2Value} divided>
            {c.c3.s2Body}
          </SmallStat>
          <SmallStat label={c.c3.s3Label} value={c.c3.s3Value} divided>
            {c.c3.s3Body}
          </SmallStat>
        </div>
        <p className="mt-3 text-xs text-note-muted">
          {c.c3.source}
          <Ref n={3} />
        </p>

        <P>{c.c3.p1}</P>

        <PrivateDebtLandscape locale={locale} />

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

      <section className="mt-20 border-t border-note-border pt-6 italic">
        <h3 className="text-sm font-semibold">{c.sourcesTitle}</h3>
        <ol className="mt-4 space-y-2.5">
          {SOURCES.map((s, i) => (
            <li
              key={s.text.fr}
              id={`source-${i + 1}`}
              className="scroll-mt-28 rounded text-xs leading-5 text-note-muted target:bg-note-accent/10 target:text-foreground"
            >
              <a
                href={`#ref-${i + 1}`}
                aria-label={c.backToText}
                title={c.backToText}
                className="font-semibold tabular-nums hover:underline"
              >
                {i + 1}. ↑
              </a>{" "}
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
  divided,
  children,
}: {
  label: string;
  value: string;
  divided?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`min-[780px]:px-6 min-[780px]:first:pl-0 ${
        divided ? "min-[780px]:border-l min-[780px]:border-note-border" : ""
      }`}
    >
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 text-[42px] font-bold leading-none tabular-nums text-note-accent">
        {value}
      </p>
      <p className="mt-2 text-sm leading-[1.7] text-neutral-700">
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
      <h3 className="text-base font-semibold leading-snug">
        {/* La partie entre crochets passe en orange : les trois titres
            répètent « C'est un acteur », seule leur fin change. */}
        {title.split(/\[([^\]]+)\]/).map((part, i) =>
          i % 2 ? (
            <span key={i} className="text-note-accent">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </h3>
      <p className="mt-2 text-[15px] leading-[1.8] text-neutral-700">
        {children}
      </p>
    </div>
  );
}

// Renvoi vers la note de source correspondante : un clic descend à la source,
// et la source renvoie à l'appel. Chaque numéro n'est appelé qu'une fois dans
// la note, d'où des identifiants uniques.
function Ref({ n }: { n: number }) {
  return (
    <sup id={`ref-${n}`} className="ml-0.5 scroll-mt-28 font-sans text-[11px] font-semibold">
      <a
        href={`#source-${n}`}
        aria-label={`Source ${n}`}
        className="rounded px-0.5 text-note-accent underline decoration-note-accent/30 underline-offset-2 transition-colors hover:decoration-note-accent"
      >
        {n}
      </a>
    </sup>
  );
}
