-- Data room — jeu de documents de référence (idempotent : upsert par slug).
-- docsend_url renseigné → lien DocSend ; sinon content → page interne.
-- access_level 2 = réservé aux investisseurs ayant manifesté un intérêt.
-- Remplacer les URLs placeholder par les vrais liens DocSend.

insert into public.documents (slug, title, docsend_url, visible_to_pending, category, sort_order, access_level, content) values

  ('pourquoi-minah', 'Pourquoi Minah', null, true, 'Overview', 10, 1, 'La première génération de la fintech africaine a gagné la bataille des paiements : M-Pesa, Wave, Flutterwave, Paystack. Les rails sont construits — wallets, KYC, argent mobile-first. La prochaine génération se joue sur l''investissement : comment l''argent travaille, pas seulement comment il circule.

L''opportunité est massive. Les taux bancaires moyens dépassent 20 % sur le continent (Zambie 28 %, Ghana 20–30 %, Angola 22 %, Égypte 21 %), pendant que le crédit privé mondial pèse environ 2 000 milliards de dollars (Blackstone, Apollo, Ares) et que les pionniers africains — TLG Capital, Cauris, Enko, AfricInvest — prouvent le modèle.

Minah construit la plateforme de dette privée pour l''Afrique : dette senior sécurisée, coupons fixes, maturités courtes, protection par construction (assurance, couverture de change, collatéral) — sur une infrastructure de ce siècle : registre digital, règlement on-chain, opérations pilotées par l''IA.'),

  ('deck-preseed', 'Deck pré-seed Minah', 'https://docsend.com/view/placeholder-deck', true, 'Overview', 15, 1, null),

  ('note-marche', 'Note de marché', 'https://docsend.com/view/placeholder-note-marche', false, 'Marché', 20, 1, null),

  ('business-model', 'Business model Minah', 'https://docsend.com/view/placeholder-business-model', false, 'Business model', 30, 1, null),

  ('kupanda-en-bref', 'Kupanda en bref', null, false, 'Kupanda', 40, 1, 'Kupanda est notre première stratégie, déjà en production : financement de PME zambiennes exécutant des contrats gouvernementaux, dans le cadre d''accords avec la République de Zambie, déployé via Africa Rise Ltd (Lusaka).

Termes : 12 mois · coupon fixe 20 % · 500 K€ au dernier closing.

Cinq couches de protection entre le risque et l''investisseur :
1. Performance bond — couvre la sous-performance de la PME.
2. Assurance défaut de crédit — couvre le défaut du payeur.
3. Paiement direct du ministère (lettres d''engagement).
4. Buffer de calendrier — absorbe les retards de paiement jusqu''à 6 semaines.
5. Swap de change ZMW/EUR avec Zanaco.

Dans chaque scénario adverse identifié, les coupons restent inchangés et le principal est protégé.'),

  ('term-sheet-kupanda', 'Term sheet Kupanda', 'https://docsend.com/view/placeholder-term-sheet', false, 'Kupanda', 41, 1, null),

  ('track-record', 'Track record', 'https://docsend.com/view/placeholder-track-record', false, 'Track record', 50, 1, null),

  ('equipe', 'L''équipe', null, true, 'Équipe', 60, 1, 'Julien Gakpe — Co-fondateur & CEO. Ex-Bpifrance, École Polytechnique, Avolta. Pilote la structuration et l''origination.

Hervé Gakpe — Co-fondateur & CFO. ESSEC, SMASH. Débute au Crédit Agricole en financement de projets, puis directeur financier à temps partiel pour plus de 30 startups et PME françaises. Pilote la finance et le reporting investisseurs.

Coralie Lolliot — Co-fondatrice, Ecosystems & Partnerships. Anime le capital-in et le réseau : network builders, brokers, banquiers privés, asset managers.

+8 profils support (tech, communication, legal) — bios disponibles sur demande.'),

  ('la-levee', 'La levée en cours', null, false, 'Levée', 70, 1, 'Nous levons 1,5 M€ en pre-seed pour industrialiser la machine.

Conditions : ticket minimum 100 K€ · recherche d''un lead investisseur à 500 K€ · matching fund de 600 K€ en discussion.

Où nous en sommes : plus de 700 K€ engagés — business angels 200 K€ (committed), tickets écosystème jusqu''à 300 K€ (en discussion). S''y ajoutent environ 500 K$ de soutien non dilutif (grants Stellar Foundation) et 500 K€ de premier closing Kupanda souscrit par 4 HNWIs.

Trajectoire : 15 M€ de volume en phase 1 (MVP, 2 stratégies live), 100 M€ fin 2027, 500 M€ à horizon 2029 — chaque phase finançant la suivante.

Partenaires bancaires et écosystème : Orabank Togo · SIB · Stellar · 50 Partners.'),

  ('risk-deck-kupanda', 'Deck risk Kupanda', 'https://docsend.com/view/placeholder-risk-kupanda', false, 'Gestion des risques', 75, 2, null),

  ('scenarios-risques', 'Scénarios de risque et protections', null, false, 'Gestion des risques', 76, 2, 'Chaque scénario a une réponse pré-câblée. Impact investisseur dans chaque cas identifié : coupons inchangés, principal protégé.

Gouvernement en retard de paiement (≤ 6 semaines) — absorbé par le buffer de calendrier. Aucun impact.

Gouvernement en retard (> 6 semaines) — la Credit Default Insurance s''active. Coupons inchangés.

PME sous-performante sur son contrat — Performance Bond, couvre jusqu''aux 20 % engagés. Coupons inchangés.

Défaut de la PME — CDI + paiement direct du ministère (lettres d''engagement). Principal protégé.

Dépréciation du ZMW face à l''EUR — swap de change avec Zanaco.'),

  ('cap-table', 'Table de capitalisation', 'https://docsend.com/view/placeholder-cap-table', false, 'Documents clés', 80, 2, null),

  ('contrat-cadre-zambie', 'Contrat cadre — République de Zambie', 'https://docsend.com/view/placeholder-contrat-zambie', false, 'Documents clés', 81, 2, null),

  ('pacte-associes', 'Pacte d''associés (draft)', 'https://docsend.com/view/placeholder-pacte', false, 'Documents clés', 82, 2, null)

on conflict (slug) do update set
  title = excluded.title,
  docsend_url = excluded.docsend_url,
  visible_to_pending = excluded.visible_to_pending,
  category = excluded.category,
  sort_order = excluded.sort_order,
  access_level = excluded.access_level,
  content = excluded.content;

-- Nettoyage d'anciens slugs de seed remplacés par le jeu ci-dessus
delete from public.documents where slug in ('memo-kupanda', 'equipe-bios');
