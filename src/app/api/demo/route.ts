import { NextResponse } from "next/server";
import { getAdminEmail, isEmailShaped, normalizeEmail } from "@/lib/admin";
import {
  DEMO_COOKIE,
  getDemoSession,
  signDemoToken,
  type DemoSession,
} from "@/lib/demo";

// Ouvre ou fait évoluer une session de démonstration. Réservé aux admins :
// la démo donne accès à la data room sans authentification investisseur.
export async function POST(request: Request) {
  if (!(await getAdminEmail())) return new Response(null, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }

  const current = await getDemoSession();
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";

  let session: DemoSession;
  if (name) {
    // Nouvelle démo : on repart d'un investisseur qui arrive pour la première fois.
    const onboarding =
      typeof body.onboarding === "string" ? normalizeEmail(body.onboarding) : "";
    session = {
      name,
      entity:
        typeof body.entity === "string" && body.entity.trim()
          ? body.entity.trim().slice(0, 120)
          : null,
      tranche: null,
      level2: false,
      onboarding: isEmailShaped(onboarding) ? onboarding : null,
    };
  } else if (current) {
    session = {
      ...current,
      tranche:
        typeof body.tranche === "string"
          ? body.tranche.slice(0, 100)
          : current.tranche,
      level2: typeof body.level2 === "boolean" ? body.level2 : current.level2,
    };
  } else {
    return new Response(null, { status: 400 });
  }

  const res = new NextResponse(null, { status: 204 });
  res.cookies.set(DEMO_COOKIE, signDemoToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 4,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = new NextResponse(null, { status: 204 });
  res.cookies.delete(DEMO_COOKIE);
  return res;
}
