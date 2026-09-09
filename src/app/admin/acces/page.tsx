import { listAdmins, requireAdmin } from "@/lib/admin";
import { AdminsPanel } from "./admins-panel";

export const metadata = { title: "Accès admin, Minah" };

export default async function AdminAccessPage() {
  const me = await requireAdmin();
  const admins = await listAdmins();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-xl font-semibold tracking-tight">Accès admin</h1>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Seules ces adresses peuvent se connecter au back-office, avec le mot de
        passe partagé. Toute autre adresse est refusée, même en connaissant le
        mot de passe.
      </p>
      <AdminsPanel initial={admins} me={me} />
    </main>
  );
}
