import { requireAdmin } from "@/lib/admin";
import { listEmailTemplates } from "@/lib/email-templates";
import { TemplatesPanel } from "./templates-panel";

export const metadata = { title: "Mails types, Minah" };

export default async function AdminEmailsPage() {
  await requireAdmin();
  const templates = await listEmailTemplates();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-xl font-semibold tracking-tight">Mails types</h1>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Des textes prêts à copier dans votre client mail. Chaque mail existe en
        français et en anglais, le sélecteur change la langue de tous à la fois.
        Les crochets, [Prénom] par exemple, sont à remplacer avant envoi.
      </p>
      <TemplatesPanel initial={templates} />
    </main>
  );
}
