-- File de notifications pour Yao (poll toutes les minutes, cf docs/yao.md).
-- Les triggers ci-dessous alimentent la file ; le débounce est géré ici même :
-- une alerte "bavarde" (first_login, long_session, return_visit) max par
-- investisseur toutes les 30 minutes. signup, docsend_click et interest
-- passent toujours.

create table public.notifications (
  id bigint generated always as identity primary key,
  investor_id uuid references public.investors (id) on delete cascade,
  kind text not null check (kind in ('signup', 'first_login', 'docsend_click', 'long_session', 'return_visit', 'interest')),
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index notifications_unprocessed_idx on public.notifications (id) where processed_at is null;

-- Aucune policy : table réservée au service role (Yao, admin serveur).
alter table public.notifications enable row level security;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.investor_label(inv public.investors)
returns text
language sql
immutable
as $$
  select coalesce(inv.full_name, inv.email)
    || coalesce(' (' || inv.entity || ')', '');
$$;

create or replace function public.queue_notification(
  p_investor_id uuid,
  p_kind text,
  p_message text,
  p_payload jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_kind in ('first_login', 'long_session', 'return_visit') and exists (
    select 1 from notifications n
    where n.investor_id = p_investor_id
      and n.kind in ('first_login', 'long_session', 'return_visit')
      and n.created_at > now() - interval '30 minutes'
  ) then
    return;
  end if;

  insert into notifications (investor_id, kind, message, payload)
  values (p_investor_id, p_kind, p_message, p_payload);
end;
$$;

-- ---------------------------------------------------------------------------
-- Nouvelle inscription
-- ---------------------------------------------------------------------------

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
    '📥 Nouvelle inscription : ' || investor_label(new)
      || ' — @' || coalesce(new.email_domain, '?')
      || coalesce(' · ref ' || new.ref, ''),
    jsonb_build_object('email', new.email, 'entity', new.entity, 'ref', new.ref)
  );
  return new;
end;
$$;

create trigger on_investor_signup
  after insert on public.investors
  for each row execute function public.notify_signup();

-- ---------------------------------------------------------------------------
-- Manifestation d'intérêt (débloque le niveau 2 de la data room)
-- ---------------------------------------------------------------------------

create or replace function public.notify_interest()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.interest_expressed_at is null and new.interest_expressed_at is not null then
    perform queue_notification(
      new.id,
      'interest',
      '🎯 ' || investor_label(new) || ' manifeste un intérêt : ' || coalesce(new.interest_tranche, '?'),
      jsonb_build_object('tranche', new.interest_tranche)
    );
  end if;
  return new;
end;
$$;

create trigger on_investor_interest
  after update of interest_expressed_at on public.investors
  for each row execute function public.notify_interest();

-- ---------------------------------------------------------------------------
-- Events : premier login, retour après 7 jours, clic DocSend, session > 5 min.
-- Nommé pour s'exécuter AVANT on_event_touch_last_seen (ordre alphabétique),
-- afin de lire last_seen_at avant sa mise à jour.
-- ---------------------------------------------------------------------------

create or replace function public.notify_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.investors;
  v_total bigint;
begin
  if new.investor_id is null then
    return new;
  end if;

  select * into inv from investors where id = new.investor_id;
  if inv.id is null then
    return new;
  end if;

  if new.type = 'login' then
    if (select count(*) from events e where e.investor_id = new.investor_id and e.type = 'login') = 1 then
      perform queue_notification(inv.id, 'first_login', '👋 Premier login : ' || investor_label(inv));
    end if;
  end if;

  if new.type in ('login', 'page_view')
     and inv.last_seen_at is not null
     and inv.last_seen_at < now() - interval '7 days' then
    perform queue_notification(
      inv.id,
      'return_visit',
      '↩️ ' || investor_label(inv) || ' de retour après '
        || extract(day from now() - inv.last_seen_at)::int || ' jours'
    );
  end if;

  if new.type = 'docsend_click' then
    perform queue_notification(
      inv.id,
      'docsend_click',
      '📄 ' || investor_label(inv) || ' a ouvert « ' || coalesce(new.label, 'document') || ' »',
      jsonb_build_object('label', new.label, 'path', new.path)
    );
  end if;

  if new.type = 'page_leave' and new.session_id is not null then
    select coalesce(sum(duration_ms), 0) into v_total
    from events e
    where e.session_id = new.session_id
      and e.investor_id = new.investor_id
      and e.type = 'page_leave';

    if v_total >= 300000 and not exists (
      select 1 from notifications n
      where n.kind = 'long_session' and n.payload ->> 'session_id' = new.session_id
    ) then
      perform queue_notification(
        inv.id,
        'long_session',
        '⏱ ' || investor_label(inv) || ' : ' || round(v_total / 60000.0) || ' min sur l''espace investisseurs',
        jsonb_build_object('session_id', new.session_id, 'duration_ms', v_total)
      );
    end if;
  end if;

  return new;
end;
$$;

create trigger on_event_notify
  after insert on public.events
  for each row execute function public.notify_event();
