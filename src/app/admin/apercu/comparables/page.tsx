import { requireAdmin } from "@/lib/admin";
import { getLocale } from "@/lib/i18n-server";
import { LanguageSwitch } from "@/app/investors/language-switch";
import { Comparables } from "@/app/investors/docs/[slug]/comparables/Comparables";

export const metadata = { title: "Aperçu, comparables, Minah" };

// Aperçu admin de la future fiche de niveau 1 « Comparables et positionnement »,
// avant de créer la ligne documents.
export default async function ComparablesPreviewPage() {
  await requireAdmin();
  const locale = await getLocale();
  const fr = locale !== "en";

  return (
    // Plus large que les autres fiches : la matrice a besoin de la place, et le
    // texte à droite aussi. Le chapô, lui, reste dans une colonne de lecture.
    <main className="mx-auto w-full max-w-[90rem] flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">Aperçu admin, pas encore dans la data room</p>
        <LanguageSwitch locale={locale} />
      </div>
      <header className="mt-6 rounded-xl border border-foreground/10 bg-white/60 px-6 py-9 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{fr ? "Comparables et positionnement" : "Comparables and positioning"}</h1>
        <p className="mt-1.5 text-[15px] text-neutral-500">{fr ? "Marché" : "Market"}</p>
        <span aria-hidden className="mx-auto mt-3.5 block h-[3px] w-10 rounded-full bg-brand" />
      </header>
      <p className="mt-8 max-w-2xl text-[15px] leading-[1.8] text-neutral-700">
        {fr
          ? "Deux axes suffisent à lire le marché : la finance on-chain ou hors chaîne, et le périmètre, global ou africain. Trois groupes occupent trois quadrants. Le quatrième, on-chain et africain, est celui de Minah."
          : "Two axes are enough to read the market: on-chain or off-chain finance, and the scope, global or African. Three groups occupy three quadrants. The fourth, on-chain and African, is Minah's."}
      </p>
      <Comparables locale={locale} />
    </main>
  );
}
