import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_COOKIE } from "@/lib/admin";
import { DEMO_COOKIE } from "@/lib/demo";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const res = NextResponse.redirect(new URL("/", request.url), { status: 303 });

  // Se déconnecter ferme les trois portes, pas seulement la session Supabase.
  // Le cookie admin vit sept jours et le cookie de démonstration quatre heures :
  // tant qu'ils restaient posés, la barre admin continuait de s'afficher et ses
  // pages de répondre, et une démonstration laissée ouverte donnait la data room
  // réelle à qui reprenait la machine.
  res.cookies.delete(ADMIN_COOKIE);
  res.cookies.delete(DEMO_COOKIE);
  return res;
}
