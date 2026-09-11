import { Fragment } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDemoSession } from "@/lib/demo";
import { OWN_PAGE_SLUGS } from "@/lib/own-pages";
import { getLocale } from "@/lib/i18n-server";
import { docFields, t } from "@/lib/i18n";
import type { DocumentRow } from "@/lib/types";
import { CapTableInteractive } from "./captable";
import { MarketReports } from "./market-reports";
import { MarketNote } from "./market-note";
import { CapitalFlow } from "./capital-flow";
import { BusinessModelBlocks } from "./business-model-blocks";
import { TeamProfiles } from "./team-profiles";
import { TrackRecord } from "./track-record";
import { Fundraise } from "./fundraise";
import { WhyMinah } from "./why-minah";
import { GoToMarket } from "./go-to-market";
import { TermSheet } from "./term-sheet";
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
  if (docsendUrl && !OWN_PAGE_SLUGS.has(doc.slug)) redirect(docsendUrl);

  // Les fiches à schéma ou à portraits respirent mal dans la colonne de lecture.
  // La cascade de risque a besoin de plus encore : trois colonnes et une
  // indentation qui se creuse à chaque niveau. L'équipe va plus large encore
  // (trois portraits verticaux de front).
  const note = doc.slug === "note-marche";
  const team = doc.slug === "equipe";
  const extraWide =
    doc.slug === "gestion-du-risque" ||
    doc.slug === "business-model" ||
    doc.slug === "track-record" ||
    doc.slug === "la-levee" ||
    doc.slug === "pourquoi-minah" ||
    doc.slug === "term-sheet-kupanda" ||
    doc.slug === "go-to-market";

  // Ces fiches débordent en largeur, mais leur chapô reste dans une colonne
  // de lecture normale, sinon le texte court sur toute la page.
  const proseWidth =
    team ||
    doc.slug === "track-record" ||
    doc.slug === "la-levee" ||
    doc.slug === "pourquoi-minah" ||
    doc.slug === "term-sheet-kupanda"
      ? "max-w-2xl"
      : "";

  // Deux fiches sont entièrement portées par leur composant : le texte de la
  // base ferait doublon avec, et par endroits contredirait, les chiffres
  // qu'elles détaillent. Il reste en base, simplement plus affiché ici.
  const richOnly =
    doc.slug === "track-record" ||
    doc.slug === "la-levee" ||
    doc.slug === "pourquoi-minah" ||
    doc.slug === "term-sheet-kupanda" ||
    doc.slug === "go-to-market";

  return (
    <main
      className={`mx-auto w-full flex-1 px-6 py-12 ${
        note
          ? "max-w-[880px]"
          : team
            ? "max-w-6xl"
            : extraWide
              ? "max-w-5xl"
              : "max-w-2xl"
      }`}
    >
      <div className={proseWidth}>
        <Link
          href="/investors/home"
          className="halo-hover -mx-1 inline-flex items-center gap-1.5 rounded px-1 text-sm text-neutral-500 hover:underline"
        >
          <span aria-hidden>←</span>
          {t(locale, "docs.back")}
        </Link>
        {doc.slug !== "la-levee" && (
          <>
            <p className="mt-6 text-xs font-medium uppercase tracking-widest text-neutral-400">
              {category}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {title}
            </h1>
          </>
        )}
        {!richOnly && <DocContent text={content ?? ""} />}
      </div>
      {doc.slug === "la-levee" && (
        <header className="mt-6 rounded-xl border border-foreground/10 bg-white/60 px-6 py-9 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <span
            aria-hidden
            className="mx-auto mt-3.5 block h-[3px] w-10 rounded-full bg-brand"
          />
        </header>
      )}

      {/* Certaines fiches portent un contenu riche en plus de leur texte. */}
      {doc.slug === "pourquoi-minah" && <WhyMinah locale={locale} />}
      {doc.slug === "go-to-market" && <GoToMarket locale={locale} />}
      {doc.slug === "term-sheet-kupanda" && <TermSheet locale={locale} />}
      {doc.slug === "note-marche" && (
        <>
          <MarketNote title={title} locale={locale} />
          <MarketReports locale={locale} />
        </>
      )}
      {doc.slug === "business-model" && (
        <>
          <CapitalFlow locale={locale} />
          <BusinessModelBlocks locale={locale} />
        </>
      )}
      {doc.slug === "equipe" && <TeamProfiles locale={locale} />}
      {doc.slug === "track-record" && <TrackRecord locale={locale} />}
      {doc.slug === "la-levee" && <Fundraise locale={locale} />}
      {doc.slug === "gestion-du-risque" && (
        <>
          <RiskCascade locale={locale} />
          <ResilienceBar locale={locale} />
          <RiskClosing locale={locale} />
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
          <p
            key={i}
            className={`whitespace-pre-line ${i === 0 ? "" : "mt-4"}`}
          >
            {inline(b)}
          </p>
        );
      })}
    </div>
  );
}
