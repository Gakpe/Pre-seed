import { CHAPTERS, SOURCES } from "@/lib/market-note";
import { AfricaRatesMap } from "./africa-rates-map";
import { PrivateDebtLandscape } from "./private-debt-landscape";
import { NoteRail } from "./note-rail";

// Corps de la note de marché. Le rythme de la page tient à l'alternance des
// largeurs : prose en colonne étroite, visuels débordant du texte, et un seul
// bloc sombre d'un bord à l'autre de l'écran.
const serif = "font-[family-name:var(--font-serif)]";

function Chapter({
  chapter,
  children,
}: {
  chapter: (typeof CHAPTERS)[number];
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
        {title}
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

export function MarketNote({ title }: { title: string }) {
  return (
    <div>
      <NoteRail title={title} />
      <p className="mt-6 text-xs text-note-muted">
        Temps de lecture : 8 minutes · Document destiné à des investisseurs
        professionnels
      </p>

      <Chapter chapter={CHAPTERS[0]}>
        <BigStat
          label="Crédit au secteur privé, en % du PIB, Afrique subsaharienne"
          value="~28 %"
        >
          Contre plus de 140 % en moyenne mondiale et près de 180 % en Asie de
          l&apos;Est. Le rapport est de un à cinq.<Ref n={1} />
        </BigStat>

        <P>
          Une économie où le crédit privé pèse moins d&apos;un tiers du PIB
          n&apos;est pas sous-bancarisée à la marge : l&apos;essentiel de
          l&apos;activité s&apos;y finance sur fonds propres, sur la trésorerie,
          ou pas du tout.
        </P>
        <P>
          Pour un investisseur, la conséquence est souvent mal comprise. Le
          manque de liquidité ne se voit pas à l&apos;entrée, il se voit à la
          sortie.
        </P>

        <StatRow
          stats={[
            { value: "81", label: "exits en 2025, second plus haut niveau historique" },
            { value: "5,9 ans", label: "durée de détention moyenne, la plus courte depuis 2018" },
            { value: "38 %", label: "des sorties réalisées auprès d'acheteurs industriels" },
            { value: "4", label: "introductions en bourse sur tout le continent en 2025" },
          ]}
        />
        <p className="mt-3 text-xs text-note-muted">
          Source : AVCA, 2025.<Ref n={2} />
        </p>

        <P>
          Le marché des sorties s&apos;améliore, mais il reste étroit et
          concentré : fenêtre boursière fermée hors d&apos;Afrique du Sud,
          acheteurs industriels dominants, et 27 % des LPs qui déclarent vouloir
          ralentir leurs engagements, par doute sur la plomberie des sorties,
          non sur la classe d&apos;actifs.
        </P>

        <PullQuote>
          En equity, la performance est réelle mais la liquidité est otage de la
          sortie. En dette, le calendrier de retour est écrit dans le contrat.
        </PullQuote>

        <P>
          L&apos;argument est structurel : dans un marché où la sortie est le
          maillon faible, l&apos;instrument qui n&apos;en dépend pas prend
          mécaniquement de la valeur. La dette senior capte la surperformance de
          l&apos;économie réelle africaine sans faire porter à
          l&apos;investisseur le risque d&apos;exécution d&apos;un exit à cinq ou
          sept ans.
        </P>
      </Chapter>

      <Chapter chapter={CHAPTERS[1]}>
        <AfricaRatesMap />

        <P>
          La théorie des taux décrit ce qui devrait suivre : un différentiel de
          cette ampleur, à risque comparable, appelle un afflux de capitaux vers
          le marché le mieux rémunéré, jusqu&apos;à ce que la concurrence entre
          prêteurs comprime l&apos;écart. Le mécanisme a joué en Asie du Sud-Est
          dans les années 2000, en Amérique latine dans les années 2010.<Ref n={4} />
        </P>
        <P>Il n&apos;a pas joué en Afrique. La question est de savoir pourquoi.</P>

        <PullQuote>
          Ce n&apos;est pas le prix du risque. C&apos;est le prix de
          l&apos;opacité.
        </PullQuote>

        <P>
          Le prêteur international n&apos;a pas les données qui lui permettraient
          de distinguer un bon dossier d&apos;un mauvais : historiques
          fragmentaires, aucun reporting standardisé, aucun suivi à distance,
          aucune contrepartie locale à qui déléguer le recouvrement. Face à cette
          asymétrie, il ne tarife pas le risque, il l&apos;évite, ou le
          surtarife massivement.
        </P>
        <P>
          C&apos;est un problème de confiance, pas de rendement. Et un problème
          de confiance se résout par de l&apos;infrastructure, de la donnée, de
          la structuration contractuelle, du suivi. Pas par de la patience.
        </P>
      </Chapter>

      <Chapter chapter={CHAPTERS[2]}>
        <div className="grid gap-8 min-[780px]:grid-cols-3">
          <SmallStat label="Dette privée · 2025" value="+57 %">
            de croissance du nombre d&apos;opérations de dette privée en Afrique, un record.
          </SmallStat>
          <SmallStat label="Venture debt · 2025" value="1,8 Md $">
            levés sur l&apos;année, un quasi-doublement en douze mois.
          </SmallStat>
          <SmallStat label="Capital privé · 2025" value="5,1 Md $">
            investis sur 530 opérations, en hausse de 8 % malgré le
            ralentissement mondial.
          </SmallStat>
        </div>
        <p className="mt-3 text-xs text-note-muted">
          Source : AVCA, 2025.<Ref n={3} />
        </p>

        <P>
          Le mouvement a commencé. La dette est passée d&apos;instrument
          d&apos;appoint à composante centrale du financement, en particulier
          pour les entreprises en croissance qui cherchent à allonger leur
          horizon sans se diluer. Et pour 2026, les investisseurs déclarent
          augmenter leurs allocations à la dette privée, pour la visibilité de
          revenu, la protection à la baisse, et l&apos;alignement avec des
          horizons de sortie qui s&apos;allongent.
        </P>

        <Wide>
          <PrivateDebtLandscape />
        </Wide>

        <P>
          Les rendements se hiérarchisent proprement : private equity au-dessus
          de 16 %, mezzanine entre 12 et 16 %, dette senior entre 4 et 10 %, et
          une poche de dette senior sécurisée qui tient 12 à 14 % grâce aux
          garanties et aux protections contractuelles.<Ref n={5} />
        </P>
        <P>
          C&apos;est dans cette dernière poche que se trouvent les acteurs qui
          nous ressemblent le plus, TLG Capital, Enko Capital, Cauris Finance.
          Elle est encore peu peuplée, et c&apos;est précisément ce qui la rend
          intéressante.
        </P>
      </Chapter>

      <Chapter chapter={CHAPTERS[3]}>
        <P>
          La place d&apos;un acteur de référence est ouverte, et elle a une forme
          précise.
        </P>

        <Point title="Elle est panafricaine dès le premier jour.">
          Un acteur mono-pays reste otage d&apos;une banque centrale, d&apos;une
          devise et d&apos;un cycle politique. La diversification régionale
          n&apos;est pas une ambition de croissance, c&apos;est une condition de
          gestion du risque, et elle se décide à la structuration, pas trois ans
          plus tard.
        </Point>
        <Point title="Elle est connectée aux marchés globaux.">
          Le capital qui manque n&apos;est pas sur le continent : il est chez des
          institutionnels européens, des fonds de dette et une diaspora
          professionnelle qui n&apos;ont aujourd&apos;hui aucun véhicule lisible
          pour s&apos;exposer à ce rendement. Construire ce véhicule, c&apos;est
          construire le pont.
        </Point>
        <Point title="Elle est technologique, parce que le verrou est informationnel.">
          Si l&apos;écart de taux tient à l&apos;opacité, l&apos;avantage
          compétitif durable est du côté de celui qui produit
          l&apos;information : scoring alimenté par la donnée locale, suivi
          continu, traçabilité vérifiable. C&apos;est une infrastructure, pas une
          fonctionnalité.
        </Point>

        <P>
          Le marché compte aujourd&apos;hui une trentaine d&apos;acteurs
          sérieux, la plupart sous-dimensionnés par rapport à leur marché
          adressable. Dans un secteur où la sortie en bourse est fermée et où les
          acheteurs industriels dominent, la consolidation entre gestionnaires
          est la trajectoire naturelle, et elle offre aux LPs la liquidité que
          l&apos;equity peine à leur fournir.
        </P>
        <P>
          Nous nous positionnons dans cette configuration : construire un acteur
          assez structuré pour être un consolidateur crédible, et assez ouvert
          pour être un partenaire utile aux autres en attendant.
        </P>
      </Chapter>

      <section className="mt-20 border-t border-note-border pt-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-note-muted">
          Sources et notes
        </h3>
        <ol className="mt-4 space-y-2.5">
          {SOURCES.map((s, i) => (
            <li key={s.text} className="text-xs leading-5 text-note-muted">
              <span className="font-semibold tabular-nums">{i + 1}.</span>{" "}
              {s.text}
              {s.toVerify && (
                <>
                  {" "}
                  <span className="font-semibold text-note-accent">
                    À vérifier :
                  </span>{" "}
                  <span className="text-note-accent">{s.toVerify}</span>
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
