-- Retrait des tirets cadratins et des points médians dans le contenu des
-- fiches de la data room.
--
-- Pourquoi un script séparé plutôt qu'un rejeu de seed.sql : le seed réécrit
-- l'intégralité des colonnes de tous les documents. S'il y a eu des retouches
-- de contenu directement en base depuis le dernier rejeu, elles seraient
-- perdues. Ce script ne touche que les caractères visés, ligne par ligne, et
-- il est idempotent : le rejouer ne change rien de plus.
--
-- Application (cf. README) :
--   jq -n --rawfile sql supabase/maintenance/2026-09-tirets-cadratins.sql '{query: $sql}' \
--     | curl -s -X POST "https://api.supabase.com/v1/projects/<ref>/database/query" \
--       -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
--       -H "Content-Type: application/json" -d @-
--
-- Vérification :
--   select slug from public.documents
--   where content like '%—%' or content_en like '%—%'
--      or title like '%—%' or title_en like '%—%';

begin;

-- 1. Cas où le tiret introduisait une glose ou une énumération : les
--    deux-points portent mieux que la virgule.
update public.documents set
  content = replace(replace(replace(replace(replace(content,
    '## Côté capital — qui finance',        '## Côté capital : qui finance'),
    '## Côté actifs — qui nous apporte',    '## Côté actifs : qui nous apporte'),
    'Performance bond — couvre',            'Performance bond : couvre'),
    'Assurance défaut de crédit — couvre',  'Assurance défaut de crédit : couvre'),
    'Buffer de calendrier — absorbe',       'Buffer de calendrier : absorbe'),
  content_en = replace(replace(replace(replace(replace(coalesce(content_en, ''),
    '## Capital side — who funds',          '## Capital side: who funds'),
    '## Asset side — who brings us',        '## Asset side: who brings us'),
    'Performance bond — covers',            'Performance bond: covers'),
    'Credit default insurance — covers',    'Credit default insurance: covers'),
    'Schedule buffer — absorbs',            'Schedule buffer: absorbs');

-- 2. Passe générale. Le tiret encadré d'espaces marquait une incise ou une
--    apposition : la virgule le remplace sans perte de sens. Le point médian
--    servait de séparateur d'énumération : même traitement.
update public.documents set
  title      = replace(replace(title,                    ' — ', ', '), ' · ', ', '),
  title_en   = replace(replace(title_en,                 ' — ', ', '), ' · ', ', '),
  category   = replace(replace(category,                 ' — ', ', '), ' · ', ', '),
  category_en= replace(replace(category_en,              ' — ', ', '), ' · ', ', '),
  content    = replace(replace(content,                  ' — ', ', '), ' · ', ', '),
  content_en = replace(replace(content_en,               ' — ', ', '), ' · ', ', ');

-- 3. Les tirets restants (collés, ou en tête de segment) deviennent aussi des
--    virgules, puis on nettoie les doublons de ponctuation que cela produit.
update public.documents set
  title      = replace(replace(title,      '—', ','), '·', ','),
  title_en   = replace(replace(title_en,   '—', ','), '·', ','),
  content    = replace(replace(content,    '—', ','), '·', ','),
  content_en = replace(replace(content_en, '—', ','), '·', ',')
where title like '%—%' or title like '%·%'
   or title_en like '%—%' or title_en like '%·%'
   or content like '%—%' or content like '%·%'
   or content_en like '%—%' or content_en like '%·%';

update public.documents set
  content    = replace(replace(content,    ', ,', ','), ',,', ','),
  content_en = replace(replace(content_en, ', ,', ','), ',,', ','),
  title      = replace(replace(title,      ', ,', ','), ',,', ','),
  title_en   = replace(replace(title_en,   ', ,', ','), ',,', ',');

commit;
