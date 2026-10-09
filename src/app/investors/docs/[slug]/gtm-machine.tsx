"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { SectionTitle } from "./section-title";

// Fiche « Go-to-market, aperçu » (niveau 1), portée entièrement par ce
// composant (richOnly) : le chapô vit ici, pas en base, puisque la base est la
// production. Le chapô, avec à sa droite les deux fondateurs qui portent
// chacun un côté du réseau, puis la slide « A machine that turns relationships into
// volume » du deck, rendue interactive.
//
// Survoler (ou toucher) un côté, une ligne ou le moteur fait entrer son
// détail au centre, avec les logos et les sites des acteurs. Toutes les
// variantes du centre sont empilées dans la même cellule de grille, seule
// l'active visible : la hauteur ne bouge pas sous la souris (AGENTS.md,
// « Détails qui ont déjà mordu »).
//
// Logos et portraits des Network Builders : découpés dans la slide
// (public/brand/gtm/slide), faute de fichiers source. Les Network Builders
// restent anonymes, comme sur la slide. Atlantic Financials n'a pas de lien :
// atlanticfinancials.com est un domaine parqué, à vérifier avec l'équipe.

type Logo = { src: string; alt: string; name?: string; href?: string };
type Row = {
  id: string;
  title: string;
  logos: Logo[];
  portraits?: boolean;
  fig: string;
  figLabel: string;
  detail: string;
};
type Side = {
  id: string;
  label: string;
  sub: string;
  fig: string;
  figLabel: string;
  detail: string;
  rows: Row[];
};
type Founder = { name: string; photo: string; focus: string };

const L = (file: string, alt: string, href?: string, name = alt): Logo => ({
  src: `/brand/gtm/slide/${file}.png`,
  alt,
  name,
  href,
});

const PORTRAITS = [1, 2, 3].map((i) => L(`nb${i}`, ""));
const INSTITUTIONS = [
  L("atlantic", "Atlantic Financials"),
  L("wef", "World Economic Forum", "https://www.weforum.org"),
  L("worldbank", "The World Bank", "https://www.worldbank.org"),
];
const CHAIN = [
  L("stellar", "Stellar", "https://stellar.org"),
  L("canton", "Canton Network", "https://www.canton.network"),
  L("ubuntu", "Ubuntu Tribe", "https://utribe.one"),
];
const SCALEUPS = [
  L("yango", "Yango", "https://yango.com"),
  L("wave", "Wave", "https://www.wave.com"),
  L("caterpillar", "Caterpillar", "https://www.cat.com"),
];
const FUNDS = [
  L("aeg", "Africa Equity Group", "https://africaequitygroup.com"),
  L("tlg", "TLG Capital", "https://www.tlgcapital.com"),
  L("enko", "Enko Capital", "https://enkocapital.com"),
];

const copy: Record<
  Locale,
  {
    lead: string[];
    foundersLabel: string;
    founders: Founder[];
    title: string;
    engineSub: string;
    engineKicker: string;
    engineTitle: string;
    engineDetail: string;
    loop: string;
    capital: Side;
    assets: Side;
    level2: string;
  }
