import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureInvestor } from "@/lib/investors";
import { deal } from "@/lib/deal";
import type { DocumentRow, Investor } from "@/lib/types";
import { DataRoom } from "./data-room";
import { InterestModal } from "./interest-modal";
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
        <p className="text-sm text-neutral-600">
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
        <p className="mt-2 text-sm text-neutral-600">
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

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("sort_order");
  const docs = (documents ?? []) as DocumentRow[];
  const level1 = docs.filter((d) => d.access_level === 1);
  const level2 = docs.filter((d) => d.access_level === 2);
  const level2Unlocked = investor.level2_access;

  let lockedTitles: { title: string; category: string }[] = [];
  if (!level2Unlocked && process.env.SUPABASE_SERVICE_ROLE_KEY) {
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
        <p className="mt-2 text-sm text-neutral-600">
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
    <>
      {/* Bandeau pleine largeur — le message doit être explicite */}
      <section className="relative h-56 w-full overflow-hidden md:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/cover.png"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
        <div className="absolute inset-0 mx-auto flex w-full max-w-5xl flex-col justify-center px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-white/80">
            Espace investisseurs · Confidentiel
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Opportunité d&apos;investissement — Pre-seed
          </h1>
          <p className="mt-2 text-sm text-white/90 md:text-base">
            Tour de {deal.target} · {deal.period} · L&apos;investissement
            africain, next gen.
          </p>
        </div>
      </section>

      <Main>
        {/* Actions + fil d'Ariane des niveaux */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <nav
            aria-label="Niveaux de la data room"
            className="flex items-center gap-2 text-xs"
          >
            <span className="rounded-full bg-foreground px-3 py-1 font-medium text-background">
              Niveau 1 — vous êtes ici
            </span>
            <span className="text-neutral-400">→</span>
            {level2Unlocked ? (
              <span className="rounded-full bg-salvia px-3 py-1 font-medium text-foreground">
                Niveau 2 — débloqué ✓
              </span>
            ) : (
              <span className="rounded-full border border-dashed border-neutral-400 px-3 py-1 text-neutral-500">
                Niveau 2 — verrouillé 🔒
              </span>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {!level2Unlocked && !investor.interest_expressed_at && (
              <InterestModal />
            )}
            <MeetingButton />
          </div>
        </div>

        {/* Présentation */}
        <section className="mt-10 grid gap-8 md:grid-cols-[1fr_200px] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight">
              La plateforme de dette privée pour l&apos;Afrique.
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              La première génération de la fintech africaine a gagné les
              paiements. La prochaine gagnera l&apos;investissement. Minah en
              construit les rails — dette senior sécurisée, coupons fixes,
              infrastructure on-chain — et ouvre son pre-seed.
            </p>
          </div>
          {/* Photo corporate — remplacer par la vraie photo (public/brand/team.jpg) */}
          <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gradient-to-br from-salvia/50 to-salvia text-xs text-neutral-500">
            Photo équipe — à venir
          </div>
        </section>

        {/* Conditions du deal */}
        <section className="mt-10 rounded-lg border border-foreground/10 bg-white/50 p-6">
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
            {/* Pointillés : montants identifiés en soft commit, pas encore signés */}
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${deal.progressPct}%`,
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, var(--brand) 0 7px, transparent 7px 12px)",
                }}
              />
            </div>
          </div>
        </section>

        {/* Data room niveau 1 — deux colonnes */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
            Data room · Niveau 1
          </h2>
          <div className="mt-4">
            <DataRoom docs={level1} columns={2} />
          </div>
        </section>

        {/* Niveau 2 */}
        <section className="mt-10 rounded-lg border border-foreground/10 bg-white/50 p-6">
          {level2Unlocked ? (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
                Data room · Niveau 2
                <span className="ml-2 rounded-full bg-salvia px-2 py-0.5 text-xs font-normal normal-case tracking-normal text-foreground">
                  {investor.interest_tranche
                    ? `débloqué — intérêt : ${investor.interest_tranche}`
                    : "débloqué par l'équipe"}
                </span>
              </h2>
              <div className="mt-4">
                {level2.length > 0 ? (
                  <DataRoom docs={level2} startIndex={8} columns={2} />
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
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Gestion des risques, table de capitalisation, contrats cadres :
                ce niveau se débloque en manifestant un intérêt pour une tranche
                — indicatif et non engageant.
              </p>
              {lockedTitles.length > 0 && (
                <ul className="mt-4 grid gap-x-6 md:grid-cols-2">
                  {lockedTitles.map((doc) => (
                    <li
                      key={doc.title}
                      className="flex items-center justify-between border-b border-dashed border-neutral-300 px-1 py-2.5 text-sm text-neutral-400"
                    >
                      <span>
                        <span className="mr-2 text-xs uppercase tracking-wide text-neutral-300">
                          {doc.category}
                        </span>
                        {doc.title}
                      </span>
                      <span>🔒</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-5">
                {investor.interest_expressed_at ? (
                  <p className="text-sm text-neutral-500">
                    Intérêt enregistré ({investor.interest_tranche}).
                    L&apos;accès au niveau 2 n&apos;est pas actif — contactez{" "}
                    <a href="mailto:contact@minah.io" className="underline">
                      contact@minah.io
                    </a>
                    .
                  </p>
                ) : (
                  <InterestModal />
                )}
              </div>
            </>
          )}
        </section>
      </Main>
    </>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
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
