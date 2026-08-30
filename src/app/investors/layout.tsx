import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function InvestorsLayout({
  children,
}: LayoutProps<"/investors">) {
  let signedIn = false;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    signedIn = Boolean(user);
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Minah
        </Link>
        {signedIn && (
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-xs text-neutral-500 hover:underline"
            >
              Se déconnecter
            </button>
          </form>
        )}
      </header>
      {children}
    </div>
  );
}
