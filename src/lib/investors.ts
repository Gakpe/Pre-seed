import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Investor } from "@/lib/types";

// Filet de sécurité : si le trigger SQL n'a pas (encore) créé la ligne investors
// (ex. migration appliquée après le premier login), on la crée ici en service role.
export async function ensureInvestor(user: User): Promise<Investor | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !user.email) return null;

  const admin = createAdminClient();
  const meta = user.user_metadata ?? {};
  await admin.from("investors").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: (meta.full_name as string) || null,
      entity: (meta.entity as string) || null,
      ref: (meta.ref as string) || null,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  const { data } = await admin
    .from("investors")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return data as Investor | null;
}
