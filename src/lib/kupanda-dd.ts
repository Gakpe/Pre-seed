// Contenu de la fiche « Due diligence Kupanda » (brouillon du 24/10/2026, mis à
// jour et publié au niveau 2 le 19/11/2026).
//
// Les textes suivent ceux de la dataroom Kupanda du front (minah-front-v0.1,
// src/server/dataroom/kupanda/content.js, commit 7115515), arbitrés un par un
// par Julien : un texte ou un chiffre qui change se change aux deux endroits.
// Un écart avec le front, tranché le 19/11/2026 : Kupanda 2 est à 18 % brut,
// 3,5 % de frais et 14,5 % net (Kupanda 1 : 20 %, 3,5 %, 16,5 %). Le retour aux
// souscripteurs et le panneau de l'État le disent, dans les mots de la salle
// Silver Birch du front.
//
// Les documents (titres, niveaux, liens DocSend) ne sont pas dans le code : le
// dépôt est public. Ils vivent dans app_settings, voir
// src/lib/kupanda-documents.ts ; les panneaux ne citent ici que leurs
// identifiants (`docs`).
//
// Une chaîne `null` dans `value` est un montant à renseigner : la fiche
// l'affiche surligné en jaune, jamais inventé.

export type Bi = { fr: string; en: string };

// --- Le chemin du capital : acteurs et flux -----------------------------------

/** `detail` : une précision sous la valeur (les montants de la garantie, par émission). */
export type Fact = { label: Bi; value: Bi | null; detail?: Bi };

