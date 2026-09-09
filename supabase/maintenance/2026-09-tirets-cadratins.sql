-- Retrait des tirets cadratins dans le contenu des fiches de la data room.
--
-- Pourquoi un script séparé plutôt qu'un rejeu de seed.sql : le seed réécrit
-- l'intégralité des colonnes de tous les documents. S'il y a eu des retouches
-- de contenu directement en base depuis le dernier rejeu, elles seraient
-- perdues. Ce script ne touche que le caractère visé, ligne par ligne, et il
-- est idempotent : le rejouer ne change rien de plus.
--
-- Application (cf. README) :
--   jq -n --rawfile sql supabase/maintenance/2026-09-tirets-cadratins.sql '{query: $sql}' \
--     | curl -s -X POST "https://api.supabase.com/v1/projects/<ref>/database/query" \
--       -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
--       -H "Content-Type: application/json" -d @-
--
-- Vérification avant / après :
--   select slug from public.documents where content like '%—%' or content_en like '%—%';

begin;

-- 1. Cas où le tiret introduisait une énumération : deux-points plutôt que virgule.
update public.documents set
  content = replace(content,
    'Les rails sont construits — wallets, KYC, argent mobile-first.',
    'Les rails sont construits : wallets, KYC, argent mobile-first.'),
  content_en = replace(content_en,
    'The rails are built — wallets, KYC, mobile-first money.',
    'The rails are built: wallets, KYC, mobile-first money.')
where slug = 'pourquoi-minah';

update public.documents set
  content = replace(content,
    'des meilleurs dossiers — contrats publics sécurisés, revenus récurrents, contreparties solides.',
    'des meilleurs dossiers : contrats publics sécurisés, revenus récurrents, contreparties solides.'),
  content_en = replace(content_en,
    'of the best files, secured public contracts, recurring revenue, solid counterparties.',
    'of the best files: secured public contracts, recurring revenue, solid counterparties.')
where slug = 'pourquoi-minah';

update public.documents set
  content = replace(content,
    'il ne tarife pas le risque — il l''évite, ou le surtarife massivement.',
    'il ne tarife pas le risque : il l''évite, ou le surtarife massivement.'),
  content_en = replace(content_en,
    'it does not price risk, it avoids it, or prices it far above.',
    'it does not price risk: it avoids it, or prices it far above.')
where slug = 'pourquoi-minah';

update public.documents set
  content = replace(content,
    'gestion du risque de niveau institutionnel** — sélection, garanties, assurance-crédit,',
    'gestion du risque de niveau institutionnel** : sélection, garanties, assurance-crédit,')
where slug = 'pourquoi-minah';

update public.documents set
  content = replace(content,
    'l''infrastructure d''information qui la déclenche — et capté la valeur de l''écart',
    'l''infrastructure d''information qui la déclenche, et capté la valeur de l''écart')
where slug = 'pourquoi-minah';

-- 2. Passe générale sur les documents restants.
--    Le tiret encadré d'espaces marquait une incise ou une apposition : la
--    virgule le remplace sans perte de sens.
update public.documents
set content    = replace(content,    ' — ', ', '),
    content_en = replace(content_en, ' — ', ', ')
where content like '%—%' or content_en like '%—%';

-- 3. Les tirets restants (collés, ou en tête de segment) deviennent aussi des
--    virgules, puis on nettoie les doublons de ponctuation que cela produit.
update public.documents
set content    = replace(content,    '—', ','),
    content_en = replace(content_en, '—', ',')
where content like '%—%' or content_en like '%—%';

update public.documents
set content    = replace(replace(content,    ', ,', ','), ',,', ','),
    content_en = replace(replace(content_en, ', ,', ','), ',,', ',');

commit;
