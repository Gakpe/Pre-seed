import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Reçoit une liste de questions distinctes ({questions: string[]}),
// une ligne par question — chaque insert déclenche une alerte Yao.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }

  const raw = Array.isArray(body.questions)
    ? body.questions
    : typeof body.body === "string"
      ? [body.body]
      : [];
  const questions = raw
    .filter((q): q is string => typeof q === "string")
    .map((q) => q.trim().slice(0, 3000))
    .filter(Boolean)
    .slice(0, 10);
  if (questions.length === 0) return new Response(null, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response(null, { status: 401 });

  const { error } = await createAdminClient()
    .from("questions")
    .insert(questions.map((q) => ({ investor_id: user.id, body: q })));
  if (error) return new Response(null, { status: 500 });

  return new Response(null, { status: 204 });
}
