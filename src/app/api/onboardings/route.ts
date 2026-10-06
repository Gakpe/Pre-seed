import { NextResponse } from "next/server";
import { getAdminEmail, isEmailShaped, normalizeEmail } from "@/lib/admin";
import { addPreapproved } from "@/lib/preapproved";
import { deleteOnboarding, listOnboardings, saveOnboarding } from "@/lib/onboarding";

// Onboardings sur mesure, depuis /admin/onboarding. Réservé aux admins.

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const parsed = JSON.parse(await request.text());
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

const text = (v: unknown, max: number) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

const slugs = (v: unknown) =>
  Array.isArray(v)
    ? [...new Set(v.filter((s): s is string => typeof s === "string" && /^[a-z0-9-]+$/.test(s)))]
    : [];

// Création ou mise à jour (même adresse). `preapprove` ajoute l'adresse aux
// pré-approuvés, pour qu'elle arrive directement sur son accueil.
export async function POST(request: Request) {
  if (!(await getAdminEmail())) return new Response(null, { status: 403 });
  const body = await readBody(request);
  const email = normalizeEmail(typeof body?.email === "string" ? body.email : "");
  if (!isEmailShaped(email)) {
    return NextResponse.json({ error: "Adresse invalide." }, { status: 400 });
  }
  try {
    await saveOnboarding({
      email,
      message_fr: text(body?.message_fr, 2000),
      message_en: text(body?.message_en, 2000),
      focus_slugs: slugs(body?.focus_slugs),
      unlocked_slugs: slugs(body?.unlocked_slugs),
      note: text(body?.note, 200),
    });
    if (body?.preapprove === true) await addPreapproved([email], "onboarding sur mesure");
  } catch {
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
  return NextResponse.json({ list: await listOnboardings() });
}

export async function DELETE(request: Request) {
  if (!(await getAdminEmail())) return new Response(null, { status: 403 });
  const body = await readBody(request);
  const email = typeof body?.email === "string" ? body.email : "";
  if (!email) return NextResponse.json({ error: "Adresse manquante." }, { status: 400 });
  try {
    await deleteOnboarding(email);
  } catch {
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }
  return NextResponse.json({ list: await listOnboardings() });
}
