-- Langue par défaut d'un investisseur.
--
-- Le portail s'ouvre en français, sauf si la personne a choisi une langue
-- (cookie minah_locale, posé par le sélecteur FR / EN). Cette table donne une
-- langue par défaut à une adresse, avant même son inscription : l'équipe la
-- fixe depuis l'admin, ou Yao d'après la langue des échanges mail. Le choix
-- fait par la personne sur le site garde toujours la main.
--
-- Clé par email, comme les pré-approuvés et les onboardings.

begin;

create table public.investor_locales (
  email text primary key check (email = lower(btrim(email))),
  locale text not null check (locale in ('fr', 'en')),
  source text not null default 'admin' check (source in ('admin', 'yao')),
  -- D'où vient le choix, en une ligne (« échanges mail en anglais »…).
  note text,
  updated_at timestamptz not null default now()
);

-- Aucune policy : lecture et écriture par le serveur (service role) seulement.
alter table public.investor_locales enable row level security;

-- Écriture en lot pour Yao et l'admin : une langue pour une ou plusieurs
-- adresses. Les adresses mal formées sont renvoyées, pas écrites.
create or replace function public.set_investor_locale(
  p_emails text[],
  p_locale text,
  p_source text,
  p_note text default null
)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_shape constant text := '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$';
  v_emails text[];
  v_rejected text[];
begin
  if p_locale is null or p_locale not in ('fr', 'en') then
    raise exception 'langue inconnue : %', p_locale;
  end if;
  if p_source is null or p_source not in ('admin', 'yao') then
    raise exception 'source inconnue : %', p_source;
  end if;

  select
    coalesce(array_agg(distinct e) filter (where e ~ v_shape), '{}'),
    coalesce(array_agg(distinct raw) filter (where e !~ v_shape and e <> ''), '{}')
  into v_emails, v_rejected
  from (
    select raw, lower(btrim(raw, E' \t\r\n<>')) as e
    from unnest(coalesce(p_emails, '{}')) as raw
  ) s;

  insert into investor_locales (email, locale, source, note, updated_at)
  select e, p_locale, p_source, nullif(btrim(p_note), ''), now()
  from unnest(v_emails) e
  on conflict (email) do update set
    locale = excluded.locale,
    source = excluded.source,
    note = excluded.note,
    updated_at = now();

  return jsonb_build_object(
    'set', to_jsonb(array(select e from unnest(v_emails) e order by e)),
    'locale', p_locale,
    'rejected', to_jsonb(v_rejected)
  );
end;
$$;

revoke all on function public.set_investor_locale(text[], text, text, text) from public, anon, authenticated;
grant execute on function public.set_investor_locale(text[], text, text, text) to service_role;

commit;
