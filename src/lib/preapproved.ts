import { createAdminClient } from "@/lib/supabase/admin";
import { isEmailShaped, normalizeEmail } from "@/lib/admin";
import type { InvestorStatus } from "@/lib/types";

// Emails pré-approuvés : une inscription avec l'un d'eux est approuvée à la
// création, sans passer par la file de validation. La décision est prise en
// base (trigger handle_confirmed_user), ce module ne fait que tenir la liste.

export type PreapprovedSource = "admin" | "minah_os";

export type Preapproved = {
  email: string;
  source: PreapprovedSource;
  note: string | null;
  created_at: string;
  /** Statut du compte portail s'il existe déjà pour cet email. */
  investor_status: InvestorStatus | null;
};

// Une saisie libre : un email par ligne, ou séparés par virgules, points-virgules,
// espaces. On garde ce qui a la forme d'un email, en minuscules, sans doublon.
export function parseEmails(input: string): { emails: string[]; rejected: string[] } {
  const seen = new Set<string>();
  const emails: string[] = [];
  const rejected: string[] = [];
  for (const raw of input.split(/[\s,;]+/)) {
    const token = raw.trim().replace(/^<|>$/g, "");
    if (!token) continue;
    const email = normalizeEmail(token);
    if (!isEmailShaped(email)) {
      rejected.push(token);
      continue;
    }
    if (!seen.has(email)) {
      seen.add(email);
      emails.push(email);
    }
  }
  return { emails, rejected };
}

export async function listPreapproved(): Promise<Preapproved[]> {
  const admin = createAdminClient();
  const [{ data: rows }, { data: investors }] = await Promise.all([
    admin
      .from("preapproved_investors")
      .select("email, source, note, created_at")
      .order("created_at", { ascending: false }),
    admin.from("investors").select("email, status"),
  ]);
  const statusByEmail = new Map(
    ((investors ?? []) as { email: string; status: InvestorStatus }[]).map((i) => [
      normalizeEmail(i.email),
      i.status,
    ])
  );
  return ((rows ?? []) as Omit<Preapproved, "investor_status">[]).map((r) => ({
    ...r,
    investor_status: statusByEmail.get(r.email) ?? null,
  }));
}

export async function addPreapproved(
  emails: string[],
  note: string | null,
  source: PreapprovedSource = "admin"
): Promise<void> {
  if (emails.length === 0) return;
  const { error } = await createAdminClient()
    .from("preapproved_investors")
    .upsert(
      emails.map((email) => ({ email, source, note })),
      { onConflict: "email", ignoreDuplicates: true }
    );
  if (error) throw new Error(error.message);
}

export async function removePreapproved(email: string): Promise<void> {
  const { error } = await createAdminClient()
    .from("preapproved_investors")
    .delete()
    .eq("email", normalizeEmail(email));
  if (error) throw new Error(error.message);
}
