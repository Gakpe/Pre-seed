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
  const wide = doc.slug === "business-model" || doc.slug === "equipe";

  return (
    <main
      className={`mx-auto w-full flex-1 px-6 py-12 ${wide ? "max-w-4xl" : "max-w-2xl"}`}
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
            {renderInline(block)}
          </p>
        )
      )}
    </div>
  );
}

// Seule syntaxe inline supportée : les liens markdown [texte](url). Les liens
// externes s'ouvrent dans un nouvel onglet. Le reste du bloc reste du texte brut.
function renderInline(block: string): React.ReactNode[] {
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(block)) !== null) {
    if (match.index > lastIndex) nodes.push(block.slice(lastIndex, match.index));
    const [, label, href] = match;
    const external = /^https?:\/\//.test(href);
    nodes.push(
      <a
        key={match.index}
        href={href}
        className="font-medium text-marsala underline underline-offset-2 hover:opacity-80"
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {label}
      </a>
    );
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < block.length) nodes.push(block.slice(lastIndex));
  return nodes;
}
