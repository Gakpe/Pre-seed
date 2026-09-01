import { readFile } from "fs/promises";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminEmail } from "@/lib/admin";
import type { Investor } from "@/lib/types";

// Sert la cap table interactive (HTML autonome) avec les paramètres
// sauvegardés injectés. ?embed=admin : paramètres modifiables (admins).
// Sinon : vue investisseur (niveau 2 requis), hypothèses masquées.
export async function GET(request: Request) {
  const embed =
    new URL(request.url).searchParams.get("embed") === "admin"
      ? "admin"
      : "investor";

  if (embed === "admin") {
    if (!(await getAdminEmail())) {
      return new Response("Réservé aux admins", { status: 403 });
    }
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return new Response("Non autorisé", { status: 401 });

    const { data } = await supabase
      .from("investors")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    const investor = data as Investor | null;
    if (!investor || investor.status !== "approved" || !investor.level2_access) {
      return new Response("Niveau 2 requis", { status: 403 });
    }
  }

  const { data: setting } = await createAdminClient()
    .from("app_settings")
    .select("value")
    .eq("key", "captable_params")
    .maybeSingle();
  const params = setting?.value ?? {};

  const file = path.join(process.cwd(), "src", "lib", "captable.html");
  const html = (await readFile(file, "utf8")).replace(
    "<body>",
    `<body><script>window.__MINAH_PARAMS=${JSON.stringify(
      params
    )};window.__MINAH_EMBED=${JSON.stringify(embed)};</script>`
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
