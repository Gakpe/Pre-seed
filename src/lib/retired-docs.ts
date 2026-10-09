// Fiches retirées ou mises en pause dans la data room, pour tout le monde. La
// ligne reste dans la table `documents` (rien n'est perdu : retirer le slug
// d'ici la rétablit).
//
// Module sans dépendance serveur, comme own-pages : l'admin et la data room
// le lisent tous deux.

// Retirées : plus listées nulle part, ni ouvrables par leur adresse.
export const RETIRED_SLUGS = new Set([
  // 08/10/2026 (Julien) : le deck risk Kupanda et l'architecture de risque
  // couvrent le sujet.
  "scenarios-risques",
  // 08/10/2026 (Julien).
  "contrat-cadre-zambie",
  "pacte-associes",
  // 09/10/2026 (Coralie) : fusionnée dans la roadmap écosystème, qui devient
  // la seule fiche de la section. Son composant a été supprimé du code ; la
  // ligne reste en base.
  "go-to-market",
]);

// En pause : toujours listées, mais grisées et non cliquables, avec la mention
// « en cours de mise à jour ». Leur page n'est ouverte qu'aux admins (hors
// démo), le temps de les retravailler.
export const UNAVAILABLE_SLUGS = new Set([
  // 09/10/2026 (Coralie) : la fusion go-to-market → roadmap écosystème est
  // dans le code, la fiche reste cachée le temps de la valider.
  "roadmap-ecosysteme",
  // 08/10/2026 (Julien).
  "cap-table",
]);
