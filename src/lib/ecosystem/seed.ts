// Roadmap écosystème, v3 du 04/10/2026. Un récit par période, pas une liste de
// tâches : cinq phases de croissance lues en volume, et pour chacune trois
// fils, distribution (qui finance), sous-jacents (d'où viennent les actifs),
// marché (où Minah est vue). Des photos pour se projeter.
// BROUILLON : textes à valider par l'équipe ; les noms en gras sont ceux que
// l'on peut écrire, les autres restent des catégories.

export type Bilingual = { fr: string; en: string };
export type GrowthPhase = "amorcage" | "traction" | "distribution" | "echelle" | "marche";
export type Stream = "distribution" | "sous_jacents" | "marche";
export const STREAMS: Stream[] = ["distribution", "sous_jacents", "marche"];

export const ECO_TODAY = "2026-10-01";

export type Photo = { src: string; t: Bilingual; d?: Bilingual };

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
  { id: "amorcage", start: "2025-01-01", end: "2026-01-31", label: { fr: "Amorçage", en: "Seeding" }, volume: { fr: "< 100 K€", en: "< €100K" }, volumeMEur: 0.1,
    tagline: { fr: "L'écosystème commence par les rails : custody, KYC et chaîne sont contractualisés avant d'avoir le volume, pour que la première obligation tienne dès le premier jour.", en: "The ecosystem starts with the rails: custody, KYC and chain are contracted before there is volume, so that the first bond holds from day one." } },
  { id: "traction", start: "2026-02-01", end: "2027-03-31", label: { fr: "Traction", en: "Traction" }, volume: { fr: "2 à 15 M€", en: "€2M to €15M" }, volumeMEur: 15,
    tagline: { fr: "Pendant que Kupanda se place, l'écosystème prépare déjà la suite : des apporteurs, des Circles et un premier protocole, dimensionnés pour quinze millions, pas pour deux.", en: "While Kupanda is being placed, the ecosystem is already preparing what comes next: introducers, Circles and a first protocol, sized for fifteen million, not two." } },
  { id: "distribution", start: "2027-04-01", end: "2027-12-31", label: { fr: "Distribution", en: "Distribution" }, volume: { fr: "15 à 20 M€ par stratégie", en: "€15M to €20M per strategy" }, volumeMEur: 50,
    tagline: { fr: "Les tiers qui distribueront cent millions se branchent dès maintenant : protocoles, banque de règlement, second rail. L'écosystème garde une phase d'avance sur le volume.", en: "The third parties that will distribute one hundred million plug in now: protocols, settlement bank, second rail. The ecosystem stays one phase ahead of volume." } },
  { id: "echelle", start: "2028-01-01", end: "2028-12-31", label: { fr: "Échelle", en: "Scale" }, volume: { fr: "100 M€", en: "€100M" }, volumeMEur: 100,
    tagline: { fr: "Trois écosystèmes nourrissent trois moteurs, dette privée, dette souveraine, liquidité crypto ; chacun a été ouvert une période avant d'être nécessaire.", en: "Three ecosystems feed three engines, private debt, sovereign debt, crypto liquidity; each was opened one period before it was needed." } },
  { id: "marche", start: "2029-01-01", end: "2029-12-31", label: { fr: "Marché", en: "Market" }, volume: { fr: "Road to 1 Md€", en: "Road to €1B" }, volumeMEur: 1000,
    tagline: { fr: "L'écosystème devient le marché : des places de liquidité et des institutions branchées en direct, préparées pendant l'échelle, portent le milliard.", en: "The ecosystem becomes the market: liquidity venues and institutions plugged in directly, prepared during scale, carry the billion." } },
];

