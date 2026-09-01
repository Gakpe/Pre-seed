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
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" aria-label="Minah" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt="Minah" className="h-5 w-auto" />
          </Link>
          {investor && (
            <>
              <span aria-hidden className="h-4 w-px shrink-0 bg-foreground/20" />
              <span className="truncate text-xs text-neutral-500">
                {investor.full_name ?? investor.email}
                {investor.entity ? ` · ${investor.entity}` : ""}
              </span>
            </>
          )}
        </div>
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
            href="/admin/login"
            className="rounded-md border border-foreground/15 px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            Admin
          </Link>
        )}
      </header>
      <div className="z-10 flex flex-1 flex-col">{children}</div>

      {/* Badge confidentiel, bas gauche */}
      <div className="group fixed bottom-5 left-5 z-40">
        <span className="pointer-events-none absolute bottom-full left-0 mb-2 w-72 rounded-md bg-foreground px-3 py-2 text-xs leading-5 text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Espace confidentiel — merci de ne pas le partager, sauf aux personnes
          explicitement concernées ou sur demande de l&apos;équipe Minah.
        </span>
        <span className="flex cursor-default items-center gap-2 rounded-full border border-marsala/25 bg-white/60 px-3 py-1.5 text-[11px] font-medium tracking-wide text-marsala shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Espace confidentiel
        </span>
      </div>
    </div>
  );
}
