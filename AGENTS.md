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

# Langage visuel de la zone investisseurs

Conventions arrêtées le 11/09/2026 sur l'accueil et la fiche « La levée en
cours », étendues le 14/09/2026 à « Pourquoi Minah ? », à la note de marché et
au business model. Les autres fiches (term sheet Kupanda, go-to-market, équipe,
track record, gestion du risque) n'y sont pas encore alignées : s'y conformer en
passant dessus, plutôt que d'inventer un traitement de plus.

## Titres

| Niveau | Traitement |
|---|---|
| En-tête de fiche | Carte `rounded-xl border border-foreground/10 bg-white/60 px-6 py-9 text-center`, titre `text-3xl font-semibold tracking-tight`, filet `h-[3px] w-10 rounded-full bg-brand` dessous |
| Titre de section | Pastille (picto ou numéro) + libellé `text-2xl font-semibold leading-tight tracking-tight` |
| Titre de carte | `text-sm font-semibold`, casse normale |

Pastille numérotée : `grid h-9 w-9 place-items-center rounded-lg bg-brand/10
font-mono text-sm font-semibold text-marsala`. En `h-6 w-6` et `text-[11px]`
dans les listes de la data room.

Les titres de section à picto passent par `SectionTitle`
(`src/app/investors/docs/[slug]/section-title.tsx`) : pastille orangée
`h-9 w-9` en marsala, pictos au trait dans le même fichier. Picto quand la
fiche se lit comme un raisonnement (Pourquoi Minah, business model), numéro
quand elle se lit comme une suite de chapitres (la levée, la note de marché).
Choisir un nouveau picto sur une planche de variantes, pas au jugé.

L'en-tête encadré est géré par `framedHeader` dans `page.tsx` : la levée,
Pourquoi Minah, la note de marché, le business model. La catégorie s'affiche
sous le titre (`headerCategory`), sauf quand elle répète le titre (« Business
model » sous « Business model Minah »). Le chapô d'une fiche encadrée vient
sous l'en-tête, en 15 px. Les titres en question finissent par « ? » en base
(« Pourquoi Minah ? », avec espace insécable en français).

Un titre de section ne porte pas de sous-titre. L'intitulé numéroté suffit,
les phrases d'accroche du type « Où en est le tour. » ont été supprimées.

L'en-tête de fiche ne répète pas la catégorie. Sur une fiche à double titre
(« Pourquoi la dette » et « Pourquoi maintenant » sur la note de marché), le
titre passe devant et la catégorie derrière.

**Les petites majuscules espacées sont bannies** comme traitement de titre
(`text-[10px] font-semibold uppercase tracking-[0.14em]` et ses variantes).
Il en reste une trentaine dans les autres fiches, à convertir en titre de
carte au fil des passages. Attention : certaines sont des étiquettes de
graphique ou de légende, pas des titres, et gardent leur traitement propre.

## Pastilles et cadres

Les pastilles `rounded-full` sont **réservées aux statuts**. Jamais deux
familles de pastilles sur une même ligne : le rôle d'un souscripteur et son
statut en pastilles côte à côte rendaient la ligne illisible, le rôle est
repassé en texte simple.

Cadre blanc `border-foreground/10 bg-white/50` pour le contenu accessible,
cadre gris `border-neutral-300/70 bg-neutral-200/40` pour le contenu
verrouillé. Un contenu débloqué repasse en blanc. Un fond grisé décoratif (fin
de papier, rapports de référence) reste plus clair que ce gris :
`bg-foreground/[0.03]`.

**Pas de carte dans une carte**, et **pas de liseré gauche** (`border-l-[3px]`)
pour signaler une citation ou un chiffre : Hervé les a refusés. Une sous-partie
d'une carte devient un second `SectionTitle` dans la carte.

Citations : carte blanche encadrée, texte en encre, guillemets en `text-brand`
dans la ligne, avec espaces insécables (`«\u00a0…\u00a0»` en français, “…” en
anglais). Chiffre mis en avant : centré, entre deux filets courts, ou dans un
bandeau `border-y` avec séparateurs verticaux.

Corps de texte des fiches en `text-[15px] leading-[1.8] text-neutral-700`,
texte secondaire en `text-sm`. Pas de police à empattements dans les fiches.
Espaces insécables entre un nombre et son unité (« 8 % », « 5,1 Md $ »).

## Couleur

**L'orange de marque ne passe pas en texte sur fond clair.** `--brand`
(#f26404) donne 2,68 de contraste sur la pastille claire et 2,75 sur un fond
orangé à 10 %, en dessous du plancher WCAG AA large de 3,0. La combinaison
validée est le chiffre en `text-marsala` sur `bg-brand/10`, à 11,42.

Calculer le ratio avant de proposer une couleur, pas après.

Le CSS du projet pose qu'il n'y a **qu'une seule tache orange par écran**
(halo du layout). Le filet de l'en-tête de fiche en est une seconde : en tenir
compte en généralisant l'en-tête à toutes les fiches.

## Détails qui ont déjà mordu

- Un lien sortant dont le libellé se termine par une flèche doit être
  `whitespace-nowrap`, sinon la flèche se détache seule en fin de ligne.
- Le titre et la catégorie d'une fiche viennent de la table `documents`, pas
  du code. Sur une fiche on masque leur affichage, on ne les supprime pas :
  ils servent aussi à la liste de la data room.
- Un variant Tailwind ne s'applique pas à une classe CSS maison. `sm:ma-classe`
  ne génère rien, il faut une media query dans `globals.css`.
- Dans une media query qui redéfinit un état animé, redéclarer l'état ouvert
  après l'état fermé : à spécificité égale, c'est l'ordre qui tranche.
- Un contenu qui change au survol doit garder une hauteur fixe (variantes
  empilées dans une même cellule de grille, seule l'active visible). Sinon la
  mise en page bouge sous la souris, le survol se perd et clignote en boucle :
  c'est arrivé sur la carte des taux de la note de marché.
- Une section pleine largeur (`w-screen`) passe sous le fil d'Ariane de la
  note : lui poser `data-note-dark` pour qu'il bascule en clair, et aligner
  son contenu sur `max-w-5xl`.
- Marqueur SVG avec `orient="auto"` : dessiner la pointe vers la droite.
  Dessinée dans le sens du trait, elle tourne deux fois et tombe de côté.
- Le chapô de la note de marché et de Pourquoi Minah vit dans le code, pas en
  base : la base est la production, un texte modifié y part en ligne aussitôt.

## Voix éditoriale

Les anti-patterns d'écriture IA sont dans
`~/Documents/VIBE/3_CONTENT/LINKEDIN/VOICE_GUIDE.md`, pas dans le brandbook,
qui ne traite que du visuel. À appliquer sur toute copie destinée aux
investisseurs : pas de « ce n'est pas X, c'est Y », pas de concepts inventés
du type « Dimension impact : », pas de participiales empilées, pas de
superlatifs non justifiés.
