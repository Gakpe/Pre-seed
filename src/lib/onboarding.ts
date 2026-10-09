import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeEmail } from "@/lib/admin";
import { docFields, type Locale } from "@/lib/i18n";
import { OWN_PAGE_SLUGS } from "@/lib/own-pages";
import type { DocumentRow } from "@/lib/types";

// Onboarding des investisseurs : l'accueil de la data room, en tête de
// /investors/home.
//
// Par défaut, la même visite guidée pour tous : un mot d'accueil, « Pourquoi
// Minah ? », puis le rendez-vous. Une ligne de la table `onboardings` le remplace
// pour une personne précise : un message à son intention, ses fiches mises en
// avant, et des fiches ouvertes au-dessus de son niveau. L'ouverture est
// appliquée en base (RLS, document_unlocked_for_me) ; ce module ne fait que
// lire et écrire la table, avec la clé service.

export type Onboarding = {
  email: string;
  message_fr: string | null;
  message_en: string | null;
  focus_slugs: string[];
  unlocked_slugs: string[];
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type OnboardingInput = {
  email: string;
  message_fr: string | null;
  message_en: string | null;
  focus_slugs: string[];
  unlocked_slugs: string[];
  note: string | null;
};

// L'accueil par défaut met en lumière « Pourquoi Minah ? » (voir welcome.tsx).
export const DEFAULT_FOCUS = ["pourquoi-minah"];

export async function getOnboarding(email: string): Promise<Onboarding | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const { data } = await createAdminClient()
    .from("onboardings")
    .select("*")
    .eq("email", normalizeEmail(email))
    .maybeSingle();
  return (data as Onboarding | null) ?? null;
}

// Vrai si la personne a déjà parcouru la data room : une fiche ouverte ou un
// DocSend cliqué. La visite guidée par défaut ne se lance qu'à la première
// vraie connexion, quand ce n'est pas le cas. Les vues de /investors/home ne
// comptent pas : un compte en attente de validation y voit l'écran d'attente.
// Dans le doute (erreur de lecture), on considère la data room parcourue :
// mieux vaut une visite manquée qu'imposée à un habitué.
export async function hasExploredDataRoom(investorId: string): Promise<boolean> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return true;
  const { count, error } = await createAdminClient()
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("investor_id", investorId)
    .or("type.eq.docsend_click,path.like./investors/docs/%");
  if (error) return true;
  return (count ?? 0) > 0;
}

export async function listOnboardings(): Promise<Onboarding[]> {
  const { data } = await createAdminClient()
    .from("onboardings")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data as Onboarding[] | null) ?? [];
}

export async function saveOnboarding(input: OnboardingInput): Promise<void> {
  const { error } = await createAdminClient()
    .from("onboardings")
    .upsert(
      { ...input, email: normalizeEmail(input.email), updated_at: new Date().toISOString() },
      { onConflict: "email" }
    );
  if (error) throw new Error(error.message);
}

export async function deleteOnboarding(email: string): Promise<void> {
  const { error } = await createAdminClient()
    .from("onboardings")
    .delete()
    .eq("email", normalizeEmail(email));
  if (error) throw new Error(error.message);
}

// Message à afficher : l'anglais retombe sur le français.
export function onboardingMessage(o: Onboarding | null, locale: Locale): string | null {
  if (!o) return null;
  const text = locale === "en" ? o.message_en || o.message_fr : o.message_fr;
  return text?.trim() || null;
}

export type WelcomeStep = {
  slug: string;
  title: string;
  /** Catégorie (française, identifiant stable) : la visite regroupe les fiches
   *  mises en avant consécutives d'une même catégorie sur une seule étape. */
  category: string;
  /** Lien DocSend (nouvel onglet, tracé) ou page interne. */
  href: string;
  external: boolean;
  /** Fiche ouverte à cette personne au-dessus de son niveau. */
  openedForYou: boolean;
};

// Les étapes de l'accueil, à partir des fiches que la personne voit déjà (la
// RLS a filtré `docs`) : une fiche mise en avant mais invisible pour elle est
// simplement omise, l'accueil ne promet rien qu'il n'ouvre pas.
export function welcomeSteps(
  docs: DocumentRow[],
  onboarding: Onboarding | null,
  level2Unlocked: boolean,
  locale: Locale
): WelcomeStep[] {
  const slugs = onboarding?.focus_slugs.length ? onboarding.focus_slugs : DEFAULT_FOCUS;
  const unlocked = new Set(onboarding?.unlocked_slugs ?? []);
  return slugs.flatMap((slug) => {
    const doc = docs.find((d) => d.slug === slug);
    if (!doc) return [];
    const fields = docFields(doc, locale);
    const docsend = OWN_PAGE_SLUGS.has(doc.slug) ? null : fields.docsendUrl;
    return [
      {
        slug,
        title: fields.title,
        category: doc.category,
        href: docsend ?? `/investors/docs/${slug}`,
        external: Boolean(docsend),
        openedForYou: doc.access_level > 1 && !level2Unlocked && unlocked.has(slug),
      },
    ];
  });
}
