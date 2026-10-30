import Link from "next/link";
import { getLocale } from "@/lib/i18n-server";
import { LanguageSwitch } from "../investors/language-switch";
import { CONTACT_EMAIL } from "@/lib/kupanda-client";

// Chrome de la page souscripteurs (/kupanda) : hors de l'espace investisseurs,
// sans compte, sans suivi de lecture et sans bulle de questions. Même en-tête
// collant et même halo de marque que la data room, pour que la page soit
// reconnue comme une page Minah. La langue suit le cookie du sélecteur,
// partagé avec le reste du site.

const copy = {
  fr: { contact: "Nous écrire", privacy: "Confidentialité", issuer: "Minah SAS, Paris" },
  en: { contact: "Write to us", privacy: "Privacy", issuer: "Minah SAS, Paris" },
} as const;

export default async function KupandaLayout({ children }: LayoutProps<"/kupanda">) {
  const locale = await getLocale();
  const c = copy[locale];

  return (
    <div className="relative flex flex-1 flex-col overflow-x-clip">
      {/* Touche de marque : halo orange discret, bas droite. Une seule tache
          orange par écran, hors le filet de l'en-tête de fiche. */}
      <div className="pointer-events-none fixed -right-28 -bottom-28 z-0 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />

      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-foreground/10 bg-background/85 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Link href="/" aria-label="Minah" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt="Minah" className="h-5 w-auto" />
          </Link>
          <span aria-hidden className="h-4 w-px shrink-0 bg-foreground/20" />
          <span className="truncate text-xs text-neutral-500">Kupanda</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:gap-x-4">
          <LanguageSwitch locale={locale} />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-md border border-foreground/15 px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            {c.contact}
          </a>
        </div>
      </header>

      <div className="z-10 flex flex-1 flex-col">{children}</div>

      <footer className="z-10 flex flex-wrap items-center justify-center gap-x-2 px-6 pb-8 text-xs text-neutral-500">
        <span>{c.issuer}</span>
        <span aria-hidden>/</span>
        <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">
          {CONTACT_EMAIL}
        </a>
        <span aria-hidden>/</span>
        <Link href="/privacy" className="hover:underline">
          {c.privacy}
        </Link>
      </footer>
    </div>
  );
}