export type DdItem = {
  id: string;
  kind: "actor" | "flow" | "protection" | "usecase";
  title: Bi;
  /** Sous-titre, sous le titre du panneau. */
  tag: Bi;
  facts: Fact[];
  /** Les enjeux, une phrase chacun. */
  points: Bi[];
  /** Identifiants des documents (src/lib/kupanda-documents.ts). */
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
      { label: { fr: "Souscription minimale", en: "Minimum subscription" }, value: { fr: "30 000 €", en: "€30,000" } },
      { label: { fr: "Ticket moyen", en: "Average ticket size" }, value: { fr: "c. 300 K€", en: "c. €300K" } },
      { label: { fr: "Valeur nominale", en: "Face value" }, value: { fr: "10 000 € pour Kupanda 1\n30 000 € pour Kupanda 2", en: "€10,000 for Kupanda 1\n€30,000 for Kupanda 2" } },
      { label: { fr: "Devises acceptées", en: "Accepted currencies" }, value: { fr: "EUR, USD, USDC, USDT, ETH, XLM", en: "EUR, USD, USDC, USDT, ETH, XLM" } },
      { label: { fr: "Seuil d'appel du capital", en: "Capital call threshold" }, value: { fr: "200 000 € pour Kupanda 1\n500 000 € pour Kupanda 2", en: "€200,000 for Kupanda 1\n€500,000 for Kupanda 2" } },
    ],
    points: [
      { fr: "L'offre est réservée aux investisseurs avertis (article L.411-2 du Code monétaire et financier), après un KYC ou un KYB complet.", en: "The offer is reserved for qualified investors (article L.411-2 of the French Monetary and Financial Code), after full KYC or KYB." },
      { fr: "Le capital est engagé à la souscription, mais n'est appelé qu'une fois le seuil atteint et confirmé : 200 000 € pour Kupanda 1, 500 000 € pour Kupanda 2.", en: "Capital is committed at subscription, but only called once the threshold is reached and confirmed: €200,000 for Kupanda 1, €500,000 for Kupanda 2." },
      { fr: "En actifs numériques, la position est un security token sur Stellar, et les coupons arrivent en USDC dans le wallet. Le token ne circule qu'entre investisseurs vérifiés, inscrits sur liste blanche.", en: "In digital assets, the position is a security token on Stellar, and coupons arrive in USDC in the wallet. The token only moves between verified, whitelisted investors." },
      { fr: "L'offre est fermée aux ressortissants américains non accrédités (FATCA, Regulation D).", en: "The offer is closed to non-accredited US persons (FATCA, Regulation D)." },
    ],
    docs: ["notice", "memo"],
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
      { label: { fr: "Kupanda 1, jusqu'au 1er décembre 2026", en: "Kupanda 1, until 1 December 2026" }, value: { fr: "2 000 000 €", en: "€2,000,000" } },
      { label: { fr: "Kupanda 2, engagements ouverts", en: "Kupanda 2, commitments open" }, value: { fr: "10 000 000 €, mêmes termes", en: "€10,000,000, same terms" } },
      { label: { fr: "Immatriculation", en: "Registration" }, value: { fr: "SAS, RCS Paris, SIREN 931 561 708", en: "SAS, Paris trade register, SIREN 931 561 708" } },
      { label: { fr: "Représentant de la masse", en: "Bondholder representative" }, value: { fr: "Julca", en: "Julca" } },
    ],
    points: [
      { fr: "Minah SAS est tenue de payer les intérêts et de rembourser le principal à l'échéance, quelle que soit la performance des financements sous-jacents.", en: "Minah SAS is bound to pay interest and repay principal at maturity, whatever the performance of the underlying financings." },
      { fr: "Les fonds des investisseurs sont juridiquement séparés des actifs opérationnels de Minah.", en: "Investor funds are legally separated from Minah's operating assets." },
      { fr: "Chaque porteur est membre de la masse des obligataires, qui peut agir seule en cas de défaut ou de litige, sans action individuelle et sans l'intervention de Minah.", en: "Each holder is a member of the bondholder body, which can act on its own in a default or dispute, with no individual action and without Minah's involvement." },
      { fr: "Tout le cycle d'investissement est enregistré sur Stellar.", en: "The whole investment cycle is recorded on Stellar." },
    ],
    docs: [],
  },
  {
    id: "africa-rise",
    kind: "actor",
    title: { fr: "Africa Rise", en: "Africa Rise" },
    short: { fr: "Partenaire local, Lusaka", en: "Local partner, Lusaka" },
    figure: { fr: "Sous-jacents tous assurés", en: "All underlyings insured" },
    tag: { fr: "Africa Rise Limited, partenaire stratégique en Zambie", en: "Africa Rise Limited, strategic partner in Zambia" },
    facts: [
      { label: { fr: "Rôle", en: "Role" }, value: { fr: "Suit les financements", en: "Monitors the financings" } },
      { label: { fr: "Garantie de performance minimale", en: "Minimum performance guarantee" }, value: { fr: "Capital et performance", en: "Capital and performance" } },
      { label: { fr: "Devise de déploiement", en: "Deployment currency" }, value: { fr: "USD, swap avec Zanaco Bank", en: "USD, swap with Zanaco Bank" } },
    ],
    points: [
      { fr: "Kupanda est co-construite avec Africa Rise, qui connaît le prêt aux PME zambiennes, les appels d'offres publics et le cadre réglementaire local.", en: "Kupanda is co-built with Africa Rise, which knows lending to Zambian SMEs, public tenders and the local regulatory framework." },
      { fr: "L'accord de partenariat traite trois risques : le crédit (critères d'éligibilité stricts), la performance (décaissements par étapes, reporting) et le change.", en: "The partnership agreement deals with three risks: credit (strict eligibility criteria), performance (staged disbursements, reporting) and currency." },
      { fr: "Africa Rise garantit contractuellement un niveau minimal de performance, capital et performance compris, sur l'ensemble du portefeuille (2 M€ pour Kupanda 1, 10 M€ pour Kupanda 2), adossé à sa propre réserve de liquidité.", en: "Africa Rise contractually guarantees a minimum level of performance, capital and performance included, across the whole portfolio (€2M for Kupanda 1, €10M for Kupanda 2), backed by its own liquidity reserve." },
      { fr: "L'ensemble des sous-jacents est garanti par des assurances : chaque financement est assuré.", en: "Every underlying is covered by insurance: each financing is insured." },
    ],
    docs: ["partnership"],
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
      { fr: "Deux exemples, l'infrastructure et l'énergie, parmi de nombreuses PME financées sur le même modèle : le fonds de roulement de leur contrat public, par cycles de 3 à 5 mois.", en: "Two examples, infrastructure and energy, among many SMEs financed on the same model: the working capital of their public contract, in 3 to 5 month cycles." },
    ],
    docs: ["due-diligence", "bond"],
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
      { fr: "Le coupon de Kupanda, 18 à 20 %, se situe sous le prix local du crédit : les entreprises zambiennes empruntent à 28 % en moyenne, les PME plus cher encore.", en: "Kupanda's coupon, 18% to 20%, sits below the local price of credit: Zambian companies borrow at 28% on average, SMEs at more." },
    ],
    docs: ["framework-request", "framework-letter", "insurance-policy"],
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
      { label: { fr: "Exemple, Kupanda 1", en: "Example, Kupanda 1" }, value: { fr: "30 000 € investis, 31 050 € versés", en: "€30,000 invested, €31,050 paid" } },
      { label: { fr: "Moyens de paiement", en: "Payment methods" }, value: { fr: "Virement ou actifs numériques", en: "Bank transfer or digital assets" } },
    ],
    points: [
      { fr: "La souscription se fait par virement bancaire, ou en actifs numériques après vérification KYC ou KYB.", en: "Subscription is made by bank transfer, or in digital assets after KYC or KYB checks." },
      { fr: "Chaque souscription a son pendant on-chain : la position est émise sous forme d'actif numérique, un security token sur Stellar, quel que soit le moyen de paiement.", en: "Every subscription has an on-chain counterpart: the position is issued as a digital asset, a security token on Stellar, whatever the payment method." },
      { fr: "Rien n'est appelé avant le seuil minimal : il garantit un niveau de diversification et l'activation de toutes les protections.", en: "Nothing is called before the minimum threshold: it ensures a level of diversification and that every protection is active." },
    ],
    docs: ["notice"],
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
      { label: { fr: "Transfert", en: "Transfer" }, value: { fr: "On-chain, via un on-ramp", en: "On-chain, through an on-ramp" } },
      { label: { fr: "Change", en: "Currency" }, value: { fr: "Structuration en USD, swap Zanaco Bank", en: "USD structuring, Zanaco Bank swap" } },
    ],
    points: [
      { fr: "Une fois le seuil confirmé, Minah SAS agrège le capital souscrit et le transfère à Africa Rise Limited.", en: "Once the threshold is confirmed, Minah SAS pools the subscribed capital and transfers it to Africa Rise Limited." },
      { fr: "Le transfert passe par un on-ramp : la transaction se règle on-chain, en parallèle de la souscription on-chain, et chaque mouvement reste traçable.", en: "The transfer goes through an on-ramp: the transaction settles on-chain, in parallel with the on-chain subscription, and every movement stays traceable." },
      { fr: "L'accord de financement fixe les calendriers de remboursement, les garanties et les droits de la masse des obligataires en cas de difficulté.", en: "The financing agreement sets repayment schedules, collateral and the rights of the bondholder body in case of difficulty." },
      { fr: "Le capital est structuré en dollars au niveau du partenaire ; un currency swap avec Zanaco Bank sécurise la disponibilité en USD à maturité.", en: "Capital is structured in dollars at partner level; a currency swap with Zanaco Bank secures USD availability at maturity." },
    ],
    docs: ["partnership"],
  },
  {
    id: "financement",
    kind: "flow",
    from: "africa-rise",
    to: "pme",
    label: { fr: "Fonds de roulement, cycles de 3 à 5 mois", en: "Working capital, 3 to 5-month cycles" },
    title: { fr: "Le financement des PME", en: "Financing the SMEs" },
    tag: { fr: "D'Africa Rise vers les PME sous contrat", en: "From Africa Rise to SMEs under contract" },
    facts: [
      { label: { fr: "Objet", en: "Purpose" }, value: { fr: "Besoin en fonds de roulement d'un contrat public", en: "Working capital for a public contract" } },
      { label: { fr: "Durée par cycle", en: "Term per cycle" }, value: { fr: "3 à 5 mois", en: "3 to 5 months" } },
      { label: { fr: "Historique", en: "Track record" }, value: { fr: "10 M€ financés, sans défaut ni retard", en: "€10M financed, no default, no late payment" } },
    ],
    points: [
      { fr: "Chaque euro déployé finance l'exécution d'un contrat public déjà signé : matériel, main-d'œuvre, livraison.", en: "Every euro deployed finances the delivery of an already-signed public contract: equipment, labour, delivery." },
      { fr: "10 M€ ont déjà été financés sur ce modèle, sans défaut ni retard, y compris pendant la période où l'État zambien était en défaut sur sa dette.", en: "€10M has already been financed on this model, with no default and no late payment, including while the Zambian State was in default on its debt." },
      { fr: "Les décaissements se font par étapes, sous suivi de performance et obligations de reporting.", en: "Disbursements are staged, under performance monitoring and reporting obligations." },
    ],
    docs: ["due-diligence"],
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
      { label: { fr: "Contreparties", en: "Counterparties" }, value: { fr: "Entités publiques détenues par l'État, ex. ZESCO", en: "State-owned public entities, e.g. ZESCO" } },
      { label: { fr: "Déclencheur", en: "Trigger" }, value: { fr: "Livraison du contrat public", en: "Delivery of the public contract" } },
      { label: { fr: "Accès au cash", en: "Access to cash" }, value: { fr: "Direct, par compte séquestre", en: "Direct, through an escrow account" } },
      { label: { fr: "En cas de retard", en: "If late" }, value: { fr: "Clauses pénales, recouvrement par Africa Rise", en: "Penalty clauses, recovery by Africa Rise" } },
    ],
    points: [
      { fr: "Le risque porté est une dette gouvernementale : les contreparties sont des entités publiques détenues par l'État, comme ZESCO, le fournisseur national d'électricité.", en: "The risk carried is government debt: the counterparties are State-owned public entities, such as ZESCO, the national electricity provider." },
      { fr: "Les contrats prévoient un compte séquestre entre le paiement public et l'opérateur : en cas de problème, on accède directement au cash.", en: "The contracts provide an escrow account between the public payment and the operator: if anything goes wrong, we have direct access to the cash." },
      { fr: "En cas de retard, des clauses pénales s'appliquent aussitôt, et Africa Rise intervient sur place pour faire respecter les délais et escalader le recouvrement.", en: "If payment is late, penalty clauses apply immediately, and Africa Rise steps in locally to enforce deadlines and escalate recovery." },
    ],
    docs: ["framework-request", "framework-letter", "insurance-policy"],
  },
  {
    id: "retour",
    kind: "flow",
    from: "pme",
    to: "souscripteurs",
    label: { fr: "18 à 20 % par an", en: "18% to 20% a year" },
    title: { fr: "Le retour aux souscripteurs", en: "Return to subscribers" },
    tag: { fr: "Coupons et principal, des PME jusqu'aux obligataires", en: "Coupons and principal, from the SMEs back to bondholders" },
    facts: [
      { label: { fr: "Coupon", en: "Coupon" }, value: { fr: "20 % par an pour Kupanda 1, 18 % pour Kupanda 2", en: "20% a year for Kupanda 1, 18% for Kupanda 2" } },
      { label: { fr: "Versements", en: "Payments" }, value: { fr: "À 6 mois, puis à l'échéance avec le principal", en: "At 6 months, then at maturity with principal" } },
      { label: { fr: "Exemple, Kupanda 1, 50 000 €", en: "Example, Kupanda 1, €50,000" }, value: { fr: "5 000 € à 6 mois, 55 000 € à 12 mois", en: "€5,000 at 6 months, €55,000 at 12 months" } },
    ],
    points: [
      { fr: "Les remboursements remontent des PME à Africa Rise, puis à Minah SAS, qui les distribue aux obligataires.", en: "Repayments flow from the SMEs to Africa Rise, then to Minah SAS, which distributes them to bondholders." },
      { fr: "Les paiements se font dans le mode de la souscription : virement, ou USDC dans le wallet pour les souscripteurs en actifs numériques.", en: "Payments use the subscription method: bank transfer, or USDC in the wallet for digital-asset subscribers." },
      { fr: "Aucun remboursement anticipé : l'obligation court 12 mois.", en: "No early redemption: the bond runs for 12 months." },
    ],
    docs: ["notice"],
  },
];

