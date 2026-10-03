// Porté le 02/10/2026 depuis minah_interface, voir types.ts. Les textes sont en
// français seulement : la version anglaise de la fiche affiche les libellés traduits
// autour de contenus français.
// src/lib/roadmap/seed.ts
// Données d'amorçage (phase A), structure v2. Sources : brief « Roadmap technique Minah »
// (1er oct.), brief d'update v2 (1er oct.) et feuille de route de la proposition de
// collaboration (sept. 2026), section 4.
//
// Conventions du premier jet :
//   - `livreEn` = phase de livraison ; les statuts par cran en découlent (règle du brief),
//     `statutsForces` conserve les quelques crans « à confirmer » du brief v1 ;
//   - les dates sont PROVISOIRES sauf mention : dérivées des fenêtres de phase et des
//     jalons du PDF (Sereel mi-oct., API v1 déc. 26, infra de test jan-fév 27, MCP v1 et
//     pentest mars-avr 27) ;
//   - les dépendances suivent l'ordre des missions (API v1 → protocoles / admin → API v2 →
//     produits et agents → liquidité) ;
//   - les tâches sont FICTIVES ; les crochets [ ] signalent ce qu'il reste à compléter ;
//   - règle dataroom : aucun partenaire en cours de négociation dans un brief investisseur
//     (Spiko et Zeno restent dans la note interne).

import { PHASES, PHASE_WINDOWS, statusesFor, type Health, type Objective, type Phase, type RoadmapMeta, type Task, type TeamBrief } from "./types";

const MAJ = "2026-10-01T00:00:00.000Z";
const BY = "Julien";

export const ROADMAP_META: RoadmapMeta = {
  vision: "Des rails agent-native pour la dette privée africaine.",
  misAJourLe: MAJ,
  // Côté investisseurs, la preuve est écrite, pas comptée : on annonce un ordre de
  // grandeur plutôt qu'un chiffre exact. Les chiffres réels restent visibles côté équipe.
  preuveLibreParPhase: {
    fondations: "Premiers souscripteurs · env. 15 K€",
    b2c: "Moins de 40 investisseurs, moins de 100 K€",
    b2b: "Premiers souscripteurs institutionnels",
  },
  apprentissagesParPhase: {
    b2c: "Le parcours complet tient de bout en bout, mais un espace B2C ne fait pas un marché : les tickets sont trop petits et le KYC trop lourd pour des particuliers. D'où le pivot B2B.",
    b2b: "Les investisseurs professionnels veulent un sas d'accès et un interlocuteur avant de souscrire ; la souscription en ligne vient après la confiance, pas avant.",
  },
  // « Pourquoi c'est défendable » suit le curseur : sur le passé ce sont des faits
  // vérifiables, sur le futur ce que la période débloque. Trois arguments par période.
  defendableParPhase: {
    fondations: [
      "Les obligations sont tokenisées et réglées on-chain depuis 2025 : l'infrastructure a déjà servi, ce n'est pas une intention.",
      "La custody est institutionnelle (Fireblocks) et le KYC (Sumsub) fait partie du socle, pas d'une couche ajoutée après coup.",
      "Stellar comme premier rail : des frais et des délais de règlement compatibles avec des tickets africains.",
    ],
    b2c: [
      "Le parcours complet — accès, vérification, souscription, règlement — a tourné de bout en bout avec de vrais investisseurs.",
      "L'équipe a mesuré ce que coûte un particulier (ticket faible, KYC lourd) et a pivoté vite plutôt que d'insister.",
      "La plateforme est opérée par Minah, pas sous-traitée : chaque brique du parcours est modifiable sans dépendre d'un éditeur.",
      "Tout le fonctionnel pour assumer du B2C : connexion, KYC, signature d'un titre financier, souscription, suivi — et un Q&A live tenu sur la plateforme.",
      "La couche on-chain est déjà présente dans le produit, même si elle n'est pas encore branchée de bout en bout pour l'utilisateur final.",
    ],
    b2b: [
      "Des investisseurs professionnels souscrivent en ligne : le même socle technique sert des tickets cent fois plus gros, sans réécriture.",
      "Le sas d'accès et le questionnaire rendent la conformité opérable à l'échelle, sans traitement manuel au cas par cas.",
      "La première intégration partenaire prouve que les stratégies Minah peuvent être distribuées par un tiers.",
      "La custody Fireblocks passe à l'échelle : la sécurité suit la taille des tickets, elle ne la subit pas.",
    ],
    api_v1: [
      "Une API unique devant plusieurs rails — Stellar aujourd'hui, Canton Network et Fireblocks — : un partenaire se branche une fois et accède à toutes les stratégies.",
      "La distribution ne dépend plus de l'équipe : chaque protocole branché élargit le réseau sans développement spécifique.",
      "L'admin et le Web3 sont unifiés : ce que voit l'équipe et ce qui est sur la chaîne sont la même chose.",
    ],
    api_v2: [
      "Les flux ne dorment plus : la trésorerie en attente se place en T-bills et le vault déploie vers les fintechs, automatiquement.",
      "Construit pour les agents : API entièrement documentée et serveur MCP, pour que les prochains utilisateurs de Minah soient aussi des machines.",
      "Trois moteurs de volume — dette privée, dette souveraine, liquidité crypto — sur la même infrastructure : croître ne multiplie pas les systèmes.",
    ],
    // Quatre états finaux, un par couche — ce que Minah est devenue quand la vision est atteinte.
    vision: [
      "Rails — l'ensemble du flux de sortie est on-chain : on voit en temps réel où est l'argent et comment il remonte.",
      "Produit — l'investissement cesse d'être froid. Une vraie expérience sociale, qui reproduit l'usage de la monnaie : une plateforme d'investissement next gen.",
      "API — 100 % seamless sur la partie on-chain.",
      "Admin — un espace qui s'adapte aux institutionnels : produire et gérer leurs souscriptions en se branchant directement sur leurs systèmes.",
      "Une position Minah devient liquide : principal et rendement séparés, marché secondaire, sortie avant l'échéance.",
    ],
  },
  experienceParPhase: {
    fondations: "Avant toute interface, la preuve : un premier MVP techno-financier. une obligation africaine devient un actif on-chain, gardé par une custody institutionnelle et adossé à un vrai KYC. Le socle sur lequel tout le reste viendra se brancher.",
    b2c: "Une plateforme all-in-one : l'utilisateur se connecte, réalise son KYC et investit dans un projet ouest-africain unique, de bout en bout — et l'on découvre ce que ce marché demande réellement.",
    b2b: "La plateforme bascule vers un public d'investisseurs professionnels : accès vérifié, questionnaire, souscription en ligne. Une expérience d'investisseur qualifié, avec un suivi augmenté à chaque étape.",
    api_v1: "L'expérience devient seamless pour les acteurs digitaux : les principales fonctions de la plateforme s'automatisent via API ou agent IA. Un partenaire distribue les stratégies à ses propres clients sans passer par l'équipe.",
    api_v2: "Le capital circule seul : les fintechs sont financées, la trésorerie en attente travaille en T-bills, des agents consultent et souscrivent, chacun suit ses positions en temps réel.",
    vision: "Financer l'économie réelle africaine devient aussi liquide qu'un marché coté : principal et rendement se cèdent séparément, un token ouvre toutes les stratégies, et l'on peut sortir avant l'échéance.",
  },
  capacitesParPhase: {
    fondations: {
      capacite: "Les rails, la custody et le KYC sont en place ; les premières obligations sont tokenisées.",
      volume: "Premières émissions",
    },
    b2c: {
      capacite: "Espace B2C complet avec souscription de bout en bout, premières stratégies exécutées.",
      volume: "MVP de test, moins de 100 K€",
    },
    b2b: {
      capacite: "Des investisseurs professionnels souscrivent en ligne via la plateforme B2B.",
      volume: "De 2 M€ à 15 M€ sur la période",
    },
    api_v1: {
      capacite: "Des partenaires et protocoles distribuent les stratégies via API ; admin et Web3 unifiés.",
      volume: "Nouvelle stratégie de 15 à 20 M€",
      api: "API v1, l'entrée : des partenaires et protocoles consultent les stratégies et souscrivent.",
    },
    api_v2: {
      capacite: "Le vault prête aux fintechs, la trésorerie se place en T-bills, les agents IA souscrivent.",
      volume: "Objectif : dépasser 100 M€",
      api: "API v2, la sortie et l'automatisation : déploiement direct vers les fintechs, placement automatique de la trésorerie en attente, flux agents via MCP, données temps réel pour les rapports dynamiques.",
    },
    vision: {
      capacite: "Positions liquides (PT/YT, marché secondaire) et token multi-stratégies.",
      volume: "Road to 1 Md€",
    },
  },
  publieLe: null,
};

