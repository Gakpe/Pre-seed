import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RequestAccessForm } from "./request-access-form";

export const metadata = { title: "Espace investisseurs — Minah" };

export default async function InvestorsPage({
  searchParams,
}: PageProps<"/investors">) {
  const params = await searchParams;
  const ref = typeof params.ref === "string" ? params.ref : null;
  const error = typeof params.error === "string" ? params.error : null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/investors/home");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        Espace investisseurs
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Accès sur invitation. Renseignez vos coordonnées pour recevoir un lien
        d&apos;accès par email.
      </p>
      {error === "lien-invalide" && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          Ce lien d&apos;accès est invalide ou expiré. Redemandez un lien
          ci-dessous.
        </p>
      )}
      <RequestAccessForm refCode={ref} />
    </main>
  );
}
