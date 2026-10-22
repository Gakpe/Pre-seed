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
  /** Effectif de la période : deux fondateurs, plus `resources` ressources internes. */
  team: { resources: number; label: Bilingual };
}> = [
  { id: "amorcage", start: "2026-02-01", end: "2026-10-31", label: { fr: "Amorçage", en: "Seeding" }, volume: { fr: "0 à 2 M€", en: "€0 to €2M" }, volumeMEur: 2,
    team: { resources: 0, label: { fr: "Les fondateurs", en: "The founders" } },
    tagline: { fr: "On entre là où le risque est déjà géré : Kupanda, co-construit avec Africa Rise, est déjà live. 2 M€, 12 mois, 20 % de coupon, des PME sous contrats d'État en Zambie, et cinq niveaux de protection.", en: "We enter where risk is already managed: Kupanda, co-built with Africa Rise, is already live. €2M, 12 months, 20% coupon, SMEs under State contracts in Zambia, and five layers of protection." } },
  { id: "traction", start: "2026-11-01", end: "2027-12-31", label: { fr: "Traction", en: "Traction" }, volume: { fr: "2 à 60 M€", en: "€2M to €60M" }, volumeMEur: 60,
    team: { resources: 1, label: { fr: "Les fondateurs et un premier **sales**", en: "The founders and a first **sales** hire" } },
    tagline: { fr: "Nous ne changeons pas de métier : exactement la même chose, à plus grande échelle. La machine réseau devient mondiale, les rails on-chain se multiplient, et le pipeline passe de 2 à 60 M€. Un premier sales rejoint les fondateurs.", en: "We are not changing jobs: exactly the same thing, at larger scale. The network machine goes global, on-chain rails multiply, and the pipeline grows from €2M to €60M. A first sales hire joins the founders." } },
  { id: "distribution", start: "2028-01-01", end: "2028-12-31", label: { fr: "Distribution", en: "Distribution" }, volume: { fr: "60 à 100 M€", en: "€60M to €100M" }, volumeMEur: 100,
    team: { resources: 2, label: { fr: "Les fondateurs et une **équipe sales** qui se met en place", en: "The founders and a **sales team** taking shape" } },
    tagline: { fr: "Le capital institutionnel se branche : une ancre DFI ou fonds de fonds et les licences débloquent les plus gros tickets, pendant que les sous-jacents se diversifient. L'étape qui porte le volume de 60 à 100 M€. Une équipe sales se met en place.", en: "Institutional capital switches on: a DFI or fund-of-funds anchor and the licences unlock the largest tickets, while the underlyings diversify. The step that carries the volume from €60M to €100M. A sales team takes shape." } },
  { id: "marche", start: "2029-01-01", end: "2029-12-31", label: { fr: "Marché", en: "Market" }, volume: { fr: "Road to 1 Md€", en: "Road to €1B" }, volumeMEur: 1000,
    team: { resources: 2, label: { fr: "Les fondateurs, l'**équipe sales** et un réseau de network builders", en: "The founders, the **sales team** and a network of Network Builders" } },
    tagline: { fr: "L'écosystème devient le marché : des places de liquidité et des institutions branchées en direct, préparées pendant la distribution, portent le milliard. L'équipe sales est en place.", en: "The ecosystem becomes the market: liquidity venues and institutions plugged in directly, prepared during distribution, carry the billion. The sales team is in place." } },
];

