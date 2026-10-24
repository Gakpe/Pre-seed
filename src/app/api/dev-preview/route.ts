import { NextResponse, type NextRequest } from "next/server";
import { DEMO_COOKIE, signDemoToken } from "@/lib/demo";

// Aperçu local sans connexion : ouvre une session démo (niveau 2) et renvoie
// sur la page demandée, pour relire une fiche en cours sans passer par
// l'admin. En local seulement : hors `next dev`, la route n'existe pas.
//
//   http://localhost:3417/api/dev-preview?next=/investors/docs/kupanda-due-diligence
//
// Paramètres : `next` (une page de /investors), `level` (1 ou 2, 2 par
// défaut), `entity` (une structure, vide pour un particulier).
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  const params = request.nextUrl.searchParams;
  const next = params.get("next") ?? "/investors/home";
  const target = next.startsWith("/investors/") ? next : "/investors/home";
  const entity = params.get("entity");

  const res = NextResponse.redirect(new URL(target, request.url));
  res.cookies.set(
    DEMO_COOKIE,
    signDemoToken({
      name: "Aperçu local",
      entity: entity === null ? "Aperçu" : entity.trim() || null,
      tranche: null,
      level2: params.get("level") !== "1",
      onboarding: null,
    }),
    { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 4, path: "/" }
  );
  return res;
}
