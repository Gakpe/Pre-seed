// Origine publique d'une requête, pour construire une redirection ou un lien
// absolu. Derrière le routeur Heroku, request.url porte l'adresse interne du
// dyno (localhost:PORT) : une redirection bâtie dessus envoyait le navigateur
// vers https://localhost. Le domaine vu par le navigateur est dans
// x-forwarded-host et x-forwarded-proto, que Heroku et Vercel posent tous deux.
export function requestOrigin(request: Request): string {
  const h = request.headers;
  const host = (h.get("x-forwarded-host") ?? h.get("host"))?.split(",")[0].trim();
  if (!host) return new URL(request.url).origin;
  const forwardedProto = h.get("x-forwarded-proto")?.split(",")[0].trim();
  const proto =
    forwardedProto ??
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}
