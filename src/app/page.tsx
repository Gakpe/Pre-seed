import Link from "next/link";
import { PlausibleScript } from "./plausible-script";
import { LanguageSwitch } from "./investors/language-switch";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export default async function Home() {
  const locale = await getLocale();

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <PlausibleScript />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo.png"
        alt="Minah"
        className="absolute top-6 left-6 h-5 w-auto"
      />
      {/* Même sélecteur que l'espace investisseurs, même cookie : la langue
          choisie ici suit la personne jusque dans la data room. */}
      <div className="absolute top-6 right-6">
        <LanguageSwitch locale={locale} />
      </div>
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      <div className="space-y-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.png"
          alt="Minah"
          className="mx-auto h-10 w-auto"
        />
        <p className="mx-auto max-w-md text-balance text-neutral-600 dark:text-neutral-400">
          {t(locale, "landing.tagline")}
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Link
          href="/investors"
          className="rounded-full bg-marsala px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          {t(locale, "landing.cta")}
        </Link>
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {t(locale, "landing.scope")}
        </p>
        <p className="mx-auto max-w-md text-balance text-sm italic leading-6 text-neutral-500">
          {t(locale, "landing.note")}
        </p>
      </div>
      <footer className="fixed bottom-6 text-xs text-neutral-500">
        <Link href="/privacy" className="hover:underline">
          {t(locale, "landing.privacy")}
        </Link>
        <span className="mx-2">/</span>
        <a href="mailto:contact@minah.io" className="hover:underline">
          contact@minah.io
        </a>
        <span className="mx-2">/</span>
        <Link href="/admin/login" className="hover:underline">
          Admin
        </Link>
      </footer>
    </main>
  );
}
