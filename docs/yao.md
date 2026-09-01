# Intégration Yao — portail investisseurs Minah

Yao (Chief of Staff) se connecte à la base Supabase du portail avec la **clé
service role** (`SUPABASE_SERVICE_ROLE_KEY`, la clé `sb_secret_...` du projet
`nuzklwegigoykemeznzw`). Cette clé bypasse RLS : lecture de tout, écriture
possible — par convention Yao ne modifie que `investors.status` et
`notifications.processed_at`.

API REST : `https://nuzklwegigoykemeznzw.supabase.co/rest/v1/`
Headers : `apikey: <clé service>` et `Authorization: Bearer <clé service>`.

## 1. Alertes WhatsApp — poll de la table `notifications`

Les triggers Postgres remplissent la file `notifications`. Le **débounce est
déjà géré côté base** (max une alerte « bavarde » par investisseur toutes les
30 min ; inscription, clic DocSend et manifestation d'intérêt passent
toujours). Yao n'a qu'à :

1. Toutes les minutes, lire les non-traitées :
   ```
   GET /rest/v1/notifications?processed_at=is.null&order=id.asc
   ```
2. Envoyer chaque `message` (déjà formaté, ex.
   `📄 Julien Gakpe (w3i.fund) a ouvert « Term sheet Kupanda »`) sur WhatsApp.
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

## 2. Actions — bloquer / rétablir un accès

Les inscriptions sont **auto-approuvées**. Si Julien répond « bloquer » à une
alerte :

```
PATCH /rest/v1/investors?id=eq.<investor_id>
body: {"status": "blocked"}          # rétablir : {"status": "approved"}
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
