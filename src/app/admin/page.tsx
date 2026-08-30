import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Investor, InvestorStats } from "@/lib/types";
import { formatDuration } from "@/lib/format";
import { setInvestorStatus, setLevel2Access } from "./actions";
import { StatusBadge } from "./status-badge";

export const metadata = { title: "Admin — Minah" };

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminPage() {
  await requireAdmin();

  const admin = createAdminClient();
  const [{ data }, { data: statsData }] = await Promise.all([
    admin
      .from("investors")
      .select("*")
      .order("last_seen_at", { ascending: false, nullsFirst: false }),
    admin.from("investor_stats").select("*"),
  ]);
  const investors = (data ?? []) as Investor[];
  const stats = new Map(
    ((statsData ?? []) as InvestorStats[]).map((s) => [s.investor_id, s])
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="text-xl font-semibold tracking-tight">Investisseurs</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {investors.length} inscrit{investors.length > 1 ? "s" : ""}, triés par
        dernière activité.
      </p>

      <div className="mt-6 overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500 dark:border-neutral-800">
              <th className="px-4 py-2.5 font-medium">Nom</th>
              <th className="px-4 py-2.5 font-medium">Entité</th>
              <th className="px-4 py-2.5 font-medium">Statut</th>
              <th className="px-4 py-2.5 font-medium">Intention</th>
              <th className="px-4 py-2.5 font-medium">Niveau 2</th>
              <th className="px-4 py-2.5 font-medium">Temps passé</th>
              <th className="px-4 py-2.5 font-medium">Dernière activité</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {investors.map((inv) => {
              const s = stats.get(inv.id);
              return (
                <tr key={inv.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/investors/${inv.id}`}
                      className="font-medium hover:underline"
                    >
                      {inv.full_name ?? inv.email}
                    </Link>
                    <div className="text-xs text-neutral-500">{inv.email}</div>
                  </td>
                  <td className="px-4 py-3">{inv.entity ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-4 py-3">
                    {inv.interest_tranche ? (
                      <>
                        <div className="font-medium">{inv.interest_tranche}</div>
                        {inv.interest_expressed_at && (
                          <div className="text-xs text-neutral-500">
                            {dateFmt.format(new Date(inv.interest_expressed_at))}
                          </div>
                        )}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{inv.level2_access ? "✓" : "—"}</span>
                      <form
                        action={setLevel2Access.bind(
                          null,
                          inv.id,
                          !inv.level2_access
                        )}
                      >
                        <button className="text-xs text-neutral-500 hover:underline">
                          {inv.level2_access ? "retirer" : "donner"}
                        </button>
                      </form>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {formatDuration(s?.total_duration_ms ?? 0)}
                    {s && s.sessions > 0 && (
                      <div className="text-xs text-neutral-500">
                        {s.sessions} session{s.sessions > 1 ? "s" : ""} ·{" "}
                        {s.docsend_clicks} doc{s.docsend_clicks > 1 ? "s" : ""}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {inv.last_seen_at
                      ? dateFmt.format(new Date(inv.last_seen_at))
                      : "jamais"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {inv.status === "blocked" ? (
                      <form
                        action={setInvestorStatus.bind(null, inv.id, "approved")}
                      >
                        <button className="text-xs text-emerald-600 hover:underline">
                          Rétablir
                        </button>
                      </form>
                    ) : (
                      <form
                        action={setInvestorStatus.bind(null, inv.id, "blocked")}
                      >
                        <button className="text-xs text-red-600 hover:underline">
                          Bloquer
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
            {investors.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                  Aucun investisseur pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
