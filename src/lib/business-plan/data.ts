import { createAdminClient } from "@/lib/supabase/admin";
import type { BusinessPlanData } from "./calc";

// Les chiffres du business plan vivent dans app_settings, lisibles avec la
// seule clé service : le dépôt GitHub est public, ils n'ont pas leur place
// dans le code. Pour mettre à jour le BP, on remplace la valeur de cette clé ;
// la page recalcule tout (voir calc.ts).
export const BP_SETTING_KEY = "business_plan";

export async function getBusinessPlan(): Promise<BusinessPlanData | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const { data } = await createAdminClient()
    .from("app_settings")
    .select("value")
    .eq("key", BP_SETTING_KEY)
    .maybeSingle();
  return (data?.value as BusinessPlanData | null) ?? null;
}
