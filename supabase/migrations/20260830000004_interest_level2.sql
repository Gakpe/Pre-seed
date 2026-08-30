-- Data room à deux niveaux + manifestation d'intérêt.
-- Niveau 1 : accessible à tout investisseur approuvé.
-- Niveau 2 (cap table, contrats, documents clés) : débloqué après avoir
-- manifesté un intérêt pour une tranche.

alter table public.documents
  add column access_level integer not null default 1 check (access_level in (1, 2));

alter table public.investors
  add column interest_expressed_at timestamptz,
  add column interest_tranche text;

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
            and (documents.access_level = 1 or i.interest_expressed_at is not null)
          )
          or (
            i.status = 'pending'
            and documents.visible_to_pending
            and documents.access_level = 1
          )
        )
    )
  );
