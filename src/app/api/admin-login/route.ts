import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isAdminEmail, signAdminToken } from "@/lib/admin";

// Connexion admin : email whitelisté (ADMIN_EMAILS) + mot de passe partagé
// (ADMIN_PASSWORD, "000" par défaut pour ce premier jet).
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const expected = process.env.ADMIN_PASSWORD ?? "000";

  if (!isAdminEmail(email) || password !== expected) {
    return new Response(null, { status: 401 });
  }

  const res = new NextResponse(null, { status: 204 });
  res.cookies.set(ADMIN_COOKIE, signAdminToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
