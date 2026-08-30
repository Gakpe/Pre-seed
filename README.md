# Portail investisseurs Minah

Prototype Next.js 16 (App Router) + Supabase (EU) + PostHog (EU) pour la levée
pre-seed. Deux zones :

- **Publique** (`/`) : vitrine minimale, analytics anonyme (Plausible, optionnel).
- **Investisseurs** (`/investors`) : accès par magic link, auto-approuvé.
  Data room à deux niveaux (le niveau 2 se débloque en manifestant un intérêt
  pour une tranche), tracking complet de la navigation, alertes WhatsApp via
  Yao, dashboard `/admin`.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis remplir (voir ci-dessous)
npm run dev                  # ou PORT=3100 npm run dev si 3000 est pris
```

`.env.local` :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet (`https://<ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé publishable |
| `SUPABASE_SERVICE_ROLE_KEY` | clé secrète (serveur uniquement) |
| `ADMIN_EMAILS` | emails admin séparés par des virgules (accès `/admin`) |
| `NEXT_PUBLIC_POSTHOG_KEY` / `_HOST` / `_PROJECT_URL` | PostHog EU, inactif si vide |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | analytics publique, inactif si vide |
| `SUPABASE_ACCESS_TOKEN` | token personnel (Management API, migrations) |

Côté Supabase (dashboard → Authentication → URL Configuration) : le site URL et
`http://localhost:<port>/auth/callback` doivent être dans les Redirect URLs.

## Base de données

Schéma dans `supabase/migrations/` (ordre chronologique), documents de démo
dans `supabase/seed.sql` (idempotent, upsert par slug). Pour appliquer sur le
projet hébergé :

```bash
jq -n --rawfile sql <fichier.sql> '{query: $sql}' | curl -s -X POST \
  "https://api.supabase.com/v1/projects/<ref>/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" -d @-
```

(ou copier-coller dans l'éditeur SQL du dashboard).

## Gestes courants

**Ajouter un document à la data room** — une ligne dans `documents` :
`docsend_url` renseigné → lien DocSend ; sinon `content` (texte) → page interne
`/investors/docs/<slug>`. `access_level` 2 = réservé après manifestation
d'intérêt ; `visible_to_pending` = visible avant approbation. Le plus simple :
ajouter la ligne dans `supabase/seed.sql` et le rejouer.

**Bloquer / rétablir un investisseur** — `/admin` (connecté avec un email de
`ADMIN_EMAILS`), boutons sur la liste ou la fiche. La fiche montre la timeline
complète (pages, durées, documents ouverts) et le lien replay PostHog.

**Modifier les conditions du deal** (montants, tranches, jauge) —
`src/lib/deal.ts`.

## Yao (alertes WhatsApp)

Les triggers Postgres remplissent la table `notifications` (débounce inclus) ;
Yao la poll toutes les minutes avec la clé service et envoie les messages
pré-formatés. Contrat complet : [`docs/yao.md`](docs/yao.md).

## Tracking

`TrackingProvider` (zone investisseurs) enregistre `page_view`, `page_leave`
(durée + scroll max, `sendBeacon`), `docsend_click`, `cta_click` dans `events`,
et identifie l'utilisateur dans PostHog (session replay). Les arrivées par lien
personnalisé `/investors?ref=xxx` sont tracées même sans inscription
(event anonyme portant le `ref`).

## Hors périmètre du premier jet

Hébergement de fichiers, niveaux d'accès multiples au-delà du niveau 2,
intégration Folk/Make, NDA à l'entrée. Déploiement : local pour l'instant
(Railway/Vercel ensuite — rien n'est couplé à Vercel).
