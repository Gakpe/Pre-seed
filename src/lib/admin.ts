import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

// Garde des pages /admin : connecté ET email dans ADMIN_EMAILS.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/investors");
  if (!isAdminEmail(user.email)) redirect("/investors/home");
  return user;
}
