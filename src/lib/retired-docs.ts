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
// « en cours de mise à jour ». Leur page n'est ouverte qu'aux admins, le temps
// de les retravailler. Aucune fiche en pause aujourd'hui : la cap table, en
// pause du 08/10 au 25/11/2026, a été rouverte au niveau 2 (Julien).
export const UNAVAILABLE_SLUGS = new Set<string>([]);

// En pause pour les investisseurs, mais ouvertes dans une session démo : la
// fiche est prête, l'équipe la montre et la relit avant de l'ouvrir. La démo
// la liste comme un brouillon (« visible en démo »), les investisseurs la
// voient toujours grisée.
export const DEMO_OPEN_SLUGS = new Set<string>([]);

// Brouillons : fiches en cours de réalisation, définies ici et pas encore en
// base. Invisibles pour les investisseurs ; une session démo (ouverte par un
// admin) les liste et les ouvre, en local comme en ligne. Exception : un
// onboarding peut ouvrir un brouillon à une personne précise (son slug dans
// `unlocked_slugs`), qui le voit alors marqué « rien que pour vous ». Pour publier : créer
// la ligne dans `documents` (mêmes slug, titres, catégorie, niveau), puis
// retirer l'entrée d'ici.
export type DraftDoc = {
  slug: string;
  title: string;
  title_en: string;
  category: string;
  category_en: string;
  access_level: number;
  sort_order: number;
};

export const DRAFT_DOCS: DraftDoc[] = [
  // 10/10/2026 (Julien) : business plan, revenus, cash et runway.
  {
    slug: "business-plan",
    title: "Revenus, cash et runway",
    title_en: "Revenue, cash and runway",
    category: "Business plan",
    category_en: "Business plan",
    access_level: 2,
    sort_order: 79,
  },
  // 12/10/2026 (Julien) : l'impact, performance financière et extra-financière.
  {
    slug: "impact",
    title: "Performance financière, performance d'impact",
    title_en: "Financial performance, impact performance",
    category: "Impact",
    category_en: "Impact",
    access_level: 1,
    sort_order: 52,
  },
  // La due diligence Kupanda (« Virtual Strategic Dataroom ») a été publiée le
  // 19/11/2026 (Julien) : sa ligne est en base, au niveau 2.
];

export const DRAFT_SLUGS = new Set(DRAFT_DOCS.map((d) => d.slug));

/** Un brouillon sous la forme d'une ligne de `documents`. */
export function draftRow(d: DraftDoc) {
  return {
    ...d,
    docsend_url: null,
    docsend_url_en: null,
    visible_to_pending: false,
    content: null,
    content_en: null,
  };
}
