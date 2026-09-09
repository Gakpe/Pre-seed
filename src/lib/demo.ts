import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { Investor } from "@/lib/types";

// Mode démo : un admin ouvre une session investisseur factice pour présenter
// la plateforme en call, sans code d'accès et sans rien écrire en base.
// Le cookie est signé avec le même secret que le cookie admin : un visiteur
// ne peut pas s'en fabriquer un pour lire la data room.
export const DEMO_COOKIE = "minah_demo";

export type DemoSession = {
  name: string;
  entity: string | null;
  // Intérêt manifesté pendant la démo, puis ouverture du niveau 2 :
  // les deux étapes restent distinctes, comme pour un vrai investisseur.
  tranche: string | null;
  level2: boolean;
};

function secret(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "minah-dev-secret";
}

export function signDemoToken(session: DemoSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyDemoToken(token: string | undefined): DemoSession | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof parsed?.name !== "string") return null;
    return {
      name: parsed.name,
      entity: typeof parsed.entity === "string" ? parsed.entity : null,
      tranche: typeof parsed.tranche === "string" ? parsed.tranche : null,
      level2: parsed.level2 === true,
    };
  } catch {
    return null;
  }
}

export async function getDemoSession(): Promise<DemoSession | null> {
  const store = await cookies();
  return verifyDemoToken(store.get(DEMO_COOKIE)?.value);
}

// Investisseur factice, jamais persisté : approuvé, niveau 1, aucun historique.
export function demoInvestor(session: DemoSession): Investor {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    email: "demo@minah.io",
    full_name: session.name,
    entity: session.entity,
    email_domain: "minah.io",
    status: "approved",
    tags: [],
    ref: null,
    created_at: new Date().toISOString(),
    last_seen_at: null,
    interest_expressed_at: session.tranche ? new Date().toISOString() : null,
    interest_tranche: session.tranche,
    level2_access: session.level2,
  };
}
