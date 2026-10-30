// Questions et réponses de la page souscripteurs « Due diligence Kupanda »
// (/kupanda), onglet « Q&A ». Reprises du Q&A « Risque de crédit et risque
// souverain » préparé pour un family office le 15 octobre 2026
// (Dropbox, Seed Round/Team_Gautier, Q A_TeamG_x_Minah_vf.xlsx), sans le nom
// du destinataire. Les renvois aux numéros de pièces du dossier deviennent
// « sur demande » ; le fond des réponses n'est pas modifié.

import type { Bi } from "@/lib/kupanda-dd";

/** Un bloc de réponse : un paragraphe, ou une liste de puces. */
export type QaBlock = Bi | Bi[];

export type QaItem = { q: Bi; a: QaBlock[] };

export const QA_META = {
  date: { fr: "Réponses à jour au 15 octobre 2026", en: "Answers current as of 15 October 2026" },
  source: {
    fr: "Dix questions posées par un family office pendant sa due diligence, sur le risque de crédit et le risque souverain, et nos réponses.",
    en: "Ten questions asked by a family office during its due diligence, on credit and sovereign risk, and our answers.",
  },
  docs: {
    fr: "Les pièces citées (modalités des obligations, extraits du contrat cadre, polices et cotations d'assurance, pièces du dossier ZESCO, brief de courtage) sont disponibles sur demande.",
    en: "The documents cited (bond terms, framework agreement extracts, insurance policies and quotes, ZESCO file, brokerage brief) are available on request.",
  },
  docsCta: { fr: "Demander les pièces", en: "Request the documents" },
  docsSubject: { fr: "Demande des pièces citées dans le Q&A Kupanda", en: "Request for the documents cited in the Kupanda Q&A" },
};

