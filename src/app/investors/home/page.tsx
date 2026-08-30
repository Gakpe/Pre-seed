import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureInvestor } from "@/lib/investors";
import { deal } from "@/lib/deal";
import type { DocumentRow, Investor } from "@/lib/types";
import { DataRoom } from "./data-room";
import { InterestForm } from "./interest-form";
import { MeetingButton } from "./meeting-button";

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

  const { data } = await supabase
    .from("investors")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  const investor = (data as Investor | null) ?? (await ensureInvestor(user));

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

  // RLS filtre selon statut et niveau d'accès débloqué.
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("sort_order");
  const docs = (documents ?? []) as DocumentRow[];
  const level1 = docs.filter((d) => d.access_level === 1);
  const level2 = docs.filter((d) => d.access_level === 2);
  const interestDone = Boolean(investor.interest_expressed_at);

  // Avant manifestation d'intérêt, RLS cache le niveau 2 : on récupère
  // titres et catégories (rien d'autre) pour l'afficher verrouillé.
  let lockedTitles: { title: string; category: string }[] = [];
  if (!interestDone && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data: locked } = await createAdminClient()
      .from("documents")
      .select("title, category, sort_order")
      .eq("access_level", 2)
      .order("sort_order");
    lockedTitles = locked ?? [];
  }

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
        {level1.length > 0 && (
          <div className="mt-10">
            <DataRoom docs={level1} />
          </div>
        )}
      </Main>
    );
  }

  return (
    <Main>
      {/* Présentation */}
      <section className="grid gap-8 md:grid-cols-[1fr_220px] md:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            {deal.round} · Confidentiel
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
            L&apos;investissement africain, next&nbsp;gen.
          </h1>
          <p className="mt-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            La première génération de la fintech africaine a gagné les
            paiements. La prochaine gagnera l&apos;investissement. Minah
            construit la plateforme de dette privée pour l&apos;Afrique — dette
            senior sécurisée, coupons fixes, infrastructure on-chain — et ouvre
            son pre-seed.
          </p>
        </div>
        {/* Photo corporate — remplacer par la vraie photo (public/team.jpg) */}
        <div className="flex aspect-[4/5] items-center justify-center rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 text-xs text-neutral-400 dark:from-neutral-900 dark:to-neutral-800">
          Photo équipe — à venir
        </div>
      </section>

      {/* Conditions du deal */}
      <section className="mt-12 rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <h2 className="text-sm font-semibold">La levée en cours</h2>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <Term label="Objectif" value={deal.target} />
          <Term label="Ticket minimum" value={deal.minTicket} />
          <Term label="Lead recherché" value={deal.leadWanted} />
          <Term label="Matching fund" value={deal.matchingFund} />
        </dl>
        <div className="mt-6">
          <div className="flex items-baseline justify-between text-xs text-neutral-500">
            <span>{deal.engagedLabel}</span>
            <span>objectif {deal.target}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-foreground"
              style={{ width: `${deal.progressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Data room niveau 1 */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
            Data room · Niveau 1
          </h2>
          {!interestDone && (
            <span className="text-xs text-neutral-400">
              votre niveau d&apos;accès actuel
            </span>
          )}
        </div>
        <div className="mt-4">
          <DataRoom docs={level1} />
        </div>
      </section>

      {/* Niveau 2 */}
      <section className="mt-12 rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        {interestDone ? (
          <>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
              Data room · Niveau 2
              <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-normal normal-case tracking-normal text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                débloqué — intérêt : {investor.interest_tranche}
              </span>
            </h2>
            <div className="mt-4">
              {level2.length > 0 ? (
                <DataRoom docs={level2} startIndex={8} />
              ) : (
                <p className="text-sm text-neutral-500">
                  Documents en cours d&apos;ajout.
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
              Data room · Niveau 2 🔒
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Gestion des risques, table de capitalisation, contrats cadres :
              ce niveau se débloque en manifestant un intérêt pour une tranche
              — indicatif et non engageant.
            </p>
            {lockedTitles.length > 0 && (
              <ul className="mt-4 divide-y divide-neutral-200 rounded-md border border-dashed border-neutral-300 dark:divide-neutral-800 dark:border-neutral-700">
                {lockedTitles.map((doc) => (
                  <li
                    key={doc.title}
                    className="flex items-center justify-between px-4 py-3 text-sm text-neutral-400"
                  >
                    <span>
                      <span className="mr-2 text-xs uppercase tracking-wide text-neutral-300 dark:text-neutral-600">
                        {doc.category}
                      </span>
                      {doc.title}
                    </span>
                    <span>🔒</span>
                  </li>
                ))}
              </ul>
            )}
            <InterestForm />
          </>
        )}
      </section>

      {/* RDV équipe */}
      <section className="mt-12 rounded-lg border border-neutral-200 p-6 text-center dark:border-neutral-800">
        <h2 className="text-sm font-semibold">Échanger avec l&apos;équipe</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Une question sur le deal, la structuration ou Kupanda ? Prenez 30
          minutes avec les fondateurs.
        </p>
        <div className="mt-4">
          <MeetingButton />
        </div>
      </section>
    </Main>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      {children}
    </main>
  );
}

function Term({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}
