import Link from "next/link";
import { getDataRoomStatus } from "@/lib/dataroom";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const dataRoomStatus = await getDataRoomStatus();

  // Compte en attente affiché dans la barre : sans ça, un inscrit peut attendre
  // simplement parce que personne n'a pensé à ouvrir la page de validation.
  const { count: pendingCount } = await createAdminClient()
    .from("investors")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-neutral-200 px-4 py-3 sm:px-6 sm:py-4 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/" aria-label="Minah">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt="Minah" className="h-5 w-auto" />
          </Link>
          <Link href="/admin" className="text-xs text-neutral-500 hover:underline">
            Investisseurs
          </Link>
          <Link
            href="/admin/captable"
            className="text-xs text-neutral-500 hover:underline"
          >
            Cap table
          </Link>
          <Link
            href="/admin/acces"
            className="text-xs text-neutral-500 hover:underline"
          >
            Accès admin
          </Link>
          <Link
            href="/admin/dataroom"
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:underline"
          >
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${
                dataRoomStatus === "open"
                  ? "bg-salvia"
                  : dataRoomStatus === "maintenance"
                    ? "bg-brand"
                    : "bg-marsala"
              }`}
            />
            Data room
          </Link>
          <Link
            href="/admin/validation"
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:underline"
          >
            Validation
            {pendingCount ? (
              <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {pendingCount}
              </span>
            ) : null}
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:gap-x-4">
          {/* Démo : ouvre un espace investisseur factice pour les calls. */}
          <Link
            href="/investors?demo=1"
            className="rounded-md border border-brand/40 bg-brand/10 px-2.5 py-1 text-xs font-medium text-marsala transition-colors hover:border-brand"
          >
            Démo
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-xs text-neutral-500 hover:underline">
              Se déconnecter
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
