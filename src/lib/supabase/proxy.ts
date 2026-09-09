import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Supabase pas encore configuré : on laisse passer pour pouvoir voir les pages.
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  // /admin gère sa propre connexion (email whitelisté + mot de passe),
  // voir requireAdmin() qui renvoie vers /admin/login.
  const needsAuth = path.startsWith("/investors/") && path !== "/investors";

  // Session de démonstration : on se contente ici de constater la présence du
  // cookie (pas de crypto dans le proxy). La signature est vérifiée par
  // getDemoSession() dans chaque page, un cookie forgé passe le proxy mais
  // n'ouvre rien et retombe sur la redirection côté page.
  const hasDemoCookie = request.cookies.has("minah_demo");

  if (!user && !hasDemoCookie && needsAuth) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/investors";
    // Mémorise la destination pour y revenir après la saisie du code.
    redirectUrl.search = `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
