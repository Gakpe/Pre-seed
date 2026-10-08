// Fiches retirées de la data room, pour tout le monde. La ligne reste dans la
// table `documents` (rien n'est perdu : retirer le slug d'ici la rétablit),
// mais la fiche n'est plus listée nulle part ni ouvrable par son adresse.
//
// Module sans dépendance serveur, comme own-pages : l'admin et la data room
// le lisent tous deux.
export const RETIRED_SLUGS = new Set([
  // Retirée le 08/10/2026 (Julien) : le deck risk Kupanda et l'architecture
  // de risque couvrent le sujet.
  "scenarios-risques",
]);
