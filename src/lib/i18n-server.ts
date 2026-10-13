import { cache } from "react";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDemoSession } from "@/lib/demo";

// Langue de la page. Dans l'ordre :
//   1. le choix fait par la personne sur le site (cookie minah_locale, posé
//      par le sélecteur FR / EN) : il garde toujours la main ;
//   2. la langue par défaut de son adresse (table investor_locales, fixée par
//      l'équipe ou par Yao d'après les échanges mail). En démo, celle de
//      l'adresse dont on rejoue l'onboarding ;
//   3. le français.
// Mis en cache par requête : la page et le layout l'appellent tous deux.
export const getLocale = cache(async (): Promise<Locale> => {
  const chosen = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (chosen === "en" || chosen === "fr") return chosen;
  return (await defaultLocaleForVisitor()) ?? "fr";
});

async function defaultLocaleForVisitor(): Promise<Locale | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const demo = await getDemoSession();
    let email: string | null | undefined = demo?.onboarding;
    if (!demo) {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      email = data.user?.email;
    }
    if (!email) return null;
    const { data } = await createAdminClient()
      .from("investor_locales")
      .select("locale")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();
    return data?.locale === "en" || data?.locale === "fr" ? data.locale : null;
  } catch {
    // Une langue introuvable ne doit jamais casser la page.
    return null;
  }
}
