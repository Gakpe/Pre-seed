# Intégration Yao — portail investisseurs Minah

Yao (Chief of Staff) se connecte à la base Supabase du portail avec la **clé
service role** (`SUPABASE_SERVICE_ROLE_KEY`, la clé `sb_secret_...` du projet
`nuzklwegigoykemeznzw`). Cette clé bypasse RLS : lecture de tout, écriture
possible — par convention Yao ne modifie que `investors.status` et
`notifications.processed_at`.

API REST : `https://nuzklwegigoykemeznzw.supabase.co/rest/v1/`
Headers : `apikey: <clé service>` et `Authorization: Bearer <clé service>`.

## État au 14 septembre 2026

Les triggers tournent et remplissent la file depuis le 30 août : 14 alertes ont
été produites. Aucune n'a jamais été consommée, faute de client côté Yao. Elles
ont toutes été marquées `processed_at` à cette date, de façon que le premier
poll ne déverse pas deux semaines d'historique d'un coup. **La file repart de
zéro : tout ce qui s'y trouvera désormais est du neuf.**

Côté Yao (dépôt GAK_OS), rien n'est encore branché : `.env.local` n'y connaît
que `MINAH_GITHUB_*`, pas le Supabase du portail.

## 1. Alertes — poll de la table `notifications`

Comme Yao tourne sur la machine de Julien, le poll se fait par un worker local,
sur le modèle de `scripts/slack-worker.mjs` et de son plist launchd, plutôt que
par un cron Vercel dont la granularité est journalière.

### Où va chaque alerte

| Alerte | Telegram | Slack |
| --- | --- | --- |
| `signup`, `first_login` | oui | **oui** |
| `interest`, `question` | oui | non |
| `docsend_click`, `long_session`, `return_visit` | oui | non |

**Telegram** est le canal par défaut, celui de la conversation avec Yao. Il est
déjà câblé : Yao est le capitaine `minah`, et `sendCaptainMessage('minah',
message)` de GAK_OS fait le travail.

**Slack** reçoit en plus les deux alertes qui disent qu'un investisseur vient
d'arriver, `signup` et `first_login` : ce sont les seules que l'équipe doit
voir sans passer par la conversation privée de Julien. Poste via
`chat.postMessage` avec le `SLACK_BOT_TOKEN` déjà utilisé par le slack-worker,
sur le canal défini par `SLACK_INVESTORS_CHANNEL`.

Un investisseur qui s'inscrit puis se connecte dans la foulée produit les deux
alertes. Les dédoublonner n'a pas d'intérêt : `signup` porte l'entité et le
`ref`, `first_login` dit qu'il est effectivement entré.

### Règles du worker

- Marquer `processed_at` **après** l'envoi réussi, jamais avant : une panne
  Telegram ou Slack ne doit pas faire disparaître une alerte.
- Traiter par `id` croissant, une alerte à la fois, pour garder l'ordre.
- Machine endormie : les alertes s'accumulent en base et partent au réveil.
  C'est le comportement voulu, rien ne se perd.


Les triggers Postgres remplissent la file `notifications`. Le **débounce est
déjà géré côté base** (max une alerte « bavarde » par investisseur toutes les
30 min ; inscription, clic DocSend et manifestation d'intérêt passent
toujours). Yao n'a qu'à :

1. Toutes les minutes, lire les non-traitées :
   ```
   GET /rest/v1/notifications?processed_at=is.null&order=id.asc
   ```
2. Envoyer chaque `message` (déjà formaté, ex.
   `📄 Julien Gakpe (w3i.fund) a ouvert « Term sheet Kupanda »`) sur Telegram.
3. Marquer traité :
   ```
   PATCH /rest/v1/notifications?id=in.(1,2,3)
   body: {"processed_at": "now()"}
   ```

Types d'alertes (`kind`) : `signup` (nouvelle inscription — nom, entité,
domaine email, ref), `interest` (manifestation d'intérêt pour une tranche →
débloque le niveau 2 de la data room), `question` (question posée via le
widget — texte complet dans la table `questions`), `first_login`,
`docsend_click`, `long_session` (session > 5 min, une alerte par session),
`return_visit` (retour après plus de 7 jours). `payload` (jsonb) contient le
détail brut.

## 2. Actions — bloquer un accès, ouvrir le niveau 2

Les inscriptions sont **auto-approuvées**. Si Julien répond « bloquer » à une
alerte :

```
PATCH /rest/v1/investors?id=eq.<investor_id>
body: {"status": "blocked"}          # rétablir : {"status": "approved"}
```

L'ouverture du **niveau 2** de la data room est validée manuellement : sur une
alerte `interest`, si Julien répond « ok » (ou « ouvre ») :

```
PATCH /rest/v1/investors?id=eq.<investor_id>
body: {"level2_access": true}        # retirer : {"level2_access": false}
```

L'`investor_id` est dans chaque notification.

## 3. Questions en contexte

Tables lisibles : `investors` (profil, statut, tags, ref, intérêt,
last_seen_at), `events` (navigation : page_view / page_leave avec duration_ms
et scroll_depth / docsend_click / cta_click / login), `documents`.

Exemples :

- « Qui a visité cette semaine ? »
  ```
  GET /rest/v1/investors?last_seen_at=gte.<il_y_a_7j>&order=last_seen_at.desc
  ```
- « Qu'est-ce qu'Osa a regardé ? » — retrouver son id puis :
  ```
  GET /rest/v1/events?investor_id=eq.<id>&order=created_at.desc&limit=100
  ```
  (les `page_leave` portent la durée par page, les `docsend_click` les
  documents ouverts)
- « Qui a manifesté un intérêt ? »
  ```
  GET /rest/v1/investors?interest_expressed_at=not.is.null&select=full_name,entity,interest_tranche,interest_expressed_at
  ```

## Notes

- Région EU (RGPD). Ne pas exfiltrer les données hors des réponses à Julien.
- Un webhook direct remplacera le polling plus tard.