// --- Deux exemples de PME financées, parmi d'autres ---------------------------

export const USE_CASES: DdItem[] = [
  {
    id: "uc-infrastructure",
    kind: "usecase",
    title: { fr: "Infrastructure", en: "Infrastructure" },
    tag: { fr: "Les cantines de toutes les écoles du pays", en: "Canteens for every school in the country" },
    facts: [
      { label: { fr: "Acheteur public", en: "Public buyer" }, value: { fr: "Ministère de l'Éducation", en: "Ministry of Education" } },
      { label: { fr: "Montant financé", en: "Amount financed" }, value: { fr: "c. 300 K€", en: "c. €300K" } },
      { label: { fr: "Statut", en: "Status" }, value: { fr: "Remboursé", en: "Repaid" } },
    ],
    points: [
      { fr: "L'entreprise équipe et approvisionne les cantines de toutes les écoles du pays, pour le compte du ministère de l'Éducation.", en: "The company equips and supplies the canteens of every school in the country, on behalf of the Ministry of Education." },
      { fr: "Un financement d'environ 300 K€, intégralement remboursé.", en: "A financing of about €300K, repaid in full." },
    ],
    docs: [],
  },
  {
    id: "uc-energie",
    kind: "usecase",
    title: { fr: "Énergie", en: "Energy" },
    tag: { fr: "Un contrat avec ZESCO, le fournisseur national d'électricité", en: "A contract with ZESCO, the national electricity provider" },
    facts: [
      { label: { fr: "Acheteur public", en: "Public buyer" }, value: { fr: "ZESCO, détenue par l'État", en: "ZESCO, State-owned" } },
      { label: { fr: "Montant financé", en: "Amount financed" }, value: { fr: "c. 300 K€", en: "c. €300K" } },
      { label: { fr: "Statut", en: "Status" }, value: { fr: "En cours de remboursement", en: "Being repaid" } },
      { label: { fr: "Sécurité", en: "Security" }, value: { fr: "Compte séquestre", en: "Escrow account" } },
    ],
    points: [
      { fr: "L'opérateur exécute un contrat avec ZESCO, le fournisseur d'électricité du pays, détenu par l'État.", en: "The operator delivers a contract with ZESCO, the country's State-owned electricity provider." },
      { fr: "Il emprunte auprès d'Africa Rise pour exécuter le contrat ; un compte séquestre est placé entre le paiement de ZESCO et l'opérateur. En cas de problème, on accède directement au cash.", en: "It borrows from Africa Rise to deliver the contract; an escrow account sits between ZESCO's payment and the operator. If anything goes wrong, we have direct access to the cash." },
      { fr: "Un financement d'environ 300 K€, en cours de remboursement.", en: "A financing of about €300K, currently being repaid." },
    ],
    docs: ["framework-request", "framework-letter"],
  },
];

