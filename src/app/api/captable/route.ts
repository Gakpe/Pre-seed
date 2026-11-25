import { readFile } from "fs/promises";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminEmail } from "@/lib/admin";
import { getDemoSession } from "@/lib/demo";
import { dataRoomBlocked } from "@/lib/dataroom";
import { cookies } from "next/headers";
import { getLocale } from "@/lib/i18n-server";
import { DEMO_OPEN_SLUGS, UNAVAILABLE_SLUGS } from "@/lib/retired-docs";
import type { Investor } from "@/lib/types";

// Le HTML de la cap table (moteur, textes, hypothèses, notes de travail) n'est
// pas dans le dépôt : le dépôt GitHub est public, et c'est la table de
// capitalisation de la société. Il vit dans app_settings, clé `captable_html`,
// lisible avec la seule clé service. `scripts/captable.mjs` le synchronise avec
// une copie de travail locale, `.private/captable.html` (ignorée par git), que
// `next dev` sert en priorité pour voir ses modifications sans les publier.
const HTML_SETTING_KEY = "captable_html";

async function loadSource(): Promise<string | null> {
  if (process.env.NODE_ENV === "development") {
    try {
      return await readFile(path.join(process.cwd(), ".private", "captable.html"), "utf8");
    } catch {
      // pas de copie locale : on lit la base, comme en production
    }
  }
  const { data } = await createAdminClient()
    .from("app_settings")
    .select("value")
    .eq("key", HTML_SETTING_KEY)
    .maybeSingle();
  const html = (data?.value as { html?: unknown } | null)?.html;
  return typeof html === "string" && html.length > 0 ? html : null;
}

// Sert la cap table interactive (HTML autonome) avec les paramètres
// sauvegardés injectés. ?embed=admin : paramètres modifiables (admins).
// Sinon : vue investisseur (niveau 2 requis), hypothèses et notes de travail
// retirées du HTML servi.
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
    if (await dataRoomBlocked()) {
      return new Response("Data room fermée", { status: 403 });
    }
    const demo = await getDemoSession();
    // L'équipe (les admins) voit toujours la vue investisseur, fiche en pause
    // comprise : c'est ainsi qu'elle la relit avant de l'ouvrir. Tant que la
    // fiche est en pause, personne d'autre ne la reçoit, même au niveau 2 ;
    // en local seulement, le cookie d'aperçu l'ouvre à une session démo.
    // Session démo en cours ou non : un admin garde son cookie de démo des heures.
    const team = Boolean(await getAdminEmail());
    const paused = UNAVAILABLE_SLUGS.has("cap-table");
    const localPreview =
      process.env.NODE_ENV === "development" &&
      (await cookies()).get("minah_preview_paused")?.value === "1";
    // Une session démo la reçoit aussi quand la fiche est ouverte en démo.
    const demoOpen = Boolean(demo) && (localPreview || DEMO_OPEN_SLUGS.has("cap-table"));
    if (paused && !team && !demoOpen) {
      return new Response("Fiche en cours de mise à jour", { status: 403 });
    }
    if (team) {
      // rien de plus à vérifier
    } else if (demo) {
      // Démo : le niveau 2 est piloté par le cookie signé, pas par la base.
      if (!demo.level2) return new Response("Niveau 2 requis", { status: 403 });
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
  }

  const { data: setting } = await createAdminClient()
    .from("app_settings")
    .select("value")
    .eq("key", "captable_params")
    .maybeSingle();
  const params = setting?.value ?? {};

  // La fiche suit la langue du portail ; la vue interne reste en français.
  const locale = embed === "admin" ? "fr" : await getLocale();

  let source = await loadSource();
  if (source === null) {
    return new Response("Cap table indisponible", { status: 503 });
  }
  if (embed === "investor") {
    // Vue investisseur : le panneau des hypothèses, les notes de travail et le
    // code qui les pilote (balisés « interne » dans le fichier) ne quittent pas
    // le serveur. Les masquer en CSS les laissait lisibles dans le source.
    source = source
      .replace(/<!-- interne:début -->[\s\S]*?<!-- interne:fin -->/g, "")
      .replace(/\/\* interne:début \*\/[\s\S]*?\/\* interne:fin \*\//g, "");
  }
  const html = source.replace(
    "<body>",
    `<body><script>window.__MINAH_PARAMS=${JSON.stringify(
      params
    )};window.__MINAH_EMBED=${JSON.stringify(embed)};window.__MINAH_LOCALE=${JSON.stringify(locale)};</script>`
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
