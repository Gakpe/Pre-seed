import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const text =
    typeof body.body === "string" ? body.body.trim().slice(0, 5000) : "";
  if (!text) return new Response(null, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response(null, { status: 401 });

  const { error } = await createAdminClient()
    .from("questions")
    .insert({ investor_id: user.id, body: text });
  if (error) return new Response(null, { status: 500 });

  return new Response(null, { status: 204 });
}
