import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function recordLogin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await createAdminClient()
      .from("events")
      .insert({ investor_id: user.id, type: "login", path: "/auth/callback" });
  } catch {
    // le login ne doit jamais échouer à cause du tracking
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next") ?? "/investors/home";
  // Uniquement des chemins internes, pas de redirection ouverte.
  const next = rawNext.startsWith("/") ? rawNext : "/investors/home";

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await recordLogin();
      return NextResponse.redirect(`${origin}${next}`);
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) {
      await recordLogin();
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/investors?error=lien-invalide`);
}
