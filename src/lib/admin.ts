import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const ADMIN_COOKIE = "minah_admin";

// La whitelist a deux étages :
//   - ADMIN_EMAILS (variable d'environnement) : socle indéracinable. On ne peut
//     pas le retirer depuis l'interface, ce qui garantit qu'on ne peut jamais
//     se verrouiller dehors, ni par erreur ni par malveillance.
//   - app_settings.admin_emails : les accès ajoutés depuis /admin/acces.
// L'autorisation est l'union des deux.
const ADMIN_SETTING_KEY = "admin_emails";

export type AdminEntry = { email: string; source: "env" | "db" };

function secret(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "minah-dev-secret";
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isEmailShaped(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function envAdmins(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
}

async function dbAdmins(): Promise<string[]> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const { data } = await createAdminClient()
      .from("app_settings")
      .select("value")
      .eq("key", ADMIN_SETTING_KEY)
      .maybeSingle();
    const list = (data?.value as { emails?: unknown } | null)?.emails;
    if (!Array.isArray(list)) return [];
    return list
      .filter((e): e is string => typeof e === "string")
      .map(normalizeEmail)
      .filter(Boolean);
  } catch {
    // Une base injoignable ne doit pas priver d'accès les admins de l'env.
    return [];
  }
}

// Whitelist complète, dédoublonnée, triée, l'env d'abord.
export async function listAdmins(): Promise<AdminEntry[]> {
  const env = envAdmins();
  const extra = (await dbAdmins()).filter((e) => !env.includes(e));
  return [
    ...env.sort().map((email) => ({ email, source: "env" as const })),
    ...extra.sort().map((email) => ({ email, source: "db" as const })),
  ];
}

export async function isAdminEmail(
  email: string | undefined | null
): Promise<boolean> {
  if (!email) return false;
  const target = normalizeEmail(email);
  if (envAdmins().includes(target)) return true;
  return (await dbAdmins()).includes(target);
}

export async function addAdmin(email: string): Promise<void> {
  const target = normalizeEmail(email);
  const current = await dbAdmins();
  if (current.includes(target) || envAdmins().includes(target)) return;
  await saveDbAdmins([...current, target]);
}

// Les emails de l'environnement ne sont pas retirables : ils ne vivent pas ici.
export async function removeAdmin(email: string): Promise<void> {
  const target = normalizeEmail(email);
  await saveDbAdmins((await dbAdmins()).filter((e) => e !== target));
}

async function saveDbAdmins(emails: string[]): Promise<void> {
  await createAdminClient()
    .from("app_settings")
    .upsert(
      {
        key: ADMIN_SETTING_KEY,
        value: { emails },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
}

export function signAdminToken(email: string): string {
  const payload = Buffer.from(normalizeEmail(email)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

// Vérifie uniquement la signature, l'appartenance à la whitelist est
// contrôlée séparément, pour qu'un retrait d'accès prenne effet aussitôt
// même si la personne a encore son cookie.
function readAdminToken(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return Buffer.from(payload, "base64url").toString();
}

// Email admin de la requête courante : session Supabase (email whitelisté)
// ou cookie posé par /admin/login. Null sinon.
export async function getAdminEmail(): Promise<string | null> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && (await isAdminEmail(user.email))) {
      return normalizeEmail(user.email!);
    }
  }
  const cookieStore = await cookies();
  const email = readAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
  return email && (await isAdminEmail(email)) ? normalizeEmail(email) : null;
}

// Garde des pages /admin : renvoie vers la connexion admin dédiée.
export async function requireAdmin(): Promise<string> {
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");
  return email;
}
