import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

// Sauvegarde des paramètres de la cap table (admins uniquement).
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return new Response(null, { status: 403 });
  }

  let params: unknown;
  try {
    params = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  if (typeof params !== "object" || params === null || Array.isArray(params)) {
    return new Response(null, { status: 400 });
  }

  const { error } = await createAdminClient().from("app_settings").upsert({
    key: "captable_params",
    value: params,
    updated_at: new Date().toISOString(),
  });
  if (error) return new Response(null, { status: 500 });

  return new Response(null, { status: 204 });
}
