import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import { TrackingProvider } from "./tracking-provider";
import { Splash } from "./splash";
import { QuestionWidget } from "./question-widget";
import { LanguageSwitch } from "./language-switch";
import { DemoBar } from "./demo-bar";
import { getDemoSession } from "@/lib/demo";
import { getDataRoomStatus } from "@/lib/dataroom";
import { getAdminEmail } from "@/lib/admin";
import { DataRoomNotice } from "./dataroom-notice";

export default async function InvestorsLayout({
  children,
}: LayoutProps<"/investors">) {
  const locale = await getLocale();
  // Mode démo : l'identité affichée vient du cookie signé, pas de Supabase.
  const demo = await getDemoSession();

  // Data room fermée ou en maintenance : seuls les admins et les démos passent.
  // L'appel à getAdminEmail() n'a lieu que si la fermeture est active.
  const dataRoomStatus = await getDataRoomStatus();
  const gated =
    dataRoomStatus !== "open" && !demo && !(await getAdminEmail());
  let investor: {
    id: string;
    email: string;
    full_name: string | null;
    entity: string | null;
  } | null = null;

  if (demo) {
    investor = {
      id: "demo",
      email: "",
      full_name: demo.name,
      entity: demo.entity,
    };
  } else if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
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
    <div className="relative flex flex-1 flex-col overflow-x-clip">
      {/* Aucune visite tracée pendant une démo. */}
      {investor && !demo && !gated && <TrackingProvider investor={investor} />}
      {investor && !gated && <Splash />}

      {/* Touche de marque : halo orange discret, bas droite */}
      {!gated && (
        <div className="pointer-events-none fixed -right-28 -bottom-28 z-0 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      )}
      {investor && !gated ? (
        <QuestionWidget locale={locale} demo={!!demo} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brand/icon.png"
          alt=""
          className="pointer-events-none fixed right-5 bottom-5 z-0 h-9 w-9 rounded-full opacity-80 shadow-sm"
        />
      )}

      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-foreground/10 bg-background/85 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
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
        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:gap-x-4">
          <LanguageSwitch locale={locale} />
          {demo ? (
            <DemoBar level2={demo.level2} />
          ) : investor ? (
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-xs text-neutral-500 hover:underline"
              >
                {t(locale, "layout.signout")}
              </button>
            </form>
          ) : (
            <Link
              href="/admin/login"
              className="rounded-md border border-foreground/15 px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              {t(locale, "layout.admin")}
            </Link>
          )}
        </div>
      </header>
      <div className="z-10 flex flex-1 flex-col">
        {gated ? (
          <DataRoomNotice status={dataRoomStatus} locale={locale} />
        ) : (
          children
        )}
      </div>

      {/* Badge confidentiel, bas gauche */}
      <div className={`group fixed bottom-4 left-4 z-40 sm:bottom-5 sm:left-5 ${gated ? "hidden" : ""}`}>
        <span className="pointer-events-none absolute bottom-full left-0 mb-2 w-[min(18rem,calc(100vw-2rem))] rounded-md bg-foreground px-3 py-2 text-xs leading-5 text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {t(locale, "layout.confidential.tooltip")}
        </span>
        <span className="flex cursor-default items-center gap-1.5 rounded-full border border-marsala/25 bg-white/60 px-2.5 py-1 text-[10px] font-medium tracking-wide text-marsala shadow-sm backdrop-blur-sm sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {t(locale, "layout.confidential")}
        </span>
      </div>
    </div>
  );
}
