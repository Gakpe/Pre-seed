import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin";
import {
  listEmailTemplates,
  normalizeTemplate,
  saveEmailTemplates,
} from "@/lib/email-templates";

// Mails types du back-office. Un mail à la fois : on relit la liste, on y
// remplace ou ajoute l'entrée, on réécrit, pour que deux admins qui éditent
// deux mails différents ne s'écrasent pas.

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const parsed = JSON.parse(await request.text());
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export async function PUT(request: Request) {
  if (!(await getAdminEmail())) return new Response(null, { status: 403 });
  const body = await readBody(request);
  const template = normalizeTemplate(body?.template);
  if (!template) {
    return NextResponse.json({ error: "Mail type invalide." }, { status: 400 });
  }

  const current = await listEmailTemplates();
  const index = current.findIndex((t) => t.id === template.id);
  const next =
    index === -1
      ? [...current, template]
      : current.map((t, i) => (i === index ? template : t));

  try {
    await saveEmailTemplates(next);
  } catch {
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
  return NextResponse.json({ templates: next });
}

export async function DELETE(request: Request) {
  if (!(await getAdminEmail())) return new Response(null, { status: 403 });
  const body = await readBody(request);
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Identifiant manquant." }, { status: 400 });

  const next = (await listEmailTemplates()).filter((t) => t.id !== id);
  try {
    await saveEmailTemplates(next);
  } catch {
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }
  return NextResponse.json({ templates: next });
}
