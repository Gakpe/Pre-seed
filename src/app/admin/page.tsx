import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Investor } from "@/lib/types";
import { setInvestorStatus } from "./actions";
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
  const { data } = await admin
    .from("investors")
    .select("*")
    .order("last_seen_at", { ascending: false, nullsFirst: false });
  const investors = (data ?? []) as Investor[];

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
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
              <th className="px-4 py-2.5 font-medium">Intérêt</th>
              <th className="px-4 py-2.5 font-medium">Dernière activité</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {investors.map((inv) => (
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
                <td className="px-4 py-3">{inv.interest_tranche ?? "—"}</td>
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
            ))}
            {investors.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
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
