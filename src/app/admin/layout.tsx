import Link from "next/link";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <div className="flex items-baseline gap-3">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Minah
          </Link>
          <Link href="/admin" className="text-xs text-neutral-500 hover:underline">
            Admin
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
