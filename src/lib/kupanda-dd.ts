// Contenu de la fiche « Due diligence Kupanda » (brouillon, 24/10/2026).
//
// Tiré du mémorandum d'investissement Kupanda (avril 2026), de la cascade de
// risque validée (src/lib/risk-levels.ts) et de la term sheet. Deux écarts du
// mémo sont corrigés ici : la devise de déploiement (le mémo parle de francs
// CFA, l'opération passe par le dollar et un swap avec Zanaco Bank) et les
// juridictions (le mémo cite le Kenya et le Rwanda, Kupanda est zambienne).
//
// Une chaîne `null` dans `value` est un montant à renseigner : la fiche
// l'affiche surligné en jaune, jamais inventé.

export type Bi = { fr: string; en: string };

// --- Documents ---------------------------------------------------------------

export type DocKind =
  // Une fiche de la data room, ouverte ou non selon le niveau de la personne.
  | { type: "dataroom"; slug: string }
  // Communiqué par l'équipe à la demande.
  | { type: "request" };

export type DdDoc = { id: string; title: Bi; kind: DocKind };

export const DD_DOCS: DdDoc[] = [
  { id: "term-sheet", title: { fr: "Term sheet Kupanda", en: "Kupanda term sheet" }, kind: { type: "dataroom", slug: "term-sheet-kupanda" } },
  { id: "en-bref", title: { fr: "Kupanda en bref", en: "Kupanda at a glance" }, kind: { type: "dataroom", slug: "kupanda-en-bref" } },
  { id: "business-model", title: { fr: "Business model Minah", en: "Minah business model" }, kind: { type: "dataroom", slug: "business-model" } },
  { id: "risk-deck", title: { fr: "Deck risk Kupanda", en: "Kupanda risk deck" }, kind: { type: "dataroom", slug: "risk-deck-kupanda" } },
  { id: "risk-architecture", title: { fr: "Architecture de risque, niveau par niveau", en: "Risk architecture, level by level" }, kind: { type: "dataroom", slug: "gestion-du-risque" } },
  { id: "memo", title: { fr: "Mémorandum d'investissement", en: "Investment memorandum" }, kind: { type: "request" } },
  { id: "notice", title: { fr: "Notice de l'obligation", en: "Bond notice" }, kind: { type: "request" } },
  { id: "kbis", title: { fr: "Extrait Kbis et statuts de Minah SAS", en: "Minah SAS registration extract and articles" }, kind: { type: "request" } },
  { id: "masse", title: { fr: "Contrat de représentation de la masse des obligataires", en: "Bondholder representation agreement" }, kind: { type: "request" } },
  { id: "partnership", title: { fr: "Accord de partenariat Minah et Africa Rise", en: "Minah and Africa Rise partnership agreement" }, kind: { type: "request" } },
  { id: "financing", title: { fr: "Accord de financement du fonds de roulement", en: "Working-capital financing agreement" }, kind: { type: "request" } },
  { id: "framework", title: { fr: "Contrat cadre, République de Zambie", en: "Framework agreement, Republic of Zambia" }, kind: { type: "request" } },
  { id: "cases", title: { fr: "Dossiers de PME financées", en: "Files of financed SMEs" }, kind: { type: "request" } },
  { id: "bond", title: { fr: "Termes et conditions du performance bond", en: "Performance bond terms and conditions" }, kind: { type: "request" } },
  { id: "insurance", title: { fr: "Termes clés de l'assurance crédit", en: "Credit insurance key terms" }, kind: { type: "request" } },
  { id: "swap", title: { fr: "Accord de currency swap avec Zanaco Bank", en: "Currency swap agreement with Zanaco Bank" }, kind: { type: "request" } },
];

// --- Le chemin du capital : acteurs et flux -----------------------------------

export type Fact = { label: Bi; value: Bi | null };

export type DdItem = {
  id: string;
  kind: "actor" | "flow" | "protection" | "usecase";
  title: Bi;
  /** Sous-titre, sous le titre du panneau. */
  tag: Bi;
  facts: Fact[];
  /** Les enjeux, une phrase chacun. */
  points: Bi[];
  docs: string[];
};

