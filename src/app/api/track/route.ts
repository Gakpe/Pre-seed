import { createClient } from "@/lib/supabase/server";

const EVENT_TYPES = new Set([
  "login",
  "page_view",
  "page_leave",
  "docsend_click",
  "cta_click",
]);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }

  const type = String(body.type ?? "");
  if (!EVENT_TYPES.has(type)) return new Response(null, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response(null, { status: 401 });

  const clamp = (v: unknown, max: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(Math.max(Math.round(n), 0), max) : null;
  };

  // Insert soumis à RLS : uniquement rattaché à l'utilisateur connecté.
  await supabase.from("events").insert({
    investor_id: user.id,
    session_id: typeof body.session_id === "string" ? body.session_id.slice(0, 64) : null,
    type,
    path: typeof body.path === "string" ? body.path.slice(0, 300) : null,
    label: typeof body.label === "string" ? body.label.slice(0, 300) : null,
    duration_ms: type === "page_leave" ? clamp(body.duration_ms, 86_400_000) : null,
    scroll_depth: type === "page_leave" ? clamp(body.scroll_depth, 100) : null,
  });

  return new Response(null, { status: 204 });
}
