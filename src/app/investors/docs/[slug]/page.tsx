import { Fragment } from "react";
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
import { MarketNote } from "./market-note";
import { CapitalFlow } from "./capital-flow";
import { BusinessModelBlocks } from "./business-model-blocks";
import { TeamProfiles } from "./team-profiles";
import { RiskCascade } from "./risk-cascade";
import { ResilienceBar } from "./resilience-bar";
import { RiskClosing } from "./risk-closing";

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
  // La cascade de risque a besoin de plus encore : trois colonnes et une
  // indentation qui se creuse à chaque niveau.
  const wide = doc.slug === "equipe";
  // La note de marché tient son rythme d'une colonne de lecture à 700 px, dont
  // les visuels débordent — d'où le rognage horizontal.
  const note = doc.slug === "note-marche";
  const extraWide =
    doc.slug === "gestion-du-risque" || doc.slug === "business-model";

  return (
    <main
      className={`mx-auto w-full flex-1 px-6 py-12 ${
        note
          ? "max-w-[748px]"
          : extraWide
            ? "max-w-5xl"
            : wide
              ? "max-w-4xl"
              : "max-w-2xl"
      }`}
    >
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
      {/* Certaines fiches portent un contenu riche en plus de leur texte. */}
      {doc.slug === "note-marche" && (
        <>
          <MarketNote />
          <MarketReports locale={locale} />
        </>
      )}
      {doc.slug === "business-model" && (
        <>
          <CapitalFlow />
          <BusinessModelBlocks />
        </>
      )}
      {doc.slug === "equipe" && <TeamProfiles locale={locale} />}
      {doc.slug === "gestion-du-risque" && (
        <>
          <RiskCascade />
          <ResilienceBar />
          <RiskClosing />
        </>
      )}
      {doc.slug === "cap-table" && (
        <CapTableInteractive title={t(locale, "docs.captable")} />
      )}
    </main>
  );
}

// Les contenus sont du texte, avec un sous-ensemble de Markdown volontairement
// étroit : intertitre « ## », liste « - », filet « --- », et **gras** en ligne.
// Assez pour structurer une note d'investissement sans imposer un éditeur riche
// à l'équipe, et sans jamais injecter de HTML brut.
function inline(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      )
    );
}

function DocContent({ text }: { text: string }) {
  return (
    <div className="mt-6 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
      {text.split("\n\n").map((block, i) => {
        const b = block.trim();

        if (b === "---") {
          return (
            <hr
              key={i}
              className="mt-10 mb-2 border-0 border-t border-neutral-200 dark:border-neutral-800"
            />
          );
        }

        if (b.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="mt-9 mb-1 text-base font-semibold tracking-tight text-foreground"
            >
              {b.slice(3)}
            </h2>
          );
        }

        if (b.startsWith("- ")) {
          return (
            <ul key={i} className="mt-4 space-y-2.5">
              {b
                .split("\n")
                .filter((l) => l.trimStart().startsWith("- "))
                .map((l) => l.trimStart().slice(2))
                .map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-brand" />
                    <span>{inline(item)}</span>
                  </li>
                ))}
            </ul>
          );
        }

        return (
          <p key={i} className="mt-4 whitespace-pre-line first:mt-0">
            {inline(b)}
          </p>
        );
      })}
    </div>
  );
}
