import type { Locale } from "@/lib/i18n";

// Fiche « Go-to-market » : portée entièrement par ce composant (richOnly, le
// texte de la base ne s'affiche pas). Deux visuels — la machine à réseau à
// double détente et la frise 500 K€ → 100 M€ — et le reste en cards, en
// suivant le langage visuel de la zone investisseurs (AGENTS.md).

type Card = { h: string; b: string; href?: string };
type Founder = { side: string; h: string; b: string };
type Champion = { h: string; tag: string; figs: string[] };
type Proof = { k: string; v: string };
type Milestone = { t: string; v: string; d: string };

const CIRCLE_URL = "https://minah-circle-website-drab.vercel.app";

const copy = {
  fr: {
    lead: "Notre force, c'est l'accès.",
    leadBody:
      "Nous avons formalisé une machine à réseau qui nous connecte aux bonnes personnes des deux côtés : le capital qui finance, et les entreprises génératrices de cash qui font les meilleurs sous-jacents.",
    originTitle: "Notre premier actif : le réseau des fondateurs",
    originBody:
      "Six ans de carrière, poste après poste, relation après relation : un réseau propriétaire, gagné et difficile à copier, que la levée met en mouvement. Les deux côtés de la machine sont d'abord deux personnes.",
    founders: [
      {
        side: "Écosystèmes & investisseurs",
        h: "Coralie",
        b: "A passé sa carrière à construire les écosystèmes, en Afrique comme à l'international, où se rencontrent dirigeants, CEO, institutionnels et investisseurs qui travaillent avec et sur le continent.",
      },
      {
        side: "Capital institutionnel & on-chain",
        h: "Julien",
        b: "Connecté aux écosystèmes blockchain et aux institutionnels européens et nord-américains : il a investi 500 M€ en fonds de fonds chez Bpifrance.",
      },
    ] as Founder[],
    machineTitle: "La machine à réseau",
    capitalLabel: "Capital-in",
    capitalSub: "qui apporte les investisseurs",
    centerName: "Minah",
    centerSub: "Moteur de structuration",
    centerLine: "coupon · protections · maturité",
    assetsLabel: "Assets-out / sell-side",
    assetsSub: "qui apporte les deals",
    capIn: ["15 Network builders", "Institutions", "Écosystème blockchain"],
    capOut: [
      "Top scale-ups & entreprises",
      "États & banques",
      "Fonds de private credit partenaires",
    ],
    capitalAnchor: "100 M€ de capital-in d'ici fin 2027",
    assetsAnchor: "80 M€ de pipeline d'actifs (live)",
    loop: "La boucle qui compose : chaque deal honoré recrute l'investisseur suivant, chaque investisseur finance le deal suivant.",
    capitalTitle: "Côté capital — qui finance",
    capitalCards: [
      {
        h: "+15 Network Builders",
        b: "Un réseau choisi d'apporteurs — brokers, banquiers privés et asset managers — qui nous introduisent des investisseurs qualifiés par des mises en relation chaudes et engageantes. Nous comptons aujourd'hui 15 Network Builders, qui nous ont déjà amené dix investisseurs qualifiés ; d'autres introductions sont en cours.",
      },
      {
        h: "Minah Circles",
        b: "Nos événements propriétaires réunissent environ 50 personnes qualifiées par édition. Nous les organisons dans trois hubs : Paris, Abidjan (en marge de l'Africa CEO Forum) et Davos (en marge du WEF).",
        href: CIRCLE_URL,
      },
      {
        h: "Les tables clés",
        b: "Nous sommes invités là où se concentre le capital africain et international : Davos en parallèle du World Economic Forum, l'Africa CEO Forum où les CEO doivent justifier d'un minimum de 10 M€ de chiffre d'affaires annuel, l'Africa Financial Industry Summit, Choiseul Afrique, TLG Capital, le Web Summit, le Financial Times Africa Summit et ChangeNOW. C'est lors de l'un de ces rendez-vous, au Qatar, qu'un fonds américain nous a rejoints pour co-structurer le déploiement de Kupanda.",
      },
      {
        h: "Discussions en cours",
        b: "Plusieurs pistes avancent en parallèle : Atlantic Financials étudie une ligne de 1 à 4 M€ dans Kupanda, aux côtés de Black Manta et d'un réseau d'institutionnels et de brokers internationaux. Notre stratégie en Afrique de l'Ouest a déjà suscité de l'intérêt pour des lignes de crédit d'au moins 5 M€, au même titre que Kupanda II.",
      },
      {
        h: "Écosystème blockchain",
        b: "La liquidité on-chain cherche du rendement réel : près de 30 Md$ d'actifs réels sont déjà tokenisés, dont environ 17 Md$ de crédit privé, mais presque rien n'est connecté à des sous-jacents africains. C'est précisément le pont que nous construisons, avec Canton Network, Ubuntu Tribe et la Stellar Foundation, qui nous subventionne déjà.",
      },
      {
        h: "Minah OS (IA)",
        b: "Notre IA en production — les agents Yao et Comlan — analyse les appels et notre capacité à closer, gère les relances et les meetings, et rédige toutes nos communications pour relecture. Elle nous remonte surtout des signaux clairs pour attirer et closer du capital, analyser les sous-jacents et appuyer la structuration, et approfondit le mapping de l'écosystème. L'équipe se concentre sur ce qui demande un humain, structurer et vendre, pendant que l'IA s'améliore pour animer et renforcer un réseau large.",
      },
    ] as Card[],
    assetsTitle: "Côté actifs — les bons sous-jacents",
    assetsIntro:
      "Nous avons accès à une dizaine de scale-ups et futures licornes africaines, ainsi qu'à de grands opérateurs présents sur le continent — des contreparties aux flux de trésorerie massifs, exactement le profil qui fait des sous-jacents premium. Trois exemples :",
    champions: [
      {
        h: "Wave",
        tag: "Paiements mobiles",
        figs: [
          "Unicorne — 1,7 Md$",
          "~38 % de la valeur mobile UEMOA (~267 Md$/an)",
          "10 M+ d'utilisateurs",
        ],
      },
      {
        h: "Yango",
        tag: "Super-app",
        figs: [
          "~4 Md$ générés par ses chauffeurs (2024)",
          "13+ pays africains",
          "mobilité → paiements & fintech",
        ],
      },
      {
        h: "Caterpillar Afrique",
        tag: "Équipement lourd",
        figs: [
          "Leader mondial",
          "présent sur tout le continent",
          "flux de trésorerie massifs",
        ],
      },
    ] as Champion[],
    cabinets:
      "Accès à une trentaine de cabinets présidentiels, qui nous redirigent vers des sous-jacents stratégiques.",
    proofTitle: "La preuve, aujourd'hui",
    proof: [
      { k: "4 HNWI", v: "ont déjà souscrit (1er closing Kupanda)" },
      { k: "Qatar", v: "un fonds américain a permis la structuration & le déploiement de Kupanda" },
      { k: "~500 K€", v: "déployés par Minah" },
    ] as Proof[],
    roadmapTitle: "La trajectoire",
    milestones: [
      { t: "Aujourd'hui", v: "~500 K€", d: "déployés · 1 stratégie live et 2 en structuration (~30 M€ de pipeline)" },
      { t: "Phase 1 — MVP", v: "~15 M€", d: "de volume · H2 2026 → H2 2027" },
      { t: "Accélération", v: "~50 M€", d: "nouvelles stratégies & géographies" },
      { t: "Fin 2027 — Scale", v: "100 M€", d: "d'AUM · licence de crédit" },
    ] as Milestone[],
    pathTitle: "Le chemin vers 100 M€",
    pathLead:
      "100 M€ ne se conquiert pas au retail : c'est une poignée de lignes institutionnelles — fonds de dette, fonds de fonds, DFI, trésoreries on-chain — de 5 à 20 M€ chacune, en complément de tickets d'HNWI à 300 K€.",
    pathSteps: [
      {
        h: "500 K€ → 15 M€",
        b: "Les HNWI, les Network Builders et une première ligne institutionnelle (Atlantic Financials, fonds américain) commencent à financer le pipeline à bonne visibilité : Kupanda 2/3 (~15 M€) et Esgni, notre stratégie scale-up ouest-africaine (~15 M€), soit ~30 M€.",
      },
      {
        h: "15 → 50 M€",
        b: "Notre prospection structure ~20 M€ de plus — un véhicule adossé aux gouvernements ouest-africains, en logique de partenariat public-privé (PPP) — appuyé par deux à trois lignes institutionnelles de 5 à 15 M€.",
      },
      {
        h: "50 → 100 M€",
        b: "Une ancre DFI ou fonds de fonds, la liquidité on-chain, et les licences supplémentaires qui débloquent les plus gros tickets.",
      },
    ] as Card[],
    pathComparables:
      "Ce n'est pas inédit : TLG Capital (~120 M$, adossé à IFC et Proparco), Cauris et Enko ont atteint 100 M€+ dans cette même classe d'actifs. Le chemin est connu ; notre différence est la distribution.",
    scaleTitle: "Ce que la levée met à l'échelle",
    scale: [
      {
        h: "Densifier le réseau",
        b: "Passer de 15 Network Builders à une force de distribution formalisée, et industrialiser le sourcing des sous-jacents auprès des scale-ups et des cabinets présidentiels.",
      },
      {
        h: "Cadencer les Minah Circles",
        b: "Passer de trois à cinq hubs — en ajoutant Nairobi et New York — pour transformer chaque édition en pipeline d'investisseurs qualifiés.",
      },
      {
        h: "Renforcer l'équipe",
        b: "Fondateurs à plein temps pour faire tourner la machine relationnelle à l'échelle et capter les tickets institutionnels, pour passer de deals de 2 M€ à un pipeline de 50 M€+ et renforcer notre capacité de structuration institutionnelle.",
      },
    ] as Card[],
    closer:
      "Des premières souscriptions honorées à 100 M€ de capital-in d'ici fin 2027 : l'extension d'un moteur qui tourne déjà.",
    fieldTitle: "La machine à réseau, sur le terrain",
    fieldCaption:
      "Sommets présidentiels, forums d'investisseurs et institutions : les fondateurs, là où se nouent les relations qui alimentent la machine.",
    fieldCaps: [
      "Panel présidentiel — Africa CEO Forum",
      "Invitation à l'Élysée",
      "ChangeNOW — Grand Palais",
      "Congrès panafricain — Lomé",
      "Nairobi — délégation française",
      "Side event — Première dame de Côte d'Ivoire",
      "Davos — modération",
      "AFIS — table ronde",
    ],
    circleCta: "Découvrir Minah Circle",
    sources:
      "Sources : rwa.xyz & The Defiant (tokenisation RWA, 2025) · The Africa Report (paiements mobiles UEMOA, 2024) · Yango Impact Report 2024.",
  },
  en: {
    lead: "Our strength is access.",
    leadBody:
      "We have formalised a relationship machine that connects us to the right people on both sides: the capital that funds, and the cash-generative businesses that make the best underlyings.",
    originTitle: "Our first asset: the founders' network",
    originBody:
      "Six years of careers, role after role, relationship after relationship: a proprietary network, earned and hard to copy, that the raise sets in motion. The two sides of the machine are, first, two people.",
    founders: [
      {
        side: "Ecosystems & investors",
        h: "Coralie",
        b: "Spent her career building the ecosystems — in Africa and internationally — where the leaders, CEOs, institutions and investors working with and on the continent meet.",
      },
      {
        side: "Institutional & on-chain capital",
        h: "Julien",
        b: "Plugged into the blockchain ecosystems and European & North American institutions: he invested €500M in fund-of-funds at Bpifrance.",
      },
    ] as Founder[],
    machineTitle: "The relationship machine",
    capitalLabel: "Capital-in",
    capitalSub: "who brings the investors",
    centerName: "Minah",
    centerSub: "Structuring engine",
    centerLine: "coupon · protections · maturity",
    assetsLabel: "Assets-out / sell-side",
    assetsSub: "who brings the deals",
    capIn: ["15 Network builders", "Institutions", "Blockchain ecosystem"],
    capOut: [
      "Top scale-ups & companies",
      "Governments & banks",
      "Partner private credit funds",
    ],
    capitalAnchor: "€100M capital-in by end-2027",
    assetsAnchor: "€80M assets pipeline (live)",
    loop: "The loop that compounds: every deal honoured recruits the next investor, every investor funds the next deal.",
    capitalTitle: "Capital side — who funds",
    capitalCards: [
      {
        h: "+15 Network Builders",
        b: "A curated network of introducers — brokers, private bankers and asset managers — who bring us qualified investors through warm, committing introductions. We now count 15 Network Builders, who have already brought in ten qualified investors; more introductions are underway.",
      },
      {
        h: "Minah Circles",
        b: "Our proprietary events gather around 50 qualified guests per edition. We run them in three hubs: Paris, Abidjan (alongside the Africa CEO Forum) and Davos (alongside the WEF).",
        href: CIRCLE_URL,
      },
      {
        h: "The key tables",
        b: "We are invited where African and international capital concentrates: Davos alongside the World Economic Forum, the Africa CEO Forum — where CEOs must show at least €10M in annual revenue to attend — the Africa Financial Industry Summit, Choiseul Afrique, TLG Capital, the Web Summit, the Financial Times Africa Summit and ChangeNOW. It was at one of these gatherings, in Qatar, that an American fund joined us to co-structure the deployment of Kupanda.",
      },
      {
        h: "In discussion",
        b: "Several tracks are advancing in parallel: Atlantic Financials is looking at a €1–4M line into Kupanda, alongside Black Manta and a network of international institutions and brokers. Our West African strategy has already drawn interest for credit lines of at least €5M, as has Kupanda II.",
      },
      {
        h: "Blockchain ecosystem",
        b: "On-chain liquidity is hunting for real yield: close to $30B of real-world assets are already tokenized, of which about $17B is private credit, yet almost none is connected to African underlyings. That is precisely the bridge we build, with Canton Network, Ubuntu Tribe and the Stellar Foundation, which already backs us with grants.",
      },
      {
        h: "Minah OS (AI)",
        b: "Our AI in production — the Yao and Comlan agents — analyses calls and our ability to close, handles follow-ups and meetings, and drafts all our communications for review. Above all, it surfaces clear signals to attract and close capital, analyse the underlying assets and support structuring, and deepens the mapping of the ecosystem. The team focuses on what needs a human, structuring and selling, while the AI keeps improving to nurture and strengthen a broad network.",
      },
    ] as Card[],
    assetsTitle: "Asset side — the best underlyings",
    assetsIntro:
      "We have access to around ten African scale-ups and future unicorns, as well as major operators present on the continent — counterparties with massive cash flows, exactly the profile that makes premium underlyings. Three examples:",
    champions: [
      {
        h: "Wave",
        tag: "Mobile money",
        figs: [
          "Unicorn — $1.7B",
          "~38% of WAEMU mobile-money value (~$267B/yr)",
          "10M+ users",
        ],
      },
      {
        h: "Yango",
        tag: "Super-app",
        figs: [
          "~$4B earned by its drivers (2024)",
          "13+ African countries",
          "mobility → payments & fintech",
        ],
      },
      {
        h: "Caterpillar Africa",
        tag: "Heavy equipment",
        figs: ["Global leader", "present across the continent", "massive cash flows"],
      },
    ] as Champion[],
    cabinets:
      "Access to some thirty presidential offices, redirecting us toward strategic underlyings.",
    proofTitle: "The proof, today",
    proof: [
      { k: "4 HNWIs", v: "have already subscribed (Kupanda first closing)" },
      { k: "Qatar", v: "an American fund enabled the structuring & deployment of Kupanda" },
      { k: "~€500K", v: "deployed by Minah" },
    ] as Proof[],
    roadmapTitle: "The trajectory",
    milestones: [
      { t: "Today", v: "~€500K", d: "deployed · 1 strategy live and 2 being structured (~€30M pipeline)" },
      { t: "Phase 1 — MVP", v: "~€15M", d: "of volume · H2 2026 → H2 2027" },
      { t: "Acceleration", v: "~€50M", d: "new strategies & geographies" },
      { t: "End-2027 — Scale", v: "€100M", d: "AUM · credit licence" },
    ] as Milestone[],
    pathTitle: "The path to €100M",
    pathLead:
      "€100M is not a retail land-grab: it is a handful of institutional lines — debt funds, fund-of-funds, DFIs, on-chain treasuries — of €5–20M each, on top of €300K HNWI tickets.",
    pathSteps: [
      {
        h: "€500K → €15M",
        b: "HNWIs, Network Builders and a first institutional line (Atlantic Financials, the American fund) are starting to fund the pipeline with good visibility: Kupanda 2/3 (~€15M) and Esgni, our West African scale-up strategy (~€15M) — about €30M.",
      },
      {
        h: "€15M → €50M",
        b: "Our prospecting structures another ~€20M — a vehicle anchored to West African governments, on a public-private-partnership (PPP) basis — supported by two to three institutional lines of €5–15M.",
      },
      {
        h: "€50M → €100M",
        b: "A DFI or fund-of-funds anchor, on-chain liquidity, and the additional licences that unlock the largest tickets.",
      },
    ] as Card[],
    pathComparables:
      "This is not unprecedented: TLG Capital (~$120M, backed by IFC and Proparco), Cauris and Enko reached €100M+ in this same asset class. The path is known; our difference is distribution.",
    scaleTitle: "What the raise scales",
    scale: [
      {
        h: "Densify the network",
        b: "Grow from 15 Network Builders to a formalised distribution force, and industrialise underlying sourcing from scale-ups and presidential offices.",
      },
      {
        h: "Set the Circles' cadence",
        b: "Go from three to five hubs — adding Nairobi and New York — turning every edition into a pipeline of qualified investors.",
      },
      {
        h: "Strengthen the team",
        b: "Founders full-time to run the relationship machine at scale and capture institutional tickets, moving from €2M deals to a €50M+ pipeline and strengthening our institutional structuring capacity.",
      },
    ] as Card[],
    closer:
      "From our first subscriptions honoured to €100M of capital-in by end-2027: the extension of an engine already running.",
    fieldTitle: "The relationship machine, in the field",
    fieldCaption:
      "Presidential summits, investor forums and institutions: the founders where the relationships that feed the machine are built.",
    fieldCaps: [
      "Presidential panel — Africa CEO Forum",
      "Invited to the Élysée",
      "ChangeNOW — Grand Palais",
      "Pan-African Congress — Lomé",
      "Nairobi — French delegation",
      "Side event — First Lady of Côte d'Ivoire",
      "Davos — moderation",
      "AFIS — roundtable",
    ],
    circleCta: "Explore Minah Circle",
    sources:
      "Sources: rwa.xyz & The Defiant (RWA tokenization, 2025) · The Africa Report (WAEMU mobile money, 2024) · Yango Impact Report 2024.",
  },
} as const;

function SectionTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 font-mono text-sm font-semibold text-marsala">
        {n}
      </span>
      <h2 className="text-2xl font-semibold leading-tight tracking-tight">
        {children}
      </h2>
    </div>
  );
}

export function GoToMarket({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <div className="mt-8 space-y-14">
      {/* Chapô */}
      <section>
        <p className="text-lg font-semibold tracking-tight text-foreground">
          {c.lead}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-700">
          {c.leadBody}
        </p>
      </section>

      {/* D'où vient le go-to-market — six ans de terrain des fondateurs */}
      <section>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          {c.originTitle}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-700">
          {c.originBody}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {c.founders.map((f) => (
            <div
              key={f.h}
              className="rounded-xl border border-foreground/10 bg-white/60 p-5"
            >
              <p className="text-base font-semibold text-foreground">{f.h}</p>
              <p className="mt-1.5 text-[13px] leading-6 text-neutral-600">
                {f.b}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 01 — la machine à réseau, à double détente */}
      <section>
        <SectionTitle n="01">{c.machineTitle}</SectionTitle>
        <div className="mt-5 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
            <p className="text-sm font-semibold text-foreground">
              {c.capitalLabel}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">{c.capitalSub}</p>
            <ul className="mt-4 space-y-2">
              {c.capIn.map((x) => (
                <li
                  key={x}
                  className="rounded-md border-l-2 border-marsala/40 bg-white px-3 py-2 text-sm font-medium text-foreground"
                >
                  {x}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-marsala px-6 py-6 text-center text-white md:w-44">
            <span aria-hidden className="text-white/45">
              → · →
            </span>
            <p className="mt-1 text-lg font-semibold">{c.centerName}</p>
            <p className="text-xs text-white/80">{c.centerSub}</p>
            <p className="mt-1 text-[11px] leading-snug text-white/60">
              {c.centerLine}
            </p>
            <span aria-hidden className="mt-1 text-white/45">
              ← · ←
            </span>
          </div>

          <div className="rounded-xl border border-foreground/10 bg-white/60 p-5">
            <p className="text-sm font-semibold text-foreground">
              {c.assetsLabel}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">{c.assetsSub}</p>
            <ul className="mt-4 space-y-2">
              {c.capOut.map((x) => (
                <li
                  key={x}
                  className="rounded-md border-l-2 border-salvia bg-white px-3 py-2 text-sm font-medium text-foreground"
                >
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1 border-t border-foreground/10 pt-4 text-sm font-semibold text-foreground sm:flex-row sm:justify-between">
          <span>{c.capitalAnchor}</span>
          <span className="sm:text-right">{c.assetsAnchor}</span>
        </div>
        <p className="mt-3 text-xs leading-5 text-neutral-500">{c.loop}</p>
      </section>

      {/* 02 — côté capital */}
      <section>
        <SectionTitle n="02">{c.capitalTitle}</SectionTitle>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {c.capitalCards.map((card) => (
            <div
              key={card.h}
              className="rounded-xl border border-foreground/10 bg-white/60 p-5"
            >
              <p className="text-sm font-semibold text-foreground">{card.h}</p>
              <p className="mt-1 text-[13px] leading-6 text-neutral-600">
                {card.b}
              </p>
              {card.href && (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="halo-hover mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-[13px] font-semibold text-marsala transition-colors hover:bg-brand/15"
                >
                  {c.circleCta}
                  <span aria-hidden className="whitespace-nowrap">
                    →
                  </span>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 03 — côté actifs */}
      <section>
        <SectionTitle n="03">{c.assetsTitle}</SectionTitle>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-700">
          {c.assetsIntro}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {c.champions.map((ch) => (
            <div
              key={ch.h}
              className="rounded-xl border border-foreground/10 bg-white/60 p-5"
            >
              <p className="text-base font-semibold text-foreground">{ch.h}</p>
              <p className="mt-0.5 text-[12px] text-neutral-500">{ch.tag}</p>
              <ul className="mt-3 space-y-1.5">
                {ch.figs.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2 text-[12.5px] leading-snug text-neutral-700"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-marsala"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 border-l-2 border-marsala pl-4 text-[13px] leading-6 text-neutral-700">
          {c.cabinets}
        </p>
      </section>

      {/* 04 — la preuve */}
      <section>
        <SectionTitle n="04">{c.proofTitle}</SectionTitle>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {c.proof.map((p) => (
            <div
              key={p.k}
              className="rounded-xl border border-foreground/10 bg-white/60 p-4"
            >
              <p className="text-xl font-bold tracking-tight text-marsala">
                {p.k}
              </p>
              <p className="mt-1 text-[12.5px] leading-5 text-neutral-600">
                {p.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — la frise 500 K€ → 100 M€ */}
      <section>
        <SectionTitle n="05">{c.roadmapTitle}</SectionTitle>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.milestones.map((m) => (
            <div key={m.t}>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-marsala"
                />
                <span
                  aria-hidden
                  className="h-px flex-1 bg-gradient-to-r from-foreground/25 to-transparent"
                />
              </div>
              <p className="mt-2 text-xs font-medium text-neutral-500">{m.t}</p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">
                {m.v}
              </p>
              <p className="text-[12.5px] leading-snug text-neutral-600">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 06 — le chemin vers 100 M€ */}
      <section>
        <SectionTitle n="06">{c.pathTitle}</SectionTitle>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-700">
          {c.pathLead}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {c.pathSteps.map((s) => (
            <div
              key={s.h}
              className="rounded-xl border border-foreground/10 bg-white/60 p-5"
            >
              <p className="text-sm font-bold tracking-tight text-marsala">
                {s.h}
              </p>
              <p className="mt-1.5 text-[13px] leading-6 text-neutral-600">
                {s.b}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 border-l-2 border-marsala pl-4 text-[13px] leading-6 text-neutral-700">
          {c.pathComparables}
        </p>
      </section>

      {/* 07 — ce que la levée met à l'échelle */}
      <section>
        <SectionTitle n="07">{c.scaleTitle}</SectionTitle>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {c.scale.map((s) => (
            <div
              key={s.h}
              className="rounded-xl border border-foreground/10 bg-white/60 p-5"
            >
              <p className="text-sm font-semibold text-foreground">{s.h}</p>
              <p className="mt-1.5 text-[13px] leading-6 text-neutral-600">{s.b}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 border-l-2 border-marsala pl-4 text-[15px] font-medium leading-7 text-foreground">
          {c.closer}
        </p>
      </section>

      {/* Bandeau photos « sur le terrain » — preuve visuelle du réseau, en
          couleur, avec la légende de l'événement sous chaque cliché. Défilé en
          boucle : cf. .ticker dans globals.css (pause au survol, neutralisé si
          reduced-motion). */}
      <section>
        <p className="text-sm font-semibold text-foreground">{c.fieldTitle}</p>
        <p className="mt-1 max-w-2xl text-[13px] leading-6 text-neutral-600">
          {c.fieldCaption}
        </p>
        <div className="ticker mt-5">
          <div className="ticker-track">
            {[...FIELD, ...FIELD].map((src, i) => {
              const cap = c.fieldCaps[i % FIELD.length];
              return (
                <figure key={i} className="mr-4 flex-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={cap}
                    className="h-44 w-auto rounded-lg object-cover"
                  />
                  <figcaption className="mt-1.5 max-w-[15rem] text-[11px] leading-4 text-neutral-500">
                    {cap}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <p className="text-[11px] leading-5 text-neutral-400">{c.sources}</p>
    </div>
  );
}

// Huit photos de terrain (couleur), défilées en boucle en bas de fiche.
// L'ordre suit celui de c.fieldCaps (une légende par cliché).
const FIELD = [
  "/brand/gtm/field-1.jpg",
  "/brand/gtm/field-2.jpg",
  "/brand/gtm/field-3.jpg",
  "/brand/gtm/field-4.jpg",
  "/brand/gtm/field-5.jpg",
  "/brand/gtm/field-6.jpg",
  "/brand/gtm/field-7.jpg",
  "/brand/gtm/field-8.jpg",
];