/** Brief équipe minimal — à rédiger en phase B sur le modèle Sereel. */
function draft(pourquoi: string, perimetre: string, extra: Partial<TeamBrief> = {}): TeamBrief {
  return {
    pourquoi,
    perimetre,
    horsPerimetre: "[à préciser]",
    comment: "[approche recommandée et choix techniques à préciser en point technique]",
    autonomie: ["[accès, clés sandbox, docs, contacts partenaires]"],
    criteresDone: [
      { label: "Périmètre validé en point technique", fait: false },
      { label: "Livré en production et documenté", fait: false },
      { label: "Validation de Julien", fait: false },
    ],
    risques: ["[risques et questions ouvertes à lister]"],
    liens: [],
    ...extra,
  };
}

const DONE: TeamBrief["criteresDone"] = [{ label: "En production", fait: true }];

/** Dates provisoires : du début de la phase précédente au milieu de la phase de livraison. */
function datesFor(livreEn: Phase): { dateDebut: string; dateFinCible: string } {
  const i = PHASES.indexOf(livreEn);
  const prev = PHASES[Math.max(0, i - 1)];
  const w = PHASE_WINDOWS[livreEn];
  const mid = new Date((new Date(w.start).getTime() + new Date(w.end).getTime()) / 2).toISOString().slice(0, 10);
  return { dateDebut: i === 0 ? w.start : PHASE_WINDOWS[prev].start, dateFinCible: mid };
}

type Raw = Omit<Objective, "statutsParPhase" | "dateDebut" | "dateFinCible" | "datesProvisoires" | "derniereMaj" | "majPar" | "sante" | "derniereMiseAJour" | "miseEnAvant"> & {
  dateDebut?: string;
  dateFinCible?: string;
  sante?: Health;
  derniereMiseAJour?: { date: string; auteur: string; texte: string };
  miseEnAvant?: boolean;
};

function build(r: Raw): Objective {
  const dates = r.dateDebut && r.dateFinCible ? { dateDebut: r.dateDebut, dateFinCible: r.dateFinCible } : datesFor(r.livreEn);
  return {
    ...r,
    ...dates,
    datesProvisoires: !(r.dateDebut && r.dateFinCible),
    statutsParPhase: statusesFor(r.livreEn, r.statutsForces),
    sante: r.sante ?? null,
    derniereMiseAJour: r.derniereMiseAJour ?? null,
    miseEnAvant: r.miseEnAvant ?? false,
    derniereMaj: r.derniereMiseAJour?.date ?? MAJ,
    majPar: r.derniereMiseAJour?.auteur ?? BY,
  };
}

