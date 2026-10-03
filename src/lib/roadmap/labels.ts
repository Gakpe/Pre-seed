// Porté le 02/10/2026 depuis minah_interface (components/roadmap/labels.ts).
// Libellés passés aux composants roadmap (fournis par les locales de la page appelante).
import type { Layer, Phase, Status, Lane, TaskStatus, Moteur, Health } from "@/lib/roadmap/types";

export interface RoadmapLabels {
  phases: Record<Phase, string>;
  layers: Record<Layer, string>;
  statuses: Record<Status, string>;
  lanes: Record<Lane, string>;
  taskStatuses: Record<TaskStatus, string>;
  moteurs: Record<Moteur, string>;
  capacityLabel: string;
  volumeLabel: string;
  apiLabel: string;
  experienceLabel: string;
  health: Record<Health, string>;
  proofs: { investors: string; subscribed: string; strategies: string };
  /** Bascule « cette période » / « vue d'ensemble ». */
  viewPeriod: string;
  viewOverview: string;
  deliveredHere: string;
  nothingDelivered: string;
}

export const HEALTH_DOT: Record<Health, string> = {
  on_track: "#6E8A72",
  at_risk: "#B56A28",
  off_track: "#8A2620",
};

// Code couleur des briques, le même partout (briques, carte, légende) :
//   intégré          vert, plein
//   en développement orange, plein
//   en projet        gris, bord en pointillé
// Contrastes texte / fond calculés : 7,9 (vert), 7,6 (orange), 6,1 (gris).
export const STATUS_STYLE: Record<Status, { bg: string; border: string; color: string; dot: string }> = {
  livre: { bg: "#DCEBDD", border: "#9FC4A5", color: "#1F3F27", dot: "#2F7A43" },
  en_cours: { bg: "#FBE3CF", border: "#EDB27B", color: "#6B3A0E", dot: "#E27B30" },
  prevu: { bg: "#F5F3EE", border: "#CFC8B9", color: "#5F574E", dot: "#B5AC9D" },
};

export const TASK_STATUS_DOT: Record<TaskStatus, string> = {
  fait: "#6E8A72",
  en_cours: "#E27B30",
  a_faire: "#C9C1B3",
};
