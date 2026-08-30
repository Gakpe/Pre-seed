-- Data room : les documents sont groupés par catégories numérotées.
-- L'ordre des catégories découle du sort_order de leur premier document.

alter table public.documents add column category text not null default 'Divers';

update public.documents set category = 'Overview'     where slug = 'deck-preseed';
update public.documents set category = 'Marché'       where slug = 'note-marche';
update public.documents set category = 'Kupanda'      where slug = 'term-sheet-kupanda';
update public.documents set category = 'Track record' where slug = 'track-record';

update public.documents set sort_order = 20 where slug = 'note-marche';
update public.documents set sort_order = 40 where slug = 'term-sheet-kupanda';
update public.documents set sort_order = 50 where slug = 'track-record';

insert into public.documents (slug, title, docsend_url, visible_to_pending, category, sort_order) values
  ('business-model', 'Business model Minah', 'https://docsend.com/view/placeholder-business-model', false, 'Business model', 30),
  ('memo-kupanda', 'Mémo d''investissement Kupanda', 'https://docsend.com/view/placeholder-memo-kupanda', false, 'Kupanda', 41),
  ('equipe-bios', 'Équipe et bios', 'https://docsend.com/view/placeholder-equipe', true, 'Équipe', 60)
on conflict (slug) do nothing;
