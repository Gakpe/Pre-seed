import { NextResponse } from "next/server";
import { isOwner } from "@/lib/admin";
import { isObjectiveId, isStatus, setStatusOverride } from "@/lib/roadmap/overrides";

// Forcer l'état d'une brique de la roadmap. Réservé à Julien.
// Corps : { id, status: "livre" | "en_cours" | "prevu" | null } ; null = état calculé.
export async function POST(request: Request) {
  if (!(await isOwner())) return new Response(null, { status: 403 });
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isObjectiveId(body.id)) return new Response(null, { status: 400 });
  if (body.status !== null && !isStatus(body.status)) return new Response(null, { status: 400 });
  try {
    const overrides = await setStatusOverride(body.id, body.status ?? null);
    return NextResponse.json({ overrides });
  } catch {
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
}
