# Portail investisseurs Minah

Prototype Next.js (App Router) + Supabase + PostHog. Deux zones : vitrine publique
et espace investisseurs sur invitation (magic link, statut `pending` → `approved`).

README complet (lancement local, ajout de documents, approbation) à l'étape 6.
En attendant :

```bash
npm install
cp .env.example .env.local   # remplir les clés Supabase
npm run dev
```

Le schéma est dans `supabase/migrations/` (à appliquer via le CLI Supabase ou
l'éditeur SQL du dashboard), les documents de démo dans `supabase/seed.sql`.