export const ACTORS: (DdItem & { short: Bi; figure: Bi })[] = [
  {
    id: "souscripteurs",
    kind: "actor",
    title: { fr: "Souscripteurs", en: "Subscribers" },
    short: { fr: "Investisseurs avertis", en: "Qualified investors" },
    figure: { fr: "dès 30 000 €", en: "from €30,000" },
    tag: { fr: "Investisseurs avertis, en Europe et à l'international", en: "Qualified investors, in Europe and internationally" },
    facts: [
      { label: { fr: "Souscription minimale", en: "Minimum subscription" }, value: { fr: "30 000 €, soit 3 obligations", en: "€30,000, i.e. 3 bonds" } },
      { label: { fr: "Valeur nominale", en: "Face value" }, value: { fr: "10 000 € par obligation", en: "€10,000 per bond" } },
      { label: { fr: "Devises acceptées", en: "Accepted currencies" }, value: { fr: "EUR, USD, USDC, USDT, BTC, ETH, XLM", en: "EUR, USD, USDC, USDT, BTC, ETH, XLM" } },
      { label: { fr: "Seuil d'appel du capital", en: "Capital call threshold" }, value: { fr: "200 000 €", en: "€200,000" } },
    ],
    points: [
      { fr: "L'offre est réservée aux investisseurs avertis (article L.411-2 du Code monétaire et financier), après un KYC ou un KYB complet.", en: "The offer is reserved for qualified investors (article L.411-2 of the French Monetary and Financial Code), after full KYC or KYB." },
      { fr: "Le capital est engagé à la souscription, mais n'est appelé qu'une fois le seuil de 200 000 € atteint et confirmé.", en: "Capital is committed at subscription, but only called once the €200,000 threshold is reached and confirmed." },
      { fr: "En actifs numériques, la position est un security token sur Stellar, et les coupons arrivent en USDC dans le wallet. Le token ne circule qu'entre investisseurs vérifiés, inscrits sur liste blanche.", en: "In digital assets, the position is a security token on Stellar, and coupons arrive in USDC in the wallet. The token only moves between verified, whitelisted investors." },
      { fr: "L'offre est fermée aux ressortissants américains non accrédités (FATCA, Regulation S).", en: "The offer is closed to non-accredited US persons (FATCA, Regulation S)." },
    ],
    docs: ["term-sheet", "notice", "memo"],
  },
  {
    id: "minah",
    kind: "actor",
    title: { fr: "Minah SAS", en: "Minah SAS" },
    short: { fr: "Émetteur, Paris", en: "Issuer, Paris" },
    figure: { fr: "2 M€, puis 10 M€", en: "€2M, then €10M" },
    tag: { fr: "Émetteur de l'obligation, seule contrepartie des obligataires", en: "Bond issuer, sole counterparty to bondholders" },
    facts: [
      { label: { fr: "Instrument", en: "Instrument" }, value: { fr: "Obligation in fine de droit français", en: "French-law bullet bond" } },
      { label: { fr: "Kupanda 1, en cours", en: "Kupanda 1, live" }, value: { fr: "2 000 000 €", en: "€2,000,000" } },
      { label: { fr: "Kupanda 2, en préparation", en: "Kupanda 2, in preparation" }, value: { fr: "10 000 000 €, mêmes termes", en: "€10,000,000, same terms" } },
      { label: { fr: "Immatriculation", en: "Registration" }, value: { fr: "SAS, RCS Paris, SIREN 931 561 708", en: "SAS, Paris trade register, SIREN 931 561 708" } },
      { label: { fr: "Représentant de la masse", en: "Bondholder representative" }, value: { fr: "Julca", en: "Julca" } },
    ],
    points: [
      { fr: "Minah SAS est tenue de payer les intérêts et de rembourser le principal à l'échéance, quelle que soit la performance des financements sous-jacents.", en: "Minah SAS is bound to pay interest and repay principal at maturity, whatever the performance of the underlying financings." },
      { fr: "Les fonds des investisseurs sont juridiquement séparés des actifs opérationnels de Minah.", en: "Investor funds are legally separated from Minah's operating assets." },
      { fr: "Chaque porteur est membre de la masse des obligataires, qui peut agir seule en cas de défaut ou de litige, sans action individuelle et sans l'intervention de Minah.", en: "Each holder is a member of the bondholder body, which can act on its own in a default or dispute, with no individual action and without Minah's involvement." },
      { fr: "Tout le cycle d'investissement est enregistré sur Stellar.", en: "The whole investment cycle is recorded on Stellar." },
    ],
    docs: ["kbis", "masse", "business-model"],
  },
  {
    id: "africa-rise",
    kind: "actor",
    title: { fr: "Africa Rise", en: "Africa Rise" },
    short: { fr: "Partenaire local, Lusaka", en: "Local partner, Lusaka" },
    figure: { fr: "Garantie jusqu'à 2 M€", en: "Guarantee up to €2M" },
    tag: { fr: "Africa Rise Limited, partenaire stratégique en Zambie", en: "Africa Rise Limited, strategic partner in Zambia" },
    facts: [
      { label: { fr: "Rôle", en: "Role" }, value: { fr: "Source, structure et suit les financements", en: "Sources, structures and monitors the financings" } },
      { label: { fr: "Garantie de performance minimale", en: "Minimum performance guarantee" }, value: { fr: "Jusqu'à 2 M€", en: "Up to €2M" } },
      { label: { fr: "Devise de déploiement", en: "Deployment currency" }, value: { fr: "USD, swap avec Zanaco Bank", en: "USD, swap with Zanaco Bank" } },
    ],
    points: [
      { fr: "Kupanda est co-construite avec Africa Rise, qui connaît le prêt aux PME zambiennes, les appels d'offres publics et le cadre réglementaire local.", en: "Kupanda is co-built with Africa Rise, which knows lending to Zambian SMEs, public tenders and the local regulatory framework." },
      { fr: "L'accord de partenariat traite trois risques : le crédit (critères d'éligibilité stricts), la performance (décaissements par étapes, reporting) et le change.", en: "The partnership agreement deals with three risks: credit (strict eligibility criteria), performance (staged disbursements, reporting) and currency." },
      { fr: "Africa Rise garantit contractuellement un niveau minimal de performance : il couvre les coûts opérationnels et le remboursement des investisseurs jusqu'à 2 M€, adossé à sa propre réserve de liquidité.", en: "Africa Rise contractually guarantees a minimum level of performance: it covers operating costs and investor repayment up to €2M, backed by its own liquidity reserve." },
    ],
    docs: ["partnership", "financing", "swap"],
  },
  {
    id: "pme",
    kind: "actor",
    title: { fr: "PME sous contrat", en: "SMEs under contract" },
    short: { fr: "Infrastructure, énergie", en: "Infrastructure, energy" },
    figure: { fr: "0 % de défaut", en: "0% default" },
    tag: { fr: "Des PME zambiennes titulaires de marchés publics signés", en: "Zambian SMEs holding signed public contracts" },
    facts: [
      { label: { fr: "Rang", en: "Seniority" }, value: { fr: "Dette senior", en: "Senior debt" } },
      { label: { fr: "Collatéral", en: "Collateral" }, value: { fr: "La créance sur le contrat public", en: "The receivable on the public contract" } },
      { label: { fr: "Durée d'un financement", en: "Financing term" }, value: { fr: "3 à 5 mois, 3 en moyenne", en: "3 to 5 months, 3 on average" } },
      { label: { fr: "Défaut à ce jour", en: "Defaults to date" }, value: { fr: "Aucun, sur 10 M€ déployés", en: "None, on €10M deployed" } },
    ],
    points: [
      { fr: "Chaque PME est titulaire d'un marché public signé : l'État zambien est l'acheteur final, et le financement est remboursé sur son règlement.", en: "Each SME holds a signed public contract: the Zambian State is the final buyer, and the financing is repaid from its settlement." },
      { fr: "Deux cas d'usage : l'infrastructure et l'énergie.", en: "Two use cases: infrastructure and energy." },
    ],
    docs: ["cases", "bond"],
  },
  {
    id: "etat",
    kind: "actor",
    title: { fr: "État zambien", en: "Zambian State" },
    short: { fr: "Acheteur final", en: "Final buyer" },
    figure: { fr: "2 ministères partenaires", en: "2 partner ministries" },
    tag: { fr: "L'acheteur final des contrats financés", en: "The final buyer of the financed contracts" },
    facts: [
      { label: { fr: "Ministères partenaires", en: "Partner ministries" }, value: { fr: "PME (MSMED), Administration locale (MLGRD)", en: "SMEs (MSMED), Local Government (MLGRD)" } },
      { label: { fr: "Taux bancaire moyen", en: "Average bank lending rate" }, value: { fr: "28 % en Zambie", en: "28% in Zambia" } },
    ],
    points: [
      { fr: "Les deux ministères vérifient que les contrats financés sont authentiques, dûment attribués et couverts par un budget alloué.", en: "The two ministries check that the financed contracts are genuine, duly awarded and covered by an allocated budget." },
      { fr: "Le défaut de l'État sur un contrat relève de l'assurance crédit ; un événement systémique (conflit, inconvertibilité, transfert) de l'assurance risque systémique.", en: "A State default on a contract falls under the credit insurance; a systemic event (conflict, inconvertibility, transfer) under the systemic-risk insurance." },
      { fr: "Le coupon de 20 % se situe sous le prix local du crédit : les entreprises zambiennes empruntent à 28 % en moyenne, les PME plus cher encore.", en: "The 20% coupon sits below the local price of credit: Zambian companies borrow at 28% on average, SMEs at more." },
    ],
    docs: ["framework", "insurance"],
  },
];

