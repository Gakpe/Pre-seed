// Fiches qui ont leur propre page dans l'application. Le `docsend_url` resté en
// base est alors ignoré, à la fois par la liste de la data room et par la fiche
// elle-même : un document hébergé ailleurs échappe au suivi de lecture.
// Supprimer `docsend_url` sur ces slugs rendrait ce garde-fou inutile.
//
// Module à part, sans dépendance serveur : la liste de la data room est un
// composant client et ne peut pas tirer `lib/dataroom`, qui lit les cookies.
export const OWN_PAGE_SLUGS = new Set(["term-sheet-kupanda"]);
