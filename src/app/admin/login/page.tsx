import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/admin";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  // Déjà authentifié : afficher le formulaire de connexion sous la barre admin
  // laissait croire que l'accès tenait au mot de passe alors qu'il était acquis.
  if (await getAdminEmail()) redirect("/admin");
  return <LoginForm />;
}
