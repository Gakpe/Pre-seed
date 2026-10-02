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

export const STATUS_STYLE: Record<Status, { bg: string; border: string; color: string; dot: string }> = {
  livre: { bg: "#E6EEE6", border: "#C9DACB", color: "#2F4F36", dot: "#6E8A72" },
  en_cours: { bg: "#FCE6D3", border: "#F0C9A0", color: "#7A4514", dot: "#E27B30" },
  prevu: { bg: "#FFFFFE", border: "#E6E1D4", color: "#A39A8E", dot: "#C9C1B3" },
};

export const TASK_STATUS_DOT: Record<TaskStatus, string> = {
  fait: "#6E8A72",
  en_cours: "#E27B30",
  a_faire: "#C9C1B3",
};
