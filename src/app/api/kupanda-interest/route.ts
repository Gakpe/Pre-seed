import { createClient } from "@/lib/supabase/server";
import { getDemoSession } from "@/lib/demo";
import { dataRoomBlocked } from "@/lib/dataroom";
import { createAdminClient } from "@/lib/supabase/admin";
import { isKupandaTranche } from "@/lib/kupanda";

// Intérêt pour Kupanda, depuis le bas de la term sheet. Enregistre la tranche,
// l'insertion déclenche l'alerte Yao. Rien d'autre ne change côté accès.
export async function POST(request: Request) {
  // En démo, le formulaire se joue à l'écran seulement : rien en base.
  if (await getDemoSession()) return new Response(null, { status: 403 });
  if (await dataRoomBlocked()) return new Response(null, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isKupandaTranche(body.tranche)) return new Response(null, { status: 400 });
  const tranche = body.tranche;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response(null, { status: 401 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("kupanda_interests")
    .insert({ investor_id: user.id, tranche });
  if (error) return new Response(null, { status: 500 });

  await admin.from("events").insert({
    investor_id: user.id,
    type: "cta_click",
    path: "/investors/docs/term-sheet-kupanda",
    label: `kupanda:${tranche}`,
    session_id:
      typeof body.session_id === "string" ? body.session_id.slice(0, 64) : null,
  });

  return new Response(null, { status: 204 });
}
