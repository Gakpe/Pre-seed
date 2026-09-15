"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendBatch } from "@/lib/email";
import { SITE_URL } from "@/lib/site";
import { getAdminEmail, requireAdmin } from "@/lib/admin";
import type { InvestorStatus, NoteKind } from "@/lib/types";

export async function setInvestorStatus(
  investorId: string,
  status: InvestorStatus
) {
  await requireAdmin();
  if (!["pending", "approved", "blocked"].includes(status)) return;

  const admin = createAdminClient();
  await admin.from("investors").update({ status }).eq("id", investorId);

  revalidatePath("/admin");
  revalidatePath(`/admin/investors/${investorId}`);
}

// Validation d'un compte en attente. L'email part dans la foulée : on promet
// une réponse sous 24 h sur l'écran d'attente, un accès qui se débloque en
// silence laisserait l'investisseur sans signal.
//
// Bilingue, parce que la langue de l'investisseur n'est pas stockée : il choisit
// FR ou EN à la volée sur le portail, rien ne le retient.
export async function approveInvestor(investorId: string) {
  await requireAdmin();

  const admin = createAdminClient();
  const { data } = await admin
    .from("investors")
    .update({ status: "approved" })
    .eq("id", investorId)
    .eq("status", "pending")
    .select("email, full_name")
    .maybeSingle();

  // Rien mis à jour : le compte n'était pas en attente, pas d'email.
  if (data?.email) {
    const url = `${SITE_URL}/investors/home`;
    await sendBatch([
      {
        to: data.email,
        subject: "Votre accès à la data room Minah est ouvert",
        html: `<p>Bonjour${data.full_name ? " " + data.full_name : ""},</p>
<p>Votre accès à l'espace investisseurs Minah est validé. La data room, le mémo d'investissement et les documents de la levée vous sont ouverts.</p>
<p><a href="${url}">Accéder à l'espace investisseurs</a></p>
<p>Une question, ou l'envie d'en parler de vive voix ? Répondez simplement à cet email.</p>
<p>L'équipe Minah</p>
<hr>
<p>Hello${data.full_name ? " " + data.full_name : ""},</p>
<p>Your access to the Minah investor space has been validated. The data room, the investment memo and the round documents are now open to you.</p>
<p><a href="${url}">Open the investor space</a></p>
<p>Any question, or would you rather talk it through? Just reply to this email.</p>
<p>The Minah team</p>`,
      },
    ]);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/validation");
  revalidatePath(`/admin/investors/${investorId}`);
}

export async function setLevel2Access(investorId: string, granted: boolean) {
  await requireAdmin();

  const admin = createAdminClient();
  await admin
    .from("investors")
    .update({ level2_access: granted })
    .eq("id", investorId);

  revalidatePath("/admin");
  revalidatePath(`/admin/investors/${investorId}`);
}

// Notes et relances. Le corps arrive d'un <form>, on le borne : la fiche admin
// n'est pas un traitement de texte, et une saisie vide ne doit rien créer.
export async function addInvestorNote(
  investorId: string,
  kind: NoteKind,
  formData: FormData
) {
  await requireAdmin();
  if (kind !== "note" && kind !== "fomo") return;

  const body = String(formData.get("body") ?? "")
    .trim()
    .slice(0, 4000);
  if (!body) return;

  const admin = createAdminClient();
  await admin.from("investor_notes").insert({
    investor_id: investorId,
    kind,
    body,
    author: await getAdminEmail(),
  });

  revalidatePath(`/admin/investors/${investorId}`);
}

export async function deleteInvestorNote(investorId: string, noteId: number) {
  await requireAdmin();

  const admin = createAdminClient();
  await admin
    .from("investor_notes")
    .delete()
    .eq("id", noteId)
    .eq("investor_id", investorId);

  revalidatePath(`/admin/investors/${investorId}`);
}
