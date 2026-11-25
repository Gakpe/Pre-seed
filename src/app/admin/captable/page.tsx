import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export const metadata = { title: "Cap table, Admin Minah" };

export default async function AdminCapTablePage() {
  await requireAdmin();

  return (
    <main className="flex-1 px-6 py-8">
      <h1 className="text-xl font-semibold tracking-tight">Cap table</h1>
      <p className="mt-1 max-w-2xl text-sm text-neutral-500">
        Vue interne complète. Ouvrez « Paramètres » pour ajuster les hypothèses,
        puis « Enregistrer les paramètres » : c&apos;est cette version que
        verront les investisseurs niveau 2 (en vue investisseurs, hypothèses
        masquées).
      </p>
      <p className="mt-2 text-sm">
        <Link
          href="/investors/docs/cap-table"
          className="whitespace-nowrap font-medium text-neutral-800 underline underline-offset-4 hover:no-underline"
        >
          Voir la fiche telle que la verront les investisseurs →
        </Link>
      </p>
      <iframe
        src="/api/captable?embed=admin"
        title="Cap table interactive, admin"
        className="mt-6 h-[1700px] w-full rounded-md border border-neutral-200 dark:border-neutral-800"
      />
    </main>
  );
}
