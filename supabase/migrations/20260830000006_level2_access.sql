-- Découple l'accès niveau 2 de la manifestation d'intérêt :
-- level2_access est activé automatiquement quand un intérêt est manifesté,
-- et peut être donné/retiré manuellement par un admin depuis /admin.

alter table public.investors add column level2_access boolean not null default false;

update public.investors set level2_access = true where interest_expressed_at is not null;

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
  );
