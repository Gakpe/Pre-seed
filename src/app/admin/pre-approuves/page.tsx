import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { listPreapproved } from "@/lib/preapproved";
import { PreapprovedPanel } from "./preapproved-panel";

export const metadata = { title: "Pré-approuvés, Minah" };

export default async function PreapprovedPage() {
  await requireAdmin();
  const list = await listPreapproved();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link href="/admin" className="text-sm text-neutral-500 hover:underline">
        ← Investisseurs
      </Link>
      <h1 className="mt-6 text-xl font-semibold tracking-tight">
        Investisseurs pré-approuvés
      </h1>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Une personne qui s&apos;inscrit avec l&apos;une de ces adresses entre
        dès sa première connexion, sans passer par la validation. Ajouter une
        adresse déjà en attente ouvre son accès aussitôt. Retirer une adresse
        ne ferme rien pour un compte déjà validé.
      </p>
      <PreapprovedPanel initial={list} />
    </main>
  );
}