> = {
  fr: {
    lead: [
      "Minah repose sur un réseau. En six ans de carrière, les deux fondateurs ont tissé des relations des deux côtés de chaque deal : le capital qui finance, et les entreprises, les fonds et les États qui génèrent les meilleurs sous-jacents en Afrique. Nous en avons fait une **machine à réseau**, que chaque nouvelle stratégie met au travail.",
    ],
    foundersLabel: "Les deux réseaux",
    founders: [
      {
        name: "Julien Gakpé",
        photo: "/brand/gtm/slide/founder-julien.jpg",
        focus: "Institutionnels et blockchain",
      },
      {
        name: "Coralie Lolliot",
        photo: "/brand/gtm/slide/founder-coralie.jpg",
        focus: "Secteur public, investisseurs, corporates et scale-ups africaines",
      },
    ],
    title: "Une machine qui transforme les relations en volume",
    engineSub: "Moteur de structuration",
    engineKicker: "Au centre",
    engineTitle: "Minah, une fintech de structuration",
    engineDetail:
      "Notre rôle dans la machine, c'est la versatilité. Minah se branche sur des sources de capital très différentes, particuliers fortunés, fonds institutionnels, liquidité on-chain, et structure pour chacune des deals à sa mesure : coupon, protections, maturité. Émis sur la blockchain, ces deals deviennent liquides, là où la dette privée africaine reste d'ordinaire bloquée jusqu'à l'échéance.",
    loop: "Un processus en boucle fermée : chaque deal recrute l'investisseur suivant.",
    capital: {
      id: "capital",
      label: "Capital-in",
      sub: "qui apporte les investisseurs",
      fig: "100 M€",
      figLabel: "de capital-in d'ici 2028",
      detail:
        "Trois canaux amènent les investisseurs, du particulier fortuné à la ligne institutionnelle : un réseau d'apporteurs, les institutions et brokers rencontrés aux grandes tables du continent, et la liquidité on-chain.",
      rows: [
        {
          id: "network",
          title: "+15 Network Builders",
          logos: PORTRAITS,
          portraits: true,
          fig: "+10",
          figLabel: "introductions qualifiées",
          detail:
            "Brokers, banquiers privés, asset managers : un réseau choisi d'apporteurs qui nous présentent des investisseurs qualifiés, en direct, sans prospection de masse. Quinze à ce jour, dix investisseurs déjà introduits, d'autres présentations en cours.",
        },
        {
          id: "institutions",
          title: "Institutions & brokers",
          logos: INSTITUTIONS,
          fig: "+5 M€",
          figLabel: "en discussion",
          detail:
            "Nous sommes invités là où se concentre le capital : World Economic Forum à Davos, Africa CEO Forum, Africa Financial Industry Summit. C'est à l'une de ces tables, au Qatar, qu'un fonds américain nous a rejoints pour co-structurer Kupanda. Des discussions sont aussi en cours avec des brokers, pour placer nos stratégies auprès de leurs clients institutionnels.",
        },
        {
          id: "chain",
          title: "Écosystème blockchain",
          logos: CHAIN,
          fig: "+4 M€",
          figLabel: "en discussion",
          detail:
            "Près de 30 Md$ d'actifs réels sont tokenisés, dont environ 17 Md$ de crédit privé, et presque rien n'est adossé à des sous-jacents africains. Notre ambition : devenir le canal qui amène cette liquidité on-chain vers les sous-jacents africains. Nous construisons ce pont avec la Stellar Foundation, qui nous subventionne déjà, Canton Network et Ubuntu Tribe.",
        },
      ],
    },
    assets: {
      id: "assets",
      label: "Assets-out / sell-side",
      sub: "qui apporte les deals",
      fig: "80 M€",
      figLabel: "d'assets-out, pipeline actif",
      detail:
        "Les deals viennent de contreparties aux flux de trésorerie réguliers : scale-ups et grands groupes, États et banques, fonds de crédit privé partenaires. Le réseau qui amène le capital ouvre aussi l'accès à ces sous-jacents.",
      rows: [
        {
          id: "scaleups",
          title: "Scale-ups & grands groupes",
          logos: SCALEUPS,
          fig: "+5",
          figLabel: "en négociation",
          detail:
            "Une dizaine de scale-ups et futures licornes africaines, et de grands opérateurs présents sur le continent. Wave pèse environ 38 % de la valeur des paiements mobiles de l'UEMOA, Yango opère dans plus de treize pays africains, Caterpillar est présent sur tout le continent.",
        },
        {
          id: "states",
          title: "États & banques",
          logos: [
            L("zambia", "Armoiries de la Zambie", "https://www.sh.gov.zm", "Zambie"),
            L("kenya", "Armoiries du Kenya", "https://www.president.go.ke", "Kenya"),
            L("civ", "Armoiries de la Côte d'Ivoire", "https://www.presidence.ci", "Côte d'Ivoire"),
          ],
          fig: "+350",
          figLabel: "CEO et ministres",
          detail:
            "Plus de 350 dirigeants et ministres dans notre réseau direct, et l'accès à une trentaine de cabinets présidentiels, qui nous orientent vers des sous-jacents stratégiques. Kupanda finance ainsi des PME titulaires de marchés publics.",
        },
        {
          id: "funds",
          title: "Fonds de private credit partenaires",
          logos: FUNDS,
          fig: "+20",
          figLabel: "deals qualifiés",
          detail:
            "Des fonds de crédit privé actifs sur le continent nous apportent des dossiers déjà qualifiés, que Minah structure et distribue à ses investisseurs.",
        },
      ],
    },
    level2:
      "Une fois votre intérêt manifesté, le niveau 2 ouvre notre roadmap écosystème : l'ordre dans lequel nous activons ce réseau, et la structure qui le transforme en volume, étape par étape. Le réseau, nous l'avons déjà ; la roadmap montre comment nous l'adressons pour atteindre 100 M€ de capital-in d'ici 2028.",
  },
  en: {
    lead: [
      "Minah is built on a network. Over six years of careers, the two founders have built relationships on both sides of every deal: the capital that funds, and the companies, funds and States that generate the best underlyings in Africa. We have turned this into a **relationship machine**, which every new strategy puts to work.",
    ],
    foundersLabel: "The two networks",
    founders: [
      {
        name: "Julien Gakpé",
        photo: "/brand/gtm/slide/founder-julien.jpg",
        focus: "Institutions and blockchain",
      },
      {
        name: "Coralie Lolliot",
        photo: "/brand/gtm/slide/founder-coralie.jpg",
        focus: "Public sector, investors, corporates and African scale-ups",
      },
    ],
    title: "A machine that turns relationships into volume",
    engineSub: "Structuring engine",
    engineKicker: "At the centre",
    engineTitle: "Minah, a structuring fintech",
    engineDetail:
      "Our role in the machine is versatility. Minah plugs into very different sources of capital, wealthy individuals, institutional funds, on-chain liquidity, and structures deals to fit each one: coupon, protections, maturity. Issued on-chain, these deals become liquid, where African private debt usually stays locked until maturity.",
    loop: "A closed-loop process: every deal recruits the next investor.",
    capital: {
      id: "capital",
      label: "Capital-in",
      sub: "who brings the investors",
      fig: "€100M",
      figLabel: "capital-in by 2028",
      detail:
        "Three channels bring in investors, from the wealthy individual to the institutional line: a network of introducers, the institutions and brokers met at the continent's key tables, and on-chain liquidity.",
      rows: [
        {
          id: "network",
          title: "+15 Network Builders",
          logos: PORTRAITS,
          portraits: true,
          fig: "+10",
          figLabel: "qualified introductions",
          detail:
            "Brokers, private bankers, asset managers: a curated network of introducers who put qualified investors in front of us directly, with no mass prospecting. Fifteen so far, ten investors already introduced, more introductions underway.",
        },
        {
          id: "institutions",
          title: "Institutions & brokers",
          logos: INSTITUTIONS,
          fig: "+€5M",
          figLabel: "in discussion",
          detail:
            "We are invited where capital concentrates: the World Economic Forum in Davos, the Africa CEO Forum, the Africa Financial Industry Summit. It was at one of these tables, in Qatar, that an American fund joined us to co-structure Kupanda. Discussions are also underway with brokers, to place our strategies with their institutional clients.",
        },
        {
          id: "chain",
          title: "Blockchain ecosystem",
          logos: CHAIN,
          fig: "+€4M",
          figLabel: "in discussion",
          detail:
            "Close to $30B of real-world assets are tokenized, of which about $17B is private credit, and almost none is backed by African underlyings. Our ambition is to become the channel that brings this on-chain liquidity to African underlyings. We are building that bridge with the Stellar Foundation, which already backs us with grants, Canton Network and Ubuntu Tribe.",
        },
      ],
    },
    assets: {
      id: "assets",
      label: "Assets-out / sell-side",
      sub: "who brings the deals",
      fig: "€80M",
      figLabel: "assets-out, live pipeline",
      detail:
        "Deals come from counterparties with steady cash flows: scale-ups and large groups, governments and banks, partner private credit funds. The network that brings in capital also opens access to these underlyings.",
      rows: [
        {
          id: "scaleups",
          title: "Top scale-ups & companies",
          logos: SCALEUPS,
          fig: "+5",
          figLabel: "in negotiation",
          detail:
            "Around ten African scale-ups and future unicorns, and major operators present on the continent. Wave carries about 38% of WAEMU mobile-money value, Yango operates in more than thirteen African countries, Caterpillar is present across the continent.",
        },
        {
          id: "states",
          title: "Governments & banks",
          logos: [
            L("zambia", "Coat of arms of Zambia", "https://www.sh.gov.zm", "Zambia"),
            L("kenya", "Coat of arms of Kenya", "https://www.president.go.ke", "Kenya"),
            L("civ", "Coat of arms of Côte d'Ivoire", "https://www.presidence.ci", "Côte d'Ivoire"),
          ],
          fig: "+350",
          figLabel: "CEOs and ministers",
          detail:
            "More than 350 business leaders and ministers in our direct network, and access to some thirty presidential offices, which point us toward strategic underlyings. This is how Kupanda funds SMEs holding public contracts.",
        },
        {
          id: "funds",
          title: "Partner private credit funds",
          logos: FUNDS,
          fig: "+20",
          figLabel: "qualified deals",
          detail:
            "Private credit funds active on the continent bring us already-qualified deals, which Minah structures and distributes to its investors.",
        },
      ],
    },
    level2:
      "Once you have expressed interest, level 2 opens our ecosystem roadmap: the order in which we activate this network, and the structure that turns it into volume, step by step. The network is already there; the roadmap shows how we work it to reach €100M of capital-in by 2028.",
  },
};