const RAW: Raw[] = [
  {
    id: "signature-titre", slug: "signature-titre", titre: "Signature du titre financier", couche: "admin", moteur: "dette_privee", ordre: 1.5,
    livreEn: "b2c", owner: null, dependances: ["kyc-sumsub"], note: "Signature électronique dans le parcours", aConfirmer: false,
    briefTheorique: draft(
      "Faire signer le titre financier dans la plateforme, à la suite du KYC, sans sortir du parcours.",
      "Signature électronique rattachée au dossier investisseur, archivage de l'acte signé.",
      { criteresDone: DONE },
    ),
    capaciteDebloquee: "Le titre se signe dans la plateforme.",
    briefInvestisseur: {
      quoi: "La signature électronique du titre financier, dans le parcours.",
      pourquoi: "KYC puis signature s'enchaînent sans rupture : l'investisseur ne quitte jamais la plateforme pour souscrire.",
      capacite: "Souscription complète de bout en bout.",
    },
    visibleDataroom: true,
  },
  {
    id: "site-vitrine", slug: "site-vitrine", titre: "Site vitrine minah.io", couche: "produits", moteur: "transverse", ordre: 0,
    livreEn: "fondations", owner: null, dependances: [], note: null, aConfirmer: false,
    briefTheorique: draft(
      "Donner à Minah sa première surface publique : expliquer la thèse et ouvrir un point de contact.",
      "Site public, contenu éditorial, formulaire de contact.",
      { criteresDone: DONE },
    ),
    capaciteDebloquee: "Une première surface publique.",
    briefInvestisseur: {
      quoi: "Le site public de Minah.",
      pourquoi: "La thèse d'investissement devient lisible de l'extérieur, et les premiers contacts arrivent.",
      capacite: "Présence publique et prise de contact.",
    },
    visibleDataroom: true,
  },
  {
    id: "qa-live", slug: "qa-live", titre: "Q&A live sur la plateforme", couche: "produits", moteur: "dette_privee", ordre: 1.5,
    livreEn: "b2c", owner: null, dependances: ["espace-b2c"], note: null, aConfirmer: false,
    briefTheorique: draft(
      "Répondre aux questions des investisseurs là où ils investissent, en direct, plutôt que par e-mail.",
      "Sessions de questions-réponses tenues dans la plateforme, rattachées à une stratégie.",
      { criteresDone: DONE },
    ),
    capaciteDebloquee: "Des questions-réponses tenues en direct dans le produit.",
    briefInvestisseur: {
      quoi: "Des sessions de questions-réponses en direct, dans la plateforme.",
      pourquoi: "La confiance se construit avant la souscription, et la réponse reste attachée à la stratégie.",
      capacite: "Relation directe avec les investisseurs, sans sortir du produit.",
    },
    visibleDataroom: true,
  },
  {
    id: "suivi-automatise", slug: "suivi-automatise", titre: "Suivi automatisé du cycle de souscription", couche: "produits", moteur: "dette_privee", ordre: 2.5,
    livreEn: "b2b", owner: null, dependances: ["plateforme-minah"], note: "Les montants montent : chaque étape doit être suivie et relancée sans traitement manuel", aConfirmer: false,
    briefTheorique: draft(
      "Quand le montant des stratégies augmente, chaque étape de la souscription demande un suivi — l'automatiser est la condition pour tenir le volume.",
      "Suivi d'étape, relances, états de souscription, traçabilité de bout en bout.",
    ),
    capaciteDebloquee: "Un suivi à chaque étape, sans traitement manuel.",
    briefInvestisseur: {
      quoi: "Le suivi automatisé de chaque étape d'une souscription.",
      pourquoi: "Des tickets plus gros exigent un suivi serré ; l'automatiser permet de tenir le volume sans gonfler l'équipe.",
      capacite: "Un suivi de qualité institutionnelle, à l'échelle.",
    },
    visibleDataroom: true,
  },
  {
    id: "network-builders", slug: "network-builders", titre: "Network Builders", couche: "admin", moteur: "dette_privee", ordre: 2.5,
    livreEn: "b2b", owner: null, dependances: ["admin-rbac"], note: null, aConfirmer: false,
    briefTheorique: draft(
      "Mobiliser des apporteurs pour sourcer des investisseurs fortunés, depuis l'espace admin.",
      "Rôle Network Builder, espace dédié, invitations, suivi des introductions.",
      { criteresDone: DONE },
    ),
    capaciteDebloquee: "Un réseau d'apporteurs qui source des HNWI.",
    briefInvestisseur: {
      quoi: "Un programme d'apporteurs, outillé dans l'espace admin.",
      pourquoi: "La distribution ne dépend plus des seuls canaux directs : un réseau qualifié ouvre des conversations avec des investisseurs fortunés.",
      capacite: "Sourcing de HNWI par le réseau.",
    },
    visibleDataroom: true,
  },
  {
    id: "minah-os", slug: "minah-os", titre: "Minah OS", couche: "api", moteur: "transverse", ordre: 0.5,
    livreEn: "b2b", owner: null, dependances: [], note: "Operating system interne — objectifs, tâches, contexte, agents", aConfirmer: false,
    briefTheorique: draft(
      "Donner à Minah une tour de contrôle : une source de vérité unique sur les objectifs, les flux et le contexte, lisible par l'équipe comme par les agents.",
      "Référentiel des objectifs et des tâches, contexte stratégique, premiers agents branchés dessus.",
    ),
    capaciteDebloquee: "Une tour de contrôle interne, lisible par les agents.",
    briefInvestisseur: {
      quoi: "L'operating system interne de Minah.",
      pourquoi: "Le pilotage cesse d'être dispersé : une source de vérité unique, que les agents peuvent lire et écrire.",
      capacite: "Début de la tour de contrôle.",
    },
    visibleDataroom: true,
  },
  {
    id: "liquidite-permissionnee", slug: "liquidite-permissionnee", titre: "Premiers souscripteurs on-chain", couche: "liquidite", moteur: "transverse", ordre: 0.5,
    livreEn: "b2b", statutsForces: { b2c: "prevu", b2b: "en_cours" }, owner: null, dependances: ["api-v1"], note: "Permissionné — security token", aConfirmer: true,
    briefTheorique: draft(
      "Ouvrir la souscription à des porteurs on-chain, dans un cadre permissionné.",
      "[Security token permissionné, liste d'adresses autorisées, règlement]",
    ),
    capaciteDebloquee: "Une première souscription venue de la chaîne.",
    briefInvestisseur: {
      quoi: "La souscription ouverte à des porteurs on-chain, dans un cadre permissionné.",
      pourquoi: "Une nouvelle origine de capital s'ouvre sans sortir du cadre réglementaire : le titre reste un security token.",
      capacite: "Premiers souscripteurs on-chain.",
    },
    visibleDataroom: true,
  },
  {
    id: "vault-utility-tokens", slug: "vault-utility-tokens", titre: "Vault et utility tokens", couche: "liquidite", moteur: "liquidite_crypto", ordre: 3.5,
    livreEn: "api_v2", owner: null, dependances: ["api-v2"], note: "Utilise le découpage PT / YT", aConfirmer: true,
    briefTheorique: draft(
      "Créer un vault dont les parts sont des utility tokens, sur le modèle du découpage principal / rendement.",
      "[Composition du vault, émission des parts, valorisation, règlement]",
    ),
    capaciteDebloquee: "Un vault dont les parts circulent.",
    briefInvestisseur: {
      quoi: "Un vault dont les parts sont des utility tokens, sur le modèle PT / YT.",
      pourquoi: "L'exposition devient transférable sans toucher au sous-jacent — première marche vers la liquidité.",
      capacite: "Des parts de vault qui circulent.",
    },
    partenaires: ["pendle", "spectra"],
    visibleDataroom: true,
  },
  {
    id: "rails-onchain-deploiement", slug: "rails-onchain-deploiement", titre: "Déploiement via rails on-chain", couche: "rails", moteur: "transverse", ordre: 6,
    livreEn: "api_v2", owner: null, dependances: ["multi-providers-web3"], note: "Référence de marché : MoneyGram sur Stellar", aConfirmer: true,
    briefTheorique: draft(
      "Faire passer le déploiement des fonds par l'infrastructure on-chain, et non plus seulement le règlement du titre.",
      "[Rails de paiement, points de sortie, custody, conformité des flux]",
    ),
    capaciteDebloquee: "Le déploiement des fonds passe par la chaîne.",
    briefInvestisseur: {
      quoi: "L'infrastructure on-chain utilisée pour déployer les fonds, pas seulement pour émettre le titre.",
      pourquoi: "Le trajet de l'argent devient traçable de bout en bout, à des coûts et des délais qu'un rail bancaire classique ne tient pas.",
      capacite: "Déploiement traçable de bout en bout.",
    },
    partenaires: ["stellar", "fireblocks"],
    visibleDataroom: true,
  },
  // ── Liquidité (vision) ───────────────────────────────────────────────────
  {
    id: "pt-yt", slug: "pt-yt", titre: "PT/YT (principal et yield tokens)", couche: "liquidite", moteur: "transverse", ordre: 1,
    livreEn: "vision", owner: null, dependances: ["api-v2"], note: "Nouveau (v2)", aConfirmer: true,
    briefTheorique: draft(
      "Séparer le principal et le rendement d'une obligation tokenisée pour créer des positions négociables séparément.",
      "[Modèle de découpage principal / yield, règlement, compatibilité avec les rails]",
    ),
    capaciteDebloquee: "Des positions découpées en principal et rendement.",
    briefInvestisseur: {
      quoi: "Le découpage d'une obligation en deux tokens : le principal et le rendement.",
      pourquoi: "Chaque composante devient une position à part entière, que l'on peut détenir ou céder séparément.",
      capacite: "Positions liquides sur le principal et le rendement.",
    },
    partenaires: ["pendle"],
    visibleDataroom: true,
  },
  {
    id: "marche-secondaire", slug: "marche-secondaire", titre: "Marché secondaire", couche: "liquidite", moteur: "transverse", ordre: 2,
    miseEnAvant: true,
    livreEn: "vision", owner: null, dependances: ["pt-yt"], note: "Nouveau (v2)", aConfirmer: true,
    briefTheorique: draft(
      "Permettre à un investisseur de sortir avant l'échéance en cédant sa position à un autre.",
      "[Carnet d'ordres ou gré à gré, règlement on-chain, conformité des cessions]",
    ),
    capaciteDebloquee: "Sortie avant échéance.",
    briefInvestisseur: {
      quoi: "Un marché secondaire pour les positions Minah.",
      pourquoi: "Un investisseur peut sortir avant l'échéance en cédant sa position.",
      capacite: "Liquidité avant échéance.",
    },
    partenaires: ["tradable"],
    visibleDataroom: true,
  },
  {
    id: "token-multi-strategies", slug: "token-multi-strategies", titre: "Token multi-stratégies", couche: "liquidite", moteur: "transverse", ordre: 3,
    livreEn: "vision", owner: null, dependances: ["pt-yt"], note: "Nouveau (v2)", aConfirmer: true,
    briefTheorique: draft(
      "Un token unique exposé à plusieurs stratégies Minah, pour une entrée simple et diversifiée.",
      "[Composition, rééquilibrage, valorisation, règlement]",
    ),
    capaciteDebloquee: "Une exposition diversifiée en un seul token.",
    briefInvestisseur: {
      quoi: "Un token qui agrège plusieurs stratégies Minah.",
      pourquoi: "Une seule position pour une exposition diversifiée à la dette africaine.",
      capacite: "Diversification en un token.",
    },
    visibleDataroom: true,
  },

  // ── Produits et moteurs ──────────────────────────────────────────────────
  {
    id: "espace-b2c", slug: "espace-b2c", titre: "Espace B2C et souscription de bout en bout", couche: "produits", moteur: "dette_privee", ordre: 1,
    miseEnAvant: true,
    livreEn: "b2c", owner: null, dependances: ["stellar-soroban", "kyc-sumsub"], note: "Nouveau (v2) · premier semestre 2026", aConfirmer: false,
    briefTheorique: draft(
      "La première version de Minah : un espace prêt pour le B2C avec un flow de souscription qui marchait de bout en bout, et les premières stratégies exécutées.",
      "Espace investisseur B2C, KYC, souscription en ligne jusqu'au règlement, premières stratégies.",
      { criteresDone: DONE, risques: [] }
    ),
    capaciteDebloquee: "Souscription de bout en bout.",
    briefInvestisseur: {
      quoi: "La première version de l'espace investisseur, avec une souscription de bout en bout.",
      pourquoi: "Le parcours complet — accès, vérification, souscription, règlement — a été exécuté sur de premières stratégies.",
      capacite: "Souscription de bout en bout, premières stratégies exécutées.",
    },
    visibleDataroom: true,
  },
  {
    id: "plateforme-minah", slug: "plateforme-b2b", titre: "Plateforme B2B minah.io", couche: "produits", moteur: "dette_privee", ordre: 2,
    miseEnAvant: true,
    // Côté data room, la plateforme reste « en développement » sur la période B2B :
    // elle est en production, mais le périmètre B2B se construit encore (03/10/2026).
    livreEn: "b2b", statutsForces: { b2b: "en_cours" }, owner: null, dependances: ["espace-b2c"], note: "Lancée fin sept. 2026", aConfirmer: false,
    dateDebut: "2026-06-01", dateFinCible: "2026-09-30",
    briefTheorique: draft(
      "Le point d'entrée des investisseurs professionnels : accès, KYC, souscription en ligne, portefeuille. Tout le reste de la roadmap s'y raccorde.",
      "Plateforme B2B en production, admin Owner.",
      { criteresDone: [{ label: "Lancement fin septembre 2026", fait: true }], risques: [] }
    ),
    capaciteDebloquee: "Des investisseurs professionnels souscrivent en ligne.",
    briefInvestisseur: {
      quoi: "La plateforme B2B minah.io, en production depuis fin septembre 2026.",
      pourquoi: "Les investisseurs professionnels y accèdent aux stratégies, passent leur KYC et souscrivent en ligne.",
      capacite: "Souscription en ligne d'obligations tokenisées.",
    },
    visibleDataroom: true,
  },
  {
    id: "integration-sereel", slug: "integration-sereel", titre: "Intégration Sereel", couche: "produits", moteur: "dette_privee", ordre: 3,
    miseEnAvant: true,
    sante: "on_track", derniereMiseAJour: { date: "2026-10-01T09:00:00.000Z", auteur: "Erwan", texte: "Cadrage terminé, endpoints en cours sur le sandbox Sereel. Reste la revue des accès et les tests de bout en bout pour tenir le live mi-octobre." },
    livreEn: "api_v1", owner: "Erwan", dependances: ["api-v1"], note: "Live visé mi-octobre 2026", aConfirmer: false,
    dateDebut: "2026-09-15", dateFinCible: "2026-10-15",
    briefTheorique: {
      pourquoi: "Sereel est le premier protocole partenaire ouvert. C'est la preuve que les stratégies Minah peuvent être distribuées par un tiers via API, et le modèle pour Realiz, Etherfuse et Untangled.",
      perimetre: "Les endpoints permettant à Sereel de [lister les stratégies, consulter une stratégie, initier une souscription].",
      horsPerimetre: "[à préciser]",
      comment: "[approche d'authentification partenaire, format d'échange, environnement sandbox puis production].",
      autonomie: ["Accès sandbox Sereel", "Contact technique côté Sereel [nom]", "Documentation de leur protocole", "Clés de test", "Accès au repo de l'API"],
      criteresDone: [
        { label: "Endpoints en production", fait: false },
        { label: "Testés de bout en bout avec Sereel en sandbox", fait: false },
        { label: "Documentés", fait: false },
        { label: "Monitoring en place", fait: false },
        { label: "Validation de Julien", fait: false },
      ],
      risques: ["[délais côté Sereel]", "[conformité KYC des investisseurs arrivant par Sereel]"],
      liens: [],
    },
    capaciteDebloquee: "Distribution via API.",
    briefInvestisseur: {
      quoi: "Premier protocole partenaire connecté à l'API Minah.",
      pourquoi: "Les stratégies Minah deviennent distribuables par des plateformes tierces, sans intervention manuelle.",
      capacite: "Distribution via API.",
      partenaire: "Sereel",
    },
    partenaires: ["sereel"],
    visibleDataroom: true,
  },
  {
    id: "protocoles-suivants", slug: "protocoles-suivants", titre: "Realiz, Etherfuse, Untangled", couche: "produits", moteur: "dette_privee", ordre: 4,
    livreEn: "api_v1", statutsForces: { b2b: "prevu" }, owner: "Erwan", dependances: ["integration-sereel", "api-v1"],
    note: "À confirmer · 2e protocole visé en déc. 2026", aConfirmer: true,
    briefTheorique: draft(
      "Après Sereel, brancher des acteurs du même type pour prouver que le modèle se répète : Realiz (titrisation tokenisée d'actifs non bancables), Etherfuse (obligations souveraines tokenisées sur Stellar et Solana), Untangled Finance (DeFi institutionnelle sur actifs réels). La liste évoluera avec les partenariats.",
      "Réutiliser l'intégration Sereel comme gabarit : auth partenaire, endpoints, sandbox puis production, pour chaque protocole.",
      { risques: ["[ordre et calendrier des partenariats]", "[spécificités techniques par protocole]"] }
    ),
    capaciteDebloquee: "Plusieurs protocoles distribuent les stratégies Minah.",
    briefInvestisseur: {
      quoi: "Les protocoles partenaires suivants, branchés sur le même modèle que le premier.",
      pourquoi: "Chaque nouveau protocole élargit la distribution sans développement spécifique.",
      capacite: "Plusieurs canaux de distribution via une seule API.",
    },
    partenaires: ["realiz", "etherfuse", "untangled"],
    visibleDataroom: true,
  },
  {
    id: "environnement-web-strategie", slug: "environnement-web-strategie", titre: "Environnement web par stratégie", couche: "produits", moteur: "dette_privee", ordre: 5,
    livreEn: "api_v2", owner: null, dependances: ["api-v2"], note: "Nouveau (v2)", aConfirmer: false,
    briefTheorique: draft(
      "Donner à chaque stratégie son environnement web et ses rapports dynamiques, alimentés en temps réel par l'API v2.",
      "Une expérience web par stratégie, rapports dynamiques, données temps réel via l'API.",
    ),
    capaciteDebloquee: "Des rapports dynamiques par stratégie.",
    briefInvestisseur: {
      quoi: "Un environnement web dédié à chaque stratégie, avec des rapports dynamiques.",
      pourquoi: "L'investisseur suit sa stratégie en temps réel plutôt qu'avec des rapports périodiques.",
      capacite: "Rapports dynamiques par stratégie.",
    },
    visibleDataroom: true,
  },
  {
    id: "tbills-tokenises", slug: "tbills-tokenises", titre: "Accès aux T-bills tokenisés", couche: "liquidite", moteur: "dette_souveraine", ordre: 4,
    miseEnAvant: true,
    livreEn: "api_v2", owner: null, dependances: ["api-v2"],
    note: "Nouveau (v2) · partenaires pressentis : Spiko (en contact) et Zeno — ne pas nommer côté dataroom tant que ce n'est pas signé", aConfirmer: true,
    briefTheorique: draft(
      "Placer la trésorerie en attente — et ouvrir un moteur de dette souveraine — via des T-bills tokenisés, en s'appuyant sur un partenaire spécialisé.",
      "Connexion à un fournisseur de T-bills tokenisés via l'API v2 ; placement automatique de la trésorerie en attente.",
      { risques: ["[choix et contractualisation du partenaire]", "[cadre réglementaire du placement de trésorerie]"] }
    ),
    capaciteDebloquee: "La trésorerie en attente se place en T-bills.",
    briefInvestisseur: {
      quoi: "L'accès à des bons du Trésor tokenisés, via un partenaire spécialisé.",
      pourquoi: "La trésorerie en attente travaille au lieu de dormir, et un moteur de dette souveraine s'ouvre.",
      capacite: "Placement automatique de la trésorerie en attente.",
    },
    partenaires: ["spiko", "zeno"],
    visibleDataroom: true,
  },
  {
    id: "vault-fintechs", slug: "vault-fintechs", titre: "Vault crypto connecté aux fintechs", couche: "produits", moteur: "liquidite_crypto", ordre: 7,
    miseEnAvant: true,
    livreEn: "api_v2", owner: null, dependances: ["api-v2"], note: "Nouveau (v2)", aConfirmer: true,
    briefTheorique: draft(
      "Ouvrir un troisième moteur de volume : des acteurs crypto investissent dans un vault qui prête directement à des fintechs.",
      "Vault on-chain, déploiement direct vers les fintechs via l'API v2, reporting des positions.",
      { risques: ["[cadre réglementaire du vault]", "[sélection et suivi des fintechs emprunteuses]"] }
    ),
    capaciteDebloquee: "Le vault prête aux fintechs.",
    briefInvestisseur: {
      quoi: "Un vault dans lequel des acteurs crypto investissent, et qui prête directement à des fintechs.",
      pourquoi: "La liquidité crypto finance l'économie réelle africaine, sans intermédiaire.",
      capacite: "Déploiement direct vers les fintechs.",
    },
    visibleDataroom: true,
  },
  {
    id: "agents-ia", slug: "agents-ia", titre: "Agents IA", couche: "produits", moteur: "transverse", ordre: 8,
    miseEnAvant: true,
    livreEn: "api_v2", owner: "Erwan", dependances: ["serveur-mcp", "documentation-publique"], note: "Consultation puis souscription", aConfirmer: false,
    briefTheorique: draft(
      "Que des agents (Yao, agents d'investisseurs ou de partenaires) puissent consulter des informations qualifiées, les restituer à leurs utilisateurs et, à terme, initier une souscription.",
      "Parcours agent de bout en bout sur l'API et le serveur MCP : consultation d'abord, souscription ensuite.",
      { risques: ["[cadre de responsabilité quand un agent souscrit pour un humain]", "[sécurité : ouverture aux agents sans fragiliser la plateforme]"] }
    ),
    capaciteDebloquee: "Un agent IA consulte puis souscrit.",
    briefInvestisseur: {
      quoi: "Les agents IA deviennent des utilisateurs de Minah à part entière.",
      pourquoi: "Un agent peut consulter une obligation africaine, la présenter à son utilisateur, puis souscrire.",
      capacite: "Souscription par un agent IA.",
    },
    visibleDataroom: true,
  },

  // ── API ──────────────────────────────────────────────────────────────────
  {
    id: "api-v1", slug: "api-v1", titre: "API v1, l'entrée", couche: "api", moteur: "dette_privee", ordre: 1,
    miseEnAvant: true,
    sante: "on_track", derniereMiseAJour: { date: "2026-10-01T09:00:00.000Z", auteur: "Erwan", texte: "Spécification des routes par usage en cours ; le périmètre Sereel sert de premier cas. Auth partenaire à cadrer en point technique." },
    livreEn: "api_v1", owner: "Erwan", dependances: [], note: "Jalon « API v1 » en déc. 2026", aConfirmer: false,
    dateDebut: "2026-10-01", dateFinCible: "2026-12-15",
    briefTheorique: draft(
      "L'entrée : une API ouverte par laquelle des partenaires et protocoles consultent les stratégies et souscrivent. Elle centralise les interactions web3 (Stellar aujourd'hui, Canton Network et Fireblocks) et sert aussi les applications internes.",
      "Routes classées par usage — interne, agents, externe — avec les niveaux d'accès correspondants ; premier périmètre : ce dont Sereel a besoin.",
      { risques: ["[versionnage et compatibilité ascendante dès la v1]"] }
    ),
    capaciteDebloquee: "Des partenaires consultent les stratégies et souscrivent via API.",
    briefInvestisseur: {
      quoi: "L'API Minah v1 : l'entrée vers les stratégies.",
      pourquoi: "Partenaires et protocoles consultent les stratégies et souscrivent par la même porte, avec des accès différenciés.",
      capacite: "Distribution via une API unique.",
    },
    visibleDataroom: true,
  },
  {
    id: "multi-providers-web3", slug: "multi-providers-web3", titre: "Multi-providers web3", couche: "api", moteur: "transverse", ordre: 2,
    sante: "at_risk", derniereMiseAJour: { date: "2026-09-29T09:00:00.000Z", auteur: "Julien", texte: "Deux providers en Q4 reste l'objectif, mais le second n'est pas encore choisi (Canton ou Fireblocks d'abord ?). À trancher avant mi-octobre." },
    livreEn: "api_v1", owner: "Erwan", dependances: ["api-v1"], note: "Deux providers en Q4", aConfirmer: false,
    dateDebut: "2026-10-15", dateFinCible: "2026-12-31",
    briefTheorique: draft(
      "Ne pas dépendre d'un seul rail : l'API doit parler à plusieurs providers web3 derrière une abstraction commune (émission, custody, règlement).",
      "Abstraction provider dans l'API et deux providers branchés en Q4 2026.",
      { risques: ["[différences de modèle entre chaînes : finalité, frais, formats]"] }
    ),
    capaciteDebloquee: "Les stratégies ne dépendent plus d'une seule chaîne.",
    briefInvestisseur: {
      quoi: "Plusieurs infrastructures web3 derrière la même API.",
      pourquoi: "Minah n'est pas captive d'un rail : chaque stratégie peut s'appuyer sur la chaîne la plus adaptée.",
      capacite: "Indépendance vis-à-vis d'un rail unique.",
    },
    partenaires: ["stellar", "canton", "fireblocks"],
    visibleDataroom: true,
  },
  {
    id: "api-v2", slug: "api-v2", titre: "API v2, la sortie et l'automatisation", couche: "api", moteur: "transverse", ordre: 3,
    miseEnAvant: true,
    livreEn: "api_v2", owner: "Erwan", dependances: ["api-v1", "web3-admin"], note: "Nouveau (v2)", aConfirmer: false,
    briefTheorique: draft(
      "La sortie et l'automatisation : déploiement direct vers les fintechs, placement automatique de la trésorerie en attente, flux agents via MCP, données temps réel pour les rapports dynamiques.",
      "Endpoints de sortie (déploiement, placement), événements temps réel, intégration MCP ; conçue pour être pilotée par des agents.",
      { risques: ["[priorisation entre les trois moteurs]", "[charge et fiabilité des flux temps réel]"] }
    ),
    capaciteDebloquee: "L'argent sort et se place automatiquement.",
    briefInvestisseur: {
      quoi: "L'API Minah v2 : la sortie et l'automatisation.",
      pourquoi: "Déploiement direct vers les fintechs, placement automatique de la trésorerie, flux agents et données temps réel.",
      capacite: "Automatisation des flux sortants.",
    },
    visibleDataroom: true,
  },
  {
    id: "documentation-publique", slug: "documentation-publique", titre: "Documentation publique", couche: "api", moteur: "transverse", ordre: 4,
    livreEn: "api_v2", owner: "Erwan", dependances: ["api-v1"], note: "Change de phase (v2) · routes documentées visées jan-fév 2027", aConfirmer: false,
    briefTheorique: draft(
      "Une API documentée à 100 % — spécification, exemples, cas d'erreur — lisible par un développeur comme par un agent. C'est la condition de l'ouverture aux agents et aux partenaires sans accompagnement manuel.",
      "Spécification complète, exemples par route, catalogue des erreurs, publication publique.",
    ),
    capaciteDebloquee: "Un partenaire ou un agent s'intègre sans accompagnement.",
    briefInvestisseur: {
      quoi: "La documentation publique de l'API Minah.",
      pourquoi: "Un développeur ou un agent peut s'intégrer seul, sans passer par l'équipe.",
      capacite: "Intégration en autonomie.",
    },
    visibleDataroom: true,
  },
  {
    id: "serveur-mcp", slug: "serveur-mcp", titre: "Serveur MCP", couche: "api", moteur: "transverse", ordre: 5,
    miseEnAvant: true,
    livreEn: "api_v2", owner: "Erwan", dependances: ["api-v1", "documentation-publique"], note: "Change de phase (v2) · MCP v1 visé mars-avr 2027", aConfirmer: false,
    briefTheorique: draft(
      "Un serveur MCP Minah pour que les agents consultent des informations qualifiées, les restituent à leurs utilisateurs et, à terme, initient une souscription.",
      "MCP v1 en lecture (stratégies, positions), puis actions de souscription ; pentests incluant des attaques via agents.",
      { risques: ["[périmètre des actions autorisées à un agent]"] }
    ),
    capaciteDebloquee: "Les agents accèdent à Minah nativement.",
    briefInvestisseur: {
      quoi: "Un serveur MCP, le standard par lequel les agents IA utilisent des outils.",
      pourquoi: "Les agents n'ont pas besoin d'intégration spécifique pour consulter et, à terme, souscrire.",
      capacite: "Accès natif pour les agents.",
    },
    visibleDataroom: true,
  },

  // ── Admin, Web3 et sécurité ──────────────────────────────────────────────
  {
    id: "kyc-sumsub", slug: "kyc-sumsub", titre: "KYC Sumsub", couche: "admin", moteur: "transverse", ordre: 1,
    miseEnAvant: true,
    livreEn: "fondations", owner: null, dependances: [], note: null, aConfirmer: false,
    briefTheorique: draft(
      "Vérifier l'identité des investisseurs avant toute souscription, avec un prestataire reconnu.",
      "Parcours KYC Sumsub intégré à l'espace investisseur, statuts synchronisés dans l'admin.",
      { criteresDone: DONE, risques: [] }
    ),
    capaciteDebloquee: "Chaque investisseur est vérifié avant de souscrire.",
    briefInvestisseur: {
      quoi: "La vérification d'identité des investisseurs, opérée avec Sumsub.",
      pourquoi: "Aucune souscription sans identité vérifiée : la conformité fait partie du parcours.",
      capacite: "Investisseurs vérifiés.",
      partenaire: "Sumsub",
    },
    partenaires: ["sumsub"],
    visibleDataroom: true,
  },
  {
    id: "admin-rbac", slug: "admin-rbac", titre: "Espace admin interne", couche: "admin", moteur: "transverse", ordre: 2,
    livreEn: "b2b", owner: null, dependances: [], note: "Clerk, rôles Owner et Network Builder (Community Leader retiré en sept. 2026)", aConfirmer: false,
    briefTheorique: draft(
      "Un espace admin avec des rôles et des accès contrôlés, pour que l'équipe pilote la plateforme sans se marcher dessus.",
      "Auth Clerk, whitelist, rôles Owner et Network Builder, routes API protégées par rôle.",
      { criteresDone: DONE, risques: [] }
    ),
    capaciteDebloquee: "L'équipe pilote la plateforme avec des accès contrôlés.",
    briefInvestisseur: {
      quoi: "L'espace d'administration : gérer l'équipe, les flux internes et les accès.",
      pourquoi: "Les flux internes se pilotent au même endroit, et chaque action sensible est faite par la bonne personne.",
      capacite: "Pilotage de l'équipe et des flux par l'interne.",
    },
    visibleDataroom: true,
  },
  {
    id: "web3-admin", slug: "espace-web3-admin", titre: "Espace Web3 intégré à l'admin", couche: "admin", moteur: "transverse", ordre: 3,
    miseEnAvant: true,
    sante: "on_track", derniereMiseAJour: { date: "2026-09-29T09:00:00.000Z", auteur: "Julien", texte: "Démarrage prévu en novembre, après l'API v1. Périmètre élargi au cross-chain suite au brief v2." },
    livreEn: "api_v1", owner: "Erwan", dependances: ["api-v1", "multi-providers-web3"], note: "Renommé et élargi (v2) · mission 2, à partir de nov. 2026", aConfirmer: false,
    briefTheorique: draft(
      "Un espace Web3 unifié dans l'admin, sur le modèle de ce qui a été fait pour l'admin elle-même : émission, custody, règlement et cross-chain pilotés au même endroit que les investisseurs et les stratégies, via l'API.",
      "Espace Web3 dans l'admin (émission, custody, règlement, cross-chain) ; infrastructure de test — unitaires, intégration, simulation — avec une base de mocks : providers web3, protocoles partenaires, données investisseurs.",
      { risques: ["[traçabilité des actions sensibles depuis l'admin]"] }
    ),
    capaciteDebloquee: "L'on-chain se pilote depuis l'admin.",
    briefInvestisseur: {
      quoi: "L'activité on-chain, cross-chain compris, visible et pilotable depuis l'espace d'administration.",
      pourquoi: "Émission, custody et règlement sont suivis au même endroit que les investisseurs et les stratégies.",
      capacite: "Admin et Web3 unifiés.",
    },
    visibleDataroom: true,
  },
  {
    id: "durcissement-securite", slug: "securite-pentests", titre: "Sécurité et pentests", couche: "admin", moteur: "transverse", ordre: 4,
    sante: "at_risk", derniereMiseAJour: { date: "2026-09-29T09:00:00.000Z", auteur: "Julien", texte: "Pas de prestataire de pentest identifié. Les tests cyber internes peuvent démarrer sans ; le pentest de mars-avril dépend de ce choix." },
    livreEn: "api_v1", statutsForces: { b2b: "prevu" }, owner: "Erwan", dependances: ["web3-admin"],
    note: "Renommé (v2) · à confirmer · visible dataroom sans détail · pentest visé mars-avr 2027", aConfirmer: true,
    briefTheorique: {
      pourquoi: "L'ouverture aux partenaires et aux agents ne doit pas fragiliser la plateforme. Deux temps, repris de la feuille de route envoyée à Erwan : solidifier l'admin (mission 2, dès nov. 2026), puis valider l'ouverture aux agents (mission 3, dès jan. 2027).",
      perimetre: "Tests de cybersécurité — gestion des secrets, traçabilité des actions sensibles, revue des dépendances — puis remédiation et re-test. Ensuite, pentests : simulations d'attaque et de pénétration sur l'API, l'espace admin et le serveur MCP, y compris via des agents.",
      horsPerimetre: "[à préciser : périmètre exclu, prestataire externe ou interne]",
      comment: "[séquencement tests → remédiation → re-test → pentest ; prestataire de pentest à choisir]",
      autonomie: ["Inventaire des secrets et de leur rotation", "Accès aux environnements de test", "[Prestataire de pentest et calendrier]"],
      criteresDone: [
        { label: "Tests cyber réalisés, remédiation faite et re-testée", fait: false },
        { label: "Pentest API, admin et MCP réalisé, y compris via agents", fait: false },
        { label: "Rapport partagé en point technique, actions suivies", fait: false },
        { label: "Validation de Julien", fait: false },
      ],
      risques: ["[prestataire de pentest et calendrier]", "[dépendances à jour sans casser les intégrations]"],
      liens: [],
    },
    capaciteDebloquee: "Une plateforme ouverte et durcie.",
    // Règle dataroom : la brique apparaît, sans aucun contenu technique.
    briefInvestisseur: {
      quoi: "Un programme de renforcement de la sécurité de la plateforme.",
      pourquoi: "L'ouverture aux partenaires et aux agents s'accompagne d'une sécurité vérifiée par des tiers.",
      capacite: "Une plateforme ouverte et durcie.",
    },
    visibleDataroom: true,
  },

  // ── Rails et custody ─────────────────────────────────────────────────────
  {
    id: "stellar-soroban", slug: "stellar-soroban", titre: "Stellar Soroban", couche: "rails", moteur: "transverse", ordre: 1,
    miseEnAvant: true,
    livreEn: "fondations", owner: null, dependances: [], note: "Contrats de tokenisation", aConfirmer: false,
    briefTheorique: draft(
      "Le rail d'émission actuel : les obligations Minah sont tokenisées par des contrats Soroban sur Stellar.",
      "Contrats de tokenisation en production, émission et règlement des obligations.",
      { criteresDone: DONE, risques: [] }
    ),
    capaciteDebloquee: "Les obligations existent sous forme de tokens.",
    briefInvestisseur: {
      quoi: "Les contrats de tokenisation des obligations, sur Stellar.",
      pourquoi: "Chaque obligation souscrite existe sous forme de token, traçable et transférable.",
      capacite: "Obligations tokenisées.",
      partenaire: "Stellar",
    },
    partenaires: ["stellar"],
    visibleDataroom: true,
  },
  {
    id: "starknet", slug: "starknet", titre: "Starknet", couche: "rails", moteur: "transverse", ordre: 2,
    livreEn: "fondations", owner: null, dependances: [], note: "À confirmer", aConfirmer: true,
    briefTheorique: draft(
      "[Périmètre réel de Starknet à confirmer avec Erwan : rail d'émission secondaire ? expérimentation ?]",
      "[à préciser]",
    ),
    capaciteDebloquee: "Un second rail disponible.",
    briefInvestisseur: {
      quoi: "Un second rail blockchain disponible pour les stratégies Minah.",
      pourquoi: "Minah choisit le rail le plus adapté à chaque stratégie.",
      capacite: "Choix du rail par stratégie.",
    },
    partenaires: ["starknet"],
    visibleDataroom: true,
  },
  {
    id: "fireblocks", slug: "fireblocks", titre: "Fireblocks custody et KYT", couche: "rails", moteur: "transverse", ordre: 3,
    miseEnAvant: true,
    livreEn: "fondations", owner: null, dependances: [], note: null, aConfirmer: false,
    briefTheorique: draft(
      "Une custody institutionnelle et un contrôle des transactions (KYT) : les actifs ne sont pas gardés sur un wallet maison.",
      "Custody Fireblocks en production, KYT sur les flux.",
      { criteresDone: DONE, risques: [] }
    ),
    capaciteDebloquee: "Custody institutionnelle des actifs.",
    briefInvestisseur: {
      quoi: "La garde des actifs et le contrôle des transactions, opérés avec Fireblocks.",
      pourquoi: "Les actifs sont gardés par une infrastructure institutionnelle, avec un contrôle des flux.",
      capacite: "Custody institutionnelle.",
      partenaire: "Fireblocks",
    },
    partenaires: ["fireblocks"],
    visibleDataroom: true,
  },
  {
    id: "canton-network", slug: "canton-network", titre: "Canton Network", couche: "rails", moteur: "transverse", ordre: 4,
    livreEn: "api_v1", statutsForces: { b2b: "prevu" }, owner: "Erwan", dependances: ["multi-providers-web3"], note: "À confirmer", aConfirmer: true,
    briefTheorique: draft(
      "Brancher Canton Network comme rail institutionnel supplémentaire, derrière l'abstraction multi-providers.",
      "Provider Canton dans l'API, émission et règlement d'une stratégie de bout en bout.",
      { risques: ["[accès au réseau et accompagnement Canton]", "[calendrier à confirmer]"] }
    ),
    capaciteDebloquee: "Un rail institutionnel de plus.",
    briefInvestisseur: {
      quoi: "Un rail institutionnel supplémentaire branché sur l'API Minah.",
      pourquoi: "Les stratégies peuvent s'appuyer sur un réseau conçu pour les institutions financières.",
      capacite: "Un rail institutionnel de plus.",
    },
    partenaires: ["canton"],
    visibleDataroom: true,
  },
  {
    id: "cross-chain-stellar", slug: "cross-chain-stellar", titre: "Cross-chain via Stellar", couche: "rails", moteur: "transverse", ordre: 5,
    livreEn: "api_v1", owner: "Erwan", dependances: ["multi-providers-web3"], note: "Nouveau (v2)", aConfirmer: true,
    briefTheorique: draft(
      "Relier les rails entre eux en s'appuyant sur Stellar comme pivot, pour qu'une position émise sur une chaîne puisse être réglée ou suivie depuis une autre.",
      "[Mécanisme cross-chain retenu, chaînes couvertes, règlement, suivi dans l'espace Web3 de l'admin]",
    ),
    capaciteDebloquee: "Les rails communiquent entre eux.",
    briefInvestisseur: {
      quoi: "Une passerelle entre les rails, avec Stellar comme pivot.",
      pourquoi: "Une position n'est plus enfermée sur la chaîne où elle a été émise.",
      capacite: "Interopérabilité entre rails.",
    },
    partenaires: ["stellar"],
    visibleDataroom: true,
  },
];

