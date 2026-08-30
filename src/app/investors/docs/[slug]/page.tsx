import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DocumentRow } from "@/lib/types";
import { CapTableInteractive } from "./captable";

export default async function DocPage({
  params,
}: PageProps<"/investors/docs/[slug]">) {
  const { slug } = await params;
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
  const doc = data as DocumentRow | null;
  if (!doc) notFound();
  if (doc.docsend_url) redirect(doc.docsend_url);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <Link
        href="/investors/home"
        className="text-sm text-neutral-500 hover:underline"
      >
        ← Data room
      </Link>
      <p className="mt-6 text-xs font-medium uppercase tracking-widest text-neutral-400">
        {doc.category}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{doc.title}</h1>
      <div className="mt-6 whitespace-pre-line text-sm leading-7 text-neutral-700 dark:text-neutral-300">
        {doc.content}
      </div>
      {doc.slug === "cap-table" && <CapTableInteractive />}
    </main>
  );
}
