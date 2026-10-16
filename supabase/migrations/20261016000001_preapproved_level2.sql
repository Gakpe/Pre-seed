-- Niveau 2 accordé d'avance.
--
-- Une adresse pré-approuvée peut aussi recevoir le niveau 2 avant même son
-- inscription : son compte est alors créé approuvé et avec le niveau 2 ouvert,
-- sans passer par la manifestation d'intérêt. Premier usage : l'équipe Newform
-- (16/10/2026). Pour un compte qui existe déjà, le niveau 2 s'ouvre depuis
-- l'admin, comme avant.

begin;

alter table public.preapproved_investors
  add column level2_access boolean not null default false;

-- Même fonction qu'au 25/09/2026 (pré-approbation), le niveau 2 en plus.
create or replace function public.handle_confirmed_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pre public.preapproved_investors%rowtype;
begin
  select * into v_pre
  from public.preapproved_investors
  where email = lower(btrim(new.email));

  insert into public.investors (id, email, full_name, entity, ref, status, level2_access)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'entity', ''),
    nullif(new.raw_user_meta_data ->> 'ref', ''),
    (case when v_pre.email is not null then 'approved' else 'pending' end)::public.investor_status,
    coalesce(v_pre.level2_access, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

commit;