// --- La sécurité, étage par étage ---------------------------------------------
// Les noms, déclencheurs et protections viennent de la cascade validée
// (risk-levels) ; ce fichier y ajoute la hauteur couverte et les documents.
// Le niveau 3 a ici son propre texte (`body`) : la garantie d'Africa Rise porte
// sur l'ensemble du portefeuille, émission par émission, alors que la fiche
// « Gestion du risque », qui partage risk-levels, parle encore de 2 M€.

export const PORTFOLIO_COVER_NOTE: Bi = {
  fr: "À l'étude : un performance bond et une assurance défaut de crédit au niveau du portefeuille. Peut-être dès Kupanda 2, en 2027 au plus tard. C'est plus coûteux, mais cela accélérera notre distribution institutionnelle.",
  en: "Under review: a performance bond and credit default insurance at portfolio level. Possibly from Kupanda 2, in 2027 at the latest. It costs more, but it will speed up our institutional distribution.",
};

const ASSET: Bi = { fr: "Par actif sous-jacent", en: "Per underlying asset" };
const PORTFOLIO: Bi = { fr: "Au niveau du portefeuille", en: "At portfolio level" };

// Niveaux 1 et 2 : par actif sous-jacent ; niveaux 3 et 4 : sur le
// portefeuille (Julien, 26/10/2026).
export const PROTECTION_EXTRA: Record<
  string,
  { scope: Bi; cover: Fact[]; notes?: Bi[]; docs: string[]; /** Remplace le texte de la protection de risk-levels. */ body?: Bi }
