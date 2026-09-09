import { createAdminClient } from "@/lib/supabase/admin";
import { getDemoSession } from "@/lib/demo";
import { getAdminEmail } from "@/lib/admin";

// État de la data room, piloté depuis l'espace admin.
//   open        — accès normal
//   maintenance — fermée le temps d'une mise à jour ; les investisseurs sont
//                 prévenus par email à la réouverture
//   closed      — fermée, sans promesse de date
export type DataRoomStatus = "open" | "maintenance" | "closed";

export const DATAROOM_STATUSES: DataRoomStatus[] = [
  "open",
  "maintenance",
  "closed",
];

// Le développement local et la production partagent la même base Supabase.
// Sans séparation, basculer la data room en local pour vérifier un écran la
// fermerait aussi pour les vrais investisseurs.
//
// Le discriminant n'est pas NODE_ENV : `next build` le passe à "production"
// en local, si bien qu'une instance locale pouvait encore écrire sur la clé
// de production — c'est ce qui a fermé la data room le 8 septembre. VERCEL_ENV
// n'est renseigné que par Vercel, et vaut "production" pour le seul
// déploiement de production : les prévisualisations et le local retombent
// donc sur la clé de développement.
const SETTING_KEY =
  process.env.VERCEL_ENV === "production"
    ? "dataroom_status"
    : "dataroom_status_dev";

function parse(value: unknown): DataRoomStatus {
  const s = (value as { status?: unknown } | null)?.status;
  return s === "maintenance" || s === "closed" ? s : "open";
}

// Par défaut ouverte : une erreur de lecture ne doit jamais fermer la data
// room au nez des investisseurs.
export async function getDataRoomStatus(): Promise<DataRoomStatus> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return "open";
  try {
    const { data } = await createAdminClient()
      .from("app_settings")
      .select("value")
      .eq("key", SETTING_KEY)
      .maybeSingle();
    return parse(data?.value);
  } catch {
    return "open";
  }
}

export async function setDataRoomStatus(status: DataRoomStatus): Promise<void> {
  await createAdminClient()
    .from("app_settings")
    .upsert(
      { key: SETTING_KEY, value: { status }, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
}

// Vrai quand la data room doit être refusée à l'appelant. Les admins et les
// sessions de démo passent toujours : c'est depuis l'admin qu'on la referme,
// et une démo doit rester montrable pendant une fermeture.
export async function dataRoomBlocked(): Promise<boolean> {
  if ((await getDataRoomStatus()) === "open") return false;
  if (await getDemoSession()) return false;
  return !(await getAdminEmail());
}
