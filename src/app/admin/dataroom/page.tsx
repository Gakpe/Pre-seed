import Link from "next/link";
import { getDataRoomStatus, type DataRoomStatus } from "@/lib/dataroom";
import { requireAdmin } from "@/lib/admin";
import { DataRoomSwitch } from "../dataroom-switch";

// État de la data room. Le sélecteur vivait dans l'en-tête admin, à portée de
// clic depuis n'importe quelle page : trop exposé pour une bascule qui ferme
// l'espace à tous les investisseurs et, à la réouverture, leur écrit.
//
// Ici il a la place de dire ce qu'il fait avant qu'on y touche.

const STATES: {
  value: DataRoomStatus;
  label: string;
  effect: string;
  email: string;
}[] = [
  {
    value: "open",
    label: "Ouverte",
    effect:
      "Accès normal. Chaque investisseur voit les documents de son niveau.",
    email: "Aucun email.",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    effect:
      "Data room inaccessible, le temps d'une mise à jour. Les investisseurs voient un écran d'attente, les admins et les démos passent quand même.",
    email:
      "À la réouverture, un email part vers tous les investisseurs actifs pour annoncer que la mise à jour est terminée.",
  },
  {
    value: "closed",
    label: "Fermée",
    effect:
      "Data room fermée. Les investisseurs voient un écran de clôture, les admins et les démos passent quand même.",
    email: "Aucun email, ni à la fermeture ni à la réouverture.",
  },
];

export default async function DataRoomAdminPage() {
  await requireAdmin();
  const status = await getDataRoomStatus();
  const current = STATES.find((s) => s.value === status);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link href="/admin" className="text-sm text-neutral-500 hover:underline">
        ← Investisseurs
      </Link>

      <h1 className="mt-6 text-xl font-semibold tracking-tight">
        État de la data room
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Ce réglage vaut pour tous les investisseurs à la fois. Les admins et les
        sessions de démonstration ne sont jamais bloqués.
      </p>

      <div className="mt-6 rounded-md border border-neutral-200 p-5 dark:border-neutral-800">
        <p className="text-xs text-neutral-500">Actuellement</p>
        <p className="mt-1 text-base font-semibold">
          {current?.label ?? status}
        </p>
        <div className="mt-4">
          <DataRoomSwitch status={status} />
        </div>
      </div>

      <h2 className="mt-10 text-sm font-semibold">Ce que fait chaque état</h2>
      <dl className="mt-3 space-y-3">
        {STATES.map((s) => (
          <div
            key={s.value}
            className={`rounded-md border p-4 ${
              s.value === status
                ? "border-foreground/25 bg-white/60 dark:bg-neutral-900"
                : "border-neutral-200 dark:border-neutral-800"
            }`}
          >
            <dt className="text-sm font-medium">{s.label}</dt>
            <dd className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              {s.effect}
            </dd>
            <dd className="mt-1.5 text-xs leading-5 text-neutral-500">
              {s.email}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
