import Link from "next/link";

export const metadata = { title: "Confidentialité — Minah" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Confidentialité</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
        <p>
          La zone publique de ce site utilise une mesure d&apos;audience anonyme,
          sans cookie et sans donnée nominative.
        </p>
        <p>
          L&apos;espace investisseurs est accessible sur identification. En
          demandant l&apos;accès, vous acceptez que Minah SAS enregistre vos
          informations de contact (nom, email, entité) et votre navigation dans
          cet espace (pages consultées, documents ouverts, durée des visites) à
          des fins de suivi de la relation investisseur.
        </p>
        <p>
          Ces données sont hébergées dans l&apos;Union européenne et ne sont pas
          partagées avec des tiers. Vous pouvez demander l&apos;accès ou la
          suppression de vos données à{" "}
          <a href="mailto:contact@minah.io" className="underline">
            contact@minah.io
          </a>
          .
        </p>
      </div>
      <Link
        href="/"
        className="mt-10 inline-block text-sm text-neutral-500 hover:underline"
      >
        ← Retour
      </Link>
    </main>
  );
}
