-- Une entrée de data room mène soit vers DocSend (docsend_url), soit vers une
-- page interne de contexte (content, texte affiché sur /investors/docs/[slug]).

alter table public.documents alter column docsend_url drop not null;
alter table public.documents add column content text;
