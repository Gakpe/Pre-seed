-- Intérêt pour Kupanda (l'obligation), distinct de l'intérêt pour le tour
-- pre-seed qui ouvre le niveau 2. Une ligne par manifestation : un investisseur
-- peut revenir avec une autre tranche, on garde l'historique et l'admin lit la
-- plus récente. Alerte Yao à chaque insertion.

create table public.kupanda_interests (
  id bigint generated always as identity primary key,
  investor_id uuid not null references public.investors (id) on delete cascade,
  tranche text not null,
  created_at timestamptz not null default now()
);

create index kupanda_interests_investor_idx
  on public.kupanda_interests (investor_id, created_at desc);

-- Aucune policy : écriture par le serveur (service role), lecture admin.
alter table public.kupanda_interests enable row level security;

alter table public.notifications drop constraint notifications_kind_check;
alter table public.notifications add constraint notifications_kind_check
  check (kind in ('signup', 'first_login', 'docsend_click', 'long_session', 'return_visit', 'interest', 'question', 'kupanda_interest'));

create or replace function public.notify_kupanda_interest()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.investors;
begin
  select * into inv from investors where id = new.investor_id;
  if inv.id is not null then
    perform queue_notification(
      new.investor_id,
      'kupanda_interest',
      '💶 ' || investor_label(inv) || ' est intéressé par Kupanda : ' || new.tranche,
      jsonb_build_object('tranche', new.tranche, 'kupanda_interest_id', new.id)
    );
  end if;
  return new;
end;
$$;

create trigger on_kupanda_interest_created
  after insert on public.kupanda_interests
  for each row execute function public.notify_kupanda_interest();
