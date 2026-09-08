-- Data room — jeu de documents de référence (idempotent : upsert par slug).
-- docsend_url renseigné → lien DocSend ; sinon content → page interne.
-- access_level 2 = réservé aux investisseurs ayant manifesté un intérêt.
-- Remplacer les URLs placeholder par les vrais liens DocSend.

insert into public.documents (slug, title, docsend_url, visible_to_pending, category, sort_order, access_level, content) values

  ('pourquoi-minah', 'Pourquoi Minah', null, true, 'Overview', 10, 1, 'La première génération de la fintech africaine a gagné la bataille des paiements : M-Pesa, Wave, Flutterwave, Paystack. Les rails sont construits — wallets, KYC, mobile money. La prochaine génération se joue sur l''investissement : comment l''argent travaille, pas seulement comment il circule.

L''opportunité est massive. Les entreprises du continent empruntent en moyenne à plus de 20 % (Zambie 28 %, Ghana 20–30 %, Angola 22 %, Égypte 21 %), pendant que le crédit privé mondial pèse 2 000 milliards de dollars ([Blackstone](https://www.blackstone.com), [Apollo](https://www.apollo.com), [Ares](https://www.aresmgmt.com)) et que les pionniers africains — [TLG Capital](https://www.tlgcapital.com), [Cauris](https://www.caurisfinance.com), [Enko](https://enkocapital.com), [AfricInvest](https://www.africinvest.com) — prouvent le modèle. Les capitaux existent, les rendements existent : il manque le pont.

Minah construit ce pont : la plateforme de dette privée pour l''Afrique. Dette senior sécurisée, coupons fixes, maturités courtes, protection par construction — assurance, couverture de change, collatéral — sur une infrastructure de ce siècle : registre digital, règlement on-chain, opérations pilotées par l''IA.'),

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

update public.documents set content_en = 'African fintech''s first generation won the payments battle: M-Pesa, Wave, Flutterwave, Paystack. The rails are built — wallets, KYC, mobile money. The next generation is about investment: how money works, not just how it moves.

The opportunity is massive. Companies on the continent borrow at more than 20% on average (Zambia 28%, Ghana 20–30%, Angola 22%, Egypt 21%), while global private credit weighs $2 trillion ([Blackstone](https://www.blackstone.com), [Apollo](https://www.apollo.com), [Ares](https://www.aresmgmt.com)) and African pioneers — [TLG Capital](https://www.tlgcapital.com), [Cauris](https://www.caurisfinance.com), [Enko](https://enkocapital.com), [AfricInvest](https://www.africinvest.com) — are proving the model. The capital exists, the returns exist: what is missing is the bridge.

Minah is building that bridge: the private debt platform for Africa. Senior secured debt, fixed coupons, short maturities, protection by design — insurance, currency hedging, collateral — on infrastructure built for this century: digital registry, on-chain settlement, AI-driven operations.' where slug = 'pourquoi-minah';

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
