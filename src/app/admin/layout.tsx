import Link from "next/link";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <div className="flex items-center gap-4">
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
        </div>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-xs text-neutral-500 hover:underline">
            Se déconnecter
          </button>
        </form>
      </header>
      {children}
    </div>
  );
}
