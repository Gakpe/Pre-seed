// Porté le 02/10/2026 depuis minah_interface (branche Gakpe/strategy-detail-dashboard,
// paquet .context/vision-technique-handoff). Source unique partagée avec l'admin Minah :
// toute modification de fond se fait des deux côtés.
// src/lib/roadmap/types.ts
// Modèle de la roadmap technique (phase A : source unique en code, Supabase en phase B).
// Règle d'or : un objectif est saisi une fois, avec des champs internes et des champs
// publics ; la vue investisseurs ne lit que les champs publics (voir public.ts).
//
// Structure v2 (brief du 1er oct. 2026) : trois moteurs de volume (dette privée, dette
// souveraine, liquidité crypto), une couche Liquidité au-dessus, une infra commune dessous.

export type Layer = "produits" | "api" | "admin" | "rails" | "liquidite";
/** Périodes datées de la roadmap, du passé à la vision. Durées différentes (voir PHASE_WINDOWS). */
export type Phase = "fondations" | "b2c" | "b2b" | "api_v1" | "api_v2" | "vision";
export type Status = "prevu" | "en_cours" | "livre";
export type Moteur = "dette_privee" | "dette_souveraine" | "liquidite_crypto" | "transverse";
export type Lane = "web3" | "backend" | "front" | "securite" | "partenaires";
export type TaskStatus = "a_faire" | "en_cours" | "fait";
/** Santé d'un objectif, posée à la main lors du point technique (modèle Linear). */
export type Health = "on_track" | "at_risk" | "off_track";

/** Ordre d'affichage des lignes du visuel (haut → bas). La liquidité ferme le tableau. */
export const LAYERS: Layer[] = ["produits", "api", "admin", "rails", "liquidite"];
/** Les périodes, dans l'ordre chronologique. */
export const PHASES: Phase[] = ["fondations", "b2c", "b2b", "api_v1", "api_v2", "vision"];
/** Ordre des groupes de moteurs dans « Produits et moteurs ». */
export const MOTEURS: Moteur[] = ["dette_privee", "dette_souveraine", "liquidite_crypto", "transverse"];
/** Couloirs fixes des swimlanes. */
export const LANES: Lane[] = ["web3", "backend", "front", "securite", "partenaires"];

/**
 * Dates de chaque période — ce sont elles qui donnent la largeur des colonnes du visuel,
 * les dates provisoires des objectifs et la timeline. À ajuster ici, en un seul endroit.
 */
export const PHASE_WINDOWS: Record<Phase, { start: string; end: string }> = {
  fondations: { start: "2025-01-01", end: "2025-06-30" },
  b2c: { start: "2025-07-01", end: "2026-01-31" },
  b2b: { start: "2026-02-01", end: "2026-10-31" },
  api_v1: { start: "2026-11-01", end: "2027-03-31" },
  api_v2: { start: "2027-04-01", end: "2027-12-31" },
  vision: { start: "2028-01-01", end: "2028-12-31" },
};

export const TIMELINE_START = "2025-01-01";
export const TIMELINE_END = "2028-12-31";
export const TODAY = "2026-10-01";

/** Période qui contient la date du jour (la dernière dont le début est passé). */
export function currentPhase(): Phase {
  return [...PHASES].reverse().find((p) => PHASE_WINDOWS[p].start <= TODAY) ?? PHASES[0];
}

/**
 * Règle de statut par période : livré à partir de la période de livraison, en cours sur
 * celle qui la précède, prévu avant. `forces` permet de forcer une période à la main.
 */
export function statusesFor(livreEn: Phase, forces?: Partial<Record<Phase, Status>>): Record<Phase, Status> {
  const target = PHASES.indexOf(livreEn);
  const out = {} as Record<Phase, Status>;
  PHASES.forEach((p, i) => {
    out[p] = i >= target ? "livre" : i === target - 1 ? "en_cours" : "prevu";
  });
  return { ...out, ...(forces || {}) };
}

export interface TeamBrief {
  pourquoi: string;
  perimetre: string;
  horsPerimetre: string;
  comment: string;
  autonomie: string[];
  criteresDone: Array<{ label: string; fait: boolean }>;
  risques: string[];
  liens: Array<{ label: string; url: string }>;
}

export interface InvestorBrief {
  quoi: string;
  pourquoi: string;
  capacite: string;
  partenaire?: string;
}

