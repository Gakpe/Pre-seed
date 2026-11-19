import { createAdminClient } from "@/lib/supabase/admin";
import type { Bi } from "@/lib/kupanda-dd";

// Les documents de la fiche « Due diligence Kupanda » : titres, niveaux et
// liens DocSend (liste de Coralie, 03/11/2026, la même que la dataroom Kupanda
// du front).
//
// Rien de tout cela n'est dans le code : le dépôt GitHub est public, et un lien
// de niveau 2 ne doit jamais partir vers une personne de niveau 1. La liste vit
// dans app_settings (clé `kupanda_documents`), lisible avec la seule clé
// service ; cette fonction la lit côté serveur et retire les liens que la
// personne n'a pas le droit d'ouvrir avant de passer la liste à la page.
//
// Forme de la valeur en base, un tableau dans l'ordre d'affichage :
//   { id, level: 1 | 2, title: { fr, en }, detail?: { fr, en },
//     group?: { fr, en }, links: { fr?: url, en?: url } }
//  - `id` : celui que citent les panneaux (kupanda-dd.ts, `docs`) ;
//  - `group` : intitulé commun à plusieurs pièces d'un même document, qui se
//    suivent dans la liste ; `title` est alors le nom de la pièce ;
//  - `detail` : précision sous le titre (l'assureur, la référence) ;
//  - `links` : un lien par langue du document. Sans lien, le document
//    s'affiche « Lien à venir ».
// Pour ajouter un lien ou un document, on remplace la valeur de la clé : la
// page suit, sans déploiement.

export const KUPANDA_DOCS_SETTING_KEY = "kupanda_documents";

type Lang = "fr" | "en";

export type KupandaDoc = {
  id: string;
  level: 1 | 2;
  title: Bi;
  detail?: Bi;
  group?: Bi;
  /** `locked` : niveau 2 pour une personne de niveau 1, les liens sont retirés. */
  state: "open" | "soon" | "locked";
  links: Partial<Record<Lang, string>>;
};

const isBi = (v: unknown): v is Bi =>
  typeof v === "object" && v !== null && typeof (v as Bi).fr === "string" && typeof (v as Bi).en === "string";

// Seuls des liens DocSend sortent d'ici : la valeur en base ne peut pas faire
// pointer la page ailleurs.
const DOCSEND = /^https:\/\/docsend\.com\/view\/[a-z0-9]+$/i;

function parse(value: unknown): Omit<KupandaDoc, "state">[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw) => {
    if (typeof raw !== "object" || raw === null) return [];
    const d = raw as Record<string, unknown>;
    if (typeof d.id !== "string" || (d.level !== 1 && d.level !== 2) || !isBi(d.title)) return [];
    const stored = (typeof d.links === "object" && d.links !== null ? d.links : {}) as Record<string, unknown>;
    const links: Partial<Record<Lang, string>> = {};
    for (const lang of ["fr", "en"] as const) {
      const url = stored[lang];
      if (typeof url === "string" && DOCSEND.test(url)) links[lang] = url;
    }
    return [
      {
        id: d.id,
        level: d.level,
        title: d.title,
        ...(isBi(d.detail) ? { detail: d.detail } : {}),
        ...(isBi(d.group) ? { group: d.group } : {}),
        links,
      },
    ];
  });
}

/**
 * Les documents tels que la personne peut les voir. `level2` : elle a le
 * niveau 2 de la data room (ou la session démo le rejoue).
 */
export async function getKupandaDocuments(level2: boolean): Promise<KupandaDoc[]> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  const { data } = await createAdminClient()
    .from("app_settings")
    .select("value")
    .eq("key", KUPANDA_DOCS_SETTING_KEY)
    .maybeSingle();
  return parse(data?.value).map((doc) => {
    if (doc.level === 2 && !level2) return { ...doc, state: "locked" as const, links: {} };
    const hasLink = Boolean(doc.links.fr || doc.links.en);
    return { ...doc, state: hasLink ? ("open" as const) : ("soon" as const) };
  });
}
