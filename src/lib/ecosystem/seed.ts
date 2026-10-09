// Roadmap écosystème, v4 du 08/10/2026. Un récit par période, pas une liste de
// tâches : quatre phases de croissance lues en volume, et pour chacune trois
// fils, distribution (qui finance), sous-jacents (d'où viennent les actifs),
// marché (où Minah est vue). Des photos pour se projeter.
// BROUILLON : textes à valider par l'équipe ; les noms en gras sont ceux que
// l'on peut écrire, les autres restent des catégories.

export type Bilingual = { fr: string; en: string };
// Quatre phases depuis le 08/10/2026 : « échelle » a fusionné dans
// « distribution » (50 → 100 M€), sur la structure en trois temps du deck.
export type GrowthPhase = "amorcage" | "traction" | "distribution" | "marche";
export type Stream = "distribution" | "sous_jacents" | "marche";
export const STREAMS: Stream[] = ["distribution", "sous_jacents", "marche"];

export const ECO_TODAY = "2026-10-01";

/** `pos` : object-position du recadrage (défaut « center »), pour garder les
 *  visages dans le cadre quand ils ne sont pas au centre de la photo. */
/** `href` : site de l'événement, porté par le titre de la légende. */
export type Photo = { src: string; t: Bilingual; d?: Bilingual; pos?: string; href?: string };

export const GROWTH_PHASES: Array<{
  id: GrowthPhase;
  start: string;
  end: string;
  label: Bilingual;
  /** Volume visé, en toutes lettres, et en millions d'euros pour la courbe. */
  volume: Bilingual;
  volumeMEur: number;
  tagline: Bilingual;
}> = [
  { id: "amorcage", start: "2026-02-01", end: "2026-10-31", label: { fr: "Amorçage", en: "Seeding" }, volume: { fr: "0 à 2 M€", en: "€0 to €2M" }, volumeMEur: 2,
    tagline: { fr: "On entre là où le risque est déjà géré : Kupanda, co-construit avec Africa Rise, est déjà live. 2 M€, 12 mois, 20 % de coupon, des PME sous contrats d'État en Zambie, et cinq niveaux de protection.", en: "We enter where risk is already managed: Kupanda, co-built with Africa Rise, is already live. €2M, 12 months, 20% coupon, SMEs under State contracts in Zambia, and five layers of protection." } },
  { id: "traction", start: "2026-11-01", end: "2027-12-31", label: { fr: "Traction", en: "Traction" }, volume: { fr: "2 à 50 M€", en: "€2M to €50M" }, volumeMEur: 50,
    tagline: { fr: "Nous ne changeons pas de métier : exactement la même chose, à plus grande échelle. La machine réseau devient mondiale, les rails on-chain se multiplient, et le pipeline passe de 2 à 50 M€.", en: "We are not changing jobs: exactly the same thing, at larger scale. The network machine goes global, on-chain rails multiply, and the pipeline grows from €2M to €50M." } },
  { id: "distribution", start: "2028-01-01", end: "2028-12-31", label: { fr: "Distribution", en: "Distribution" }, volume: { fr: "50 à 100 M€", en: "€50M to €100M" }, volumeMEur: 100,
    tagline: { fr: "Trois écosystèmes nourrissent trois moteurs, dette privée, dette souveraine, liquidité crypto ; chacun a été ouvert une période avant d'être nécessaire.", en: "Three ecosystems feed three engines, private debt, sovereign debt, crypto liquidity; each was opened one period before it was needed." } },
  { id: "marche", start: "2029-01-01", end: "2029-12-31", label: { fr: "Marché", en: "Market" }, volume: { fr: "Road to 1 Md€", en: "Road to €1B" }, volumeMEur: 1000,
    tagline: { fr: "L'écosystème devient le marché : des places de liquidité et des institutions branchées en direct, préparées pendant la distribution, portent le milliard.", en: "The ecosystem becomes the market: liquidity venues and institutions plugged in directly, prepared during distribution, carry the billion." } },
];

export const STREAM_META: Record<Stream, { label: Bilingual; sub: Bilingual }> = {
  distribution: { label: { fr: "Distribution", en: "Distribution" }, sub: { fr: "Qui finance, et par quel canal", en: "Who funds, and through which channel" } },
  sous_jacents: { label: { fr: "Sous-jacents", en: "Underlyings" }, sub: { fr: "D'où viennent les actifs", en: "Where the assets come from" } },
  marche: { label: { fr: "Marché", en: "Market" }, sub: { fr: "Les tables où Minah est vue, et qui elle y rencontre", en: "The tables where Minah is seen, and whom it meets there" } },
};

// Les photos, par titre court : toutes dans public/brand/gtm, déjà servies par
// le go-to-market. On les réutilise, pas de nouveau fichier.
const P = {
  ceoForum: { src: "/brand/gtm/field-1.jpg", t: { fr: "Africa CEO Forum, Abidjan, Côte d'Ivoire", en: "Africa CEO Forum, Abidjan, Côte d'Ivoire" }, d: { fr: "Panel présidentiel : Ramaphosa, Kagame, El-Ghazouani.", en: "Presidential panel: Ramaphosa, Kagame, El-Ghazouani." } },
  elysee: { src: "/brand/gtm/field-2.jpg", t: { fr: "Palais de l'Élysée, Paris, France", en: "Élysée Palace, Paris, France" }, d: { fr: "Rencontre privée avec Emmanuel Macron et les grandes figures de la diaspora.", en: "Private meeting with Emmanuel Macron and leading diaspora figures." } },
  africaHouse: { src: "/brand/gtm/field-7.jpg?v=3", t: { fr: "Africa House, World Economic Forum, Davos, Suisse", en: "Africa House, World Economic Forum, Davos, Switzerland" }, d: { fr: "Modération de panel, Healthcap, Revenge Capital, Africa Finance Corporation.", en: "Panel moderation, Healthcap, Revenge Capital, Africa Finance Corporation." } },
  africaCollective: { src: "/brand/gtm/field-22.jpg", pos: "center 30%", t: { fr: "Africa Collective, World Economic Forum, Davos, Suisse", en: "Africa Collective, World Economic Forum, Davos, Switzerland" }, d: { fr: "Standard Bank, Ventures Platform, Old Mutual, Novartis.", en: "Standard Bank, Ventures Platform, Old Mutual, Novartis." } },
  afis: { src: "/brand/gtm/field-9.jpg", t: { fr: "Africa Financial Industry Summit, Lomé, Togo", en: "Africa Financial Industry Summit, Lomé, Togo" }, d: { fr: "Modération de panel avec Delphine Traoré (CEO, SanlamAllianz), Abiola Bawuah (CEO, UBA), Wilfrid Abiola (Country Representative, AFDB), Sibi Lawson (Deputy CEO, AGF-WA), Coura Carine Sene (CEO Africa, Wave).", en: "Panel moderation with Delphine Traoré (CEO, SanlamAllianz), Abiola Bawuah (CEO, UBA), Wilfrid Abiola (Country Representative, AFDB), Sibi Lawson (Deputy CEO, AGF-WA), Coura Carine Sene (CEO Africa, Wave)." } },
  ouattara: { src: "/brand/gtm/field-6.jpg?v=2", t: { fr: "Cocktail privé, Abidjan, Côte d'Ivoire", en: "Private cocktail, Abidjan, Côte d'Ivoire" }, d: { fr: "Rencontre avec la Première dame de Côte d'Ivoire.", en: "Meeting with the First Lady of Côte d'Ivoire." } },
  wwfc: { src: "/brand/gtm/field-21.jpg", t: { fr: "Women Working for Change, Abidjan, Côte d'Ivoire", en: "Women Working for Change, Abidjan, Côte d'Ivoire" }, d: { fr: "Ecobank, Bank of Kigali, Transcorp, Zambia National Commercial Bank.", en: "Ecobank, Bank of Kigali, Transcorp, Zambia National Commercial Bank." } },
  doha: { src: "/brand/gtm/field-13.jpg?v=3", pos: "center 30%", t: { fr: "Web Summit, Doha, Qatar", en: "Web Summit, Doha, Qatar" }, d: { fr: "C'est là qu'un fonds américain a rejoint Kupanda.", en: "Where a US fund joined Kupanda." } },
  nairobi: { src: "/brand/gtm/field-5.jpg", href: "https://www.elysee.fr/emmanuel-macron/2026/05/06/sommet-africa-forward-partenariats-entre-lafrique-et-la-france-pour-linnovation-et-la-croissance", t: { fr: "Africa Forward, Nairobi, Kenya", en: "Africa Forward, Nairobi, Kenya" }, d: { fr: "Sommet France, Kenya, avec la délégation présidentielle française.", en: "France, Kenya summit, with the French presidential delegation." } },
  changeNow: { src: "/brand/gtm/field-3.jpg?v=2", t: { fr: "ChangeNOW, Grand Palais, Paris, France", en: "ChangeNOW, Grand Palais, Paris, France" }, d: { fr: "Africa for Change, modération de panel.", en: "Africa for Change, panel moderation." } },
  cotonou: { src: "/brand/gtm/field-16.jpg", t: { fr: "Rencontre privée, Cotonou, Bénin", en: "Private meeting, Cotonou, Benin" }, d: { fr: "Particuliers fortunés et corporates.", en: "Wealthy individuals and corporates." } },
  conakry: { src: "/brand/gtm/field-17.jpg", t: { fr: "Rencontre privée, Conakry, Guinée", en: "Private meeting, Conakry, Guinea" }, d: { fr: "Corporates et investisseurs.", en: "Corporates and investors." } },
  paloneo: { src: "/brand/gtm/field-18.jpg", href: "https://www.paloneo.org", t: { fr: "Sommet Paloneo, Hambourg, Allemagne", en: "Paloneo Summit, Hamburg, Germany" }, d: { fr: "Partenaire du WEF ; table ronde Afrique animée avec Launch Africa.", en: "WEF partner; Africa round table hosted with Launch Africa." } },
  marrakech: { src: "/brand/gtm/field-19.jpg", t: { fr: "Rencontre privée, Marrakech, Maroc", en: "Private meeting, Marrakech, Morocco" }, d: { fr: "Diaspora et investisseurs.", en: "Diaspora and investors." } },
  onChain: { src: "/brand/gtm/field-10.jpg?v=2", href: "https://www.50partners.fr/programmes/web3", t: { fr: "50 Days on Chain, Paris, France", en: "50 Days on Chain, Paris, France" }, d: { fr: "Panel de présentation de Minah.", en: "Panel presenting Minah." } },
  delubac: { src: "/brand/gtm/field-11.jpg", t: { fr: "Prix Cyrille Bialkiewicz, Paris, France", en: "Cyrille Bialkiewicz Prize, Paris, France" }, d: { fr: "Remis par la Banque Delubac.", en: "Awarded by Banque Delubac." } },
  circleGP: { src: "/brand/gtm/field-14.jpg?v=2", pos: "center 22%", t: { fr: "Minah Circle, Grand Palais, Paris, France", en: "Minah Circle, Grand Palais, Paris, France" }, d: { fr: "L'écosystème investisseur de ChangeNOW.", en: "ChangeNOW's investor ecosystem." } },
  circleLome: { src: "/brand/gtm/field-15.jpg?v=2", pos: "center 38%", t: { fr: "Minah Circle, Lomé, Togo", en: "Minah Circle, Lomé, Togo" }, d: { fr: "L'écosystème tech et corporate de Lomé.", en: "Lomé's tech and corporate ecosystem." } },
  circleParis: { src: "/brand/gtm/field-12.jpg?v=3", pos: "center 40%", t: { fr: "Minah Circle, Paris, France", en: "Minah Circle, Paris, France" }, d: { fr: "Le rendez-vous annuel, avec ChangeNOW et la Fondation Stellar.", en: "The annual gathering, with ChangeNOW and the Stellar Foundation." } },
  lome: { src: "/brand/gtm/field-4.jpg", t: { fr: "Congrès panafricain, Lomé, Togo", en: "Pan-African Congress, Lomé, Togo" }, d: { fr: "Prise de parole et modération.", en: "Keynote and moderation." } },
  roche: { src: "/brand/gtm/field-23.jpg", t: { fr: "Cocktail privé, Abidjan, Côte d'Ivoire", en: "Private cocktail, Abidjan, Côte d'Ivoire" }, d: { fr: "Avec Roche et des investisseurs.", en: "With Roche and investors." } },
} satisfies Record<string, Photo>;

