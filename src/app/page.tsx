import Link from "next/link";
import { PlausibleScript } from "./plausible-script";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <PlausibleScript />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo.png"
        alt="Minah"
        className="absolute top-6 left-6 h-5 w-auto"
      />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      <div className="space-y-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.png"
          alt="Minah"
          className="mx-auto h-10 w-auto"
        />
        <p className="mx-auto max-w-md text-balance text-neutral-600 dark:text-neutral-400">
          {/* Contenu vitrine placeholder — texte définitif à venir. */}
          La plateforme de dette privée pour l&apos;Afrique. Dette senior
          sécurisée, coupons fixes, infrastructure on-chain.
        </p>
      </div>
      <Link
        href="/investors"
        className="rounded-full bg-marsala px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
      >
        Espace investisseurs
      </Link>
      <footer className="fixed bottom-6 text-xs text-neutral-500">
        <Link href="/privacy" className="hover:underline">
          Confidentialité
        </Link>
        <span className="mx-2">·</span>
        <a href="mailto:contact@minah.io" className="hover:underline">
          contact@minah.io
        </a>
      </footer>
    </main>
  );
}
