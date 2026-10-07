import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import { RequestAccessForm } from "./request-access-form";
import { DemoStartForm } from "./demo-start-form";
import { getAdminEmail } from "@/lib/admin";
import { getDemoSession } from "@/lib/demo";
import { listOnboardings } from "@/lib/onboarding";

export async function generateMetadata() {
  return { title: t(await getLocale(), "meta.title") };
}

export default async function InvestorsPage({
  searchParams,
}: PageProps<"/investors">) {
  const locale = await getLocale();
  const params = await searchParams;
  const ref = typeof params.ref === "string" ? params.ref : null;
  const error = typeof params.error === "string" ? params.error : null;
  const rawNext = typeof params.next === "string" ? params.next : null;
  const next = rawNext?.startsWith("/") ? rawNext : null;

  // Démo déjà ouverte : on entre directement, comme un investisseur connecté.
  if (await getDemoSession()) redirect("/investors/home");
  // ?demo=1 depuis l'espace admin : formulaire sans code, réservé aux admins.
  const demo = params.demo === "1" && (await getAdminEmail()) !== null;

  if (!demo && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(next ?? "/investors/home");

    // Lien personnalisé : trace l'arrivée même sans inscription (event anonyme).
    if (ref && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await createAdminClient()
        .from("events")
        .insert({ type: "page_view", path: "/investors", ref })
        .then(() => {});
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t(locale, "auth.title")}
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        {t(locale, "auth.subtitle")}
      </p>
      {error === "lien-invalide" && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {t(locale, "auth.error.invalidLink")}
        </p>
      )}
      {demo ? (
        <DemoStartForm
          onboardings={(await listOnboardings()).map((o) => ({
            email: o.email,
            note: o.note,
          }))}
        />
      ) : (
        <RequestAccessForm refCode={ref} nextPath={next} locale={locale} />
      )}
    </main>
  );
}