// Blocs structurés d'un fil, pour rendre les données lisibles plutôt que de les
// noyer dans le texte (cf. la slide « Co-built deal » du deck).
/** Un niveau de protection, numéroté : titre + précision. */
export type Layer = { n: number; title: Bilingual; detail: Bilingual };
/** Le partenaire co-structurant : nom et, le cas échéant, ses dirigeants
 *  (photo : petit portrait rond, servi depuis public/partners). */
export type Partner = { name: string; logo?: string; people?: { name: string; role: Bilingual; photo?: string; href?: string }[] };
/** Un encart « liquidité qui arrive » : un montant et quelques colonnes. */
export type Panel = {
  title: Bilingual;
  amount: Bilingual;
  note: Bilingual;
  cols: { h: Bilingual; d: Bilingual }[];
};
/** Une stratégie à venir, présentée en carte « offre » : date d'ouverture,
 *  descriptif et une ligne de métriques (rendement, ticket, allocation…). */
// Carte « stratégie » unifiée : Kupanda comme Esgni passent par là, pour une
// présentation identique (en-tête, descriptif, cases chiffrées, protections).
export type Offering = {
  name: Bilingual;
  tag?: Bilingual;
  /** Logos des partenaires nommés de la stratégie (TLG, Enko), affichés en
   *  tête de carte à la place du tag texte. */
  logos?: { src: string; name: string }[];
  /** Badge d'état, ex. « LIVE », « ACCORD SIGNÉ », « OUVRE LE 26 JANV. 2027 ». */
  status?: Bilingual;
  /** Descriptif (peut porter des **gras**). */
  subtitle?: Bilingual;
  /** Cases chiffrées, une par métrique ; `accent` colore la case en orange. */
  metrics: { k: Bilingual; v: Bilingual; accent?: boolean }[];
  /** Niveaux de protection du risque (Kupanda). */
  layers?: Layer[];
  /** Co-structurant mis en tête de la carte (Africa Rise). */
  partner?: Partner;
  /** Scale-ups et opérateurs rattachés à la stratégie (Esgni), avec leur
   *  intitulé de sous-bloc. */
  companies?: { title: Bilingual; list: Company[] };
  note?: Bilingual;
};
/** Une scale-up ou un opérateur, sous-jacent des stratégies : secteur et
 *  quelques chiffres clés, dans la même grammaire que les autres cartes. */
export type Company = {
  name: Bilingual;
  tag: Bilingual;
  figs: Bilingual[];
  aConfirmer?: boolean;
};
/** Un levier de la machine réseau : intitulé, chiffre-phare, une phrase. Mise
 *  en page en cartes, pour ne pas laisser le récit en bloc de texte. */
/** Un événement clé où Minah veut être présente : nom, lieu (ville, pays) et
 *  dates, une phrase. Logo et site quand on les a. */
export type EventCard = {
  name: Bilingual;
  where: Bilingual;
  text: Bilingual;
  logo?: string;
  href?: string;
};
export type Lever = {
  title: Bilingual;
  metric: Bilingual;
  text: Bilingual;
};

export type Chapter = {
  /** Le récit du fil sur la phase. Les **gras** sont les noms que l'on peut écrire. */
  text: Bilingual;
  /** Résumé pour la vue d'ensemble : quand `text` n'est qu'une phrase
   *  d'accroche avant des blocs, la grille affiche ce résumé complet. */
  summary?: Bilingual;
  /** Nœud de convergence dessiné sous les cartes de leviers : toutes les
   *  sources convergent vers la même infrastructure (phase 3, liquidité). */
  hub?: { title: Bilingual; sub: Bilingual };
  /** Graphique de scission : une position se découpe (principal, rendement)
   *  puis circule sur le marché secondaire (Road to 1 Md€, distribution). */
  split?: {
    source: Bilingual;
    parts: Bilingual[];
    market: { title: Bilingual; sub: Bilingual };
    badges: Bilingual[];
  };
  photos?: Photo[];
  /** Groupes de photos titrés, quand il faut séparer deux familles (les
   *  événements où Minah est présente vs nos propres événements). */
  photoGroups?: { title: Bilingual; photos: Photo[] }[];
  /** Note de clôture du fil (comparables, précision), en petit sous les blocs. */
  footnote?: Bilingual;
  /** Encart « liquidité qui arrive ». */
  panel?: Panel;
  /** Stratégies à venir, en cartes « offre » (Esgni). */
  offerings?: Offering[];
  /** Scale-ups et opérateurs sous-jacents (Wave, Yango, Julaya…). */
  companies?: Company[];
  /** Leviers de la machine réseau, en cartes (distribution). */
  levers?: Lever[];
  /** Événements clés où Minah veut être présente, avec un intitulé de bloc. */
  events?: { title: Bilingual; list: EventCard[] };
  /** Échelle d'évolution des Minah Circles (CIRCLES_PATH), avec la phase dont
   *  c'est l'étape en cours : les précédentes sont acquises, les suivantes à venir. */
  ladder?: GrowthPhase;
  /** Forcer l'affichage de la grille d'acteurs même avec des blocs chiffrés.
   *  Par défaut, la grille s'efface dès qu'un bloc chiffré porte l'info. */
  showActors?: boolean;
  /** Hypothèse à valider par l'équipe. */
  aConfirmer?: boolean;
};

