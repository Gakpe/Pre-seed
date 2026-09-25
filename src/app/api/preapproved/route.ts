import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin";
import {
  addPreapproved,
  listPreapproved,
  parseEmails,
  removePreapproved,
} from "@/lib/preapproved";

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const parsed = JSON.parse(await request.text());
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

// Ajout en lot : une saisie libre, on renvoie ce qui a été retenu et rejeté.
export async function POST(request: Request) {
  if (!(await getAdminEmail())) return new Response(null, { status: 403 });
  const body = await readBody(request);
  const input = typeof body?.emails === "string" ? body.emails : "";
  const note =
    typeof body?.note === "string" && body.note.trim()
      ? body.note.trim().slice(0, 200)
      : null;
  const { emails, rejected } = parseEmails(input);
  if (emails.length === 0) {
    return NextResponse.json(
      { error: "Aucune adresse valide dans la saisie.", rejected },
      { status: 400 }
    );
  }
  try {
    await addPreapproved(emails, note);
  } catch {
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
  return NextResponse.json({
    added: emails.length,
    rejected,
    list: await listPreapproved(),
  });
}

export async function DELETE(request: Request) {
  if (!(await getAdminEmail())) return new Response(null, { status: 403 });
  const body = await readBody(request);
  const email = typeof body?.email === "string" ? body.email : "";
  if (!email) return NextResponse.json({ error: "Adresse manquante." }, { status: 400 });
  try {
    await removePreapproved(email);
  } catch {
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }
  return NextResponse.json({ list: await listPreapproved() });
}