const BODY = "text-[15px] leading-[1.8] text-neutral-700";
const ENGINE = "minah";

type Detail = {
  key: string;
  right: boolean;
  kicker: string;
  title: string;
  detail: string;
  logos: Logo[];
  portraits?: boolean;
};

const arrow = (s: Side) => (s.id === "assets" ? `${s.label} →` : `← ${s.label}`);

// Le **gras** du chapô, comme dans les contenus de la base.
function bold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

export function GtmMachine({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [active, setActive] = useState<string | null>(null);
  // Un détail déjà ouvert ne cède la place qu'après un court arrêt sur un autre
  // élément : en allant en diagonale d'une ligne vers ses liens au centre, la
  // souris traverse les lignes voisines sans les ouvrir.
  const [pending, setPending] = useState<string | null>(null);
  useEffect(() => {
    if (pending === null) return;
    const t = setTimeout(() => {
      setActive(pending);
      setPending(null);
    }, 220);
    return () => clearTimeout(t);
  }, [pending]);
  const cancel = () => setPending(null);
  function enter(key: string, e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    if (active === null) setActive(key);
    else setPending(key === active ? null : key);
  }

  const details: Detail[] = [
    {
      key: ENGINE,
      right: false,
      kicker: c.engineKicker,
      title: c.engineTitle,
      detail: c.engineDetail,
      logos: [],
    },
    ...[c.capital, c.assets].flatMap((s) => [
      {
        key: s.id,
        right: s.id === "assets",
        kicker: arrow(s),
        title: s.sub[0].toUpperCase() + s.sub.slice(1),
        detail: s.detail,
        logos: [],
      },
      ...s.rows.map((r) => ({
        key: r.id,
        right: s.id === "assets",
        kicker: arrow(s),
        title: r.title,
        detail: r.detail,
        logos: r.logos,
        portraits: r.portraits,
      })),
    ]),
  ];
  const current = details.find((d) => d.key === active) ?? null;
  const activeSide = [c.capital, c.assets].find(
    (s) => s.id === active || s.rows.some((r) => r.id === active)
  );

  // Souris : le survol suffit, on ne referme qu'en quittant le schéma.
  // Toucher : un tap ouvre, un second referme.
  const bind = (key: string) => ({
    onPointerEnter: (e: React.PointerEvent) => enter(key, e),
    onPointerLeave: () => cancel(),
    // Clavier seulement : au toucher, le focus précède le clic et le
    // refermerait aussitôt.
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      if (e.currentTarget.matches(":focus-visible")) setActive(key);
    },
    onClick: (e: React.MouseEvent) => {
      cancel();
      const touch = (e.nativeEvent as PointerEvent).pointerType !== "mouse";
      setActive((a) => (touch && a === key ? null : key));
    },
    "aria-expanded": active === key,
  });

  // Rien d'actif, ou le moteur (qui relie les deux côtés) : tout reste net.
  // Sinon, seul le côté concerné, et dans ce côté la ligne active.
  const lit = (side: Side, rowId?: string) =>
    active === null ||
    active === ENGINE ||
    (rowId === undefined
      ? activeSide?.id === side.id
      : active === rowId || active === side.id);

  return (
    <div className="mt-6">
      {/* Chapô, sous l'en-tête encadré, et à sa droite les deux fondateurs
          qui portent chacun un côté du réseau : discrets, nom et focus. */}
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_17rem] md:gap-12">
        <div className={`max-w-3xl space-y-4 ${BODY}`}>
          {c.lead.map((p) => (
            <p key={p}>{bold(p)}</p>
          ))}
        </div>
        <aside className="self-center border-t border-foreground/10 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <p className="text-sm text-neutral-600">{c.foundersLabel}</p>
          {/* Les deux fondateurs au même niveau : côte à côte, même rang. */}
          <ul className="mt-4 grid grid-cols-2 gap-5">
            {c.founders.map((f) => (
              <li key={f.name} className="flex flex-col gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.photo}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
                <span>
                  <span className="block text-sm font-semibold text-foreground">{f.name}</span>
                  <span className="mt-0.5 block text-sm leading-5 text-neutral-600">{f.focus}</span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* La machine à réseau. */}
      <section className="mt-16">
        <SectionTitle icon="repeat">{c.title}</SectionTitle>

        <div
          className="mt-10 grid gap-x-6 gap-y-6 xl:gap-x-8 lg:grid-cols-[minmax(0,1fr)_15rem_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_19rem_minmax(0,1fr)] lg:gap-y-5"
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse") return;
            cancel();
            setActive(null);
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null);
          }}
        >
          {/* Les deux côtés, chacun en trois lignes. Sur mobile, le détail
              s'ouvre sous l'élément touché ; au large, il entre au centre. */}
          {[c.capital, c.assets].map((side, s) => {
            const right = s === 1;
            return (
              <div
                key={side.id}
                className={`flex flex-col lg:row-span-2 ${
                  right
                    ? "order-4 lg:order-none lg:col-start-3 lg:row-start-1"
                    : "order-1 lg:order-none lg:col-start-1 lg:row-start-1"
                }`}
              >
                <button
                  type="button"
                  {...bind(side.id)}
                  className={`group rounded-lg text-left outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-brand/60 ${
                    right ? "lg:text-right" : ""
                  } ${lit(side) ? "" : "opacity-50"}`}
                >
                  <span className={`flex items-center gap-4 ${right ? "lg:flex-row-reverse" : ""}`}>
                    <span className="text-lg font-semibold tracking-tight text-foreground">
                      {side.label}
                    </span>
                    <span
                      aria-hidden
                      className={`h-px flex-1 transition-colors ${
                        active === side.id ? "bg-marsala/60" : "bg-foreground/15"
                      }`}
                    />
                  </span>
                  <span className="mt-0.5 block text-sm text-neutral-600">{side.sub}</span>
                </button>
                <MobileDetail open={active === side.id} text={side.detail} />

                <ul className="mt-4 flex flex-1 flex-col gap-3">
                  {side.rows.map((row) => (
                    <li key={row.id} className="flex flex-1 flex-col">
                      <button
                        type="button"
                        {...bind(row.id)}
                        className={`flex flex-1 items-center gap-4 rounded-xl border px-5 py-4 text-left outline-none transition-[opacity,background-color,border-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-brand/60 ${
                          right ? "lg:flex-row-reverse lg:text-right" : ""
                        } ${
                          active === row.id
                            ? "border-marsala/30 bg-white shadow-sm"
                            : "border-foreground/10 bg-white/60 hover:bg-white"
                        } ${lit(side, row.id) ? "" : "opacity-50"}`}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-foreground">
                            {row.title}
                          </span>
                          <span
                            className={`mt-3 flex gap-1.5 ${right ? "lg:justify-end" : ""} ${
                              row.portraits ? "gap-2" : ""
                            }`}
                          >
                            {row.logos.map((logo) => (
                              <LogoTile key={logo.src} logo={logo} portrait={row.portraits} />
                            ))}
                          </span>
                        </span>
                        <span className="w-24 shrink-0 text-center">
                          <span className="block text-2xl font-bold tracking-tight text-marsala">
                            {row.fig}
                          </span>
                          <span className="mt-0.5 block text-sm leading-5 text-neutral-600">
                            {row.figLabel}
                          </span>
                        </span>
                      </button>
                      <MobileDetail open={active === row.id} text={row.detail} logos={row.portraits ? [] : row.logos} />
                    </li>
                  ))}
                </ul>

                {/* Le chiffre d'ancrage du côté, sous un filet. */}
                <div
                  className={`mt-6 border-t border-foreground/15 pt-4 ${right ? "lg:text-right" : ""}`}
                >
                  <p
                    className={`text-3xl font-bold tracking-tight transition-colors ${
                      active === side.id ? "text-marsala" : "text-foreground"
                    }`}
                  >
                    {side.fig}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-600">{side.figLabel}</p>
                </div>
              </div>
            );
          })}

          {/* Le centre : le moteur au repos, le détail de l'élément survolé
              sinon. Variantes empilées dans une même cellule. */}
          <div className="order-2 grid min-w-0 grid-cols-[minmax(0,1fr)] lg:order-none lg:col-start-2 lg:row-start-1 lg:mt-[4.25rem]">
            <div
              aria-hidden={current !== null && current.key !== ENGINE}
              className={`[grid-area:1/1] flex flex-col items-center justify-center transition-opacity duration-300 ${
                current ? "opacity-0 max-lg:opacity-100" : "opacity-100"
              } ${current ? "lg:pointer-events-none" : ""}`}
            >
              <button
                type="button"
                {...bind(ENGINE)}
                className="grid w-full place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
              >
                <Engine sub={c.engineSub} />
              </button>
              <MobileDetail open={active === ENGINE} text={c.engineDetail} />
            </div>
            {details.map((d) => {
              const on = d.key === active;
              return (
                <div
                  key={d.key}
                  aria-hidden={!on}
                  className={`[grid-area:1/1] hidden flex-col justify-center rounded-xl border border-foreground/10 bg-white/80 p-6 transition-[opacity,transform] duration-300 lg:flex ${
                    on
                      ? "opacity-100 translate-x-0"
                      : `pointer-events-none opacity-0 ${d.right ? "translate-x-3" : "-translate-x-3"}`
                  }`}
                >
                  {d.key === ENGINE ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/brand/wordmark.png" alt="" className="mb-3 h-6 w-auto self-start" />
                  ) : (
                    <p className="text-sm text-neutral-600">{d.kicker}</p>
                  )}
                  <h3 className="mt-1 text-sm font-semibold text-foreground">{d.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-700">{d.detail}</p>
                  {d.portraits ? (
                    <div className="mt-4 flex gap-2">
                      {d.logos.map((l) => (
                        <LogoTile key={l.src} logo={l} portrait />
                      ))}
                    </div>
                  ) : (
                    d.logos.length > 0 && <LogoLinks logos={d.logos} tabbable={on} />
                  )}
                </div>
              );
            })}
          </div>

          {/* La boucle : phrase de clôture, carte blanche sans guillemets. */}
          <p className="order-3 self-end rounded-xl border border-foreground/10 bg-white/60 px-5 py-4 text-center text-sm leading-6 text-neutral-700 lg:order-none lg:col-start-2 lg:row-start-2">
            {c.loop}
          </p>
        </div>

        <p className={`mt-12 rounded-xl border border-neutral-300/70 bg-neutral-200/40 px-6 py-5 ${BODY}`}>
          {c.level2}
        </p>
      </section>
    </div>
  );
}

