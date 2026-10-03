import { createAdminClient } from "@/lib/supabase/admin";
import { ROADMAP_OBJECTIVES } from "./seed";
import type { Status } from "./types";

// États forcés à la main par Julien sur la roadmap, par brique : intégré,
// en développement ou en projet. Rangés dans app_settings, comme les mails
// types. Absent = l'état calculé (voir public.ts). Le seed reste la source du
// contenu ; ceci n'est qu'une couche de décision par-dessus.

const SETTING_KEY = "roadmap_status_overrides";
const STATUSES: Status[] = ["livre", "en_cours", "prevu"];

export type StatusOverrides = Record<string, Status>;

export function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as string[]).includes(value);
}

export function isObjectiveId(id: unknown): id is string {
  return typeof id === "string" && ROADMAP_OBJECTIVES.some((o) => o.id === id);
}

export async function listStatusOverrides(): Promise<StatusOverrides> {
  const { data } = await createAdminClient()
    .from("app_settings")
    .select("value")
    .eq("key", SETTING_KEY)
    .maybeSingle();
  const raw = (data?.value as Record<string, unknown> | null) ?? {};
  const out: StatusOverrides = {};
  for (const [id, status] of Object.entries(raw)) {
    if (isObjectiveId(id) && isStatus(status)) out[id] = status;
  }
  return out;
}

// `null` retire le forçage : la brique reprend son état calculé.
export async function setStatusOverride(id: string, status: Status | null): Promise<StatusOverrides> {
  const current = await listStatusOverrides();
  const next = { ...current };
  if (status) next[id] = status;
  else delete next[id];
  const { error } = await createAdminClient()
    .from("app_settings")
    .upsert(
      { key: SETTING_KEY, value: next, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  if (error) throw new Error(error.message);
  return next;
}
