import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TrackingProvider } from "./tracking-provider";
import { Splash } from "./splash";
import { QuestionWidget } from "./question-widget";

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
    <div className="relative flex flex-1 flex-col">
      {investor && <TrackingProvider investor={investor} />}
      {investor && <Splash />}

      {/* Touche de marque : halo orange discret, bas droite */}
      <div className="pointer-events-none fixed -right-28 -bottom-28 z-0 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      {investor ? (
        <QuestionWidget />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brand/icon.png"
          alt=""
          className="pointer-events-none fixed right-5 bottom-5 z-0 h-9 w-9 rounded-full opacity-80 shadow-sm"
        />
      )}

      <header className="z-10 flex items-center justify-between border-b border-foreground/10 px-6 py-4">
        <Link href="/" aria-label="Minah">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Minah" className="h-5 w-auto" />
        </Link>
        {investor ? (
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-xs text-neutral-500 hover:underline"
            >
              Se déconnecter
            </button>
          </form>
        ) : (
          <Link
            href="/admin"
            className="rounded-md border border-foreground/15 px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            Admin
          </Link>
        )}
      </header>
      <div className="z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
