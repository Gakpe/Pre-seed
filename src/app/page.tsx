import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">Minah</h1>
        <p className="mx-auto max-w-md text-balance text-neutral-600 dark:text-neutral-400">
          {/* Contenu vitrine placeholder — texte définitif à venir. */}
          Nous construisons l&apos;infrastructure financière de l&apos;agriculture
          en Afrique de l&apos;Ouest.
        </p>
      </div>
      <Link
        href="/investors"
        className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
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
