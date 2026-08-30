import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const tranche = typeof body.tranche === "string" ? body.tranche.slice(0, 100) : null;
  if (!tranche) return new Response(null, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response(null, { status: 401 });

  // Pas de politique RLS d'update sur investors : passage par le service role,
  // limité aux deux champs d'intérêt de l'utilisateur connecté.
  const admin = createAdminClient();
  const { error } = await admin
    .from("investors")
    .update({
      interest_expressed_at: new Date().toISOString(),
      interest_tranche: tranche,
      level2_access: true,
    })
    .eq("id", user.id);
  if (error) return new Response(null, { status: 500 });

  await admin.from("events").insert({
    investor_id: user.id,
    type: "cta_click",
    path: "/investors/home",
    label: `interet:${tranche}`,
    session_id: typeof body.session_id === "string" ? body.session_id.slice(0, 64) : null,
  });

  return new Response(null, { status: 204 });
}