export const STREAM_META: Record<Stream, { label: Bilingual; sub: Bilingual }> = {
  distribution: { label: { fr: "Capital", en: "Capital" }, sub: { fr: "Qui finance, et par quel canal", en: "Who funds, and through which channel" } },
  sous_jacents: { label: { fr: "Sous-jacents", en: "Underlyings" }, sub: { fr: "Ce que Minah finance, et d'où vient le sous-jacent", en: "What Minah finances, and where the underlying comes from" } },
  marche: { label: { fr: "Visibilité", en: "Visibility" }, sub: { fr: "Les tables où Minah est vue, et qui elle y rencontre", en: "The tables where Minah is seen, and whom it meets there" } },
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
  tlg: { src: "/brand/gtm/field-24.jpg", pos: "center 40%", t: { fr: "Rencontre avec TLG Capital", en: "Meeting with TLG Capital" }, d: { fr: "Ils ont confirmé leur volonté de co-construire des stratégies avec nous.", en: "They confirmed their willingness to co-build strategies with us." } },
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
/** Un pont de volume, en cascade : une base, des étapes qui s'empilent, une cible.
 *  Dessiné au-dessus des leviers du fil (phase Marché, distribution). */
export type Bridge = {
  title: Bilingual;
  sub: Bilingual;
  unit: Bilingual;
  /** Mention affichée à côté du titre quand la répartition n'est pas validée. */
  tag?: Bilingual;
  steps: { label: Bilingual; value: number; kind: "base" | "step" | "total"; note?: Bilingual }[];
};
/** Carte de synthèse d'un fil sur une phase : un chiffre en vedette, une légende
 *  courte, deux repères au plus et, au besoin, les logos des partenaires nommés. */
export type Card = { hero: Bilingual; caption: Bilingual; points: Bilingual[]; logos?: { src: string; name: string }[]; logoNote?: Bilingual };
export type Lever = {
  title: Bilingual;
  /** Logos des acteurs nommés dans la carte. */
  logos?: { src: string; name: string }[];
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
  /** Pont de volume en cascade (voir Bridge), dessiné avant les leviers. */
  bridge?: Bridge;
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
  /** Tableau chiffré (trajectoire) : en-tête et lignes, première colonne en gras. */
  table?: { title: Bilingual; head: Bilingual[]; rows: Bilingual[][] };
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
  title: { fr: "Des Minah Circles au marché, étape par étape", en: "From the Minah Circles to the market, step by step" },
  steps: [
    {
      phase: "amorcage",
      title: { fr: "Rencontres en petit comité", en: "Small-group gatherings" },
      sub: { fr: "Événements investisseurs tenus au Grand Palais (Paris, France) et à Lomé (Togo).", en: "Investor events held at the Grand Palais (Paris, France) and in Lomé (Togo)." },
    },
    {
      phase: "traction",
      title: { fr: "Des fenêtres de souscription", en: "Subscription windows" },
      sub: { fr: "Les meilleurs investisseurs, à Davos (Suisse), New York (États-Unis), Paris (France) et Abidjan (Côte d'Ivoire). Chaque édition ouvre une stratégie on-chain : on y souscrit en séance.", en: "Top investors, in Davos (Switzerland), New York (United States), Paris (France) and Abidjan (Côte d'Ivoire). Each edition opens a strategy on-chain: subscriptions happen in the room." },
    },
    {
      phase: "distribution",
      title: { fr: "Un forum qui émet", en: "A forum that issues" },
      sub: { fr: "Le Minah Forum devient la fenêtre d'émission annuelle : nos partenaires y émettent leurs tranches. Les rencontres privées continuent dans leurs villes.", en: "The Minah Forum becomes the annual issuance window: our partners issue their tranches there. Private gatherings continue in their cities." },
    },
    {
      phase: "marche",
      title: { fr: "Le marché", en: "The market" },
      sub: { fr: "Ce que l'Africa CEO Forum est aux dirigeants, le Minah Forum l'est au marché de la dette : le lieu qui définit l'écosystème et envoie les signaux.", en: "What the Africa CEO Forum is to business leaders, the Minah Forum is to the debt market: the place that defines the ecosystem and sends the signals." },
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
        fr: "Le réseau direct des fondateurs (moins de dix investisseurs), puis dix investisseurs qualifiés introduits par les Network Builders, une première plateforme admin de distribution et Atlantic Financials, qui a confirmé 5 à 10 M€ d'ici la fin de l'année sur Kupanda 1 et 2.",
        en: "The founders' direct network (under ten investors), then ten qualified investors introduced by the Network Builders, a first distribution admin platform and Atlantic Financials, which confirmed €5M to €10M by the end of the year on Kupanda 1 and 2.",
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
          // 12/10/2026 (Julien) : remplace « Sereel, premier protocole ».
          title: { fr: "Première plateforme admin de distribution", en: "First distribution admin platform" },
          metric: { fr: "Plateforme admin interne", en: "In-house admin platform" },
          text: { fr: "Un premier **Network Builder** arrive par cette plateforme et y distribue les stratégies à son propre réseau.", en: "A first **Network Builder** comes through this platform and distributes the strategies to their own network." },
        },
        {
          title: { fr: "Atlantic Financials, broker londonien", en: "Atlantic Financials, London broker" },
          logos: [{ src: "/partners/atlantic.png", name: "Atlantic Financials" }],
          metric: { fr: "5 à 10 M€ confirmés", en: "€5M to €10M confirmed" },
          text: { fr: "Notre partenaire nous a confirmé une ligne d'investissement de 5 à 10 M€ d'ici la fin de l'année sur nos stratégies Kupanda 1 et Kupanda 2.", en: "Our partner has confirmed an investment line of €5M to €10M by the end of the year on our Kupanda 1 and Kupanda 2 strategies." },
        },
      ],
      panel: {
        title: { fr: "La liquidité qui arrive", en: "Liquidity coming in" },
        amount: { fr: "5 à 10 M€", en: "€5M to €10M" },
        note: { fr: "d'ici la fin de l'année", en: "by the end of the year" },
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
        fr: "Kupanda 1, live : 2 M€ à 12 mois, 20 % annuel, des PME sous contrats d'État en Zambie, cinq niveaux de protection. Co-construit avec Africa Rise, 10 M$ déjà investis sans défaut.",
        en: "Kupanda 1, live: €2M over 12 months, 20% annual, SMEs under State contracts in Zambia, five layers of protection. Co-built with Africa Rise, $10M already invested without default.",
      },
      showActors: false,
      offerings: [
        {
          name: { fr: "Kupanda 1", en: "Kupanda 1" },
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
      summary: {
        fr: "Minah se montre là où se concentre le capital : Davos, l'Africa CEO Forum, l'Élysée, ChangeNOW, le Web Summit, ainsi que nos Minah Circles, à Paris et à Lomé.",
        en: "Minah shows up where capital gathers: Davos, the Africa CEO Forum, the Élysée, ChangeNOW, the Web Summit, as well as our own Minah Circles, in Paris and Lomé.",
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
        fr: "La machine réseau prend forme : les Network Builders passent de 5 à 25, trois accords on-chain (Stellar, Canton Network), trois protocoles de plus sur l'API, cinq accords brokers, Marex (véhicule avec code ISIN) et Silver Birch en discussion. Le volume passe de 2 à 60 M€.",
        en: "The network machine takes shape: Network Builders grow from 5 to 25, three on-chain agreements (Stellar, Canton Network), three more protocols on the API, five broker agreements, Marex (vehicle with an ISIN code) and Silver Birch in discussion. Volume grows from €2M to €60M.",
      },
      levers: [
        {
          title: { fr: "Network Builders", en: "Network Builders" },
          metric: { fr: "5 → 25", en: "5 → 25" },
          text: { fr: "Les Network Builders passent à vingt-cinq apporteurs actifs, répartis partout dans le monde.", en: "The Network Builders grow to twenty-five active introducers, spread across the world." },
        },
        {
          title: { fr: "On-chain : le canal s'ouvre", en: "On-chain: the channel opens" },
          logos: [{ src: "/partners/stellar-logo.png", name: "Stellar" }, { src: "/partners/canton-logo.svg", name: "Canton Network" }],
          metric: { fr: "3 accords on-chain", en: "3 on-chain agreements" },
          text: { fr: "Ce n'est que le début, et la vision est déjà enclenchée. Premier signal, **Stellar** : un investissement de 2 M$ en discussion dans Kupanda, et Minah comme son canal d'investissement en Afrique. Deuxième, **Canton Network**, second rail institutionnel : les discussions sont engagées.", en: "This is just the start, and the vision is already underway. First signal, **Stellar**: a $2M investment in discussion into Kupanda, and Minah as its investment channel in Africa. Second, **Canton Network**, a second institutional rail: discussions are engaged." },
        },
        {
          title: { fr: "API", en: "API" },
          metric: { fr: "+3 protocoles", en: "+3 protocols" },
          text: { fr: "Trois protocoles de plus se branchent sur l'API, sur le même principe ; un partenaire bancaire assure les entrées et sorties en euros pour les souscripteurs sans wallet.", en: "Three more protocols connect to the API, on the same principle; a banking partner handles euro on- and off-ramps for subscribers without a wallet." },
        },
        {
          title: { fr: "Brokers", en: "Brokers" },
          metric: { fr: "5 accords de distribution", en: "5 distribution agreements" },
          text: { fr: "Après le premier test avec **Atlantic Financials**, broker londonien qui a confirmé une ligne de 5 à 10 M€ sur Kupanda 1 et 2, nous signons cinq accords de distribution : des brokers qui placent nos stratégies auprès de leurs clients institutionnels.", en: "After the first test with **Atlantic Financials**, the London broker that confirmed a €5M to €10M line on Kupanda 1 and 2, we sign five distribution agreements: brokers placing our strategies with their institutional clients." },
        },
        {
          title: { fr: "Marex : un véhicule avec code ISIN", en: "Marex: a vehicle with an ISIN code" },
          logos: [{ src: "/partners/marex.png", name: "Marex" }],
          metric: { fr: "Nouveau canal", en: "New channel" },
          text: { fr: "Nous structurons un nouveau canal pour accéder au réseau de distribution de **Marex**, via un véhicule d'investissement doté d'un code ISIN. Les travaux ont démarré et nous en attendons des volumes significatifs.", en: "We are structuring a new channel into **Marex**'s distribution network, through an investment vehicle with an ISIN code. Work has started and we expect significant volumes from it." },
        },
        {
          title: { fr: "Silver Birch : accélérer la distribution", en: "Silver Birch: accelerating distribution" },
          logos: [{ src: "/partners/silver-birch.png", name: "Silver Birch" }],
          metric: { fr: "15 à 20 M€ en UEMOA", en: "€15M to €20M in WAEMU" },
          text: { fr: "Nous avons ouvert des discussions avec **Silver Birch** pour accélérer la distribution de nos nouvelles stratégies, à commencer par une stratégie de working capital de 15 à 20 M€ en zone UEMOA.", en: "We have opened discussions with **Silver Birch** to accelerate the distribution of our new strategies, starting with a €15M to €20M working capital strategy in the WAEMU zone." },
        },
      ],
      showActors: false,
      footnote: {
        fr: "Ce n'est pas inédit : TLG Capital (~120 M$, adossé à IFC et Proparco), Cauris et Enko ont atteint 100 M€+ dans cette même classe d'actifs. Le chemin est connu ; notre différence est la distribution.",
        en: "This is not unprecedented: TLG Capital (~$120M, backed by IFC and Proparco), Cauris and Enko reached €100M+ in this same asset class. The path is known; our difference is distribution.",
      },
    },
    sous_jacents: {
      text: {
        fr: "Quatre stratégies en 2027, 60 M€ émis. Deux familles, du cadre éprouvé au capital-risque.",
        en: "Four strategies in 2027, €60M issued. Two families, from the proven framework to venture capital.",
      },
      summary: {
        fr: "Quatre stratégies en 2027, 60 M€ émis : Kupanda 2 (10 M€) et Kupanda 3 (25 M€) sur le cadre zambien, puis deux stratégies startups, Afrique de l'Est (10 M€) et de l'Ouest (15 M€). Esgni 1 (6 M€, février 2027) et Esgni 2 (20 M€, janvier 2028) transposent le cadre Kupanda à l'Afrique de l'Ouest. Hors business plan : des tranches de crédit privé, TLG Capital ayant confirmé vouloir co-construire avec nous.",
        en: "Four strategies in 2027, €60M issued: Kupanda 2 (€10M) and Kupanda 3 (€25M) on the Zambian framework, then two startup strategies, East Africa (€10M) and West Africa (€15M). Esgni 1 (€6M, February 2027) and Esgni 2 (€20M, January 2028) carry the Kupanda framework to West Africa. Outside the business plan: private credit tranches, with TLG Capital confirmed to co-build with us.",
      },
      showActors: false,
      offerings: [
        {
          name: { fr: "Kupanda 2, puis Kupanda 3", en: "Kupanda 2, then Kupanda 3" },
          tag: { fr: "PME d'Afrique de l'Est · dette privée · 12 mois", en: "East African SMEs · private debt · 12 months" },
          status: { fr: "ACCORD SIGNÉ", en: "FRAMEWORK SIGNED" },
          subtitle: {
            fr: "Un contrat cadre signé avec la **République de Zambie**, une obligation in fine de 10 M€ à 12 mois, 20 % annuel, adossée à des contrats publics déjà attribués. Financement en fonds de roulement de sociétés des secteurs infrastructure et énergie en Afrique de l'Est, adossées à des accords gouvernementaux. Kupanda 3 suit en octobre 2027, 25 M€ sur le même cadre.",
            en: "A framework agreement signed with the **Republic of Zambia**, a €10M 12-month bullet bond at 20% annual, backed by already-awarded public contracts. The final counterparty is a State, and the contract is in the data room. Working-capital financing for infrastructure and energy companies in East Africa, backed by government agreements. Kupanda 3 follows in October 2027, €25M on the same framework.",
          },
          metrics: [
            { k: { fr: "Montant", en: "Amount" }, v: { fr: "10 M€", en: "€10M" }, accent: true },
            { k: { fr: "Premier closing", en: "First closing" }, v: { fr: "Janvier 2027", en: "January 2027" } },
            { k: { fr: "Durée", en: "Duration" }, v: { fr: "12 mois", en: "12 mo" } },
            { k: { fr: "Coupon fixe", en: "Fixed coupon" }, v: { fr: "20 %", en: "20%" } },
            { k: { fr: "Afrique de l'Est", en: "East Africa" }, v: { fr: "Infra · Énergie", en: "Infra · Energy" } },
            { k: { fr: "Zambie · État", en: "Zambia · Gov." }, v: { fr: "PME", en: "SMEs" } },
            { k: { fr: "Niveaux de protection", en: "Layers of protection" }, v: { fr: "5", en: "5" } },
          ],
          note: { fr: "Mêmes cinq niveaux de protection que Kupanda 1.", en: "The same five layers of protection as Kupanda 1." },
        },
        {
          name: { fr: "Esgni 1, puis Esgni 2", en: "Esgni 1, then Esgni 2" },
          tag: { fr: "PME d'Afrique de l'Ouest · dette privée", en: "West African SMEs · private debt" },
          status: { fr: "PREMIER CLOSING FÉVRIER 2027", en: "FIRST CLOSING FEBRUARY 2027" },
          subtitle: { fr: "Le cadre Kupanda transposé à l'Afrique de l'Ouest : des PME génératrices de cash, en dette senior. Esgni 2 suit en janvier 2028, à 20 M€.", en: "The Kupanda framework carried to West Africa: cash-generative SMEs, in senior debt. Esgni 2 follows in January 2028, at €20M." },
          metrics: [
            { k: { fr: "Esgni 1", en: "Esgni 1" }, v: { fr: "6 M€ · février 2027", en: "€6M · February 2027" }, accent: true },
            { k: { fr: "Esgni 2", en: "Esgni 2" }, v: { fr: "20 M€ · janvier 2028", en: "€20M · January 2028" }, accent: true },
          ],
          note: { fr: "Le cadre Kupanda transposé à l'Afrique de l'Ouest : des PME génératrices de cash, en dette senior.", en: "The Kupanda framework carried to West Africa: cash-generative SMEs, in senior debt." },
        },
        {
          name: { fr: "Startups, Afrique de l'Est et de l'Ouest", en: "Startups, East and West Africa" },
          tag: { fr: "Capital-risque · 24 mois", en: "Venture capital · 24 months" },
          status: { fr: "PREMIERS CLOSINGS MARS ET JUILLET 2027", en: "FIRST CLOSINGS MARCH AND JULY 2027" },
          subtitle: { fr: "Capital-risque pour startups technologiques innovantes : une stratégie Afrique de l'Est, une stratégie Afrique de l'Ouest.", en: "Venture capital for innovative tech startups: one East Africa strategy, one West Africa strategy." },
          metrics: [
            { k: { fr: "Afrique de l'Est", en: "East Africa" }, v: { fr: "10 M€ · mars", en: "€10M · March" }, accent: true },
            { k: { fr: "Afrique de l'Ouest", en: "West Africa" }, v: { fr: "15 M€ · juillet", en: "€15M · July" }, accent: true },
            { k: { fr: "Rendement cible", en: "Target yield" }, v: { fr: "9 – 15 %", en: "9 – 15%" } },
            { k: { fr: "Ticket minimum", en: "Minimum ticket" }, v: { fr: "25 M€", en: "€25M" } },
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
          status: { fr: "TLG CONFIRMÉ · HORS BUSINESS PLAN", en: "TLG CONFIRMED · OUTSIDE THE BUSINESS PLAN" },
          subtitle: {
            fr: "Nous avons rencontré **TLG Capital**, qui a confirmé sa volonté de co-construire des stratégies avec nous, au format Minah (tech enabler) : nous intégrerons des tranches dans nos prochains produits, distribuées à notre réseau. Discussions en cours avec **Enko Capital**, et d'autres fonds de crédit privé à venir.",
            en: "We have met **TLG Capital**, which has confirmed its willingness to co-build strategies with us, in the Minah format (tech enabler): we will integrate tranches into our next products, distributed to our network. Discussions are under way with **Enko Capital**, and more private credit funds are to come.",
          },
          metrics: [
            { k: { fr: "Tranche TLG", en: "TLG tranche" }, v: { fr: "20 M€", en: "€20M" }, accent: true },
            { k: { fr: "Distribution", en: "Distribution" }, v: { fr: "Notre réseau", en: "Our network" } },
            { k: { fr: "Partenaires", en: "Partners" }, v: { fr: "TLG · Enko · d'autres à venir", en: "TLG · Enko · more to come" } },
          ],
        },
      ],
      photos: [P.tlg],
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
        fr: "À cette échelle, le capital institutionnel se branche : une ancre DFI ou fonds de fonds entre, les licences débloquent les plus gros tickets, et chaque canal souscrit sur la même infrastructure, jusqu'aux agents IA.",
        en: "At this scale, institutional capital switches on: a DFI or fund-of-funds anchor comes in, the licences unlock the largest tickets, and every channel subscribes on the same infrastructure, all the way to AI agents.",
      },
      summary: {
        fr: "Le capital institutionnel se branche : une ancre DFI ou fonds de fonds et les licences qui débloquent les plus gros tickets, la liquidité on-chain (30 Md$), les fonds et institutions par l'API, jusqu'aux agents IA – tous sur la même infrastructure.",
        en: "Institutional capital switches on: a DFI or fund-of-funds anchor and the licences that unlock the largest tickets, on-chain liquidity ($30B), funds and institutions through the API, all the way to AI agents – all on the same infrastructure.",
      },
      hub: {
        title: { fr: "Minah – une seule infrastructure", en: "Minah – one infrastructure" },
        sub: { fr: "Moteur de structuration : coupon, protections, maturité", en: "Structuring engine: coupon, protections, maturity" },
      },
      levers: [
        {
          title: { fr: "L'ancre institutionnelle", en: "The institutional anchor" },
          metric: { fr: "Ancre DFI · fonds de fonds", en: "DFI · fund-of-funds anchor" },
          text: { fr: "Une **DFI** ou un **fonds de fonds** entre au capital : l'investisseur de référence qu'il faut du track record pour décrocher, et les licences supplémentaires qui débloquent les plus gros tickets.", en: "A **DFI** or a **fund-of-funds** comes in: the cornerstone investor it takes a track record to land, and the additional licences that unlock the largest tickets." },
        },
        {
          title: { fr: "Liquidité on-chain", en: "On-chain liquidity" },
          logos: [{ src: "/partners/blend.png", name: "Blend" }, { src: "/partners/ethos.png", name: "Ethos" }, { src: "/partners/base.png", name: "Base" }],
          metric: { fr: "30 Md$", en: "$30B" },
          text: { fr: "Après Stellar et Canton, le vault s'étend aux écosystèmes web3 avec **Blend**, **Ethos** et **Base** : les allocataires crypto-natifs y souscrivent en direct. L'enjeu : brancher les **30 Md$** de liquidité on-chain sur nos stratégies – aucun canal comme le nôtre n'existe vers l'Afrique.", en: "After Stellar and Canton, the vault extends into web3 ecosystems with **Blend**, **Ethos** and **Base**: crypto-native allocators subscribe directly. The stake: connecting the **$30B** of on-chain liquidity to our strategies – no channel like ours exists toward Africa." },
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
        fr: "Côté sous-jacents, trois sources portent le volume à 100 M€ :",
        en: "On the underlying side, three sources carry the volume to €100M:",
      },
      summary: {
        fr: "Trois sources de sous-jacents portent le volume à 100 M€, tracées on-chain de bout en bout : les tranches de fonds de crédit privé, les PME sous contrats publics (cadre Kupanda) et les fintechs africaines.",
        en: "Three sources of underlyings carry the volume to €100M, tracked on-chain end to end: private credit fund tranches, SMEs under public contracts (Kupanda framework) and African fintechs.",
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
      showActors: false,
      aConfirmer: true,
    },
    marche: {
      text: {
        fr: "Le **Minah Forum** devient la fenêtre d'émission annuelle de la dette privée africaine : les stratégies s'y ouvrent et nos partenaires y émettent leurs tranches. Les rencontres privées continuent à **Davos**, **Abidjan**, **New York** et **Paris**, et nous sommes invités aux grands événements mondiaux, où les allocataires rencontrent les États, les PME et les fintechs dont les deals alimentent nos stratégies.",
        en: "The **Minah Forum** becomes the annual issuance window of African private debt: strategies open there and our partners issue their tranches there. Private gatherings continue in **Davos**, **Abidjan**, **New York** and **Paris**, and we are invited to the key global events, where allocators meet the States, SMEs and fintechs whose deals feed our strategies.",
      },
      summary: {
        fr: "Le Minah Forum devient la fenêtre d'émission annuelle de la dette privée africaine : les stratégies s'y ouvrent, nos partenaires y émettent leurs tranches. Les rencontres privées continuent à Davos, Abidjan, New York et Paris.",
        en: "The Minah Forum becomes the annual issuance window of African private debt: strategies open there and our partners issue their tranches there. Private gatherings continue in Davos, Abidjan, New York and Paris.",
      },
      ladder: "distribution",
      showActors: false,
      aConfirmer: true,
    },
  },
  marche: {
    distribution: {
      text: {
        fr: "Un milliard d'euros par an se mesure en flux : avec des obligations à douze mois, le volume se réémet chaque année. Cinq sources le portent, et nous n'en originons qu'une seule nous-mêmes :",
        en: "One billion euros a year is measured as a flow: with twelve-month bonds, the volume is reissued every year. Five sources carry it, and we originate only one of them ourselves:",
      },
      summary: {
        fr: "Un milliard par an, de cinq sources : nos émissions réémises, les tranches partenaires, cinq brokers à 50 M€, la liquidité on-chain captée par notre infrastructure, les institutions et le secondaire.",
        en: "One billion a year, from five sources: our issuance reissued, partner tranches, five brokers at €50M, on-chain liquidity captured by our infrastructure, institutions and the secondary.",
      },
      bridge: {
        title: { fr: "Le pont vers 1 Md€", en: "The bridge to €1B" },
        sub: { fr: "Minah connecte toutes les formes de liquidité aux meilleurs sous-jacents.", en: "Minah connects every form of liquidity to the best underlyings." },
        unit: { fr: "Volume émis par an, en M€", en: "Volume issued per year, €M" },
        tag: { fr: "Répartition indicative", en: "Indicative split" },
        steps: [
          { label: { fr: "Volume 2028", en: "2028 volume" }, value: 100, kind: "base", note: { fr: "ancre et licences", en: "anchor and licences" } },
          { label: { fr: "Nos émissions", en: "Own issuance" }, value: 100, kind: "step", note: { fr: "obligations à 12 mois, réémises", en: "12-month bonds, reissued" } },
          { label: { fr: "Tranches partenaires", en: "Partners' tranches" }, value: 200, kind: "step", note: { fr: "environ 100 M€ chacun", en: "about €100M each" } },
          { label: { fr: "Brokers", en: "Brokers" }, value: 250, kind: "step", note: { fr: "5 accords × 50 M€ par an", en: "5 agreements × €50M a year" } },
          { label: { fr: "Liquidité on‑chain", en: "On‑chain liquidity" }, value: 200, kind: "step", note: { fr: "moins de 1 % des 30 Md$", en: "under 1% of the $30B" } },
          { label: { fr: "Institutions, secondaire", en: "Institutions, secondary" }, value: 150, kind: "step", note: { fr: "Marex, ancre DFI", en: "Marex, DFI anchor" } },
          { label: { fr: "Cible 2029", en: "2029 target" }, value: 1000, kind: "total", note: { fr: "le Minah Forum devient le marché", en: "the Minah Forum becomes the market" } },
        ],
      },
      levers: [
        {
          title: { fr: "Nos émissions", en: "Our issuance" },
          metric: { fr: "+100 M€", en: "+€100M" },
          text: { fr: "Des obligations à douze mois : 100 M€ à placer chaque année, réémis d'une année sur l'autre. Chaque nouvelle stratégie s'ajoute.", en: "Twelve-month bonds: €100M placed each year, reissued from one year to the next. Every new strategy adds to it." },
        },
        {
          title: { fr: "Les tranches de nos partenaires", en: "Our partners' tranches" },
          metric: { fr: "+200 M€", en: "+€200M" },
          text: { fr: "Deux partenaires de la taille de TLG, environ 100 M€ chacun, émettent sur nos rails sans grossir l'équipe.", en: "Two partners the size of TLG, about €100M each, issue on our rails without growing the team." },
        },
        {
          title: { fr: "Les brokers", en: "Brokers" },
          metric: { fr: "+250 M€", en: "+€250M" },
          text: { fr: "Cinq accords, environ 50 M€ de deals par an avec chaque broker.", en: "Five agreements, about €50M of deals a year with each broker." },
        },
        {
          title: { fr: "La liquidité on-chain", en: "On-chain liquidity" },
          metric: { fr: "+200 M€", en: "+€200M" },
          text: { fr: "Moins de 1 % des 30 Md$ de liquidité on-chain captés par notre infrastructure : les allocataires crypto-natifs souscrivent en direct.", en: "Under 1% of the $30B of on-chain liquidity captured by our infrastructure: crypto-native allocators subscribe directly." },
        },
        {
          title: { fr: "Institutions et secondaire", en: "Institutions and secondary" },
          metric: { fr: "+150 M€", en: "+€150M" },
          text: { fr: "Le véhicule à code ISIN de Marex et une ancre DFI ou fonds de fonds, puis un secondaire qui accélère le volume.", en: "Marex's ISIN-coded vehicle and a DFI or fund-of-funds anchor, then a secondary market that speeds up volume." },
        },
      ],
      showActors: false,
      aConfirmer: true,
    },
    sous_jacents: {
      text: {
        fr: "Un milliard d'euros de volume par an, financé sur des sous-jacents africains réels, originés par des partenaires autant que par Minah, sur une infrastructure que d'autres utilisent. Trois familles de sous-jacents, que le réseau, le Forum et les agents IA amènent à nous :",
        en: "One billion euros of volume a year, financed on real African underlyings, originated by partners as much as by Minah, on an infrastructure others use. Three families of underlyings, brought to us by the network, the Forum and the AI agents:",
      },
      summary: {
        fr: "Un milliard de volume par an, sur trois familles de sous-jacents africains : les États (T-bills tokenisés), les PME sous contrats publics (cadre Kupanda répliqué pays après pays) et les fintechs qui empruntent au vault. Le réseau, le Forum et les agents IA amènent les contreparties.",
        en: "One billion of volume a year, across three families of African underlyings: States (tokenized T-bills), SMEs under public contracts (the Kupanda framework replicated country after country) and fintechs borrowing from the vault. The network, the Forum and the AI agents bring the counterparties.",
      },
      levers: [
        { title: { fr: "Les États", en: "States" }, metric: { fr: "T-bills tokenisés", en: "Tokenized T-bills" }, text: { fr: "De la dette souveraine courte, qui se renouvelle : le second moteur, une fois le premier émetteur branché.", en: "Short sovereign debt that rolls over: the second engine, once the first issuer is plugged in." } },
        { title: { fr: "Les PME sous contrats publics", en: "SMEs under public contracts" }, metric: { fr: "Le cadre Kupanda, répliqué", en: "The Kupanda framework, replicated" }, text: { fr: "Dette senior, cinq protections, émission on-chain : le cadre éprouvé en Zambie se réplique pays après pays, et sert de filtre à chaque nouveau deal.", en: "Senior debt, five protections, on-chain issuance: the framework proven in Zambia replicates country after country, and filters every new deal." } },
        { title: { fr: "Les fintechs et scale-ups", en: "Fintechs and scale-ups" }, metric: { fr: "Empruntent au vault", en: "Borrow from the vault" }, text: { fr: "Les entreprises génératrices de cash du continent empruntent directement au vault, sans intermédiaire.", en: "The continent's cash-generative companies borrow directly from the vault, without intermediary." } },
        { title: { fr: "Sourcés par le réseau et les agents IA", en: "Sourced by the network and AI agents" }, metric: { fr: "Les contreparties viennent à nous", en: "Counterparties come to us" }, text: { fr: "Le réseau, le Forum et ses deal rooms, les agents IA amènent les contreparties à nous ; chaque deal honoré en attire un meilleur.", en: "The network, the Forum and its deal rooms, the AI agents bring the counterparties to us; every honoured deal attracts a better one." } },
      ],
      showActors: false,
      aConfirmer: true,
    },
    marche: {
      text: {
        fr: "Nous devenons le marché. Ce que l'Africa CEO Forum est aux dirigeants du continent, le **Minah Forum** l'est à la dette privée africaine : le lieu qui définit l'écosystème et lui envoie ses signaux.",
        en: "We become the market. What the Africa CEO Forum is to the continent's business leaders, the **Minah Forum** is to African private debt: the place that defines the ecosystem and sends it its signals.",
      },
      summary: {
        fr: "Le Minah Forum est à la dette privée africaine ce que l'Africa CEO Forum est aux dirigeants : la fenêtre d'émission annuelle, les deal rooms et une session de marché secondaire.",
        en: "The Minah Forum is to African private debt what the Africa CEO Forum is to business leaders: the annual issuance window, the deal rooms and a secondary market session.",
      },
      ladder: "marche",
      showActors: false,
      aConfirmer: true,
    },
  },
};

// ── Ce qui s'ajoute à chaque période, par fil : la vue cumulative (capital et sous-jacents).
// Chaque phase empile son bloc sur les précédents : à 1 Md€, la carte est complète.
export const BUILDUP: Record<"distribution" | "sous_jacents", Record<GrowthPhase, Bilingual[]>> = {
  distribution: {
    amorcage: [
      { fr: "Réseau direct des fondateurs, moins de dix investisseurs", en: "Founders' direct network, under ten investors" },
      { fr: "Dix investisseurs qualifiés, via les Network Builders", en: "Ten qualified investors, via the Network Builders" },
      { fr: "Atlantic Financials : ligne de 5 à 10 M€ confirmée", en: "Atlantic Financials: €5–10M line confirmed" },
      { fr: "Première plateforme admin de distribution", en: "First distribution admin platform" },
    ],
    traction: [
      { fr: "Un premier sales rejoint les fondateurs", en: "A first sales hire joins the founders" },
      { fr: "Network Builders : de 5 à 25", en: "Network Builders: from 5 to 25" },
      { fr: "Trois accords on-chain : Stellar, Canton", en: "Three on-chain agreements: Stellar, Canton" },
      { fr: "Trois protocoles de plus sur l'API", en: "Three more protocols on the API" },
      { fr: "Cinq accords brokers, environ 50 M€ de deals par an chacun", en: "Five broker agreements, about €50M of deals a year each" },
      { fr: "Marex : véhicule à code ISIN", en: "Marex: an ISIN-coded vehicle" },
      { fr: "Silver Birch : discussions ouvertes", en: "Silver Birch: discussions opened" },
    ],
    distribution: [
      { fr: "L'équipe sales se met en place", en: "The sales team takes shape" },
      { fr: "Ancre DFI ou fonds de fonds", en: "DFI or fund-of-funds anchor" },
      { fr: "Licences pour les plus gros tickets", en: "Licences for the largest tickets" },
      { fr: "Liquidité on-chain étendue : Blend, Ethos, Base", en: "On-chain liquidity extended: Blend, Ethos, Base" },
      { fr: "API ouverte aux fonds et aux institutions", en: "API open to funds and institutions" },
      { fr: "Agents IA sur le même rail API", en: "AI agents on the same API rail" },
    ],
    marche: [
      { fr: "Marché secondaire : places de liquidité, teneurs de marché", en: "Secondary market: liquidity venues, market makers" },
      { fr: "Sortie avant l'échéance, principal et rendement séparés", en: "Exit before maturity, principal and yield separated" },
      { fr: "Liquidité on-chain : moins de 1 % des 30 Md$ captés", en: "On-chain liquidity: under 1% of the $30B captured" },
    ],
  },
  sous_jacents: {
    amorcage: [
      { fr: "Kupanda 1 : PME sous contrats d'État en Zambie, cinq niveaux de protection", en: "Kupanda 1: SMEs under State contracts in Zambia, five layers of protection" },
    ],
    traction: [
      { fr: "Kupanda 2 et 3 : PME d'Afrique de l'Est, même cadre", en: "Kupanda 2 and 3: East African SMEs, same framework" },
      { fr: "Esgni 1 et 2 : PME d'Afrique de l'Ouest, même cadre", en: "Esgni 1 and 2: West African SMEs, same framework" },
      { fr: "Deux stratégies startups : Afrique de l'Est et de l'Ouest (Wave, Yango, Caterpillar Afrique en discussion)", en: "Two startup strategies: East and West Africa (Wave, Yango, Caterpillar Africa in discussion)" },
      { fr: "Tranches de crédit privé : TLG confirmé, Enko en discussion", en: "Private credit tranches: TLG confirmed, Enko in discussion" },
    ],
    distribution: [
      { fr: "Cadre Kupanda répliqué dans d'autres pays", en: "Kupanda framework replicated in other countries" },
      { fr: "Fintechs africaines : elles empruntent au vault", en: "African fintechs: they borrow from the vault" },
      { fr: "Tranches d'autres fonds de crédit privé", en: "Tranches from other private credit funds" },
    ],
    marche: [
      { fr: "États : T-bills tokenisés", en: "States: tokenized T-bills" },
      { fr: "Plusieurs États, plusieurs devises", en: "Several States, several currencies" },
      { fr: "Partenaires de la taille de TLG, environ 100 M€ chacun", en: "Partners the size of TLG, about €100M each" },
    ],
  },
};

// ── Cartes de synthèse : le premier regard sur une phase (le détail est derrière « Voir le détail »).
export const CARDS: Record<GrowthPhase, Record<Stream, Card>> = {
  amorcage: {
    distribution: { hero: { fr: "5–10 M€", en: "€5–10M" }, caption: { fr: "ligne confirmée, Atlantic Financials", en: "line confirmed, Atlantic Financials" }, points: [{ fr: "Réseau des fondateurs : moins de dix investisseurs", en: "Founders' network: under ten investors" }, { fr: "Dix investisseurs qualifiés, via les Network Builders", en: "Ten qualified investors, via the Network Builders" }], logos: [{ src: "/partners/atlantic.png", name: "Atlantic Financials" }] },
    sous_jacents: { hero: { fr: "2 M€", en: "€2M" }, caption: { fr: "Kupanda 1, live, PME en Zambie", en: "Kupanda 1, live, SMEs in Zambia" }, points: [{ fr: "Cinq niveaux de protection", en: "Five layers of protection" }, { fr: "Co-construit avec Africa Rise", en: "Co-built with Africa Rise" }] },
    marche: { hero: { fr: "Paris · Lomé", en: "Paris · Lomé" }, caption: { fr: "les premiers Minah Circles", en: "the first Minah Circles" }, points: [{ fr: "Davos, Africa CEO Forum, Élysée", en: "Davos, Africa CEO Forum, Élysée" }, { fr: "ChangeNOW, Web Summit", en: "ChangeNOW, Web Summit" }] },
  },
  traction: {
    distribution: { hero: { fr: "5 → 25", en: "5 → 25" }, caption: { fr: "Network Builders", en: "Network Builders" }, points: [{ fr: "3 accords on-chain, 5 accords brokers", en: "3 on-chain agreements, 5 broker agreements" }, { fr: "Marex lancé (code ISIN), Silver Birch en discussion", en: "Marex started (ISIN code), Silver Birch in discussion" }], logos: [{ src: "/partners/stellar-logo.png", name: "Stellar" }, { src: "/partners/canton-logo.svg", name: "Canton Network" }, { src: "/partners/marex.png", name: "Marex" }, { src: "/partners/silver-birch.png", name: "Silver Birch" }] },
    sous_jacents: { hero: { fr: "60 M€", en: "€60M" }, caption: { fr: "émis en 2027", en: "issued in 2027" }, points: [{ fr: "Kupanda 1 (2 M€), puis 4 stratégies en 2027", en: "Kupanda 1 (€2M), then 4 strategies in 2027" }, { fr: "Kupanda 2 et 3 (35 M€), startups Est et Ouest (25 M€)", en: "Kupanda 2 and 3 (€35M), East and West startups (€25M)" }], logos: [{ src: "/partners/tlg.png", name: "TLG Capital" }], logoNote: { fr: "Tranche de TLG", en: "TLG tranche" } },
    marche: { hero: { fr: "4 villes", en: "4 cities" }, caption: { fr: "les Minah Circles montent en gamme", en: "the Minah Circles move up a tier" }, points: [{ fr: "Davos, New York, Paris, Abidjan", en: "Davos, New York, Paris, Abidjan" }, { fr: "AFSIC et FT Africa Summit, à Londres", en: "AFSIC and FT Africa Summit, in London" }] },
  },
  distribution: {
    distribution: { hero: { fr: "Ancre DFI", en: "DFI anchor" }, caption: { fr: "ou fonds de fonds, et licences", en: "or fund-of-funds, and licences" }, points: [{ fr: "30 Md$ de liquidité on-chain connectés", en: "$30B of on-chain liquidity connected" }, { fr: "API : fonds, institutions, agents IA", en: "API: funds, institutions, AI agents" }], logos: [{ src: "/partners/blend.png", name: "Blend" }, { src: "/partners/ethos.png", name: "Ethos" }, { src: "/partners/base.png", name: "Base" }] },
    sous_jacents: { hero: { fr: "100 M€", en: "€100M" }, caption: { fr: "de volume, trois sources", en: "of volume, three sources" }, points: [{ fr: "Tranches de fonds de crédit privé", en: "Private credit fund tranches" }, { fr: "PME sous contrats publics, fintechs africaines", en: "SMEs under public contracts, African fintechs" }] },
    marche: { hero: { fr: "Minah Forum", en: "Minah Forum" }, caption: { fr: "fenêtre d'émission annuelle", en: "annual issuance window" }, points: [{ fr: "Rencontres privées à Davos, Abidjan, New York, Paris", en: "Private gatherings in Davos, Abidjan, New York, Paris" }] },
  },
  marche: {
    distribution: { hero: { fr: "1 Md€ / an", en: "€1B a year" }, caption: { fr: "un flux, porté par cinq sources", en: "a flow, carried by five sources" }, points: [{ fr: "Brokers : 5 × 50 M€ par an", en: "Brokers: 5 × €50M a year" }, { fr: "Liquidité on-chain captée par notre infrastructure", en: "On-chain liquidity captured by our infrastructure" }] },
    sous_jacents: { hero: { fr: "1 Md€", en: "€1B" }, caption: { fr: "de volume par an, trois familles", en: "of volume a year, three families" }, points: [{ fr: "États : T-bills tokenisés", en: "States: tokenized T-bills" }, { fr: "PME sous contrats publics, fintechs", en: "SMEs under public contracts, fintechs" }] },
    marche: { hero: { fr: "La référence", en: "The reference" }, caption: { fr: "de la dette privée africaine", en: "of African private debt" }, points: [{ fr: "Deal rooms et session de marché secondaire", en: "Deal rooms and a secondary market session" }, { fr: "Ce que l'Africa CEO Forum est aux dirigeants", en: "What the Africa CEO Forum is to business leaders" }] },
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
  { id: "kupanda", stream: "sous_jacents", category: "pme", name: { fr: "Kupanda, 10 M€", en: "Kupanda, €10M" }, depuis: "traction" },
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