export const FLOWS: (DdItem & { from: string; to: string; label: Bi })[] = [
  {
    id: "souscription",
    kind: "flow",
    from: "souscripteurs",
    to: "minah",
    label: { fr: "3,5 % de frais", en: "3.5% fees" },
    title: { fr: "La souscription", en: "Subscription" },
    tag: { fr: "Des souscripteurs vers Minah SAS", en: "From subscribers to Minah SAS" },
    facts: [
      { label: { fr: "Frais de transaction", en: "Transaction fees" }, value: { fr: "3,5 %, prélevés à la souscription", en: "3.5%, charged at subscription" } },
      { label: { fr: "Exemple", en: "Example" }, value: { fr: "30 000 € investis, 31 050 € versés", en: "€30,000 invested, €31,050 paid" } },
      { label: { fr: "Moyens de paiement", en: "Payment methods" }, value: { fr: "Virement ou actifs numériques", en: "Bank transfer or digital assets" } },
    ],
    points: [
      { fr: "La souscription se fait par virement bancaire, ou en actifs numériques après vérification KYC ou KYB.", en: "Subscription is made by bank transfer, or in digital assets after KYC or KYB checks." },
      { fr: "Rien n'est appelé avant le seuil minimal : il garantit un niveau de diversification et l'activation de toutes les protections.", en: "Nothing is called before the minimum threshold: it ensures a level of diversification and that every protection is active." },
    ],
    docs: ["term-sheet", "notice"],
  },
  {
    id: "deploiement",
    kind: "flow",
    from: "minah",
    to: "africa-rise",
    label: { fr: "EUR vers USD", en: "EUR to USD" },
    title: { fr: "Le déploiement", en: "Deployment" },
    tag: { fr: "De Minah SAS vers Africa Rise", en: "From Minah SAS to Africa Rise" },
    facts: [
      { label: { fr: "Cadre", en: "Framework" }, value: { fr: "Accord de financement du fonds de roulement", en: "Working-capital financing agreement" } },
      { label: { fr: "Change", en: "Currency" }, value: { fr: "Structuration en USD, swap Zanaco Bank", en: "USD structuring, Zanaco Bank swap" } },
    ],
    points: [
      { fr: "Une fois le seuil confirmé, Minah SAS agrège le capital souscrit et le transfère à Africa Rise Limited.", en: "Once the threshold is confirmed, Minah SAS pools the subscribed capital and transfers it to Africa Rise Limited." },
      { fr: "L'accord de financement fixe les calendriers de remboursement, les garanties et les droits de la masse des obligataires en cas de difficulté.", en: "The financing agreement sets repayment schedules, collateral and the rights of the bondholder body in case of difficulty." },
      { fr: "Le capital est structuré en dollars au niveau du partenaire ; un currency swap avec Zanaco Bank sécurise la disponibilité en USD à maturité.", en: "Capital is structured in dollars at partner level; a currency swap with Zanaco Bank secures USD availability at maturity." },
    ],
    docs: ["financing", "swap"],
  },
  {
    id: "financement",
    kind: "flow",
    from: "africa-rise",
    to: "pme",
    label: { fr: "Cycles de 3 à 5 mois", en: "3 to 5-month cycles" },
    title: { fr: "Le financement des PME", en: "Financing the SMEs" },
    tag: { fr: "D'Africa Rise vers les PME sous contrat", en: "From Africa Rise to SMEs under contract" },
    facts: [
      { label: { fr: "Objet", en: "Purpose" }, value: { fr: "Besoin en fonds de roulement d'un contrat public", en: "Working capital for a public contract" } },
      { label: { fr: "Durée par cycle", en: "Term per cycle" }, value: { fr: "3 à 5 mois", en: "3 to 5 months" } },
      { label: { fr: "Rotation sur 12 mois", en: "Turns over 12 months" }, value: null },
    ],
    points: [
      { fr: "Chaque euro déployé finance l'exécution d'un contrat public déjà signé : matériel, main-d'œuvre, livraison.", en: "Every euro deployed finances the delivery of an already-signed public contract: equipment, labour, delivery." },
      { fr: "Les cycles courts font tourner le capital plusieurs fois dans l'année, ce qui porte le rendement annualisé.", en: "Short cycles turn the capital several times a year, which drives the annualised return." },
      { fr: "Les décaissements se font par étapes, sous suivi de performance et obligations de reporting.", en: "Disbursements are staged, under performance monitoring and reporting obligations." },
    ],
    docs: ["financing", "cases"],
  },
  {
    id: "reglement",
    kind: "flow",
    from: "etat",
    to: "pme",
    label: { fr: "Paiement du contrat", en: "Contract payment" },
    title: { fr: "Le règlement par l'État", en: "Settlement by the State" },
    tag: { fr: "De l'État zambien vers les PME", en: "From the Zambian State to the SMEs" },
    facts: [
      { label: { fr: "Déclencheur", en: "Trigger" }, value: { fr: "Livraison du contrat public", en: "Delivery of the public contract" } },
      { label: { fr: "En cas de retard", en: "If late" }, value: { fr: "Clauses pénales, recouvrement par Africa Rise", en: "Penalty clauses, recovery by Africa Rise" } },
    ],
    points: [
      { fr: "L'État paie la PME à l'exécution du contrat ; le financement est remboursé sur ce règlement.", en: "The State pays the SME when the contract is delivered; the financing is repaid from that settlement." },
      { fr: "En cas de retard, des clauses pénales s'appliquent aussitôt, et Africa Rise intervient sur place pour faire respecter les délais et escalader le recouvrement.", en: "If payment is late, penalty clauses apply immediately, and Africa Rise steps in locally to enforce deadlines and escalate recovery." },
    ],
    docs: ["framework", "insurance"],
  },
  {
    id: "retour",
    kind: "flow",
    from: "pme",
    to: "souscripteurs",
    label: { fr: "20 % par an", en: "20% a year" },
    title: { fr: "Le retour aux souscripteurs", en: "Return to subscribers" },
    tag: { fr: "Coupons et principal, des PME jusqu'aux obligataires", en: "Coupons and principal, from the SMEs back to bondholders" },
    facts: [
      { label: { fr: "Coupon", en: "Coupon" }, value: { fr: "20 % par an", en: "20% a year" } },
      { label: { fr: "Versements", en: "Payments" }, value: { fr: "À 6 mois, puis à l'échéance avec le principal", en: "At 6 months, then at maturity with principal" } },
      { label: { fr: "Exemple, 50 000 €", en: "Example, €50,000" }, value: { fr: "5 000 € à 6 mois, 55 000 € à 12 mois", en: "€5,000 at 6 months, €55,000 at 12 months" } },
    ],
    points: [
      { fr: "Les remboursements remontent des PME à Africa Rise, puis à Minah SAS, qui les distribue aux obligataires.", en: "Repayments flow from the SMEs to Africa Rise, then to Minah SAS, which distributes them to bondholders." },
      { fr: "Les paiements se font dans le mode de la souscription : virement, ou USDC dans le wallet pour les souscripteurs en actifs numériques.", en: "Payments use the subscription method: bank transfer, or USDC in the wallet for digital-asset subscribers." },
      { fr: "Aucun remboursement anticipé : l'obligation court 12 mois.", en: "No early redemption: the bond runs for 12 months." },
    ],
    docs: ["term-sheet", "notice"],
  },
];

