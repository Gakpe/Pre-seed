import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const SESSION_PATHS = ["/investors", "/admin"];

export async function proxy(request: NextRequest) {
  // Heroku termine le TLS et parle en clair au dyno : le seul indice du
  // protocole d'origine est x-forwarded-proto. Les cookies de session sont
  // `secure`, une visite en http ne peut donc pas se connecter. On renvoie
  // sur https avant toute autre chose, en 308 pour conserver la méthode.
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const host = (
    request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  )
    ?.split(",")[0]
    .trim();
  if (proto === "http" && host && !/^(localhost|127\.)/.test(host)) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(`https://${host}${pathname}${search}`, 308);
  }

  const path = request.nextUrl.pathname;
  if (SESSION_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
    return await updateSession(request);
  }
  return NextResponse.next();
}

export const config = {
  // Tout sauf les fichiers servis tels quels : le renvoi https doit couvrir la
  // page publique aussi, la session ne concerne que /investors et /admin.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|brand/|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)"],
};