export interface Objective {
  id: string;
  slug: string;
  titre: string;
  couche: Layer;
  moteur: Moteur;
  ordre: number;
  /** Phase à partir de laquelle l'objectif est livré. */
  livreEn: Phase;
  /** Statut à chaque cran, dérivé de `livreEn` (+ forçages manuels). */
  statutsParPhase: Record<Phase, Status>;
  // ── interne ──
  statutsForces?: Partial<Record<Phase, Status>>;
  sante: Health | null;
  derniereMiseAJour: { date: string; auteur: string; texte: string } | null;
  dateDebut: string | null;
  dateFinCible: string | null;
  datesProvisoires: boolean;
  owner: string | null;
  dependances: string[];
  note: string | null;
  aConfirmer: boolean;
  briefTheorique: TeamBrief;
  derniereMaj: string;
  majPar: string;
  // ── public ──
  capaciteDebloquee: string;
  briefInvestisseur: InvestorBrief;
  /**
   * Tiers sur lesquels l'objectif s'appuie, par identifiant `PARTNERS` (voir partners.ts).
   * La carte les affiche avec logo, rôle en une ligne et lien vers leur site. Les
   * partenaires non signés sont filtrés par la projection publique.
   */
  partenaires?: string[];
  visibleDataroom: boolean;
  /**
   * Héritage du repli dataroom. Plus lu par le visuel : le tableau affiche désormais
   * toutes les briques, tout le temps. Conservé pour une éventuelle mise en avant future.
   */
  miseEnAvant: boolean;
}

export interface Task {
  id: string;
  objectifId: string;
  titre: string;
  couloir: Lane;
  dateDebut: string;
  dateFin: string;
  statut: TaskStatus;
  owner: string | null;
  dependDe: string | null;
}

/** Bandeau sous le visuel : capacité débloquée, volume associé, et ce que l'API permet (v1, v2). */
export interface PhaseCapacity {
  capacite: string;
  volume: string;
  api?: string;
}

/** Chiffres réels d'une période passée, calculés depuis la base (jamais saisis). */
export interface PhaseProof {
  investisseurs: number;
  souscrit: number;
  strategies: number;
}

export interface RoadmapMeta {
  vision: string;
  /** « Pourquoi c'est défendable », période par période : sur le passé des faits acquis,
   *  sur le futur ce que la période débloque. Suit le curseur de la frise. */
  defendableParPhase: Record<Phase, string[]>;
  /** Date de la dernière modification d'un objectif (dérivée). */
  misAJourLe: string;
  /** « Ce qu'on a appris » — court texte par période passée, optionnel. */
  apprentissagesParPhase: Partial<Record<Phase, string>>;
  /**
   * Preuve rédigée à la main, affichée à la place des chiffres calculés.
   * La base donne un compte exact (`PhaseProof`) ; côté investisseurs on préfère souvent
   * une formulation moins précise — « Premiers souscripteurs », « moins de 40 investisseurs ».
   * Renseigner une période ici masque ses chiffres dans la vue qui reçoit ce champ ;
   * la vue équipe, elle, continue de lire `preuves`. Absent = on affiche les chiffres.
   */
  preuveLibreParPhase: Partial<Record<Phase, string>>;
  /** Première ligne du visuel : l'expérience utilisateur de chaque période, en quelques mots. */
  experienceParPhase: Record<Phase, string>;
  capacitesParPhase: Record<Phase, PhaseCapacity>;
  publieLe: string | null;
}

/** Projection publique d'un objectif — strictement les champs « visible investisseurs ». */
export interface PublicObjective {
  id: string;
  slug: string;
  titre: string;
  couche: Layer;
  moteur: Moteur;
  ordre: number;
  livreEn: Phase;
  miseEnAvant: boolean;
  statutsParPhase: Record<Phase, Status>;
  capaciteDebloquee: string;
  briefInvestisseur: InvestorBrief;
  /** Identifiants `PARTNERS`, déjà filtrés des partenaires non signés. */
  partenaires: string[];
}

export interface PublicRoadmap {
  meta: {
    vision: string;
    defendableParPhase: Record<Phase, string[]>;
    misAJourLe: string;
    experienceParPhase: Record<Phase, string>;
    capacitesParPhase: Record<Phase, PhaseCapacity>;
    apprentissagesParPhase: Partial<Record<Phase, string>>;
    preuveLibreParPhase: Partial<Record<Phase, string>>;
  };
  /** Chiffres réels par période passée ; null si la base n'a pas pu être lue. */
  preuves: Partial<Record<Phase, PhaseProof>> | null;
  objectifs: PublicObjective[];
}

export interface TeamRoadmap {
  meta: RoadmapMeta;
  preuves: Partial<Record<Phase, PhaseProof>> | null;
  objectifs: Objective[];
  taches: Task[];
}
