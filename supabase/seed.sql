-- Documents factices pour le développement.
-- Remplacer les URLs par les vrais liens DocSend.

insert into public.documents (slug, title, docsend_url, visible_to_pending, sort_order) values
  ('deck-preseed', 'Deck pré-seed Minah', 'https://docsend.com/view/placeholder-deck', true, 10),
  ('term-sheet-kupanda', 'Term sheet Kupanda', 'https://docsend.com/view/placeholder-term-sheet', false, 20),
  ('track-record', 'Track record', 'https://docsend.com/view/placeholder-track-record', false, 30),
  ('note-marche', 'Note de marché', 'https://docsend.com/view/placeholder-note-marche', false, 40)
on conflict (slug) do nothing;