// ── L'évolution des Minah Circles, phase par phase ───────────────────────────
// Dessinée dans le volet Marché des phases 2 à 4 : chaque phase y est une étape.
export const CIRCLES_PATH: {
  title: Bilingual;
  steps: { phase: GrowthPhase; title: Bilingual; sub: Bilingual }[];
} = {
  title: { fr: "Les Minah Circles, étape par étape", en: "The Minah Circles, step by step" },
  steps: [
    {
      phase: "amorcage",
      title: { fr: "Rencontres en petit comité", en: "Small-group gatherings" },
      sub: { fr: "Événements investisseurs tenus au Grand Palais (Paris, France) et à Lomé (Togo).", en: "Investor events held at the Grand Palais (Paris, France) and in Lomé (Togo)." },
    },
    {
      phase: "traction",
      title: { fr: "Une montée en gamme, de nouvelles villes", en: "A higher tier, new cities" },
      sub: { fr: "Les meilleurs investisseurs, des éditions à Davos (Suisse), New York (États-Unis), Paris (France) et Abidjan (Côte d'Ivoire), et d'autres événements qui s'ouvrent.", en: "Top investors, editions in Davos (Switzerland), New York (United States), Paris (France) and Abidjan (Côte d'Ivoire), and other events opening up." },
    },
    {
      phase: "distribution",
      title: { fr: "Un vrai forum", en: "A real forum" },
      sub: { fr: "Un forum annuel des investisseurs, tandis que les rencontres privées continuent dans leurs villes dédiées. Nous sommes invités aux grands événements mondiaux.", en: "An annual investor forum, while the private gatherings continue in their dedicated cities. We are invited to the key global events." },
    },
    {
      phase: "marche",
      title: { fr: "L'un des plus gros forums", en: "One of the biggest forums" },
      sub: { fr: "Le Minah Forum compte parmi les plus gros, et nous restons invités aux grands événements mondiaux.", en: "The Minah Forum stands among the biggest, and we remain invited to the key global events." },
    },
  ],
};

// ── L'intro de la fiche : le réseau des fondateurs, premier actif ───────────
export const FOUNDERS_INTRO = {
  title: { fr: "Notre premier actif : le réseau des fondateurs", en: "Our first asset: the founders' network" },
  body: {
    fr: "Six ans de carrière, poste après poste, relation après relation : un réseau propriétaire, gagné et difficile à copier, que la levée met en mouvement. Les deux côtés de la machine sont d'abord deux personnes.",
    en: "Six years of careers, role after role, relationship after relationship: a proprietary network, earned and hard to copy, that the raise sets in motion. The two sides of the machine are, first, two people.",
  },
  people: [
    {
      name: "Coralie",
      side: { fr: "Écosystèmes & investisseurs", en: "Ecosystems & investors" },
      text: {
        fr: "A passé sa carrière à construire les écosystèmes, en Afrique comme à l'international, où se rencontrent dirigeants, CEO, institutionnels et investisseurs qui travaillent avec et sur le continent – dont l'Africa CEO Forum, le réseau réservé aux entreprises de plus de 10 M$ de chiffre d'affaires annuel.",
        en: "Spent her career building the ecosystems, in Africa and internationally, where the leaders, CEOs, institutions and investors working with and on the continent meet – among them the Africa CEO Forum, the network reserved for companies above $10M in annual turnover.",
      },
    },
    {
      name: "Julien",
      side: { fr: "Capital institutionnel & on-chain", en: "Institutional & on-chain capital" },
      text: {
        fr: "Connecté aux écosystèmes blockchain et aux institutionnels européens et nord-américains : il a investi 500 M€ en fonds de fonds chez Bpifrance.",
        en: "Plugged into the blockchain ecosystems and European & North American institutions: he invested €500M in fund-of-funds at Bpifrance.",
      },
    },
  ],
} as const;