function LogoTile({ logo, portrait }: { logo: Logo; portrait?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.src}
      alt={logo.alt}
      className={
        portrait
          ? "h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-brand/40"
          : "h-9 w-[53px] shrink-0 rounded-md object-cover"
      }
    />
  );
}

// Les acteurs d'une ligne, logo, nom et site. Un acteur sans site vérifié
// reste en texte simple.
function LogoLinks({ logos, tabbable = true }: { logos: Logo[]; tabbable?: boolean }) {
  return (
    <ul className="mt-4 space-y-1 border-t border-foreground/10 pt-3">
      {logos.map((l) => {
        const inner = (
          <>
            <LogoTile logo={{ ...l, alt: "" }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">{l.name}</span>
              {l.href && (
                <span className="block truncate text-xs text-neutral-600">
                  {l.href.replace(/^https?:\/\/(www\.)?/, "")} ↗
                </span>
              )}
            </span>
          </>
        );
        return (
          <li key={l.src}>
            {l.href ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={tabbable ? undefined : -1}
                className="-mx-2 flex min-w-0 items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-brand/10"
              >
                {inner}
              </a>
            ) : (
              <div className="-mx-2 flex items-center gap-3 px-2 py-1">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// Détail sous l'élément touché, sur mobile seulement : au large, il entre au
// centre. Ici la hauteur peut bouger, il n'y a pas de survol à perdre.
function MobileDetail({ open, text, logos = [] }: { open: boolean; text: string; logos?: Logo[] }) {
  if (!open) return null;
  return (
    <div className="mt-3 px-1 lg:hidden">
      <p className="text-sm leading-6 text-neutral-700">{text}</p>
      {logos.length > 0 && <LogoLinks logos={logos} />}
    </div>
  );
}

// Le moteur de structuration : le mot-symbole Minah dans un disque orangé
// clair, cerclé d'une boucle en pointillés qui tourne lentement. Texte en
// marsala sur fond brand/10 (combinaison validée, AGENTS.md).
function Engine({ sub }: { sub: string }) {
  return (
    <span className="relative grid aspect-square w-full max-w-[13rem] place-items-center lg:max-w-[15rem] xl:max-w-[17rem]">
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full text-brand motion-safe:animate-[spin_48s_linear_infinite]"
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="3 5"
          strokeLinecap="round"
        />
        {/* Deux pointes, en haut vers la droite, en bas vers la gauche : le
            sens de la boucle. */}
        <path d="M96 3 L105 8 L96 13 Z" fill="currentColor" />
        <path d="M104 187 L95 192 L104 197 Z" fill="currentColor" />
      </svg>
      <span className="grid h-[76%] w-[76%] place-items-center rounded-full bg-brand/10 transition-colors hover:bg-brand/15">
        <span className="flex flex-col items-center gap-2 px-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/wordmark.png" alt="Minah" className="h-9 w-auto" />
          <span className="text-sm font-semibold text-marsala">{sub}</span>
        </span>
      </span>
    </span>
  );
}
