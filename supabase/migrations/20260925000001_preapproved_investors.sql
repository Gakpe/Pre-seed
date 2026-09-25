-- Pré-approbation des inscriptions.
--
-- Un investisseur déjà connu de l'équipe (base Minah_OS, partie levée) n'a pas
-- à attendre une validation manuelle : s'il s'inscrit avec un email de cette
-- liste, son compte est approuvé à la création et il entre dès la première
-- connexion. Les autres restent en attente, comme depuis le 14 septembre.
--
-- La liste vit ici, dans le portail : un trigger ne peut pas interroger une
-- autre base. Elle se remplit depuis /admin/pre-approuves, ou par une
-- synchronisation depuis Minah_OS (source = 'minah_os').

create table public.preapproved_investors (
  email text primary key check (email = lower(btrim(email))),
  source text not null default 'admin' check (source in ('admin', 'minah_os')),
  note text,
  created_at timestamptz not null default now()
);

-- Aucune policy : lecture et écriture par le serveur (service role) seulement.
alter table public.preapproved_investors enable row level security;

create or replace function public.is_preapproved(p_email text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.preapproved_investors
    where email = lower(btrim(p_email))
  );
$$;

-- Création de la ligne investors à la confirmation de l'email (magic link) :
-- même fonction qu'à l'origine, le statut en plus.
create or replace function public.handle_confirmed_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.investors (id, email, full_name, entity, ref, status)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'entity', ''),
    nullif(new.raw_user_meta_data ->> 'ref', ''),
    (case when public.is_preapproved(new.email) then 'approved' else 'pending' end)::public.investor_status
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- L'alerte d'inscription dit si l'accès est déjà ouvert ou s'il y a une
-- validation à faire. Le statut voyage dans le payload pour le worker.
create or replace function public.notify_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform queue_notification(
    new.id,
    'signup',
    case when new.status = 'approved'
      then '📥 Nouvelle inscription, pré-approuvée, accès ouvert : '
      else '📥 Nouvelle inscription à valider : '
    end
      || investor_label(new)
      || ', @' || coalesce(new.email_domain, '?')
      || coalesce(' · ref ' || new.ref, ''),
    jsonb_build_object(
      'email', new.email,
      'entity', new.entity,
      'ref', new.ref,
      'status', new.status
    )
  );
  return new;
end;
$$;

-- Un email ajouté à la liste alors que la personne attend déjà : on ouvre
-- dans la foulée, sans repasser par la file de validation.
create or replace function public.approve_preapproved_pending()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.investors
  set status = 'approved'
  where lower(email) = new.email and status = 'pending';
  return new;
end;
$$;

create trigger on_preapproved_insert
  after insert on public.preapproved_investors
  for each row execute function public.approve_preapproved_pending();
