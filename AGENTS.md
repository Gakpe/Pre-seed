<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Périmètre Supabase

Le jeton `SUPABASE_ACCESS_TOKEN` est un jeton de **compte**, pas de projet : il
ouvre quatre projets Supabase. Un seul relève de ce dépôt.

| | Projet | Ref |
| --- | --- | --- |
| **Autorisé** | Pre-seed | `nuzklwegigoykemeznzw` |
| Interdit | Paloneo | `anecaqvesjjkfmieuqkl` |
| Interdit | Gakpe's Project | `ebvhusfooqjgcvyyrkin` |
| Interdit | Minah_OS | `rguyocqjdmhzxzuehlha` |

Toute requête à `api.supabase.com` doit porter le ref `nuzklwegigoykemeznzw`.
Ne pas lister les projets de l'organisation, ne pas lire, modifier ou supprimer
les trois autres, ne pas toucher aux réglages de l'organisation ni à la
facturation. En cas de doute sur le périmètre d'une opération, demander avant
d'agir.

# Pas de base de développement

Les clés de `.env.local` pointent sur la base de **production**. Un
`npm run dev` lit et écrit les vraies données investisseurs. Seul l'état
d'ouverture de la data room est séparé par environnement
(`dataroom_status_dev` en local) ; tout le reste — investisseurs, documents,
événements — est partagé avec la production.
