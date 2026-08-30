import { createClient } from "@supabase/supabase-js";

// Client service role : bypasse RLS. Usage serveur uniquement (routes admin, fallbacks).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