// --- Les cas d'usage, deux PME types du mémo --------------------------------

export const USE_CASES: DdItem[] = [
  {
    id: "uc-infrastructure",
    kind: "usecase",
    title: { fr: "Infrastructure", en: "Infrastructure" },
    tag: { fr: "Du mobilier scolaire pour le ministère de l'Éducation", en: "School furniture for the Ministry of Education" },
    facts: [
      { label: { fr: "Acheteur public", en: "Public buyer" }, value: { fr: "Ministère de l'Éducation", en: "Ministry of Education" } },
      { label: { fr: "Contrat", en: "Contract" }, value: { fr: "Prêt professionnel adossé à un contrat public", en: "Business loan backed by a public contract" } },
      { label: { fr: "Montant financé", en: "Amount financed" }, value: null },
      { label: { fr: "Durée", en: "Term" }, value: null },
    ],
    points: [
      { fr: "L'entreprise fournit des tables scolaires au ministère de l'Éducation.", en: "The company supplies school desks to the Ministry of Education." },
      { fr: "Fournisseur historique de produits alimentaires pour l'État, elle met sa logistique existante au service d'un contrat de mobilier scolaire complémentaire.", en: "A long-standing food supplier to the State, it puts its existing logistics to work on an additional school furniture contract." },
      { fr: "Son activité principale comme le contrat de mobilier sont adossés à des marchés publics signés.", en: "Both its core business and the furniture contract are backed by signed public contracts." },
    ],
    docs: ["cases"],
  },
  {
    id: "uc-energie",
    kind: "usecase",
    title: { fr: "Énergie", en: "Energy" },
    tag: { fr: "Des centrales solaires dans la province de Lusaka", en: "Solar plants in Lusaka Province" },
    facts: [
      { label: { fr: "Acheteur public", en: "Public buyer" }, value: { fr: "État zambien, toute la production", en: "Zambian State, all the output" } },
      { label: { fr: "Contrat", en: "Contract" }, value: { fr: "Prêt professionnel adossé à un contrat public", en: "Business loan backed by a public contract" } },
      { label: { fr: "Montant financé", en: "Amount financed" }, value: null },
      { label: { fr: "Durée", en: "Term" }, value: null },
    ],
    points: [
      { fr: "L'entreprise développe des centrales solaires dans les chefferies de la province de Lusaka.", en: "The company builds solar plants in the chiefdoms of Lusaka Province." },
      { fr: "Elle a la capacité technique de livrer à grande échelle, mais doit financer à court terme le matériel et la main-d'œuvre.", en: "It has the technical capacity to deliver at scale, but needs short-term financing for equipment and labour." },
      { fr: "Ses revenus sont garantis par un marché public signé : l'État zambien s'est engagé à acheter toute la production.", en: "Its revenue is secured by a signed public contract: the Zambian State has committed to buying all the output." },
    ],
    docs: ["cases"],
  },
];