export const STREAM_META: Record<Stream, { label: Bilingual; sub: Bilingual }> = {
  distribution: { label: { fr: "Distribution", en: "Distribution" }, sub: { fr: "Qui finance, et par quel canal", en: "Who funds, and through which channel" } },
  sous_jacents: { label: { fr: "Sous-jacents", en: "Underlyings" }, sub: { fr: "D'où viennent les actifs", en: "Where the assets come from" } },
  marche: { label: { fr: "Marché", en: "Market" }, sub: { fr: "Les tables où Minah est vue, et qui elle y rencontre", en: "The tables where Minah is seen, and whom it meets there" } },
};

// Les photos, par titre court : toutes dans public/brand/gtm, déjà servies par
// le go-to-market. On les réutilise, pas de nouveau fichier.
const P = {
  ceoForum: { src: "/brand/gtm/field-1.jpg", t: { fr: "Africa CEO Forum, Abidjan", en: "Africa CEO Forum, Abidjan" }, d: { fr: "Panel présidentiel : Ramaphosa, Kagame, El-Ghazouani.", en: "Presidential panel: Ramaphosa, Kagame, El-Ghazouani." } },
  elysee: { src: "/brand/gtm/field-2.jpg", t: { fr: "Palais de l'Élysée, Paris", en: "Élysée Palace, Paris" }, d: { fr: "Rencontre privée avec Emmanuel Macron et les grandes figures de la diaspora.", en: "Private meeting with Emmanuel Macron and leading diaspora figures." } },
  africaHouse: { src: "/brand/gtm/field-7.jpg?v=2", t: { fr: "Africa House, World Economic Forum, Davos", en: "Africa House, World Economic Forum, Davos" }, d: { fr: "Modération de panel, Healthcap, Revenge Capital, Africa Finance Corporation.", en: "Panel moderation, Healthcap, Revenge Capital, Africa Finance Corporation." } },
  africaCollective: { src: "/brand/gtm/field-22.jpg", t: { fr: "Africa Collective, World Economic Forum, Davos", en: "Africa Collective, World Economic Forum, Davos" }, d: { fr: "Standard Bank, Ventures Platform, Old Mutual, Novartis.", en: "Standard Bank, Ventures Platform, Old Mutual, Novartis." } },
  afis: { src: "/brand/gtm/field-9.jpg", t: { fr: "Africa Financial Industry Summit, Lomé", en: "Africa Financial Industry Summit, Lomé" }, d: { fr: "Modération de panel, SanlamAllianz, UBA, AFDB.", en: "Panel moderation, SanlamAllianz, UBA, AFDB." } },
  ouattara: { src: "/brand/gtm/field-6.jpg", t: { fr: "Cocktail privé, Abidjan", en: "Private cocktail, Abidjan" }, d: { fr: "Rencontre avec la Première dame de Côte d'Ivoire.", en: "Meeting with the First Lady of Côte d'Ivoire." } },
  wwfc: { src: "/brand/gtm/field-21.jpg", t: { fr: "Women Working for Change, Abidjan", en: "Women Working for Change, Abidjan" }, d: { fr: "Ecobank, Bank of Kigali, Transcorp, Zambia National Commercial Bank.", en: "Ecobank, Bank of Kigali, Transcorp, Zambia National Commercial Bank." } },
  doha: { src: "/brand/gtm/field-13.jpg", t: { fr: "Web Summit, Doha", en: "Web Summit, Doha" }, d: { fr: "C'est là qu'un fonds américain a rejoint Kupanda.", en: "Where a US fund joined Kupanda." } },
  nairobi: { src: "/brand/gtm/field-5.jpg", t: { fr: "Africa Forward, Nairobi", en: "Africa Forward, Nairobi" }, d: { fr: "Sommet France, Kenya, avec la délégation présidentielle française.", en: "France, Kenya summit, with the French presidential delegation." } },
  changeNow: { src: "/brand/gtm/field-3.jpg?v=2", t: { fr: "ChangeNOW, Grand Palais, Paris", en: "ChangeNOW, Grand Palais, Paris" }, d: { fr: "Africa for Change, modération de panel.", en: "Africa for Change, panel moderation." } },
  cotonou: { src: "/brand/gtm/field-16.jpg", t: { fr: "Rencontre privée, Cotonou", en: "Private meeting, Cotonou" }, d: { fr: "Particuliers fortunés et corporates.", en: "Wealthy individuals and corporates." } },
  conakry: { src: "/brand/gtm/field-17.jpg", t: { fr: "Rencontre privée, Conakry", en: "Private meeting, Conakry" }, d: { fr: "Corporates et investisseurs.", en: "Corporates and investors." } },
  paloneo: { src: "/brand/gtm/field-18.jpg", t: { fr: "Sommet Paloneo, Hambourg", en: "Paloneo Summit, Hamburg" }, d: { fr: "Partenaire du WEF ; table ronde Afrique animée avec Launch Africa.", en: "WEF partner; Africa round table hosted with Launch Africa." } },
  marrakech: { src: "/brand/gtm/field-19.jpg", t: { fr: "Rencontre privée, Marrakech", en: "Private meeting, Marrakech" }, d: { fr: "Diaspora et investisseurs.", en: "Diaspora and investors." } },
  onChain: { src: "/brand/gtm/field-10.jpg", t: { fr: "50 Days on Chain, Paris", en: "50 Days on Chain, Paris" }, d: { fr: "Présentation de Minah.", en: "Minah presentation." } },
  delubac: { src: "/brand/gtm/field-11.jpg", t: { fr: "Prix Cyrille Bialkiewicz, Paris", en: "Cyrille Bialkiewicz Prize, Paris" }, d: { fr: "Remis par la Banque Delubac.", en: "Awarded by Banque Delubac." } },
  circleGP: { src: "/brand/gtm/field-14.jpg", t: { fr: "Minah Circle, Grand Palais, Paris", en: "Minah Circle, Grand Palais, Paris" }, d: { fr: "L'écosystème investisseur de ChangeNOW.", en: "ChangeNOW's investor ecosystem." } },
  circleLome: { src: "/brand/gtm/field-15.jpg", t: { fr: "Minah Circle, Lomé", en: "Minah Circle, Lomé" }, d: { fr: "L'écosystème tech et corporate de Lomé.", en: "Lomé's tech and corporate ecosystem." } },
  circleParis: { src: "/brand/gtm/field-12.jpg?v=2", t: { fr: "Minah Circle, Paris", en: "Minah Circle, Paris" }, d: { fr: "Le rendez-vous annuel, avec ChangeNOW et la Fondation Stellar.", en: "The annual gathering, with ChangeNOW and the Stellar Foundation." } },
  lome: { src: "/brand/gtm/field-4.jpg", t: { fr: "Congrès panafricain, Lomé", en: "Pan-African Congress, Lomé" }, d: { fr: "Prise de parole et modération.", en: "Speaking and moderation." } },
} satisfies Record<string, Photo>;

