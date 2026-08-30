"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import type { InvestorStatus } from "@/lib/types";

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
