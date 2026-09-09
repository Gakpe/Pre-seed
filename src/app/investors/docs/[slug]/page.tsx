import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDemoSession } from "@/lib/demo";
import { getLocale } from "@/lib/i18n-server";
import { docFields, t } from "@/lib/i18n";
import type { DocumentRow } from "@/lib/types";
import { CapTableInteractive } from "./captable";
import { MarketReports } from "./market-reports";
import { BusinessModelFlow } from "./business-model-flow";
import { TeamProfiles } from "./team-profiles";

export default async function DocPage({
  params,
}: PageProps<"/investors/docs/[slug]">) {
  const { slug } = await params;
  const locale = await getLocale();
  const demo = await getDemoSession();

  let doc: DocumentRow | null;
  if (demo) {
    // Pas de session Supabase en démo : service role + filtrage de niveau à la main.
    const { data } = await createAdminClient()
      .from("documents")
      .select("*")
      .eq("slug", slug)
      .lte("access_level", demo.level2 ? 2 : 1)
      .maybeSingle();
    doc = data as DocumentRow | null;
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/investors");

    // RLS : renvoie null si le document n'est pas visible pour ce statut/niveau.
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    doc = data as DocumentRow | null;
  }
  if (!doc) notFound();

  const { title, category, content, docsendUrl } = docFields(doc, locale);
  if (docsendUrl) redirect(docsendUrl);

  // Les fiches à schéma ou à portraits respirent mal dans la colonne de lecture.
  // L'équipe va plus large encore (trois portraits verticaux de front), mais on
  // garde son chapô dans une colonne de lecture normale.
  const width =
    doc.slug === "equipe"
      ? "max-w-6xl"
      : doc.slug === "business-model"
        ? "max-w-4xl"
        : "max-w-2xl";
  const proseWidth = doc.slug === "equipe" ? "max-w-2xl" : "";

  return (
    <main className={`mx-auto w-full flex-1 px-6 py-12 ${width}`}>
      <div className={proseWidth}>
        <Link
          href="/investors/home"
          className="text-sm text-neutral-500 hover:underline"
        >
          {t(locale, "docs.back")}
        </Link>
        <p className="mt-6 text-xs font-medium uppercase tracking-widest text-neutral-400">
          {category}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
        <DocContent text={content ?? ""} />
      </div>
      {/* Certaines fiches portent un contenu riche en plus de leur texte. */}
      {doc.slug === "note-marche" && <MarketReports locale={locale} />}
      {doc.slug === "business-model" && <BusinessModelFlow locale={locale} />}
      {doc.slug === "equipe" && <TeamProfiles locale={locale} />}
      {doc.slug === "cap-table" && (
        <CapTableInteractive title={t(locale, "docs.captable")} />
      )}
    </main>
  );
}

// Les contenus sont du texte simple, à une convention près : un bloc préfixé
// par « ## » est un intertitre. Assez pour structurer une note sans imposer
// un éditeur riche à l'équipe.
function DocContent({ text }: { text: string }) {
  return (
    <div className="mt-6 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
      {text.split("\n\n").map((block, i) =>
        block.startsWith("## ") ? (
          <h2
            key={i}
            className="mt-9 mb-1 text-base font-semibold tracking-tight text-foreground"
          >
            {block.slice(3)}
          </h2>
        ) : (
          <p key={i} className="mt-4 whitespace-pre-line first:mt-0">
            {block}
          </p>
        )
      )}
    </div>
  );
}
