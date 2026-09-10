"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
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