export const NARRATIVE: Record<GrowthPhase, Record<Stream, Chapter>> = {
  amorcage: {
    distribution: {
      text: {
        fr: "Du réseau direct des fondateurs aux professionnels qui souscrivent en ligne, en trois temps.",
        en: "From the founders' direct network to professionals subscribing online, in three steps.",
      },
      summary: {
        fr: "Le réseau direct des fondateurs (moins de dix investisseurs), puis les professionnels en ligne : dix investisseurs qualifiés introduits par les Network Builders, Sereel sur l'API, un broker londonien sur Kupanda I et II. 5 M€ de liquidité d'ici novembre.",
        en: "The founders' direct network (under ten investors), then professionals online: ten qualified investors introduced by the Network Builders, Sereel on the API, a London broker on Kupanda I and II. €5M of liquidity by November.",
      },
      levers: [
        {
          title: { fr: "Le réseau direct des fondateurs", en: "The founders' direct network" },
          metric: { fr: "< 10 investisseurs", en: "< 10 investors" },
          text: { fr: "Des particuliers fortunés de la diaspora, rencontrés en rendez-vous privés à **Paris**, **Cotonou**, **Conakry**, **Marrakech** – la preuve que le parcours tient de bout en bout.", en: "Wealthy diaspora individuals met in private meetings in **Paris**, **Cotonou**, **Conakry**, **Marrakech** – proof that the journey holds end to end." },
        },
        {
          title: { fr: "Les investisseurs professionnels", en: "Professional investors" },
          metric: { fr: "10 investisseurs qualifiés", en: "10 qualified investors" },
          text: { fr: "La plateforme bascule vers les professionnels, qui souscrivent en ligne : les **Network Builders**, brokers et banquiers privés, les ont déjà introduits.", en: "The platform turns to professionals, who subscribe online: the **Network Builders**, brokers and private bankers, have already introduced them." },
        },
        {
          title: { fr: "Sereel, premier protocole", en: "Sereel, first protocol" },
          metric: { fr: "API", en: "API" },
          text: { fr: "Le premier protocole partenaire distribue les stratégies à ses propres clients via l'API.", en: "The first partner protocol distributes the strategies to its own clients through the API." },
        },
        {
          title: { fr: "Broker londonien", en: "London broker" },
          metric: { fr: "Tickets de 5 M€", en: "€5M tickets" },
          text: { fr: "Un broker londonien aligne des tickets pour finaliser le placement de Kupanda I et Kupanda II.", en: "A London broker is lining up tickets to finalise the placement of Kupanda I and Kupanda II." },
        },
      ],
      panel: {
        title: { fr: "La liquidité qui arrive", en: "Liquidity coming in" },
        amount: { fr: "5 M€", en: "€5M" },
        note: { fr: "d'ici novembre", en: "by November" },
        cols: [
          { h: { fr: "Brokers", en: "Brokers" }, d: { fr: "Placement auprès d'institutions", en: "Placement with institutions" } },
          { h: { fr: "5 Network Builders", en: "5 Network Builders" }, d: { fr: "Apportent le capital", en: "Bringing capital in" } },
        ],
      },
      photos: [P.cotonou, P.conakry, P.marrakech],
    },
    sous_jacents: {
      text: {
        fr: "Notre première stratégie, déjà live.",
        en: "Our first strategy, already live.",
      },
      summary: {
        fr: "Kupanda, live : 2 M€ à 12 mois, 20 % annuel, des PME sous contrats d'État en Zambie, cinq niveaux de protection. Co-construit avec Africa Rise, 10 M$ déjà investis sans défaut.",
        en: "Kupanda, live: €2M over 12 months, 20% annual, SMEs under State contracts in Zambia, five layers of protection. Co-built with Africa Rise, $10M already invested without default.",
      },
      showActors: false,
      offerings: [
        {
          name: { fr: "Kupanda", en: "Kupanda" },
          tag: { fr: "Dette privée · 12 mois", en: "Private debt · 12 months" },
          status: { fr: "LIVE", en: "LIVE" },
          subtitle: {
            fr: "Un contrat cadre signé avec la **République de Zambie**, une obligation in fine de 2 M€ à 12 mois, 20 % annuel, adossée à des contrats publics déjà attribués. La contrepartie finale est un État, et le contrat est dans la data room. Le deal est co-construit avec **Africa Rise**, qui source et déploie sur le terrain – avec 10 M$ déjà investis, sans aucun défaut.",
            en: "A framework agreement signed with the **Republic of Zambia**, a €2M 12-month bullet bond at 20% annual, backed by already-awarded public contracts. The final counterparty is a State, and the contract is in the data room. The deal is co-built with **Africa Rise**, which sources and deploys on the ground – with $10M invested without default.",
          },
          partner: {
            name: "Africa Rise",
            people: [
              { name: "Fabien Anthony", role: { fr: "CIO · Managing Partner", en: "CIO · Managing Partner" }, photo: "/partners/africa-rise-fabien.jpg", href: "https://www.linkedin.com/in/fabienanthony/" },
              { name: "Osa Aihie", role: { fr: "COO · Managing Partner", en: "COO · Managing Partner" }, photo: "/partners/africa-rise-osa.jpg", href: "https://www.linkedin.com/in/osaaihie/" },
            ],
          },
          metrics: [
            { k: { fr: "Montant", en: "Amount" }, v: { fr: "2 M€", en: "€2M" }, accent: true },
            { k: { fr: "Durée", en: "Duration" }, v: { fr: "12 mois", en: "12 mo" } },
            { k: { fr: "Coupon fixe", en: "Fixed coupon" }, v: { fr: "20 %", en: "20%" } },
            { k: { fr: "Dernier closing", en: "Latest closing" }, v: { fr: "500 K€", en: "€500K" } },
            { k: { fr: "Zambie · État", en: "Zambia · Gov." }, v: { fr: "PME", en: "SMEs" } },
            { k: { fr: "Niveaux de protection", en: "Layers of protection" }, v: { fr: "5", en: "5" } },
          ],
          layers: [
            { n: 1, title: { fr: "Performance bond", en: "Performance bond" }, detail: { fr: "Sous-performance d'une PME", en: "SME underperformance" } },
            { n: 2, title: { fr: "Assurance-crédit", en: "Credit default insurance" }, detail: { fr: "Défaut du payeur", en: "Off-payer default" } },
            { n: 3, title: { fr: "Recours direct ministère", en: "Direct ministry recourse" }, detail: { fr: "Lettres d'engagement", en: "Engagement letters" } },
            { n: 4, title: { fr: "Swap de change · Zanaco", en: "Currency swap · Zanaco" }, detail: { fr: "ZMW / USD", en: "ZMW / USD" } },
            { n: 5, title: { fr: "Réserve de trésorerie", en: "Cash reserve" }, detail: { fr: "Détenue par Africa Rise", en: "Held by Africa Rise" } },
          ],
        },
      ],
      photos: [P.doha],
    },
    marche: {
      text: {
        fr: "Les tables où se concentre le capital : **Davos**, en parallèle du World Economic Forum, à l'Africa House et à l'Africa Collective ; l'**Africa CEO Forum** à Abidjan, réservé aux entreprises de plus de 10 M€ de chiffre d'affaires ; l'**Élysée**, pour une rencontre privée avec le président de la République et la diaspora ; **ChangeNOW** au Grand Palais ; le **Web Summit** à Doha.",
        en: "The tables where capital gathers: **Davos**, alongside the World Economic Forum, at Africa House and the Africa Collective; the **Africa CEO Forum** in Abidjan, reserved for companies above €10M revenue; the **Élysée**, for a private meeting with the French President and the diaspora; **ChangeNOW** at the Grand Palais; the **Web Summit** in Doha.",
      },
      photoGroups: [
        {
          title: { fr: "Nos événements : les Minah Circles", en: "Our events: the Minah Circles" },
          photos: [P.circleParis, P.circleGP, P.circleLome],
        },
        {
          title: { fr: "Les événements où Minah était présente (2026)", en: "The events where Minah showed up (2026)" },
          photos: [P.africaHouse, P.ceoForum, P.elysee, P.changeNow, P.ouattara, P.roche, P.africaCollective, P.paloneo, P.nairobi, P.afis, P.onChain, P.lome],
        },
      ],
    },
  },
  traction: {
    distribution: {
      text: {
        fr: "Côté capital, la machine réseau prend forme.",
        en: "On the capital side, the network machine takes shape.",
      },
      summary: {
        fr: "La machine réseau prend forme : les Network Builders passent de 5 à 25, trois accords on-chain (Stellar, Canton Network), trois protocoles de plus sur l'API, cinq accords de distribution brokers. Le volume passe de 2 à 50 M€.",
        en: "The network machine takes shape: Network Builders grow from 5 to 25, three on-chain agreements (Stellar, Canton Network), three more protocols on the API, five broker distribution agreements. Volume grows from €2M to €50M.",
      },
      levers: [
        {
          title: { fr: "Network Builders", en: "Network Builders" },
          metric: { fr: "5 → 25", en: "5 → 25" },
          text: { fr: "Les Network Builders passent à vingt-cinq apporteurs actifs, répartis partout dans le monde.", en: "The Network Builders grow to twenty-five active introducers, spread across the world." },
        },
        {
          title: { fr: "On-chain : le canal s'ouvre", en: "On-chain: the channel opens" },
          metric: { fr: "3 accords on-chain", en: "3 on-chain agreements" },
          text: { fr: "Ce n'est que le début, et la vision est déjà enclenchée. Premier signal, **Stellar** : un investissement de 2 M$ en discussion dans Kupanda, et Minah comme son canal d'investissement en Afrique. Deuxième, **Canton Network**, second rail institutionnel : les discussions sont engagées. L'enjeu : brancher les **30 Md$** de liquidité on-chain sur nos stratégies – aucun canal comme le nôtre n'existe vers l'Afrique.", en: "This is just the start, and the vision is already underway. First signal, **Stellar**: a $2M investment in discussion into Kupanda, and Minah as its investment channel in Africa. Second, **Canton Network**, a second institutional rail: discussions are engaged. The stake: connecting the **$30B** of on-chain liquidity to our strategies – no channel like ours exists toward Africa." },
        },
        {
          title: { fr: "API", en: "API" },
          metric: { fr: "+3 protocoles", en: "+3 protocols" },
          text: { fr: "Trois protocoles de plus se branchent sur l'API, sur le modèle de Sereel ; un partenaire bancaire assure les entrées et sorties en euros pour les souscripteurs sans wallet.", en: "Three more protocols connect to the API, on the Sereel model; a banking partner handles euro on- and off-ramps for subscribers without a wallet." },
        },
        {
          title: { fr: "Brokers", en: "Brokers" },
          metric: { fr: "5 accords de distribution", en: "5 distribution agreements" },
          text: { fr: "Après le premier test avec **Atlantic Financial**, broker londonien qui place des tickets de 1 à 4 M€ dans Kupanda, nous signons cinq accords de distribution : des brokers qui placent nos stratégies auprès de leurs clients institutionnels.", en: "After the first test with **Atlantic Financial**, the London broker placing €1–4M tickets into Kupanda, we sign five distribution agreements: brokers placing our strategies with their institutional clients." },
        },
      ],
      panel: {
        title: { fr: "Volume", en: "Volume" },
        amount: { fr: "2 → 50 M€", en: "€2M → €50M" },
        note: { fr: "en cours", en: "underway" },
        cols: [],
      },
      footnote: {
        fr: "Ce n'est pas inédit : TLG Capital (~120 M$, adossé à IFC et Proparco), Cauris et Enko ont atteint 100 M€+ dans cette même classe d'actifs. Le chemin est connu ; notre différence est la distribution.",
        en: "This is not unprecedented: TLG Capital (~$120M, backed by IFC and Proparco), Cauris and Enko reached €100M+ in this same asset class. The path is known; our difference is distribution.",
      },
    },
    sous_jacents: {
      text: {
        fr: "Trois stratégies en structuration.",
        en: "Three strategies in structuring.",
      },
      summary: {
        fr: "Trois stratégies en structuration : Kupanda II (12 M€, contrat cadre signé avec la Zambie), Esgni (15 M€, Wave et Yango en discussion), et des tranches de fonds de crédit privé (TLG Capital, Enko Capital).",
        en: "Three strategies in structuring: Kupanda II (€12M, framework signed with Zambia), Esgni (€15M, Wave and Yango in discussion), and private credit fund tranches (TLG Capital, Enko Capital).",
      },
      showActors: false,
      offerings: [
        {
          name: { fr: "Kupanda II", en: "Kupanda II" },
          tag: { fr: "Dette privée · 12 mois", en: "Private debt · 12 months" },
          status: { fr: "ACCORD SIGNÉ", en: "FRAMEWORK SIGNED" },
          subtitle: {
            fr: "Un contrat cadre signé avec la **République de Zambie**, une obligation in fine de 12 M€ à 12 mois, 20 % annuel, adossée à des contrats publics déjà attribués. La contrepartie finale est un État, et le contrat est dans la data room. Financement en fonds de roulement de sociétés des secteurs infrastructure et énergie en Afrique de l'Est, adossées à des accords gouvernementaux.",
            en: "A framework agreement signed with the **Republic of Zambia**, a €12M 12-month bullet bond at 20% annual, backed by already-awarded public contracts. The final counterparty is a State, and the contract is in the data room. Working-capital financing for infrastructure and energy companies in East Africa, backed by government agreements.",
          },
          metrics: [
            { k: { fr: "Montant", en: "Amount" }, v: { fr: "12 M€", en: "€12M" }, accent: true },
            { k: { fr: "Durée", en: "Duration" }, v: { fr: "12 mois", en: "12 mo" } },
            { k: { fr: "Coupon fixe", en: "Fixed coupon" }, v: { fr: "20 %", en: "20%" } },
            { k: { fr: "Afrique de l'Est", en: "East Africa" }, v: { fr: "Infra · Énergie", en: "Infra · Energy" } },
            { k: { fr: "Zambie · État", en: "Zambia · Gov." }, v: { fr: "PME", en: "SMEs" } },
            { k: { fr: "Niveaux de protection", en: "Layers of protection" }, v: { fr: "5", en: "5" } },
          ],
          layers: [
            { n: 1, title: { fr: "Performance bond", en: "Performance bond" }, detail: { fr: "Sous-performance d'une PME", en: "SME underperformance" } },
            { n: 2, title: { fr: "Assurance-crédit", en: "Credit default insurance" }, detail: { fr: "Défaut du payeur", en: "Off-payer default" } },
            { n: 3, title: { fr: "Recours direct ministère", en: "Direct ministry recourse" }, detail: { fr: "Lettres d'engagement", en: "Engagement letters" } },
            { n: 4, title: { fr: "Swap de change · Zanaco", en: "Currency swap · Zanaco" }, detail: { fr: "ZMW / USD", en: "ZMW / USD" } },
            { n: 5, title: { fr: "Réserve de trésorerie", en: "Cash reserve" }, detail: { fr: "Détenue par Africa Rise", en: "Held by Africa Rise" } },
          ],
        },
        {
          name: { fr: "Esgni", en: "Esgni" },
          tag: { fr: "Dette privée diversifiée · 24 mois", en: "Diversified private debt · 24 months" },
          status: { fr: "OUVRE LE 26 JANV. 2027", en: "OPENS JAN 26, 2027" },
          subtitle: { fr: "Capital risque pour startups technologiques innovantes", en: "Venture capital for innovative tech startups" },
          metrics: [
            { k: { fr: "Rendement cible", en: "Target yield" }, v: { fr: "9 – 15 %", en: "9 – 15%" } },
            { k: { fr: "Ticket minimum", en: "Minimum ticket" }, v: { fr: "À définir", en: "To be defined" } },
            { k: { fr: "Allocation", en: "Allocation" }, v: { fr: "15,0 M€", en: "€15.0M" } },
            { k: { fr: "Durée", en: "Term" }, v: { fr: "24 mois", en: "24 months" } },
          ],
          companies: {
            title: { fr: "Scale-ups & opérateurs – en discussion pour devenir nos sous-jacents", en: "Scale-ups & operators – in discussion to become our underlyings" },
            list: [
              {
                name: { fr: "Wave", en: "Wave" },
                tag: { fr: "Paiements mobiles", en: "Mobile money" },
                figs: [
                  { fr: "Licorne, 1,7 Md$", en: "Unicorn, $1.7B" },
                  { fr: "~38 % de la valeur mobile UEMOA (~267 Md$/an)", en: "~38% of WAEMU mobile-money value (~$267B/yr)" },
                  { fr: "10 M+ d'utilisateurs", en: "10M+ users" },
                ],
              },
              {
                name: { fr: "Yango", en: "Yango" },
                tag: { fr: "Super-app", en: "Super-app" },
                figs: [
                  { fr: "~4 Md$ générés par ses chauffeurs (2024)", en: "~$4B earned by its drivers (2024)" },
                  { fr: "13+ pays africains", en: "13+ African countries" },
                  { fr: "Mobilité → paiements & fintech", en: "Mobility → payments & fintech" },
                ],
              },
              {
                name: { fr: "Julaya", en: "Julaya" },
                tag: { fr: "Fintech B2B", en: "B2B fintech" },
                figs: [
                  { fr: "Paiements numériques pour les entreprises", en: "Digital payments for businesses" },
                  { fr: "Côte d'Ivoire & Sénégal, zone UEMOA", en: "Côte d'Ivoire & Senegal, WAEMU" },
                  { fr: "PME et grands comptes", en: "SMEs and large accounts" },
                ],
                aConfirmer: true,
              },
              {
                name: { fr: "Caterpillar Afrique", en: "Caterpillar Africa" },
                tag: { fr: "Équipement lourd", en: "Heavy equipment" },
                figs: [
                  { fr: "Leader mondial", en: "Global leader" },
                  { fr: "Présent sur tout le continent", en: "Present across the continent" },
                  { fr: "Flux de trésorerie massifs", en: "Massive cash flows" },
                ],
              },
            ],
          },
        },
        {
          name: { fr: "Tranches de crédit privé", en: "Private credit tranches" },
          logos: [
            { src: "/partners/tlg.png", name: "TLG Capital" },
            { src: "/partners/enko.png", name: "Enko Capital" },
          ],
          status: { fr: "EN DISCUSSION", en: "IN DISCUSSION" },
          subtitle: {
            fr: "En discussion avec des fonds de crédit privé comme **TLG Capital** et **Enko Capital** : des tranches prises dans leurs opérations, distribuées à notre réseau, avec d'autres fonds de crédit privé à venir.",
            en: "In discussion with private credit funds such as **TLG Capital** and **Enko Capital**: tranches taken in their operations, distributed to our network, with more private credit funds to come.",
          },
          metrics: [
            { k: { fr: "Tranche TLG", en: "TLG tranche" }, v: { fr: "20 M€", en: "€20M" }, accent: true },
            { k: { fr: "Distribution", en: "Distribution" }, v: { fr: "Notre réseau", en: "Our network" } },
            { k: { fr: "Partenaires", en: "Partners" }, v: { fr: "TLG · Enko · d'autres à venir", en: "TLG · Enko · more to come" } },
          ],
        },
      ],
    },
    marche: {
      text: {
        fr: "Les **Minah Circles** montent en gamme : toujours des événements investisseurs en petit comité, déjà tenus au Grand Palais et à Lomé, ils deviennent des rendez-vous incontournables de l'écosystème de la dette et attirent les meilleurs investisseurs. Les éditions gagnent de nouvelles villes, **Davos**, **New York** et **Abidjan**, aux côtés de **Paris**. D'autres événements s'ouvrent à nous à travers le monde – plus privés, plus exclusifs – où participer et prendre la parole.",
        en: "The **Minah Circles** move up a tier: still small-group investor events, already held at the Grand Palais and in Lomé, they become must-attend gatherings of the debt ecosystem, attracting top investors. Editions reach new cities, **Davos**, **New York** and **Abidjan**, alongside **Paris**. Other events open up to us across the world – more private, more exclusive – to attend and speak at.",
      },
      ladder: "traction",
      summary: {
        fr: "Les Minah Circles deviennent des rendez-vous incontournables de l'écosystème de la dette, à Davos, New York, Paris et Abidjan. En parallèle, des événements clés où participer et prendre la parole : AFSIC et le Financial Times Africa Summit à Londres, et d'autres à travers le monde.",
        en: "The Minah Circles become must-attend gatherings of the debt ecosystem, in Davos, New York, Paris and Abidjan. Alongside, key events to attend and speak at: AFSIC and the Financial Times Africa Summit in London, and others across the world.",
      },
      events: {
        title: { fr: "Événements clés où participer et prendre la parole", en: "Key events to attend and speak at" },
        list: [
          {
            name: { fr: "AFSIC – Investing in Africa", en: "AFSIC – Investing in Africa" },
            where: { fr: "Londres, Royaume-Uni", en: "London, United Kingdom" },
            text: { fr: "Réunit les investisseurs mondiaux et les grands secteurs de l'Afrique.", en: "Brings together global investors and Africa's leading sectors." },
            href: "https://www.afsic.net",
          },
          {
            name: { fr: "Financial Times Africa Summit", en: "Financial Times Africa Summit" },
            where: { fr: "Londres, Royaume-Uni", en: "London, United Kingdom" },
            text: { fr: "Le sommet Afrique du Financial Times : chefs d'État, décideurs publics, dirigeants et investisseurs.", en: "The Financial Times' flagship Africa summit: heads of state, policymakers, chief executives and investors." },
          },
          {
            name: { fr: "D'autres événements à travers le monde", en: "More events across the world" },
            where: { fr: "Partout dans le monde", en: "Across the world" },
            text: { fr: "Des événements plus privés et plus exclusifs, où participer et prendre la parole.", en: "More private, more exclusive events, to attend and speak at." },
          },
        ],
      },
      showActors: false,
    },
  },
  distribution: {
    distribution: {
      text: {
        fr: "Côté liquidité, toutes les sources de capital convergent sur la même infrastructure :",
        en: "On the liquidity side, every source of capital converges on the same infrastructure:",
      },
      summary: {
        fr: "Toutes les liquidités convergent sur la même infrastructure : on-chain, acteurs traditionnels et large allocators (ancre DFI ou fonds de fonds), fonds et institutions par l'API, jusqu'aux agents IA.",
        en: "Every liquidity converges on the same infrastructure: on-chain, traditional players and large allocators (DFI or fund-of-funds anchor), funds and institutions through the API, all the way to AI agents.",
      },
      hub: {
        title: { fr: "Minah – une seule infrastructure", en: "Minah – one infrastructure" },
        sub: { fr: "Moteur de structuration : coupon, protections, maturité", en: "Structuring engine: coupon, protections, maturity" },
      },
      levers: [
        {
          title: { fr: "Liquidité on-chain", en: "On-chain liquidity" },
          metric: { fr: "30 Md$", en: "$30B" },
          text: { fr: "Les allocataires crypto-natifs investissent directement dans le vault.", en: "Crypto-native allocators invest directly into the vault." },
        },
        {
          title: { fr: "Acteurs traditionnels & large allocators", en: "Traditional players & large allocators" },
          metric: { fr: "Ancre DFI · fonds de fonds", en: "DFI · fund-of-funds anchor" },
          text: { fr: "La liquidité des acteurs traditionnels ; une ancre DFI ou fonds de fonds, et les licences supplémentaires qui débloquent les plus gros tickets.", en: "Liquidity from traditional players; a DFI or fund-of-funds anchor, and the additional licences that unlock the largest tickets." },
        },
        {
          title: { fr: "Fonds & institutions, par l'API", en: "Funds & institutions, through the API" },
          metric: { fr: "API directe", en: "Direct API" },
          text: { fr: "Ils souscrivent en direct par l'API, branchés sur leurs propres systèmes.", en: "They subscribe directly through the API, plugged into their own systems." },
        },
        {
          title: { fr: "Agents IA", en: "AI agents" },
          metric: { fr: "Le même rail API", en: "The same API rail" },
          text: { fr: "Jusqu'aux **agents IA**, qui parcourent les stratégies et souscrivent – l'API est ouverte aux machines comme aux institutions.", en: "All the way to **AI agents**, which browse the strategies and subscribe – the API is open to machines as it is to institutions." },
        },
      ],
      showActors: false,
      aConfirmer: true,
    },
    sous_jacents: {
      text: {
        fr: "Côté sous-jacents, la même logique – trois sources d'actifs convergent :",
        en: "On the underlying side, the same logic – three sources of assets converge:",
      },
      summary: {
        fr: "La même logique côté actifs : tranches de fonds de crédit privé, PME sous contrats publics, fintechs africaines. Au total, 100 M€ d'AUM tracés on-chain de bout en bout.",
        en: "The same logic on the asset side: private credit fund tranches, SMEs under government contracts, African fintechs. In total, €100M AUM tracked on-chain end to end.",
      },
      levers: [
        {
          title: { fr: "Tranches de fonds de crédit privé", en: "Private credit fund tranches" },
          metric: { fr: "TLG · Enko · + d'autres fonds", en: "TLG · Enko · + more funds" },
          text: { fr: "Les tranches prises dans leurs opérations, distribuées à notre réseau – et des deals avec d'autres fonds de crédit privé, qui s'ajoutent à ceux de TLG et d'Enko.", en: "Tranches taken in their operations, distributed to our network – and deals with other private credit funds too, on top of TLG's and Enko's." },
        },
        {
          title: { fr: "PME sous contrats publics", en: "SMEs under government contracts" },
          metric: { fr: "Cadre Kupanda", en: "Kupanda framework" },
          text: { fr: "Le cadre éprouvé en Zambie, répliqué dans d'autres pays.", en: "The framework proven in Zambia, replicated in other countries." },
        },
        {
          title: { fr: "Fintechs africaines", en: "African fintechs" },
          metric: { fr: "Empruntent au vault", en: "Borrow from the vault" },
          text: { fr: "Les scale-ups génératrices de cash deviennent les sous-jacents de nos stratégies.", en: "Cash-generative scale-ups become the underlyings of our strategies." },
        },
      ],
      panel: {
        title: { fr: "Au total", en: "In total" },
        amount: { fr: "100 M€ d'AUM", en: "€100M AUM" },
        note: { fr: "tracés on-chain de bout en bout", en: "tracked on-chain end to end" },
        cols: [
          { h: { fr: "Portés par l'équipe la mieux placée pour ouvrir ces portes", en: "Carried by the team best placed to open these doors" }, d: { fr: "C'est ça, Minah.", en: "That's Minah." } },
        ],
      },
      aConfirmer: true,
    },
    marche: {
      text: {
        fr: "Les **Minah Circles** deviennent un vrai forum : un forum annuel des investisseurs, et les rencontres privées continuent dans leurs villes dédiées, **Davos**, **Abidjan**, **New York** et **Paris**. Minah est invitée aux grands événements mondiaux : les allocataires, fonds et institutions y rencontrent les États, les PME et les fintechs dont les deals alimentent nos stratégies, en marge des grandes tables où le capital circule déjà, l'Africa CEO Forum et le World Economic Forum.",
        en: "The **Minah Circles** become a real forum: an annual investor forum, while the private gatherings carry on in their dedicated cities, **Davos**, **Abidjan**, **New York** and **Paris**. Minah is invited to the key global events: allocators, funds and institutions meet there the States, SMEs and fintechs whose deals feed our strategies, alongside the big tables where capital already travels, the Africa CEO Forum and the World Economic Forum.",
      },
      ladder: "distribution",
      showActors: false,
      aConfirmer: true,
    },
  },
  marche: {
    distribution: {
      text: {
        fr: "Une position Minah se cède : principal et rendement séparés, marché secondaire, sortie avant l'échéance.",
        en: "A Minah position can be sold: principal and yield separated, secondary market, exit before maturity.",
      },
      summary: {
        fr: "Une position Minah se cède : principal et rendement séparés, marché secondaire, sortie avant l'échéance. Des places de liquidité et des teneurs de marché se branchent ; un token ouvre toutes les stratégies, et la dette privée africaine, d'ordinaire bloquée jusqu'à l'échéance, devient liquide.",
        en: "A Minah position can be sold: principal and yield separated, secondary market, exit before maturity. Liquidity venues and market makers plug in; one token opens every strategy, and African private debt, usually locked until maturity, becomes liquid.",
      },
      levers: [
        {
          title: { fr: "Principal et rendement séparés", en: "Principal and yield, separated" },
          metric: { fr: "Deux jambes", en: "Two legs" },
          text: { fr: "Chaque position se découpe en une jambe principal et une jambe rendement, que l'on peut détenir ou céder séparément.", en: "Each position splits into a principal leg and a yield leg, which can be held or sold separately." },
        },
        {
          title: { fr: "Marché secondaire", en: "Secondary market" },
          metric: { fr: "Entre investisseurs", en: "Between investors" },
          text: { fr: "Les positions s'échangent avant l'échéance : les places de liquidité et les teneurs de marché se branchent, les institutions aussi, en direct.", en: "Positions trade before maturity: liquidity venues and market makers plug in, and so do institutions, directly." },
        },
        {
          title: { fr: "Sortie avant l'échéance", en: "Exit before maturity" },
          metric: { fr: "Plus d'attente", en: "No more waiting" },
          text: { fr: "Un investisseur n'attend plus le terme : la dette privée africaine, d'ordinaire bloquée jusqu'à l'échéance, devient liquide.", en: "An investor no longer waits for the term: African private debt, usually locked until maturity, becomes liquid." },
        },
        {
          title: { fr: "Un token, toutes les stratégies", en: "One token, every strategy" },
          metric: { fr: "Un seul accès", en: "A single access" },
          text: { fr: "Un token ouvre toutes les stratégies Minah, du premier Kupanda aux plus récentes.", en: "One token opens every Minah strategy, from the first Kupanda to the most recent." },
        },
      ],
      split: {
        source: { fr: "Une position Minah", en: "A Minah position" },
        parts: [
          { fr: "Principal", en: "Principal" },
          { fr: "Rendement", en: "Yield" },
        ],
        market: {
          title: { fr: "Marché secondaire", en: "Secondary market" },
          sub: { fr: "Des places de liquidité et des teneurs de marché se branchent", en: "Liquidity venues and market makers plug in" },
        },
        badges: [
          { fr: "Sortie avant l'échéance", en: "Exit before maturity" },
          { fr: "Un token ouvre toutes les stratégies", en: "One token opens every strategy" },
        ],
      },
      showActors: false,
      aConfirmer: true,
    },
    sous_jacents: {
      text: {
        fr: "Un milliard d'euros d'actifs réels africains, originés par des partenaires autant que par Minah : États, PME, fintechs, dans plusieurs pays et plusieurs devises, sur une infrastructure que d'autres utilisent.",
        en: "One billion euros of African real assets, originated by partners as much as by Minah: States, SMEs, fintechs, across several countries and currencies, on an infrastructure others use.",
      },
      summary: {
        fr: "Un milliard d'euros d'actifs réels africains, originés par des partenaires autant que par Minah : États, PME, fintechs, dans plusieurs pays et plusieurs devises, sur une infrastructure que d'autres utilisent. L'équipe et les agents IA sourcent les meilleurs deals en Afrique.",
        en: "One billion euros of African real assets, originated by partners as much as by Minah: States, SMEs, fintechs, across several countries and currencies, on an infrastructure others use. The team and AI agents source the best deals in Africa.",
      },
      levers: [
        {
          title: { fr: "Originés par des partenaires", en: "Originated by partners" },
          metric: { fr: "Autant que par Minah", en: "As much as by Minah" },
          text: { fr: "Des partenaires amènent leurs propres deals sur une infrastructure que d'autres utilisent.", en: "Partners bring their own deals onto an infrastructure others use." },
        },
        {
          title: { fr: "Sourcés par l'équipe", en: "Sourced by the team" },
          metric: { fr: "Les meilleurs deals d'Afrique", en: "Africa's best deals" },
          text: { fr: "L'équipe Minah ouvre les portes des États, des PME et des fintechs.", en: "The Minah team opens the doors to States, SMEs and fintechs." },
        },
        {
          title: { fr: "Sourcés par les agents IA", en: "Sourced by AI agents" },
          metric: { fr: "Aux côtés de l'équipe", en: "Alongside the team" },
          text: { fr: "Des agents IA parcourent le continent et font remonter les meilleurs deals à l'équipe.", en: "AI agents scan the continent and surface the best deals to the team." },
        },
      ],
      panel: {
        title: { fr: "Sur la route de", en: "On the road to" },
        amount: { fr: "1 Md€", en: "€1B" },
        note: { fr: "d'actifs réels africains", en: "of African real assets" },
        cols: [
          { h: { fr: "États · PME · fintechs", en: "States · SMEs · fintechs" }, d: { fr: "Dans plusieurs pays et plusieurs devises", en: "Across several countries and currencies" } },
        ],
      },
      showActors: false,
      aConfirmer: true,
    },
    marche: {
      text: {
        fr: "Le Minah Forum devient l'un des plus gros forums de la dette privée africaine, et Minah reste invitée aux grands événements mondiaux : une couche de l'écosystème, la référence que citent les tables où elle a commencé par être invitée.",
        en: "The Minah Forum becomes one of the biggest forums of African private debt, and Minah remains invited to the key global events: a layer of the ecosystem, the reference cited by the tables where it started out as a guest.",
      },
      summary: {
        fr: "Le Minah Forum devient l'un des plus gros forums de la dette privée africaine, deal rooms comprises, et Minah reste invitée aux grands événements mondiaux : la référence que citent les tables où elle a commencé par être invitée.",
        en: "The Minah Forum becomes one of the biggest forums of African private debt, deal rooms included, and Minah remains invited to the key global events: the reference cited by the tables where it started out as a guest.",
      },
      ladder: "marche",
      levers: [
        {
          title: { fr: "Minah Forum et deal rooms", en: "Minah Forum and deal rooms" },
          metric: { fr: "L'un des plus gros forums", en: "One of the biggest forums" },
          text: { fr: "Le forum annuel de la dette privée africaine : chefs d'État, DFI, allocateurs mondiaux et gérants autour des mêmes tables. Ses deal rooms sont celles des opérations de l'année : les plus grosses s'y originent, s'y négocient et s'y signent.", en: "The annual forum of African private debt: heads of state, DFIs, global allocators and fund managers around the same tables. Its deal rooms are the year's deals: the largest operations are originated, negotiated and signed there." },
        },
        {
          title: { fr: "Les rencontres privées", en: "Private gatherings" },
          metric: { fr: "Davos · Abidjan · New York · Paris", en: "Davos · Abidjan · New York · Paris" },
          text: { fr: "Toute l'année, dans les villes où le capital se décide, et aux grands événements mondiaux où l'on nous invite.", en: "All year round, in the cities where capital decides, and at the key global events we are invited to." },
        },
      ],
      showActors: false,
      aConfirmer: true,
    },
  },
};

