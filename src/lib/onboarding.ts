import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeEmail } from "@/lib/admin";
import { docFields, type Locale } from "@/lib/i18n";
import { OWN_PAGE_SLUGS } from "@/lib/own-pages";
import type { DocumentRow } from "@/lib/types";

// Onboarding des investisseurs : l'accueil de la data room, en tête de
// /investors/home.
//
// Par défaut, le même pour tous : le deck, l'équipe, puis la manifestation
// d'intérêt qui ouvre le reste. Une ligne de la table `onboardings` le remplace
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

// L'accueil par défaut : deux fiches, puis l'étape d'intérêt (toujours
// ajoutée en dernier par l'accueil, sauf niveau 2 déjà ouvert).
export const DEFAULT_FOCUS = ["deck-preseed", "equipe"];

// Une ligne de présentation par fiche mise en avant. Une fiche absente d'ici
// s'affiche avec sa seule catégorie.
export const FOCUS_BLURBS: Record<string, Record<Locale, string>> = {
  "deck-preseed": {
    fr: "Le projet en quelques minutes : le marché, le produit, la levée.",
    en: "The project in a few minutes: the market, the product, the round.",
  },
  equipe: {
    fr: "Les trois fondateurs, leurs parcours et ce que chacun apporte.",
    en: "The three founders, their backgrounds and what each one brings.",
  },
  "vision-technique": {
    fr: "Ce qui tourne en production, ce qui est en développement, et la vision de la plateforme.",
    en: "What runs in production, what is being built, and where the platform is heading.",
  },
  "pourquoi-minah": {
    fr: "Pourquoi Minah, et pourquoi maintenant.",
    en: "Why Minah, and why now.",
  },
  "business-model": {
    fr: "Comment Minah gagne de l'argent, flux par flux.",
    en: "How Minah makes money, flow by flow.",
  },
  "track-record": {
    fr: "Ce que l'équipe a déjà déployé, et avec quels résultats.",
    en: "What the team has already deployed, and with what results.",
  },
  "go-to-market-apercu": {
    fr: "La machine à réseau qui amène le capital et les deals.",
    en: "The relationship machine that brings in capital and deals.",
  },
  "la-levee": {
    fr: "Le tour en cours : montant, ticket, calendrier.",
    en: "The current round: size, ticket, timeline.",
  },
};

export async function getOnboarding(email: string): Promise<Onboarding | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const { data } = await createAdminClient()
    .from("onboardings")
    .select("*")
    .eq("email", normalizeEmail(email))
    .maybeSingle();
  return (data as Onboarding | null) ?? null;
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
  blurb: string;
  /** Lien DocSend (nouvel onglet, tracé) ou page interne. */
  href: string;
  external: boolean;
  /** Fiche ouverte à cette personne au-dessus de son niveau. */
  openedForYou: boolean;
};

export type InterestState = "open" | "recorded" | "unlocked";

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
        blurb: FOCUS_BLURBS[slug]?.[locale] ?? fields.category,
        href: docsend ?? `/investors/docs/${slug}`,
        external: Boolean(docsend),
        openedForYou: doc.access_level > 1 && !level2Unlocked && unlocked.has(slug),
      },
    ];
  });
}
