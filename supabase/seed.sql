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

  ('cap-table', 'Table de capitalisation interactive', null, false, 'Documents clés', 80, 2, 'Répartition du capital avant et après le tour pre-seed. Ajustez la valorisation et votre ticket pour visualiser la dilution — chiffres illustratifs, à confirmer avec l''équipe.'),

  ('scenarios-sortie', 'Scénarios de sortie', null, false, 'Documents clés', 83, 2, 'Deux familles de sorties identifiées — brouillon de travail, à affiner avec l''équipe.

Sorties industrielles :
1. Banques panafricaines cherchant une plateforme de crédit digitale clé en main (distribution + infrastructure).
2. Gestionnaires d''actifs globaux (private credit, ~2 000 Md$ d''AUM) voulant une porte d''entrée structurée sur les rendements africains.
3. Fintechs Gen 1 (paiement — rails déjà déployés) intégrant la brique investissement pour monétiser leur base.

Sorties financières :
1. Cession secondaire partielle lors de la série A/B.
2. Rachat par un fonds de private equity une fois la licence d''établissement de crédit obtenue (phase 2 de la roadmap).
3. Le modèle générant du cash (marge sur encours), une politique de distribution est envisageable sans sortie.
4. À long terme, introduction en bourse portée par la liquidité on-chain.'),

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

-- ---------------------------------------------------------------------------
-- Versions anglaises (fallback FR si null)
-- ---------------------------------------------------------------------------

update public.documents set title_en = 'Why Minah' where slug = 'pourquoi-minah';
update public.documents set title_en = 'Minah pre-seed deck' where slug = 'deck-preseed';
update public.documents set title_en = 'Market note' where slug = 'note-marche';
update public.documents set title_en = 'Minah business model' where slug = 'business-model';
update public.documents set title_en = 'Kupanda at a glance' where slug = 'kupanda-en-bref';
update public.documents set title_en = 'Kupanda term sheet' where slug = 'term-sheet-kupanda';
update public.documents set title_en = 'Track record' where slug = 'track-record';
update public.documents set title_en = 'The team' where slug = 'equipe';
update public.documents set title_en = 'The current round' where slug = 'la-levee';
update public.documents set title_en = 'Kupanda risk deck' where slug = 'risk-deck-kupanda';
update public.documents set title_en = 'Risk scenarios and protections' where slug = 'scenarios-risques';
update public.documents set title_en = 'Capitalization table' where slug = 'cap-table';
update public.documents set title_en = 'Framework agreement — Republic of Zambia' where slug = 'contrat-cadre-zambie';
update public.documents set title_en = 'Shareholders'' agreement (draft)' where slug = 'pacte-associes';

update public.documents set content_en = 'African fintech''s first generation won the payments battle: M-Pesa, Wave, Flutterwave, Paystack. The rails are built — wallets, KYC, mobile-first money. The next generation is about investment: how money works, not just how it moves.

The opportunity is massive. Average bank lending rates exceed 20% across the continent (Zambia 28%, Ghana 20–30%, Angola 22%, Egypt 21%), while global private credit weighs about $2 trillion (Blackstone, Apollo, Ares) and African pioneers — TLG Capital, Cauris, Enko, AfricInvest — are proving the model.

Minah is building the private debt platform for Africa: senior secured debt, fixed coupons, short maturities, protection by design (insurance, currency hedging, collateral) — on infrastructure built for this century: digital registry, on-chain settlement, AI-driven operations.' where slug = 'pourquoi-minah';

update public.documents set content_en = 'Kupanda is our first strategy, already live: financing Zambian SMEs executing government contracts, under framework agreements with the Republic of Zambia, deployed through Africa Rise Ltd (Lusaka).

Terms: 12 months · 20% fixed coupon · €500K at the latest closing.

Five layers of protection between the risk and the investor:
1. Performance bond — covers SME underperformance.
2. Credit default insurance — covers payer default.
3. Direct ministry payment (engagement letters).
4. Schedule buffer — absorbs payment delays up to 6 weeks.
5. ZMW/EUR currency swap with Zanaco.

In every identified adverse scenario, coupons remain unchanged and principal is protected.' where slug = 'kupanda-en-bref';

update public.documents set content_en = 'Julien Gakpe — Co-founder & CEO. Ex-Bpifrance, École Polytechnique, Avolta. Leads structuring and origination.

Hervé Gakpe — Co-founder & CFO. ESSEC, SMASH. Started at Crédit Agricole in project finance, then part-time CFO for 30+ French startups and SMEs. Owns finance and investor reporting.

Coralie Lolliot — Co-founder, Ecosystems & Partnerships. Drives capital-in and the network: network builders, brokers, private bankers, asset managers.

+8 support profiles (tech, communication, legal) — bios available on request.' where slug = 'equipe';

update public.documents set content_en = 'We are raising €1.5M in pre-seed to industrialize the machine.

Terms: €100K minimum ticket · looking for a €500K lead investor · €600K matching fund in discussion.

Where we stand: over €700K identified — €200K business angels (committed), up to €300K ecosystem tickets (in discussion). On top: about $500K of non-dilutive support (Stellar Foundation grants) and a €500K Kupanda first closing subscribed by 4 HNWIs.

Trajectory: €15M of volume in phase 1 (MVP, 2 live strategies), €100M by end of 2027, €500M by 2029 — each phase funding the next.

Banking and ecosystem partners: Orabank Togo · SIB · Stellar · 50 Partners.' where slug = 'la-levee';

update public.documents set content_en = 'Every scenario has a pre-wired answer. Investor impact in every identified case: coupons unchanged, principal protected.

Government pays late (≤ 6 weeks) — absorbed by the schedule buffer. No impact.

Government pays late (> 6 weeks) — Credit Default Insurance activates. Coupons unchanged.

SME underperforms on its contract — Performance Bond, covers up to the 20% committed. Coupons unchanged.

SME defaults — CDI + direct ministry payment (engagement letters). Principal protected.

ZMW depreciates against EUR — currency swap with Zanaco.' where slug = 'scenarios-risques';
update public.documents set title_en = 'Exit scenarios' where slug = 'scenarios-sortie';
update public.documents set title_en = 'Interactive cap table' where slug = 'cap-table';
update public.documents set content_en = 'Capital distribution before and after the pre-seed round. Adjust the valuation and your ticket to visualize dilution — illustrative figures, to be confirmed with the team.' where slug = 'cap-table';
update public.documents set content_en = 'Two families of identified exits — working draft, to be refined with the team.

Industrial exits:
1. Pan-African banks looking for a turnkey digital credit platform (distribution + infrastructure).
2. Global asset managers (private credit, ~$2Tn AUM) wanting a structured gateway to African yields.
3. Gen-1 fintechs (payments — rails already deployed) adding the investment layer to monetize their base.

Financial exits:
1. Partial secondary sale at Series A/B.
2. Buyout by a private equity fund once the credit institution licence is obtained (phase 2 of the roadmap).
3. As the model generates cash (margin on outstanding volume), a distribution policy is possible without an exit.
4. Long term, an IPO supported by on-chain liquidity.' where slug = 'scenarios-sortie';

-- Catégories en anglais (fallback FR si null)
update public.documents set category_en = 'Team'            where category = 'Équipe';
update public.documents set category_en = 'The round'       where category = 'Levée';
update public.documents set category_en = 'Market'          where category = 'Marché';
update public.documents set category_en = 'Key documents'   where category = 'Documents clés';
update public.documents set category_en = 'Risk management' where category = 'Gestion des risques';
-- ---------------------------------------------------------------------------
-- Refonte du contenu de la data room (septembre 2026)
-- ---------------------------------------------------------------------------

-- Note de marché : plus de DocSend, une note courte + une bibliographie
-- rendue par le composant MarketReports.
update public.documents set
  docsend_url = null, docsend_url_en = null,
  title = 'Note de marché', title_en = 'Market note',
  content = $$Le crédit est le point de blocage de l'économie africaine, et il l'est pour une raison mécanique.

Les taux bancaires moyens dépassent 20 % sur le continent : 28 % en Zambie, 20 à 30 % au Ghana, 22 % en Angola, 21 % en Égypte. À ces niveaux, une PME rentable ne peut pas emprunter — le coût du capital dépasse sa marge. Et les banques n'ont aucune raison de prêter moins cher : elles trouvent mieux ailleurs, à commencer par la dette souveraine de leur propre pays.

Le résultat est mesuré. Environ 20 % seulement des PME africaines ont accès à un financement formel, et l'IFC chiffre à 331 milliards de dollars le besoin non couvert sur la seule Afrique subsaharienne. Ce n'est pas un déficit de projets. C'est un déficit d'instruments.

Pourquoi la dette, et pas le capital

Le capital-investissement suppose une sortie. Or la profondeur des marchés secondaires africains ne permet pas de la garantir à cinq ans : tout le risque se reporte alors sur une hypothèse de liquidité future, que personne ne contrôle. La dette ne fait pas ce pari. Elle finance l'exécution d'un contrat déjà attribué, sur une maturité courte, avec un remboursement contractuel et des sûretés exécutables devant un tribunal local.

Autrement dit : sur un marché où la sortie est incertaine mais où le besoin de financement est immédiat et solvable, l'instrument juste est celui qui se rembourse, pas celui qui se revend.

Le marché valide cette lecture. Selon l'AVCA, la dette privée est le segment qui progresse le plus vite du capital privé africain, et près de 2 milliards de dollars de fonds de dette doivent se déployer d'ici 2027. À l'échelle mondiale, le crédit privé pèse environ 2 000 milliards de dollars et croît encore à deux chiffres — l'Afrique en est la frontière la moins couverte.

Les sources ci-dessous permettent de vérifier chacun de ces points sans passer par nous.$$,
  content_en = $$Credit is the bottleneck of the African economy, and it is one for a mechanical reason.

Average bank rates exceed 20% across the continent: 28% in Zambia, 20–30% in Ghana, 22% in Angola, 21% in Egypt. At those levels a profitable SME simply cannot borrow — the cost of capital exceeds its margin. And banks have no reason to lend cheaper: they find better returns elsewhere, starting with their own country's sovereign debt.

The outcome is measured. Only around 20% of African SMEs have access to formal financing, and the IFC puts the unmet need at US$331 billion for Sub-Saharan Africa alone. This is not a shortage of projects. It is a shortage of instruments.

Why debt, and not equity

Private equity presupposes an exit. But the depth of African secondary markets cannot guarantee one within five years: all the risk then rests on an assumption of future liquidity that nobody controls. Debt makes no such bet. It funds delivery of an already-awarded contract, over a short maturity, with contractual repayment and securities enforceable before a local court.

Put differently: in a market where exits are uncertain but the financing need is immediate and creditworthy, the right instrument is the one that repays, not the one that resells.

The market bears this out. According to AVCA, private debt is the fastest-growing segment of African private capital, with close to US$2 billion of debt funds due to deploy by 2027. Globally, private credit stands at roughly US$2 trillion and is still growing at double digits — Africa is its least-covered frontier.

The sources below let you verify every one of these points without going through us.$$
where slug = 'note-marche';

-- Business model : plus de DocSend, une mise en contexte + le schéma interactif.
update public.documents set
  docsend_url = null, docsend_url_en = null,
  content = $$Le modèle tient en une phrase : nous transformons un contrat public africain déjà attribué en un instrument de dette souscriptible depuis l'Europe, avec un coupon fixe et une maturité connue à l'entrée.

Le schéma ci-dessous suit l'argent de bout en bout — des investisseurs jusqu'à la PME qui exécute le contrat, puis le chemin par lequel les coupons et le principal remontent. Chaque étage est cliquable et se détaille sous le schéma.$$,
  content_en = $$The model fits in one sentence: we turn an already-awarded African public contract into a debt instrument subscribable from Europe, with a fixed coupon and a maturity known upfront.

The diagram below follows the money end to end — from investors down to the SME delivering the contract, then back up the path coupons and principal take. Each stage is clickable and expands underneath.$$
where slug = 'business-model';

-- Kupanda en bref : bascule vers le DocSend.
update public.documents set
  docsend_url = 'https://docsend.com/view/y2gt5jsqguwf4s8g'
where slug = 'kupanda-en-bref';

-- Track record : plus de DocSend, deux jalons factuels.
update public.documents set
  docsend_url = null, docsend_url_en = null,
  content = $$Deux jalons, pas de promesse.

MVP réalisé. La première stratégie, Kupanda, est passée en production : financement de PME zambiennes exécutant des contrats gouvernementaux, structure de protection complète, premier closing souscrit.

Deuxième MVP confirmé. Près d'un million d'euros investi à ce jour sur les deux opérations, sans incident de remboursement.

La suite : road to 15 M€ de volume déployé. C'est très exactement l'objet de la levée en cours — passer d'une exécution artisanale, mais validée sur le terrain, à une machine industrialisée.$$,
  content_en = $$Two milestones, no promises.

MVP delivered. The first strategy, Kupanda, is in production: financing Zambian SMEs delivering government contracts, with the full protection stack and a first closing subscribed.

Second MVP confirmed. Close to one million euros invested to date across the two operations, with no repayment incident.

What comes next: road to €15M of deployed volume. That is precisely what the current round is for — moving from hand-crafted execution, proven in the field, to an industrialised machine.$$
where slug = 'track-record';

-- Équipe : l'introduction vit en base, les trois portraits dans le composant.
update public.documents set
  content = $$Trois associés, trois moitiés du même problème : trouver l'argent, le structurer, le faire revenir. Aucun des trois n'a découvert le financement d'entreprise chez Minah.$$,
  content_en = $$Three partners, three halves of the same problem: find the money, structure it, get it back. None of the three discovered corporate finance at Minah.$$
where slug = 'equipe';

-- La levée en cours : on ajoute le paysage concurrentiel et l'horizon de sortie.
update public.documents set
  content = $$Nous levons 1,5 M€ en pre-seed pour industrialiser la machine.

Conditions : ticket minimum 100 K€ · recherche d'un lead investisseur à 500 K€ · matching fund de 600 K€ en discussion.

Où nous en sommes : plus de 700 K€ engagés — business angels 200 K€ (committed), tickets écosystème jusqu'à 300 K€ (en discussion). S'y ajoutent environ 500 K$ de soutien non dilutif (grants Stellar Foundation) et 500 K€ de premier closing Kupanda souscrit par 4 HNWIs.

Trajectoire : 15 M€ de volume en phase 1 (MVP, 2 stratégies live), 100 M€ fin 2027, 500 M€ à horizon 2029 — chaque phase finançant la suivante.

Partenaires bancaires et écosystème : Orabank Togo · SIB · Stellar · 50 Partners.

Le paysage, et où nous nous situons

Les pionniers de la dette privée africaine — TLG Capital, Cauris, Enko, AfricInvest — ont démontré que la classe d'actifs tient. Ils opèrent en fonds institutionnels : tickets larges, souscription réservée, horizon long, infrastructure opérationnelle classique.

Notre différence n'est pas la thèse, c'est le format. Nous descendons le ticket d'entrée à 100 K€, nous adossons chaque souscription à une stratégie identifiée plutôt qu'à un fonds aveugle, et nous portons le registre en digital avec règlement on-chain. C'est ce qui rend accessible à un family office ou à un banquier privé une classe d'actifs jusqu'ici réservée aux institutionnels.

À l'échelle mondiale, les mêmes mécaniques ont produit Blackstone, Apollo et Ares sur un marché du crédit privé d'environ 2 000 Md$. Ce mouvement n'a pas encore eu lieu en Afrique : c'est la fenêtre.

Et la dynamique joue pour nous. Les banques du continent se retirent du crédit PME, les fonds de dette prennent le relais, et l'AVCA mesure la dette privée comme le segment le plus dynamique du capital privé africain. Nous arrivons avec une stratégie déjà en production — pas avec une intention.

Horizon de sortie

Deux familles, détaillées dans la fiche « Scénarios de sortie » au niveau 2.

Sorties industrielles. Les banques panafricaines à la recherche d'une plateforme de crédit digitale clé en main, distribution et infrastructure comprises. Les gérants d'actifs mondiaux du crédit privé — un marché d'environ 2 000 Md$ — qui veulent une porte d'entrée structurée sur les rendements africains. Les fintechs de première génération, celles qui ont gagné les paiements, qui ajoutent la couche investissement pour monétiser leur base.

Sorties financières. Cession secondaire partielle en Série A ou B. Rachat par un fonds de private equity une fois la licence d'établissement de crédit obtenue. Et comme le modèle génère de la marge sur encours, une politique de distribution reste possible sans sortie.$$,
  content_en = $$We are raising €1.5M in pre-seed to industrialise the machine.

Terms: €100K minimum ticket · seeking a €500K lead investor · €600K matching fund in discussion.

Where we stand: over €700K committed — €200K from business angels (committed), ecosystem tickets up to €300K (in discussion). On top of that, around US$500K of non-dilutive support (Stellar Foundation grants) and a €500K Kupanda first closing subscribed by 4 HNWIs.

Trajectory: €15M of volume in phase 1 (MVP, 2 live strategies), €100M by end of 2027, €500M by 2029 — each phase funding the next.

Banking and ecosystem partners: Orabank Togo · SIB · Stellar · 50 Partners.

The landscape, and where we sit

The pioneers of African private debt — TLG Capital, Cauris, Enko, AfricInvest — have proven the asset class works. They operate as institutional funds: large tickets, restricted subscription, long horizons, conventional operating infrastructure.

Our difference is not the thesis, it is the format. We bring the entry ticket down to €100K, we back every subscription with an identified strategy rather than a blind pool, and we run the registry digitally with on-chain settlement. That is what opens to a family office or a private banker an asset class so far reserved for institutions.

Globally, the same mechanics produced Blackstone, Apollo and Ares on a private credit market of roughly US$2 trillion. That shift has not happened in Africa yet — that is the window.

And the dynamic works in our favour. Banks across the continent are retreating from SME lending, debt funds are stepping in, and AVCA measures private debt as the most dynamic segment of African private capital. We arrive with a strategy already in production — not with an intention.

Exit horizon

Two families, detailed in the "Exit scenarios" document at level 2.

Industrial exits. Pan-African banks looking for a turnkey digital credit platform, distribution and infrastructure included. Global private credit asset managers — a roughly US$2 trillion market — wanting a structured gateway to African yields. First-generation fintechs, the ones that won payments, adding the investment layer to monetise their base.

Financial exits. Partial secondary sale at Series A or B. Buyout by a private equity fund once the credit institution licence is obtained. And since the model generates margin on outstanding volume, a distribution policy remains possible without an exit.$$
where slug = 'la-levee';
update public.documents set
  content    = replace(content,    'Pourquoi la dette, et pas le capital', '## Pourquoi la dette, et pas le capital'),
  content_en = replace(content_en, 'Why debt, and not equity',             '## Why debt, and not equity')
where slug = 'note-marche';

update public.documents set
  content = replace(replace(content,
              'Le paysage, et où nous nous situons', '## Le paysage, et où nous nous situons'),
              'Horizon de sortie',                   '## Horizon de sortie'),
  content_en = replace(replace(content_en,
              'The landscape, and where we sit',     '## The landscape, and where we sit'),
              'Exit horizon',                        '## Exit horizon')
where slug = 'la-levee';
update public.documents set
  content    = replace(content,    ' sur les deux opérations, sans incident de remboursement.', ' sur les deux opérations.'),
  content_en = replace(content_en, ' across the two operations, with no repayment incident.', ' across the two operations.')
where slug = 'track-record';
-- Refonte de la fiche « Pourquoi Minah » (septembre 2026)
update public.documents set
  title = 'Pourquoi Minah', title_en = 'Why Minah',
  content = $doc$**L'Afrique n'a pas un problème de croissance. Elle a un problème d'infrastructure financière.**

---

## Le constat

Le continent concentre la démographie et la croissance des trente prochaines années. Son infrastructure financière, elle, est restée calibrée pour un autre marché.

Nous avons construit Minah depuis les deux côtés de cette fracture : la finance et la sphère publique. Des deux côtés, le même constat s'impose — l'écart n'est pas entre le potentiel économique du continent et sa demande de capital, mais entre cette demande et **la capacité à la structurer** pour qu'elle soit finançable.

Le capital existe. Les projets existent. Ce qui manque, c'est la couche qui les rend lisibles l'un pour l'autre.

## La thèse

**La première génération de fintech africaine a résolu le mouvement de l'argent.** M-Pesa, Wave, Flutterwave, Paystack : faire circuler la valeur, à bas coût, à l'échelle. Un problème d'infrastructure, résolu.

**La deuxième génération résoudra son usage.** Non plus déplacer l'argent, mais bien l'employer : le structurer, le tarifer, l'allouer, le tracer. C'est le passage du paiement à l'investissement.

C'est là que se situe Minah. Nous ne construisons pas un rail de transfert de plus. Nous construisons la couche de structuration financière qui permet au capital international d'atteindre l'économie réelle africaine, avec les standards de traçabilité et de reporting qu'exige un investisseur institutionnel.

## L'opportunité

**Les PME africaines empruntent à ~20 % en moyenne.** Un niveau sans rapport avec le risque réel des meilleurs dossiers — contrats publics sécurisés, revenus récurrents, contreparties solides.

**La théorie des taux d'intérêt décrit ce qui devrait suivre.** Un différentiel de rendement de cette ampleur, à risque comparable, appelle un afflux de capitaux vers le marché le mieux rémunéré, jusqu'à ce que la concurrence entre prêteurs comprime l'écart. C'est le mécanisme de convergence qui a joué sur tous les marchés émergents avant celui-ci.

**Si ce mouvement ne s'est pas encore produit, c'est à cause de l'asymétrie d'information.** Le prêteur international ne dispose pas des données qui lui permettraient de distinguer un bon dossier d'un mauvais : historiques fragmentaires, absence de reporting standardisé, aucun suivi possible à distance. Face à cette asymétrie, il ne tarife pas le risque — il l'évite, ou le surtarife massivement. Le 20 % n'est donc pas le prix du risque réel : c'est le prix de l'opacité.

**Réduire cette asymétrie est notre métier.** Structuration contractuelle, scoring propriétaire nourri par les données locales (mobile money, historiques de paiement, contreparties publiques), suivi continu et traçabilité on-chain : nous produisons l'information qui manquait, et nous l'assortissons d'une **gestion du risque de niveau institutionnel** — sélection, garanties, assurance-crédit, réserve de liquidité, diversification par pays et par secteur.

Notre positionnement en découle directement : **nous connectons des actifs africains correctement structurés et correctement notés aux marchés de capitaux, y compris on-chain**, où la traçabilité est native et la fiabilité vérifiable en continu.

La convergence des taux aura lieu. La question n'est pas de savoir si, mais qui aura construit l'infrastructure d'information qui la déclenche — et capté la valeur de l'écart pendant qu'il se referme.

## La conviction technologique

On ne construit pas l'infrastructure financière de 2035 avec les outils de 2010.

Deux choix technologiques structurent notre architecture :

- **La blockchain**, pour la traçabilité et la fiabilité de la transaction. Un investisseur doit pouvoir vérifier, et non croire.
- **L'IA**, intégrée à nos process d'analyse, de scoring et d'exécution. C'est notre principal levier contre l'asymétrie d'information : elle nous permet de collecter, structurer et actualiser en continu la donnée d'un marché fragmenté, avec une équipe resserrée et sans dégrader la qualité de l'analyse.

Ce n'est pas une posture d'innovation. C'est ce qui rend l'économie de notre modèle possible : un coût marginal d'analyse et de structuration suffisamment bas pour adresser un marché que la finance traditionnelle juge trop coûteux à servir.

---

## Pourquoi le nom Minah

Le mina est une langue éwé, parlée dans le sud du Togo.

**Parler mina, c'est faire affaire.** Notre métier consiste à permettre à des investisseurs qui ne parlent pas mina de faire des affaires avec ceux qui le parlent — de traduire des opportunités locales en actifs investissables depuis Paris, Londres ou Dubaï.

**Une langue, plusieurs frontières.** Le mina est parlé au Togo, au Bénin et au Ghana. Il dessine une géographie de peuples et d'échanges, pas de frontières héritées. C'est aussi ainsi que nous regardons le marché.

**Et « mina » veut dire donner.** Apporter, transmettre, mettre à disposition. Difficile de trouver un mot plus juste pour une société dont le métier est d'acheminer du capital là où il crée de la valeur.$doc$,
  content_en = $doc$**Africa does not have a growth problem. It has a financial infrastructure problem.**

---

## The observation

The continent holds the demographics and the growth of the next thirty years. Its financial infrastructure, meanwhile, is still calibrated for a different market.

We built Minah from both sides of that divide: finance and the public sphere. From both sides the same conclusion imposes itself — the gap is not between the continent's economic potential and its demand for capital, but between that demand and **the ability to structure it** so that it becomes financeable.

The capital exists. The projects exist. What is missing is the layer that makes them legible to one another.

## The thesis

**African fintech's first generation solved the movement of money.** M-Pesa, Wave, Flutterwave, Paystack: moving value, at low cost, at scale. An infrastructure problem, solved.

**The second generation will solve its use.** No longer moving money, but putting it to work: structuring it, pricing it, allocating it, tracing it. This is the shift from payments to investment.

That is where Minah sits. We are not building one more transfer rail. We are building the financial structuring layer that lets international capital reach the African real economy, with the traceability and reporting standards an institutional investor requires.

## The opportunity

**African SMEs borrow at around 20% on average.** A level unrelated to the actual risk of the best files — secured public contracts, recurring revenue, solid counterparties.

**Interest rate theory describes what should follow.** A yield differential of that magnitude, at comparable risk, calls capital toward the better-paying market until competition among lenders compresses the spread. It is the convergence mechanism that has played out in every emerging market before this one.

**If that movement has not happened yet, it is because of information asymmetry.** The international lender does not have the data that would let it tell a good file from a bad one: fragmentary track records, no standardised reporting, no way to monitor from a distance. Faced with that asymmetry it does not price risk — it avoids it, or prices it far above. The 20% is therefore not the price of the actual risk: it is the price of opacity.

**Reducing that asymmetry is our business.** Contractual structuring, proprietary scoring fed by local data (mobile money, payment histories, public counterparties), continuous monitoring and on-chain traceability: we produce the information that was missing, and we pair it with **institutional-grade risk management** — selection, guarantees, credit insurance, liquidity reserve, diversification by country and by sector.

Our positioning follows directly: **we connect properly structured and properly rated African assets to the capital markets, including on-chain**, where traceability is native and reliability continuously verifiable.

Rate convergence will happen. The question is not whether, but who will have built the information infrastructure that triggers it — and captured the value of the spread while it closes.

## The technology conviction

You do not build the financial infrastructure of 2035 with the tools of 2010.

Two technology choices structure our architecture:

- **Blockchain**, for the traceability and reliability of the transaction. An investor must be able to verify, not to believe.
- **AI**, embedded in our analysis, scoring and execution processes. It is our main lever against information asymmetry: it lets us collect, structure and continuously refresh the data of a fragmented market, with a small team and without degrading the quality of the analysis.

This is not an innovation posture. It is what makes the economics of our model possible: a marginal cost of analysis and structuring low enough to address a market that traditional finance considers too expensive to serve.

---

## Why the name Minah

Mina is an Ewe language, spoken in southern Togo.

**To speak Mina is to do business.** Our business is to let investors who do not speak Mina do business with those who do — to turn local opportunities into assets investable from Paris, London or Dubai.

**One language, several borders.** Mina is spoken in Togo, Benin and Ghana. It traces a geography of peoples and exchange, not of inherited borders. That is also how we read the market.

**And “mina” means to give.** To bring, to pass on, to make available. Hard to find a truer word for a company whose business is to channel capital where it creates value.$doc$
where slug = 'pourquoi-minah';
-- Nouvelle fiche « gestion du risque » : la cascade de protections, niveau par
-- niveau. Le corps de la page (cascade, bandeau de résistance, clôture) est
-- rendu par des composants ; seul le chapô vit ici.
insert into public.documents
  (slug, title, title_en, category, category_en, access_level, sort_order,
   visible_to_pending, docsend_url, content)
values (
  'gestion-du-risque',
  'Une architecture de risque, niveau par niveau',
  'A risk architecture, level by level',
  'Gestion des risques', 'Risk management',
  2, 74, false, null,
  $doc$Notre métier n'est pas de prêter. C'est de concevoir des stratégies de dette senior dont l'architecture de risque est calibrée sur les réalités du terrain : la nature de la contrepartie, le droit applicable, la devise, et la façon dont l'argent circule réellement dans la région.

Chaque stratégie a donc sa propre cascade de protections. Le principe, lui, ne change pas : une perte doit franchir plusieurs barrières avant d'atteindre le coupon de nos souscripteurs.

Ci-dessous, la cascade de la stratégie Kupanda, où la contrepartie finale est un État.$doc$
)
on conflict (slug) do update set
  title = excluded.title, title_en = excluded.title_en,
  category = excluded.category, category_en = excluded.category_en,
  access_level = excluded.access_level, sort_order = excluded.sort_order,
  docsend_url = excluded.docsend_url, content = excluded.content;
-- Chapô de la fiche « business model ». Le corps (schéma de flux, panneau de
-- détail, blocs risque et traçabilité) est rendu par des composants.
update public.documents set
  content = $doc$Le modèle tient en une phrase : nous transformons un contrat public africain déjà attribué en un instrument de dette souscriptible depuis l'Europe, avec un coupon fixe et une maturité connue à l'entrée.

Le schéma ci-dessous suit l'argent de bout en bout — des souscripteurs jusqu'à la PME qui exécute le contrat, puis le chemin par lequel les coupons et le principal remontent. Il montre surtout les deux seuls moments où nous nous rémunérons : à la souscription, sur le flux entrant, et sur la performance, prélevée sur le flux de retour. Survolez un nœud ou une pastille pour le détail.$doc$,
  content_en = $doc$The model fits in one sentence: we turn an already-awarded African public contract into a debt instrument subscribable from Europe, with a fixed coupon and a maturity known upfront.

The diagram below follows the money end to end — from subscribers down to the SME delivering the contract, then back up the path coupons and principal take. Above all it shows the only two moments at which we are paid: at subscription, on the inbound flow, and on performance, taken from the return flow. Hover a node or a pill for detail.$doc$
where slug = 'business-model';
-- La note de marché devient un objet de lecture : chapô en base, raisonnement
-- en trois temps et visualisations rendus par des composants.
update public.documents set
  title = 'Pourquoi la dette, et pourquoi maintenant',
  title_en = 'Why debt, and why now',
  content = $doc$L'Afrique est le continent où le capital est le plus rare et le plus cher. C'est aussi celui où l'on parle le plus d'equity.

Cette note explique pourquoi nous pensons que l'opportunité des dix prochaines années est ailleurs — dans la dette privée structurée — et pourquoi la fenêtre est ouverte maintenant.$doc$,
  content_en = $doc$Africa is the continent where capital is scarcest and most expensive. It is also the one where equity is discussed the most.

This note sets out why we believe the opportunity of the next ten years lies elsewhere — in structured private debt — and why the window is open now.$doc$
where slug = 'note-marche';