export const ROADMAP_OBJECTIVES: Objective[] = RAW.map(build);

/** Tâches FICTIVES pour peupler les swimlanes (phase A). */
export const ROADMAP_TASKS: Task[] = [
  // Sereel — découpage de l'exemple du brief
  { id: "t-sereel-1", objectifId: "integration-sereel", titre: "Cadrage technique avec Sereel", couloir: "partenaires", dateDebut: "2026-09-15", dateFin: "2026-09-22", statut: "fait", owner: "Erwan", dependDe: null },
  { id: "t-sereel-2", objectifId: "integration-sereel", titre: "Endpoints et auth partenaire", couloir: "backend", dateDebut: "2026-09-22", dateFin: "2026-10-06", statut: "en_cours", owner: "Erwan", dependDe: "t-sereel-1" },
  { id: "t-sereel-3", objectifId: "integration-sereel", titre: "Revue des accès et flux KYC", couloir: "securite", dateDebut: "2026-10-01", dateFin: "2026-10-08", statut: "a_faire", owner: "Erwan", dependDe: "t-sereel-2" },
  { id: "t-sereel-4", objectifId: "integration-sereel", titre: "Suivi des souscriptions Sereel dans l'admin", couloir: "front", dateDebut: "2026-10-06", dateFin: "2026-10-13", statut: "a_faire", owner: null, dependDe: "t-sereel-2" },
  { id: "t-sereel-5", objectifId: "integration-sereel", titre: "Tests de bout en bout et mise en production", couloir: "partenaires", dateDebut: "2026-10-10", dateFin: "2026-10-15", statut: "a_faire", owner: "Erwan", dependDe: "t-sereel-3" },
  // API v1
  { id: "t-api-1", objectifId: "api-v1", titre: "Spécification des routes par usage (interne, agents, externe)", couloir: "backend", dateDebut: "2026-10-01", dateFin: "2026-10-15", statut: "en_cours", owner: "Erwan", dependDe: null },
  { id: "t-api-2", objectifId: "api-v1", titre: "Niveaux d'accès et auth partenaire", couloir: "securite", dateDebut: "2026-10-10", dateFin: "2026-10-25", statut: "a_faire", owner: "Erwan", dependDe: "t-api-1" },
  { id: "t-api-3", objectifId: "api-v1", titre: "Base de mocks (providers, protocoles, investisseurs)", couloir: "backend", dateDebut: "2026-11-01", dateFin: "2026-11-20", statut: "a_faire", owner: "Erwan", dependDe: "t-api-1" },
  // Multi-providers
  { id: "t-mp-1", objectifId: "multi-providers-web3", titre: "Abstraction provider dans l'API", couloir: "web3", dateDebut: "2026-10-15", dateFin: "2026-11-15", statut: "en_cours", owner: "Erwan", dependDe: null },
  { id: "t-mp-2", objectifId: "multi-providers-web3", titre: "Second provider branché et testé", couloir: "web3", dateDebut: "2026-11-15", dateFin: "2026-12-20", statut: "a_faire", owner: "Erwan", dependDe: "t-mp-1" },
  // Espace Web3 intégré à l'admin
  { id: "t-adm-1", objectifId: "web3-admin", titre: "Écrans on-chain dans l'admin via l'API", couloir: "front", dateDebut: "2026-11-01", dateFin: "2026-12-15", statut: "a_faire", owner: "Erwan", dependDe: null },
  { id: "t-adm-2", objectifId: "web3-admin", titre: "Tests d'intégration et de simulation", couloir: "backend", dateDebut: "2026-11-15", dateFin: "2026-12-31", statut: "a_faire", owner: "Erwan", dependDe: "t-adm-1" },
];

