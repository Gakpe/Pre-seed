import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TrackingProvider } from "./tracking-provider";

export default async function InvestorsLayout({
  children,
}: LayoutProps<"/investors">) {
  let investor: {
    id: string;
    email: string;
    full_name: string | null;
    entity: string | null;
  } | null = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("investors")
        .select("id, email, full_name, entity")
        .eq("id", user.id)
        .maybeSingle();
      investor = data ?? {
        id: user.id,
        email: user.email ?? "",
        full_name: null,
        entity: null,
      };
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {investor && <TrackingProvider investor={investor} />}
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Minah
        </Link>
        {investor && (
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