// ── Les acteurs, par fil et par catégorie ────────────────────────────────────
// Cumulatifs : un acteur arrivé en traction est encore là à l'échelle. Les logos
// sont servis en local (public/partners), jamais depuis un tiers ; sans fichier,
// le nom s'affiche en typographie. `named: false` = catégorie, pas de nom.

export type Category =
  | "hnwi" | "reseaux" | "fonds" | "protocoles" | "institutions" | "crypto" | "agents"
  | "gouvernements" | "pme" | "fintech" | "souverain" | "infrastructure"
  | "sommets" | "rencontres" | "nos_evenements" | "prix";

export const CATEGORIES: Record<Stream, Category[]> = {
  distribution: ["hnwi", "reseaux", "fonds", "protocoles", "institutions", "crypto", "agents"],
  sous_jacents: ["gouvernements", "pme", "fintech", "souverain", "infrastructure"],
  marche: ["sommets", "rencontres", "nos_evenements", "prix"],
};

export const CATEGORY_LABEL: Record<Category, Bilingual> = {
  hnwi: { fr: "Particuliers fortunés et diaspora", en: "Wealthy individuals and diaspora" },
  reseaux: { fr: "Apporteurs et réseaux", en: "Introducers and networks" },
  fonds: { fr: "Fonds", en: "Funds" },
  protocoles: { fr: "Protocoles et plateformes", en: "Protocols and platforms" },
  institutions: { fr: "Institutions financières", en: "Financial institutions" },
  crypto: { fr: "Allocataires crypto", en: "Crypto allocators" },
  agents: { fr: "Agents IA", en: "AI agents" },
  gouvernements: { fr: "Gouvernements", en: "Governments" },
  pme: { fr: "PME et contrats publics", en: "SMEs and public contracts" },
  fintech: { fr: "Fintechs", en: "Fintechs" },
  souverain: { fr: "Dette souveraine", en: "Sovereign debt" },
  infrastructure: { fr: "Rails, custody, KYC", en: "Rails, custody, KYC" },
  sommets: { fr: "Sommets", en: "Summits" },
  rencontres: { fr: "Rencontres privées", en: "Private meetings" },
  nos_evenements: { fr: "Nos événements", en: "Our events" },
  prix: { fr: "Prix", en: "Awards" },
};

