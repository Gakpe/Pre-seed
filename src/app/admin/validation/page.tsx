import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { formatDuration } from "@/lib/format";
import type { Investor } from "@/lib/types";
import { approveInvestor, setInvestorStatus } from "../actions";

// File de validation : les comptes qui attendent une décision, et rien d'autre.
//
// Une vue à part plutôt qu'un filtre sur la liste générale, parce que ce n'est
// pas la même lecture : ici on tranche compte par compte, et la file doit
// pouvoir se vider. Le nombre en attente est repris dans l'en-tête admin, pour
// qu'un compte n'attende pas faute d'avoir ouvert la bonne page.

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function ValidationPage() {
  await requireAdmin();

  const admin = createAdminClient();
  const [{ data }, { data: statsData }] = await Promise.all([
    admin
      .from("investors")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    admin.from("investor_stats").select("investor_id, total_duration_ms"),
  ]);

  const pending = (data ?? []) as Investor[];
  const seen = new Map(
    (statsData ?? []).map((s) => [s.investor_id, s.total_duration_ms])
  );

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link href="/admin" className="text-sm text-neutral-500 hover:underline">
        ← Investisseurs
      </Link>

      <h1 className="mt-6 text-xl font-semibold tracking-tight">
        Comptes en attente de validation
        {pending.length > 0 && (
          <span className="ml-2 rounded-full bg-brand/15 px-2.5 py-0.5 text-sm font-medium text-marsala">
            {pending.length}
          </span>
        )}
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Un compte validé reçoit un email lui annonçant l&apos;ouverture de son
        accès. Un compte refusé ne voit rien et n&apos;est pas prévenu.
      </p>

      {pending.length === 0 ? (
        <p className="mt-10 rounded-md border border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800">
          Aucun compte en attente. Tout est traité.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {pending.map((inv) => (
            <li
              key={inv.id}
              className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <Link
                    href={`/admin/investors/${inv.id}`}
                    className="font-medium hover:underline"
                  >
                    {inv.full_name ?? inv.email}
                  </Link>
                  <div className="text-xs text-neutral-500">{inv.email}</div>

                  <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-500">
                    <div>
                      <dt className="inline">Entité : </dt>
                      <dd className="inline text-neutral-700 dark:text-neutral-300">
                        {inv.entity ?? "non renseignée"}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline">Inscrit le </dt>
                      <dd className="inline text-neutral-700 dark:text-neutral-300">
                        {dateFmt.format(new Date(inv.created_at))}
                      </dd>
                    </div>
                    {inv.ref && (
                      <div>
                        <dt className="inline">Via </dt>
                        <dd className="inline text-neutral-700 dark:text-neutral-300">
                          {inv.ref}
                        </dd>
                      </div>
                    )}
                    {seen.get(inv.id) ? (
                      <div>
                        <dt className="inline">Déjà passé </dt>
                        <dd className="inline text-neutral-700 dark:text-neutral-300">
                          {formatDuration(seen.get(inv.id) ?? 0)}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <form action={approveInvestor.bind(null, inv.id)}>
                    <button className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90">
                      Valider l&apos;accès
                    </button>
                  </form>
                  <form
                    action={setInvestorStatus.bind(null, inv.id, "blocked")}
                  >
                    <button className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs text-red-600 transition-colors hover:border-red-400 dark:border-neutral-700">
                      Refuser
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