> = {
  performance: {
    scope: ASSET,
    cover: [{ label: { fr: "Montant couvert", en: "Amount covered" }, value: { fr: "c. 300 K€", en: "c. €300K" } }],
    notes: [PORTFOLIO_COVER_NOTE],
    docs: ["bond", "risk-deck"],
  },
  credit: {
    scope: ASSET,
    cover: [{ label: { fr: "Couverture", en: "Coverage" }, value: { fr: "c. 300 K€", en: "c. €300K" } }],
    notes: [PORTFOLIO_COVER_NOTE],
    docs: ["insurance-policy", "insurance-veritas", "insurance-clarkson", "risk-deck"],
  },
  systemique: {
    scope: PORTFOLIO,
    cover: [
      {
        label: { fr: "Garantie Africa Rise", en: "Africa Rise guarantee" },
        value: { fr: "L'ensemble du portefeuille", en: "The whole portfolio" },
        detail: { fr: "2 M€ pour Kupanda 1, 10 M€ pour Kupanda 2", en: "€2M for Kupanda 1, €10M for Kupanda 2" },
      },
      { label: { fr: "Currency swap Zanaco", en: "Zanaco currency swap" }, value: { fr: "Tous les montants déployés, exposés en USD", en: "All deployed amounts, exposed in USD" } },
    ],
    body: {
      fr: "Un accord contractuel avec Africa Rise garantit un niveau minimal de performance : il couvre les coûts opérationnels et le remboursement des investisseurs sur l'ensemble du portefeuille (2 M€ pour Kupanda 1, 10 M€ pour Kupanda 2), adossé à leur propre réserve de liquidité. Un currency swap avec Zanaco Bank sécurise la disponibilité en USD à maturité.",
      en: "A contractual agreement with Africa Rise guarantees a minimum level of performance: it covers operating costs and investor repayment across the whole portfolio (€2M for Kupanda 1, €10M for Kupanda 2), backed by their own liquidity reserve. A currency swap with Zanaco Bank secures USD availability at maturity.",
    },
    docs: ["partnership"],
  },
  residuel: {
    // Pas de montant affiché pour la réserve (Julien, 25/10/2026).
    scope: PORTFOLIO,
    cover: [],
    docs: ["risk-deck"],
  },
};
