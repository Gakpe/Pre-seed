import { requireAdmin } from "@/lib/admin";
import { getLocale } from "@/lib/i18n-server";
import { LanguageSwitch } from "@/app/investors/language-switch";
import { EcosystemRoadmap } from "@/app/investors/docs/[slug]/ecosystem/EcosystemRoadmap";

export const metadata = { title: "Aperçu, roadmap écosystème, Minah" };

// Aperçu admin d'une fiche qui n'existe pas encore dans la data room : même
// en-tête encadré, même largeur, pour juger le rendu avant de créer la ligne
// documents et de l'ouvrir au niveau 2.
export default async function EcosystemPreviewPage() {
  await requireAdmin();
  const locale = await getLocale();
  const fr = locale !== "en";

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">Aperçu admin, pas encore dans la data room</p>
        <LanguageSwitch locale={locale} />
      </div>
      <header className="mt-6 rounded-xl border border-foreground/10 bg-white/60 px-6 py-9 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{fr ? "Roadmap écosystème" : "Ecosystem roadmap"}</h1>
        <span aria-hidden className="mx-auto mt-3.5 block h-[3px] w-10 rounded-full bg-brand" />
      </header>
      <EcosystemRoadmap locale={locale} draft />
    </main>
  );
}