// --- La sécurité, étage par étage ---------------------------------------------
// Les noms, déclencheurs et protections viennent de la cascade validée
// (risk-levels) ; ce fichier n'y ajoute que la hauteur couverte et les
// documents.

export const PROTECTION_EXTRA: Record<string, { cover: Fact[]; docs: string[] }> = {
  performance: {
    cover: [{ label: { fr: "Montant couvert", en: "Amount covered" }, value: { fr: "c. 300 K€", en: "c. €300K" } }],
    docs: ["bond", "risk-deck"],
  },
  credit: {
    cover: [{ label: { fr: "Couverture", en: "Coverage" }, value: { fr: "c. 300 K€", en: "c. €300K" } }],
    docs: ["insurance", "risk-deck"],
  },
  systemique: {
    cover: [
      { label: { fr: "Garantie Africa Rise", en: "Africa Rise guarantee" }, value: { fr: "Jusqu'à 2 M€", en: "Up to €2M" } },
      { label: { fr: "Currency swap Zanaco", en: "Zanaco currency swap" }, value: null },
    ],
    docs: ["partnership", "swap"],
  },
  residuel: {
    // Pas de montant affiché pour la réserve (Julien, 25/10/2026).
    cover: [],
    docs: ["risk-architecture"],
  },
};