export type Actor = {
  id: string;
  stream: Stream;
  category: Category;
  name: Bilingual;
  depuis: GrowthPhase;
  logo?: string;
  url?: string;
  /** false : une catégorie d'acteurs, pas un nom (partenaire en discussion). */
  named?: boolean;
  aConfirmer?: boolean;
};

const MINAH = "/brand/logo.png";

export const ACTORS: Actor[] = [
  // Distribution
  { id: "reseau-direct", stream: "distribution", category: "hnwi", name: { fr: "Réseau direct des fondateurs", en: "Founders' direct network" }, depuis: "amorcage", named: false },
  { id: "network-builders", stream: "distribution", category: "reseaux", name: { fr: "Network Builders", en: "Network Builders" }, depuis: "traction", logo: MINAH },
  { id: "minah-circles", stream: "distribution", category: "reseaux", name: { fr: "Minah Circles", en: "Minah Circles" }, depuis: "traction", logo: MINAH },
  { id: "fonds-us", stream: "distribution", category: "fonds", name: { fr: "Fonds américain, co-structuration Kupanda", en: "US fund, Kupanda co-structuring" }, depuis: "traction", named: false, aConfirmer: true },
  { id: "sereel", stream: "distribution", category: "protocoles", name: { fr: "Sereel", en: "Sereel" }, depuis: "traction" },
  { id: "protocoles-suivants", stream: "distribution", category: "protocoles", name: { fr: "Trois protocoles de plus", en: "Three more protocols" }, depuis: "distribution", named: false, aConfirmer: true },
  { id: "banque", stream: "distribution", category: "institutions", name: { fr: "Partenaire bancaire, règlement en euros", en: "Banking partner, euro settlement" }, depuis: "distribution", named: false, aConfirmer: true },
  { id: "institutions-api", stream: "distribution", category: "institutions", name: { fr: "Fonds et institutions par l'API", en: "Funds and institutions through the API" }, depuis: "distribution", named: false, aConfirmer: true },
  { id: "allocataires-crypto", stream: "distribution", category: "crypto", name: { fr: "Allocataires crypto-natifs", en: "Crypto-native allocators" }, depuis: "distribution", named: false, aConfirmer: true },
  { id: "agents-ia", stream: "distribution", category: "agents", name: { fr: "Agents IA", en: "AI agents" }, depuis: "distribution", named: false },
  { id: "places-liquidite", stream: "distribution", category: "protocoles", name: { fr: "Places de liquidité et teneurs de marché", en: "Liquidity venues and market makers" }, depuis: "marche", named: false, aConfirmer: true },
  // Sous-jacents
  { id: "stellar", stream: "sous_jacents", category: "infrastructure", name: { fr: "Stellar", en: "Stellar" }, depuis: "amorcage", logo: "/partners/stellar.png", url: "https://stellar.org" },
  { id: "fireblocks", stream: "sous_jacents", category: "infrastructure", name: { fr: "Fireblocks", en: "Fireblocks" }, depuis: "amorcage", logo: "/partners/fireblocks.png", url: "https://www.fireblocks.com" },
  { id: "sumsub", stream: "sous_jacents", category: "infrastructure", name: { fr: "Sumsub", en: "Sumsub" }, depuis: "amorcage", logo: "/partners/sumsub.png", url: "https://sumsub.com" },
  { id: "premier-projet", stream: "sous_jacents", category: "pme", name: { fr: "Premier projet ouest-africain", en: "First West African project" }, depuis: "amorcage", named: false },
  { id: "zambie", stream: "sous_jacents", category: "gouvernements", name: { fr: "République de Zambie", en: "Republic of Zambia" }, depuis: "amorcage" },
  { id: "kupanda", stream: "sous_jacents", category: "pme", name: { fr: "Kupanda, 12 M€", en: "Kupanda, €12M" }, depuis: "traction" },
  { id: "contrats-publics", stream: "sous_jacents", category: "pme", name: { fr: "Pipeline de contrats publics, 15 à 20 M€", en: "Public contract pipeline, €15M to €20M" }, depuis: "distribution", named: false, aConfirmer: true },
  { id: "canton", stream: "sous_jacents", category: "infrastructure", name: { fr: "Canton Network", en: "Canton Network" }, depuis: "traction", logo: "/partners/canton.png", url: "https://www.canton.network" },
  { id: "souverain", stream: "sous_jacents", category: "souverain", name: { fr: "Émetteur de dette souveraine tokenisée", en: "Tokenised sovereign debt issuer" }, depuis: "distribution", named: false, aConfirmer: true },
  { id: "tbills", stream: "sous_jacents", category: "souverain", name: { fr: "T-bills tokenisés", en: "Tokenised T-bills" }, depuis: "distribution", named: false, aConfirmer: true },
  { id: "fintechs", stream: "sous_jacents", category: "fintech", name: { fr: "Fintechs africaines", en: "African fintechs" }, depuis: "distribution", named: false, aConfirmer: true },
  { id: "etats-pays", stream: "sous_jacents", category: "gouvernements", name: { fr: "Plusieurs États, plusieurs devises", en: "Several States, several currencies" }, depuis: "marche", named: false, aConfirmer: true },
  // Marché
  { id: "afis", stream: "marche", category: "sommets", name: { fr: "Africa Financial Industry Summit, Casablanca (Maroc) & Lomé (Togo)", en: "Africa Financial Industry Summit, Casablanca (Morocco) & Lomé (Togo)" }, depuis: "amorcage", logo: "/partners/afis.png" },
  { id: "congres-lome", stream: "marche", category: "sommets", name: { fr: "Congrès panafricain, Lomé, Togo", en: "Pan-African Congress, Lomé, Togo" }, depuis: "amorcage" },
  { id: "50days", stream: "marche", category: "sommets", name: { fr: "50 Days on Chain, Paris, France", en: "50 Days on Chain, Paris, France" }, depuis: "amorcage", logo: "/partners/fifty.png", url: "https://www.50partners.fr/programmes/web3" },
  { id: "delubac", stream: "marche", category: "prix", name: { fr: "Prix Cyrille Bialkiewicz, Banque Delubac", en: "Cyrille Bialkiewicz Prize, Banque Delubac" }, depuis: "amorcage" },
  { id: "wef", stream: "marche", category: "sommets", name: { fr: "World Economic Forum, Davos, Suisse", en: "World Economic Forum, Davos, Switzerland" }, depuis: "amorcage", logo: "/partners/wef.png", url: "https://www.weforum.org" },
  { id: "choiseul", stream: "marche", category: "sommets", name: { fr: "Choiseul Africa Business Forum, Lagos, Nigeria", en: "Choiseul Africa Business Forum, Lagos, Nigeria" }, depuis: "amorcage", logo: "/partners/choiseul-africa.svg", url: "https://www.choiseul-africa.com/en/" },
  { id: "africa-ceo-forum", stream: "marche", category: "sommets", name: { fr: "Africa CEO Forum, Abidjan (Côte d'Ivoire) & Kigali (Rwanda)", en: "Africa CEO Forum, Abidjan (Côte d'Ivoire) & Kigali (Rwanda)" }, depuis: "amorcage", logo: "/partners/africa-ceo-forum.png", url: "https://www.theafricaceoforum.com" },
  { id: "changenow", stream: "marche", category: "sommets", name: { fr: "ChangeNOW, Paris, France", en: "ChangeNOW, Paris, France" }, depuis: "amorcage", logo: "/partners/changenow.png", url: "https://www.changenow.world" },
  { id: "websummit", stream: "marche", category: "sommets", name: { fr: "Web Summit, Doha, Qatar", en: "Web Summit, Doha, Qatar" }, depuis: "amorcage", logo: "/partners/websummit.png", url: "https://websummit.com" },
  { id: "websummit-lisbonne", stream: "marche", category: "sommets", name: { fr: "Web Summit, Lisbonne, Portugal", en: "Web Summit, Lisbon, Portugal" }, depuis: "amorcage", logo: "/partners/websummit.png", url: "https://websummit.com" },
  { id: "africa-forward", stream: "marche", category: "sommets", name: { fr: "Africa Forward, Nairobi, Kenya", en: "Africa Forward, Nairobi, Kenya" }, depuis: "amorcage", url: "https://www.elysee.fr/emmanuel-macron/2026/05/06/sommet-africa-forward-partenariats-entre-lafrique-et-la-france-pour-linnovation-et-la-croissance" },
  { id: "circles-tenus", stream: "marche", category: "nos_evenements", name: { fr: "Minah Circle : Paris (France) & Lomé (Togo)", en: "Minah Circle: Paris (France) & Lomé (Togo)" }, depuis: "amorcage", logo: MINAH },
  { id: "paloneo", stream: "marche", category: "sommets", name: { fr: "Sommet Paloneo, Hambourg, Allemagne", en: "Paloneo Summit, Hamburg, Germany" }, depuis: "amorcage", logo: "/partners/paloneo.png", url: "https://www.paloneo.org" },
  { id: "circles-hubs", stream: "marche", category: "nos_evenements", name: { fr: "Minah Circle : Davos, Abidjan, New York, Paris", en: "Minah Circle: Davos, Abidjan, New York, Paris" }, depuis: "distribution", logo: MINAH, aConfirmer: true },
  { id: "circle-trimestriel", stream: "marche", category: "nos_evenements", name: { fr: "Minah Forum, le rendez-vous annuel des investisseurs", en: "Minah Forum, the annual investor gathering" }, depuis: "distribution", logo: MINAH, aConfirmer: true },
];
