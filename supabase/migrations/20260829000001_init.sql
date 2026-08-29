-- Minah investor portal — schéma initial
-- Tables : investors, events, documents. RLS + triggers.
-- La table notifications (intégration Yao) arrive dans une migration dédiée (étape 4).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create type public.investor_status as enum ('pending', 'approved', 'blocked');

create table public.investors (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  entity text,
  email_domain text generated always as (split_part(email, '@', 2)) stored,
  status public.investor_status not null default 'pending',
  tags text[] not null default '{}',
  ref text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz
);

create table public.events (
  id bigint generated always as identity primary key,
  -- nullable : les page_view anonymes avec ?ref= (liens personnalisés) n'ont pas d'investisseur
  investor_id uuid references public.investors (id) on delete cascade,
  session_id text,
  type text not null check (type in ('login', 'page_view', 'page_leave', 'docsend_click', 'cta_click')),
  path text,
  label text,
  duration_ms integer,
  scroll_depth integer check (scroll_depth between 0 and 100),
  ref text,
  created_at timestamptz not null default now()
);

create index events_investor_created_idx on public.events (investor_id, created_at desc);
create index events_created_idx on public.events (created_at desc);

create table public.documents (
  slug text primary key,
  title text not null,
  docsend_url text not null,
  visible_to_pending boolean not null default false,
  sort_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Crée la ligne investors quand l'email est validé par le magic link.
-- full_name / entity / ref arrivent via les métadonnées passées à signInWithOtp.
create or replace function public.handle_confirmed_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.investors (id, email, full_name, entity, ref)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'entity', ''),
    nullif(new.raw_user_meta_data ->> 'ref', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_confirmed
  after insert or update of email_confirmed_at on auth.users
  for each row
  when (new.email_confirmed_at is not null)
  execute function public.handle_confirmed_user();

-- Tient investors.last_seen_at à jour à chaque event.
create or replace function public.touch_investor_last_seen()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.investor_id is not null then
    update public.investors
      set last_seen_at = new.created_at
      where id = new.investor_id
        and (last_seen_at is null or last_seen_at < new.created_at);
  end if;
  return new;
end;
$$;

create trigger on_event_touch_last_seen
  after insert on public.events
  for each row
  execute function public.touch_investor_last_seen();

-- ---------------------------------------------------------------------------
-- RLS
-- Le rôle service (Yao, routes admin côté serveur) bypasse RLS par défaut.
-- ---------------------------------------------------------------------------

alter table public.investors enable row level security;
alter table public.events enable row level security;
alter table public.documents enable row level security;

-- Un investisseur lit uniquement sa propre ligne.
create policy investors_select_own on public.investors
  for select to authenticated
  using (id = (select auth.uid()));

-- Insert only sur events, uniquement rattaché à soi-même.
create policy events_insert_own on public.events
  for insert to authenticated
  with check (investor_id = (select auth.uid()));

-- Documents : approved voit tout, pending voit visible_to_pending, blocked ne voit rien.
create policy documents_select_by_status on public.documents
  for select to authenticated
  using (
    exists (
      select 1 from public.investors i
      where i.id = (select auth.uid())
        and (
          i.status = 'approved'
          or (i.status = 'pending' and documents.visible_to_pending)
        )
    )
  );
