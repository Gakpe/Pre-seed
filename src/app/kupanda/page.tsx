import { notFound } from "next/navigation";
import { getAdminEmail } from "@/lib/admin";
import { getLocale } from "@/lib/i18n-server";
import { KupandaDueDiligence } from "../investors/docs/[slug]/kupanda-dd/KupandaDueDiligence";
import { ClientSections } from "../investors/docs/[slug]/kupanda-dd/ClientSections";

// « Due diligence Kupanda », version souscripteurs. La fiche de la data room
// (kupanda-due-diligence) s'adresse aux investisseurs du tour et liste les
// pièces internes, ouvrables ou à demander ; cette page reprend ses schémas
// et ses panneaux sans aucune liste de documents, et les prolonge avec ce
// que le mémorandum d'investissement apporte aux souscripteurs : les termes,
// une simulation, les scénarios de difficulté, l'éligibilité, le cadre
// juridique et l'avertissement.
//
// Le temps de la relecture : ouverte en local, sur les prévisualisations
// Vercel (lien partageable à l'équipe) et aux admins ; en production, aux
// admins seulement. Pour l'ouvrir aux souscripteurs, décider d'abord de
// l'accès (publique, par lien, ou derrière un code) et retirer la garde.

const copy = {
  fr: {
    title: "Due diligence Kupanda",
    subtitle: "L'opération en détail, pour les souscripteurs",
    meta: "Due diligence Kupanda, Minah",
  },
  en: {
    title: "Kupanda due diligence",
    subtitle: "The deal in detail, for subscribers",
    meta: "Kupanda due diligence, Minah",
  },
} as const;

export async function generateMetadata() {
  return { title: copy[await getLocale()].meta };
}

export default async function KupandaPage() {
  const allowed =
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview" ||
    (await getAdminEmail()) !== null;
  if (!allowed) notFound();

  const locale = await getLocale();
  const c = copy[locale];

  return (
    <main className="mx-auto w-full max-w-[92rem] flex-1 px-4 py-12 sm:px-6">
      {/* En-tête encadré des fiches investisseurs (AGENTS.md). */}
      <header className="rounded-xl border border-foreground/10 bg-white/60 px-6 py-9 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{c.title}</h1>
        <p className="mt-1.5 text-[15px] text-neutral-500">{c.subtitle}</p>
        <span aria-hidden className="mx-auto mt-3.5 block h-[3px] w-10 rounded-full bg-brand" />
      </header>

      <KupandaDueDiligence locale={locale} openSlugs={[]} audience="client" />

      <ClientSections locale={locale} />
    </main>
  );
}
