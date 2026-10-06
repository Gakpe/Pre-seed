-- Onboarding sur mesure.
--
-- Par défaut, tout investisseur validé reçoit le même accueil : le deck,
-- l'équipe, puis la manifestation d'intérêt qui ouvre le niveau 2. Pour une
-- personne dont on connaît les interrogations, une ligne de cette table
-- remplace cet accueil : un message à son intention, les fiches mises en avant
-- (dans l'ordre), et les fiches qu'on lui ouvre au-dessus de son niveau.
--
-- Clé par email, comme les pré-approuvés : l'onboarding se prépare avant la
-- première connexion, quand la ligne investors n'existe pas encore.

begin;

create table public.onboardings (
  email text primary key check (email = lower(btrim(email))),
  -- Message d'accueil ; l'anglais retombe sur le français s'il est vide.
  message_fr text,
  message_en text,
  -- Slugs de documents mis en avant à l'accueil, dans l'ordre affiché.
  focus_slugs text[] not null default '{}',
  -- Slugs ouverts à cette personne quel que soit leur niveau d'accès.
  unlocked_slugs text[] not null default '{}',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Aucune policy : lecture et écriture par le serveur (service role) seulement.
alter table public.onboardings enable row level security;

-- Vrai si la fiche est ouverte à l'investisseur connecté par son onboarding.
-- security definer : la policy des documents s'évalue avec les droits de
-- l'investisseur, qui ne lit pas la table onboardings.
create or replace function public.document_unlocked_for_me(p_slug text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.investors i
    join public.onboardings o on o.email = lower(btrim(i.email))
    where i.id = (select auth.uid())
      and i.status = 'approved'
      and p_slug = any (o.unlocked_slugs)
  );
$$;

revoke all on function public.document_unlocked_for_me(text) from public;
grant execute on function public.document_unlocked_for_me(text) to authenticated;

-- Même règle que 20260830000006_level2_access, plus l'ouverture individuelle.
drop policy documents_select_by_status on public.documents;

create policy documents_select_by_status on public.documents
  for select to authenticated
  using (
    exists (
      select 1 from public.investors i
      where i.id = (select auth.uid())
        and (
          (
            i.status = 'approved'
            and (documents.access_level = 1 or i.level2_access)
          )
          or (
            i.status = 'pending'
            and documents.visible_to_pending
            and documents.access_level = 1
          )
        )
    )
    or public.document_unlocked_for_me(documents.slug)
  );

commit;
