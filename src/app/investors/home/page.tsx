import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureInvestor } from "@/lib/investors";
import type { DocumentRow, Investor } from "@/lib/types";

export const metadata = { title: "Espace investisseurs — Minah" };

export default async function InvestorHomePage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <Main>
        <p className="text-sm text-neutral-500">
          Supabase n&apos;est pas encore configuré (NEXT_PUBLIC_SUPABASE_URL
          manquant dans .env.local).
        </p>
      </Main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/investors");

  let investor: Investor | null = null;
  const { data } = await supabase
    .from("investors")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  investor = (data as Investor | null) ?? (await ensureInvestor(user));

  if (!investor) {
    return (
      <Main>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Votre profil n&apos;a pas pu être chargé. Contactez{" "}
          <a href="mailto:contact@minah.io" className="underline">
            contact@minah.io
          </a>
          .
        </p>
      </Main>
    );
  }

  if (investor.status === "blocked") {
    return (
      <Main>
        <h1 className="text-xl font-semibold tracking-tight">
          Accès indisponible
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Votre accès à l&apos;espace investisseurs n&apos;est pas actif. Pour
          toute question :{" "}
          <a href="mailto:contact@minah.io" className="underline">
            contact@minah.io
          </a>
          .
        </p>
      </Main>
    );
  }

  // RLS filtre déjà : pending ne voit que visible_to_pending, approved voit tout.
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("sort_order");
  const docs = (documents ?? []) as DocumentRow[];

  if (investor.status === "pending") {
    return (
      <Main>
        <h1 className="text-xl font-semibold tracking-tight">
          Accès en cours de validation
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Merci {investor.full_name ?? ""} — votre email est confirmé. Nous
          validons votre accès et vous préviendrons rapidement.
        </p>
        {docs.length > 0 && (
          <>
            <h2 className="mt-10 text-sm font-medium">
              En attendant, quelques documents :
            </h2>
            <DocumentList docs={docs} />
          </>
        )}
      </Main>
    );
  }

  return (
    <Main>
      <h1 className="text-xl font-semibold tracking-tight">
        Bienvenue{investor.full_name ? ` ${investor.full_name}` : ""}
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {/* Pages Kupanda, équipe, track record : contenu à venir (placeholder). */}
        Retrouvez ci-dessous les documents de la levée. Les pages Kupanda,
        équipe et track record arrivent bientôt.
      </p>
      <h2 className="mt-10 text-sm font-medium">Documents</h2>
      <DocumentList docs={docs} />
    </Main>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      {children}
    </main>
  );
}

function DocumentList({ docs }: { docs: DocumentRow[] }) {
  if (docs.length === 0) {
    return (
      <p className="mt-3 text-sm text-neutral-500">
        Aucun document disponible pour le moment.
      </p>
    );
  }
  return (
    <ul className="mt-3 divide-y divide-neutral-200 rounded-md border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
      {docs.map((doc) => (
        <li key={doc.slug}>
          {/* Étape 3 : le clic sera enregistré (docsend_click) avant redirection. */}
          <a
            href={doc.docsend_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <span>{doc.title}</span>
            <span className="text-neutral-400">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