export type Chapter = {
  /** Le récit du fil sur la phase. Les **gras** sont les noms que l'on peut écrire. */
  text: Bilingual;
  photos?: Photo[];
  /** Hypothèse à valider par l'équipe. */
  aConfirmer?: boolean;
};

export const NARRATIVE: Record<GrowthPhase, Record<Stream, Chapter>> = {
  amorcage: {
    distribution: {
      text: {
        fr: "Les premiers souscripteurs viennent du réseau direct des fondateurs : des particuliers fortunés de la diaspora, rencontrés en rendez-vous privés à **Paris**, **Cotonou**, **Conakry**, **Marrakech**. Moins de quarante investisseurs, et la preuve que le parcours tient de bout en bout.",
        en: "The first subscribers come from the founders' direct network: wealthy diaspora individuals met in private meetings in **Paris**, **Cotonou**, **Conakry**, **Marrakech**. Under forty investors, and proof that the journey holds end to end.",
      },
      photos: [P.cotonou, P.conakry, P.marrakech],
    },
    sous_jacents: {
      text: {
        fr: "Une première stratégie, un projet ouest-africain unique, pour apprendre ce que ce marché demande. L'obligation est tokenisée sur **Stellar**, gardée chez **Fireblocks**, souscrite après un KYC **Sumsub** : l'infrastructure sert avant d'être présentée.",
        en: "A first strategy, a single West African project, to learn what this market asks for. The bond is tokenised on **Stellar**, held at **Fireblocks**, subscribed after **Sumsub** KYC: the infrastructure serves before it is shown.",
      },
    },
    marche: {
      text: {
        fr: "Minah prend la parole là où l'Afrique se finance : **Africa Financial Industry Summit** et congrès panafricain à **Lomé**, **50 Days on Chain** à Paris. Le **Prix Cyrille Bialkiewicz**, remis par la Banque Delubac, est la première reconnaissance extérieure.",
        en: "Minah speaks where Africa gets financed: the **Africa Financial Industry Summit** and the Pan-African Congress in **Lomé**, **50 Days on Chain** in Paris. The **Cyrille Bialkiewicz Prize**, awarded by Banque Delubac, is the first outside recognition.",
      },
      photos: [P.afis, P.lome, P.delubac],
    },
  },
  traction: {
    distribution: {
      text: {
        fr: "La plateforme bascule vers les investisseurs professionnels, qui souscrivent en ligne. La machine à réseau se formalise : les **Network Builders**, brokers et banquiers privés, ont déjà introduit dix investisseurs qualifiés ; les **Minah Circles** réunissent cinquante personnes par édition ; **Sereel**, premier protocole partenaire, distribue les stratégies à ses propres clients via l'API. Un fonds américain rencontré à Doha co-structure Kupanda.",
        en: "The platform turns to professional investors, who subscribe online. The network machine takes shape: the **Network Builders**, brokers and private bankers, have already introduced ten qualified investors; the **Minah Circles** gather fifty people per edition; **Sereel**, the first partner protocol, distributes the strategies to its own clients through the API. A US fund met in Doha co-structures Kupanda.",
      },
      photos: [P.circleParis, P.circleGP, P.circleLome],
      aConfirmer: true,
    },
    sous_jacents: {
      text: {
        fr: "**Kupanda** : un contrat cadre signé avec la **République de Zambie**, une obligation in fine de 2 M€ à 12 mois, 20 % annuel, adossée à des contrats publics déjà attribués. La contrepartie finale est un État, et le contrat est dans la data room.",
        en: "**Kupanda**: a framework agreement signed with the **Republic of Zambia**, a €2M 12-month bullet bond, 20% annual, backed by already-awarded public contracts. The final counterparty is a State, and the contract is in the data room.",
      },
      photos: [P.wwfc, P.ouattara],
    },
    marche: {
      text: {
        fr: "Les tables où se concentre le capital : **Davos**, en parallèle du World Economic Forum, à l'Africa House et à l'Africa Collective ; l'**Africa CEO Forum** à Abidjan, réservé aux entreprises de plus de 10 M€ de chiffre d'affaires ; l'**Élysée**, pour une rencontre privée avec le président de la République et la diaspora ; **ChangeNOW** au Grand Palais ; le **Web Summit** à Doha.",
        en: "The tables where capital gathers: **Davos**, alongside the World Economic Forum, at Africa House and the Africa Collective; the **Africa CEO Forum** in Abidjan, reserved for companies above €10M revenue; the **Élysée**, for a private meeting with the French President and the diaspora; **ChangeNOW** at the Grand Palais; the **Web Summit** in Doha.",
      },
      photos: [P.africaHouse, P.ceoForum, P.elysee, P.changeNow, P.doha, P.africaCollective],
    },
  },
  distribution: {
    distribution: {
      text: {
        fr: "Minah n'est plus le seul guichet. Trois protocoles de plus se branchent sur l'API, sur le modèle de Sereel ; un partenaire bancaire assure les entrées et sorties en euros pour les souscripteurs sans wallet ; les Network Builders passent à vingt apporteurs actifs. Un investisseur peut arriver par un tiers sans jamais parler à l'équipe.",
        en: "Minah is no longer the only counter. Three more protocols connect to the API, on the Sereel model; a banking partner handles euro on- and off-ramps for subscribers without a wallet; the Network Builders grow to twenty active introducers. An investor can arrive through a third party without ever speaking to the team.",
      },
      aConfirmer: true,
    },
    sous_jacents: {
      text: {
        fr: "Une nouvelle stratégie de 15 à 20 M€, structurée sur le même cadre que Kupanda : des PME titulaires de contrats publics déjà attribués, dans d'autres pays de la région. Un émetteur de dette souveraine tokenisée ouvre le second moteur. Un second rail institutionnel, **Canton Network**, rejoint Stellar.",
        en: "A new €15M to €20M strategy, structured on the same framework as Kupanda: SMEs holding already-awarded public contracts, in other countries of the region. A tokenised sovereign debt issuer opens the second engine. A second institutional rail, **Canton Network**, joins Stellar.",
      },
      aConfirmer: true,
    },
    marche: {
      text: {
        fr: "Les Minah Circles se cadencent sur trois hubs : **Paris**, **Abidjan** en marge de l'Africa CEO Forum, **Davos** en marge du WEF. Le **sommet Paloneo** à Hambourg, partenaire du WEF, ouvre la table des VC et des LP européens.",
        en: "The Minah Circles settle into a rhythm across three hubs: **Paris**, **Abidjan** alongside the Africa CEO Forum, **Davos** alongside the WEF. The **Paloneo Summit** in Hamburg, a WEF partner, opens the table of European VCs and LPs.",
      },
      photos: [P.paloneo, P.nairobi],
      aConfirmer: true,
    },
  },
  echelle: {
    distribution: {
      text: {
        fr: "Trois sources de capital sur la même infrastructure : les investisseurs professionnels et leurs apporteurs, les allocataires crypto-natifs qui investissent dans le vault, et les fonds et institutions qui souscrivent en direct par l'API, branchés sur leurs propres systèmes. Des agents IA consultent et souscrivent.",
        en: "Three sources of capital on the same infrastructure: professional investors and their introducers, crypto-native allocators investing in the vault, and funds and institutions subscribing directly through the API, plugged into their own systems. AI agents browse and subscribe.",
      },
      aConfirmer: true,
    },
    sous_jacents: {
      text: {
        fr: "Trois sources d'actifs : la dette privée des contrats publics, les T-bills tokenisés où travaille la trésorerie en attente, et les fintechs africaines qui empruntent au vault sans intermédiaire. Cent millions d'euros déployés et suivis on-chain de bout en bout.",
        en: "Three sources of assets: private debt from public contracts, tokenised T-bills where idle treasury works, and African fintechs borrowing from the vault without intermediary. One hundred million euros deployed and tracked on-chain end to end.",
      },
      aConfirmer: true,
    },
    marche: {
      text: {
        fr: "Minah n'est plus invitée aux tables, elle en tient une : un Minah Circle par trimestre, une présence institutionnelle à Davos et à Abidjan, et des partenaires qui parlent de Minah à notre place.",
        en: "Minah is no longer invited to the tables, it holds one: a Minah Circle every quarter, an institutional presence in Davos and Abidjan, and partners who speak about Minah on our behalf.",
      },
      aConfirmer: true,
    },
  },
  marche: {
    distribution: {
      text: {
        fr: "Une position Minah se cède : principal et rendement séparés, marché secondaire, sortie avant l'échéance. Des places de liquidité et des teneurs de marché se branchent ; un token ouvre toutes les stratégies.",
        en: "A Minah position can be sold: principal and yield separated, secondary market, exit before maturity. Liquidity venues and market makers plug in; one token opens every strategy.",
      },
      aConfirmer: true,
    },
    sous_jacents: {
      text: {
        fr: "Un milliard d'euros d'actifs réels africains, originés par des partenaires autant que par Minah : États, PME, fintechs, dans plusieurs pays et plusieurs devises, sur une infrastructure que d'autres utilisent.",
        en: "One billion euros of African real assets, originated by partners as much as by Minah: States, SMEs, fintechs, across several countries and currencies, on an infrastructure others use.",
      },
      aConfirmer: true,
    },
    marche: {
      text: {
        fr: "Minah est une couche de l'écosystème : la référence que citent les tables où elle a commencé par être invitée.",
        en: "Minah is a layer of the ecosystem: the reference cited by the tables where it started out as a guest.",
      },
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
  { id: "institutions-api", stream: "distribution", category: "institutions", name: { fr: "Fonds et institutions par l'API", en: "Funds and institutions through the API" }, depuis: "echelle", named: false, aConfirmer: true },
  { id: "allocataires-crypto", stream: "distribution", category: "crypto", name: { fr: "Allocataires crypto-natifs", en: "Crypto-native allocators" }, depuis: "echelle", named: false, aConfirmer: true },
  { id: "agents-ia", stream: "distribution", category: "agents", name: { fr: "Agents IA", en: "AI agents" }, depuis: "echelle", named: false },
  { id: "places-liquidite", stream: "distribution", category: "protocoles", name: { fr: "Places de liquidité et teneurs de marché", en: "Liquidity venues and market makers" }, depuis: "marche", named: false, aConfirmer: true },
  // Sous-jacents
  { id: "stellar", stream: "sous_jacents", category: "infrastructure", name: { fr: "Stellar", en: "Stellar" }, depuis: "amorcage", logo: "/partners/stellar.png", url: "https://stellar.org" },
  { id: "fireblocks", stream: "sous_jacents", category: "infrastructure", name: { fr: "Fireblocks", en: "Fireblocks" }, depuis: "amorcage", logo: "/partners/fireblocks.png", url: "https://www.fireblocks.com" },
  { id: "sumsub", stream: "sous_jacents", category: "infrastructure", name: { fr: "Sumsub", en: "Sumsub" }, depuis: "amorcage", logo: "/partners/sumsub.png", url: "https://sumsub.com" },
  { id: "premier-projet", stream: "sous_jacents", category: "pme", name: { fr: "Premier projet ouest-africain", en: "First West African project" }, depuis: "amorcage", named: false },
  { id: "zambie", stream: "sous_jacents", category: "gouvernements", name: { fr: "République de Zambie", en: "Republic of Zambia" }, depuis: "traction" },
  { id: "kupanda", stream: "sous_jacents", category: "pme", name: { fr: "Kupanda, 2 M€", en: "Kupanda, €2M" }, depuis: "traction" },
  { id: "contrats-publics", stream: "sous_jacents", category: "pme", name: { fr: "Pipeline de contrats publics, 15 à 20 M€", en: "Public contract pipeline, €15M to €20M" }, depuis: "distribution", named: false, aConfirmer: true },
  { id: "canton", stream: "sous_jacents", category: "infrastructure", name: { fr: "Canton Network", en: "Canton Network" }, depuis: "distribution", logo: "/partners/canton.png", url: "https://www.canton.network" },
  { id: "souverain", stream: "sous_jacents", category: "souverain", name: { fr: "Émetteur de dette souveraine tokenisée", en: "Tokenised sovereign debt issuer" }, depuis: "distribution", named: false, aConfirmer: true },
  { id: "tbills", stream: "sous_jacents", category: "souverain", name: { fr: "T-bills tokenisés", en: "Tokenised T-bills" }, depuis: "echelle", named: false, aConfirmer: true },
  { id: "fintechs", stream: "sous_jacents", category: "fintech", name: { fr: "Fintechs africaines", en: "African fintechs" }, depuis: "echelle", named: false, aConfirmer: true },
  { id: "etats-pays", stream: "sous_jacents", category: "gouvernements", name: { fr: "Plusieurs États, plusieurs devises", en: "Several States, several currencies" }, depuis: "marche", named: false, aConfirmer: true },
  // Marché
  { id: "afis", stream: "marche", category: "sommets", name: { fr: "Africa Financial Industry Summit", en: "Africa Financial Industry Summit" }, depuis: "amorcage", logo: "/partners/afis.png" },
  { id: "congres-lome", stream: "marche", category: "sommets", name: { fr: "Congrès panafricain, Lomé", en: "Pan-African Congress, Lomé" }, depuis: "amorcage" },
  { id: "50days", stream: "marche", category: "sommets", name: { fr: "50 Days on Chain", en: "50 Days on Chain" }, depuis: "amorcage" },
  { id: "rencontres-amorcage", stream: "marche", category: "rencontres", name: { fr: "Cotonou, Conakry, Marrakech", en: "Cotonou, Conakry, Marrakech" }, depuis: "amorcage" },
  { id: "delubac", stream: "marche", category: "prix", name: { fr: "Prix Cyrille Bialkiewicz, Banque Delubac", en: "Cyrille Bialkiewicz Prize, Banque Delubac" }, depuis: "amorcage" },
  { id: "wef", stream: "marche", category: "sommets", name: { fr: "World Economic Forum, Davos", en: "World Economic Forum, Davos" }, depuis: "traction", logo: "/partners/wef.png", url: "https://www.weforum.org" },
  { id: "africa-ceo-forum", stream: "marche", category: "sommets", name: { fr: "Africa CEO Forum", en: "Africa CEO Forum" }, depuis: "traction", url: "https://www.theafricaceoforum.com" },
  { id: "changenow", stream: "marche", category: "sommets", name: { fr: "ChangeNOW", en: "ChangeNOW" }, depuis: "traction", logo: "/partners/changenow.png", url: "https://www.changenow.world" },
  { id: "websummit", stream: "marche", category: "sommets", name: { fr: "Web Summit", en: "Web Summit" }, depuis: "traction", logo: "/partners/websummit.png", url: "https://websummit.com" },
  { id: "africa-forward", stream: "marche", category: "sommets", name: { fr: "Africa Forward, Nairobi", en: "Africa Forward, Nairobi" }, depuis: "traction" },
  { id: "elysee", stream: "marche", category: "rencontres", name: { fr: "Palais de l'Élysée", en: "Élysée Palace" }, depuis: "traction" },
  { id: "premiere-dame", stream: "marche", category: "rencontres", name: { fr: "Première dame de Côte d'Ivoire", en: "First Lady of Côte d'Ivoire" }, depuis: "traction" },
  { id: "circles-tenus", stream: "marche", category: "nos_evenements", name: { fr: "Minah Circle : Paris, Grand Palais, Lomé", en: "Minah Circle: Paris, Grand Palais, Lomé" }, depuis: "traction", logo: MINAH },
  { id: "paloneo", stream: "marche", category: "sommets", name: { fr: "Sommet Paloneo, Hambourg", en: "Paloneo Summit, Hamburg" }, depuis: "distribution" },
  { id: "circles-hubs", stream: "marche", category: "nos_evenements", name: { fr: "Minah Circle : Abidjan, Davos", en: "Minah Circle: Abidjan, Davos" }, depuis: "distribution", logo: MINAH, aConfirmer: true },
  { id: "circle-trimestriel", stream: "marche", category: "nos_evenements", name: { fr: "Un Circle par trimestre", en: "One Circle per quarter" }, depuis: "echelle", logo: MINAH, aConfirmer: true },
];