export const QA: QaItem[] = [
  {
    q: {
      fr: "Garantie Africa Rise (jusqu'à 2\u00a0M€) : pouvez-vous partager le contrat, la taille actuelle de la réserve, où elle est logée et qui la contrôle ? Comment est-elle dimensionnée si Kupanda\u00a0II monte à 15\u00a0M€ ?",
      en: "Africa Rise guarantee (up to €2M): can you share the contract, the current size of the reserve, where it sits and who controls it? How is it sized if Kupanda II grows to €15M?",
    },
    a: [
      {
        fr: "Le contrat cadre conclu entre Minah et Africa Rise régit l'ensemble des investissements de Minah dans ce cadre, actuels et futurs. Il n'est pas communicable dans son intégralité, mais ses extraits utiles sont disponibles sur demande. Il couvre l'intégralité des fonds déployés, soit jusqu'à 2\u00a0M€ sur Kupanda\u00a0I, et prévoit :",
        en: "The framework agreement between Minah and Africa Rise governs all of Minah's investments under it, current and future. It cannot be shared in full, but its relevant extracts are available on request. It covers all deployed funds, i.e. up to €2M on Kupanda I, and provides for:",
      },
      [
        { fr: "un plancher de performance de 25\u00a0% sur chaque opération arrivée à terme dans le respect du mandat, au-dessus du coupon de 20\u00a0% servi aux obligataires (section 6.3) ;", en: "a 25% performance floor on every operation completed within the mandate, above the 20% coupon paid to bondholders (section 6.3);" },
        { fr: "un cas central de performance de 50\u00a0% sur chaque opération dès lors que l'engagement de Minah dépasse 500\u00a0k€ : Kupanda\u00a0I remplissant cette condition, son rendement cible ressort à 50\u00a0% ;", en: "a central performance case of 50% on every operation once Minah's commitment exceeds €500k: Kupanda I meets this condition, so its target return is 50%;" },
        { fr: "la restitution du principal et du rendement cible si Africa Rise manque à notre standard de diligence, la charge de la preuve pesant sur Africa Rise (section 2.4) ;", en: "the return of principal and target return if Africa Rise falls short of our standard of care, with the burden of proof on Africa Rise (section 2.4);" },
        { fr: "un co-investissement d'Africa Rise et de son fonds affilié AEG, aux mêmes conditions que Minah (section 7.4).", en: "a co-investment by Africa Rise and its affiliated fund AEG, on the same terms as Minah (section 7.4)." },
      ],
      {
        fr: "Réserve : la liquidité repose aujourd'hui sur l'engagement d'AEG, fonds evergreen affilié à Africa Rise, de répondre à tout moment aux appels de fonds. Il ne s'agit pas d'un montant figé mais d'un engagement de liquidité permanent (voir la question 9). La sécurité du cash tient surtout au compte séquestre : c'est par ce compte, contrôlé par notre partenaire, que transitent tous les flux de remboursement (voir la question 4).",
        en: "Reserve: liquidity currently rests on the commitment of AEG, an evergreen fund affiliated with Africa Rise, to meet capital calls at any time. It is not a fixed amount but a permanent liquidity commitment (see question 9). Cash security relies above all on the escrow account: every repayment flow passes through this account, controlled by our partner (see question 4).",
      },
      {
        fr: "Kupanda\u00a0II visera 10\u00a0M€. Les conditions de couverture seront renégociées pour ce montant : ce sont précisément les discussions que nous menons actuellement avec Africa Rise.",
        en: "Kupanda II will target €10M. The coverage terms will be renegotiated for that amount: these are precisely the discussions we are currently holding with Africa Rise.",
      },
    ],
  },
  {
    q: {
      fr: "Performance bond, assurance crédit et assurance risque systémique : qui sont les émetteurs et assureurs, quels montants couverts, quelles exclusions et quels délais d'indemnisation ? Pouvez-vous envoyer les termes ?",
      en: "Performance bond, credit insurance and systemic-risk insurance: who are the issuers and insurers, what amounts are covered, what exclusions and what claim timelines? Can you send the terms?",
    },
    a: [
      {
        fr: "Pour chaque opération, un nouveau dossier de due diligence est constitué, incluant le performance bond et la garantie de crédit souscrits auprès d'assureurs zambiens agréés au bénéfice du prêteur local. Les assureurs peuvent varier selon le sous-jacent financé : c'est ce qui permet de réaliser plusieurs rotations du capital sur 12 mois. Le contrat cadre fixe le cadre commun à toutes ces polices.",
        en: "For every operation, a new due diligence file is built, including the performance bond and the credit guarantee taken out with licensed Zambian insurers for the benefit of the local lender. Insurers may vary with the financed underlying: this is what allows several rotations of the capital over 12 months. The framework agreement sets the common framework for all these policies.",
      },
      {
        fr: "Exemple de police émise : la garantie de crédit de Veritas General Insurance (janvier 2025), couvrant 7,6\u00a0M de kwachas (environ 361\u00a0k€) de principal sur 120 jours. Les termes complets sont disponibles sur demande.",
        en: "Example of an issued policy: the credit guarantee from Veritas General Insurance (January 2025), covering ZMW 7.6M (about €361k) of principal over 120 days. The full terms are available on request.",
      },
      {
        fr: "Nous relevons progressivement le standard du marché. Les polices zambiennes classiques prévoient une carence de 90 jours, l'épuisement préalable des recours et une couverture du principal seul. Dans notre cahier des charges adressé aux assureurs, nous demandons une indemnisation sans épuisement des recours ni jugement, couvrant principal, intérêts et frais, avec décision sous 30 jours et paiement sous 15 jours ouvrés. Sur le dossier Chisi Empire / ZESCO, Innovate General Insurance a coté un performance bond et un credit guarantee bond de 1,5\u00a0M de kwachas chacun (environ 71\u00a0k€) à 1,5\u00a0% de prime.",
        en: "We are gradually raising the market standard. Standard Zambian policies provide a 90-day waiting period, prior exhaustion of remedies and cover of principal only. In our specification to insurers, we ask for indemnification without exhaustion of remedies or judgment, covering principal, interest and costs, with a decision within 30 days and payment within 15 business days. On the Chisi Empire / ZESCO file, Innovate General Insurance quoted a performance bond and a credit guarantee bond of ZMW 1.5M each (about €71k) at a 1.5% premium.",
      },
    ],
  },
  {
    q: {
      fr: "Minah SAS garantit le coupon de 20\u00a0% et le capital : avec quels fonds propres concrètement, et quelle est la taille de la tranche first-loss de Minah ?",
      en: "Minah SAS guarantees the 20% coupon and the capital: with what equity concretely, and what is the size of Minah's first-loss tranche?",
    },
    a: [
      {
        fr: "Les fonds propres de Minah SAS ne permettraient pas, à eux seuls, d'absorber un défaut sur 2\u00a0M€. Minah est l'émetteur et le structureur ; la protection des obligataires vient aujourd'hui de la structure, et non du bilan de Minah. La fonction first-loss est portée à trois niveaux, dans cet ordre :",
        en: "Minah SAS's equity alone would not absorb a default on €2M. Minah is the issuer and the structurer; bondholder protection today comes from the structure, not from Minah's balance sheet. The first-loss function sits at three levels, in this order:",
      },
      [
        { fr: "sur chaque opération, le performance bond et la garantie de crédit absorbent les premiers incidents (voir la question 2) ;", en: "on each operation, the performance bond and the credit guarantee absorb the first incidents (see question 2);" },
        { fr: "au niveau d'Africa Rise, le plancher de 25\u00a0% dû à Minah est supérieur au coupon de 20\u00a0% : cet écart est le coussin de la structure (voir la question 1). Sur les derniers investissements de Kupanda, la performance cible est de 50\u00a0% des montants investis. Nos scénarios de stress montrent qu'il faudrait une perte cumulée supérieure à 30\u00a0% de l'encours pour toucher la performance théorique des obligataires ;", en: "at Africa Rise level, the 25% floor owed to Minah is above the 20% coupon: that gap is the structure's cushion (see question 1). On Kupanda's latest investments, the target performance is 50% of the amounts invested. Our stress scenarios show that a cumulative loss above 30% of outstandings would be needed to touch the bondholders' theoretical performance;" },
        { fr: "au niveau de Minah, notre rémunération est perçue après paiement intégral des coupons et du nominal : nous sommes payés en dernier.", en: "at Minah level, our remuneration is received after full payment of coupons and principal: we are paid last." },
      ],
      {
        fr: "Les modalités des obligations décrivent ce droit de créance à taux fixe, indépendant de la performance des actifs financés. Dès la prochaine itération de Kupanda, nous souscrirons une assurance de portefeuille afin que la couverture porte également sur le bilan de Minah. L'objectif est un alignement d'intérêts total entre les souscripteurs et la société.",
        en: "The bond terms describe this fixed-rate claim, independent of the performance of the financed assets. From the next iteration of Kupanda, we will take out portfolio insurance so that coverage also extends to Minah's balance sheet. The aim is full alignment of interests between subscribers and the company.",
      },
    ],
  },
  {
    q: {
      fr: "Cession de créance : est-elle notifiée au ministère ? Qui contrôle le compte séquestre (banque, agent) ? Pouvez-vous partager la lettre d'engagement ministérielle ?",
      en: "Assignment of receivables: is it notified to the ministry? Who controls the escrow account (bank, agent)? Can you share the ministerial commitment letter?",
    },
    a: [
      {
        fr: "Oui, le mécanisme est en place. Sur le dossier en cours, l'entité publique payeuse est ZESCO, l'électricien national zambien (l'équivalent d'EDF), qui contracte directement avec son fournisseur.",
        en: "Yes, the mechanism is in place. On the current file, the paying public entity is ZESCO, Zambia's national electricity company (the equivalent of EDF), which contracts directly with its supplier.",
      },
      [
        { fr: "ZESCO a reçu une instruction de paiement irrévocable : tous les paiements du contrat sont versés sur un compte dédié, qui ne peut être modifié sans l'accord écrit de notre partenaire.", en: "ZESCO has received an irrevocable payment instruction: all contract payments go to a dedicated account, which cannot be changed without our partner's written consent." },
        { fr: "ZESCO a confirmé par écrit la validité et la valeur des contrats financés ; cette lettre joue le rôle de lettre d'engagement.", en: "ZESCO has confirmed in writing the validity and value of the financed contracts; this letter serves as the commitment letter." },
        { fr: "Le compte est à double signature avec notre partenaire, qui se rembourse en priorité avant toute distribution à l'emprunteur.", en: "The account is dual-signature with our partner, who is repaid first before any distribution to the borrower." },
      ],
    ],
  },
  {
    q: {
      fr: "Kupanda\u00a0I : un coupon a-t-il déjà été payé ? À quelle date et pour quel montant ?",
      en: "Kupanda I: has a coupon already been paid? On what date and for what amount?",
    },
    a: [
      {
        fr: "Le premier coupon de Kupanda\u00a0I est prévu fin mars 2027, six mois après le closing, conformément aux modalités (article 1.7). D'ici là, la stratégie s'appuie sur l'historique d'Africa Rise sur le même type de contrats : plus de 10\u00a0M€ déployés et remboursés, sans incident (voir la question 6). Plus largement, le fonds partenaire a déployé environ 50\u00a0M€.",
        en: "The first Kupanda I coupon is due at the end of March 2027, six months after closing, in line with the terms (article 1.7). Until then, the strategy relies on Africa Rise's track record on the same type of contracts: more than €10M deployed and repaid, without incident (see question 6). More broadly, the partner fund has deployed about €50M.",
      },
    ],
  },
  {
    q: {
      fr: "Historique Africa Rise : peut-on avoir le détail des 30 prêts (montants, durées, délais de paiement de l'État) et une référence auditée ?",
      en: "Africa Rise track record: can we have the detail of the 30 loans (amounts, terms, State payment delays) and an audited reference?",
    },
    a: [
      { fr: "Nous proposons trois niveaux d'accès :", en: "We offer three levels of access:" },
      [
        { fr: "dès maintenant, les agrégats du loan book d'Africa Rise (mars 2025) : 30 prêts sur contrats publics, 29 arrivés à maturité, 100\u00a0% remboursés, zéro arriéré, ticket moyen inférieur à 200\u00a0k€. Exemples de prêts sur contrat public : Kabvinira Enterprise, fourniture d'équipements et de réactifs de laboratoire au ministère de l'Éducation, 1,15\u00a0M de kwachas (environ 55\u00a0k€), remboursé sans retard ; un fournisseur d'engrais pour le Bureau du Vice-Président (DMMU), 7,14\u00a0M de kwachas (environ 340\u00a0k€), remboursé sans retard ; W&H Solar Ventures, construction de centrales solaires dans les chefferies, 9,06\u00a0M de kwachas (environ 432\u00a0k€), remboursé sans retard ;", en: "right away, the aggregates of Africa Rise's loan book (March 2025): 30 loans on public contracts, 29 matured, 100% repaid, zero arrears, average ticket below €200k. Examples of public-contract loans: Kabvinira Enterprise, supply of laboratory equipment and reagents to the Ministry of Education, ZMW 1.15M (about €55k), repaid without delay; a fertiliser supplier to the Office of the Vice-President (DMMU), ZMW 7.14M (about €340k), repaid without delay; W&H Solar Ventures, construction of solar plants in the chiefdoms, ZMW 9.06M (about €432k), repaid without delay;" },
        { fr: "sous NDA, un extrait anonymisé prêt par prêt, avec montant, durée et délai de paiement constaté de l'entité publique ;", en: "under NDA, an anonymised loan-by-loan extract, with amount, term and observed payment delay of the public entity;" },
        { fr: "un call avec l'équipe d'Africa Rise et un accès à leur auditeur, que nous organisons à votre convenance.", en: "a call with the Africa Rise team and access to their auditor, which we arrange at your convenience." },
      ],
      {
        fr: "Avec un ticket moyen d'environ 200\u00a0k€, nous pouvons réaliser plusieurs rotations du capital sur une année. Pour Kupanda\u00a0II, s'y ajouteront des projets en partenariat public-privé actuellement en préparation.",
        en: "With an average ticket of about €200k, we can run several rotations of the capital within a year. For Kupanda II, public-private partnership projects currently in preparation will be added.",
      },
    ],
  },
  {
    q: {
      fr: "Kupanda dépend du paiement de l'État zambien, qui a fait défaut en 2020. Comment le portefeuille se comporte-t-il en cas de nouveau défaut ou de gel des paiements (arriérés sur les contrats publics) ?",
      en: "Kupanda depends on payment by the Zambian State, which defaulted in 2020. How does the portfolio behave in a new default or a payment freeze (arrears on public contracts)?",
    },
    a: [
      {
        fr: "Nous ne finançons pas l'État mais des PME fournisseurs d'entités publiques comme ZESCO, l'électricien national, qui paie ses fournisseurs sur ses propres encaissements.",
        en: "We do not finance the State but SMEs supplying public entities such as ZESCO, the national electricity company, which pays its suppliers from its own receipts.",
      },
      {
        fr: "Oui, la Zambie a connu une période de défaut systémique, mais le financement a continué : de 2020 à 2025, Panda Africa a accordé 1\u00a0688 prêts aux PME (4,8\u00a0M$), 5\u00a0545 prêts adossés aux salaires (629\u00a0k$) et 100 prêts pour motos (45\u00a0k$). N'étant pas encore partenaires à cette époque, nous ne disposons pas de données sur d'éventuels retards ; en revanche, tous les contrats relevant de notre cadre, conclus avec des entités publiques, ont été honorés sans aucun défaut (voir la question 10).",
        en: "Yes, Zambia went through a period of systemic default, but financing continued: from 2020 to 2025, Panda Africa granted 1,688 SME loans ($4.8M), 5,545 salary-backed loans ($629k) and 100 motorbike loans ($45k). Not yet being partners at the time, we have no data on possible delays; on the other hand, every contract within our framework, concluded with public entities, was honoured without any default (see question 10).",
      },
      { fr: "Face à un gel ou un retard des paiements publics, la structure réagit à trois niveaux :", en: "Faced with a freeze or delay in public payments, the structure responds at three levels:" },
      [
        { fr: "des cycles courts de 3 à 6 mois, renouvelés plusieurs fois par émission : l'exposition à un payeur n'est jamais figée sur 12 mois ;", en: "short cycles of 3 to 6 months, renewed several times per issuance: exposure to one payer is never locked for 12 months;" },
        { fr: "des contrats de dépenses essentielles, à prix fixes, payés sur certificats d'avancement, comme l'accord cadre ZESCO sur trois ans ;", en: "essential-spending contracts, at fixed prices, paid on progress certificates, such as the three-year ZESCO framework agreement;" },
        { fr: "les garanties par opération et le plancher d'Africa Rise, qui transforment un retard en décalage de remboursement plutôt qu'en perte.", en: "per-operation guarantees and the Africa Rise floor, which turn a delay into a deferred repayment rather than a loss." },
      ],
    ],
  },
  {
    q: {
      fr: "L'assurance crédit couvre-t-elle explicitement le défaut souverain et le risque de transfert ou de convertibilité ? Qui est l'assureur (ATI, MIGA, assureur privé) et avec quel plafond ?",
      en: "Does the credit insurance explicitly cover sovereign default and transfer or convertibility risk? Who is the insurer (ATI, MIGA, private insurer) and with what cap?",
    },
    a: [
      {
        fr: "Les assurances actuelles couvrent le défaut de l'emprunteur et la non-exécution, dossier par dossier, auprès d'assureurs privés zambiens. Le risque souverain et le risque de transfert sont traités par trois moyens :",
        en: "Current insurance covers borrower default and non-performance, file by file, with private Zambian insurers. Sovereign risk and transfer risk are addressed in three ways:",
      },
      [
        { fr: "un droit de rapatriement : l'investissement est enregistré auprès de la Bank of Zambia, et tout blocage de transfert constitue un cas de défaut d'Africa Rise ouvrant l'accélération ;", en: "a repatriation right: the investment is registered with the Bank of Zambia, and any transfer block is an event of default by Africa Rise triggering acceleration;" },
        { fr: "un swap de change via Zanaco, qui sécurise la disponibilité des USD à maturité (contrat cadre, section 4.4) ;", en: "a currency swap through Zanaco, which secures USD availability at maturity (framework agreement, section 4.4);" },
        { fr: "une couverture assurantielle en cours de placement : l'extension risque politique et transfert est demandée sur le dossier Chisi, et le courtier Clarkson (Lusaka) est mandaté depuis juillet 2026 pour une couverture au niveau du portefeuille, avec une indemnité cible de 80 à 90\u00a0%, visée pour début 2027.", en: "insurance cover being placed: the political and transfer risk extension is requested on the Chisi file, and the broker Clarkson (Lusaka) has been mandated since July 2026 for portfolio-level cover, with a target indemnity of 80 to 90%, aimed for early 2027." },
      ],
      {
        fr: "Pour les programmes plus importants, nous ajouterons une couverture internationale (type ATI) et la réassurance ; le montant de 2\u00a0M€ sur Kupanda\u00a0I ne justifiait pas encore ce niveau de protection.",
        en: "For larger programmes, we will add international cover (ATI-type) and reinsurance; the €2M of Kupanda I did not yet justify that level of protection.",
      },
    ],
  },
  {
    q: {
      fr: "La réserve d'Africa Rise est-elle logée hors de Zambie, et en quelle devise ? Est-elle disponible si l'État zambien ne paie plus ?",
      en: "Is Africa Rise's reserve held outside Zambia, and in what currency? Is it available if the Zambian State stops paying?",
    },
    a: [
      {
        fr: "Oui. Une réserve existe hors de Zambie, notamment au niveau de la holding d'Africa Rise, AEG (African Equity Group), fonds evergreen basé aux États-Unis. Par construction, AEG doit conserver en permanence de la liquidité pour faire face aux retraits de ses clients à tout moment.",
        en: "Yes. A reserve exists outside Zambia, in particular at the level of Africa Rise's holding company, AEG (African Equity Group), an evergreen fund based in the United States. By construction, AEG must keep liquidity at all times to meet client withdrawals.",
      },
      {
        fr: "Nous n'avons pas négocié de montant fixe à conserver au titre de Kupanda\u00a0I : il s'agit de notre premier accord avec Africa Rise, et il n'était pas encore pertinent d'imposer des exigences trop fortes. Cette liquidité hors Zambie permet néanmoins d'être protégé même si l'État zambien cessait de payer. Elle s'ajoute à deux mécanismes indépendants de la capacité de paiement de l'État :",
        en: "We did not negotiate a fixed amount to be held for Kupanda I: it is our first agreement with Africa Rise, and it was not yet relevant to impose heavy requirements. This liquidity outside Zambia nevertheless provides protection even if the Zambian State stopped paying. It comes on top of two mechanisms independent of the State's ability to pay:",
      },
      [
        { fr: "l'enregistrement auprès de la Bank of Zambia, qui ouvre le droit légal de transfert ; tout blocage est un cas de défaut contractuel ;", en: "registration with the Bank of Zambia, which opens the legal right of transfer; any block is a contractual event of default;" },
        { fr: "le swap de change via Zanaco, qui fige le taux au déploiement et sécurise les USD à maturité.", en: "the currency swap through Zanaco, which fixes the rate at deployment and secures USD at maturity." },
      ],
      {
        fr: "Pour Kupanda\u00a0II, le montant, la devise et la domiciliation de la réserve feront partie de la renégociation en cours (voir la question 1).",
        en: "For Kupanda II, the amount, currency and location of the reserve will be part of the ongoing renegotiation (see question 1).",
      },
    ],
  },
  {
    q: {
      fr: "Comment les contrats d'Africa Rise ont-ils été payés pendant le défaut de 2020-2023 ?",
      en: "How were Africa Rise's contracts paid during the 2020-2023 default?",
    },
    a: [
      {
        fr: "Les millésimes d'Africa Rise couvrent cette période. Sur les 29 prêts arrivés à maturité, aucun défaut n'a été enregistré, y compris sur 2020-2023, et aucun retard n'a été notifié. Nous proposons un call avec Africa Rise (voir la question 6) pour détailler cette période.",
        en: "Africa Rise's vintages cover this period. Of the 29 matured loans, no default was recorded, including over 2020-2023, and no delay was notified. We offer a call with Africa Rise (see question 6) to go into this period in detail.",
      },
    ],
  },
];
